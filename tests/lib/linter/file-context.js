/**
 * @fileoverview Tests for FileContext class.
 * @author Nicholas C. Zakas
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("chai").assert;
const { FileContext } = require("../../../lib/linter/file-context");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("FileContext", () => {
	const mockSourceCode = {};
	const defaultConfig = {
		cwd: "/path/to/project",
		filename: "test.js",
		physicalFilename: "/path/to/project/test.js",
		sourceCode: mockSourceCode,
		languageOptions: { ecmaVersion: 2022 },
		settings: { env: { es6: true } },
	};

	describe("constructor", () => {
		it("should create a frozen instance with all properties set", () => {
			const context = new FileContext(defaultConfig);

			assert.strictEqual(context.cwd, defaultConfig.cwd);
			assert.strictEqual(context.filename, defaultConfig.filename);
			assert.strictEqual(
				context.physicalFilename,
				defaultConfig.physicalFilename,
			);
			assert.strictEqual(context.sourceCode, defaultConfig.sourceCode);
			assert.deepStrictEqual(
				context.languageOptions,
				defaultConfig.languageOptions,
			);
			assert.deepStrictEqual(context.settings, defaultConfig.settings);

			// Verify the instance is frozen
			assert.throws(() => {
				context.cwd = "changed";
			}, TypeError);
		});

		it("should allow partial configuration", () => {
			const partialConfig = {
				cwd: "/path/to/project",
				filename: "test.js",
				physicalFilename: "/path/to/project/test.js",
				sourceCode: mockSourceCode,
			};

			const context = new FileContext(partialConfig);

			assert.strictEqual(context.cwd, partialConfig.cwd);
			assert.strictEqual(context.filename, partialConfig.filename);
			assert.strictEqual(
				context.physicalFilename,
				partialConfig.physicalFilename,
			);
			assert.strictEqual(context.sourceCode, partialConfig.sourceCode);
			assert.isUndefined(context.parserOptions);
			assert.isUndefined(context.parserPath);
			assert.isUndefined(context.languageOptions);
			assert.isUndefined(context.settings);
		});
	});

	describe("deprecated methods", () => {
		let context;

		beforeEach(() => {
			context = new FileContext(defaultConfig);
		});

		it("getCwd() should return the cwd property", () => {
			assert.strictEqual(context.getCwd(), context.cwd);
			assert.strictEqual(context.getCwd(), defaultConfig.cwd);
		});

		it("getFilename() should return the filename property", () => {
			assert.strictEqual(context.getFilename(), context.filename);
			assert.strictEqual(context.getFilename(), defaultConfig.filename);
		});

		it("getPhysicalFilename() should return the physicalFilename property", () => {
			assert.strictEqual(
				context.getPhysicalFilename(),
				context.physicalFilename,
			);
			assert.strictEqual(
				context.getPhysicalFilename(),
				defaultConfig.physicalFilename,
			);
		});

		it("getSourceCode() should return the sourceCode property", () => {
			assert.strictEqual(context.getSourceCode(), context.sourceCode);
			assert.strictEqual(
				context.getSourceCode(),
				defaultConfig.sourceCode,
			);
		});
	});

	describe("extend()", () => {
		let context;

		beforeEach(() => {
			context = new FileContext(defaultConfig);
		});

		it("should create a new object with the original as prototype", () => {
			const extension = { extraProperty: "extra" };
			const extended = context.extend(extension);

			// Verify new properties
			assert.strictEqual(extended.extraProperty, "extra");

			// Verify inherited properties
			assert.strictEqual(extended.cwd, context.cwd);
			assert.strictEqual(extended.filename, context.filename);
			assert.strictEqual(
				extended.physicalFilename,
				context.physicalFilename,
			);
			assert.strictEqual(extended.sourceCode, context.sourceCode);
			assert.deepStrictEqual(
				extended.languageOptions,
				context.languageOptions,
			);
			assert.deepStrictEqual(extended.settings, context.settings);
		});

		it("should freeze the extended object", () => {
			const extension = { extraProperty: "extra" };
			const extended = context.extend(extension);

			// Verify the extended object is frozen
			assert.throws(() => {
				extended.cwd = "changed";
			}, TypeError);

			assert.throws(() => {
				extended.extraProperty = "changed";
			}, TypeError);
		});

		it("should throw an error when attempting to override existing properties", () => {
			const extension = { cwd: "newCwd" };

			assert.throws(() => {
				context.extend(extension);
			}, TypeError);
		});
	});
});
