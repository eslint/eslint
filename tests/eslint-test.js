var assert = require("assert"),
    eslint = require("../lib/eslint"),
    vows = require("vows");

function Test(name) {
    this.rule_id = name;
    this.tests = {}
}

Test.prototype.addViolationsWithMessage = function(message, tests) {
    var newTests = {};
    Object.keys(tests).forEach(function(testName) {
        newTests[testName] = {
            message: message,
            nodeType: tests[testName]
        };
    });
    this.addViolations(newTests);
    return this;
};

Test.prototype.addViolationsWithMessageAndNodeType = function(message, nodeType, tests) {
  var newTests = {};
  tests.forEach(function(testName) {
      newTests[testName] = {
          message: message,
          nodeType: nodeType
      };
  });
  this.addViolations(newTests);
  return this;
};

Test.prototype.addViolations = function(tests) {
    var rule_id = this.rule_id;
    Object.keys(tests).forEach(function(testName) {
        var o = tests[testName];
        this.tests[testName] = {
            topic: function() { return testName; },
            "should report a violation": function(topic) {
                var config = { rules: {} };
                config.rules[rule_id] = 1;

                var messages = eslint.verify(topic, config);
                assert.equal(messages.length, 1);
                assert.equal(messages[0].ruleId, rule_id);

                assert.equal(messages[0].message, o.message);
                assert.equal(messages[0].node.type, o.nodeType);

                if (typeof o.callback === "function") {
                    o.callback(assert, messages);
                }
            }
        };
    }.bind(this));
    return this;
};

Test.prototype.addNonViolations = function(tests) {
    var rule_id = this.rule_id;
    tests.forEach(function(testName) {
        this.tests[testName] = {
            topic: function() { return testName; },
            "should not report violation": function(topic) {
                var config = { rules: {} };
                config.rules[rule_id] = 1;

                var messages = eslint.verify(topic, config);
                assert.equal(messages.length, 0);
            }
        };
    }.bind(this));
    return this;
};

Test.prototype.export = function(module) {
    vows.describe(this.rule_id).addBatch(this.tests).export(module)
};

module.exports = Test;
