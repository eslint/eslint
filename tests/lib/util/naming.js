/**
 * @fileoverview Tests for naming util
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("chai").assert,
    leche = require("leche"),
    naming = require("../../../lib/util/naming");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("naming", () => {
    describe("normalizePackageName()", () => {

        leche.withData([
            ["foo", "eslint-config-foo"],
            ["eslint-config-foo", "eslint-config-foo"],
            ["@z/foo", "@z/eslint-config-foo"],
            ["@z\\foo", "@z/eslint-config-foo"],
            ["@z\\foo\\bar.js", "@z/eslint-config-foo/bar.js"],
            ["@z/eslint-config", "@z/eslint-config"],
            ["@z/eslint-config-foo", "@z/eslint-config-foo"]
        ], (input, expected) => {
            it(`should return ${expected} when passed ${input}`, () => {
                const result = naming.normalizePackageName(input, "eslint-config");

                assert.strictEqual(result, expected);
            });
        });

    });

    describe("getShorthandName()", () => {

        leche.withData([
            ["foo", "foo"],
            ["eslint-config-foo", "foo"],
            ["@z", "@z"],
            ["@z/eslint-config", "@z"],
            ["@z/foo", "@z/foo"],
            ["@z/eslint-config-foo", "@z/foo"]
        ], (input, expected) => {
            it(`should return ${expected} when passed ${input}`, () => {
                const result = naming.getShorthandName(input, "eslint-config");

                assert.strictEqual(result, expected);
            });
        });

    });

    describe("getNamespaceFromTerm()", () => {
        it("should remove namepace when passed with namepace", () => {
            const namespace = naming.getNamespaceFromTerm("@namepace/eslint-plugin-test");

            assert.strictEqual(namespace, "@namepace/");
        });
    });
});
