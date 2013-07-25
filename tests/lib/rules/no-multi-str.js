/**
 * @fileoverview Tests for no-multi-str rule.
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

var RULE_ID = "no-multi-str";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

vows.describe(RULE_ID).addBatch({

    "when evaluating 'var x = \"Line 1 \\\n Line 2\"'": {

        topic: "var x = 'Line 1 \\\n Line 2'",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Multiline support is limitted to browsers supporting ES5 only.");
            assert.include(messages[0].node.type, "Literal");
        }
    },

    "when evaluating 'test(\"Line 1 \\\n Line 2\")'": {

        topic: "test('Line 1 \\\n Line 2');",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Multiline support is limitted to browsers supporting ES5 only.");
            assert.include(messages[0].node.type, "Literal");
        }
    },

    "when evaluating 'var a = \"Line 1 Line 2\"'": {

        topic: "var a = 'Line 1 Line 2';",

        "should not report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }
    }
}).export(module);
