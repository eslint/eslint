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

    describe("removePrefixFromTerm()", () => {
        it("should remove prefix when passed a term with a prefix", () => {
            const pluginName = naming.removePrefixFromTerm("eslint-plugin-", "eslint-plugin-test");

            assert.strictEqual(pluginName, "test");
        });

        it("should not modify term when passed a term without a prefix", () => {
            const pluginName = naming.removePrefixFromTerm("eslint-plugin-", "test");

            assert.strictEqual(pluginName, "test");
        });
    });

    describe("addPrefixToTerm()", () => {
        it("should add prefix when passed a term without a prefix", () => {
            const pluginName = naming.addPrefixToTerm("eslint-plugin-", "test");

            assert.strictEqual(pluginName, "eslint-plugin-test");
        });

        it("should not modify term when passed a term with a prefix", () => {
            const pluginName = naming.addPrefixToTerm("eslint-plugin-", "eslint-plugin-test");

            assert.strictEqual(pluginName, "eslint-plugin-test");
        });
    });

    describe("getNamespaceFromTerm()", () => {
        it("should remove namepace when passed with namepace", () => {
            const namespace = naming.getNamespaceFromTerm("@namepace/eslint-plugin-test");

            assert.strictEqual(namespace, "@namepace/");
        });
    });

    describe("removeNamespaceFromTerm()", () => {
        it("should remove namepace when passed with namepace", () => {
            const namespace = naming.removeNamespaceFromTerm("@namepace/eslint-plugin-test");

            assert.strictEqual(namespace, "eslint-plugin-test");
        });
    });
});
