# Suggest using the spread operator instead of `.apply()`. (prefer-spread)

Before ES2015, one must use `Function.prototype.apply()` to call variadic functions.

```js
var args = [1, 2, 3, 4];
Math.max.apply(Math, args);
```

In ES2015, one can use the spread operator to call variadic functions.

```js
/*eslint-env es6*/

var args = [1, 2, 3, 4];
Math.max(...args);
```

## Rule Details

This rule is aimed to flag usage of `Function.prototype.apply()` that can be replaced with the spread operator.

The following patterns are considered problems:

```js
/*eslint prefer-spread: 2*/

foo.apply(undefined, args); /*error use the spread operator instead of the ".apply()".*/

foo.apply(null, args);      /*error use the spread operator instead of the ".apply()".*/

obj.foo.apply(obj, args);   /*error use the spread operator instead of the ".apply()".*/
```

The following patterns are not considered problems:

```js
/*eslint prefer-spread: 2*/

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

This rule analyzes code statically to check whether or not the `this` argument is changed.
So if the `this` argument is computed in a dynamic expression, this rule cannot detect a violation.

```js
/*eslint prefer-spread: 2*/

// This warns.
a[i++].foo.apply(a[i++], args); /*error use the spread operator instead of the ".apply()".*/

// This does not warn.
a[++i].foo.apply(a[i], args);
```

## When Not to Use It

This rule should not be used in ES3/5 environments.

In ES2015 (ES6) or later, if you don't want to be notified about `Function.prototype.apply()` callings, you can safely disable this rule.

## Related rules

* [no-useless-call](no-useless-call.md)
