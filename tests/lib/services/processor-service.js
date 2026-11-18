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
const sinon = require("sinon");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("ProcessorService", () => {
	const processorService = new ProcessorService();

	describe("preprocessSync()", () => {
		it("should call preprocess with the file's raw body and file path", () => {
			const file = new VFile("/project/file.js", "const a = 1;");
			const processor = {
				preprocess: sinon.spy(() => []),
			};
			const config = { processor };

			processorService.preprocessSync(file, config);

			assert.ok(
				processor.preprocess.calledOnceWithExactly(
					file.rawBody,
					file.path,
				),
				"Expected preprocess to be called with file's raw body and path",
			);
		});

		it("should return ok:true with VFile objects when preprocessor returns object blocks", () => {
			const file = new VFile("/project/file.md", "Hello world");
			const config = {
				processor: {
					preprocess() {
						return [
							{ filename: "block.js", text: "const a = 1;" },
							{ filename: "extra.js", text: "const b = 2;" },
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
				result.files[0].path.endsWith("0_block.js"),
				"Expected first VFile path to end with index-prefixed block filename",
			);
			assert.ok(
				result.files[1].path.endsWith("1_extra.js"),
				"Expected second VFile path to end with index-prefixed block filename",
			);
			assert.strictEqual(
				result.files[0].body,
				"const a = 1;",
				"Expected first VFile body to match block text",
			);
			assert.strictEqual(
				result.files[1].body,
				"const b = 2;",
				"Expected second VFile body to match block text",
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
			assert.strictEqual(
				result.errors[0].message,
				"Preprocessing error: Unexpected token",
				"Expected message to include the original error message",
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
		it("should call postprocess with the messages and file path", () => {
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
			const processor = {
				postprocess: sinon.spy(msgs => msgs.flat()),
			};
			const config = { processor };

			const result = processorService.postprocessSync(
				file,
				messages,
				config,
			);

			assert.ok(
				processor.postprocess.calledOnceWithExactly(
					messages,
					file.path,
				),
				"Expected postprocess to be called with messages and file path",
			);
			assert.deepStrictEqual(
				result,
				messages.flat(),
				"Expected postprocessed messages to be returned",
			);
		});

		it("should not catch errors thrown by the processor's postprocess method", () => {
			const file = new VFile("/project/file.js", "const a = 1;");
			const config = {
				processor: {
					postprocess() {
						throw new Error("Postprocessing error");
					},
				},
			};

			assert.throws(() => {
				processorService.postprocessSync(file, [[]], config);
			}, /Postprocessing error/u);
		});
	});
});
