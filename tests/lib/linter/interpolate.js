"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("chai").assert;
const {
	getPlaceholderMatcher,
	interpolate,
} = require("../../../lib/linter/interpolate");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("getPlaceholderMatcher", () => {
	it("returns a global regular expression", () => {
		const matcher = getPlaceholderMatcher();

		assert.strictEqual(matcher.global, true);
	});

	it("matches text with placeholders", () => {
		const matcher = getPlaceholderMatcher();

		assert.match("{{ placeholder }}", matcher);
	});

	it("does not match text without placeholders", () => {
		const matcher = getPlaceholderMatcher();

		assert.notMatch("no placeholders in sight", matcher);
	});

	it("captures the text inside the placeholder", () => {
		const matcher = getPlaceholderMatcher();
		const text = "{{ placeholder }}";
		const matches = Array.from(text.matchAll(matcher));

		assert.deepStrictEqual(matches, [[text, " placeholder "]]);
	});
});

describe("interpolate()", () => {
	it("passes through text without {{ }}", () => {
		const message = "This is a very important message!";

		assert.strictEqual(interpolate(message, {}), message);
	});
	it("passes through text with {{ }} that don’t match a key", () => {
		const message = "This is a very important {{ message }}!";

		assert.strictEqual(interpolate(message, {}), message);
	});
	it("Properly interpolates keys in {{ }}", () => {
		assert.strictEqual(
			interpolate("This is a very important {{ message }}!", {
				message: "test",
			}),
			"This is a very important test!",
		);
	});

	const values = [
		// Expected
		[1, "1"],
		[100n, "100"],
		[true, "true"],
		[false, "false"],
		[void 0, "undefined"],
		[null, "null"],

		// Unexpected
		[{ prop: "value" }, "[object Object]"],
		[[1, 2, 3], "1,2,3"],
		[new Set([1, 2, 3]), "[object Set]"],
		[new Map([["prop", "value"]]), "[object Map]"],
	];
	for (const [value, message] of values) {
		it(`stringifies the value ${value}`, () => {
			assert.strictEqual(interpolate("{{ value }}", { value }), message);
		});
	}
});
