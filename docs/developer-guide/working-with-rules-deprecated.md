# Working with Rules

Each rule in ESLint has two files named with its identifier (for example, `no-extra-semi`).

* in the `lib/rules` directory: a source file (for example, `no-extra-semi.js`)
* in the `tests/lib/rules` directory: a test file (for example, `no-extra-semi.js`)

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

module.exports = function(context) {
    return {
        // callback functions
    };
};

module.exports.schema = []; // no options
```

## Rule Basics

`schema` (array) specifies the [options](#options-schemas) so ESLint can prevent invalid [rule configurations](../user-guide/configuring.md#configuring-rules)

`create` (function) returns an object with methods that ESLint calls to "visit" nodes while traversing the abstract syntax tree (AST as defined by [ESTree](https://github.com/estree/estree)) of JavaScript code:

* if a key is a node type, ESLint calls that **visitor** function while going **down** the tree
* if a key is a node type plus `:exit`, ESLint calls that **visitor** function while going **up** the tree
* if a key is an event name, ESLint calls that **handler** function for [code path analysis](./code-path-analysis.md)

A rule can use the current node and its surrounding tree to report or fix problems.

Here are methods for the [array-callback-return](../rules/array-callback-return.md) rule:

```js
function checkLastSegment (node) {
    // report problem for function if last code path segment is reachable
}

