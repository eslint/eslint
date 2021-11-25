# Prefer `Object.hasOwn(…)` over `Object.prototype.hasOwnProperty.call(…)`

`Object.hasOwn(…)` is more accessible than `Object.prototype.hasOwnProperty.call(…)`.

It is recommended over Object.hasOwnProperty() because it works for objects created using Object.create(null) and with objects that have overridden the inherited hasOwnProperty() method.

## Rule Details

Examples of **incorrect** code for this rule:

```js
/*eslint prefer-object-has-own: "error"*/

Object.prototype.hasOwnProperty.call(obj, "a");

({}).hasOwnProperty(obj, "a");

const hasProperty = Object.prototype.hasOwnProperty.call(object, property);
```

Examples of **correct** code for this rule:

```js
/*eslint prefer-object-has-own: "error"*/

Object.hasOwn(obj, "a");

const hasProperty = Object.hasOwn(object, property);
```

## Related Material

[MDN Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwn)
