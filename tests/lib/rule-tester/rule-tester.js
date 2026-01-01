/**
 * @fileoverview Tests for ESLint Tester
 * @author Nicholas C. Zakas
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------
const sinon = require("sinon"),
	EventEmitter = require("node:events"),
	{ RuleTester } = require("../../../lib/rule-tester"),
	assert = require("chai").assert,
	nodeAssert = require("node:assert");

const jsonPlugin = require("@eslint/json").default;

//-----------------------------------------------------------------------------
// Helpers
//-----------------------------------------------------------------------------

const NODE_ASSERT_STRICT_EQUAL_OPERATOR = (() => {
	try {
		nodeAssert.strictEqual(1, 2);
	} catch (err) {
		return err.operator;
	}
	throw new Error("unexpected successful assertion");
})();

/**
 * A helper function to verify Node.js core error messages.
 * @param {string} actual The actual input
 * @param {string} expected The expected input
 * @returns {Function} Error callback to verify that the message is correct
 *                     for the actual and expected input.
 */
function assertErrorMatches(actual, expected) {
	const err = new nodeAssert.AssertionError({
		actual,
		expected,
		operator: NODE_ASSERT_STRICT_EQUAL_OPERATOR,
	});

	return err.message;
}

/**
 * Do nothing.
 * @returns {void}
 */
