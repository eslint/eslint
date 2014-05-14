# Disallow Unused Expressions (no-unused-expressions)

Unused expressions are those expressions that evaluate to a value but are never used. For example:

```js
"Hello world";
```

This string is a valid JavaScript expression, but isn't actually used. Even though it's not a syntax error it is clearly a logic error and it has no effect on the code being executed.

## Rule Details

This rule aims to eliminate unused expressions. The value of an expression should always be used, except in the case of expressions that side effect: function calls, assignments, and the `new` operator.

The following patterns are considered warnings:

```js
0
```

```js
if(0) 0
```

```js
{0}
```

```js
f(0), {}
```

```js
a && b()
```

The following patterns are not considered warnings:

```js
{}
```

```js
f()
```

```js
a = 0
```

```js
new C
```

```js
delete a.b
```

```js
void a
```
