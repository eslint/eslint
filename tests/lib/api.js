/**
 * @fileoverview Tests for api.
 * @author Gyandeep Singh
 */

"use strict";

const assert = require("chai").assert,
    api = require("../../lib/api");

describe("api", () => {

    it("should have RuleTester exposed", () => {
        assert.isFunction(api.RuleTester);
    });

    it("should have CLIEngine exposed", () => {
        assert.isFunction(api.CLIEngine);
    });

    it("should have linter exposed", () => {
        assert.isObject(api.linter);
    });

    it("should have SourceCode exposed", () => {
        assert.isFunction(api.SourceCode);
    });
});
