/**
 * @fileoverview Tests for stylish formatter.
 * @author Sindre Sorhus
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("chai").assert,
	util = require("node:util"),
	sinon = require("sinon"),
	formatter = require("../../../../lib/cli-engine/formatters/stylish");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

// eslint-disable-next-line no-control-regex -- Needed to match ANSI escape code.
const ansiEscapePattern = /\u001b\[/u;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("formatter:stylish", () => {
	beforeEach(() => {
		sinon.spy(util, "styleText");
	});

	afterEach(() => {
		sinon.verifyAndRestore();
	});

	describe("when passed `FORCE_COLOR` environment variable", () => {
		/*
		 * Note for `FORCE_COLOR`:
		 * - 2 colors: `FORCE_COLOR = 0` (Disables colors)
		 * - 16 colors: `FORCE_COLOR = 1`
		 * - 256 colors: `FORCE_COLOR = 2`
		 * - 16,777,216 colors: `FORCE_COLOR = 3`
		 */

		const code = [
			{
				filePath: "foo.js",
				errorCount: 1,
				warningCount: 0,
				fixableErrorCount: 0,
				fixableWarningCount: 0,
				messages: [
					{
						message: "Unexpected foo.",
						severity: 2,
						line: 5,
						column: 10,
						ruleId: "foo",
					},
				],
			},
		];

		afterEach(() => {
			delete process.env.FORCE_COLOR;
		});

		it("`FORCE_COLOR=0` should disable colors", () => {
			process.env.FORCE_COLOR = 0;

			const result = formatter(code);

			assert.notMatch(result, ansiEscapePattern);
			assert.strictEqual(result, util.stripVTControlCharacters(result));
		});

		it("`FORCE_COLOR=1` should enable colors", () => {
			process.env.FORCE_COLOR = 1;

			const result = formatter(code);

			assert.match(result, ansiEscapePattern);
			assert.notStrictEqual(
				result,
				util.stripVTControlCharacters(result),
			);
		});

		it("`FORCE_COLOR=2` should enable colors", () => {
			process.env.FORCE_COLOR = 2;

			const result = formatter(code);

			assert.match(result, ansiEscapePattern);
			assert.notStrictEqual(
				result,
				util.stripVTControlCharacters(result),
			);
		});

		it("`FORCE_COLOR=3` should enable colors", () => {
			process.env.FORCE_COLOR = 3;

			const result = formatter(code);

			assert.match(result, ansiEscapePattern);
			assert.notStrictEqual(
				result,
				util.stripVTControlCharacters(result),
			);
		});
	});

	describe("when passed `color` option", () => {
		const code = [
			{
				filePath: "foo.js",
				errorCount: 1,
				warningCount: 0,
				fixableErrorCount: 0,
				fixableWarningCount: 0,
				messages: [
					{
						message: "Unexpected foo.",
						severity: 2,
						line: 5,
						column: 10,
						ruleId: "foo",
					},
				],
			},
		];

		it("default without environment variable should enable colors", () => {
			const result = formatter(code);

			assert.match(result, ansiEscapePattern);
			assert.notStrictEqual(
				result,
				util.stripVTControlCharacters(result),
			);
		});

		it("default with environment variable should disable colors", () => {
			process.env.FORCE_COLOR = 0;

			const result = formatter(code);

			assert.notMatch(result, ansiEscapePattern);
			assert.strictEqual(result, util.stripVTControlCharacters(result));

			delete process.env.FORCE_COLOR;
		});

		it("`color: false` should disable colors", () => {
			const result = formatter(code, { color: false });

			assert.notMatch(result, ansiEscapePattern);
			assert.strictEqual(result, util.stripVTControlCharacters(result));
		});

		it("`color: false` should ignore environment variable", () => {
			process.env.FORCE_COLOR = 1;

			const result = formatter(code, { color: false });

			assert.notMatch(result, ansiEscapePattern);
			assert.strictEqual(result, util.stripVTControlCharacters(result));

			delete process.env.FORCE_COLOR;
		});

		it("`color: true` should enable colors", () => {
			const result = formatter(code, { color: true });

			assert.match(result, ansiEscapePattern);
			assert.notStrictEqual(
				result,
				util.stripVTControlCharacters(result),
			);
		});

		it("`color: true` should ignore environment variable", () => {
			process.env.FORCE_COLOR = 0;

			const result = formatter(code, { color: true });

			assert.match(result, ansiEscapePattern);
			assert.notStrictEqual(
				result,
				util.stripVTControlCharacters(result),
			);

			delete process.env.FORCE_COLOR;
		});
	});

	describe("when passed no messages", () => {
		const code = [
			{
				filePath: "foo.js",
				messages: [],
				errorCount: 0,
				warningCount: 0,
			},
		];

		it("should not return message", () => {
			const result = util.stripVTControlCharacters(formatter(code));

			assert.strictEqual(result, "");
			assert.strictEqual(util.styleText.callCount, 0);
		});
	});

	describe("when passed a single error message", () => {
		const code = [
			{
				filePath: "foo.js",
				errorCount: 1,
				warningCount: 0,
				fixableErrorCount: 0,
				fixableWarningCount: 0,
				messages: [
					{
						message: "Unexpected foo.",
						severity: 2,
						line: 5,
						column: 10,
						ruleId: "foo",
					},
				],
			},
		];

		it("should return a string in the correct format", () => {
			const result = util.stripVTControlCharacters(formatter(code));
			const summary = "\u2716 1 problem (1 error, 0 warnings)";

			assert.strictEqual(
				result,
				"\nfoo.js\n  5:10  error  Unexpected foo  foo\n\n\u2716 1 problem (1 error, 0 warnings)\n",
			);
			assert(util.styleText.calledWith("reset"));
			assert(util.styleText.neverCalledWithMatch("yellow", summary));
			assert(util.styleText.calledWith("bold", summary));
			assert(util.styleText.calledWithMatch("red", summary));
		});

		describe("when the error is fixable", () => {
			beforeEach(() => {
				code[0].fixableErrorCount = 1;
			});

			it("should return a string in the correct format", () => {
				const result = util.stripVTControlCharacters(formatter(code));
				const summary = "\u2716 1 problem (1 error, 0 warnings)";

				assert.strictEqual(
					result,
					"\nfoo.js\n  5:10  error  Unexpected foo  foo\n\n\u2716 1 problem (1 error, 0 warnings)\n  1 error and 0 warnings potentially fixable with the `--fix` option.\n",
				);
				assert(util.styleText.calledWith("reset"));
				assert(util.styleText.neverCalledWithMatch("yellow", summary));
				assert(util.styleText.calledWith("bold", summary));
				assert(util.styleText.calledWithMatch("red", summary));
			});
		});
	});

	describe("when passed a single warning message", () => {
		const code = [
			{
				filePath: "foo.js",
				errorCount: 0,
				warningCount: 1,
				fixableErrorCount: 0,
				fixableWarningCount: 0,
				messages: [
					{
						message: "Unexpected foo.",
						severity: 1,
						line: 5,
						column: 10,
						ruleId: "foo",
					},
				],
			},
		];

		it("should return a string in the correct format", () => {
			const result = util.stripVTControlCharacters(formatter(code));
			const summary = "\u2716 1 problem (0 errors, 1 warning)";

			assert.strictEqual(
				result,
				"\nfoo.js\n  5:10  warning  Unexpected foo  foo\n\n\u2716 1 problem (0 errors, 1 warning)\n",
			);
			assert(util.styleText.calledWith("reset"));
			assert(util.styleText.calledWith("bold", summary));
			assert(util.styleText.calledWithMatch("yellow", summary));
			assert(util.styleText.neverCalledWithMatch("red", summary));
		});

		describe("when the error is fixable", () => {
			beforeEach(() => {
				code[0].fixableWarningCount = 1;
			});

			it("should return a string in the correct format", () => {
				const result = util.stripVTControlCharacters(formatter(code));
				const summary = "\u2716 1 problem (0 errors, 1 warning)";

				assert.strictEqual(
					result,
					"\nfoo.js\n  5:10  warning  Unexpected foo  foo\n\n\u2716 1 problem (0 errors, 1 warning)\n  0 errors and 1 warning potentially fixable with the `--fix` option.\n",
				);
				assert(util.styleText.calledWith("reset"));
				assert(util.styleText.calledWith("bold", summary));
				assert(util.styleText.calledWithMatch("yellow", summary));
				assert(util.styleText.neverCalledWithMatch("red", summary));
			});
		});
	});

	describe("when passed a message that ends with ' .'", () => {
		const code = [
			{
				filePath: "foo.js",
				errorCount: 0,
				warningCount: 1,
				fixableErrorCount: 0,
				fixableWarningCount: 0,
				messages: [
					{
						message: "Unexpected .",
						severity: 1,
						line: 5,
						column: 10,
						ruleId: "foo",
					},
				],
			},
		];

		it("should return a string in the correct format (retaining the ' .')", () => {
			const result = util.stripVTControlCharacters(formatter(code));
			const summary = "\u2716 1 problem (0 errors, 1 warning)";

			assert.strictEqual(
				result,
				"\nfoo.js\n  5:10  warning  Unexpected .  foo\n\n\u2716 1 problem (0 errors, 1 warning)\n",
			);
			assert(util.styleText.calledWith("reset"));
			assert(util.styleText.calledWith("bold", summary));
			assert(util.styleText.calledWithMatch("yellow", summary));
			assert(util.styleText.neverCalledWithMatch("red", summary));
		});
	});

	describe("when passed a fatal error message", () => {
		const code = [
			{
				filePath: "foo.js",
				errorCount: 1,
				warningCount: 0,
				messages: [
					{
						fatal: true,
						message: "Unexpected foo.",
						line: 5,
						column: 10,
						ruleId: "foo",
					},
				],
			},
		];

		it("should return a string in the correct format", () => {
			const result = util.stripVTControlCharacters(formatter(code));
			const summary = "\u2716 1 problem (1 error, 0 warnings)";

			assert.strictEqual(
				result,
				"\nfoo.js\n  5:10  error  Unexpected foo  foo\n\n\u2716 1 problem (1 error, 0 warnings)\n",
			);
			assert(util.styleText.calledWith("reset"));
			assert(util.styleText.neverCalledWithMatch("yellow", summary));
			assert(util.styleText.calledWith("bold", summary));
			assert(util.styleText.calledWithMatch("red", summary));
		});
	});

	describe("when passed multiple messages", () => {
		const code = [
			{
				filePath: "foo.js",
				errorCount: 1,
				warningCount: 1,
				messages: [
					{
						message: "Unexpected foo.",
						severity: 2,
						line: 5,
						column: 10,
						ruleId: "foo",
					},
					{
						message: "Unexpected bar.",
						severity: 1,
						line: 6,
						column: 11,
						ruleId: "bar",
					},
				],
			},
		];

		it("should return a string with multiple entries", () => {
			const result = util.stripVTControlCharacters(formatter(code));
			const summary = "\u2716 2 problems (1 error, 1 warning)";

			assert.strictEqual(
				result,
				"\nfoo.js\n  5:10  error    Unexpected foo  foo\n  6:11  warning  Unexpected bar  bar\n\n\u2716 2 problems (1 error, 1 warning)\n",
			);
			assert(util.styleText.calledWith("reset"));
			assert(util.styleText.neverCalledWithMatch("yellow", summary));
			assert(util.styleText.calledWith("bold", summary));
			assert(util.styleText.calledWithMatch("red", summary));
		});
	});

	describe("when passed multiple files with 1 message each", () => {
		const code = [
			{
				filePath: "foo.js",
				errorCount: 1,
				warningCount: 0,
				messages: [
					{
						message: "Unexpected foo.",
						severity: 2,
						line: 5,
						column: 10,
						ruleId: "foo",
					},
				],
			},
			{
				errorCount: 0,
				warningCount: 1,
				filePath: "bar.js",
				messages: [
					{
						message: "Unexpected bar.",
						severity: 1,
						line: 6,
						column: 11,
						ruleId: "bar",
					},
				],
			},
		];

		it("should return a string with multiple entries", () => {
			const result = util.stripVTControlCharacters(formatter(code));
			const summary = "\u2716 2 problems (1 error, 1 warning)";

			assert.strictEqual(
				result,
				"\nfoo.js\n  5:10  error  Unexpected foo  foo\n\nbar.js\n  6:11  warning  Unexpected bar  bar\n\n\u2716 2 problems (1 error, 1 warning)\n",
			);
			assert(util.styleText.calledWith("reset"));
			assert(util.styleText.neverCalledWithMatch("yellow", summary));
			assert(util.styleText.calledWith("bold", summary));
			assert(util.styleText.calledWithMatch("red", summary));
		});

		it("should add errorCount", () => {
			code.forEach(c => {
				c.errorCount = 1;
				c.warningCount = 0;
			});

			const result = util.stripVTControlCharacters(formatter(code));
			const summary = "\u2716 2 problems (2 errors, 0 warnings)";

			assert.strictEqual(
				result,
				"\nfoo.js\n  5:10  error  Unexpected foo  foo\n\nbar.js\n  6:11  warning  Unexpected bar  bar\n\n\u2716 2 problems (2 errors, 0 warnings)\n",
			);
			assert(util.styleText.calledWith("reset"));
			assert(util.styleText.neverCalledWithMatch("yellow", summary));
			assert(util.styleText.calledWith("bold", summary));
			assert(util.styleText.calledWithMatch("red", summary));
		});

		it("should add warningCount", () => {
			code.forEach(c => {
				c.errorCount = 0;
				c.warningCount = 1;
			});

			const result = util.stripVTControlCharacters(formatter(code));
			const summary = "\u2716 2 problems (0 errors, 2 warnings)";

			assert.strictEqual(
				result,
				"\nfoo.js\n  5:10  error  Unexpected foo  foo\n\nbar.js\n  6:11  warning  Unexpected bar  bar\n\n\u2716 2 problems (0 errors, 2 warnings)\n",
			);
			assert(util.styleText.calledWith("reset"));
			assert(util.styleText.neverCalledWithMatch("yellow", summary));
			assert(util.styleText.calledWith("bold", summary));
			assert(util.styleText.calledWithMatch("red", summary));
		});
	});

	describe("when passed one file not found message", () => {
		const code = [
			{
				filePath: "foo.js",
				errorCount: 1,
				warningCount: 0,
				messages: [
					{
						fatal: true,
						message: "Couldn't find foo.js.",
					},
				],
			},
		];

		it("should return a string without line and column", () => {
			const result = util.stripVTControlCharacters(formatter(code));
			const summary = "\u2716 1 problem (1 error, 0 warnings)";

			assert.strictEqual(
				result,
				"\nfoo.js\n  0:0  error  Couldn't find foo.js\n\n\u2716 1 problem (1 error, 0 warnings)\n",
			);
			assert(util.styleText.calledWith("reset"));
			assert(util.styleText.neverCalledWithMatch("yellow", summary));
			assert(util.styleText.calledWith("bold", summary));
			assert(util.styleText.calledWithMatch("red", summary));
		});
	});

	describe("fixable problems", () => {
		it("should not output fixable problems message when no errors or warnings are fixable", () => {
			const code = [
				{
					filePath: "foo.js",
					errorCount: 1,
					warningCount: 0,
					fixableErrorCount: 0,
					fixableWarningCount: 0,
					messages: [
						{
							message: "Unexpected foo.",
							severity: 2,
							line: 5,
							column: 10,
							ruleId: "foo",
						},
					],
				},
			];

			const result = util.stripVTControlCharacters(formatter(code));

			assert.notInclude(result, "potentially fixable");
		});

		it("should output the fixable problems message when errors are fixable", () => {
			const code = [
				{
					filePath: "foo.js",
					errorCount: 1,
					warningCount: 0,
					fixableErrorCount: 1,
					fixableWarningCount: 0,
					messages: [
						{
							message: "Unexpected foo.",
							severity: 2,
							line: 5,
							column: 10,
							ruleId: "foo",
						},
					],
				},
			];

			const result = util.stripVTControlCharacters(formatter(code));

			assert.include(
				result,
				"  1 error and 0 warnings potentially fixable with the `--fix` option.\n",
			);
		});

		it("should output fixable problems message when warnings are fixable", () => {
			const code = [
				{
					filePath: "foo.js",
					errorCount: 0,
					warningCount: 3,
					fixableErrorCount: 0,
					fixableWarningCount: 2,
					messages: [
						{
							message: "Unexpected foo.",
						},
					],
				},
			];

			const result = util.stripVTControlCharacters(formatter(code));

			assert.include(
				result,
				"  0 errors and 2 warnings potentially fixable with the `--fix` option.\n",
			);
		});

		it("should output the total number of fixable errors and warnings", () => {
			const code = [
				{
					filePath: "foo.js",
					errorCount: 5,
					warningCount: 3,
					fixableErrorCount: 5,
					fixableWarningCount: 2,
					messages: [
						{
							message: "Unexpected foo.",
						},
					],
				},
				{
					filePath: "bar.js",
					errorCount: 4,
					warningCount: 2,
					fixableErrorCount: 4,
					fixableWarningCount: 1,
					messages: [
						{
							message: "Unexpected bar.",
						},
					],
				},
			];

			const result = util.stripVTControlCharacters(formatter(code));

			assert.include(
				result,
				"  9 errors and 3 warnings potentially fixable with the `--fix` option.\n",
			);
		});
	});
});
