---
title: ESLint
layout: default
---
# Working with Rules

Each ESLint rule has two files: a source file in the `lib/rules` directory and a test file in the `tests/lib/rules` directory. Both files should be named with the rule ID (i.e., `no-eval.js` for rule ID `no-eval`) The basic source code format for a rule is:

{% highlight javascript %}
/**
 * @fileoverview Rule to flag use of an empty block statement
 * @author Nicholas C. Zakas
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    return {
        // properties go here
    };

};
{% endhighlight %}

**Important:** Rule submissions will not be accepted unless they are in this format.

Each rule is represented by a single object with several properties. The properties are equivalent to AST node types from [SpiderMonkey](https://developer.mozilla.org/en-US/docs/SpiderMonkey/Parser_API). For example, if your rule wants to know when an identifier is found in the AST, then add a method called "Identifier", such as:

{% highlight javascript %}
module.exports = function(context) {

    return {

        "Identifier": function(node) {
            // do something with node
        }
    };

};
{% endhighlight %}

Each method that matches a node in the AST will be passed the corresponding node. You can then evaluate the node and it's surrounding tree to determine whether or not an issue needs reporting.

The main method you'll use is `context.report()`, which publishes a warning or error (depending on the configuration being used). This method accepts two arguments: the AST node that caused the report and a message to display. For example:

    context.report(node, "This is unexpected!");

The node contains all of the information necessary to figure out the line and column number of the offending text as well the source text representing the node.

### Getting the Source

If your rule needs to get the actual JavaScript source to work with, then use the `context.getSource()` method. This method works as follows:

{% highlight javascript %}

// get all source
var source = context.getSource();

// get source for just this AST node
var nodeSource = context.getSource(node);

// get source for AST node plus previous two characters
var nodeSourceWithPrev = context.getSource(node, 2);

// get source for AST node plus following two characters
var nodeSourceWithFollowing = context.getSource(node, 0, 2);
{% endhighlight %}

In this way, you can look for patterns in the JavaScript text itself when the AST isn't providing the appropriate data (such as location of commas, semicolons, parentheses, etc.).

## Rule Unit Tests

Each rule must have a set of unit tests submitted with it to be accepted. The test file is named the same as the source file but lives in `tests/lib/`. For example, if your rule source file is `lib/rules/foo.js` then your test file should be `tests/lib/rules/foo.js`.

For your rule, be sure to test:

1. All instances that should be flagged as warnings.
1. At least one pattern that should **not** be flagged as a warning.

The basic pattern for a rule unit test file is:

{% highlight javascript %}
/**
 * @fileoverview Tests for no-with rule.
 * @author Nicholas C. Zakas
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var vows = require("vows"),
    assert = require("assert"),
    eslint = require("../../../lib/eslint");

//------------------------------------------------------------------------------
// Constants
//------------------------------------------------------------------------------

var RULE_ID = "no-with";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

vows.describe(RULE_ID).addBatch({

    "when evaluating '<some code>'": {

        topic: "<some code>",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "<rule message>");
            assert.include(messages[0].node.type, "<expected node type>");
        }
    },

    "when evaluating '<some other code>'": {

        topic: "<some other code>",

        "should not report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }
    }

}).export(module);
{% endhighlight %}

Be sure to replace the value of `RULE_ID` with your rule's ID. Also, replace `<some code>` and `<some other code>` with some appropriate code strings to test. There are plenty of examples in the `tests/lib/rules/` directory.

You should always check the number of messages as your first assert. This ensures that there aren't any more or less messages than you're expecting. Assuming there are no syntax errors, only your rule will produce messages. The second step is to ensure the type of message is correct. All rules output warnings, so check that this true for each message. Lastly, test the actual message text to ensure it's delivering the correct message to the user. You may also want to test if the returned AST node is the correct one.

Provide as many unit tests as possible. Your pull request will never be turned down for having too many tests submitted with it!

## Rule Naming Conventions

The rule naming conventions for ESLint are fairly simple:

* If your rule is disallowing something, prefix it with `no-` such as `no-eval` for disallowing `eval()` and `no-debugger` for disallowing `debugger`.
* If your rule is enforcing the inclusion of something, use a short name without a special prefix.
* Keep your rule names as short as possible, use abbreviations where appropriate, and no more than four words.
* Use dashes between words.
