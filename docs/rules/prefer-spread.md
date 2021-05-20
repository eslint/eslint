# Suggest using spread syntax instead of `.apply()`. (prefer-spread)

Before ES2015, one must use `Function.prototype.apply()` to call variadic functions.

```js
var args = [1, 2, 3, 4];
Math.max.apply(Math, args);
```

In ES2015, one can use spread syntax to call variadic functions.

```js
/*eslint-env es6*/

var args = [1, 2, 3, 4];
Math.max(...args);
```

## Rule Details

This rule is aimed to flag usage of `Function.prototype.apply()` in situations where spread syntax could be used instead.

## Examples

Examples of **incorrect** code for this rule:

```js
/*eslint prefer-spread: "error"*/

foo.apply(undefined, args);
foo.apply(null, args);
obj.foo.apply(obj, args);
```

Examples of **correct** code for this rule:

```js
/*eslint prefer-spread: "error"*/

// Using spread syntax
foo(...args);
obj.foo(...args);

// The `this` binding is different.
foo.apply(obj, args);
obj.foo.apply(null, args);
obj.foo.apply(otherObj, args);

// The argument list is not variadic.
// Those are warned by the `no-useless-call` rule.
foo.apply(undefined, [1, 2, 3]);
foo.apply(null, [1, 2, 3]);
obj.foo.apply(obj, [1, 2, 3]);
```

Known limitations:

This rule analyzes code statically to check whether or not the `this` argument is changed. So, if the `this` argument is computed in a dynamic expression, this rule cannot detect a violation.

```js
/*eslint prefer-spread: "error"*/

// This warns.
a[i++].foo.apply(a[i++], args);

// This does not warn.
a[++i].foo.apply(a[i], args);
```

## When Not To Use It

This rule should not be used in ES3/5 environments.

In ES2015 (ES6) or later, if you don't want to be notified about `Function.prototype.apply()` callings, you can safely disable this rule.

## Related Rules

* [no-useless-call](no-useless-call.md)
