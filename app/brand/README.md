# brand/ — wszystko, co odróżnia tę restaurację od innych

Nowa apka = kopia całego projektu (`npm run nowa-apka -- "Nazwa"`) + podmiana plików w tym folderze.
Poza `brand/` niczego nie trzeba ruszać.

| Plik | Co to jest | Uwagi |
|---|---|---|
| `brand.json` | nazwa w sklepach, slug, identyfikator aplikacji, kolory | identyfikator (np. `pl.foxburger.app`) po publikacji w sklepach jest na zawsze |
| `logo.svg` | logo w nagłówku aplikacji | SVG z `viewBox`; proporcje liczą się same |
| `ikona.png` | ikona aplikacji (iPhone i sklepy) | 1024×1024 px, bez przezroczystości |
| `android-ikona-przod.png` | ikona Android — warstwa z logo | 512×512 px, logo w środkowych ~66%, przezroczyste tło |
| `android-ikona-tlo.png` | ikona Android — tło | 512×512 px |
| `android-ikona-mono.png` | ikona Android — wersja jednokolorowa | 432×432 px, białe logo na przezroczystym |
| `ikona-ekranu-startowego.png` | logo na ekranie startowym | 1024×1024 px, przezroczyste tło |
| `favicon.png` | ikonka wersji web | 48×48 px |
| `restauracja.ts` | lokale, menu, ceny, dodatki, banery, program lojalnościowy, teksty | ceny w groszach: `3900` = 39,00 zł |
| `zdjecia/` | zdjęcia produktów i banerów | podpinane w `restauracja.ts` przez `require('./zdjecia/…')` |

## Kolory (`brand.json` → `kolory`)

- `brand` — główny kolor akcentu (przyciski, ceny), `brandDark` — ciemniejszy, `brandLight` — jasne tło akcentu
- `bg` — tło ekranów, `card` — karty, `text` / `muted` — tekst główny i szary, `line` — linie
- `dark` — ciemny nagłówek i pasek, `navActive` / `navIdle` — aktywna i nieaktywna zakładka
- `stampOn` — zebrana pieczątka
- `kolorEkranuStartowego`, `kolorTlaIkonyAndroid` — tło ekranu startowego i ikony Android

## Po zmianach

```bash
npm test          # sprawdza brand/: kolory, identyfikator, pliki ikon, menu, banery
npx expo start    # podgląd na telefonie
```
