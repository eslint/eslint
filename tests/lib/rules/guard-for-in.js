/**
 * @fileoverview Tests for guard-for-in rule.
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

var RULE_ID = "guard-for-in";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

vows.describe(RULE_ID).addBatch({

    "when evaluating 'for (var x in o) {}'": {

        topic: "for (var x in o) {}",   // no code in body, so can't be wrong

        "should not report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }
    },

    "when evaluating 'for (var x in o) { foo() }'": {

        topic: "for (var x in o) { foo() }",

        "should report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "The body of a for-in should be wrapped in an if statement to filter unwanted properties from the prototype.");
            assert.include(messages[0].node.type, "ForInStatement");
        }
    },

    "when evaluating 'for (var x in o) foo();'": {

        topic: "for (var x in o) foo();",

        "should report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "The body of a for-in should be wrapped in an if statement to filter unwanted properties from the prototype.");
            assert.include(messages[0].node.type, "ForInStatement");
        }
    },

    "when evaluating 'for (var x in o) { if (x) {}}'": {

        topic: "for (var x in o) { if (x) {}}",

        "should not report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }
    }

}).export(module);
