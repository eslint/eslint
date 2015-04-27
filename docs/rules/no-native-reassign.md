# Disallow Reassignment of Native Objects (no-native-reassign)

Reports an error when they encounter an attempt to assign a value to built-in native object.

```js
String = "hello world";
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
* `Map`
* `NaN`
* `Set`
* `WeakMap`
* `Infinity`
* `undefined`

The following patterns are considered warnings:

```js
String = new Object();
```

```js
var String;
```

## Options

### exceptions

Array of native object names that are permitted to be reassigned.
If provided, it must be an `Array`.

```js
{
    "rules": {
        "no-native-reassign": [2, {"exceptions": ["Object"]}]
    }
}
```

## When Not To Use It

If you are trying to override one of the native objects.

## Related Rules

* [no-extend-native](no-extend-native.md)
