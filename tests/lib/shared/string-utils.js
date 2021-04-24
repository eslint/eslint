/**
 * @fileoverview Tests for string utils.
 * @author Stephen Wade
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("chai").assert;

const { upperCaseFirst } = require("../../../lib/shared/string-utils");

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
