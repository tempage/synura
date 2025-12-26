# Witaj w Synura!

## Czym jest Synura?
Synura to wszechstronna aplikacja, która pozwala przeglądać treści z różnych źródeł za pomocą potężnych mini-aplikacji zwanych "rozszerzeniami". Pomyśl o tym jak o przeglądarce, ale zamiast stron internetowych używasz rozszerzeń, aby uzyskać treści w czystym, natywnym formacie aplikacji.

## Podstawowe pojęcia dla użytkowników

*   **Odkrywanie rozszerzeń**: Wpisz domenę (np. `example.com` lub `https://example.com`), aby automatycznie pobrać plik `synura.js` z tej domeny. Jeśli protokół nie zostanie podany, domyślnie używany jest `https://`. Jest to podstawowy sposób instalowania rozszerzeń z ich oficjalnych stron internetowych.
*   **Instalacja bezpośrednia**: Wpisz pełny adres URL (np. `https://raw.githubusercontent.com/user/repo/main/synura.js`), aby zainstalować konkretny skrypt rozszerzenia. **Uwaga dotycząca bezpieczeństwa**: Ta metoda jest ograniczona do zaufanych domen (takich jak GitHub, GitLab itp.), aby zapobiec wykonaniu złośliwego kodu. Nie używaj tego dla domen ogólnych.
*   **Walidacja białej listy**: Bezpośrednie instalacje z adresu URL są sprawdzane pod kątem białej listy dozwolonych domen dla bezpieczeństwa. Odkrywanie domen pomija to sprawdzenie, aby umożliwić eksplorację.
*   **Rozszerzenia**: Są to małe wtyczki, które pobierają i wyświetlają treści. Na przykład możesz mieć rozszerzenie dla serwisu informacyjnego, platformy wideo lub kanału mediów społecznościowych. Możesz instalować nowe rozszerzenia, aby rozszerzyć możliwości Synura.
*   **Środowiska wykonawcze (Runtimes)**: Kiedy otwierasz rozszerzenie, działa ono w "środowisku wykonawczym". Możesz mieć otwartych wiele środowisk wykonawczych jednocześnie, tak jak wiele kart w przeglądarce internetowej. Każde środowisko wykonawcze jest oddzielną instancją rozszerzenia. Możesz przełączać się między nimi, a nawet mieć wiele środowisk wykonawczych dla tego samego rozszerzenia.
*   **Zakładki**: Znalazłeś coś ciekawego? Możesz dodać zakładkę do bieżącego widoku, aby zachować go na później. Zakładka zapisuje dokładny stan widoku, dzięki czemu możesz do niego wrócić w dowolnym momencie.

## Poruszanie się po aplikacji

### Ekran główny
Ekran główny aplikacji to miejsce, w którym zarządzasz swoimi środowiskami wykonawczymi. Górny pasek (pasek aplikacji) to twoje główne narzędzie nawigacji.

### Pasek aplikacji

Pasek aplikacji ma kilka ikon, które pomagają w nawigacji i zarządzaniu treścią. Niektóre ikony mają **ukryte skróty** dostępne po długim naciśnięciu:

*   **`+` (Dodaj)**:
    *   **Dotknięcie**: Otwórz nowe środowisko wykonawcze. Możesz wybrać zainstalowane rozszerzenie lub wpisać domenę/adres URL strony internetowej, aby zainstalować nowe.
    *   **Długie naciśnięcie**: Otwórz ekran **Zarządzania rozszerzeniami**, aby wyświetlić szczegóły dotyczące zainstalowanych rozszerzeń.
*   **Menu rozwijane (środek)**: Wyświetla aktualnie aktywne środowisko wykonawcze. Dotknij, aby przełączać się między otwartymi środowiskami wykonawczymi, lub przesuń palcem w lewo/prawo po menu rozwijanym, aby je przewijać.
*   **`X` (Zamknij)**: Zamyka bieżące środowisko wykonawcze.
*   **`↻` (Aktualizuj)**: *Widoczne tylko w trybie deweloperskim.* Aktualizuje bieżące rozszerzenie ze źródła.
*   **`✨` (AI)**:
    *   **Dotknięcie**: Otwórz **Menu AI** dla szybkich akcji (Podsumuj, Przetłumacz itp.).
    *   **Długie naciśnięcie**: Otwórz **Ustawienia AI**, aby skonfigurować dostawców i preferencje.
*   **`☆` (Dodaj zakładkę)**:
    *   **Dotknięcie**: Zapisz bieżący widok w zakładkach.
    *   **Długie naciśnięcie**: Przejdź bezpośrednio do listy **Zakładek**.
*   **`🔖` (Zakładki)**: Wyświetl listę zapisanych zakładek.
*   **`⚙️` (Ustawienia)**: Otwórz główny ekran ustawień.

Jeśli ekran jest zbyt wąski, niektóre opcje mogą zostać przeniesione do menu z trzema kropkami.

### Przycisk AI (`✨`)
Dotknij **przycisku AI** na pasku aplikacji, aby otworzyć **Okno dialogowe menu AI**. Daje to dostęp do funkcji opartych na sztucznej inteligencji na żądanie dla bieżącego widoku:

