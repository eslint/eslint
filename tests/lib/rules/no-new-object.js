/**
 * @fileoverview Tests for the no-new-object rule
 * @author Matt DuVall <http://www.mattduvall.com/>
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

var RULE_ID = "no-new-object";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

vows.describe(RULE_ID).addBatch({

    "when evaluating new Object": {

        topic: "var foo = new Object()",

        "should report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "The object literal notation {} is preferrable.");
            assert.include(messages[0].node.type, "NewExpression");
        }
    },

    "when evaluating new foo.Object": {

        topic: "var foo = new foo.Object()",

        "should not report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }
    }

}).export(module);
