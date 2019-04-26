/**
 * @fileoverview Tests for JSON reporter.
 * @author Chris Meyer
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("chai").assert,
    formatter = require("../../../../lib/cli-engine/formatters/json-with-metadata");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("formatter:json", () => {
    const rulesMeta = {
        foo: {
            type: "problem",

            docs: {
                description: "This is rule 'foo'",
                category: "error",
                recommended: true,
                url: "https://eslint.org/docs/rules/foo"
            },

            fixable: "code",

            messages: {
                message1: "This is a message for rule 'foo'."
            }
        },
        bar: {
            type: "suggestion",

            docs: {
                description: "This is rule 'bar'",
                category: "error",
                recommended: false
            },

            messages: {
                message1: "This is a message for rule 'bar'."
            }
        }
    };
    const code = {
        results: [{
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
        }],
        metadata: {
            rulesMeta
        }
    };

    it("should return passed results and data as a JSON string without any modification", () => {
        const result = JSON.parse(formatter(code.results, code.metadata));

        assert.deepStrictEqual(result, code);
    });
});
