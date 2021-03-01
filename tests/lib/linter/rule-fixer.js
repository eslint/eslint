/**
 * @fileoverview Tests for rule fixer.
 * @author Nicholas C. Zakas
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("chai").assert,
    sinon = require("sinon");

const proxyquire = require("proxyquire").noCallThru().noPreserveCache();

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("RuleFixer", () => {
    const log = {
        info: sinon.spy(),
        error: sinon.spy()
    };
    const ruleFixer = proxyquire("../../../lib/linter/rule-fixer", {
        "../shared/logging": log
    });

    afterEach(() => {
        log.info.resetHistory();
        log.error.resetHistory();
    });

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

    describe("validation", () => {
        it("should return null given non-numeric indices", () => {
            const invalidRanges = [
                [0, null],
                ["1", 2],
                [void 0, void 0],
                [1]
            ];
            const functions = [
                (range, text) => ruleFixer.insertTextBefore({ range }, text),
                (range, text) => ruleFixer.insertTextBeforeRange(range, text),
                (range, text) => ruleFixer.insertTextAfter({ range }, text),
                (range, text) => ruleFixer.insertTextAfterRange(range, text),
                range => ruleFixer.remove({ range }),
                range => ruleFixer.removeRange(range),
                range => ruleFixer.replaceText({ range }),
                range => ruleFixer.replaceTextRange(range)
            ];

            for (const range of invalidRanges) {
                for (const fn of functions) {
                    assert.isNull(fn(range, "x"));
                    assert.isTrue(log.error.called);
                    log.error.resetHistory();
                }
            }
        });
    });

});
