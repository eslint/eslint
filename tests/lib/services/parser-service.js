/**
 * @fileoverview Unit tests for the ParserService class.
 * @author Taejin Kim
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const { ParserService } = require("../../../lib/services/parser-service");
const assert = require("node:assert");
const sinon = require("sinon");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("ParserService", () => {
	/** @type {ParserService} */
	let parserService;

	beforeEach(() => {
		parserService = new ParserService();
	});

	describe("parseSync()", () => {
		it("should return ok: true with sourceCode when parse succeeds", () => {
			const fakeFile = { path: "test.js", body: "const x = 1;" };
			const fakeAst = { type: "Program", body: [] };
			const fakeSourceCode = { text: fakeFile.body, ast: fakeAst };
			const fakeLanguage = {
				parse: () => ({ ok: true, ast: fakeAst }),
				createSourceCode: () => fakeSourceCode,
			};

			const result = parserService.parseSync(fakeFile, {
				language: fakeLanguage,
				languageOptions: {},
			});

			assert.strictEqual(result.ok, true);
			assert.strictEqual(result.sourceCode, fakeSourceCode);
		});

		it("should call createSourceCode with the file, parse result, and languageOptions", () => {
			const fakeFile = { path: "test.js", body: "const x = 1;" };
			const fakeAst = { type: "Program", body: [] };
			const fakeParseResult = { ok: true, ast: fakeAst };
			const languageOptions = { ecmaVersion: 2022 };
			const fakeLanguage = {
				parse: () => fakeParseResult,
				createSourceCode: sinon.spy((file, parseResult) => ({
					text: file.body,
					ast: parseResult.ast,
				})),
			};

			parserService.parseSync(fakeFile, {
				language: fakeLanguage,
				languageOptions,
			});

			assert.ok(
				fakeLanguage.createSourceCode.calledOnceWithExactly(
					fakeFile,
					fakeParseResult,
					{ languageOptions },
				),
				"Expected createSourceCode to be called once with the file, parse result, and { languageOptions }",
			);
		});

		it("should return ok: false with errors when parse fails", () => {
			const fakeLanguage = {
				parse: () => ({
					ok: false,
					errors: [
						{ message: "Unexpected token", line: 1, column: 5 },
					],
				}),
			};
			const fakeFile = { path: "test.js", body: "const x =" };

			const result = parserService.parseSync(fakeFile, {
				language: fakeLanguage,
				languageOptions: {},
			});

			assert.strictEqual(result.ok, false);
			assert.ok(Array.isArray(result.errors));
			assert.strictEqual(result.errors.length, 1);
			assert.strictEqual(result.errors[0].ruleId, null);
			assert.strictEqual(result.errors[0].fatal, true);
			assert.strictEqual(result.errors[0].severity, 2);
		});

		it("should prefix error messages with 'Parsing error: '", () => {
			const fakeLanguage = {
				parse: () => ({
					ok: false,
					errors: [
						{ message: "Unexpected token", line: 1, column: 5 },
					],
				}),
			};
			const fakeFile = { path: "test.js", body: "const x =" };

			const result = parserService.parseSync(fakeFile, {
				language: fakeLanguage,
				languageOptions: {},
			});

			assert.strictEqual(
				result.errors[0].message,
				"Parsing error: Unexpected token",
			);
		});

		it("should preserve line and column from parser errors", () => {
			const fakeLanguage = {
				parse: () => ({
					ok: false,
					errors: [
						{ message: "Unexpected token", line: 5, column: 10 },
					],
				}),
			};
			const fakeFile = { path: "test.js", body: "" };

			const result = parserService.parseSync(fakeFile, {
				language: fakeLanguage,
				languageOptions: {},
			});

			assert.strictEqual(result.errors[0].line, 5);
			assert.strictEqual(result.errors[0].column, 10);
		});

		it("should throw when language.parse returns a promise", () => {
			const fakeLanguage = {
				parse: () =>
					Promise.resolve({
						ok: true,
						ast: { type: "Program", body: [] },
					}),
			};
			const fakeFile = { path: "test.js", body: "const x = 1;" };

			assert.throws(
				() =>
					parserService.parseSync(fakeFile, {
						language: fakeLanguage,
						languageOptions: {},
					}),
				/Unsupported: Language parser returned a promise\./u,
			);
		});
	});
});
