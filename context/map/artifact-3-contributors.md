# Artefakt 3 — Mapa kontrybutorów (wsparcie domenowe)

Analiza oparta o historię gita (ostatnie 12 miesięcy: 2025-06-11 → 2026-06-15).
Zaznaczeni eksperci domenowi na podstawie faktycznych commitów w kluczowych obszarach.

---

## TL;DR — Top 5 obszarów + wsparcie

| # | Obszar | Zmian | Top eksperti | Charakterystyka |
|---|--------|------:|--------------|-----------------|
| 1 | **packages/editor/src** | 751 | Steve Ruiz (78), Mime Čuvalo (54) | Rdzeń edytora: geometry, managers, rendering |
| 2 | **packages/tldraw/src** | 1757 | Steve Ruiz (124), Mime Čuvalo (112) | Domyślne kształty, UI, narzędzia SDK |
| 3 | **apps/dotcom/client/src/tla** | 660 | Steve Ruiz (54), Mitja Bezenšek (48) | Aplikacja tldraw.com: workspace, collaboration |
| 4 | **Shape utilities** (Arrow, Geo, Note, itd) | ~400 | Mime Čuvalo, Guillaume Richard, Mitja Bezenšek | Logika kształtów, rendering, extensibility API |
| 5 | **Managers + Performance** (Editor, Snap, History) | ~300 | Steve Ruiz, Mitja Bezenšek, Mime Čuvalo | Architektura rdzenia, optymalizacja |

**Wniosek:** 3 osoby — Steve Ruiz, Mime Čuvalo, Mitja Bezenšek — pokrywają ~70% zmian w TOP 3 obszarach. Duża koncentracja wiedzy.

---

## 1. EKSPERCI DOMENOWI — Profil, specjalizacja, historia

### Steve Ruiz (187 commitów, top #1)

**Email:** steveruizok@gmail.com  
**Status:** Główny architekt edytora / Product lead

**Obszary dominacji:**
- `packages/editor/src`: **78 commitów** — Editor.ts, rendering, managers, canvas optimizations
- `packages/tldraw/src`: **124 commitów** — UI, menus, pages, actions, shapes
- `apps/dotcom/client/src/tla`: **54 commitów** — Aplikacja, feedback, preferences

**Charakterystyka pracy (ostatnie 12 miesięcy):**
- 53× fix, 30× feat, 11× refactor, 10× perf
- Dominacja: **bugfixy i optymalizacja** (63 z 104 = 61%)
- Obszary: canvas rendering, selection, text, overlay system, menus, themes
- Przykłady: `refactor(overlays)`, `perf(editor)`, `feat(editor): canvas OverlayUtil system`

**Kluczowe commity:**
- `17b19dc63` — feat: canvas OverlayUtil system (zmiana architektonyczna)
- `2152ec021` — perf: avoid canvas state rerenders
- `fb98e4527` — perf: reduce canvas render work
- `ee5a79640` — feat: first-class theme system

**Kiedy go zapytać:**
- Rendering pipeline, canvas performance
- Editor core architektura
- Współpraca z UI / selection / interactions
- Design decyzji w rdzeniu

**Potencjalne siła:** Wysoki level abstrakcji, dobrze zna cały stack. Może być bottleneck.

---

### Mime Čuvalo (157 commitów, top #2)

**Email:** mimecuvalo@gmail.com  
**Status:** Senior engineer, cross-cutting concerns

**Obszary dominacji:**
- `packages/editor/src`: **54 commitów** — Managers, shapes, refactors
- `packages/tldraw/src`: **112 commitów** — Shapes (geo, custom extensibility), accessibility, i18n
- `apps/dotcom/client/src/tla`: **38 commitów** — Sync, performance, features

**Charakterystyka pracy:**
- 25× fix, 24× a11y, 9× license, 7× i18n, 5× refactor, 5× feat
- Dominacja: **accessibility** (24 commitów), **compliance** (license, i18n = 16)
- Obszary: Shape extensibility, geo shapes registry, accessibility (screen readers, ARIA), translations, Tiptap integration
- Przykłady: `refactor(shapes): register all geo shapes`, `feature: AssetUtil`, `a11y: expose UI to mobile screen readers`

