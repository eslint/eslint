# Disallow unnecessary function binding (no-extra-bind)

The `bind()` method is used to create functions with specific `this` values and, optionally, binds arguments to specific values. When used to specify the value of `this`, it's important that the function actually use `this` in its function body. For example:

```js
var boundGetName = (function getName() {
    return this.name;
}).bind({ name: "ESLint" });

console.log(boundGetName());      // "ESLint"
```

This code is an example of a good use of `bind()` for setting the value of `this`.

Sometimes during the course of code maintenance, the `this` value is removed from the function body. In that case, you can end up with a call to `bind()` that doesn't accomplish anything:

```js
// useless bind
var boundGetName = (function getName() {
    return "ESLint";
}).bind({ name: "ESLint" });

console.log(boundGetName());      // "ESLint"
```

In this code, the reference to `this` has been removed but `bind()` is still used. In this case, the `bind()` is unnecessary overhead (and a performance hit) and can be safely removed.

## Rule details

This rule is aimed at avoiding the unnecessary use of `bind()` and as such will warn whenever an immediately-invoked function expression (IIFE) is using `bind()` and doesn't have an appropriate `this` value. This rule won't flag usage of `bind()` that includes function argument binding.

**Note:** Arrow functions can never have their `this` value set using `bind()`. This rule flags all uses of `bind()` with arrow functions as a problem

The following patterns are considered problems:

```js
/*eslint no-extra-bind: 2*/
/*eslint-env es6*/

var x = function () {   /*error The function binding is unnecessary.*/
    foo();
}.bind(bar);

var x = (() => {        /*error The function binding is unnecessary.*/
    foo();
}).bind(bar);

var x = (() => {        /*error The function binding is unnecessary.*/
    this.foo();
}).bind(bar);

var x = function () {   /*error The function binding is unnecessary.*/
    (function () {
      this.foo();
    }());
}.bind(bar);

var x = function () {   /*error The function binding is unnecessary.*/
    function foo() {
      this.bar();
    }
}.bind(baz);
```

The following patterns are not considered problems:

```js
/*eslint no-extra-bind: 2*/

var x = function () {
    this.foo();
}.bind(bar);

var x = function (a) {
    return a + 1;
}.bind(foo, bar);
```

## When Not To Use It

If you are not concerned about unnecessary calls to `bind()`, you can safely disable this rule.

## Further Reading

* [Function.prototype.bind](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)
* [Understanding JavaScript's Function.prototype.bind](http://www.smashingmagazine.com/2014/01/understanding-javascript-function-prototype-bind/)
