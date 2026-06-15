# Artefakt 1 — Mapa terytorium (historia gita)

Analiza oparta o historię gita, zakres: **ostatnie 12 miesięcy** (2025-06-11 → 2026-06-11).
Baza: **1507 commitów**, ~16 700 zmian plików.

Filtry szumu: lockfile'y, `*.snap`, `api-report.api.md`, `package.json` (bumpy wersji),
`version.ts`, `lerna.json`, `locales-compiled/*` i tłumaczenia per-język.

---

## 1. Gdzie projekt był realnie dotykany (TOP, hands-on)

### a) Foldery / moduły (depth 3, po odfiltrowaniu szumu)

| # | Obszar | Zmiany | Czym jest |
|---|--------|-------:|-----------|
| 1 | `apps/dotcom/client` | ~3366 | Aplikacja tldraw.com (frontend) — **uwaga: mocno zawyżone** przez tłumaczenia i nieżyjący już `fairy` (patrz §5) |
| 2 | `packages/tldraw/src` | 1757 | Pełny SDK: domyślne UI, kształty, narzędzia |
| 3 | `apps/examples/src` | 1297 | Przykłady i dema SDK |
| 4 | `packages/editor/src` | 751 | Rdzeń edytora (canvas, bez domyślnych kształtów/UI) |
| 5 | `apps/docs/content` | 566 | Treść dokumentacji (tldraw.dev) |
| 6 | `apps/docs/public` | 512 | Assety docs (głównie Q2, w dużej części wokół fairy) |
| 7 | `packages/fairy-shared/src` | 491 | **Usunięty** pakiet feature'u fairy (patrz §5) |
| 8 | `apps/examples/e2e` | 388 | Testy e2e przykładów |
| 9 | `apps/dotcom/sync-worker` | 323 | Backend multiplayer (Cloudflare Durable Objects) |
| 10 | `packages/tlschema/src` | 228 | Definicje i walidatory schematu (kształty, bindingi, migracje) |

Po zejściu poziom niżej (realne pod-obszary hands-on):

- **`packages/tldraw/src`** → `lib/ui` (610), `lib/shapes` (454), `lib/tools` (192).
  To jest serce SDK: UI, kształty, narzędzia.
- **`packages/editor/src`** → rdzeń wokół `Editor.ts` i managerów.
- **`apps/dotcom/client`** → realnie żywe: `src/tla` (660, aplikacja "tldraw app"),
  `src/pages`, `src/utils`. Reszta licznika to `public/tla` (tłumaczenia) i `src/fairy` (martwe).

### b) Pojedyncze pliki (hands-on, po odfiltrowaniu bumpów wersji)

| # | Plik | Zmiany |
|---|------|-------:|
| 1 | `packages/editor/src/lib/editor/Editor.ts` | 81 |
| 2 | `packages/tldraw/src/index.ts` (barrel public API) | 55 |
| 3 | `apps/dotcom/client/src/tla/components/TlaEditor/TlaEditor.tsx` | 48 |
| 4 | `apps/dotcom/client/public/tla/locales/en.json` (źródło tłumaczeń dotcom) | 46 |
| 5 | `packages/editor/src/index.ts` (barrel public API) | 42 |
| 6 | `internal/scripts/deploy-dotcom.ts` | 36 |
| 7 | `packages/tldraw/src/lib/ui/context/actions.tsx` | 34 |
| 8 | `apps/dotcom/client/src/tla/app/TldrawApp.ts` | 34 |
| 9 | `apps/dotcom/sync-worker/src/TLDrawDurableObject.ts` | 30 | **(już nie istnieje — patrz §5)** |
| 10 | `packages/tldraw/src/lib/ui/hooks/useTranslation/defaultTranslation.ts` | 28 |
| – | `assets/translations/main.json` | 28 |
| – | `ArrowShapeUtil.tsx` / `NoteShapeUtil.tsx` / `GeoShapeUtil.tsx` | 27 / 26 / 25 |

**`Editor.ts` to bezdyskusyjne epicentrum** — God-class rdzenia, dotykany 81×, ~2× częściej
niż jakikolwiek inny plik źródłowy.

---

## 2. Jak zmieniał się nacisk pracy (per kwartał)

| Kwartał | Dominujące obszary | Charakter |
|---------|--------------------|-----------|
| **Q1** Cze–Wrz 25 | `tldraw/src` (496), `editor/src` (172), `dotcom/client` (193) | **Praca nad rdzeniem SDK** — kształty, edytor, narzędzia |
| **Q2** Wrz–Gru 25 | `dotcom/client` (**1531**), `docs/public` (485), `fairy-shared` (412) | **Eksplozja dotcom + narodziny "fairy"** — duży push produktowy/AI |
| **Q3** Gru 25–Mar 26 | `examples/src` (**724**), `dotcom/client` (434), `docs/content` (258) | **Dokumentacja i przykłady** + szablony `templates/agent` |
| **Q4** Mar–Cze 26 | `tldraw/src` (598), `editor/src` (288), `examples/src` (314) | **Powrót do rdzenia SDK** — konsolidacja, polish |

Narracja: rdzeń SDK (Q1) → wielki skok produktowy dotcom/fairy (Q2) → faza
docs/examples/templates (Q3) → ponowne skupienie na SDK (Q4). Praca oscyluje między
**SDK-core** a **dotcom-product**.

---

## 3. Współzmiany — co zmienia się razem (sprzężenia)

Pary katalogów najczęściej w tych samych commitach (pominięto bumpy `package.json`):

