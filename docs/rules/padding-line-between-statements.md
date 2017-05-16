# Require or disallow padding lines between statements (padding-line-between-statements)

The addition of blank padding lines can help to make code more readable by adding vertical space to visually separate out logical blocks of code.

## Rule Details

This rule aims at improving code readability by either requiring or disallowing vertical space between different kinds of statements. For example, the following configuration requires at least one blank line between a `var` declaration and a `return` statement but disallows blank lines between pairs of `var` declarations.

```js
/*eslint padding-line-between-statements: [
    "error",
    { blankLine: "always", prev: "var", next: "return" },
    { blankLine: "never", prev: "var", next: "var" }
]*/

function foo() {
    var a = 1;
    var b = 2

    return a + b;
}
```

A "blank line" in this context is a line that may contain white space but does not contain any code or comments.

A single statement on its own within a block will be ignored by this rule (as it cannot form a "pair" with any previous statement) e.g. no blank line is required before the `return a + b` statement in the below code.

```js
/*eslint padding-line-between-statements: [
    "error",
    { blankLine: "always", prev: "*", next: "return" },
]*/

function foo() {
    return a + b;
}
```

## Options

This rule requires a set of configuration objects in order to work. Each configuration object specifies a pair of statement types to match and whether or not vertical space is required between those types. A wildcard `*` will match any type.

```js
{
    "padding-line-between-statements": [
        "error",
        { "blankLine": "always", "prev": "*", "next": "return", "includeComments": true },
        { "blankLine": "always", "prev": ["const", "let", "var"], "next": "*"},
        { "blankLine": "any", "prev": ["const", "let", "var"], "next": ["const", "let", "var"] }
        ...
    ]
}
```

You can supply any number of configuration objects. If a pair of consecutive statements matches multiple configuration objects, the last match will be used.

### `blankLine`

`blankLine` is a required string value that defines whether vertical space is required or disallowed. It can be one of the following:

- `"any"` ignores the statement pair.
- `"never"` disallows blank lines between `prev` and `next` statement pairs.
- `"always"` requires one or more blank lines.

### `prev`, `next`

`prev` and `next` are required string or array values that define the statement pair to match. They can consist of one or more of the following:

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
- `"multiline-block-like"` is the same as `block-like` but only matches statements of more than one line.
- `"return"` is `return` statements.
- `"switch"` is `switch` statements.
- `"throw"` is `throw` statements.
- `"try"` is `try` statements.
- `"var"` is `var` variable declarations.
- `"while"` is `while` loop statements.
- `"with"` is `with` statements.

### `includeComments`

`includeComments` is an optional boolean value that defines whether to count comment lines between statements as vertical space, the same as blank lines. If unspecified, its value is `false`:

- `false` - (default) don't count comment lines as vertical space
- `true` - count comment lines as vertical space

```js
/*eslint padding-line-between-statements: [
    "error",
    { blankLine: "always", prev: "*", next: "return", includeComments: true }
]*/

function foo() {
    bar();
    // this comment counts as vertical space before the 'return' statement
    return;
}
```

## Examples

### Require blank lines before all `return` statements

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

### Require blank lines after every sequence of variable declarations

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

### Require blank lines after all directive prologues

This configuration would require blank lines after all directive prologues (e.g. `"use-strict"`), like the [lines-around-directive] rule.

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

### Prevent vertical space between `var` declarations

Require that groups of consecutive `var` declarations cannot contain vertical space, including comments.

Examples of **incorrect** code for the `[{ blankLine: "never", prev: "var", next: "var", includeComments: true }]` configuration:

```js
/*eslint padding-line-between-statements: [
    "error",
    { blankLine: "never", prev: "var", next: "var", includeComments: true }
]*/

function foo() {
    var a = 42;

    var b = 43;
}

function foo() {
    var a = 42;
    // comments between var declarations are not allowed
    var b = 43;
}
```

Examples of **correct** code for the `[{ blankLine: "never", prev: "var", next: "var", includeComments: true }]` configuration:

```js
/*eslint padding-line-between-statements: [
    "error",
    { blankLine: "never", prev: "var", next: "var", includeComments: true }
]*/

foo() {
    var a = 42;
    var b = 43;
}
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

If you don't want to notify warnings about vertical space, then it's safe to disable this rule.

[lines-around-directive]: http://eslint.org/docs/rules/lines-around-directive
[newline-after-var]: http://eslint.org/docs/rules/newline-after-var
[newline-before-return]: http://eslint.org/docs/rules/newline-before-return
[requirePaddingNewLineAfterVariableDeclaration]: http://jscs.info/rule/requirePaddingNewLineAfterVariableDeclaration
[requirePaddingNewLinesAfterBlocks]: http://jscs.info/rule/requirePaddingNewLinesAfterBlocks
[disallowPaddingNewLinesAfterBlocks]: http://jscs.info/rule/disallowPaddingNewLinesAfterBlocks
[requirePaddingNewLinesAfterUseStrict]: http://jscs.info/rule/requirePaddingNewLinesAfterUseStrict
[disallowPaddingNewLinesAfterUseStrict]: http://jscs.info/rule/disallowPaddingNewLinesAfterUseStrict
[requirePaddingNewLinesBeforeExport]: http://jscs.info/rule/requirePaddingNewLinesBeforeExport
[disallowPaddingNewLinesBeforeExport]: http://jscs.info/rule/disallowPaddingNewLinesBeforeExport
[requirePaddingNewlinesBeforeKeywords]: http://jscs.info/rule/requirePaddingNewlinesBeforeKeywords
[disallowPaddingNewlinesBeforeKeywords]: http://jscs.info/rule/disallowPaddingNewlinesBeforeKeywords
