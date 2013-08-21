/**
 * @fileoverview Tests for break-case rule.
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

var RULE_ID = "break-case";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

vows.describe(RULE_ID).addBatch({
    "when evaluating 'switch (foo) { case 2: break; default: }'": {

        topic: "switch (foo) { case 2: break; default: }",

        "should report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Expected a 'break' statement in case statement.");
            assert.include(messages[0].node.type, "SwitchCase");
        }
    },

    "when evaluating 'switch (foo) { case 2: default: break; }'": {

        topic: "switch (foo) { case 2: default: break; }",

        "should report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Expected a 'break' statement in case statement.");
            assert.include(messages[0].node.type, "SwitchCase");
        }
    },

    "when evaluating 'switch (foo) { case 2: break; default: break; }'": {

        topic: "switch (foo) { case 2: break; default: break; }",

        "should not report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 0);
        }
    },

    "when evaluating 'function a() { switch (foo) { case 2: return foo; default: break; }}'": {

        topic: "function a() { switch (foo) { case 2: return foo; default: break; }}",

        "should not report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 0);
        }
    }
}).export(module);
