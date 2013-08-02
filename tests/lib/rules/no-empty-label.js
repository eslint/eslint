/**
 * @fileoverview Tests for no-empty-label rule.
 * @author Ilya Volodin
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

var RULE_ID = "no-empty-label";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

vows.describe(RULE_ID).addBatch({
    "when evaluating 'labeled: var a = 10;'": {

        topic: "labeled: var a = 10;",

        "should report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Unexpected label labeled");
            assert.include(messages[0].node.type, "LabeledStatement");
        }
    },

    "when evaluating a string 'labeled: for (var i=10; i; i--) { }'": {

        topic: "labeled: for (var i=10; i; i--) { }",

        "should not report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;
            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 0);
        }
    },

    "when evaluating a string 'labeled: while(i) {}'": {

        topic: "labeled: while(i) {}",

        "should not report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;
            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 0);
        }
    },

    "when evaluating a string 'labeled: do {} while (i)'": {

        topic: "labeled: do {} while (i)",

        "should not report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;
            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 0);
        }
    },

    "when evaluating a string 'labeled: switch(i) { case 1: break; default: break; }'": {

        topic: "labeled: switch(i) { case 1: break; default: break; }",

        "should not report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;
            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 0);
        }
    },    
}).export(module);
