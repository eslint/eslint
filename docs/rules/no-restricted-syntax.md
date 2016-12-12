# disallow specified syntax (no-restricted-syntax)

JavaScript has a lot of language features, and not everyone likes all of them. As a result, some projects choose to disallow the use of certain language features altogether. For instance, you might decide to disallow the use of `try-catch` or `class`.

Rather than creating separate rules for every language feature you want to turn off, this rule allows you to configure the syntax elements you want to restrict use of. These elements are represented by their [ESTree](https://github.com/estree/estree) node types. For example, a function declaration is represented by `FunctionDeclaration` and the `with` statement is represented by `WithStatement`. You may find the full list of AST node names you can use [on GitHub](https://github.com/eslint/espree/blob/master/lib/ast-node-types.js) and use the [online parser](http://eslint.org/parser/) to see what type of nodes your code consists of.

## Rule Details

This rule disallows specified (that is, user-defined) syntax.

## Options

This rule takes a list of strings:

```json
{
    "rules": {
        "no-restricted-syntax": ["error", "FunctionExpression", "WithStatement"]
    }
}
```

Examples of **incorrect** code for this rule with the `"FunctionExpression", "WithStatement"` options:

```js
/* eslint no-restricted-syntax: ["error", "FunctionExpression", "WithStatement"] */

with (me) {
    dontMess();
}

var doSomething = function () {};
```

Examples of **correct** code for this rule with the `"FunctionExpression", "WithStatement"` options:

```js
/* eslint no-restricted-syntax: ["error", "FunctionExpression", "WithStatement"] */

me.dontMess();

function doSomething() {};
```

## When Not To Use It

If you don't want to restrict your code from using any JavaScript features or syntax, you should not use this rule.

## Related Rules

* [no-alert](no-alert.md)
* [no-console](no-console.md)
* [no-debugger](no-debugger.md)
* [no-restricted-properties](no-restricted-properties.md)
* [no-restricted-syntax](no-restricted-syntax.md)
