/**
 * @fileoverview Tests for camelcase rule.
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

var RULE_ID = "camelcase";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

vows.describe(RULE_ID).addBatch({

    "when evaluating 'first_name = \"Nicholas\"'": {

        topic: "first_name = \"Nicholas\"",

        "should report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Identifier 'first_name' is not in camel case.");
            assert.include(messages[0].node.type, "Identifier");
            assert.include(messages[0].node.name, "first_name");
        }
    },

    "when evaluating 'firstName = \"Nicholas\"'": {

        topic: "firstName = \"Nicholas\"",

        "should not report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }
    },

    "when evaluating 'FIRST_NAME = \"Nicholas\"'": {

        topic: "FIRST_NAME = \"Nicholas\"",

        "should not report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }
    },

    "when evaluating '__myPrivateVariable = \"Patrick\"'": {

        topic: "__myPrivateVariable = \"Patrick\"",

        "should not report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }
    },

    "when evaluating 'myPrivateVariable_ = \"Patrick\"'": {

        topic: "myPrivateVariable_ = \"Patrick\"",

        "should not report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }
    },

    "when evaluating '__private_first_name = \"Patrick\"'": {

        topic: "__private_first_name = \"Patrick\"",

        "should report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Identifier '__private_first_name' is not in camel case.");
            assert.include(messages[0].node.type, "Identifier");
            assert.include(messages[0].node.name, "__private_first_name");
        }
    }

}).export(module);
