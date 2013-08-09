/**
 * @fileoverview Tests for no-extend-native rule.
 * @author David Nelson
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var vows = require("vows"),
    assert = require("assert"),
    eslint = require("../../../lib/eslint"),
    nativeObjects = require("../../../conf/native-objects.js").nativeObjects,
    i = 0,
    nativeObjectsLength = nativeObjects.length,
    batch = {},
    suite;

//------------------------------------------------------------------------------
// Constants
//------------------------------------------------------------------------------

var RULE_ID = "no-extend-native";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

suite = vows.describe(RULE_ID);

for(i; i < nativeObjectsLength; i++) {
    batch = {};

    batch["when evaluating '" + nativeObjects[i] + ".prototype.something = \'warn\';'"] = {

        topic: nativeObjects[i] + ".prototype.something = 'warn';",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, nativeObjects[i] + " prototype is read only, properties should not be added.");
            assert.include(messages[0].node.type, "AssignmentExpression");
        }
    };

    suite.addBatch(batch);
}

suite.addBatch({
    "when evaluating 'notNative.prototype.something = \'allow\';'": {

        topic: "notNative.prototype.something = 'allow';",

        "should not report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }
    }

    // TODO: check for reassignment of prototype as well
    // TODO: check for Object.create
    // TODO: check for Object.create polyfill

});

suite.export(module);