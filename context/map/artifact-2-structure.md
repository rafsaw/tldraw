# Artefakt 2 — Mapa strukturalna (dependency-cruiser)

Analiza grafu zależności dla aktywnych obszarów repo (ostatnie 12 miesięcy, odniesienie: artifact-1-territory.md).

**Zakresy:** `packages/editor/src`, `packages/tldraw/src`, `apps/dotcom/client/src/tla`
**Narzędzie:** dependency-cruiser v17.4.3
**Status cykli:** ✅ Brak cykli (0 circular dependencies znalezione w 2388 modułach, 7633 zależnościach)

---

## TL;DR — TOP 5 obserwacji

1. **Editor.ts to epicentrum (253+ importów)** — God-class rdzenia, każdy manager, każda komponent zanosi się do niego. Stanowi punkt sprzężenia dla całej funkcjonalności edytora. Testowanie wymaga albo `TestEditor` wrappera (158 plików go importuje), albo full mocking 14+ managerów.

2. **14+ managerów ściśle sprzężonych w konstruktorze Editor** — `HistoryManager`, `SnapManager`, `SpatialIndexManager`, `TextManager`, `InputsManager`, itd. Wzajemne zależności między managerami oznaczają, że zmiana jednego może zranić inne. Brak izolacji testowej bez wrapperów.

3. **ShapeUtil i StateNode to wzory dobrze izolowane** — 72+ shape utils (Arrow, Geo, Text, Draw, Frame...) są niezależne, łatwe do testowania, minimal coupling. To jedno z najlepiej zaprojektowanych fragmentów repo. Analogicznie tools (SelectTool, EraserTool, itd.) — każdy to StateNode, testuje się event dispatch, zero mockowania managerów.

4. **Dotcom useAppState to drugi god-hook (51+ importów)** — Sprzężone z file service, auth state, sync layerem (@rocicorp/zero, @tldraw/sync-core). Prawie niemożliwe testowanie komponentów dotcom bez mockowania całej aplikacyjnej maszyny stanów. Bardziej problematyczne niż Editor, bo brak `TestAppState` wrappera.

5. **Brak cykli, czysty flow pakietów: editor → tldraw → dotcom** — Warstwa `@tldraw/editor` (rdzeń) nie importuje z `@tldraw/tldraw` (domyślne kształty/UI), tldraw nie sięga do dotcom. Architektura jest prawidłowa; problemy to testabilność, nie struktura.

---

## 1. DEPENDENCY HUBS — Pliki silnie importowane

### packages/editor/src

| Moduł | Importowany przez | Zazwyczaj import | Cel | Ryzyka |
|-------|-------------------|-------------------|-----|--------|
| **Editor.ts** | 253+ | `useEditor()` context hook lub bezpośrednio `Editor` (singleton) | Centralny singleton zarządzający store, managerami, renderowaniem | **KRYTYCZNE** — każda zmiana w API Editor propaguje do 253+ miejsc. Brak izolacji testowej. Wymaga TestEditor wrapper. |
| **useEditor** hook | 30+ | `const editor = useEditor()` (React context) | Konsument rdzenia Editor w komponentach | Umiarkowane — dobra abstrakcja via React context. Komponenty testują się z contextowym mockiem. |
| **ShapeUtil** | 72+ | `class MyShapeUtil extends ShapeUtil<T>` | Abstrakcyjna baza dla każdego typu kształtu (Arrow, Geo, Text, Draw, Frame, Bookmark, Embed, Image, Video, Note, Line, Highlight) | Doskonałe — każdy shape util jest niezależny. Geometria, rendering, handles — zhermetyzowane per-shape. |
| **StateNode** | 11+ | `class MyTool extends StateNode` | Baza dla state machine (tools, dialog states) | Dobre — StateNode jest event-driven. Testuje się dispatch event. Brak globalnego state'u. |
| **BindingUtil** | 6+ | `class ArrowBindingUtil extends BindingUtil` | Relacje między kształtami (arrows, connectors). ArrowBindingUtil najbardziej złożony. | Dobre — binding logic jest izolowana. Można testować niezależnie. |

### Manager dependencies (all wired in Editor constructor)

