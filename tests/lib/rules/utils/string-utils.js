/**
 * @fileoverview Tests for string utility.
 */
"use strict";
//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------
const assert = require("chai").assert;
const { containsLetter } = require("../../../../lib/rules/utils/string-utils");
//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------
describe("string-utils", () => {
	describe("containsLetter", () => {
		it("should return true for a letter", () => {
			assert.strictEqual(containsLetter("d"), true);
		});

		it("should return true for a uppercase letter", () => {
			assert.strictEqual(containsLetter("D"), true);
		});

		it("should return true for a letter from a non-Latin alphabet", () => {
			assert.strictEqual(containsLetter("я"), true);
		});

		it("should return true for an uppercase letter from a non-Latin alphabet", () => {
			assert.strictEqual(containsLetter("Я"), true);
		});

		it("should return true for an astral Unicode letter", () => {
			assert.strictEqual(containsLetter("𐐷"), true);
		});

		it("should return false for a digit", () => {
			assert.strictEqual(containsLetter("1"), false);
		});

		it("should return false for punctuation", () => {
			assert.strictEqual(containsLetter("!"), false);
		});

		it("should return false for an empty string", () => {
			assert.strictEqual(containsLetter(""), false);
		});

		it("should return true when a string contains a letter", () => {
			assert.strictEqual(containsLetter("1学2"), true);
		});
	});
});
