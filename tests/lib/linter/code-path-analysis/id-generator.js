/**
 * @fileoverview Tests for IdGenerator.
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("node:assert");
const IdGenerator = require("../../../../lib/linter/code-path-analysis/id-generator");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("IdGenerator", () => {
	describe("constructor", () => {
		it("should initialize with the given prefix", () => {
			const generator = new IdGenerator("s");
			assert.strictEqual(generator.prefix, "s");
		});

		it("should cast prefix to string", () => {
			const generator = new IdGenerator(123);
			assert.strictEqual(generator.prefix, "123");
		});

		it("should default to undefined string if prefix is undefined", () => {
			const generator = new IdGenerator();
			assert.strictEqual(generator.prefix, "undefined");
		});
	});

	describe("next()", () => {
		it("should generate sequential ids starting from 1", () => {
			const generator = new IdGenerator("s");
			assert.strictEqual(generator.next(), "s1");
			assert.strictEqual(generator.next(), "s2");
			assert.strictEqual(generator.next(), "s3");
		});

		it("should work with an empty string prefix", () => {
			const generator = new IdGenerator("");
			assert.strictEqual(generator.next(), "1");
			assert.strictEqual(generator.next(), "2");
			assert.strictEqual(generator.next(), "3");
		});

		it("should wrap around to 1 when the counter overflows", () => {
			const INT32_MAX = 2 ** 31 - 1;
			const generator = new IdGenerator("s");
			generator.n = INT32_MAX;
			assert.strictEqual(generator.next(), "s1");
		});
	});
});
