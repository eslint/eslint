/**
 * @fileoverview Tests for serialization utils.
 * @author Bryan Mishkin
 */

"use strict";

const assert = require("chai").assert;
const {
	isSerializable,
	stringifyValue,
} = require("../../../lib/shared/serialization");

describe("serialization", () => {
	describe("isSerializable", () => {
		it("string", () => {
			assert.isTrue(isSerializable(""));
			assert.isTrue(isSerializable("abc"));
		});

		it("boolean", () => {
			assert.isTrue(isSerializable(true));
			assert.isTrue(isSerializable(false));
			assert.isTrue(isSerializable({ a: true }));
			assert.isTrue(isSerializable([true]));
		});

		it("number", () => {
			assert.isTrue(isSerializable(123));
			assert.isTrue(isSerializable({ a: 123 }));
			assert.isTrue(isSerializable([123]));
		});

		it("function", () => {
			assert.isFalse(isSerializable(() => {}));
			assert.isFalse(isSerializable({ a() {} }));
			assert.isFalse(isSerializable([() => {}]));
		});

		it("RegExp", () => {
			assert.isFalse(isSerializable(/abc/u));
			assert.isFalse(isSerializable({ a: /abc/u }));
			assert.isFalse(isSerializable([/abc/u]));
		});

		it("null", () => {
			assert.isTrue(isSerializable(null));
			assert.isTrue(isSerializable({ a: null }));
			assert.isTrue(isSerializable([null]));
		});

		it("undefined", () => {
			assert.isFalse(isSerializable(void 0));
			assert.isFalse(isSerializable({ a: void 0 }));
			assert.isFalse(isSerializable([void 0]));
		});

		describe("object", () => {
			it("plain objects", () => {
				assert.isTrue(isSerializable({}));
				assert.isTrue(isSerializable({ a: 123 }));
				assert.isTrue(isSerializable({ a: { b: 456 } }));
			});

			it("object with function", () => {
				assert.isFalse(isSerializable({ a() {} }));
				assert.isFalse(isSerializable({ a: { b() {} } }));
			});

			it("object with RegExp", () => {
				assert.isFalse(isSerializable({ a: /abc/u }));
				assert.isFalse(isSerializable({ a: { b: /abc/u } }));
			});

			it("circular references", () => {
				const obj1 = {};
				obj1.circular = obj1;
				assert.isFalse(isSerializable(obj1));
				assert.isFalse(isSerializable({ a: obj1 }));

				const obj2 = {};
				obj2.a = { circular: obj2 };
				assert.isFalse(isSerializable(obj2));
				assert.isFalse(isSerializable({ b: obj2 }));

				const obj3 = { foo: { bar: "baz" } };
				assert.isTrue(
					isSerializable({
						a: obj3,
						b: obj3,
						c: {
							d: obj3,
							e: {
								f: obj3,
							},
						},
					}),
				);
			});
		});

		describe("array", () => {
			it("plain array", () => {
				assert.isTrue(isSerializable([]));
				assert.isTrue(isSerializable([1, 2, 3]));
			});

			it("array with function", () => {
				assert.isFalse(isSerializable([function () {}]));
			});

			it("array with RegExp", () => {
				assert.isFalse(isSerializable([/abc/u]));
			});

			it("array with plain/nested objects", () => {
				assert.isTrue(
					isSerializable([
						{ a: 1 },
						{ b: 2 },
						{ c: { nested: true } },
					]),
				);
			});

			it("array with object with nested function", () => {
				assert.isFalse(isSerializable([{ a: { fn() {} } }]));
			});

			it("array with object with nested array with object", () => {
				assert.isTrue(isSerializable([{ a: { b: [{ c: 123 }] } }]));
			});

			it("array with object with nested array with object with function", () => {
				assert.isFalse(isSerializable([{ a: { b: [{ c() {} }] } }]));
			});
		});
	});

	describe("stringifyValue", () => {
		it("primitives, null, and undefined", () => {
			assert.strictEqual(stringifyValue("abc"), '"abc"');
			assert.strictEqual(stringifyValue(123), "123");
			assert.strictEqual(stringifyValue(true), "true");
			assert.strictEqual(stringifyValue(null), "null");
			assert.strictEqual(stringifyValue(void 0), void 0);
		});

		it("plain objects and arrays", () => {
			assert.strictEqual(
				stringifyValue({ a: 1, b: [true, "x"] }),
				'{"a":1,"b":[true,"x"]}',
			);
			assert.strictEqual(stringifyValue({ a: 1 }, 4), '{\n    "a": 1\n}');
		});

		it("circular object and array references", () => {
			const obj1 = { a: 1 };
			obj1.self = obj1;
			assert.strictEqual(
				stringifyValue(obj1),
				'{"a":1,"self":"[Circular]"}',
			);
			assert.strictEqual(
				stringifyValue(obj1, 4),
				'{\n    "a": 1,\n    "self": "[Circular]"\n}',
			);

			const obj2 = {};
			obj2.a = { circular: obj2 };
			assert.strictEqual(
				stringifyValue(obj2),
				'{"a":{"circular":"[Circular]"}}',
			);

			const arr = [1];
			arr.push(arr);
			assert.strictEqual(stringifyValue(arr), '[1,"[Circular]"]');

			const nullProto = Object.create(null);
			nullProto.name = "plugin";
			nullProto.self = nullProto;
			assert.strictEqual(
				stringifyValue(nullProto),
				'{"name":"plugin","self":"[Circular]"}',
			);
		});

		it("shared non-circular references", () => {
			const shared = { foo: { bar: "baz" } };
			const value = {
				a: shared,
				b: shared,
				arr: [shared, shared],
			};

			assert.strictEqual(stringifyValue(value), JSON.stringify(value));
		});

		it("shared circular object across sibling properties", () => {
			const circular = { a: 1 };
			circular.self = circular;

			assert.strictEqual(
				stringifyValue({ first: circular, second: circular }),
				'{"first":{"a":1,"self":"[Circular]"},"second":{"a":1,"self":"[Circular]"}}',
			);
		});
	});
});
