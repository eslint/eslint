/**
 * @fileoverview Tests for serialization utils.
 * @author Bryan Mishkin
 */

"use strict";

const assert = require("node:assert");
const { isSerializable } = require("../../../lib/shared/serialization");

describe("serialization", () => {
	describe("isSerializable", () => {
		it("string", () => {
			assert.strictEqual(isSerializable(""), true);
			assert.strictEqual(isSerializable("abc"), true);
		});

		it("boolean", () => {
			assert.strictEqual(isSerializable(true), true);
			assert.strictEqual(isSerializable(false), true);
			assert.strictEqual(isSerializable({ a: true }), true);
			assert.strictEqual(isSerializable([true]), true);
		});

		it("number", () => {
			assert.strictEqual(isSerializable(123), true);
			assert.strictEqual(isSerializable({ a: 123 }), true);
			assert.strictEqual(isSerializable([123]), true);
		});

		it("function", () => {
			assert.strictEqual(
				isSerializable(() => {}),
				false,
			);
			assert.strictEqual(isSerializable({ a() {} }), false);
			assert.strictEqual(isSerializable([() => {}]), false);
		});

		it("RegExp", () => {
			assert.strictEqual(isSerializable(/abc/u), false);
			assert.strictEqual(isSerializable({ a: /abc/u }), false);
			assert.strictEqual(isSerializable([/abc/u]), false);
		});

		it("null", () => {
			assert.strictEqual(isSerializable(null), true);
			assert.strictEqual(isSerializable({ a: null }), true);
			assert.strictEqual(isSerializable([null]), true);
		});

		it("undefined", () => {
			assert.strictEqual(isSerializable(void 0), false);
			assert.strictEqual(isSerializable({ a: void 0 }), false);
			assert.strictEqual(isSerializable([void 0]), false);
		});

		describe("object", () => {
			it("plain objects", () => {
				assert.strictEqual(isSerializable({}), true);
				assert.strictEqual(isSerializable({ a: 123 }), true);
				assert.strictEqual(isSerializable({ a: { b: 456 } }), true);
			});

			it("object with function", () => {
				assert.strictEqual(isSerializable({ a() {} }), false);
				assert.strictEqual(isSerializable({ a: { b() {} } }), false);
			});

			it("object with RegExp", () => {
				assert.strictEqual(isSerializable({ a: /abc/u }), false);
				assert.strictEqual(isSerializable({ a: { b: /abc/u } }), false);
			});
		});

		describe("array", () => {
			it("plain array", () => {
				assert.strictEqual(isSerializable([]), true);
				assert.strictEqual(isSerializable([1, 2, 3]), true);
			});

			it("array with function", () => {
				assert.strictEqual(isSerializable([function () {}]), false);
			});

			it("array with RegExp", () => {
				assert.strictEqual(isSerializable([/abc/u]), false);
			});

			it("array with plain/nested objects", () => {
				assert.strictEqual(
					isSerializable([
						{ a: 1 },
						{ b: 2 },
						{ c: { nested: true } },
					]),
					true,
				);
			});

			it("array with object with nested function", () => {
				assert.strictEqual(isSerializable([{ a: { fn() {} } }]), false);
			});

			it("array with object with nested array with object", () => {
				assert.strictEqual(
					isSerializable([{ a: { b: [{ c: 123 }] } }]),
					true,
				);
			});

			it("array with object with nested array with object with function", () => {
				assert.strictEqual(
					isSerializable([{ a: { b: [{ c() {} }] } }]),
					false,
				);
			});
		});
	});
});
