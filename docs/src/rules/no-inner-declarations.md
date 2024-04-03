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

In ES6, [block-level functions](https://leanpub.com/understandinges6/read#leanpub-auto-block-level-functions) (functions declared inside a block) are limited to the scope of the block they are declared in and outside of the block scope they can't be accessed and called, but only when the code is in strict mode (code with `"use strict"` tag or ESM modules). In non-strict mode, they can be accessed and called outside of the block scope.

```js
"use strict";

if (test) {
    function doSomething () { }

    doSomething(); // no error
}

doSomething(); // error
```

A variable declaration is permitted anywhere a statement can go, even nested deeply inside other blocks. This is often undesirable due to variable hoisting, and moving declarations to the root of the program or function body can increase clarity. Note that [block bindings](https://leanpub.com/understandinges6/read#leanpub-auto-block-bindings) (`let`, `const`) are not hoisted and therefore they are not affected by this rule.

```js
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
* `{ blockScopedFunctions: "allow" }` (default) this option allows `function` declarations in nested blocks when code is in strict mode (code with `"use strict"` tag or ESM modules) and `languageOptions.ecmaVersion` is set to `2015` or above. This option can be disabled by setting it to `"disallow"`.

### functions

Examples of **incorrect** code for this rule with the default `"functions"` option:

::: incorrect { "sourceType": "script" }

```js
/*eslint no-inner-declarations: "error"*/

// script, non-strict code

if (test) {
    function doSomething() { }
}

function doSomethingElse() {
    if (test) {
        function doAnotherThing() { }
    }
}

if (foo) function f(){}
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

:::

### blockScopedFunctions

Example of **incorrect** code for this rule with `{ blockScopedFunctions: "disallow" }` option with `ecmaVersion: 2015`:

::: incorrect { "sourceType": "script", "ecmaVersion": 2015 }

```js
/*eslint no-inner-declarations: ["error", "functions", { blockScopedFunctions: "disallow" }]*/

// non-strict code

if (test) {
    function doSomething() { }
}

function doSomething() {
    if (test) {
        function doSomethingElse() { }
    }
}

// strict code

function foo() {
    "use strict";

    if (test) {
        function bar() { }
    }
}
```

:::

Example of **correct** code for this rule with `{ blockScopedFunctions: "disallow" }` option with `ecmaVersion: 2015`:

::: correct { "sourceType": "script", "ecmaVersion": 2015 }

```js
/*eslint no-inner-declarations: ["error", "functions", { blockScopedFunctions: "disallow" }]*/

function doSomething() { }

function doSomething() {
    function doSomethingElse() { }
}
```

:::

Example of **correct** code for this rule with `{ blockScopedFunctions: "allow" }` option with `ecmaVersion: 2015`:

::: correct { "sourceType": "script", "ecmaVersion": 2015 }

```js
/*eslint no-inner-declarations: ["error", "functions", { blockScopedFunctions: "allow" }]*/

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
/*eslint no-inner-declarations: ["error", "functions", { blockScopedFunctions: "allow" }]*/

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

By default, this rule disallows inner function declarations only in contexts where their behavior is unspecified and thus inconsistent (pre-ES6 environments) or legacy semantics apply (non-strict mode code). If your code targets pre-ES6 environments or is not in strict mode, you should enable this rule to prevent unexpected behavior.

In ES6+ environments, in strict mode code, the behavior of inner function declarations is well-defined and consistent - they are always block-scoped. If your code targets only ES6+ environments and is in strict mode (ES modules, or code with `"use strict"` directives) then there is no need to enable this rule unless you want to disallow inner functions as a stylistic choice, in which case you should enable this rule with the option `blockScopedFunctions: "disallow"`.

Disable checking variable declarations when using [block-scoped-var](block-scoped-var) or if declaring variables in nested blocks is acceptable despite hoisting.
