---
title: no-array-constructor
rule_type: suggestion
related_rules:
- no-new-wrappers
- no-object-constructor
---


Use of the `Array` constructor to construct a new array is generally
discouraged in favor of array literal notation because of the single-argument
pitfall and because the `Array` global may be redefined. The exception is when
the Array constructor is used to intentionally create sparse arrays of a
specified size by giving the constructor a single numeric argument.

## Rule Details

This rule disallows `Array` constructors.

Examples of **incorrect** code for this rule:

:::incorrect

```js
/*eslint no-array-constructor: "error"*/

Array();

Array(0, 1, 2);

new Array(0, 1, 2);

Array(...args);
```

:::

Examples of **correct** code for this rule:

:::correct

```js
/*eslint no-array-constructor: "error"*/

Array(500);

new Array(someOtherArray.length);

[0, 1, 2];

const createArray = Array => new Array();
```

:::

## When Not To Use It

This rule enforces a nearly universal stylistic concern. That being said, this
rule may be disabled if the constructor style is preferred.
