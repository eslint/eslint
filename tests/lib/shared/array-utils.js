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
        [0, 0, false],
        [0, 1, true],
        [1, 0, true],
        [[0], [0], false],
        [[0], [1], true],
        [[1], [0], true],
        [{ }, { a: 0 }, false],
        [{ a: 0 }, { a: 0 }, false],
        [{ a: 0 }, { a: 1 }, true],
        [{ a: 1 }, { a: 0 }, true],
        [{ a: 0 }, {}, true],
        [{ }, { a: [0] }, false],
        [{ a: [0] }, { a: [0] }, false],
        [{ a: [0] }, { a: [1] }, true],
        [{ a: [1] }, { a: [0] }, true],
        [{ a: [0] }, {}, true],
        ["off", "error", true],
        [0, "error", true],
        ["warn", "error", true],
        ["error", "error", false],
        [["error", { a: true }], ["error", { a: true }], false],
        [["error", { a: true }], ["error", { a: false }], true],
        [["error", { a: false }], ["error", { a: false }], false],
        [["error", { a: false }], ["error", { a: true }], true]
    ].forEach(([input, original, expected]) => {
        it(`${JSON.stringify(input)} and ${JSON.stringify(original)}`, () => {
            assert.strictEqual(
                containsDifferentProperty(input, original),
                expected
            );
        });
    });
});