*   **Podsumowanie**: Uzyskaj szybkie, wygenerowane przez AI podsumowanie treści na ekranie.
*   **Przetłumacz**: Przetłumacz treść na język docelowy (skonfigurowany w Ustawieniach AI).
*   **Niestandardowy monit**: Wpisz własne instrukcje dla AI, aby przeanalizować treść.
*   **Udostępnij zewnętrznej AI**: Eksportuj treść bieżącego widoku do zewnętrznych aplikacji AI, takich jak ChatGPT lub Gemini na swoim urządzeniu.
*   **Przełącznik pamięci podręcznej**: Kontroluj, czy używać buforowanych wyników AI, czy wymusić nową analizę.

Aby uzyskać szczegółową konfigurację AI, przejdź do **Ustawienia > Ustawienia AI**, gdzie możesz:
*   Skonfigurować preferowanego dostawcę AI (Gemini, OpenAI, DeepSeek, Claude).
*   Ustawić języki źródłowe i docelowe dla tłumaczenia.
*   Wybrać zakres wyszukiwania analizy (Głęboki jest tylko w Widoku listy) i profil (Podsumowanie, Wyjaśnij, Uprość, Sprawdzanie faktów, Krytyka, Wgląd).
*   Dostosować preferencje długości podsumowania.
*   Wyświetlić statystyki użycia tokenów.
*   Zarządzać kluczami API dla każdego dostawcy.

### Zakładki
Ekran zakładek pokazuje wszystkie zapisane widoki.

*   **Migawka widoku**: Dotknięcie zakładki otwiera **buforowaną migawkę** strony w takim stanie, w jakim była podczas zapisywania. Jest to świetne do szybkiego sprawdzania informacji bez konieczności połączenia z Internetem.
*   **Przywróć widok**: Aby ponownie wejść w interakcję ze stroną (np. klikać linki, odświeżać dane), poszukaj **ikony przywracania**. Dotknięcie jej spowoduje ponowne połączenie z rozszerzeniem i przywrócenie widoku do życia w nowym środowisku wykonawczym.

## Ustawienia (`⚙️`)

Ekran ustawień pozwala dostosować prawie każdy aspekt korzystania z Synura.

### Rozszerzenia
*   **Zainstaluj nowe rozszerzenia**: Dotknij przycisku **`+`** na pasku aplikacji i wpisz domenę witryny (np. `https://example.com`). Jeśli witryna obsługuje Synura, rozszerzenie zostanie automatycznie wykryte i zainstalowane.
*   **Zarządzaj rozszerzeniami**: Dotknij **Zarządzaj**, aby zobaczyć listę zainstalowanych rozszerzeń, gdzie możesz je zaktualizować lub usunąć.

### Wygląd
*   **Dostosuj gęstość treści**: Użyj suwaka, aby treść wyglądała na bardziej rozproszoną lub bardziej zwartą. Zobaczysz podgląd na żywo, jak wpływa to na listy i karty.
*   **Motyw kolorystyczny**: Spersonalizuj wygląd aplikacji, wybierając między schematami kolorów **Jasny**, **Ciemny** i **Monokai**.
*   **Grubość czcionki**: Dostosuj grubość tekstu do swoich preferencji (np. lekki, regularny, pogrubiony).
*   **Język**: Ustaw język aplikacji. Możesz wybrać konkretny język lub pozwolić, aby podążał za domyślnym ustawieniem systemu.

### Zachowanie
*   **Limit czasu sieci**: Ustaw czas oczekiwania aplikacji na odpowiedź z żądania sieciowego, od 1 do 60 sekund.
*   **Ustawienia proxy**: Skonfiguruj serwer proxy dla żądań sieciowych.
*   **Ustawienia pamięci podręcznej**: Zarządzaj pamięcią podręczną aplikacji, w tym czyszczeniem buforowanych danych w celu zwolnienia miejsca.
*   **Animacja GIF**: Kontroluj sposób odtwarzania animowanych GIF-ów: **Wyłączone** (statyczny obraz), **Raz** (odtwórz raz) lub **Pętla** (odtwarzaj ciągle).

### Wideo i Audio
*   **Autoodtwarzanie wideo**: Przełącznik do kontrolowania, czy filmy mają być odtwarzane automatycznie, gdy pojawią się na ekranie.
*   **Odtwarzanie wideo w tle**: Włącz tę opcję, aby nadal słyszeć dźwięk z wideo nawet po przejściu w inne miejsce lub przełączeniu na inną aplikację.
*   **Mieszaj z innymi**: Zezwalaj na odtwarzanie dźwięku z Synura w tym samym czasie co dźwięk z innych aplikacji.
*   **Godziny DVR odtwarzania na żywo**: W przypadku transmisji na żywo wybierz, ile godzin transmisji ma być dostępnych do przewijania do tyłu (od 0 do 6 godzin).

### Prywatność i bezpieczeństwo
*   **Zarządzaj ustawieniami**: Skonfiguruj różne opcje prywatności i bezpieczeństwa, aby kontrolować, jakie dane są przechowywane i udostępniane.

### O aplikacji
*   **Licencje Open Source**: Zobacz licencje oprogramowania typu open source, które pomaga zasilać Synura.

---
*Ten dokument jest przeznaczony dla użytkowników końcowych. Dokumentację dla programistów można znaleźć w [Pierwsze kroki](getting_started.md), [Dokumentacja API](api_reference.md) i [Przykłady](examples.md).*