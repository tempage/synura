# Benvenuto in Synura!

## Cos'è Synura?
Synura è un'applicazione versatile che ti permette di navigare contenuti da varie fonti utilizzando potenti mini-app chiamate "estensioni". Immaginalo come un browser, ma invece di siti web, usi le estensioni per ottenere contenuti in un formato di app nativa pulito.

## Concetti Fondamentali per gli Utenti

*   **Scoperta Estensioni**: Inserisci un dominio (es. `example.com` o `https://example.com`) per recuperare automaticamente il file `synura.js` da quel dominio. Se non viene fornito alcun protocollo, viene utilizzato `https://` per impostazione predefinita. Questo è il modo principale per installare estensioni dai loro siti web ufficiali.
*   **Installazione Diretta**: Inserisci un URL completo (es. `https://raw.githubusercontent.com/user/repo/main/synura.js`) per installare uno script di estensione specifico. **Nota di Sicurezza**: Questo metodo è limitato ai domini fidati (come GitHub, GitLab, ecc.) per prevenire l'esecuzione di codice dannoso. Non usarlo per domini generici.
*   **Convalida Whitelist**: Le installazioni dirette tramite URL sono convalidate contro una whitelist di domini consentiti per sicurezza. La scoperta del dominio bypassa questo controllo per consentire l'esplorazione.
*   **Estensioni**: Questi sono piccoli plugin che recuperano e visualizzano contenuti. Ad esempio, potresti avere un'estensione per un sito di notizie, una piattaforma video o un feed di social media. Puoi installare nuove estensioni per espandere ciò che puoi fare con Synura.
*   **Runtime**: Quando apri un'estensione, questa viene eseguita in un "runtime". Puoi avere più runtime aperti contemporaneamente, proprio come avere più schede in un browser web. Ogni runtime è un'istanza separata di un'estensione. Puoi passare da uno all'altro e persino avere più runtime per la stessa estensione.
*   **Segnalibri**: Hai trovato qualcosa di interessante? Puoi aggiungere un segnalibro alla vista corrente per salvarla per dopo. Un segnalibro salva lo stato esatto della vista, in modo da poterci tornare in qualsiasi momento.

## Muoversi nell'App

### La Schermata Principale
La schermata principale dell'app è dove gestisci i tuoi runtime. La barra superiore (app bar) è il tuo strumento di navigazione principale.

### La Barra dell'App

La barra dell'app ha diverse icone:

*   **`+` (Aggiungi)**: Tocca qui per aprire un nuovo runtime. Puoi scegliere un'estensione installata o inserire un dominio di un sito web per installarne una nuova.
*   **Menu a Discesa (centro)**: Mostra il runtime attualmente attivo. Toccalo per vedere un elenco di tutti i tuoi runtime aperti e passare da uno all'altro. Puoi anche scorrere a sinistra o a destra sul menu a discesa per cambiare rapidamente.
*   **`X` (Chiudi)**: Chiude il runtime corrente.
*   **`☆` (Aggiungi Segnalibro)**: Tocca qui per salvare la vista corrente nei tuoi segnalibri.
*   **`🔖` (Segnalibri)**: Ti porta al tuo elenco di segnalibri salvati.
*   **`⚙️` (Impostazioni)**: Apre la schermata delle impostazioni, dove puoi personalizzare Synura.

Se lo schermo è troppo stretto, queste opzioni saranno raggruppate in un menu a tre punti sulla destra.

### Segnalibri
La schermata dei segnalibri mostra tutte le tue viste salvate.

*   **Istantanea Vista**: Toccando un segnalibro si apre un'**istantanea nella cache** della pagina così com'era quando l'hai salvata. Questo è ottimo per consultare rapidamente informazioni senza bisogno di una connessione internet.
*   **Ripristina Vista**: Per interagire di nuovo con la pagina (es. cliccare link, aggiornare dati), cerca l'**icona di ripristino**. Toccando questa si riconnetterà all'estensione e riporterà in vita la vista in un nuovo runtime.

## Impostazioni (`⚙️`)

La schermata delle impostazioni ti consente di mettere a punto quasi ogni aspetto della tua esperienza Synura.

### Estensioni
*   **Installa Nuove Estensioni**: Tocca il pulsante **`+`** nella barra dell'app e inserisci il dominio del sito web (es. `https://example.com`). Se il sito supporta Synura, l'estensione verrà automaticamente scoperta e installata.
*   **Gestisci Estensioni**: Tocca **Gestisci** per vedere un elenco delle tue estensioni installate, dove puoi aggiornarle o rimuoverle.

### Aspetto
*   **Regola Densità Contenuto**: Usa il cursore per far apparire il contenuto più spaziato o più compatto. Vedrai un'anteprima dal vivo di come influisce su elenchi e schede.
*   **Tema Colore**: Personalizza l'aspetto dell'app scegliendo tra schemi di colori **Chiaro**, **Scuro** e **Monokai**.
*   **Peso Carattere**: Regola lo spessore del testo secondo le tue preferenze (es. leggero, regolare, grassetto).
*   **Lingua**: Imposta la lingua dell'applicazione. Puoi scegliere una lingua specifica o lasciarla seguire l'impostazione predefinita del tuo sistema.

### Comportamento
*   **Timeout Rete**: Imposta quanto tempo l'app deve attendere una risposta da una richiesta di rete, da 1 a 60 secondi.
*   **Impostazioni Proxy**: Configura un server proxy per le richieste di rete.
*   **Impostazioni Cache**: Gestisci la cache dell'applicazione, inclusa la cancellazione dei dati nella cache per liberare spazio.
*   **Animazione GIF**: Controlla come vengono riprodotte le GIF animate: **Off** (immagine statica), **Una volta** (riproduci una volta) o **Loop** (riproduci continuamente).

### Video & Audio
*   **Autoplay Video**: Un interruttore per controllare se i video iniziano a essere riprodotti automaticamente quando appaiono sullo schermo.
*   **Riproduzione Video in Background**: Abilita questo per continuare a sentire l'audio di un video anche dopo aver navigato altrove o essere passati a un'altra app.
*   **Mixa con Altri**: Consenti all'audio di Synura di essere riprodotto contemporaneamente all'audio di altre app.
*   **Ore DVR Riproduzione Live**: Per i live stream, scegli quante ore di trasmissione mantenere disponibili per cercare all'indietro (da 0 a 6 ore).

### Privacy & Sicurezza
*   **Gestisci Impostazioni**: Configura varie opzioni di privacy e sicurezza per controllare quali dati vengono archiviati e condivisi.

### Informazioni
*   **Licenze Open Source**: Visualizza le licenze del software open source che aiuta a far funzionare Synura.

---
*Questo documento è per gli utenti finali. Per la documentazione per sviluppatori, consulta [Per Iniziare](getting_started.md), il [Riferimento API](api_reference.md) e [Esempi](examples.md).*