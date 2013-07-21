# no native reassign

Reports an error when they encounter an attempt to assign a value to built-in native object.

```js
String = "hello world";
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
String = new Object();
```

## When Not To Use It

If you are trying to override one of the native objects.
