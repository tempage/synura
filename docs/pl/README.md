# Witaj w Synura!

## Czym jest Synura?
Synura to wszechstronna aplikacja, która pozwala przeglądać treści z różnych źródeł za pomocą potężnych mini-aplikacji zwanych "rozszerzeniami". Pomyśl o tym jak o przeglądarce, ale zamiast stron internetowych używasz rozszerzeń, aby uzyskać treści w czystym, natywnym formacie aplikacji.

## Podstawowe pojęcia dla użytkowników

*   **Odkrywanie rozszerzeń**: Wpisz domenę (np. `example.com` lub `https://example.com`), aby automatycznie pobrać plik `synura.js` z tej domeny. Jeśli protokół nie zostanie podany, domyślnie używany jest `https://`. Jest to podstawowy sposób instalowania rozszerzeń z ich oficjalnych stron internetowych.
*   **Instalacja bezpośrednia**: Wpisz pełny adres URL (np. `https://raw.githubusercontent.com/user/repo/main/synura.js`), aby zainstalować określony skrypt rozszerzenia. **Uwaga dotycząca bezpieczeństwa**: Ta metoda jest ograniczona do zaufanych domen (takich jak GitHub, GitLab itp.), aby zapobiec wykonywaniu złośliwego kodu. Nie używaj tego dla domen ogólnych.
*   **Weryfikacja białej listy**: Bezpośrednie instalacje URL są weryfikowane pod kątem białej listy dozwolonych domen ze względów bezpieczeństwa. Odkrywanie domen pomija to sprawdzenie, aby umożliwić eksplorację.
*   **Rozszerzenia**: Są to małe wtyczki, które pobierają i wyświetlają treści. Na przykład możesz mieć rozszerzenie dla serwisu informacyjnego, platformy wideo lub kanału mediów społecznościowych. Możesz instalować nowe rozszerzenia, aby rozszerzyć możliwości Synura.
*   **Środowiska uruchomieniowe (Runtimes)**: Po otwarciu rozszerzenia działa ono w "środowisku uruchomieniowym". Możesz mieć otwartych wiele środowisk uruchomieniowych jednocześnie, tak jak wiele kart w przeglądarce internetowej. Każde środowisko uruchomieniowe jest oddzielną instancją rozszerzenia. Możesz przełączać się między nimi, a nawet mieć wiele środowisk uruchomieniowych dla tego samego rozszerzenia.
*   **Zakładki**: Znalazłeś coś ciekawego? Możesz dodać bieżący widok do zakładek, aby zapisać go na później. Zakładka zapisuje dokładny stan widoku, dzięki czemu możesz do niego wrócić w dowolnym momencie.

## Poruszanie się po aplikacji

### Ekran główny
Ekran główny aplikacji to miejsce, w którym zarządzasz swoimi środowiskami uruchomieniowymi. Górny pasek (pasek aplikacji) to główne narzędzie nawigacji.

### Pasek aplikacji

Pasek aplikacji ma kilka ikon:

*   **`+` (Dodaj)**: Stuknij to, aby otworzyć nowe środowisko uruchomieniowe. Możesz wybrać zainstalowane rozszerzenie lub wpisać domenę witryny, aby zainstalować nowe.
*   **Menu rozwijane (środek)**: Pokazuje aktualnie aktywne środowisko uruchomieniowe. Stuknij je, aby zobaczyć listę wszystkich otwartych środowisk uruchomieniowych i przełączać się między nimi. Możesz także przesuwać palcem w lewo lub w prawo po menu rozwijanym, aby szybko się przełączać.
*   **`X` (Zamknij)**: Zamyka bieżące środowisko uruchomieniowe.
*   **`☆` (Dodaj zakładkę)**: Stuknij to, aby zapisać bieżący widok w zakładkach.
*   **`🔖` (Zakładki)**: Przenosi Cię do listy zapisanych zakładek.
*   **`⚙️` (Ustawienia)**: Otwiera ekran ustawień, w którym możesz dostosować Synura.

Jeśli ekran jest zbyt wąski, opcje te zostaną zwinięte do menu z trzema kropkami po prawej stronie.

