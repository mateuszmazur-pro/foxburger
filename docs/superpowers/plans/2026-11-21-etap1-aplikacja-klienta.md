# Etap 1 — aplikacja klienta Fox Burger — plan wdrożenia

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Działające w Expo Go demo aplikacji Fox Burger: Start, Menu, Produkt, Koszyk, Status, Mój kod, z prawdziwym koszykiem i udawaną płatnością.

**Architecture:** Jedna aplikacja Expo Router w `app/`. Wszystko, co dotyczy restauracji, w `app/src/tenant/fox.ts` (typ `Tenant`). Logika koszyka i kodu lojalnościowego jako czyste funkcje z testami; ekrany tylko je wyświetlają.

**Tech Stack:** Expo (SDK zgodny z bieżącym Expo Go), React Native, TypeScript, Expo Router, react-native-svg, react-native-qrcode-svg, @expo-google-fonts/plus-jakarta-sans, jest-expo.

**Spec:** `docs/superpowers/specs/2026-11-21-etap1-aplikacja-klienta-design.md`

## Global Constraints
- Kolory i czcionka wyłącznie z `theme` budowanego z `tenant` — zero hexów w ekranach.
- Kwoty w groszach (`number`, całkowite); formatowanie `formatPLN(4300) === "43 zł"`, `formatPLN(4350) === "43,50 zł"`.
- Teksty UI po polsku; powitanie „Witaj, {imię}!”.
- Tylko odbiór osobisty.
- Dotykowe cele ≥ 44 px.

## Review Focus
1. Pusty koszyk — ekran Koszyk pokazuje stan pusty z przyciskiem „Przejdź do menu”, pasek koszyka w Menu znika.
2. Zmniejszenie ilości do 0 usuwa linię; licznik w Menu wraca do „+”.
3. Ten sam burger z różnymi dodatkami/uwagami = dwie linie; z identycznymi = jedna linia, ilość rośnie.
4. Kod lojalnościowy na granicy minuty zmienia się dokładnie raz; licznik nie pokazuje ujemnych sekund.
5. Mały ekran (667 px wysokości): Start bez nachodzenia — zdjęcie burgera się kurczy, przycisk zostaje nad belką.

---

### Task 1: Szkielet projektu, motyw i konfiguracja Fox

**Files:**
- Create: `app/` (create-expo-app, szablon tabs usunięty do minimum), `app/src/tenant/types.ts`, `app/src/tenant/fox.ts`, `app/src/tenant/index.ts`, `app/src/theme.ts`, `app/src/format.ts`, `app/assets/fox-logo.svg.ts` (logo jako string SVG), `app/assets/burger-tygodnia.jpg`, `README.md`
- Test: `app/src/__tests__/tenant.test.ts`, `app/src/__tests__/format.test.ts`

**Interfaces:**
- Produces: `type Tenant = { id; name; colors: {bg; card; text; muted; brand; brandDark; brandLight; navActive; dark}; logoSvg: string; locations: Location[]; categories: Category[]; products: Product[]; banner: BannerSlide[]; loyalty: { stampsToReward: number } }`; `Product = { id; name; description; ingredients: string[]; price: number; categoryId; image; addons: Addon[]; setUpgrade?: { label: string; price: number } }`; `Addon = { id; name; price: number }`; `export const tenant: Tenant`; `export const theme`; `formatPLN(grosze: number): string`.

- [ ] **Step 1: Testy** — `tenant.test.ts`: każdy produkt ma `price > 0`, `categoryId` istnieje w `categories`, co najmniej 1 lokal, ceny Foxa: Fox Farmer 3900, Sulejowska Buła 3500. `format.test.ts`: `formatPLN(3900) === "39 zł"`, `formatPLN(3950) === "39,50 zł"`, `formatPLN(0) === "0 zł"`.
- [ ] **Step 2:** `cd app && npx jest` → FAIL (brak modułów).
- [ ] **Step 3:** Utwórz projekt (`npx create-expo-app@latest app --template blank-typescript`, dodaj expo-router), pliki tenant/theme/format. Dodatki i zestaw z cenami przykładowymi oznaczonymi komentarzem `// PRZYKŁADOWE — do potwierdzenia z Foxem`.
- [ ] **Step 4:** `npx jest` → PASS; `npx tsc --noEmit` → bez błędów.
- [ ] **Step 5:** Commit `feat: szkielet aplikacji, motyw i konfiguracja Fox Burger`.

