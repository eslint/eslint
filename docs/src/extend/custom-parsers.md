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

### Methods in Custom Parsers

A custom parser is a JavaScript object with either a `parse()` or `parseForESLint()` method. The `parse` method only returns the AST, whereas `parseForESLint()` also returns additional values that let the parser customize the behavior of ESLint even more.

Both methods should be instance (own) properties and take in the source code as the first argument, and an optional configuration object as the second argument, which is provided as [`parserOptions`](../use/configure/language-options#specifying-parser-options) in a configuration file.

```javascript
// customParser.js

const espree = require("espree");

// Logs the duration it takes to parse each file.
function parse(code, options) {
    const label = `Parsing file "${options.filePath}"`;
    console.time(label);
    const ast = espree.parse(code, options);
    console.timeEnd(label);
    return ast; // Only the AST is returned.
};

module.exports = { parse };
```

### `parse` Return Object

The `parse` method should simply return the [AST](#ast-specification) object.

### `parseForESLint` Return Object

The `parseForESLint` method should return an object that contains the required property `ast` and optional properties `services`, `scopeManager`, and `visitorKeys`.

* `ast` should contain the [AST](#ast-specification) object.
* `services` can contain any parser-dependent services (such as type checkers for nodes). The value of the `services` property is available to rules as `context.sourceCode.parserServices`. Default is an empty object.
* `scopeManager` can be a [ScopeManager](./scope-manager-interface) object. Custom parsers can use customized scope analysis for experimental/enhancement syntaxes. The default is the `ScopeManager` object which is created by [eslint-scope](https://github.com/eslint/js/tree/main/packages/eslint-scope).
    * Support for `scopeManager` was added in ESLint v4.14.0. ESLint versions that support `scopeManager` will provide an `eslintScopeManager: true` property in `parserOptions`, which can be used for feature detection.
* `visitorKeys` can be an object to customize AST traversal. The keys of the object are the type of AST nodes. Each value is an array of the property names which should be traversed. The default is [KEYS of `eslint-visitor-keys`](https://github.com/eslint/js/tree/main/packages/eslint-visitor-keys#evkkeys).
    * Support for `visitorKeys` was added in ESLint v4.14.0. ESLint versions that support `visitorKeys` will provide an `eslintVisitorKeys: true` property in `parserOptions`, which can be used for feature detection.

### Meta Data in Custom Parsers

For easier debugging and more effective caching of custom parsers, it's recommended to provide a name and version in a `meta` object at the root of your custom parsers, like this:

```js
// preferred location of name and version
module.exports = {
    meta: {
        name: "eslint-parser-custom",
        version: "1.2.3"
    }
};
```

The `meta.name` property should match the npm package name for your custom parser and the `meta.version` property should match the npm package version for your custom parser. The easiest way to accomplish this is by reading this information from your `package.json`.

## AST Specification

The AST that custom parsers should create is based on [ESTree](https://github.com/estree/estree). The AST requires some additional properties about detail information of the source code.

### All Nodes

All nodes must have `range` property.

* `range` (`number[]`) is an array of two numbers. Both numbers are a 0-based index which is the position in the array of source code characters. The first is the start position of the node, the second is the end position of the node. `code.slice(node.range[0], node.range[1])` must be the text of the node. This range does not include spaces/parentheses which are around the node.
* `loc` (`SourceLocation`) must not be `null`. [The `loc` property is defined as nullable by ESTree](https://github.com/estree/estree/blob/25834f7247d44d3156030f8e8a2d07644d771fdb/es5.md#node-objects), but ESLint requires this property. The `SourceLocation#source` property can be `undefined`. ESLint does not use the `SourceLocation#source` property.

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

To publish your custom parser to npm, perform the following:

1. Create a custom parser following the [Creating a Custom Parser](#creating-a-custom-parser) section above.
1. [Create an npm package](https://docs.npmjs.com/creating-node-js-modules) for the custom parser.
1. In your `package.json` file, set the [`main`](https://docs.npmjs.com/cli/v9/configuring-npm/package-json#main) field as the file that exports your custom parser.
1. [Publish the npm package.](https://docs.npmjs.com/creating-and-publishing-unscoped-public-packages)

For more information on publishing an npm package, refer to the [npm documentation](https://docs.npmjs.com/).

Once you've published the npm package, you can use it by adding the package to your project. For example:

```shell
npm install eslint-parser-myparser --save-dev
```

Then add the custom parser to your ESLint configuration file with the `languageOptions.parser` property. For example:

```js
// eslint.config.js

const myparser = require("eslint-parser-myparser");

module.exports = [{
    languageOptions: {
        parser: myparser
    },
    // ... rest of configuration
}];
```

When using legacy configuration, specify the `parser` property as a string:

```js
// .eslintrc.js

module.exports = {
    parser: "eslint-parser-myparser",
    // ... rest of configuration
};
```

To learn more about using ESLint parsers in your project, refer to [Configure a Parser](../use/configure/parser).

## Example

For a complex example of a custom parser, refer to the [`@typescript-eslint/parser`](https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/parser) source code.

A simple custom parser that provides a `context.sourceCode.parserServices.foo()` method to rules.

```javascript
// awesome-custom-parser.js
var espree = require("espree");
function parseForESLint(code, options) {
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

module.exports = { parseForESLint };
```

Include the custom parser in an ESLint configuration file:

```js
// eslint.config.js
module.exports = [{
    languageOptions: {
        parser: require("./path/to/awesome-custom-parser")
    }
}];
```

Or if using legacy configuration:

```js
// .eslintrc.json
{
    "parser": "./path/to/awesome-custom-parser.js"
}
```
