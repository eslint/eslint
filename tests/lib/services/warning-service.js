/**
 * @fileoverview Unit tests for the WarningService class.
 * @author Francesco Trotta
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const { WarningService } = require("../../../lib/services/warning-service");
const assert = require("node:assert");
const sinon = require("sinon");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("WarningService", () => {
	/** @type {WarningService} */
	let warningService;

	describe("should call `process.emitWarning` in Node.js", () => {
		if (typeof process !== "object") {
			return; // Skip tests if not in Node.js
		}

		beforeEach(() => {
			sinon.stub(process, "emitWarning");
			warningService = new WarningService();
		});

		afterEach(() => {
			sinon.restore();
		});

		it("emitCircularFixesWarning", () => {
			const filename = "/project/file.js";
			warningService.emitCircularFixesWarning(filename);

			assert(
				process.emitWarning.calledOnceWithExactly(
					`Circular fixes detected while fixing ${filename}. It is likely that you have conflicting rules in your configuration.`,
					"ESLintCircularFixesWarning",
				),
				"Expected process.emitWarning to be called with the correct arguments",
			);
		});

		it("emitEmptyConfigWarning", () => {
			const configFilePath = "/project/eslint.config.js";
			warningService.emitEmptyConfigWarning(configFilePath);

			assert(
				process.emitWarning.calledOnceWithExactly(
					`Running ESLint with an empty config (from ${configFilePath}). Please double-check that this is what you want. If you want to run ESLint with an empty config, export [{}] to remove this warning.`,
					"ESLintEmptyConfigWarning",
				),
				"Expected process.emitWarning to be called with the correct arguments",
			);
		});

		it("emitESLintIgnoreWarning", () => {
			warningService.emitESLintIgnoreWarning();

			assert(
				process.emitWarning.calledOnceWithExactly(
					'The ".eslintignore" file is no longer supported. Switch to using the "ignores" property in "eslint.config.js": https://eslint.org/docs/latest/use/configure/migration-guide#ignore-files',
					"ESLintIgnoreWarning",
				),
				"Expected process.emitWarning to be called with the correct arguments",
			);
		});

		it("emitInactiveFlagWarning", () => {
			const flag = "unstable_foo_bar";
			const message = `Lorem ipsum ${flag}.`;
			warningService.emitInactiveFlagWarning(flag, message);

			assert(
				process.emitWarning.calledOnceWithExactly(
					message,
					`ESLintInactiveFlag_${flag}`,
				),
				"Expected process.emitWarning to be called with the correct arguments",
			);
		});

		it("emitPoorConcurrencyWarning", () => {
			const notice = "use a different concurrency setting";
			warningService.emitPoorConcurrencyWarning(notice);

			assert(
				process.emitWarning.calledOnceWithExactly(
					`You may ${notice} to improve performance.`,
					"ESLintPoorConcurrencyWarning",
				),
				"Expected process.emitWarning to be called with the correct arguments",
			);
		});
	});

	describe("should not throw an error when `process` is not defined", () => {
		if (globalThis.process) {
			const originalProcess = process;

			beforeEach(() => {
				globalThis.process = void 0;
				warningService = new WarningService();
			});

			afterEach(() => {
				globalThis.process = originalProcess;
			});
		}

		// Only methods used by the Linter are tested here.

		it("emitCircularFixesWarning", () => {
			const filename = "/project/file.js";
			warningService.emitCircularFixesWarning(filename);
		});

		it("emitInactiveFlagWarning", () => {
			const flag = "unstable_foo_bar";
			const message = `Lorem ipsum ${flag}.`;
			warningService.emitInactiveFlagWarning(flag, message);
		});
	});
});
