/**
 * @fileoverview Tests for undefined rule.
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

var RULE_ID = "no-undef-init";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

vows.describe(RULE_ID).addBatch({

    "when evaluating an empty var": {
        topic: "var a;",

        "should not die": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 0);
        }
    },

    "when evaluating 'var a = undefined'": {

        topic: "var a = undefined;",

        "should report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "It's not necessary to initialize 'a' to undefined.");
            assert.include(messages[0].node.type, "VariableDeclarator");
        }
    }
}).export(module);
