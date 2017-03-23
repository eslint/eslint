# enforce line breaks after open and before close array brackets (array-bracket-newline)

A number of style guides require or disallow line breaks inside of array brackets.

## Rule Details

This rule enforces line breaks after open and before close array brackets

## Options

This rule has either a string option:

* `"always"` requires line breaks inside braces
* `"never"` disallows line breaks inside braces

Or an object option:

* `"multiline": true` (default) requires line breaks if there are line breaks inside properties or between properties
* `"minItems"` requires line breaks if the number of properties is more than the given integer

### always

Examples of **incorrect** code for this rule with the `"always"` option:

```js
/*eslint array-bracket-newline: ["error", "always"]*/
/*eslint-env es6*/

let a = [];
let b = [1];
let c = [1, 2];
let d = [1,
    2];
let e = [function foo() {
    dosomething();
}];
```

Examples of **correct** code for this rule with the `"always"` option:

```js
/*eslint array-bracket-newline: ["error", "always"]*/
/*eslint-env es6*/

let a = [
];
let b = [
    1
];
let c = [
    1, 2
];
let d = [
    1,
    2
];
let e = [
    function foo() {
        dosomething();
    }
];
```

### never

Examples of **incorrect** code for this rule with the `"never"` option:

```js
/*eslint array-bracket-newline: ["error", "never"]*/
/*eslint-env es6*/

let a = [
];
let b = [
    1
];
let c = [
    1, 2
];
let d = [
    1,
    2
];
let e = [
    function foo() {
        dosomething();
    }
];
```

Examples of **correct** code for this rule with the `"never"` option:

```js
/*eslint array-bracket-newline: ["error", "never"]*/
/*eslint-env es6*/

let a = [];
let b = [1];
let c = [1, 2];
let d = [1,
    2];
let e = [function foo() {
    dosomething();
}];
```

### multiline

Examples of **incorrect** code for this rule with the default `{ "multiline": true }` option:

```js
/*eslint array-bracket-newline: ["error", { "multiline": true }]*/
/*eslint-env es6*/

let a = [
];
let b = [
    1
];
let c = [
    1, 2
];
let d = [1,
    2];
let e = [function foo() {
    dosomething();
}];
```

Examples of **correct** code for this rule with the default `{ "multiline": true }` option:

```js
/*eslint array-bracket-newline: ["error", { "multiline": true }]*/
/*eslint-env es6*/

let a = [];
let b = [1];
let c = [1, 2];
let d = [
    1,
    2
];
let e = [
    function foo() {
        dosomething();
    }
];
```

### minItems

Examples of **incorrect** code for this rule with the `{ "minItems": 2 }` option:

```js
/*eslint array-bracket-newline: ["error", { "minItems": 2 }]*/
/*eslint-env es6*/

let a = [
];
let b = [
    1
];
let c = [1, 2];
let d = [1,
    2];
let e = [
  function foo() {
    dosomething();
  }
];
```

Examples of **correct** code for this rule with the `{ "minItems": 2 }` option:

```js
/*eslint array-bracket-newline: ["error", { "minItems": 2 }]*/
/*eslint-env es6*/

let a = [];
let b = [1];
let c = [
    1, 2
];
let d = [
    1,
    2
];
let e = [function foo() {
    dosomething();
}];
```

### multiline and minItems

Examples of **incorrect** code for this rule with the `{ "multiline": true, "minItems": 2 }` options:

```js
/*eslint array-bracket-newline: ["error", { "multiline": true, "minItems": 2 }]*/
/*eslint-env es6*/

let a = [
];
let b = [
    1
];
let c = [1, 2];
let d = [1,
    2];
let e = [function foo() {
    dosomething();
}];
```

Examples of **correct** code for this rule with the `{ "multiline": true, "minItems": 2 }` options:

```js
/*eslint array-bracket-newline: ["error", { "multiline": true, "minItems": 2 }]*/
/*eslint-env es6*/

let a = [];
let b = [1];
let c = [
    1, 2
];
let d = [
    1,
    2
];
let e = [
    function foo() {
        dosomething();
    }
];
```


## When Not To Use It

If you do not want to enforce line breaks after open and before close array brackets

## Related Rules

* [array-bracket-spacing](array-bracket-spacing.md)
