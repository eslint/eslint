# enforce variables to be declared either together or separately in functions (one-var)

Variables can be declared at any point in JavaScript code using `var`, `let`, or `const`. There are many styles and preferences related to the declaration of variables, and one of those is deciding on how many variable declarations should be allowed in a single function.

There are two schools of thought in this regard:

1. There should be just one variable declaration for all variables in the function. That declaration typically appears at the top of the function.
2. You should use one variable declaration for each variable you want to define.

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

Object option:

* `"var": "always"` requires one `var` declaration per function
* `"var": "never"` requires multiple `var` declarations per function
* `"let": "always"` requires one `let` declaration per block
* `"let": "never"` requires multiple `let` declarations per block
* `"const": "always"` requires one `const` declaration per block
* `"const": "never"` requires multiple `const` declarations per block

Alternate object option:

* `"initialized": "always"` requires one variable declaration for initialized variables per scope
* `"initialized": "never"` requires multiple variable declarations for initialized variables per scope
* `"uninitialized": "always"` requires one variable declaration for uninitialized variables per scope
* `"uninitialized": "never"` requires multiple variable declarations for uninitialized variables per scope

### always

Examples of **incorrect** code for this rule with the default `"always"` option:

```js
/*eslint one-var: ["error", "always"]*/
/*eslint-env es6*/

function foo() {
    var bar;
    var baz;
    let qux;
    let norf;
}

function foo(){
    const bar = false;
    const baz = true;
    let qux;
    let norf;
}

function foo() {
    var bar;

    if (baz) {
        var qux = true;
    }
}
```

Examples of **correct** code for this rule with the default `"always"` option:

```js
/*eslint one-var: ["error", "always"]*/
/*eslint-env es6*/

function foo() {
    var bar,
        baz;
    let qux,
        norf;
}

function foo(){
    const bar = true,
        baz = false;
    let qux,
        norf;
}

function foo() {
    var bar,
        qux;

    if (baz) {
        qux = true;
    }
}

function foo(){
    let bar;

    if (baz) {
        let qux;
    }
}
```

### never

Examples of **incorrect** code for this rule with the `"never"` option:

```js
/*eslint one-var: ["error", "never"]*/
/*eslint-env es6*/

function foo() {
    var bar,
        baz;
    const bar = true,
        baz = false;
}

function foo() {
    var bar,
        qux;

    if (baz) {
        qux = true;
    }
}

function foo(){
    let bar = true,
        baz = false;
}
```

Examples of **correct** code for this rule with the `"never"` option:

```js
/*eslint one-var: ["error", "never"]*/
/*eslint-env es6*/

function foo() {
    var bar;
    var baz;
}

function foo() {
    var bar;

    if (baz) {
        var qux = true;
    }
}

function foo() {
    let bar;

    if (baz) {
        let qux = true;
    }
}
```

### var, let, and const

Examples of **incorrect** code for this rule with the `{ var: "always", let: "never", const: "never" }` option:

```js
/*eslint one-var: ["error", { var: "always", let: "never", const: "never" }]*/
/*eslint-env es6*/

function foo() {
    var bar;
    var baz;
    let qux,
        norf;
}

function foo() {
    const bar = 1,
          baz = 2;
    let qux,
        norf;
}
```

Examples of **correct** code for this rule with the `{ var: "always", let: "never", const: "never" }` option:

```js
/*eslint one-var: ["error", { var: "always", let: "never", const: "never" }]*/
/*eslint-env es6*/

function foo() {
    var bar,
        baz;
    let qux;
    let norf;
}

function foo() {
    const bar = 1;
    const baz = 2;
    let qux;
    let norf;
}
```

Examples of **incorrect** code for this rule with the `{ var: "never" }` option:

```js
/*eslint one-var: ["error", { var: "never" }]*/
/*eslint-env es6*/

function foo() {
    var bar,
        baz;
}
```

Examples of **correct** code for this rule with the `{ var: "never" }` option:

```js
/*eslint one-var: ["error", { var: "never" }]*/
/*eslint-env es6*/

function foo() {
    var bar,
        baz;
    const bar = 1; // `const` and `let` declarations are ignored if they are not specified
    const baz = 2;
    let qux;
    let norf;
}
```


### initialized and uninitialized

Examples of **incorrect** code for this rule with the `{ "initialized": "always", "uninitialized": "never" }` option:

```js
/*eslint one-var: ["error", { "initialized": "always", "uninitialized": "never" }]*/
/*eslint-env es6*/

function foo() {
    var a, b, c;
    var foo = true;
    var bar = false;
}
```

Examples of **correct** code for this rule with the `{ "initialized": "always", "uninitialized": "never" }` option:

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

Examples of **incorrect** code for this rule with the `{ "initialized": "never" }` option:

```js
/*eslint one-var: ["error", { "initialized": "never" }]*/
/*eslint-env es6*/

function foo() {
    var foo = true,
        bar = false;
}
```

Examples of **correct** code for this rule with the `{ "initialized": "never" }` option:

```js
/*eslint one-var: ["error", { initialized: "never" }]*/

function foo() {
    var foo = true;
    var bar = false;
    var a, b, c; // Uninitialized variables are ignored
}
```

## Compatibility

* **JSHint**: This rule maps to the `onevar` JSHint rule, but allows `let` and `const` to be configured separately.
* **JSCS**: This rule roughly maps to [disallowMultipleVarDecl](http://jscs.info/rule/disallowMultipleVarDecl)
