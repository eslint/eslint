/**
 * @fileoverview Tests for no-ex-assign rule.
 * @author Stephen Murray <spmurrayzzz>
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

var RULE_ID = "no-ex-assign";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

vows.describe(RULE_ID).addBatch({

    "when evaluating 'try { } catch (e) { e = 10; }'": {

        topic: "try { } catch (e) { e = 10; }",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Do not assign to the exception parameter.");
            assert.include(messages[0].node.type, "AssignmentExpression");
        }
    },

    "when evaluating 'try { } catch (ex) { ex = 10; }'": {

        topic: "try { } catch (ex) { ex = 10; }",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Do not assign to the exception parameter.");
            assert.include(messages[0].node.type, "AssignmentExpression");
        }
    },

    "when evaluating 'try { } catch (e) { three = 2 + 1; }'": {

        topic: "try { } catch (e) { three = 2 + 1; }",

        "should not report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 0);
        }
    },

    "when evaluating 'function foo() { try { } catch (e) { return false; } }'": {

        topic: "function foo() { try { } catch (e) { return false; } }",

        "should not report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 0);
        }
    }

}).export(module);