| Manager | Importów | Cel | Testabilność |
|---------|----------|-----|--------------|
| **HistoryManager** | ~40 | Undo/redo stack. Mutuje store, track changes. | Słaba — wymaga real store instance + mutation tracking. Best tested through Editor integration. |
| **SnapManager** | ~25 | Snap-to-grid, alignment hints. Geometry-heavy. | Umiarkowana — geometryczne kalkulacje są pure, ale wymaga Editor context. |
| **SpatialIndexManager** | ~20 | R-tree spatial indexing (RBush). Hit detection. | Słaba — zależy od store shapes. Hard to mock. |
| **TextManager** | ~18 | Text measurement, rendering. Tiptap integration. | Słaba — Tiptap dependency. External library. Wymaga DOM. |
| **InputsManager** | ~15 | Pointer/keyboard state tracking. | Umiarkowana — event tracking, ale wymaga Editor. |
| **ClickManager** | ~12 | Multi-click detection (single/double/triple). | Dobra — czysty click state machine. |
| **PerformanceManager** | ~7 | FPS metrics, LAF (Largest Animation Frame). | Bardzo dobra — pure metrics calculation. |
| **FontManager** | ~8 | Font loading, metadata cache. | Dobra — cache, metadata. Minimal Editor coupling. |
| **ThemeManager** | ~10 | Theme resolution, color management. | Dobra — pure color mapping. |
| **TickManager** | ~8 | Frame-based update loop (requestAnimationFrame). | Umiarkowana — timing-dependent. |

**Wniosek:** 14 managerów w jednym konstruktorze = złożoność. Zmiana w dowolnym managerze może zranić Editor initialization. Testowanie wymaga albo pełnej maszyny (integration test), albo TestEditor wrapper (158 plików).

---

### packages/tldraw/src

| Moduł | Importowany przez | Zazwyczaj import | Cel | Ryzyka |
|-------|-------------------|-------------------|-----|--------|
| **@tldraw/editor (re-exports)** | 414+ | `import { useEditor, createShapeId, ... } from '@tldraw/editor'` | Warstwa SDK. Główne exporty: `createShapeId` (82×), `useEditor` (46×), `StateNode` (40×). | **KRYTYCZNE** — 82+ distinct exports używane. Każda zmiana public API propaguje do 414+ importów. Ale: unidirectional flow (tldraw → editor, nie vice versa). |
| **defaultShapeUtils.ts** | 150+ | `import { defaultShapeUtils } from '@tldraw/tldraw'` | Rejestr wszystkich domyślnych shape utils. Convenience bundle. | Dobra — centralna rejestr, ale każdy util jest modułem. Zmiana w jednym shapeie nie wpływa na inne. |
| **defaultTools.ts** | 120+ | `import { defaultTools } from '@tldraw/tldraw'` | Rejestr tools. | Dobra — każdy tool jest StateNode, niezależny. |
| **context/actions.tsx** | 19+ | `import { useActions } from '@tldraw/tldraw'` | UI actions (copy, paste, align, delete, duplicate). Pub-like API. | Umiarkowana — context provider pattern. Menu items odwołują się do actions. Zmiana w action signature wymaga updatu w wszystkich menu consumers. |
| **context/events.tsx** | 28+ | `useEventSourceMap()` lub `emit()` | Custom event handling. Pub/sub dla app events (shape created, selected, itp). | Dobra — event emitter pattern. Dekoupluje. Listeners testują się z event mock. |
| **context/components.tsx** | 15+ | `useComponents()` override context | Component customization API. | Bardzo dobra — simple context, minimal logic. |
| **Tldraw.tsx** | 35+ | `<Tldraw ... />` — main React component | Root SDK component. Wires up Editor + UI. | Dobra — component-based, props-driven. |

**Wniosek:** tldraw layer ma czystą API surface via re-exports. Wiele importów, ale unidirectional (tldraw → editor, nigdy vice versa). Actions/events context dekouplują UI od internal logic dobrze.

---

### apps/dotcom/client/src/tla

