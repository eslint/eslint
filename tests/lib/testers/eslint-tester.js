/**
 * @fileoverview Tests for ESLint Tester
 * @author Nicholas C. Zakas
 */
"use strict";

/* global describe, it */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rewire = require("rewire"),
    sinon = require("sinon"),
    eslint = require("../../../lib/eslint"),
    assert = require("chai").assert;

//------------------------------------------------------------------------------
// Rewire Things
//------------------------------------------------------------------------------

var ESLintTester = rewire("../../../lib/testers/eslint-tester");

/*
 * So here's the situation. Because ESLintTester uses it() and describe() from
 * Mocha, any failures would show up in the output of this test file. That means
 * when we tested that a failure is thrown, that would also count as a failure
 * in the testing for ESLintTester. In order to remove those results from the
 * results of this file, we need to overwrite it() and describe() just in
 * ESLintTester to do nothing but run code. Effectively, it() and describe()
 * just become regular functions inside of index.js, not at all related to Mocha.
 * That allows the results of this file to be untainted and therefore accurate.
 */

/* eslint-disable no-underscore-dangle */
ESLintTester.__set__("it", function(name, method) {
    method.apply(null, arguments);
});

ESLintTester.__set__("describe", function(name, method) {
    method.apply(null, arguments);
});
/* eslint-enable no-underscore-dangle */

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("ESLintTester", function() {

    var eslintTester;

    beforeEach(function() {
        ESLintTester.resetDefaultConfig();
        eslintTester = new ESLintTester(eslint);
    });

    it("should not throw an error when everything passes", function() {

        assert.doesNotThrow(function() {
            eslintTester.addRuleTest("tests/fixtures/testers/eslint-tester/no-eval", {
                valid: [
                    "Eval(foo)"
                ],
                invalid: [
                    { code: "eval(foo)", errors: [{ message: "eval sucks.", type: "CallExpression"}] }
                ]
            });
        });
    });

    it("should throw an error when valid code is invalid", function() {

        assert.throws(function() {
            eslintTester.addRuleTest("tests/fixtures/testers/eslint-tester/no-eval", {
                valid: [
                    "eval(foo)"
                ],
                invalid: [
                    { code: "eval(foo)", errors: [{ message: "eval sucks.", type: "CallExpression"}] }
                ]
            });
        }, /^Should have no errors but had 1/);
    });

    it("should throw an error when valid code is invalid", function() {

        assert.throws(function() {
            eslintTester.addRuleTest("tests/fixtures/testers/eslint-tester/no-eval", {
                valid: [
                    { code: "eval(foo)" }
                ],
                invalid: [
                    { code: "eval(foo)", errors: [{ message: "eval sucks.", type: "CallExpression"}] }
                ]
            });
        }, /^Should have no errors but had 1/);
    });

    it("should throw an error if invalid code is valid", function() {

        assert.throws(function() {
            eslintTester.addRuleTest("tests/fixtures/testers/eslint-tester/no-eval", {
                valid: [
                    "Eval(foo)"
                ],
                invalid: [
                    { code: "Eval(foo)", errors: [{ message: "eval sucks.", type: "CallExpression"}] }
                ]
            });
        }, /^Should have 1 errors but had 0/);
    });

    it("should throw an error if invalid code is valid", function() {

        assert.throws(function() {
            eslintTester.addRuleTest("tests/fixtures/testers/eslint-tester/no-eval", {
                valid: [
                    "Eval(foo)"
                ],
                invalid: [
                    { code: "Eval(foo)", errors: [{ message: "eval sucks.", type: "CallExpression"}] }
                ]
            });
        }, /^Should have 1 errors but had 0/);
    });

    it("should throw an error if invalid code specifies wrong type", function() {

        assert.throws(function() {
            eslintTester.addRuleTest("tests/fixtures/testers/eslint-tester/no-eval", {
                valid: [
                    "Eval(foo)"
                ],
                invalid: [
                    { code: "eval(foo)", errors: [{ message: "eval sucks.", type: "CallExpression2"}] }
                ]
            });
        }, /^Error type should be CallExpression2/);
    });

    it("should throw an error if invalid code specifies wrong line", function() {

        assert.throws(function() {
            eslintTester.addRuleTest("tests/fixtures/testers/eslint-tester/no-eval", {
                valid: [
                    "Eval(foo)"
                ],
                invalid: [
                    { code: "eval(foo)", errors: [{ message: "eval sucks.", type: "CallExpression", line: 5 }] }
                ]
            });
        }, /^Error line should be 5/);
    });

    it("should not skip line assertion if line is a falsy value", function() {
        var expectedErrorMessage = "Error line should be 0: expected 2 to equal 0";

        assert.throws(function() {
            eslintTester.addRuleTest("tests/fixtures/testers/eslint-tester/no-eval", {
                valid: [
                    "Eval(foo)"
                ],
                invalid: [
                    { code: "\neval(foo)", errors: [{ message: "eval sucks.", type: "CallExpression", line: 0 }] }
                ]
            });
        }, expectedErrorMessage);
    });

    it("should throw an error if invalid code specifies wrong column", function() {
        var wrongColumn = 10,
            expectedErrorMessage = "Error column should be 1";

        assert.throws(function() {
            eslintTester.addRuleTest("tests/fixtures/testers/eslint-tester/no-eval", {
                valid: [ "Eval(foo)" ],
                invalid: [ {
                    code: "eval(foo)",
                    errors: [ {
                        message: "eval sucks.",
                        column: wrongColumn
                    } ]
                } ]
            });
        }, expectedErrorMessage);
    });

    it("should not skip column assertion if column is a falsy value", function() {
        var expectedErrorMessage = "Error column should be 0: expected 10 to equal 0";

        assert.throws(function() {
            eslintTester.addRuleTest("tests/fixtures/testers/eslint-tester/no-eval", {
                valid: [ "Eval(foo)" ],
                invalid: [ {
                    code: "var foo; eval(foo)",
                    errors: [ { message: "eval sucks.", column: 0 } ]
                } ]
            });
        }, expectedErrorMessage);
    });

    it("should throw an error if invalid code has the wrong number of errors", function() {

        assert.throws(function() {
            eslintTester.addRuleTest("tests/fixtures/testers/eslint-tester/no-eval", {
                valid: [
                    "Eval(foo)"
                ],
                invalid: [
                    { code: "eval(foo)", errors: [
                        { message: "eval sucks.", type: "CallExpression" },
                        { message: "eval sucks.", type: "CallExpression" }
                    ] }
                ]
            });
        }, /^Should have 2 errors but had 1/);
    });

    it("should throw an error if invalid code has the wrong explicit number of errors", function() {

        assert.throws(function() {
            eslintTester.addRuleTest("tests/fixtures/testers/eslint-tester/no-eval", {
                valid: [
                    "Eval(foo)"
                ],
                invalid: [
                    { code: "eval(foo)", errors: 2 }
                ]
            });
        }, /^Should have 2 errors but had 1/);
    });

    it("should not throw an error if invalid code has at least an expected empty error object", function() {
        assert.doesNotThrow(function() {
            eslintTester.addRuleTest("tests/fixtures/testers/eslint-tester/no-eval", {
                valid: [ "Eval(foo)" ],
                invalid: [ {
                    code: "eval(foo)",
                    errors: [ {} ]
                } ]
            });
        });
    });

    it("should pass-through the globals config of valid tests to the to rule", function() {
        assert.doesNotThrow(function() {
            eslintTester.addRuleTest("tests/fixtures/testers/eslint-tester/no-test-global", {
                valid: [
                    "var test = 'foo'",
                    {
                        code: "var test2 = 'bar'",
                        globals: { test: true }
                    },
                    {
                        code: "var test2 = 'bar'",
                        global: { test: true }
                    }
                ],
                invalid: [ { code: "bar", errors: 1 } ]
            });
        });
    });

    it("should pass-through the globals config of invalid tests to the to rule", function() {
        assert.doesNotThrow(function() {
            eslintTester.addRuleTest("tests/fixtures/testers/eslint-tester/no-test-global", {
                valid: [ "var test = 'foo'" ],
                invalid: [
                    {
                        code: "var test = 'foo'; var foo = 'bar'",
                        errors: 1
                    },
                    {
                        code: "var test = 'foo'",
                        globals: { foo: true },
                        errors: [ { message: "Global variable foo should not be used." } ]
                    },
                    {
                        code: "var test = 'foo'",
                        global: { foo: true },
                        errors: [ { message: "Global variable foo should not be used." } ]
                    }
                ]
            });
        });
    });

    it("should pass-through the settings config to rules", function() {
        assert.doesNotThrow(function() {
            eslintTester.addRuleTest("tests/fixtures/testers/eslint-tester/no-test-settings", {
                valid: [
                    {
                        code: "var test = 'bar'", settings: { "test": 1 }
                    }
                ],
                invalid: [
                    {
                        code: "var test = 'bar'", settings: { "no-test": 22 }, errors: 1
                    }
                ]
            });
        });
    });

    it("should pass-through the args to the rule", function() {
        assert.doesNotThrow(function() {
            eslintTester.addRuleTest("tests/fixtures/testers/eslint-tester/no-invalid-args", {
                valid: [
                    {
                        code: "var foo = 'bar'",
                        args: [ 1, false ]
                    }
                ],
                invalid: [
                    {
                        code: "var foo = 'bar'",
                        args: [ 1, true ],
                        errors: [ { message: "Invalid args" } ]
                    }
                ]
            });
        });
    });

    it("should pass-through the args to the rule", function() {
        (function() {
            eslintTester.addRuleTest("tests/fixtures/testers/eslint-tester/no-test-filename", {
                valid: [
                    {
                        code: "var foo = 'bar'",
                        filename: "somefile.js"
                    }
                ],
                invalid: [
                    {
                        code: "var foo = 'bar'",
                        errors: [
                            { message: "Filename test was not defined." }
                        ]
                    }
                ]
            });
        }());
    });

    it("should pass-through the options to the rule", function() {
        assert.doesNotThrow(function() {
            eslintTester.addRuleTest("tests/fixtures/testers/eslint-tester/no-invalid-args", {
                valid: [
                    {
                        code: "var foo = 'bar'",
                        options: [ false ]
                    }
                ],
                invalid: [
                    {
                        code: "var foo = 'bar'",
                        options: [ true ],
                        errors: [ { message: "Invalid args" } ]
                    }
                ]
            });
        });
    });

    it("should pass-through the parser to the rule", function() {

        assert.doesNotThrow(function() {
            var spy = sinon.spy(eslintTester.eslint, "verify");
            eslintTester.addRuleTest("tests/fixtures/testers/eslint-tester/no-eval", {
                valid: [
                    {
                        code: "Eval(foo)"
                    }
                ],
                invalid: [
                    {
                        code: "eval(foo)",
                        parser: "esprima",
                        errors: [ {} ]
                    }
                ]
            });
            assert.equal(spy.args[1][1].parser, "esprima");
        });
    });

    it("should prevent invalid options schemas", function() {

        assert.throws(function() {
            eslintTester.addRuleTest("tests/fixtures/testers/eslint-tester/no-invalid-schema", {
                valid: [
                    "var answer = 6 * 7;",
                    { code: "var answer = 6 * 7;", options: [] }
                ],
                invalid: [
                    { code: "var answer = 6 * 7;", options: ["bar"], errors: [{ message: "Expected nothing." }] }
                ]
            });
        }, /Schema for rule .* is invalid/);

    });

    it("should prevent schema violations in options", function() {

        assert.throws(function() {
            eslintTester.addRuleTest("tests/fixtures/testers/eslint-tester/no-schema-violation", {
                valid: [
                    "var answer = 6 * 7;",
                    { code: "var answer = 6 * 7;", options: ["foo"] }
                ],
                invalid: [
                    { code: "var answer = 6 * 7;", options: ["bar"], errors: [{ message: "Expected foo." }] }
                ]
            });
        }, /Value "bar" must be an enum value./);

    });



    it("should throw an error if there are no valid tests", function() {

        assert.throws(function() {
            eslintTester.addRuleTest("tests/fixtures/testers/eslint-tester/no-eval", {
                valid: [
                ],
                invalid: [
                    { code: "Eval(foo)", errors: [{ message: "eval sucks.", type: "CallExpression"}] }
                ]
            });
        }, /^Each rule should have at least one valid test/);
    });

    it("should throw an error if there is no valid key", function() {

        assert.throws(function() {
            eslintTester.addRuleTest("tests/fixtures/testers/eslint-tester/no-eval", {
                invalid: [
                    { code: "Eval(foo)", errors: [{ message: "eval sucks.", type: "CallExpression"}] }
                ]
            });
        }, /^Each rule should have at least one valid test/);
    });

    it("should throw an error if there are no invalid tests", function() {

        assert.throws(function() {
            eslintTester.addRuleTest("tests/fixtures/testers/eslint-tester/no-eval", {
                valid: [
                    "Eval(foo)"
                ],
                invalid: [

                ]
            });
        }, /^Each rule should have at least one invalid test/);
    });

    it("should throw an error if there is no invalid key", function() {

        assert.throws(function() {
            eslintTester.addRuleTest("tests/fixtures/testers/eslint-tester/no-eval", {
                valid: [
                    "Eval(foo)"
                ]
            });
        }, /^Each rule should have at least one invalid test/);
    });

    it("should pass-through the tester config to the to rule", function() {
        eslintTester = new ESLintTester(eslint, {
            global: { test: true }
        });
        assert.doesNotThrow(function() {
            eslintTester.addRuleTest("tests/fixtures/testers/eslint-tester/no-test-global", {
                valid: [
                    "var test = 'foo'",
                    "var test2 = test"
                ],
                invalid: [ { code: "bar", errors: 1, global: { foo: true } } ]
            });
        });
    });

    it("should correctly set the global configuration", function() {
        var config = { global: { test: true } };
        ESLintTester.setDefaultConfig(config);
        assert(
            ESLintTester.getDefaultConfig().global.test,
            "The default config object is incorrect"
        );
    });

    it("should correctly reset the global configuration", function() {
        var config = { global: { test: true } };
        ESLintTester.setDefaultConfig(config);
        ESLintTester.resetDefaultConfig();
        assert.deepEqual(
            ESLintTester.getDefaultConfig(),
            { rules: {} },
            "The default configuration has not reset correctly"
        );
    });

    it("should enforce the global configuration to be an object", function() {
        function setConfig(config) {
            return function() {
                ESLintTester.setDefaultConfig(config);
            };
        }
        assert.throw(setConfig());
        assert.throw(setConfig(1));
        assert.throw(setConfig(3.14));
        assert.throw(setConfig("foo"));
        assert.throw(setConfig(null));
        assert.throw(setConfig(true));
    });

    it("should pass-through the global config to the tester then to the to rule", function() {
        var config = { global: { test: true } };
        ESLintTester.setDefaultConfig(config);
        eslintTester = new ESLintTester(eslint);
        assert.doesNotThrow(function() {
            eslintTester.addRuleTest("tests/fixtures/testers/eslint-tester/no-test-global", {
                valid: [
                    "var test = 'foo'",
                    "var test2 = test"
                ],
                invalid: [ { code: "bar", errors: 1, global: { foo: true } } ]
            });
        });
    });

});
