
/*jshint node:true*/

var vows = require("vows"),
    assert = require("assert"),
    sinon = require("sinon"),
    ruleCreator = require("../../../lib/rules/no-bitwise");

vows.describe("no-bitwise").addBatch({

    "when evaluating '^": {

        topic: function() {
            return {
                type: "BinaryExpression",
                operator: "^"
            };
        },

        "should report a violation": function(topic) {
            var context = {
                    report: function(){}
                },
                rule;

            sinon.mock(context).expects("report").withArgs(topic,
                        "Unexpected use of ^ found.");

            rule  = ruleCreator(context);
            rule[topic.type](topic);
        }
    },

    "when evaluating '|": {

        topic: function() {
            return {
                type: "BinaryExpression",
                operator: "|"
            };
        },

        "should report a violation": function(topic) {
            var context = {
                    report: function(){}
                },
                rule;

            sinon.mock(context).expects("report").withArgs(topic,
                        "Unexpected use of | found.");

            rule  = ruleCreator(context);
            rule[topic.type](topic);
        }
    },

    "when evaluating '&": {

        topic: function() {
            return {
                type: "BinaryExpression",
                operator: "&"
            };
        },

        "should report a violation": function(topic) {
            var context = {
                    report: function(){}
                },
                rule;

            sinon.mock(context).expects("report").withArgs(topic,
                        "Unexpected use of & found.");

            rule  = ruleCreator(context);
            rule[topic.type](topic);
        }
    }





}).export(module);
