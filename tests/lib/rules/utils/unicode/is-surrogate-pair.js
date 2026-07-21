/**
 * @fileoverview Tests for is-surrogate-pair utility.
 * @author Manish Chaudhary
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("chai").assert,
	isSurrogatePair = require("../../../../../lib/rules/utils/unicode/is-surrogate-pair");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("isSurrogatePair", () => {
	it("should return true for a valid surrogate pair", () => {
		assert.strictEqual(isSurrogatePair(0xd800, 0xdc00), true); // Minimum valid pair
		assert.strictEqual(isSurrogatePair(0xd83d, 0xde00), true);
		assert.strictEqual(isSurrogatePair(0xdbff, 0xdfff), true); // Maximum valid pair
	});

	it("should return false if the lead is not a high surrogate", () => {
		assert.strictEqual(isSurrogatePair(0xde00, 0xde00), false);
	});

	it("should return false if the tail is not a low surrogate", () => {
		assert.strictEqual(isSurrogatePair(0xd83d, 0xd83d), false);
		assert.strictEqual(isSurrogatePair(0xd800, 0xdbff), false); // High + High
	});

	it("should return false if codes are out of range", () => {
		assert.strictEqual(isSurrogatePair(0x0000, 0x0000), false);
	});
});
