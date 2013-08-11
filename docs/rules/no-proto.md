# no proto

`__proto__` property has been deprecated as of ECMAScript 3.1 and shouldn't be used in the code. Use `getPrototypeOf` method instead.

## Rule Details

When object is created `__proto__` is set to the original prototype property of the object’s constructor function. `getPrototypeOf` is the prefered method of getting "the prototype".

The following patterns are considered warnings:

```js
var a = obj.__proto__;

var a = obj["__proto__"];
```

The following patterns are considered okay and could be used alternatively:

```js
var a = Object.getPrototypeOf(obj);
```
## When not to use

If you need to support legacy browsers, you might want to turn this rule of, since support for `getPrototypeOf` is not yet universal

## Further Reading

* [Object.getPrototypeOf](http://ejohn.org/blog/objectgetprototypeof/)