| Moduł | Importowany przez | Zazwyczaj import | Cel | Ryzyka |
|-------|-------------------|-------------------|-----|--------|
| **useAppState hook** | 51+ | `const app = useAppState()` | **APP STATE HUB** — file state, auth, config, sync state. Dotcom-specific. | **WYSOKA TESTABILNOŚĆ RYZYKO** — 51+ consumers. Wymaga mock file service, mock auth, mock sync layer (@rocicorp/zero). Brak wrapper'a (inaczej niż TestEditor). Komponenty testują się ciężko. |
| **tldraw package** | 65+ | `import { Tldraw, useEditor, ... }` | SDK consumer. Głównie shapes (21×), hooks. | Umiarkowana — dobra abstrakcja API. Heavy on `useEditor`, `createShapeId`. |
| **@tldraw/dotcom-shared** | 30+ | `import { TlaFile, FileVersion, ... }` | Domeny types (file, user, sharing). | Dobra — well-scoped. |
| **TlaEditor.tsx** | 48 zmiany (history, ale nie hub) | `<TlaEditor />` wrapper | Main editor component dla dotcom app. | Umiarkowana — integrator SDK + app state. |
| **useFileEditorOverrides** | 12+ | `useFileEditorOverrides()` — custom overrides | Dotcom-specific shape utils, tools overrides (e.g., custom export). | Dobra — overrides pattern jest dekouplujący. |

**Wniosek:** Dotcom app jest KONSUMENTEM SDK. Główne ryzyka to `useAppState` hub (51+ zależności) + synchronizacja z Rocicorp Zero sync layer. Nie ma cykli, ale testowanie bez proper mocking jest niemożliwe.

---

## 2. CYKLI — Status

**✅ Brak cykli wykrytych** w dependency-cruiser scan (2388 modułów, 7633 zależności).

Potencjalnych "cykli logicznych" (nie technicznych):
- **Editor ↔ Managers:** Editor constructuje managers, managers sięgają do Editor via `this.editor`. To nie jest cykl importu (ES modules), ale mutual reference. W runtime mogą być problemy, jeśli manager spróbuje dostać się do state'u Editor w construction time. Ale w praktyce to jest okej — managers sięgają do `editor` tylko w metodach (lazy).
- **ShapeUtil ↔ useEditor:** ShapeUtils są klasami (nie React hooks), ale mogą używać `useEditor` w React components (shape componenty). To jest dobry pattern, nie cykl.

**Wniosek:** Struktura importów jest czysta. Problemy to sprzężenia logiczne (w runtime), nie cykli (w module graph).

---

## 3. GRANICE ARCHITEKTONICZNE — Clean vs. Violations

### ✅ Czysty flow pakietów (warstwa zdolna)

```
packages/editor/src (rdzeń — brak default shapes/tools)
    ↓
packages/tldraw/src (SDK + default shapes/tools)
    ↓
apps/dotcom/client/src/tla (aplikacja)
```

**Reguły:**
- `editor` nie importuje z `tldraw` ✅
- `tldraw` nie importuje z `dotcom/client` ✅
- `editor` importuje z `store`, `state`, `tlschema` (unidirectional) ✅

### ✅ Czysty layer: Shape utilities

```
Arrow/Geo/Text/... ShapeUtils
├─ każdy extends ShapeUtil
├─ zero cross-imports między shape'ami
├─ każdy może importować z editor/primitives (geometry, math)
└─ minimal coupling
```

### ⚠️ Editor Constructor Coupling

```
Editor constructor
├─ HistoryManager (manager)
├─ SnapManager (manager)
├─ SpatialIndexManager (manager)
├─ ... 11 other managers
└─ All managers initialized synchronously
```

**Ryzyko:** Zmiana w signaturi jednego managera wymaga updatu w `Editor.constructor`. Jeden bumer = cascade. Ograniczone testowanie unit-wise, wymaga TestEditor.

### ⚠️ Dotcom App State Hub

```
useAppState (custom hook)
├─ File service
├─ Auth service
├─ Sync service (@rocicorp/zero)
├─ Global editor state
└─ 51+ consumers
```

**Ryzyko:** useAppState jest god-hook dla całej aplikacji. Zmiana contract (auth, file shape, sync state) wymaga updatu wszędzie. Testowanie jest ciężkie — każdy test musi mockować cały stack.

### ✅ Context Pattern w tldraw UI

```
Actions context (copy, paste, align, ...)
Events context (shape created, selected, ...)
Components context (overrides)
```

**Dobra:** Każdy context jest single-concern. Consumers testują się łatwo z context mock.

