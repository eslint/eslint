/* eslint-disable no-undefined -- `null` and `undefined` are different in options */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("node:assert");
const { deepMergeArrays } = require("../../../lib/shared/deep-merge-arrays");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

/**
 * Turns a value into its string equivalent for a test name.
 * @param {unknown} value Value to be stringified.
 * @returns {string} String equivalent of the value.
 */
function toTestCaseName(value) {
    return typeof value === "object" ? JSON.stringify(value) : `${value}`;
}

describe("deepMerge", () => {
    for (const [first, second, result] of [
        [[], undefined, []],
        [["abc"], undefined, ["abc"]],
        [undefined, ["abc"], ["abc"]],
        [[], ["abc"], ["abc"]],
        [[undefined], ["abc"], ["abc"]],
        [[undefined, undefined], ["abc"], ["abc", undefined]],
        [[undefined, undefined], ["abc", "def"], ["abc", "def"]],
        [[undefined, null], ["abc"], ["abc", null]],
        [[undefined, null], ["abc", "def"], ["abc", "def"]],
        [[null], ["abc"], ["abc"]],
        [[123], [undefined], [123]],
        [[123], [null], [null]],
        [[123], [{ a: 0 }], [{ a: 0 }]],
        [["abc"], [undefined], ["abc"]],
        [["abc"], [null], [null]],
        [["abc"], ["def"], ["def"]],
        [["abc"], [{ a: 0 }], [{ a: 0 }]],
        [[["abc"]], [null], [null]],
        [[["abc"]], ["def"], ["def"]],
        [[["abc"]], [{ a: 0 }], [{ a: 0 }]],
        [[{ abc: true }], ["def"], ["def"]],
        [[{ abc: true }], [["def"]], [["def"]]],
        [[null], [{ abc: true }], [{ abc: true }]],
        [[{ a: undefined }], [{ a: 0 }], [{ a: 0 }]],
        [[{ a: null }], [{ a: 0 }], [{ a: 0 }]],
        [[{ a: null }], [{ a: { b: 0 } }], [{ a: { b: 0 } }]],
        [[{ a: 0 }], [{ a: 1 }], [{ a: 1 }]],
        [[{ a: 0 }], [{ a: null }], [{ a: null }]],
        [[{ a: 0 }], [{ a: undefined }], [{ a: 0 }]],
        [[{ a: 0 }], ["abc"], ["abc"]],
        [[{ a: 0 }], [123], [123]],
        [[[{ a: 0 }]], [123], [123]],
        [
            [{ a: ["b"] }],
            [{ a: ["c"] }],
            [{ a: ["c"] }]
        ],
        [
            [{ a: [{ b: "c" }] }],
            [{ a: [{ d: "e" }] }],
            [{ a: [{ d: "e" }] }]
        ],
        [
            [{ a: { b: "c" }, d: true }],
            [{ a: { e: "f" } }],
            [{ a: { b: "c", e: "f" }, d: true }]
        ],
        [
            [{ a: { b: "c" } }],
            [{ a: { e: "f" }, d: true }],
            [{ a: { b: "c", e: "f" }, d: true }]
        ],
        [
            [{ a: { b: "c" } }, { d: true }],
            [{ a: { e: "f" } }, { f: 123 }],
            [{ a: { b: "c", e: "f" } }, { d: true, f: 123 }]
        ],
        [
            [{ hasOwnProperty: true }],
            [{}],
            [{ hasOwnProperty: true }]
        ],
        [
            [{ hasOwnProperty: false }],
            [{}],
            [{ hasOwnProperty: false }]
        ],
        [
            [{ hasOwnProperty: null }],
            [{}],
            [{ hasOwnProperty: null }]
        ],
        [
            [{ hasOwnProperty: undefined }],
            [{}],
            [{ hasOwnProperty: undefined }]
        ],
        [
            [{}],
            [{ hasOwnProperty: null }],
            [{ hasOwnProperty: null }]
        ],
        [
            [{}],
            [{ hasOwnProperty: undefined }],
            [{ hasOwnProperty: undefined }]
        ],
        [
            [{
                allow: [],
                ignoreDestructuring: false,
                ignoreGlobals: false,
                ignoreImports: false,
                properties: "always"
            }],
            [],
            [{
                allow: [],
                ignoreDestructuring: false,
                ignoreGlobals: false,
                ignoreImports: false,
                properties: "always"
            }]
        ]
    ]) {
        it(`${toTestCaseName(first)}, ${toTestCaseName(second)}`, () => {
            assert.deepStrictEqual(deepMergeArrays(first, second), result);
        });
    }
});

/* eslint-enable no-undefined -- `null` and `undefined` are different in options */
