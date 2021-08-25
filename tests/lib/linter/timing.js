"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const { getListSize } = require("../../../lib/linter/timing");
const assert = require("chai").assert;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("timing", () => {
    describe("getListSize()", () => {
        after(() => {
            delete process.env.TIMING;
        });

        it("returns minimum list size with small environment variable value", () => {
            delete process.env.TIMING; // With no value.
            assert.strictEqual(getListSize(), 10);

            process.env.TIMING = "true";
            assert.strictEqual(getListSize(), 10);

            process.env.TIMING = "foo";
            assert.strictEqual(getListSize(), 10);

            process.env.TIMING = "0";
            assert.strictEqual(getListSize(), 10);

            process.env.TIMING = "1";
            assert.strictEqual(getListSize(), 10);

            process.env.TIMING = "5";
            assert.strictEqual(getListSize(), 10);

            process.env.TIMING = "10";
            assert.strictEqual(getListSize(), 10);
        });

        it("returns longer list size with larger environment variable value", () => {
            process.env.TIMING = "11";
            assert.strictEqual(getListSize(), 11);

            process.env.TIMING = "100";
            assert.strictEqual(getListSize(), 100);
        });

        it("returns maximum list size with environment variable value of 'all'", () => {
            process.env.TIMING = "all";
            assert.strictEqual(getListSize(), Number.POSITIVE_INFINITY);

            process.env.TIMING = "ALL";
            assert.strictEqual(getListSize(), Number.POSITIVE_INFINITY);
        });
    });
});
