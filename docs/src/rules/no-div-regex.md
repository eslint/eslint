---
title: no-div-regex
rule_type: suggestion
related_rules:
- no-control-regex
- no-regex-spaces
---



Require regex literals to escape division operators.

```js
function bar() { return /=foo/; }
```

## Rule Details

This is used to disambiguate the division operator to not confuse users.

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
