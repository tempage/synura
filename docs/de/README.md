# Willkommen bei Synura!

## Was ist Synura?
Synura ist eine vielseitige Anwendung, mit der Sie Inhalte aus verschiedenen Quellen mithilfe leistungsstarker Mini-Apps namens "Erweiterungen" (Extensions) durchsuchen können. Stellen Sie es sich wie einen Browser vor, aber anstelle von Websites verwenden Sie Erweiterungen, um Inhalte in einem sauberen, nativen App-Format zu erhalten.

## Kernkonzepte für Benutzer

*   **Erweiterungserkennung**: Geben Sie eine Domain ein (z. B. `example.com` oder `https://example.com`), um automatisch die Datei `synura.js` von dieser Domain abzurufen. Wenn kein Protokoll angegeben ist, wird standardmäßig `https://` verwendet. Dies ist der primäre Weg, um Erweiterungen von ihren offiziellen Websites zu installieren.
*   **Direkte Installation**: Geben Sie eine vollständige URL ein (z. B. `https://raw.githubusercontent.com/user/repo/main/synura.js`), um ein bestimmtes Erweiterungsskript zu installieren. **Sicherheitshinweis**: Diese Methode ist auf vertrauenswürdige Domains (wie GitHub, GitLab usw.) beschränkt, um die Ausführung von schädlichem Code zu verhindern. Verwenden Sie dies nicht für allgemeine Domains.
*   **Whitelist-Validierung**: Direkte URL-Installationen werden aus Sicherheitsgründen gegen eine Whitelist zulässiger Domains validiert. Die Domain-Erkennung umgeht diese Prüfung, um die Erkundung zu ermöglichen.
*   **Erweiterungen**: Dies sind kleine Plugins, die Inhalte abrufen und anzeigen. Sie könnten beispielsweise eine Erweiterung für eine Nachrichtenseite, eine Videoplattform oder einen Social-Media-Feed haben. Sie können neue Erweiterungen installieren, um die Möglichkeiten von Synura zu erweitern.
*   **Laufzeiten (Runtimes)**: Wenn Sie eine Erweiterung öffnen, läuft sie in einer "Laufzeit". Sie können mehrere Laufzeiten gleichzeitig geöffnet haben, genau wie mehrere Tabs in einem Webbrowser. Jede Laufzeit ist eine separate Instanz einer Erweiterung. Sie können zwischen ihnen wechseln und sogar mehrere Laufzeiten für dieselbe Erweiterung haben.
*   **Lesezeichen**: Etwas Interessantes gefunden? Sie können die aktuelle Ansicht als Lesezeichen speichern, um sie später aufzurufen. Ein Lesezeichen speichert den genauen Zustand der Ansicht, sodass Sie jederzeit dorthin zurückkehren können.

## Navigation in der App

### Der Hauptbildschirm
Der Hauptbildschirm der App ist der Ort, an dem Sie Ihre Laufzeiten verwalten. Die obere Leiste (App-Leiste) ist Ihr wichtigstes Navigationswerkzeug.

### Die App-Leiste

Die App-Leiste verfügt über mehrere Symbole:

*   **`+` (Hinzufügen)**: Tippen Sie hierauf, um eine neue Laufzeit zu öffnen. Sie können eine installierte Erweiterung auswählen oder eine Website-Domain eingeben, um eine neue zu installieren.
*   **Dropdown-Menü (Mitte)**: Dies zeigt die aktuell aktive Laufzeit an. Tippen Sie darauf, um eine Liste aller Ihrer offenen Laufzeiten zu sehen und zwischen ihnen zu wechseln. Sie können auch auf dem Dropdown nach links oder rechts wischen, um schnell zu wechseln.
*   **`X` (Schließen)**: Dies schließt die aktuelle Laufzeit.
*   **`☆` (Lesezeichen hinzufügen)**: Tippen Sie hierauf, um die aktuelle Ansicht in Ihren Lesezeichen zu speichern.
*   **`🔖` (Lesezeichen)**: Dies bringt Sie zu Ihrer Liste der gespeicherten Lesezeichen.
*   **`⚙️` (Einstellungen)**: Dies öffnet den Einstellungsbildschirm, in dem Sie Synura anpassen können.

Wenn der Bildschirm zu schmal ist, werden diese Optionen in einem Drei-Punkte-Menü auf der rechten Seite zusammengefasst.

