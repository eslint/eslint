# require or disallow an empty line after variable declarations (newline-after-var)

This rule was **deprecated** in ESLint v4.0.0 and replaced by the [padding-line-between-statements](padding-line-between-statements.md) rule.

As of today there is no consistency in separating variable declarations from the rest of the code. Some developers leave an empty line between var statements and the rest of the code like:

```js
var foo;

// do something with foo
```

Whereas others don't leave any empty newlines at all.

```js
var foo;
// do something with foo
```

The problem is when these developers work together in a project. This rule enforces a coding style where empty newlines are allowed or disallowed after `var`, `let`, or `const` statements. It helps the code to look consistent across the entire project.

## Rule Details

This rule enforces a coding style where empty lines are required or disallowed after `var`, `let`, or `const` statements to achieve a consistent coding style across the project.

## Options

This rule has a string option:

* `"always"` (default) requires an empty line after `var`, `let`, or `const`

  Comments on a line directly after var statements are treated like additional var statements.

* `"never"` disallows empty lines after `var`, `let`, or `const`

### always

Examples of **incorrect** code for this rule with the default `"always"` option:

```js
/*eslint newline-after-var: ["error", "always"]*/
/*eslint-env es6*/

var greet = "hello,",
    name = "world";
console.log(greet, name);

let greet = "hello,",
    name = "world";
console.log(greet, name);

var greet = "hello,";
const NAME = "world";
console.log(greet, NAME);

var greet = "hello,";
var name = "world";
// var name = require("world");
console.log(greet, name);
```

Examples of **correct** code for this rule with the default `"always"` option:

```js
/*eslint newline-after-var: ["error", "always"]*/
/*eslint-env es6*/

var greet = "hello,",
    name = "world";

console.log(greet, name);

let greet = "hello,",
    name = "world";

console.log(greet, name);

var greet = "hello,";
const NAME = "world";

console.log(greet, NAME);

var greet = "hello,";
var name = "world";
// var name = require("world");

console.log(greet, name);
```

### never

Examples of **incorrect** code for this rule with the `"never"` option:

```js
/*eslint newline-after-var: ["error", "never"]*/
/*eslint-env es6*/

var greet = "hello,",
    name = "world";

console.log(greet, name);

let greet = "hello,",
    name = "world";

console.log(greet, name);

var greet = "hello,";
const NAME = "world";

console.log(greet, NAME);

var greet = "hello,";
var name = "world";
// var name = require("world");

console.log(greet, name);
```

Examples of **correct** code for this rule with the `"never"` option:

```js
/*eslint newline-after-var: ["error", "never"]*/
/*eslint-env es6*/

var greet = "hello,",
    name = "world";
console.log(greet, name);

let greet = "hello,",
    name = "world";
console.log(greet, name);

var greet = "hello,";
const NAME = "world";
console.log(greet, NAME);

var greet = "hello,";
var name = "world";
// var name = require("world");
console.log(greet, name);
```
