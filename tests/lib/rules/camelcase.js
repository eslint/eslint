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
            assert.equal(messages[0].message, "Non-camelcased identifier 'first_name' found.");
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


    "when evaluating 'dir = __dirname'": {

        topic: "dir = __dirname",

        "should report a violation when not in Node.JS mode": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Non-camelcased identifier '__dirname' found.");
            assert.include(messages[0].node.type, "Identifier");
            assert.include(messages[0].node.name, "__dirname");
        },

        "should not report a violation when in Node.JS mode": function(topic) {
            var config = { rules: {}, env: {} };
            config.rules[RULE_ID] = 1;
            config.env.nodejs = true;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }
    },

    "when evaluating 'dir = __filename'": {

        topic: "dir = __filename",

        "should report a violation when not in Node.JS mode": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Non-camelcased identifier '__filename' found.");
            assert.include(messages[0].node.type, "Identifier");
            assert.include(messages[0].node.name, "__filename");
        },

        "should not report a violation when in Node.JS mode": function(topic) {
            var config = { rules: {}, env: {} };
            config.rules[RULE_ID] = 1;
            config.env.nodejs = true;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }
    }

}).export(module);
