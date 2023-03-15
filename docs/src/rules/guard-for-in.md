---
title: guard-for-in
rule_type: suggestion
related_rules:
- prefer-object-has-own
- no-prototype-builtins
further_reading:
- https://javascriptweblog.wordpress.com/2011/01/04/exploring-javascript-for-in-loops/
- https://2ality.com/2012/01/objects-as-maps.html
---


Looping over objects with a `for in` loop will include properties that are inherited through the prototype chain. This behavior can lead to unexpected items in your for loop.

```js
for (key in foo) {
    doSomething(key);
}
```

For codebases that do not support ES2022, `Object.prototype.hasOwnProperty.call(foo, key)` can be used as a check that the property is not inherited.

For codebases that do support ES2022, `Object.hasOwn(foo, key)` can be used as a shorter alternative; see [prefer-object-has-own](prefer-object-has-own).

Note that simply checking `foo.hasOwnProperty(key)` is likely to cause an error in some cases; see [no-prototype-builtins](no-prototype-builtins).

## Rule Details

This rule is aimed at preventing unexpected behavior that could arise from using a `for in` loop without filtering the results in the loop. As such, it will warn when `for in` loops do not filter their results with an `if` statement.

Examples of **incorrect** code for this rule:

::: incorrect

```js
/*eslint guard-for-in: "error"*/

for (key in foo) {
    doSomething(key);
}
```

:::

Examples of **correct** code for this rule:

::: correct

```js
/*eslint guard-for-in: "error"*/

for (key in foo) {
    if (Object.hasOwn(foo, key)) {
        doSomething(key);
    }
}

for (key in foo) {
    if (Object.prototype.hasOwnProperty.call(foo, key)) {
        doSomething(key);
    }
}

for (key in foo) {
    if ({}.hasOwnProperty.call(foo, key)) {
        doSomething(key);
    }
}
```

:::
