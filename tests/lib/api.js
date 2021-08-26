/**
 * @fileoverview Tests for api.
 * @author Gyandeep Singh
 */

"use strict";

//-----------------------------------------------------------------------------
// Requirements
//-----------------------------------------------------------------------------

const assert = require("chai").assert,
    api = require("../../lib/api");

//-----------------------------------------------------------------------------
// Tests
//-----------------------------------------------------------------------------

describe("api", () => {

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
});
