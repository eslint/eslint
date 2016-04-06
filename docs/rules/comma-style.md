# Comma style (comma-style)

Comma Style rule enforces comma styles for a list of things separated by commas. There are two comma styles primarily in JavaScript. The standard one in which commas are placed at the end of the line. And Comma-First, in which, commas are placed at the start of the next line after the list item.

One of the justifications for using Comma-First is that it helps tracking missing and trailing commas.
In case linting is turned off, missing commas in variable declarations lead to leakage of global variables and trailing commas lead to errors in older versions of IE.


## Rule Details

This rule enforce consistent comma style in array literals, object literals, and variable declarations.

This rule does not apply in either of the following cases:

* comma preceded and followed by linebreak (lone comma)
* single-line array literals, object literals, and variable declarations

## Options

This rule has a string option:

* `"last"` (default) requires a comma after and in the same line as an array element, object property, or variable declaration
* `"first"` requires a comma before and in the same line as an array element, object property, or variable declaration

This rule can have an object option:

* `"exceptions"` has properties whose names correspond to node types in the abstract syntax tree (AST) of JavaScript code:

    * `"ArrayExpression": true` ignores comma style in array literals
    * `"ObjectExpression": true` ignores comma style in object literals
    * `"VariableDeclaration": true` ignores comma style in variable declarations

A way to determine the node types as defined by [ESTree](https://github.com/estree/estree) is to use the [online demo](http://eslint.org/parser).

### last

Examples of **incorrect** code for this rule with the default `"last"` option:

```js
/*eslint comma-style: ["error", "last"]*/

var foo = 1
,
bar = 2;

var foo = 1
  , bar = 2;

var foo = ["apples"
           , "oranges"];

function bar() {
    return {
        "a": 1
        ,"b:": 2
    };
}
```

Examples of **correct** code for this rule with the default `"last"` option:

```js
/*eslint comma-style: ["error", "last"]*/

var foo = 1, bar = 2;

var foo = 1,
    bar = 2;

var foo = ["apples",
           "oranges"];

function bar() {
    return {
        "a": 1,
        "b:": 2
    };
}
```

### first

Examples of **incorrect** code for this rule with the `"first"` option:

```js
/*eslint comma-style: ["error", "first"]*/

var foo = 1,
    bar = 2;

var foo = ["apples",
           "oranges"];

function bar() {
    return {
        "a": 1,
        "b:": 2
    };
}
```

Examples of **correct** code for this rule with the `"first"` option:

```js
/*eslint comma-style: ["error", "first"]*/

var foo = 1, bar = 2;

var foo = 1
    ,bar = 2;

var foo = ["apples"
          ,"oranges"];

function bar() {
    return {
        "a": 1
        ,"b:": 2
    };
}
```

### exceptions

An example use case is to enforce comma style *only* in var statements.

Examples of **incorrect** code for this rule with sample `"first", { "exceptions": { … } }` options:

```js
/*eslint comma-style: ["error", "first", { "exceptions": { "ArrayExpression": true, "ObjectExpression": true } }]*/

var o = {},
    a = [];
```

Examples of **correct** code for this rule with sample `"first", { "exceptions": { … } }` options:

```js
/*eslint comma-style: ["error", "first", { "exceptions": { "ArrayExpression": true, "ObjectExpression": true } }]*/

var o = {fst:1,
         snd: [1,
               2]}
  , a = [];
```

## When Not To Use It

If your project will not be using one true comma style, turn this rule off.


## Further Reading

For the first option in comma-style rule:

* [A better coding convention for lists and object literals in JavaScript by isaacs](https://gist.github.com/isaacs/357981)
* [npm coding style guideline](https://docs.npmjs.com/misc/coding-style)


## Related Rules

* [operator-linebreak](operator-linebreak.md)
