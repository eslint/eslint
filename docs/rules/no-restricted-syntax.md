# disallow specified syntax (no-restricted-syntax)

JavaScript has a lot of language features, and not everyone likes all of them. As a result, some projects choose to disallow the use of certain language features altogether. For instance, you might decide to disallow the use of `try-catch` or `class`, or you might decide to disallow the use of the `in` operator.

Rather than creating separate rules for every language feature you want to turn off, this rule allows you to configure the syntax elements you want to restrict use of. These elements are represented by their [ESTree](https://github.com/estree/estree) node types. For example, a function declaration is represented by `FunctionDeclaration` and the `with` statement is represented by `WithStatement`. You may find the full list of AST node names you can use [on GitHub](https://github.com/eslint/espree/blob/master/lib/ast-node-types.js) and use the [online parser](https://eslint.org/parser/) to see what type of nodes your code consists of.

You can also specify [AST selectors](../developer-guide/selectors) to restrict, allowing much more precise control over syntax patterns.

## Rule Details

This rule disallows specified (that is, user-defined) syntax.

## Options

This rule takes a list of strings, where each string is an AST selector:

```json
{
    "rules": {
        "no-restricted-syntax": ["error", "FunctionExpression", "WithStatement", "BinaryExpression[operator='in']"]
    }
}
```

Alternatively, the rule also accepts objects, where the selector and an optional custom message are specified:

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
            }
        ]
    }
}
```

If a custom message is specified with the `message` property, ESLint will use that message when reporting occurrences of the syntax specified in the `selector` property.

The string and object formats can be freely mixed in the configuration as needed.

Examples of **incorrect** code for this rule with the `"FunctionExpression", "WithStatement", BinaryExpression[operator='in']` options:

```js
/* eslint no-restricted-syntax: ["error", "FunctionExpression", "WithStatement", "BinaryExpression[operator='in']"] */

with (me) {
    dontMess();
}

var doSomething = function () {};

foo in bar;
```

Examples of **correct** code for this rule with the `"FunctionExpression", "WithStatement", BinaryExpression[operator='in']` options:

```js
/* eslint no-restricted-syntax: ["error", "FunctionExpression", "WithStatement", "BinaryExpression[operator='in']"] */

me.dontMess();

function doSomething() {};

foo instanceof bar;
```

## When Not To Use It

If you don't want to restrict your code from using any JavaScript features or syntax, you should not use this rule.

## Related Rules

* [no-alert](no-alert.md)
* [no-console](no-console.md)
* [no-debugger](no-debugger.md)
* [no-restricted-properties](no-restricted-properties.md)
