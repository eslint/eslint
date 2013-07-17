/**
 * @fileoverview Tests for use-isnan rule.
 * @author James Allardice
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

var RULE_ID = "use-isnan";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

vows.describe(RULE_ID).addBatch({

    "when evaluating '123 === NaN;'": {

        topic: "123 === NaN;",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Use the isNaN function to compare with NaN.");
            assert.include(messages[0].node.type, "BinaryExpression");
        }
    },

    "when evaluating 'NaN == \"abc\";'": {

        topic: "NaN == \"abc\";",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Use the isNaN function to compare with NaN.");
            assert.include(messages[0].node.type, "BinaryExpression");
        }
    }

}).export(module);
