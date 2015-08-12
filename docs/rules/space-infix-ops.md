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
const a={b:1};
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
const a = {b:1};
```

### Options

This rule accepts a single options argument with the following defaults:

```json
"space-infix-ops": [2, {"int32Hint": false}]
```

### `int32Hint`

Set the `int32Hint` option to `true` (default is `false`) to allow write `a|0` without space.

```js
var foo = bar|0; // `foo` is forced to be signed 32 bit integer
```
