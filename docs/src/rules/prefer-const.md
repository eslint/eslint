---
title: prefer-const
rule_type: suggestion
related_rules:
- no-var
- no-use-before-define
---



If a variable is never reassigned, using the `const` declaration is better.

`const` declaration tells readers, "this variable is never reassigned," reducing cognitive load and improving maintainability.

## Rule Details

This rule is aimed at flagging variables that are declared using `let` keyword, but never reassigned after the initial assignment.

Examples of **incorrect** code for this rule:

::: incorrect

```js
/*eslint prefer-const: "error"*/

// it's initialized and never reassigned.
let a = 3;
console.log(a);

let b;
b = 0;
console.log(b);

class C {
    static {
        let a;
        a = 0;
        console.log(a);
    }
}

// `i` is redefined (not reassigned) on each loop step.
for (let i in [1, 2, 3]) {
    console.log(i);
}

// `a` is redefined (not reassigned) on each loop step.
for (let a of [1, 2, 3]) {
    console.log(a);
}
```

:::

Examples of **correct** code for this rule:

::: correct

```js
/*eslint prefer-const: "error"*/

// using const.
const a = 0;

// it's never initialized.
let b;
console.log(b);

// it's reassigned after initialized.
let c;
c = 0;
c = 1;
console.log(c);

// it's initialized in a different block from the declaration.
let d;
if (true) {
    d = 0;
}
console.log(d);

// it's initialized in a different scope.
let e;
class C {
    #x;
    static {
        e = obj => obj.#x;
    }
}

// it's initialized at a place that we cannot write a variable declaration.
let f;
if (true) f = 0;
console.log(f);

// `i` gets a new binding each iteration
for (const i in [1, 2, 3]) {
  console.log(i);
}

// `a` gets a new binding each iteration
for (const a of [1, 2, 3]) {
  console.log(a);
}

// `end` is never reassigned, but we cannot separate the declarations without modifying the scope.
for (let i = 0, end = 10; i < end; ++i) {
    console.log(i);
}

// `predicate` is only assigned once but cannot be separately declared as `const`
let predicate;
[object.type, predicate] = foo();

// `g` is only assigned once but cannot be separately declared as `const`
let g;
const h = {};
({ g, c: h.c } = func());

// suggest to use `no-var` rule.
var i = 3;
console.log(i);
```

:::

## Options

```json
{
    "prefer-const": ["error", {
        "destructuring": "any",
        "ignoreReadBeforeAssign": false
    }]
}
```

### destructuring

The kind of the way to address variables in destructuring.
There are 2 values:

* `"any"` (default) - If any variables in destructuring should be `const`, this rule warns for those variables.
* `"all"` - If all variables in destructuring should be `const`, this rule warns the variables. Otherwise, ignores them.

Examples of **incorrect** code for the default `{"destructuring": "any"}` option:

::: incorrect

```js
/*eslint prefer-const: "error"*/
/*eslint-env es6*/

let {a, b} = obj;    /*error 'b' is never reassigned, use 'const' instead.*/
a = a + 1;
```

:::

Examples of **correct** code for the default `{"destructuring": "any"}` option:

::: correct

```js
/*eslint prefer-const: "error"*/
/*eslint-env es6*/

// using const.
const {a: a0, b} = obj;
const a = a0 + 1;

// all variables are reassigned.
let {c, d} = obj;
c = c + 1;
d = d + 1;
```

:::

Examples of **incorrect** code for the `{"destructuring": "all"}` option:

::: incorrect

```js
/*eslint prefer-const: ["error", {"destructuring": "all"}]*/
/*eslint-env es6*/

// all of `a` and `b` should be const, so those are warned.
let {a, b} = obj;    /*error 'a' is never reassigned, use 'const' instead.
                             'b' is never reassigned, use 'const' instead.*/
```

:::

Examples of **correct** code for the `{"destructuring": "all"}` option:

::: correct

```js
/*eslint prefer-const: ["error", {"destructuring": "all"}]*/
/*eslint-env es6*/

// 'b' is never reassigned, but all of `a` and `b` should not be const, so those are ignored.
let {a, b} = obj;
a = a + 1;
```

:::

### ignoreReadBeforeAssign

This is an option to avoid conflicting with `no-use-before-define` rule (without `"nofunc"` option).
If `true` is specified, this rule will ignore variables that are read between the declaration and the first assignment.
Default is `false`.

Examples of **correct** code for the `{"ignoreReadBeforeAssign": true}` option:

::: correct

```js
/*eslint prefer-const: ["error", {"ignoreReadBeforeAssign": true}]*/
/*eslint-env es6*/

let timer;
function initialize() {
    if (foo()) {
        clearInterval(timer);
    }
}
timer = setInterval(initialize, 100);
```

:::

Examples of **correct** code for the default `{"ignoreReadBeforeAssign": false}` option:

::: correct

```js
/*eslint prefer-const: ["error", {"ignoreReadBeforeAssign": false}]*/
/*eslint-env es6*/

const timer = setInterval(initialize, 100);
function initialize() {
    if (foo()) {
        clearInterval(timer);
    }
}
```

:::

## When Not To Use It

If you don't want to be notified about variables that are never reassigned after initial assignment, you can safely disable this rule.
