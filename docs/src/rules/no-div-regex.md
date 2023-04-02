---
title: no-div-regex
rule_type: suggestion
related_rules:
- no-control-regex
- no-regex-spaces
---



Require regex literals to escape equal signs at the beginning.

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
