/**
 * @fileoverview Tests for ModuleResolver
 * @author Nicholas C. Zakas
 * @copyright 2016 Nicholas C. Zakas. All rights reserved.
 * See LICENSE in root directory for full license.
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var path = require("path"),
    assert = require("chai").assert,
    leche = require("leche"),
    ModuleResolver = require("../../../lib/util/module-resolver");

//------------------------------------------------------------------------------
// Data
//------------------------------------------------------------------------------

var FIXTURES_PATH = path.resolve(__dirname, "../../fixtures/module-resolver");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("ModuleResolver", function() {

    describe("resolve()", function() {

        leche.withData([

            // resolve just like Node.js
            [ "leche", "", require.resolve("leche") ],

            // resolve with a different location
            [ "foo", path.resolve(FIXTURES_PATH, "node_modules"), path.resolve(FIXTURES_PATH, "node_modules/foo.js")]

        ], function(name, lookupPath, expected) {
            it("should find the correct location of a file", function() {
                var resolver = new ModuleResolver(),
                    result = resolver.resolve(name, lookupPath);

                assert.equal(result, expected);
            });
        });

    });

});
