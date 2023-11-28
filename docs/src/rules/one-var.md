---
title: one-var
rule_type: suggestion
---



Variables can be declared at any point in JavaScript code using `var`, `let`, or `const`. There are many styles and preferences related to the declaration of variables, and one of those is deciding on how many variable declarations should be allowed in a single function.

There are two schools of thought in this regard:

1. There should be just one variable declaration for all variables in the function. That declaration typically appears at the top of the function.
1. You should use one variable declaration for each variable you want to define.

For instance:

```js
// one variable declaration per function
function foo() {
    var bar, baz;
}

// multiple variable declarations per function
function foo() {
    var bar;
    var baz;
}
```

The single-declaration school of thought is based in pre-ECMAScript 6 behaviors, where there was no such thing as block scope, only function scope. Since all `var` statements are hoisted to the top of the function anyway, some believe that declaring all variables in a single declaration at the top of the function removes confusion around scoping rules.

## Rule Details

This rule enforces variables to be declared either together or separately per function ( for `var`) or block (for `let` and `const`) scope.

## Options

This rule has one option, which can be a string option or an object option.

String option:

* `"always"` (default) requires one variable declaration per scope
* `"never"` requires multiple variable declarations per scope
* `"consecutive"` allows multiple variable declarations per scope but requires consecutive variable declarations to be combined into a single declaration

Object option:

* `"var": "always"` requires one `var` declaration per function
* `"var": "never"` requires multiple `var` declarations per function
* `"var": "consecutive"` requires consecutive `var` declarations to be a single declaration
* `"let": "always"` requires one `let` declaration per block
* `"let": "never"` requires multiple `let` declarations per block
* `"let": "consecutive"` requires consecutive `let` declarations to be a single declaration
* `"const": "always"` requires one `const` declaration per block
* `"const": "never"` requires multiple `const` declarations per block
* `"const": "consecutive"` requires consecutive `const` declarations to be a single declaration
* `"separateRequires": true` enforces `requires` to be separate from declarations

Alternate object option:

* `"initialized": "always"` requires one variable declaration for initialized variables per scope
* `"initialized": "never"` requires multiple variable declarations for initialized variables per scope
* `"initialized": "consecutive"` requires consecutive variable declarations for initialized variables to be a single declaration
* `"uninitialized": "always"` requires one variable declaration for uninitialized variables per scope
* `"uninitialized": "never"` requires multiple variable declarations for uninitialized variables per scope
* `"uninitialized": "consecutive"` requires consecutive variable declarations for uninitialized variables to be a single declaration

### always

Examples of **incorrect** code for this rule with the default `"always"` option:

::: incorrect

```js
/*eslint one-var: ["error", "always"]*/

function foo1() {
    var bar;
    var baz;
    let qux;
    let norf;
}

function foo2(){
    const bar = false;
    const baz = true;
    let qux;
    let norf;
}

function foo3() {
    var bar;

    if (baz) {
        var qux = true;
    }
}

class C {
    static {
        var foo;
        var bar;
    }

    static {
        var foo;
        if (bar) {
            var baz = true;
        }
    }

    static {
        let foo;
        let bar;
    }
}
```

:::

Examples of **correct** code for this rule with the default `"always"` option:

::: correct

```js
/*eslint one-var: ["error", "always"]*/

function foo1() {
    var bar,
        baz;
    let qux,
        norf;
}

function foo2(){
    const bar = true,
        baz = false;
    let qux,
        norf;
}

function foo3() {
    var bar,
        qux;

    if (baz) {
        qux = true;
    }
}

function foo4(){
    let bar;

    if (baz) {
        let qux;
    }
}

class C {
    static {
        var foo, bar;
    }

    static {
        var foo, baz;
        if (bar) {
            baz = true;
        }
    }

    static {
        let foo, bar;
    }

    static {
        let foo;
        if (bar) {
            let baz;
        }
    }
}
```

:::

### never

Examples of **incorrect** code for this rule with the `"never"` option:

::: incorrect

```js
/*eslint one-var: ["error", "never"]*/

function foo1() {
    var bar,
        baz;
    const qux = true,
        foobar = false;
}

function foo2() {
    var bar,
        qux;

    if (baz) {
        qux = true;
    }
}

function foo3(){
    let bar = true,
        baz = false;
}

class C {
    static {
        var foo, bar;
        let baz, qux;
    }
}
```

