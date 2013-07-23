# no redefine

Reports an error when encounters an attempt to redefine built-in native object.

```js
var String;
```

## Rule Details

The following objects are considered a native objects:

* `Array`
* `Boolean`
* `Date`
* `decodeURI`
* `decodeURIComponent`
* `encodeURI`
* `encodeURIComponent`
* `Error`
* `eval`
* `EvalError`
* `Function`
* `isFinite`
* `isNaN`
* `JSON`
* `Math`
* `Number`
* `Object`
* `parseInt`
* `parseFloat`
* `RangeError`
* `ReferenceError`
* `RegExp`
* `String`
* `SyntaxError`
* `TypeError`
* `URIError`
* `hasOwnProperty`
* `Map`
* `NaN`
* `Set`
* `WeakMap`

The following patterns are considered warnings:

```js
var String;
```

## When Not To Use It

If you are trying to change the value of a built-in object within the scope of your function.