---

## 4. BLAST RADIUS — Gdzie zmiana boli najbardziej

### Editor.ts (253+ importów) — NUKE RADIUS

**Scenario:** Zmiana w public API `Editor` class (np. dodanie required param, zmiana hook signature).

**Blast:**
- 253+ importów natychmiast red
- TestEditor wrapper (158 plików) wymaga updatu
- Wszystkie testy z Editor integration break
- Shape utils mogą sięgać do Editor (np. `useEditor()`), więc 72+ shape utils mogą być affected
- Dotcom app (65 importów @tldraw/editor) affected

**Estimated time to fix:** 2–4 dni (cascading updates + regressions).

**Mitigation:**
- Nigdy nie dodawaj required params do Editor constructor
- Dodawaj opcjonalne properties do Editor.store lub nowe getter-only API
- Staraj się exportować only potrzebne podzbiory API (na razie ~82 distinct exports used)

---

### useAppState (dotcom, 51+ importów) — MODERATE RADIUS

**Scenario:** Zmiana w return type `useAppState` (np. zmiana `fileState` shape).

**Blast:**
- 51+ consumers w dotcom/client/src/tla break
- Każdy component, hook, page może być affected
- Brak centralnego place do trace impact (nie jak Editor — tam jest barrel index)

**Estimated time to fix:** 1–2 dni (componenty mogą być spread across folders).

**Mitigation:**
- Mockuj useAppState w testach — nigdy nie testuj Components bez mock
- Rozważ type-safe wrapper (e.g., `AppState extends Readonly<{...}>`)

---

### defaultShapeUtils registry (150+ importów) — LOW RADIUS

**Scenario:** Zmiana w jednym shape util (e.g., ArrowShapeUtil).

**Blast:**
- defaultShapeUtils import si jest only used to register shapes
- Zmiana w ArrowShapeUtil signature nie propaguje do registry
- Inne shape utils unaffected

**Mitigation:** ✅ Current approach is good. Shape utils are well-isolated.

---

### actions.tsx context (19+ importów) — MODERATE RADIUS

**Scenario:** Nowy action, zmiana action signature.

**Blast:**
- Menu items, toolbar buttons, keyboard shortcuts mogą break
- 19+ importów = 19+ place do updatu

**Mitigation:**
- Type-safe actions via discriminated union (már robimy)
- Każdy action ma dedicated hook (useAction.copy, itp)

---

## 5. RYZYKA TESTOWALNOŚCI

### Słaba testowalność

| Moduł | Powód | Co się dzieje przy zmianie | Test strategy |
|-------|-------|---------------------------|----------------|
| **Editor core** | 14 managerów w konstruktorze. Mutual dependencies. | Zmiana w managerze A może zranić B (np. SnapManager zależy od InputsManager). | Wymaga full Editor + TestEditor wrapper. Unit testy niemożliwe. |
| **useAppState** | God-hook. Sięga file service, auth, sync layer. | Zmiana contract w file/auth/sync break całą aplikację. | Każdy test musi mockować całą stack. Brak TestAppState. Testowanie komponentów jest ciężkie. |
| **Dotcom integration** | Komponenty zależą od useAppState + @tldraw/tldraw + sync service. | Zmiana w SDK, file service, sync layer wymaga updatu wszędzie. | E2E testing zalecane. Unit testing wymaga 5+ mocków. |
| **TextManager** | Tiptap dependency. DOM-dependent. | Zmiana w Tiptap version lub signature break text rendering. | Brak unit testów (external lib). Wymaga integration/e2e. |
| **SnapManager** | Zależy od SpatialIndexManager, store shapes, geometry. | Zmiana snap behavior wymaga full Editor context. | Integration test. Geometry utilities są testable, ale snap logic wymaga Editor. |

### Dobra testowalność

