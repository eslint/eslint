---
title: padding-line-between-statements
rule_type: layout
---



This rule requires or disallows blank lines between the given 2 kinds of statements.
Properly blank lines help developers to understand the code.

For example, the following configuration requires a blank line between a variable declaration and a `return` statement.

```js
/*eslint padding-line-between-statements: [
    "error",
    { blankLine: "always", prev: "var", next: "return" }
]*/

function foo() {
    var a = 1;

    return a;
}
```

## Rule Details

This rule does nothing if no configurations are provided.

A configuration is an object which has 3 properties; `blankLine`, `prev` and `next`. For example, `{ blankLine: "always", prev: "var", next: "return" }` means "one or more blank lines are required between a variable declaration and a `return` statement."
You can supply any number of configurations. If a statement pair matches multiple configurations, the last matched configuration will be used.

```json
{
    "padding-line-between-statements": [
        "error",
        { "blankLine": LINEBREAK_TYPE, "prev": STATEMENT_TYPE, "next": STATEMENT_TYPE },
        { "blankLine": LINEBREAK_TYPE, "prev": STATEMENT_TYPE, "next": STATEMENT_TYPE },
        { "blankLine": LINEBREAK_TYPE, "prev": STATEMENT_TYPE, "next": STATEMENT_TYPE },
        { "blankLine": LINEBREAK_TYPE, "prev": STATEMENT_TYPE, "next": STATEMENT_TYPE },
        ...
    ]
}
```

* `LINEBREAK_TYPE` is one of the following.
    * `"any"` just ignores the statement pair.
    * `"never"` disallows blank lines.
    * `"always"` requires one or more blank lines. Note it does not count lines that comments exist as blank lines.

* `STATEMENT_TYPE` is one of the following, or an array of the following.
    * `"*"` is wildcard. This matches any statements.
    * `"block"` is lonely blocks.
    * `"block-like"` is block like statements. This matches statements that the last token is the closing brace of blocks; e.g. `{ }`, `if (a) { }`, and `while (a) { }`. Also matches immediately invoked function expression statements.
    * `"break"` is `break` statements.
    * `"case"` is `case` clauses in `switch` statements.
    * `"cjs-export"` is `export` statements of CommonJS; e.g. `module.exports = 0`, `module.exports.foo = 1`, and `exports.foo = 2`. This is a special case of assignment.
    * `"cjs-import"` is `import` statements of CommonJS; e.g. `const foo = require("foo")`. This is a special case of variable declarations.
    * `"class"` is `class` declarations.
    * `"const"` is `const` variable declarations, both single-line and multiline.
    * `"continue"` is `continue` statements.
    * `"debugger"` is `debugger` statements.
    * `"default"` is `default` clauses in `switch` statements.
    * `"directive"` is directive prologues. This matches directives; e.g. `"use strict"`.
    * `"do"` is `do-while` statements. This matches all statements that the first token is `do` keyword.
    * `"empty"` is empty statements.
    * `"export"` is `export` declarations.
    * `"expression"` is expression statements.
    * `"for"` is `for` loop families. This matches all statements that the first token is `for` keyword.
    * `"function"` is function declarations.
    * `"if"` is `if` statements.
    * `"iife"` is immediately invoked function expression statements. This matches calls on a function expression, optionally prefixed with a unary operator.
    * `"import"` is `import` declarations.
    * `"let"` is `let` variable declarations, both single-line and multiline.
    * `"multiline-block-like"` is block like statements. This is the same as `block-like` type, but only if the block is multiline.
    * `"multiline-const"` is multiline `const` variable declarations.
    * `"multiline-expression"` is expression statements. This is the same as `expression` type, but only if the statement is multiline.
    * `"multiline-let"` is multiline `let` variable declarations.
    * `"multiline-var"` is multiline `var` variable declarations.
    * `"return"` is `return` statements.
    * `"singleline-const"` is single-line `const` variable declarations.
    * `"singleline-let"` is single-line `let` variable declarations.
    * `"singleline-var"` is single-line `var` variable declarations.
    * `"switch"` is `switch` statements.
    * `"throw"` is `throw` statements.
    * `"try"` is `try` statements.
    * `"var"` is `var` variable declarations, both single-line and multiline.
    * `"while"` is `while` loop statements.
    * `"with"` is `with` statements.

## Examples

This configuration would require blank lines before all `return` statements, like the [newline-before-return](newline-before-return) rule.

Examples of **incorrect** code for the `[{ blankLine: "always", prev: "*", next: "return" }]` configuration:

::: incorrect

```js
/*eslint padding-line-between-statements: [
    "error",
    { blankLine: "always", prev: "*", next: "return" }
]*/

function foo() {
    bar();
    return;
}
```

:::

Examples of **correct** code for the `[{ blankLine: "always", prev: "*", next: "return" }]` configuration:

::: correct

```js
/*eslint padding-line-between-statements: [
    "error",
    { blankLine: "always", prev: "*", next: "return" }
]*/

function foo1() {
    bar();

    return;
}

function foo2() {
    return;
}
```

