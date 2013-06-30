
/*jshint node:true*/

var vows = require("vows"),
    assert = require("assert"),
    sinon = require("sinon"),
    ruleCreator = require("../../../lib/rules/no-debugger");

vows.describe("no-debugger").addBatch({

    "when evaluating 'debugger": {

        topic: function() {
            return {
                type: "DebuggerStatement"
            };
        },

        "should report a violation": function(topic) {
            var context = {
                    report: function(){}
                },
                rule;

            sinon.mock(context).expects("report").withArgs(topic,
                        "Unexpected 'debugger' statement.");

            rule  = ruleCreator(context);
            rule[topic.type](topic);
        }
    }

}).export(module);
