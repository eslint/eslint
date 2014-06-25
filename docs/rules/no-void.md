# Disallow use of void operator. (no-void)

The `void` operator takes operand and returns `undefined`. This can be confusing and hard to debug.

## Rule Details

This rule aims to eliminate use of void operator.

The following patterns are considered warnings:

```js
void foo
```

```js
var foo = void bar();
```

## When Not To Use It

The main case of using `void` is to get "pure" `undefined` value as prior to ES5 `undefined` variable was mutable. Another common case is to minify code as `void 0` is shorter than `undefined`.
If you intentionally use `void` operator then you can disable this rule.

## Further Reading

* [Bad Parts: Appendix B - JavaScript: The Good Parts by Douglas Crockford](http://oreilly.com/javascript/excerpts/javascript-good-parts/bad-parts.html)
