/**
 * @fileoverview Tests for IdGenerator.
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("node:assert"),
	IdGenerator = require("../../../../lib/linter/code-path-analysis/id-generator");

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
			const generator1 = new IdGenerator(123);
			assert.strictEqual(generator1.prefix, "123");

			const generator2 = new IdGenerator();
			assert.strictEqual(generator2.prefix, "undefined");
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
	});
});
