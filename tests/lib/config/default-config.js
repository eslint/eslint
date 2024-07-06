/**
 * @fileoverview Tests for defaultConfig
 */

"use strict";

//-----------------------------------------------------------------------------
// Requirements
//-----------------------------------------------------------------------------

const { FlatConfigArray } = require("../../../lib/config/flat-config-array");
const assert = require("chai").assert;

//-----------------------------------------------------------------------------
// Tests
//-----------------------------------------------------------------------------

describe("defaultConfig", () => {
    it("should default to 'module' as sourceType if not specified in package.json", () => {
        const configs = new FlatConfigArray([]);

        configs.normalizeSync();

        const config = configs.getConfig("foo.js");

        assert.strictEqual("module", config.languageOptions.sourceType);
    });
});
