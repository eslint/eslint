---
title: use-isnan
rule_type: problem
---



In JavaScript, `NaN` is a special value of the `Number` type. It's used to represent any of the "not-a-number" values represented by the double-precision 64-bit format as specified by the IEEE Standard for Binary Floating-Point Arithmetic.

Because `NaN` is unique in JavaScript by not being equal to anything, including itself, the results of comparisons to `NaN` are confusing:

* `NaN === NaN` or `NaN == NaN` evaluate to false
* `NaN !== NaN` or `NaN != NaN` evaluate to true

Therefore, use `Number.isNaN()` or global `isNaN()` functions to test whether a value is `NaN`.

## Rule Details

This rule disallows comparisons to 'NaN'.

Examples of **incorrect** code for this rule:

::: incorrect

```js
/*eslint use-isnan: "error"*/

if (foo == NaN) {
    // ...
}

if (foo != NaN) {
    // ...
}

if (foo == Number.NaN) {
    // ...
}

if (foo != Number.NaN) {
    // ...
}
```

:::

Examples of **correct** code for this rule:

::: correct

```js
/*eslint use-isnan: "error"*/

if (isNaN(foo)) {
    // ...
}

if (!isNaN(foo)) {
    // ...
}
```

:::

## Options

This rule has an object option, with two options:

* `"enforceForSwitchCase": true` (default) additionally disallows `case NaN` and `switch(NaN)` in `switch` statements.
* `"enforceForIndexOf": true` additionally disallows the use of `indexOf` and `lastIndexOf` methods with `NaN`. Default is `false`, meaning that this rule by default does not warn about `indexOf(NaN)` or `lastIndexOf(NaN)` method calls.

### enforceForSwitchCase

The `switch` statement internally uses the `===` comparison to match the expression's value to a case clause.
Therefore, it can never match `case NaN`. Also, `switch(NaN)` can never match a case clause.

Examples of **incorrect** code for this rule with `"enforceForSwitchCase"` option set to `true` (default):

::: incorrect

```js
/*eslint use-isnan: ["error", {"enforceForSwitchCase": true}]*/

switch (foo) {
    case NaN:
        bar();
        break;
    case 1:
        baz();
        break;
    // ...
}

switch (NaN) {
    case a:
        bar();
        break;
    case b:
        baz();
        break;
    // ...
}

switch (foo) {
    case Number.NaN:
        bar();
        break;
    case 1:
        baz();
        break;
    // ...
}

switch (Number.NaN) {
    case a:
        bar();
        break;
    case b:
        baz();
        break;
    // ...
}
```

:::

Examples of **correct** code for this rule with `"enforceForSwitchCase"` option set to `true` (default):

::: correct

```js
/*eslint use-isnan: ["error", {"enforceForSwitchCase": true}]*/

if (Number.isNaN(foo)) {
    bar();
} else {
    switch (foo) {
        case 1:
            baz();
            break;
        // ...
    }
}

if (Number.isNaN(a)) {
    bar();
} else if (Number.isNaN(b)) {
    baz();
} // ...
```

:::

Examples of **correct** code for this rule with `"enforceForSwitchCase"` option set to `false`:

::: correct

```js
/*eslint use-isnan: ["error", {"enforceForSwitchCase": false}]*/

switch (foo) {
    case NaN:
        bar();
        break;
    case 1:
        baz();
        break;
    // ...
}

switch (NaN) {
    case a:
        bar();
        break;
    case b:
        baz();
        break;
    // ...
}

switch (foo) {
    case Number.NaN:
        bar();
        break;
    case 1:
        baz();
        break;
    // ...
}

switch (Number.NaN) {
    case a:
        bar();
        break;
    case b:
        baz();
        break;
    // ...
}
```

:::

### enforceForIndexOf

The following methods internally use the `===` comparison to match the given value with an array element:

* [`Array.prototype.indexOf`](https://www.ecma-international.org/ecma-262/6.0/#sec-array.prototype.indexof)
* [`Array.prototype.lastIndexOf`](https://www.ecma-international.org/ecma-262/6.0/#sec-array.prototype.lastindexof)

Therefore, for any array `foo`, `foo.indexOf(NaN)` and `foo.lastIndexOf(NaN)` will always return `-1`.

Set `"enforceForIndexOf"` to `true` if you want this rule to report `indexOf(NaN)` and `lastIndexOf(NaN)` method calls.

Examples of **incorrect** code for this rule with `"enforceForIndexOf"` option set to `true`:

::: incorrect

```js
/*eslint use-isnan: ["error", {"enforceForIndexOf": true}]*/

var hasNaN = myArray.indexOf(NaN) >= 0;

var firstIndex = myArray.indexOf(NaN);

var lastIndex = myArray.lastIndexOf(NaN);

var indexWithSequenceExpression = myArray.indexOf((doStuff(), NaN));

var firstIndexFromSecondElement = myArray.indexOf(NaN, 1);

var lastIndexFromSecondElement = myArray.lastIndexOf(NaN, 1);
```

:::

Examples of **correct** code for this rule with `"enforceForIndexOf"` option set to `true`:

::: correct

```js
/*eslint use-isnan: ["error", {"enforceForIndexOf": true}]*/

function myIsNaN(val) {
    return typeof val === "number" && isNaN(val);
}

function indexOfNaN(arr) {
    for (var i = 0; i < arr.length; i++) {
        if (myIsNaN(arr[i])) {
            return i;
        }
    }
    return -1;
}

function lastIndexOfNaN(arr) {
    for (var i = arr.length - 1; i >= 0; i--) {
        if (myIsNaN(arr[i])) {
            return i;
        }
    }
    return -1;
}

var hasNaN = myArray.some(myIsNaN);

var hasNaN = indexOfNaN(myArray) >= 0;

var firstIndex = indexOfNaN(myArray);

var lastIndex = lastIndexOfNaN(myArray);

// ES2015
var hasNaN = myArray.some(Number.isNaN);

// ES2015
var firstIndex = myArray.findIndex(Number.isNaN);

// ES2016
var hasNaN = myArray.includes(NaN);
```

:::

#### Known Limitations

This option checks methods with the given names, *even if* the object which has the method is *not* an array.
