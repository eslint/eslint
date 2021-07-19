/**
 * @fileoverview Tests for unsupported-api.
 * @author Nicholas C. Zakas
 */

"use strict";

//-----------------------------------------------------------------------------
// Requirements
//-----------------------------------------------------------------------------

const assert = require("chai").assert,
    { LazyLoadingRuleMap } = require("../../lib/rules/utils/lazy-loading-rule-map"),
    api = require("../../lib/unsupported-api");

//-----------------------------------------------------------------------------
// Tests
//-----------------------------------------------------------------------------

describe("unsupported-api", () => {

    it("should have FileEnumerator exposed", () => {
        assert.isFunction(api.FileEnumerator);
    });

    it("should have builtinRules exposed", () => {
        assert.instanceOf(api.builtinRules, LazyLoadingRuleMap);
    });

});
