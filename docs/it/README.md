# Benvenuto in Synura!

## Cos'è Synura?
Synura è un'applicazione versatile che ti consente di navigare tra contenuti da varie fonti utilizzando potenti mini-app chiamate "estensioni". Pensalo come un browser, ma invece dei siti web, usi le estensioni per ottenere contenuti in un formato di app nativo e pulito.

## Concetti Fondamentali per gli Utenti

*   **Scoperta Estensioni**: Inserisci un dominio (es. `example.com` o `https://example.com`) per recuperare automaticamente il file `synura.js` da quel dominio. Se non viene fornito alcun protocollo, viene utilizzato `https://` per impostazione predefinita. Questo è il modo principale per installare estensioni dai loro siti web ufficiali.
*   **Installazione Diretta**: Inserisci un URL completo (es. `https://raw.githubusercontent.com/user/repo/main/synura.js`) per installare uno script di estensione specifico. **Nota di Sicurezza**: Questo metodo è limitato ai domini affidabili (come GitHub, GitLab, ecc.) per prevenire l'esecuzione di codice dannoso. Non usarlo per domini generici.
*   **Convalida Whitelist**: Le installazioni dirette tramite URL vengono convalidate rispetto a una whitelist di domini consentiti per sicurezza. La scoperta del dominio ignora questo controllo per consentire l'esplorazione.
*   **Estensioni**: Questi sono piccoli plugin che recuperano e visualizzano contenuti. Ad esempio, potresti avere un'estensione per un sito di notizie, una piattaforma video o un feed di social media. Puoi installare nuove estensioni per espandere ciò che puoi fare con Synura.
*   **Runtime**: Quando apri un'estensione, questa viene eseguita in un "runtime". Puoi avere più runtime aperti contemporaneamente, proprio come avere più schede in un browser web. Ogni runtime è un'istanza separata di un'estensione. Puoi passare da una all'altra e persino avere più runtime per la stessa estensione.
*   **Segnalibri**: Hai trovato qualcosa di interessante? Puoi aggiungere un segnalibro alla vista corrente per salvarla per dopo. Un segnalibro salva lo stato esatto della vista, in modo da poterci tornare in qualsiasi momento.

## Muoversi nell'App

### La Schermata Principale
La schermata principale dell'app è dove gestisci i tuoi runtime. La barra superiore (app bar) è il tuo strumento di navigazione principale.

### La Barra dell'App

La barra dell'app ha diverse icone che ti aiutano a navigare e gestire i tuoi contenuti. Alcune icone hanno **scorciatoie nascoste** accessibili con una pressione prolungata:

*   **`+` (Aggiungi)**:
    *   **Tocca**: Apri un nuovo runtime. Puoi scegliere un'estensione installata o inserire un dominio/URL di un sito web per installarne una nuova.
    *   **Pressione Prolungata**: Apri la schermata **Gestione Estensioni** per visualizzare i dettagli sulle tue estensioni installate.
*   **Menu A Discesa (centro)**: Visualizza il runtime attualmente attivo. Tocca per passare tra i runtime aperti, o scorri a sinistra/destra sul menu a discesa per scorrere tra di essi.
*   **`X` (Chiudi)**: Chiude il runtime corrente.
*   **`↻` (Aggiorna)**: *Visibile solo in Modalità Sviluppatore.* Aggiorna l'estensione corrente dalla sua fonte.
*   **`✨` (IA)**:
    *   **Tocca**: Apri il **Menu IA** per azioni rapide (Riepilogo, Traduci, ecc.).
    *   **Pressione Prolungata**: Apri le **Impostazioni IA** per configurare fornitori e preferenze.
*   **`☆` (Aggiungi Segnalibro)**:
    *   **Tocca**: Salva la vista corrente nei tuoi segnalibri.
    *   **Pressione Prolungata**: Vai direttamente alla tua lista di **Segnalibri**.
*   **`🔖` (Segnalibri)**: Visualizza la lista dei tuoi segnalibri salvati.
*   **`⚙️` (Impostazioni)**: Apri la schermata delle impostazioni principali.

Se lo schermo è troppo stretto, alcune opzioni potrebbero spostarsi in un menu a tre punti.

### Pulsante IA (`✨`)
Tocca il **pulsante IA** nella barra dell'app per aprire la **Finestra di Dialogo Menu IA**. Questo ti offre funzionalità basate sull'IA su richiesta per la vista corrente:

