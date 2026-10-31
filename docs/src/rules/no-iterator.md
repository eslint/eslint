---
title: no-iterator
rule_type: suggestion
related_rules:
- no-proto
further_reading:
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators
- https://compat-table.github.io/compat-table/non-standard/#test-__iterator__
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Deprecated_and_obsolete_features#Object_methods
---


The `__iterator__` property was a SpiderMonkey extension to JavaScript that could be used to create custom iterators compatible with the `for in` and `for each` constructs. This property was never part of the ECMAScript standard, is now obsolete, and is not supported in most environments. Use the standard iteration protocol based on `Symbol.iterator` instead.

## Rule Details

This rule disallows the use of the `__iterator__` property. It reports any member access, in dot or bracket notation, to a property named `__iterator__`.

Examples of **incorrect** code for this rule:

::: incorrect

```js
/*eslint no-iterator: "error"*/

Foo.prototype.__iterator__ = function () {
    return new FooIterator(this);
};

foo.__iterator__ = function () {};

foo["__iterator__"] = function () {};
```

:::

Examples of **correct** code for this rule:

::: correct

```js
/*eslint no-iterator: "error"*/

const __iterator__ = foo; // an identifier named `__iterator__`, not a property access.

Foo.prototype[Symbol.iterator] = function () {
    return new FooIterator(this);
};

const items = foo[Symbol.iterator]();
```

:::

## Options

This rule has no options.

## When Not To Use It

You might want to turn this rule off if you need to interoperate with legacy code that relies on the SpiderMonkey `__iterator__` extension.
