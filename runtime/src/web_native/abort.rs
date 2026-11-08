use super::*;
use std::marker::PhantomData;
use std::rc::{Rc, Weak};

const SIGNAL_DEPTH_LIMIT: usize = 256;
const SIGNAL_REFERENCE_LIMIT: usize = 4096;
const VM_SIGNAL_REFERENCE_LIMIT: usize = 65536;
struct SignalBudget {
    references: Rc<Cell<usize>>,
    work: Rc<Cell<usize>>,
}
struct AbortWorkAllocation {
    used: Rc<Cell<usize>>,
    count: usize,
}
impl AbortWorkAllocation {
    fn new(ctx: &Ctx<'_>, used: Rc<Cell<usize>>, count: usize) -> Result<Self> {
        if used.get().saturating_add(count) > 131072 {
            return Err(Exception::throw_range(
                ctx,
                "Abort dispatch work exceeds VM limit",
            ));
        }
        used.set(used.get() + count);
        Ok(Self { used, count })
    }
}
impl Drop for AbortWorkAllocation {
    fn drop(&mut self) {
        self.used.set(self.used.get().saturating_sub(self.count));
    }
}
unsafe impl<'js> JsLifetime<'js> for SignalBudget {
    type Changed<'to> = Self;
}

#[derive(Clone)]
struct Listener<'js> {
    callback: Value<'js>,
    capture: bool,
    once: bool,
}

// QuickJS owns the object. Its finalizer clears this non-owning handle before
// releasing any fields, so a dependency does not keep an unused signal alive.
struct WeakSignal<'js> {
    value: Weak<Cell<Option<qjs::JSValue>>>,
    lifetime: PhantomData<Class<'js, Signal<'js>>>,
}
impl<'js> WeakSignal<'js> {
    fn new(signal: &Class<'js, Signal<'js>>) -> Self {
        Self {
            value: Rc::downgrade(&signal.borrow().weak_value),
            lifetime: PhantomData,
        }
    }
    fn upgrade(&self, ctx: &Ctx<'js>) -> Option<Class<'js, Signal<'js>>> {
        let raw = self.value.upgrade()?.get()?;
        // All signal access and finalization happens on the VM owner thread.
        // A present value is still alive, and duplication roots it before any
        // operation can run GC. The handle can only be created from Signal.
        let value =
            unsafe { Value::from_raw(ctx.clone(), qjs::JS_DupValue(ctx.as_raw().as_ptr(), raw)) };
        value.into_object()?.into_class::<Signal>().ok()
    }
    fn alive(&self) -> bool {
        self.value
            .upgrade()
            .is_some_and(|value| value.get().is_some())
    }
}

struct Dependency {
    references: Rc<Cell<usize>>,
    budget: Rc<Cell<usize>>,
    active: Cell<bool>,
}
impl Dependency {
    fn release(&self) {
        if self.active.replace(false) && self.references.get() != 0 {
            self.references.set(self.references.get() - 1);
            self.budget.set(self.budget.get().saturating_sub(1));
        }
    }
}
struct Follower<'js> {
    signal: WeakSignal<'js>,
    // Listeners must still fire when the script drops its direct reference.
    observed: Option<Class<'js, Signal<'js>>>,
    dependency: Rc<Dependency>,
}
struct Parent<'js> {
    signal: Class<'js, Signal<'js>>,
    followers: Weak<RefCell<Vec<Follower<'js>>>>,
    dependency: Rc<Dependency>,
}
impl Drop for Parent<'_> {
    fn drop(&mut self) {
        self.dependency.release();
        // The source may already be finalized during cyclic GC. Access only
        // the Rust-owned list, never its JavaScript class, from this finalizer.
        if let Some(followers) = self.followers.upgrade() {
            if let Ok(mut followers) = followers.try_borrow_mut() {
                followers.retain(|follower| !Rc::ptr_eq(&follower.dependency, &self.dependency));
                if followers.is_empty() {
                    *followers = Vec::new();
                }
            }
        }
    }
}
pub(super) struct Signal<'js> {
    budget: Rc<Cell<usize>>,
    work_budget: Rc<Cell<usize>>,
    references: Rc<Cell<usize>>,
    weak_value: Rc<Cell<Option<qjs::JSValue>>>,
    depth: Cell<usize>,
    aborted: Cell<bool>,
    observed: Cell<bool>,
    reason: RefCell<Value<'js>>,
    onabort: RefCell<Value<'js>>,
    listeners: RefCell<Vec<Listener<'js>>>,
    followers: Rc<RefCell<Vec<Follower<'js>>>>,
    parents: RefCell<Vec<Parent<'js>>>,
    cancellers: RefCell<Vec<Function<'js>>>,
}
impl Drop for Signal<'_> {
    fn drop(&mut self) {
        self.weak_value.set(None);
        self.budget
            .set(self.budget.get().saturating_sub(self.references.replace(0)));
    }
}
impl<'js> Trace<'js> for Signal<'js> {
    fn trace<'a>(&self, tracer: Tracer<'a, 'js>) {
        self.reason.borrow().trace(tracer);
        self.onabort.borrow().trace(tracer);
        for listener in self.listeners.borrow().iter() {
            listener.callback.trace(tracer);
        }
        for follower in self.followers.borrow().iter() {
            follower.observed.trace(tracer);
        }
        for parent in self.parents.borrow().iter() {
            parent.signal.trace(tracer);
        }
        for cancel in self.cancellers.borrow().iter() {
            cancel.trace(tracer);
        }
    }
}
unsafe impl<'js> JsLifetime<'js> for Signal<'js> {
    type Changed<'to> = Signal<'to>;
}
impl<'js> Signal<'js> {
    fn reserve_reference(&self, ctx: &Ctx<'_>) -> Result<()> {
        if self.references.get() >= SIGNAL_REFERENCE_LIMIT
            || self.budget.get() >= VM_SIGNAL_REFERENCE_LIMIT
        {
            return Err(Exception::throw_range(
                ctx,
                "AbortSignal references exceed VM limit",
            ));
        }
        self.references.set(self.references.get() + 1);
        self.budget.set(self.budget.get() + 1);
        Ok(())
    }
    fn release_references(&self, count: usize) {
        self.references
            .set(self.references.get().saturating_sub(count));
        self.budget.set(self.budget.get().saturating_sub(count));
    }

