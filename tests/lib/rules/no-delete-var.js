/**
 * @fileoverview Tests for no-delete-var rule.
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

var RULE_ID = "no-delete-var";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

vows.describe(RULE_ID).addBatch({
    "when evaluating 'delete x'": {

        topic: "delete x;",

        "should report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Variables should not be deleted​");
            assert.include(messages[0].node.type, "UnaryExpression");
        }
    },

    "when evaluating a string 'delete x.prop'": {

        topic: "delete x.prop;",

        "should not report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;
            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 0);
        }
    }
}).export(module);