| Moduł | Powód | Co się dzieje przy zmianie | Test strategy |
|-------|-------|---------------------------|----------------|
| **ShapeUtil subclasses** | Każdy util jest niezależny. Geometry, rendering, handles — self-contained. | Zmiana w ArrowShapeUtil nie wpływa na GeoShapeUtil. | Unit tests per-shape. Każdy util testuje się w izolacji. 👍 |
| **StateNode subclasses** | Event-driven state machines. No global state. | Zmiana w SelectTool state transitions testuje się event dispatch. | Unit tests per-tool/state. Jasny contract (events in, state mutations out). 👍 |
| **Geometry utilities** | Pure functions. Zero dependencies. Math-only. | Zmiana w line intersection algo testuje się z test vectors. | Unit tests. Pure input/output. Zero mocking. 👍 |
| **Actions context** | Dekouplujący pattern. Actions are thin wrappers. | Nowy action nie wpływa na istniejące. Zmiana action signature testuje się z mock context. | Unit test per action. Context mock. 👍 |
| **Events context** | Event emitter pattern. Listeners are decoupled. | Nowy event, zmiana event payload testuje się z mock emitter. | Unit test per listener. Pure event data. 👍 |

---

## 6. NAJISTOTNIEJSZE OBSERWACJE PER OBSZAR

### packages/editor/src — Rdzeń edytora

**Stan:** Architektura jest zdolna (clean layering, no cycles), ale testabilność jest słaba.

**Top ryzyka:**
1. **Editor is a god-class.** Konstruktor wires 14+ managers. Każdy manager ma dependencies na inne. Testowanie pojedynczego managera bez mocking całej reszty = niemożliwe.
2. **TestEditor wrapper is a workaround, not a solution.** 158 plików go importuje. To oznacza, że unit testing Editor jest zbyt ciężkie; wszyscy sięgają do TestEditor, aby uniknąć boilerplate.
3. **Manager interactions are runtime-coupled.** HistoryManager sięga do SpatialIndexManager w runtime. To nie jest cykl importu, ale logiczny cycle. Zmiana porządku initialization może złamać.

**Co zrobić dalej:**
- [ ] Audit manager dependencies — które z 14+ managers mogą być testualne in isolation?
- [ ] Rozważ lazy initialization dla managers (zamiast synchronicznego w konstruktorze)
- [ ] Sprawdź, czy można zmniejszyć TestEditor surface (158 importów = kod śmieciowy?)

---

### packages/tldraw/src — SDK

**Stan:** Warstwę z domyślnymi kształtami, narzędziami, UI. Dobra abstrakcja, czysty flow.

**Top ryzyka:**
1. **414+ importów @tldraw/editor.** Każda zmiana public API Editor propaguje szeroko. Ale: unidirectional flow (tldraw → editor), nie vice versa, więc safe.
2. **defaultShapeUtils i defaultTools są convenience registries.** Zmiana w jednym shapeie nie wpływa na inne, ale registry importów mogą być spread. Nie to jest problem — problem to Editor API breakage.

**Inne obserwacje:**
- ✅ Shape utilities are well-isolated (72+). Each is independently testable.
- ✅ Context pattern (actions, events, components) is dekouplujący.
- ✅ No circular imports.

**Co zrobić dalej:**
- [ ] Sprawdź actions.tsx — 19+ importów. Czy każdy action jest well-documented? (np. action signature, side effects)
- [ ] Opcjonalnie: type-safe actions wrapper (discriminated union) — ogranicza błędy przy zmianach

---

### apps/dotcom/client/src/tla — Aplikacja

**Stan:** Konsument SDK. Główne ryzyka to god-hook `useAppState` + sync layer integration.

**Top ryzyka:**
1. **useAppState (51+ importów).** Każdy component, hook, page może zależeć od file service, auth, sync state. Zmiana contract = cascade updaty wszędzie.
2. **Brak TestAppState wrapper.** Inaczej niż Editor (TestEditor 158 plików), nie ma helper'a dla testów. Każdy test musi ręcznie mockować stack.
3. **Deep dependency chains:** Component → useAppState → file service + sync service + auth service. Hard to test in isolation. Każdy layer wymaga mocka.

**Inne obserwacje:**
- ✅ Czysty import @tldraw/tldraw (SDK)
- ✅ Czysty import @tldraw/dotcom-shared (domain types)
- ✅ Czysty override pattern (useFileEditorOverrides) — dekouplujący

**Co zrobić dalej:**
- [ ] Utworzyć TestAppState wrapper (analogiczny do TestEditor)
- [ ] Audit deep dependencies — które komponenty mogą być przeniesione do jednostkowych testów?
- [ ] Sprawdzić, czy sync layer (@rocicorp/zero) jest dobrze abstrahowany (czy komponenty sięgają bezpośrednio, czy przez useAppState?)

