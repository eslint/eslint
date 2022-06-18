---
title: no-script-url
layout: doc
edit_link: https://github.com/eslint/eslint/edit/main/docs/src/rules/no-script-url.md
rule_type: suggestion
further_reading:
- https://stackoverflow.com/questions/13497971/what-is-the-matter-with-script-targeted-urls
---

Disallows `javascript:` URLs.

Using `javascript:` URLs is considered by some as a form of `eval`. Code passed in `javascript:` URLs has to be parsed and evaluated by the browser in the same way that `eval` is processed.

## Rule Details

Examples of **incorrect** code for this rule:

```js
/*eslint no-script-url: "error"*/

location.href = "javascript:void(0)";

location.href = `javascript:void(0)`;
```

## Compatibility

* **JSHint**: This rule corresponds to `scripturl` rule of JSHint.