### Zakładki
Ekran zakładek pokazuje wszystkie zapisane widoki.

*   **Migawka widoku**: Stuknięcie zakładki otwiera **zapisaną w pamięci podręcznej migawkę** strony w takim stanie, w jakim była podczas zapisywania. Jest to świetne do szybkiego odwoływania się do informacji bez konieczności połączenia z Internetem.
*   **Przywróć widok**: Aby ponownie wejść w interakcję ze stroną (np. klikać linki, odświeżać dane), poszukaj **ikony przywracania**. Stuknięcie jej spowoduje ponowne połączenie z rozszerzeniem i przywrócenie widoku w nowym środowisku uruchomieniowym.

## Ustawienia (`⚙️`)

Ekran ustawień pozwala dostosować prawie każdy aspekt korzystania z Synura.

### Rozszerzenia
*   **Zainstaluj nowe rozszerzenia**: Stuknij przycisk **`+`** na pasku aplikacji i wpisz domenę witryny (np. `https://example.com`). Jeśli witryna obsługuje Synura, rozszerzenie zostanie automatycznie wykryte i zainstalowane.
*   **Zarządzaj rozszerzeniami**: Stuknij **Zarządzaj**, aby zobaczyć listę zainstalowanych rozszerzeń, gdzie możesz je aktualizować lub usuwać.

### Wygląd
*   **Dostosuj gęstość treści**: Użyj suwaka, aby treść wydawała się bardziej rozproszona lub bardziej zwarta. Zobaczysz podgląd na żywo, jak wpływa to na listy i karty.
*   **Motyw kolorystyczny**: Spersonalizuj wygląd aplikacji, wybierając między schematami kolorów **Jasny**, **Ciemny** i **Monokai**.
*   **Grubość czcionki**: Dostosuj pogrubienie tekstu do swoich preferencji (np. lekki, regularny, pogrubiony).
*   **Język**: Ustaw język aplikacji. Możesz wybrać konkretny język lub pozwolić, aby podążał za domyślnym ustawieniem systemu.

### Zachowanie
*   **Limit czasu sieci**: Ustaw, jak długo aplikacja powinna czekać na odpowiedź z żądania sieciowego, od 1 do 60 sekund.
*   **Ustawienia proxy**: Skonfiguruj serwer proxy dla żądań sieciowych.
*   **Ustawienia pamięci podręcznej**: Zarządzaj pamięcią podręczną aplikacji, w tym czyszczeniem danych z pamięci podręcznej, aby zwolnić miejsce.
*   **Animacja GIF**: Kontroluj sposób odtwarzania animowanych GIF-ów: **Wył.** (obraz statyczny), **Raz** (odtwórz raz) lub **Pętla** (odtwarzaj ciągle).

### Wideo i audio
*   **Autoodtwarzanie wideo**: Przełącznik do kontrolowania, czy filmy zaczynają się odtwarzać automatycznie, gdy pojawią się na ekranie.
*   **Odtwarzanie wideo w tle**: Włącz to, aby nadal słyszeć dźwięk z filmu nawet po przejściu w inne miejsce lub przełączeniu na inną aplikację.
*   **Mieszaj z innymi**: Zezwól na odtwarzanie dźwięku z Synura w tym samym czasie, co dźwięk z innych aplikacji.
*   **Godziny DVR odtwarzania na żywo**: W przypadku transmisji na żywo wybierz, ile godzin transmisji ma być dostępnych do przewijania do tyłu (od 0 do 6 godzin).

### Prywatność i bezpieczeństwo
*   **Zarządzaj ustawieniami**: Skonfiguruj różne opcje prywatności i bezpieczeństwa, aby kontrolować, jakie dane są przechowywane i udostępniane.

### O programie
*   **Licencje Open Source**: Wyświetl licencje oprogramowania open source, które pomaga zasilać Synura.

---
*Ten dokument jest przeznaczony dla użytkowników końcowych. Dokumentację dla programistów można znaleźć w [Pierwsze kroki](getting_started.md), [Dokumentacji API](api_reference.md) i [Przykładach](examples.md).*