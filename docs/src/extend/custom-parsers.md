---
title: Custom Parsers
eleventyNavigation:
    key: custom parsers
    parent: extend eslint
    title: Custom Parsers
    order: 4

---

If you want to use your own parser and provide additional capabilities for your rules, you can specify your own custom parser. If a `parseForESLint` method is exposed on the parser, this method will be used to parse the code. Otherwise, the `parse` method will be used. Both methods should take in the source code as the first argument, and an optional configuration object as the second argument (provided as `parserOptions` in a config file). The `parse` method should simply return the AST. The `parseForESLint` method should return an object that contains the required property `ast` and optional properties `services`, `scopeManager`, and `visitorKeys`.

* `ast` should contain the AST.
* `services` can contain any parser-dependent services (such as type checkers for nodes). The value of the `services` property is available to rules as `context.parserServices`. Default is an empty object.
* `scopeManager` can be a [ScopeManager](./scope-manager-interface) object. Custom parsers can use customized scope analysis for experimental/enhancement syntaxes. Default is the `ScopeManager` object which is created by [eslint-scope](https://github.com/eslint/eslint-scope).
    * Support for `scopeManager` was added in ESLint v4.14.0. ESLint versions which support `scopeManager` will provide an `eslintScopeManager: true` property in `parserOptions`, which can be used for feature detection.
* `visitorKeys` can be an object to customize AST traversal. The keys of the object are the type of AST nodes. Each value is an array of the property names which should be traversed. Default is [KEYS of `eslint-visitor-keys`](https://github.com/eslint/eslint-visitor-keys#evkkeys).
    * Support for `visitorKeys` was added in ESLint v4.14.0. ESLint versions which support `visitorKeys` will provide an `eslintVisitorKeys: true` property in `parserOptions`, which can be used for feature detection.

You can find an ESLint parser project [here](https://github.com/typescript-eslint/typescript-eslint).

```json
{
    "parser": "./path/to/awesome-custom-parser.js"
}
```

```javascript
var espree = require("espree");
// awesome-custom-parser.js
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

## The AST specification

The AST that custom parsers should create is based on [ESTree](https://github.com/estree/estree). The AST requires some additional properties about detail information of the source code.

### All nodes:

All nodes must have `range` property.

* `range` (`number[]`) is an array of two numbers. Both numbers are a 0-based index which is the position in the array of source code characters. The first is the start position of the node, the second is the end position of the node. `code.slice(node.range[0], node.range[1])` must be the text of the node. This range does not include spaces/parentheses which are around the node.
* `loc` (`SourceLocation`) must not be `null`. [The `loc` property is defined as nullable by ESTree](https://github.com/estree/estree/blob/25834f7247d44d3156030f8e8a2d07644d771fdb/es5.md#node-objects), but ESLint requires this property. On the other hand, `SourceLocation#source` property can be `undefined`. ESLint does not use the `SourceLocation#source` property.

The `parent` property of all nodes must be rewritable. ESLint sets each node's `parent` property to its parent node while traversing, before any rules have access to the AST.

### The `Program` node:

The `Program` node must have `tokens` and `comments` properties. Both properties are an array of the below Token interface.

```ts
interface Token {
    type: string;
    loc: SourceLocation;
    range: [number, number]; // See "All nodes:" section for details of `range` property.
    value: string;
}
```

* `tokens` (`Token[]`) is the array of tokens which affect the behavior of programs. Arbitrary spaces can exist between tokens, so rules check the `Token#range` to detect spaces between tokens. This must be sorted by `Token#range[0]`.
* `comments` (`Token[]`) is the array of comment tokens. This must be sorted by `Token#range[0]`.

The range indexes of all tokens and comments must not overlap with the range of other tokens and comments.

### The `Literal` node:

The `Literal` node must have `raw` property.

* `raw` (`string`) is the source code of this literal. This is the same as `code.slice(node.range[0], node.range[1])`.
