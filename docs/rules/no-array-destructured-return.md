# disallow array destructuring of return values (no-array-destructured-return)

Arrays are great for holding collections of data. But when the items in the array have different types of data in each of them, it can be hard for a reader to understand which data is stored where, and can also lead to error-prone code.
For that reason, a very common refactoring is to replace the array with an object:

```js
// Replace this:
function getUser() {
  return [
    'Nicholas',
    'Zakas',
  ];
}

// With this:
function getUser() {
  return {
    firstName: 'Nicholas',
    lastName: 'Zakas'
  };
}
```

Since ES2015, array destructuring the return value of a CallExpression is a clear case of an array that should be replaced by an object:

```js
// foo() should probably return an object instead
const [a, b] = foo();
```

## Rule Details

This rule aims to disallow array destructuring of return values.

Examples of **incorrect** code for this rule:

```js
/*eslint no-array-destructured-return: "error"*/
/*eslint-env es6*/

const [a, b, c] = foo();
const [a, b] = new Foo();
```

```js
/*eslint no-array-destructured-return: "error"*/
/*eslint-env es6*/

let a = 1;
let b = 5;

[a, b] = foo();
```

Examples of **correct** code for this rule:

```js
/*eslint no-array-destructured-return: "error"*/
/*eslint-env es6*/

const {a, b} = bar();

// array destructuring containing the rest operator is allowed
const [a, ...rest] = foo();
const [a, ...rest] = new Foo();
```

## When Not To Use It

You can turn this rule off if you are not concerned with forbidding array destructuring of return values.

## Further Reading

* [Replace Array with Object](https://sourcemaking.com/refactoring/replace-array-with-object)

## Compatibility

* **JSCS**: [disallowArrayDestructuringReturn](http://jscs.info/rule/disallowArrayDestructuringReturn)
