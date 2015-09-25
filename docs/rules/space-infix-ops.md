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

**Fixable:** This rule is automatically fixable using the `--fix` flag on the command line.

## Rule Details

This rule is aimed at ensuring there are spaces around infix operators.

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

The following patterns are considered problems:

```js
/*eslint space-infix-ops: 2*/
/*eslint-env es6*/

a+b                   /*error Infix operators must be spaced.*/

a+ b                  /*error Infix operators must be spaced.*/

a +b                  /*error Infix operators must be spaced.*/

a?b:c                 /*error Infix operators must be spaced.*/

const a={b:1};        /*error Infix operators must be spaced.*/

var {a=0}=bar;        /*error Infix operators must be spaced.*/

function foo(a=0) { } /*error Infix operators must be spaced.*/
```

The following patterns are not considered problems:

```js
/*eslint space-infix-ops: 2*/
/*eslint-env es6*/

a + b

a       + b

a ? b : c

const a = {b:1};

var {a = 0} = bar;

function foo(a = 0) { }
```