**Kluczowe commity:**
- `c3d8c7ae6` — refactor: geo shapes through GeoTypeDefinition (architektura)
- `4486ad93a` — feat: custom geo shape extensibility API (public API design)
- `3810d2aaf` — Add frame-like capability to shape utils (shapes architecture)
- `8b698cfea` — a11y: expose UI to mobile screen readers

**Kiedy go zapytać:**
- Shape utilities, geo shapes, extensibility API
- Accessibility (screen readers, keyboard navigation)
- Internationalization (translations, i18n system)
- Compliance (licensing, legal)
- Tiptap integration (text)

**Potencjalne słabości:** Szeroki zakres (accessibility, i18n, shapes) = może być trudny do zlokalizowania.

---

### Mitja Bezenšek (90 commitów, top #3)

**Email:** mitja.bezensek@gmail.com  
**Status:** Performance specialist + Dotcom app owner

**Obszary dominacji:**
- `packages/editor/src`: **19 commitów** — Performance, memory, managers
- `packages/tldraw/src`: **37 commitów** — Performance, shapes, memory
- `apps/dotcom/client/src/tla`: **48 commitów** — Workspace switcher, file management, RUM

**Charakterystyka pracy:**
- 24× fix, 8× feat, 3× perf, 2× chore
- Dominacja: **bugfixy** (24 z 35 = 69%)
- Obszary: Performance optimization (rbush, subscriptions, sort permutation), Dotcom features (workspace, groups, sidebar), monitoring (PostHog RUM)
- Przykłady: `perf(editor): tier notVisibleShapes`, `perf(editor): skip rbush mutation`, `feat(dotcom): rework sidebar`

**Kluczowe commity:**
- `a8199ecbe` — perf: tier notVisibleShapes per-shape subscriptions
- `9f96e4c58` — perf: skip rbush mutation on prop-only shape diffs
- `2eb9f83a5` — perf: cache getRenderingShapes sort permutation
- `98e46aeac` — feat(dotcom): rework sidebar into workspace switcher

**Kiedy go zapytać:**
- Performance bottlenecks, spatial indexing (rbush)
- Dotcom app architecture, workspace management
- Memory leaks, disposal patterns
- Monitoring / observability (PostHog)

**Potencjalne siła:** Głębokie zrozumienie spatial data structures i Dotcom product.

---

### David Sheldrick (45 commitów, top #4)

**Email:** d.j.sheldrick@gmail.com  
**Status:** Features / integrations specialist

**Obszary dominacji:**
- `packages/editor/src`: **12 commitów** — Clipboard, cross-window embedding
- `packages/tldraw/src`: **22 commitów** — Shapes, features, clipboard
- `apps/dotcom/client/src/tla`: **22 commitów** — File system, features

**Charakterystyka pracy:**
- 5× fix, 2× refactor, 2× feat
- Dominacja: **bugfixy** + niski commit count = **selektywne, głębokie zmiany**
- Obszary: Clipboard hooks, scoped document/window (embedding), file operations, cross-realm fixes
- Przykłady: `feat(editor): clipboard hooks`, `refactor(editor): scoped document/window`

**Kluczowe commity:**
- `660e2af55` — refactor: scoped document/window for cross-window embedding
- (clipboard hooks, file system)

**Kiedy go zapytać:**
- Clipboard API integration
- Cross-window / iframe embedding
- File operations, cross-realm issues

**Potencjalne słabości:** Mało commitów w ostatnim roku = możliwe, że mniej aktywny lub focused na inne projekty.

---

### Kostya Farber (37 commitów, top #6)

**Email:** kostya.farber@gmail.com  
**Status:** UI / Tools / Features

**Obszary dominacji:**
- `packages/editor/src`: **12 commitów** — Tools, gestures, UI
- `packages/tldraw/src`: **25 commitów** — Shapes, UI, tools
- `apps/dotcom/client/src/tla`: **9 commitów**

**Charakterystyka pracy:**
- 12× fix, 5× feat, 1× debt
- Dominacja: **UI fixes + occasional features**
- Obszary: Right-click panning, cursor behavior, clipboard fallbacks, minimap, toolbar
- Przykłady: `feat: right-click and drag to pan`, `fix: reset cursor when entering editing`

**Kiedy go zapytać:**
- Tools, interactions, gestures
- Minimap, toolbar UI
- Cursor behavior
- Keyboard shortcuts

---

### Guillaume Richard (9 commitów)

**Email:** mynameiskaneel@proton.me  
**Status:** Shapes / Embedding specialist

