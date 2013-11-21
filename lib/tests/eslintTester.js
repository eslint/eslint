/**
 * @fileoverview Mocha test wrapper
 * @author Ilya Volodin
 */

/*
 * This is a wrapper around mocha to allow for DRY unittests for eslint
 * Format:
 * eslintTester.add("{ruleName}", {
 *      valid: [
 *          "{code}",
 *          { code: "{code}", args: {args} }
 *      ],
 *      invalid: [
 *          { code: "{code}", errors: {numErrors} },
 *          { code: "{code}", args: {args}, errors: [{ message: "{errorMessage}", type: "{errorNodeType}"}] }
 *      ]
 *  });
 *
 * Variables:
 * {code} - String that represents the code to be tested
 * {args} - Arguments that are passed to the configurable rules. If not
 *          supplied "1" is passed to the rule
 * {numErrors} - If failing case doesn't need to check error message,
 *               this integer will specify how many errors should be
 *               received
 * {errorMessage} - Message that is returned by the rule on failure
 * {errorNodeType} - AST node type that is returned by they rule as
 *                   a cause of the failure.
 *
 * Requirements:
 * Each rule has to have at least one invalid and at least one valid check.
 * If one of them is missing, the test will be marked as failed.
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var assert = require("chai").assert,
    eslint = require("../eslint");

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

module.exports = (function () {

    this.add = function(ruleName, test) {

        var result = {};

        //all valid cases go through this.
        function testValidTemplate(ruleName, code, args) {
            var config = { rules: {} };
            config.rules[ruleName] = args ? args : 1;

            var messages = eslint.verify(code, config);

            assert.equal(messages.length, 0, "Should have no errors");
        }

        //all invalid cases go through this.
        function testInvalidTemplate(ruleName, code, errors, args) {
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
        }

        //this creates a mocha test suite and pipes all supplied info
        //through one of the templates above.
        describe(ruleName, function() {
            if (!test.valid || test.valid.length < 1) {
                //we only want to run this assertion when it's going to
                //fail, so we wouldn't artificially boost test count
                it("should have at least one valid test", function() { assert.fail(test.valid ? test.valid.length : null, "1", "Each rule should have at least one valid test", null); });
            } else {
                test.valid.forEach(function(valid) {
                    if (typeof valid === "string") {
                        it(valid, function() { testValidTemplate(ruleName, valid); });
                    } else {
                        it(valid.code, function() { testValidTemplate(ruleName, valid.code, valid.args); });
                    }
                });
            }
            if (!test.invalid || test.invalid.length < 1) {
                //we only want to run this assertion when it's going to
                //fail, so we wouldn't artificially boost test count
                it("should have at least one invalid test", function() { assert.fail(test.invalid ? test.invalid.length : null, "1", "Each rule should have at least one invalid test", null); });
            } else {
                test.invalid.forEach(function(invalid) {
                    it(invalid.code, function() { testInvalidTemplate(ruleName, invalid.code, invalid.errors, invalid.args); });
                });
            }
        });

        return result.suite;
    };

    return this;
}());
