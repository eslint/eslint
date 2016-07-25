/**
 * @fileoverview Tests for rule fixer.
 * @author Nicholas C. Zakas
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

let assert = require("chai").assert,
    RuleFixer = require("../../../lib/util/rule-fixer");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("RuleFixer", function() {

    let fixer;

    beforeEach(function() {
        fixer = new RuleFixer();
    });

    describe("insertTextBefore", function() {

        it("should return an object with the correct information when called", function() {

            let result = fixer.insertTextBefore({ range: [0, 1] }, "Hi");

            assert.deepEqual(result, {
                range: [0, 0],
                text: "Hi"
            });

        });

    });

    describe("insertTextBeforeRange", function() {

        it("should return an object with the correct information when called", function() {

            let result = fixer.insertTextBeforeRange([0, 1], "Hi");

            assert.deepEqual(result, {
                range: [0, 0],
                text: "Hi"
            });

        });

    });

    describe("insertTextAfter", function() {

        it("should return an object with the correct information when called", function() {

            let result = fixer.insertTextAfter({ range: [0, 1] }, "Hi");

            assert.deepEqual(result, {
                range: [1, 1],
                text: "Hi"
            });

        });

    });

    describe("insertTextAfterRange", function() {

        it("should return an object with the correct information when called", function() {

            let result = fixer.insertTextAfterRange([0, 1], "Hi");

            assert.deepEqual(result, {
                range: [1, 1],
                text: "Hi"
            });

        });

    });

    describe("removeAfter", function() {

        it("should return an object with the correct information when called", function() {

            let result = fixer.remove({ range: [0, 1] });

            assert.deepEqual(result, {
                range: [0, 1],
                text: ""
            });

        });

    });

    describe("removeAfterRange", function() {

        it("should return an object with the correct information when called", function() {

            let result = fixer.removeRange([0, 1]);

            assert.deepEqual(result, {
                range: [0, 1],
                text: ""
            });

        });

    });


    describe("replaceText", function() {

        it("should return an object with the correct information when called", function() {

            let result = fixer.replaceText({ range: [0, 1] }, "Hi");

            assert.deepEqual(result, {
                range: [0, 1],
                text: "Hi"
            });

        });

    });

    describe("replaceTextRange", function() {

        it("should return an object with the correct information when called", function() {

            let result = fixer.replaceTextRange([0, 1], "Hi");

            assert.deepEqual(result, {
                range: [0, 1],
                text: "Hi"
            });

        });

    });

});
