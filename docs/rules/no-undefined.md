# Disallow Use of `undefined` Variable (no-undefined)

The `undefined` variable in JavaScript is actually a property of the global object. As such, in ECMAScript 3 it was possible to overwrite the value of `undefined`. While ECMAScript 5 disallows overwriting `undefined`, it's still possible to shadow `undefined`, such as:

```js
function doSomething(data) {
    var undefined = "hi";

    // doesn't do what you think it does
    if (data === undefined) {
        // ...
    }

}
```

Because `undefined` can be overwritten or shadowed, reading `undefined` can give an unexpected value. (This is not the case for `null`, which is a keyword that always produces the same value.) To guard against this, you can avoid all uses of `undefined`, which is what some style guides recommend and what this rule enforces. Those style guides then also recommend:

* Variables that should be `undefined` are simply left uninitialized. (All uninitialized variables automatically get the value of `undefined` in JavaScript.)
* Checking if a value is `undefined` should be done with `typeof`.
* Using the `void` operator to generate the value of `undefined` if necessary.

As an alternative, you can use the [no-global-assign](no-global-assign.md) and [no-shadow-restricted-names](no-shadow-restricted-names.md) rules to prevent `undefined` from being shadowed or assigned a different value. This ensures that `undefined` will always hold its original, expected value.


## Rule Details

This rule aims to eliminate the use of `undefined`, and as such, generates a warning whenever it is used.

Examples of **incorrect** code for this rule:

```js
/*eslint no-undefined: "error"*/

var foo = undefined;

var undefined = "foo";

if (foo === undefined) {
    // ...
}

function foo(undefined) {
    // ...
}
```

Examples of **correct** code for this rule:

```js
/*eslint no-undefined: "error"*/

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

* [undefined - JavaScript \| MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined)
* [Understanding JavaScript’s ‘undefined’ \| JavaScript, JavaScript...](https://javascriptweblog.wordpress.com/2010/08/16/understanding-undefined-and-preventing-referenceerrors/)
* [ECMA262 edition 5.1 &sect;15.1.1.3: undefined](https://es5.github.io/#x15.1.1.3)

## Related Rules

* [no-undef-init](no-undef-init.md)
* [no-void](no-void.md)
* [no-shadow-restricted-names](no-shadow-restricted-names.md)
* [no-global-assign](no-global-assign.md)
