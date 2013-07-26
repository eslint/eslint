/**
 * @fileoverview Tests for the no-todo rule
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

var RULE_ID = "no-todo";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

vows.describe(RULE_ID).addBatch({

    "when evaluating a comment that has a TODO block comment": {

        topic: "var foo = function() { bar(); /* TODO: fix this security hole before release */ }",

        "should report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Unexpected TODO comment");
            assert.include(messages[0].node.type, "Block");
        }
    },

    "when evaluating a comment that has a TODO line comment": {

        topic: "// TODO: fix this security hole before release",

        "should report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Unexpected TODO comment");
            assert.include(messages[0].node.type, "Line");
        }
    }


}).export(module);
