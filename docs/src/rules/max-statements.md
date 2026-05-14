---
title: max-statements
rule_type: suggestion
related_rules:
- complexity
- max-depth
- max-len
- max-lines
- max-lines-per-function
- max-nested-callbacks
- max-params
---


The `max-statements` rule allows you to specify the maximum number of statements allowed in a function.

```js
function foo() {
  const bar = 1; // one statement
  const baz = 2; // two statements
  const qux = 3; // three statements
}
```

## Rule Details

This rule enforces a maximum number of statements allowed in function blocks.

## Options

This rule has a number or object option:

* `"max"` (default `10`) enforces a maximum number of statements allows in function blocks

**Deprecated:** The object property `maximum` is deprecated; please use the object property `max` instead.

This rule has an object option:

* `"ignoreTopLevelFunctions": true` ignores top-level functions

### max

Examples of **incorrect** code for this rule with the default `{ "max": 10 }` option:

::: incorrect

```js
/*eslint max-statements: ["error", 10]*/

function foo() {
  const foo1 = 1;
  const foo2 = 2;
  const foo3 = 3;
  const foo4 = 4;
  const foo5 = 5;
  const foo6 = 6;
  const foo7 = 7;
  const foo8 = 8;
  const foo9 = 9;
  const foo10 = 10;

  const foo11 = 11; // Too many.
}

const bar = () => {
  const foo1 = 1;
  const foo2 = 2;
  const foo3 = 3;
  const foo4 = 4;
  const foo5 = 5;
  const foo6 = 6;
  const foo7 = 7;
  const foo8 = 8;
  const foo9 = 9;
  const foo10 = 10;

  const foo11 = 11; // Too many.
};
```

:::

Examples of **correct** code for this rule with the default `{ "max": 10 }` option:

::: correct

```js
/*eslint max-statements: ["error", 10]*/

function foo() {
  const foo1 = 1;
  const foo2 = 2;
  const foo3 = 3;
  const foo4 = 4;
  const foo5 = 5;
  const foo6 = 6;
  const foo7 = 7;
  const foo8 = 8;
  const foo9 = 9;
  return function () { // 10

    // The number of statements in the inner function does not count toward the
    // statement maximum.

    let bar;
    let baz;
    return 42;
  };
}

const bar = () => {
  const foo1 = 1;
  const foo2 = 2;
  const foo3 = 3;
  const foo4 = 4;
  const foo5 = 5;
  const foo6 = 6;
  const foo7 = 7;
  const foo8 = 8;
  const foo9 = 9;
  return function () { // 10

    // The number of statements in the inner function does not count toward the
    // statement maximum.

    let bar;
    let baz;
    return 42;
  };
}
```

:::

Note that this rule does not apply to class static blocks, and that statements in class static blocks do not count as statements in the enclosing function.

Examples of **correct** code for this rule with `{ "max": 2 }` option:

::: correct

```js
/*eslint max-statements: ["error", 2]*/

function foo() {
    let one;
    let two = class {
        static {
            let three;
            let four;
            let five;
            if (six) {
                let seven;
                let eight;
                let nine;
            }
        }
    };
}
```

:::

### ignoreTopLevelFunctions

Examples of additional **correct** code for this rule with the `{ "max": 10 }, { "ignoreTopLevelFunctions": true }` options:

::: correct

```js
/*eslint max-statements: ["error", 10, { "ignoreTopLevelFunctions": true }]*/

function foo() {
  const foo1 = 1;
  const foo2 = 2;
  const foo3 = 3;
  const foo4 = 4;
  const foo5 = 5;
  const foo6 = 6;
  const foo7 = 7;
  const foo8 = 8;
  const foo9 = 9;
  const foo10 = 10;
  const foo11 = 11;
}
```

:::
