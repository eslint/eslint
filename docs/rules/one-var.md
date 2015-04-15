# Require or Disallow One Variable Declaration per Scope (one-var)

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

This rule is aimed at enforcing the use of either one variable declaration or multiple declarations per function. As such, it will warn when it encounters an unexpected number of variable declarations.

### Options

There is one option for this rule, and that is specified as `"always"` (the default) to enforce one variable declaration per function, `"never"` to enforce multiple variable declarations per function, or `"var-only"` to not apply this rule to `let` and `const` declarations. You can configure the rule as follows:

```json
{
    "one-var": [2, "always"]
}
```

When configured with `"always"` as the first option (the default), the following patterns are considered warnings:

The following patterns are considered warnings:

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
```

The following patterns are not considered warnings:

```js
function foo() {
    var bar,
        baz;
}

function foo() {
    var bar,
        qux;

    if (baz) {
        qux = true;
    }
}
```

When configured with `"never"` as the first option, the following patterns are considered warnings:

```js
function foo() {
    var bar,
        baz;
}

function foo() {
    var bar,
        qux;

    if (baz) {
        qux = true;
    }
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
```

When configured with `"var-only"` as the first option, the following patterns are considered warnings:

The following patterns are considered warnings:

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
```

The following patterns are not considered warnings:

```js
function foo() {
    var bar,
        baz;
}

function foo() {
    var bar,
        qux;

    if (baz) {
        qux = true;
    }
}

function foo() {
    const baz = true;
    let bar;

    if (baz) {
        bar = true;
    }
}
```

## Compatibility

* **JSHint** - This rule maps to the `onevar` JSHint rule, but adds support for `let` and `const` with the `var-only` option.

## Further Reading

[JSLint Errors - Combine this with the previous 'var' statement](http://jslinterrors.com/combine-this-with-the-previous-var-statement/)
