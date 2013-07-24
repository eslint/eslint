var assert = require("assert"),
    eslint = require("../lib/eslint");

module.exports = {
    violation: function(rule_id, message, nodeType) {
        return function(topic) {
            var config = { rules: {} };
            config.rules[rule_id] = 1;

            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, rule_id);
            assert.equal(messages[0].message, message);
            assert.include(messages[0].node.type, nodeType);
        };
    },

    noViolation: function(rule_id) {
        return function(topic) {
            var config = { rules: {} };
            config.rules[rule_id] = 1;

            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 0);
        };
    }
};
