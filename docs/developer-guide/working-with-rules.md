# Working with Rules

**Note:** This page covers the most recent rule format for ESLint >= 3.0.0. There is also a [deprecated rule format](./working-with-rules-deprecated.md).

Each rule in ESLint has three files named with its identifier (for example, `no-extra-semi`).

* in the `lib/rules` directory: a source file (for example, `no-extra-semi.js`)
* in the `tests/lib/rules` directory: a test file (for example, `no-extra-semi.js`)
* in the `docs/rules` directory: a Markdown documentation file (for example, `no-extra-semi.md`)

**Important:** If you submit a **core** rule to the ESLint repository, you **must** follow some conventions explained below.

Here is the basic format of the source file for a rule:

```js
/**
 * @fileoverview Rule to disallow unnecessary semicolons
 * @author Nicholas C. Zakas
 */

"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        type: "suggestion",

        docs: {
            description: "disallow unnecessary semicolons",
            category: "Possible Errors",
            recommended: true,
            url: "https://eslint.org/docs/rules/no-extra-semi"
        },
        fixable: "code",
        schema: [] // no options
    },
    create: function(context) {
        return {
            // callback functions
        };
    }
};
```

## Rule Basics

The source file for a rule exports an object with the following properties.

`meta` (object) contains metadata for the rule:

* `type` (string) indicates the type of rule, which is one of `"problem"`, `"suggestion"`, or `"layout"`:
    * `"problem"` means the rule is identifying code that either will cause an error or may cause a confusing behavior. Developers should consider this a high priority to resolve.
    * `"suggestion"` means the rule is identifying something that could be done in a better way but no errors will occur if the code isn't changed.
    * `"layout"` means the rule cares primarily about whitespace, semicolons, commas, and parentheses, all the parts of the program that determine how the code looks rather than how it executes. These rules work on parts of the code that aren't specified in the AST.

