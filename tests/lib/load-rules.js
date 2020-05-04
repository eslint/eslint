/**
 * @fileoverview Tests for loading rules from a directory
 * @author Teddy Katz
 */

"use strict";

const assert = require("chai").assert;
const loadRules = require("../../lib/load-rules");

describe("when given an invalid rules directory", () => {
    it("should throw an error", () => {
        assert.throws(() => {
            loadRules("invalidDir");
        });
    });
});

describe("when given a valid rules directory", () => {
    it("should load rules and not throw an error", () => {
        const rules = loadRules("tests/fixtures/rules", process.cwd());

        assert.strictEqual(rules["fixture-rule"], require.resolve("../../tests/fixtures/rules/fixture-rule"));
    });
});