function noop() {
	// do nothing.
}

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

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("RuleTester", () => {
	let ruleTester;

	// Stub `describe()` and `it()` while this test suite.
	before(() => {
		RuleTester.describe = function (text, method) {
			ruleTesterTestEmitter.emit("describe", text, method);
			return method.call(this);
		};
		RuleTester.it = function (text, method) {
			ruleTesterTestEmitter.emit("it", text, method);
			return method.call(this);
		};
	});

	after(() => {
		RuleTester.describe = null;
		RuleTester.it = null;
	});

	beforeEach(() => {
		ruleTester = new RuleTester();
	});

	describe("Default Config", () => {
		afterEach(() => {
			RuleTester.resetDefaultConfig();
		});

		it("should correctly set the globals configuration", () => {
			const config = { languageOptions: { globals: { test: true } } };

			RuleTester.setDefaultConfig(config);
			assert(
				RuleTester.getDefaultConfig().languageOptions.globals.test,
				"The default config object is incorrect",
			);
		});

		it("should correctly reset the global configuration", () => {
			const config = { languageOptions: { globals: { test: true } } };

			RuleTester.setDefaultConfig(config);
			RuleTester.resetDefaultConfig();
			assert.deepStrictEqual(
				RuleTester.getDefaultConfig(),
				{ rules: {} },
				"The default configuration has not reset correctly",
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
				return function () {
					RuleTester.setDefaultConfig(config);
				};
			}
			const errorMessage =
				"RuleTester.setDefaultConfig: config must be an object";

			assert.throw(setConfig(), errorMessage);
			assert.throw(setConfig(1), errorMessage);
			assert.throw(setConfig(3.14), errorMessage);
			assert.throw(setConfig("foo"), errorMessage);
			assert.throw(setConfig(null), errorMessage);
			assert.throw(setConfig(true), errorMessage);
		});

		it("should pass-through the globals config to the tester then to the to rule", () => {
			const config = {
				languageOptions: {
					sourceType: "script",
					globals: { test: true },
				},
			};

			RuleTester.setDefaultConfig(config);
			ruleTester = new RuleTester();

			ruleTester.run(
				"no-test-global",
				require("../../fixtures/testers/rule-tester/no-test-global"),
				{
					valid: ["var test = 'foo'", "var test2 = test"],
					invalid: [
						{
							code: "bar",
							errors: 1,
							languageOptions: { globals: { foo: true } },
						},
					],
				},
			);
		});

		it("should throw an error if node.start is accessed with parser in default config", () => {
			const enhancedParser = require("../../fixtures/parsers/enhanced-parser");

			RuleTester.setDefaultConfig({
				languageOptions: {
					parser: enhancedParser,
				},
			});
			ruleTester = new RuleTester();

			/*
			 * Note: More robust test for start/end found later in file.
			 * This one is just for checking the default config has a
			 * parser that is wrapped.
			 */
			const usesStartEndRule = {
				create() {
					return {
						CallExpression(node) {
							noop(node.arguments[1].start);
						},
					};
				},
			};

			assert.throws(() => {
				ruleTester.run("uses-start-end", usesStartEndRule, {
					valid: ["foo(a, b)"],
					invalid: [],
				});
			}, "Use node.range[0] instead of node.start");
		});
	});

	describe("only", () => {
		describe("`itOnly` accessor", () => {
			describe("when `itOnly` is set", () => {
				before(() => {
					RuleTester.itOnly = sinon.spy();
				});
				after(() => {
					RuleTester.itOnly = void 0;
				});
				beforeEach(() => {
					RuleTester.itOnly.resetHistory();
					ruleTester = new RuleTester();
				});

				it("is called by exclusive tests", () => {
					ruleTester.run(
						"no-var",
						require("../../fixtures/testers/rule-tester/no-var"),
						{
							valid: [
								{
									code: "const notVar = 42;",
									only: true,
								},
							],
							invalid: [],
						},
					);

					sinon.assert.calledWith(
						RuleTester.itOnly,
						"const notVar = 42;",
					);
				});
			});

			describe("when `it` is set and has an `only()` method", () => {
				before(() => {
					RuleTester.it.only = () => {};
					sinon.spy(RuleTester.it, "only");
				});
				after(() => {
					RuleTester.it.only = void 0;
				});
				beforeEach(() => {
					RuleTester.it.only.resetHistory();
					ruleTester = new RuleTester();
				});

				it("is called by tests with `only` set", () => {
					ruleTester.run(
						"no-var",
						require("../../fixtures/testers/rule-tester/no-var"),
						{
							valid: [
								{
									code: "const notVar = 42;",
									only: true,
								},
							],
							invalid: [],
						},
					);

					sinon.assert.calledWith(
						RuleTester.it.only,
						"const notVar = 42;",
					);
				});
			});

			describe("when global `it` is a function that has an `only()` method", () => {
				let originalGlobalItOnly;

				before(() => {
					/*
					 * We run tests with `--forbid-only`, so we have to override
					 * `it.only` to prevent the real one from being called.
					 */
					originalGlobalItOnly = it.only;
					it.only = () => {};
					sinon.spy(it, "only");
				});
				after(() => {
					it.only = originalGlobalItOnly;
				});
				beforeEach(() => {
					it.only.resetHistory();
					ruleTester = new RuleTester();
				});

				it("is called by tests with `only` set", () => {
					ruleTester.run(
						"no-var",
						require("../../fixtures/testers/rule-tester/no-var"),
						{
							valid: [
								{
									code: "const notVar = 42;",
									only: true,
								},
							],
							invalid: [],
						},
					);

					sinon.assert.calledWith(it.only, "const notVar = 42;");
				});
			});

			describe("when `describe` and `it` are overridden without `itOnly`", () => {
				let originalGlobalItOnly;

				before(() => {
					/*
					 * These tests override `describe` and `it` already, so we
					 * don't need to override them here. We do, however, need to
					 * remove `only` from the global `it` to prevent it from
					 * being used instead.
					 */
					originalGlobalItOnly = it.only;
					it.only = void 0;
				});
				after(() => {
					it.only = originalGlobalItOnly;
				});
				beforeEach(() => {
					ruleTester = new RuleTester();
				});

				it("throws an error recommending overriding `itOnly`", () => {
					assert.throws(() => {
						ruleTester.run(
							"no-var",
							require("../../fixtures/testers/rule-tester/no-var"),
							{
								valid: [
									{
										code: "const notVar = 42;",
										only: true,
									},
								],
								invalid: [],
							},
						);
					}, "Set `RuleTester.itOnly` to use `only` with a custom test framework.");
				});
			});

			describe("when global `it` is a function that does not have an `only()` method", () => {
				let originalGlobalIt;
				let originalRuleTesterDescribe;
				let originalRuleTesterIt;

				before(() => {
					originalGlobalIt = global.it;

					// eslint-disable-next-line no-global-assign -- Temporarily override Mocha global
					it = () => {};

					/*
					 * These tests override `describe` and `it`, so we need to
					 * un-override them here so they won't interfere.
					 */
					originalRuleTesterDescribe = RuleTester.describe;
					RuleTester.describe = void 0;
					originalRuleTesterIt = RuleTester.it;
					RuleTester.it = void 0;
				});
				after(() => {
					// eslint-disable-next-line no-global-assign -- Restore Mocha global
					it = originalGlobalIt;
					RuleTester.describe = originalRuleTesterDescribe;
					RuleTester.it = originalRuleTesterIt;
				});
				beforeEach(() => {
					ruleTester = new RuleTester();
				});

				it("throws an error explaining that the current test framework does not support `only`", () => {
					assert.throws(() => {
						ruleTester.run(
							"no-var",
							require("../../fixtures/testers/rule-tester/no-var"),
							{
								valid: [
									{
										code: "const notVar = 42;",
										only: true,
									},
								],
								invalid: [],
							},
						);
					}, "The current test framework does not support exclusive tests with `only`.");
				});
			});
		});

		describe("test cases", () => {
			const ruleName = "no-var";
			const rule = require("../../fixtures/testers/rule-tester/no-var");

			let originalRuleTesterIt;
			let spyRuleTesterIt;
			let originalRuleTesterItOnly;
			let spyRuleTesterItOnly;

			before(() => {
				originalRuleTesterIt = RuleTester.it;
				spyRuleTesterIt = sinon.spy();
				RuleTester.it = spyRuleTesterIt;
				originalRuleTesterItOnly = RuleTester.itOnly;
				spyRuleTesterItOnly = sinon.spy();
				RuleTester.itOnly = spyRuleTesterItOnly;
			});
			after(() => {
				RuleTester.it = originalRuleTesterIt;
				RuleTester.itOnly = originalRuleTesterItOnly;
			});
			beforeEach(() => {
				spyRuleTesterIt.resetHistory();
				spyRuleTesterItOnly.resetHistory();
				ruleTester = new RuleTester();
			});

			it("isn't called for normal tests", () => {
				ruleTester.run(ruleName, rule, {
					valid: ["const notVar = 42;"],
					invalid: [],
				});
				sinon.assert.calledWith(spyRuleTesterIt, "const notVar = 42;");
				sinon.assert.notCalled(spyRuleTesterItOnly);
			});

			it("calls it or itOnly for every test case", () => {
				/*
				 * `RuleTester` doesn't implement test case exclusivity itself.
				 * Setting `only: true` just causes `RuleTester` to call
				 * whatever `only()` function is provided by the test framework
				 * instead of the regular `it()` function.
				 */

				ruleTester.run(ruleName, rule, {
					valid: [
						"const valid = 42;",
						{
							code: "const onlyValid = 42;",
							only: true,
						},
					],
					invalid: [
						{
							code: "var invalid = 42;",
							errors: [/^Bad var/u],
						},
						{
							code: "var onlyInvalid = 42;",
							errors: [/^Bad var/u],
							only: true,
						},
					],
				});

				sinon.assert.calledWith(spyRuleTesterIt, "const valid = 42;");
				sinon.assert.calledWith(
					spyRuleTesterItOnly,
					"const onlyValid = 42;",
				);
				sinon.assert.calledWith(spyRuleTesterIt, "var invalid = 42;");
				sinon.assert.calledWith(
					spyRuleTesterItOnly,
					"var onlyInvalid = 42;",
				);
			});
		});

		describe("static helper wrapper", () => {
			it("adds `only` to string test cases", () => {
				const test = RuleTester.only("const valid = 42;");

				assert.deepStrictEqual(test, {
					code: "const valid = 42;",
					only: true,
				});
			});

			it("adds `only` to object test cases", () => {
				const test = RuleTester.only({ code: "const valid = 42;" });

				assert.deepStrictEqual(test, {
					code: "const valid = 42;",
					only: true,
				});
			});
		});
	});

	describe("hooks", () => {
		const ruleName = "no-var";
		const rule = require("../../fixtures/testers/rule-tester/no-var");

		["before", "after"].forEach(hookName => {
			it(`${hookName} should be called when a function is assigned`, () => {
				const hookForValid = sinon.stub();
				const hookForInvalid = sinon.stub();

				ruleTester = new RuleTester();
				ruleTester.run(ruleName, rule, {
					valid: [
						{
							code: "const onlyValid = 42;",
							[hookName]: hookForValid,
						},
					],
					invalid: [
						{
							code: "var onlyValid = 42;",
							errors: [/^Bad var/u],
							output: " onlyValid = 42;",
							[hookName]: hookForInvalid,
						},
					],
				});
				sinon.assert.calledOnce(hookForValid);
				sinon.assert.calledOnce(hookForInvalid);
			});

			it(`${hookName} should cause test to fail when it throws error`, () => {
				const hook = sinon
					.stub()
					.throws(new Error("Something happened"));

				ruleTester = new RuleTester();
				assert.throws(
					() =>
						ruleTester.run(ruleName, rule, {
							valid: [
								{
									code: "const onlyValid = 42;",
									[hookName]: hook,
								},
							],
							invalid: [],
						}),
					"Something happened",
				);
				assert.throws(
					() =>
						ruleTester.run(ruleName, rule, {
							valid: [],
							invalid: [
								{
									code: "var onlyValid = 42;",
									errors: [/^Bad var/u],
									output: " onlyValid = 42;",
									[hookName]: hook,
								},
							],
						}),
					"Something happened",
				);
			});

			it(`${hookName} should throw when not a function is assigned`, () => {
				ruleTester = new RuleTester();
				assert.throws(
					() =>
						ruleTester.run(ruleName, rule, {
							valid: [
								{
									code: "const onlyValid = 42;",
									[hookName]: 42,
								},
							],
							invalid: [],
						}),
					`Optional test case property '${hookName}' must be a function`,
				);
				assert.throws(
					() =>
						ruleTester.run(ruleName, rule, {
							valid: [],
							invalid: [
								{
									code: "var onlyValid = 42;",
									errors: [/^Bad var/u],
									output: " onlyValid = 42;",
									[hookName]: 42,
								},
							],
						}),
					`Optional test case property '${hookName}' must be a function`,
				);
			});
		});

		it("should call both before() and after() hooks even when the case failed", () => {
			const hookBefore = sinon.stub();
			const hookAfter = sinon.stub();

			ruleTester = new RuleTester();
			assert.throws(() =>
				ruleTester.run(ruleName, rule, {
					valid: [
						{
							code: "var onlyValid = 42;",
							before: hookBefore,
							after: hookAfter,
						},
					],
					invalid: [],
				}),
			);
			sinon.assert.calledOnce(hookBefore);
			sinon.assert.calledOnce(hookAfter);
			assert.throws(() =>
				ruleTester.run(ruleName, rule, {
					valid: [],
					invalid: [
						{
							code: "const onlyValid = 42;",
							errors: [/^Bad var/u],
							output: " onlyValid = 42;",
							before: hookBefore,
							after: hookAfter,
						},
					],
				}),
			);
			sinon.assert.calledTwice(hookBefore);
			sinon.assert.calledTwice(hookAfter);
		});

		it("should call both before() and after() hooks regardless syntax errors", () => {
			const hookBefore = sinon.stub();
			const hookAfter = sinon.stub();

			ruleTester = new RuleTester();
			assert.throws(
				() =>
					ruleTester.run(ruleName, rule, {
						valid: [
							{
								code: "invalid javascript code",
								before: hookBefore,
								after: hookAfter,
							},
						],
						invalid: [],
					}),
				/parsing error/u,
			);
			sinon.assert.calledOnce(hookBefore);
			sinon.assert.calledOnce(hookAfter);
			assert.throws(
				() =>
					ruleTester.run(ruleName, rule, {
						valid: [],
						invalid: [
							{
								code: "invalid javascript code",
								errors: [/^Bad var/u],
								output: " onlyValid = 42;",
								before: hookBefore,
								after: hookAfter,
							},
						],
					}),
				/parsing error/u,
			);
			sinon.assert.calledTwice(hookBefore);
			sinon.assert.calledTwice(hookAfter);
		});

		it("should call after() hook even when before() throws", () => {
			const hookBefore = sinon
				.stub()
				.throws(new Error("Something happened in before()"));
			const hookAfter = sinon.stub();

			ruleTester = new RuleTester();
			assert.throws(
				() =>
					ruleTester.run(ruleName, rule, {
						valid: [
							{
								code: "const onlyValid = 42;",
								before: hookBefore,
								after: hookAfter,
							},
						],
						invalid: [],
					}),
				"Something happened in before()",
			);
			sinon.assert.calledOnce(hookBefore);
			sinon.assert.calledOnce(hookAfter);
			assert.throws(
				() =>
					ruleTester.run(ruleName, rule, {
						valid: [],
						invalid: [
							{
								code: "var onlyValid = 42;",
								errors: [/^Bad var/u],
								output: " onlyValid = 42;",
								before: hookBefore,
								after: hookAfter,
							},
						],
					}),
				"Something happened in before()",
			);
			sinon.assert.calledTwice(hookBefore);
			sinon.assert.calledTwice(hookAfter);
		});
	});

	describe("assert valid test cases", () => {
		/**
		 * Runs valid tests
		 * @param {Array<string|object>} valid Valid tests
		 * @returns {void}
		 */
		function runValidTests(valid) {
			ruleTester.run(
				"no-eval",
				require("../../fixtures/testers/rule-tester/no-eval"),
				{ valid, invalid: [] },
			);
		}

		it("Valid test case must not have 'errors' property", () => {
			assert.throws(() => {
				runValidTests([{ code: "", errors: 1 }]);
			}, /Valid test case must not have 'errors' property/u);

			assert.throws(() => {
				runValidTests([{ code: "", errors: [{ message: "foo" }] }]);
			}, /Valid test case must not have 'errors' property/u);

			assert.throws(() => {
				runValidTests([{ code: "", errors: 0 }]);
			}, /Valid test case must not have 'errors' property/u);

			assert.throws(() => {
				runValidTests([{ code: "", errors: [] }]);
			}, /Valid test case must not have 'errors' property/u);
		});

		it("Valid test case can have 'errors' property set to undefined", () => {
			runValidTests([{ code: "", errors: void 0 }]);
		});

		it("Valid test case must not have 'output' property", () => {
			assert.throws(() => {
				runValidTests([{ code: "", output: "" }]);
			}, /Valid test case must not have 'output' property/u);

			assert.throws(() => {
				runValidTests([{ code: "", output: null }]);
			}, /Valid test case must not have 'output' property/u);
		});

		it("Valid test case can have 'output' property set to undefined", () => {
			runValidTests([{ code: "", output: void 0 }]);
		});
	});

	it("should not throw an error when everything passes", () => {
		ruleTester.run(
			"no-eval",
			require("../../fixtures/testers/rule-tester/no-eval"),
			{
				valid: ["Eval(foo)"],
				invalid: [
					{
						code: "eval(foo)",
						errors: [{ message: "eval sucks." }],
					},
				],
			},
		);
	});

	it("should throw correct error when valid code is invalid and enables other core rule", () => {
		assert.throws(() => {
			ruleTester.run(
				"no-eval",
				require("../../fixtures/testers/rule-tester/no-eval"),
				{
					valid: ["/*eslint semi: 2*/ eval(foo);"],
					invalid: [
						{
							code: "eval(foo)",
							errors: [
								{
									message: "eval sucks.",
									type: "CallExpression",
								},
							],
						},
					],
				},
			);
		}, /Should have no errors but had 1/u);
	});

	it("should throw an error when valid code is invalid", () => {
		assert.throws(() => {
			ruleTester.run(
				"no-eval",
				require("../../fixtures/testers/rule-tester/no-eval"),
				{
					valid: ["eval(foo)"],
					invalid: [
						{
							code: "eval(foo)",
							errors: [
								{
									message: "eval sucks.",
									type: "CallExpression",
								},
							],
						},
					],
				},
			);
		}, /Should have no errors but had 1/u);
	});

	it("should throw an error when valid code is invalid", () => {
		assert.throws(() => {
			ruleTester.run(
				"no-eval",
				require("../../fixtures/testers/rule-tester/no-eval"),
				{
					valid: [{ code: "eval(foo)" }],
					invalid: [
						{
							code: "eval(foo)",
							errors: [
								{
									message: "eval sucks.",
									type: "CallExpression",
								},
							],
						},
					],
				},
			);
		}, /Should have no errors but had 1/u);
	});

	it("should throw an error if invalid code is valid", () => {
		assert.throws(() => {
			ruleTester.run(
				"no-eval",
				require("../../fixtures/testers/rule-tester/no-eval"),
				{
					valid: ["Eval(foo)"],
					invalid: [
						{
							code: "Eval(foo)",
							errors: [
								{
									message: "eval sucks.",
								},
							],
						},
					],
				},
			);
		}, /Should have 1 error but had 0/u);
	});

	it("should throw an error when the error message is wrong", () => {
		assert.throws(
			() => {
				ruleTester.run(
					"no-var",
					require("../../fixtures/testers/rule-tester/no-var"),
					{
						// Only the invalid test matters here
						valid: ["bar = baz;"],
						invalid: [
							{
								code: "var foo = bar;",
								errors: [{ message: "Bad error message." }],
							},
						],
					},
				);
			},
			assertErrorMatches("Bad var.", "Bad error message."),
		);
	});

	it("should throw an error when the error message regex does not match", () => {
		assert.throws(() => {
			ruleTester.run(
				"no-var",
				require("../../fixtures/testers/rule-tester/no-var"),
				{
					valid: [],
					invalid: [
						{
							code: "var foo = bar;",
							errors: [{ message: /Bad error message/u }],
						},
					],
				},
			);
		}, /Expected 'Bad var.' to match \/Bad error message\//u);
	});

	it("should throw an error when the error is not a supported type", () => {
		assert.throws(() => {
			ruleTester.run(
				"no-var",
				require("../../fixtures/testers/rule-tester/no-var"),
				{
					// Only the invalid test matters here
					valid: ["bar = baz;"],
					invalid: [{ code: "var foo = bar;", errors: [42] }],
				},
			);
		}, "errors[0] must be a string, RegExp, or an object.");
	});

	it("should throw an error when any of the errors is not a supported type", () => {
		assert.throws(() => {
			ruleTester.run(
				"no-var",
				require("../../fixtures/testers/rule-tester/no-var"),
				{
					// Only the invalid test matters here
					valid: ["bar = baz;"],
					invalid: [
						{
							code: "var foo = bar; var baz = quux",
							errors: [
								{
									message: "Bad var.",
								},
								null,
							],
						},
					],
				},
			);
		}, "errors[1] must be a string, RegExp, or an object.");
	});

	it("should throw an error when the error is a string and it does not match error message", () => {
		assert.throws(
			() => {
				ruleTester.run(
					"no-var",
					require("../../fixtures/testers/rule-tester/no-var"),
					{
						// Only the invalid test matters here
						valid: ["bar = baz;"],
						invalid: [
							{
								code: "var foo = bar;",
								errors: ["Bad error message."],
							},
						],
					},
				);
			},
			assertErrorMatches("Bad var.", "Bad error message."),
		);
	});

	it("should throw an error when the error is a string and it does not match error message", () => {
		assert.throws(() => {
			ruleTester.run(
				"no-var",
				require("../../fixtures/testers/rule-tester/no-var"),
				{
					valid: [],
					invalid: [
						{
							code: "var foo = bar;",
							errors: [/Bad error message/u],
						},
					],
				},
			);
		}, /Expected 'Bad var.' to match \/Bad error message\//u);
	});

	it("should not throw an error when the error is a string and it matches error message", () => {
		ruleTester.run(
			"no-var",
			require("../../fixtures/testers/rule-tester/no-var"),
			{
				// Only the invalid test matters here
				valid: ["bar = baz;"],
				invalid: [
					{
						code: "var foo = bar;",
						output: " foo = bar;",
						errors: ["Bad var."],
					},
				],
			},
		);
	});

	it("should not throw an error when the error is a regex and it matches error message", () => {
		ruleTester.run(
			"no-var",
			require("../../fixtures/testers/rule-tester/no-var"),
			{
				valid: [],
				invalid: [
					{
						code: "var foo = bar;",
						output: " foo = bar;",
						errors: [/^Bad var/u],
					},
				],
			},
		);
	});

	it("should not throw an error when the error is a string and the suggestion fixer is failing", () => {
		ruleTester.run(
			"no-var",
			require("../../fixtures/testers/rule-tester/suggestions")
				.withFailingFixer,
			{
				valid: [],
				invalid: [{ code: "foo", errors: ["some message"] }],
			},
		);
	});

	it("throws an error when the error is a string and the suggestion fixer provides a fix", () => {
		assert.throws(() => {
			ruleTester.run(
				"no-var",
				require("../../fixtures/testers/rule-tester/suggestions").basic,
				{
					valid: [],
					invalid: [
						{
							code: "foo",
							errors: ["Avoid using identifiers named 'foo'."],
						},
					],
				},
			);
		}, "Error at index 0 has suggestions. Please convert the test error into an object and specify 'suggestions' property on it to test suggestions.");
	});

	it("should throw an error when the error is an object with an unknown property name", () => {
		assert.throws(() => {
			ruleTester.run(
				"no-var",
				require("../../fixtures/testers/rule-tester/no-var"),
				{
					valid: ["bar = baz;"],
					invalid: [
						{
							code: "var foo = bar;",
							errors: [{ Message: "Bad var." }],
						},
					],
				},
			);
		}, /Invalid error property name 'Message'/u);
	});

	it("should throw an error when any of the errors is an object with an unknown property name", () => {
		assert.throws(() => {
			ruleTester.run(
				"no-var",
				require("../../fixtures/testers/rule-tester/no-var"),
				{
					valid: ["bar = baz;"],
					invalid: [
						{
							code: "var foo = bar; var baz = quux",
							errors: [
								{
									message: "Bad var.",
								},
								{
									message: "Bad var.",
									typo: "VariableDeclaration",
								},
							],
						},
					],
				},
			);
		}, /Invalid error property name 'typo'/u);
	});

	it("should not throw an error when the error is a regex in an object and it matches error message", () => {
		ruleTester.run(
			"no-var",
			require("../../fixtures/testers/rule-tester/no-var"),
			{
				valid: [],
				invalid: [
					{
						code: "var foo = bar;",
						output: " foo = bar;",
						errors: [{ message: /^Bad var/u }],
					},
				],
			},
		);
	});

	it("should throw an error when the expected output doesn't match", () => {
		assert.throws(() => {
			ruleTester.run(
				"no-var",
				require("../../fixtures/testers/rule-tester/no-var"),
				{
					valid: ["bar = baz;"],
					invalid: [
						{
							code: "var foo = bar;",
							output: "foo = bar",
							errors: [
								{
									message: "Bad var.",
								},
							],
						},
					],
				},
			);
		}, /Output is incorrect/u);
	});

	it("should use strict equality to compare output", () => {
		const replaceProgramWith5Rule = {
			meta: {
				fixable: "code",
			},

			create: context => ({
				Program(node) {
					context.report({
						node,
						message: "bad",
						fix: fixer => fixer.replaceText(node, "5"),
					});
				},
			}),
		};

		// Should not throw.
		ruleTester.run("foo", replaceProgramWith5Rule, {
			valid: [],
			invalid: [{ code: "var foo = bar;", output: "5", errors: 1 }],
		});

		assert.throws(() => {
			ruleTester.run("foo", replaceProgramWith5Rule, {
				valid: [],
				invalid: [{ code: "var foo = bar;", output: 5, errors: 1 }],
			});
		}, /Test property 'output', if specified, must be a string or null/u);
	});

	it("should throw an error when the expected output doesn't match and errors is just a number", () => {
		assert.throws(() => {
			ruleTester.run(
				"no-var",
				require("../../fixtures/testers/rule-tester/no-var"),
				{
					valid: ["bar = baz;"],
					invalid: [
						{
							code: "var foo = bar;",
							output: "foo = bar",
							errors: 1,
						},
					],
				},
			);
		}, /Output is incorrect/u);
	});

	it("should not throw an error when the expected output is null and no errors produce output", () => {
		ruleTester.run(
			"no-eval",
			require("../../fixtures/testers/rule-tester/no-eval"),
			{
				valid: ["bar = baz;"],
				invalid: [
					{ code: "eval(x)", errors: 1, output: null },
					{ code: "eval(x); eval(y);", errors: 2, output: null },
				],
			},
		);
	});

	it("should throw an error when the expected output is null and problems produce output", () => {
		assert.throws(() => {
			ruleTester.run(
				"no-var",
				require("../../fixtures/testers/rule-tester/no-var"),
				{
					valid: ["bar = baz;"],
					invalid: [
						{ code: "var foo = bar;", output: null, errors: 1 },
					],
				},
			);
		}, /Expected no autofixes to be suggested/u);

		assert.throws(() => {
			ruleTester.run(
				"no-var",
				require("../../fixtures/testers/rule-tester/no-var"),
				{
					valid: ["bar = baz;"],
					invalid: [
						{
							code: "var foo = bar; var qux = boop;",
							output: null,
							errors: 2,
						},
					],
				},
			);
		}, /Expected no autofixes to be suggested/u);
	});

	it("should throw an error when the expected output is null and only some problems produce output", () => {
		assert.throws(() => {
			ruleTester.run(
				"fixes-one-problem",
				require("../../fixtures/testers/rule-tester/fixes-one-problem"),
				{
					valid: [],
					invalid: [{ code: "foo", output: null, errors: 2 }],
				},
			);
		}, /Expected no autofixes to be suggested/u);
	});

	it("should throw an error when the expected output is not null and the output does not differ from the code", () => {
		assert.throws(() => {
			ruleTester.run(
				"no-var",
				require("../../fixtures/testers/rule-tester/no-eval"),
				{
					valid: [],
					invalid: [
						{ code: "eval('')", output: "eval('')", errors: 1 },
					],
				},
			);
		}, "Test property 'output' matches 'code'. If no autofix is expected, then omit the 'output' property or set it to null.");
	});

	it("should throw an error when the expected output isn't specified and problems produce output", () => {
		assert.throws(() => {
			ruleTester.run(
				"no-var",
				require("../../fixtures/testers/rule-tester/no-var"),
				{
					valid: ["bar = baz;"],
					invalid: [{ code: "var foo = bar;", errors: 1 }],
				},
			);
		}, "The rule fixed the code. Please add 'output' property.");
	});

	it("should throw an error if invalid code specifies wrong line", () => {
		assert.throws(() => {
			ruleTester.run(
				"no-eval",
				require("../../fixtures/testers/rule-tester/no-eval"),
				{
					valid: ["Eval(foo)"],
					invalid: [
						{
							code: "eval(foo)",
							errors: [
								{
									message: "eval sucks.",
									line: 5,
								},
							],
						},
					],
				},
			);
		}, "Actual error location does not match expected error location.");
	});

	it("should not skip line assertion if line is a falsy value", () => {
		assert.throws(() => {
			ruleTester.run(
				"no-eval",
				require("../../fixtures/testers/rule-tester/no-eval"),
				{
					valid: ["Eval(foo)"],
					invalid: [
						{
							code: "\neval(foo)",
							errors: [
								{
									message: "eval sucks.",
									line: 0,
								},
							],
						},
					],
				},
			);
		}, "Actual error location does not match expected error location.");
	});

	it("should throw an error if invalid code specifies wrong column", () => {
		const wrongColumn = 10;

		assert.throws(() => {
			ruleTester.run(
				"no-eval",
				require("../../fixtures/testers/rule-tester/no-eval"),
				{
					valid: ["Eval(foo)"],
					invalid: [
						{
							code: "eval(foo)",
							errors: [
								{
									message: "eval sucks.",
									column: wrongColumn,
								},
							],
						},
					],
				},
			);
		}, "Actual error location does not match expected error location.");
	});

	it("should throw error for empty error array", () => {
		assert.throws(() => {
			ruleTester.run(
				"suggestions-messageIds",
				require("../../fixtures/testers/rule-tester/suggestions")
					.withMessageIds,
				{
					valid: [],
					invalid: [
						{
							code: "var foo;",
							errors: [],
						},
					],
				},
			);
		}, /Invalid cases must have at least one error/u);
	});

	it("should throw error for errors : 0", () => {
		assert.throws(() => {
			ruleTester.run(
				"suggestions-messageIds",
				require("../../fixtures/testers/rule-tester/suggestions")
					.withMessageIds,
				{
					valid: [],
					invalid: [
						{
							code: "var foo;",
							errors: 0,
						},
					],
				},
			);
		}, /Invalid cases must have 'error' value greater than 0/u);
	});

	it("should not skip column assertion if column is a falsy value", () => {
		assert.throws(() => {
			ruleTester.run(
				"no-eval",
				require("../../fixtures/testers/rule-tester/no-eval"),
				{
					valid: ["Eval(foo)"],
					invalid: [
						{
							code: "var foo; eval(foo)",
							errors: [{ message: "eval sucks.", column: 0 }],
						},
					],
				},
			);
		}, "Actual error location does not match expected error location.");
	});

	it("should throw an error if invalid code specifies wrong endLine", () => {
		assert.throws(() => {
			ruleTester.run(
				"no-var",
				require("../../fixtures/testers/rule-tester/no-var"),
				{
					valid: ["bar = baz;"],
					invalid: [
						{
							code: "var foo = bar;",
							output: "foo = bar",
							errors: [
								{
									message: "Bad var.",
									endLine: 10,
								},
							],
						},
					],
				},
			);
		}, "Actual error location does not match expected error location.");
	});

	it("should throw an error if invalid code specifies wrong endColumn", () => {
		assert.throws(() => {
			ruleTester.run(
				"no-var",
				require("../../fixtures/testers/rule-tester/no-var"),
				{
					valid: ["bar = baz;"],
					invalid: [
						{
							code: "var foo = bar;",
							output: "foo = bar",
							errors: [
								{
									message: "Bad var.",
									endColumn: 10,
								},
							],
						},
					],
				},
			);
		}, "Actual error location does not match expected error location.");
	});

	it("should throw an error if invalid code has the wrong number of errors", () => {
		assert.throws(() => {
			ruleTester.run(
				"no-eval",
				require("../../fixtures/testers/rule-tester/no-eval"),
				{
					valid: ["Eval(foo)"],
					invalid: [
						{
							code: "eval(foo)",
							errors: [
								{
									message: "eval sucks.",
								},
								{
									message: "eval sucks.",
								},
							],
						},
					],
				},
			);
		}, /Should have 2 errors but had 1/u);
	});

	it("should throw an error if invalid code does not have errors", () => {
		assert.throws(() => {
			ruleTester.run(
				"no-eval",
				require("../../fixtures/testers/rule-tester/no-eval"),
				{
					valid: ["Eval(foo)"],
					invalid: [{ code: "eval(foo)" }],
				},
			);
		}, /Did not specify errors for an invalid test of no-eval/u);
	});

	it("should throw an error if invalid code has the wrong explicit number of errors", () => {
		assert.throws(() => {
			ruleTester.run(
				"no-eval",
				require("../../fixtures/testers/rule-tester/no-eval"),
				{
					valid: ["Eval(foo)"],
					invalid: [{ code: "eval(foo)", errors: 2 }],
				},
			);
		}, /Should have 2 errors but had 1/u);
	});

	it("should throw an error if there's a parsing error in a valid test", () => {
		assert.throws(() => {
			ruleTester.run(
				"no-eval",
				require("../../fixtures/testers/rule-tester/no-eval"),
				{
					valid: ["1eval('foo')"],
					invalid: [{ code: "eval('foo')", errors: [{}] }],
				},
			);
		}, /fatal parsing error/iu);
	});

	it("should throw an error if there's a parsing error in an invalid test", () => {
		assert.throws(() => {
			ruleTester.run(
				"no-eval",
				require("../../fixtures/testers/rule-tester/no-eval"),
				{
					valid: ["noeval('foo')"],
					invalid: [
						{
							code: "1eval('foo')",
							errors: [{ messageId: "evalSucks" }],
						},
					],
				},
			);
		}, /fatal parsing error/iu);
	});

	it("should throw an error if there's a parsing error in an invalid test and errors is just a number", () => {
		assert.throws(() => {
			ruleTester.run(
				"no-eval",
				require("../../fixtures/testers/rule-tester/no-eval"),
				{
					valid: ["noeval('foo')"],
					invalid: [{ code: "1eval('foo')", errors: 1 }],
				},
			);
		}, /fatal parsing error/iu);
	});

	// https://github.com/eslint/eslint/issues/4779
	it("should throw an error if there's a parsing error and output doesn't match", () => {
		assert.throws(() => {
			ruleTester.run(
				"no-eval",
				require("../../fixtures/testers/rule-tester/no-eval"),
				{
					valid: [],
					invalid: [
						{
							code: "eval(`foo`",
							output: "eval(`foo`);",
							errors: 2,
						},
					],
				},
			);
		}, /fatal parsing error/iu);
	});

	it("should throw an error if an error object has no properties", () => {
		assert.throws(() => {
			ruleTester.run(
				"no-eval",
				require("../../fixtures/testers/rule-tester/no-eval"),
				{
					valid: ["Eval(foo)"],
					invalid: [
						{
							code: "eval(foo)",
							errors: [{}],
						},
					],
				},
			);
		}, "errors[0] must specify either 'messageId' or 'message'.");
	});

	it("should throw an error if an error has a property besides message or messageId", () => {
		assert.throws(() => {
			ruleTester.run(
				"no-eval",
				require("../../fixtures/testers/rule-tester/no-eval"),
				{
					valid: ["Eval(foo)"],
					invalid: [
						{
							code: "eval(foo)",
							errors: [{ line: 1 }],
						},
					],
				},
			);
		}, "errors[0] must specify either 'messageId' or 'message'.");
	});

	it("should pass-through the globals config of valid tests to the to rule", () => {
		ruleTester.run(
			"no-test-global",
			require("../../fixtures/testers/rule-tester/no-test-global"),
			{
				valid: [
					{
						code: "var test = 'foo'",
						languageOptions: {
							sourceType: "script",
						},
					},
					{
						code: "var test2 = 'bar'",
						languageOptions: {
							globals: { test: true },
						},
					},
				],
				invalid: [{ code: "bar", errors: 1 }],
			},
		);
	});

	it("should pass-through the globals config of invalid tests to the rule", () => {
		ruleTester.run(
			"no-test-global",
			require("../../fixtures/testers/rule-tester/no-test-global"),
			{
				valid: [
					{
						code: "var test = 'foo'",
						languageOptions: {
							sourceType: "script",
						},
					},
				],
				invalid: [
					{
						code: "var test = 'foo'; var foo = 'bar'",
						languageOptions: {
							sourceType: "script",
						},
						errors: 1,
					},
					{
						code: "var test = 'foo'",
						languageOptions: {
							sourceType: "script",
							globals: { foo: true },
						},
						errors: [
							{
								message:
									"Global variable foo should not be used.",
							},
						],
					},
				],
			},
		);
	});

	it("should pass-through the settings config to rules", () => {
		ruleTester.run(
			"no-test-settings",
			require("../../fixtures/testers/rule-tester/no-test-settings"),
			{
				valid: [
					{
						code: "var test = 'bar'",
						settings: { test: 1 },
					},
				],
				invalid: [
					{
						code: "var test = 'bar'",
						settings: { "no-test": 22 },
						errors: 1,
					},
				],
			},
		);
	});

	it("should pass-through the filename to the rule", () => {
		(function () {
			ruleTester.run(
				"",
				require("../../fixtures/testers/rule-tester/no-test-filename"),
				{
					valid: [
						{
							code: "var foo = 'bar'",
							filename: "somefile.js",
						},
					],
					invalid: [
						{
							code: "var foo = 'bar'",
							errors: [
								{ message: "Filename test was not defined." },
							],
						},
					],
				},
			);
		})();
	});

	it("should allow setting the filename to a non-JavaScript file", () => {
		ruleTester.run(
			"",
			require("../../fixtures/testers/rule-tester/no-test-filename"),
			{
				valid: [
					{
						code: "var foo = 'bar'",
						filename: "somefile.ts",
					},
				],
				invalid: [],
			},
		);
	});

	it("should allow setting the filename to a file path with extension", () => {
		ruleTester.run(
			"",
			require("../../fixtures/testers/rule-tester/no-test-filename"),
			{
				valid: [
					{
						code: "var foo = 'bar'",
						filename: "path/to/somefile.js",
					},
					{
						code: "var foo = 'bar'",
						filename: "src/somefile.ts",
					},
					{
						code: "var foo = 'bar'",
						filename: "components/Component.vue",
					},
				],
				invalid: [],
			},
		);
	});

	it("should allow setting the filename to a file path without extension", () => {
		ruleTester.run(
			"",
			require("../../fixtures/testers/rule-tester/no-test-filename"),
			{
				valid: [
					{
						code: "var foo = 'bar'",
						filename: "somefile",
					},
					{
						code: "var foo = 'bar'",
						filename: "path/to/somefile",
					},
					{
						code: "var foo = 'bar'",
						filename: "src/somefile",
					},
				],
				invalid: [],
			},
		);
	});

	it("should keep allowing non-JavaScript files if the default config does not specify files", () => {
		RuleTester.setDefaultConfig({ rules: {} });
		ruleTester.run(
			"",
			require("../../fixtures/testers/rule-tester/no-test-filename"),
			{
				valid: [
					{
						code: "var foo = 'bar'",
						filename: "somefile.ts",
					},
				],
				invalid: [],
			},
		);
		RuleTester.resetDefaultConfig();
	});

	it("should pass-through the options to the rule", () => {
		ruleTester.run(
			"no-invalid-args",
			require("../../fixtures/testers/rule-tester/no-invalid-args"),
			{
				valid: [
					{
						code: "var foo = 'bar'",
						options: [false],
					},
				],
				invalid: [
					{
						code: "var foo = 'bar'",
						options: [true],
						errors: [{ message: "Invalid args" }],
					},
				],
			},
		);
	});

	it("should throw an error if the options are an object", () => {
		assert.throws(() => {
			ruleTester.run(
				"no-invalid-args",
				require("../../fixtures/testers/rule-tester/no-invalid-args"),
				{
					valid: [
						{
							code: "foo",
							options: { ok: true },
						},
					],
					invalid: [],
				},
			);
		}, /'options' must be an array/u);
	});

	it("should throw an error if the options are a number", () => {
		assert.throws(() => {
			ruleTester.run(
				"no-invalid-args",
				require("../../fixtures/testers/rule-tester/no-invalid-args"),
				{
					valid: [
						{
							code: "foo",
							options: 0,
						},
					],
					invalid: [],
				},
			);
		}, /'options' must be an array/u);
	});

	describe("Parsers", () => {
		it("should pass-through the parser to the rule", () => {
			const spy = sinon.spy(ruleTester.linter, "verify");
			const esprima = require("esprima");

			ruleTester.run(
				"no-eval",
				require("../../fixtures/testers/rule-tester/no-eval"),
				{
					valid: [
						{
							code: "Eval(foo)",
						},
					],
					invalid: [
						{
							code: "eval(foo)",
							languageOptions: {
								parser: esprima,
							},
							errors: [{ message: "eval sucks.", line: 1 }],
						},
					],
				},
			);

			const configs = spy.args[1][1];
			const config = configs.getConfig("test.js");

			assert.strictEqual(
				config.languageOptions.parser[
					Symbol.for("eslint.RuleTester.parser")
				],
				esprima,
			);
		});

		it("should pass-through services from parseForESLint to the rule", () => {
			const enhancedParser = require("../../fixtures/parsers/enhanced-parser");
			const disallowHiRule = {
				create: context => ({
					Literal(node) {
						const disallowed =
							context.sourceCode.parserServices.test.getMessage(); // returns "Hi!"

						if (node.value === disallowed) {
							context.report({
								node,
								message: `Don't use '${disallowed}'`,
							});
						}
					},
				}),
			};

			ruleTester.run("no-hi", disallowHiRule, {
				valid: [
					{
						code: "'Hello!'",
						languageOptions: {
							parser: enhancedParser,
						},
					},
				],
				invalid: [
					{
						code: "'Hi!'",
						languageOptions: {
							parser: enhancedParser,
						},
						errors: [{ message: "Don't use 'Hi!'" }],
					},
				],
			});
		});

		it("should throw an error when the parser is not an object", () => {
			assert.throws(() => {
				ruleTester.run(
					"no-eval",
					require("../../fixtures/testers/rule-tester/no-eval"),
					{
						valid: [],
						invalid: [
							{
								code: "var foo;",
								languageOptions: {
									parser: "esprima",
								},
								errors: 1,
							},
						],
					},
				);
			}, /Key "languageOptions": Key "parser": Expected object with parse\(\) or parseForESLint\(\) method\./u);
		});
	});

	describe("Languages", () => {
		it("should work with a language that doesn't have language options", () => {
			const ruleTesterJsonLanguage = new RuleTester({
				plugins: {
					json: jsonPlugin,
				},
				language: "json/json",
			});

			ruleTesterJsonLanguage.run(
				"no-empty-keys",
				jsonPlugin.rules["no-empty-keys"],
				{
					valid: ['{"foo": 1, "bar": 2}'],
					invalid: [
						{
							code: '{"": 1}',
							errors: [{ messageId: "emptyKey" }],
						},
					],
				},
			);
		});
	});

	it("should throw an error with the original message and an additional description if rule has `meta.schema` of an invalid type", () => {
		const rule = {
			meta: {
				schema: true,
			},
			create(context) {
				return {
					Program(node) {
						context.report({ node, message: "bad" });
					},
				};
			},
		};

		assert.throws(() => {
			ruleTester.run("rule-with-invalid-schema-type", rule, {
				valid: [],
				invalid: [{ code: "var foo = bar;", errors: 1 }],
			});
		}, /Rule's `meta.schema` must be an array or object.*set `meta.schema` to an array or non-empty object to enable options validation/su);
	});

	it("should prevent invalid options schemas", () => {
		assert.throws(() => {
			ruleTester.run(
				"no-invalid-schema",
				require("../../fixtures/testers/rule-tester/no-invalid-schema"),
				{
					valid: [
						"var answer = 6 * 7;",
						{ code: "var answer = 6 * 7;", options: [] },
					],
					invalid: [
						{
							code: "var answer = 6 * 7;",
							options: ["bar"],
							errors: [{ message: "Expected nothing." }],
						},
					],
				},
			);
		}, "Schema for rule no-invalid-schema is invalid:,\titems: should be object\n\titems[0].enum: should NOT have fewer than 1 items\n\titems: should match some schema in anyOf");
	});

	it("should throw an error if rule schema is `{}`", () => {
		const rule = {
			meta: {
				schema: {},
			},
			create(context) {
				return {
					Program(node) {
						context.report({ node, message: "bad" });
					},
				};
			},
		};

		assert.throws(() => {
			ruleTester.run("rule-with-empty-object-schema", rule, {
				valid: [],
				invalid: [{ code: "var foo = bar;", errors: 1 }],
			});
		}, /`schema: \{\}` is a no-op.*set `meta.schema` to an array or non-empty object to enable options validation/su);
	});

	it("should throw an error if rule schema has only non-enumerable properties", () => {
		const rule = {
			meta: {
				schema: Object.create(null, {
					type: {
						value: "array",
						enumerable: false,
					},
					items: {
						value: [{ enum: ["foo"] }],
						enumerable: false,
					},
				}),
			},
			create(context) {
				return {
					Program(node) {
						context.report({ node, message: "bad" });
					},
				};
			},
		};

		assert.throws(() => {
			ruleTester.run("rule-with-empty-object-schema", rule, {
				valid: [],
				invalid: [{ code: "var foo = bar;", errors: 1 }],
			});
		}, /`schema: \{\}` is a no-op.*set `meta.schema` to an array or non-empty object to enable options validation/su);
	});

	it("should throw an error if rule schema has only inherited enumerable properties", () => {
		const rule = {
			meta: {
				schema: {
					__proto__: {
						type: "array",
						items: [{ enum: ["foo"] }],
					},
				},
			},
			create(context) {
				return {
					Program(node) {
						context.report({ node, message: "bad" });
					},
				};
			},
		};

		assert.throws(() => {
			ruleTester.run("rule-with-empty-object-schema", rule, {
				valid: [],
				invalid: [{ code: "var foo = bar;", errors: 1 }],
			});
		}, /`schema: \{\}` is a no-op.*set `meta.schema` to an array or non-empty object to enable options validation/su);
	});

	it("should prevent schema violations in options", () => {
		assert.throws(() => {
			ruleTester.run(
				"no-schema-violation",
				require("../../fixtures/testers/rule-tester/no-schema-violation"),
				{
					valid: [
						"var answer = 6 * 7;",
						{ code: "var answer = 6 * 7;", options: ["foo"] },
					],
					invalid: [
						{
							code: "var answer = 6 * 7;",
							options: ["bar"],
							errors: [{ message: "Expected foo." }],
						},
					],
				},
			);
		}, /Value "bar" should be equal to one of the allowed values./u);
	});

	it("should disallow invalid defaults in rules", () => {
		const ruleWithInvalidDefaults = {
			meta: {
				schema: [
					{
						oneOf: [
							{ enum: ["foo"] },
							{
								type: "object",
								properties: {
									foo: {
										enum: ["foo", "bar"],
										default: "foo",
									},
								},
								additionalProperties: false,
							},
						],
					},
				],
			},
			create: () => ({}),
		};

		assert.throws(() => {
			ruleTester.run("invalid-defaults", ruleWithInvalidDefaults, {
				valid: [
					{
						code: "foo",
						options: [{}],
					},
				],
				invalid: [],
			});
		}, /Schema for rule invalid-defaults is invalid: default is ignored for: data1\.foo/u);
	});

	it("throw an error when an unknown config option is included", () => {
		assert.throws(() => {
			ruleTester.run(
				"no-eval",
				require("../../fixtures/testers/rule-tester/no-eval"),
				{
					valid: [{ code: "Eval(foo)", foo: "bar" }],
					invalid: [],
				},
			);
		}, /ESLint configuration in rule-tester is invalid./u);
	});

	it("throw an error when env is included in config", () => {
		assert.throws(() => {
			ruleTester.run(
				"no-eval",
				require("../../fixtures/testers/rule-tester/no-eval"),
				{
					valid: [{ code: "Eval(foo)", env: ["es6"] }],
					invalid: [],
				},
			);
		}, /Key "env": This appears to be in eslintrc format rather than flat config format/u);
	});

	it("should pass-through the tester config to the rule", () => {
		ruleTester = new RuleTester({
			languageOptions: {
				globals: { test: true },
			},
		});

		ruleTester.run(
			"no-test-global",
			require("../../fixtures/testers/rule-tester/no-test-global"),
			{
				valid: ["var test = 'foo'", "var test2 = test"],
				invalid: [
					{
						code: "bar",
						errors: 1,
						languageOptions: { globals: { foo: true } },
					},
				],
			},
		);
	});

	it("should throw an error if AST was modified", () => {
		assert.throws(() => {
			ruleTester.run(
				"foo",
				require("../../fixtures/testers/rule-tester/modify-ast"),
				{
					valid: ["var foo = 0;"],
					invalid: [],
				},
			);
		}, "Rule should not modify AST.");
		assert.throws(() => {
			ruleTester.run(
				"foo",
				require("../../fixtures/testers/rule-tester/modify-ast"),
				{
					valid: [],
					invalid: [{ code: "var bar = 0;", errors: ["error"] }],
				},
			);
		}, "Rule should not modify AST.");
	});

	it("should throw an error node.start is accessed with custom parser", () => {
		const enhancedParser = require("../../fixtures/parsers/enhanced-parser");

		ruleTester = new RuleTester({
			languageOptions: {
				parser: enhancedParser,
			},
		});

		/*
		 * Note: More robust test for start/end found later in file.
		 * This one is just for checking the custom config has a
		 * parser that is wrapped.
		 */
		const usesStartEndRule = {
			create() {
				return {
					CallExpression(node) {
						noop(node.arguments[1].start);
					},
				};
			},
		};

		assert.throws(() => {
			ruleTester.run("uses-start-end", usesStartEndRule, {
				valid: ["foo(a, b)"],
				invalid: [],
			});
		}, "Use node.range[0] instead of node.start");
	});

	it("should throw an error if AST was modified (at Program)", () => {
		assert.throws(() => {
			ruleTester.run(
				"foo",
				require("../../fixtures/testers/rule-tester/modify-ast-at-first"),
				{
					valid: ["var foo = 0;"],
					invalid: [],
				},
			);
		}, "Rule should not modify AST.");
		assert.throws(() => {
			ruleTester.run(
				"foo",
				require("../../fixtures/testers/rule-tester/modify-ast-at-first"),
				{
					valid: [],
					invalid: [{ code: "var bar = 0;", errors: ["error"] }],
				},
			);
		}, "Rule should not modify AST.");
	});

	it("should throw an error if AST was modified (at Program:exit)", () => {
		assert.throws(() => {
			ruleTester.run(
				"foo",
				require("../../fixtures/testers/rule-tester/modify-ast-at-last"),
				{
					valid: ["var foo = 0;"],
					invalid: [],
				},
			);
		}, "Rule should not modify AST.");
		assert.throws(() => {
			ruleTester.run(
				"foo",
				require("../../fixtures/testers/rule-tester/modify-ast-at-last"),
				{
					valid: [],
					invalid: [{ code: "var bar = 0;", errors: ["error"] }],
				},
			);
		}, "Rule should not modify AST.");
	});

	it("should throw an error if rule uses start and end properties on nodes, tokens or comments", () => {
		const usesStartEndRule = {
			create(context) {
				const sourceCode = context.sourceCode;

				return {
					CallExpression(node) {
						noop(node.arguments[1].start);
					},
					"BinaryExpression[operator='+']"(node) {
						noop(node.end);
					},
					"UnaryExpression[operator='-']"(node) {
						noop(sourceCode.getFirstToken(node).start);
					},
					ConditionalExpression(node) {
						noop(sourceCode.getFirstToken(node).end);
					},
					BlockStatement(node) {
						noop(sourceCode.getCommentsInside(node)[0].start);
					},
					ObjectExpression(node) {
						noop(sourceCode.getCommentsInside(node)[0].end);
					},
					Decorator(node) {
						noop(node.start);
					},
				};
			},
		};

		assert.throws(() => {
			ruleTester.run("uses-start-end", usesStartEndRule, {
				valid: ["foo(a, b)"],
				invalid: [],
			});
		}, "Use node.range[0] instead of node.start");
		assert.throws(() => {
			ruleTester.run("uses-start-end", usesStartEndRule, {
				valid: [],
				invalid: [{ code: "var a = b * (c + d) / e;", errors: 1 }],
			});
		}, "Use node.range[1] instead of node.end");
		assert.throws(() => {
			ruleTester.run("uses-start-end", usesStartEndRule, {
				valid: [],
				invalid: [{ code: "var a = -b * c;", errors: 1 }],
			});
		}, "Use token.range[0] instead of token.start");
		assert.throws(() => {
			ruleTester.run("uses-start-end", usesStartEndRule, {
				valid: ["var a = b ? c : d;"],
				invalid: [],
			});
		}, "Use token.range[1] instead of token.end");
		assert.throws(() => {
			ruleTester.run("uses-start-end", usesStartEndRule, {
				valid: ["function f() { /* comment */ }"],
				invalid: [],
			});
		}, "Use token.range[0] instead of token.start");
		assert.throws(() => {
			ruleTester.run("uses-start-end", usesStartEndRule, {
				valid: [],
				invalid: [
					{ code: "var x = //\n {\n //comment\n //\n}", errors: 1 },
				],
			});
		}, "Use token.range[1] instead of token.end");

		const enhancedParser = require("../../fixtures/parsers/enhanced-parser");

		assert.throws(() => {
			ruleTester.run("uses-start-end", usesStartEndRule, {
				valid: [
					{
						code: "foo(a, b)",
						languageOptions: { parser: enhancedParser },
					},
				],
				invalid: [],
			});
		}, "Use node.range[0] instead of node.start");
		assert.throws(() => {
			ruleTester.run("uses-start-end", usesStartEndRule, {
				valid: [],
				invalid: [
					{
						code: "var a = b * (c + d) / e;",
						languageOptions: { parser: enhancedParser },
						errors: 1,
					},
				],
			});
		}, "Use node.range[1] instead of node.end");
		assert.throws(() => {
			ruleTester.run("uses-start-end", usesStartEndRule, {
				valid: [],
				invalid: [
					{
						code: "var a = -b * c;",
						languageOptions: { parser: enhancedParser },
						errors: 1,
					},
				],
			});
		}, "Use token.range[0] instead of token.start");
		assert.throws(() => {
			ruleTester.run("uses-start-end", usesStartEndRule, {
				valid: [
					{
						code: "var a = b ? c : d;",
						languageOptions: { parser: enhancedParser },
					},
				],
				invalid: [],
			});
		}, "Use token.range[1] instead of token.end");
		assert.throws(() => {
			ruleTester.run("uses-start-end", usesStartEndRule, {
				valid: [
					{
						code: "function f() { /* comment */ }",
						languageOptions: { parser: enhancedParser },
					},
				],
				invalid: [],
			});
		}, "Use token.range[0] instead of token.start");
		assert.throws(() => {
			ruleTester.run("uses-start-end", usesStartEndRule, {
				valid: [],
				invalid: [
					{
						code: "var x = //\n {\n //comment\n //\n}",
						languageOptions: { parser: enhancedParser },
						errors: 1,
					},
				],
			});
		}, "Use token.range[1] instead of token.end");

		assert.throws(() => {
			ruleTester.run("uses-start-end", usesStartEndRule, {
				valid: [
					{
						code: "@foo class A {}",
						languageOptions: {
							parser: require("../../fixtures/parsers/enhanced-parser2"),
						},
					},
				],
				invalid: [],
			});
		}, "Use node.range[0] instead of node.start");
	});

	it("should throw an error if rule is a function", () => {
		/**
		 * Legacy-format rule (a function instead of an object with `create` method).
		 * @param {RuleContext} context The ESLint rule context object.
		 * @returns {Object} Listeners.
		 */
		function functionStyleRule(context) {
			return {
				Program(node) {
					context.report({ node, message: "bad" });
				},
			};
		}

		assert.throws(() => {
			ruleTester.run("function-style-rule", functionStyleRule, {
				valid: [],
				invalid: [{ code: "var foo = bar;", errors: 1 }],
			});
		}, /must be an object with a `create` method/u);
	});

	it("should throw an error if rule is an object without 'create' method", () => {
		const rule = {
			create_(context) {
				return {
					Program(node) {
						context.report({ node, message: "bad" });
					},
				};
			},
		};

		assert.throws(() => {
			ruleTester.run("object-rule-without-create", rule, {
				valid: [],
				invalid: [{ code: "var foo = bar;", errors: 1 }],
			});
		}, /must be an object with a `create` method/u);
	});

	it("should throw an error if no test scenarios given", () => {
		assert.throws(() => {
			ruleTester.run(
				"foo",
				require("../../fixtures/testers/rule-tester/modify-ast-at-last"),
			);
		}, /Could not find test scenario object/u);
	});

	it("should throw an error if no acceptable test scenario object is given", () => {
		assert.throws(() => {
			ruleTester.run(
				"foo",
				require("../../fixtures/testers/rule-tester/modify-ast-at-last"),
				[],
			);
		}, /Could not find any valid test scenarios/u);
		assert.throws(() => {
			ruleTester.run(
				"foo",
				require("../../fixtures/testers/rule-tester/modify-ast-at-last"),
				"",
			);
		}, /Could not find test scenario object/u);
		assert.throws(() => {
			ruleTester.run(
				"foo",
				require("../../fixtures/testers/rule-tester/modify-ast-at-last"),
				2,
			);
		}, /Could not find test scenario object/u);
		assert.throws(() => {
			ruleTester.run(
				"foo",
				require("../../fixtures/testers/rule-tester/modify-ast-at-last"),
				{},
			);
		}, /Could not find any valid test scenarios/u);
		assert.throws(() => {
			ruleTester.run(
				"foo",
				require("../../fixtures/testers/rule-tester/modify-ast-at-last"),
				{
					valid: [],
				},
			);
		}, /Could not find any invalid test scenarios/u);
		assert.throws(() => {
			ruleTester.run(
				"foo",
				require("../../fixtures/testers/rule-tester/modify-ast-at-last"),
				{
					invalid: [],
				},
			);
		}, /Could not find any valid test scenarios/u);
	});

	// Nominal message/messageId use cases
	it("should assert match if message provided in both test and result.", () => {
		assert.throws(
			() => {
				ruleTester.run(
					"foo",
					require("../../fixtures/testers/rule-tester/messageId")
						.withMessageOnly,
					{
						valid: [],
						invalid: [
							{ code: "foo", errors: [{ message: "something" }] },
						],
					},
				);
			},
			assertErrorMatches(
				"Avoid using variables named 'foo'.",
				"something",
			),
		);

		ruleTester.run(
			"foo",
			require("../../fixtures/testers/rule-tester/messageId")
				.withMessageOnly,
			{
				valid: [],
				invalid: [
					{
						code: "foo",
						errors: [
							{ message: "Avoid using variables named 'foo'." },
						],
					},
				],
			},
		);
	});

	it("should assert match between messageId if provided in both test and result.", () => {
		assert.throws(() => {
			ruleTester.run(
				"foo",
				require("../../fixtures/testers/rule-tester/messageId")
					.withMetaWithData,
				{
					valid: [],
					invalid: [
						{ code: "foo", errors: [{ messageId: "unused" }] },
					],
				},
			);
		}, "messageId 'avoidFoo' does not match expected messageId 'unused'.");

		ruleTester.run(
			"foo",
			require("../../fixtures/testers/rule-tester/messageId")
				.withMetaWithData,
			{
				valid: [],
				invalid: [{ code: "foo", errors: [{ messageId: "avoidFoo" }] }],
			},
		);
	});

	it("should assert match between resulting message output if messageId and data provided in both test and result", () => {
		assert.throws(() => {
			ruleTester.run(
				"foo",
				require("../../fixtures/testers/rule-tester/messageId")
					.withMetaWithData,
				{
					valid: [],
					invalid: [
						{
							code: "foo",
							errors: [
								{
									messageId: "avoidFoo",
									data: { name: "notFoo" },
								},
							],
						},
					],
				},
			);
		}, "Hydrated message \"Avoid using variables named 'notFoo'.\" does not match \"Avoid using variables named 'foo'.\"");
	});

	it("should throw if the message has a single unsubstituted placeholder when data is not specified", () => {
		assert.throws(() => {
			ruleTester.run(
				"foo",
				require("../../fixtures/testers/rule-tester/messageId")
					.withMissingData,
				{
					valid: [],
					invalid: [
						{ code: "foo", errors: [{ messageId: "avoidFoo" }] },
					],
				},
			);
		}, "The reported message has an unsubstituted placeholder 'name'. Please provide the missing value via the 'data' property in the context.report() call.");
	});

	it("should throw if the message has a single unsubstituted placeholders when data is specified", () => {
		assert.throws(() => {
			ruleTester.run(
				"foo",
				require("../../fixtures/testers/rule-tester/messageId")
					.withMissingData,
				{
					valid: [],
					invalid: [
						{
							code: "foo",
							errors: [
								{
									messageId: "avoidFoo",
									data: { name: "name" },
								},
							],
						},
					],
				},
			);
		}, "Hydrated message \"Avoid using variables named 'name'.\" does not match \"Avoid using variables named '{{ name }}'.");
	});

	it("should throw if the message has multiple unsubstituted placeholders when data is not specified", () => {
		assert.throws(() => {
			ruleTester.run(
				"foo",
				require("../../fixtures/testers/rule-tester/messageId")
					.withMultipleMissingDataProperties,
				{
					valid: [],
					invalid: [
						{ code: "foo", errors: [{ messageId: "avoidFoo" }] },
					],
				},
			);
		}, "The reported message has unsubstituted placeholders: 'type', 'name'. Please provide the missing values via the 'data' property in the context.report() call.");
	});

	it("should not throw if the data in the message contains placeholders not present in the raw message", () => {
		ruleTester.run(
			"foo",
			require("../../fixtures/testers/rule-tester/messageId")
				.withPlaceholdersInData,
			{
				valid: [],
				invalid: [{ code: "foo", errors: [{ messageId: "avoidFoo" }] }],
			},
		);
	});

	it("should throw if the data in the message contains the same placeholder and data is not specified", () => {
		assert.throws(() => {
			ruleTester.run(
				"foo",
				require("../../fixtures/testers/rule-tester/messageId")
					.withSamePlaceholdersInData,
				{
					valid: [],
					invalid: [
						{ code: "foo", errors: [{ messageId: "avoidFoo" }] },
					],
				},
			);
		}, "The reported message has an unsubstituted placeholder 'name'. Please provide the missing value via the 'data' property in the context.report() call.");
	});

	it("should not throw if the data in the message contains the same placeholder and data is specified", () => {
		ruleTester.run(
			"foo",
			require("../../fixtures/testers/rule-tester/messageId")
				.withSamePlaceholdersInData,
			{
				valid: [],
				invalid: [
					{
						code: "foo",
						errors: [
							{
								messageId: "avoidFoo",
								data: { name: "{{ name }}" },
							},
						],
					},
				],
			},
		);
	});

	it("should not throw an error for specifying non-string data values", () => {
		ruleTester.run(
			"foo",
			require("../../fixtures/testers/rule-tester/messageId")
				.withNonStringData,
			{
				valid: [],
				invalid: [
					{
						code: "0",
						errors: [{ messageId: "avoid", data: { value: 0 } }],
					},
				],
			},
		);
	});

	// messageId/message misconfiguration cases
	it("should throw if user tests for both message and messageId", () => {
		assert.throws(() => {
			ruleTester.run(
				"foo",
				require("../../fixtures/testers/rule-tester/messageId")
					.withMetaWithData,
				{
					valid: [],
					invalid: [
						{
							code: "foo",
							errors: [
								{ message: "something", messageId: "avoidFoo" },
							],
						},
					],
				},
			);
		}, "errors[0] should not specify both 'message' and 'messageId'.");
	});

	it("should throw if user tests for both message and data", () => {
		assert.throws(() => {
			ruleTester.run(
				"foo",
				require("../../fixtures/testers/rule-tester/messageId")
					.withMetaWithData,
				{
					valid: [],
					invalid: [
						{
							code: "foo",
							errors: [
								{
									message: "something",
									data: {
										name: "foo",
									},
								},
							],
						},
					],
				},
			);
		}, "errors[0] should not specify both 'data' and 'message'.");
	});

	it("should throw if user tests for messageId but the rule doesn't use the messageId meta syntax.", () => {
		assert.throws(() => {
			ruleTester.run(
				"foo",
				require("../../fixtures/testers/rule-tester/messageId")
					.withMessageOnly,
				{
					valid: [],
					invalid: [
						{ code: "foo", errors: [{ messageId: "avoidFoo" }] },
					],
				},
			);
		}, "Error can not use 'messageId' if rule under test doesn't define 'meta.messages'");
	});

	it("should fail if 'requireMessage: \"messageId\"' is set, but the rule does not define messageIds", () => {
		assert.throws(() => {
			ruleTester.run(
				"foo",
				require("../../fixtures/testers/rule-tester/messageId")
					.withMessageOnly,
				{
					assertionOptions: { requireMessage: "messageId" },
					valid: [],
					invalid: [
						{
							code: "foo",
							errors: [{ messageId: "avoidFoo" }],
						},
					],
				},
			);
		}, `Assertion options can not use 'requireMessage: "messageId"' if rule under test doesn't define 'meta.messages'.`);
	});

	it("should not fail if 'requireData' is set, but the rule does not define messageIds", () => {
		ruleTester.run(
			"foo",
			require("../../fixtures/testers/rule-tester/messageId")
				.withMessageOnly,
			{
				assertionOptions: { requireData: "error" },
				valid: [],
				invalid: [
					{
						code: "foo",
						errors: [
							{ message: "Avoid using variables named 'foo'." },
						],
					},
				],
			},
		);
	});

	it("should throw if user tests for messageId not listed in the rule's meta syntax.", () => {
		assert.throws(() => {
			ruleTester.run(
				"foo",
				require("../../fixtures/testers/rule-tester/messageId")
					.withMetaWithData,
				{
					valid: [],
					invalid: [
						{ code: "foo", errors: [{ messageId: "useFoo" }] },
					],
				},
			);
		}, /Invalid messageId 'useFoo'/u);
	});
	it("should throw if data provided without messageId.", () => {
		assert.throws(() => {
			ruleTester.run(
				"foo",
				require("../../fixtures/testers/rule-tester/messageId")
					.withMetaWithData,
				{
					valid: [],
					invalid: [{ code: "foo", errors: [{ data: "something" }] }],
				},
			);
		}, "errors[0] must specify either 'messageId' or 'message'.");
	});

	// fixable rules with or without `meta` property
	it("should not throw an error if a rule that has `meta.fixable` produces fixes", () => {
		const replaceProgramWith5Rule = {
			meta: {
				fixable: "code",
			},
			create(context) {
				return {
					Program(node) {
						context.report({
							node,
							message: "bad",
							fix: fixer => fixer.replaceText(node, "5"),
						});
					},
				};
			},
		};

		ruleTester.run("replaceProgramWith5", replaceProgramWith5Rule, {
			valid: [],
			invalid: [{ code: "var foo = bar;", output: "5", errors: 1 }],
		});
	});
	it("should throw an error if a new-format rule that doesn't have `meta` produces fixes", () => {
		const replaceProgramWith5Rule = {
			create(context) {
				return {
					Program(node) {
						context.report({
							node,
							message: "bad",
							fix: fixer => fixer.replaceText(node, "5"),
						});
					},
				};
			},
		};

		assert.throws(() => {
			ruleTester.run("replaceProgramWith5", replaceProgramWith5Rule, {
				valid: [],
				invalid: [{ code: "var foo = bar;", output: "5", errors: 1 }],
			});
		}, /Fixable rules must set the `meta\.fixable` property/u);
	});

	it("should allow testing of any file", () => {
		const filenames = [
			/*
			 * Ignored by default
			 * https://github.com/eslint/eslint/issues/19471
			 */
			"node_modules/foo.js",
			".git/foo.js",

			/*
			 * Absolute paths
			 * https://github.com/eslint/eslint/issues/17962
			 */
			"/an-absolute-path/foo.js",
			"C:\\an-absolute-path\\foo.js",
		];

		ruleTester.run(
			"no-eval",
			require("../../fixtures/testers/rule-tester/no-eval"),
			{
				valid: filenames.map((filename, index) => ({
					code: `Eval(foo${index})`,
					filename,
				})),
				invalid: filenames.map((filename, index) => ({
					code: `eval(foo${index})`,
					errors: [{ message: "eval sucks." }],
					filename,
				})),
			},
		);
	});

	describe("suggestions", () => {
		it("should throw if suggestions are available but not specified", () => {
			assert.throw(() => {
				ruleTester.run(
					"suggestions-basic",
					require("../../fixtures/testers/rule-tester/suggestions")
						.basic,
					{
						valid: ["var boo;"],
						invalid: [
							{
								code: "var foo;",
								errors: [
									{
										message:
											"Avoid using identifiers named 'foo'.",
									},
								],
							},
						],
					},
				);
			}, "Error at index 0 has suggestions. Please specify 'suggestions' property on the test error object.");
		});

		it("should pass with valid suggestions (tested using desc)", () => {
			ruleTester.run(
				"suggestions-basic",
				require("../../fixtures/testers/rule-tester/suggestions").basic,
				{
					valid: ["var boo;"],
					invalid: [
						{
							code: "var foo;",
							errors: [
								{
									message:
										"Avoid using identifiers named 'foo'.",
									suggestions: [
										{
											desc: "Rename identifier 'foo' to 'bar'",
											output: "var bar;",
										},
									],
								},
							],
						},
					],
				},
			);
		});

		it("should pass with suggestions on multiple lines", () => {
			ruleTester.run(
				"suggestions-basic",
				require("../../fixtures/testers/rule-tester/suggestions").basic,
				{
					valid: [],
					invalid: [
						{
							code: "function foo() {\n  var foo = 1;\n}",
							errors: [
								{
									message:
										"Avoid using identifiers named 'foo'.",
									suggestions: [
										{
											desc: "Rename identifier 'foo' to 'bar'",
											output: "function bar() {\n  var foo = 1;\n}",
										},
									],
								},
								{
									message:
										"Avoid using identifiers named 'foo'.",
									suggestions: [
										{
											desc: "Rename identifier 'foo' to 'bar'",
											output: "function foo() {\n  var bar = 1;\n}",
										},
									],
								},
							],
						},
					],
				},
			);
		});

		it("should pass with valid suggestions (tested using messageIds)", () => {
			ruleTester.run(
				"suggestions-messageIds",
				require("../../fixtures/testers/rule-tester/suggestions")
					.withMessageIds,
				{
					valid: [],
					invalid: [
						{
							code: "var foo;",
							errors: [
								{
									messageId: "avoidFoo",
									suggestions: [
										{
											messageId: "renameFoo",
											output: "var bar;",
										},
										{
											messageId: "renameFoo",
											output: "var baz;",
										},
									],
								},
							],
						},
					],
				},
			);
		});

		it("should pass with valid suggestions (one tested using messageIds, the other using desc)", () => {
			ruleTester.run(
				"suggestions-messageIds",
				require("../../fixtures/testers/rule-tester/suggestions")
					.withMessageIds,
				{
					valid: [],
					invalid: [
						{
							code: "var foo;",
							errors: [
								{
									messageId: "avoidFoo",
									suggestions: [
										{
											messageId: "renameFoo",
											output: "var bar;",
										},
										{
											desc: "Rename identifier 'foo' to 'baz'",
											output: "var baz;",
										},
									],
								},
							],
						},
					],
				},
			);
		});

		it("should fail with valid suggestions when testing using both desc and messageIds for the same suggestion", () => {
			assert.throw(() => {
				ruleTester.run(
					"suggestions-messageIds",
					require("../../fixtures/testers/rule-tester/suggestions")
						.withMessageIds,
					{
						valid: [],
						invalid: [
							{
								code: "var foo;",
								errors: [
									{
										messageId: "avoidFoo",
										suggestions: [
											{
												desc: "Rename identifier 'foo' to 'bar'",
												messageId: "renameFoo",
												output: "var bar;",
											},
											{
												desc: "Rename identifier 'foo' to 'baz'",
												messageId: "renameFoo",
												output: "var baz;",
											},
										],
									},
								],
							},
						],
					},
				);
			}, "Error Suggestion at index 0: Test should not specify both 'desc' and 'messageId'.");
		});

		it("should pass with valid suggestions (tested using only desc on a rule that utilizes meta.messages)", () => {
			ruleTester.run(
				"suggestions-messageIds",
				require("../../fixtures/testers/rule-tester/suggestions")
					.withMessageIds,
				{
					valid: [],
					invalid: [
						{
							code: "var foo;",
							errors: [
								{
									messageId: "avoidFoo",
									suggestions: [
										{
											desc: "Rename identifier 'foo' to 'bar'",
											output: "var bar;",
										},
										{
											desc: "Rename identifier 'foo' to 'baz'",
											output: "var baz;",
										},
									],
								},
							],
						},
					],
				},
			);
		});

		it("should pass with valid suggestions (tested using messageIds and data)", () => {
			ruleTester.run(
				"suggestions-messageIds",
				require("../../fixtures/testers/rule-tester/suggestions")
					.withMessageIds,
				{
					valid: [],
					invalid: [
						{
							code: "var foo;",
							errors: [
								{
									messageId: "avoidFoo",
									suggestions: [
										{
											messageId: "renameFoo",
											data: { newName: "bar" },
											output: "var bar;",
										},
										{
											messageId: "renameFoo",
											data: { newName: "baz" },
											output: "var baz;",
										},
									],
								},
							],
						},
					],
				},
			);
		});

		it("should fail with a single missing data placeholder when data is not specified", () => {
			assert.throws(() => {
				ruleTester.run(
					"suggestions-messageIds",
					require("../../fixtures/testers/rule-tester/suggestions")
						.withMissingPlaceholderData,
					{
						valid: [],
						invalid: [
							{
								code: "var foo;",
								errors: [
									{
										messageId: "avoidFoo",
										suggestions: [
											{
												messageId: "renameFoo",
												output: "var bar;",
											},
										],
									},
								],
							},
						],
					},
				);
			}, "The message of the suggestion has an unsubstituted placeholder 'newName'. Please provide the missing value via the 'data' property for the suggestion in the context.report() call.");
		});

		it("should fail with a single missing data placeholder when data is specified", () => {
			assert.throws(() => {
				ruleTester.run(
					"suggestions-messageIds",
					require("../../fixtures/testers/rule-tester/suggestions")
						.withMissingPlaceholderData,
					{
						valid: [],
						invalid: [
							{
								code: "var foo;",
								errors: [
									{
										messageId: "avoidFoo",
										suggestions: [
											{
												messageId: "renameFoo",
												data: { other: "name" },
												output: "var bar;",
											},
										],
									},
								],
							},
						],
					},
				);
			}, "The message of the suggestion has an unsubstituted placeholder 'newName'. Please provide the missing value via the 'data' property for the suggestion in the context.report() call.");
		});

		it("should fail with multiple missing data placeholders when data is not specified", () => {
			assert.throws(() => {
				ruleTester.run(
					"suggestions-messageIds",
					require("../../fixtures/testers/rule-tester/suggestions")
						.withMultipleMissingPlaceholderDataProperties,
					{
						valid: [],
						invalid: [
							{
								code: "var foo;",
								errors: [
									{
										messageId: "avoidFoo",
										suggestions: [
											{
												messageId: "rename",
												output: "var bar;",
											},
										],
									},
								],
							},
						],
					},
				);
			}, "The message of the suggestion has unsubstituted placeholders: 'currentName', 'newName'. Please provide the missing values via the 'data' property for the suggestion in the context.report() call.");
		});

		it("should fail when tested using empty suggestion test objects even if the array length is correct", () => {
			assert.throw(() => {
				ruleTester.run(
					"suggestions-messageIds",
					require("../../fixtures/testers/rule-tester/suggestions")
						.withMessageIds,
					{
						valid: [],
						invalid: [
							{
								code: "var foo;",
								errors: [
									{
										messageId: "avoidFoo",
										suggestions: [{}, {}],
									},
								],
							},
						],
					},
				);
			}, "Error Suggestion at index 0: Test must specify either 'messageId' or 'desc'");
		});

		it("should fail when tested using non-empty suggestion test objects without an output property", () => {
			assert.throw(() => {
				ruleTester.run(
					"suggestions-messageIds",
					require("../../fixtures/testers/rule-tester/suggestions")
						.withMessageIds,
					{
						valid: [],
						invalid: [
							{
								code: "var foo;",
								errors: [
									{
										messageId: "avoidFoo",
										suggestions: [
											{ messageId: "renameFoo" },
											{},
										],
									},
								],
							},
						],
					},
				);
			}, 'Error Suggestion at index 0: The "output" property is required.');
		});

		it("should support explicitly expecting no suggestions", () => {
			[void 0, null, false, []].forEach(suggestions => {
				ruleTester.run(
					"suggestions-basic",
					require("../../fixtures/testers/rule-tester/no-eval"),
					{
						valid: [],
						invalid: [
							{
								code: "eval('var foo');",
								errors: [
									{
										message: "eval sucks.",
										suggestions,
									},
								],
							},
						],
					},
				);
			});
		});

		it("should fail when expecting no suggestions and there are suggestions", () => {
			[void 0, null, false, []].forEach(suggestions => {
				assert.throws(() => {
					ruleTester.run(
						"suggestions-basic",
						require("../../fixtures/testers/rule-tester/suggestions")
							.basic,
						{
							valid: [],
							invalid: [
								{
									code: "var foo;",
									errors: [
										{
											message:
												"Avoid using identifiers named 'foo'.",
											suggestions,
										},
									],
								},
							],
						},
					);
				}, "Error should have no suggestions on error with message: \"Avoid using identifiers named 'foo'.\"");
			});
		});

		it("should fail when testing for suggestions that don't exist", () => {
			assert.throws(() => {
				ruleTester.run(
					"no-var",
					require("../../fixtures/testers/rule-tester/no-var"),
					{
						valid: [],
						invalid: [
							{
								code: "var foo;",
								errors: [
									{
										message: "Bad var.",
										suggestions: [
											{
												messageId:
													"this-does-not-exist",
											},
										],
									},
								],
							},
						],
					},
				);
			}, 'Error should have suggestions on error with message: "Bad var."');
		});

		it("should support specifying only the amount of suggestions", () => {
			ruleTester.run(
				"suggestions-basic",
				require("../../fixtures/testers/rule-tester/suggestions").basic,
				{
					valid: [],
					invalid: [
						{
							code: "var foo;",
							errors: [
								{
									message:
										"Avoid using identifiers named 'foo'.",
									suggestions: 1,
								},
							],
						},
					],
				},
			);
		});

		it("should fail when there are a different number of suggestions", () => {
			assert.throws(() => {
				ruleTester.run(
					"suggestions-basic",
					require("../../fixtures/testers/rule-tester/suggestions")
						.basic,
					{
						valid: [],
						invalid: [
							{
								code: "var foo;",
								errors: [
									{
										message:
											"Avoid using identifiers named 'foo'.",
										suggestions: 2,
									},
								],
							},
						],
					},
				);
			}, "Error should have 2 suggestions. Instead found 1 suggestions");
		});

		it("should fail when there are a different number of suggestions for arrays", () => {
			assert.throws(() => {
				ruleTester.run(
					"suggestions-basic",
					require("../../fixtures/testers/rule-tester/suggestions")
						.basic,
					{
						valid: [],
						invalid: [
							{
								code: "var foo;",
								errors: [
									{
										message:
											"Avoid using identifiers named 'foo'.",
										suggestions: [
											{
												desc: "Rename identifier 'foo' to 'bar'",
												output: "var bar;",
											},
											{
												desc: "Rename identifier 'foo' to 'baz'",
												output: "var baz;",
											},
										],
									},
								],
							},
						],
					},
				);
			}, "Error should have 2 suggestions. Instead found 1 suggestions");
		});

		it("should fail when the suggestion property is neither a number nor an array", () => {
			assert.throws(() => {
				ruleTester.run(
					"suggestions-basic",
					require("../../fixtures/testers/rule-tester/suggestions")
						.basic,
					{
						valid: [],
						invalid: [
							{
								code: "var foo;",
								errors: [
									{
										message:
											"Avoid using identifiers named 'foo'.",
										suggestions: "1",
									},
								],
							},
						],
					},
				);
			}, "Test error object property 'suggestions' should be an array or a number");
		});

		it("should throw if suggestion fix made a syntax error.", () => {
			assert.throw(() => {
				ruleTester.run(
					"foo",
					{
						meta: { hasSuggestions: true },
						create(context) {
							return {
								Identifier(node) {
									context.report({
										node,
										message: "make a syntax error",
										suggest: [
											{
												desc: "make a syntax error",
												fix(fixer) {
													return fixer.replaceText(
														node,
														"one two",
													);
												},
											},
										],
									});
								},
							};
						},
					},
					{
						valid: [""],
						invalid: [
							{
								code: "one()",
								errors: [
									{
										message: "make a syntax error",
										suggestions: [
											{
												desc: "make a syntax error",
												output: "one two()",
											},
										],
									},
								],
							},
						],
					},
				);
			}, /A fatal parsing error occurred in suggestion fix\.\nError: .+\nSuggestion output:\n.+/u);
		});

		it("should throw if the suggestion description doesn't match", () => {
			assert.throws(() => {
				ruleTester.run(
					"suggestions-basic",
					require("../../fixtures/testers/rule-tester/suggestions")
						.basic,
					{
						valid: [],
						invalid: [
							{
								code: "var foo;",
								errors: [
									{
										message:
											"Avoid using identifiers named 'foo'.",
										suggestions: [
											{
												desc: "not right",
												output: "var baz;",
											},
										],
									},
								],
							},
						],
					},
				);
			}, "Error Suggestion at index 0: desc should be \"not right\" but got \"Rename identifier 'foo' to 'bar'\" instead.");
		});

		it("should pass when different suggestion matchers use desc and messageId", () => {
			ruleTester.run(
				"suggestions-messageIds",
				require("../../fixtures/testers/rule-tester/suggestions")
					.withMessageIds,
				{
					valid: [],
					invalid: [
						{
							code: "var foo;",
							errors: [
								{
									messageId: "avoidFoo",
									suggestions: [
										{
											desc: "Rename identifier 'foo' to 'bar'",
											output: "var bar;",
										},
										{
											messageId: "renameFoo",
											output: "var baz;",
										},
									],
								},
							],
						},
					],
				},
			);
		});

		it("should throw if the suggestion messageId doesn't match", () => {
			assert.throws(() => {
				ruleTester.run(
					"suggestions-messageIds",
					require("../../fixtures/testers/rule-tester/suggestions")
						.withMessageIds,
					{
						valid: [],
						invalid: [
							{
								code: "var foo;",
								errors: [
									{
										messageId: "avoidFoo",
										suggestions: [
											{
												messageId: "unused",
												output: "var bar;",
											},
											{
												messageId: "renameFoo",
												output: "var baz;",
											},
										],
									},
								],
							},
						],
					},
				);
			}, "Error Suggestion at index 0: messageId should be 'unused' but got 'renameFoo' instead.");
		});

		it("should throw if test specifies messageId for a rule that doesn't have meta.messages", () => {
			assert.throws(() => {
				ruleTester.run(
					"suggestions-basic",
					require("../../fixtures/testers/rule-tester/suggestions")
						.basic,
					{
						valid: [],
						invalid: [
							{
								code: "var foo;",
								errors: [
									{
										message:
											"Avoid using identifiers named 'foo'.",
										suggestions: [
											{
												messageId: "renameFoo",
												output: "var bar;",
											},
										],
									},
								],
							},
						],
					},
				);
			}, "Error Suggestion at index 0: Test can not use 'messageId' if rule under test doesn't define 'meta.messages'.");
		});

		it("should throw if test specifies messageId that doesn't exist in the rule's meta.messages", () => {
			assert.throws(() => {
				ruleTester.run(
					"suggestions-messageIds",
					require("../../fixtures/testers/rule-tester/suggestions")
						.withMessageIds,
					{
						valid: [],
						invalid: [
							{
								code: "var foo;",
								errors: [
									{
										messageId: "avoidFoo",
										suggestions: [
											{
												messageId: "renameFoo",
												output: "var bar;",
											},
											{
												messageId: "removeFoo",
												output: "var baz;",
											},
										],
									},
								],
							},
						],
					},
				);
			}, "Error Suggestion at index 1: Test has invalid messageId 'removeFoo', the rule under test allows only one of ['avoidFoo', 'unused', 'renameFoo'].");
		});

		it("should throw if hydrated desc doesn't match (wrong data value)", () => {
			assert.throws(() => {
				ruleTester.run(
					"suggestions-messageIds",
					require("../../fixtures/testers/rule-tester/suggestions")
						.withMessageIds,
					{
						valid: [],
						invalid: [
							{
								code: "var foo;",
								errors: [
									{
										messageId: "avoidFoo",
										suggestions: [
											{
												messageId: "renameFoo",
												data: { newName: "car" },
												output: "var bar;",
											},
											{
												messageId: "renameFoo",
												data: { newName: "baz" },
												output: "var baz;",
											},
										],
									},
								],
							},
						],
					},
				);
			}, "Error Suggestion at index 0: Hydrated test desc \"Rename identifier 'foo' to 'car'\" does not match received desc \"Rename identifier 'foo' to 'bar'\".");
		});

		it("should throw if hydrated desc doesn't match (wrong data key)", () => {
			assert.throws(() => {
				ruleTester.run(
					"suggestions-messageIds",
					require("../../fixtures/testers/rule-tester/suggestions")
						.withMessageIds,
					{
						valid: [],
						invalid: [
							{
								code: "var foo;",
								errors: [
									{
										messageId: "avoidFoo",
										suggestions: [
											{
												messageId: "renameFoo",
												data: { newName: "bar" },
												output: "var bar;",
											},
											{
												messageId: "renameFoo",
												data: { name: "baz" },
												output: "var baz;",
											},
										],
									},
								],
							},
						],
					},
				);
			}, "Error Suggestion at index 1: Hydrated test desc \"Rename identifier 'foo' to '{{ newName }}'\" does not match received desc \"Rename identifier 'foo' to 'baz'\".");
		});

		it("should throw if test specifies both desc and data", () => {
			assert.throws(() => {
				ruleTester.run(
					"suggestions-messageIds",
					require("../../fixtures/testers/rule-tester/suggestions")
						.withMessageIds,
					{
						valid: [],
						invalid: [
							{
								code: "var foo;",
								errors: [
									{
										messageId: "avoidFoo",
										suggestions: [
											{
												desc: "Rename identifier 'foo' to 'bar'",
												messageId: "renameFoo",
												data: { newName: "bar" },
												output: "var bar;",
											},
											{
												messageId: "renameFoo",
												data: { newName: "baz" },
												output: "var baz;",
											},
										],
									},
								],
							},
						],
					},
				);
			}, "Error Suggestion at index 0: Test should not specify both 'desc' and 'data'.");
		});

		it("should throw if test uses data but doesn't specify messageId", () => {
			assert.throws(() => {
				ruleTester.run(
					"suggestions-messageIds",
					require("../../fixtures/testers/rule-tester/suggestions")
						.withMessageIds,
					{
						valid: [],
						invalid: [
							{
								code: "var foo;",
								errors: [
									{
										messageId: "avoidFoo",
										suggestions: [
											{
												messageId: "renameFoo",
												data: { newName: "bar" },
												output: "var bar;",
											},
											{
												data: { newName: "baz" },
												output: "var baz;",
											},
										],
									},
								],
							},
						],
					},
				);
			}, "Error Suggestion at index 1: Test must specify 'messageId' if 'data' is used.");
		});

		it("should throw if the resulting suggestion output doesn't match", () => {
			assert.throws(() => {
				ruleTester.run(
					"suggestions-basic",
					require("../../fixtures/testers/rule-tester/suggestions")
						.basic,
					{
						valid: [],
						invalid: [
							{
								code: "var foo;",
								errors: [
									{
										message:
											"Avoid using identifiers named 'foo'.",
										suggestions: [
											{
												desc: "Rename identifier 'foo' to 'bar'",
												output: "var baz;",
											},
										],
									},
								],
							},
						],
					},
				);
			}, "Expected the applied suggestion fix to match the test suggestion output");
		});

		it("should throw if the resulting suggestion output is the same as the original source code", () => {
			assert.throws(() => {
				ruleTester.run(
					"suggestions-basic",
					require("../../fixtures/testers/rule-tester/suggestions")
						.withFixerWithoutChanges,
					{
						valid: [],
						invalid: [
							{
								code: "var foo;",
								errors: [
									{
										message:
											"Avoid using identifiers named 'foo'.",
										suggestions: [
											{
												desc: "Rename identifier 'foo' to 'bar'",
												output: "var foo;",
											},
										],
									},
								],
							},
						],
					},
				);
			}, "The output of a suggestion should differ from the original source code for suggestion at index: 0 on error with message: \"Avoid using identifiers named 'foo'.\"");
		});

		it("should fail when specified suggestion isn't an object", () => {
			assert.throws(() => {
				ruleTester.run(
					"suggestions-basic",
					require("../../fixtures/testers/rule-tester/suggestions")
						.basic,
					{
						valid: [],
						invalid: [
							{
								code: "var foo;",
								errors: [
									{
										message:
											"Avoid using identifiers named 'foo'.",
										suggestions: [null],
									},
								],
							},
						],
					},
				);
			}, "Test suggestion in 'suggestions' array must be an object.");

			assert.throws(() => {
				ruleTester.run(
					"suggestions-messageIds",
					require("../../fixtures/testers/rule-tester/suggestions")
						.withMessageIds,
					{
						valid: [],
						invalid: [
							{
								code: "var foo;",
								errors: [
									{
										messageId: "avoidFoo",
										suggestions: [
											{
												messageId: "renameFoo",
												output: "var bar;",
											},
											"Rename identifier 'foo' to 'baz'",
										],
									},
								],
							},
						],
					},
				);
			}, "Test suggestion in 'suggestions' array must be an object.");
		});

		it("should fail when the suggestion is an object with an unknown property name", () => {
			assert.throws(() => {
				ruleTester.run(
					"suggestions-basic",
					require("../../fixtures/testers/rule-tester/suggestions")
						.basic,
					{
						valid: ["var boo;"],
						invalid: [
							{
								code: "var foo;",
								errors: [
									{
										message:
											"Avoid using identifiers named 'foo'.",
										suggestions: [
											{
												message:
													"Rename identifier 'foo' to 'bar'",
											},
										],
									},
								],
							},
						],
					},
				);
			}, /Invalid suggestion property name 'message'/u);
		});

		it("should fail when any of the suggestions is an object with an unknown property name", () => {
			assert.throws(() => {
				ruleTester.run(
					"suggestions-messageIds",
					require("../../fixtures/testers/rule-tester/suggestions")
						.withMessageIds,
					{
						valid: [],
						invalid: [
							{
								code: "var foo;",
								errors: [
									{
										messageId: "avoidFoo",
										suggestions: [
											{
												messageId: "renameFoo",
												output: "var bar;",
											},
											{
												messageId: "renameFoo",
												outpt: "var baz;",
											},
										],
									},
								],
							},
						],
					},
				);
			}, /Invalid suggestion property name 'outpt'/u);
		});

		it("should fail if a rule produces two suggestions with the same description", () => {
			assert.throws(() => {
				ruleTester.run(
					"suggestions-with-duplicate-descriptions",
					require("../../fixtures/testers/rule-tester/suggestions")
						.withDuplicateDescriptions,
					{
						valid: [],
						invalid: [{ code: "var foo = bar;", errors: 1 }],
					},
				);
			}, "Suggestion message 'Rename 'foo' to 'bar'' reported from suggestion 1 was previously reported by suggestion 0. Suggestion messages should be unique within an error.");
		});

		it("should fail if a rule produces two suggestions with the same messageId without data", () => {
			assert.throws(() => {
				ruleTester.run(
					"suggestions-with-duplicate-messageids-no-data",
					require("../../fixtures/testers/rule-tester/suggestions")
						.withDuplicateMessageIdsNoData,
					{
						valid: [],
						invalid: [{ code: "var foo = bar;", errors: 1 }],
					},
				);
			}, "Suggestion message 'Rename identifier' reported from suggestion 1 was previously reported by suggestion 0. Suggestion messages should be unique within an error.");
		});

		it("should fail if a rule produces two suggestions with the same messageId with data", () => {
			assert.throws(() => {
				ruleTester.run(
					"suggestions-with-duplicate-messageids-with-data",
					require("../../fixtures/testers/rule-tester/suggestions")
						.withDuplicateMessageIdsWithData,
					{
						valid: [],
						invalid: [{ code: "var foo = bar;", errors: 1 }],
					},
				);
			}, "Suggestion message 'Rename identifier 'foo' to 'bar'' reported from suggestion 1 was previously reported by suggestion 0. Suggestion messages should be unique within an error.");
		});

		it("should throw an error if a rule that doesn't have `meta.hasSuggestions` enabled produces suggestions", () => {
			assert.throws(() => {
				ruleTester.run(
					"suggestions-missing-hasSuggestions-property",
					require("../../fixtures/testers/rule-tester/suggestions")
						.withoutHasSuggestionsProperty,
					{
						valid: [],
						invalid: [
							{ code: "var foo = bar;", output: "5", errors: 1 },
						],
					},
				);
			}, "Rules with suggestions must set the `meta.hasSuggestions` property to `true`.");
		});
	});

	/**
	 * Asserts that a particular value will be emitted from an EventEmitter.
	 * @param {EventEmitter} emitter The emitter that should emit a value
	 * @param {string} emitType The type of emission to listen for
	 * @param {any} expectedValue The value that should be emitted
	 * @returns {Promise<void>} A Promise that fulfills if the value is emitted, and rejects if something else is emitted.
	 * The Promise will be indefinitely pending if no value is emitted.
	 */
	function assertEmitted(emitter, emitType, expectedValue) {
		return new Promise((resolve, reject) => {
			emitter.once(emitType, emittedValue => {
				if (emittedValue === expectedValue) {
					resolve();
				} else {
					reject(
						new Error(
							`Expected ${expectedValue} to be emitted but ${emittedValue} was emitted instead.`,
						),
					);
				}
			});
		});
	}

	describe("naming test cases", () => {
		it("should use the first argument as the name of the test suite", () => {
			const assertion = assertEmitted(
				ruleTesterTestEmitter,
				"describe",
				"this-is-a-rule-name",
			);

			ruleTester.run(
				"this-is-a-rule-name",
				require("../../fixtures/testers/rule-tester/no-var"),
				{
					valid: [],
					invalid: [],
				},
			);

			return assertion;
		});

		it("should use the test code as the name of the tests for valid code (string form)", () => {
			const assertion = assertEmitted(
				ruleTesterTestEmitter,
				"it",
				"valid(code);",
			);

			ruleTester.run(
				"foo",
				require("../../fixtures/testers/rule-tester/no-var"),
				{
					valid: ["valid(code);"],
					invalid: [],
				},
			);

			return assertion;
		});

		it("should use the test code as the name of the tests for valid code (object form)", () => {
			const assertion = assertEmitted(
				ruleTesterTestEmitter,
				"it",
				"valid(code);",
			);

			ruleTester.run(
				"foo",
				require("../../fixtures/testers/rule-tester/no-var"),
				{
					valid: [
						{
							code: "valid(code);",
						},
					],
					invalid: [],
				},
			);

			return assertion;
		});

		it("should use the test code as the name of the tests for invalid code", () => {
			const assertion = assertEmitted(
				ruleTesterTestEmitter,
				"it",
				"var x = invalid(code);",
			);

			ruleTester.run(
				"foo",
				require("../../fixtures/testers/rule-tester/no-var"),
				{
					valid: [],
					invalid: [
						{
							code: "var x = invalid(code);",
							output: " x = invalid(code);",
							errors: 1,
						},
					],
				},
			);

			return assertion;
		});

		// https://github.com/eslint/eslint/issues/8142
		it("should use the empty string as the name of the test if the test case is an empty string", () => {
			const assertion = assertEmitted(ruleTesterTestEmitter, "it", "");

			ruleTester.run(
				"foo",
				require("../../fixtures/testers/rule-tester/no-var"),
				{
					valid: [
						{
							code: "",
						},
					],
					invalid: [],
				},
			);

			return assertion;
		});

		it('should use the "name" property if set to a non-empty string', () => {
			const assertion = assertEmitted(
				ruleTesterTestEmitter,
				"it",
				"my test",
			);

			ruleTester.run(
				"foo",
				require("../../fixtures/testers/rule-tester/no-var"),
				{
					valid: [],
					invalid: [
						{
							name: "my test",
							code: "var x = invalid(code);",
							output: " x = invalid(code);",
							errors: 1,
						},
					],
				},
			);

			return assertion;
		});

		it('should use the "name" property if set to a non-empty string for valid cases too', () => {
			const assertion = assertEmitted(
				ruleTesterTestEmitter,
				"it",
				"my test",
			);

			ruleTester.run(
				"foo",
				require("../../fixtures/testers/rule-tester/no-var"),
				{
					valid: [
						{
							name: "my test",
							code: "valid(code);",
						},
					],
					invalid: [],
				},
			);

			return assertion;
		});

		it('should use the test code as the name if the "name" property is set to an empty string', () => {
			const assertion = assertEmitted(
				ruleTesterTestEmitter,
				"it",
				"var x = invalid(code);",
			);

			ruleTester.run(
				"foo",
				require("../../fixtures/testers/rule-tester/no-var"),
				{
					valid: [],
					invalid: [
						{
							name: "",
							code: "var x = invalid(code);",
							output: " x = invalid(code);",
							errors: 1,
						},
					],
				},
			);

			return assertion;
		});

		it('should throw if "name" property is not a string', () => {
			assert.throws(() => {
				ruleTester.run(
					"foo",
					require("../../fixtures/testers/rule-tester/no-var"),
					{
						valid: [{ code: "foo", name: 123 }],
						invalid: [{ code: "foo" }],
					},
				);
			}, /Optional test case property 'name' must be a string/u);

			assert.throws(() => {
				ruleTester.run(
					"foo",
					require("../../fixtures/testers/rule-tester/no-var"),
					{
						valid: ["foo"],
						invalid: [{ code: "foo", name: 123, errors: 1 }],
					},
				);
			}, /Optional test case property 'name' must be a string/u);
		});

		it('should throw if "code" property is not a string', () => {
			assert.throws(() => {
				ruleTester.run(
					"foo",
					require("../../fixtures/testers/rule-tester/no-var"),
					{
						valid: [{ code: 123 }],
						invalid: [{ code: "foo" }],
					},
				);
			}, /Test case must specify a string value for 'code'/u);

			assert.throws(() => {
				ruleTester.run(
					"foo",
					require("../../fixtures/testers/rule-tester/no-var"),
					{
						valid: [123],
						invalid: [{ code: "foo" }],
					},
				);
			}, /Test case must specify a string value for 'code'/u);

			assert.throws(() => {
				ruleTester.run(
					"foo",
					require("../../fixtures/testers/rule-tester/no-var"),
					{
						valid: ["foo"],
						invalid: [{ code: 123 }],
					},
				);
			}, /Test case must specify a string value for 'code'/u);
		});

		it('should throw if "code" property is missing', () => {
			assert.throws(() => {
				ruleTester.run(
					"foo",
					require("../../fixtures/testers/rule-tester/no-var"),
					{
						valid: [{}],
						invalid: [{ code: "foo" }],
					},
				);
			}, /Test case must specify a string value for 'code'/u);

			assert.throws(() => {
				ruleTester.run(
					"foo",
					require("../../fixtures/testers/rule-tester/no-var"),
					{
						valid: ["foo"],
						invalid: [{}],
					},
				);
			}, /Test case must specify a string value for 'code'/u);
		});
	});

	// https://github.com/eslint/eslint/issues/11615
	it("should fail the case if autofix made a syntax error.", () => {
		assert.throw(() => {
			ruleTester.run(
				"foo",
				{
					meta: {
						fixable: "code",
					},
					create(context) {
						return {
							Identifier(node) {
								context.report({
									node,
									message: "make a syntax error",
									fix(fixer) {
										return fixer.replaceText(
											node,
											"one two",
										);
									},
								});
							},
						};
					},
				},
				{
					valid: ["one()"],
					invalid: [],
				},
			);
		}, /A fatal parsing error occurred in autofix.\nError: .+\nAutofix output:\n.+/u);
	});

	describe("type checking", () => {
		it('should throw if "only" property is not a boolean', () => {
			// "only" has to be falsy as itOnly is not mocked for all test cases
			assert.throws(() => {
				ruleTester.run(
					"foo",
					require("../../fixtures/testers/rule-tester/no-var"),
					{
						valid: [{ code: "foo", only: "" }],
						invalid: [],
					},
				);
			}, /Optional test case property 'only' must be a boolean/u);

			assert.throws(() => {
				ruleTester.run(
					"foo",
					require("../../fixtures/testers/rule-tester/no-var"),
					{
						valid: [],
						invalid: [{ code: "foo", only: 0, errors: 1 }],
					},
				);
			}, /Optional test case property 'only' must be a boolean/u);
		});

		it('should throw if "filename" property is not a string', () => {
			assert.throws(() => {
				ruleTester.run(
					"foo",
					require("../../fixtures/testers/rule-tester/no-var"),
					{
						valid: [{ code: "foo", filename: false }],
						invalid: [],
					},
				);
			}, /Optional test case property 'filename' must be a string/u);

			assert.throws(() => {
				ruleTester.run(
					"foo",
					require("../../fixtures/testers/rule-tester/no-var"),
					{
						valid: ["foo"],
						invalid: [{ code: "foo", errors: 1, filename: 0 }],
					},
				);
			}, /Optional test case property 'filename' must be a string/u);
		});
	});

	describe("sanitize test cases", () => {
		let originalRuleTesterIt;
		let spyRuleTesterIt;

		before(() => {
			originalRuleTesterIt = RuleTester.it;
			spyRuleTesterIt = sinon.spy();
			RuleTester.it = spyRuleTesterIt;
		});
		after(() => {
			RuleTester.it = originalRuleTesterIt;
		});
		beforeEach(() => {
			spyRuleTesterIt.resetHistory();
			ruleTester = new RuleTester();
		});
		it("should present newline when using back-tick as new line", () => {
			const code = `
            var foo = bar;`;

			ruleTester.run(
				"no-var",
				require("../../fixtures/testers/rule-tester/no-var"),
				{
					valid: [],
					invalid: [
						{
							code,
							errors: [/^Bad var/u],
						},
					],
				},
			);
			sinon.assert.calledWith(spyRuleTesterIt, code);
		});
		it("should present \\u0000 as a string", () => {
			const code = "\u0000";

			ruleTester.run(
				"no-var",
				require("../../fixtures/testers/rule-tester/no-var"),
				{
					valid: [],
					invalid: [
						{
							code,
							errors: [/^Bad var/u],
						},
					],
				},
			);
			sinon.assert.calledWith(spyRuleTesterIt, "\\u0000");
		});
		it("should present the pipe character correctly", () => {
			const code = "var foo = bar || baz;";

			ruleTester.run(
				"no-var",
				require("../../fixtures/testers/rule-tester/no-var"),
				{
					valid: [],
					invalid: [
						{
							code,
							errors: [/^Bad var/u],
						},
					],
				},
			);
			sinon.assert.calledWith(spyRuleTesterIt, code);
		});
	});

	describe("duplicate test cases", () => {
		describe("valid test cases", () => {
			it("throws with duplicate string test cases", () => {
				assert.throws(() => {
					ruleTester.run(
						"foo",
						{
							meta: {},
							create() {
								return {};
							},
						},
						{
							valid: ["foo", "foo"],
							invalid: [],
						},
					);
				}, "detected duplicate test case");
			});

			it("throws with duplicate object test cases", () => {
				assert.throws(() => {
					ruleTester.run(
						"foo",
						{
							meta: {},
							create() {
								return {};
							},
						},
						{
							valid: [{ code: "foo" }, { code: "foo" }],
							invalid: [],
						},
					);
				}, "detected duplicate test case");
			});

			it("throws with duplicate object test cases when they are the same object", () => {
				const test = { code: "foo" };
				assert.throws(() => {
					ruleTester.run(
						"foo",
						{
							meta: {},
							create() {
								return {};
							},
						},
						{
							valid: [test, test],
							invalid: [],
						},
					);
				}, "detected duplicate test case");
			});

			it("throws with duplicate object test cases that have multiple references to the same object", () => {
				const obj1 = { foo: { bar: "baz" } };
				const obj2 = { foo: { bar: "baz" } };

				assert.throws(() => {
					ruleTester.run(
						"foo",
						{
							meta: {},
							create() {
								return {};
							},
						},
						{
							valid: [
								{
									code: "foo",
									settings: { qux: obj1, quux: obj1 },
								},
								{
									code: "foo",
									settings: { qux: obj2, quux: obj2 },
								},
							],
							invalid: [],
						},
					);
				}, "detected duplicate test case");
			});

			it("does not throw with duplicate object test cases that have circular references", () => {
				const obj1 = { foo: "bar" };
				obj1.circular = obj1;
				const obj2 = { foo: "bar" };
				obj2.circular = obj2;

				ruleTester.run(
					"foo",
					{
						meta: {},
						create() {
							return {};
						},
					},
					{
						valid: [
							{ code: "foo", settings: { baz: obj1 } },
							{ code: "foo", settings: { baz: obj2 } },
						],
						invalid: [],
					},
				);
			});

			it("throws with string and object test cases", () => {
				assert.throws(() => {
					ruleTester.run(
						"foo",
						{
							meta: {},
							create() {
								return {};
							},
						},
						{
							valid: ["foo", { code: "foo" }],
							invalid: [],
						},
					);
				}, "detected duplicate test case");
			});

			it("ignores the name property", () => {
				assert.throws(() => {
					ruleTester.run(
						"foo",
						{
							meta: {},
							create() {
								return {};
							},
						},
						{
							valid: [
								{ code: "foo" },
								{ name: "bar", code: "foo" },
							],
							invalid: [],
						},
					);
				}, "detected duplicate test case");
			});

			it("does not ignore top level test case properties nested in other test case properties", () => {
				ruleTester.run(
					"foo",
					{
						meta: { schema: [{ type: "object" }] },
						create() {
							return {};
						},
					},
					{
						valid: [
							{
								options: [{ name: "foo" }],
								name: "foo",
								code: "same",
							},
							{
								options: [{ name: "bar" }],
								name: "bar",
								code: "same",
							},
						],
						invalid: [],
					},
				);
			});

			it("does not throw an error for defining the same test case in different run calls", () => {
				const rule = {
					meta: {},
					create() {
						return {};
					},
				};

				ruleTester.run("foo", rule, {
					valid: ["foo"],
					invalid: [],
				});

				ruleTester.run("foo", rule, {
					valid: ["foo"],
					invalid: [],
				});
			});
		});

		describe("invalid test cases", () => {
			it("throws with duplicate object test cases", () => {
				assert.throws(() => {
					ruleTester.run(
						"foo",
						{
							meta: {},
							create(context) {
								return {
									VariableDeclaration(node) {
										context.report(node, "foo bar");
									},
								};
							},
						},
						{
							valid: ["foo"],
							invalid: [
								{
									code: "const x = 123;",
									errors: [{ message: "foo bar" }],
								},
								{
									code: "const x = 123;",
									errors: [{ message: "foo bar" }],
								},
							],
						},
					);
				}, "detected duplicate test case");
			});

			it("throws with duplicate object test cases when they are the same object", () => {
				const test = {
					code: "const x = 123;",
					errors: [{ message: "foo bar" }],
				};

				assert.throws(() => {
					ruleTester.run(
						"foo",
						{
							meta: {},
							create(context) {
								return {
									VariableDeclaration(node) {
										context.report(node, "foo bar");
									},
								};
							},
						},
						{
							valid: ["foo"],
							invalid: [test, test],
						},
					);
				}, "detected duplicate test case");
			});

			it("throws with duplicate object test cases that have multiple references to the same object", () => {
				const obj1 = { foo: { bar: "baz" } };
				const obj2 = { foo: { bar: "baz" } };

				assert.throws(() => {
					ruleTester.run(
						"foo",
						{
							meta: {},
							create(context) {
								return {
									VariableDeclaration(node) {
										context.report(node, "foo bar");
									},
								};
							},
						},
						{
							valid: ["foo"],
							invalid: [
								{
									code: "const x = 123;",
									settings: { qux: obj1, quux: obj1 },
									errors: [{ message: "foo bar" }],
								},
								{
									code: "const x = 123;",
									settings: { qux: obj2, quux: obj2 },
									errors: [{ message: "foo bar" }],
								},
							],
						},
					);
				}, "detected duplicate test case");
			});

			it("does not throw with duplicate object test cases that have circular references", () => {
				const obj1 = { foo: "bar" };
				obj1.circular = obj1;
				const obj2 = { foo: "bar" };
				obj2.circular = obj2;

				ruleTester.run(
					"foo",
					{
						meta: {},
						create(context) {
							return {
								VariableDeclaration(node) {
									context.report(node, "foo bar");
								},
							};
						},
					},
					{
						valid: ["foo"],
						invalid: [
							{
								code: "const x = 123;",
								settings: { baz: obj1 },
								errors: [{ message: "foo bar" }],
							},
							{
								code: "const x = 123;",
								settings: { baz: obj2 },
								errors: [{ message: "foo bar" }],
							},
						],
					},
				);
			});

			it("throws with duplicate object test cases when options is a primitive", () => {
				assert.throws(() => {
					ruleTester.run(
						"foo",
						{
							meta: { schema: false },
							create(context) {
								return {
									VariableDeclaration(node) {
										context.report(node, "foo bar");
									},
								};
							},
						},
						{
							valid: ["foo"],
							invalid: [
								{
									code: "const x = 123;",
									errors: [{ message: "foo bar" }],
									options: ["abc"],
								},
								{
									code: "const x = 123;",
									errors: [{ message: "foo bar" }],
									options: ["abc"],
								},
							],
						},
					);
				}, "detected duplicate test case");
			});

			it("throws with duplicate object test cases when options is a nested serializable object", () => {
				assert.throws(() => {
					ruleTester.run(
						"foo",
						{
							meta: { schema: false },
							create(context) {
								return {
									VariableDeclaration(node) {
										context.report(node, "foo bar");
									},
								};
							},
						},
						{
							valid: ["foo"],
							invalid: [
								{
									code: "const x = 123;",
									errors: [{ message: "foo bar" }],
									options: [
										{ foo: [{ a: true, b: [1, 2, 3] }] },
									],
								},
								{
									code: "const x = 123;",
									errors: [{ message: "foo bar" }],
									options: [
										{ foo: [{ a: true, b: [1, 2, 3] }] },
									],
								},
							],
						},
					);
				}, "detected duplicate test case");
			});

			it("throws with duplicate object test cases even when property order differs", () => {
				assert.throws(() => {
					ruleTester.run(
						"foo",
						{
							meta: {},
							create(context) {
								return {
									VariableDeclaration(node) {
										context.report(node, "foo bar");
									},
								};
							},
						},
						{
							valid: ["foo"],
							invalid: [
								{
									code: "const x = 123;",
									errors: [{ message: "foo bar" }],
								},
								{
									errors: [{ message: "foo bar" }],
									code: "const x = 123;",
								},
							],
						},
					);
				}, "detected duplicate test case");
			});

			it("ignores duplicate test case when non-serializable property present (settings)", () => {
				ruleTester.run(
					"foo",
					{
						meta: {},
						create(context) {
							return {
								VariableDeclaration(node) {
									context.report(node, "foo bar");
								},
							};
						},
					},
					{
						valid: ["foo"],
						invalid: [
							{
								code: "const x = 123;",
								errors: [{ message: "foo bar" }],
								settings: { foo: /abc/u },
							},
							{
								code: "const x = 123;",
								errors: [{ message: "foo bar" }],
								settings: { foo: /abc/u },
							},
						],
					},
				);
			});

			it("ignores duplicate test case when non-serializable property present (languageOptions.parserOptions)", () => {
				ruleTester.run(
					"foo",
					{
						meta: {},
						create(context) {
							return {
								VariableDeclaration(node) {
									context.report(node, "foo bar");
								},
							};
						},
					},
					{
						valid: ["foo"],
						invalid: [
							{
								code: "const x = 123;",
								errors: [{ message: "foo bar" }],
								languageOptions: {
									parserOptions: { foo: /abc/u },
								},
							},
							{
								code: "const x = 123;",
								errors: [{ message: "foo bar" }],
								languageOptions: {
									parserOptions: { foo: /abc/u },
								},
							},
						],
					},
				);
			});

			it("ignores duplicate test case when non-serializable property present (plugins)", () => {
				ruleTester.run(
					"foo",
					{
						meta: {},
						create(context) {
							return {
								VariableDeclaration(node) {
									context.report(node, "foo bar");
								},
							};
						},
					},
					{
						valid: ["foo"],
						invalid: [
							{
								code: "const x = 123;",
								errors: [{ message: "foo bar" }],
								plugins: { foo: /abc/u },
							},
							{
								code: "const x = 123;",
								errors: [{ message: "foo bar" }],
								plugins: { foo: /abc/u },
							},
						],
					},
				);
			});

			it("ignores duplicate test case when non-serializable property present (options)", () => {
				ruleTester.run(
					"foo",
					{
						meta: { schema: false },
						create(context) {
							return {
								VariableDeclaration(node) {
									context.report(node, "foo bar");
								},
							};
						},
					},
					{
						valid: ["foo"],
						invalid: [
							{
								code: "const x = 123;",
								errors: [{ message: "foo bar" }],
								options: [{ foo: /abc/u }],
							},
							{
								code: "const x = 123;",
								errors: [{ message: "foo bar" }],
								options: [{ foo: /abc/u }],
							},
						],
					},
				);
			});

			it("detects duplicate test cases even if the error matchers differ", () => {
				assert.throws(() => {
					ruleTester.run(
						"foo",
						{
							meta: { schema: false },
							create(context) {
								return {
									VariableDeclaration(node) {
										context.report(node, "foo bar");
									},
								};
							},
						},
						{
							valid: [],
							invalid: [
								{
									code: "const x = 123;",
									errors: [{ message: "foo bar" }],
								},
								{ code: "const x = 123;", errors: 1 },
							],
						},
					);
				}, "detected duplicate test case");
			});

			it("detects duplicate test cases even if the presence of the output property differs", () => {
				assert.throws(() => {
					ruleTester.run(
						"foo",
						{
							meta: { schema: false },
							create(context) {
								return {
									VariableDeclaration(node) {
										context.report(node, "foo bar");
									},
								};
							},
						},
						{
							valid: [],
							invalid: [
								{ code: "const x = 123;", errors: 1 },
								{
									code: "const x = 123;",
									errors: 1,
									output: null,
								},
							],
						},
					);
				}, "detected duplicate test case");
			});
		});
	});

	describe("SourceCode forbidden methods", () => {
		["applyInlineConfig", "applyLanguageOptions", "finalize"].forEach(
			methodName => {
				const useForbiddenMethodRule = {
					create: context => ({
						Program() {
							const sourceCode = context.sourceCode;

							sourceCode[methodName]();
						},
					}),
				};

				it(`should throw if ${methodName} is called from a valid test case`, () => {
					assert.throws(() => {
						ruleTester.run(
							"use-forbidden-method",
							useForbiddenMethodRule,
							{
								valid: [""],
								invalid: [],
							},
						);
					}, `\`SourceCode#${methodName}()\` cannot be called inside a rule.`);
				});

				it(`should throw if ${methodName} is called from an invalid test case`, () => {
					assert.throws(() => {
						ruleTester.run(
							"use-forbidden-method",
							useForbiddenMethodRule,
							{
								valid: [],
								invalid: [
									{
										code: "",
										errors: 1,
									},
								],
							},
						);
					}, `\`SourceCode#${methodName}()\` cannot be called inside a rule.`);
				});
			},
		);
	});

	describe("Subclassing", () => {
		it("should allow subclasses to set the describe/it/itOnly statics and should correctly use those values", () => {
			const assertionDescribe = assertEmitted(
				ruleTesterTestEmitter,
				"custom describe",
				"this-is-a-rule-name",
			);
			const assertionIt = assertEmitted(
				ruleTesterTestEmitter,
				"custom it",
				"valid(code);",
			);
			const assertionItOnly = assertEmitted(
				ruleTesterTestEmitter,
				"custom itOnly",
				"validOnly(code);",
			);

			/**
			 * Subclass for testing
			 */
			class RuleTesterSubclass extends RuleTester {}
			RuleTesterSubclass.describe = function (text, method) {
				ruleTesterTestEmitter.emit("custom describe", text, method);
				return method.call(this);
			};
			RuleTesterSubclass.it = function (text, method) {
				ruleTesterTestEmitter.emit("custom it", text, method);
				return method.call(this);
			};
			RuleTesterSubclass.itOnly = function (text, method) {
				ruleTesterTestEmitter.emit("custom itOnly", text, method);
				return method.call(this);
			};

			const ruleTesterSubclass = new RuleTesterSubclass();

			ruleTesterSubclass.run(
				"this-is-a-rule-name",
				require("../../fixtures/testers/rule-tester/no-var"),
				{
					valid: [
						"valid(code);",
						{
							code: "validOnly(code);",
							only: true,
						},
					],
					invalid: [],
				},
			);

			return Promise.all([
				assertionDescribe,
				assertionIt,
				assertionItOnly,
			]);
		});
	});

	describe("Optional Test Suites", () => {
		let originalRuleTesterDescribe;
		let spyRuleTesterDescribe;

		before(() => {
			originalRuleTesterDescribe = RuleTester.describe;
			spyRuleTesterDescribe = sinon.spy((title, callback) => callback());
			RuleTester.describe = spyRuleTesterDescribe;
		});
		after(() => {
			RuleTester.describe = originalRuleTesterDescribe;
		});
		beforeEach(() => {
			spyRuleTesterDescribe.resetHistory();
			ruleTester = new RuleTester();
		});

		it("should create a test suite with the rule name even if there are no test cases", () => {
			ruleTester.run(
				"no-var",
				require("../../fixtures/testers/rule-tester/no-var"),
				{
					valid: [],
					invalid: [],
				},
			);
			sinon.assert.calledWith(spyRuleTesterDescribe, "no-var");
		});

		it("should create a valid test suite if there is a valid test case", () => {
			ruleTester.run(
				"no-var",
				require("../../fixtures/testers/rule-tester/no-var"),
				{
					valid: ["value = 0;"],
					invalid: [],
				},
			);
			sinon.assert.calledWith(spyRuleTesterDescribe, "valid");
		});

		it("should not create a valid test suite if there are no valid test cases", () => {
			ruleTester.run(
				"no-var",
				require("../../fixtures/testers/rule-tester/no-var"),
				{
					valid: [],
					invalid: [
						{
							code: "var value = 0;",
							errors: [/^Bad var/u],
							output: " value = 0;",
						},
					],
				},
			);
			sinon.assert.neverCalledWith(spyRuleTesterDescribe, "valid");
		});

		it("should create an invalid test suite if there is an invalid test case", () => {
			ruleTester.run(
				"no-var",
				require("../../fixtures/testers/rule-tester/no-var"),
				{
					valid: [],
					invalid: [
						{
							code: "var value = 0;",
							errors: [/^Bad var/u],
							output: " value = 0;",
						},
					],
				},
			);
			sinon.assert.calledWith(spyRuleTesterDescribe, "invalid");
		});

		it("should not create an invalid test suite if there are no invalid test cases", () => {
			ruleTester.run(
				"no-var",
				require("../../fixtures/testers/rule-tester/no-var"),
				{
					valid: ["value = 0;"],
					invalid: [],
				},
			);
			sinon.assert.neverCalledWith(spyRuleTesterDescribe, "invalid");
		});
	});

	describe("AssertionOptions", () => {
		describe("requireMessage", () => {
			describe("unset", () => {
				const assertionOptions = {};
				it("should allow shorthand", () => {
					ruleTester.run(
						"no-eval",
						require("../../fixtures/testers/rule-tester/no-eval"),
						{
							assertionOptions,
							valid: [],
							invalid: [
								{
									code: "eval(foo)",
									errors: 1,
								},
							],
						},
					);
				});

				it("should pass if message array is used", () => {
					ruleTester.run(
						"no-eval",
						require("../../fixtures/testers/rule-tester/no-eval"),
						{
							assertionOptions,
							valid: [],
							invalid: [
								{
									code: "eval(foo)",
									errors: ["eval sucks."],
								},
							],
						},
					);
				});
			});

			describe("false", () => {
				const assertionOptions = { requireMessage: false };
				it("should allow shorthand", () => {
					ruleTester.run(
						"no-eval",
						require("../../fixtures/testers/rule-tester/no-eval"),
						{
							assertionOptions,
							valid: [],
							invalid: [
								{
									code: "eval(foo)",
									errors: 1,
								},
							],
						},
					);
				});

				it("should pass if message array is used", () => {
					ruleTester.run(
						"no-eval",
						require("../../fixtures/testers/rule-tester/no-eval"),
						{
							assertionOptions,
							valid: [],
							invalid: [
								{
									code: "eval(foo)",
									errors: ["eval sucks."],
								},
							],
						},
					);
				});
			});

			describe("true", () => {
				const assertionOptions = { requireMessage: true };
				it("should fail shorthand", () => {
					assert.throws(() => {
						ruleTester.run(
							"no-eval",
							require("../../fixtures/testers/rule-tester/no-eval"),
							{
								assertionOptions,
								valid: [],
								invalid: [
									{
										code: "eval(foo)",
										errors: 1,
									},
								],
							},
						);
					}, "Invalid cases must have 'errors' value as an array");
				});

				it("should pass if message array is used", () => {
					ruleTester.run(
						"no-eval",
						require("../../fixtures/testers/rule-tester/no-eval"),
						{
							assertionOptions,
							valid: [],
							invalid: [
								{
									code: "eval(foo)",
									errors: ["eval sucks."],
								},
							],
						},
					);
				});

				it("should fail if message is missing", () => {
					assert.throws(() => {
						ruleTester.run(
							"no-eval",
							require("../../fixtures/testers/rule-tester/no-eval"),
							{
								assertionOptions,
								valid: [],
								invalid: [
									{
										code: "eval(foo)",
										errors: [
											{
												line: 1,
											},
										],
									},
								],
							},
						);
					}, "errors[0] must specify either 'messageId' or 'message'.");
				});

				it("should pass if message is present", () => {
					ruleTester.run(
						"no-eval",
						require("../../fixtures/testers/rule-tester/no-eval"),
						{
							assertionOptions,
							valid: [],
							invalid: [
								{
									code: "eval(foo)",
									errors: [
										{
											message: "eval sucks.",
										},
									],
								},
							],
						},
					);
				});

				it("should pass if messageId is present", () => {
					ruleTester.run(
						"no-eval",
						require("../../fixtures/testers/rule-tester/no-eval"),
						{
							assertionOptions,
							valid: [],
							invalid: [
								{
									code: "eval(foo)",
									errors: [
										{
											messageId: "evalSucks",
										},
									],
								},
							],
						},
					);
				});
			});

			describe("message", () => {
				const assertionOptions = { requireMessage: "message" };
				it("should fail shorthand", () => {
					assert.throws(() => {
						ruleTester.run(
							"no-eval",
							require("../../fixtures/testers/rule-tester/no-eval"),
							{
								assertionOptions,
								valid: [],
								invalid: [
									{
										code: "eval(foo)",
										errors: 1,
									},
								],
							},
						);
					}, "Invalid cases must have 'errors' value as an array");
				});

				it("should pass if message array is used", () => {
					ruleTester.run(
						"no-eval",
						require("../../fixtures/testers/rule-tester/no-eval"),
						{
							assertionOptions,
							valid: [],
							invalid: [
								{
									code: "eval(foo)",
									errors: ["eval sucks."],
								},
							],
						},
					);
				});

				it("should fail if message is missing", () => {
					assert.throws(() => {
						ruleTester.run(
							"no-eval",
							require("../../fixtures/testers/rule-tester/no-eval"),
							{
								assertionOptions,
								valid: [],
								invalid: [
									{
										code: "eval(foo)",
										errors: [
											{
												line: 1,
											},
										],
									},
								],
							},
						);
					}, "errors[0] should specify 'message' (and not 'messageId') when 'assertionOptions.requireMessage' is 'message'.");
				});

				it("should pass if message is present", () => {
					ruleTester.run(
						"no-eval",
						require("../../fixtures/testers/rule-tester/no-eval"),
						{
							assertionOptions,
							valid: [],
							invalid: [
								{
									code: "eval(foo)",
									errors: [
										{
											message: "eval sucks.",
										},
									],
								},
							],
						},
					);
				});

				it("should fail if messageId is present", () => {
					assert.throws(() => {
						ruleTester.run(
							"no-eval",
							require("../../fixtures/testers/rule-tester/no-eval"),
							{
								assertionOptions,
								valid: [],
								invalid: [
									{
										code: "eval(foo)",
										errors: [
											{
												messageId: "evalSucks",
											},
										],
									},
								],
							},
						);
					}, "errors[0] should specify 'message' (and not 'messageId') when 'assertionOptions.requireMessage' is 'message'.");
				});

				it("should fail if message and messageId are present", () => {
					assert.throws(() => {
						ruleTester.run(
							"no-eval",
							require("../../fixtures/testers/rule-tester/no-eval"),
							{
								assertionOptions,
								valid: [],
								invalid: [
									{
										code: "eval(foo)",
										errors: [
											{
												message: "eval sucks.",
												messageId: "evalSucks",
											},
										],
									},
								],
							},
						);
					}, "errors[0] should specify 'message' (and not 'messageId') when 'assertionOptions.requireMessage' is 'message'.");
				});
			});

			describe("messageId", () => {
				const assertionOptions = { requireMessage: "messageId" };
				it("should fail shorthand", () => {
					assert.throws(() => {
						ruleTester.run(
							"no-eval",
							require("../../fixtures/testers/rule-tester/no-eval"),
							{
								assertionOptions,
								valid: [],
								invalid: [
									{
										code: "eval(foo)",
										errors: 1,
									},
								],
							},
						);
					}, "Invalid cases must have 'errors' value as an array");
				});

				it("should fail if message array is used", () => {
					assert.throws(() => {
						ruleTester.run(
							"no-eval",
							require("../../fixtures/testers/rule-tester/no-eval"),
							{
								assertionOptions,
								valid: [],
								invalid: [
									{
										code: "eval(foo)",
										errors: ["eval sucks."],
									},
								],
							},
						);
					}, "errors[0] should be an object when 'assertionOptions.requireMessage' is 'messageId' or 'assertionOptions.requireLocation' is true.");
				});

				it("should fail if message and messageId are missing", () => {
					assert.throws(() => {
						ruleTester.run(
							"no-eval",
							require("../../fixtures/testers/rule-tester/no-eval"),
							{
								assertionOptions,
								valid: [],
								invalid: [
									{
										code: "eval(foo)",
										errors: [
											{
												line: 1,
											},
										],
									},
								],
							},
						);
					}, "errors[0] should specify 'messageId' (and not 'message') when 'assertionOptions.requireMessage' is 'messageId'.");
				});

				it("should fail if message is present", () => {
					assert.throws(() => {
						ruleTester.run(
							"no-eval",
							require("../../fixtures/testers/rule-tester/no-eval"),
							{
								assertionOptions,
								valid: [],
								invalid: [
									{
										code: "eval(foo)",
										errors: [
											{
												message: "eval sucks.",
											},
										],
									},
								],
							},
						);
					}, "errors[0] should specify 'messageId' (and not 'message') when 'assertionOptions.requireMessage' is 'messageId'.");
				});

				it("should pass if messageId is present", () => {
					ruleTester.run(
						"no-eval",
						require("../../fixtures/testers/rule-tester/no-eval"),
						{
							assertionOptions,
							valid: [],
							invalid: [
								{
									code: "eval(foo)",
									errors: [
										{
											messageId: "evalSucks",
										},
									],
								},
							],
						},
					);
				});

				it("should fail if message and messageId are present", () => {
					assert.throws(() => {
						ruleTester.run(
							"no-eval",
							require("../../fixtures/testers/rule-tester/no-eval"),
							{
								assertionOptions,
								valid: [],
								invalid: [
									{
										code: "eval(foo)",
										errors: [
											{
												message: "eval sucks.",
												messageId: "evalSucks",
											},
										],
									},
								],
							},
						);
					}, "errors[0] should specify 'messageId' (and not 'message') when 'assertionOptions.requireMessage' is 'messageId'.");
				});
			});
		});

		describe("requireLocation", () => {
			describe("unset", () => {
				it("should allow shorthand", () => {
					ruleTester.run(
						"no-eval",
						require("../../fixtures/testers/rule-tester/no-eval"),
						{
							assertionOptions: {},
							valid: [],
							invalid: [
								{
									code: "eval(foo)",
									errors: 1,
								},
							],
						},
					);
				});
			});

			describe("false", () => {
				it("should allow shorthand", () => {
					ruleTester.run(
						"no-eval",
						require("../../fixtures/testers/rule-tester/no-eval"),
						{
							assertionOptions: { requireLocation: false },
							valid: [],
							invalid: [
								{
									code: "eval(foo)",
									errors: 1,
								},
							],
						},
					);
				});
			});

			describe("true", () => {
				const assertionOptions = { requireLocation: true };
				it("should fail shorthand", () => {
					assert.throws(() => {
						ruleTester.run(
							"no-eval",
							require("../../fixtures/testers/rule-tester/no-eval"),
							{
								assertionOptions,
								valid: [],
								invalid: [
									{
										code: "eval(foo)",
										errors: 1,
									},
								],
							},
						);
					}, "Invalid cases must have 'errors' value as an array");
				});

				it("should fail if message array is used", () => {
					assert.throws(() => {
						ruleTester.run(
							"no-eval",
							require("../../fixtures/testers/rule-tester/no-eval"),
							{
								assertionOptions,
								valid: [],
								invalid: [
									{
										code: "eval(foo)",
										errors: ["eval sucks."],
									},
								],
							},
						);
					}, "errors[0] should be an object when 'assertionOptions.requireMessage' is 'messageId' or 'assertionOptions.requireLocation' is true.");
				});

				it("should fail if all location properties are missing", () => {
					assert.throws(() => {
						ruleTester.run(
							"no-eval",
							require("../../fixtures/testers/rule-tester/no-eval"),
							{
								assertionOptions,
								valid: [],
								invalid: [
									{
										code: "eval(foo)",
										errors: [
											{
												message: "eval sucks.",
											},
										],
									},
								],
							},
						);
					}, "Error is missing expected location properties: line, column, endLine, endColumn");
				});

				it("should fail if line is missing", () => {
					assert.throws(() => {
						ruleTester.run(
							"no-eval",
							require("../../fixtures/testers/rule-tester/no-eval"),
							{
								assertionOptions,
								valid: [],
								invalid: [
									{
										code: "eval(foo)",
										errors: [
											{
												message: "eval sucks.",
												column: 1,
												endLine: 1,
												endColumn: 10,
											},
										],
									},
								],
							},
						);
					}, "Error is missing expected location properties: line");
				});

				it("should fail if column is missing", () => {
					assert.throws(() => {
						ruleTester.run(
							"no-eval",
							require("../../fixtures/testers/rule-tester/no-eval"),
							{
								assertionOptions,
								valid: [],
								invalid: [
									{
										code: "eval(foo)",
										errors: [
											{
												message: "eval sucks.",
												line: 1,
												endLine: 1,
												endColumn: 10,
											},
										],
									},
								],
							},
						);
					}, "Error is missing expected location properties: column");
				});

				it("should fail if endLine is missing", () => {
					assert.throws(() => {
						ruleTester.run(
							"no-eval",
							require("../../fixtures/testers/rule-tester/no-eval"),
							{
								assertionOptions,
								valid: [],
								invalid: [
									{
										code: "eval(foo)",
										errors: [
											{
												message: "eval sucks.",
												line: 1,
												column: 1,
												endColumn: 10,
											},
										],
									},
								],
							},
						);
					}, "Error is missing expected location properties: endLine");
				});

				it("should fail if endColumn is missing", () => {
					assert.throws(() => {
						ruleTester.run(
							"no-eval",
							require("../../fixtures/testers/rule-tester/no-eval"),
							{
								assertionOptions,
								valid: [],
								invalid: [
									{
										code: "eval(foo)",
										errors: [
											{
												message: "eval sucks.",
												line: 1,
												column: 1,
												endLine: 1,
											},
										],
									},
								],
							},
						);
					}, "Error is missing expected location properties: endColumn");
				});

				it("should pass if all location properties are present", () => {
					ruleTester.run(
						"no-eval",
						require("../../fixtures/testers/rule-tester/no-eval"),
						{
							assertionOptions,
							valid: [],
							invalid: [
								{
									code: "eval(foo)",
									errors: [
										{
											message: "eval sucks.",
											line: 1,
											column: 1,
											endLine: 1,
											endColumn: 10,
										},
									],
								},
							],
						},
					);
				});

				it("should throw if location properties are wrong", () => {
					assert.throws(() => {
						ruleTester.run(
							"no-eval",
							require("../../fixtures/testers/rule-tester/no-eval"),
							{
								assertionOptions,
								valid: [],
								invalid: [
									{
										code: "eval(foo)",
										errors: [
											{
												message: "eval sucks.",
												line: 99,
												column: 99,
												endLine: 99,
												endColumn: 99,
											},
										],
									},
								],
							},
						);
					}, "Actual error location does not match expected error location.");
				});

				it("should pass if all but end location properties are present and rule does not provide end location", () => {
					ruleTester.run(
						"no-eval",
						require("../../fixtures/testers/rule-tester/no-end-location"),
						{
							assertionOptions,
							valid: [],
							invalid: [
								{
									code: "eval(foo)",
									errors: [
										{
											message: "eval sucks.",
											line: 1,
											column: 1,
										},
									],
								},
							],
						},
					);
				});

				it("should throw if location properties are wrong but rule does not provide end location", () => {
					assert.throws(() => {
						ruleTester.run(
							"no-eval",
							require("../../fixtures/testers/rule-tester/no-end-location"),
							{
								assertionOptions,
								valid: [],
								invalid: [
									{
										code: "eval(foo)",
										errors: [
											{
												message: "eval sucks.",
												line: 99,
												column: 99,
											},
										],
									},
								],
							},
						);
					}, "Actual error location does not match expected error location.");
				});

				it("should throw if all location properties are present but rule does not provide end location", () => {
					assert.throws(() => {
						ruleTester.run(
							"no-eval",
							require("../../fixtures/testers/rule-tester/no-end-location"),
							{
								assertionOptions,
								valid: [],
								invalid: [
									{
										code: "eval(foo)",
										errors: [
											{
												message: "eval sucks.",
												line: 1,
												column: 1,
												endLine: 99,
												endColumn: 99,
											},
										],
									},
								],
							},
						);
					}, "Actual error location does not match expected error location.");
				});
			});
		});

		describe("requireData", () => {
			describe("unset", () => {
				const assertionOptions = {};

				it("should allow not setting data for errors", () => {
					ruleTester.run(
						"message-id",
						require("../../fixtures/testers/rule-tester/messageId.js")
							.withMetaWithData,
						{
							assertionOptions,
							valid: [],
							invalid: [
								{
									code: "foo",
									errors: [{ messageId: "avoidFoo" }],
								},
							],
						},
					);
				});

				it("should allow not setting data for suggestions", () => {
					ruleTester.run(
						"message-id",
						require("../../fixtures/testers/rule-tester/suggestions.js")
							.withMessageIds,
						{
							assertionOptions,
							valid: [],
							invalid: [
								{
									code: "foo",
									errors: [
										{
											messageId: "avoidFoo",
											suggestions: [
												{
													messageId: "renameFoo",
													output: "bar",
												},
												{
													messageId: "renameFoo",
													output: "baz",
												},
											],
										},
									],
								},
							],
						},
					);
				});
			});

			describe("false", () => {
				const assertionOptions = { requireData: false };

				it("should allow not setting data for errors", () => {
					ruleTester.run(
						"message-id",
						require("../../fixtures/testers/rule-tester/messageId.js")
							.withMetaWithData,
						{
							assertionOptions,
							valid: [],
							invalid: [
								{
									code: "foo",
									errors: [{ messageId: "avoidFoo" }],
								},
							],
						},
					);
				});

				it("should allow not setting data for suggestions", () => {
					ruleTester.run(
						"message-id",
						require("../../fixtures/testers/rule-tester/suggestions.js")
							.withMessageIds,
						{
							assertionOptions,
							valid: [],
							invalid: [
								{
									code: "foo",
									errors: [
										{
											messageId: "avoidFoo",
											suggestions: [
												{
													messageId: "renameFoo",
													output: "bar",
												},
												{
													messageId: "renameFoo",
													output: "baz",
												},
											],
										},
									],
								},
							],
						},
					);
				});
			});

			describe("true", () => {
				const assertionOptions = { requireData: true };

				it("should allow error shorthand", () => {
					ruleTester.run(
						"message-id",
						require("../../fixtures/testers/rule-tester/messageId.js")
							.withMetaWithData,
						{
							assertionOptions,
							valid: [],
							invalid: [
								{
									code: "foo",
									errors: 1,
								},
							],
						},
					);
				});

				it("should pass if message array is used", () => {
					ruleTester.run(
						"message-id",
						require("../../fixtures/testers/rule-tester/messageId.js")
							.withMetaWithData,
						{
							assertionOptions,
							valid: [],
							invalid: [
								{
									code: "foo",
									errors: [
										"Avoid using variables named 'foo'.",
									],
								},
							],
						},
					);
				});

				it("should allow specifying messages for errors", () => {
					ruleTester.run(
						"message-id",
						require("../../fixtures/testers/rule-tester/messageId.js")
							.withMetaWithData,
						{
							assertionOptions,
							valid: [],
							invalid: [
								{
									code: "foo",
									errors: [
										{
											message:
												"Avoid using variables named 'foo'.",
										},
									],
								},
							],
						},
					);
				});

				it("should allow not specifying data for referenced error messages without placeholders", () => {
					ruleTester.run(
						"message-id",
						require("../../fixtures/testers/rule-tester/no-eval.js"),
						{
							assertionOptions,
							valid: [],
							invalid: [
								{
									code: "eval(foo)",
									errors: [{ messageId: "evalSucks" }],
								},
							],
						},
					);
				});

				it("should allow specifying data when there are message placeholders", () => {
					ruleTester.run(
						"message-id",
						require("../../fixtures/testers/rule-tester/messageId.js")
							.withMetaWithData,
						{
							assertionOptions,
							valid: [],
							invalid: [
								{
									code: "foo",
									errors: [
										{
											messageId: "avoidFoo",
											data: { name: "foo" },
										},
									],
								},
							],
						},
					);
				});

				it("should disallow not specifying data when there are message placeholders for errors", () => {
					assert.throws(() => {
						ruleTester.run(
							"message-id",
							require("../../fixtures/testers/rule-tester/messageId.js")
								.withMetaWithData,
							{
								assertionOptions,
								valid: [],
								invalid: [
									{
										code: "foo",
										errors: [{ messageId: "avoidFoo" }],
									},
								],
							},
						);
					}, "Error should specify the 'data' property as the referenced message has placeholders.");
				});

				it("should allow suggestion shorthand", () => {
					ruleTester.run(
						"message-id",
						require("../../fixtures/testers/rule-tester/suggestions.js")
							.withMessageIds,
						{
							assertionOptions,
							valid: [],
							invalid: [
								{
									code: "foo",
									errors: [
										{
											messageId: "avoidFoo",
											data: { name: "foo" },
											suggestions: 2,
										},
									],
								},
							],
						},
					);
				});

				it("should allow specifying desc for suggestions", () => {
					ruleTester.run(
						"message-id",
						require("../../fixtures/testers/rule-tester/suggestions.js")
							.withMessageIds,
						{
							assertionOptions,
							valid: [],
							invalid: [
								{
									code: "foo",
									errors: [
										{
											message:
												"Avoid using identifiers named 'foo'.",
											suggestions: [
												{
													desc: "Rename identifier 'foo' to 'bar'",
													output: "bar",
												},
												{
													desc: "Rename identifier 'foo' to 'baz'",
													output: "baz",
												},
											],
										},
									],
								},
							],
						},
					);
				});

				it("should allow not specifying data for referenced suggestion messages without placeholders", () => {
					ruleTester.run(
						"message-id",
						require("../../fixtures/testers/rule-tester/suggestions.js")
							.withMessageIdsWithoutPlaceholders,
						{
							assertionOptions,
							valid: [],
							invalid: [
								{
									code: "foo",
									errors: [
										{
											message:
												"Avoid using identifiers named 'foo'.",
											suggestions: [
												{
													messageId: "rename",
													output: "bar",
												},
											],
										},
									],
								},
							],
						},
					);
				});

				it("should allow specifying data when there are message placeholders for suggestions", () => {
					ruleTester.run(
						"message-id",
						require("../../fixtures/testers/rule-tester/suggestions.js")
							.withMessageIds,
						{
							assertionOptions,
							valid: [],
							invalid: [
								{
									code: "foo",
									errors: [
										{
											messageId: "avoidFoo",
											data: { name: "foo" },
											suggestions: [
												{
													messageId: "renameFoo",
													data: { newName: "bar" },
													output: "bar",
												},
												{
													messageId: "renameFoo",
													data: { newName: "baz" },
													output: "baz",
												},
											],
										},
									],
								},
							],
						},
					);
				});

				it("should disallow not specifying data when there are message placeholders for suggestions", () => {
					assert.throws(() => {
						ruleTester.run(
							"message-id",
							require("../../fixtures/testers/rule-tester/suggestions.js")
								.withMessageIds,
							{
								assertionOptions,
								valid: [],
								invalid: [
									{
										code: "foo",
										errors: [
											{
												messageId: "avoidFoo",
												data: { name: "foo" },
												suggestions: [
													{
														messageId: "renameFoo",
														data: {
															newName: "bar",
														},
														output: "bar",
													},
													{
														messageId: "renameFoo",
														output: "baz",
													},
												],
											},
										],
									},
								],
							},
						);
					}, "Suggestion at index 1: Suggestion should specify the 'data' property as the referenced message has placeholders.");
				});
			});

			describe("error", () => {
				const assertionOptions = { requireData: "error" };

				it("should disallow not specifying data when there are message placeholders for errors", () => {
					assert.throws(() => {
						ruleTester.run(
							"message-id",
							require("../../fixtures/testers/rule-tester/messageId.js")
								.withMetaWithData,
							{
								assertionOptions,
								valid: [],
								invalid: [
									{
										code: "foo",
										errors: [{ messageId: "avoidFoo" }],
									},
								],
							},
						);
					}, "Error should specify the 'data' property as the referenced message has placeholders.");
				});

				it("should allow not specifying data when there are message placeholders for suggestions", () => {
					ruleTester.run(
						"message-id",
						require("../../fixtures/testers/rule-tester/suggestions.js")
							.withMessageIds,
						{
							assertionOptions,
							valid: [],
							invalid: [
								{
									code: "foo",
									errors: [
										{
											messageId: "avoidFoo",
											data: { name: "foo" },
											suggestions: [
												{
													messageId: "renameFoo",
													data: { newName: "bar" },
													output: "bar",
												},
												{
													messageId: "renameFoo",
													output: "baz",
												},
											],
										},
									],
								},
							],
						},
					);
				});
			});

			describe("suggestion", () => {
				const assertionOptions = { requireData: "suggestion" };

				it("should allow not specifying data when there are message placeholders for errors", () => {
					ruleTester.run(
						"message-id",
						require("../../fixtures/testers/rule-tester/messageId.js")
							.withMetaWithData,
						{
							assertionOptions,
							valid: [],
							invalid: [
								{
									code: "foo",
									errors: [{ messageId: "avoidFoo" }],
								},
							],
						},
					);
				});

				it("should disallow not specifying data when there are message placeholders for suggestions", () => {
					assert.throws(() => {
						ruleTester.run(
							"message-id",
							require("../../fixtures/testers/rule-tester/suggestions.js")
								.withMessageIds,
							{
								assertionOptions,
								valid: [],
								invalid: [
									{
										code: "foo",
										errors: [
											{
												messageId: "avoidFoo",
												data: { name: "foo" },
												suggestions: [
													{
														messageId: "renameFoo",
														output: "bar",
													},
													{
														messageId: "renameFoo",
														data: {
															newName: "baz",
														},
														output: "baz",
													},
												],
											},
										],
									},
								],
							},
						);
					}, "Suggestion at index 0: Suggestion should specify the 'data' property as the referenced message has placeholders.");
				});
			});
		});
	});

	// Attach error locations to stacktrace
	describe("error locations", () => {
		/**
		 * Normalizes stack trace for comparison
		 * @param {Error} error The error to normalize the stacktrace of.
		 * @returns {string}The normalized stacktrace string.
		 */
		function normalizeStack(error) {
			return error.stack
				.replace(/\\/gu, "/")
				.replace(/\(.*\/tests\//gu, "(tests/") // absolute to relative paths
				.replace(/:\d+(:\d+)?/gu, ":<lines>"); // ignore line/column numbers
		}

		it("should report the correct location for errors in valid test cases", () => {
			try {
				ruleTester.run(
					"no-eval",
					require("../../fixtures/testers/rule-tester/no-eval"),
					{
						valid: ["eval(foo)"],
						invalid: [],
					},
				);
				assert.fail("Expected an error to be thrown");
			} catch (error) {
				const normalizedStack = normalizeStack(error);
				assert.include(normalizedStack, "at RuleTester.run.valid[0]");
				assert.include(normalizedStack, "at RuleTester.run.valid\n");
				assert.include(
					normalizedStack,
					"at RuleTester.run (tests/lib/rule-tester/rule-tester.js:<lines>)",
				);
			}
		});

		it("should report the correct location for errors in invalid test cases", () => {
			try {
				ruleTester.run(
					"no-eval",
					require("../../fixtures/testers/rule-tester/no-eval"),
					{
						valid: [],
						invalid: [
							{
								code: "eval(foo);\neval(bar);",
								errors: [
									{
										message: "eval sucks.",
									},
									{
										message: "This is bad.",
									},
								],
							},
						],
					},
				);
				assert.fail("Expected an error to be thrown");
			} catch (error) {
				const normalizedStack = normalizeStack(error);
				assert.include(
					normalizedStack,
					"at RuleTester.run.invalid[0].error[1]",
				);
				assert.include(normalizedStack, "at RuleTester.run.invalid[0]");
				assert.include(normalizedStack, "at RuleTester.run.invalid\n");
				assert.include(
					normalizedStack,
					"at RuleTester.run (tests/lib/rule-tester/rule-tester.js:<lines>)",
				);
			}
		});

		it("should report the correct location for errors in invalid test cases when a suggestion assertion fails", () => {
			try {
				ruleTester.run(
					"suggestions-basic",
					require("../../fixtures/testers/rule-tester/suggestions")
						.basic,
					{
						valid: ["var boo;"],
						invalid: [
							{
								code: "var foo;",
								errors: [
									{
										message:
											"Avoid using identifiers named 'foo'.",
										suggestions: [
											{
												desc: "Rename identifier 'foo' to 'bar'",
												output: "var baz;", // wrong output
											},
										],
									},
								],
							},
						],
					},
				);
				assert.fail("Expected an error to be thrown");
			} catch (error) {
				const normalizedStack = normalizeStack(error);

				// The error message should not be modified although it contains "at"
				assert.include(
					normalizedStack,
					"Expected the applied suggestion fix to match the test suggestion output for suggestion at index: 0",
				);

				assert.include(
					normalizedStack,
					"at RuleTester.run.invalid[0].error[0]",
				);
				assert.include(normalizedStack, "at RuleTester.run.invalid[0]");
				assert.include(normalizedStack, "at RuleTester.run.invalid\n");
				assert.include(
					normalizedStack,
					"at RuleTester.run (tests/lib/rule-tester/rule-tester.js:<lines>)",
				);
			}
		});
	});
});
