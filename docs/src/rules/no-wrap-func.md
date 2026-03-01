---
title: no-wrap-func

---

Disallows unnecessary parentheses around function expressions.

::: important
This rule was removed in ESLint v1.0.0 and replaced by the [no-extra-parens](no-extra-parens) rule. The `"functions"` option in the new rule is equivalent to the removed rule.
:::

Although it's possible to wrap functions in parentheses, this can be confusing when the code also contains immediately-invoked function expressions (IIFEs) since parentheses are often used to make this distinction. For example:

```js
var foo = (function() {
    // IIFE
}());

var bar = (function() {
    // not an IIFE
});
```

## Rule Details

This rule will raise a warning when it encounters a function expression wrapped in parentheses with no following invoking parentheses.

Example of **incorrect** code for this rule:

::: incorrect

```js
var a = (function() {/*...*/});
```

:::

Examples of **correct** code for this rule:

::: correct

```js
var a = function() {/*...*/};

(function() {/*...*/})();
```

:::
