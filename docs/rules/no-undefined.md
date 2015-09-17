# Disallow Use of `undefined` Variable (no-undefined)

The `undefined` variable is unique in JavaScript because it is actually a property of the global object. As such, in ECMAScript 3 it was possible to overwrite the value of `undefined`. While ECMAScript 5 disallows overwriting `undefined`, it's still possible to shadow `undefined`, such as:

```js
function doSomething(data) {
    var undefined = "hi";

    // doesn't do what you think it does
    if (data === undefined) {
        // ...
    }

}
```

This represents a problem for `undefined` that doesn't exist for `null`, which is a keyword and primitive value that can neither be overwritten nor shadowed.

All uninitialized variables automatically get the value of `undefined`:

```js
var foo;

console.log(foo === undefined);     // true (assuming no shadowing)
```

For this reason, it's not necessary to explicitly initialize a variable to `undefined`.

Taking all of this into account, some style guides forbid the use of `undefined`, recommending instead:

* Variables that should be `undefined` are simply left uninitialized.
* Checking if a value is `undefined` should be done with `typeof`.
* Using the `void` operator to generate the value of `undefined` if necessary.

## Examples

This rule aims to eliminate the use of `undefined`, and as such, generates a warning whenever it is used.

The following patterns are considered problems:

```js
/*eslint no-undefined: 2*/

var foo = undefined;      /*error Unexpected use of undefined.*/

var undefined = "foo";    /*error Unexpected use of undefined.*/

if (foo === undefined) {  /*error Unexpected use of undefined.*/
    // ...
}

function foo(undefined) { /*error Unexpected use of undefined.*/
    // ...
}
```

The following patterns are not considered problems:

```js
/*eslint no-undefined: 2*/

var foo = void 0;

var Undefined = "foo";

if (typeof foo === "undefined") {
    // ...
}

global.undefined = "foo";
```

## When Not To Use It

If you want to allow the use of `undefined` in your code, then you can safely turn this rule off.

## Further Reading

* [undefined - JavaScript | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined)
* [Understanding JavaScript’s ‘undefined’ | JavaScript, JavaScript...](http://javascriptweblog.wordpress.com/2010/08/16/understanding-undefined-and-preventing-referenceerrors/)
* [ECMA262 edition 5.1 &sect;15.1.1.3: undefined](https://es5.github.io/#x15.1.1.3)

## Related Rules

* [no-undef-init](no-undef-init.md)
* [no-void](no-void.md)