---

## 7. PODSUMOWANIE — Co się zmienia razem

Z artifact-1 wiemy, że obszary zmienia się razem:

| Para | Wspólne commity | Wniosek z dependency view |
|------|----------------:|---------|
| editor/src ↔ tldraw/src | 169 | Editor API zmienia się → tldraw SDK musi updatować. Spodziewane. |
| dotcom/client ↔ tldraw/src | 97 | Dotcom aplikacja sięga SDK. Zmiana SDK → update dotcom. |
| dotcom/client ↔ editor/src | 76 | Dotcom sięga też do Editor prymitywów (np. `useEditor`, `createShapeId`). Zmiana rdzenia → update dotcom. |
| dotcom/client ↔ sync-worker | 76 | Full-stack: frontend + multiplayer backend zmienia się razem. |

**Wniosek:** Blast radius: editor/src → tldraw/src → dotcom/client. Zmiana w rdzeniu ma efekt waterfall.

---

## 8. ACTIONABLE NEXT STEPS

### Krótkoterminowe (tydzień)

- [ ] **Audit Editor constructor.** Które z 14+ managerów mogą być testowane in isolation? Które są mutual-dependent?
- [ ] **Sprawdzić TestEditor usage** (158 importów). Czy to pattern lub pain point?
- [ ] **Sprawdzić useAppState usage** (51+ importów). Czy komponenty mogą być testowane bez mock całej stack?

### Średnioterminowe (miesiąc)

- [ ] **Type-safe actions wrapper** — ogranicza breaking changes w actions context
- [ ] **TestAppState helper** — analogiczny do TestEditor, aby testowanie dotcom było łatwiejsze
- [ ] **Lazy initialization dla managers** — zmniejszy coupling w Editor constructor

### Długoterminowe (kwartał)

- [ ] **Manager extraction/refactor** — jeśli manager interactions są zbyt złożone, rozważ sub-layer (e.g., GestureManager umbrella dla InputsManager, ClickManager)
- [ ] **Document manager dependencies** — create a mini ADR explaining why 14 managers must be in single constructor

---

## 9. MAPPING DO ARTIFACT-1 (Git history)

Artifact-1 pokazał:
- `Editor.ts` — 81 zmian (2× średnia dla pliku)
- `packages/editor/src` — 751 zmian (4. rank)
- `packages/tldraw/src` — 1757 zmian (2. rank)
- 169 wspólnych commitów: editor/src ↔ tldraw/src

**Dependency view wyjaśnia why:**
- Editor.ts jest central hub (253+ importów) — logicze, że jest najczęściej dotykany
- editor/src ↔ tldraw/src strong coupling (API changes propagate) — logicze, że 169 wspólnych commitów
- No cycles, but tightly coupled layers — pojedyncze zmiany mają waterfall effect

---

## Kod — przykład dependency chain (Dotcom perspective)

```
<TlaEditor /> (Dotcom app component)
  └─ useAppState()
      ├─ useFileState() — file service dependency
      ├─ useAuthState() — auth service dependency
      ├─ useSyncState() — @rocicorp/zero, @tldraw/sync-core
      └─ globalEditor (Editor singleton)
          ├─ Editor (253+ imports depend on this)
          ├─ 14 managers
          │   ├─ HistoryManager (40 dependencies)
          │   ├─ SnapManager (25)
          │   ├─ SpatialIndexManager (20)
          │   ├─ TextManager (18)
          │   └─ ...
          └─ useEditor() hook (46+ consumers)

<Tldraw /> (SDK component)
  └─ Editor (rdzeń)
      └─ defaultShapeUtils + defaultTools (180+ total)
          ├─ ArrowShapeUtil (72+)
          ├─ GeoShapeUtil
          ├─ TextShapeUtil
          └─ ... (9 more)
```

Głębokość: 6 poziomów. Testowanie TlaEditor bez mock: niemożliwe.

---

**Dokument wygenerowany:** 2026-06-15
**Narzędzie:** dependency-cruiser + manual analysis
**Pokrycie:** 2388 modułów, 7633 zależności (3 focus areas)
