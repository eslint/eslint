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

The `__iterator__` property was a SpiderMonkey extension to JavaScript that could be used to create custom iterators compatible with JavaScript's `for in` and `for each` constructs. This property is now obsolete and not supported across all environments. Use ECMAScript 6 iterators and generators instead.

## Rule Details

This rule disallows the use of the `__iterator__` property. It will warn whenever it encounters a `__iterator__` property access or assignment.

Examples of **incorrect** code for this rule:

::: incorrect

```js
/*eslint no-iterator: "error"*/

Foo.prototype.__iterator__ = function() {
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

// Use the standard Symbol.iterator protocol instead
Foo.prototype[Symbol.iterator] = function() {
    let index = 0;
    const items = this.items;
    return {
        next() {
            return index < items.length
                ? { value: items[index++], done: false }
                : { done: true };
        }
    };
};

// Use a generator function
function* generateItems(arr) {
    for (const item of arr) {
        yield item;
    }
}

const __iterator__ = foo; // Assigning to a variable named __iterator__ is fine.
```

:::

## Options

This rule has no options.

## When Not To Use It

This rule should not be disabled in modern codebases. If you need to support very old environments where `Symbol.iterator` is unavailable and `__iterator__` was already in use, you may disable this rule, though migrating to the standard iteration protocol is strongly recommended.
