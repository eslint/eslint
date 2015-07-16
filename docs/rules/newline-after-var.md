# Allow/disallow an empty newline after variable declarations (newline-after-var)

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

This rule enforces a coding style where empty newlines are allowed or disallowed after `var`, `let`, or `const` statements to achieve a consistent coding style across the project.
Invalid option value (anything other than `always` nor `never`), defaults to `always`.

The following patterns are considered warnings:

```js
// When [1, "always"]
var greet = "hello,",
    name = "world";
console.log(greet, name);

// When [1, "never"]
let greet = "hello,",
    name = "world";

console.log(greet, name);

// When [1, "unknown"] - considered to be "always"
var greet = "hello,";
const NAME = "world";
console.log(greet, NAME);
```

The following patterns are not considered warnings:

```js
// When [1, "always"]
var greet = "hello,",
    name = "world";

console.log(greet, name);

// When [1, "never"]
let greet = "hello,",
    name = "world";
console.log(greet, name);

// When [1, "unknown"] - considered to be "always"
var greet = "hello,";
const NAME = "world";

console.log(greet, NAME);
```
