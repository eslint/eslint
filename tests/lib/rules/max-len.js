/**
 * @fileoverview Tests for max-len rule.
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

var RULE_ID = "max-len";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

vows.describe(RULE_ID).addBatch({

    "when evaluating 'var x = 5\nvar x = 2;'": {

        topic: 'var x = 5;\nvar x = 2;',

        "should report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = [1, 80, 4];

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }
    },

    "when evaluating 'var x = 5, y = 2, z = 5;'": {

        topic: 'var x = 5, y = 2, z = 5;',

        "should report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = [1, 10, 4];

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Line 0 exceeds the maximum line length of 10.");
            assert.include(messages[0].node.type, "Program");
        }
    },

    "when evaluating '\t\t\tvar i = 1;'": {

        topic: '\t\t\tvar i = 1;',

        "should report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = [1, 15, 4];

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Line 0 exceeds the maximum line length of 15.");
            assert.include(messages[0].node.type, "Program");
        }
    },

    "when evaluating '\t\t\tvar i = 1;\n\t\t\tvar j = 1;'": {

        topic: '\t\t\tvar i = 1;\n\t\t\tvar j = 1;',

        "should report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = [1, 15, 4];

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 2);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Line 0 exceeds the maximum line length of 15.");
            assert.include(messages[0].node.type, "Program");
        }
    },

    "when evaluating '\t\t\tvar i = 1;\n\t\t\tvar j = 1;'": {

        topic: '\t\t\tvar i = 1;\n\t\t\tvar j = 1;',

        "should report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = [1, 15, 1];

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }
    }

}).export(module);