:::

Examples of **correct** code for this rule with the `"never"` option:

::: correct

```js
/*eslint one-var: ["error", "never"]*/

function foo1() {
    var bar;
    var baz;
}

function foo2() {
    var bar;

    if (baz) {
        var qux = true;
    }
}

function foo3() {
    let bar;

    if (baz) {
        let qux = true;
    }
}

class C {
    static {
        var foo;
        var bar;
        let baz;
        let qux;
    }
}

// declarations with multiple variables are allowed in for-loop initializers
for (var i = 0, len = arr.length; i < len; i++) {
    doSomething(arr[i]);
}
```

:::

### consecutive

Examples of **incorrect** code for this rule with the `"consecutive"` option:

::: incorrect

```js
/*eslint one-var: ["error", "consecutive"]*/

function foo1() {
    var bar;
    var baz;
}

function foo2(){
    var bar = 1;
    var baz = 2;

    qux();

    var qux = 3;
    var quux;
}

class C {
    static {
        var foo;
        var bar;
        let baz;
        let qux;
    }
}
```

:::

Examples of **correct** code for this rule with the `"consecutive"` option:

::: correct

```js
/*eslint one-var: ["error", "consecutive"]*/

function foo1() {
    var bar,
        baz;
}

function foo2(){
    var bar = 1,
        baz = 2;

    qux();

    var qux = 3,
        quux;
}

class C {
    static {
        var foo, bar;
        let baz, qux;
        doSomething();
        let quux;
        var quuux;
    }
}
```

:::

### var, let, and const

Examples of **incorrect** code for this rule with the `{ var: "always", let: "never", const: "never" }` option:

::: incorrect

```js
/*eslint one-var: ["error", { var: "always", let: "never", const: "never" }]*/
/*eslint-env es6*/

function foo1() {
    var bar;
    var baz;
    let qux,
        norf;
}

function foo2() {
    const bar = 1,
          baz = 2;
    let qux,
        norf;
}
```

:::

Examples of **correct** code for this rule with the `{ var: "always", let: "never", const: "never" }` option:

::: correct

```js
/*eslint one-var: ["error", { var: "always", let: "never", const: "never" }]*/
/*eslint-env es6*/

function foo1() {
    var bar,
        baz;
    let qux;
    let norf;
}

function foo2() {
    const bar = 1;
    const baz = 2;
    let qux;
    let norf;
}
```

:::

Examples of **incorrect** code for this rule with the `{ var: "never" }` option:

::: incorrect

```js
/*eslint one-var: ["error", { var: "never" }]*/
/*eslint-env es6*/

function foo() {
    var bar,
        baz;
}
```

:::

Examples of **correct** code for this rule with the `{ var: "never" }` option:

::: correct

```js
/*eslint one-var: ["error", { var: "never" }]*/
/*eslint-env es6*/

function foo() {
    var bar;
    var baz;

    // `const` and `let` declarations are ignored if they are not specified
    const foobar = 1;
    const foobaz = 2;
    const barfoo = 1, bazfoo = 2;
    let qux;
    let norf;
    let fooqux, foonorf;
}
```

:::

Examples of **incorrect** code for this rule with the `{ separateRequires: true }` option:

::: incorrect

```js
/*eslint one-var: ["error", { separateRequires: true, var: "always" }]*/
/*eslint-env node*/

var foo = require("foo"),
    bar = "bar";
```

:::

Examples of **correct** code for this rule with the `{ separateRequires: true }` option:

::: correct

```js
/*eslint one-var: ["error", { separateRequires: true, var: "always" }]*/
/*eslint-env node*/

var foo = require("foo");
var bar = "bar";
```

:::

::: correct

```js
var foo = require("foo"),
    bar = require("bar");
```

:::

Examples of **incorrect** code for this rule with the `{ var: "never", let: "consecutive", const: "consecutive" }` option:

::: incorrect

```js
/*eslint one-var: ["error", { var: "never", let: "consecutive", const: "consecutive" }]*/
/*eslint-env es6*/

function foo1() {
    let a,
        b;
    let c;

    var d,
        e;
}

function foo2() {
    const a = 1,
        b = 2;
    const c = 3;

    var d,
        e;
}
```

:::

