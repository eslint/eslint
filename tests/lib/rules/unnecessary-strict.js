/**
 * @fileoverview Tests for unnecessary-strict.
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

var RULE_ID = "unnecessary-strict";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

vows.describe(RULE_ID).addBatch({

    "when evaluating strict in global and function scope": {

        topic: "\"use strict\"; function foo() { \"use strict\"; var bar = true; }",

        "should report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Unnecessary 'use strict'.");
            assert.include(messages[0].node.type, "Literal");
        }
    },

    "when evaluating strict in global scope": {

        topic: "\"use strict\"; function foo() { var bar = true; }",

        "should not report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 0);
        }
    },

    "when evaluating strict in function scope": {

        topic: "function foo() { \"use strict\"; var bar = true; }",

        "should not report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 0);
        }
    },

    "when evaluating strict in global and nested function scope": {

        topic: "\"use strict\"; (function foo() { function bar () { \"use strict\"; } }());",

        "should report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Unnecessary 'use strict'.");
            assert.include(messages[0].node.type, "Literal");
        }
    }


}).export(module);
