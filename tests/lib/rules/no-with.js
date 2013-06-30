
/*jshint node:true*/

var vows = require("vows"),
    assert = require("assert"),
    sinon = require("sinon"),
    ruleCreator = require("../../../lib/rules/no-with");

vows.describe("no-with").addBatch({

    "when evaluating 'with(foo) { }'": {

        topic: function() {
            return {
                type: "WithStatement"
            };
        },

        "should report a violation": function(topic) {
            var context = {
                    report: function(){}
                },
                rule;

            sinon.mock(context).expects("report").withArgs(topic,
                        "Unexpected use of 'with' statement.");

            rule  = ruleCreator(context);
            rule[topic.type](topic);
        }
    }

}).export(module);

/**
 * @fileoverview Tests for no-with rule.
 * @author Nicholas C. Zakas
 */

/*jshint node:true*/

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var vows = require("vows"),
    assert = require("assert"),
    sinon = require("sinon"),
    jscheck = require("../../../lib/jscheck");

//------------------------------------------------------------------------------
// Constants
//------------------------------------------------------------------------------

var RULE_ID = "no-with";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

vows.describe(RULE_ID).addBatch({

    "when evaluating 'with(foo) { bar() }'": {

        topic: "with(foo) { bar() }",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = jscheck.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Unexpected use of 'with' statement.");
            assert.include(messages[0].node.type, "WithStatement");
        }
    }

}).export(module);
