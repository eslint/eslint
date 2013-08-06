/**
 * @fileoverview Tests for max-statements rule.
 * @author Ian Christian Myers
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

var RULE_ID = "max-statements";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

vows.describe(RULE_ID).addBatch({

    "when evaluating FunctionDeclaration with 3 statements and max-statements set to 2": {

        topic: "function foo() { var bar = 1; var baz = 2; var qux = 3; }",

        "should report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = [1, 2];

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "This function has too many statements (3). Maximum allowed is 2.");
        }
    },

    "when evaluating FunctionExpression with 3 statements and max-statements set to 2": {

        topic: "var foo = function() { var bar = 1; var baz = 2; var qux = 3; };",

        "should report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = [1, 2];

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "This function has too many statements (3). Maximum allowed is 2.");
        }
    },

    "when evaluating FunctionDeclaration 2 statements and max-statements set to 2": {

        topic: "var foo = { thing: function() { var bar = 1; var baz = 2; } }",

        "should not report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = [1, 2];

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }
    },

    "when evaluating with an inner function and max-statements set to 3": {

        topic: "function foo() { var bar = 1; function qux () { var noCount = 2; } return 3; }",

        "should not report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = [1, 3];

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }
    },

    "when evaluating with nested if/while and max-statements set to 4": {

        topic: "function foo() { var bar = 1; if (true) { while (false) { var qux = null; } } return 3; }",

        "should report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = [1, 4];

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "This function has too many statements (5). Maximum allowed is 4.");
        }
    },

    "when evaluating with nested if/for and max-statements set to 4": {

        topic: "function foo() { var bar = 1; if (true) { for (;;) { var qux = null; } } return 3; }",

        "should report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = [1, 4];

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "This function has too many statements (5). Maximum allowed is 4.");
        }
    },

    "when evaluating with nested if/else and max-statements set to 6": {

        topic: "function foo() { var bar = 1; if (true) { for (;;) { var qux = null; } } else { quxx(); } return 3; }",

        "should not report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = [1, 6];

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }
    },

    "when evaluating with nested if/else and max-statements set to 5": {

        topic: "function foo() { var bar = 1; if (true) { for (;;) { var qux = null; } } else { quxx(); } return 3; }",

        "should report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = [1, 5];

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "This function has too many statements (6). Maximum allowed is 5.");
        }
    },

    "when evaluating with function calls and nested function and max-statements set to 3": {

        topic: "function foo() { var x = 5; function bar() { var y = 6; } bar(); z = 10; baz(); }",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = [1, 3];

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "This function has too many statements (5). Maximum allowed is 3.");
        }
    },

    "when evaluating with function calls and nested function and max-statements set to 4": {

        topic: "function foo() { var x = 5; function bar() { var y = 6; } bar(); z = 10; baz(); }",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = [1, 4];

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "This function has too many statements (5). Maximum allowed is 4.");
        }
    },

    "when evaluating with function calls and nested function and max-statements set to 5": {

        topic: "function foo() { var x = 5; function bar() { var y = 6; } bar(); z = 10; baz(); }",

        "should not report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = [1, 5];

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }
    },

    "when evaluating a function with max-statements on, but no max option passed": {

        topic: "function foo() { var a; var b; var c; var x; var y; var z; bar(); baz(); qux(); quxx(); }",

        "should not report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }
    }

}).export(module);



