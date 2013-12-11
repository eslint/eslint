# Require spaces around infix operators

Require spaces around infix operators.

## Rule Details

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
