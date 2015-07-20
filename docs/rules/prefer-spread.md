# Suggest using of the spread operator instead of `.apply()`. (prefer-spread)

Up to now, we had been using `Function.prototype.apply()` callings for the variadic function.

```js
var args = [1, 2, 3, 4];
Math.max.apply(Math, args);
```

Since ES2015, we can use the spread operator for the variadic function.

```js
var args = [1, 2, 3, 4];
Math.max(...args);
```

## Rule Details

This rule is aimed to flag usage of `Function.prototype.apply()` that can be replaced with the spread operator.

The following patterns are considered warnings:

```js
foo.apply(undefined, args);
```

```js
foo.apply(null, args);
```

```js
obj.foo.apply(obj, args);
```

The following patterns are not considered warnings:

```js
// The `this` binding is different.
foo.apply(obj, args);
obj.foo.apply(null, args);
obj.foo.apply(otherObj, args);
```

```js
// The argument list is not variadic.
// Those are warned by the `no-useless-call` rule.
foo.apply(undefined, [1, 2, 3]);
foo.apply(null, [1, 2, 3]);
obj.foo.apply(obj, [1, 2, 3]);
```

Known limitations:

This rule compares code statically to check whether or not `thisArg` is changed.
So if the code about `thisArg` is a dynamic expression, this rule cannot judge correctly.

```js
// This is warned.
a[i++].foo.apply(a[i++], args);

// This is not warned.
a[++i].foo.apply(a[i], args);
```

## When Not to Use It

This rule should not be used in ES3/5 environments.

In ES2015 (ES6) or later, if you don't want to be notified about `Function.prototype.apply()` callings, you can safely disable this rule.

## Related rules

* [no-useless-call](no-useless-call.md)
