---
title: no-catch-shadow
rule_type: suggestion
---


This rule was **deprecated** in ESLint v5.1.0.

In IE 8 and earlier, the catch clause parameter can overwrite the value of a variable in the outer scope, if that variable has the same name as the catch clause parameter.

```js
var err = "x";

try {
    throw "problem";
} catch (err) {

}

console.log(err)    // err is 'problem', not 'x'
```

## Rule Details

This rule is aimed at preventing unexpected behavior in your program that may arise from a bug in IE 8 and earlier, in which the catch clause parameter can leak into outer scopes. This rule will warn whenever it encounters a catch clause parameter that has the same name as a variable in an outer scope.

Examples of **incorrect** code for this rule:

::: incorrect

```js
/*eslint no-catch-shadow: "error"*/

var err = "x";

try {
    throw "problem";
} catch (err) {

}

function error() {
    // ...
};

try {
    throw "problem";
} catch (error) {

}
```

:::

Examples of **correct** code for this rule:

::: correct

```js
/*eslint no-catch-shadow: "error"*/

var err = "x";

try {
    throw "problem";
} catch (e) {

}

function error() {
    // ...
};

try {
    throw "problem";
} catch (e) {

}
```

:::

## When Not To Use It

If you do not need to support IE 8 and earlier, you should turn this rule off.
