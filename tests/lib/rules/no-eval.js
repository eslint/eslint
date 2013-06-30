
/*jshint node:true*/

var vows = require("vows"),
    assert = require("assert"),
    sinon = require("sinon"),
    ruleCreator = require("../../../lib/rules/no-eval");

vows.describe("no-eval").addBatch({

    "when evaluating 'eval(foo)'": {

        topic: function() {
            return {
                type: "CallExpression",
                callee: {
                    name: "eval"
                }
            };
        },

        "should report a violation": function(topic) {
            var context = {
                    report: function(){}
                },
                rule;

            sinon.mock(context).expects("report").withArgs(topic,
                        "Unexpected use of 'eval()'.");

            rule  = ruleCreator(context);
            rule[topic.type](topic);
        }
    }

}).export(module);
