/**
 * @fileoverview Tests for rule fixer.
 * @author Nicholas C. Zakas
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("chai").assert,
    ruleFixer = require("../../../lib/util/rule-fixer");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("RuleFixer", () => {

    describe("insertTextBefore", () => {

        it("should return an object with the correct information when called", () => {

            const result = ruleFixer.insertTextBefore({ range: [0, 1] }, "Hi");

            assert.deepStrictEqual(result, {
                range: [0, 0],
                text: "Hi"
            });

        });

    });

    describe("insertTextBeforeRange", () => {

        it("should return an object with the correct information when called", () => {

            const result = ruleFixer.insertTextBeforeRange([0, 1], "Hi");

            assert.deepStrictEqual(result, {
                range: [0, 0],
                text: "Hi"
            });

        });

    });

    describe("insertTextAfter", () => {

        it("should return an object with the correct information when called", () => {

            const result = ruleFixer.insertTextAfter({ range: [0, 1] }, "Hi");

            assert.deepStrictEqual(result, {
                range: [1, 1],
                text: "Hi"
            });

        });

    });

    describe("insertTextAfterRange", () => {

        it("should return an object with the correct information when called", () => {

            const result = ruleFixer.insertTextAfterRange([0, 1], "Hi");

            assert.deepStrictEqual(result, {
                range: [1, 1],
                text: "Hi"
            });

        });

    });

    describe("removeAfter", () => {

        it("should return an object with the correct information when called", () => {

            const result = ruleFixer.remove({ range: [0, 1] });

            assert.deepStrictEqual(result, {
                range: [0, 1],
                text: ""
            });

        });

    });

    describe("removeAfterRange", () => {

        it("should return an object with the correct information when called", () => {

            const result = ruleFixer.removeRange([0, 1]);

            assert.deepStrictEqual(result, {
                range: [0, 1],
                text: ""
            });

        });

    });


    describe("replaceText", () => {

        it("should return an object with the correct information when called", () => {

            const result = ruleFixer.replaceText({ range: [0, 1] }, "Hi");

            assert.deepStrictEqual(result, {
                range: [0, 1],
                text: "Hi"
            });

        });

    });

    describe("replaceTextRange", () => {

        it("should return an object with the correct information when called", () => {

            const result = ruleFixer.replaceTextRange([0, 1], "Hi");

            assert.deepStrictEqual(result, {
                range: [0, 1],
                text: "Hi"
            });

        });

    });

});
