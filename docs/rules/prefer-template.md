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

The following patterns are considered problems:

```js
/*eslint prefer-template: 2*/

var str = "Hello, " + name + "!";           /*error Unexpected string concatenation.*/
var str = "Time: " + (12 * 60 * 60 * 1000); /*error Unexpected string concatenation.*/
```

The following patterns are not considered problems:

```js
/*eslint prefer-template: 2*/
/*eslint-env es6*/

var str = "Hello World!";
var str = `Hello, ${name}!`;
var str = `Time: ${12 * 60 * 60}`;

// This is reported by `no-useless-concat`.
var str = "Hello, " + "World!";
```

## When Not to Use It

This rule should not be used in ES3/5 environments.

In ES2015 (ES6) or later, if you don't want to be notified about string concatenation, you can safely disable this rule.
