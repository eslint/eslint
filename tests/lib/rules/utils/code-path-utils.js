/**
 * @fileoverview Tests for code path utils.
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("chai").assert;
const {
	isAnySegmentReachable,
} = require("../../../../lib/rules/utils/code-path-utils");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("isAnySegmentReachable", () => {
	it("should return false for an empty set of segments", () => {
		const segments = new Set();

		assert.strictEqual(isAnySegmentReachable(segments), false);
	});

	it("should return true when a single segment is reachable", () => {
		const segments = new Set([{ reachable: true }]);

		assert.strictEqual(isAnySegmentReachable(segments), true);
	});

	it("should return false when a single segment is unreachable", () => {
		const segments = new Set([{ reachable: false }]);

		assert.strictEqual(isAnySegmentReachable(segments), false);
	});

	it("should return false when all segments are unreachable", () => {
		const segments = new Set([{ reachable: false }, { reachable: false }]);

		assert.strictEqual(isAnySegmentReachable(segments), false);
	});

	it("should return true when all segments are reachable", () => {
		const segments = new Set([{ reachable: true }, { reachable: true }]);

		assert.strictEqual(isAnySegmentReachable(segments), true);
	});

	it("should return true when at least one segment is reachable", () => {
		const segments = new Set([{ reachable: false }, { reachable: true }]);

		assert.strictEqual(isAnySegmentReachable(segments), true);
	});
});
