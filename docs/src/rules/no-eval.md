---
title: no-eval
rule_type: suggestion
related_rules:
- no-implied-eval
further_reading:
- https://ericlippert.com/2003/11/01/eval-is-evil-part-one/
- https://javascriptweblog.wordpress.com/2010/04/19/how-evil-is-eval/
---


JavaScript's `eval()` function is potentially dangerous and is often misused. Using `eval()` on untrusted code can open a program up to several different injection attacks. The use of `eval()` in most contexts can be substituted for a better, alternative approach to a problem.

```js
var obj = { x: "foo" },
    key = "x",
    value = eval("obj." + key);
```

## Rule Details

This rule is aimed at preventing potentially dangerous, unnecessary, and slow code by disallowing the use of the `eval()` function. As such, it will warn whenever the `eval()` function is used.

Examples of **incorrect** code for this rule:

::: incorrect

```js
/*eslint no-eval: "error"*/

var obj = { x: "foo" },
    key = "x",
    value = eval("obj." + key);

(0, eval)("var a = 0");

var foo = eval;
foo("var a = 0");

// This `this` is the global object.
this.eval("var a = 0");
```

:::

Example of additional **incorrect** code for this rule with `window` global variable:

::: incorrect

```js
/*eslint no-eval: "error"*/
/*global window*/

window.eval("var a = 0");
```

:::

Example of additional **incorrect** code for this rule with `global` global variable:

::: incorrect

```js
/*eslint no-eval: "error"*/
/*global global*/

global.eval("var a = 0");
```

:::

Examples of **correct** code for this rule:

::: correct

```js
/*eslint no-eval: "error"*/

var obj = { x: "foo" },
    key = "x",
    value = obj[key];

class A {
    foo() {
        // This is a user-defined method.
        this.eval("var a = 0");
    }

    eval() {
    }

    static {
        // This is a user-defined static method.
        this.eval("var a = 0");
    }

    static eval() {
    }
}
```

:::

## Options

### allowIndirect

This rule has an option to allow ["indirect eval"](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval#direct_and_indirect_eval).
Indirect calls to `eval` are less dangerous than direct calls to `eval` because they cannot dynamically change the scope. Because of this, they also will not negatively impact performance to the degree of direct `eval`.

```js
{
    "no-eval": ["error", {"allowIndirect": true}] // default is false
}
```

Example of **incorrect** code for this rule with the `{"allowIndirect": true}` option:

::: incorrect

```js
/*eslint no-eval: ["error", {"allowIndirect": true} ]*/

var obj = { x: "foo" },
    key = "x",
    value = eval("obj." + key);
```

:::

Examples of **correct** code for this rule with the `{"allowIndirect": true}` option:

::: correct { "sourceType": "script" }

```js
/*eslint no-eval: ["error", {"allowIndirect": true} ]*/

(0, eval)("var a = 0");

var foo = eval;
foo("var a = 0");

this.eval("var a = 0");
```

:::

::: correct

```js
/*eslint no-eval: ["error", {"allowIndirect": true} ]*/
/*global window*/

window.eval("var a = 0");
```

:::

::: correct

```js
/*eslint no-eval: ["error", {"allowIndirect": true} ]*/
/*global global*/

global.eval("var a = 0");
```

:::

## Known Limitations

* This rule is warning every `eval()` even if the `eval` is not global's.
  This behavior is in order to detect calls of direct `eval`. Such as:

  ```js
  module.exports = function(eval) {
      // If the value of this `eval` is built-in `eval` function, this is a
      // call of direct `eval`.
      eval("var a = 0");
  };
  ```

* This rule cannot catch renaming the global object. Such as:

  ```js
  var foo = window;
  foo.eval("var a = 0");
  ```
