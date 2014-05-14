# Require Spaces Around Infix Operators (space-infix-ops)

While formatting preferences are very personal, a number of style guides require spaces around operators, such as:

```js
var sum = 1 + 2;
```

The proponents of these extra spaces believe it make the code easier to read and can more easily highlight potential errors, such as:

```js
var sum = i+++2;
```

While this is valid JavaScript syntax, it is hard to determine what the author intended.

## Rule Details

This rule is aimed at ensuring there are spaces around infix operators.

The following patterns are considered warnings:

```js
a+b
```

```js
a+ b
```

```js
a +b
```

```js
a?b:c
```

```js
a,b
```

The following patterns are not considered warnings:

```js
a + b
```

```js
a       + b
```

```js
a ? b : c
```

```js
a, b // sequences need only be spaced on the right
```
