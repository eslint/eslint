# disallow calling global object properties as functions (no-obj-calls)

ECMAScript provides several global objects that are intended to be used as-is. Some of these objects look as if they could be constructors due their capitalization (such as `Math` and `JSON`) but will throw an error if you try to execute them as functions.

The [ECMAScript 5 specification](http://es5.github.io/#x15.8) makes it clear that both `Math` and `JSON` cannot be invoked:

> The Math object does not have a `[[Call]]` internal property; it is not possible to invoke the Math object as a function.

## Rule Details

This rule disallows calling the `Math` and `JSON` objects as functions.

Examples of **incorrect** code for this rule:

```js
/*eslint no-obj-calls: "error"*/

var math = Math();
var json = JSON();
```

Examples of **correct** code for this rule:

```js
/*eslint no-obj-calls: "error"*/

function area(r) {
    return Math.PI * r * r;
}
var object = JSON.parse("{}");
```

## Further Reading

* [The Math Object](http://es5.github.io/#x15.8)
