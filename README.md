# Fox Burger — aplikacja mobilna

Aplikacja do zamawiania z odbiorem osobistym i program lojalnościowy Fox Club. Pierwsza restauracja na platformie gastro. Wszystko, co dotyczy Foxa, siedzi w folderze `app/brand/` — projekt można zduplikować pod inną restaurację jedną komendą.

## Uruchomienie (Expo Go)

Wymagany Node.js 22+.

```bash
cd app
npm install
npx expo start
```

Zeskanuj kod QR w aplikacji Expo Go (Android) albo aparatem (iPhone). Telefon i komputer w tej samej sieci Wi-Fi; jeśli się nie łączy: `npx expo start --tunnel`.

## Gdzie co jest

- `app/brand/` — **wszystko, co dotyczy tej restauracji**: nazwa, identyfikator, kolory (`brand.json`), logo (`logo.svg`), ikony, zdjęcia, lokale i menu (`restauracja.ts`). Opis plików: `app/brand/README.md`. **Ceny dodatków, zestawu, frytek i napojów są przykładowe — do potwierdzenia z Foxem.**
- `app/src/app/` — ekrany (Expo Router): Start, Menu, Mój kod, Promocje, Konto, produkt, koszyk, status zamówienia.
- `app/src/cart/`, `app/src/loyalty/`, `app/src/orders/` — logika (koszyk, kod lojalnościowy, godziny odbioru, statusy) z testami w `app/src/__tests__/`.

## Nowa apka dla innej restauracji

```bash
cd app
npm run nowa-apka -- "Kowal Burger"
# opcjonalnie: --folder ~/Projekty/kowal-burger  --id pl.kowalburger.app  --bez-git
```

Skrypt robi obok niezależną kopię całego projektu (bez `node_modules` i historii git), ustawia nazwę, slug i identyfikator aplikacji i robi pierwszy commit. Potem podmieniasz pliki w `app/brand/` nowej kopii. Każda kopia żyje osobno — zmiany w jednej nie dotykają innych.

## Etap 1 = demo

Płatność jest udawana, status zamówienia sam przechodzi przez etapy (10 s / 40 s), kod lojalnościowy i pieczątki są demonstracyjne. API, panel admina i aplikacja „Zamówienia” dla lokalu to kolejne etapy.

## Sprawdzenie

```bash
cd app
npm test          # testy logiki
npx tsc --noEmit  # typy
```
