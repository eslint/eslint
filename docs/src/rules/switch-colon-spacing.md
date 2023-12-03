---
title: switch-colon-spacing
rule_type: layout
---

This rule was **deprecated** in ESLint v8.53.0. Please use the [corresponding rule](https://eslint.style/rules/js/switch-colon-spacing) in [`@stylistic/eslint-plugin-js`](https://eslint.style/packages/js).

Spacing around colons improves readability of `case`/`default` clauses.

## Rule Details

This rule controls spacing around colons of `case` and `default` clauses in `switch` statements.
This rule does the check only if the consecutive tokens exist on the same line.

This rule has 2 options that are boolean value.

```json
{
    "switch-colon-spacing": ["error", {"after": true, "before": false}]
}
```

* `"after": true` (Default) requires one or more spaces after colons.
* `"after": false` disallows spaces after colons.
* `"before": true` requires one or more spaces before colons.
* `"before": false` (Default) disallows before colons.

Examples of **incorrect** code for this rule:

::: incorrect

```js
/*eslint switch-colon-spacing: "error"*/

switch (a) {
    case 0 :break;
    default :foo();
}
```

:::

Examples of **correct** code for this rule:

::: correct

```js
/*eslint switch-colon-spacing: "error"*/

switch (a) {
    case 0: foo(); break;
    case 1:
        bar();
        break;
    default:
        baz();
        break;
}
```

:::

Examples of **incorrect** code for this rule with `{"after": false, "before": true}` option:

::: incorrect

```js
/*eslint switch-colon-spacing: ["error", {"after": false, "before": true}]*/

switch (a) {
    case 0: break;
    default: foo();
}
```

:::

Examples of **correct** code for this rule with `{"after": false, "before": true}` option:

::: correct

```js
/*eslint switch-colon-spacing: ["error", {"after": false, "before": true}]*/

switch (a) {
    case 0 :foo(); break;
    case 1 :
        bar();
        break;
    default :
        baz();
        break;
}
```

:::

## When Not To Use It

If you don't want to notify spacing around colons of switch statements, then it's safe to disable this rule.