* `docs` (object) is required for core rules of ESLint:

    * `description` (string) provides the short description of the rule in the [rules index](../rules/)
    * `category` (string) specifies the heading under which the rule is listed in the [rules index](../rules/)
    * `recommended` (boolean) is whether the `"extends": "eslint:recommended"` property in a [configuration file](../user-guide/configuring.md#extending-configuration-files) enables the rule
    * `url` (string) specifies the URL at which the full documentation can be accessed

    In a custom rule or plugin, you can omit `docs` or include any properties that you need in it.

* `fixable` (string) is either `"code"` or `"whitespace"` if the `--fix` option on the [command line](../user-guide/command-line-interface.md#fix) automatically fixes problems reported by the rule

    **Important:** Without the `fixable` property, ESLint does not [apply fixes](#applying-fixes) even if the rule implements `fix` functions. Omit the `fixable` property if the rule is not fixable.

* `schema` (array) specifies the [options](#options-schemas) so ESLint can prevent invalid [rule configurations](../user-guide/configuring.md#configuring-rules)

* `deprecated` (boolean) indicates whether the rule has been deprecated.  You may omit the `deprecated` property if the rule has not been deprecated.

* `replacedBy` (array) in the case of a deprecated rule, specifies replacement rule(s)

`create` (function) returns an object with methods that ESLint calls to "visit" nodes while traversing the abstract syntax tree (AST as defined by [ESTree](https://github.com/estree/estree)) of JavaScript code:

* if a key is a node type or a [selector](./selectors.md), ESLint calls that **visitor** function while going **down** the tree
* if a key is a node type or a [selector](./selectors.md) plus `:exit`, ESLint calls that **visitor** function while going **up** the tree
* if a key is an event name, ESLint calls that **handler** function for [code path analysis](./code-path-analysis.md)

A rule can use the current node and its surrounding tree to report or fix problems.

Here are methods for the [array-callback-return](../rules/array-callback-return.md) rule:

```js
function checkLastSegment (node) {
    // report problem for function if last code path segment is reachable
}

module.exports = {
    meta: { ... },
    create: function(context) {
        // declare the state of the rule
        return {
            ReturnStatement: function(node) {
                // at a ReturnStatement node while going down
            },
            // at a function expression node while going up:
            "FunctionExpression:exit": checkLastSegment,
            "ArrowFunctionExpression:exit": checkLastSegment,
            onCodePathStart: function (codePath, node) {
                // at the start of analyzing a code path
            },
            onCodePathEnd: function(codePath, node) {
                // at the end of analyzing a code path
            }
        };
    }
};
```

## The Context Object

The `context` object contains additional functionality that is helpful for rules to do their jobs. As the name implies, the `context` object contains information that is relevant to the context of the rule. The `context` object has the following properties:

* `parserOptions` - the parser options configured for this run (more details [here](../user-guide/configuring.md#specifying-parser-options)).
* `id` - the rule ID.
* `options` - an array of the [configured options](/docs/user-guide/configuring.md#configuring-rules) for this rule. This array does not include the rule severity. For more information, see [here](#contextoptions).
* `settings` - the [shared settings](/docs/user-guide/configuring.md#adding-shared-settings) from configuration.
* `parserPath` - the name of the `parser` from configuration.
* `parserServices` - an object containing parser-provided services for rules. The default parser does not provide any services. However, if a rule is intended to be used with a custom parser, it could use `parserServices` to access anything provided by that parser. (For example, a TypeScript parser could provide the ability to get the computed type of a given node.)

Additionally, the `context` object has the following methods:

* `getAncestors()` - returns an array of the ancestors of the currently-traversed node, starting at the root of the AST and continuing through the direct parent of the current node. This array does not include the currently-traversed node itself.
* `getDeclaredVariables(node)` - returns a list of [variables](./scope-manager-interface.md#variable-interface) declared by the given node. This information can be used to track references to variables.
    * If the node is a `VariableDeclaration`, all variables declared in the declaration are returned.
    * If the node is a `VariableDeclarator`, all variables declared in the declarator are returned.
    * If the node is a `FunctionDeclaration` or `FunctionExpression`, the variable for the function name is returned, in addition to variables for the function parameters.
    * If the node is an `ArrowFunctionExpression`, variables for the parameters are returned.
    * If the node is a `ClassDeclaration` or a `ClassExpression`, the variable for the class name is returned.
    * If the node is a `CatchClause`, the variable for the exception is returned.
    * If the node is an `ImportDeclaration`, variables for all of its specifiers are returned.
    * If the node is an `ImportSpecifier`, `ImportDefaultSpecifier`, or `ImportNamespaceSpecifier`, the declared variable is returned.
    * Otherwise, if the node does not declare any variables, an empty array is returned.
* `getFilename()` - returns the filename associated with the source.
* `getScope()` - returns the [scope](./scope-manager-interface.md#scope-interface) of the currently-traversed node. This information can be used track references to variables.
* `getSourceCode()` - returns a [`SourceCode`](#contextgetsourcecode) object that you can use to work with the source that was passed to ESLint.
* `markVariableAsUsed(name)` - marks a variable with the given name in the current scope as used. This affects the [no-unused-vars](../rules/no-unused-vars.md) rule. Returns `true` if a variable with the given name was found and marked as used, otherwise `false`.
* `report(descriptor)` - reports a problem in the code (see the [dedicated section](#contextreport)).

**Note:** Earlier versions of ESLint supported additional methods on the `context` object. Those methods were removed in the new format and should not be relied upon.

### context.getScope()

This method returns the scope which has the following types:

| AST Node Type             | Scope Type |
|:--------------------------|:-----------|
| `Program`                 | `global`   |
| `FunctionDeclaration`     | `function` |
| `FunctionExpression`      | `function` |
| `ArrowFunctionExpression` | `function` |
| `ClassDeclaration`        | `class`    |
| `ClassExpression`         | `class`    |
| `BlockStatement` ※1      | `block`    |
| `SwitchStatement` ※1     | `switch`   |
| `ForStatement` ※2        | `for`      |
| `ForInStatement` ※2      | `for`      |
| `ForOfStatement` ※2      | `for`      |
| `WithStatement`           | `with`     |
| `CatchClause`             | `catch`    |
| others                    | ※3        |

**※1** Only if the configured parser provided the block-scope feature. The default parser provides the block-scope feature if `parserOptions.ecmaVersion` is not less than `6`.<br>
**※2** Only if the `for` statement defines the iteration variable as a block-scoped variable (E.g., `for (let i = 0;;) {}`).<br>
**※3** The scope of the closest ancestor node which has own scope. If the closest ancestor node has multiple scopes then it chooses the innermost scope (E.g., the `Program` node has a `global` scope and a `module` scope if `Program#sourceType` is `"module"`. The innermost scope is the `module` scope.).

### context.report()

The main method you'll use is `context.report()`, which publishes a warning or error (depending on the configuration being used). This method accepts a single argument, which is an object containing the following properties:

* `message` - the problem message.
* `node` - (optional)  the AST node related to the problem. If present and `loc` is not specified, then the starting location of the node is used as the location of the problem.
* `loc` - (optional) an object specifying the location of the problem. If both `loc` and `node` are specified, then the location is used from `loc` instead of `node`.
    * `start` - An object of the start location.
        * `line` - the 1-based line number at which the problem occurred.
        * `column` - the 0-based column number at which the problem occurred.
    * `end` - An object of the end location.
        * `line` - the 1-based line number at which the problem occurred.
        * `column` - the 0-based column number at which the problem occurred.
* `data` - (optional) [placeholder](#using-message-placeholders) data for `message`.
* `fix` - (optional) a function that applies a [fix](#applying-fixes) to resolve the problem.

Note that at least one of `node` or `loc` is required.

The simplest example is to use just `node` and `message`:

```js
context.report({
    node: node,
    message: "Unexpected identifier"
});
```

The node contains all of the information necessary to figure out the line and column number of the offending text as well the source text representing the node.

### Using message placeholders

You can also use placeholders in the message and provide `data`:

```js
{% raw %}
context.report({
    node: node,
    message: "Unexpected identifier: {{ identifier }}",
    data: {
        identifier: node.name
    }
});
{% endraw %}
```

Note that leading and trailing whitespace is optional in message parameters.

The node contains all of the information necessary to figure out the line and column number of the offending text as well the source text representing the node.

### `messageId`s

Instead of typing out messages in both the `context.report()` call and your tests, you can use `messageId`s instead.

This allows you to avoid retyping error messages. It also prevents errors reported in different sections of your rule from having out-of-date messages.

```js
{% raw %}
// in your rule
module.exports = {
    meta: {
        messages: {
            avoidName: "Avoid using variables named '{{ name }}'"
        }
    },
    create(context) {
        return {
            Identifier(node) {
                if (node.name === "foo") {
                    context.report({
                        node,
                        messageId: "avoidName",
                        data: {
                            name: "foo",
                        }
                    });
                }
            }
        };
    }
};

// in the file to lint:

var foo = 2;
//  ^ error: Avoid using variables named 'foo'

// In your tests:
var rule = require("../../../lib/rules/my-rule");
var RuleTester = require("eslint").RuleTester;

var ruleTester = new RuleTester();
ruleTester.run("my-rule", rule, {
    valid: ["bar", "baz"],
    invalid: [
        {
            code: "foo",
            errors: [
                {
                    messageId: "avoidName"
                }
            ]
        }
    ]
});
{% endraw %}
```

### Applying Fixes

If you'd like ESLint to attempt to fix the problem you're reporting, you can do so by specifying the `fix` function when using `context.report()`. The `fix` function receives a single argument, a `fixer` object, that you can use to apply a fix. For example:

```js
context.report({
    node: node,
    message: "Missing semicolon",
    fix: function(fixer) {
        return fixer.insertTextAfter(node, ";");
    }
});
```

Here, the `fix()` function is used to insert a semicolon after the node. Note that a fix is not immediately applied, and may not be applied at all if there are conflicts with other fixes. After applying fixes, ESLint will run all of the enabled rules again on the fixed code, potentially applying more fixes. This process will repeat up to 10 times, or until no more fixable problems are found. Afterwards, any remaining problems will be reported as usual.

**Important:** Unless the rule [exports](#rule-basics) the `meta.fixable` property, ESLint does not apply fixes even if the rule implements `fix` functions.

The `fixer` object has the following methods:

* `insertTextAfter(nodeOrToken, text)` - inserts text after the given node or token
* `insertTextAfterRange(range, text)` - inserts text after the given range
* `insertTextBefore(nodeOrToken, text)` - inserts text before the given node or token
* `insertTextBeforeRange(range, text)` - inserts text before the given range
* `remove(nodeOrToken)` - removes the given node or token
* `removeRange(range)` - removes text in the given range
* `replaceText(nodeOrToken, text)` - replaces the text in the given node or token
* `replaceTextRange(range, text)` - replaces the text in the given range

The above methods return a `fixing` object.
The `fix()` function can return the following values:

* A `fixing` object.
* An array which includes `fixing` objects.
* An iterable object which enumerates `fixing` objects. Especially, the `fix()` function can be a generator.

If you make a `fix()` function which returns multiple `fixing` objects, those `fixing` objects must not be overlapped.

Best practices for fixes:

1. Avoid any fixes that could change the runtime behavior of code and cause it to stop working.
1. Make fixes as small as possible. Fixes that are unnecessarily large could conflict with other fixes, and prevent them from being applied.
1. Only make one fix per message. This is enforced because you must return the result of the fixer operation from `fix()`.
1. Since all rules are run again after the initial round of fixes is applied, it's not necessary for a rule to check whether the code style of a fix will cause errors to be reported by another rule.
    * For example, suppose a fixer would like to surround an object key with quotes, but it's not sure whether the user would prefer single or double quotes.

        ```js
        ({ foo : 1 })

        // should get fixed to either

        ({ 'foo': 1 })

        // or

        ({ "foo": 1 })
        ```

    * This fixer can just select a quote type arbitrarily. If it guesses wrong, the resulting code will be automatically reported and fixed by the [`quotes`](/docs/rules/quotes.md) rule.

### context.options

Some rules require options in order to function correctly. These options appear in configuration (`.eslintrc`, command line, or in comments). For example:

```json
{
    "quotes": ["error", "double"]
}
```

The `quotes` rule in this example has one option, `"double"` (the `error` is the error level). You can retrieve the options for a rule by using `context.options`, which is an array containing every configured option for the rule. In this case, `context.options[0]` would contain `"double"`:

```js
module.exports = {
    create: function(context) {
        var isDouble = (context.options[0] === "double");

        // ...
    }
};
```

Since `context.options` is just an array, you can use it to determine how many options have been passed as well as retrieving the actual options themselves. Keep in mind that the error level is not part of `context.options`, as the error level cannot be known or modified from inside a rule.

When using options, make sure that your rule has some logical defaults in case the options are not provided.

### context.getSourceCode()

The `SourceCode` object is the main object for getting more information about the source code being linted. You can retrieve the `SourceCode` object at any time by using the `getSourceCode()` method:

```js
module.exports = {
    create: function(context) {
        var sourceCode = context.getSourceCode();

        // ...
    }
};
```

Once you have an instance of `SourceCode`, you can use the methods on it to work with the code:

* `getText(node)` - returns the source code for the given node. Omit `node` to get the whole source.
* `getAllComments()` - returns an array of all comments in the source.
* `getCommentsBefore(nodeOrToken)` - returns an array of comment tokens that occur directly before the given node or token.
* `getCommentsAfter(nodeOrToken)` - returns an array of comment tokens that occur directly after the given node or token.
* `getCommentsInside(node)` - returns an array of all comment tokens inside a given node.
* `getJSDocComment(node)` - returns the JSDoc comment for a given node or `null` if there is none.
* `isSpaceBetweenTokens(first, second)` - returns true if there is a whitespace character between the two tokens.
* `getFirstToken(node, skipOptions)` - returns the first token representing the given node.
* `getFirstTokens(node, countOptions)` - returns the first `count` tokens representing the given node.
* `getLastToken(node, skipOptions)` - returns the last token representing the given node.
* `getLastTokens(node, countOptions)` - returns the last `count` tokens representing the given node.
* `getTokenAfter(nodeOrToken, skipOptions)` - returns the first token after the given node or token.
* `getTokensAfter(nodeOrToken, countOptions)` - returns `count` tokens after the given node or token.
* `getTokenBefore(nodeOrToken, skipOptions)` - returns the first token before the given node or token.
* `getTokensBefore(nodeOrToken, countOptions)` - returns `count` tokens before the given node or token.
* `getFirstTokenBetween(nodeOrToken1, nodeOrToken2, skipOptions)` - returns the first token between two nodes or tokens.
* `getFirstTokensBetween(nodeOrToken1, nodeOrToken2, countOptions)` - returns the first `count` tokens between two nodes or tokens.
* `getLastTokenBetween(nodeOrToken1, nodeOrToken2, skipOptions)` - returns the last token between two nodes or tokens.
* `getLastTokensBetween(nodeOrToken1, nodeOrToken2, countOptions)` - returns the last `count` tokens between two nodes or tokens.
* `getTokens(node)` - returns all tokens for the given node.
* `getTokensBetween(nodeOrToken1, nodeOrToken2)` - returns all tokens between two nodes.
* `getTokenByRangeStart(index, rangeOptions)` - returns the token whose range starts at the given index in the source.
* `getNodeByRangeIndex(index)` - returns the deepest node in the AST containing the given source index.
* `getLocFromIndex(index)` - returns an object with `line` and `column` properties, corresponding to the location of the given source index. `line` is 1-based and `column` is 0-based.
* `getIndexFromLoc(loc)` - returns the index of a given location in the source code, where `loc` is an object with a 1-based `line` key and a 0-based `column` key.
* `commentsExistBetween(nodeOrToken1, nodeOrToken2)` - returns `true` if comments exist between two nodes.

> `skipOptions` is an object which has 3 properties; `skip`, `includeComments`, and `filter`. Default is `{skip: 0, includeComments: false, filter: null}`.
>
> * `skip` is a positive integer, the number of skipping tokens. If `filter` option is given at the same time, it doesn't count filtered tokens as skipped.
> * `includeComments` is a boolean value, the flag to include comment tokens into the result.
> * `filter` is a function which gets a token as the first argument, if the function returns `false` then the result excludes the token.
>
> `countOptions` is an object which has 3 properties; `count`, `includeComments`, and `filter`. Default is `{count: 0, includeComments: false, filter: null}`.
>
> * `count` is a positive integer, the maximum number of returning tokens.
> * `includeComments` is a boolean value, the flag to include comment tokens into the result.
> * `filter` is a function which gets a token as the first argument, if the function returns `false` then the result excludes the token.
>
> `rangeOptions` is an object which has 1 property: `includeComments`.
>
> * `includeComments` is a boolean value, the flag to include comment tokens into the result.

There are also some properties you can access:

* `hasBOM` - the flag to indicate whether or not the source code has Unicode BOM.
* `text` - the full text of the code being linted. Unicode BOM has been stripped from this text.
* `ast` - the `Program` node of the AST for the code being linted.
* `scopeManager` - the [ScopeManager](./scope-manager-interface.md#scopemanager-interface) object of the code.
* `visitorKeys` - the visitor keys to traverse this AST.
* `lines` - an array of lines, split according to the specification's definition of line breaks.

You should use a `SourceCode` object whenever you need to get more information about the code being linted.

#### Deprecated

Please note that the following methods have been deprecated and will be removed in a future version of ESLint:

* `getComments()` - replaced by `getCommentsBefore()`, `getCommentsAfter()`, and `getCommentsInside()`
* `getTokenOrCommentBefore()` - replaced by `getTokenBefore()` with the `{ includeComments: true }` option
* `getTokenOrCommentAfter()` - replaced by `getTokenAfter()` with the `{ includeComments: true }` option

### Options Schemas

Rules may export a `schema` property, which is a [JSON schema](http://json-schema.org/) format description of a rule's options which will be used by ESLint to validate configuration options and prevent invalid or unexpected inputs before they are passed to the rule in `context.options`.

There are two formats for a rule's exported `schema`. The first is a full JSON Schema object describing all possible options the rule accepts, including the rule's error level as the first argument and any optional arguments thereafter.

However, to simplify schema creation, rules may also export an array of schemas for each optional positional argument, and ESLint will automatically validate the required error level first. For example, the `yoda` rule accepts a primary mode argument, as well as an extra options object with named properties.

```js
// "yoda": [2, "never", { "exceptRange": true }]
module.exports = {
    meta: {
        schema: [
            {
                "enum": ["always", "never"]
            },
            {
                "type": "object",
                "properties": {
                    "exceptRange": {
                        "type": "boolean"
                    }
                },
                "additionalProperties": false
            }
        ]
    },
};
```

In the preceding example, the error level is assumed to be the first argument. It is followed by the first optional argument, a string which may be either `"always"` or `"never"`. The final optional argument is an object, which may have a Boolean property named `exceptRange`.

To learn more about JSON Schema, we recommend looking at some examples in [website](http://json-schema.org/learn/) to start, and also reading [Understanding JSON Schema](http://spacetelescope.github.io/understanding-json-schema/) (a free ebook).

**Note:** Currently you need to use full JSON Schema object rather than array in case your schema has references ($ref), because in case of array format ESLint transforms this array into a single schema without updating references that makes them incorrect (they are ignored).

### Getting the Source

If your rule needs to get the actual JavaScript source to work with, then use the `sourceCode.getText()` method. This method works as follows:

```js

// get all source
var source = sourceCode.getText();

// get source for just this AST node
var nodeSource = sourceCode.getText(node);

// get source for AST node plus previous two characters
var nodeSourceWithPrev = sourceCode.getText(node, 2);

// get source for AST node plus following two characters
var nodeSourceWithFollowing = sourceCode.getText(node, 0, 2);
```

In this way, you can look for patterns in the JavaScript text itself when the AST isn't providing the appropriate data (such as location of commas, semicolons, parentheses, etc.).

### Accessing Comments

While comments are not technically part of the AST, ESLint provides a few ways for rules to access them:

#### sourceCode.getAllComments()

This method returns an array of all the comments found in the program. This is useful for rules that need to check all comments regardless of location.

#### sourceCode.getCommentsBefore(), sourceCode.getCommentsAfter(), and sourceCode.getCommentsInside()

These methods return an array of comments that appear directly before, directly after, and inside nodes, respectively. They are useful for rules that need to check comments in relation to a given node or token.

Keep in mind that the results of this method are calculated on demand.

#### Token traversal methods

Finally, comments can be accessed through many of `sourceCode`'s methods using the `includeComments` option.

### Accessing Shebangs

Shebangs are represented by tokens of type `"Shebang"`. They are treated as comments and can be accessed by the methods outlined above.

### Accessing Code Paths

ESLint analyzes code paths while traversing AST.
You can access that code path objects with five events related to code paths.

[details here](./code-path-analysis.md)

## Rule Unit Tests

Each bundled rule for ESLint core must have a set of unit tests submitted with it to be accepted. The test file is named the same as the source file but lives in `tests/lib/`. For example, if the rule source file is `lib/rules/foo.js` then the test file should be `tests/lib/rules/foo.js`.

ESLint provides the [`RuleTester`](/docs/developer-guide/nodejs-api.md#ruletester) utility to make it easy to write tests for rules.

## Performance Testing

To keep the linting process efficient and unobtrusive, it is useful to verify the performance impact of new rules or modifications to existing rules.

### Overall Performance

When developing in the ESLint core repository, the `npm run perf` command gives a high-level overview of ESLint running time with all core rules enabled.

```bash
$ git checkout master
Switched to branch 'master'

$ npm run perf
CPU Speed is 2200 with multiplier 7500000
Performance Run #1:  1394.689313ms
Performance Run #2:  1423.295351ms
Performance Run #3:  1385.09515ms
Performance Run #4:  1382.406982ms
Performance Run #5:  1409.68566ms
Performance budget ok:  1394.689313ms (limit: 3409.090909090909ms)

$ git checkout my-rule-branch
Switched to branch 'my-rule-branch'

$ npm run perf
CPU Speed is 2200 with multiplier 7500000
Performance Run #1:  1443.736547ms
Performance Run #2:  1419.193291ms
Performance Run #3:  1436.018228ms
Performance Run #4:  1473.605485ms
Performance Run #5:  1457.455283ms
Performance budget ok:  1443.736547ms (limit: 3409.090909090909ms)
```

### Per-rule Performance

ESLint has a built-in method to track performance of individual rules. Setting the `TIMING` environment variable will trigger the display, upon linting completion, of the ten longest-running rules, along with their individual running time and relative performance impact as a percentage of total rule processing time.

```bash
$ TIMING=1 eslint lib
Rule                    | Time (ms) | Relative
:-----------------------|----------:|--------:
no-multi-spaces         |    52.472 |     6.1%
camelcase               |    48.684 |     5.7%
no-irregular-whitespace |    43.847 |     5.1%
valid-jsdoc             |    40.346 |     4.7%
handle-callback-err     |    39.153 |     4.6%
space-infix-ops         |    35.444 |     4.1%
no-undefined            |    25.693 |     3.0%
no-shadow               |    22.759 |     2.7%
no-empty-class          |    21.976 |     2.6%
semi                    |    19.359 |     2.3%
```

To test one rule explicitly, combine the `--no-eslintrc`, and `--rule` options:

```bash
$ TIMING=1 eslint --no-eslintrc --rule "quotes: [2, 'double']" lib
Rule   | Time (ms) | Relative
:------|----------:|--------:
quotes |    18.066 |   100.0%
```

## Rule Naming Conventions

The rule naming conventions for ESLint are fairly simple:

* If your rule is disallowing something, prefix it with `no-` such as `no-eval` for disallowing `eval()` and `no-debugger` for disallowing `debugger`.
* If your rule is enforcing the inclusion of something, use a short name without a special prefix.
* Use dashes between words.

## Runtime Rules

The thing that makes ESLint different from other linters is the ability to define custom rules at runtime. This is perfect for rules that are specific to your project or company and wouldn't make sense for ESLint to ship with. With runtime rules, you don't have to wait for the next version of ESLint or be disappointed that your rule isn't general enough to apply to the larger JavaScript community, just write your rules and include them at runtime.

Runtime rules are written in the same format as all other rules. Create your rule as you would any other and then follow these steps:

1. Place all of your runtime rules in the same directory (i.e., `eslint_rules`).
2. Create a [configuration file](../user-guide/configuring.md) and specify your rule ID error level under the `rules` key. Your rule will not run unless it has a value of `1` or `2` in the configuration file.
3. Run the [command line interface](../user-guide/command-line-interface.md) using the `--rulesdir` option to specify the location of your runtime rules.
