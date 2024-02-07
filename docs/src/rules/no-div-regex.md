---
title: no-div-regex
rule_type: suggestion
related_rules:
- no-control-regex
- no-regex-spaces
---



Characters `/=` at the beginning of a regular expression literal can be confused with a division assignment operator.

```js
function bar() { return /=foo/; }
```

## Rule Details

This rule forbids equal signs (`=`) after the slash (`/`) at the beginning of a regular expression literal, because the characters `/=` can be confused with a division assignment operator.

Examples of **incorrect** code for this rule:

:::incorrect

```js
/*eslint no-div-regex: "error"*/

function bar() { return /=foo/; }
```

:::

Examples of **correct** code for this rule:

:::correct

```js
/*eslint no-div-regex: "error"*/

function bar() { return /[=]foo/; }
```

:::
