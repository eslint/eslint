---
title: space-after-keywords

---

Enforces consistent spacing after keywords.

:::important
This rule was removed in ESLint v2.0.0 and replaced by the [keyword-spacing](keyword-spacing) rule.
:::

Some style guides will require or disallow spaces following the certain keywords.

```js
if (condition) {
    doSomething();
} else {
    doSomethingElse();
}

if(condition) {
    doSomething();
}else{
    doSomethingElse();
}
```

## Rule Details

This rule will enforce consistency of spacing after the keywords `if`, `else`, `for`, `while`, `do`, `switch`, `try`, `catch`, `finally`, and `with`.

This rule takes one argument. If it is `"always"` then the keywords must be followed by at least one space. If `"never"`
then there should be no spaces following. The default is `"always"`.

Examples of **incorrect** code for this rule:

::: incorrect

```js
/*eslint space-after-keywords: "error"*/

if(a) {}

if (a) {} else{}

do{} while (a);
```

:::

::: incorrect

```js
/*eslint space-after-keywords: ["error", "never"]*/

if (a) {}
```

:::

Examples of **correct** code for this rule:

::: correct

```js
/*eslint space-after-keywords: "error"*/

if (a) {}

if (a) {} else {}
```

:::

::: correct

```js
/*eslint space-after-keywords: ["error", "never"]*/

if(a) {}
```

:::
