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

The following pattern is considered a problem:

```js
/*eslint no-magic-numbers: 2*/

var dutyFreePrice = 100,
    finalPrice = dutyFreePrice + (dutyFreePrice * 0.25); /*error No magic number: 0.25*/
```

The following pattern is considered okay:

```js
/*eslint no-magic-numbers: 2*/

var TAX_PERCENTAGE = 0.25;

var dutyFreePrice = 100,
    finalPrice = dutyFreePrice + (dutyFreePrice * TAX_PERCENTAGE);
```

## Options

### ignore

An array of numbers to ignore. It's set to `[0, 1, 2]` by default.
If provided, it must be an `Array`.

### enforceConst

A boolean to specify if we should check for the const keyword in variable declaration of numbers. `false` by default.

### detectObjects

A boolean to specify if we should detect numbers when setting object properties for example. `false` by default.
