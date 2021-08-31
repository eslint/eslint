/**
 * @fileoverview Tests for config-schema.
 * @author Evgeny Poberezkin
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const configSchema = require("../../conf/config-schema.js"),
    assert = require("assert");

const ajv = require("../../lib/shared/ajv")();

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("config-schema", () => {
    it("should be valid against meta-schema", () => {
        const valid = ajv.validateSchema(configSchema);

        assert.strictEqual(valid, true);
    });
});
