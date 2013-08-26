/**
 * @fileoverview Tests for no-iterator rule.
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

var RULE_ID = "no-iterator";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

vows.describe(RULE_ID).addBatch({
    "when evaluating 'var a = test.__iterator__;": {

        topic: "var a = test.__iterator__;",

        "should report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Reserved name '__iterator__'.");
            assert.include(messages[0].node.type, "MemberExpression");
        }
    },

    "when evaluating 'var a = test[__iterator__];": {

        topic: "var a = test[__iterator__];",

        "should not report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }
    },

    "when evaluating 'Foo.prototype.__iterator__ = function () {};": {

        topic: "Foo.prototype.__iterator__ = function () {};",

        "should report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Reserved name '__iterator__'.");
            assert.include(messages[0].node.type, "MemberExpression");
        }
    },

    "when evaluating 'var a = test[\"__iterator__\"];": {

        topic: "var a = test['__iterator__'];",

        "should report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Reserved name '__iterator__'.");
            assert.include(messages[0].node.type, "MemberExpression");
        }
    },

    "when evaluating a string 'var __iterator__ = null;": {

        topic: "var __iterator__ = null;",

        "should not report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;
            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 0);
        }
    }
}).export(module);
