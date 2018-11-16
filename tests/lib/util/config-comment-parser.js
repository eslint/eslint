/**
 * @fileoverview Tests for ConfigCommentParser object.
 * @author Nicholas C. Zakas
 */
/* globals window */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("chai").assert,
    ConfigCommentParser = require("../../../lib/util/config-comment-parser");

//------------------------------------------------------------------------------
// Constants
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("ConfigCommentParser", () => {

    let commentParser;
    const location = {
        start: {
            line: 1,
            column: 0
        }
    };

    beforeEach(() => {
        commentParser = new ConfigCommentParser();
    });

    describe("parseJsonConfig", () => {

        it("should parse JSON config with one item", () => {
            const code = "no-alert:0";
            const result = commentParser.parseJsonConfig(code, location);


            assert.deepStrictEqual(result, {
                success: true,
                config: {
                    "no-alert": 0
                }
            });
        });

        it("should parse JSON config with two items", () => {
            const code = "no-alert:0 semi: 2";
            const result = commentParser.parseJsonConfig(code, location);


            assert.deepStrictEqual(result, {
                success: true,
                config: {
                    "no-alert": 0,
                    semi: 2
                }
            });
        });

        it("should parse JSON config with two comma-separated items", () => {
            const code = "no-alert:0,semi: 2";
            const result = commentParser.parseJsonConfig(code, location);


            assert.deepStrictEqual(result, {
                success: true,
                config: {
                    "no-alert": 0,
                    semi: 2
                }
            });
        });

        it("should parse JSON config with two items and a string severity", () => {
            const code = "no-alert:off,semi: 2";
            const result = commentParser.parseJsonConfig(code, location);


            assert.deepStrictEqual(result, {
                success: true,
                config: {
                    "no-alert": "off",
                    semi: 2
                }
            });
        });

        it("should parse JSON config with two items and options", () => {
            const code = "no-alert:off, semi: [2, always]";
            const result = commentParser.parseJsonConfig(code, location);


            assert.deepStrictEqual(result, {
                success: true,
                config: {
                    "no-alert": "off",
                    semi: [2, "always"]
                }
            });
        });

        it("should parse JSON config with two items and options from plugins", () => {
            const code = "plugin/no-alert:off, plugin/semi: [2, always]";
            const result = commentParser.parseJsonConfig(code, location);

            assert.deepStrictEqual(result, {
                success: true,
                config: {
                    "plugin/no-alert": "off",
                    "plugin/semi": [2, "always"]
                }
            });
        });


    });

    describe("parseBooleanConfig", () => {

        const comment = {};

        it("should parse Boolean config with one item", () => {
            const code = "a: true";
            const result = commentParser.parseBooleanConfig(code, comment);

            assert.deepStrictEqual(result, {
                a: {
                    value: true,
                    comment
                }
            });
        });

        it("should parse Boolean config with one item and no value", () => {
            const code = "a";
            const result = commentParser.parseBooleanConfig(code, comment);

            assert.deepStrictEqual(result, {
                a: {
                    value: false,
                    comment
                }
            });
        });

        it("should parse Boolean config with two items", () => {
            const code = "a: true b:false";
            const result = commentParser.parseBooleanConfig(code, comment);

            assert.deepStrictEqual(result, {
                a: {
                    value: true,
                    comment
                },
                b: {
                    value: false,
                    comment
                }
            });
        });

        it("should parse Boolean config with two comma-separated items", () => {
            const code = "a: true, b:false";
            const result = commentParser.parseBooleanConfig(code, comment);

            assert.deepStrictEqual(result, {
                a: {
                    value: true,
                    comment
                },
                b: {
                    value: false,
                    comment
                }
            });
        });

        it("should parse Boolean config with two comma-separated items and no values", () => {
            const code = "a , b";
            const result = commentParser.parseBooleanConfig(code, comment);

            assert.deepStrictEqual(result, {
                a: {
                    value: false,
                    comment
                },
                b: {
                    value: false,
                    comment
                }
            });
        });
    });

    describe("parseListConfig", () => {

        it("should parse list config with one item", () => {
            const code = "a";
            const result = commentParser.parseListConfig(code);

            assert.deepStrictEqual(result, {
                a: true
            });
        });

        it("should parse list config with two items", () => {
            const code = "a, b";
            const result = commentParser.parseListConfig(code);

            assert.deepStrictEqual(result, {
                a: true,
                b: true
            });
        });

        it("should parse list config with two items and exta whitespace", () => {
            const code = "  a , b  ";
            const result = commentParser.parseListConfig(code);

            assert.deepStrictEqual(result, {
                a: true,
                b: true
            });
        });
    });

    //     it("should report a violation when the report is right before the comment", () => {
    //         const code = " /* eslint-disable */ ";

    /*
     *         linter.defineRule("checker", context => ({
     *             Program() {
     *                 context.report({ loc: { line: 1, column: 0 }, message: "foo" });
     *             }
     *         }));
     *         const problems = linter.verify(code, { rules: { checker: "error" } });
     */

    /*
     *         assert.strictEqual(problems.length, 1);
     *         assert.strictEqual(problems[0].message, "foo");
     *     });
     */

    //     it("should not report a violation when the report is right at the start of the comment", () => {
    //         const code = " /* eslint-disable */ ";

    /*
     *         linter.defineRule("checker", context => ({
     *             Program() {
     *                 context.report({ loc: { line: 1, column: 1 }, message: "foo" });
     *             }
     *         }));
     *         const problems = linter.verify(code, { rules: { checker: "error" } });
     */

    /*
     *         assert.strictEqual(problems.length, 0);
     *     });
     */

    //     it("rules should not change initial config", () => {
    //         const config = { rules: { "test-plugin/test-rule": 2 } };
    //         const codeA = "/*eslint test-plugin/test-rule: 0*/ var a = \"trigger violation\";";
    //         const codeB = "var a = \"trigger violation\";";
    //         let messages = linter.verify(codeA, config, filename, false);

    //         assert.strictEqual(messages.length, 0);

    /*
     *         messages = linter.verify(codeB, config, filename, false);
     *         assert.strictEqual(messages.length, 1);
     *     });
     * });
     */

    /*
     * describe("when evaluating code with comments to enable and disable all reporting", () => {
     *     it("should report a violation", () => {
     */

    //         const code = [
    //             "/*eslint-disable */",
    //             "alert('test');",
    //             "/*eslint-enable */",
    //             "alert('test');"
    //         ].join("\n");
    //         const config = { rules: { "no-alert": 1 } };

    //         const messages = linter.verify(code, config, filename);

    /*
     *         assert.strictEqual(messages.length, 1);
     *         assert.strictEqual(messages[0].ruleId, "no-alert");
     *         assert.strictEqual(messages[0].message, "Unexpected alert.");
     *         assert.include(messages[0].nodeType, "CallExpression");
     *         assert.strictEqual(messages[0].line, 4);
     *     });
     */

    //     it("should not report a violation", () => {
    //         const code = [
    //             "/*eslint-disable */",
    //             "alert('test');",
    //             "alert('test');"
    //         ].join("\n");
    //         const config = { rules: { "no-alert": 1 } };

    //         const messages = linter.verify(code, config, filename);

    /*
     *         assert.strictEqual(messages.length, 0);
     *     });
     */

    //     it("should not report a violation", () => {
    //         const code = [
    //             "                    alert('test1');/*eslint-disable */\n",
    //             "alert('test');",
    //             "                                         alert('test');\n",
    //             "/*eslint-enable */alert('test2');"
    //         ].join("");
    //         const config = { rules: { "no-alert": 1 } };

    //         const messages = linter.verify(code, config, filename);

    /*
     *         assert.strictEqual(messages.length, 2);
     *         assert.strictEqual(messages[0].column, 21);
     *         assert.strictEqual(messages[1].column, 19);
     *     });
     */

    //     it("should report a violation", () => {

    //         const code = [
    //             "/*eslint-disable */",
    //             "alert('test');",
    //             "/*eslint-disable */",
    //             "alert('test');",
    //             "/*eslint-enable*/",
    //             "alert('test');",
    //             "/*eslint-enable*/"
    //         ].join("\n");

    //         const config = { rules: { "no-alert": 1 } };

    //         const messages = linter.verify(code, config, filename);

    /*
     *         assert.strictEqual(messages.length, 1);
     *     });
     */


    //     it("should not report a violation", () => {
    //         const code = [
    //             "/*eslint-disable */",
    //             "(function(){ var b = 44;})()",
    //             "/*eslint-enable */;any();"
    //         ].join("\n");

    //         const config = { rules: { "no-unused-vars": 1 } };

    //         const messages = linter.verify(code, config, filename);

    /*
     *         assert.strictEqual(messages.length, 0);
     *     });
     */

    //     it("should not report a violation", () => {
    //         const code = [
    //             "(function(){ /*eslint-disable */ var b = 44;})()",
    //             "/*eslint-enable */;any();"
    //         ].join("\n");

    //         const config = { rules: { "no-unused-vars": 1 } };

    //         const messages = linter.verify(code, config, filename);

    /*
     *         assert.strictEqual(messages.length, 0);
     *     });
     * });
     */

    // describe("when evaluating code with comments to ignore reporting on specific rules on a specific line", () => {

    /*
     *     describe("eslint-disable-line", () => {
     *         it("should report a violation", () => {
     *             const code = [
     *                 "alert('test'); // eslint-disable-line no-alert",
     *                 "console.log('test');" // here
     *             ].join("\n");
     *             const config = {
     *                 rules: {
     *                     "no-alert": 1,
     *                     "no-console": 1
     *                 }
     *             };
     */

    //             const messages = linter.verify(code, config, filename);

    //             assert.strictEqual(messages.length, 1);

    /*
     *             assert.strictEqual(messages[0].ruleId, "no-console");
     *         });
     */

    /*
     *         it("should report a violation", () => {
     *             const code = [
     *                 "alert('test'); // eslint-disable-line no-alert",
     *                 "console.log('test'); // eslint-disable-line no-console",
     *                 "alert('test');" // here
     *             ].join("\n");
     *             const config = {
     *                 rules: {
     *                     "no-alert": 1,
     *                     "no-console": 1
     *                 }
     *             };
     */

    //             const messages = linter.verify(code, config, filename);

    //             assert.strictEqual(messages.length, 1);

    /*
     *             assert.strictEqual(messages[0].ruleId, "no-alert");
     *         });
     */

    //         it("should report a violation if eslint-disable-line in a block comment is not on a single line", () => {
    //             const code = [
    //                 "/* eslint-disable-line",
    //                 "*",
    //                 "*/ console.log('test');" // here
    //             ].join("\n");
    //             const config = {
    //                 rules: {
    //                     "no-console": 1
    //                 }
    //             };

    //             const messages = linter.verify(code, config, filename);

    //             assert.strictEqual(messages.length, 2);

    /*
     *             assert.strictEqual(messages[1].ruleId, "no-console");
     *         });
     */

    //         it("should not disable rule and add an extra report if eslint-disable-line in a block comment is not on a single line", () => {
    //             const code = [
    //                 "alert('test'); /* eslint-disable-line ",
    //                 "no-alert */"
    //             ].join("\n");
    //             const config = {
    //                 rules: {
    //                     "no-alert": 1
    //                 }
    //             };

    //             const messages = linter.verify(code, config);

    /*
     *             assert.deepStrictEqual(messages, [
     *                 {
     *                     ruleId: "no-alert",
     *                     severity: 1,
     *                     line: 1,
     *                     column: 1,
     *                     endLine: 1,
     *                     endColumn: 14,
     *                     message: "Unexpected alert.",
     *                     messageId: "unexpected",
     *                     nodeType: "CallExpression"
     *                 },
     *                 {
     *                     ruleId: null,
     *                     severity: 2,
     *                     message: "eslint-disable-line comment should not span multiple lines.",
     *                     line: 1,
     *                     column: 16,
     *                     endLine: 2,
     *                     endColumn: 12,
     *                     nodeType: null
     *                 }
     *             ]);
     *         });
     */

    //         it("should not report a violation for eslint-disable-line in block comment", () => {
    //             const code = [
    //                 "alert('test'); // eslint-disable-line no-alert",
    //                 "alert('test'); /*eslint-disable-line no-alert*/"
    //             ].join("\n");
    //             const config = {
    //                 rules: {
    //                     "no-alert": 1
    //                 }
    //             };

    //             const messages = linter.verify(code, config, filename);

    /*
     *             assert.strictEqual(messages.length, 0);
     *         });
     */

    /*
     *         it("should not report a violation", () => {
     *             const code = [
     *                 "alert('test'); // eslint-disable-line no-alert",
     *                 "console.log('test'); // eslint-disable-line no-console"
     *             ].join("\n");
     *             const config = {
     *                 rules: {
     *                     "no-alert": 1,
     *                     "no-console": 1
     *                 }
     *             };
     */

    //             const messages = linter.verify(code, config, filename);

    /*
     *             assert.strictEqual(messages.length, 0);
     *         });
     */

    /*
     *         it("should not report a violation", () => {
     *             const code = [
     *                 "alert('test') // eslint-disable-line no-alert, quotes, semi",
     *                 "console.log('test'); // eslint-disable-line"
     *             ].join("\n");
     *             const config = {
     *                 rules: {
     *                     "no-alert": 1,
     *                     quotes: [1, "double"],
     *                     semi: [1, "always"],
     *                     "no-console": 1
     *                 }
     *             };
     */

    //             const messages = linter.verify(code, config, filename);

    /*
     *             assert.strictEqual(messages.length, 0);
     *         });
     */

    //         it("should not report a violation", () => {
    //             const code = [
    //                 "alert('test') /* eslint-disable-line no-alert, quotes, semi */",
    //                 "console.log('test'); /* eslint-disable-line */"
    //             ].join("\n");
    //             const config = {
    //                 rules: {
    //                     "no-alert": 1,
    //                     quotes: [1, "double"],
    //                     semi: [1, "always"],
    //                     "no-console": 1
    //                 }
    //             };

    //             const messages = linter.verify(code, config, filename);

    /*
     *             assert.strictEqual(messages.length, 0);
     *         });
     */

    //         it("should ignore violations of multiple rules when specified in mixed comments", () => {
    //             const code = [
    //                 " alert(\"test\"); /* eslint-disable-line no-alert */ // eslint-disable-line quotes"
    //             ].join("\n");
    //             const config = {
    //                 rules: {
    //                     "no-alert": 1,
    //                     quotes: [1, "single"]
    //                 }
    //             };
    //             const messages = linter.verify(code, config, filename);

    /*
     *             assert.strictEqual(messages.length, 0);
     *         });
     *     });
     */

    /*
     *     describe("eslint-disable-next-line", () => {
     *         it("should ignore violation of specified rule on next line", () => {
     *             const code = [
     *                 "// eslint-disable-next-line no-alert",
     *                 "alert('test');",
     *                 "console.log('test');"
     *             ].join("\n");
     *             const config = {
     *                 rules: {
     *                     "no-alert": 1,
     *                     "no-console": 1
     *                 }
     *             };
     *             const messages = linter.verify(code, config, filename);
     */

    /*
     *             assert.strictEqual(messages.length, 1);
     *             assert.strictEqual(messages[0].ruleId, "no-console");
     *         });
     */

    //         it("should ignore violation of specified rule if eslint-disable-next-line is a block comment", () => {
    //             const code = [
    //                 "/* eslint-disable-next-line no-alert */",
    //                 "alert('test');",
    //                 "console.log('test');"
    //             ].join("\n");
    //             const config = {
    //                 rules: {
    //                     "no-alert": 1,
    //                     "no-console": 1
    //                 }
    //             };
    //             const messages = linter.verify(code, config, filename);

    //             assert.strictEqual(messages.length, 1);
    //             assert.strictEqual(messages[0].ruleId, "no-console");
    //         });
    //         it("should ignore violation of specified rule if eslint-disable-next-line is a block comment", () => {
    //             const code = [
    //                 "/* eslint-disable-next-line no-alert */",
    //                 "alert('test');"
    //             ].join("\n");
    //             const config = {
    //                 rules: {
    //                     "no-alert": 1
    //                 }
    //             };
    //             const messages = linter.verify(code, config, filename);

    /*
     *             assert.strictEqual(messages.length, 0);
     *         });
     */

    //         it("should not ignore violation if block comment is not on a single line", () => {
    //             const code = [
    //                 "/* eslint-disable-next-line",
    //                 "no-alert */alert('test');"
    //             ].join("\n");
    //             const config = {
    //                 rules: {
    //                     "no-alert": 1
    //                 }
    //             };
    //             const messages = linter.verify(code, config, filename);

    /*
     *             assert.strictEqual(messages.length, 2);
     *             assert.strictEqual(messages[1].ruleId, "no-alert");
     *         });
     */

    /*
     *         it("should ignore violations only of specified rule", () => {
     *             const code = [
     *                 "// eslint-disable-next-line no-console",
     *                 "alert('test');",
     *                 "console.log('test');"
     *             ].join("\n");
     *             const config = {
     *                 rules: {
     *                     "no-alert": 1,
     *                     "no-console": 1
     *                 }
     *             };
     *             const messages = linter.verify(code, config, filename);
     */

    /*
     *             assert.strictEqual(messages.length, 2);
     *             assert.strictEqual(messages[0].ruleId, "no-alert");
     *             assert.strictEqual(messages[1].ruleId, "no-console");
     *         });
     */

    /*
     *         it("should ignore violations of multiple rules when specified", () => {
     *             const code = [
     *                 "// eslint-disable-next-line no-alert, quotes",
     *                 "alert(\"test\");",
     *                 "console.log('test');"
     *             ].join("\n");
     *             const config = {
     *                 rules: {
     *                     "no-alert": 1,
     *                     quotes: [1, "single"],
     *                     "no-console": 1
     *                 }
     *             };
     *             const messages = linter.verify(code, config, filename);
     */

    /*
     *             assert.strictEqual(messages.length, 1);
     *             assert.strictEqual(messages[0].ruleId, "no-console");
     *         });
     */

    //         it("should ignore violations of multiple rules when specified in mixed comments", () => {
    //             const code = [
    //                 "/* eslint-disable-next-line no-alert */ // eslint-disable-next-line quotes",
    //                 "alert(\"test\");"
    //             ].join("\n");
    //             const config = {
    //                 rules: {
    //                     "no-alert": 1,
    //                     quotes: [1, "single"]
    //                 }
    //             };
    //             const messages = linter.verify(code, config, filename);

    /*
     *             assert.strictEqual(messages.length, 0);
     *         });
     */

    /*
     *         it("should ignore violations of only the specified rule on next line", () => {
     *             const code = [
     *                 "// eslint-disable-next-line quotes",
     *                 "alert(\"test\");",
     *                 "console.log('test');"
     *             ].join("\n");
     *             const config = {
     *                 rules: {
     *                     "no-alert": 1,
     *                     quotes: [1, "single"],
     *                     "no-console": 1
     *                 }
     *             };
     *             const messages = linter.verify(code, config, filename);
     */

    /*
     *             assert.strictEqual(messages.length, 2);
     *             assert.strictEqual(messages[0].ruleId, "no-alert");
     *             assert.strictEqual(messages[1].ruleId, "no-console");
     *         });
     */

    /*
     *         it("should ignore violations of specified rule on next line only", () => {
     *             const code = [
     *                 "alert('test');",
     *                 "// eslint-disable-next-line no-alert",
     *                 "alert('test');",
     *                 "console.log('test');"
     *             ].join("\n");
     *             const config = {
     *                 rules: {
     *                     "no-alert": 1,
     *                     "no-console": 1
     *                 }
     *             };
     *             const messages = linter.verify(code, config, filename);
     */

    /*
     *             assert.strictEqual(messages.length, 2);
     *             assert.strictEqual(messages[0].ruleId, "no-alert");
     *             assert.strictEqual(messages[1].ruleId, "no-console");
     *         });
     */

    /*
     *         it("should ignore all rule violations on next line if none specified", () => {
     *             const code = [
     *                 "// eslint-disable-next-line",
     *                 "alert(\"test\");",
     *                 "console.log('test')"
     *             ].join("\n");
     *             const config = {
     *                 rules: {
     *                     semi: [1, "never"],
     *                     quotes: [1, "single"],
     *                     "no-alert": 1,
     *                     "no-console": 1
     *                 }
     *             };
     *             const messages = linter.verify(code, config, filename);
     */

    /*
     *             assert.strictEqual(messages.length, 1);
     *             assert.strictEqual(messages[0].ruleId, "no-console");
     *         });
     */

    //         it("should ignore violations if eslint-disable-next-line is a block comment", () => {
    //             const code = [
    //                 "alert('test');",
    //                 "/* eslint-disable-next-line no-alert */",
    //                 "alert('test');",
    //                 "console.log('test');"
    //             ].join("\n");
    //             const config = {
    //                 rules: {
    //                     "no-alert": 1,
    //                     "no-console": 1
    //                 }
    //             };
    //             const messages = linter.verify(code, config, filename);

    /*
     *             assert.strictEqual(messages.length, 2);
     *             assert.strictEqual(messages[0].ruleId, "no-alert");
     *             assert.strictEqual(messages[1].ruleId, "no-console");
     *         });
     */

    //         it("should report a violation", () => {
    //             const code = [
    //                 "/* eslint-disable-next-line",
    //                 "*",
    //                 "*/",
    //                 "console.log('test');" // here
    //             ].join("\n");
    //             const config = {
    //                 rules: {
    //                     "no-alert": 1,
    //                     "no-console": 1
    //                 }
    //             };

    //             const messages = linter.verify(code, config, filename);

    //             assert.strictEqual(messages.length, 2);

    /*
     *             assert.strictEqual(messages[1].ruleId, "no-console");
     *         });
     */

    /*
     *         it("should not ignore violations if comment is of the type Shebang", () => {
     *             const code = [
     *                 "#! eslint-disable-next-line no-alert",
     *                 "alert('test');",
     *                 "console.log('test');"
     *             ].join("\n");
     *             const config = {
     *                 rules: {
     *                     "no-alert": 1,
     *                     "no-console": 1
     *                 }
     *             };
     *             const messages = linter.verify(code, config, filename);
     */

    /*
     *             assert.strictEqual(messages.length, 2);
     *             assert.strictEqual(messages[0].ruleId, "no-alert");
     *             assert.strictEqual(messages[1].ruleId, "no-console");
     *         });
     *     });
     * });
     */

    // describe("when evaluating code with comments to enable and disable reporting of specific rules", () => {

    //     it("should report a violation", () => {
    //         const code = [
    //             "/*eslint-disable no-alert */",
    //             "alert('test');",
    //             "console.log('test');" // here
    //         ].join("\n");
    //         const config = { rules: { "no-alert": 1, "no-console": 1 } };

    //         const messages = linter.verify(code, config, filename);

    //         assert.strictEqual(messages.length, 1);

    /*
     *         assert.strictEqual(messages[0].ruleId, "no-console");
     *     });
     */

    //     it("should report no violation", () => {
    //         const code = [
    //             "/*eslint-disable no-unused-vars */",
    //             "var foo; // eslint-disable-line no-unused-vars",
    //             "var bar;",
    //             "/* eslint-enable no-unused-vars */" // here
    //         ].join("\n");
    //         const config = { rules: { "no-unused-vars": 2 } };

    //         const messages = linter.verify(code, config, filename);

    /*
     *         assert.strictEqual(messages.length, 0);
     *     });
     */

    /*
     *     it("should report no violation", () => {
     *         const code = [
     *             "var foo1; // eslint-disable-line no-unused-vars",
     *             "var foo2; // eslint-disable-line no-unused-vars",
     *             "var foo3; // eslint-disable-line no-unused-vars",
     *             "var foo4; // eslint-disable-line no-unused-vars",
     *             "var foo5; // eslint-disable-line no-unused-vars"
     *         ].join("\n");
     *         const config = { rules: { "no-unused-vars": 2 } };
     */

    //         const messages = linter.verify(code, config, filename);

    /*
     *         assert.strictEqual(messages.length, 0);
     *     });
     */

    //     it("should report no violation", () => {
    //         const code = [
    //             "/* eslint-disable quotes */",
    //             "console.log(\"foo\");",
    //             "/* eslint-enable quotes */"
    //         ].join("\n");
    //         const config = { rules: { quotes: 2 } };

    //         const messages = linter.verify(code, config, filename);

    /*
     *         assert.strictEqual(messages.length, 0);
     *     });
     */

    //     it("should report a violation", () => {
    //         const code = [
    //             "/*eslint-disable no-alert, no-console */",
    //             "alert('test');",
    //             "console.log('test');",
    //             "/*eslint-enable*/",

    /*
     *             "alert('test');", // here
     *             "console.log('test');" // here
     *         ].join("\n");
     *         const config = { rules: { "no-alert": 1, "no-console": 1 } };
     */

    //         const messages = linter.verify(code, config, filename);

    //         assert.strictEqual(messages.length, 2);

    /*
     *         assert.strictEqual(messages[0].ruleId, "no-alert");
     *         assert.strictEqual(messages[0].line, 5);
     *         assert.strictEqual(messages[1].ruleId, "no-console");
     *         assert.strictEqual(messages[1].line, 6);
     *     });
     */

    //     it("should report a violation", () => {
    //         const code = [
    //             "/*eslint-disable no-alert */",
    //             "alert('test');",
    //             "console.log('test');",
    //             "/*eslint-enable no-console */",

    /*
     *             "alert('test');" // here
     *         ].join("\n");
     *         const config = { rules: { "no-alert": 1, "no-console": 1 } };
     */

    //         const messages = linter.verify(code, config, filename);

    //         assert.strictEqual(messages.length, 1);

    /*
     *         assert.strictEqual(messages[0].ruleId, "no-console");
     *     });
     */


    //     it("should report a violation", () => {
    //         const code = [
    //             "/*eslint-disable no-alert, no-console */",
    //             "alert('test');",
    //             "console.log('test');",
    //             "/*eslint-enable no-alert*/",

    /*
     *             "alert('test');", // here
     *             "console.log('test');"
     *         ].join("\n");
     *         const config = { rules: { "no-alert": 1, "no-console": 1 } };
     */

    //         const messages = linter.verify(code, config, filename);

    //         assert.strictEqual(messages.length, 1);

    /*
     *         assert.strictEqual(messages[0].ruleId, "no-alert");
     *         assert.strictEqual(messages[0].line, 5);
     *     });
     */


    //     it("should report a violation", () => {
    //         const code = [
    //             "/*eslint-disable no-alert */",

    //             "/*eslint-disable no-console */",
    //             "alert('test');",
    //             "console.log('test');",
    //             "/*eslint-enable */",

    /*
     *             "alert('test');", // here
     *             "console.log('test');", // here
     */

    //             "/*eslint-enable */",

    /*
     *             "alert('test');", // here
     *             "console.log('test');", // here
     */

    //             "/*eslint-enable*/"
    //         ].join("\n");
    //         const config = { rules: { "no-alert": 1, "no-console": 1 } };

    //         const messages = linter.verify(code, config, filename);

    //         assert.strictEqual(messages.length, 4);

    /*
     *         assert.strictEqual(messages[0].ruleId, "no-alert");
     *         assert.strictEqual(messages[0].line, 6);
     */

    /*
     *         assert.strictEqual(messages[1].ruleId, "no-console");
     *         assert.strictEqual(messages[1].line, 7);
     */

    /*
     *         assert.strictEqual(messages[2].ruleId, "no-alert");
     *         assert.strictEqual(messages[2].line, 9);
     */

    /*
     *         assert.strictEqual(messages[3].ruleId, "no-console");
     *         assert.strictEqual(messages[3].line, 10);
     */

    //     });

    //     it("should report a violation", () => {
    //         const code = [
    //             "/*eslint-disable no-alert, no-console */",
    //             "alert('test');",
    //             "console.log('test');",

    //             "/*eslint-enable no-alert */",

    /*
     *             "alert('test');", // here
     *             "console.log('test');",
     */

    //             "/*eslint-enable no-console */",

    //             "alert('test');", // here
    //             "console.log('test');", // here
    //             "/*eslint-enable no-console */"
    //         ].join("\n");
    //         const config = { rules: { "no-alert": 1, "no-console": 1 } };

    //         const messages = linter.verify(code, config, filename);

    //         assert.strictEqual(messages.length, 3);

    /*
     *         assert.strictEqual(messages[0].ruleId, "no-alert");
     *         assert.strictEqual(messages[0].line, 5);
     */

    /*
     *         assert.strictEqual(messages[1].ruleId, "no-alert");
     *         assert.strictEqual(messages[1].line, 8);
     */

    /*
     *         assert.strictEqual(messages[2].ruleId, "no-console");
     *         assert.strictEqual(messages[2].line, 9);
     */

    //     });

    //     it("should report a violation when severity is warn", () => {
    //         const code = [
    //             "/*eslint-disable no-alert, no-console */",
    //             "alert('test');",
    //             "console.log('test');",

    //             "/*eslint-enable no-alert */",

    /*
     *             "alert('test');", // here
     *             "console.log('test');",
     */

    //             "/*eslint-enable no-console */",

    //             "alert('test');", // here
    //             "console.log('test');", // here
    //             "/*eslint-enable no-console */"
    //         ].join("\n");
    //         const config = { rules: { "no-alert": "warn", "no-console": "warn" } };

    //         const messages = linter.verify(code, config, filename);

    //         assert.strictEqual(messages.length, 3);

    /*
     *         assert.strictEqual(messages[0].ruleId, "no-alert");
     *         assert.strictEqual(messages[0].line, 5);
     */

    /*
     *         assert.strictEqual(messages[1].ruleId, "no-alert");
     *         assert.strictEqual(messages[1].line, 8);
     */

    /*
     *         assert.strictEqual(messages[2].ruleId, "no-console");
     *         assert.strictEqual(messages[2].line, 9);
     */

    /*
     *     });
     * });
     */

    // describe("when evaluating code with comments to enable and disable multiple comma separated rules", () => {
    //     const code = "/*eslint no-alert:1, no-console:0*/ alert('test'); console.log('test');";

    /*
     *     it("should report a violation", () => {
     *         const config = { rules: { "no-console": 1, "no-alert": 0 } };
     */

    //         const messages = linter.verify(code, config, filename);

    /*
     *         assert.strictEqual(messages.length, 1);
     *         assert.strictEqual(messages[0].ruleId, "no-alert");
     *         assert.strictEqual(messages[0].message, "Unexpected alert.");
     *         assert.include(messages[0].nodeType, "CallExpression");
     *     });
     * });
     */

    // describe("when evaluating code with comments to enable configurable rule", () => {
    //     const code = "/*eslint quotes:[2, \"double\"]*/ alert('test');";

    /*
     *     it("should report a violation", () => {
     *         const config = { rules: { quotes: [2, "single"] } };
     */

    //         const messages = linter.verify(code, config, filename);

    /*
     *         assert.strictEqual(messages.length, 1);
     *         assert.strictEqual(messages[0].ruleId, "quotes");
     *         assert.strictEqual(messages[0].message, "Strings must use doublequote.");
     *         assert.include(messages[0].nodeType, "Literal");
     *     });
     * });
     */

    // describe("when evaluating code with comments to enable configurable rule using string severity", () => {
    //     const code = "/*eslint quotes:[\"error\", \"double\"]*/ alert('test');";

    /*
     *     it("should report a violation", () => {
     *         const config = { rules: { quotes: [2, "single"] } };
     */

    //         const messages = linter.verify(code, config, filename);

    /*
     *         assert.strictEqual(messages.length, 1);
     *         assert.strictEqual(messages[0].ruleId, "quotes");
     *         assert.strictEqual(messages[0].message, "Strings must use doublequote.");
     *         assert.include(messages[0].nodeType, "Literal");
     *     });
     * });
     */

    // describe("when evaluating code with incorrectly formatted comments to disable rule", () => {
    //     it("should report a violation", () => {
    //         const code = "/*eslint no-alert:'1'*/ alert('test');";

    //         const config = { rules: { "no-alert": 1 } };

    //         const messages = linter.verify(code, config, filename);

    //         assert.strictEqual(messages.length, 2);

    //         /*
    //          * Incorrectly formatted comment threw error;
    //          * message from caught exception
    //          * may differ amongst UAs, so verifying
    //          * first part only as defined in the
    //          * parseJsonConfig function in lib/eslint.js
    //          */
    //         assert.match(messages[0].message, /^Failed to parse JSON from ' "no-alert":'1'':/);
    //         assert.strictEqual(messages[0].line, 1);
    //         assert.strictEqual(messages[0].column, 1);

    /*
     *         assert.strictEqual(messages[1].ruleId, "no-alert");
     *         assert.strictEqual(messages[1].message, "Unexpected alert.");
     *         assert.include(messages[1].nodeType, "CallExpression");
     *     });
     */

    //     it("should report a violation", () => {
    //         const code = "/*eslint no-alert:abc*/ alert('test');";

    //         const config = { rules: { "no-alert": 1 } };

    //         const messages = linter.verify(code, config, filename);

    //         assert.strictEqual(messages.length, 2);

    //         /*
    //          * Incorrectly formatted comment threw error;
    //          * message from caught exception
    //          * may differ amongst UAs, so verifying
    //          * first part only as defined in the
    //          * parseJsonConfig function in lib/eslint.js
    //          */
    //         assert.match(messages[0].message, /^Failed to parse JSON from ' "no-alert":abc':/);
    //         assert.strictEqual(messages[0].line, 1);
    //         assert.strictEqual(messages[0].column, 1);

    /*
     *         assert.strictEqual(messages[1].ruleId, "no-alert");
     *         assert.strictEqual(messages[1].message, "Unexpected alert.");
     *         assert.include(messages[1].nodeType, "CallExpression");
     *     });
     */

    //     it("should report a violation", () => {
    //         const code = "/*eslint no-alert:0 2*/ alert('test');";

    //         const config = { rules: { "no-alert": 1 } };

    //         const messages = linter.verify(code, config, filename);

    //         assert.strictEqual(messages.length, 2);

    //         /*
    //          * Incorrectly formatted comment threw error;
    //          * message from caught exception
    //          * may differ amongst UAs, so verifying
    //          * first part only as defined in the
    //          * parseJsonConfig function in lib/eslint.js
    //          */
    //         assert.match(messages[0].message, /^Failed to parse JSON from ' "no-alert":0 2':/);
    //         assert.strictEqual(messages[0].line, 1);
    //         assert.strictEqual(messages[0].column, 1);

    /*
     *         assert.strictEqual(messages[1].ruleId, "no-alert");
     *         assert.strictEqual(messages[1].message, "Unexpected alert.");
     *         assert.include(messages[1].nodeType, "CallExpression");
     *     });
     * });
     */

    // describe("when evaluating code with comments which have colon in its value", () => {
    //     const code = "/* eslint max-len: [2, 100, 2, {ignoreUrls: true, ignorePattern: \"data:image\\/|\\s*require\\s*\\(|^\\s*loader\\.lazy|-\\*-\"}] */\nalert('test');";

    /*
     *     it("should not parse errors, should report a violation", () => {
     *         const messages = linter.verify(code, {}, filename);
     */

    /*
     *         assert.strictEqual(messages.length, 1);
     *         assert.strictEqual(messages[0].ruleId, "max-len");
     *         assert.strictEqual(messages[0].message, "Line 1 exceeds the maximum line length of 100.");
     *         assert.include(messages[0].nodeType, "Program");
     *     });
     * });
     */

    /*
     * describe("when evaluating a file with a shebang", () => {
     *     const code = "#!bin/program\n\nvar foo;;";
     */

    /*
     *     it("should preserve line numbers", () => {
     *         const config = { rules: { "no-extra-semi": 1 } };
     *         const messages = linter.verify(code, config);
     */

    /*
     *         assert.strictEqual(messages.length, 1);
     *         assert.strictEqual(messages[0].ruleId, "no-extra-semi");
     *         assert.strictEqual(messages[0].nodeType, "EmptyStatement");
     *         assert.strictEqual(messages[0].line, 3);
     *     });
     */

    /*
     *     it("should have a comment with the shebang in it", () => {
     *         const config = { rules: { checker: "error" } };
     *         const spy = sandbox.spy(context => {
     *             const comments = context.getAllComments();
     */

    /*
     *             assert.strictEqual(comments.length, 1);
     *             assert.strictEqual(comments[0].type, "Shebang");
     *             return {};
     *         });
     */

    /*
     *         linter.defineRule("checker", spy);
     *         linter.verify(code, config);
     *         assert(spy.calledOnce);
     *     });
     * });
     */

    /*
     * describe("when evaluating broken code", () => {
     *     const code = BROKEN_TEST_CODE;
     */

    /*
     *     it("should report a violation with a useful parse error prefix", () => {
     *         const messages = linter.verify(code);
     */

    /*
     *         assert.strictEqual(messages.length, 1);
     *         assert.strictEqual(messages[0].severity, 2);
     *         assert.isNull(messages[0].ruleId);
     *         assert.strictEqual(messages[0].line, 1);
     *         assert.strictEqual(messages[0].column, 4);
     *         assert.isTrue(messages[0].fatal);
     *         assert.match(messages[0].message, /^Parsing error:/);
     *     });
     */

    /*
     *     it("should report source code where the issue is present", () => {
     *         const inValidCode = [
     *             "var x = 20;",
     *             "if (x ==4 {",
     *             "    x++;",
     *             "}"
     *         ];
     *         const messages = linter.verify(inValidCode.join("\n"));
     */

    /*
     *         assert.strictEqual(messages.length, 1);
     *         assert.strictEqual(messages[0].severity, 2);
     *         assert.isTrue(messages[0].fatal);
     *         assert.match(messages[0].message, /^Parsing error:/);
     *     });
     * });
     */

    /*
     * describe("when using an invalid (undefined) rule", () => {
     *     linter = new Linter();
     */

    /*
     *     const code = TEST_CODE;
     *     const results = linter.verify(code, { rules: { foobar: 2 } });
     *     const result = results[0];
     *     const warningResult = linter.verify(code, { rules: { foobar: 1 } })[0];
     *     const arrayOptionResults = linter.verify(code, { rules: { foobar: [2, "always"] } });
     *     const objectOptionResults = linter.verify(code, { rules: { foobar: [1, { bar: false }] } });
     *     const resultsMultiple = linter.verify(code, { rules: { foobar: 2, barfoo: 1 } });
     */

    /*
     *     it("should add a stub rule", () => {
     *         assert.isNotNull(result);
     *         assert.isArray(results);
     *         assert.isObject(result);
     *         assert.property(result, "ruleId");
     *         assert.strictEqual(result.ruleId, "foobar");
     *     });
     */

    /*
     *     it("should report that the rule does not exist", () => {
     *         assert.property(result, "message");
     *         assert.strictEqual(result.message, "Definition for rule 'foobar' was not found");
     *     });
     */

    /*
     *     it("should report at the correct severity", () => {
     *         assert.property(result, "severity");
     *         assert.strictEqual(result.severity, 2);
     *         assert.strictEqual(warningResult.severity, 1);
     *     });
     */

    /*
     *     it("should accept any valid rule configuration", () => {
     *         assert.isObject(arrayOptionResults[0]);
     *         assert.isObject(objectOptionResults[0]);
     *     });
     */

    /*
     *     it("should report multiple missing rules", () => {
     *         assert.isArray(resultsMultiple);
     */

    /*
     *         assert.deepStrictEqual(
     *             resultsMultiple[1],
     *             {
     *                 ruleId: "barfoo",
     *                 message: "Definition for rule 'barfoo' was not found",
     *                 line: 1,
     *                 column: 1,
     *                 severity: 1,
     *                 nodeType: null
     *             }
     *         );
     *     });
     * });
     */

    /*
     * describe("when using a rule which has been replaced", () => {
     *     const code = TEST_CODE;
     *     const results = linter.verify(code, { rules: { "no-comma-dangle": 2 } });
     */

    /*
     *     it("should report the new rule", () => {
     *         assert.strictEqual(results[0].ruleId, "no-comma-dangle");
     *         assert.strictEqual(results[0].message, "Rule 'no-comma-dangle' was removed and replaced by: comma-dangle");
     *     });
     * });
     */

    /*
     * describe("when calling getRules", () => {
     *     it("should return all loaded rules", () => {
     *         const rules = linter.getRules();
     */

    /*
     *         assert.isAbove(rules.size, 230);
     *         assert.isObject(rules.get("no-alert"));
     *     });
     * });
     */

    /*
     * describe("when calling version", () => {
     *     it("should return current version number", () => {
     *         const version = linter.version;
     */

    /*
     *         assert.isString(version);
     *         assert.isTrue(parseInt(version[0], 10) >= 3);
     *     });
     * });
     */

    /*
     * describe("when evaluating an empty string", () => {
     *     it("runs rules", () => {
     *         linter.defineRule("no-programs", context => ({
     *             Program(node) {
     *                 context.report({ node, message: "No programs allowed." });
     *             }
     *         }));
     */

    /*
     *         assert.strictEqual(
     *             linter.verify("", { rules: { "no-programs": "error" } }).length,
     *             1
     *         );
     *     });
     * });
     */

    /*
     * describe("when evaluating code without comments to environment", () => {
     *     it("should report a violation when using typed array", () => {
     *         const code = "var array = new Uint8Array();";
     */

    //         const config = { rules: { "no-undef": 1 } };

    //         const messages = linter.verify(code, config, filename);

    /*
     *         assert.strictEqual(messages.length, 1);
     *     });
     */

    /*
     *     it("should report a violation when using Promise", () => {
     *         const code = "new Promise();";
     */

    //         const config = { rules: { "no-undef": 1 } };

    //         const messages = linter.verify(code, config, filename);

    /*
     *         assert.strictEqual(messages.length, 1);
     *     });
     * });
     */

    // describe("when evaluating code with comments to environment", () => {
    //     it("should not support legacy config", () => {
    //         const code = "/*jshint mocha:true */ describe();";

    //         const config = { rules: { "no-undef": 1 } };

    //         const messages = linter.verify(code, config, filename);

    /*
     *         assert.strictEqual(messages.length, 1);
     *         assert.strictEqual(messages[0].ruleId, "no-undef");
     *         assert.strictEqual(messages[0].nodeType, "Identifier");
     *         assert.strictEqual(messages[0].line, 1);
     *     });
     */

    //     it("should not report a violation", () => {
    //         const code = "/*eslint-env es6 */ new Promise();";

    //         const config = { rules: { "no-undef": 1 } };

    //         const messages = linter.verify(code, config, filename);

    /*
     *         assert.strictEqual(messages.length, 0);
     *     });
     */

    //     it("should not report a violation", () => {
    //         const code = "/*eslint-env mocha,node */ require();describe();";

    //         const config = { rules: { "no-undef": 1 } };

    //         const messages = linter.verify(code, config, filename);

    /*
     *         assert.strictEqual(messages.length, 0);
     *     });
     */

    //     it("should not report a violation", () => {
    //         const code = "/*eslint-env mocha */ suite();test();";

    //         const config = { rules: { "no-undef": 1 } };

    //         const messages = linter.verify(code, config, filename);

    /*
     *         assert.strictEqual(messages.length, 0);
     *     });
     */

    //     it("should not report a violation", () => {
    //         const code = "/*eslint-env amd */ define();require();";

    //         const config = { rules: { "no-undef": 1 } };

    //         const messages = linter.verify(code, config, filename);

    /*
     *         assert.strictEqual(messages.length, 0);
     *     });
     */

    //     it("should not report a violation", () => {
    //         const code = "/*eslint-env jasmine */ expect();spyOn();";

    //         const config = { rules: { "no-undef": 1 } };

    //         const messages = linter.verify(code, config, filename);

    /*
     *         assert.strictEqual(messages.length, 0);
     *     });
     */

    //     it("should not report a violation", () => {
    //         const code = "/*globals require: true */ /*eslint-env node */ require = 1;";

    //         const config = { rules: { "no-undef": 1 } };

    //         const messages = linter.verify(code, config, filename);

    /*
     *         assert.strictEqual(messages.length, 0);
     *     });
     */

    //     it("should not report a violation", () => {
    //         const code = "/*eslint-env node */ process.exit();";

    //         const config = { rules: {} };

    //         const messages = linter.verify(code, config, filename);

    /*
     *         assert.strictEqual(messages.length, 0);
     *     });
     */

    //     it("should not report a violation", () => {
    //         const code = "/*eslint no-process-exit: 0 */ /*eslint-env node */ process.exit();";

    //         const config = { rules: { "no-undef": 1 } };

    //         const messages = linter.verify(code, config, filename);

    /*
     *         assert.strictEqual(messages.length, 0);
     *     });
     * });
     */

    /*
     * describe("when evaluating code with comments to change config when allowInlineConfig is enabled", () => {
     *     it("should report a violation for disabling rules", () => {
     *         const code = [
     *             "alert('test'); // eslint-disable-line no-alert"
     *         ].join("\n");
     *         const config = {
     *             rules: {
     *                 "no-alert": 1
     *             }
     *         };
     */

    /*
     *         const messages = linter.verify(code, config, {
     *             filename,
     *             allowInlineConfig: false
     *         });
     */

    /*
     *         assert.strictEqual(messages.length, 1);
     *         assert.strictEqual(messages[0].ruleId, "no-alert");
     *     });
     */

    //     it("should report a violation for global variable declarations", () => {
    //         const code = [
    //             "/* global foo */"
    //         ].join("\n");
    //         const config = {
    //             rules: {
    //                 test: 2
    //             }
    //         };
    //         let ok = false;

    /*
     *         linter.defineRules({
     *             test(context) {
     *                 return {
     *                     Program() {
     *                         const scope = context.getScope();
     *                         const sourceCode = context.getSourceCode();
     *                         const comments = sourceCode.getAllComments();
     */

    //                         assert.strictEqual(1, comments.length);

    //                         const foo = getVariable(scope, "foo");

    //                         assert.notOk(foo);

    /*
     *                         ok = true;
     *                     }
     *                 };
     *             }
     *         });
     */

    /*
     *         linter.verify(code, config, { allowInlineConfig: false });
     *         assert(ok);
     *     });
     */

    //     it("should report a violation for eslint-disable", () => {
    //         const code = [
    //             "/* eslint-disable */",
    //             "alert('test');"
    //         ].join("\n");
    //         const config = {
    //             rules: {
    //                 "no-alert": 1
    //             }
    //         };

    /*
     *         const messages = linter.verify(code, config, {
     *             filename,
     *             allowInlineConfig: false
     *         });
     */

    /*
     *         assert.strictEqual(messages.length, 1);
     *         assert.strictEqual(messages[0].ruleId, "no-alert");
     *     });
     */

    //     it("should not report a violation for rule changes", () => {
    //         const code = [
    //             "/*eslint no-alert:2*/",
    //             "alert('test');"
    //         ].join("\n");
    //         const config = {
    //             rules: {
    //                 "no-alert": 0
    //             }
    //         };

    /*
     *         const messages = linter.verify(code, config, {
     *             filename,
     *             allowInlineConfig: false
     *         });
     */

    /*
     *         assert.strictEqual(messages.length, 0);
     *     });
     */

    /*
     *     it("should report a violation for disable-line", () => {
     *         const code = [
     *             "alert('test'); // eslint-disable-line"
     *         ].join("\n");
     *         const config = {
     *             rules: {
     *                 "no-alert": 2
     *             }
     *         };
     */

    /*
     *         const messages = linter.verify(code, config, {
     *             filename,
     *             allowInlineConfig: false
     *         });
     */

    /*
     *         assert.strictEqual(messages.length, 1);
     *         assert.strictEqual(messages[0].ruleId, "no-alert");
     *     });
     */

    //     it("should report a violation for env changes", () => {
    //         const code = [
    //             "/*eslint-env browser*/"
    //         ].join("\n");
    //         const config = {
    //             rules: {
    //                 test: 2
    //             }
    //         };
    //         let ok = false;

    /*
     *         linter.defineRules({
     *             test(context) {
     *                 return {
     *                     Program() {
     *                         const scope = context.getScope();
     *                         const sourceCode = context.getSourceCode();
     *                         const comments = sourceCode.getAllComments();
     */

    //                         assert.strictEqual(1, comments.length);

    //                         const windowVar = getVariable(scope, "window");

    //                         assert.notOk(windowVar.eslintExplicitGlobal);

    /*
     *                         ok = true;
     *                     }
     *                 };
     *             }
     *         });
     */

    /*
     *         linter.verify(code, config, { allowInlineConfig: false });
     *         assert(ok);
     *     });
     * });
     */

    // describe("reportUnusedDisable option", () => {
    //     it("reports problems for unused eslint-disable comments", () => {
    //         assert.deepStrictEqual(
    //             linter.verify("/* eslint-disable */", {}, { reportUnusedDisableDirectives: true }),
    //             [
    //                 {
    //                     ruleId: null,
    //                     message: "Unused eslint-disable directive (no problems were reported).",
    //                     line: 1,
    //                     column: 1,
    //                     severity: 2,
    //                     nodeType: null
    //                 }
    //             ]
    //         );
    //     });
    // });

    /*
     * describe("when evaluating code with comments to change config when allowInlineConfig is disabled", () => {
     *     it("should not report a violation", () => {
     *         const code = [
     *             "alert('test'); // eslint-disable-line no-alert"
     *         ].join("\n");
     *         const config = {
     *             rules: {
     *                 "no-alert": 1
     *             }
     *         };
     */

    /*
     *         const messages = linter.verify(code, config, {
     *             filename,
     *             allowInlineConfig: true
     *         });
     */

    /*
     *         assert.strictEqual(messages.length, 0);
     *     });
     * });
     */

});