**Obszary dominacji:**
- Shape utilities, embedding, mermaid integration
- Extensibility

**Charakterystyka pracy:**
- Features: `feature: apply/copy styles between shapes`, `improvement: embed config`, `feat: mermaid package`

**Kiedy go zapytać:**
- Shape behavior, style system
- Embedding support
- Mermaid integration

---

### Max Drake (16 commitów)

**Email:** maxdrake46@gmail.com  
**Status:** Touch / Gestures / UI

**Obszary dominacji:**
- Touch interactions, gestures, UI polish
- Theme/contrast improvements

**Charakterystyka pracy:**
- `feat(hand): add one-finger zoom gesture`, `fix: respect canReceiveNewChildrenOfType`, `fix: theme-aware contrast`

**Kiedy go zapytać:**
- Touch device support, gestures
- Mobile UI, accessibility (contrast)

---

### Ani Krishnan (14 commitów)

**Email:** 98394024+AniKrisn@users.noreply.github.com  
**Status:** UI Polish

**Obserwacja:** Głównie małe bugfixy w UI (notes, dark mode, toast).

---

## 2. WIEDZA DOMENOWA — Mapowanie ekspertów → obszary

### packages/editor/src (751 zmian)

| Domena | Top eksperti | Commit count | Charakterystyka |
|--------|--------------|------------|--------------|
| **Core (Editor.ts, managers)** | Steve Ruiz, Mime Čuvalo, Mitja Bezenšek | 78 + 54 + 19 | Architektura, initialization |
| **Geometry / rendering** | Steve Ruiz | 78 | Canvas optimizations, Path2D |
| **Performance (rbush, subscriptions)** | Mitja Bezenšek | 12–19 | Spatial indexing, memory |
| **Shapes / utilities** | Mime Čuvalo | 54 | Geo shapes, extensibility |
| **Tools / interactions** | Steve Ruiz, Kostya Farber, Max Drake | 78 + 12 + 4 | Selection, gestures |
| **Accessibility** | Mime Čuvalo | 54 | Screen readers, ARIA |
| **Text (Tiptap)** | Mime Čuvalo | 54 | Text manager integration |
| **Managers** | Steve Ruiz, Mime Čuvalo, Mitja Bezenšek | 78 + 54 + 19 | HistoryManager, SnapManager, etc |

**Obserwacja:** Brak specjalisty na **TextManager** (tylko Mime jako side effect). Brak dedykowanego eksperta na **SnapManager** — zarządzane przez Steve'a.

---

### packages/tldraw/src (1757 zmian)

| Domena | Top eksperti | Commit count | Charakterystyka |
|--------|--------------|------------|---------|
| **SDK Public API** | Steve Ruiz, Mime Čuvalo | 124 + 112 | Barrel exports, API design |
| **Default shapes** | Mime Čuvalo, Guillaume Richard, Mitja Bezenšek | 112 + 6 + 37 | Arrow, Geo, Note, etc |
| **Shape extensibility** | Mime Čuvalo, Guillaume Richard | 112 + 6 | Custom geo types API |
| **Default tools** | Steve Ruiz, Kostya Farber | 124 + 25 | Select, erase, hand, etc |
| **UI components** | Steve Ruiz, Mime Čuvalo | 124 + 112 | Menus, toolbars, panels |
| **Actions context** | Steve Ruiz | 124 | Copy, paste, align, etc |
| **Events & hooks** | Mime Čuvalo | 112 | Event emitter, custom events |
| **Accessibility (UI)** | Mime Čuvalo | 112 | Screen readers, keyboard nav |
| **Translations (i18n)** | Mime Čuvalo | 112 | defaultTranslation.ts, keys |
| **Themes** | Steve Ruiz | 124 | First-class theme system |

**Obserwacja:** Steve Ruiz + Mime Čuvalo = ~80% całego pakietu. Wysoka koncentracja.

---

### apps/dotcom/client/src/tla (660 zmian)

