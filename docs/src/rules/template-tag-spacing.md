---
title: template-tag-spacing
rule_type: layout
further_reading:
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#Tagged_template_literals
- https://exploringjs.com/es6/ch_template-literals.html#_examples-of-using-tagged-template-literals
---

This rule was **deprecated** in ESLint v8.53.0. Please use the [corresponding rule](https://eslint.style/rules/js/template-tag-spacing) in [`@stylistic/eslint-plugin-js`](https://eslint.style/packages/js).
<!-- markdownlint-disable-next-line MD051 -->
With ES6, it's possible to create functions called [tagged template literals](#further-reading) where the function parameters consist of a template literal's strings and expressions.

When using tagged template literals, it's possible to insert whitespace between the tag function and the template literal. Since this whitespace is optional, the following lines are equivalent:

```js
let hello = func`Hello world`;
let hello = func `Hello world`;
```

## Rule Details

This rule aims to maintain consistency around the spacing between template tag functions and their template literals.

## Options

```json
{
    "template-tag-spacing": ["error", "never"]
}
```

This rule has one option whose value can be set to `"never"` or `"always"`

* `"never"` (default) - Disallows spaces between a tag function and its template literal.
* `"always"` - Requires one or more spaces between a tag function and its template literal.

## Examples

### never

Examples of **incorrect** code for this rule with the default `"never"` option:

::: incorrect

```js
/*eslint template-tag-spacing: "error"*/

func `Hello world`;
```

:::

Examples of **correct** code for this rule with the default `"never"` option:

::: correct

```js
/*eslint template-tag-spacing: "error"*/

func`Hello world`;
```

:::

### always

Examples of **incorrect** code for this rule with the `"always"` option:

::: incorrect

```js
/*eslint template-tag-spacing: ["error", "always"]*/

func`Hello world`;
```

:::

Examples of **correct** code for this rule with the `"always"` option:

::: correct

```js
/*eslint template-tag-spacing: ["error", "always"]*/

func `Hello world`;
```

:::

## When Not To Use It

If you don't want to be notified about usage of spacing between tag functions and their template literals, then it's safe to disable this rule.
