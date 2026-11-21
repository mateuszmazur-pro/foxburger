# Etap 1 — aplikacja klienta Fox Burger (demo) — projekt

## Po co
Działające demo aplikacji mobilnej Fox Burger do pokazania właścicielowi na telefonie (Expo Go), zanim podpisze umowę. Jednocześnie pierwszy klient platformy gastro: kod od początku jest wspólny dla wielu restauracji, a Fox to jedna konfiguracja.

## Cele
- Wszystkie ekrany uzgodnione na kanwie (https://claude.ai/artifact/QVvRJWYuf4K9QxvQueckyr): Start (nagłówek z ząbkami + logo), Menu (baner, zakładki słowne, lista z plusikami, pasek koszyka), Produkt (wariant A: zdjęcie, skład, dodatki, „Zrób z tego zestaw”, uwagi), Koszyk, Status zamówienia, Mój kod.
- Prawdziwy koszyk: dodawanie z listy (plus → licznik), z ekranu produktu z dodatkami/zestawem/uwagami, zmiana ilości, sumy.
- Płatność udawana: „Zamawiam i płacę” tworzy lokalne zamówienie i przechodzi do statusu, który sam przesuwa się po etapach (demo).
- Mój kod: kod QR zmieniający się co 60 s, licznik do odświeżenia, karta pieczątek 7/10 (dane demo).

## Nie-cele (etap 1)
API, baza, panel admina, logowanie, prawdziwe płatności, powiadomienia push, aplikacja „Zamówienia” na tablet, publikacja w sklepach.

## Anty-cele
- Nic, co jest specyficzne dla Foxa, nie jest zaszyte w komponentach — wszystko z pliku konfiguracji restauracji.
- Demo nie może się wysypać na spotkaniu: pusty koszyk, zero sztuk, długie nazwy i mały ekran (iPhone SE) muszą działać.

## Ograniczenia
- Expo (SDK zgodny z aktualnym Expo Go) / React Native / TypeScript / Expo Router — ten sam stos co projekt Polska.
- Czcionka Plus Jakarta Sans. Kolory: tło `#F8F3F0`, karty `#FFFFFF`, tekst `#1C1917`, tekst pomocniczy `#78716C`, akcent marki `#AD0000`, ciemniejszy akcent `#8A0000`, jasny akcent `#FBE6E4`, aktywna zakładka w belce `#FDBA74`, belka i nagłówek `#1C1917`.
- Teksty po polsku. Powitanie: „Witaj, Mateusz!” / „Witaj!”.
- Fox: tylko odbiór osobisty (bez dostawy). Lokale: Pabianice (Popławska 4/20), Łódź, Opoczno (ul. Gen. Kazimierza Bończy-Załęskiego 29A), Sulejów (Polana, foodtruck).
- Ceny burgerów (Pabianice): Sulejowska Buła 35, Fox Burger Cheese 36, Fox Double Cheese 38, Fox Sausage 39, Fox Farmer 39 zł. Ceny dodatków i zestawu nieznane — w konfiguracji jako PRZYKŁADOWE, do potwierdzenia z Foxem.

## Podejścia (rozważone)
1. **Jedna aplikacja + plik konfiguracji restauracji (wybrane).** Komponenty czytają kolory, logo, lokale i menu z `tenant`. Kolejna restauracja = nowy plik konfiguracji + osobny build EAS.
2. Osobny projekt na restaurację — odrzucone: 100 kopii kodu.
3. Od razu menu z API — odrzucone na etap 1: spowalnia demo; dane wejdą w etapie 2 przez ten sam typ `Tenant`.

## Decyzje
- Nawigacja: Expo Router, zakładki Start / Menu / Mój kod / Promocje / Konto (pływająca ciemna belka); Produkt, Koszyk, Status jako ekrany nad zakładkami.
- Stan koszyka: czysty reducer w `src/cart` (testowany) + React Context. Ta sama pozycja z innymi dodatkami/uwagami = osobna linia.
- Kod lojalnościowy: deterministyczny z (id klienta, numer minuty), demo bez kryptografii.

## Dla wykonawcy
Układ, odstępy i kolory — wg kanwy. Promocje i Konto: proste ekrany-zaślepki w stylu aplikacji.
