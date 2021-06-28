/**
 * @fileoverview Tests ts utils.
 * @author Pouya MozaffarMagham
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const
    assert = require("chai").assert,
    sinon = require("sinon"),
    { defineInMemoryFs } = require("../../_utils");

const proxyquire = require("proxyquire").noCallThru().noPreserveCache();

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Import `ts-utils` with the in-memory file system.
 * @param {Object} files The file definitions.
 * @returns {Object} `ts-utils`.
 */
function requireTsUtilsWithInMemoryFileSystem(files) {
    const fs = defineInMemoryFs({ files });

    return proxyquire("../../../lib/init/ts-utils", { fs });
}

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("tsUtils", () => {
    afterEach(() => {
        sinon.verifyAndRestore();
    });
    describe("checkTsConfig()", () => {
        it("should return true if tsconfig.json exists", () => {
            const stubbedTsUtils = requireTsUtilsWithInMemoryFileSystem({
                "tsconfig.json": "{ \"file\": \"contents\" }"
            });

            assert.strictEqual(stubbedTsUtils.checkTsConfig(), true);
        });

        it("should return false if tsconfig.json does not exist", () => {
            const stubbedTsUtils = requireTsUtilsWithInMemoryFileSystem({});

            assert.strictEqual(stubbedTsUtils.checkTsConfig(), false);
        });
    });
});
