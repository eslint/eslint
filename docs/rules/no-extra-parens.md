# Disallow Extra Parens (no-extra-parens)

This rule restricts the use of parentheses to only where they are necessary.

## Rule Details

The following patterns are considered warnings:

```js
a = (b * c)
```

```js
(a * b) + c
```

```js
typeof (a)
```

The following patterns are not considered warnings:

```js
(0).toString()
```

```js
({}.toString.call())
```

```js
(function(){} ? a() : b())
```

```js
(/^a$/).test(var)
```

IIFEs are excluded from this requirement, so the `(function(){}())` pattern is allowed in any position.
RegExp literals are also excluded from this requirement, so the `(/abc/).test(var)` pattern is allowed in any position as well.


## Further Reading

* [MDN: Operator Precedence](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Operator_Precedence)
