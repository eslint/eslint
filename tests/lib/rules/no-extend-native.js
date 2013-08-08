/**
 * @fileoverview Tests for no-extend-native rule.
 * @author David Nelson
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

var RULE_ID = "no-extend-native";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

vows.describe(RULE_ID).addBatch({

    "when evaluating 'Object.prototype.something = \'warn\';'": {

        topic: "Object.prototype.something = 'warn';",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Object prototype is read only, properties should not be added.");
            assert.include(messages[0].node.type, "AssignmentExpression");
        }
    },

    "when evaluating 'object.prototype.something = \'allow\';'": {

        topic: "notNative.prototype.something = 'allow';",

        "should not report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }
    }

    // TODO: add all native objects.  model after no-extend-native's approach, works well.
    // TODO: check for reassignment of prototype as well
    // TODO: check for Object.create
    // TODO: check for Object.create polyfill

}).export(module);