# Fox Burger — aplikacja mobilna

Aplikacja do zamawiania z odbiorem osobistym i program lojalnościowy Fox Club. Pierwsza restauracja na platformie gastro: kod jest wspólny, a wszystko, co dotyczy Foxa, siedzi w jednym pliku konfiguracji.

## Uruchomienie (Expo Go)

Na Windowsie najprościej: dwuklik w **`Uruchom.bat`** (pobiera zmiany, w razie potrzeby instaluje biblioteki, co 15 s dociąga nowe zmiany w tle i startuje Expo). Ręcznie:

Wymagany Node.js 22+.

```bash
cd app
npm install
npx expo start
```

Zeskanuj kod QR w aplikacji Expo Go (Android) albo aparatem (iPhone). Telefon i komputer w tej samej sieci Wi-Fi; jeśli się nie łączy: `npx expo start --tunnel`.

## Gdzie co jest

- `app/src/tenant/fox.ts` — dane restauracji: kolory, logo, lokale, menu, ceny, baner. **Ceny dodatków, zestawu, frytek i napojów są przykładowe — do potwierdzenia z Foxem.**
- `app/src/app/` — ekrany (Expo Router): Start, Menu, Mój kod, Promocje, Konto, produkt, koszyk, status zamówienia.
- `app/src/cart/`, `app/src/loyalty/`, `app/src/orders/` — logika (koszyk, kod lojalnościowy, godziny odbioru, statusy) z testami w `app/src/__tests__/`.

## Etap 1 = demo

Płatność jest udawana, status zamówienia sam przechodzi przez etapy (10 s / 40 s), kod lojalnościowy i pieczątki są demonstracyjne. API, panel admina i aplikacja „Zamówienia” dla lokalu to kolejne etapy.

## Sprawdzenie

```bash
cd app
npm test          # testy logiki
npx tsc --noEmit  # typy
```
