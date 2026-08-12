# AI Agent Instructions

This file provides guidance to AI agents when working with code in this repository.

## AI Disclosure Requirement

ESLint's [AI Usage Policy](docs/src/contribute/ai-policy.md) requires that AI-assisted contributions be disclosed. Whenever you (an AI) create content on GitHub for this project, you **must** include a disclosure, using the name of the model actually producing the content (for example, `Claude Opus 5`):

- **Issues** — add a bold sentence to the top of body:

    **This issue was created with AI (Claude Opus 5).**

- **Pull requests** — add a bold sentence to the top of the description:

    **This pull request was created with AI (Claude Opus 5).**

- **Comments, review comments, and review summaries** — add a final paragraph in bold:

    **Created by AI (Claude Opus 5).**

This applies to every AI-authored submission without exception, including follow-up comments on an existing thread. Note two related policy points: AI-generated PRs are only considered for issues labeled `accepted`, and maintainer feedback is expected to be answered by a human rather than fed back into an AI.

## Commands

```bash
npm test                 # full suite: rule-file checks, mocha + coverage thresholds, fuzzer, license check
npm run test:cli tests/lib/rules/no-undef.js   # run a single test file (alias for local mocha)
npm run lint             # lint everything (JS, docs JS, docs Markdown, rule types, config files)
npm run lint:fix
npm run fmt              # prettier --write . (prettier is the formatter; eslint does not handle style here)
npm run test:types       # tsc against tests/lib/types
npm run test:browser     # cypress against the webpack bundle
npm run test:performance
```

Useful details:

- Coverage gates are enforced in `npm test` (99% statements/functions/lines, 98% branches). A change that adds uncovered code fails the build even if all tests pass.
- Mocha's default timeout is 10000ms; override with `ESLINT_MOCHA_TIMEOUT=20000 npm test`.
- `npm test` runs mocha with `--forbid-only`, so `only: true` / `RuleTester.only(...)` must be removed before pushing.
- Task definitions live in `Makefile.js` (shelljs-based), not a Makefile. `npm run lint`, `npm test`, etc. are thin wrappers around `node Makefile.js <target>`.
- The docs website is a separate workspace with its own scripts: `cd docs && npm start` serves it locally.
- A `lint-staged` pre-commit hook regenerates derived files. Editing `lib/rules/*.js` regenerates `packages/js/src/configs/*.js` and `lib/types/rules.d.ts`; editing `docs/src/rules/*.md` regenerates `docs/src/_data/further_reading_links.json`. Don't hand-edit those generated files.

## Architecture

The layering is strict, and each layer is forbidden from doing what the layer below it does. Respect these boundaries — tests and reviews enforce them.

- `bin/eslint.js` → `lib/cli.js` → `lib/eslint/eslint.js` → `lib/linter/linter.js` → `lib/rules/*.js`
- **`lib/cli.js`** is the only place that reads argv, writes to the console, and sets exit codes. It may not call `process.exit()` directly.
- **`lib/eslint/`** (`ESLint` class) owns all file system access: file/glob resolution, config loading, plugin and formatter loading. It must not print anything or use a formatter itself. `lib/eslint/worker.js` supports multithreaded linting.
- **`lib/linter/`** (`Linter` class) is pure and synchronous: no file I/O, no console, no Node-specific APIs, no async. `verify()` parses text, traverses the AST, and emits node-type events (plus `:exit` events and code path analysis events from `lib/linter/code-path-analysis/`) that rules subscribe to.
- **`lib/rules/`** rules are the most constrained layer: inspect the AST, report problems. Same prohibitions as `Linter`.
- **`lib/config/`** implements flat config: `config-loader.js` finds and loads `eslint.config.js`, `flat-config-array.js` and `flat-config-schema.js` normalize and validate it, `default-config.js` supplies base values.
- **`lib/languages/js/`** is the JavaScript language implementation, including `SourceCode`. ESLint's language plugin abstraction means JS is one language among potential others, so language-specific logic belongs here rather than in `Linter`.
- **`lib/rule-tester/`** is `RuleTester`, a wrapper over Mocha-style globals used by essentially every rule test.
- **`lib/shared/`** is cross-cutting utilities (`flags.js` for feature flags, `traverser.js`, severity/naming/serialization helpers). `lib/services/` holds parser, processor, suppressions, and warning services used by `ESLint`.
- **`packages/js`** (`@eslint/js`) publishes the `recommended` and `all` configs, generated from rule metadata. **`packages/eslint-config-eslint`** is the config this repo lints itself with.

## Rules

- Rule source: `lib/rules/<name>.js`. Test: `tests/lib/rules/<name>.js`. Docs: `docs/src/rules/<name>.md`. All three are required, and `npm test` fails if they aren't consistent.
- New rules must be registered in `lib/rules/index.js`, in the alphabetically-sorted `LazyLoadingRuleMap`.
- Each rule exports `{ meta, create }`. `meta` carries `type` (`problem` | `suggestion` | `layout`), `docs` (description, recommended, url), `schema`, `fixable`/`hasSuggestions`, and `messages`. Report with `messageId`, never a raw string.
- Define helper functions at module scope, not inside `create`, so they aren't rebuilt per file.
- Shared AST helpers live in `lib/rules/utils/ast-utils.js`.
- `RuleTester` uses flat config (`languageOptions`, not `parserOptions`).
- Rule docs use frontmatter with `title` and `rule_type`, and examples in `::: incorrect` / `::: correct` containers where each example includes its own `/*eslint rule-name: "error"*/` comment. `npm run lint:docs:rule-examples` validates that these examples actually produce (or don't produce) the reported problems.
- `tools/internal-rules/` contains lint rules that check ESLint's own rule files (e.g. `no-invalid-meta`).

## Conventions

- CommonJS (`"type": "commonjs"`), Node `^20.19.0 || ^22.13.0 || >=24`.
- Source files follow a fixed layout: `@fileoverview`/`@author` header, requirements (imports), optional type definitions, optional helpers, then exports. Tools and scripts add a main section at the end.
- Tests are Mocha + `const assert = require("chai").assert`, mirroring the source tree under `tests/`. Every bug fix needs a test; never delete existing tests, even failing ones.
- Commits follow Conventional Commits without scopes: `fix:`, `feat:`, `fix!:`, `feat!:`, `docs:`, `chore:`, `build:`, `refactor:`, `test:`, `ci:`, `perf:`. Summary ≤72 characters. Reference issues in the body with `Fixes #1234` or `Refs #1234`. The PR title is checked in CI because it becomes the changelog entry.
