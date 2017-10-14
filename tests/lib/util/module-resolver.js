/**
 * @fileoverview Tests for ModuleResolver
 * @author Nicholas C. Zakas
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const path = require("path"),
    assert = require("chai").assert,
    leche = require("leche"),
    ModuleResolver = require("../../../lib/util/module-resolver");

//------------------------------------------------------------------------------
// Data
//------------------------------------------------------------------------------

const FIXTURES_PATH = path.resolve(__dirname, "../../fixtures/module-resolver");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("ModuleResolver", () => {

    describe("resolve()", () => {

        leche.withData([

            // resolve just like Node.js
            ["leche", "", require.resolve("leche")],

            // resolve with a different location
            ["foo", path.resolve(FIXTURES_PATH, "node_modules"), path.resolve(FIXTURES_PATH, "node_modules/foo.js")]

        ], (name, lookupPath, expected) => {
            it("should find the correct location of a file", () => {
                const resolver = new ModuleResolver(),
                    result = resolver.resolve(name, lookupPath);

                assert.strictEqual(result, expected);
            });
        });

    });

});