    pub(super) fn reason(&self) -> Option<Value<'js>> {
        self.aborted.get().then(|| self.reason.borrow().clone())
    }
}
pub(super) fn create<'js>(ctx: &Ctx<'js>) -> Result<Class<'js, Signal<'js>>> {
    let signal = Class::instance(
        ctx.clone(),
        Signal {
            budget: ctx
                .userdata::<SignalBudget>()
                .expect("installed signal budget")
                .references
                .clone(),
            work_budget: ctx
                .userdata::<SignalBudget>()
                .expect("installed signal budget")
                .work
                .clone(),
            references: Rc::new(Cell::new(0)),
            weak_value: Rc::new(Cell::new(None)),
            depth: Cell::new(0),
            aborted: Cell::new(false),
            observed: Cell::new(false),
            reason: RefCell::new(Value::new_undefined(ctx.clone())),
            onabort: RefCell::new(Value::new_null(ctx.clone())),
            listeners: RefCell::new(Vec::new()),
            followers: Rc::new(RefCell::new(Vec::new())),
            parents: RefCell::new(Vec::new()),
            cancellers: RefCell::new(Vec::new()),
        },
    )?;
    signal
        .borrow()
        .weak_value
        .set(Some(signal.as_value().as_raw()));
    Ok(signal)
}
pub(super) fn from_value<'js>(
    ctx: &Ctx<'js>,
    value: Value<'js>,
) -> Result<Class<'js, Signal<'js>>> {
    value
        .as_object()
        .and_then(|object| object.as_class::<Signal>().cloned())
        .ok_or_else(|| type_error(ctx, "Expected AbortSignal"))
}
pub(super) fn follow<'js>(
    ctx: &Ctx<'js>,
    parent: Class<'js, Signal<'js>>,
    child: Class<'js, Signal<'js>>,
) -> Result<()> {
    let reason = parent.borrow().reason();
    if let Some(reason) = reason {
        abort(ctx, &child, reason)
    } else {
        let state = parent.borrow();
        let depth = state.depth.get().saturating_add(1);
        if depth > SIGNAL_DEPTH_LIMIT {
            return Err(Exception::throw_range(
                ctx,
                "AbortSignal following depth exceeds VM limit",
            ));
        }
        child
            .borrow()
            .depth
            .set(child.borrow().depth.get().max(depth));
        // Reclaim dead weak entries before adding another dependency. Their
        // budgets were already returned by the dependent signal's finalizer.
        state
            .followers
            .borrow_mut()
            .retain(|follower| follower.dependency.active.get() && follower.signal.alive());
        if !child
            .borrow()
            .parents
            .borrow()
            .iter()
            .any(|source| source.signal == parent)
        {
            state.reserve_reference(ctx)?;
            let dependency = Rc::new(Dependency {
                references: state.references.clone(),
                budget: state.budget.clone(),
                active: Cell::new(true),
            });
            state.followers.borrow_mut().push(Follower {
                signal: WeakSignal::new(&child),
                observed: None,
                dependency: dependency.clone(),
            });
            child.borrow().parents.borrow_mut().push(Parent {
                signal: parent.clone(),
                followers: Rc::downgrade(&state.followers),
                dependency,
            });
        }
        Ok(())
    }
}

