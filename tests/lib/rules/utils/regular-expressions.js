/**
 * @fileoverview Tests for regular-expressions utility.
 * @author Josh Goldberg
 */
"use strict";

const assert = require("chai").assert;
const {
	isValidWithUnicodeFlag,
} = require("../../../../lib/rules/utils/regular-expressions");

describe("regular-expressions", () => {
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
