# Declarations in Program or Function Body (no-inner-declarations)

In JavaScript, prior to ES6, a function declaration is only allowed in the first level of a program or the body of another function, though parsers sometimes [erroneously accept them elsewhere](https://code.google.com/p/esprima/issues/detail?id=422). This only applies to function declarations; named or anonymous function expressions can occur anywhere an expression is permitted.

```js
// Good
function doSomething() { }

// Bad
if (test) {
    function doSomethingElse () { }
}

function anotherThing() {
    var fn;

    if (test) {

        // Good
        fn = function expression() { };

        // Bad
        function declaration() { }
    }
}
```

A variable declaration is permitted anywhere a statement can go, even nested deeply inside other blocks. This is often undesirable due to variable hoisting, and moving declarations to the root of the program or function body can increase clarity. Note that [block bindings](https://leanpub.com/understandinges6/read#leanpub-auto-block-bindings) (`let`, `const`) are not hoisted and therefore they are not affected by this rule.

```js
/*eslint-env es6*/

// Good
var foo = 42;

// Good
if (foo) {
    let bar1;
}

// Bad
while (test) {
    var bar2;
}

function doSomething() {
    // Good
    var baz = true;

    // Bad
    if (baz) {
        var quux;
    }
}
```

## Rule Details

This rule requires that function declarations and, optionally, variable declarations be in the root of a program or the body of a function.

### Options

This rule takes a single option to specify whether it should check just function declarations or both function and variable declarations. The default is `"functions"`. Setting it to `"both"` will apply the same rules to both types of declarations.

You can set the option in configuration like this:

```json
"no-inner-declarations": [2, "both"]
```

The following patterns are considered problems:

```js
/*eslint no-inner-declarations: 2*/

if (test) {
    function doSomething() { }        /*error Move function declaration to program root.*/
}

function doSomethingElse() {
    if (test) {
        function doAnotherThing() { } /*error Move function declaration to function body root.*/
    }
}
```

With "both" option to check variable declarations, the following are considered problems:

```js
/*eslint no-inner-declarations: [2, "both"]*/

if (test) {
    var foo = 42;            /*error Move variable declaration to program root.*/
}

function doAnotherThing() {
    if (test) {
        var bar = 81;        /*error Move variable declaration to function body root.*/
    }
}
```

The following patterns are considered valid:

```js
/*eslint no-inner-declarations: 2*/
/*eslint-env es6*/

function doSomething() { }

function doSomethingElse() {
    function doAnotherThing() { }
}

if (test) {
    asyncCall(id, function (err, data) { });
}

var fn;
if (test) {
    fn = function fnExpression() { };
}

var bar = 42;

if (test) {
    let baz = 43;
}

function doAnotherThing() {
    var baz = 81;
}
```

## When Not To Use It

The function declaration portion rule will be rendered obsolete when [block-scoped functions](https://bugzilla.mozilla.org/show_bug.cgi?id=585536) land in ES6, but until then, it should be left on to enforce valid constructions. Disable checking variable declarations when using [block-scoped-var](block-scoped-var.md) or if declaring variables in nested blocks is acceptable despite hoisting.
