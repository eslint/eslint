var assert = require("assert"),
    eslint = require("../lib/eslint"),
    vows = require("vows");

function Test(name) {
    this.rule_id = name;
    this.tests = {}
}

Test.prototype.addViolations = function(message, tests) {
    var rule_id = this.rule_id;
    Object.keys(tests).forEach(function(testName) {
        var nodeType = tests[testName];
        this.tests[testName] = {
            topic: function() { return testName; },
            "should report a violation": function(topic) {
                var config = { rules: {} };
                config.rules[rule_id] = 1;

                var messages = eslint.verify(topic, config);
                assert.equal(messages.length, 1);
                assert.equal(messages[0].ruleId, rule_id);

                if (typeof message === 'function') {
                    message(assert, messages);
                } else {
                    assert.equal(messages[0].message, message);
                }
                if (typeof nodeType === 'function') {
                    nodeType(assert, messages);
                } else {
                    assert.include(messages[0].node.type, nodeType);
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
