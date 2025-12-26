# Willkommen bei Synura!

## Was ist Synura?
Synura ist eine vielseitige Anwendung, mit der Sie Inhalte aus verschiedenen Quellen mithilfe leistungsstarker Mini-Apps namens "Erweiterungen" durchsuchen können. Stellen Sie es sich wie einen Browser vor, aber anstelle von Websites verwenden Sie Erweiterungen, um Inhalte in einem sauberen, nativen App-Format zu erhalten.

## Kernkonzepte für Benutzer

*   **Erweiterungserkennung**: Geben Sie eine Domain ein (z. B. `example.com` oder `https://example.com`), um automatisch die Datei `synura.js` von dieser Domain abzurufen. Wenn kein Protokoll angegeben ist, wird standardmäßig `https://` verwendet. Dies ist der primäre Weg, um Erweiterungen von ihren offiziellen Websites zu installieren.
*   **Direkte Installation**: Geben Sie eine vollständige URL ein (z. B. `https://raw.githubusercontent.com/user/repo/main/synura.js`), um ein bestimmtes Erweiterungsskript zu installieren. **Sicherheitshinweis**: Diese Methode ist auf vertrauenswürdige Domains (wie GitHub, GitLab usw.) beschränkt, um die Ausführung von schädlichem Code zu verhindern. Verwenden Sie dies nicht für allgemeine Domains.
*   **Whitelist-Validierung**: Direkte URL-Installationen werden zur Sicherheit gegen eine Whitelist zulässiger Domains validiert. Die Domain-Erkennung umgeht diese Prüfung, um die Erkundung zu ermöglichen.
*   **Erweiterungen**: Dies sind kleine Plugins, die Inhalte abrufen und anzeigen. Sie könnten beispielsweise eine Erweiterung für eine Nachrichtenseite, eine Videoplattform oder einen Social-Media-Feed haben. Sie können neue Erweiterungen installieren, um zu erweitern, was Sie mit Synura tun können.
*   **Laufzeiten (Runtimes)**: Wenn Sie eine Erweiterung öffnen, läuft sie in einer "Laufzeit". Sie können mehrere Laufzeiten gleichzeitig geöffnet haben, genau wie mehrere Tabs in einem Webbrowser. Jede Laufzeit ist eine separate Instanz einer Erweiterung. Sie können zwischen ihnen wechseln und sogar mehrere Laufzeiten für dieselbe Erweiterung haben.
*   **Lesezeichen**: Haben Sie etwas Interessantes gefunden? Sie können die aktuelle Ansicht als Lesezeichen speichern, um sie später aufzurufen. Ein Lesezeichen speichert den genauen Zustand der Ansicht, sodass Sie jederzeit dorthin zurückkehren können.

## Navigation in der App

### Der Hauptbildschirm
Der Hauptbildschirm der App ist der Ort, an dem Sie Ihre Laufzeiten verwalten. Die obere Leiste (App-Leiste) ist Ihr wichtigstes Navigationswerkzeug.

### Die App-Leiste

Die App-Leiste verfügt über mehrere Symbole, die Ihnen beim Navigieren und Verwalten Ihrer Inhalte helfen. Einige Symbole haben **versteckte Verknüpfungen**, auf die durch langes Drücken zugegriffen werden kann:

*   **`+` (Hinzufügen)**:
    *   **Tippen**: Öffnen Sie eine neue Laufzeit. Sie können eine installierte Erweiterung auswählen oder eine Website-Domain/URL eingeben, um eine neue zu installieren.
    *   **Langes Drücken**: Öffnen Sie den Bildschirm **Erweiterungsverwaltung**, um Details zu Ihren installierten Erweiterungen anzuzeigen.
*   **Dropdown-Menü (Mitte)**: Zeigt die aktuell aktive Laufzeit an. Tippen Sie darauf, um zwischen offenen Laufzeiten zu wechseln, oder wischen Sie auf dem Dropdown nach links/rechts, um durch sie zu blättern.
*   **`X` (Schließen)**: Schließt die aktuelle Laufzeit.
*   **`↻` (Aktualisieren)**: *Nur im Entwicklermodus sichtbar.* Aktualisiert die aktuelle Erweiterung von ihrer Quelle.
*   **`✨` (KI)**:
    *   **Tippen**: Öffnen Sie das **KI-Menü** für schnelle Aktionen (Zusammenfassung, Übersetzen usw.).
    *   **Langes Drücken**: Öffnen Sie die **KI-Einstellungen**, um Anbieter und Präferenzen zu konfigurieren.
*   **`☆` (Lesezeichen hinzufügen)**:
    *   **Tippen**: Speichern Sie die aktuelle Ansicht in Ihren Lesezeichen.
    *   **Langes Drücken**: Gehen Sie direkt zu Ihrer **Lesezeichen**-Liste.
*   **`🔖` (Lesezeichen)**: Zeigen Sie Ihre Liste der gespeicherten Lesezeichen an.
*   **`⚙️` (Einstellungen)**: Öffnen Sie den Haupteinstellungsbildschirm.

Wenn der Bildschirm zu schmal ist, können einige Optionen in ein Drei-Punkte-Menü verschoben werden.

### KI-Schaltfläche (`✨`)
Tippen Sie auf die **KI-Schaltfläche** in der App-Leiste, um den **KI-Menü-Dialog** zu öffnen. Dies gibt Ihnen KI-gestützte Funktionen auf Abruf für die aktuelle Ansicht:

