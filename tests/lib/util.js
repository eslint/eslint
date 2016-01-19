/**
 * @fileoverview Tests for util.
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var assert = require("chai").assert,
    util = require("../../lib/util");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("util", function() {


    describe("getLast()", function() {
        it("should return the last item in the array", function() {
            var items = [1, 2, 3];
            assert.equal(util.getLast(items), 3);
        });
    });

});
