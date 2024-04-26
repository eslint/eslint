---
title: no-var
rule_type: suggestion
---



ECMAScript 6 allows programmers to create variables with block scope instead of function scope using the `let`
and `const` keywords. Block scope is common in many other programming languages and helps programmers avoid mistakes
such as:

```js
var count = people.length;
var enoughFood = count > sandwiches.length;

if (enoughFood) {
    var count = sandwiches.length; // accidentally overriding the count variable
    console.log("We have " + count + " sandwiches for everyone. Plenty for all!");
}

// our count variable is no longer accurate
console.log("We have " + count + " people and " + sandwiches.length + " sandwiches!");
```

## Rule Details

This rule is aimed at discouraging the use of `var` and encouraging the use of `const` or `let` instead.

## Examples

Examples of **incorrect** code for this rule:

::: incorrect

```js
/*eslint no-var: "error"*/

var x = "y";
var CONFIG = {};
```

:::

Examples of **correct** code for this rule:

::: correct

```js
/*eslint no-var: "error"*/

let x = "y";
const CONFIG = {};
```

:::

## When Not To Use It

In addition to non-ES6 environments, existing JavaScript projects that are beginning to introduce ES6 into their
codebase may not want to apply this rule if the cost of migrating from `var` to `let` is too costly.
