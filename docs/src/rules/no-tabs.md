---
title: no-tabs
layout: doc
rule_type: layout
---


Some style guides don't allow the use of tab characters at all, including within comments.

## Rule Details

This rule looks for tabs anywhere inside a file: code, comments or anything else.

Examples of **incorrect** code for this rule:

::: incorrect

```js
var a⇥ = 2;

/**
* ⇥ ⇥ it's a test function
*/
function test(){}

var x = 1; //⇥ test
```

:::

Examples of **correct** code for this rule:

::: correct

```js
var a = 2;

/**
* it's a test function
*/
function test(){}

var x = 1; // test
```

:::

### Options

This rule has an optional object option with the following properties:

* `allowIndentationTabs` (default: false): If this is set to true, then the rule will not report tabs used for indentation.
* `allowInComments` (default: false): If this is set to true, then the rule will not report tabs in comments.
* `allowInStrings` (default: false): If this is set to true, then the rule will not report tabs in string .
* `allowInTemplates` (default: false): If this is set to true, then the rule will not report tabs in template literals.
* `allowInRegExps` (default: false): If this is set to true, then the rule will not report tabs used in RegExp literals.

#### allowIndentationTabs

Examples of **correct** code for this rule with the `allowIndentationTabs: true` option:

::: correct

```js
/* eslint no-tabs: ["error", { allowIndentationTabs: true }] */

function test() {
⇥ doSomething();
}

⇥ // comment with leading indentation tab
```

:::

#### allowInComments

Examples of **correct** code for this rule with the `allowInComments: true` option:

::: correct

```js
/* eslint no-tabs: ["error", { allowInComments: true }] */

// function test() {
// ⇥ doSomething();
// }

/*⇥ block⇥ comment⇥ with⇥ tabs⇥ */
```

:::

#### allowInStrings

Examples of **correct** code for this rule with the `allowInStrings: true` option:

::: correct

```js
/* eslint no-tabs: ["error", { allowInStrings: true }] */

const test = "string⇥ literal⇥ with⇥ tabs";
```

:::

#### allowInTemplates

Examples of **correct** code for this rule with the `allowInTemplates: true` option:

::: correct

```js
/* eslint no-tabs: ["error", { allowInTemplates: true }] */

const test = `template⇥ literal⇥ with⇥ tabs`;
```

:::

#### allowInRegExps

Examples of **correct** code for this rule with the `allowInRegExps: true` option:

::: correct

```js
/* eslint no-tabs: ["error", { allowInRegExps: true }] */

const test = /RegExps⇥ literal⇥ with⇥ tabs/;
```

:::

## When Not To Use It

If you have established a standard where having tabs is fine, then you can disable this rule.

## Compatibility

* **JSCS**: [disallowTabs](https://jscs-dev.github.io/rule/disallowTabs)
