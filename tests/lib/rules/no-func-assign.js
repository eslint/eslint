/**
 * @fileoverview Tests for no-func-assign.
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

var RULE_ID = "no-func-assign";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

vows.describe(RULE_ID).addBatch({

    "when evaluating 'function foo() {}; foo = bar;'": {

        topic: "function foo() {}; foo = bar;",

        "should report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "'foo' is a function.");
            assert.include(messages[0].node.type, "AssignmentExpression");
        }
    },

    "when evaluating 'function foo() { foo = bar; }'": {

        topic: "function foo() { foo = bar; }",

        "should report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "'foo' is a function.");
            assert.include(messages[0].node.type, "AssignmentExpression");
        }
    },

    "when evaluating 'function foo() { var foo = bar; }'": {

        topic: "function foo() { var foo = bar; }",

        "should not report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 0);
        }
    },

    "when evaluating 'function foo(foo) { foo = bar; }'": {

        topic: "function foo(foo) { foo = bar; }",

        "should not report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 0);
        }
    },

    "when evaluating 'function foo() { var foo; foo = bar; }'": {

        topic: "function foo() { var foo; foo = bar; }",

        "should not report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 0);
        }
    },

    "when evaluating 'var foo = function() {}; foo = bar;'": {

        topic: "var foo = function() {}; foo = bar;",

        "should not report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 0);
        }
    },

    "when evaluating 'var foo = function() { foo = bar; };'": {

        topic: "var foo = function() { foo = bar; };",

        "should not report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 0);
        }
    },

    "when evaluating 'foo = bar; function foo() { };'": {

        topic: "foo = bar; function foo() { };",

        "should report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "'foo' is a function.");
            assert.include(messages[0].node.type, "AssignmentExpression");
        }
    },

}).export(module);
