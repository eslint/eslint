# Prefer `Object.hasOwn()` over `Object.prototype.hasOwnProperty.call()` (prefer-object-has-own)

`Object.hasOwn()` is more accessible than `Object.prototype.hasOwnProperty.call()`.

It is recommended over `Object#hasOwnProperty()` because it works for objects created using `Object.create(null)` and with objects that have overridden the inherited `hasOwnProperty()` method.

```js
const foo = {
  hasOwnProperty: function() {
    return false;
  },
  bar: 'Hello World'
};

console.log(Object.hasOwn(foo, 'bar')); // true - re-implementation of hasOwnProperty() does not affect Object

const bar = Object.create(null);
bar.prop = 'exists';

console.log(Object.hasOwn(bar, 'prop')); // true - works irrespective of how the object is created.
```

## Rule Details

Examples of **incorrect** code for this rule:

```js
/*eslint prefer-object-has-own: "error"*/

Object.prototype.hasOwnProperty.call(obj, "a");

Object.hasOwnProperty.call(obj, "a");

({}).hasOwnProperty.call(obj, "a");

const hasProperty = Object.prototype.hasOwnProperty.call(object, property);
```

Examples of **correct** code for this rule:

```js
/*eslint prefer-object-has-own: "error"*/

Object.hasOwn(obj, "a");

const hasProperty = Object.hasOwn(object, property);
```

## When Not To Use It

This rule should not be used unless ES2022 is supported in your codebase.

## Further Reading

* [Object.hasOwn()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwn)
