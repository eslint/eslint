# Working with Rules

Each ESLint rule has two files: a source file in the `lib/rules` directory and a test file in the `tests/lib/rules` directory. Both files should be named with the rule ID (i.e., `no-eval.js` for rule ID `no-eval`) The basic source code format for a rule is:

```js
/**
 * @fileoverview Rule to flag use of an empty block statement
 * @author Nicholas C. Zakas
 * @copyright 2014 Nicholas C. Zakas. All rights reserved.
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    return {
        // properties go here
    };

};
```

**Important:** Rule submissions will not be accepted unless they are in this format.

## Rule Basics

Each rule is represented by a single object with several properties. The properties are equivalent to AST node types from [SpiderMonkey](https://developer.mozilla.org/en-US/docs/SpiderMonkey/Parser_API). For example, if your rule wants to know when an identifier is found in the AST, then add a method called "Identifier", such as:

```js
module.exports = function(context) {

    return {

        "Identifier": function(node) {
            // do something with node
        }
    };

};
```

Each method that matches a node in the AST will be passed the corresponding node. You can then evaluate the node and it's surrounding tree to determine whether or not an issue needs reporting.

By default, the method matching a node name is called during the traversal when the node is first encountered, on the way down the AST. You can also specify to visit the node on the other side of the traversal, as it comes back up the tree, but adding `:exit` to the end of the node type, such as:

```js
module.exports = function(context) {

    return {

        "Identifier:exit": function(node) {
            // do something with node
        }
    };

};
```

In this code, `"Identifier:exit"` is called on the way up the AST. This capability allows you to keep track as the traversal enters and exits specific parts of the AST.

## The Context Object

The `context` object contains additional functionality that is helpful for rules to do their jobs. As the name implies, the `context` object contains information that is relevant to the context of the rule. The `context` object has the following properties:

* `ecmaFeatures` - the language feature flags.
* `id` - the rule ID.
* `options` - an array of rule options.
* `settings` - the `settings` from configuration.

Additionally, the `context` object has the following methods:

* `getAllComments()` - returns an array of all comments in the source.
* `getAncestors()` - returns an array of ancestor nodes based on the current traversal.
* `getComments(node)` - returns the leading and trailing comments arrays for the given node.
* `getFilename()` - returns the filename associated with the source.
* `getFirstToken(node)` - returns the first token representing the given node.
* `getFirstTokens(node, count)` - returns the first `count` tokens representing the given node.
* `getJSDocComment(node)` - returns the JSDoc comment for a given node or `null` if there is none.
* `getLastToken(node)` - returns the last token representing the given node.
* `getLastTokens(node, count)` - returns the last `count` tokens representing the given node.
* `getScope()` - returns the current scope.
* `getSource(node)` - returns the source code for the given node. Omit `node` to get the whole source.
* `getSourceLines()` - returns the entire source code split into an array of string lines.
* `getTokenAfter(node)` - returns the first token after the given node.
* `getTokenBefore(node)` - returns the first token before the given node.
* `getTokenByRangeStart(index)` - returns the token whose range starts at the given index in the source.
* `getTokens(node)` - returns all tokens for the given node.
* `getTokensAfter(node, count)` - returns `count` tokens after the given node.
* `getTokensBefore(node, count)` - returns `count` tokens before the given node.
* `getTokensBetween(node1, node2)` - returns the tokens between two nodes.
* `report(node, message)` - reports an error in the code.

### context.report()

The main method you'll use is `context.report()`, which publishes a warning or error (depending on the configuration being used). This method accepts three arguments: the AST node that caused the report, a message to display, and an optional object literal which is used to interpolate. For example:

    context.report(node, "This is unexpected!");

or

    context.report(node, "`{{identifier}}` is unexpected!", { identifier: node.name });

The node contains all of the information necessary to figure out the line and column number of the offending text as well the source text representing the node.

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

### Getting the Source

If your rule needs to get the actual JavaScript source to work with, then use the `context.getSource()` method. This method works as follows:

```js

// get all source
var source = context.getSource();

// get source for just this AST node
var nodeSource = context.getSource(node);

// get source for AST node plus previous two characters
var nodeSourceWithPrev = context.getSource(node, 2);

// get source for AST node plus following two characters
var nodeSourceWithFollowing = context.getSource(node, 0, 2);
```

In this way, you can look for patterns in the JavaScript text itself when the AST isn't providing the appropriate data (such as location of commas, semicolons, parentheses, etc.).

### Accessing comments

If you need to access comments for a specific node you can use `context.getComments(node)`:

```js
// the "comments" variable has a "leading" and "trailing" property containing
// its leading and trailing comments, respectively
var comments = context.getComments(node);
```

Keep in mind that comments are technically not a part of the AST and are only attached to it on demand, i.e. when you call `getComments()`.

**Note:** One of the libraries adds AST node properties for comments - do not use these properties. Always use `context.getComments()` as this is the only guaranteed API for accessing comments (we will likely change how comments are handled later).

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
 * @copyright 2014 Nicholas C. Zakas. All rights reserved.
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslint = require("../../../lib/eslint"),
    ESLintTester = require("eslint-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var eslintTester = new ESLintTester(eslint);
eslintTester.addRuleTest("lib/rules/block-scoped-var", {

    // Examples of code that should not trigger the rule
    valid: [
        "function doSomething() { var build, f; if (true) { build = true; } f = build; }",
        "var build; function doSomething() { var f = build; }",
        "function doSomething(e) { }",
        "function doSomething(e) { var f = e; }",
        "function doSomething() { var f = doSomething; }",
        "function foo() { } function doSomething() { var f = foo; }"
    ],

    // Examples of code that should trigger the rule
    invalid: [
        {
            code: "function doSomething() { var f; if (true) { var build = true; } f = build; }",
            errors: [
                { message: "build used outside of binding context.", type: "Identifier" }
            ]
        },
        {
            code: "function doSomething() { try { var build = 1; } catch (e) { var f = build; } }",
            errors: [
                { message: "build used outside of binding context.", type: "Identifier" }
            ]
        }
    ]
});
```

Be sure to replace the value of `"block-scoped-var"` with your rule's ID. There are plenty of examples in the `tests/lib/rules/` directory.

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

You can also pass arguments to the rule (if it accepts them). These arguments are equivalent to how people can configure rules in their `.eslintrc` file. For example:

```js
valid: [
    {
        code: "var msg = 'Hello';",
        args: [1, "single" ]
    }
]
```

Your rule will then be passed the arguments just as if it can from a configuration file.

### Invalid Code

Each invalid case must be an object containing the code to test and at least the message that is produced by the rule. The `errors` key specifies an array of objects, each containing a message (your rule may trigger multiple messages for the same code). You should also specify the type of AST node you expect to receive back using the `type` key. The AST node should represent the actual spot in the code where there is a problem. For example:

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

Similar to the valid cases, you can also specify `args` to be passed to the rule:

```js
invalid: [
    {
        code: "function doSomething() { var f; if (true) { var build = true; } f = build; }",
        args: [ 1, "double" ],
        errors: [
            { message: "build used outside of binding context.", type: "Identifier" }
        ]
    }
]
```

### Write Many Tests

You must have at least one valid and one invalid case for the rule tests to pass. Provide as many unit tests as possible. Your pull request will never be turned down for having too many tests submitted with it!

## Performance Testing

To keep the linting process efficient and unobtrusive, it is useful to verify the performance impact of new rules or modifications to existing rules.

### Overall Performance

The `npm run perf` command gives a high-level overview of ESLint running time.

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

To test one rule explicitly, combine the `--reset`, `--no-eslintrc`, and `--rule` options:

```
$ TIMING=1 eslint --reset --no-eslintrc --rule "quotes: [2, 'double']" lib
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

Because rules are highly personal (and therefore very contentious), the following guidelines determine whether or not a rule is accepted and whether or not it is on by default:

* If the same rule exists in JSHint and is turned on by default, it must have the same message and be enabled by default.
* If the same rule exists in JSLint but not in JSHint, it must have the same message and be disabled by default.
* If the rule doesn't exist in JSHint or JSLint, then it must:
  * Not be library-specific.
  * Demonstrate a possible issue that can be resolved by rewriting the code.
  * Be general enough so as to apply for a large number of developers.

## Runtime Rules

The thing that makes ESLint different from other linters is the ability to define custom rules at runtime. This is perfect for rules that are specific to your project or company and wouldn't make sense for ESLint to ship with. With runtime rules, you don't have to wait for the next version of ESLint or be disappointed that your rule isn't general enough to apply to the larger JavaScript community, just write your rules and include them at runtime.

Runtime rules are written in the same format as all other rules. Create your rule as you would any other and then follow these steps:

1. Place all of your runtime rules in the same directory (i.e., `eslint_rules`).
2. Create a [configuration file](../configuring) and specify your rule ID error level under the `rules` key. Your rule will not run unless it has a value of `1` or `2` in the configuration file.
3. Run the [command line interface](../command-line-interface) using the `--rulesdir` option to specify the location of your runtime rules.