| Domena | Top eksperti | Commit count | Charakterystyka |
|--------|--------------|------------|---------|
| **App state / hooks** | Steve Ruiz, Mitja Bezenšek, Mime Čuvalo | 54 + 48 + 38 | useAppState, file service |
| **Workspace / groups** | Mitja Bezenšek | 48 | Sidebar, workspace switcher |
| **File management** | David Sheldrick, Mitja Bezenšek | 22 + 48 | File operations, deletion |
| **Editor integration** | Steve Ruiz, Mime Čuvalo | 54 + 38 | TlaEditor.tsx, overrides |
| **Sync / multiplayer** | Mime Čuvalo | 38 | Zero sync, collaboration |
| **Authentication** | Jessica Claire Edwards, Kevin Ingersoll | 3 + 3 | Clerk, groups, permissions |
| **Features (admin, logging)** | Jessica Claire Edwards | 3 | Admin UI, RUM |
| **UI / theming** | Max Drake, Steve Ruiz | 9 + 54 | CTA buttons, theme picker |

**Obserwacja:** Brak dedykowanego eksperta na **sync/multiplayer** (Mime ma 38, ale to side effect). Jessica / Kevin mają mało commitów w ostatnim roku.

---

## 3. SIŁA WIEDZY — Koncentracja vs Dywersyfikacja

### Siły (well-distributed)

| Obszar | Eksperci | Ocena |
|--------|----------|------|
| **Shapes (geo, extensibility)** | Mime Čuvalo, Guillaume Richard | Dobra — 2–3 osoby znają API |
| **Performance** | Mitja Bezenšek, Steve Ruiz | Dobra — 2 specjalisty |
| **Accessibility** | Mime Čuvalo (dominant) | OK — 1 ekspert, ale szeroki zakres |
| **Tools / interactions** | Steve Ruiz, Kostya Farber | Dobra — 2 osoby |

### Słabości (knowledge silos)

| Obszar | Stan | Ryzyko |
|--------|------|--------|
| **TextManager / Tiptap** | Tylko Mime Čuvalo (side effect) | 🔴 WYSOKE — zmiany w tiptap bez wspólnie znanych mitingów |
| **SnapManager** | Tylko Steve Ruiz | 🔴 WYSOKE — manager z wieloma zależnościami, brak backup |
| **useAppState (dotcom)** | Steve Ruiz, Mitja Bezenšek, Mime Čuvalo | 🟡 ŚREDNE — trzej ludzie znają, ale coś się zmieni? |
| **Editor constructor** | Steve Ruiz głównie | 🔴 WYSOKE — 14 managerów, zmiana w jednym = cascading |
| **Sync / Zero (dotcom)** | Mime Čuvalo (side effect) | 🔴 WYSOKE — tylko jeden ekspert zna integrację |
| **Authentication (Clerk)** | Jessica / Kevin (3 commity w roku) | 🟡 ŚREDNE — mało pracy, ale kluczowe do dotcom |

---

## 4. LINIE WSPARCIA — Kto odpowiada na pytania?

### "Jak zmieniać Editor.ts?"
1. **Steve Ruiz** (78 commitów, owner)
2. Mitja Bezenšek (backup — performance)
3. Mime Čuvalo (backup — shapes, refactors)

### "Jak dodać nowy shape?"
1. **Mime Čuvalo** (112 commitów, shape extensibility API)
2. Guillaume Richard (geo shapes)
3. Steve Ruiz (SDK integration)

### "Dlaczego performance jest wolna?"
1. **Mitja Bezenšek** (perf work)
2. Steve Ruiz (canvas rendering)
3. Mime Čuvalo (shape subscription tiers)

### "Jak działa dotcom app state?"
1. **Steve Ruiz** (54 commitów, app integration)
2. **Mitja Bezenšek** (48 commitów, workspace features)
3. Mime Čuvalo (sync layer, 38 commitów)

### "Jak dodać feature w dotcom?"
1. **Mitja Bezenšek** (workspace, groups, recent work)
2. Steve Ruiz (app core, preferences)
3. Jessica Claire Edwards (admin features)

### "Accessibility — coś nie działa na screen reader?"
1. **Mime Čuvalo** (24 a11y commity w roku)
2. Steve Ruiz (UI components)

### "Tłumaczenia / i18n nie działa?"
1. **Mime Čuvalo** (9 i18n commitów, authority)

### "Clipboard API / embedding?"
1. **David Sheldrick** (scoped document/window specialist)
2. Steve Ruiz (integration)

### "Touch gestures / mobile?"
1. **Max Drake** (one-finger zoom, touch interactions)
2. Kostya Farber (cursor, interactions)

---

## 5. STRUKTURA ZESPOŁU — Wspólpraca i sprzężenia

