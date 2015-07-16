# Disallow unnecessary `.call()` and `.apply()`. (no-useless-call)

The function invocation can be written by `Function.prototype.call()` and `Function.prototype.apply()`.
But `Function.prototype.call()` and `Function.prototype.apply()` are slower than the normal function invocation.

## Rule Details

This rule is aimed to flag usage of `Function.prototype.call()` and `Function.prototype.apply()` that can be replaced with the normal function invocation.

The following patterns are considered warnings:

```js
// Those are same as `foo(1, 2, 3);`
foo.call(undefined, 1, 2, 3);
foo.apply(undefined, [1, 2, 3]);
foo.call(null, 1, 2, 3);
foo.apply(null, [1, 2, 3]);
```

```js
// Those are same as `obj.foo(1, 2, 3);`
obj.foo.call(obj, 1, 2, 3);
obj.foo.apply(obj, [1, 2, 3]);
```

The following patterns are not considered warnings:

```js
// The `this` binding is different.
foo.call(obj, 1, 2, 3);
foo.apply(obj, [1, 2, 3]);
obj.foo.call(null, 1, 2, 3);
obj.foo.apply(null, [1, 2, 3]);
obj.foo.call(otherObj, 1, 2, 3);
obj.foo.apply(otherObj, [1, 2, 3]);
```

```js
// The argument list is variadic.
foo.apply(undefined, args);
foo.apply(null, args);
obj.foo.apply(obj, args);
```

## When Not to Use It

If you don't want to be notified about unnecessary `.call()` and `.apply()`, you can safely disable this rule.
