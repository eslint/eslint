/**
 * @fileoverview Unit tests for the ProcessorService class.
 * @author Kuldeep2822k
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const { ProcessorService } = require("../../../lib/services/processor-service");
const { VFile } = require("../../../lib/linter/vfile");
const assert = require("node:assert");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("ProcessorService", () => {
	/** @type {ProcessorService} */
	let processorService;

	beforeEach(() => {
		processorService = new ProcessorService();
	});

	describe("preprocessSync()", () => {
		it("should return ok:true with VFile objects when preprocessor returns object blocks", () => {
			const file = new VFile("/project/file.md", "Hello world");
			const config = {
				processor: {
					preprocess() {
						return [
							{ filename: "0.js", text: "const a = 1;" },
							{ filename: "1.js", text: "const b = 2;" },
						];
					},
				},
			};

			const result = processorService.preprocessSync(file, config);

			assert.strictEqual(result.ok, true);
			assert.strictEqual(result.files.length, 2);
			assert.ok(
				result.files[0] instanceof VFile,
				"Expected first block to be a VFile instance",
			);
			assert.ok(
				result.files[1] instanceof VFile,
				"Expected second block to be a VFile instance",
			);
			assert.ok(
				result.files[0].path.endsWith("0.js"),
				"Expected first VFile path to end with block filename",
			);
			assert.ok(
				result.files[1].path.endsWith("1.js"),
				"Expected second VFile path to end with block filename",
			);
		});

		it("should return ok:true with string values when preprocessor returns legacy string blocks", () => {
			const file = new VFile("/project/file.js", "const a = 1;");
			const config = {
				processor: {
					preprocess() {
						return ["const a = 1;", "const b = 2;"];
					},
				},
			};

			const result = processorService.preprocessSync(file, config);

			assert.strictEqual(result.ok, true);
			assert.strictEqual(result.files.length, 2);
			assert.strictEqual(result.files[0], "const a = 1;");
			assert.strictEqual(result.files[1], "const b = 2;");
		});

		it("should return ok:false with error details when the preprocessor throws", () => {
			const file = new VFile("/project/file.js", "const a = 1;");
			const config = {
				processor: {
					preprocess() {
						const err = new SyntaxError("Unexpected token");

						err.lineNumber = 3;
						err.column = 5;
						throw err;
					},
				},
			};

			const result = processorService.preprocessSync(file, config);

			assert.strictEqual(result.ok, false);
			assert.strictEqual(result.errors.length, 1);
			assert.strictEqual(result.errors[0].fatal, true);
			assert.strictEqual(result.errors[0].severity, 2);
			assert.strictEqual(result.errors[0].ruleId, null);
			assert.ok(
				result.errors[0].message.startsWith("Preprocessing error:"),
				"Expected message to start with 'Preprocessing error:'",
			);
			assert.strictEqual(result.errors[0].line, 3);
			assert.strictEqual(result.errors[0].column, 5);
		});

		it("should strip leading 'line N:' prefix from preprocessor error messages", () => {
			const file = new VFile("/project/file.js", "const a = 1;");
			const config = {
				processor: {
					preprocess() {
						throw new SyntaxError("line 5: Unexpected token");
					},
				},
			};

			const result = processorService.preprocessSync(file, config);

			assert.strictEqual(result.ok, false);
			assert.ok(
				!result.errors[0].message.includes("line 5:"),
				"Expected 'line N:' prefix to be stripped from the error message",
			);
		});

		it("should throw an error if the preprocessor returns a promise", () => {
			const file = new VFile("/project/file.js", "const a = 1;");
			const config = {
				processor: {
					preprocess() {
						return Promise.resolve(["const a = 1;"]);
					},
				},
			};

			assert.throws(() => {
				processorService.preprocessSync(file, config);
			}, /Unsupported: Preprocessor returned a promise\./u);
		});
	});

	describe("postprocessSync()", () => {
		it("should return the postprocessed messages from the processor", () => {
			const file = new VFile("/project/file.js", "const a = 1;");
			const messages = [
				[
					{
						ruleId: "no-unused-vars",
						message: "'a' is defined but never used.",
						severity: 2,
						line: 1,
						column: 7,
					},
				],
			];
			const postprocessed = [
				{
					ruleId: "no-unused-vars",
					message: "'a' is defined but never used.",
					severity: 2,
					line: 1,
					column: 7,
				},
			];
			const config = {
				processor: {
					postprocess() {
						return postprocessed;
					},
				},
			};

			const result = processorService.postprocessSync(
				file,
				messages,
				config,
			);

			assert.deepStrictEqual(
				result,
				postprocessed,
				"Expected postprocessed messages to be returned",
			);
		});

		it("should pass the file path to the processor's postprocess method", () => {
			const filePath = "/project/file.js";
			const file = new VFile(filePath, "const a = 1;");
			let receivedFilename;
			const config = {
				processor: {
					postprocess(msgs, filename) {
						receivedFilename = filename;
						return [];
					},
				},
			};

			processorService.postprocessSync(file, [[]], config);

			assert.strictEqual(
				receivedFilename,
				filePath,
				"Expected file path to be passed to postprocess",
			);
		});
	});
});
