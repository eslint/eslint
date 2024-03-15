---
title: no-restricted-syntax
rule_type: suggestion
related_rules:
- no-alert
- no-console
- no-debugger
- no-restricted-properties
---


JavaScript has a lot of language features, and not everyone likes all of them. As a result, some projects choose to disallow the use of certain language features altogether. For instance, you might decide to disallow the use of `try-catch` or `class`, or you might decide to disallow the use of the `in` operator.

Rather than creating separate rules for every language feature you want to turn off, this rule allows you to configure the syntax elements you want to restrict use of. These elements are represented by their [ESTree](https://github.com/estree/estree) node types. For example, a function declaration is represented by `FunctionDeclaration` and the `with` statement is represented by `WithStatement`. You may find the full list of AST node names you can use [on GitHub](https://github.com/eslint/eslint-visitor-keys/blob/main/lib/visitor-keys.js) and use [AST Explorer](https://astexplorer.net/) with the espree parser to see what type of nodes your code consists of.

You can also specify [AST selectors](../extend/selectors) to restrict, allowing much more precise control over syntax patterns. Additionally, replacements can be defined to autofix matched occurrences.

## Rule Details

This rule disallows specified (that is, user-defined) syntax and optionally fixes said syntax via specified replacements.

## Options

This rule takes a list of strings, where each string is an AST selector:

```json
{
    "rules": {
        "no-restricted-syntax": ["error", "FunctionExpression", "WithStatement", "BinaryExpression[operator='in']"]
    }
}
```

Alternatively, the rule also accepts objects, where the selector, an optional custom message and an optional replacement can be specified:

```json
{
    "rules": {
        "no-restricted-syntax": [
            "error",
            {
                "selector": "FunctionExpression",
                "message": "Function expressions are not allowed."
            },
            {
                "selector": "CallExpression[callee.name='setTimeout'][arguments.length!=2]",
                "message": "setTimeout must always be invoked with two arguments."
            },
            {
                "selector": "UnaryExpression[operator='!'][argument.operator='!']",
                "message": "double bangs are not allowed. Use Boolean.",
                "replace": {
                    "pattern": "/!!(.*)/",
                    "replacement": "Boolean($1)"
                }
            },
        ]
    }
}
```

If a custom message is specified with the `message` property, ESLint will use that message when reporting occurrences of the syntax specified in the `selector` property.

The string and object formats can be freely mixed in the configuration as needed.

If a custom replacement is specified with the `replace` property, ESLint will try to fix the reported occurrence by replacing the matched node text according to the specified `pattern` and `replacement`.

The `pattern` property accepts the same syntax as the [esquery attribute](https://github.com/estools/esquery) value/regex used in AST selectors. Replacing is then delegated to [String.prototype.replace](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace) where the `replacement` parameter works the same.

To replace the whole occurrence with a static string, `replace` also accepts just a string instead of an object.

Examples of **incorrect** code for this rule with the `"FunctionExpression", "WithStatement", BinaryExpression[operator='in']` options:

::: incorrect { "sourceType": "script" }

```js
/* eslint no-restricted-syntax: ["error", "FunctionExpression", "WithStatement", "BinaryExpression[operator='in']"] */

with (me) {
    dontMess();
}

var doSomething = function () {};

foo in bar;
```

:::

Examples of **correct** code for this rule with the `"FunctionExpression", "WithStatement", BinaryExpression[operator='in']` options:

::: correct { "sourceType": "script" }

```js
/* eslint no-restricted-syntax: ["error", "FunctionExpression", "WithStatement", "BinaryExpression[operator='in']"] */

me.dontMess();

function doSomething() {};

foo instanceof bar;
```

:::

## When Not To Use It

If you don't want to restrict your code from using any JavaScript features or syntax, you should not use this rule.
