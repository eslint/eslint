# Require or disallow spaces following function names (space-after-function-name)

**Replacement notice**: This rule was removed in ESLint v1.0 and replaced by the [space-before-function-paren](space-before-function-paren.md) rule.

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


The following patterns are considered problems:

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

The following patterns are not considered problems:

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
