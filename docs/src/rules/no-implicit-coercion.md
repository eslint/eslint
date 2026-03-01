---
title: no-implicit-coercion
rule_type: suggestion
---



In JavaScript, there are a lot of different ways to convert value types.
Some of them might be hard to read and understand.

Such as:

```js
const b = !!foo;
const b1 = ~foo.indexOf(".");
const n = +foo;
const n1 = -(-foo);
const n2 = foo - 0;
const n3 = 1 * foo;
const s = "" + foo;
foo += ``;
```

Those can be replaced with the following code:

```js
const b = Boolean(foo);
const b1 = foo.indexOf(".") !== -1;
const n = Number(foo);
const n1 = Number(foo);
const n2 = Number(foo);
const n3 = Number(foo);
const s = String(foo);
foo = String(foo);
```

## Rule Details

This rule is aimed to flag shorter notations for the type conversion, then suggest a more self-explanatory notation.

## Options

This rule has three main options and one override option to allow some coercions as required.

* `"boolean"` (`true` by default) - When this is `true`, this rule warns shorter type conversions for `boolean` type.
* `"number"` (`true` by default) - When this is `true`, this rule warns shorter type conversions for `number` type.
* `"string"` (`true` by default) - When this is `true`, this rule warns shorter type conversions for `string` type.
* `"disallowTemplateShorthand"` (`false` by default) - When this is `true`, this rule warns `string` type conversions using `${expression}` form.
* `"allow"` (`empty` by default) - Each entry in this array can be one of `~`, `!!`, `+`, `- -`, `-`, or `*` that are to be allowed.

Note that operator `+` in `allow` list would allow `+foo` (number coercion) as well as `"" + foo` (string coercion).

### boolean

Examples of **incorrect** code for the default `{ "boolean": true }` option:

::: incorrect

```js
/*eslint no-implicit-coercion: "error"*/

const b = !!foo;
const b1 = ~foo.indexOf(".");
// bitwise not is incorrect only with `indexOf`/`lastIndexOf` method calling.
```

:::

Examples of **correct** code for the default `{ "boolean": true }` option:

::: correct

```js
/*eslint no-implicit-coercion: "error"*/

const b = Boolean(foo);
const b1 = foo.indexOf(".") !== -1;

const n = ~foo; // This is a just bitwise not.
```

:::

### number

Examples of **incorrect** code for the default `{ "number": true }` option:

::: incorrect

```js
/*eslint no-implicit-coercion: "error"*/

const n = +foo;
const n1 = -(-foo);
const n2 = foo - 0;
const n3 = 1 * foo;
```

:::

Examples of **correct** code for the default `{ "number": true }` option:

::: correct

```js
/*eslint no-implicit-coercion: "error"*/

const n = Number(foo);
const n1 = parseFloat(foo);
const n2 = parseInt(foo, 10);

const n3 = foo * 1/4; // `* 1` is allowed when followed by the `/` operator
```

:::

### string

Examples of **incorrect** code for the default `{ "string": true }` option:

::: incorrect

```js
/*eslint no-implicit-coercion: "error"*/

const s = "" + foo;
const s1 = `` + foo;
foo += "";
foo += ``;
```

:::

Examples of **correct** code for the default `{ "string": true }` option:

::: correct

```js
/*eslint no-implicit-coercion: "error"*/

const s = String(foo);
foo = String(foo);
```

:::

### disallowTemplateShorthand

This option is **not** affected by the `string` option.

Examples of **incorrect** code for the `{ "disallowTemplateShorthand": true }` option:

::: incorrect

```js
/*eslint no-implicit-coercion: ["error", { "disallowTemplateShorthand": true }]*/

const s = `${foo}`;
```

:::

Examples of **correct** code for the `{ "disallowTemplateShorthand": true }` option:

::: correct

```js
/*eslint no-implicit-coercion: ["error", { "disallowTemplateShorthand": true }]*/

const s = String(foo);

const s1 = `a${foo}`;

const s2 = `${foo}b`;

const s3 = `${foo}${bar}`;

const s4 = tag`${foo}`;
```

:::

Examples of **correct** code for the default `{ "disallowTemplateShorthand": false }` option:

::: correct

```js
/*eslint no-implicit-coercion: ["error", { "disallowTemplateShorthand": false }]*/

const s = `${foo}`;
```

:::

### allow

Using `allow` list, we can override and allow specific operators.

Examples of **correct** code for the sample `{ "allow": ["!!", "~"] }` option:

::: correct

```js
/*eslint no-implicit-coercion: [2, { "allow": ["!!", "~"] } ]*/

const b = !!foo;
const b1 = ~foo.indexOf(".");
```

:::

## When Not To Use It

If you don't want to be notified about shorter notations for the type conversion, you can safely disable this rule.
