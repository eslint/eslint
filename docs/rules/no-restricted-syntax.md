# Disallow certain syntax (no-restricted-syntax)

Some code bases prefer to not use certain features of JavaScript that are identified on the parsed AST such as `FunctionExpression` or `WithStatement`. This is implemented to warn on any AST node type that is passed to it. You may find the full list of AST node names you can use [on GitHub](https://github.com/eslint/espree/blob/master/lib/ast-node-types.js) and use the [online parser](http://eslint.org/parser/) to see what type of nodes your code consists of.

## Rule Details

This rule is aimed at eliminating certain syntax from your JavaScript. As such, it warns whenever it sees a node type that is restricted by its options.

### Options

This rule takes a list of strings where strings denote the node types:

```json
{
    "rules": {
        "no-restricted-syntax": [2, "FunctionExpression", "WithStatement"]
    }
}
```

The following patterns are considered warnings:

```
/* eslint no-restricted-syntax: [2, "FunctionExpression", "WithStatement"] */

with (me) {                       /*error Using "WithStatement" is not allowed.*/
    dontMess();
}

var doSomething = function () {}; /*error Using "FunctionExpression" is not allowed.*/
```

The following patterns are not considered warnings:

```js
/* eslint no-restricted-syntax: [2, "FunctionExpression", "WithStatement"] */

me.dontMess();

function doSomething() {};
```

## When Not To Use It

If you don't want to restrict your code from using any JavaScript features or syntax, you should not use this rule.

## Related Rules

* [no-alert](no-alert.md)
* [no-console](no-console.md)
* [no-debugger](no-debugger.md)
