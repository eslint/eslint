/**
 * @fileoverview Tests for no-global-strict rule.
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

var RULE_ID = "no-global-strict";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

vows.describe(RULE_ID).addBatch({

    "when evaluating global strict mode": {

        topic: "\"use strict\"; function foo() \n { \n return; }",

        "should report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Use the function form of \"use strict\".");
            assert.include(messages[0].node.type, "ExpressionStatement");
        }
    },

    "when evaluating function-level strict mode": {

        topic: "function foo () { \"use strict\"; return; }",

        "should not report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 0);
        }
    }

}).export(module);
