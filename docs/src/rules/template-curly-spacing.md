---
title: template-curly-spacing
rule_type: layout
---

This rule was **deprecated** in ESLint v8.53.0. Please use the corresponding rule in [`@stylistic/eslint-plugin-js`](https://eslint.style/packages/js).

We can embed expressions in template strings with using a pair of `${` and `}`.

This rule can force usage of spacing _within_ the curly brace pair according to style guides.

```js
let hello = `hello, ${people.name}!`;
```

## Rule Details

This rule aims to maintain consistency around the spacing inside of template literals.

## Options

```json
{
    "template-curly-spacing": ["error", "never"]
}
```

This rule has one option which has either `"never"` or `"always"` as value.

* `"never"` (by default) - Disallows spaces inside of the curly brace pair.
* `"always"` - Requires one or more spaces inside of the curly brace pair.

## Examples

### never

Examples of **incorrect** code for this rule with the default `"never"` option:

::: incorrect

```js
/*eslint template-curly-spacing: "error"*/

`hello, ${ people.name}!`;
`hello, ${people.name }!`;

`hello, ${ people.name }!`;
```

:::

Examples of **correct** code for this rule with the default `"never"` option:

::: correct

```js
/*eslint template-curly-spacing: "error"*/

`hello, ${people.name}!`;

`hello, ${
    people.name
}!`;
```

:::

### always

Examples of **incorrect** code for this rule with the `"always"` option:

::: incorrect

```js
/*eslint template-curly-spacing: ["error", "always"]*/

`hello, ${ people.name}!`;
`hello, ${people.name }!`;

`hello, ${people.name}!`;
```

:::

Examples of **correct** code for this rule with the `"always"` option:

::: correct

```js
/*eslint template-curly-spacing: ["error", "always"]*/

`hello, ${ people.name }!`;

`hello, ${
    people.name
}!`;
```

:::

## When Not To Use It

If you don't want to be notified about usage of spacing inside of template strings, then it's safe to disable this rule.
