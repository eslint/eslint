# require symbol description (symbol-description)

The `Symbol` function may have optional description:

```js
var foo = Symbol("some description");

var someString = "some description";
var bar = Symbol(someString);
```


Using `description` promotes easier debugging: when a symbol is logged the description is used:

```js
var foo = Symbol("some description");

> console.log(foo);
// Symbol(some description)
```

It may facilitate identifying symbols when one is observed during debugging.


## Rule Details

This rules requires a description when creating symbols.


## Examples

Examples of **incorrect** code for this rule:

```js
/*eslint symbol-description: "error"*/
/*eslint-env es6*/

var foo = Symbol();
```

Examples of **correct** code for this rule:

```js
/*eslint symbol-description: "error"*/
/*eslint-env es6*/

var foo = Symbol("some description");

var someString = "some description";
var bar = Symbol(someString);
```


## When Not To Use It

This rule should not be used in ES3/5 environments.
In addition, this rule can be safely turned off if you don't want to enforce presence of `description` when creating Symbols.

## Further Reading

* [Symbol Objects specification: Symbol description](https://www.ecma-international.org/ecma-262/6.0/#sec-symbol-description)
