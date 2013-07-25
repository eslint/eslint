/**
 * @fileoverview Tests for jQuery-find rule.
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

var RULE_ID = "jQuery-find";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

vows.describe(RULE_ID).addBatch({

    "when evaluating '$(\"div\", \"li\")'": {

        topic: "$('div', 'li')",

        "should report a violation": function(topic) {
            var config = { rules: {}, identifiers: {} };
            config.rules[RULE_ID] = 1;
            config.identifiers["jQuery"] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Use .find() instead of context.");
            assert.include(messages[0].node.type, "CallExpression");
        }
    },

    "when evaluating '$(\"div\"); test(\"div\", \"li\");'": {

        topic: "$('div'); test('div', 'li');",

        "should not report a violation": function(topic) {
            var config = { rules: {}, identifiers: {} };
            config.rules[RULE_ID] = 1;
            config.identifiers["jQuery"] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }
    }
}).export(module);