### Task 2: Logika koszyka

**Files:**
- Create: `app/src/cart/cart.ts`, `app/src/cart/CartContext.tsx`
- Test: `app/src/__tests__/cart.test.ts`

**Interfaces:**
- Consumes: `Product`, `Addon` z Task 1.
- Produces: `type CartLine = { key: string; productId; qty: number; addonIds: string[]; asSet: boolean; note: string }`; `cartReducer(state: CartLine[], action)` z akcjami `add {productId, addonIds?, asSet?, note?, qty?}`, `setQty {key, qty}`; `lineKey(productId, addonIds, asSet, note): string` (addonIds sortowane, note przycięte); `lineTotal(line, products): number`; `cartTotal(lines, products): number`; `cartCount(lines): number`; `qtyForProduct(lines, productId): number` (suma linii bez dodatków); `useCart()` → `{ lines, add, setQty, total, count, clear }`.

- [ ] **Step 1: Testy** — add tego samego produktu 2× bez dodatków → 1 linia, qty 2; ten sam produkt z addonem → 2 linie; `setQty` na 0 usuwa linię; `lineTotal` Fox Farmer + addon 1200 + zestaw 1500, qty 2 → `2*(3900+1200+1500)`; notatka „ bez cebuli ” i „bez cebuli” → ta sama linia; `cartCount` sumuje qty; pusty koszyk → total 0, count 0.
- [ ] **Step 2:** `npx jest cart` → FAIL.
- [ ] **Step 3:** Implementacja reducera i Contextu.
- [ ] **Step 4:** `npx jest` → PASS.
- [ ] **Step 5:** Commit `feat: koszyk`.

### Task 3: Kod lojalnościowy

**Files:**
- Create: `app/src/loyalty/code.ts`
- Test: `app/src/__tests__/code.test.ts`

**Interfaces:**
- Produces: `loyaltyCode(customerId: string, nowMs: number): string` (format `XXXX-XXXX`, alfanumeryczny bez 0/O/1/I), `secondsToRefresh(nowMs: number): number` (1–60).

- [ ] **Step 1: Testy** — ten sam kod dla 12:00:05 i 12:00:59; inny dla 12:01:00; format `/^[A-HJ-NP-Z2-9]{4}-[A-HJ-NP-Z2-9]{4}$/`; `secondsToRefresh` dla 12:00:59.500 → 1, dla 12:01:00.000 → 60, nigdy < 1.
- [ ] **Step 2:** FAIL → **Step 3:** implementacja (hash FNV-1a z `customerId + minuta`) → **Step 4:** PASS → **Step 5:** commit `feat: rotujący kod lojalnościowy`.

### Task 4: Nawigacja, belka i ekran Start

**Files:**
- Create: `app/app/_layout.tsx` (fonty, CartProvider, Stack), `app/app/(tabs)/_layout.tsx` (Tabs z własną `TabBar`), `app/src/components/TabBar.tsx`, `app/src/components/ToothedHeader.tsx`, `app/src/components/PrimaryButton.tsx`, `app/app/(tabs)/index.tsx` (Start), `app/app/(tabs)/promocje.tsx`, `app/app/(tabs)/konto.tsx`

**Interfaces:**
- Consumes: `tenant`, `theme`, `useCart`.
- Produces: `<PrimaryButton label onPress icon?>`, `<TabBar>` (5 zakładek: Start, Menu, Mój kod, Promocje, Konto; aktywny `navActive`), `<ToothedHeader height=137 toothWidth=26 toothDepth=12>` z wcięciem pod środkiem i logo 162 px wiszącym na krawędzi.

- [ ] **Step 1:** Zbuduj ekrany wg kanwy (Nagłówek 5): ikona QR (→ Mój kod) i koszyk w nagłówku, „Witaj, Mateusz!\nZamów swojego Foxa.”, zdjęcie burgera `flex: 1`, przycisk „Zamów z odbiorem własnym” (→ Menu), pod nim „Odbiór: {lokal} · zmień” (otwiera listę lokali z `tenant.locations`, wybór zapisany w stanie aplikacji).
- [ ] **Step 2:** `npx tsc --noEmit` → OK; `npx expo export --platform web` → build OK.
- [ ] **Step 3:** Commit `feat: nawigacja, belka i ekran Start`.

