
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
