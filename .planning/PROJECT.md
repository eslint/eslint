# Project: ESLint XSS Fix Re-application

## Core Value
Cleanly re-apply the XSS fix for the HTML formatter in ESLint after reverting a problematic merge, ensuring the commit history remains clean and attribute-correct.

## Constraints
- Revert specifically commit `4b8560ff28038ee2e37cc9f54aad81c623fed128`.
- Use feature branch `fix/html-formatter-xss-clean`.
- Fix applied to `lib/cli-engine/formatters/html.js`.
- Tests added to `tests/lib/cli-engine/formatters/html.js`.
- Author must be Kuldeep Kumar.
- Final result merged to `main`.
