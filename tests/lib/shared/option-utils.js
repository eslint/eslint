/**
 * @fileoverview Tests for string utils.
 * @author Josh Goldberg
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("node:assert");

const {
    containsDifferentProperty
} = require("../../../lib/shared/option-utils");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("containsDifferentProperty", () => {
    [
        [null, null, false],
        [null, {}, true],
        [{}, null, true],
        [null, null, false],
        [null, void 0, true],
        [void 0, null, true],
        [void 0, {}, true],
        [{}, void 0, true],
        [0, 0, false],
        [0, 1, true],
        [1, 0, true],
        [[], {}, true],
        [{}, [], true],
        [[0], [0], false],
        [[0], [1], true],
        [[1], [0], true],
        [[null], [0], true],
        [[null], [null], false],
        [[0], [null], true],
        [{ }, { a: 0 }, true],
        [{ a: null }, { a: null }, false],
        [{ a: null }, { a: void 0 }, true],
        [{ a: null }, { a: 0 }, true],
        [{ a: void 0 }, { a: null }, true],
        [{ a: void 0 }, { a: void 0 }, false],
        [{ a: void 0 }, { a: 0 }, true],
        [{ a: 0 }, { a: 0 }, false],
        [{ a: 0 }, { a: 1 }, true],
        [{ a: 1 }, { a: 0 }, true],
        [{ a: 0 }, {}, true],
        [{ }, { a: [0] }, true],
        [{ }, { a: null }, true],
        [{ }, { a: void 0 }, true],
        [{ a: [null] }, { a: [null] }, false],
        [{ a: [null] }, { a: [void 0] }, true],
        [{ a: [null] }, { a: [0] }, true],
        [{ a: [void 0] }, { a: [0] }, true],
        [{ a: [void 0] }, { a: [null] }, true],
        [{ a: [void 0] }, { a: [void 0] }, false],
        [{ a: [0] }, { a: [0] }, false],
        [{ a: [0] }, { a: [1] }, true],
        [{ a: [1] }, { a: [0] }, true],
        [{ a: [0] }, {}, true],
        [{ a: null }, {}, true],
        [{ a: void 0 }, {}, true],
        ["off", "error", true],
        [0, "error", true],
        ["warn", "error", true],
        ["error", "error", false],
        [["error", { a: true }], ["error", { a: true }], false],
        [["error", { a: true }], ["error", { a: false }], true],
        [["error", { a: false }], ["error", { a: false }], false],
        [["error", { a: false }], ["error", { a: true }], true],
        [
            ["foo"],
            ["foo", "bar"],
            true
        ],
        [
            ["foo", "bar"],
            ["foo"],
            true
        ],
        [
            ["foo", "bar"],
            ["foo", "bar"],
            false
        ],
        [
            { a: "b" },
            { a: "b", c: "d" },
            true
        ],
        [
            { a: "b", c: "d" },
            { a: "b" },
            true
        ],
        [
            { a: "b", c: "d" },
            { a: "b", c: "d" },
            false
        ]
    ].forEach(([input, original, expected]) => {
        it(`${JSON.stringify(input)} and ${JSON.stringify(original)}`, () => {
            assert.strictEqual(
                containsDifferentProperty(input, original),
                expected
            );
        });
    });
});
