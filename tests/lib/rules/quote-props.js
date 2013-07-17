/**
 * @fileoverview Tests for quote-props rule.
 * @author Mathias Bynens <http://mathiasbynens.be/>
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

var RULE_ID = "quote-props";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

vows.describe(RULE_ID).addBatch({

    "when evaluating `var x = { foo: 42 }`": {

        topic: "var x = { foo: 42 }",

        "should report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Non-quoted property `foo` found.");
            assert.include(messages[0].node.type, "Property");
            assert.include(messages[0].node.key.name, "foo");
        }
    },

    "when evaluating `var x = { 'foo': 42 }`": {

        topic: "var x = { 'foo': 42 }",

        "should not report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }
    },

    "when evaluating `var x = { \"foo\": 42 }`": {

        topic: "var x = { \"foo\": 42 }",

        "should not report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }
    }

}).export(module);