fn retain_observed<'js>(signal: &Class<'js, Signal<'js>>) {
    // An observed leaf also keeps every intermediate source reachable from its
    // roots. Updating only its direct parent leaves a collectible isolated
    // cycle for nested AbortSignal.any() expressions.
    let mut pending = vec![signal.clone()];
    while let Some(signal) = pending.pop() {
        let state = signal.borrow();
        let observed = !state.listeners.borrow().is_empty()
            || state.onabort.borrow().is_function()
            || state
                .followers
                .borrow()
                .iter()
                .any(|follower| follower.observed.is_some());
        if state.observed.replace(observed) == observed {
            continue;
        }
        for parent in state.parents.borrow().iter() {
            for follower in parent.signal.borrow().followers.borrow_mut().iter_mut() {
                if Rc::ptr_eq(&follower.dependency, &parent.dependency) {
                    follower.observed = observed.then(|| signal.clone());
                    break;
                }
            }
            pending.push(parent.signal.clone());
        }
    }
}

fn detach_parents<'js>(signal: &Class<'js, Signal<'js>>) {
    let parents = std::mem::take(&mut *signal.borrow().parents.borrow_mut());
    for parent in parents {
        parent
            .signal
            .borrow()
            .followers
            .borrow_mut()
            .retain(|follower| !Rc::ptr_eq(&follower.dependency, &parent.dependency));
        retain_observed(&parent.signal);
    }
}
pub(super) fn check<'js>(ctx: &Ctx<'js>, signal: &Class<'js, Signal<'js>>) -> Result<()> {
    if let Some(reason) = signal.borrow().reason() {
        Err(ctx.throw(reason))
    } else {
        Ok(())
    }
}
pub(super) fn add_canceller<'js>(
    signal: &Class<'js, Signal<'js>>,
    cancel: Function<'js>,
) -> Result<()> {
    if signal.borrow().aborted.get() {
        cancel.call::<_, ()>(())
    } else {
        let state = signal.borrow();
        state.reserve_reference(cancel.ctx())?;
        state.cancellers.borrow_mut().push(cancel);
        Ok(())
    }
}
pub(super) fn clear_cancellers<'js>(signal: &Class<'js, Signal<'js>>) {
    let state = signal.borrow();
    let mut cancellers = state.cancellers.borrow_mut();
    state.release_references(cancellers.len());
    *cancellers = Vec::new();
}
fn swallow(ctx: &Ctx<'_>, result: Result<()>) {
    if matches!(result, Err(Error::Exception)) {
        let _ = ctx.catch();
    }
}
// A long following chain must not recurse on the native stack. Dispatch tasks
// preserve child-before-parent delivery while each signal is marked once.
fn abort<'js>(ctx: &Ctx<'js>, signal: &Class<'js, Signal<'js>>, reason: Value<'js>) -> Result<()> {
    if signal.borrow().aborted.get() {
        return Ok(());
    }
    let reason = if reason.is_undefined() {
        let _ = dom_error(ctx, "AbortError", "The operation was aborted");
        ctx.catch()
    } else {
        reason
    };
    enum Task<'js> {
        Enter(Class<'js, Signal<'js>>),
        Dispatch(
            Class<'js, Signal<'js>>,
            Vec<Listener<'js>>,
            Value<'js>,
            AbortWorkAllocation,
        ),
    }
    let mut tasks = vec![Task::Enter(signal.clone())];
    while let Some(task) = tasks.pop() {
        let (signal, listeners, onabort, _work) = match task {
            Task::Enter(signal) => {
                let (listeners, followers, cancellers, onabort, work) = {
                    let state = signal.borrow();
                    if state.aborted.get() {
                        continue;
                    }
                    let count = state.listeners.borrow().len()
                        + state.followers.borrow().len()
                        + state.cancellers.borrow().len()
                        + 3;
                    let work = AbortWorkAllocation::new(ctx, state.work_budget.clone(), count)?;
                    state.aborted.set(true);
                    *state.reason.borrow_mut() = reason.clone();
                    let listeners = state.listeners.borrow().clone();
                    let once = listeners.iter().filter(|listener| listener.once).count();
                    {
                        let mut retained = state.listeners.borrow_mut();
                        retained.retain(|listener| !listener.once);
                        retained.shrink_to_fit();
                    }
                    let followers = std::mem::take(&mut *state.followers.borrow_mut());
                    let cancellers = std::mem::take(&mut *state.cancellers.borrow_mut());
                    state.release_references(once + cancellers.len());
                    let onabort = state.onabort.borrow().clone();
                    (listeners, followers, cancellers, onabort, work)
                };
                detach_parents(&signal);
                for cancel in cancellers {
                    swallow(ctx, cancel.call(()));
                }
                tasks.push(Task::Dispatch(signal, listeners, onabort, work));
                for follower in followers.into_iter().rev() {
                    follower.dependency.release();
                    if let Some(child) = follower.signal.upgrade(ctx) {
                        tasks.push(Task::Enter(child));
                    }
                }
                continue;
            }
            Task::Dispatch(signal, listeners, onabort, work) => (signal, listeners, onabort, work),
        };
        let event = Object::new(ctx.clone())?;
        own_property(&event, "type", "abort".into_js(ctx)?)?;
        own_property(&event, "target", signal.clone().into_js(ctx)?)?;
        own_property(&event, "currentTarget", signal.clone().into_js(ctx)?)?;
        for key in ["bubbles", "cancelable", "defaultPrevented"] {
            own_property(&event, key, false.into_js(ctx)?)?;
        }
        for listener in listeners {
            let result = if let Some(callback) = listener.callback.as_function() {
                callback.call((This(signal.clone()), event.clone()))
            } else if let Some(object) = listener.callback.as_object() {
                match object.get::<_, Function>("handleEvent") {
                    Ok(callback) => callback.call((This(object.clone()), event.clone())),
                    Err(error) => Err(error),
                }
            } else {
                Ok(())
            };
            swallow(ctx, result);
        }
        if let Some(callback) = onabort.as_function() {
            swallow(ctx, callback.call((This(signal), event)));
        }
    }
    Ok(())
}
fn options<'js>(ctx: &Ctx<'js>, value: Value<'js>) -> Result<(bool, bool)> {
    if value.is_bool() {
        return Ok((boolean(ctx, value)?, false));
    }
    let options = dictionary(ctx, value)?;
    Ok((
        boolean(ctx, member(ctx, &options, "capture")?)?,
        boolean(ctx, member(ctx, &options, "once")?)?,
    ))
}
impl<'js> JsClass<'js> for Signal<'js> {
    const NAME: &'static str = "AbortSignal";
    type Mutable = Readable;
    fn constructor(ctx: &Ctx<'js>) -> Result<Option<Constructor<'js>>> {
        Ok(Some(Constructor::new_class::<Self, _, _>(
            ctx.clone(),
            |ctx: Ctx<'js>| -> Result<Value<'js>> { Err(type_error(&ctx, "Illegal constructor")) },
        )?))
    }
    fn prototype(ctx: &Ctx<'js>) -> Result<Option<Object<'js>>> {
        let proto = prototype(ctx, Self::NAME)?;
        proto.prop(
            "aborted",
            Accessor::from(|this: This<Class<'js, Signal<'js>>>| this.0.borrow().aborted.get())
                .enumerable()
                .configurable(),
        )?;
        proto.prop(
            "reason",
            Accessor::from(|this: This<Class<'js, Signal<'js>>>| {
                this.0.borrow().reason.borrow().clone()
            })
            .enumerable()
            .configurable(),
        )?;
        proto.prop(
            "onabort",
            Accessor::from(|this: This<Class<'js, Signal<'js>>>| {
                this.0.borrow().onabort.borrow().clone()
            })
            .set(
                |ctx: Ctx<'js>, this: This<Class<'js, Signal<'js>>>, value: Value<'js>| {
                    *this.0.borrow().onabort.borrow_mut() = if value.is_function() {
                        value
                    } else {
                        Value::new_null(ctx)
                    };
                    retain_observed(&this.0);
                },
            )
            .enumerable()
            .configurable(),
        )?;
        proto.set(
            "throwIfAborted",
            Function::new(
                ctx.clone(),
                |ctx: Ctx<'js>, this: This<Class<'js, Signal<'js>>>| check(&ctx, &this.0),
            )?,
        )?;
        for (method, add) in [("addEventListener", true), ("removeEventListener", false)] {
            proto.set(
                method,
                Function::new(
                    ctx.clone(),
                    move |ctx: Ctx<'js>,
                          this: This<Class<'js, Signal<'js>>>,
                          args: Rest<Value<'js>>|
                          -> Result<()> {
                        required(&ctx, &args, 2)?;
                        let event = string(&ctx, args[0].clone())?;
                        let callback = args[1].clone();
                        let (capture, once) = options(&ctx, arg(&ctx, &args, 2))?;
                        if event != "abort" || callback.is_null() || callback.is_undefined() {
                            return Ok(());
                        }
                        if !callback.is_object() {
                            return Err(type_error(&ctx, "Expected an EventListener object"));
                        }
                        let state = this.0.borrow();
                        if add {
                            let exists = state.listeners.borrow().iter().any(|listener| {
                                listener.callback == callback && listener.capture == capture
                            });
                            if !exists {
                                state.reserve_reference(&ctx)?;
                                state.listeners.borrow_mut().push(Listener {
                                    callback,
                                    capture,
                                    once,
                                });
                            }
                        } else {
                            let mut listeners = state.listeners.borrow_mut();
                            let before = listeners.len();
                            listeners.retain(|listener| {
                                listener.callback != callback || listener.capture != capture
                            });
                            state.release_references(before - listeners.len());
                            listeners.shrink_to_fit();
                        }
                        retain_observed(&this.0);
                        Ok(())
                    },
                )?,
            )?;
        }
        Ok(Some(proto))
    }
}
struct Controller<'js> {
    signal: Class<'js, Signal<'js>>,
}
impl<'js> Trace<'js> for Controller<'js> {
    fn trace<'a>(&self, tracer: Tracer<'a, 'js>) {
        self.signal.trace(tracer);
    }
}
unsafe impl<'js> JsLifetime<'js> for Controller<'js> {
    type Changed<'to> = Controller<'to>;
}
impl<'js> JsClass<'js> for Controller<'js> {
    const NAME: &'static str = "AbortController";
    type Mutable = Readable;
    fn constructor(ctx: &Ctx<'js>) -> Result<Option<Constructor<'js>>> {
        Ok(Some(Constructor::new_class::<Self, _, _>(
            ctx.clone(),
            |ctx: Ctx<'js>| {
                Class::instance(
                    ctx.clone(),
                    Controller {
                        signal: create(&ctx)?,
                    },
                )
            },
        )?))
    }
    fn prototype(ctx: &Ctx<'js>) -> Result<Option<Object<'js>>> {
        let proto = prototype(ctx, Self::NAME)?;
        proto.prop(
            "signal",
            Accessor::from(|this: This<Class<'js, Controller<'js>>>| {
                this.0.borrow().signal.clone()
            })
            .enumerable()
            .configurable(),
        )?;
        proto.set(
            "abort",
            Function::new(
                ctx.clone(),
                |ctx: Ctx<'js>, this: This<Class<'js, Controller<'js>>>, args: Rest<Value<'js>>| {
                    abort(&ctx, &this.0.borrow().signal.clone(), arg(&ctx, &args, 0))
                },
            )?,
        )?;
        Ok(Some(proto))
    }
}
pub(super) fn install<'js>(ctx: &Ctx<'js>) -> Result<()> {
    ctx.store_userdata(SignalBudget {
        references: Rc::new(Cell::new(0)),
        work: Rc::new(Cell::new(0)),
    })
    .map_err(|_| type_error(ctx, "Signal budget unavailable"))?;
    Class::<Signal>::define(&ctx.globals())?;
    Class::<Controller>::define(&ctx.globals())?;
    let constructor: Function = ctx.globals().get("AbortSignal")?;
    constructor.set(
        "abort",
        Function::new(ctx.clone(), |ctx: Ctx<'js>, args: Rest<Value<'js>>| {
            let signal = create(&ctx)?;
            abort(&ctx, &signal, arg(&ctx, &args, 0))?;
            Ok::<_, Error>(signal)
        })?,
    )?;
    constructor.set(
        "any",
        Function::new(ctx.clone(), |ctx: Ctx<'js>, values: Value<'js>| {
            let signal = create(&ctx)?;
            for_each_sequence(&ctx, values, 65536, |value| {
                let parent = from_value(&ctx, value)?;
                follow(&ctx, parent, signal.clone())?;
                Ok(!signal.borrow().aborted.get())
            })?;
            Ok::<_, Error>(signal)
        })?,
    )?;
    constructor.set(
        "timeout",
        Function::new(ctx.clone(), |ctx: Ctx<'js>| -> Result<()> {
            Err(unsupported(
                &ctx,
                "AbortSignal.timeout requires host timers",
            ))
        })?,
    )?;
    Ok(())
}
