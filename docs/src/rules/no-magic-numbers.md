---
title: no-magic-numbers
rule_type: suggestion
---


'Magic numbers' are numbers that occur multiple times in code without an explicit meaning.
They should preferably be replaced by named constants.

```js
var now = Date.now(),
    inOneHour = now + (60 * 60 * 1000);
```

## Rule Details

The `no-magic-numbers` rule aims to make code more readable and refactoring easier by ensuring that special numbers
are declared as constants to make their meaning explicit.

Examples of **incorrect** code for this rule:

::: incorrect

```js
/*eslint no-magic-numbers: "error"*/

var dutyFreePrice = 100,
    finalPrice = dutyFreePrice + (dutyFreePrice * 0.25);
```

:::

::: incorrect

```js
/*eslint no-magic-numbers: "error"*/

var data = ['foo', 'bar', 'baz'];

var dataLast = data[2];
```

:::

::: incorrect

```js
/*eslint no-magic-numbers: "error"*/

var SECONDS;

SECONDS = 60;
```

:::

Examples of **correct** code for this rule:

::: correct

```js
/*eslint no-magic-numbers: "error"*/

var TAX = 0.25;

var dutyFreePrice = 100,
    finalPrice = dutyFreePrice + (dutyFreePrice * TAX);
```

:::

## Options

### ignore

An array of numbers to ignore. It's set to `[]` by default.
If provided, it must be an `Array`.

The array can contain values of `number` and `string` types.
If it's a string, the text must be parsed as `bigint` literal (e.g., `"100n"`).

Examples of **correct** code for the sample `{ "ignore": [1] }` option:

::: correct

```js
/*eslint no-magic-numbers: ["error", { "ignore": [1] }]*/

var data = ['foo', 'bar', 'baz'];
var dataLast = data.length && data[data.length - 1];
```

:::

Examples of **correct** code for the sample `{ "ignore": ["1n"] }` option:

::: correct

```js
/*eslint no-magic-numbers: ["error", { "ignore": ["1n"] }]*/

foo(1n);
```

:::

### ignoreArrayIndexes

A boolean to specify if numbers used in the context of array indexes (e.g., `data[2]`) are considered okay. `false` by default.

This option allows only valid array indexes: numbers that will be coerced to one of `"0"`, `"1"`, `"2"` ... `"4294967294"`.

Arrays are objects, so they can have property names such as `"-1"` or `"2.5"`. However, those are just "normal" object properties that don't represent array elements. They don't influence the array's `length`, and they are ignored by array methods like `.map` or `.forEach`.

Additionally, since the maximum [array length](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/length) is 2<sup>32</sup> - 1, all values above 2<sup>32</sup> - 2 also represent just normal property names and are thus not considered to be array indexes.

Examples of **correct** code for the `{ "ignoreArrayIndexes": true }` option:

::: correct

```js
/*eslint no-magic-numbers: ["error", { "ignoreArrayIndexes": true }]*/

var item = data[2];

data[100] = a;

f(data[0]);

a = data[-0]; // same as data[0], -0 will be coerced to "0"

a = data[0xAB];

a = data[5.6e1];

a = data[10n]; // same as data[10], 10n will be coerced to "10"

a = data[4294967294]; // max array index
```

:::

Examples of **incorrect** code for the `{ "ignoreArrayIndexes": true }` option:

::: incorrect

```js
/*eslint no-magic-numbers: ["error", { "ignoreArrayIndexes": true }]*/

f(2); // not used as array index

a = data[-1];

a = data[2.5];

a = data[5.67e1];

a = data[-10n];

a = data[4294967295]; // above the max array index

a = data[1e500]; // same as data["Infinity"]
```

:::

### ignoreDefaultValues

A boolean to specify if numbers used in default value assignments are considered okay. `false` by default.

Examples of **correct** code for the `{ "ignoreDefaultValues": true }` option:

::: correct

```js
/*eslint no-magic-numbers: ["error", { "ignoreDefaultValues": true }]*/

const { tax = 0.25 } = accountancy;

function mapParallel(concurrency = 3) { /***/ }
```

:::

::: correct

```js
/*eslint no-magic-numbers: ["error", { "ignoreDefaultValues": true }]*/

let head;
[head = 100] = []
```

:::

### ignoreClassFieldInitialValues

A boolean to specify if numbers used as initial values of class fields are considered okay. `false` by default.

Examples of **correct** code for the `{ "ignoreClassFieldInitialValues": true }` option:

::: correct

```js
/*eslint no-magic-numbers: ["error", { "ignoreClassFieldInitialValues": true }]*/

class C {
    foo = 2;
    bar = -3;
    #baz = 4;
    static qux = 5;
}
```

:::

Examples of **incorrect** code for the `{ "ignoreClassFieldInitialValues": true }` option:

::: incorrect

```js
/*eslint no-magic-numbers: ["error", { "ignoreClassFieldInitialValues": true }]*/

class C {
    foo = 2 + 3;
}

class D {
    2;
}
```

:::

### enforceConst

A boolean to specify if we should check for the const keyword in variable declaration of numbers. `false` by default.

Examples of **incorrect** code for the `{ "enforceConst": true }` option:

::: incorrect

```js
/*eslint no-magic-numbers: ["error", { "enforceConst": true }]*/

var TAX = 0.25;

var dutyFreePrice = 100,
    finalPrice = dutyFreePrice + (dutyFreePrice * TAX);
```

:::

### detectObjects

A boolean to specify if we should detect numbers when setting object properties for example. `false` by default.

Examples of **incorrect** code for the `{ "detectObjects": true }` option:

::: incorrect

```js
/*eslint no-magic-numbers: ["error", { "detectObjects": true }]*/

var magic = {
  tax: 0.25
};

var dutyFreePrice = 100,
    finalPrice = dutyFreePrice + (dutyFreePrice * magic.tax);
```

:::

Examples of **correct** code for the `{ "detectObjects": true }` option:

::: correct

```js
/*eslint no-magic-numbers: ["error", { "detectObjects": true }]*/

var TAX = 0.25;

var magic = {
  tax: TAX
};

var dutyFreePrice = 100,
    finalPrice = dutyFreePrice + (dutyFreePrice * magic.tax);
```

:::