| Para | Wspólne commity | Wniosek |
|------|----------------:|---------|
| `editor/src` ↔ `tldraw/src` | **169** | Najsilniejsze sprzężenie repo. `tldraw` jest zbudowany na `editor`; zmiany w rdzeniu rozlewają się na warstwę SDK. Zmieniając jedno, niemal zawsze rusza się drugie. |
| `dotcom/client` ↔ `tldraw/src` | 97 | Aplikacja konsumuje SDK — zmiany API SDK ciągną za sobą klienta. |
| `dotcom/client` ↔ `editor/src` | 76 | Klient sięga też po prymitywy edytora. |
| `dotcom/client` ↔ `dotcom/sync-worker` | 76 | **Sprzężenie full-stack** — frontend + worker multiplayer zmieniają się razem (feature'y wymagają obu warstw). |
| `examples/src` ↔ `tldraw/src` | 54 | Przykłady śledzą zmiany SDK. |
| `examples/e2e` ↔ `tldraw/src` | 49 | Testy e2e śledzą zmiany SDK. |

**Wnioski dla TOP 3 z rankingu §1:**

1. **`dotcom/client`** — sprzężony jednocześnie z SDK (`tldraw/src` 97, `editor/src` 76)
   **i** z własnym backendem (`sync-worker` 76). To węzeł integrujący — najbardziej narażony
   na efekty zmian z dwóch stron (kontrakt SDK + kontrakt sync).
2. **`tldraw/src`** — sprzężony "w dół" z `editor/src` (169) i "w górę" z konsumentami
   (`dotcom/client`, `examples`). Warstwa pośrednia, przez którą wszystko przepływa.
3. **`examples/src`** — sprzężony niemal wyłącznie z `tldraw/src`. To "kanarek API":
   gdy zmienia się publiczne API SDK, przykłady muszą za nim nadążyć.

---

## 4. Wspólny mianownik — pliki spinające całe repo

Dwie kategorie plików, które zmieniają się razem z wieloma różnymi obszarami:

- **Barrel'e public API:** `packages/tldraw/src/index.ts` (55) i `packages/editor/src/index.ts` (42).
  Każdy nowy publiczny eksport dotyka tych plików → pojawiają się przy zmianach w dowolnym
  pod-module SDK. Ich generowane lustro to `api-report.api.md` (regeneruje się przy każdej
  zmianie API — czysty szum).
- **Tłumaczenia:** `assets/translations/main.json` + `defaultTranslation.ts` +
  `TLUiTranslationKey.ts` (SDK), oraz `apps/dotcom/client/.../locales/en.json` (dotcom).
  Każdy feature z tekstem w UI dotyka tłumaczeń — to mianownik "wspólny dla całego repo"
  ponad podziałem na foldery.
- **Pliki konfiguracyjne sweepów:** `.prettierignore`, `.oxlintrc.json`, `eslint.config.mjs`
  pojawiają się przy 60–76 różnych obszarach — ale to artefakt **commitów-zamiataczy**
  (formatowanie/lint całego repo), nie realne sprzężenie domenowe. Traktować jako szum.

---

## 5. ⚠️ Pułapki historii — pliki, których już NIE MA

Historia ≠ stan obecny. Najwyżej-rankingowane obszary z churnu są częściowo **martwe**:

- **`fairy` — feature usunięty w całości.** Cały `apps/dotcom/client/src/fairy` (1354 zmian!)
  + pakiet `packages/fairy-shared/src` (491) + `apps/dotcom/fairy-worker` zostały skasowane
  commitem **`46ff8124b "chore: remove fairy feature (#7809)"` z 2026-02-05**. W repo zostało
  tylko **5 plików migracji SQL** (`zero-cache/migrations/*fairy*`). To był ogromny push Q2,
  który zawyża licznik `apps/dotcom/client` na 1. miejscu w rankingu — ale **dziś to kod
  nieistniejący**. Nie opierać dalszej analizy na fairy.
- **`apps/dotcom/sync-worker/src/TLDrawDurableObject.ts` (30 zmian) — już nie istnieje.**
  Durable Object został rozbity/zmieniony nazwę; dziś żyją `TLFileDurableObject.ts`,
  `TLUserDurableObject.ts`, `TLStatsDurableObject.ts`, `TLLoggerDurableObject.ts`.

**Pliki silnie sprzężone, które POTWIERDZONO że nadal istnieją:**
`Editor.ts`, `tldraw/src/index.ts`, `editor/src/index.ts`, `TlaEditor.tsx`, `TldrawApp.ts`,
`ArrowShapeUtil.tsx`, `assets/translations/main.json`, `locales/en.json`.

---

## 6. Stan obecny vs. historia (sanity check)

Rozkład **żyjących** plików w repo (git ls-files, bez locale/snap/api-report/json):

| Obszar | Pliki | Komentarz |
|--------|------:|-----------|
| `apps/examples/src` | 569 | Najwięcej żywych plików — biblioteka przykładów |
| `packages/tldraw/src` | 516 | Rdzeń SDK |
| `apps/dotcom/client` | 358 | **Spadek vs. churn** — po wycięciu fairy obszar jest dużo mniejszy niż sugeruje historia |
| `packages/editor/src` | 223 | Rdzeń edytora |
| `apps/docs/content` | 135 | Dokumentacja |
| `apps/dotcom/sync-worker` | 88 | Backend multiplayer |

Wniosek: realne, żywe centra grawitacji projektu to **`packages/tldraw/src` + `packages/editor/src`
(rdzeń SDK)** oraz **`apps/examples/src` (przykłady)**. `apps/dotcom/client` pozostaje ważny,
ale jego ranking w churnie jest mocno zawyżony przez nieżyjącego już `fairy`.
