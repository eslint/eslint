/**
 * @fileoverview Tests for no-exc-assign rule.
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

var RULE_ID = "no-exc-assign";

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
            assert.equal(messages[0].message, "Unexpected assignment of exception parameter.");
            assert.include(messages[0].node.type, "CatchClause");
        }
    },

    "when evaluating 'try { } catch (e) { three = 2 + 1; }'": {

        topic: "try { } catch (e) { three = 2 + 1; }",

        "should not report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);
            console.log(messages);
            assert.equal(messages.length, 0);
        }
    }

}).export(module);