Examples of **correct** code for this rule with the `{ var: "never", let: "consecutive", const: "consecutive" }` option:

::: correct

```js
/*eslint one-var: ["error", { var: "never", let: "consecutive", const: "consecutive" }]*/
/*eslint-env es6*/

function foo1() {
    let a,
        b;

    var d;
    var e;

    let f;
}

function foo2() {
    const a = 1,
          b = 2;

    var c;
    var d;

    const e = 3;
}
```

:::

Examples of **incorrect** code for this rule with the `{ var: "consecutive" }` option:

::: incorrect

```js
/*eslint one-var: ["error", { var: "consecutive" }]*/
/*eslint-env es6*/

function foo() {
    var a;
    var b;
}
```

:::

Examples of **correct** code for this rule with the `{ var: "consecutive" }` option:

::: correct

```js
/*eslint one-var: ["error", { var: "consecutive" }]*/
/*eslint-env es6*/

function foo() {
    var a,
        b;
    const c = 1; // `const` and `let` declarations are ignored if they are not specified
    const d = 2;
    let e;
    let f;
}
```

:::

### initialized and uninitialized

Examples of **incorrect** code for this rule with the `{ "initialized": "always", "uninitialized": "never" }` option:

::: incorrect

```js
/*eslint one-var: ["error", { "initialized": "always", "uninitialized": "never" }]*/
/*eslint-env es6*/

function foo() {
    var a, b, c;
    var foo = true;
    var bar = false;
}
```

:::

Examples of **correct** code for this rule with the `{ "initialized": "always", "uninitialized": "never" }` option:

::: correct

```js
/*eslint one-var: ["error", { "initialized": "always", "uninitialized": "never" }]*/

function foo() {
    var a;
    var b;
    var c;
    var foo = true,
        bar = false;
}

for (let z of foo) {
    doSomething(z);
}

let z;
for (z of foo) {
    doSomething(z);
}
```

:::

Examples of **incorrect** code for this rule with the `{ "initialized": "never" }` option:

::: incorrect

```js
/*eslint one-var: ["error", { "initialized": "never" }]*/
/*eslint-env es6*/

function foo() {
    var foo = true,
        bar = false;
}
```

:::

Examples of **correct** code for this rule with the `{ "initialized": "never" }` option:

::: correct

```js
/*eslint one-var: ["error", { "initialized": "never" }]*/

function foo() {
    var foo = true;
    var bar = false;
    var a, b, c; // Uninitialized variables are ignored
}
```

:::

Examples of **incorrect** code for this rule with the `{ "initialized": "consecutive", "uninitialized": "never" }` option:

::: incorrect

```js
/*eslint one-var: ["error", { "initialized": "consecutive", "uninitialized": "never" }]*/

function foo() {
    var a = 1;
    var b = 2;
    var c,
        d;
    var e = 3;
    var f = 4;
}
```

:::

Examples of **correct** code for this rule with the `{ "initialized": "consecutive", "uninitialized": "never" }` option:

::: correct

```js
/*eslint one-var: ["error", { "initialized": "consecutive", "uninitialized": "never" }]*/

function foo() {
    var a = 1,
        b = 2;
    var c;
    var d;
    var e = 3,
        f = 4;
}
```

:::

Examples of **incorrect** code for this rule with the `{ "initialized": "consecutive" }` option:

::: incorrect

```js
/*eslint one-var: ["error", { "initialized": "consecutive" }]*/

function foo() {
    var a = 1;
    var b = 2;

    foo();

    var c = 3;
    var d = 4;
}
```

:::

Examples of **correct** code for this rule with the `{ "initialized": "consecutive" }` option:

::: correct

```js
/*eslint one-var: ["error", { "initialized": "consecutive" }]*/

function foo() {
    var a = 1,
        b = 2;

    foo();

    var c = 3,
        d = 4;
}
```

:::

## Compatibility

* **JSHint**: This rule maps to the `onevar` JSHint rule, but allows `let` and `const` to be configured separately.
* **JSCS**: This rule roughly maps to [disallowMultipleVarDecl](https://jscs-dev.github.io/rule/disallowMultipleVarDecl).
* **JSCS**: This rule option `separateRequires` roughly maps to [requireMultipleVarDecl](https://jscs-dev.github.io/rule/requireMultipleVarDecl).
