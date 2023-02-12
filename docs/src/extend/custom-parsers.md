---
title: Custom Parsers
eleventyNavigation:
    key: custom parsers
    parent: extend eslint
    title: Custom Parsers
    order: 5

---

ESLint custom parsers let you extend ESLint to support linting new non-standard JavaScript language features or custom syntax in your code. A parser is responsible for taking your code and transforming it into an abstract syntax tree (AST) that ESLint can then analyze and lint.

## Creating a Custom Parser

If a `parseForESLint` method is exposed on the parser, this method will be used to parse the code. Otherwise, the `parse` method will be used. Both methods should take in the source code as the first argument, and an optional configuration object as the second argument (provided as `parserOptions` in a config file).

TODO: have a simple example here w parse and parserOptions

## `parse` Return Object

The `parse` method should simply return the [AST](#ast-specification) object.

### `parseForESLint` Return Object

The `parseForESLint` method should return an object that contains the required property `ast` and optional properties `services`, `scopeManager`, and `visitorKeys`.

* `ast` should contain the [AST](#ast-specification) object.
* `services` can contain any parser-dependent services (such as type checkers for nodes). The value of the `services` property is available to rules as `context.parserServices`. Default is an empty object.
* `scopeManager` can be a [ScopeManager](./scope-manager-interface) object. Custom parsers can use customized scope analysis for experimental/enhancement syntaxes. Default is the `ScopeManager` object which is created by [eslint-scope](https://github.com/eslint/eslint-scope).
    * Support for `scopeManager` was added in ESLint v4.14.0. ESLint versions which support `scopeManager` will provide an `eslintScopeManager: true` property in `parserOptions`, which can be used for feature detection.
* `visitorKeys` can be an object to customize AST traversal. The keys of the object are the type of AST nodes. Each value is an array of the property names which should be traversed. Default is [KEYS of `eslint-visitor-keys`](https://github.com/eslint/eslint-visitor-keys#evkkeys).
    * Support for `visitorKeys` was added in ESLint v4.14.0. ESLint versions which support `visitorKeys` will provide an `eslintVisitorKeys: true` property in `parserOptions`, which can be used for feature detection.

## AST Specification

The AST that custom parsers should create is based on [ESTree](https://github.com/estree/estree). The AST requires some additional properties about detail information of the source code.

### All Nodes

All nodes must have `range` property.

* `range` (`number[]`) is an array of two numbers. Both numbers are a 0-based index which is the position in the array of source code characters. The first is the start position of the node, the second is the end position of the node. `code.slice(node.range[0], node.range[1])` must be the text of the node. This range does not include spaces/parentheses which are around the node.
* `loc` (`SourceLocation`) must not be `null`. [The `loc` property is defined as nullable by ESTree](https://github.com/estree/estree/blob/25834f7247d44d3156030f8e8a2d07644d771fdb/es5.md#node-objects), but ESLint requires this property. `SourceLocation#source` property can be `undefined`. ESLint does not use the `SourceLocation#source` property.

The `parent` property of all nodes must be rewritable. Before any rules have access to the AST, ESLint sets each node's `parent` property to its parent node while traversing.

### The `Program` Node

The `Program` node must have `tokens` and `comments` properties. Both properties are an array of the below `Token` interface.

```ts
interface Token {
    type: string;
    loc: SourceLocation;
    // See the "All Nodes" section for details of the `range` property.
    range: [number, number];
    value: string;
}
```

* `tokens` (`Token[]`) is the array of tokens which affect the behavior of programs. Arbitrary spaces can exist between tokens, so rules check the `Token#range` to detect spaces between tokens. This must be sorted by `Token#range[0]`.
* `comments` (`Token[]`) is the array of comment tokens. This must be sorted by `Token#range[0]`.

The range indexes of all tokens and comments must not overlap with the range of other tokens and comments.

### The `Literal` Node

The `Literal` node must have `raw` property.

* `raw` (`string`) is the source code of this literal. This is the same as `code.slice(node.range[0], node.range[1])`.

## Packaging a Custom Parser

TODO: Add info on turning into a package

## Example

For a complex example of a custom parser, refer to the [`@typescript-eslint/parser`](https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/parser) source code.

A simple custom parser that logs `"foo"` to the console when it processes a node:

```javascript
// awesome-custom-parser.js
var espree = require("espree");
exports.parseForESLint = function(code, options) {
    return {
        ast: espree.parse(code, options),
        services: {
            foo: function() {
                console.log("foo");
            }
        },
        scopeManager: null,
        visitorKeys: null
    };
};

```

Include the custom parser in an ESLint configuration file:

```js
// .eslintrc.json
{
    "parser": "./path/to/awesome-custom-parser.js"
}
```
