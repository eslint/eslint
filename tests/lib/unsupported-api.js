/**
 * @fileoverview Tests for unsupported-api.
 * @author Nicholas C. Zakas
 */

"use strict";

//-----------------------------------------------------------------------------
// Requirements
//-----------------------------------------------------------------------------

const assert = require("chai").assert,
	{
		LazyLoadingRuleMap,
	} = require("../../lib/rules/utils/lazy-loading-rule-map"),
	api = require("../../lib/unsupported-api");

//-----------------------------------------------------------------------------
// Tests
//-----------------------------------------------------------------------------

describe("unsupported-api", () => {
	it("should not have FileEnumerator exposed", () => {
		assert.isUndefined(api.FileEnumerator);
	});

	it("should not have FlatESLint exposed", () => {
		assert.isUndefined(api.FlatESLint);
	});

	it("should not have LegacyESLint exposed", () => {
		assert.isUndefined(api.LegacyESLint);
	});

	it("should not have ESLint exposed", () => {
		assert.isUndefined(api.ESLint);
	});

	it("should have shouldUseFlatConfig exposed", () => {
		assert.isFunction(api.shouldUseFlatConfig);
	});

	it("should not have FlatRuleTester exposed", () => {
		assert.isUndefined(api.FlatRuleTester);
	});

	it("should have builtinRules exposed", () => {
		assert.instanceOf(api.builtinRules, LazyLoadingRuleMap);
	});
});
