/**
 * @fileoverview Tests for SourceCode object.
 * @author Tom Clarkson
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var assert = require("chai").assert,
    SourceCode = require("../../lib/sourcecode");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("SourceCode", function() {

    describe("when given valid text and parse result", function() {
        var code = new SourceCode(
            "foo()\n    alert('test')",
            require("../fixtures/parseresults/foo-alert.json")
            );
        var messages = code.validate();
        it("should not log an error", function() {
            assert.equal(messages.length, 0);
        });
    });

    describe("when given blank input and no parse result", function() {
        var code = new SourceCode(
            "",
            null
            );
        var messages = code.validate();
        it("should not log an error", function() {
            assert.equal(messages.length, 0);
        });
    });

    describe("when given unparsed text", function() {
        var code = new SourceCode(
            "foo()\n    alert('test')",
            null
            );
        var messages = code.validate();
        it("should log an error", function() {
            assert.equal(messages.length, 1);
        });
    });

    describe("when given a parse result without text", function() {
        var code = new SourceCode(
            "",
            require("../fixtures/parseresults/foo-alert.json")
            );
        var messages = code.validate();
        it("should log an error", function() {
            assert.equal(messages.length, 1);
        });
    });

    describe("when given an incomplete parse result", function() {
        var code = new SourceCode(
            "foo()\n    alert('test')",
            require("../fixtures/parseresults/incomplete.json")
            );
        var messages = code.validate();
        it("should log an error", function() {
            assert.equal(messages.length, 1);
        });
    });

    describe("when given a parse error", function() {
        var code = new SourceCode(
            "foo()\n    alert('test')",
            new Error("Something went wrong.")
            );
        var messages = code.validate();
        it("should log an error", function() {
            assert.equal(messages.length, 1);
        });
    });


});
