# Require or disallow spaces following function names (space-after-function-name)

Whitespace between a function name and its parameter list is optional.

```js
function withoutSpace(x) {
	// ...
}

function withSpace (x) {
	// ...
}
```

Some style guides may require a consistent spacing for function names.

## Rule Details

This rule aims to enforce a consistent spacing after function names. It takes one argument. If it is `"always"` then all function names must be followed by at least one space. If `"never"` then there should be no spaces between the name and the parameter list. The default is `"never"`.


The following patterns are considered warnings:

```js
function foo (x) {
	// ...
}

var x = function named (x) {};

// When [1, "always"]
function bar(x) {
	// ...
}
```

The following patterns are not warnings:

```js
function foo(x) {
	// ...
}

var x = function named(x) {};

// When [1, "always"]
function bar (x) {
	// ...
}
```