:::

----

This configuration would require blank lines after every sequence of variable declarations, like the [newline-after-var](newline-after-var) rule.

Examples of **incorrect** code for the `[{ blankLine: "always", prev: ["const", "let", "var"], next: "*"}, { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"]}]` configuration:

::: incorrect

```js
/*eslint padding-line-between-statements: [
    "error",
    { blankLine: "always", prev: ["const", "let", "var"], next: "*"},
    { blankLine: "any",    prev: ["const", "let", "var"], next: ["const", "let", "var"]}
]*/

function foo1() {
    var a = 0;
    bar();
}

function foo2() {
    let a = 0;
    bar();
}

function foo3() {
    const a = 0;
    bar();
}

class C {
    static {
        let a = 0;
        bar();
    }
}
```

:::

Examples of **correct** code for the `[{ blankLine: "always", prev: ["const", "let", "var"], next: "*"}, { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"]}]` configuration:

::: correct

```js
/*eslint padding-line-between-statements: [
    "error",
    { blankLine: "always", prev: ["const", "let", "var"], next: "*"},
    { blankLine: "any",    prev: ["const", "let", "var"], next: ["const", "let", "var"]}
]*/

function foo1() {
    var a = 0;
    var b = 0;

    bar();
}

function foo2() {
    let a = 0;
    const b = 0;

    bar();
}

function foo3() {
    const a = 0;
    const b = 0;

    bar();
}

class C {
    static {
        let a = 0;
        let b = 0;

        bar();
    }
}
```

:::

----

This configuration would require blank lines after all directive prologues, like the [lines-around-directive](lines-around-directive) rule.

Examples of **incorrect** code for the `[{ blankLine: "always", prev: "directive", next: "*" }, { blankLine: "any", prev: "directive", next: "directive" }]` configuration:

::: incorrect

```js
/*eslint padding-line-between-statements: [
    "error",
    { blankLine: "always", prev: "directive", next: "*" },
    { blankLine: "any",    prev: "directive", next: "directive" }
]*/

"use strict";
foo();
```

:::

Examples of **correct** code for the `[{ blankLine: "always", prev: "directive", next: "*" }, { blankLine: "any", prev: "directive", next: "directive" }]` configuration:

::: correct

```js
/*eslint padding-line-between-statements: [
    "error",
    { blankLine: "always", prev: "directive", next: "*" },
    { blankLine: "any",    prev: "directive", next: "directive" }
]*/

"use strict";
"use asm";

foo();
```

:::

----

This configuration would require blank lines between clauses in `switch` statements.

Examples of **incorrect** code for the `[{ blankLine: "always", prev: ["case", "default"], next: "*" }]` configuration:

::: incorrect

```js
/*eslint padding-line-between-statements: [
    "error",
    { blankLine: "always", prev: ["case", "default"], next: "*" }
]*/

switch (foo) {
    case 1:
        bar();
        break;
    case 2:
    case 3:
        baz();
        break;
    default:
        quux();
}
```

:::

Examples of **correct** code for the `[{ blankLine: "always", prev: ["case", "default"], next: "*" }]` configuration:

::: correct

```js
/*eslint padding-line-between-statements: [
    "error",
    { blankLine: "always", prev: ["case", "default"], next: "*" }
]*/

switch (foo) {
    case 1:
        bar();
        break;

    case 2:

    case 3:
        baz();
        break;

    default:
        quux();
}
```

:::

## When Not To Use It

If you don't want to notify warnings about linebreaks, then it's safe to disable this rule.

## Compatibility

* **JSCS:** [requirePaddingNewLineAfterVariableDeclaration](https://jscs-dev.github.io/rule/requirePaddingNewLineAfterVariableDeclaration)
* **JSCS:** [requirePaddingNewLinesAfterBlocks](https://jscs-dev.github.io/rule/requirePaddingNewLinesAfterBlocks)
* **JSCS:** [disallowPaddingNewLinesAfterBlocks](https://jscs-dev.github.io/rule/disallowPaddingNewLinesAfterBlocks)
* **JSCS:** [requirePaddingNewLinesAfterUseStrict](https://jscs-dev.github.io/rule/requirePaddingNewLinesAfterUseStrict)
* **JSCS:** [disallowPaddingNewLinesAfterUseStrict](https://jscs-dev.github.io/rule/disallowPaddingNewLinesAfterUseStrict)
* **JSCS:** [requirePaddingNewLinesBeforeExport](https://jscs-dev.github.io/rule/requirePaddingNewLinesBeforeExport)
* **JSCS:** [disallowPaddingNewLinesBeforeExport](https://jscs-dev.github.io/rule/disallowPaddingNewLinesBeforeExport)
* **JSCS:** [requirePaddingNewlinesBeforeKeywords](https://jscs-dev.github.io/rule/requirePaddingNewlinesBeforeKeywords)
* **JSCS:** [disallowPaddingNewlinesBeforeKeywords](https://jscs-dev.github.io/rule/disallowPaddingNewlinesBeforeKeywords)
