---
title: Languages
eleventyNavigation:
    key: languages
    parent: create plugins
    title: Languages
    order: 4

---

Starting with ESLint v9.7.0, you can extend ESLint with additional languages through plugins. While ESLint began as a linter strictly for JavaScript, the ESLint core is generic and can be used to lint any programming language. Each language is defined as an object that contains all of the parsing, evaluating, and traversal functionality required to lint a file. These languages are then distributed in plugins for use in user configurations.

## Language Requirements

In order to create a language, you need:

1. **A parser.** The parser is the piece that converts plain text into a data structure. There is no specific format that ESLint requires the data structure to be in, so you can use any already-existing parser, or write your own.
1. **A `SourceCode` object.** The way ESLint works with an AST is through a `SourceCode` object. There are some required methods on each `SourceCode`, and you can also add more methods or properties that you'd like to expose to rules.
1. **A `Language` object.** The `Language` object contains information about the language itself along with methods for parsing and creating the `SourceCode` object.

### Parser Requirements for Languages

To get started, make sure you have a parser that can be called from JavaScript. The parser must return a data structure representing the code that was parsed. Most parsers return an [abstract syntax tree](https://en.wikipedia.org/wiki/Abstract_syntax_tree) (AST) to represent the code, but they can also return a [concrete syntax tree](https://en.wikipedia.org/wiki/Parse_tree) (CST). Whether an AST or CST is returned doesn't matter to ESLint, it only matters that there is a data structure to traverse.

While there is no specific structure an AST or CST must follow, it's easier to integrate with ESLint when each node in the tree contains the following information:

1. **Type** - A property on each node representing the node type is required. For example, in JavaScript, the `type` property contains this information for each node. ESLint rules use node types to define the visitor methods, so it's important that each node can be identified by a string. The name of the property doesn't matter (discussed further below) so long as one exists. This property is typically named `type` or `kind` by most parsers.
1. **Location** - A property on each node representing the location of the node in the original source code is required. The location must contain:
    * The line on which the node starts
    * The column on which the node starts
    * The line on which the node ends
    * The column on which the node ends

    As with the node type, the property name doesn't matter. Two common property names are `loc` (as in [ESTree](https://github.com/estree/estree/blob/3851d4a6eae5e5473371893959b88b62007469e8/es5.md#node-objects)) and `position` (as in [Unist](https://github.com/syntax-tree/unist?tab=readme-ov-file#node)). This information is used by ESLint to report errors and rule violations.
1. **Range** - A property on each node representing the location of the node's source inside the source code is required. The range indicates the index at which the first character is found and the index after the last character, such that calling `code.slice(start, end)` returns the text that the node represents. Once again, no specific property name is required, and this information may even be merged with location information. ESTree uses the `range` property while Unist includes this information on `position` along with the location information. This information is used by ESLint to apply autofixes.

### The `SourceCode` Object

ESLint holds information about source code in a `SourceCode` object. This object is the API used both by ESLint internally and by rules written to work on the code (via `context.sourceCode`). The `SourceCode` object must implement the `TextSourceCode` interface as defined in the [`@eslint/core`](https://npmjs.com/package/@eslint/core) package.

A basic `SourceCode` object must implement the following:

* `ast` - a property containing the AST or CST for the source code.
* `text` - the text of the source code.
* `getLoc(nodeOrToken)` - a method that returns the location of a given node or token. This must match the `loc` structure that ESTree uses.
* `getRange(nodeOrToken)` - a method that returns the range of a given node or token. This must return an array where the first item is the start index and the second is the end index.
* `traverse()` - a method that returns an iterable for traversing the AST or CST. The iterator must return objects that implement either `VisitTraversalStep` or `CallTraversalStep` from `@eslint/core`.

The following optional members allow you to customize how ESLint interacts with the object:

* `visitorKeys` - visitor keys that are specific to just this `SourceCode` object. Typically not necessary as `Language#visitorKeys` is used most of the time.
* `applyLanguageOptions(languageOptions)` - if you have specific language options that need to be applied after parsing, you can do so in this method.
* `getDisableDirectives()` - returns any disable directives in the code. ESLint uses this to apply disable directives and track unused directives.
* `getInlineConfigNodes()` - returns any inline config nodes. ESLint uses this to report errors when `noInlineConfig` is enabled.
* `applyInlineConfig()` - returns inline configuration elements to ESLint. ESLint uses this to alter the configuration of the file being linted.
* `finalize()` - this method is called just before linting begins and is your last chance to modify `SourceCode`. If you've defined `applyLanguageOptions()` or `applyInlineConfig()`, then you may have additional changes to apply before the `SourceCode` object is ready.

Additionally, the following members are common on `SourceCode` objects and are recommended to implement:

* `lines` - the individual lines of the source code as an array of strings.
* `getParent(node)` - returns the parent of the given node or `undefined` if the node is the root.
* `getAncestors(node)` - returns an array of the ancestry of the node with the first item as the root of the tree and each subsequent item as the descendants of the root that lead to `node`.
* `getText(node, beforeCount, afterCount)` - returns the string that represents the given node, and optionally, a specified number of characters before and after the node's range.

See [`JSONSourceCode`](https://github.com/eslint/json/blob/main/src/languages/json-source-code.js) as an example of a basic `SourceCode` class.

### The `Language` Object

The `Language` object contains all of the information about the programming language as well as methods for interacting with code written in that language. ESLint uses this object to determine how to deal with a particular file. The `Language` object must implement the `Language` interface as defined in the [`@eslint/core`](https://npmjs.com/package/@eslint/core) package.

A basic `Language` object must implement the following:

* `fileType` - should be `"text"` (in the future, we will also support `"binary"`)
* `lineStart` - either 0 or 1 to indicate how the AST represents the first line in the file. ESLint uses this to correctly display error locations.
* `columnStart` - either 0 or 1 to indicate how the AST represents the first column in each line. ESLint uses this to correctly display error locations.
* `nodeTypeKey` - the name of the property that indicates the node type (usually `"type"` or `"kind"`).
* `validateLanguageOptions(languageOptions)` - validates language options for the language. This method is expected to throw a validation error when an expected language option doesn't have the correct type or value. Unexpected language options should be silently ignored and no error should be thrown. This method is required even if the language doesn't specify any options.
* `parse(file, context)` - parses the given file into an AST or CST, and can also include additional values meant for use in rules. Called internally by ESLint.
* `createSourceCode(file, parseResult, context)` - creates a `SourceCode` object. Call internally by ESLint after `parse()`, and the second argument is the exact return value from `parse()`.

The following optional members allow you to customize how ESLint interacts with the object:

* `visitorKeys` - visitor keys that are specific to the AST or CST. This is used to optimize traversal of the AST or CST inside of ESLint. While not required, it is strongly recommended, especially for AST or CST formats that deviate significantly from ESTree format.
* `matchesSelectorClass(className, node, ancestry)` - allows you to specify selector classes, such as `:expression`, that match more than one node. This method is called whenever an [esquery](https://github.com/estools/esquery) selector contains a `:` followed by an identifier.

See [`JSONLanguage`](https://github.com/eslint/json/blob/main/src/languages/json-language.js) as an example of a basic `Language` class.

## Publish a Language in a Plugin

Languages are published in plugins similar to processors and rules. Define the `languages` key in your plugin as an object whose names are the language names and the values are the language objects. Here's an example:

```js
import { myLanguage } from "../languages/my.js";

const plugin = {

    // preferred location of name and version
    meta: {
        name: "eslint-plugin-example",
        version: "1.2.3"
    },
    languages: {
        my: myLanguage
    },
    rules: {
        // add rules here
    }
};

// for ESM
export default plugin;

// OR for CommonJS
module.exports = plugin;
```

In order to use a language from a plugin in a configuration file, import the plugin and include it in the `plugins` key, specifying a namespace. Then, use that namespace to reference the language in the `language` configuration, like this:

```js
// eslint.config.js
import example from "eslint-plugin-example";

export default [
    {
        plugins: {
            example
        },
        language: "example/my"
    }
];
```

See [Specify a Language](../use/configure/plugins#specify-a-language) in the Plugin Configuration documentation for more details.
