/**
 * @fileoverview Tests for quotes rule.
 * @author Matt DuVall <http://www.mattduvall.com/>
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

var RULE_ID = "quotes";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

vows.describe(RULE_ID).addBatch({

    "when evaluating `var foo = 'bar';` with single-quotes on": {

        topic: "var foo = 'bar';",

        "should not report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = [1, "single"];

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }
    },

    "when evaluating `var foo = \"bar\";` with single-quotes on": {

        topic: "var foo = \"bar\";",

        "should report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = [1, "single"];

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Strings must use singlequote.");
        }
    },

    "when evaluating `var foo = 'bar';` with double-quotes on": {

        topic: "var foo = 'bar';",

        "should not report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = [1, "double"];

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Strings must use doublequote.");
        }
    },

    "when evaluating `var foo = \"bar\";` with double-quotes on": {

        topic: "var foo = \"bar\";",

        "should report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = [1, "double"];

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }
    },

    "when evaluating `var foo = 1;` with a non-string literal": {

        topic: "var foo = 1;",

        "should not report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = [1, "single"];

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }
    }


}).export(module);
