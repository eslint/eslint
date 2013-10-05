# no unused expressions

## Rule Details

This error is raised to highlight the use of a bad practice. The value of an expression should always be used, except in the case of expressions that side effect: function calls, assignments, and the `new` operator.

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
