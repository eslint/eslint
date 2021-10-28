# Prefer use of Object.hasOwn over `Object.prototype.hasOwnPrototype` (prefer-object-has-own)

When Object.prototype.hasOwnPrototype.call is used, this rule requires using the `Object.hasOwn` instead. `Object.hasOwn` is a syntactic sugar and makes the code cleaner.

## Rule Details

Examples of **incorrect** code for this rule:

```js
/*eslint prefer-object-has-own: "error"*/
Object.prototype.hasOwnProperty.call(obj, "a");

({}).hasOwnProperty(obj,"a");

let a = Object.prototype.hasOwnProperty;
```

Examples of **correct** code for this rule:

```js
/*eslint prefer-object-has-own: "error"*/

Object.hasOwn(obj, "a");
```

## Related Material

[MDN Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwn)
