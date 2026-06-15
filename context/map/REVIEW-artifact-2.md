# Review: Artifact-2-Structure Findings

Classification of claims into Evidence, Inferences, and Speculation.

---

## Evidence (directly observable from dependency-cruiser, code, git history)

- ✅ **0 circular dependencies** found in scan (2388 modules, 7633 dependencies)
- ✅ **Editor.ts** has 253+ incoming imports (dependency-cruiser count)
- ✅ **useAppState** hook has 51+ incoming imports
- ✅ **ShapeUtil** base class has 72+ subclasses/references
- ✅ **14 managers** are instantiated in Editor constructor (readers: HistoryManager, SnapManager, SpatialIndexManager, TextManager, InputsManager, ClickManager, PerformanceManager, FontManager, ThemeManager, TickManager, + 4 others listed in code)
- ✅ **158 files** import TestEditor (code grep)
- ✅ **No cross-imports between shape utils** (e.g., ArrowShapeUtil does not import GeoShapeUtil)
- ✅ **Unidirectional layer flow:** `editor` does not import from `tldraw`, `tldraw` does not import from `dotcom/client`
- ✅ **169 shared commits** between `editor/src` and `tldraw/src` (git history from artifact-1)
- ✅ **StateNode and ShapeUtil are base classes** for tools and shapes respectively (code structure)

---

## Inferences (logical conclusions drawn from evidence)

- 🔍 **Changing Editor API would impact 253+ files** — because they all import it, cascading updates are likely (inference from import count)
- 🔍 **TestEditor wrapper is a workaround for Ed high testing cost** — because 158 files import it, and Editor has 14 coupled managers, writing tests without it would require extensive mocking
- 🔍 **Shape utils are well-isolated** — because they have zero cross-imports, each can be tested independently without mocking other shapes
- 🔍 **useAppState is a testability bottleneck in dotcom** — because it has 51+ consumers and couples auth, file service, sync state; changing any would require updates everywhere
- 🔍 **Managers have runtime coupling** — managers reference `this.editor` in methods, creating implicit runtime dependencies not visible in the import graph
- 🔍 **Actions context is a good decoupling pattern** — because consumers import `useActions`, not the specific action implementations; changes to action implementation don't force consumer updates
- 🔍 **The absence of cycles does not equal absence of tight coupling** — circular imports would be worse, but mutual references (Editor ↔ Managers) still create tight coupling at runtime

---

## Speculation (claims needing validation)

- ❓ **Manager interactions may break if initialization order changes** — speculation that runtime mutual references (Editor → Managers, Managers → Editor.state) are order-dependent. Needs code audit to confirm.
- ❓ **"Testability requires full integration tests for Editor"** — speculation that TestEditor cannot be simplified or that unit testing managers in isolation is impossible. May have partial solutions (e.g., mock Store).
- ❓ **"Dotcom testing is harder than SDK testing"** — speculation based on number of consumers (51+ vs. 14 managers), but actual test patterns/difficulty needs verification.
- ❓ **"useAppState mock requirements: file service + auth + sync stack"** — speculation about what components actually require. Some components may only need subset of these.
- ❓ **"14 managers cannot be tested in isolation"** — speculation. TextManager, FontManager, PerformanceManager may be testable if mock Editor provided.
- ❓ **"Dotcom is more problematic than Editor because no TestAppState wrapper"** — speculation. TestAppState wrapper might be trivial to create, making this equivalently solvable.
- ❓ **"One manager change = cascade"** — speculation about scope of breakage. May be isolated to Editor init, or may be wider. Needs test audit.

---

## Key Gaps Needing Validation

1. **Run actual test suite** against Editor and useAppState changes to measure real blast radius
2. **Audit manager dependencies** — which managers actually depend on which? Creates a matrix vs. flat coupling claim.
3. **Check TestEditor complexity** — is it a thin wrapper or massive boilerplate? Informs whether it's a code smell or legitimate pattern.
4. **Audit useAppState dependencies** — of 51+ consumers, how many actually need all three (file, auth, sync)? Some may only need subset.
5. **Verify initialization order sensitivity** — do managers break if order changes, or is it safe?

---

## Confidence Level

- **High confidence:** Cycles, import counts, layer boundaries, base class patterns
- **Medium confidence:** Testability assessments (no actual test runs done), blast radius estimates
- **Low confidence:** Runtime coupling severity, manager interaction breakage scenarios

---

**Date:** 2026-06-15  
**Review scope:** TL;DR + Section 1 (Hubs) + Section 2 (Cycles) + Section 3 (Boundaries)
