## Candidate Areas For Deep Focus

1. packages/editor/src/lib/editor
   Why:
   - highest coupling
   - Editor.ts hotspot

2. packages/tldraw/src/lib/ui
   Why:
   - highest churn
   - bridges SDK and consumers

3. apps/dotcom/client/src/tla
   Why:
   - frontend + sync-worker coupling