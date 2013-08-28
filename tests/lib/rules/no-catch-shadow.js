/**
 * @fileoverview Tests for no-catch-shadow rule.
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

var RULE_ID = "no-catch-shadow";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

vows.describe(RULE_ID).addBatch({

    "when evaluating 'var foo = 1; try { bar(); } catch(foo) { }'": {

        topic: "var foo = 1; try { bar(); } catch(foo) { }",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = [1, 2];

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Value of 'foo' may be overwritten in IE 8 and earlier.");
            assert.include(messages[0].node.type, "CatchClause");
        }
    },

    "when evaluating 'function foo(){} try { bar(); } catch(foo) { }'": {

        topic: "function foo(){} try { bar(); } catch(foo) { }",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = [1, 2];

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Value of 'foo' may be overwritten in IE 8 and earlier.");
            assert.include(messages[0].node.type, "CatchClause");
        }
    },

    "when evaluating 'function foo(){ try { bar(); } catch(foo) { } }'": {

        topic: "function foo(){ try { bar(); } catch(foo) { } }",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = [1, 2];

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Value of 'foo' may be overwritten in IE 8 and earlier.");
            assert.include(messages[0].node.type, "CatchClause");
        }
    },

    "when evaluating 'var foo = function(){ try { bar(); } catch(foo) { } };'": {

        topic: "var foo = function(){ try { bar(); } catch(foo) { } };",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = [1, 2];

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Value of 'foo' may be overwritten in IE 8 and earlier.");
            assert.include(messages[0].node.type, "CatchClause");
        }
    },

    "when evaluating 'var foo = 1; try { bar(); } catch(baz) { }'": {

        topic: "var foo = 1; try { bar(); } catch(baz) { }",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = [1, 2];

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }
    }

}).export(module);
