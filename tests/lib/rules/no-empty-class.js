/**
 * @fileoverview Tests for no-empty-class rule.
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

var RULE_ID = "no-empty-class";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

vows.describe(RULE_ID).addBatch({
    "when evaluating 'var foo = /^abc[]/;'": {

        topic: "var foo = /^abc[]/;",

        "should report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Empty class.");
            assert.include(messages[0].node.type, "Literal");
        }
    },

    "when evaluating 'var foo = /foo[]bar/;'": {

        topic: "var foo = /foo[]bar/;",

        "should report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Empty class.");
            assert.include(messages[0].node.type, "Literal");
        }
    },

    "when evaluating 'if (foo.match(/^abc[]/)) {}'": {

        topic: "if (foo.match(/^abc[]/)) {}",

        "should report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Empty class.");
            assert.include(messages[0].node.type, "Literal");
        }
    },

    "when evaluating 'if (/^abc[]/.test(foo)) {}'": {

        topic: "if (/^abc[]/.test(foo)) {}",

        "should report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Empty class.");
            assert.include(messages[0].node.type, "Literal");
        }
    },

    "when evaluating 'var foo = /^abc[a-zA-Z]/;'": {

        topic: "var foo = /^abc[a-zA-Z]/;",

        "should not report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }
    },

    "when evaluating 'var regExp = new RegExp(\"^abc[]\");'": {

        topic: "var regExp = new RegExp(\"^abc[]\");",

        "should not report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }
    },

    "when evaluating 'var foo = /^abc/;'": {

        topic: "var foo = /^abc/;",

        "should not report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }
    },

    "when evaluating 'var foo = /[\\[]/;'": {

        topic: "var foo = /[\\[]/;",

        "should not report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }
    },

    "when evaluating 'var foo = /[\\]]/;'": {

        topic: "var foo = /[\\]]/;",

        "should not report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }
    },

    "when evaluating 'var foo = /[a-zA-Z\\[]/;'": {

        topic: "var foo = /[a-zA-Z\\[]/;",

        "should not report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }
    },

    "when evaluating 'var foo = /[[]/;'": {

        topic: "var foo = /[[]/;",

        "should not report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }
    },

    "when evaluating 'var foo = /[]]/;'": {

        topic: "var foo = /[]]/;",

        "should report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Empty class.");
            assert.include(messages[0].node.type, "Literal");
        }
    },

    "when evaluating 'var foo = /\\[[]/;'": {

        topic: "var foo = /\\[[]/;",

        "should report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Empty class.");
            assert.include(messages[0].node.type, "Literal");
        }
    },

    "when evaluating 'var foo = /[\\[a-z[]]/;'": {

        topic: "var foo = /[\\[a-z[]]/;",

        "should not report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }
    },

    "when evaluating 'var foo = /\\[\\[\\]a-z[]/;'": {

        topic: "var foo = /\\[\\[\\]a-z[]/;",

        "should report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Empty class.");
            assert.include(messages[0].node.type, "Literal");
        }
    }


}).export(module);
