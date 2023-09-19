---
title: no-new-object
rule_type: suggestion
related_rules:
- no-array-constructor
- no-new-wrappers
---

This rule was **deprecated** in ESLint v8.50.0 and replaced by the [no-object-constructor](no-object-constructor) rule. The new rule flags more situations where object literal syntax can be used, and it does not report a problem when the `Object` constructor is invoked with an argument.

The `Object` constructor is used to create new generic objects in JavaScript, such as:

```js
var myObject = new Object();
```

However, this is no different from using the more concise object literal syntax:

```js
var myObject = {};
```

For this reason, many prefer to always use the object literal syntax and never use the `Object` constructor.

While there are no performance differences between the two approaches, the byte savings and conciseness of the object literal form is what has made it the de facto way of creating new objects.

## Rule Details

This rule disallows calling the `Object` constructor with `new`.

Examples of **incorrect** code for this rule:

::: incorrect

```js
/*eslint no-new-object: "error"*/

var myObject = new Object();

new Object();

var foo = new Object("foo");
```

:::

Examples of **correct** code for this rule:

::: correct

```js
/*eslint no-new-object: "error"*/

var myObject = new CustomObject();

var myObject = {};

var Object = function Object() {};
new Object();

var foo = Object("foo");
```

:::

## When Not To Use It

If you wish to allow the use of the `Object` constructor with `new`, you can safely turn this rule off.
