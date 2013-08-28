/**
 * @fileoverview Tests for no-octal-escape rule.
 * @author Ian Christian Myers
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

var RULE_ID = "no-octal-escape";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

vows.describe(RULE_ID).addBatch({
    "when evaluating 'var foo = \"foo \\251 bar\";'": {

        topic: "var foo = \"foo \\251 bar\";",

        "should report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Don't use octal: '\\2'. Use '\\u....' instead.");
            assert.include(messages[0].node.type, "Literal");
        }
    },

    "when evaluating 'var foo = \"\\751\";'": {

        topic: "var foo = \"\\751\";",

        "should report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Don't use octal: '\\7'. Use '\\u....' instead.");
            assert.include(messages[0].node.type, "Literal");
        }
    },


    "when evaluating 'var foo = \"\\3s51\";'": {

        topic: "var foo = \"\\3s51\";",

        "should report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Don't use octal: '\\3'. Use '\\u....' instead.");
            assert.include(messages[0].node.type, "Literal");
        }
    },


    "when evaluating 'var foo = \"\\851\";'": {

        topic: "var foo = \"\\851\";",

        "should not report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }
    },

    "when evaluating 'var foo = \"foo \\\\251 bar\";'": {

        topic: "var foo = \"foo \\\\251 bar\";",

        "should not report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }
    },

    "when evaluating 'var foo = \"\\\\\\751\";'": {

        topic: "var foo = \"\\\\\\751\";",

        "should report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Don't use octal: '\\7'. Use '\\u....' instead.");
            assert.include(messages[0].node.type, "Literal");
        }
    },

}).export(module);
