# Require or disallow an empty newline after variable declarations (newline-after-var)

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

This rule enforces a coding style where empty newlines are required or disallowed after `var`, `let`, or `const` statements to achieve a consistent coding style across the project.
Invalid option value (anything other than `always` nor `never`), defaults to `always`.

The following patterns are considered problems:

```js
/*eslint newline-after-var: [2, "always"]*/

var greet = "hello,",      /*error Expected blank line after variable declarations.*/
    name = "world";
console.log(greet, name);
```

```js
/*eslint newline-after-var: [2, "never"]*/
/*eslint-env es6*/

let greet = "hello,",     /*error Unexpected blank line after variable declarations.*/
    name = "world";

console.log(greet, name);
```

```js
/*eslint newline-after-var: 2*/  // defaults to always
/*eslint-env es6*/

var greet = "hello,";
const NAME = "world";      /*error Expected blank line after variable declarations.*/
console.log(greet, NAME);
```

The following patterns are not considered problems:

```js
/*eslint newline-after-var: [2, "always"]*/

var greet = "hello,",
    name = "world";

console.log(greet, name);
```

```js
/*eslint newline-after-var: [2, "never"]*/
/*eslint-env es6*/

let greet = "hello,",
    name = "world";
console.log(greet, name);
```

```js
/*eslint newline-after-var: 2*/  // defaults to always
/*eslint-env es6*/

var greet = "hello,";
const NAME = "world";

console.log(greet, NAME);
```

Note: in `"always"` mode, comments on a line directly after var statements are treated like additional var statements.
That is, they do not require a blank line between themselves and the var statements above, but do require a blank line after them.

The following patterns are considered problems:

```js
/*eslint newline-after-var: [2, "always"]*/

var greet = "hello,";
var name = "world";             /*error Expected blank line after variable declarations.*/
// var name = require("world");
console.log(greet, name);


/*eslint-disable camelcase*/
var greet = "hello,";
var target_name = "world";      /*error Expected blank line after variable declarations.*/
/*eslint-enable camelcase*/
console.log(greet, name);
```

The following patterns are not considered problems:

```js
/*eslint newline-after-var: [2, "always"]*/

var greet = "hello,";
var name = "world";
// var name = require("world");

console.log(greet, name);


/*eslint-disable camelcase*/
var greet = "hello,";
var target_name = "world";
/*eslint-enable camelcase*/

console.log(greet, name);
```
