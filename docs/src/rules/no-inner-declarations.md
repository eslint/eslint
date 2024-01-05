---
title: no-inner-declarations
rule_type: problem
---



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

In ES6, [block-level functions](https://leanpub.com/understandinges6/read#leanpub-auto-block-level-functions) (functions declared inside a block) are limited to the scope of the block they are declared in and out of the block scope they can't be accessed and called but only when the code is in strict mode (code with `"use strict"` tag or ESM modules). In non-strict mode they can be accessed and called out of the block scope.

```js
"use strict"

if (test) {
    function doSomething () { }

    doSomething(); // no error
}

doSomething(); // error
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

This rule requires that function declarations and, optionally, variable declarations be in the root of a program, or in the root of the body of a function, or in the root of the body of a class static block.

## Options

This rule has a string and an object option:

* `"functions"` (default) disallows `function` declarations in nested blocks
* `"both"` disallows `function` and `var` declarations in nested blocks
* `{ blockScopedFunctions: "allow" }` (default) this option allows only `function` declarations in nested blocks when code is in strict mode (code with `"use strict"` tag or ESM modules) and `ecmaVersion` is set to `6` (or `2015` or above). This option can be disabled by setting it to `disallow`.

### functions

Examples of **incorrect** code for this rule with the default `"functions"` option:

::: incorrect { "sourceType": "script" }

```js
/*eslint no-inner-declarations: ["error", { blockScopedFunctions: "disallow" }]*/

if (test) {
    function doSomething() { }
}

function doSomethingElse() {
    if (test) {
        function doAnotherThing() { }
    }
}

function doSomethingElse() {
    if (test) {
        function doAnotherThing() { }
    }
}

if (foo) function f(){}

class C {
    static {
        if (test) {
            function doSomething() { }
        }
    }
}
```

:::

Examples of **correct** code for this rule with the default `"functions"` option:

::: correct { "sourceType": "script" }

```js
/*eslint no-inner-declarations: "error"*/

function doSomething() { }

function doSomethingElse() {
    function doAnotherThing() { }
}

function doSomethingElse() {
    "use strict";
    
    if (test) {
        function doAnotherThing() { }
    }
}

class C {
    static {
        function doSomething() { }
    }
}

if (test) {
    asyncCall(id, function (err, data) { });
}

var fn;
if (test) {
    fn = function fnExpression() { };
}

if (foo) var a;
```

:::

### both

Examples of **incorrect** code for this rule with the `"both"` option:

::: incorrect { "sourceType": "script" }

```js
/*eslint no-inner-declarations: ["error", "both"]*/

if (test) {
    var foo = 42;
}

function doAnotherThing() {
    if (test) {
        var bar = 81;
    }
}

if (foo) var a;

if (foo) function f(){}

class C {
    static {
        if (test) {
            var something;
        }
    }
}
```

:::

Examples of **correct** code for this rule with the `"both"` option:

::: correct { "sourceType": "script" }

```js
/*eslint no-inner-declarations: ["error", "both"]*/

var bar = 42;

if (test) {
    let baz = 43;
}

function doAnotherThing() {
    var baz = 81;
}

class C {
    static {
        var something;
    }
}
```

### blockScopedFunctions

:::

Example of **correct** code for this rule with `{ blockScopedFunctions: "allow" }` option with `ecmaVersion: 6`:

::: correct { "sourceType": "script" }

```js
/*eslint no-inner-declarations: ["error", { blockScopedFunctions: "allow" }]*/
/*eslint-env es6*/

"use strict";

if (test) {
    function doSomething() { }
}

function doSomething() {
    if (test) {
        function doSomethingElse() { }
    }
}

// OR

function foo() {
    "use strict";

    if (test) {
        function bar() { }
    }
}
```

:::

`ESM modules` and both `class` declarations and expressions are always in strict mode.

::: correct { "sourceType": "module" }

```js
/*eslint no-inner-declarations: ["error", { blockScopedFunctions: "allow" }]*/
/*eslint-env es6*/

if (test) {
    function doSomething() { }
}

function doSomethingElse() {
    if (test) {
        function doAnotherThing() { }
    }
}

class Some {
    static {
        if (test) {
            function doSomething() { }
        }
    }
}

const C = class {
    static {
        if (test) {
            function doSomething() { }
        }
    }
}
```

:::

## When Not To Use It

The function declaration portion rule will be rendered obsolete when [block-scoped functions](https://bugzilla.mozilla.org/show_bug.cgi?id=585536) land in ES6, but until then, it should be left on to enforce valid constructions. Disable checking variable declarations when using [block-scoped-var](block-scoped-var) or if declaring variables in nested blocks is acceptable despite hoisting.
