# Allow/disallow an empty newline after var statement (newline-after-var)

The `newline-after-var` rule enforces a coding style where empty newlines are allowed or disallowed after `var` statement.

It takes an option as the second parameter which can be `"always"` or `"never"` for wanting or disallowing at least one empty newline after the `var` statement respectively. There is no default.

## Rule Details

The rule aims to achieve a consistent coding style across the project.

The following patterns are considered warnings:

```js
// When [1, "always"]
var greet = "hello,",
    name = "world";
console.log(greet, name);

// When [1, "never"]
var greet = "hello,",
    name = "world";

console.log(greet, name);
```

The following patterns are not considered warnings:

```js
// When [1, "always"]
var greet = "hello,",
    name = "world";

console.log(greet, name);

// When [1, "never"]
var greet = "hello,",
    name = "world";
console.log(greet, name);
```
