/**
 * @fileoverview Tests for string utils.
 * @author Stephen Wade
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("chai").assert;

const { upperCaseFirst, getGraphemeCount } = require("../../../lib/shared/string-utils");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Replaces raw control characters with the `\xXX` form.
 * @param {string} text The text to process.
 * @returns {string} `text` with escaped control characters.
 */
function escapeControlCharacters(text) {
    return text.replace(
        /[\u0000-\u001F\u007F-\u009F]/gu, // eslint-disable-line no-control-regex -- intentionally including control characters
        c => `\\x${c.codePointAt(0).toString(16).padStart(2, "0")}`
    );
}

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("upperCaseFirst", () => {
    it("uppercases the first letter of a string", () => {
        assert(upperCaseFirst("e") === "E");
        assert(upperCaseFirst("alphabet") === "Alphabet");
        assert(upperCaseFirst("one two three") === "One two three");
    });

    it("only changes the case of the first letter", () => {
        assert(upperCaseFirst("alphaBet") === "AlphaBet");
        assert(upperCaseFirst("one TWO three") === "One TWO three");
    });

    it("does not change the case if the first letter is already uppercase", () => {
        assert(upperCaseFirst("E") === "E");
        assert(upperCaseFirst("Alphabet") === "Alphabet");
        assert(upperCaseFirst("One Two Three") === "One Two Three");
    });

    it("properly handles an empty string", () => {
        assert(upperCaseFirst("") === "");
    });
});

describe("getGraphemeCount", () => {
    /* eslint-disable quote-props -- Make consistent here for readability */
    const expectedResults = {
        "": 0,
        "a": 1,
        "ab": 2,
        "aa": 2,
        "123": 3,
        "cccc": 4,
        [Array.from({ length: 128 }, (_, i) => String.fromCharCode(i)).join("")]: 128, // all ASCII characters
        "👍": 1, // 1 grapheme, 1 code point, 2 code units
        "👍👍": 2,
        "👍9👍": 3,
        "a👍b": 3,
        "👶🏽": 1, // 1 grapheme, 2 code points, 4 code units
        "👨‍👩‍👦": 1, // 1 grapheme, 5 code points, 8 code units
        "👨‍👩‍👦👨‍👩‍👦": 2,
        "👨‍👩‍👦a👨‍👩‍👦": 3,
        "a👨‍👩‍👦b👨‍👩‍👦c": 5,
        "👨‍👩‍👦👍": 2,
        "👶🏽👨‍👩‍👦": 2,
        "👩‍🦰👩‍👩‍👦‍👦🏳️‍🌈": 3 // 3 grapheme, 14 code points, 22 code units
    };
    /* eslint-enable quote-props -- Make consistent here for readability */

    Object.entries(expectedResults).forEach(([key, value]) => {
        it(`should return ${value} for ${escapeControlCharacters(key)}`, () => {
            assert.strictEqual(getGraphemeCount(key), value);
        });
    });
});
