/**
 * @fileoverview Tests for regular-expressions utility.
 * @author Manish Chaudhary
 */
"use strict";

const assert = require("chai").assert;
const {
	isValidWithUnicodeFlag,
	REGEXPP_LATEST_ECMA_VERSION,
} = require("../../../../lib/rules/utils/regular-expressions");

describe("regular-expressions", () => {
	describe("REGEXPP_LATEST_ECMA_VERSION", () => {
		it("should be a number", () => {
			assert.strictEqual(typeof REGEXPP_LATEST_ECMA_VERSION, "number");
		});
	});

	describe("isValidWithUnicodeFlag", () => {
		it("should return false for ecmaVersion <= 5 with 'u' flag", () => {
			assert.strictEqual(isValidWithUnicodeFlag(5, "a", "u"), false);
		});

		it("should return false for ecmaVersion <= 2023 with 'v' flag", () => {
			assert.strictEqual(isValidWithUnicodeFlag(2023, "a", "v"), false);
		});

		it("should return true for valid pattern with 'u' flag in ES2015", () => {
			assert.strictEqual(isValidWithUnicodeFlag(2015, "a", "u"), true);
		});

		it("should return false for invalid pattern with 'u' flag", () => {
			assert.strictEqual(isValidWithUnicodeFlag(2015, "[", "u"), false);
		});

		it("should return true for valid pattern with 'v' flag in ES2024", () => {
			assert.strictEqual(isValidWithUnicodeFlag(2024, "a", "v"), true);
		});
	});
});
