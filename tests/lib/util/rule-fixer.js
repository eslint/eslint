/**
 * @fileoverview Tests for rule fixer.
 * @author Nicholas C. Zakas
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("chai").assert,
    RuleFixer = require("../../../lib/util/rule-fixer");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("RuleFixer", () => {

    let fixer;

    beforeEach(() => {
        fixer = new RuleFixer();
    });

    describe("insertTextBefore", () => {

        it("should return an object with the correct information when called", () => {

            const result = fixer.insertTextBefore({ range: [0, 1] }, "Hi");

            assert.deepEqual(result, {
                range: [0, 0],
                text: "Hi"
            });

        });

    });

    describe("insertTextBeforeRange", () => {

        it("should return an object with the correct information when called", () => {

            const result = fixer.insertTextBeforeRange([0, 1], "Hi");

            assert.deepEqual(result, {
                range: [0, 0],
                text: "Hi"
            });

        });

    });

    describe("insertTextAfter", () => {

        it("should return an object with the correct information when called", () => {

            const result = fixer.insertTextAfter({ range: [0, 1] }, "Hi");

            assert.deepEqual(result, {
                range: [1, 1],
                text: "Hi"
            });

        });

    });

    describe("insertTextAfterRange", () => {

        it("should return an object with the correct information when called", () => {

            const result = fixer.insertTextAfterRange([0, 1], "Hi");

            assert.deepEqual(result, {
                range: [1, 1],
                text: "Hi"
            });

        });

    });

    describe("removeAfter", () => {

        it("should return an object with the correct information when called", () => {

            const result = fixer.remove({ range: [0, 1] });

            assert.deepEqual(result, {
                range: [0, 1],
                text: ""
            });

        });

    });

    describe("removeAfterRange", () => {

        it("should return an object with the correct information when called", () => {

            const result = fixer.removeRange([0, 1]);

            assert.deepEqual(result, {
                range: [0, 1],
                text: ""
            });

        });

    });


    describe("replaceText", () => {

        it("should return an object with the correct information when called", () => {

            const result = fixer.replaceText({ range: [0, 1] }, "Hi");

            assert.deepEqual(result, {
                range: [0, 1],
                text: "Hi"
            });

        });

    });

    describe("replaceTextRange", () => {

        it("should return an object with the correct information when called", () => {

            const result = fixer.replaceTextRange([0, 1], "Hi");

            assert.deepEqual(result, {
                range: [0, 1],
                text: "Hi"
            });

        });

    });

});