*   **Riepilogo**: Ottieni un rapido riepilogo generato dall'IA del contenuto sullo schermo.
*   **Traduci**: Traduci il contenuto nella tua lingua di destinazione (configurata nelle Impostazioni IA).
*   **Prompt Personalizzato**: Inserisci le tue istruzioni affinché l'IA analizzi il contenuto.
*   **Condividi su IA Esterna**: Esporta il contenuto della vista corrente su app di IA esterne come ChatGPT o Gemini sul tuo dispositivo.
*   **Attiva/Disattiva Cache**: Controlla se utilizzare i risultati IA memorizzati nella cache o forzare una nuova analisi.

Per una configurazione dettagliata dell'IA, vai su **Impostazioni > Impostazioni IA** dove puoi:
*   Configurare il tuo fornitore di IA preferito (Gemini, OpenAI, DeepSeek, Claude).
*   Impostare le lingue di origine e di destinazione per la traduzione.
*   Scegliere l'intervallo di ricerca dell'analisi (Profondo è solo in Vista Elenco) e il profilo (Riepilogo, Spiega, Semplifica, Verifica Fatti, Critica, Intuito).
*   Regolare le preferenze di lunghezza del riepilogo.
*   Visualizzare le statistiche di utilizzo dei token.
*   Gestire le chiavi API per ogni fornitore.

### Segnalibri
La schermata dei segnalibri mostra tutte le tue viste salvate.

*   **Istantanea Vista**: Toccando un segnalibro si apre un'**istantanea memorizzata nella cache** della pagina così come era quando l'hai salvata. Questo è ottimo per consultare rapidamente le informazioni senza bisogno di una connessione internet.
*   **Ripristina Vista**: Per interagire nuovamente con la pagina (es. cliccare sui link, aggiornare i dati), cerca l'**icona di ripristino**. Toccando questo, ti riconnetterai all'estensione e riporterai la vista in vita in un nuovo runtime.

## Impostazioni (`⚙️`)

La schermata delle impostazioni ti consente di perfezionare quasi ogni aspetto della tua esperienza Synura.

### Estensioni
*   **Installa Nuove Estensioni**: Tocca il pulsante **`+`** nella barra dell'app e inserisci il dominio del sito web (es. `https://example.com`). Se il sito supporta Synura, l'estensione verrà automaticamente scoperta e installata.
*   **Gestisci Estensioni**: Tocca **Gestisci** per vedere un elenco delle tue estensioni installate, dove puoi aggiornarle o rimuoverle.

### Aspetto
*   **Regola Densità Contenuto**: Usa il cursore per far apparire il contenuto più spaziato o più compatto. Vedrai un'anteprima in tempo reale di come influisce su elenchi e schede.
*   **Tema Colore**: Personalizza l'aspetto dell'app scegliendo tra schemi di colori **Chiaro**, **Scuro** e **Monokai**.
*   **Peso Carattere**: Regola lo spessore del testo in base alle tue preferenze (es. leggero, regolare, grassetto).
*   **Lingua**: Imposta la lingua dell'applicazione. Puoi scegliere una lingua specifica o lasciarla seguire l'impostazione predefinita del tuo sistema.

### Comportamento
*   **Timeout Rete**: Imposta quanto tempo l'app deve attendere una risposta da una richiesta di rete, da 1 a 60 secondi.
*   **Impostazioni Proxy**: Configura un server proxy per le richieste di rete.
*   **Impostazioni Cache**: Gestisci la cache dell'applicazione, inclusa la cancellazione dei dati memorizzati nella cache per liberare spazio.
*   **Animazione GIF**: Controlla come vengono riprodotte le GIF animate: **Off** (immagine statica), **Una volta** (riproduci una volta), o **Loop** (riproduci continuamente).

### Video & Audio
*   **Riproduzione Automatica Video**: Un interruttore per controllare se i video iniziano a essere riprodotti automaticamente quando appaiono sullo schermo.
*   **Riproduzione Video in Background**: Abilita questo per continuare ad ascoltare l'audio da un video anche dopo esserti allontanato o essere passato a un'altra app.
*   **Mixa con Altri**: Consenti all'audio di Synura di essere riprodotto contemporaneamente all'audio di altre app.
*   **Ore DVR Riproduzione Live**: Per le dirette streaming, scegli quante ore della trasmissione mantenere disponibili per cercare all'indietro (da 0 a 6 ore).

### Privacy & Sicurezza
*   **Gestisci Impostazioni**: Configura varie opzioni di privacy e sicurezza per controllare quali dati vengono archiviati e condivisi.

### Info
*   **Licenze Open Source**: Visualizza le licenze del software open source che aiuta a far funzionare Synura.

---
*Questo documento è per gli utenti finali. Per la documentazione per sviluppatori, consulta [Iniziare](getting_started.md), il [Riferimento API](api_reference.md), e gli [Esempi](examples.md).*