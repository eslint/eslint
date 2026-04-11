/**
 * @fileoverview Unit tests for the SuppressionsService class.
 * @author Kuldeep Kumar
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const {
	SuppressionsService,
} = require("../../../lib/services/suppressions-service");
const assert = require("node:assert");
const fs = require("node:fs");
const sinon = require("sinon");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("SuppressionsService", () => {
	afterEach(() => {
		sinon.restore();
	});

	describe("load()", () => {
		it("should return parsed JSON when file is valid", async () => {
			const suppressionsService = new SuppressionsService({
				filePath: "/project/eslint-suppressions.json",
				cwd: "/project",
			});
			const mockData = { "file.js": { "rule-id": { count: 1 } } };
			sinon
				.stub(fs.promises, "readFile")
				.resolves(JSON.stringify(mockData));

			const result = await suppressionsService.load();
			assert.deepStrictEqual(result, mockData);
		});

		it("should return an empty object when file does not exist (ENOENT)", async () => {
			const suppressionsService = new SuppressionsService({
				filePath: "/project/eslint-suppressions.json",
				cwd: "/project",
			});
			const error = new Error("File not found");
			error.code = "ENOENT";
			sinon.stub(fs.promises, "readFile").rejects(error);

			const result = await suppressionsService.load();
			assert.deepStrictEqual(result, {});
		});

		it("should throw an error with cause when file contains invalid JSON", async () => {
			const suppressionsService = new SuppressionsService({
				filePath: "/project/eslint-suppressions.json",
				cwd: "/project",
			});
			sinon.stub(fs.promises, "readFile").resolves("invalid json");

			await assert.rejects(
				() => suppressionsService.load(),
				err => {
					assert.strictEqual(
						err.message,
						"Failed to parse suppressions file at /project/eslint-suppressions.json",
					);
					assert.ok(err.cause instanceof SyntaxError);
					return true;
				},
			);
		});

		it("should throw an error with cause when reading file throws a non-ENOENT error", async () => {
			const suppressionsService = new SuppressionsService({
				filePath: "/project/eslint-suppressions.json",
				cwd: "/project",
			});
			const readError = new Error("EACCES: permission denied");
			readError.code = "EACCES";
			sinon.stub(fs.promises, "readFile").rejects(readError);

			await assert.rejects(
				() => suppressionsService.load(),
				err => {
					assert.strictEqual(
						err.message,
						"Failed to parse suppressions file at /project/eslint-suppressions.json",
					);
					assert.strictEqual(err.cause, readError);
					return true;
				},
			);
		});

		it("should read from the correct filePath", async () => {
			const suppressionsService = new SuppressionsService({
				filePath: "/custom/path/suppressions.json",
				cwd: "/custom",
			});
			const mockData = { "app.js": { "no-unused-vars": { count: 2 } } };
			const stub = sinon
				.stub(fs.promises, "readFile")
				.resolves(JSON.stringify(mockData));

			const result = await suppressionsService.load();
			assert.deepStrictEqual(result, mockData);
			assert(
				stub.calledOnceWithExactly(
					"/custom/path/suppressions.json",
					"utf8",
				),
				"Expected readFile to be called with the correct filePath and encoding",
			);
		});

		it("should work without cwd and use filePath in the error message", async () => {
			const suppressionsService = new SuppressionsService({
				filePath: "/workspace/config/eslint-suppressions.json",
			});
			sinon.stub(fs.promises, "readFile").resolves("not valid json");

			await assert.rejects(
				() => suppressionsService.load(),
				err => {
					assert.strictEqual(
						err.message,
						"Failed to parse suppressions file at /workspace/config/eslint-suppressions.json",
					);
					assert.ok(err.cause instanceof SyntaxError);
					return true;
				},
			);
		});
	});
});
