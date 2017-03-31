# Suggest using template literals instead of string concatenation. (prefer-template)

In ES2015 (ES6), we can use template literals instead of string concatenation.

```js
var str = "Hello, " + name + "!";
```

```js
/*eslint-env es6*/

var str = `Hello, ${name}!`;
```

## Rule Details

This rule is aimed to flag usage of `+` operators with strings.


### trim

The `trim` option is a boolean (default: `false`). Using a template string it is possible to have spaces on the inside of either of the brackets, but they will be flagged as an error and can be automatically removed by `--fix` when `trim` set to `true`.



## Examples

Examples of **incorrect** code for this rule:

```js
/*eslint prefer-template: "error"*/

var str = "Hello, " + name + "!";
var str = "Time: " + (12 * 60 * 60 * 1000);
```

Examples of **correct** code for this rule:

```js
/*eslint prefer-template: "error"*/
/*eslint-env es6*/

var str = "Hello World!";
var str = `Hello, ${name}!`;
var str = `Time: ${12 * 60 * 60 * 1000}`;

// This is reported by `no-useless-concat`.
var str = "Hello, " + "World!";
```

### trim

Examples of **correct** code for the `{ "trim": true }` option:

```js
/*eslint prefer-template: ["error", { "trim": true }]*/
var str = `Time: ${(12 * 60 * 60 * 1000)}`;
```

Examples of **incorrect** code for the `{ "trim": true }` option:

```js
/*eslint prefer-template: ["error", { "trim": true }]*/
// there are unnecessary spaces on the inside of the brackets
var str = `Time: ${ (12 * 60 * 60 * 1000) }`;
```

## When Not To Use It

This rule should not be used in ES3/5 environments.

In ES2015 (ES6) or later, if you don't want to be notified about string concatenation, you can safely disable this rule.

## Related Rules

* [no-useless-concat](no-useless-concat.md)
* [quotes](quotes.md)
