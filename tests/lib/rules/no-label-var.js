/**
 * @fileoverview Tests for no-label-var rule.
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

var RULE_ID = "no-label-var";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

vows.describe(RULE_ID).addBatch({

    "when evaluating a label that is the same name as a global identifier": {

        topic: "var x = foo; function bar() { x: for(;;) { break x; } }",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Found identifier with same name as label.");
            assert.include(messages[0].node.type, "LabeledStatement");
        }
    },

    "when evaluating a label that is the same as identifier in function scope": {

        topic: "function bar() { var x = foo; x: for(;;) { break x; } }",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Found identifier with same name as label.");
            assert.include(messages[0].node.type, "LabeledStatement");
        }
    },

    "when evaluating a label that is the same as identifier function parameter": {

        topic: "function bar(x) { x: for(;;) { break x; } }",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Found identifier with same name as label.");
            assert.include(messages[0].node.type, "LabeledStatement");
        }
    },

    "when evaluating a label that has the same name as an identifier in a different scope": {

        topic: "function bar() { q: for(;;) { break q; } } function foo () { var q = t; }",

        "should not report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }
    },

    "when evaluating a label that is that has a unique name": {

        topic: "function bar() { var x = foo; q: for(;;) { break q; } }",

        "should not report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }
    }

}).export(module);
