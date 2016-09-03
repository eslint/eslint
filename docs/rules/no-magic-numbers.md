# Disallow Magic Numbers (no-magic-numbers)

'Magic numbers' are numbers that occur multiple time in code without an explicit meaning.
They should preferably be replaced by named constants.

```js
var now = Date.now(),
    inOneHour = now + (60 * 60 * 1000);
```

## Rule Details

The `no-magic-numbers` rule aims to make code more readable and refactoring easier by ensuring that special numbers
are declared as constants to make their meaning explicit.

Examples of **incorrect** code for this rule:

```js
/*eslint no-magic-numbers: "error"*/

var dutyFreePrice = 100,
    finalPrice = dutyFreePrice + (dutyFreePrice * 0.25);
```

```js
/*eslint no-magic-numbers: "error"*/

var data = ['foo', 'bar', 'baz'];

var dataLast = data[2];
```

```js
/*eslint no-magic-numbers: "error"*/

var SECONDS;

SECONDS = 60;
```

Examples of **correct** code for this rule:

```js
/*eslint no-magic-numbers: "error"*/

var TAX = 0.25;

var dutyFreePrice = 100,
    finalPrice = dutyFreePrice + (dutyFreePrice * TAX);
```

## Options

### ignore

An array of numbers to ignore. It's set to `[]` by default.
If provided, it must be an `Array`.

Examples of **correct** code for the sample `{ "ignore": [1] }` option:

```js
/*eslint no-magic-numbers: ["error", { "ignore": [1] }]*/

var data = ['foo', 'bar', 'baz'];
var dataLast = data.length && data[data.length - 1];
```

### ignoreArrayIndexes

A boolean to specify if numbers used as array indexes are considered okay. `false` by default.

Examples of **correct** code for the `{ "ignoreArrayIndexes": true }` option:

```js
/*eslint no-magic-numbers: ["error", { "ignoreArrayIndexes": true }]*/

var data = ['foo', 'bar', 'baz'];
var dataLast = data[2];
```

### enforceConst

A boolean to specify if we should check for the const keyword in variable declaration of numbers. `false` by default.

Examples of **incorrect** code for the `{ "enforceConst": true }` option:

```js
/*eslint no-magic-numbers: ["error", { "enforceConst": true }]*/

var TAX = 0.25;

var dutyFreePrice = 100,
    finalPrice = dutyFreePrice + (dutyFreePrice * TAX);
```

### detectObjects

A boolean to specify if we should detect numbers when setting object properties for example. `false` by default.

Examples of **incorrect** code for the `{ "detectObjects": true }` option:

```js
/*eslint no-magic-numbers: ["error", { "detectObjects": true }]*/

var magic = {
  tax: 0.25
};

var dutyFreePrice = 100,
    finalPrice = dutyFreePrice + (dutyFreePrice * magic.tax);
```

Examples of **correct** code for the `{ "detectObjects": true }` option:

```js
/*eslint no-magic-numbers: ["error", { "detectObjects": true }]*/

var TAX = 0.25;

var magic = {
  tax: TAX
};

var dutyFreePrice = 100,
    finalPrice = dutyFreePrice + (dutyFreePrice * magic.tax);
```
