/**
 * @fileoverview Tests for ESLint Tester
 * @author Nicholas C. Zakas
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------
const sinon = require("sinon"),
    EventEmitter = require("events"),
    RuleTester = require("../../../lib/testers/rule-tester"),
    assert = require("chai").assert,
    nodeAssert = require("assert");

const NODE_ASSERT_STRICT_EQUAL_OPERATOR = (() => {
    try {
        nodeAssert.strictEqual(1, 2);
    } catch (err) {
        return err.operator;
    }
    throw new Error("unexpected successful assertion");
})();

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
 *
 * To assert that the right arguments are passed to RuleTester.describe/it, an
 * event emitter is used which emits the arguments.
 */

const ruleTesterTestEmitter = new EventEmitter();

RuleTester.describe = function(text, method) {
    ruleTesterTestEmitter.emit("describe", text, method);
    return method.call(this);
};

RuleTester.it = function(text, method) {
    ruleTesterTestEmitter.emit("it", text, method);
    return method.call(this);
};

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("RuleTester", () => {

    let ruleTester;

    /**
     * @description A helper function to verify Node.js core error messages.
     * @param {string} actual The actual input
     * @param {string} expected The expected input
     * @returns {Function} Error callback to verify that the message is correct
     *                     for the actual and expected input.
     */
    function assertErrorMatches(actual, expected) {
        const err = new nodeAssert.AssertionError({
            actual,
            expected,
            operator: NODE_ASSERT_STRICT_EQUAL_OPERATOR
        });

        return err.message;
    }

    beforeEach(() => {
        RuleTester.resetDefaultConfig();
        ruleTester = new RuleTester();
    });

    it("should not throw an error when everything passes", () => {
        ruleTester.run("no-eval", require("../../fixtures/testers/rule-tester/no-eval"), {
            valid: [
                "Eval(foo)"
            ],
            invalid: [
                { code: "eval(foo)", errors: [{ message: "eval sucks.", type: "CallExpression" }] }
            ]
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
        }, /Should have no errors but had 1/u);
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
        }, /Should have no errors but had 1/u);
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
        }, /Should have 1 error but had 0/u);
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
        }, assertErrorMatches("Bad var.", "Bad error message."));
    });

    it("should throw an error when the error message regex does not match", () => {
        assert.throws(() => {
            ruleTester.run("no-var", require("../../fixtures/testers/rule-tester/no-var"), {
                valid: [],
                invalid: [
                    { code: "var foo = bar;", errors: [{ message: /Bad error message/u }] }
                ]
            });
        }, /Expected 'Bad var.' to match \/Bad error message\//u);
    });

    it("should throw an error when the error is not a supported type", () => {
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
        }, /Error should be a string, object, or RegExp/u);
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
        }, assertErrorMatches("Bad var.", "Bad error message."));
    });

    it("should throw an error when the error is a string and it does not match error message", () => {
        assert.throws(() => {
            ruleTester.run("no-var", require("../../fixtures/testers/rule-tester/no-var"), {

                valid: [
                ],
                invalid: [
                    { code: "var foo = bar;", errors: [/Bad error message/u] }
                ]
            });
        }, /Expected 'Bad var.' to match \/Bad error message\//u);
    });

    it("should not throw an error when the error is a string and it matches error message", () => {
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

    it("should not throw an error when the error is a regex and it matches error message", () => {
        ruleTester.run("no-var", require("../../fixtures/testers/rule-tester/no-var"), {
            valid: [],
            invalid: [
                { code: "var foo = bar;", errors: [/^Bad var/u] }
            ]
        });
    });

    it("should not throw an error when the error is a regex in an object and it matches error message", () => {
        ruleTester.run("no-var", require("../../fixtures/testers/rule-tester/no-var"), {
            valid: [],
            invalid: [
                { code: "var foo = bar;", errors: [{ message: /^Bad var/u }] }
            ]
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
        }, /Output is incorrect/u);
    });

    it("should use strict equality to compare output", () => {
        const replaceProgramWith5Rule = {
            create: context => ({
                Program(node) {
                    context.report({ node, message: "bad", fix: fixer => fixer.replaceText(node, "5") });
                }
            })
        };

        // Should not throw.
        ruleTester.run("foo", replaceProgramWith5Rule, {
            valid: [],
            invalid: [
                { code: "var foo = bar;", output: "5", errors: 1 }
            ]
        });

        assert.throws(() => {
            ruleTester.run("foo", replaceProgramWith5Rule, {
                valid: [],
                invalid: [
                    { code: "var foo = bar;", output: 5, errors: 1 }
                ]
            });
        }, /Output is incorrect/u);
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
        }, /Output is incorrect/u);
    });

    it("should not throw an error when the expected output is null and no errors produce output", () => {
        ruleTester.run("no-eval", require("../../fixtures/testers/rule-tester/no-eval"), {
            valid: [
                "bar = baz;"
            ],
            invalid: [
                { code: "eval(x)", errors: 1, output: null },
                { code: "eval(x); eval(y);", errors: 2, output: null }
            ]
        });
    });

    it("should throw an error when the expected output is null and problems produce output", () => {
        assert.throws(() => {
            ruleTester.run("no-var", require("../../fixtures/testers/rule-tester/no-var"), {
                valid: [
                    "bar = baz;"
                ],
                invalid: [
                    { code: "var foo = bar;", output: null, errors: 1 }
                ]
            });
        }, /Expected no autofixes to be suggested/u);

        assert.throws(() => {
            ruleTester.run("no-var", require("../../fixtures/testers/rule-tester/no-var"), {
                valid: [
                    "bar = baz;"
                ],
                invalid: [
                    { code: "var foo = bar; var qux = boop;", output: null, errors: 2 }
                ]
            });
        }, /Expected no autofixes to be suggested/u);
    });

    it("should throw an error when the expected output is null and only some problems produce output", () => {
        assert.throws(() => {
            ruleTester.run("fixes-one-problem", require("../../fixtures/testers/rule-tester/fixes-one-problem"), {
                valid: [],
                invalid: [
                    { code: "foo", output: null, errors: 2 }
                ]
            });
        }, /Expected no autofixes to be suggested/u);
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
        }, /Error type should be CallExpression2, found CallExpression/u);
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
        }, /Error line should be 5/u);
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
        }, /Error line should be 0/u);
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
        }, /Error column should be 0/u);
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
                    {
                        code: "eval(foo)",
                        errors: [
                            { message: "eval sucks.", type: "CallExpression" },
                            { message: "eval sucks.", type: "CallExpression" }
                        ]
                    }
                ]
            });
        }, /Should have 2 errors but had 1/u);
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
        }, /Did not specify errors for an invalid test of no-eval/u);
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
        }, /Should have 2 errors but had 1/u);
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
        }, /fatal parsing error/iu);
    });

    it("should not throw an error if invalid code has at least an expected empty error object", () => {
        ruleTester.run("no-eval", require("../../fixtures/testers/rule-tester/no-eval"), {
            valid: ["Eval(foo)"],
            invalid: [{
                code: "eval(foo)",
                errors: [{}]
            }]
        });
    });

    it("should pass-through the globals config of valid tests to the to rule", () => {
        ruleTester.run("no-test-global", require("../../fixtures/testers/rule-tester/no-test-global"), {
            valid: [
                "var test = 'foo'",
                {
                    code: "var test2 = 'bar'",
                    globals: { test: true }
                }
            ],
            invalid: [{ code: "bar", errors: 1 }]
        });
    });

    it("should pass-through the globals config of invalid tests to the to rule", () => {
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
                }
            ]
        });
    });

    it("should pass-through the settings config to rules", () => {
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

    it("should throw an error if the options are an object", () => {
        assert.throws(() => {
            ruleTester.run("no-invalid-args", require("../../fixtures/testers/rule-tester/no-invalid-args"), {
                valid: [
                    {
                        code: "foo",
                        options: { ok: true }
                    }
                ],
                invalid: []
            });
        }, /options must be an array/u);
    });

    it("should throw an error if the options are a number", () => {
        assert.throws(() => {
            ruleTester.run("no-invalid-args", require("../../fixtures/testers/rule-tester/no-invalid-args"), {
                valid: [
                    {
                        code: "foo",
                        options: 0
                    }
                ],
                invalid: []
            });
        }, /options must be an array/u);
    });

    it("should pass-through the parser to the rule", () => {
        const spy = sinon.spy(ruleTester.linter, "verify");

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
        assert.strictEqual(spy.args[1][1].parser, "esprima");
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
        }, "Schema for rule no-invalid-schema is invalid:,\titems: should be object\n\titems[0].enum: should NOT have fewer than 1 items\n\titems: should match some schema in anyOf");

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
        }, /Value "bar" should be equal to one of the allowed values./u);

    });

    it("throw an error when an unknown config option is included", () => {
        assert.throws(() => {
            ruleTester.run("no-eval", require("../../fixtures/testers/rule-tester/no-eval"), {
                valid: [
                    { code: "Eval(foo)", foo: "bar" }
                ],
                invalid: []
            });
        }, /ESLint configuration in rule-tester is invalid./u);
    });

    it("throw an error when an invalid config value is included", () => {
        assert.throws(() => {
            ruleTester.run("no-eval", require("../../fixtures/testers/rule-tester/no-eval"), {
                valid: [
                    { code: "Eval(foo)", env: ["es6"] }
                ],
                invalid: []
            });
        }, /Property "env" is the wrong type./u);
    });

    it("should pass-through the tester config to the rule", () => {
        ruleTester = new RuleTester({
            globals: { test: true }
        });

        ruleTester.run("no-test-global", require("../../fixtures/testers/rule-tester/no-test-global"), {
            valid: [
                "var test = 'foo'",
                "var test2 = test"
            ],
            invalid: [{ code: "bar", errors: 1, globals: { foo: true } }]
        });
    });

    it("should correctly set the globals configuration", () => {
        const config = { globals: { test: true } };

        RuleTester.setDefaultConfig(config);
        assert(
            RuleTester.getDefaultConfig().globals.test,
            "The default config object is incorrect"
        );
    });

    it("should correctly reset the global configuration", () => {
        const config = { globals: { test: true } };

        RuleTester.setDefaultConfig(config);
        RuleTester.resetDefaultConfig();
        assert.deepStrictEqual(
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

    it("should pass-through the globals config to the tester then to the to rule", () => {
        const config = { globals: { test: true } };

        RuleTester.setDefaultConfig(config);
        ruleTester = new RuleTester();

        ruleTester.run("no-test-global", require("../../fixtures/testers/rule-tester/no-test-global"), {
            valid: [
                "var test = 'foo'",
                "var test2 = test"
            ],
            invalid: [{ code: "bar", errors: 1, globals: { foo: true } }]
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

    // Nominal message/messageId use cases
    it("should assert match if message provided in both test and result.", () => {
        assert.throws(() => {
            ruleTester.run("foo", require("../../fixtures/testers/rule-tester/messageId").withMessageOnly, {
                valid: [],
                invalid: [{ code: "foo", errors: [{ message: "something" }] }]
            });
        }, /Avoid using variables named/u);

        ruleTester.run("foo", require("../../fixtures/testers/rule-tester/messageId").withMessageOnly, {
            valid: [],
            invalid: [{ code: "foo", errors: [{ message: "Avoid using variables named 'foo'." }] }]
        });
    });

    it("should assert match between messageId if provided in both test and result.", () => {
        assert.throws(() => {
            ruleTester.run("foo", require("../../fixtures/testers/rule-tester/messageId").withMetaWithData, {
                valid: [],
                invalid: [{ code: "foo", errors: [{ messageId: "unused" }] }]
            });
        }, "messageId 'avoidFoo' does not match expected messageId 'unused'.");

        ruleTester.run("foo", require("../../fixtures/testers/rule-tester/messageId").withMetaWithData, {
            valid: [],
            invalid: [{ code: "foo", errors: [{ messageId: "avoidFoo" }] }]
        });
    });
    it("should assert match between resulting message output if messageId and data provided in both test and result", () => {
        assert.throws(() => {
            ruleTester.run("foo", require("../../fixtures/testers/rule-tester/messageId").withMetaWithData, {
                valid: [],
                invalid: [{ code: "foo", errors: [{ messageId: "avoidFoo", data: { name: "notFoo" } }] }]
            });
        }, "Hydrated message \"Avoid using variables named 'notFoo'.\" does not match \"Avoid using variables named 'foo'.\"");
    });

    // messageId/message misconfiguration cases
    it("should throw if user tests for both message and messageId", () => {
        assert.throws(() => {
            ruleTester.run("foo", require("../../fixtures/testers/rule-tester/messageId").withMetaWithData, {
                valid: [],
                invalid: [{ code: "foo", errors: [{ message: "something", messageId: "avoidFoo" }] }]
            });
        }, "Error should not specify both 'message' and a 'messageId'.");
    });
    it("should throw if user tests for messageId but the rule doesn't use the messageId meta syntax.", () => {
        assert.throws(() => {
            ruleTester.run("foo", require("../../fixtures/testers/rule-tester/messageId").withMessageOnly, {
                valid: [],
                invalid: [{ code: "foo", errors: [{ messageId: "avoidFoo" }] }]
            });
        }, "Error can not use 'messageId' if rule under test doesn't define 'meta.messages'");
    });
    it("should throw if user tests for messageId not listed in the rule's meta syntax.", () => {
        assert.throws(() => {
            ruleTester.run("foo", require("../../fixtures/testers/rule-tester/messageId").withMetaWithData, {
                valid: [],
                invalid: [{ code: "foo", errors: [{ messageId: "useFoo" }] }]
            });
        }, /Invalid messageId 'useFoo'/u);
    });
    it("should throw if data provided without messageId.", () => {
        assert.throws(() => {
            ruleTester.run("foo", require("../../fixtures/testers/rule-tester/messageId").withMetaWithData, {
                valid: [],
                invalid: [{ code: "foo", errors: [{ data: "something" }] }]
            });
        }, "Error must specify 'messageId' if 'data' is used.");
    });

    describe("naming test cases", () => {

        /**
         * Asserts that a particular value will be emitted from an EventEmitter.
         * @param {EventEmitter} emitter The emitter that should emit a value
         * @param {string} emitType The type of emission to listen for
         * @param {*} expectedValue The value that should be emitted
         * @returns {Promise} A Promise that fulfills if the value is emitted, and rejects if something else is emitted.
         * The Promise will be indefinitely pending if no value is emitted.
         */
        function assertEmitted(emitter, emitType, expectedValue) {
            return new Promise((resolve, reject) => {
                emitter.once(emitType, emittedValue => {
                    if (emittedValue === expectedValue) {
                        resolve();
                    } else {
                        reject(new Error(`Expected ${expectedValue} to be emitted but ${emittedValue} was emitted instead.`));
                    }
                });
            });
        }

        it("should use the first argument as the name of the test suite", () => {
            const assertion = assertEmitted(ruleTesterTestEmitter, "describe", "this-is-a-rule-name");

            ruleTester.run("this-is-a-rule-name", require("../../fixtures/testers/rule-tester/no-var"), {
                valid: [],
                invalid: []
            });

            return assertion;
        });

        it("should use the test code as the name of the tests for valid code (string form)", () => {
            const assertion = assertEmitted(ruleTesterTestEmitter, "it", "valid(code);");

            ruleTester.run("foo", require("../../fixtures/testers/rule-tester/no-var"), {
                valid: [
                    "valid(code);"
                ],
                invalid: []
            });

            return assertion;
        });

        it("should use the test code as the name of the tests for valid code (object form)", () => {
            const assertion = assertEmitted(ruleTesterTestEmitter, "it", "valid(code);");

            ruleTester.run("foo", require("../../fixtures/testers/rule-tester/no-var"), {
                valid: [
                    {
                        code: "valid(code);"
                    }
                ],
                invalid: []
            });

            return assertion;
        });

        it("should use the test code as the name of the tests for invalid code", () => {
            const assertion = assertEmitted(ruleTesterTestEmitter, "it", "var x = invalid(code);");

            ruleTester.run("foo", require("../../fixtures/testers/rule-tester/no-var"), {
                valid: [],
                invalid: [
                    {
                        code: "var x = invalid(code);",
                        errors: 1
                    }
                ]
            });

            return assertion;
        });

        // https://github.com/eslint/eslint/issues/8142
        it("should use the empty string as the name of the test if the test case is an empty string", () => {
            const assertion = assertEmitted(ruleTesterTestEmitter, "it", "");

            ruleTester.run("foo", require("../../fixtures/testers/rule-tester/no-var"), {
                valid: [
                    {
                        code: ""
                    }
                ],
                invalid: []
            });

            return assertion;
        });
    });
});
