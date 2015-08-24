/**
 * @fileoverview Tests for api.
 * @author Gyandeep Singh
 * @copyright 2015 Gyandeep Singh. All rights reserved.
 * See LICENSE file in root directory for full license.
 */

"use strict";

var assert = require("chai").assert,
    api = require("../../lib/api");

describe("api", function() {

    it("should have RuleTester exposed", function() {
        assert.isFunction(api.RuleTester);
    });

    it("should have CLIEngine exposed", function() {
        assert.isFunction(api.CLIEngine);
    });

    it("should have linter exposed", function() {
        assert.isObject(api.linter);
    });

    it("should have SourceCode exposed", function() {
        assert.isFunction(api.SourceCode);
    });
});
