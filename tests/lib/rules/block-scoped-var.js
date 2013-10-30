/**
 * @fileoverview Tests for block-scoped-var rule
 * @author Matt DuVall <http://www.mattduvall.com>
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

var RULE_ID = "block-scoped-var";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

vows.describe(RULE_ID).addBatch({

    "when evaluating 'function doSomething() { var f; if (true) { var build = true; } f = build; }'": {

        topic: "function doSomething() { var f; if (true) { var build = true; } f = build; }",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "build used outside of binding context.");
            assert.include(messages[0].node.type, "Identifier");
        }
    },

    "when evaluating 'function doSomething() { var build, f; if (true) { build = true; } f = build; }'": {

        topic: "function doSomething() { var build, f; if (true) { build = true; } f = build; }",

        "should not report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }
    },

    "when evaluating 'var build; function doSomething() { var f = build; }'": {

        topic: "var build; function doSomething() { var f = build; }",

        "should not report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }
    },

    "when evaluating 'function doSomething(e) { }'": {

        topic: "function doSomething(e) { }",

        "should not report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }
    },

    "when evaluating 'function doSomething() { try { var build = 1; } catch (e) { var f = build; } }'": {

        topic: "function doSomething() { try { var build = 1; } catch (e) { var f = build; } }",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "build used outside of binding context.");
            assert.include(messages[0].node.type, "Identifier");
        }
    },

    "when evaluating 'function doSomething(e) { var f = e; }'": {

        topic: "function doSomething(e) { var f = e; }",

        "should not report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }
    },

    "when evaluating 'function doSomething() { var f = doSomething; }'": {

        topic: "function doSomething() { var f = doSomething; }",

        "should not report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }
    },

    "when evaluating 'function foo() { } function doSomething() { var f = foo; }'": {

        topic: "function foo() { } function doSomething() { var f = foo; }",

        "should not report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }
    }

}).export(module);
