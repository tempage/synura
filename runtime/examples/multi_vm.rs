//! A host owns each VM on a worker thread and sends owned messages to it.
//!
//! Run with `cargo run -p synura-runtime --example multi_vm`.
use std::sync::mpsc::{self, Receiver, SyncSender};
use std::thread::{self, JoinHandle};

use synura_runtime::rquickjs::{promise::MaybePromise, CatchResultExt};
use synura_runtime::{CancellationToken, NetworkPolicy, Vm, VmConfig};

type Reply = Result<String, String>;

struct Command {
    expression: String,
    reply: SyncSender<Reply>,
}

struct ExtensionWorker {
    commands: Option<SyncSender<Command>>,
    cancellation: CancellationToken,
    thread: Option<JoinHandle<()>>,
}

impl ExtensionWorker {
    fn spawn(name: &str, policy: NetworkPolicy) -> Result<Self, String> {
        // Bound the host command queue independently from the VM's native queues.
        let (commands, incoming) = mpsc::sync_channel::<Command>(8);
        let (ready, initialized) = mpsc::sync_channel(1);
        let thread = thread::Builder::new()
            .name(name.to_owned())
            .spawn(move || {
                // Vm is intentionally created here: it never crosses threads.
                let vm = match Vm::new(VmConfig::default()).and_then(|vm| {
                    vm.bind_network(policy)?;
                    Ok(vm)
                }) {
                    Ok(vm) => vm,
                    Err(error) => {
                        let _ = ready.send(Err(error));
                        return;
                    }
                };
                if ready.send(Ok(vm.cancellation())).is_err() {
                    return;
                }
                while let Ok(command) = incoming.recv() {
                    let result = evaluate(&vm, &command.expression);
                    let _ = command.reply.send(result);
                    if vm.cancellation().is_cancelled() {
                        break;
                    }
                }
                // Vm drops on its owner thread, cancelling HTTP and releasing
                // JavaScript roots before the context and runtime disappear.
            })
            .map_err(|error| error.to_string())?;
        let cancellation = initialized.recv().map_err(|error| error.to_string())??;
        Ok(Self {
            commands: Some(commands),
            cancellation,
            thread: Some(thread),
        })
    }

    fn submit(&self, expression: &str) -> Result<Receiver<Reply>, String> {
        let (reply, result) = mpsc::sync_channel(1);
        self.commands
            .as_ref()
            .ok_or("worker is closed")?
            .send(Command {
                expression: expression.to_owned(),
                reply,
            })
            .map_err(|error| error.to_string())?;
        Ok(result)
    }
}

impl Drop for ExtensionWorker {
    fn drop(&mut self) {
        // Revocation can interrupt JavaScript or an awaited native operation.
        // It does not forcibly interrupt an already-running BoringSSL call.
        self.cancellation.cancel();
        self.commands.take();
        if let Some(thread) = self.thread.take() {
            let _ = thread.join();
        }
    }
}

fn evaluate(vm: &Vm, expression: &str) -> Reply {
    vm.begin_turn()?;
    let source = format!("Promise.resolve(({expression})).then(JSON.stringify)");
    let result = vm.context().with(|ctx| {
        ctx.eval::<MaybePromise, _>(source)
            .and_then(|value| vm.finish::<String>(&ctx, value))
            .catch(&ctx)
            .map_err(|error| error.to_string())
    });
    // Explicitly submitted background work belongs to this host command too.
    // An interactive host can instead pump with Vm::poll between commands.
    let drained = vm.drain();
    result.and_then(|result| drained.map(|()| result))
}

fn receive(result: Receiver<Reply>) -> Reply {
    result.recv().map_err(|error| error.to_string())?
}

fn main() -> Result<(), String> {
    // No domain grants: neither VM can use the network in this example.
    let first = ExtensionWorker::spawn("extension-one", NetworkPolicy::default())?;
    let second = ExtensionWorker::spawn("extension-two", NetworkPolicy::default())?;
    let one = first.submit(
        "(async () => { globalThis.owner = 'one'; const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(owner)); return {owner, bytes:hash.byteLength}; })()",
    )?;
    let two = second.submit(
        "(async () => { globalThis.owner = 'two'; const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(owner)); return {owner, bytes:hash.byteLength}; })()",
    )?;
    println!("first: {}", receive(one)?);
    println!("second: {}", receive(two)?);

    drop(first);
    println!(
        "second after first closes: {}",
        receive(second.submit("({owner, alive:true})")?)?
    );
    Ok(())
}
