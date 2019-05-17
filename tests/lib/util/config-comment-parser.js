/**
 * @fileoverview Tests for ConfigCommentParser object.
 * @author Nicholas C. Zakas
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("chai").assert,
    ConfigCommentParser = require("../../../lib/util/config-comment-parser");

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

});
