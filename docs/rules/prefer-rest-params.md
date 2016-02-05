# Suggest using the rest parameters instead of `arguments` (prefer-rest-params)

There are rest parameters in ES2015.
We can use that feature for variadic functions instead of the `arguments` variable.

`arguments` does not have methods of `Array.prototype`, so it's a bit of an inconvenience.

## Rule Details

This rule is aimed to flag usage of `arguments` variables.

The following patterns are considered problems:

```js
function foo() {
    console.log(arguments);                 /*error Use the rest parameters instead of 'arguments'. */
}

function foo(action) {
    var args = [].slice.call(arguments, 1); /*error Use the rest parameters instead of 'arguments'. */
    action.apply(null, args);
}
```

The following patterns are not considered problems:

```js
function foo(...args) {
    console.log(args);
}

function foo(action, ...args) {
    action.apply(null, args); // or `action(...args)`, related to the `prefer-spread` rule.
}

// Note: the implicit arguments can be overwritten.
function foo(arguments) {
    console.log(arguments); // This is the first argument.
}
function foo() {
    var arguments = 0;
    console.log(arguments); // This is a local variable.
}
```

## When Not To Use It

This rule should not be used in ES3/5 environments.

In ES2015 (ES6) or later, if you don't want to be notified about `arguments` variables, then it's safe to disable this rule.

## Related Rules

* [prefer-spread](prefer-spread.md)
