# Require or Disallow One Variable Declaration per Scope (one-var)

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

This rule is aimed at enforcing the use of either one variable declaration or multiple declarations per function (for `var`) or block (for `let` and `const`) scope. As such, it will warn when it encounters an unexpected number of variable declarations.

### Options

There are two ways to configure this rule. The first is by using one string specified as `"always"` (the default) to enforce one variable declaration per scope or `"never"` to enforce multiple variable declarations per scope.  If you declare variables in your code with `let` and `const`, then `"always"` and `"never"` will apply to the block scope for those declarations, not the function scope.

The second way to configure this rule is with an object. The keys are any of:

* `var`
* `let`
* `const`

or:

* `uninitialized`
* `initialized`

and the values are either `"always"` or `"never"`. This allows you to set behavior differently for each type of declaration, or whether variables are initialized during declaration.

You can configure the rule as follows:

(default) Exactly one variable declaration per type per function (var) or block (let or const)

```json
"one-var": [2, "always"]
```

Exactly one declarator per declaration per function (var) or block (let or const)

```json
"one-var": [2, "never"]
```

Configure each declaration type individually. Defaults to "always" if key not present.

```json
"one-var": [2, {
    "var": "always", // Exactly one var declaration per function
    "let": "always", // Exactly one let declaration per block
    "const": "never" // Exactly one declarator per const declaration per block
}]
```

Configure uninitialized and initialized seperately. Defaults to "always" if key not present.

```json
"one-var": [2, {
    "uninitialized": "always", // Exactly one declaration for uninitialized variables per function (var) or block (let or const)
    "initialized": "never" // Exactly one declarator per initialized variable declaration per function (var) or block (let or const)
}]
```

When configured with `"always"` as the first option (the default), the following patterns are considered problems:

```js
/*eslint one-var: [2, "always"]*/
/*eslint-env es6*/

function foo() {
    var bar;
    var baz;     /*error Combine this with the previous 'var' statement.*/
    let qux;
    let norf;    /*error Combine this with the previous 'let' statement.*/
}

function foo(){
    const bar = false;
    const baz = true;  /*error Combine this with the previous 'const' statement.*/
    let qux;
    let norf;          /*error Combine this with the previous 'let' statement.*/
}

function foo() {
    var bar;

    if (baz) {
        var qux = true; /*error Combine this with the previous 'var' statement.*/
    }
}
```

The following patterns are not considered problems:

```js
/*eslint one-var: [2, "always"]*/
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

When configured with `"never"` as the first option, the following patterns are considered problems:

```js
/*eslint one-var: [2, "never"]*/
/*eslint-env es6*/

function foo() {
    var bar,          /*error Split 'var' declarations into multiple statements.*/
        baz;
    const bar = true, /*error Split 'const' declarations into multiple statements.*/
        baz = false;
}

function foo() {
    var bar,          /*error Split 'var' declarations into multiple statements.*/
        qux;

    if (baz) {
        qux = true;
    }
}

function foo(){
    let bar = true,   /*error Split 'let' declarations into multiple statements.*/
        baz = false;
}
```

The following patterns are not considered problems:

```js
/*eslint one-var: [2, "never"]*/
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

When configured with an object as the first option, you can individually control how `var`, `let`, and `const` are handled, or alternatively how `uninitialized` and `initialized` variables are handled (which if used will override `var`, `let`, and `const`).

The following patterns are not considered problems:

```js
/*eslint one-var: [2, { var: "always", let: "never", const: "never" }]*/
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

The following patterns are not considered problems:

```js
/*eslint one-var: [2, { uninitialized: "always", initialized: "never" }]*/

function foo() {
    var a, b, c;
    var foo = true;
    var bar = false;
}
```

If you are configuring the rule with an object, by default, if you didn't specify declaration type it will not be checked. So the following pattern is not considered a warning when options are set to: `{ var: "always", let: "always" }`

```js
/*eslint one-var: [2, { var: "always", let: "always" }]*/
/*eslint-env es6*/

function foo() {
    var a, b;
    const foo = true;
    const bar = true;
    let c, d;
}
```


## Compatibility

* **JSHint** - This rule maps to the `onevar` JSHint rule, but allows `let` and `const` to be configured separately.
* **JSCS** - This rule roughly maps to `"disallowMultipleVarDecl"`

## Further Reading

[JSLint Errors - Combine this with the previous 'var' statement](http://jslinterrors.com/combine-this-with-the-previous-var-statement/)