### Task 5: Menu

**Files:**
- Create: `app/app/(tabs)/menu.tsx`, `app/src/components/BannerCarousel.tsx`, `app/src/components/MenuRow.tsx`, `app/src/components/QtyStepper.tsx`, `app/src/components/CartBar.tsx`

**Interfaces:**
- Consumes: `tenant.banner`, `tenant.categories`, `tenant.products`, `useCart().add/setQty`, `qtyForProduct`.
- Produces: `<QtyStepper qty onInc onDec size="sm"|"lg">`, `<CartBar>` (widoczny gdy `count > 0`, → Koszyk).

- [ ] **Step 1:** Baner: poziomy `FlatList` z `pagingEnabled`, auto-przewijanie co 6 s, pauza po dotknięciu, kropki. Zakładki słowne z podkreśleniem `brand`. Wiersz: nazwa → Produkt; „+” dodaje 1 szt. bez dodatków; potem licznik.
- [ ] **Step 2:** `tsc` + `expo export` → OK. **Step 3:** Commit `feat: ekran Menu`.

### Task 6: Produkt i Koszyk

**Files:**
- Create: `app/app/produkt/[id].tsx`, `app/app/koszyk.tsx`, `app/src/components/EmptyState.tsx`

- [ ] **Step 1:** Produkt (wariant A): zdjęcie, nazwa + cena, opis, etykiety składu, dodatki (checkbox), karta „Zrób z tego zestaw” (przełącznik), „Uwagi do zamówienia” (multiline), dolny pasek: licznik + „Dodaj · {suma}” → `add(...)` i powrót.
- [ ] **Step 2:** Koszyk: adres lokalu, „Jak najszybciej (ok. 20 min)” / „Na godzinę” (wybór godziny co 15 min od teraz+30 min do zamknięcia 21:00), linie z miniaturą, dodatkami, uwagami i licznikiem, „Dodaj coś jeszcze”, pasek „+1 pieczątka w Fox Club”, płatność BLIK / Apple Pay (iOS) lub Google Pay (Android) / Karta, podsumowanie, „Zamawiam i płacę · {suma}”. Pusty koszyk → `EmptyState` „Twój koszyk jest pusty” + „Przejdź do menu”.
- [ ] **Step 3:** `tsc` + `expo export` → OK. **Step 4:** Commit `feat: produkt i koszyk`.

### Task 7: Status zamówienia i Mój kod

**Files:**
- Create: `app/src/orders/OrdersContext.tsx`, `app/app/zamowienie/[id].tsx`, `app/app/(tabs)/kod.tsx`
- Test: `app/src/__tests__/orderStatus.test.ts`

**Interfaces:**
- Produces: `statusAt(createdMs: number, nowMs: number): "przyjete"|"przygotowanie"|"gotowe"` (demo: 0–10 s przyjęte, 10–40 s przygotowanie, potem gotowe); `useOrders().place(lines, pickup) → orderId`.

- [ ] **Step 1: Testy** `statusAt`: 0 s → przyjete, 10 s → przygotowanie, 39,9 s → przygotowanie, 40 s → gotowe.
- [ ] **Step 2:** FAIL → **Step 3:** implementacja + ekrany: Status (godzina odbioru, oś statusów, lokal z „Nawiguj” (otwiera mapy) i „Zadzwoń”, podsumowanie); Mój kod (QR z `loyaltyCode`, odświeżanie co sekundę, pasek postępu, pieczątki 7/10 jako kropki). „Zamawiam i płacę” czyści koszyk i przechodzi do Statusu.
- [ ] **Step 4:** `npx jest` PASS, `tsc`, `expo export` OK. **Step 5:** Commit `feat: status zamówienia i mój kod`.

### Task 8: Uruchomienie i README

- [ ] **Step 1:** `README.md`: jak uruchomić (`cd app && npm install && npx expo start`), Expo Go, gdzie zmienić dane restauracji (`app/src/tenant/fox.ts`).
- [ ] **Step 2:** Pełna weryfikacja: `npx jest`, `npx tsc --noEmit`, `npx expo export --platform web`. **Step 3:** Commit i push.
