/**
 * @fileoverview Tests for eslint:recommended.
 * @author Kevin Partington
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("node:assert");
const eslintRecommended = require("../../packages/js").configs.recommended;
const rules = eslintRecommended.rules;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("eslint-recommended", () => {
	it("should configure recommended rules as error", () => {
		assert.strictEqual(rules["no-undef"], "error");
	});

	it("should not configure non-recommended rules", () => {
		assert.ok(!("camelcase" in rules));
	});
});
