# Require or disallow padding lines between statements (padding-line-between-statements)

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

This rule does nothing if no configuration.

A configuration is an object which has 3 properties; `blankLine`, `prev` and `next`. For example, `{ blankLine: "always", prev: "var", next: "return" }` means "it requires one or more blank lines between a variable declaration and a `return` statement."
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

- `LINEBREAK_TYPE` is one of the following.
    - `"any"` just ignores the statement pair.
    - `"never"` disallows blank lines.
    - `"always"` requires one or more blank lines. Note it does not count lines that comments exist as blank lines.

- `STATEMENT_TYPE` is one of the following, or an array of the following.
    - `"*"` is wildcard. This matches any statements.
    - `"block"` is lonely blocks.
    - `"block-like"` is block like statements. This matches statements that the last token is the closing brace of blocks; e.g. `{ }`, `if (a) { }`, and `while (a) { }`.
    - `"break"` is `break` statements.
    - `"case"` is `case` labels.
    - `"cjs-export"` is `export` statements of CommonJS; e.g. `module.exports = 0`, `module.exports.foo = 1`, and `exports.foo = 2`. This is the special cases of assignment.
    - `"cjs-import"` is `import` statements of CommonJS; e.g. `const foo = require("foo")`. This is the special cases of variable declarations.
    - `"class"` is `class` declarations.
    - `"const"` is `const` variable declarations.
    - `"continue"` is `continue` statements.
    - `"debugger"` is `debugger` statements.
    - `"default"` is `default` labels.
    - `"directive"` is directive prologues. This matches directives; e.g. `"use strict"`.
    - `"do"` is `do-while` statements. This matches all statements that the first token is `do` keyword.
    - `"empty"` is empty statements.
    - `"export"` is `export` declarations.
    - `"expression"` is expression statements.
    - `"for"` is `for` loop families. This matches all statements that the first token is `for` keyword.
    - `"function"` is function declarations.
    - `"if"` is `if` statements.
    - `"import"` is `import` declarations.
    - `"let"` is `let` variable declarations.
    - `"multiline-block-like"` is block like statements. This is the same as `block-like` type, but only if the block is multiline.
    - `"multiline-expression"` is expression statements. This is the same as `expression` type, but only if the statement is multiline.
    - `"return"` is `return` statements.
    - `"switch"` is `switch` statements.
    - `"throw"` is `throw` statements.
    - `"try"` is `try` statements.
    - `"var"` is `var` variable declarations.
    - `"while"` is `while` loop statements.
    - `"with"` is `with` statements.

## Examples

This configuration would require blank lines before all `return` statements, like the [newline-before-return] rule.

Examples of **incorrect** code for the `[{ blankLine: "always", prev: "*", next: "return" }]` configuration:

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

Examples of **correct** code for the `[{ blankLine: "always", prev: "*", next: "return" }]` configuration:

```js
/*eslint padding-line-between-statements: [
    "error",
    { blankLine: "always", prev: "*", next: "return" }
]*/

function foo() {
    bar();

    return;
}

function foo() {
    return;
}
```

----

This configuration would require blank lines after every sequence of variable declarations, like the [newline-after-var] rule.

Examples of **incorrect** code for the `[{ blankLine: "always", prev: ["const", "let", "var"], next: "*"}, { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"]}]` configuration:

```js
/*eslint padding-line-between-statements: [
    "error",
    { blankLine: "always", prev: ["const", "let", "var"], next: "*"},
    { blankLine: "any",    prev: ["const", "let", "var"], next: ["const", "let", "var"]}
]*/

function foo() {
    var a = 0;
    bar();
}

function foo() {
    let a = 0;
    bar();
}

function foo() {
    const a = 0;
    bar();
}
```

Examples of **correct** code for the `[{ blankLine: "always", prev: ["const", "let", "var"], next: "*"}, { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"]}]` configuration:

```js
/*eslint padding-line-between-statements: [
    "error",
    { blankLine: "always", prev: ["const", "let", "var"], next: "*"},
    { blankLine: "any",    prev: ["const", "let", "var"], next: ["const", "let", "var"]}
]*/

function foo() {
    var a = 0;
    var b = 0;

    bar();
}

function foo() {
    let a = 0;
    const b = 0;

    bar();
}

function foo() {
    const a = 0;
    const b = 0;

    bar();
}
```

----

This configuration would require blank lines after all directive prologues, like the [lines-around-directive] rule.

Examples of **incorrect** code for the `[{ blankLine: "always", prev: "directive", next: "*" }, { blankLine: "any", prev: "directive", next: "directive" }]` configuration:

```js
/*eslint padding-line-between-statements: [
    "error",
    { blankLine: "always", prev: "directive", next: "*" },
    { blankLine: "any",    prev: "directive", next: "directive" }
]*/

"use strict";
foo();
```

Examples of **correct** code for the `[{ blankLine: "always", prev: "directive", next: "*" }, { blankLine: "any", prev: "directive", next: "directive" }]` configuration:

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

## Compatibility

- **JSCS:** [requirePaddingNewLineAfterVariableDeclaration]
- **JSCS:** [requirePaddingNewLinesAfterBlocks]
- **JSCS:** [disallowPaddingNewLinesAfterBlocks]
- **JSCS:** [requirePaddingNewLinesAfterUseStrict]
- **JSCS:** [disallowPaddingNewLinesAfterUseStrict]
- **JSCS:** [requirePaddingNewLinesBeforeExport]
- **JSCS:** [disallowPaddingNewLinesBeforeExport]
- **JSCS:** [requirePaddingNewlinesBeforeKeywords]
- **JSCS:** [disallowPaddingNewlinesBeforeKeywords]

## When Not To Use It

If you don't want to notify warnings about linebreaks, then it's safe to disable this rule.


[lines-around-directive]: https://eslint.org/docs/rules/lines-around-directive
[newline-after-var]: https://eslint.org/docs/rules/newline-after-var
[newline-before-return]: https://eslint.org/docs/rules/newline-before-return
[requirePaddingNewLineAfterVariableDeclaration]: http://jscs.info/rule/requirePaddingNewLineAfterVariableDeclaration
[requirePaddingNewLinesAfterBlocks]: http://jscs.info/rule/requirePaddingNewLinesAfterBlocks
[disallowPaddingNewLinesAfterBlocks]: http://jscs.info/rule/disallowPaddingNewLinesAfterBlocks
[requirePaddingNewLinesAfterUseStrict]: http://jscs.info/rule/requirePaddingNewLinesAfterUseStrict
[disallowPaddingNewLinesAfterUseStrict]: http://jscs.info/rule/disallowPaddingNewLinesAfterUseStrict
[requirePaddingNewLinesBeforeExport]: http://jscs.info/rule/requirePaddingNewLinesBeforeExport
[disallowPaddingNewLinesBeforeExport]: http://jscs.info/rule/disallowPaddingNewLinesBeforeExport
[requirePaddingNewlinesBeforeKeywords]: http://jscs.info/rule/requirePaddingNewlinesBeforeKeywords
[disallowPaddingNewlinesBeforeKeywords]: http://jscs.info/rule/disallowPaddingNewlinesBeforeKeywords