*   **Zusammenfassung**: Erhalten Sie eine schnelle KI-generierte Zusammenfassung des Inhalts auf dem Bildschirm.
*   **Übersetzen**: Übersetzen Sie den Inhalt in Ihre Zielsprache (in den KI-Einstellungen konfiguriert).
*   **Benutzerdefinierter Prompt**: Geben Sie Ihre eigenen Anweisungen ein, damit die KI den Inhalt analysiert.
*   **An externe KI teilen**: Exportieren Sie den Inhalt der aktuellen Ansicht in externe KI-Apps wie ChatGPT oder Gemini auf Ihrem Gerät.
*   **Cache-Umschalter**: Steuern Sie, ob zwischengespeicherte KI-Ergebnisse verwendet oder eine neue Analyse erzwungen werden soll.

Für eine detaillierte KI-Konfiguration gehen Sie zu **Einstellungen > KI-Einstellungen**, wo Sie Folgendes tun können:
*   Konfigurieren Sie Ihren bevorzugten KI-Anbieter (Gemini, OpenAI, DeepSeek, Claude).
*   Legen Sie Quell- und Zielsprachen für die Übersetzung fest.
*   Wählen Sie den Analyse-Suchbereich (Tief ist nur in der Listenansicht verfügbar) und das Profil (Zusammenfassung, Erklären, Vereinfachen, Faktencheck, Kritik, Einblick).
*   Passen Sie die Präferenzen für die Zusammenfassungslänge an.
*   Zeigen Sie Token-Nutzungsstatistiken an.
*   Verwalten Sie API-Schlüssel für jeden Anbieter.

### Lesezeichen
Der Lesezeichen-Bildschirm zeigt alle Ihre gespeicherten Ansichten.

*   **Ansichts-Schnappschuss**: Das Tippen auf ein Lesezeichen öffnet einen **zwischengespeicherten Schnappschuss** der Seite, so wie sie beim Speichern war. Dies ist großartig, um schnell Informationen nachzuschlagen, ohne eine Internetverbindung zu benötigen.
*   **Ansicht wiederherstellen**: Um wieder mit der Seite zu interagieren (z. B. Links anklicken, Daten aktualisieren), suchen Sie nach dem **Wiederherstellen-Symbol**. Wenn Sie darauf tippen, wird die Verbindung zur Erweiterung wiederhergestellt und die Ansicht in einer neuen Laufzeit wieder zum Leben erweckt.

## Einstellungen (`⚙️`)

Der Einstellungsbildschirm ermöglicht es Ihnen, fast jeden Aspekt Ihres Synura-Erlebnisses fein abzustimmen.

### Erweiterungen
*   **Neue Erweiterungen installieren**: Tippen Sie auf die Schaltfläche **`+`** in der App-Leiste und geben Sie die Website-Domain ein (z. B. `https://example.com`). Wenn die Website Synura unterstützt, wird die Erweiterung automatisch entdeckt und installiert.
*   **Erweiterungen verwalten**: Tippen Sie auf **Verwalten**, um eine Liste Ihrer installierten Erweiterungen zu sehen, wo Sie diese aktualisieren oder entfernen können.

### Erscheinungsbild
*   **Inhaltsdichte anpassen**: Verwenden Sie den Schieberegler, um Inhalte breiter oder kompakter erscheinen zu lassen. Sie sehen eine Live-Vorschau, wie sich dies auf Listen und Karten auswirkt.
*   **Farbthema**: Personalisieren Sie das Aussehen der App, indem Sie zwischen den Farbschemata **Hell**, **Dunkel** und **Monokai** wählen.
*   **Schriftstärke**: Passen Sie die Fettdruckstärke des Textes nach Ihren Wünschen an (z. B. leicht, regulär, fett).
*   **Sprache**: Legen Sie die Anwendungssprache fest. Sie können eine bestimmte Sprache wählen oder sie dem Standard Ihres Systems folgen lassen.

### Verhalten
*   **Netzwerk-Timeout**: Legen Sie fest, wie lange die App auf eine Antwort von einer Netzwerkanfrage warten soll, von 1 bis 60 Sekunden.
*   **Proxy-Einstellungen**: Konfigurieren Sie einen Proxy-Server für Netzwerkanfragen.
*   **Cache-Einstellungen**: Verwalten Sie den Cache der Anwendung, einschließlich des Löschens zwischengespeicherter Daten, um Speicherplatz freizugeben.
*   **GIF-Animation**: Steuern Sie, wie animierte GIFs abgespielt werden: **Aus** (statisches Bild), **Einmal** (einmal abspielen) oder **Schleife** (kontinuierlich abspielen).

### Video & Audio
*   **Video-Autoplay**: Ein Schalter, um zu steuern, ob Videos automatisch abgespielt werden, wenn sie auf dem Bildschirm erscheinen.
*   **Video-Hintergrundwiedergabe**: Aktivieren Sie dies, um den Ton eines Videos auch dann weiter zu hören, wenn Sie wegnavigieren oder zu einer anderen App wechseln.
*   **Mit anderen mischen**: Erlauben Sie, dass Audio von Synura gleichzeitig mit Audio von anderen Apps abgespielt wird.
*   **Live-Wiedergabe DVR-Stunden**: Wählen Sie für Live-Streams, wie viele Stunden der Übertragung für das Zurückspulen verfügbar gehalten werden sollen (von 0 bis 6 Stunden).

### Datenschutz & Sicherheit
*   **Einstellungen verwalten**: Konfigurieren Sie verschiedene Datenschutz- und Sicherheitsoptionen, um zu steuern, welche Daten gespeichert und geteilt werden.

### Über
*   **Open-Source-Lizenzen**: Sehen Sie sich die Lizenzen der Open-Source-Software an, die Synura antreibt.

---
*Dieses Dokument ist für Endbenutzer. Für Entwicklerdokumentation lesen Sie bitte [Erste Schritte](getting_started.md), die [API-Referenz](api_reference.md) und [Beispiele](examples.md).*