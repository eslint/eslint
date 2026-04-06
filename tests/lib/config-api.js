/**
 * @fileoverview Tests for config-api.
 * @author Milos Djermanovic
 */

"use strict";

//-----------------------------------------------------------------------------
// Requirements
//-----------------------------------------------------------------------------

const assert = require("chai").assert,
	api = require("../../lib/config-api");

//-----------------------------------------------------------------------------
// Tests
//-----------------------------------------------------------------------------

describe("config-api", () => {
	it("should have defineConfig exposed", () => {
		assert.isFunction(api.defineConfig);
	});

	it("should have globalIgnores exposed", () => {
		assert.isFunction(api.globalIgnores);
	});
});
