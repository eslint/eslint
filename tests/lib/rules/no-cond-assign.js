/**
 * @fileoverview Tests for no-cond-assign rule.
 * @author Stephen Murray <spmurrayzzz>
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

var RULE_ID = "no-cond-assign";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

vows.describe(RULE_ID).addBatch({

    "when evaluating 'var x; if (x = 0) { var b = 1; }'": {

        topic: "var x; if (x = 0) { var b = 1; }",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message,
                    "Expected a conditional expression and instead saw an assignment.");
            assert.include(messages[0].node.type, "IfStatement");
        }
    },

    "when evaluating 'var x; while (x = 0) { var b = 1; }'": {

        topic: "var x; while (x = 0) { var b = 1; }",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message,
                    "Expected a conditional expression and instead saw an assignment.");
            assert.include(messages[0].node.type, "WhileStatement");
        }
    },

    "when evaluating 'var x = 0, y; do { y = x; } while (x = x + 1);'": {

        topic: "var x = 0, y; do { y = x; } while (x = x + 1);",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message,
                    "Expected a conditional expression and instead saw an assignment.");
            assert.include(messages[0].node.type, "DoWhileStatement");
        }
    },

    "when evaluating 'var x = 0; for(; x+=1 ;){};'": {

        topic: "var x; for(; x+=1 ;){};",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message,
                    "Expected a conditional expression and instead saw an assignment.");
            assert.include(messages[0].node.type, "ForStatement");
        }
    },

    "when evaluating 'var x = 0; if (x == 0) { var b = 1; }'": {

        topic: "var x = 0; if (x == 0) { var b = 1; }",

        "should not report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }
    },

    "when evaluating 'var x = 5; while (x < 5) { x = x + 1; }'": {

        topic: "var x = 5; while (x < 5) { x = x + 1; }",

        "should not report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }
    },

    "when evaluating 'var x = 0; do { x = x + 1; } while (x < 5);'": {

        topic: "var x = 0; if (x == 0) { var b = 1; }",

        "should not report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }
    },

    "when evaluating 'if ((someNode = someNode.parentNode) !== null) { }'": {

        topic: "if ((someNode = someNode.parentNode) !== null) { }",

        "should not report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 0);
        }
    }

}).export(module);
