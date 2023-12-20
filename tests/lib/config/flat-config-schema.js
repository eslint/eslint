/**
 * @fileoverview Tests for flatConfigSchema
 * @author Francesco Trotta
 */

"use strict";

const { flatConfigSchema } = require("../../../lib/config/flat-config-schema");
const { assert } = require("chai");

describe("merge", () => {

    const { merge } = flatConfigSchema.settings;

    it("merges two objects", () => {
        const first = { foo: 42 };
        const second = { bar: "baz" };
        const result = merge(first, second);

        assert.deepStrictEqual(result, { ...first, ...second });
    });

    it("overrides an object with an array", () => {
        const first = { foo: 42 };
        const second = ["bar", "baz"];
        const result = merge(first, second);

        assert.strictEqual(result, second);
    });

    it("merges an array with an object", () => {
        const first = ["foo", "bar"];
        const second = { baz: 42 };
        const result = merge(first, second);

        assert.deepStrictEqual(result, { 0: "foo", 1: "bar", baz: 42 });
    });

    it("overrides an array with another array", () => {
        const first = ["foo", "bar"];
        const second = ["baz", "qux"];
        const result = merge(first, second);

        assert.strictEqual(result, second);
    });

    it("returns an emtpy object if both values are undefined", () => {
        const result = merge(void 0, void 0);

        assert.deepStrictEqual(result, {});
    });

    it("returns an object equal to the first one if the second one is undefined", () => {
        const first = { foo: 42, bar: "baz" };
        const result = merge(first, void 0);

        assert.deepStrictEqual(result, first);
        assert.notStrictEqual(result, first);
    });

    it("returns an object equal to the second one if the first one is undefined", () => {
        const second = { foo: 42, bar: "baz" };
        const result = merge(void 0, second);

        assert.deepStrictEqual(result, second);
        assert.notStrictEqual(result, second);
    });

    it("merges two objects in a property", () => {
        const first = { foo: { bar: "baz" } };
        const second = { foo: { qux: 42 } };
        const result = merge(first, second);

        assert.deepStrictEqual(result, { foo: { bar: "baz", qux: 42 } });
    });

    it("does not override a value in a property with undefined", () => {
        const first = { foo: { bar: "baz" } };
        const second = { foo: void 0 };
        const result = merge(first, second);

        assert.deepStrictEqual(result, first);
        assert.notStrictEqual(result, first);
    });

    it("does not change the prototype of a merged object", () => {
        const first = { foo: 42 };
        const second = { bar: "baz", ["__proto__"]: { qux: true } };
        const result = merge(first, second);

        assert.strictEqual(Object.getPrototypeOf(result), Object.prototype);
    });

    it("does not merge the '__proto__' property", () => {
        const first = { ["__proto__"]: { foo: 42 } };
        const second = { ["__proto__"]: { bar: "baz" } };
        const result = merge(first, second);

        assert.deepStrictEqual(result, second);
        assert.notStrictEqual(result, second);
    });

    it("throws an error if a value in a property is overriden with null", () => {
        const first = { foo: { bar: "baz" } };
        const second = { foo: null };

        assert.throws(() => merge(first, second), TypeError);
    });

    it("does not override a value in a property with a primitive", () => {
        const first = { foo: { bar: "baz" } };
        const second = { foo: 42 };
        const result = merge(first, second);

        assert.deepStrictEqual(result, first);
        assert.notStrictEqual(result, first);
    });

    it("merges an object in a property with a string", () => {
        const first = { foo: { bar: "baz" } };
        const second = { foo: "qux" };
        const result = merge(first, second);

        assert.deepStrictEqual(result, { foo: { 0: "q", 1: "u", 2: "x", bar: "baz" } });
    });

    it("merges objects with self-references", () => {
        const first = { foo: 42 };

        first.first = first;
        const second = { bar: "baz" };

        second.second = second;
        const result = merge(first, second);

        assert.strictEqual(result.first, first);
        assert.deepStrictEqual(result.second, second);

        const expected = { foo: 42, bar: "baz" };

        expected.first = first;
        expected.second = second;
        assert.deepStrictEqual(result, expected);
    });

    it("merges objects with overlapping self-references", () => {
        const first = { foo: 42 };

        first.reference = first;
        const second = { bar: "baz" };

        second.reference = second;

        const result = merge(first, second);

        assert.strictEqual(result.reference, result);

        const expected = { foo: 42, bar: "baz" };

        expected.reference = expected;
        assert.deepStrictEqual(result, expected);
    });

    it("merges objects with cross-references", () => {
        const first = { foo: 42 };
        const second = { bar: "baz" };

        first.second = second;
        second.first = first;

        const result = merge(first, second);

        assert.deepStrictEqual(result.first, first);
        assert.strictEqual(result.second, second);

        const expected = { foo: 42, bar: "baz" };

        expected.first = first;
        expected.second = second;
        assert.deepStrictEqual(result, expected);
    });

    it("merges objects with overlapping cross-references", () => {
        const first = { foo: 42 };
        const second = { bar: "baz" };

        first.reference = second;
        second.reference = first;

        const result = merge(first, second);

        assert.strictEqual(result, result.reference.reference);

        const expected = { foo: 42, bar: "baz", reference: { foo: 42, bar: "baz" } };

        expected.reference.reference = expected;
        assert.deepStrictEqual(result, expected);
    });

    it("produces the same results for the same combinations of property values", () => {
        const firstCommon = { foo: 42 };
        const secondCommon = { bar: "baz" };
        const first = {
            a: firstCommon,
            b: firstCommon,
            c: { foo: "different" },
            d: firstCommon
        };
        const second = {
            a: secondCommon,
            b: { bar: "something else" },
            c: secondCommon,
            d: secondCommon
        };
        const result = merge(first, second);

        assert.deepStrictEqual(result.a, result.d);

        const expected = {
            a: { foo: 42, bar: "baz" },
            b: { foo: 42, bar: "something else" },
            c: { foo: "different", bar: "baz" },
            d: { foo: 42, bar: "baz" }
        };

        assert.deepStrictEqual(result, expected);
    });
});
