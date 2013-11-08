var assert = require("chai").assert,
	eslint = require("../eslint");

module.exports = (function () {
	this.add = function(ruleName, test) {

		var result = {};

		var testValidTemplate = function(ruleName, code, args) {
            var config = { rules: {} };
            config.rules[ruleName] = args ? args : 1;

            var messages = eslint.verify(code, config);

            assert.equal(messages.length, 0, "Should have no errors");
		};

		var testInvalidTemplate = function(ruleName, code, errors, args) {
			var config = { rules: {} };
			config.rules[ruleName] = args ? args : 1;

			var messages = eslint.verify(code, config);

			if (typeof errors === "number") {
				assert.equal(messages.length, errors);
			} else {
				assert.equal(messages.length, errors.length);

				if (messages.length === errors.length) {
					for (var i=0, l=errors.length; i<l; i++) {
						assert.equal(messages[i].ruleId, ruleName, "Error rule name should be the same as the name of the rule being tested");
						if (errors[i].message) {
							assert.equal(messages[i].message, errors[i].message, "Error message should be " + errors[i].message);
						}
						if (errors[i].type) {
							assert.equal(messages[i].node.type, errors[i].type, "Error type should be " + errors[i].type);
						}
					}
				}
			}
		};

		describe(ruleName, function() {
			test.valid.forEach(function(valid) {
				if (typeof valid === "string") {
					it(valid, function() { testValidTemplate(ruleName, valid); });
				} else {
					it(valid.code, function() { testValidTemplate(ruleName, valid.code, valid.args); });
				}
			});
			test.invalid.forEach(function(invalid) {
				it(invalid.code, function() { testInvalidTemplate(ruleName, invalid.code, invalid.errors, invalid.args); });
			});
		});

		return result.suite;
	};

	return this;
}());

