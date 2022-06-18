---
title: no-obj-calls
layout: doc
edit_link: https://github.com/eslint/eslint/edit/main/docs/src/rules/no-obj-calls.md
rule_type: problem
further_reading:
- https://es5.github.io/#x15.8
---

<!--RECOMMENDED-->

Disallows calling global object properties as functions.

ECMAScript provides several global objects that are intended to be used as-is. Some of these objects look as if they could be constructors due their capitalization (such as `Math` and `JSON`) but will throw an error if you try to execute them as functions.

The [ECMAScript 5 specification](https://es5.github.io/#x15.8) makes it clear that both `Math` and `JSON` cannot be invoked:

> The Math object does not have a `[[Call]]` internal property; it is not possible to invoke the Math object as a function.

The [ECMAScript 2015 specification](https://www.ecma-international.org/ecma-262/6.0/index.html#sec-reflect-object) makes it clear that `Reflect` cannot be invoked:

> The Reflect object also does not have a `[[Call]]` internal method; it is not possible to invoke the Reflect object as a function.

And the [ECMAScript 2017 specification](https://www.ecma-international.org/ecma-262/8.0/index.html#sec-atomics-object) makes it clear that `Atomics` cannot be invoked:

> The Atomics object does not have a `[[Call]]` internal method; it is not possible to invoke the Atomics object as a function.

## Rule Details

This rule disallows calling the `Math`, `JSON`, `Reflect` and `Atomics` objects as functions.

This rule also disallows using these objects as constructors with the `new` operator.

Examples of **incorrect** code for this rule:

```js
/*eslint no-obj-calls: "error"*/
/*eslint-env es2017*/

var math = Math();

var newMath = new Math();

var json = JSON();

var newJSON = new JSON();

var reflect = Reflect();

var newReflect = new Reflect();

var atomics = Atomics();

var newAtomics = new Atomics();
```

Examples of **correct** code for this rule:

```js
/*eslint no-obj-calls: "error"*/
/*eslint-env es2017*/

function area(r) {
    return Math.PI * r * r;
}

var object = JSON.parse("{}");

var value = Reflect.get({ x: 1, y: 2 }, "x");

var first = Atomics.load(foo, 0);
```
