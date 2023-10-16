/* eslint-disable no-undefined -- `null` and `undefined` are different in options */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("assert");
const { deepMerge } = require("../../../lib/linter/deep-merge");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

/**
 * Turns a value into its string equivalent for a test name.
 * @param {unknown} value Value to be stringified.
 * @returns {string} String equivalent of the value.
 */
function stringify(value) {
    return typeof value === "object" ? JSON.stringify(value) : `${value}`;
}

describe("deepMerge", () => {
    for (const [first, second, result] of [
        [undefined, undefined, undefined],
        [undefined, null, null],
        [null, undefined, null],
        [null, null, null],
        [{}, null, null],
        [null, {}, null],
        [null, "abc", "abc"],
        [null, 123, 123],
        [{ a: undefined }, { a: 0 }, { a: 0 }],
        [{ a: null }, { a: 0 }, { a: 0 }],
        [{ a: 0 }, { a: 1 }, { a: 1 }],
        [{ a: 0 }, { a: null }, { a: null }],
        [{ a: 0 }, { a: undefined }, { a: 0 }],
        [{ a: ["b"] }, { a: ["c"] }, { a: ["c"] }],
        [{ a: [{ b: "c" }] }, { a: [{ d: "e" }] }, { a: [{ d: "e" }] }],
        [{ a: 0 }, "abc", "abc"],
        [{ a: 0 }, 123, 123],
        [123, undefined, 123],
        [123, null, null],
        [123, { a: 0 }, { a: 0 }],
        ["abc", undefined, "abc"],
        ["abc", null, null],
        ["abc", { a: 0 }, { a: 0 }],
        [["abc"], undefined, ["abc"]],
        [["abc"], null, null],
        [[], ["def"], []],
        [["abc"], ["def"], ["abc"]]
    ]) {
        it(`${stringify(first)}, ${stringify(second)}`, () => {
            assert.deepStrictEqual(deepMerge(first, second), result);
        });
    }
});

/* eslint-enable no-undefined -- `null` and `undefined` are different in options */
