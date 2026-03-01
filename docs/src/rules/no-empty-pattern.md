---
title: no-empty-pattern
rule_type: problem
---



When using destructuring, it's possible to create a pattern that has no effect. This happens when empty curly braces are used to the right of an embedded object destructuring pattern, such as:

```js
// doesn't create any variables
const {a: {}} = foo;
```

In this code, no new variables are created because `a` is just a location helper while the `{}` is expected to contain the variables to create, such as:

```js
// creates variable b
const {a: { b }} = foo;
```

In many cases, the empty object pattern is a mistake where the author intended to use a default value instead, such as:

```js
// creates variable a
const {a = {}} = foo;
```

The difference between these two patterns is subtle, especially because the problematic empty pattern looks just like an object literal.

## Rule Details

This rule aims to flag any empty patterns in destructured objects and arrays, and as such, will report a problem whenever one is encountered.

Examples of **incorrect** code for this rule:

::: incorrect

```js
/*eslint no-empty-pattern: "error"*/

const {} = foo;
const [] = foo;
const {a: {}} = foo;
const {a: []} = foo;
function foo({}) {}
function bar([]) {}
function baz({a: {}}) {}
function qux({a: []}) {}
```

:::

Examples of **correct** code for this rule:

::: correct

```js
/*eslint no-empty-pattern: "error"*/

const {a = {}} = foo;
const {b = []} = foo;
function foo({a = {}}) {}
function bar({a = []}) {}
```

:::

## Options

This rule has an object option for exceptions:

### allowObjectPatternsAsParameters

Set to `false` by default. Setting this option to `true` allows empty object patterns as function parameters.

**Note:** This rule doesn't allow empty array patterns as function parameters.

Examples of **incorrect** code for this rule with the `{"allowObjectPatternsAsParameters": true}` option:

::: incorrect

```js
/*eslint no-empty-pattern: ["error", { "allowObjectPatternsAsParameters": true }]*/

function foo({a: {}}) {}
const bar = function({a: {}}) {};
const qux = ({a: {}}) => {};
const quux = ({} = bar) => {};
const item = ({} = { bar: 1 }) => {};

function baz([]) {}
```

:::

Examples of **correct** code for this rule with the `{"allowObjectPatternsAsParameters": true}` option:

::: correct

```js
/*eslint no-empty-pattern: ["error", { "allowObjectPatternsAsParameters": true }]*/

function foo({}) {}
const bar = function({}) {};
const qux = ({}) => {};

function baz({} = {}) {}
```

:::
