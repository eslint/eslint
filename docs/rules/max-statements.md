# Limit Maximum Number of Statements (max-statements)

The `max-statements` rule allows you to specify the maximum number of statements allowed in a function.

```js
function foo() {
  var bar = 1; // one statement
  var baz = 2; // two statements
  var qux = 3; // three statements
}
```

## Rule Details

This rule allows you to configure the maximum number of statements allowed in a function.  The default is 10.

## Options

There is an additional optional argument to ignore top level functions.

```json
"max-statements": ["error", 10, {"ignoreTopLevelFunctions": true}]

// or you can use an object property to set the maximum

"max-statements": ["error", {"max": 10}, {"ignoreTopLevelFunctions": true}]
```

**Deprecated:** the object property `maximum` is deprecated. Please use the property `max` instead.

The following patterns are considered problems:

```js
/*eslint max-statements: ["error", 2]*/  // Maximum of 2 statements.
function foo() {
  var bar = 1;
  var baz = 2;

  var qux = 3; // Too many.
}
```

The following patterns are not considered problems:

```js
/*eslint max-statements: ["error", 2]*/  // Maximum of 2 statements.
function foo() {
  var bar = 1;
  return function () {

    // The number of statements in the inner function does not count toward the
    // statement maximum.

    return 42;
  };
}
```

```js
/*eslint max-statements: ["error", 1, {ignoreTopLevelFunctions: true}]*/  // Maximum of 1 statement.
(function() {
  var bar = 1;
  return function () {
    return 42;
  };
})()
```

## Related Rules

* [complexity](complexity.md)
* [max-depth](max-depth.md)
* [max-len](max-len.md)
* [max-nested-callbacks](max-nested-callbacks.md)
* [max-params](max-params.md)