module.exports = function(context) {
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
};
```

## The Context Object

The `context` object contains additional functionality that is helpful for rules to do their jobs. As the name implies, the `context` object contains information that is relevant to the context of the rule. The `context` object has the following properties:

* `parserOptions` - the parser options configured for this run (more details [here](../user-guide/configuring.md#specifying-parser-options)).
* `id` - the rule ID.
* `options` - an array of rule options.
* `settings` - the `settings` from configuration.
* `parserPath` - the full path to the `parser` from configuration.

Additionally, the `context` object has the following methods:

* `getAncestors()` - returns an array of ancestor nodes based on the current traversal.
* `getDeclaredVariables(node)` - returns the declared variables on the given node.
* `getFilename()` - returns the filename associated with the source.
* `getScope()` - returns the current scope.
* `getSourceCode()` - returns a `SourceCode` object that you can use to work with the source that was passed to ESLint
* `markVariableAsUsed(name)` - marks the named variable in scope as used. This affects the [no-unused-vars](../rules/no-unused-vars.md) rule.
* `report(descriptor)` - reports a problem in the code.

**Deprecated:** The following methods on the `context` object are deprecated. Please use the corresponding methods on `SourceCode` instead:

* `getAllComments()` - returns an array of all comments in the source. Use `sourceCode.getAllComments()` instead.
* `getComments(node)` - returns the leading and trailing comments arrays for the given node. Use `sourceCode.getComments(node)` instead.
* `getFirstToken(node)` - returns the first token representing the given node. Use `sourceCode.getFirstToken(node)` instead.
* `getFirstTokens(node, count)` - returns the first `count` tokens representing the given node. Use `sourceCode.getFirstTokens(node, count)` instead.
* `getJSDocComment(node)` - returns the JSDoc comment for a given node or `null` if there is none. Use `sourceCode.getJSDocComment(node)` instead.
* `getLastToken(node)` - returns the last token representing the given node.  Use `sourceCode.getLastToken(node)` instead.
* `getLastTokens(node, count)` - returns the last `count` tokens representing the given node. Use `sourceCode.getLastTokens(node, count)` instead.
* `getNodeByRangeIndex(index)` - returns the deepest node in the AST containing the given source index. Use `sourceCode.getNodeByRangeIndex(index)` instead.
* `getSource(node)` - returns the source code for the given node. Omit `node` to get the whole source. Use `sourceCode.getText(node)` instead.
* `getSourceLines()` - returns the entire source code split into an array of string lines. Use `sourceCode.lines` instead.
* `getTokenAfter(nodeOrToken)` - returns the first token after the given node or token. Use `sourceCode.getTokenAfter(nodeOrToken)` instead.
* `getTokenBefore(nodeOrToken)` - returns the first token before the given node or token. Use `sourceCode.getTokenBefore(nodeOrToken)` instead.
* `getTokenByRangeStart(index)` - returns the token whose range starts at the given index in the source. Use `sourceCode.getTokenByRangeStart(index)` instead.
* `getTokens(node)` - returns all tokens for the given node. Use `sourceCode.getTokens(node)` instead.
* `getTokensAfter(nodeOrToken, count)` - returns `count` tokens after the given node or token. Use `sourceCode.getTokensAfter(nodeOrToken, count)` instead.
* `getTokensBefore(nodeOrToken, count)` - returns `count` tokens before the given node or token. Use `sourceCode.getTokensBefore(nodeOrToken, count)` instead.
* `getTokensBetween(node1, node2)` - returns the tokens between two nodes. Use `sourceCode.getTokensBetween(node1, node2)` instead.
* `report(node, [location], message)` - reports a problem in the code.

### context.report()

The main method you'll use is `context.report()`, which publishes a warning or error (depending on the configuration being used). This method accepts a single argument, which is an object containing the following properties:

* `message` - the problem message.
* `node` - (optional)  the AST node related to the problem. If present and `loc` is not specified, then the starting location of the node is used as the location of the problem.
* `loc` - (optional) an object specifying the location of the problem. If both `loc` and `node` are specified, then the location is used from `loc` instead of `node`.
    * `line` - the 1-based line number at which the problem occurred.
    * `column` - the 0-based column number at which the problem occurred.
* `data` - (optional) placeholder data for `message`.
* `fix` - (optional) a function that applies a fix to resolve the problem.

Note that at least one of `node` or `loc` is required.

The simplest example is to use just `node` and `message`:

```js
context.report({
    node: node,
    message: "Unexpected identifier"
});
```

The node contains all of the information necessary to figure out the line and column number of the offending text as well the source text representing the node.

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

### Applying Fixes

If you'd like ESLint to attempt to fix the problem you're reporting, you can do so by specifying the `fix` function when using `context.report()`. The `fix` function receives a single argument, a `fixer` object, that you can use to apply a fix. For example:

```js
context.report({
    node: node,
    message: "Missing semicolon".
    fix: function(fixer) {
        return fixer.insertTextAfter(node, ";");
    }
});
```

Here, the `fix()` function is used to insert a semicolon after the node. Note that the fix is not immediately applied and may not be applied at all if there are conflicts with other fixes. If the fix cannot be applied, then the problem message is reported as usual; if the fix can be applied, then the problem message is not reported.

The `fixer` object has the following methods:

* `insertTextAfter(nodeOrToken, text)` - inserts text after the given node or token
* `insertTextAfterRange(range, text)` - inserts text after the given range
* `insertTextBefore(nodeOrToken, text)` - inserts text before the given node or token
* `insertTextBeforeRange(range, text)` - inserts text before the given range
* `remove(nodeOrToken)` - removes the given node or token
* `removeRange(range)` - removes text in the given range
* `replaceText(nodeOrToken, text)` - replaces the text in the given node or token
* `replaceTextRange(range, text)` - replaces the text in the given range

Best practices for fixes:

1. Make fixes that are as small as possible. Anything more than a single character is risky and could prevent other, simpler fixes from being made.
1. Only make one fix per message. This is enforced because you must return the result of the fixer operation from `fix()`.
1. Fixes should not introduce clashes with other rules. You can accidentally introduce a new problem that won't be reported until ESLint is run again. Another good reason to make as small a fix as possible.

### context.options

Some rules require options in order to function correctly. These options appear in configuration (`.eslintrc`, command line, or in comments). For example:

```json
{
    "quotes": [2, "double"]
}
```

The `quotes` rule in this example has one option, `"double"` (the `2` is the error level). You can retrieve the options for a rule by using `context.options`, which is an array containing every configured option for the rule. In this case, `context.options[0]` would contain `"double"`:

```js
module.exports = function(context) {

    var isDouble = (context.options[0] === "double");

    // ...
}
```

Since `context.options` is just an array, you can use it to determine how many options have been passed as well as retrieving the actual options themselves. Keep in mind that the error level is not part of `context.options`, as the error level cannot be known or modified from inside a rule.

When using options, make sure that your rule has some logic defaults in case the options are not provided.

### context.getSourceCode()

The `SourceCode` object is the main object for getting more information about the source code being linted. You can retrieve the `SourceCode` object at any time by using the `getSourceCode()` method:

```js
module.exports = function(context) {

    var sourceCode = context.getSourceCode();

    // ...
}
```

Once you have an instance of `SourceCode`, you can use the methods on it to work with the code:

* `getAllComments()` - returns an array of all comments in the source.
* `getComments(node)` - returns the leading and trailing comments arrays for the given node.
* `getFirstToken(node)` - returns the first token representing the given node.
* `getFirstTokens(node, count)` - returns the first `count` tokens representing the given node.
* `getJSDocComment(node)` - returns the JSDoc comment for a given node or `null` if there is none.
* `getLastToken(node)` - returns the last token representing the given node.
* `getLastTokens(node, count)` - returns the last `count` tokens representing the given node.
* `getNodeByRangeIndex(index)` - returns the deepest node in the AST containing the given source index.
* `isSpaceBetweenTokens(first, second)` - returns true if there is a whitespace character between the two tokens.
* `getText(node)` - returns the source code for the given node. Omit `node` to get the whole source.
* `getTokenAfter(nodeOrToken)` - returns the first token after the given node or token.
* `getTokenBefore(nodeOrToken)` - returns the first token before the given node or token.
* `getTokenByRangeStart(index)` - returns the token whose range starts at the given index in the source.
* `getTokens(node)` - returns all tokens for the given node.
* `getTokensAfter(nodeOrToken, count)` - returns `count` tokens after the given node or token.
* `getTokensBefore(nodeOrToken, count)` - returns `count` tokens before the given node or token.
* `getTokensBetween(node1, node2)` - returns the tokens between two nodes.

There are also some properties you can access:

* `hasBOM` - the flag to indicate whether or not the source code has Unicode BOM.
* `text` - the full text of the code being linted. Unicode BOM has been stripped from this text.
* `ast` - the `Program` node of the AST for the code being linted.
* `lines` - an array of lines, split according to the specification's definition of line breaks.

You should use a `SourceCode` object whenever you need to get more information about the code being linted.

### Options Schemas

Rules may export a `schema` property, which is a [JSON schema](http://json-schema.org/) format description of a rule's options which will be used by ESLint to validate configuration options and prevent invalid or unexpected inputs before they are passed to the rule in `context.options`.

There are two formats for a rule's exported `schema`. The first is a full JSON Schema object describing all possible options the rule accepts, including the rule's error level as the first argument and any optional arguments thereafter.

However, to simplify schema creation, rules may also export an array of schemas for each optional positional argument, and ESLint will automatically validate the required error level first. For example, the `yoda` rule accepts a primary mode argument, as well as an extra options object with named properties.

```js
// "yoda": [2, "never", { "exceptRange": true }]
module.exports.schema = [
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
];
```

In the preceding example, the error level is assumed to be the first argument. It is followed by the first optional argument, a string which may be either `"always"` or `"never"`. The final optional argument is an object, which may have a Boolean property named `exceptRange`.

To learn more about JSON Schema, we recommend looking at some [examples](http://json-schema.org/examples.html) to start, and also reading [Understanding JSON Schema](http://spacetelescope.github.io/understanding-json-schema/) (a free ebook).

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

### Accessing comments

If you need to access comments for a specific node you can use `sourceCode.getComments(node)`:

```js
// the "comments" variable has a "leading" and "trailing" property containing
// its leading and trailing comments, respectively
var comments = sourceCode.getComments(node);
```

Keep in mind that comments are technically not a part of the AST and are only attached to it on demand, i.e. when you call `getComments()`.

**Note:** One of the libraries adds AST node properties for comments - do not use these properties. Always use `sourceCode.getComments()` as this is the only guaranteed API for accessing comments (we will likely change how comments are handled later).

### Accessing Code Paths

ESLint analyzes code paths while traversing AST.
You can access that code path objects with five events related to code paths.

[details here](./code-path-analysis.md)

## Rule Unit Tests

Each rule must have a set of unit tests submitted with it to be accepted. The test file is named the same as the source file but lives in `tests/lib/`. For example, if your rule source file is `lib/rules/foo.js` then your test file should be `tests/lib/rules/foo.js`.

For your rule, be sure to test:

1. All instances that should be flagged as warnings.
1. At least one pattern that should **not** be flagged as a warning.

The basic pattern for a rule unit test file is:

```js
/**
 * @fileoverview Tests for no-with rule.
 * @author Nicholas C. Zakas
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/no-with"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("no-with", rule, {
    valid: [
        "foo.bar()"
    ],
    invalid: [
        {
            code: "with(foo) { bar() }",
            errors: [{ message: "Unexpected use of 'with' statement.", type: "WithStatement"}]
        }
    ]
});
```

Be sure to replace the value of `"no-with"` with your rule's ID. There are plenty of examples in the `tests/lib/rules/` directory.

### Valid Code

Each valid case can be either a string or an object. The object form is used when you need to specify additional global variables or arguments for the rule. For example, the following defines `window` as a global variable for code that should not trigger the rule being tested:

```js
valid: [
    {
        code: "window.alert()",
        globals: [ "window" ]
    }
]
```

You can also pass options to the rule (if it accepts them). These arguments are equivalent to how people can configure rules in their `.eslintrc` file. For example:

```js
valid: [
    {
        code: "var msg = 'Hello';",
        options: [ "single" ]
    }
]
```

The `options` property must be an array of options. This gets passed through to `context.options` in the rule.

### Invalid Code

Each invalid case must be an object containing the code to test and at least one message that is produced by the rule. The `errors` key specifies an array of objects, each containing a message (your rule may trigger multiple messages for the same code). You should also specify the type of AST node you expect to receive back using the `type` key. The AST node should represent the actual spot in the code where there is a problem. For example:

```js
invalid: [
    {
        code: "function doSomething() { var f; if (true) { var build = true; } f = build; }",
        errors: [
            { message: "build used outside of binding context.", type: "Identifier" }
        ]
    }
]
```

In this case, the message is specific to the variable being used and the AST node type is `Identifier`.

Similar to the valid cases, you can also specify `options` to be passed to the rule:

```js
invalid: [
    {
        code: "function doSomething() { var f; if (true) { var build = true; } f = build; }",
        options: [ "double" ],
        errors: [
            { message: "build used outside of binding context.", type: "Identifier" }
        ]
    }
]
```

For simpler cases where the only thing that really matters is the error message, you can also specify any `errors` as strings. You can also have some strings and some objects, if you like.

```js
invalid: [
    {
        code: "'single quotes'",
        options: ["double"],
        errors: ["Strings must use doublequote."]
    }
]
```

### Specifying Parser Options

Some tests require that a certain parser configuration must be used. This can be specified in test specifications via the `parserOptions` setting.

For example, to set `ecmaVersion` to 6 (in order to use constructs like `for ... of`):

```js
valid: [
    {
        code: "for (x of a) doSomething();",
        parserOptions: { ecmaVersion: 6 }
    }
]
```

If you are working with ES6 modules:

```js
valid: [
    {
        code: "export default function () {};",
        parserOptions: { ecmaVersion: 6, sourceType: "module" }
    }
]
```

For non-version specific features such as JSX:

```js
valid: [
    {
        code: "var foo = <div>{bar}</div>",
        parserOptions: { ecmaFeatures: { jsx: true } }
    }
]
```

The options available and the expected syntax for `parserOptions` is the same as those used in [configuration](../user-guide/configuring.md#specifying-parser-options).

### Write Several Tests

Provide as many unit tests as possible. Your pull request will never be turned down for having too many tests submitted with it!

## Performance Testing

To keep the linting process efficient and unobtrusive, it is useful to verify the performance impact of new rules or modifications to existing rules.

### Overall Performance

The `npm run perf` command gives a high-level overview of ESLint running time with default rules (`eslint:recommended`) enabled.

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
* Keep your rule names as short as possible, use abbreviations where appropriate, and no more than four words.
* Use dashes between words.

## Rule Acceptance Criteria

Because rules are highly personal (and therefore very contentious), accepted rules should:

* Not be library-specific.
* Demonstrate a possible issue that can be resolved by rewriting the code.
* Be general enough so as to apply for a large number of developers.
* Not be the opposite of an existing rule.
* Not overlap with an existing rule.

## Runtime Rules

The thing that makes ESLint different from other linters is the ability to define custom rules at runtime. This is perfect for rules that are specific to your project or company and wouldn't make sense for ESLint to ship with. With runtime rules, you don't have to wait for the next version of ESLint or be disappointed that your rule isn't general enough to apply to the larger JavaScript community, just write your rules and include them at runtime.

Runtime rules are written in the same format as all other rules. Create your rule as you would any other and then follow these steps:

1. Place all of your runtime rules in the same directory (i.e., `eslint_rules`).
2. Create a [configuration file](../user-guide/configuring.md) and specify your rule ID error level under the `rules` key. Your rule will not run unless it has a value of `1` or `2` in the configuration file.
3. Run the [command line interface](../user-guide/command-line-interface.md) using the `--rulesdir` option to specify the location of your runtime rules.
