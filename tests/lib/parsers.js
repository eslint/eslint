/**
 * @fileoverview Tests for custom parsers.
 * @author Ives van Hoorne
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("chai").assert,
    Parsers = require("../../lib/parsers");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("parsers", () => {
    let parsers = null;

    beforeEach(() => {
        parsers = new Parsers();
    });

    describe("when a custom parser is defined", () => {
        const parserId = "custom-parser";

        beforeEach(() => {
            parsers.define(parserId, {
                parse: () => {}
            });
        });

        it("should return the parser", () => {
            assert.ok(parsers.get(parserId));
        });

        it("should try to require the parser and throw", () => {
            assert.throws(() => {
                parsers.get("no-parser");
            });
        });
    });

    describe("when there is no parser defined", () => {
        it("should require the given", () => {
            assert.ok(parsers.get("esprima"));
        });
    });
});