### "Duet Steve + Mime"
- 187 + 157 = 344 commitów (46% TOP 3 obszarów)
- **Razem pracowali:** editor/src (78+54), tldraw/src (124+112), dotcom (54+38)
- **Charakterystyka:** Steve owneruje architekturę, Mime zajmuje się shapes, a11y, refactors
- **Ryzyko:** Trudno coś zmienić bez obojga; duża zależność

### "Mitja — backup dla performance"
- 90 commitów, głównie perf + dotcom
- **Rola:** Performance specialist + dotcom product owner
- **Niezależność:** Pracuje niezależnie od Steve'a / Mime'a w swoim domenie

### "David — deep dives"
- 45 commitów, mało ale głębokie (clipboard, embedding, file ops)
- **Rola:** Integration specialist, ograniczona dostępność

### "Kostya — feature machine"
- 37 commitów, rozliczeni między edytorem a UI
- **Rola:** Cross-cutting features, tool interactions

### "Guillaume — shapes deep expert"
- 9 commitów, ale focused na geo shapes / embedding
- **Rola:** Shape extensibility specialist

### "Jessica + Kevin — dotcom admin/auth"
- 3 + 3 commitów w ostatnim roku
- **Rola:** Admin features, permissions (mało pracy ostatnio)
- **Potencjalne:** Mogą być focused na inne projekty / zespoły

---

## 6. SIŁA ZESPOŁU — Przepustowość i bottlenecks

### Załamanie mocy (commits / person / 12 months)

| Person | Commits | Średnia/miesiąc | Ocena |
|--------|---------|----------|------|
| Steve Ruiz | 187 | **15.6/mo** | 🔥 Maksymalnie aktywny, owner |
| Mime Čuvalo | 157 | **13.1/mo** | 🔥 Bardzo aktywny, cross-cutter |
| Mitja Bezenšek | 90 | **7.5/mo** | ✅ Steady, specjalistyczny |
| David Sheldrick | 45 | **3.75/mo** | ✅ Focused, deep work |
| alex | 45 | **3.75/mo** | ✅ Consistent, unknown identity |
| Kostya Farber | 37 | **3.1/mo** | ✅ Active, feature-driven |
| Lu Wilson | 17 | **1.4/mo** | 🟡 Low activity |
| Max Drake | 16 | **1.3/mo** | 🟡 Low activity, specialist |
| Ani Krishnan | 14 | **1.2/mo** | 🟡 Low activity |
| Guillaume Richard | 9 | **0.75/mo** | 🟡 Low activity, specialist |

**Bottleneck:** Steve Ruiz + Mime Čuvalo — 344 / 670 = 51% TOP 3. Duża zależność od dwojga.

---

## 7. POTENCJALNE KNOWLEDGE GAPS

### Nieadresowane obszary (mało commitów w roku, ale są w repo)

| Obszar | Ostatnie commity | Owner? | Risk |
|--------|------------------|--------|------|
| **Bindings (arrows, connectors)** | Nie w ostatnich 100 commitach | ? | 🟡 Nikt nie owneruje |
| **Validator system (tlschema)** | Nie w TOP 20 commitach | ? | 🟡 Pasywny obszar |
| **Migrations** | Nie w TOP 20 commitach | ? | 🟡 Critical ale pasywny |
| **Sync-worker backend** | Brak w ostatnich commitach | ? | 🔴 WYSOKE — multiplayer bez ownera? |

---

## 8. REKOMENDACJE — Gdzie szukać wsparcia

### Jeśli chcesz zmienić **Editor.ts**:
→ **Steve Ruiz** (first contact)
→ **Mitja Bezenšek** (performance backup)

### Jeśli chcesz zmienić **Shape utilities**:
→ **Mime Čuvalo** (extensibility authority)
→ **Guillaume Richard** (geo shapes)

### Jeśli chcesz zmienić **dotcom app**:
→ **Mitja Bezenšek** (workspace/features)
→ **Steve Ruiz** (integration)

### Jeśli chcesz zmienić **Performance**:
→ **Mitja Bezenšek** (rbush, subscriptions)
→ **Steve Ruiz** (canvas, rendering)

### Jeśli chcesz zmienić **Accessibility**:
→ **Mime Čuvalo** (authority)
→ **Steve Ruiz** (UI components)

