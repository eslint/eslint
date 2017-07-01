/**
 * @fileoverview Tests for config-schema.
 * @author Evgeny Poberezkin
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const ajv = require("../../lib/util/ajv"),
    configSchema = require("../../conf/config-schema.js"),
    assert = require("assert");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("config-schema", () => {
    it("should be valid against meta-schema", () => {
        const valid = ajv.validateSchema(configSchema);

        assert.strictEqual(valid, true);
    });
});
