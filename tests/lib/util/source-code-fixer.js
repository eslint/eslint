/**
 * @fileoverview Tests for SourceCodeFixer.
 * @author Nicholas C. Zakas
 * @copyright 2015 Nicholas C. Zakas. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var assert = require("chai").assert,
    espree = require("espree"),
    SourceCode = require("../../../lib/util/source-code"),
    SourceCodeFixer = require("../../../lib/util/source-code-fixer");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

var TEST_CODE = "var answer = 6 * 7;",
    TEST_AST = espree.parse(TEST_CODE, { loc: true, range: true, tokens: true, comment: true });
var INSERT_AT_END = {
        message: "End",
        fix: {
            range: [ TEST_CODE.length, TEST_CODE.length ],
            text: "// end"
        }
    },
    INSERT_AT_START = {
        message: "Start",
        fix: {
            range: [ 0, 0 ],
            text: "// start\n"
        }
    },
    INSERT_IN_MIDDLE = {
        message: "Multiply",
        fix: {
            range: [ 13, 13 ],
            text: "5 *"
        }
    },
    REPLACE_ID = {
        message: "foo",
        fix: {
            range: [4, 10],
            text: "foo"
        }
    },
    REPLACE_VAR = {
        message: "let",
        fix: {
            range: [0, 3],
            text: "let"
        }
    },
    REPLACE_NUM = {
        message: "5",
        fix: {
            range: [13, 14],
            text: "5"
        }
    },
    REMOVE_START = {
        message: "removestart",
        fix: {
            range: [0, 4],
            text: ""
        }
    },
    REMOVE_MIDDLE = {
        message: "removemiddle",
        fix: {
            range: [5, 10],
            text: ""
        }
    },
    REMOVE_END = {
        message: "removeend",
        fix: {
            range: [14, 18],
            text: ""
        }
    },
    NO_FIX = {
        message: "nofix"
    };

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("SourceCodeFixer", function() {

    var sourceCode;

    beforeEach(function() {
        sourceCode = new SourceCode(TEST_CODE, TEST_AST);
    });

    describe("applyFixes()", function() {

        describe("Text Insertion", function() {

            it("should insert text at the end of the code", function() {
                var result = SourceCodeFixer.applyFixes(sourceCode, [ INSERT_AT_END ]);
                assert.equal(result.output, TEST_CODE + INSERT_AT_END.fix.text);
                assert.equal(result.messages.length, 0);
            });

            it("should insert text at the beginning of the code", function() {
                var result = SourceCodeFixer.applyFixes(sourceCode, [ INSERT_AT_START ]);
                assert.equal(result.output, INSERT_AT_START.fix.text + TEST_CODE);
                assert.equal(result.messages.length, 0);
            });

            it("should insert text in the middle of the code", function() {
                var result = SourceCodeFixer.applyFixes(sourceCode, [ INSERT_IN_MIDDLE ]);
                assert.equal(result.output, TEST_CODE.replace("6 *", INSERT_IN_MIDDLE.fix.text + "6 *"));
                assert.equal(result.messages.length, 0);
            });

            it("should insert text at the beginning, middle, and end of the code", function() {
                var result = SourceCodeFixer.applyFixes(sourceCode, [ INSERT_IN_MIDDLE, INSERT_AT_START, INSERT_AT_END ]);
                assert.equal(result.output, INSERT_AT_START.fix.text + TEST_CODE.replace("6 *", INSERT_IN_MIDDLE.fix.text + "6 *") + INSERT_AT_END.fix.text);
                assert.equal(result.messages.length, 0);
            });

        });


        describe("Text Replacement", function() {

            it("should replace text at the end of the code", function() {
                var result = SourceCodeFixer.applyFixes(sourceCode, [ REPLACE_VAR ]);
                assert.equal(result.messages.length, 0);
                assert.equal(result.output, TEST_CODE.replace("var", "let"));
                assert.isTrue(result.fixed);
            });

            it("should replace text at the beginning of the code", function() {
                var result = SourceCodeFixer.applyFixes(sourceCode, [ REPLACE_ID ]);
                assert.equal(result.messages.length, 0);
                assert.equal(result.output, TEST_CODE.replace("answer", "foo"));
                assert.isTrue(result.fixed);
            });

            it("should replace text in the middle of the code", function() {
                var result = SourceCodeFixer.applyFixes(sourceCode, [ REPLACE_NUM ]);
                assert.equal(result.messages.length, 0);
                assert.equal(result.output, TEST_CODE.replace("6", "5"));
                assert.isTrue(result.fixed);
            });

            it("should replace text at the beginning and end of the code", function() {
                var result = SourceCodeFixer.applyFixes(sourceCode, [ REPLACE_ID, REPLACE_VAR, REPLACE_NUM ]);
                assert.equal(result.messages.length, 0);
                assert.equal(result.output, "let foo = 5 * 7;");
                assert.isTrue(result.fixed);
            });

        });

        describe("Text Removal", function() {

            it("should remove text at the start of the code", function() {
                var result = SourceCodeFixer.applyFixes(sourceCode, [ REMOVE_START ]);
                assert.equal(result.messages.length, 0);
                assert.equal(result.output, TEST_CODE.replace("var ", ""));
                assert.isTrue(result.fixed);
            });

            it("should remove text in the middle of the code", function() {
                var result = SourceCodeFixer.applyFixes(sourceCode, [ REMOVE_MIDDLE ]);
                assert.equal(result.messages.length, 0);
                assert.equal(result.output, TEST_CODE.replace("answer", "a"));
                assert.isTrue(result.fixed);
            });

            it("should remove text towards the end of the code", function() {
                var result = SourceCodeFixer.applyFixes(sourceCode, [ REMOVE_END ]);
                assert.equal(result.messages.length, 0);
                assert.equal(result.output, TEST_CODE.replace(" * 7", ""));
                assert.isTrue(result.fixed);
            });

            it("should remove text at the beginning, middle, and end of the code", function() {
                var result = SourceCodeFixer.applyFixes(sourceCode, [ REMOVE_END, REMOVE_START, REMOVE_MIDDLE ]);
                assert.equal(result.messages.length, 0);
                assert.equal(result.output, "a = 6;");
                assert.isTrue(result.fixed);
            });
        });

        describe("Combination", function() {

            it("should replace text at the beginning, remove text in the middle, and insert text at the end", function() {
                var result = SourceCodeFixer.applyFixes(sourceCode, [ INSERT_AT_END, REMOVE_END, REPLACE_VAR ]);
                assert.equal(result.output, "let answer = 6;// end");
                assert.isTrue(result.fixed);
                assert.equal(result.messages.length, 0);
            });

            it("should only apply one fix when ranges overlap", function() {
                var result = SourceCodeFixer.applyFixes(sourceCode, [ REMOVE_MIDDLE, REPLACE_ID ]);
                assert.equal(result.output, TEST_CODE.replace("answer", "a"));
                assert.equal(result.messages.length, 1);
                assert.equal(result.messages[0].message, "foo");
                assert.isTrue(result.fixed);
            });

            it("should apply one fix when the end of one range is the same as the start of a previous range overlap", function() {
                var result = SourceCodeFixer.applyFixes(sourceCode, [ REMOVE_START, REPLACE_ID ]);
                assert.equal(result.output, TEST_CODE.replace("answer", "foo"));
                assert.equal(result.messages.length, 1);
                assert.equal(result.messages[0].message, "removestart");
                assert.isTrue(result.fixed);
            });

            it("should only apply one fix when ranges overlap and one message has no fix", function() {
                var result = SourceCodeFixer.applyFixes(sourceCode, [ REMOVE_MIDDLE, REPLACE_ID, NO_FIX ]);
                assert.equal(result.output, TEST_CODE.replace("answer", "a"));
                assert.equal(result.messages.length, 2);
                assert.equal(result.messages[0].message, "nofix");
                assert.equal(result.messages[1].message, "foo");
                assert.isTrue(result.fixed);
            });

        });

        describe("No Fixes", function() {

            it("should only apply one fix when ranges overlap and one message has no fix", function() {
                var result = SourceCodeFixer.applyFixes(sourceCode, [ NO_FIX ]);
                assert.equal(result.output, TEST_CODE);
                assert.equal(result.messages.length, 1);
                assert.equal(result.messages[0].message, "nofix");
                assert.isFalse(result.fixed);
            });

        });

    });

});
