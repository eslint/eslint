/**
 * @fileoverview Tests for api.
 * @author Gyandeep Singh
 */

"use strict";

//-----------------------------------------------------------------------------
// Requirements
//-----------------------------------------------------------------------------

const assert = require("chai").assert,
    api = require("../../lib/api"),
    { FlatESLint } = require("../../lib/eslint");

//-----------------------------------------------------------------------------
// Tests
//-----------------------------------------------------------------------------

describe("api", () => {

    it("should have ESLint exposed", () => {
        assert.isFunction(api.ESLint);
    });

    it("should have RuleTester exposed", () => {
        assert.isFunction(api.RuleTester);
    });

    it("should not have CLIEngine exposed", () => {
        assert.isUndefined(api.CLIEngine);
    });

    it("should not have linter exposed", () => {
        assert.isUndefined(api.linter);
    });

    it("should have Linter exposed", () => {
        assert.isFunction(api.Linter);
    });

    it("should have SourceCode exposed", () => {
        assert.isFunction(api.SourceCode);
    });

    describe("loadESLint", () => {
        it("should be a function", () => {
            assert.isFunction(api.loadESLint);
        });

        it("should return a Promise", () => {
            assert.instanceOf(api.loadESLint(), Promise);
        });

        it("should return FlatESLint when useFlatConfig is true", async () => {
            assert.strictEqual(await api.loadESLint({ useFlatConfig: true }), FlatESLint);
        });

        it("should return ESLint when useFlatConfig is false", async () => {
            assert.strictEqual(await api.loadESLint({ useFlatConfig: false }), api.ESLint);
        });

        it("should return FlatESLint when useFlatConfig is not provided because we have eslint.config.js", async () => {
            assert.strictEqual(await api.loadESLint(), FlatESLint);
        });
    });

});
