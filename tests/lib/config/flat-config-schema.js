/**
 * @fileoverview Tests for flatConfigSchema
 * @author Francesco Trotta
 */

"use strict";

const { flatConfigSchema } = require("../../../lib/config/flat-config-schema");
const { assert } = require("chai");
const { Legacy: { ConfigArray } } = require("@eslint/eslintrc");

/**
 * This function checks the result of merging two values in eslintrc config.
 * It uses deep strict equality to compare the actual and the expected results.
 * This is useful to ensure that the flat config merge logic behaves similarly to the old logic.
 * When eslintrc is removed, this function and its invocations can be also removed.
 * @param {Object} [first] The base object.
 * @param {Object} [second] The overrides object.
 * @param {Object} [expectedResult] The expected reults of merging first and second values.
 * @returns {void}
 */
function confirmLegacyMergeResult(first, second, expectedResult) {
    const configArray = new ConfigArray(
        { settings: first },
        { settings: second }
    );
    const config = configArray.extractConfig("/file");
    const actualResult = config.settings;

    assert.deepStrictEqual(actualResult, expectedResult);
}

describe("merge", () => {

    const { merge } = flatConfigSchema.settings;

    it("merges two objects", () => {
        const first = { foo: 42 };
        const second = { bar: "baz" };
        const result = merge(first, second);

        assert.deepStrictEqual(result, { ...first, ...second });
        confirmLegacyMergeResult(first, second, result);
    });

    it("returns an emtpy object if both values are undefined", () => {
        const result = merge(void 0, void 0);

        assert.deepStrictEqual(result, {});
        confirmLegacyMergeResult(void 0, void 0, result);
    });

    it("returns an object equal to the first one if the second one is undefined", () => {
        const first = { foo: 42, bar: "baz" };
        const result = merge(first, void 0);

        assert.deepStrictEqual(result, first);
        assert.notStrictEqual(result, first);
        confirmLegacyMergeResult(first, void 0, result);
    });

    it("returns an object equal to the second one if the first one is undefined", () => {
        const second = { foo: 42, bar: "baz" };
        const result = merge(void 0, second);

        assert.deepStrictEqual(result, second);
        assert.notStrictEqual(result, second);
        confirmLegacyMergeResult(void 0, second, result);
    });

    it("does not preserve the type of merged objects", () => {
        const first = new Set(["foo", "bar"]);
        const second = new Set(["baz"]);
        const result = merge(first, second);

        assert.deepStrictEqual(result, {});
        confirmLegacyMergeResult(first, second, result);
    });

    it("merges two objects in a property", () => {
        const first = { foo: { bar: "baz" } };
        const second = { foo: { qux: 42 } };
        const result = merge(first, second);

        assert.deepStrictEqual(result, { foo: { bar: "baz", qux: 42 } });
        confirmLegacyMergeResult(first, second, result);
    });

    it("overwrites an object in a property with an array", () => {
        const first = { someProperty: { 1: "foo", bar: "baz" } };
        const second = { someProperty: ["qux"] };
        const result = merge(first, second);

        assert.deepStrictEqual(result, second);
        assert.strictEqual(result.someProperty, second.someProperty);
    });

    it("overwrites an array in a property with another array", () => {
        const first = { someProperty: ["foo", "bar", void 0, "baz"] };
        const second = { someProperty: ["qux", void 0, 42] };
        const result = merge(first, second);

        assert.deepStrictEqual(result, second);
        assert.strictEqual(result.someProperty, second.someProperty);
    });

    it("overwrites an array in a property with an object", () => {
        const first = { foo: ["foobar"] };
        const second = { foo: { 1: "qux", bar: "baz" } };
        const result = merge(first, second);

        assert.deepStrictEqual(result, second);
        assert.strictEqual(result.foo, second.foo);
    });

    it("does not override a value in a property with undefined", () => {
        const first = { foo: { bar: "baz" } };
        const second = { foo: void 0 };
        const result = merge(first, second);

        assert.deepStrictEqual(result, first);
        assert.notStrictEqual(result, first);
        confirmLegacyMergeResult(first, second, result);
    });

    it("does not change the prototype of a merged object", () => {
        const first = { foo: 42 };
        const second = { bar: "baz", ["__proto__"]: { qux: true } };
        const result = merge(first, second);

        assert.strictEqual(Object.getPrototypeOf(result), Object.prototype);
        confirmLegacyMergeResult(first, second, result);
    });

    it("does not merge the '__proto__' property", () => {
        const first = { ["__proto__"]: { foo: 42 } };
        const second = { ["__proto__"]: { bar: "baz" } };
        const result = merge(first, second);

        assert.deepStrictEqual(result, {});
        confirmLegacyMergeResult(first, second, result);
    });

    it("overrides a value in a property with null", () => {
        const first = { foo: { bar: "baz" } };
        const second = { foo: null };
        const result = merge(first, second);

        assert.deepStrictEqual(result, second);
        assert.notStrictEqual(result, second);
        confirmLegacyMergeResult(first, second, result);
    });

    it("overrides a value in a property with a non-nullish primitive", () => {
        const first = { foo: { bar: "baz" } };
        const second = { foo: 42 };
        const result = merge(first, second);

        assert.deepStrictEqual(result, second);
        assert.notStrictEqual(result, second);
        confirmLegacyMergeResult(first, second, result);
    });

    it("overrides an object in a property with a string", () => {
        const first = { foo: { bar: "baz" } };
        const second = { foo: "qux" };
        const result = merge(first, second);

        assert.deepStrictEqual(result, second);
        assert.notStrictEqual(result, first);
        confirmLegacyMergeResult(first, second, result);
    });

    it("overrides a value in a property with a function", () => {
        const first = { someProperty: { foo: 42 } };
        const second = { someProperty() {} };
        const result = merge(first, second);

        assert.deepStrictEqual(result, second);
        assert.notProperty(result.someProperty, "foo");
        confirmLegacyMergeResult(first, second, result);
    });

    it("overrides a function in a property with an object", () => {
        const first = { someProperty: Object.assign(() => {}, { foo: "bar" }) };
        const second = { someProperty: { baz: "qux" } };
        const result = merge(first, second);

        assert.deepStrictEqual(result, second);
        assert.notProperty(result.someProperty, "foo");
        confirmLegacyMergeResult(first, second, result);
    });

    it("sets properties to undefined", () => {
        const first = { foo: void 0, bar: void 0 };
        const second = { foo: void 0, baz: void 0 };
        const result = merge(first, second);

        assert.deepStrictEqual(result, { foo: void 0, bar: void 0, baz: void 0 });
    });

    it("considers only own enumerable properties", () => {
        const first = {
            __proto__: { inherited1: "A" }, // non-own properties are not considered
            included1: "B",
            notMerged1: { first: true }
        };
        const second = {
            __proto__: { inherited2: "C" }, // non-own properties are not considered
            included2: "D",
            notMerged2: { second: true }
        };

        // non-enumerable properties are not considered
        Object.defineProperty(first, "notMerged2", { enumerable: false, value: { first: true } });
        Object.defineProperty(second, "notMerged1", { enumerable: false, value: { second: true } });

        const result = merge(first, second);

        assert.deepStrictEqual(
            result,
            {
                included1: "B",
                included2: "D",
                notMerged1: { first: true },
                notMerged2: { second: true }
            }
        );
        confirmLegacyMergeResult(first, second, result);
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
