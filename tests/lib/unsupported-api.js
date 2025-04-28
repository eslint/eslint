/**
 * @fileoverview Tests for unsupported-api.
 * @author Nicholas C. Zakas
 */

"use strict";

//-----------------------------------------------------------------------------
// Requirements
//-----------------------------------------------------------------------------

const assert = require("node:assert"),
	{
		LazyLoadingRuleMap,
	} = require("../../lib/rules/utils/lazy-loading-rule-map"),
	api = require("../../lib/unsupported-api");

//-----------------------------------------------------------------------------
// Tests
//-----------------------------------------------------------------------------

describe("unsupported-api", () => {
	it("should have FileEnumerator exposed", () => {
		assert.strictEqual(typeof api.FileEnumerator, "function");
	});

	it("should have FlatESLint exposed", () => {
		assert.strictEqual(typeof api.FlatESLint, "function");
	});

	it("should have LegacyESLint exposed", () => {
		assert.strictEqual(typeof api.LegacyESLint, "function");
	});

	it("should not have ESLint exposed", () => {
		assert.strictEqual(typeof api.ESLint, "undefined");
	});

	it("should have shouldUseFlatConfig exposed", () => {
		assert.strictEqual(typeof api.shouldUseFlatConfig, "function");
	});

	it("should not have FlatRuleTester exposed", () => {
		assert.strictEqual(typeof api.FlatRuleTester, "undefined");
	});

	it("should have builtinRules exposed", () => {
		assert.ok(api.builtinRules instanceof LazyLoadingRuleMap);
	});
});
