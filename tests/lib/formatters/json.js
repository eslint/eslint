/**
 * @fileoverview Tests for JSON reporter.
 * @author Burak Yigit Kaya aka BYK
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("chai").assert,
    formatter = require("../../../lib/formatters/json");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("formatter:json", () => {
    const code = [{
        filePath: "foo.js",
        messages: [{
            message: "Unexpected foo.",
            severity: 2,
            line: 5,
            column: 10,
            ruleId: "foo"
        }]
    }, {
        filePath: "bar.js",
        messages: [{
            message: "Unexpected bar.",
            severity: 1,
            line: 6,
            column: 11,
            ruleId: "bar"
        }]
    }];

    it("should return passed results as a JSON string without any modification", () => {
        const result = JSON.parse(formatter(code));

        assert.deepStrictEqual(result, code);
    });
});
