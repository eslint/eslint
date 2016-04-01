# Limit Maximum Number of Parameters (max-params)

Functions that take numerous parameters can be difficult to read and write because it requires the memorization of what each parameter is, its type, and the order they should appear in. As a result, many coders adhere to a convention that caps the number of parameters a function can take.

```js
function foo (bar, baz, qux, qxx) { // four parameters, may be too many
    doSomething();
}
```

## Rule Details

This rule is aimed at making functions easier to read and write by capping the number of formal arguments a function can accept. As such it will warn when it encounters a function that accepts more than the configured maximum number of parameters.

The following patterns are considered problems:

```js
/*eslint max-params: ["error", 3]*/

function foo (bar, baz, qux, qxx) {
    doSomething();
}
```

The following patterns are not considered problems:

```js
/*eslint max-params: ["error", 3]*/

function foo (bar, baz, qux) {
    doSomething();
}
```

Optionally, you may specify a `max` object property:

```json
"max-params": ["error", 2]
```

is equivalent to

```json
"max-params": ["error", {"max": 2}]
```

**Deprecated:** the object property `maximum` is deprecated. Please use the property `max` instead.


## Related Rules

* [complexity](complexity.md)
* [max-depth](max-depth.md)
* [max-len](max-len.md)
* [max-nested-callbacks](max-nested-callbacks.md)
* [max-statements](max-statements.md)
