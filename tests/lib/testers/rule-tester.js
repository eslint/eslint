/**
 * @fileoverview Tests for ESLint Tester
 * @author Nicholas C. Zakas
 * @Copyright 2015 Kevin Partington. All rights reserved.
 * @copyright 2015 Nicholas C. Zakas. All rights reserved.
 */
"use strict";

/* global describe, it */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var sinon = require("sinon"),
    eslint = require("../../../lib/eslint"),
    RuleTester = require("../../../lib/testers/rule-tester"),
    assert = require("chai").assert;

//------------------------------------------------------------------------------
// Rewire Things
//------------------------------------------------------------------------------

/*
 * So here's the situation. Because RuleTester uses it() and describe() from
 * Mocha, any failures would show up in the output of this test file. That means
 * when we tested that a failure is thrown, that would also count as a failure
 * in the testing for RuleTester. In order to remove those results from the
 * results of this file, we need to overwrite it() and describe() just in
 * RuleTester to do nothing but run code. Effectively, it() and describe()
 * just become regular functions inside of index.js, not at all related to Mocha.
 * That allows the results of this file to be untainted and therefore accurate.
 */

RuleTester.describe = function(text, method) {
    return method.apply(this);
};

RuleTester.it = function(text, method) {
    return method.apply(this);
};

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("RuleTester", function() {

    var ruleTester;

    beforeEach(function() {
        RuleTester.resetDefaultConfig();
        ruleTester = new RuleTester();
    });

    it("should not throw an error when everything passes", function() {

        assert.doesNotThrow(function() {
            ruleTester.run("no-eval", require("../../fixtures/testers/rule-tester/no-eval"), {
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
            ruleTester.run("no-eval", require("../../fixtures/testers/rule-tester/no-eval"), {
                valid: [
                    "eval(foo)"
                ],
                invalid: [
                    { code: "eval(foo)", errors: [{ message: "eval sucks.", type: "CallExpression"}] }
                ]
            });
        }, /Should have no errors but had 1/);
    });

    it("should throw an error when valid code is invalid", function() {

        assert.throws(function() {
            ruleTester.run("no-eval", require("../../fixtures/testers/rule-tester/no-eval"), {
                valid: [
                    { code: "eval(foo)" }
                ],
                invalid: [
                    { code: "eval(foo)", errors: [{ message: "eval sucks.", type: "CallExpression"}] }
                ]
            });
        }, /Should have no errors but had 1/);
    });

    it("should throw an error if invalid code is valid", function() {

        assert.throws(function() {
            ruleTester.run("no-eval", require("../../fixtures/testers/rule-tester/no-eval"), {
                valid: [
                    "Eval(foo)"
                ],
                invalid: [
                    { code: "Eval(foo)", errors: [{ message: "eval sucks.", type: "CallExpression"}] }
                ]
            });
        }, /Should have 1 error but had 0/);
    });

    it("should throw an error when the error message is wrong", function() {
        assert.throws(function() {
            ruleTester.run("no-var", require("../../fixtures/testers/rule-tester/no-var"), {
                // Only the invalid test matters here
                valid: [
                    "bar = baz;"
                ],
                invalid: [
                    { code: "var foo = bar;", errors: [{ message: "Bad error message." }] }
                ]
            });
        }, /Error message should be /);
    });

    it("should throw an error when the error is neither an object nor a string", function() {
        assert.throws(function() {
            ruleTester.run("no-var", require("../../fixtures/testers/rule-tester/no-var"), {
                // Only the invalid test matters here
                valid: [
                    "bar = baz;"
                ],
                invalid: [
                    { code: "var foo = bar;", errors: [42] }
                ]
            });
        }, /Error should be a string or object/);
    });

    it("should throw an error when the error is a string and it does not match error message", function() {
        assert.throws(function() {
            ruleTester.run("no-var", require("../../fixtures/testers/rule-tester/no-var"), {
                // Only the invalid test matters here
                valid: [
                    "bar = baz;"
                ],
                invalid: [
                    { code: "var foo = bar;", errors: ["Bad error message."] }
                ]
            });
        }, /Error message should be /);
    });

    it("should not throw an error when the error is a string and it matches error message", function() {
        assert.doesNotThrow(function() {
            ruleTester.run("no-var", require("../../fixtures/testers/rule-tester/no-var"), {
                // Only the invalid test matters here
                valid: [
                    "bar = baz;"
                ],
                invalid: [
                    { code: "var foo = bar;", errors: ["Bad var."] }
                ]
            });
        });
    });

    it("should throw an error when the expected output doesn't match", function() {

        assert.throws(function() {
            ruleTester.run("no-var", require("../../fixtures/testers/rule-tester/no-var"), {
                valid: [
                    "bar = baz;"
                ],
                invalid: [
                    { code: "var foo = bar;", output: "foo = bar", errors: [{ message: "Bad var.", type: "VariableDeclaration"}] }
                ]
            });
        }, /Output is incorrect/);
    });

    it("should throw an error if invalid code specifies wrong type", function() {

        assert.throws(function() {
            ruleTester.run("no-eval", require("../../fixtures/testers/rule-tester/no-eval"), {
                valid: [
                    "Eval(foo)"
                ],
                invalid: [
                    { code: "eval(foo)", errors: [{ message: "eval sucks.", type: "CallExpression2"}] }
                ]
            });
        }, /Error type should be CallExpression2/);
    });

    it("should throw an error if invalid code specifies wrong line", function() {

        assert.throws(function() {
            ruleTester.run("no-eval", require("../../fixtures/testers/rule-tester/no-eval"), {
                valid: [
                    "Eval(foo)"
                ],
                invalid: [
                    { code: "eval(foo)", errors: [{ message: "eval sucks.", type: "CallExpression", line: 5 }] }
                ]
            });
        }, /Error line should be 5/);
    });

    it("should not skip line assertion if line is a falsy value", function() {
        assert.throws(function() {
            ruleTester.run("no-eval", require("../../fixtures/testers/rule-tester/no-eval"), {
                valid: [
                    "Eval(foo)"
                ],
                invalid: [
                    { code: "\neval(foo)", errors: [{ message: "eval sucks.", type: "CallExpression", line: 0 }] }
                ]
            });
        }, /Error line should be 0/);
    });

    it("should throw an error if invalid code specifies wrong column", function() {
        var wrongColumn = 10,
            expectedErrorMessage = "Error column should be 1";

        assert.throws(function() {
            ruleTester.run("no-eval", require("../../fixtures/testers/rule-tester/no-eval"), {
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

        assert.throws(function() {
            ruleTester.run("no-eval", require("../../fixtures/testers/rule-tester/no-eval"), {
                valid: [ "Eval(foo)" ],
                invalid: [ {
                    code: "var foo; eval(foo)",
                    errors: [ { message: "eval sucks.", column: 0 } ]
                } ]
            });
        }, /Error column should be 0/);
    });

    it("should throw an error if invalid code has the wrong number of errors", function() {

        assert.throws(function() {
            ruleTester.run("no-eval", require("../../fixtures/testers/rule-tester/no-eval"), {
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
        }, /Should have 2 errors but had 1/);
    });

    it("should throw an error if invalid code has the wrong explicit number of errors", function() {

        assert.throws(function() {
            ruleTester.run("no-eval", require("../../fixtures/testers/rule-tester/no-eval"), {
                valid: [
                    "Eval(foo)"
                ],
                invalid: [
                    { code: "eval(foo)", errors: 2 }
                ]
            });
        }, /Should have 2 errors but had 1/);
    });

    // https://github.com/eslint/eslint/issues/4779
    it("should throw an error if there's a parsing error and output doesn't match", function() {

        assert.throws(function() {
            ruleTester.run("no-eval", require("../../fixtures/testers/rule-tester/no-eval"), {
                valid: [],
                invalid: [
                    { code: "eval(`foo`)", output: "eval(`foo`);", errors: [{}] }
                ]
            });
        }, /fatal parsing error/i);
    });

    it("should not throw an error if invalid code has at least an expected empty error object", function() {
        assert.doesNotThrow(function() {
            ruleTester.run("no-eval", require("../../fixtures/testers/rule-tester/no-eval"), {
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
            ruleTester.run("no-test-global", require("../../fixtures/testers/rule-tester/no-test-global"), {
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
            ruleTester.run("no-test-global", require("../../fixtures/testers/rule-tester/no-test-global"), {
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
            ruleTester.run("no-test-settings", require("../../fixtures/testers/rule-tester/no-test-settings"), {
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

    it("should pass-through the filename to the rule", function() {
        (function() {
            ruleTester.run("", require("../../fixtures/testers/rule-tester/no-test-filename"), {
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
            ruleTester.run("no-invalid-args", require("../../fixtures/testers/rule-tester/no-invalid-args"), {
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
            var spy = sinon.spy(eslint, "verify");
            ruleTester.run("no-eval", require("../../fixtures/testers/rule-tester/no-eval"), {
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
            ruleTester.run("no-invalid-schema", require("../../fixtures/testers/rule-tester/no-invalid-schema"), {
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
            ruleTester.run("no-schema-violation", require("../../fixtures/testers/rule-tester/no-schema-violation"), {
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

    it("should pass-through the tester config to the rule", function() {
        ruleTester = new RuleTester({
            global: { test: true }
        });

        assert.doesNotThrow(function() {
            ruleTester.run("no-test-global", require("../../fixtures/testers/rule-tester/no-test-global"), {
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
        RuleTester.setDefaultConfig(config);
        assert(
            RuleTester.getDefaultConfig().global.test,
            "The default config object is incorrect"
        );
    });

    it("should correctly reset the global configuration", function() {
        var config = { global: { test: true } };
        RuleTester.setDefaultConfig(config);
        RuleTester.resetDefaultConfig();
        assert.deepEqual(
            RuleTester.getDefaultConfig(),
            { rules: {} },
            "The default configuration has not reset correctly"
        );
    });

    it("should enforce the global configuration to be an object", function() {
        /**
         * Set the default config for the rules tester
         * @param {object} config configuration object
         * @returns {function} Function to be executed
         * @private
         */
        function setConfig(config) {
            return function() {
                RuleTester.setDefaultConfig(config);
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
        RuleTester.setDefaultConfig(config);
        ruleTester = new RuleTester();

        assert.doesNotThrow(function() {
            ruleTester.run("no-test-global", require("../../fixtures/testers/rule-tester/no-test-global"), {
                valid: [
                    "var test = 'foo'",
                    "var test2 = test"
                ],
                invalid: [ { code: "bar", errors: 1, global: { foo: true } } ]
            });
        });
    });

    it("should throw an error if AST was modified", function() {
        assert.throws(function() {
            ruleTester.run("foo", require("../../fixtures/testers/rule-tester/modify-ast"), {
                valid: [
                    "var foo = 0;"
                ],
                invalid: []
            });
        }, "Rule should not modify AST.");
        assert.throws(function() {
            ruleTester.run("foo", require("../../fixtures/testers/rule-tester/modify-ast"), {
                valid: [],
                invalid: [
                    {code: "var bar = 0;", errors: ["error"]}
                ]
            });
        }, "Rule should not modify AST.");
    });

    it("should throw an error if AST was modified (at Program)", function() {
        assert.throws(function() {
            ruleTester.run("foo", require("../../fixtures/testers/rule-tester/modify-ast-at-first"), {
                valid: [
                    "var foo = 0;"
                ],
                invalid: []
            });
        }, "Rule should not modify AST.");
        assert.throws(function() {
            ruleTester.run("foo", require("../../fixtures/testers/rule-tester/modify-ast-at-first"), {
                valid: [],
                invalid: [
                    {code: "var bar = 0;", errors: ["error"]}
                ]
            });
        }, "Rule should not modify AST.");
    });

    it("should throw an error if AST was modified (at Program:exit)", function() {
        assert.throws(function() {
            ruleTester.run("foo", require("../../fixtures/testers/rule-tester/modify-ast-at-last"), {
                valid: [
                    "var foo = 0;"
                ],
                invalid: []
            });
        }, "Rule should not modify AST.");
        assert.throws(function() {
            ruleTester.run("foo", require("../../fixtures/testers/rule-tester/modify-ast-at-last"), {
                valid: [],
                invalid: [
                    {code: "var bar = 0;", errors: ["error"]}
                ]
            });
        }, "Rule should not modify AST.");
    });
});
