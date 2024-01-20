/**
 * @fileoverview Tests for serialization utils.
 * @author Bryan Mishkin
 */

"use strict";

const assert = require("chai").assert;
const { isSerializable } = require("../../../lib/shared/serialization");

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
        });

        describe("array", () => {
            it("plain array", () => {
                assert.isTrue(isSerializable([]));
                assert.isTrue(isSerializable([1, 2, 3]));
            });

            it("array with function", () => {
                assert.isFalse(isSerializable([function() {}]));
            });

            it("array with RegExp", () => {
                assert.isFalse(isSerializable([/abc/u]));
            });

            it("array with plain/nested objects", () => {
                assert.isTrue(isSerializable([{ a: 1 }, { b: 2 }, { c: { nested: true } }]));
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
});
