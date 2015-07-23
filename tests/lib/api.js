/**
 * @fileoverview Tests for api.
 * @author Gyandeep Singh
 */

"use strict";

var assert = require("chai").assert,
    api = require("../../lib/api");

describe("api", function() {
    it("should contain 4 exposed keys", function() {
        assert.lengthOf(Object.keys(api), 4);
    });
});
