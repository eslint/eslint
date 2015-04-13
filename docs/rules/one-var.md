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

This rule is aimed at enforcing the use of either one variable declaration or multiple declarations per function. As such, it will warn when it encounters an unexpected number of variable declarations.

### Options

There are two ways to configure this rule. The first is with one string specified as `"always"` (the default) to enforce one variable declaration per function or `"never"` to enforce multiple variable declarations per function.

If you declare with `let` and `const`, `"always"` and `"never"` will only apply to the block scope, not the function scope.

An alternative is to configure with an object. The keys are any of `var`, `let`, or `const`, and the values are either `"always"` or `"never"`. This allows you to set behavior differently for each type of declaration.

You can configure the rule as follows:

```javascript
{
    // (default) Exactly one variable declaration per type per function (var) or block (let or const)
    "one-var": [2, "always"],

    // Exactly one declarator per declaration per function (var) or block (let or const)
    "one-var": [2, "never"],

    // Configure each declaration type individually. Defaults to "always" if key not present.
    "one-var": [2, {
        "var": "always", // Exactly one var declaration per function
        "let": "always", // Exactly one let declaration per block
        "const", "never" // Exactly one declarator per const declaration per block
    }]
}
```

When configured with `"always"` as the first option (the default), the following patterns are considered warnings:

```js
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

The following patterns are not considered warnings:

```js
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

When configured with `"never"` as the first option, the following patterns are considered warnings:

```js
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

The following patterns are not considered warnings:

```js
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

When configured with an object as the first option, you can individually control how `var`, `let`, and `const` are handled. The following patterns are not considered warnings when the first option is `{var: "always", let: "never", const: "never"}`

```js
function foo() {
    var bar,
        baz;
    let qux;
    let norf;
}

function foo() {
    const bar;
    const baz;
    let qux;
    let norf;
}
```

## Compatibility

* **JSHint** - This rule maps to the `onevar` JSHint rule, but allows `let` and `const` to be configured separately.

## Further Reading

[JSLint Errors - Combine this with the previous 'var' statement](http://jslinterrors.com/combine-this-with-the-previous-var-statement/)
