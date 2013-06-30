
/*jshint node:true*/

var vows = require("vows"),
    assert = require("assert"),
    sinon = require("sinon"),
    ruleCreator = require("../../../lib/rules/camelcase");

vows.describe("camelcase").addBatch({

    "when evaluating 'first_name'": {

        topic: function() {
            return {
                type: "Identifier",
                name: "first_name"
            };
        },

        "should report a violation": function(topic) {
            var context = {
                    report: function(){},
                    isNodeJS: sinon.stub().returns(false)
                },
                rule;

            sinon.mock(context).expects("report").withArgs(topic,
                        "Non-camelcased identifier 'first_name' found.");

            rule  = ruleCreator(context);
            rule["Identifier"](topic);
        }
    },

    "when evaluating 'firstName'": {

        topic: function() {
            return {
                type: "Identifier",
                name: "firstName"
            };
        },

        "should not report a violation": function(topic) {
            var context = {
                    report: function(){},
                    isNodeJS: sinon.stub().returns(true)
                },
                rule;

            sinon.mock(context).expects("report").never();

            rule  = ruleCreator(context);
            rule["Identifier"](topic);
        }
    },

    "when evaluating 'FIRST_NAME'": {

        topic: function() {
            return {
                type: "Identifier",
                name: "FIRST_NAME"
            };
        },

        "should not report a violation": function(topic) {
            var context = {
                    report: function(){},
                    isNodeJS: sinon.stub().returns(true)
                },
                rule;

            sinon.mock(context).expects("report").never();

            rule  = ruleCreator(context);
            rule["Identifier"](topic);
        }
    },


    "when evaluating '__dirname'": {

        topic: function() {
            return {
                type: "Identifier",
                name: "__dirname"
            };
        },

        "should report a violation when not in Node.JS mode": function(topic) {
            var context = {
                    report: function(){},
                    isNodeJS: sinon.stub().returns(false)
                },
                rule;

            sinon.mock(context).expects("report").withArgs(topic,
                        "Non-camelcased identifier '__dirname' found.");

            rule  = ruleCreator(context);
            rule["Identifier"](topic);
        },

        "should not report a violation when in Node.JS mode": function(topic) {
            var context = {
                    report: function(){},
                    isNodeJS: sinon.stub().returns(true)
                },
                rule;

            sinon.mock(context).expects("report").never();

            rule  = ruleCreator(context);
            rule["Identifier"](topic);
        }
    },

    "when evaluating '__filename'": {

        topic: function() {
            return {
                type: "Identifier",
                name: "__filename"
            };
        },

        "should report a violation when not in Node.JS mode": function(topic) {
            var context = {
                    report: function(){},
                    isNodeJS: sinon.stub().returns(false)
                },
                rule;

            sinon.mock(context).expects("report").withArgs(topic,
                        "Non-camelcased identifier '__filename' found.");

            rule  = ruleCreator(context);
            rule["Identifier"](topic);
        },

        "should not report a violation when in Node.JS mode": function(topic) {
            var context = {
                    report: function(){},
                    isNodeJS: sinon.stub().returns(true)
                },
                rule;

            sinon.mock(context).expects("report").never();

            rule  = ruleCreator(context);
            rule["Identifier"](topic);
        }
    }



}).export(module);
