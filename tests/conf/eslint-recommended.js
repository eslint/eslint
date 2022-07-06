/**
 * @fileoverview Tests for eslint:recommended.
 * @author Kevin Partington
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("chai").assert;
const eslintRecommended = require("../../conf/eslint-recommended");
const rules = eslintRecommended.rules;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("eslint-recommended", () => {
    it("should configure recommended rules as error", () => {
        assert.strictEqual(rules["no-undef"], "error");
    });

    it("should not configure non-recommended rules", () => {
        assert.notProperty(rules, "camelcase");
    });
});
