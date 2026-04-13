# Research program

This is the research playbook. It tells agents what to optimize, what they can touch, and what constraints to respect. Read this before every experiment.

The maintainer writes and edits this file. When the research direction shifts, update this file. Contributors pick up the change on their next session start.

required_confirmations: 0
metric_tolerance: 10
metric_direction: lower_is_better
lead_github_login: alanzabihi
maintainer_github_login: alanzabihi
auto_approve: true
assignment_timeout: 24h
review_timeout: 12h
min_queue_depth: 5
max_queue_depth: 10

## Goal

Reduce the wall-clock time (in milliseconds) to lint a large JavaScript file using ESLint's `Linter.verify()` API with the `@eslint/js` recommended ruleset. Lower is better. The baseline on `main` is approximately **175 ms** (median of 10 runs on `tests/bench/large.js`, 19 500 lines). An improvement must reduce the median by at least **10 ms**.

Secondary constraint: correctness. The lint output (rule violations reported) must remain identical to the baseline. The benchmark emits a message fingerprint that must match `4944605e99e3`.

## What you CAN modify

<!-- prettier-ignore -->
lib/

All source files under `lib/` are fair game. This includes the core linter, AST traversal, rule implementations, config loading, scope analysis integration, selector matching, source code representation, and shared utilities.

## What you CANNOT modify

<!-- prettier-ignore-start -->
.polyresearch/**
POLYRESEARCH.md
PROGRAM.md
PREPARE.md
results.tsv
tests/**
packages/**
docs/**
tools/**
conf/**
bin/**
templates/**
messages/**
node_modules/**
package.json
package-lock.json
.github/**
Makefile.js
<!-- prettier-ignore-end -->

The evaluation code, test suite, build system, published packages, and dependencies are off-limits.

## Constraints

1. **Correctness is non-negotiable.** The benchmark verifies that the number and identity of lint messages are unchanged via a SHA-256 fingerprint. If your change alters which messages are reported (adds, removes, or shifts any violation), it fails.
2. **No new dependencies.** Do not add, remove, or upgrade entries in `package.json`. Optimize using the existing dependency set.
3. **Tests must pass.** Run `npm test` to verify. A change that breaks existing tests is rejected regardless of performance gain.
4. **No caching tricks.** The benchmark creates a fresh `Linter` instance and lints from a cold start. File-level caching, memoization across runs, or other stateful shortcuts that would not help real-world single-file linting are not valid improvements.
5. **Expected run time.** A single benchmark invocation (`.polyresearch/bench.js`) takes approximately 120-180 seconds including warmup. Kill and record as `crashed` if it exceeds 360 seconds.

## Strategy

The hot path for `Linter.verify()` on a single large file runs through:

1. **Parsing** (`lib/languages/js/index.js`) -- espree parses source into AST.
2. **Scope analysis** -- `eslint-scope` builds the scope tree.
3. **SourceCode construction** (`lib/languages/js/source-code/source-code.js`) -- merges tokens, comments, builds lookup structures.
4. **Rule setup** (`lib/linter/linter.js` `runRules()`) -- iterates configured rules, creates listeners.
5. **AST traversal and selector matching** (`lib/linter/source-code-traverser.js`, `lib/linter/esquery.js`) -- walks the tree, matches CSS-like selectors to nodes, dispatches rule listeners.
6. **Disable directive processing** (`lib/linter/apply-disable-directives.js`).

Promising directions:

- Reduce allocation pressure in the traversal loop (object reuse, avoid unnecessary copies).
- Optimize selector matching -- many rules register for simple node types, not complex selectors.
- Lazy initialization of data structures in SourceCode that are not needed by every rule.
- Reduce overhead in rule context creation and listener dispatch.
- Optimize the code path analysis state machine (`lib/linter/code-path-analysis/`), which is large (71 KB) and runs on every function.

Known dead ends: none yet (this is a fresh project).
