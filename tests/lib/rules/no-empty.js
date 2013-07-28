/**
 * @fileoverview Tests for no-empty rule.
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

var RULE_ID = "no-empty";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

vows.describe(RULE_ID).addBatch({

    "when evaluating 'if (foo) {}'": {

        topic: "if (foo) {}",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Empty block statement.");
            assert.include(messages[0].node.type, "BlockStatement");
        }
    },

    "when evaluating 'if (foo) { bar() }'": {

        topic: "if (foo) { bar() }",

        "should not report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }
    },

    "when evaluating 'while (foo) {}'": {

        topic: "while (foo) {}",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Empty block statement.");
            assert.include(messages[0].node.type, "BlockStatement");
        }
    },

    "when evaluating 'while (foo) { bar() }'": {

        topic: "while (foo) { bar() }",

        "should not report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }
    },

    "when evaluating 'for (;foo;) {}'": {

        topic: "for (;foo;) {}",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Empty block statement.");
            assert.include(messages[0].node.type, "BlockStatement");
        }
    },

    "when evaluating 'for (;foo;) { bar() }'": {

        topic: "for (;foo;) { bar() }",

        "should not report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }
    },

    "when evaluating 'try {} catch (ex) {}'": {

        topic: "try {} catch (ex) {}",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 2);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Empty block statement.");
            assert.include(messages[0].node.type, "BlockStatement");
            assert.equal(messages[1].ruleId, RULE_ID);
            assert.equal(messages[1].message, "Empty block statement.");
            assert.include(messages[1].node.type, "BlockStatement");
        }
    },

    "when evaluating 'try { foo() } catch (ex) {}'": {

        topic: "try { foo() } catch (ex) {}",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Empty block statement.");
            assert.include(messages[0].node.type, "BlockStatement");
        }
    },

    "when evaluating 'try { foo() } catch (ex) { foo() }'": {

        topic: "try { foo() } catch (ex) { foo() }",

        "should not report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }
    },

    "when evaluating 'switch(foo) {}'": {

        topic: "switch(foo) {}",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Empty switch statement.");
            assert.include(messages[0].node.type, "SwitchStatement");
        }
    },

    "when evaluating 'switch(foo) {case 'foo': break;}'": {

        topic: "switch(foo) {case 'foo': break;}",

        "should not report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }
    },

    "when evaluating '(function() { }())'": {

        topic: "(function() { }())",

        "should not report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }
    },

    "when evaluating 'function foo() { }'": {

        topic: "function foo() { }",

        "should not report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }
    }

}).export(module);
