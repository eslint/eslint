# disallow calling global object properties as functions (no-obj-calls)

ECMAScript provides several global objects that are intended to be used as-is. Some of these objects look as if they could be constructors due their capitalization (such as `Math` and `JSON`) but will throw an error if you try to execute them as functions.

The [ECMAScript 5 specification](https://es5.github.io/#x15.8) makes it clear that both `Math` and `JSON` cannot be invoked:

> The Math object does not have a `[[Call]]` internal property; it is not possible to invoke the Math object as a function.

And the [ECMAScript 2015 specification](https://www.ecma-international.org/ecma-262/6.0/index.html#sec-reflect-object) makes it clear that `Reflect` cannot be invoked:

> The Reflect object also does not have a `[[Call]]` internal method; it is not possible to invoke the Reflect object as a function.

## Rule Details

This rule disallows calling the `Math`, `JSON` and `Reflect` objects as functions.

Examples of **incorrect** code for this rule:

```js
/*eslint no-obj-calls: "error"*/

var math = Math();
var json = JSON();
var reflect = Reflect();
```

Examples of **correct** code for this rule:

```js
/*eslint no-obj-calls: "error"*/

function area(r) {
    return Math.PI * r * r;
}
var object = JSON.parse("{}");
var value = Reflect.get({ x: 1, y: 2 }, "x");
```

## Further Reading

* [The Math Object](https://es5.github.io/#x15.8)
