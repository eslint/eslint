/**
 * @fileoverview Tests for SourceCodeFixer.
 * @author Nicholas C. Zakas
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("chai").assert,
    sinon = require("sinon"),
    SourceCodeFixer = require("../../../lib/util/source-code-fixer");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

const TEST_CODE = "var answer = 6 * 7;";
const INSERT_AT_END = {
        message: "End",
        fix: {
            range: [TEST_CODE.length, TEST_CODE.length],
            text: "// end"
        }
    },
    INSERT_AT_START = {
        message: "Start",
        fix: {
            range: [0, 0],
            text: "// start\n"
        }
    },
    INSERT_IN_MIDDLE = {
        message: "Multiply",
        fix: {
            range: [13, 13],
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
    },
    INSERT_BOM = {
        message: "insert-bom",
        fix: {
            range: [0, 0],
            text: "\uFEFF"
        }
    },
    INSERT_BOM_WITH_TEXT = {
        message: "insert-bom",
        fix: {
            range: [0, 0],
            text: "\uFEFF// start\n"
        }
    },
    REMOVE_BOM = {
        message: "remove-bom",
        fix: {
            range: [-1, 0],
            text: ""
        }
    },
    REPLACE_BOM_WITH_TEXT = {
        message: "remove-bom",
        fix: {
            range: [-1, 0],
            text: "// start\n"
        }
    },
    NO_FIX1 = {
        message: "nofix1",
        line: 1,
        column: 3
    },
    NO_FIX2 = {
        message: "nofix2",
        line: 1,
        column: 7
    },
    REVERSED_RANGE = {
        message: "reversed range",
        fix: {
            range: [3, 0],
            text: " "
        }
    };

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("SourceCodeFixer", () => {

    describe("constructor", () => {

        it("Should not be able to add anything to this", () => {
            const result = new SourceCodeFixer();

            assert.throws(() => {
                result.test = 1;
            });
        });
    });

    describe("applyFixes() with no BOM", () => {
        describe("shouldFix parameter", () => {
            it("Should not perform any fixes if 'shouldFix' is false", () => {
                const result = SourceCodeFixer.applyFixes(TEST_CODE, [INSERT_AT_END], false);

                assert.isFalse(result.fixed);
                assert.strictEqual(result.output, TEST_CODE);
            });

            it("Should perform fixes if 'shouldFix' is not provided", () => {
                const result = SourceCodeFixer.applyFixes(TEST_CODE, [INSERT_AT_END]);

                assert.isTrue(result.fixed);
            });

            it("should call a function provided as 'shouldFix' for each message", () => {
                const shouldFixSpy = sinon.spy();

                SourceCodeFixer.applyFixes(TEST_CODE, [INSERT_IN_MIDDLE, INSERT_AT_START, INSERT_AT_END], shouldFixSpy);
                assert.isTrue(shouldFixSpy.calledThrice);
            });

            it("should provide a message object as an argument to 'shouldFix'", () => {
                const shouldFixSpy = sinon.spy();

                SourceCodeFixer.applyFixes(TEST_CODE, [INSERT_AT_START], shouldFixSpy);
                assert.strictEqual(shouldFixSpy.firstCall.args[0], INSERT_AT_START);
            });

            it("should not perform fixes if 'shouldFix' function returns false", () => {
                const shouldFixSpy = sinon.spy(() => false);
                const result = SourceCodeFixer.applyFixes(TEST_CODE, [INSERT_AT_START], shouldFixSpy);

                assert.isFalse(result.fixed);
            });

            it("should return original text as output if 'shouldFix' function prevents all fixes", () => {
                const shouldFixSpy = sinon.spy(() => false);
                const result = SourceCodeFixer.applyFixes(TEST_CODE, [INSERT_AT_START], shouldFixSpy);

                assert.strictEqual(result.output, TEST_CODE);
            });

            it("should only apply fixes for which the 'shouldFix' function returns true", () => {
                const shouldFixSpy = sinon.spy(problem => problem.message === "foo");
                const result = SourceCodeFixer.applyFixes(TEST_CODE, [INSERT_AT_START, REPLACE_ID], shouldFixSpy);

                assert.strictEqual(result.output, "var foo = 6 * 7;");
            });

            it("is called without access to internal eslint state", () => {
                const shouldFixSpy = sinon.spy();

                SourceCodeFixer.applyFixes(TEST_CODE, [INSERT_AT_START], shouldFixSpy);

                assert.isUndefined(shouldFixSpy.thisValues[0]);
            });
        });

        describe("Text Insertion", () => {

            it("should insert text at the end of the code", () => {
                const result = SourceCodeFixer.applyFixes(TEST_CODE, [INSERT_AT_END]);

                assert.strictEqual(result.output, TEST_CODE + INSERT_AT_END.fix.text);
                assert.strictEqual(result.messages.length, 0);
            });

            it("should insert text at the beginning of the code", () => {
                const result = SourceCodeFixer.applyFixes(TEST_CODE, [INSERT_AT_START]);

                assert.strictEqual(result.output, INSERT_AT_START.fix.text + TEST_CODE);
                assert.strictEqual(result.messages.length, 0);
            });

            it("should insert text in the middle of the code", () => {
                const result = SourceCodeFixer.applyFixes(TEST_CODE, [INSERT_IN_MIDDLE]);

                assert.strictEqual(result.output, TEST_CODE.replace("6 *", `${INSERT_IN_MIDDLE.fix.text}6 *`));
                assert.strictEqual(result.messages.length, 0);
            });

            it("should insert text at the beginning, middle, and end of the code", () => {
                const result = SourceCodeFixer.applyFixes(TEST_CODE, [INSERT_IN_MIDDLE, INSERT_AT_START, INSERT_AT_END]);

                assert.strictEqual(result.output, INSERT_AT_START.fix.text + TEST_CODE.replace("6 *", `${INSERT_IN_MIDDLE.fix.text}6 *`) + INSERT_AT_END.fix.text);
                assert.strictEqual(result.messages.length, 0);
            });


            it("should ignore reversed ranges", () => {
                const result = SourceCodeFixer.applyFixes(TEST_CODE, [REVERSED_RANGE]);

                assert.strictEqual(result.output, TEST_CODE);
            });

        });


        describe("Text Replacement", () => {

            it("should replace text at the end of the code", () => {
                const result = SourceCodeFixer.applyFixes(TEST_CODE, [REPLACE_VAR]);

                assert.strictEqual(result.messages.length, 0);
                assert.strictEqual(result.output, TEST_CODE.replace("var", "let"));
                assert.isTrue(result.fixed);
            });

            it("should replace text at the beginning of the code", () => {
                const result = SourceCodeFixer.applyFixes(TEST_CODE, [REPLACE_ID]);

                assert.strictEqual(result.messages.length, 0);
                assert.strictEqual(result.output, TEST_CODE.replace("answer", "foo"));
                assert.isTrue(result.fixed);
            });

            it("should replace text in the middle of the code", () => {
                const result = SourceCodeFixer.applyFixes(TEST_CODE, [REPLACE_NUM]);

                assert.strictEqual(result.messages.length, 0);
                assert.strictEqual(result.output, TEST_CODE.replace("6", "5"));
                assert.isTrue(result.fixed);
            });

            it("should replace text at the beginning and end of the code", () => {
                const result = SourceCodeFixer.applyFixes(TEST_CODE, [REPLACE_ID, REPLACE_VAR, REPLACE_NUM]);

                assert.strictEqual(result.messages.length, 0);
                assert.strictEqual(result.output, "let foo = 5 * 7;");
                assert.isTrue(result.fixed);
            });

        });

        describe("Text Removal", () => {

            it("should remove text at the start of the code", () => {
                const result = SourceCodeFixer.applyFixes(TEST_CODE, [REMOVE_START]);

                assert.strictEqual(result.messages.length, 0);
                assert.strictEqual(result.output, TEST_CODE.replace("var ", ""));
                assert.isTrue(result.fixed);
            });

            it("should remove text in the middle of the code", () => {
                const result = SourceCodeFixer.applyFixes(TEST_CODE, [REMOVE_MIDDLE]);

                assert.strictEqual(result.messages.length, 0);
                assert.strictEqual(result.output, TEST_CODE.replace("answer", "a"));
                assert.isTrue(result.fixed);
            });

            it("should remove text towards the end of the code", () => {
                const result = SourceCodeFixer.applyFixes(TEST_CODE, [REMOVE_END]);

                assert.strictEqual(result.messages.length, 0);
                assert.strictEqual(result.output, TEST_CODE.replace(" * 7", ""));
                assert.isTrue(result.fixed);
            });

            it("should remove text at the beginning, middle, and end of the code", () => {
                const result = SourceCodeFixer.applyFixes(TEST_CODE, [REMOVE_END, REMOVE_START, REMOVE_MIDDLE]);

                assert.strictEqual(result.messages.length, 0);
                assert.strictEqual(result.output, "a = 6;");
                assert.isTrue(result.fixed);
            });
        });

        describe("Combination", () => {

            it("should replace text at the beginning, remove text in the middle, and insert text at the end", () => {
                const result = SourceCodeFixer.applyFixes(TEST_CODE, [INSERT_AT_END, REMOVE_END, REPLACE_VAR]);

                assert.strictEqual(result.output, "let answer = 6;// end");
                assert.isTrue(result.fixed);
                assert.strictEqual(result.messages.length, 0);
            });

            it("should only apply one fix when ranges overlap", () => {
                const result = SourceCodeFixer.applyFixes(TEST_CODE, [REMOVE_MIDDLE, REPLACE_ID]);

                assert.strictEqual(result.output, TEST_CODE.replace("answer", "foo"));
                assert.strictEqual(result.messages.length, 1);
                assert.strictEqual(result.messages[0].message, "removemiddle");
                assert.isTrue(result.fixed);
            });

            it("should apply one fix when the end of one range is the same as the start of a previous range overlap", () => {
                const result = SourceCodeFixer.applyFixes(TEST_CODE, [REMOVE_START, REPLACE_ID]);

                assert.strictEqual(result.output, TEST_CODE.replace("var ", ""));
                assert.strictEqual(result.messages.length, 1);
                assert.strictEqual(result.messages[0].message, "foo");
                assert.isTrue(result.fixed);
            });

            it("should only apply one fix when ranges overlap and one message has no fix", () => {
                const result = SourceCodeFixer.applyFixes(TEST_CODE, [REMOVE_MIDDLE, REPLACE_ID, NO_FIX]);

                assert.strictEqual(result.output, TEST_CODE.replace("answer", "foo"));
                assert.strictEqual(result.messages.length, 2);
                assert.strictEqual(result.messages[0].message, "nofix");
                assert.strictEqual(result.messages[1].message, "removemiddle");
                assert.isTrue(result.fixed);
            });

            it("should apply the same fix when ranges overlap regardless of order", () => {
                const result1 = SourceCodeFixer.applyFixes(TEST_CODE, [REMOVE_MIDDLE, REPLACE_ID]);
                const result2 = SourceCodeFixer.applyFixes(TEST_CODE, [REPLACE_ID, REMOVE_MIDDLE]);

                assert.strictEqual(result1.output, result2.output);
            });
        });

        describe("No Fixes", () => {

            it("should only apply one fix when ranges overlap and one message has no fix", () => {
                const result = SourceCodeFixer.applyFixes(TEST_CODE, [NO_FIX]);

                assert.strictEqual(result.output, TEST_CODE);
                assert.strictEqual(result.messages.length, 1);
                assert.strictEqual(result.messages[0].message, "nofix");
                assert.isFalse(result.fixed);
            });

            it("should sort the no fix messages correctly", () => {
                const result = SourceCodeFixer.applyFixes(TEST_CODE, [REPLACE_ID, NO_FIX2, NO_FIX1]);

                assert.strictEqual(result.output, TEST_CODE.replace("answer", "foo"));
                assert.strictEqual(result.messages.length, 2);
                assert.strictEqual(result.messages[0].message, "nofix1");
                assert.strictEqual(result.messages[1].message, "nofix2");
                assert.isTrue(result.fixed);
            });

        });

        describe("BOM manipulations", () => {

            it("should insert BOM with an insertion of '\uFEFF' at 0", () => {
                const result = SourceCodeFixer.applyFixes(TEST_CODE, [INSERT_BOM]);

                assert.strictEqual(result.output, `\uFEFF${TEST_CODE}`);
                assert.isTrue(result.fixed);
                assert.strictEqual(result.messages.length, 0);
            });

            it("should insert BOM with an insertion of '\uFEFFfoobar' at 0", () => {
                const result = SourceCodeFixer.applyFixes(TEST_CODE, [INSERT_BOM_WITH_TEXT]);

                assert.strictEqual(result.output, `\uFEFF// start\n${TEST_CODE}`);
                assert.isTrue(result.fixed);
                assert.strictEqual(result.messages.length, 0);
            });

            it("should remove BOM with a negative range", () => {
                const result = SourceCodeFixer.applyFixes(TEST_CODE, [REMOVE_BOM]);

                assert.strictEqual(result.output, TEST_CODE);
                assert.isTrue(result.fixed);
                assert.strictEqual(result.messages.length, 0);
            });

            it("should replace BOM with a negative range and 'foobar'", () => {
                const result = SourceCodeFixer.applyFixes(TEST_CODE, [REPLACE_BOM_WITH_TEXT]);

                assert.strictEqual(result.output, `// start\n${TEST_CODE}`);
                assert.isTrue(result.fixed);
                assert.strictEqual(result.messages.length, 0);
            });

        });

    });

    /*
     * This section is almost same as "with no BOM".
     * Just `result.output` has BOM.
     */
    describe("applyFixes() with BOM", () => {

        const TEST_CODE_WITH_BOM = `\uFEFF${TEST_CODE}`;

        describe("Text Insertion", () => {

            it("should insert text at the end of the code", () => {
                const result = SourceCodeFixer.applyFixes(TEST_CODE_WITH_BOM, [INSERT_AT_END]);

                assert.strictEqual(result.output, `\uFEFF${TEST_CODE}${INSERT_AT_END.fix.text}`);
                assert.strictEqual(result.messages.length, 0);
            });

            it("should insert text at the beginning of the code", () => {
                const result = SourceCodeFixer.applyFixes(TEST_CODE_WITH_BOM, [INSERT_AT_START]);

                assert.strictEqual(result.output, `\uFEFF${INSERT_AT_START.fix.text}${TEST_CODE}`);
                assert.strictEqual(result.messages.length, 0);
            });

            it("should insert text in the middle of the code", () => {
                const result = SourceCodeFixer.applyFixes(TEST_CODE_WITH_BOM, [INSERT_IN_MIDDLE]);

                assert.strictEqual(result.output, `\uFEFF${TEST_CODE.replace("6 *", `${INSERT_IN_MIDDLE.fix.text}6 *`)}`);
                assert.strictEqual(result.messages.length, 0);
            });

            it("should insert text at the beginning, middle, and end of the code", () => {
                const result = SourceCodeFixer.applyFixes(TEST_CODE_WITH_BOM, [INSERT_IN_MIDDLE, INSERT_AT_START, INSERT_AT_END]);
                const insertInMiddle = TEST_CODE.replace("6 *", `${INSERT_IN_MIDDLE.fix.text}6 *`);

                assert.strictEqual(result.output, `\uFEFF${INSERT_AT_START.fix.text}${insertInMiddle}${INSERT_AT_END.fix.text}`);
                assert.strictEqual(result.messages.length, 0);
            });

            it("should ignore reversed ranges", () => {
                const result = SourceCodeFixer.applyFixes(TEST_CODE_WITH_BOM, [REVERSED_RANGE]);

                assert.strictEqual(result.output, `\uFEFF${TEST_CODE}`);
            });

        });

        describe("Text Replacement", () => {

            it("should replace text at the end of the code", () => {
                const result = SourceCodeFixer.applyFixes(TEST_CODE_WITH_BOM, [REPLACE_VAR]);

                assert.strictEqual(result.messages.length, 0);
                assert.strictEqual(result.output, `\uFEFF${TEST_CODE.replace("var", "let")}`);
                assert.isTrue(result.fixed);
            });

            it("should replace text at the beginning of the code", () => {
                const result = SourceCodeFixer.applyFixes(TEST_CODE_WITH_BOM, [REPLACE_ID]);

                assert.strictEqual(result.messages.length, 0);
                assert.strictEqual(result.output, `\uFEFF${TEST_CODE.replace("answer", "foo")}`);
                assert.isTrue(result.fixed);
            });

            it("should replace text in the middle of the code", () => {
                const result = SourceCodeFixer.applyFixes(TEST_CODE_WITH_BOM, [REPLACE_NUM]);

                assert.strictEqual(result.messages.length, 0);
                assert.strictEqual(result.output, `\uFEFF${TEST_CODE.replace("6", "5")}`);
                assert.isTrue(result.fixed);
            });

            it("should replace text at the beginning and end of the code", () => {
                const result = SourceCodeFixer.applyFixes(TEST_CODE_WITH_BOM, [REPLACE_ID, REPLACE_VAR, REPLACE_NUM]);

                assert.strictEqual(result.messages.length, 0);
                assert.strictEqual(result.output, "\uFEFFlet foo = 5 * 7;");
                assert.isTrue(result.fixed);
            });

        });

        describe("Text Removal", () => {

            it("should remove text at the start of the code", () => {
                const result = SourceCodeFixer.applyFixes(TEST_CODE_WITH_BOM, [REMOVE_START]);

                assert.strictEqual(result.messages.length, 0);
                assert.strictEqual(result.output, `\uFEFF${TEST_CODE.replace("var ", "")}`);
                assert.isTrue(result.fixed);
            });

            it("should remove text in the middle of the code", () => {
                const result = SourceCodeFixer.applyFixes(TEST_CODE_WITH_BOM, [REMOVE_MIDDLE]);

                assert.strictEqual(result.messages.length, 0);
                assert.strictEqual(result.output, `\uFEFF${TEST_CODE.replace("answer", "a")}`);
                assert.isTrue(result.fixed);
            });

            it("should remove text towards the end of the code", () => {
                const result = SourceCodeFixer.applyFixes(TEST_CODE_WITH_BOM, [REMOVE_END]);

                assert.strictEqual(result.messages.length, 0);
                assert.strictEqual(result.output, `\uFEFF${TEST_CODE.replace(" * 7", "")}`);
                assert.isTrue(result.fixed);
            });

            it("should remove text at the beginning, middle, and end of the code", () => {
                const result = SourceCodeFixer.applyFixes(TEST_CODE_WITH_BOM, [REMOVE_END, REMOVE_START, REMOVE_MIDDLE]);

                assert.strictEqual(result.messages.length, 0);
                assert.strictEqual(result.output, "\uFEFFa = 6;");
                assert.isTrue(result.fixed);
            });
        });

        describe("Combination", () => {

            it("should replace text at the beginning, remove text in the middle, and insert text at the end", () => {
                const result = SourceCodeFixer.applyFixes(TEST_CODE_WITH_BOM, [INSERT_AT_END, REMOVE_END, REPLACE_VAR]);

                assert.strictEqual(result.output, "\uFEFFlet answer = 6;// end");
                assert.isTrue(result.fixed);
                assert.strictEqual(result.messages.length, 0);
            });

            it("should only apply one fix when ranges overlap", () => {
                const result = SourceCodeFixer.applyFixes(TEST_CODE_WITH_BOM, [REMOVE_MIDDLE, REPLACE_ID]);

                assert.strictEqual(result.output, `\uFEFF${TEST_CODE.replace("answer", "foo")}`);
                assert.strictEqual(result.messages.length, 1);
                assert.strictEqual(result.messages[0].message, "removemiddle");
                assert.isTrue(result.fixed);
            });

            it("should apply one fix when the end of one range is the same as the start of a previous range overlap", () => {
                const result = SourceCodeFixer.applyFixes(TEST_CODE_WITH_BOM, [REMOVE_START, REPLACE_ID]);

                assert.strictEqual(result.output, `\uFEFF${TEST_CODE.replace("var ", "")}`);
                assert.strictEqual(result.messages.length, 1);
                assert.strictEqual(result.messages[0].message, "foo");
                assert.isTrue(result.fixed);
            });

            it("should only apply one fix when ranges overlap and one message has no fix", () => {
                const result = SourceCodeFixer.applyFixes(TEST_CODE_WITH_BOM, [REMOVE_MIDDLE, REPLACE_ID, NO_FIX]);

                assert.strictEqual(result.output, `\uFEFF${TEST_CODE.replace("answer", "foo")}`);
                assert.strictEqual(result.messages.length, 2);
                assert.strictEqual(result.messages[0].message, "nofix");
                assert.strictEqual(result.messages[1].message, "removemiddle");
                assert.isTrue(result.fixed);
            });

            it("should apply the same fix when ranges overlap regardless of order", () => {
                const result1 = SourceCodeFixer.applyFixes(TEST_CODE_WITH_BOM, [REMOVE_MIDDLE, REPLACE_ID]);
                const result2 = SourceCodeFixer.applyFixes(TEST_CODE_WITH_BOM, [REPLACE_ID, REMOVE_MIDDLE]);

                assert.strictEqual(result1.output, result2.output);
            });

        });

        describe("No Fixes", () => {

            it("should only apply one fix when ranges overlap and one message has no fix", () => {
                const result = SourceCodeFixer.applyFixes(TEST_CODE_WITH_BOM, [NO_FIX]);

                assert.strictEqual(result.output, `\uFEFF${TEST_CODE}`);
                assert.strictEqual(result.messages.length, 1);
                assert.strictEqual(result.messages[0].message, "nofix");
                assert.isFalse(result.fixed);
            });

        });

        describe("BOM manipulations", () => {

            it("should insert BOM with an insertion of '\uFEFF' at 0", () => {
                const result = SourceCodeFixer.applyFixes(TEST_CODE_WITH_BOM, [INSERT_BOM]);

                assert.strictEqual(result.output, `\uFEFF${TEST_CODE}`);
                assert.isTrue(result.fixed);
                assert.strictEqual(result.messages.length, 0);
            });

            it("should insert BOM with an insertion of '\uFEFFfoobar' at 0", () => {
                const result = SourceCodeFixer.applyFixes(TEST_CODE_WITH_BOM, [INSERT_BOM_WITH_TEXT]);

                assert.strictEqual(result.output, `\uFEFF// start\n${TEST_CODE}`);
                assert.isTrue(result.fixed);
                assert.strictEqual(result.messages.length, 0);
            });

            it("should remove BOM with a negative range", () => {
                const result = SourceCodeFixer.applyFixes(TEST_CODE_WITH_BOM, [REMOVE_BOM]);

                assert.strictEqual(result.output, TEST_CODE);
                assert.isTrue(result.fixed);
                assert.strictEqual(result.messages.length, 0);
            });

            it("should replace BOM with a negative range and 'foobar'", () => {
                const result = SourceCodeFixer.applyFixes(TEST_CODE_WITH_BOM, [REPLACE_BOM_WITH_TEXT]);

                assert.strictEqual(result.output, `// start\n${TEST_CODE}`);
                assert.isTrue(result.fixed);
                assert.strictEqual(result.messages.length, 0);
            });

        });

    });

});