### Lesezeichen
Der Lesezeichen-Bildschirm zeigt alle Ihre gespeicherten Ansichten.

*   **Ansicht-Schnappschuss**: Wenn Sie auf ein Lesezeichen tippen, öffnet sich ein **zwischengespeicherter Schnappschuss** der Seite, so wie sie beim Speichern war. Dies ist ideal, um schnell Informationen nachzuschlagen, ohne eine Internetverbindung zu benötigen.
*   **Ansicht wiederherstellen**: Um wieder mit der Seite zu interagieren (z. B. Links anklicken, Daten aktualisieren), suchen Sie nach dem **Wiederherstellen-Symbol**. Ein Tippen darauf stellt die Verbindung zur Erweiterung wieder her und erweckt die Ansicht in einer neuen Laufzeit zum Leben.

## Einstellungen (`⚙️`)

Der Einstellungsbildschirm ermöglicht es Ihnen, fast jeden Aspekt Ihrer Synura-Erfahrung feinabzustimmen.

### Erweiterungen
*   **Neue Erweiterungen installieren**: Tippen Sie auf die Schaltfläche **`+`** in der App-Leiste und geben Sie die Website-Domain ein (z. B. `https://example.com`). Wenn die Website Synura unterstützt, wird die Erweiterung automatisch entdeckt und installiert.
*   **Erweiterungen verwalten**: Tippen Sie auf **Verwalten**, um eine Liste Ihrer installierten Erweiterungen zu sehen, wo Sie diese aktualisieren oder entfernen können.

### Erscheinungsbild
*   **Inhaltsdichte anpassen**: Verwenden Sie den Schieberegler, um Inhalte breiter oder kompakter erscheinen zu lassen. Sie sehen eine Live-Vorschau, wie sich dies auf Listen und Karten auswirkt.
*   **Farbthema**: Personalisieren Sie das Aussehen der App, indem Sie zwischen den Farbschemata **Hell**, **Dunkel** und **Monokai** wählen.
*   **Schriftstärke**: Passen Sie die Fettheit des Textes nach Ihren Wünschen an (z. B. leicht, regulär, fett).
*   **Sprache**: Stellen Sie die Anwendungssprache ein. Sie können eine bestimmte Sprache wählen oder sie dem Standard Ihres Systems folgen lassen.

### Verhalten
*   **Netzwerk-Timeout**: Legen Sie fest, wie lange die App auf eine Antwort von einer Netzwerkanfrage warten soll, von 1 bis 60 Sekunden.
*   **Proxy-Einstellungen**: Konfigurieren Sie einen Proxy-Server für Netzwerkanfragen.
*   **Cache-Einstellungen**: Verwalten Sie den Cache der Anwendung, einschließlich des Löschens zwischengespeicherter Daten, um Platz freizugeben.
*   **GIF-Animation**: Steuern Sie, wie animierte GIFs abgespielt werden: **Aus** (statisches Bild), **Einmal** (einmal abspielen) oder **Schleife** (kontinuierlich abspielen).

### Video & Audio
*   **Video-Autoplay**: Ein Schalter, um zu steuern, ob Videos automatisch abgespielt werden, wenn sie auf dem Bildschirm erscheinen.
*   **Video-Hintergrundwiedergabe**: Aktivieren Sie dies, um den Ton eines Videos auch dann noch zu hören, wenn Sie wegnavigieren oder zu einer anderen App wechseln.
*   **Mit anderen mischen**: Erlauben Sie, dass Audio von Synura gleichzeitig mit Audio von anderen Apps abgespielt wird.
*   **Live-Wiedergabe DVR-Stunden**: Wählen Sie für Live-Streams, wie viele Stunden der Übertragung verfügbar bleiben sollen, um zurückzuspulen (von 0 bis 6 Stunden).

### Privatsphäre & Sicherheit
*   **Einstellungen verwalten**: Konfigurieren Sie verschiedene Datenschutz- und Sicherheitsoptionen, um zu steuern, welche Daten gespeichert und geteilt werden.

### Über
*   **Open-Source-Lizenzen**: Sehen Sie sich die Lizenzen der Open-Source-Software an, die Synura antreibt.

---
*Dieses Dokument ist für Endbenutzer. Für Entwicklerdokumentation lesen Sie bitte [Erste Schritte](getting_started.md), die [API-Referenz](api_reference.md) und [Beispiele](examples.md).*