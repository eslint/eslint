/**
 * @fileoverview Tests for max-depth.
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

var RULE_ID = "max-depth";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

vows.describe(RULE_ID).addBatch({

    "when evaluating a function with blocks 3 deep and a threshold of 2": {

        topic: "function foo() { if (true) { if (false) { if (true) { } } } }",

        "should report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = [1, 2];

            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Blocks are nested too deeply (3).");
            assert.include(messages[0].node.type, "IfStatement");
        }
    },

    "when evaluating a function with blocks 3 deep and a threshold of 3": {

        topic: "function foo() { if (true) { if (false) { if (true) { } } } }",

        "should not report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = [1, 3];

            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 0);
        }
    },

    "when evaluating a function with blocks 3 deep and a default threshold (4)": {

        topic: "function foo() { if (true) { if (false) { if (true) { } } } }",

        "should not report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 0);
        }
    },

    "when evaluating a function with blocks 2 deep and a threshold of 1": {

        topic: "function foo() { if (true) {} else { for(;;) {} } }",

        "should report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = [1, 1];

            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Blocks are nested too deeply (2).");
            assert.include(messages[0].node.type, "ForStatement");
        }
    },

    "when evaluating a function with blocks 2 deep and a threshold of 1": {

        topic: "function foo() { while (true) { if (true) {} } }",

        "should report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = [1, 1];

            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Blocks are nested too deeply (2).");
            assert.include(messages[0].node.type, "IfStatement");
        }
    },

    "when evaluating a function with blocks 3 deep and a threshold of 1": {

        topic: "function foo() { while (true) { if (true) { if (false) { } } } }",

        "should report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = [1, 1];

            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 2);

            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Blocks are nested too deeply (2).");
            assert.include(messages[0].node.type, "IfStatement");

            assert.equal(messages[1].ruleId, RULE_ID);
            assert.equal(messages[1].message, "Blocks are nested too deeply (3).");
            assert.include(messages[1].node.type, "IfStatement");
        }
    }


}).export(module);
