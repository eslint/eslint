---
title: arrow-parens
rule_type: layout
further_reading:
- https://github.com/airbnb/javascript#arrows--one-arg-parens
---

This rule was **deprecated** in ESLint v8.53.0. Please use the [corresponding rule](https://eslint.style/rules/js/arrow-parens) in [`@stylistic/eslint-plugin-js`](https://eslint.style/packages/js).

Arrow functions can omit parentheses when they have exactly one parameter. In all other cases the parameter(s) must
be wrapped in parentheses. This rule enforces the consistent use of parentheses in arrow functions.

## Rule Details

This rule enforces parentheses around arrow function parameters regardless of arity. For example:

```js
// Bad
a => {}

// Good
(a) => {}
```

Following this style will help you find arrow functions (`=>`) which may be mistakenly included in a condition
when a comparison such as `>=` was the intent.

```js
// Bad
if (a => 2) {
}

// Good
if (a >= 2) {
}
```

The rule can also be configured to discourage the use of parens when they are not required:

```js
// Bad
(a) => {}

// Good
a => {}
```

## Options

This rule has a string option and an object one.

String options are:

* `"always"` (default) requires parens around arguments in all cases.
* `"as-needed"` enforces no parens where they can be omitted.

Object properties for variants of the `"as-needed"` option:

* `"requireForBlockBody": true` modifies the as-needed rule in order to require parens if the function body is in an instructions block (surrounded by braces).

### always

Examples of **incorrect** code for this rule with the default `"always"` option:

:::incorrect

```js
/*eslint arrow-parens: ["error", "always"]*/

a => {};
a => a;
a => {'\n'};
a.then(foo => {});
a.then(foo => a);
a(foo => { if (true) {} });
```

:::

Examples of **correct** code for this rule with the default `"always"` option:

:::correct

```js
/*eslint arrow-parens: ["error", "always"]*/

() => {};
(a) => {};
(a) => a;
(a) => {'\n'}
a.then((foo) => {});
a.then((foo) => { if (true) {} });
```

:::

#### If Statements

One of the benefits of this option is that it prevents the incorrect use of arrow functions in conditionals:

```js
var a = 1;
var b = 2;
// ...
if (a => b) {
 console.log('bigger');
} else {
 console.log('smaller');
}
// outputs 'bigger', not smaller as expected
```

The contents of the `if` statement is an arrow function, not a comparison.

If the arrow function is intentional, it should be wrapped in parens to remove ambiguity.

```js
var a = 1;
var b = 0;
// ...
if ((a) => b) {
 console.log('truthy value returned');
} else {
 console.log('falsy value returned');
}
// outputs 'truthy value returned'
```

The following is another example of this behavior:

```js
var a = 1, b = 2, c = 3, d = 4;
var f = a => b ? c: d;
// f = ?
```

`f` is an arrow function which takes `a` as an argument and returns the result of `b ? c: d`.

This should be rewritten like so:

```js
var a = 1, b = 2, c = 3, d = 4;
var f = (a) => b ? c: d;
```

### as-needed

Examples of **incorrect** code for this rule with the `"as-needed"` option:

:::incorrect

```js
/*eslint arrow-parens: ["error", "as-needed"]*/

(a) => {};
(a) => a;
(a) => {'\n'};
a.then((foo) => {});
a.then((foo) => a);
a((foo) => { if (true) {} });
const f = /** @type {number} */(a) => a + a;
const g = /* comment */ (a) => a + a;
const h = (a) /* comment */ => a + a;
```

:::

Examples of **correct** code for this rule with the `"as-needed"` option:

:::correct

```js
/*eslint arrow-parens: ["error", "as-needed"]*/

() => {};
a => {};
a => a;
a => {'\n'};
a.then(foo => {});
a.then(foo => { if (true) {} });
(a, b, c) => a;
(a = 10) => a;
([a, b]) => a;
({a, b}) => a;
const f = (/** @type {number} */a) => a + a;
const g = (/* comment */ a) => a + a;
const h = (a /* comment */) => a + a;
```

:::

### requireForBlockBody

Examples of **incorrect** code for the `{ "requireForBlockBody": true }` option:

:::incorrect

```js
/*eslint arrow-parens: [2, "as-needed", { "requireForBlockBody": true }]*/

(a) => a;
a => {};
a => {'\n'};
a.map((x) => x * x);
a.map(x => {
  return x * x;
});
a.then(foo => {});
```

:::

Examples of **correct** code for the `{ "requireForBlockBody": true }` option:

:::correct

```js
/*eslint arrow-parens: [2, "as-needed", { "requireForBlockBody": true }]*/

(a) => {};
(a) => {'\n'};
a => ({});
() => {};
a => a;
a.then((foo) => {});
a.then((foo) => { if (true) {} });
a((foo) => { if (true) {} });
(a, b, c) => a;
(a = 10) => a;
([a, b]) => a;
({a, b}) => a;
```

:::
