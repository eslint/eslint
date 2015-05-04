/**
 * @fileoverview Tests for validate-options.
 * @author Brandon Mills
 * @copyright 2015 Brandon Mills
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var assert = require("chai").assert,
    validate = require("../../lib/validate-options");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("ValidateOptions", function() {

    it("should throw for nonexistent rules", function() {
        var fn = validate.bind(null, "non-existent-rule", 2, "tests");

        assert.throws(fn, "tests:\n\tDefinition for rule \"non-existent-rule\" was not found.\n");
    });

    it("should throw for incorrect warning level", function() {
        var fn = validate.bind(null, "quotes", 3, "tests");

        assert.throws(fn, "tests:\n\tConfiguration for rule \"quotes\" is invalid:\n\tValue \"3\" must be an enum value.\n");
    });

    it("should throw for incorrect configuration values", function() {
        var fn = validate.bind(null, "quotes", [2, "doulbe", "avoidEscape"], "tests");

        assert.throws(fn, "tests:\n\tConfiguration for rule \"quotes\" is invalid:\n\tValue \"doulbe\" must be an enum value.\n\tValue \"avoidEscape\" must be an enum value.\n");
    });

    it("should throw for too many configuration values", function() {
        var fn = validate.bind(null, "no-with", [2, "smart"], "tests");

        assert.throws(fn, "tests:\n\tConfiguration for rule \"no-with\" is invalid:\n\tValue \"2,smart\" has more items than allowed.\n");
    });

    it("should skip plugin rules", function() {
        var fn = validate.bind(null, "plugin/rule", 3, "tests");

        assert.doesNotThrow(fn);
    });

});
