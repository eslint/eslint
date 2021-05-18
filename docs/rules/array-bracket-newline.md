# enforce line breaks after opening and before closing array brackets (array-bracket-newline)

A number of style guides require or disallow line breaks inside of array brackets.

## Rule Details

This rule enforces line breaks after opening and before closing array brackets.

## Options

This rule has either a string option:

* `"always"` requires line breaks inside brackets
* `"never"` disallows line breaks inside brackets
* `"consistent"` requires consistent usage of linebreaks for each pair of brackets. It reports an error if one bracket in the pair has a linebreak inside it and the other bracket does not.

Or an object option (Requires line breaks if any of properties is satisfied. Otherwise, disallows line breaks):

* `"multiline": true` (default) requires line breaks if there are line breaks inside elements or between elements. If this is false, this condition is disabled.
* `"minItems": null` (default) requires line breaks if the number of elements is at least the given integer. If this is 0, this condition will act the same as the option `"always"`. If this is `null` (the default), this condition is disabled.

### always

Examples of **incorrect** code for this rule with the `"always"` option:

```js
/*eslint array-bracket-newline: ["error", "always"]*/

var a = [];
var b = [1];
var c = [1, 2];
var d = [1,
    2];
var e = [function foo() {
    dosomething();
}];
```

Examples of **correct** code for this rule with the `"always"` option:

```js
/*eslint array-bracket-newline: ["error", "always"]*/

var a = [
];
var b = [
    1
];
var c = [
    1, 2
];
var d = [
    1,
    2
];
var e = [
    function foo() {
        dosomething();
    }
];
```

### never

Examples of **incorrect** code for this rule with the `"never"` option:

```js
/*eslint array-bracket-newline: ["error", "never"]*/

var a = [
];
var b = [
    1
];
var c = [
    1, 2
];
var d = [
    1,
    2
];
var e = [
    function foo() {
        dosomething();
    }
];
```

Examples of **correct** code for this rule with the `"never"` option:

```js
/*eslint array-bracket-newline: ["error", "never"]*/

var a = [];
var b = [1];
var c = [1, 2];
var d = [1,
    2];
var e = [function foo() {
    dosomething();
}];
```

### consistent

Examples of **incorrect** code for this rule with the `"consistent"` option:

```js
/*eslint array-bracket-newline: ["error", "consistent"]*/

var a = [1
];
var b = [
    1];
var c = [function foo() {
    dosomething();
}
]
var d = [
    function foo() {
        dosomething();
    }]
```

Examples of **correct** code for this rule with the `"consistent"` option:

```js
/*eslint array-bracket-newline: ["error", "consistent"]*/

var a = [];
var b = [
];
var c = [1];
var d = [
    1
];
var e = [function foo() {
    dosomething();
}];
var f = [
    function foo() {
        dosomething();
    }
];
```

### multiline

Examples of **incorrect** code for this rule with the default `{ "multiline": true }` option:

```js
/*eslint array-bracket-newline: ["error", { "multiline": true }]*/

var a = [
];
var b = [
    1
];
var c = [
    1, 2
];
var d = [1,
    2];
var e = [function foo() {
    dosomething();
}];
```

Examples of **correct** code for this rule with the default `{ "multiline": true }` option:

```js
/*eslint array-bracket-newline: ["error", { "multiline": true }]*/

var a = [];
var b = [1];
var c = [1, 2];
var d = [
    1,
    2
];
var e = [
    function foo() {
        dosomething();
    }
];
```

### minItems

Examples of **incorrect** code for this rule with the `{ "minItems": 2 }` option:

```js
/*eslint array-bracket-newline: ["error", { "minItems": 2 }]*/

var a = [
];
var b = [
    1
];
var c = [1, 2];
var d = [1,
    2];
var e = [
  function foo() {
    dosomething();
  }
];
```

Examples of **correct** code for this rule with the `{ "minItems": 2 }` option:

```js
/*eslint array-bracket-newline: ["error", { "minItems": 2 }]*/

var a = [];
var b = [1];
var c = [
    1, 2
];
var d = [
    1,
    2
];
var e = [function foo() {
    dosomething();
}];
```

### multiline and minItems

Examples of **incorrect** code for this rule with the `{ "multiline": true, "minItems": 2 }` options:

```js
/*eslint array-bracket-newline: ["error", { "multiline": true, "minItems": 2 }]*/

var a = [
];
var b = [
    1
];
var c = [1, 2];
var d = [1,
    2];
var e = [function foo() {
    dosomething();
}];
```

Examples of **correct** code for this rule with the `{ "multiline": true, "minItems": 2 }` options:

```js
/*eslint array-bracket-newline: ["error", { "multiline": true, "minItems": 2 }]*/

var a = [];
var b = [1];
var c = [
    1, 2
];
var d = [
    1,
    2
];
var e = [
    function foo() {
        dosomething();
    }
];
```


## When Not To Use It

If you don't want to enforce line breaks after opening and before closing array brackets, don't enable this rule.

## Compatibility

* **JSCS:** [validateNewlineAfterArrayElements](https://jscs-dev.github.io/rule/validateNewlineAfterArrayElements)

## Related Rules

* [array-bracket-spacing](array-bracket-spacing.md)
