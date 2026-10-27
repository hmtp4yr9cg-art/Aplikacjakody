KODY I LOKALIZACJE — PWA DLA IPHONE'A (BEZ MACA)

CO ZAWIERA
- Wpisanie numeru lokalizacji.
- Skanowanie kodów kreskowych aparatem (moduł html5-qrcode ładowany z CDN).
- Ręczne wpisanie kodu, jeśli aparat nie działa.
- Ustawienie ilości i dodawanie kolejnych pozycji.
- Automatyczne zapisywanie listy w pamięci przeglądarki.
- Eksport pliku TXT z nagłówkiem: Lokalizacja, kod kreskowy, ilość.
- PWA: możliwość dodania do ekranu początkowego i cache aplikacji.

WAŻNE
- Aparat w Safari wymaga bezpiecznego połączenia HTTPS.
- Pierwsze uruchomienie modułu skanera wymaga internetu (biblioteka jest pobierana z unpkg.com).
- Zapisane pozycje są lokalne dla tej przeglądarki i urządzenia. Wyczyść dane Safari lub zmiana przeglądarki może spowodować utratę danych. Eksportuj TXT regularnie.
- To aplikacja internetowa PWA, nie plik IPA i nie aplikacja z App Store.
- Kody są zapisywane jako oddzielne pozycje. Powtórne zeskanowanie nie sumuje ilości automatycznie.

PUBLIKACJA PRZEZ GITHUB PAGES — MOŻNA ZROBIĆ Z IPHONE'A LUB WINDOWS
1. Otwórz https://github.com/ i utwórz konto albo zaloguj się.
2. Utwórz nowe repozytorium (New repository), nazwij np. kody-lokalizacje. Możesz ustawić Public, aby najprościej uruchomić GitHub Pages.
3. W repozytorium wybierz Add file → Upload files.
4. Rozpakuj ZIP na komputerze/telefonie i wgraj ZAWARTOŚĆ folderu, nie sam folder nadrzędny. W repozytorium powinny być od razu widoczne: index.html, app.js, styles.css, manifest.webmanifest, sw.js, README-INSTRUKCJA.txt i folder icons.
5. Zatwierdź przesłanie przyciskiem Commit changes.
6. Wejdź w Settings → Pages.
7. W sekcji Build and deployment wybierz Source: Deploy from a branch.
8. W Branch wybierz main oraz folder /(root), a następnie Save.
9. Poczekaj, aż GitHub opublikuje stronę. Adres będzie zwykle podobny do:
   https://TWOJ_LOGIN.github.io/kody-lokalizacje/
   Otwórz dokładny adres wyświetlony w Settings → Pages. Nie używaj przykładowego adresu dosłownie.
10. Otwórz ten adres w Safari na iPhonie. Naciśnij „Uruchom aparat” i zaakceptuj prośbę o dostęp do aparatu.

DODANIE DO EKRANU POCZĄTKOWEGO IPHONE'A
1. Otwórz opublikowaną stronę w Safari (nie w przeglądarce wewnątrz aplikacji).
2. Naciśnij przycisk Udostępnij (kwadrat ze strzałką w górę).
3. Przewiń menu i wybierz „Dodaj do ekranu początkowego”.
4. Jeśli pojawi się opcja „Otwórz jako aplikację internetową”, włącz ją.
5. Naciśnij „Dodaj”. Ikona pojawi się na ekranie początkowym.
6. Uruchamiaj aplikację z tej ikony. Przy pierwszym skanowaniu zezwól na aparat.

JAK UŻYWAĆ
1. Wpisz lokalizację, np. A-01-02.
2. Naciśnij Uruchom aparat i zeskanuj kod.
3. Wpisz ilość (domyślnie 1).
4. Naciśnij Dodaj pozycję.
5. Zeskanuj kolejny kod; zmień lokalizację, gdy przejdziesz do innego miejsca.
6. Naciśnij Eksportuj TXT. W iOS plik zwykle trafia do Pobranych lub otwiera się podgląd/udostępnianie; wybierz Zapisz w Plikach, jeśli pojawi się arkusz udostępniania.

FORMAT EKSPORTU
Lokalizacja,kod kreskowy,ilość
A-01-02,5901234123457,4
A-01-02,5901234123464,2

Jeżeli aparat nie działa:
- upewnij się, że adres zaczyna się od https://,
- otwórz stronę w Safari,
- sprawdź Ustawienia iPhone'a → Aplikacje → Safari → Aparat (jeśli dostępne) lub ustawienia witryny w Safari,
- sprawdź, czy działa internet (biblioteka skanera pobierana jest z CDN),
- odśwież stronę i uruchom aparat ponownie.
