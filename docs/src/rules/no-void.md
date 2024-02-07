---
title: no-void
rule_type: suggestion
related_rules:
- no-undef-init
- no-undefined
further_reading:
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/void
- https://oreilly.com/javascript/excerpts/javascript-good-parts/bad-parts.html
---


The `void` operator takes an operand and returns `undefined`: `void expression` will evaluate `expression` and return `undefined`. It can be used to ignore any side effects `expression` may produce:

The common case of using `void` operator is to get a "pure" `undefined` value as prior to ES5 the `undefined` variable was mutable:

```js
// will always return undefined
(function(){
    return void 0;
})();

// will return 1 in ES3 and undefined in ES5+
(function(){
    undefined = 1;
    return undefined;
})();

// will throw TypeError in ES5+
(function(){
    'use strict';
    undefined = 1;
})();
```

Another common case is to minify code as `void 0` is shorter than `undefined`:

```js
foo = void 0;
foo = undefined;
```

When used with IIFE (immediately-invoked function expression), `void` can be used to force the function keyword to be treated as an expression instead of a declaration:

```js
var foo = 1;
void function(){ foo = 1; }() // will assign foo a value of 1
+function(){ foo = 1; }() // same as above
```

```js
function(){ foo = 1; }() // will throw SyntaxError
```

Some code styles prohibit `void` operator, marking it as non-obvious and hard to read.

## Rule Details

This rule aims to eliminate use of void operator.

Examples of **incorrect** code for this rule:

::: incorrect

```js
/*eslint no-void: "error"*/

void foo
void someFunction();

var foo = void bar();
function baz() {
    return void 0;
}
```

:::

## Options

This rule has an object option:

* `allowAsStatement` set to `true` allows the void operator to be used as a statement (Default `false`).

### allowAsStatement

When `allowAsStatement` is set to true, the rule will not error on cases that the void operator is used as a statement, i.e. when it's not used in an expression position, like in a variable assignment or a function return.

Examples of **incorrect** code for `{ "allowAsStatement": true }`:

::: incorrect

```js
/*eslint no-void: ["error", { "allowAsStatement": true }]*/

var foo = void bar();
function baz() {
    return void 0;
}
```

:::

Examples of **correct** code for `{ "allowAsStatement": true }`:

::: correct

```js
/*eslint no-void: ["error", { "allowAsStatement": true }]*/

void foo;
void someFunction();
```

:::

## When Not To Use It

If you intentionally use the `void` operator then you can disable this rule.
