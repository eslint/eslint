/**
 * @fileoverview Tests for ESLint Tester
 * @author Nicholas C. Zakas
 */
"use strict";

/* global describe, it */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const sinon = require("sinon"),
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

describe("RuleTester", () => {

    let ruleTester;

    beforeEach(() => {
        RuleTester.resetDefaultConfig();
        ruleTester = new RuleTester();
    });

    it("should not throw an error when everything passes", () => {

        assert.doesNotThrow(() => {
            ruleTester.run("no-eval", require("../../fixtures/testers/rule-tester/no-eval"), {
                valid: [
                    "Eval(foo)"
                ],
                invalid: [
                    { code: "eval(foo)", errors: [{ message: "eval sucks.", type: "CallExpression" }] }
                ]
            });
        });
    });

    it("should throw an error when valid code is invalid", () => {

        assert.throws(() => {
            ruleTester.run("no-eval", require("../../fixtures/testers/rule-tester/no-eval"), {
                valid: [
                    "eval(foo)"
                ],
                invalid: [
                    { code: "eval(foo)", errors: [{ message: "eval sucks.", type: "CallExpression" }] }
                ]
            });
        }, /Should have no errors but had 1/);
    });

    it("should throw an error when valid code is invalid", () => {

        assert.throws(() => {
            ruleTester.run("no-eval", require("../../fixtures/testers/rule-tester/no-eval"), {
                valid: [
                    { code: "eval(foo)" }
                ],
                invalid: [
                    { code: "eval(foo)", errors: [{ message: "eval sucks.", type: "CallExpression" }] }
                ]
            });
        }, /Should have no errors but had 1/);
    });

    it("should throw an error if invalid code is valid", () => {

        assert.throws(() => {
            ruleTester.run("no-eval", require("../../fixtures/testers/rule-tester/no-eval"), {
                valid: [
                    "Eval(foo)"
                ],
                invalid: [
                    { code: "Eval(foo)", errors: [{ message: "eval sucks.", type: "CallExpression" }] }
                ]
            });
        }, /Should have 1 error but had 0/);
    });

    it("should throw an error when the error message is wrong", () => {
        assert.throws(() => {
            ruleTester.run("no-var", require("../../fixtures/testers/rule-tester/no-var"), {

                // Only the invalid test matters here
                valid: [
                    "bar = baz;"
                ],
                invalid: [
                    { code: "var foo = bar;", errors: [{ message: "Bad error message." }] }
                ]
            });
        }, /Bad var\..*==.*Bad error message/);
    });

    it("should throw an error when the error is neither an object nor a string", () => {
        assert.throws(() => {
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

    it("should throw an error when the error is a string and it does not match error message", () => {
        assert.throws(() => {
            ruleTester.run("no-var", require("../../fixtures/testers/rule-tester/no-var"), {

                // Only the invalid test matters here
                valid: [
                    "bar = baz;"
                ],
                invalid: [
                    { code: "var foo = bar;", errors: ["Bad error message."] }
                ]
            });
        }, /Bad var\..*==.*Bad error message/);
    });

    it("should not throw an error when the error is a string and it matches error message", () => {
        assert.doesNotThrow(() => {
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

    it("should throw an error when the expected output doesn't match", () => {

        assert.throws(() => {
            ruleTester.run("no-var", require("../../fixtures/testers/rule-tester/no-var"), {
                valid: [
                    "bar = baz;"
                ],
                invalid: [
                    { code: "var foo = bar;", output: "foo = bar", errors: [{ message: "Bad var.", type: "VariableDeclaration" }] }
                ]
            });
        }, /Output is incorrect/);
    });

    it("should throw an error when the expected output doesn't match and errors is just a number", () => {

        assert.throws(() => {
            ruleTester.run("no-var", require("../../fixtures/testers/rule-tester/no-var"), {
                valid: [
                    "bar = baz;"
                ],
                invalid: [
                    { code: "var foo = bar;", output: "foo = bar", errors: 1 }
                ]
            });
        }, /Output is incorrect/);
    });

    it("should throw an error if invalid code specifies wrong type", () => {

        assert.throws(() => {
            ruleTester.run("no-eval", require("../../fixtures/testers/rule-tester/no-eval"), {
                valid: [
                    "Eval(foo)"
                ],
                invalid: [
                    { code: "eval(foo)", errors: [{ message: "eval sucks.", type: "CallExpression2" }] }
                ]
            });
        }, /Error type should be CallExpression2, found CallExpression/);
    });

    it("should throw an error if invalid code specifies wrong line", () => {

        assert.throws(() => {
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

    it("should not skip line assertion if line is a falsy value", () => {
        assert.throws(() => {
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

    it("should throw an error if invalid code specifies wrong column", () => {
        const wrongColumn = 10,
            expectedErrorMessage = "Error column should be 1";

        assert.throws(() => {
            ruleTester.run("no-eval", require("../../fixtures/testers/rule-tester/no-eval"), {
                valid: ["Eval(foo)"],
                invalid: [{
                    code: "eval(foo)",
                    errors: [{
                        message: "eval sucks.",
                        column: wrongColumn
                    }]
                }]
            });
        }, expectedErrorMessage);
    });

    it("should not skip column assertion if column is a falsy value", () => {

        assert.throws(() => {
            ruleTester.run("no-eval", require("../../fixtures/testers/rule-tester/no-eval"), {
                valid: ["Eval(foo)"],
                invalid: [{
                    code: "var foo; eval(foo)",
                    errors: [{ message: "eval sucks.", column: 0 }]
                }]
            });
        }, /Error column should be 0/);
    });

    it("should throw an error if invalid code specifies wrong endLine", () => {
        assert.throws(() => {
            ruleTester.run("no-var", require("../../fixtures/testers/rule-tester/no-var"), {
                valid: [
                    "bar = baz;"
                ],
                invalid: [
                    { code: "var foo = bar;", output: "foo = bar", errors: [{ message: "Bad var.", type: "VariableDeclaration", endLine: 10 }] }
                ]
            });
        }, "Error endLine should be 10");
    });

    it("should throw an error if invalid code specifies wrong endColumn", () => {
        assert.throws(() => {
            ruleTester.run("no-var", require("../../fixtures/testers/rule-tester/no-var"), {
                valid: [
                    "bar = baz;"
                ],
                invalid: [
                    { code: "var foo = bar;", output: "foo = bar", errors: [{ message: "Bad var.", type: "VariableDeclaration", endColumn: 10 }] }
                ]
            });
        }, "Error endColumn should be 10");
    });

    it("should throw an error if invalid code has the wrong number of errors", () => {

        assert.throws(() => {
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

    it("should throw an error if invalid code does not have errors", () => {
        assert.throws(() => {
            ruleTester.run("no-eval", require("../../fixtures/testers/rule-tester/no-eval"), {
                valid: [
                    "Eval(foo)"
                ],
                invalid: [
                    { code: "eval(foo)" }
                ]
            });
        }, /Did not specify errors for an invalid test of no-eval/);
    });

    it("should throw an error if invalid code has the wrong explicit number of errors", () => {

        assert.throws(() => {
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
    it("should throw an error if there's a parsing error and output doesn't match", () => {

        assert.throws(() => {
            ruleTester.run("no-eval", require("../../fixtures/testers/rule-tester/no-eval"), {
                valid: [],
                invalid: [
                    { code: "eval(`foo`)", output: "eval(`foo`);", errors: [{}] }
                ]
            });
        }, /fatal parsing error/i);
    });

    it("should not throw an error if invalid code has at least an expected empty error object", () => {
        assert.doesNotThrow(() => {
            ruleTester.run("no-eval", require("../../fixtures/testers/rule-tester/no-eval"), {
                valid: ["Eval(foo)"],
                invalid: [{
                    code: "eval(foo)",
                    errors: [{}]
                }]
            });
        });
    });

    it("should pass-through the globals config of valid tests to the to rule", () => {
        assert.doesNotThrow(() => {
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
                invalid: [{ code: "bar", errors: 1 }]
            });
        });
    });

    it("should pass-through the globals config of invalid tests to the to rule", () => {
        assert.doesNotThrow(() => {
            ruleTester.run("no-test-global", require("../../fixtures/testers/rule-tester/no-test-global"), {
                valid: ["var test = 'foo'"],
                invalid: [
                    {
                        code: "var test = 'foo'; var foo = 'bar'",
                        errors: 1
                    },
                    {
                        code: "var test = 'foo'",
                        globals: { foo: true },
                        errors: [{ message: "Global variable foo should not be used." }]
                    },
                    {
                        code: "var test = 'foo'",
                        global: { foo: true },
                        errors: [{ message: "Global variable foo should not be used." }]
                    }
                ]
            });
        });
    });

    it("should pass-through the settings config to rules", () => {
        assert.doesNotThrow(() => {
            ruleTester.run("no-test-settings", require("../../fixtures/testers/rule-tester/no-test-settings"), {
                valid: [
                    {
                        code: "var test = 'bar'", settings: { test: 1 }
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

    it("should pass-through the filename to the rule", () => {
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

    it("should pass-through the options to the rule", () => {
        assert.doesNotThrow(() => {
            ruleTester.run("no-invalid-args", require("../../fixtures/testers/rule-tester/no-invalid-args"), {
                valid: [
                    {
                        code: "var foo = 'bar'",
                        options: [false]
                    }
                ],
                invalid: [
                    {
                        code: "var foo = 'bar'",
                        options: [true],
                        errors: [{ message: "Invalid args" }]
                    }
                ]
            });
        });
    });

    it("should pass-through the parser to the rule", () => {

        assert.doesNotThrow(() => {
            const spy = sinon.spy(eslint, "verify");

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
                        errors: [{}]
                    }
                ]
            });
            assert.equal(spy.args[1][1].parser, "esprima");
        });
    });

    it("should prevent invalid options schemas", () => {

        assert.throws(() => {
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

    it("should prevent schema violations in options", () => {

        assert.throws(() => {
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

    it("should pass-through the tester config to the rule", () => {
        ruleTester = new RuleTester({
            global: { test: true }
        });

        assert.doesNotThrow(() => {
            ruleTester.run("no-test-global", require("../../fixtures/testers/rule-tester/no-test-global"), {
                valid: [
                    "var test = 'foo'",
                    "var test2 = test"
                ],
                invalid: [{ code: "bar", errors: 1, global: { foo: true } }]
            });
        });
    });

    it("should correctly set the global configuration", () => {
        const config = { global: { test: true } };

        RuleTester.setDefaultConfig(config);
        assert(
            RuleTester.getDefaultConfig().global.test,
            "The default config object is incorrect"
        );
    });

    it("should correctly reset the global configuration", () => {
        const config = { global: { test: true } };

        RuleTester.setDefaultConfig(config);
        RuleTester.resetDefaultConfig();
        assert.deepEqual(
            RuleTester.getDefaultConfig(),
            { rules: {} },
            "The default configuration has not reset correctly"
        );
    });

    it("should enforce the global configuration to be an object", () => {

        /**
         * Set the default config for the rules tester
         * @param {Object} config configuration object
         * @returns {Function} Function to be executed
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

    it("should pass-through the global config to the tester then to the to rule", () => {
        const config = { global: { test: true } };

        RuleTester.setDefaultConfig(config);
        ruleTester = new RuleTester();

        assert.doesNotThrow(() => {
            ruleTester.run("no-test-global", require("../../fixtures/testers/rule-tester/no-test-global"), {
                valid: [
                    "var test = 'foo'",
                    "var test2 = test"
                ],
                invalid: [{ code: "bar", errors: 1, global: { foo: true } }]
            });
        });
    });

    it("should throw an error if AST was modified", () => {
        assert.throws(() => {
            ruleTester.run("foo", require("../../fixtures/testers/rule-tester/modify-ast"), {
                valid: [
                    "var foo = 0;"
                ],
                invalid: []
            });
        }, "Rule should not modify AST.");
        assert.throws(() => {
            ruleTester.run("foo", require("../../fixtures/testers/rule-tester/modify-ast"), {
                valid: [],
                invalid: [
                    { code: "var bar = 0;", errors: ["error"] }
                ]
            });
        }, "Rule should not modify AST.");
    });

    it("should throw an error if AST was modified (at Program)", () => {
        assert.throws(() => {
            ruleTester.run("foo", require("../../fixtures/testers/rule-tester/modify-ast-at-first"), {
                valid: [
                    "var foo = 0;"
                ],
                invalid: []
            });
        }, "Rule should not modify AST.");
        assert.throws(() => {
            ruleTester.run("foo", require("../../fixtures/testers/rule-tester/modify-ast-at-first"), {
                valid: [],
                invalid: [
                    { code: "var bar = 0;", errors: ["error"] }
                ]
            });
        }, "Rule should not modify AST.");
    });

    it("should throw an error if AST was modified (at Program:exit)", () => {
        assert.throws(() => {
            ruleTester.run("foo", require("../../fixtures/testers/rule-tester/modify-ast-at-last"), {
                valid: [
                    "var foo = 0;"
                ],
                invalid: []
            });
        }, "Rule should not modify AST.");
        assert.throws(() => {
            ruleTester.run("foo", require("../../fixtures/testers/rule-tester/modify-ast-at-last"), {
                valid: [],
                invalid: [
                    { code: "var bar = 0;", errors: ["error"] }
                ]
            });
        }, "Rule should not modify AST.");
    });

    it("should throw an error if no test scenarios given", () => {
        assert.throws(() => {
            ruleTester.run("foo", require("../../fixtures/testers/rule-tester/modify-ast-at-last"));
        }, "Test Scenarios for rule foo : Could not find test scenario object");
    });

    it("should throw an error if no acceptable test scenario object is given", () => {
        assert.throws(() => {
            ruleTester.run("foo", require("../../fixtures/testers/rule-tester/modify-ast-at-last"), []);
        }, "Test Scenarios for rule foo is invalid:\nCould not find any valid test scenarios\nCould not find any invalid test scenarios");
        assert.throws(() => {
            ruleTester.run("foo", require("../../fixtures/testers/rule-tester/modify-ast-at-last"), "");
        }, "Test Scenarios for rule foo : Could not find test scenario object");
        assert.throws(() => {
            ruleTester.run("foo", require("../../fixtures/testers/rule-tester/modify-ast-at-last"), 2);
        }, "Test Scenarios for rule foo : Could not find test scenario object");
        assert.throws(() => {
            ruleTester.run("foo", require("../../fixtures/testers/rule-tester/modify-ast-at-last"), {});
        }, "Test Scenarios for rule foo is invalid:\nCould not find any valid test scenarios\nCould not find any invalid test scenarios");
        assert.throws(() => {
            ruleTester.run("foo", require("../../fixtures/testers/rule-tester/modify-ast-at-last"), {
                valid: []
            });
        }, "Test Scenarios for rule foo is invalid:\nCould not find any invalid test scenarios");
        assert.throws(() => {
            ruleTester.run("foo", require("../../fixtures/testers/rule-tester/modify-ast-at-last"), {
                invalid: []
            });
        }, "Test Scenarios for rule foo is invalid:\nCould not find any valid test scenarios");
    });
});
