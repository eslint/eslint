# Roadmap: ESLint XSS Fix Re-application

## Phases
- [ ] **Phase 1: Revert Problematic Merge** - Revert merge commit `4b8560ff28038ee2e37cc9f54aad81c623fed128` on the `main` branch.
- [ ] **Phase 2: Feature Branch Creation** - Create a new branch `fix/html-formatter-xss-clean` from the updated `main`.
- [ ] **Phase 3: Apply Fix and Commit** - Re-apply XSS fix and tests, then commit as Kuldeep Kumar.
- [ ] **Phase 4: Integration and Merge** - Merge the feature branch back into `main`.

## Phase Details

### Phase 1: Revert Problematic Merge
**Goal**: Revert the recent merge commit on the `main` branch.
**Depends on**: Nothing
**Requirements**: GIT-01
**Success Criteria** (what must be TRUE):
  1. `main` branch head is a revert of `4b8560ff28038ee2e37cc9f54aad81c623fed128`.
  2. Workspace is clean and ready for new branch creation.
**Plans**: 1 plans
Plans:
- [ ] 01-01-PLAN.md — Revert merge commit 4b8560ff

### Phase 2: Feature Branch Creation
**Goal**: Establish a clean feature branch for the fix.
**Depends on**: Phase 1
**Requirements**: GIT-02
**Success Criteria** (what must be TRUE):
  1. Branch `fix/html-formatter-xss-clean` exists.
  2. Branch is checked out and based on the reverted `main`.
**Plans**: TBD

### Phase 3: Apply Fix and Commit
**Goal**: Re-apply the XSS fix with correct attribution and tests.
**Depends on**: Phase 2
**Requirements**: FIX-01, FIX-02, GIT-03
**Success Criteria** (what must be TRUE):
  1. `lib/cli-engine/formatters/html.js` contains the XSS fix.
  2. `tests/lib/cli-engine/formatters/html.js` contains the regression tests.
  3. Change is committed with author "Kuldeep Kumar".
**Plans**: TBD

### Phase 4: Integration and Merge
**Goal**: Merge the clean fix into the `main` branch.
**Depends on**: Phase 3
**Requirements**: GIT-04
**Success Criteria** (what must be TRUE):
  1. `fix/html-formatter-xss-clean` is merged into `main`.
  2. `main` branch includes the XSS fix and tests.
**Plans**: TBD

## Progress Table

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Revert Problematic Merge | 0/1 | Not started | - |
| 2. Feature Branch Creation | 0/1 | Not started | - |
| 3. Apply Fix and Commit | 0/1 | Not started | - |
| 4. Integration and Merge | 0/1 | Not started | - |