### Jeśli chcesz zmienić **Sync / Multiplayer**:
→ **Mime Čuvalo** (only known expert)
→ **Steve Ruiz** (dotcom integration)

### Jeśli coś w **desktop/iframe embedding**:
→ **David Sheldrick** (scoped document/window)
→ **Steve Ruiz** (integration)

### Jeśli coś w **UI Polish / Tools**:
→ **Kostya Farber** (interactions)
→ **Max Drake** (gestures, mobile)
→ **Steve Ruiz** (menus, layouts)

---

## 9. ANALIZA RYZYKA — Siła wiedzy

### 🔴 SIŁA 1: Steve Ruiz + Mime Čuvalo = 51% TOP 3

Każda zmiana w `editor/src` lub `tldraw/src` wymaga wiedzy od przynajmniej jednego z nich.
**Ryzyko:** Urlop, rezygnacja, inna priorytet = projekt staje.

**Mitygacja:**
- Dokumentuj decyzje architektoniczne w ADR (architecture decision records)
- Pair programming: zaangażuj Mitję / Guillaume'a / Kostję do waszych zmian
- Code review policy: Steve / Mime zawsze recenzują zmiany w rdzeniu

### 🟡 SIŁA 2: Mitja Bezenšek jest jedynym performance expertem

Performance optimizations (rbush, subscriptions) są znane głównie jemu.
**Ryzyko:** Regresje, nieoptymalny kod, brak mentoringu

**Mitygacja:**
- Pair sessions z Mitją na performance reviews
- Dokumentuj benchmarki i bottlenecks w commit messages

### 🔴 SIŁA 3: Mime Čuvalo jest jedynym accessibility expertem

24 a11y commitów, niemożliwe do zamiennika.
**Ryzyko:** Nowe features bez accessible design, regresje a11y

**Mitygacja:**
- Accessibility review checkpoint przed merge'em
- Dokumentuj wcześnie, zaangażuj Mime'a w planning

### 🟡 SIŁA 4: Brak esperta na TextManager / Tiptap

Tiptap integracja jest znana Mime'owi, ale nie dedykowany.
**Ryzyko:** Text bugs, Tiptap upgrade issues

**Mitygacja:**
- Mime jako first contact
- Isolated text tests (separate from main editor)

---

## 10. MAPA PRZYSZŁOŚCIOWA — Kto powinien się nauczyć?

Aby zmniejszyć knowledge silos, rekomendowani kandydaci do mentoringu:

| Domena | Specjalista | Kandydat do backup'u | Plan |
|--------|-------------|-------------------|------|
| Editor core / managers | Steve Ruiz | Mitja Bezenšek (już wie dużo) | Wspólne code reviews, ADR sessions |
| Shape extensibility | Mime Čuvalo | Guillaume Richard (już specjalizuje się) | Pair programming na custom geo API |
| Performance | Mitja Bezenšek | Steve Ruiz (już robi perf work) | Warsztaty na rbush, spatial indexing |
| Accessibility | Mime Čuvalo | Ani Krishnan? (dużo UI pracy) | Accessibility review workshops |
| Dotcom product | Mitja Bezenšek | Jessica / Kevin (little activity lately) | Product planning sessions |
| Sync / Zero | Mime Čuvalo | (brak kandydata) | 🔴 **Wymagany nowy mentor** |

---

## 11. PODSUMOWANIE — Kto wie co?

### Architekci (ownership nad KEY AREAS)

1. **Steve Ruiz** — Głowa: Editor core, rendering, SDK public API
2. **Mime Čuvalo** — Głowa: Shapes, accessibility, cross-cutting concerns
3. **Mitja Bezenšek** — Głowa: Performance, dotcom product

### Specjaliści (deep expertise)

4. **Guillaume Richard** — Shapes, extensibility
5. **David Sheldrick** — Embedding, clipboard
6. **Kostya Farber** — UI interactions, tools
7. **Max Drake** — Touch, gestures

### Wsparcie (limited current activity)

8. **Jessica Claire Edwards** — Admin, authentication (3 commitów)
9. **Kevin Ingersoll** — Permissions, features (3 commitów)
10. **Lu Wilson** — (unknown domain, 17 commitów)

---

**Dokument wygenerowany:** 2026-06-15  
**Analiza:** 12 miesięcy historii gita, 670 commitów TOP 3 obszary  
**Status:** Prognoza, warte aktualizacji co kwartał
