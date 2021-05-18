# Disallow Unnecessary Nested Blocks (no-lone-blocks)

In JavaScript, prior to ES6, standalone code blocks delimited by curly braces do not create a new scope and have no use. For example, these curly braces do nothing to `foo`:

```js
{
    var foo = bar();
}
```

In ES6, code blocks may create a new scope if a block-level binding (`let` and `const`), a class declaration or a function declaration (in strict mode) are present. A block is not considered redundant in these cases.

## Rule Details

This rule aims to eliminate unnecessary and potentially confusing blocks at the top level of a script or within other blocks.

Examples of **incorrect** code for this rule:

```js
/*eslint no-lone-blocks: "error"*/

{}

if (foo) {
    bar();
    {
        baz();
    }
}

function bar() {
    {
        baz();
    }
}

{
    function foo() {}
}

{
    aLabel: {
    }
}
```

Examples of **correct** code for this rule with ES6 environment:

```js
/*eslint no-lone-blocks: "error"*/
/*eslint-env es6*/

while (foo) {
    bar();
}

if (foo) {
    if (bar) {
        baz();
    }
}

function bar() {
    baz();
}

{
    let x = 1;
}

{
    const y = 1;
}

{
    class Foo {}
}

aLabel: {
}
```

Examples of **correct** code for this rule with ES6 environment and strict mode via `"parserOptions": { "sourceType": "module" }` in the ESLint configuration or `"use strict"` directive in the code:

```js
/*eslint no-lone-blocks: "error"*/
/*eslint-env es6*/

"use strict";

{
    function foo() {}
}
```
