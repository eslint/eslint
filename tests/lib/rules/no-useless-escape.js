/**
 * @fileoverview Look for useless escapes in strings and regexes
 * @author Onur Temizkan
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-useless-escape"),
    { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-useless-escape", rule, {
    valid: [
        "var foo = /\\./",
        "var foo = /\\//g",
        "var foo = /\"\"/",
        "var foo = /''/",
        "var foo = /([A-Z])\\t+/g",
        "var foo = /([A-Z])\\n+/g",
        "var foo = /([A-Z])\\v+/g",
        "var foo = /\\D/",
        "var foo = /\\W/",
        "var foo = /\\w/",
        "var foo = /\\B/",
        "var foo = /\\\\/g",
        "var foo = /\\w\\$\\*\\./",
        "var foo = /\\^\\+\\./",
        "var foo = /\\|\\}\\{\\./",
        "var foo = /]\\[\\(\\)\\//",
        "var foo = \"\\x123\"",
        "var foo = \"\\u00a9\"",
        "var foo = \"\\377\"",
        "var foo = \"\\\"\"",
        "var foo = \"xs\\u2111\"",
        "var foo = \"foo \\\\ bar\";",
        "var foo = \"\\t\";",
        "var foo = \"foo \\b bar\";",
        "var foo = '\\n';",
        "var foo = 'foo \\r bar';",
        "var foo = '\\v';",
        "var foo = '\\f';",
        "var foo = '\\\n';",
        "var foo = '\\\r\n';",
        { code: "<foo attr=\"\\d\"/>", parserOptions: { ecmaFeatures: { jsx: true } } },
        { code: "<div> Testing: \\ </div>", parserOptions: { ecmaFeatures: { jsx: true } } },
        { code: "<div> Testing: &#x5C </div>", parserOptions: { ecmaFeatures: { jsx: true } } },
        { code: "<foo attr='\\d'></foo>", parserOptions: { ecmaFeatures: { jsx: true } } },
        { code: "<> Testing: \\ </>", parserOptions: { ecmaFeatures: { jsx: true } } },
        { code: "<> Testing: &#x5C </>", parserOptions: { ecmaFeatures: { jsx: true } } },
        { code: "var foo = `\\x123`", parserOptions: { ecmaVersion: 6 } },
        { code: "var foo = `\\u00a9`", parserOptions: { ecmaVersion: 6 } },
        { code: "var foo = `xs\\u2111`", parserOptions: { ecmaVersion: 6 } },
        { code: "var foo = `foo \\\\ bar`;", parserOptions: { ecmaVersion: 6 } },
        { code: "var foo = `\\t`;", parserOptions: { ecmaVersion: 6 } },
        { code: "var foo = `foo \\b bar`;", parserOptions: { ecmaVersion: 6 } },
        { code: "var foo = `\\n`;", parserOptions: { ecmaVersion: 6 } },
        { code: "var foo = `foo \\r bar`;", parserOptions: { ecmaVersion: 6 } },
        { code: "var foo = `\\v`;", parserOptions: { ecmaVersion: 6 } },
        { code: "var foo = `\\f`;", parserOptions: { ecmaVersion: 6 } },
        { code: "var foo = `\\\n`;", parserOptions: { ecmaVersion: 6 } },
        { code: "var foo = `\\\r\n`;", parserOptions: { ecmaVersion: 6 } },
        { code: "var foo = `${foo} \\x123`", parserOptions: { ecmaVersion: 6 } },
        { code: "var foo = `${foo} \\u00a9`", parserOptions: { ecmaVersion: 6 } },
        { code: "var foo = `${foo} xs\\u2111`", parserOptions: { ecmaVersion: 6 } },
        { code: "var foo = `${foo} \\\\ ${bar}`;", parserOptions: { ecmaVersion: 6 } },
        { code: "var foo = `${foo} \\b ${bar}`;", parserOptions: { ecmaVersion: 6 } },
        { code: "var foo = `${foo}\\t`;", parserOptions: { ecmaVersion: 6 } },
        { code: "var foo = `${foo}\\n`;", parserOptions: { ecmaVersion: 6 } },
        { code: "var foo = `${foo}\\r`;", parserOptions: { ecmaVersion: 6 } },
        { code: "var foo = `${foo}\\v`;", parserOptions: { ecmaVersion: 6 } },
        { code: "var foo = `${foo}\\f`;", parserOptions: { ecmaVersion: 6 } },
        { code: "var foo = `${foo}\\\n`;", parserOptions: { ecmaVersion: 6 } },
        { code: "var foo = `${foo}\\\r\n`;", parserOptions: { ecmaVersion: 6 } },
        { code: "var foo = `\\``", parserOptions: { ecmaVersion: 6 } },
        { code: "var foo = `\\`${foo}\\``", parserOptions: { ecmaVersion: 6 } },
        { code: "var foo = `\\${{${foo}`;", parserOptions: { ecmaVersion: 6 } },
        { code: "var foo = `$\\{{${foo}`;", parserOptions: { ecmaVersion: 6 } },
        { code: "var foo = String.raw`\\.`", parserOptions: { ecmaVersion: 6 } },
        { code: "var foo = myFunc`\\.`", parserOptions: { ecmaVersion: 6 } },

        String.raw`var foo = /[\d]/`,
        String.raw`var foo = /[a\-b]/`,
        String.raw`var foo = /foo\?/`,
        String.raw`var foo = /example\.com/`,
        String.raw`var foo = /foo\|bar/`,
        String.raw`var foo = /\^bar/`,
        String.raw`var foo = /[\^bar]/`,
        String.raw`var foo = /\(bar\)/`,
        String.raw`var foo = /[[\]]/`, // A character class containing '[' and ']'
        String.raw`var foo = /[[]\./`, // A character class containing '[', followed by a '.' character
        String.raw`var foo = /[\]\]]/`, // A (redundant) character class containing ']'
        String.raw`var foo = /\[abc]/`, // Matches the literal string '[abc]'
        String.raw`var foo = /\[foo\.bar]/`, // Matches the literal string '[foo.bar]'
        String.raw`var foo = /vi/m`,
        String.raw`var foo = /\B/`,

        // https://github.com/eslint/eslint/issues/7472
        String.raw`var foo = /\0/`, // null character
        "var foo = /\\1/", // \x01 character (octal literal)
        "var foo = /(a)\\1/", // backreference
        "var foo = /(a)\\12/", // backreference
        "var foo = /[\\0]/", // null character in character class

        "var foo = 'foo \\\u2028 bar'",
        "var foo = 'foo \\\u2029 bar'",

        // https://github.com/eslint/eslint/issues/7789
        String.raw`/]/`,
        String.raw`/\]/`,
        { code: String.raw`/\]/u`, parserOptions: { ecmaVersion: 6 } },
        String.raw`var foo = /foo\]/`,
        String.raw`var foo = /[[]\]/`, // A character class containing '[', followed by a ']' character
        String.raw`var foo = /\[foo\.bar\]/`,

        // ES2018
        { code: String.raw`var foo = /(?<a>)\k<a>/`, parserOptions: { ecmaVersion: 2018 } },
        { code: String.raw`var foo = /(\\?<a>)/`, parserOptions: { ecmaVersion: 2018 } },
        { code: String.raw`var foo = /\p{ASCII}/u`, parserOptions: { ecmaVersion: 2018 } },
        { code: String.raw`var foo = /\P{ASCII}/u`, parserOptions: { ecmaVersion: 2018 } },
        { code: String.raw`var foo = /[\p{ASCII}]/u`, parserOptions: { ecmaVersion: 2018 } },
        { code: String.raw`var foo = /[\P{ASCII}]/u`, parserOptions: { ecmaVersion: 2018 } }
    ],

    invalid: [
        {
            code: "var foo = /\\#/;",
            errors: [{
                line: 1,
                column: 12,
                endColumn: 13,
                message: "Unnecessary escape character: \\#.",
                type: "Literal",
                suggestions: [{
                    messageId: "removeEscape",
                    output: "var foo = /#/;"
                }, {
                    messageId: "escapeBackslash",
                    output: "var foo = /\\\\#/;"
                }]
            }]
        },
        {
            code: "var foo = /\\;/;",
            errors: [{
                line: 1,
                column: 12,
                endColumn: 13,
                message: "Unnecessary escape character: \\;.",
                type: "Literal",
                suggestions: [{
                    messageId: "removeEscape",
                    output: "var foo = /;/;"
                }, {
                    messageId: "escapeBackslash",
                    output: "var foo = /\\\\;/;"
                }]
            }]
        },
        {
            code: "var foo = \"\\'\";",
            errors: [{
                line: 1,
                column: 12,
                endColumn: 13,
                message: "Unnecessary escape character: \\'.",
                type: "Literal",
                suggestions: [{
                    messageId: "removeEscape",
                    output: "var foo = \"'\";"
                }, {
                    messageId: "escapeBackslash",
                    output: "var foo = \"\\\\'\";"
                }]
            }]
        },
        {
            code: "var foo = \"\\#/\";",
            errors: [{
                line: 1,
                column: 12,
                endColumn: 13,
                message: "Unnecessary escape character: \\#.",
                type: "Literal",
                suggestions: [{
                    messageId: "removeEscape",
                    output: "var foo = \"#/\";"
                }, {
                    messageId: "escapeBackslash",
                    output: "var foo = \"\\\\#/\";"
                }]
            }]
        },
        {
            code: "var foo = \"\\a\"",
            errors: [{
                line: 1,
                column: 12,
                endColumn: 13,
                message: "Unnecessary escape character: \\a.",
                type: "Literal",
                suggestions: [{
                    messageId: "removeEscape",
                    output: "var foo = \"a\""
                }, {
                    messageId: "escapeBackslash",
                    output: "var foo = \"\\\\a\""
                }]
            }]
        },
        {
            code: "var foo = \"\\B\";",
            errors: [{
                line: 1,
                column: 12,
                endColumn: 13,
                message: "Unnecessary escape character: \\B.",
                type: "Literal",
                suggestions: [{
                    messageId: "removeEscape",
                    output: "var foo = \"B\";"
                }, {
                    messageId: "escapeBackslash",
                    output: "var foo = \"\\\\B\";"
                }]
            }]
        },
        {
            code: "var foo = \"\\@\";",
            errors: [{
                line: 1,
                column: 12,
                endColumn: 13,
                message: "Unnecessary escape character: \\@.",
                type: "Literal",
                suggestions: [{
                    messageId: "removeEscape",
                    output: "var foo = \"@\";"
                }, {
                    messageId: "escapeBackslash",
                    output: "var foo = \"\\\\@\";"
                }]
            }]
        },
        {
            code: "var foo = \"foo \\a bar\";",
            errors: [{
                line: 1,
                column: 16,
                endColumn: 17,
                message: "Unnecessary escape character: \\a.",
                type: "Literal",
                suggestions: [{
                    messageId: "removeEscape",
                    output: "var foo = \"foo a bar\";"
                }, {
                    messageId: "escapeBackslash",
                    output: "var foo = \"foo \\\\a bar\";"
                }]
            }]
        },
        {
            code: "var foo = '\\\"';",
            errors: [{
                line: 1,
                column: 12,
                endColumn: 13,
                message: "Unnecessary escape character: \\\".",
                type: "Literal",
                suggestions: [{
                    messageId: "removeEscape",
                    output: "var foo = '\"';"
                }, {
                    messageId: "escapeBackslash",
                    output: "var foo = '\\\\\"';"
                }]
            }]
        },
        {
            code: "var foo = '\\#';",
            errors: [{
                line: 1,
                column: 12,
                endColumn: 13,
                message: "Unnecessary escape character: \\#.",
                type: "Literal",
                suggestions: [{
                    messageId: "removeEscape",
                    output: "var foo = '#';"
                }, {
                    messageId: "escapeBackslash",
                    output: "var foo = '\\\\#';"
                }]
            }]
        },
        {
            code: "var foo = '\\$';",
            errors: [{
                line: 1,
                column: 12,
                endColumn: 13,
                message: "Unnecessary escape character: \\$.",
                type: "Literal",
                suggestions: [{
                    messageId: "removeEscape",
                    output: "var foo = '$';"
                }, {
                    messageId: "escapeBackslash",
                    output: "var foo = '\\\\$';"
                }]
            }]
        },
        {
            code: "var foo = '\\p';",
            errors: [{
                line: 1,
                column: 12,
                endColumn: 13,
                message: "Unnecessary escape character: \\p.",
                type: "Literal",
                suggestions: [{
                    messageId: "removeEscape",
                    output: "var foo = 'p';"
                }, {
                    messageId: "escapeBackslash",
                    output: "var foo = '\\\\p';"
                }]
            }]
        },
        {
            code: "var foo = '\\p\\a\\@';",
            errors: [
                {
                    line: 1,
                    column: 12,
                    endColumn: 13,
                    message: "Unnecessary escape character: \\p.",
                    type: "Literal",
                    suggestions: [{
                        messageId: "removeEscape",
                        output: "var foo = 'p\\a\\@';"
                    }, {
                        messageId: "escapeBackslash",
                        output: "var foo = '\\\\p\\a\\@';"
                    }]
                },
                {
                    line: 1,
                    column: 14,
                    endColumn: 15,
                    message: "Unnecessary escape character: \\a.",
                    type: "Literal",
                    suggestions: [{
                        messageId: "removeEscape",
                        output: "var foo = '\\pa\\@';"
                    }, {
                        messageId: "escapeBackslash",
                        output: "var foo = '\\p\\\\a\\@';"
                    }]
                },
                {
                    line: 1,
                    column: 16,
                    endColumn: 17,
                    message: "Unnecessary escape character: \\@.",
                    type: "Literal",
                    suggestions: [{
                        messageId: "removeEscape",
                        output: "var foo = '\\p\\a@';"
                    }, {
                        messageId: "escapeBackslash",
                        output: "var foo = '\\p\\a\\\\@';"
                    }]
                }
            ]
        },
        {
            code: "<foo attr={\"\\d\"}/>",
            parserOptions: { ecmaFeatures: { jsx: true } },
            errors: [{
                line: 1,
                column: 13,
                endColumn: 14,
                message: "Unnecessary escape character: \\d.",
                type: "Literal",
                suggestions: [{
                    messageId: "removeEscape",
                    output: "<foo attr={\"d\"}/>"
                }, {
                    messageId: "escapeBackslash",
                    output: "<foo attr={\"\\\\d\"}/>"
                }]
            }]
        },
        {
            code: "var foo = '\\`';",
            errors: [{
                line: 1,
                column: 12,
                endColumn: 13,
                message: "Unnecessary escape character: \\`.",
                type: "Literal",
                suggestions: [{
                    messageId: "removeEscape",
                    output: "var foo = '`';"
                }, {
                    messageId: "escapeBackslash",
                    output: "var foo = '\\\\`';"
                }]
            }]
        },
        {
            code: "var foo = `\\\"`;",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                line: 1,
                column: 12,
                endColumn: 13,
                message: "Unnecessary escape character: \\\".",
                type: "TemplateElement",
                suggestions: [{
                    messageId: "removeEscape",
                    output: "var foo = `\"`;"
                }, {
                    messageId: "escapeBackslash",
                    output: "var foo = `\\\\\"`;"
                }]
            }]
        },
        {
            code: "var foo = `\\'`;",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                line: 1,
                column: 12,
                endColumn: 13,
                message: "Unnecessary escape character: \\'.",
                type: "TemplateElement",
                suggestions: [{
                    messageId: "removeEscape",
                    output: "var foo = `'`;"
                }, {
                    messageId: "escapeBackslash",
                    output: "var foo = `\\\\'`;"
                }]
            }]
        },
        {
            code: "var foo = `\\#`;",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                line: 1,
                column: 12,
                endColumn: 13,
                message: "Unnecessary escape character: \\#.",
                type: "TemplateElement",
                suggestions: [{
                    messageId: "removeEscape",
                    output: "var foo = `#`;"
                }, {
                    messageId: "escapeBackslash",
                    output: "var foo = `\\\\#`;"
                }]
            }]
        },
        {
            code: "var foo = '\\`foo\\`';",
            errors: [
                {
                    line: 1,
                    column: 12,
                    endColumn: 13,
                    message: "Unnecessary escape character: \\`.",
                    type: "Literal",
                    suggestions: [{
                        messageId: "removeEscape",
                        output: "var foo = '`foo\\`';"
                    }, {
                        messageId: "escapeBackslash",
                        output: "var foo = '\\\\`foo\\`';"
                    }]
                },
                {
                    line: 1,
                    column: 17,
                    endColumn: 18,
                    message: "Unnecessary escape character: \\`.",
                    type: "Literal",
                    suggestions: [{
                        messageId: "removeEscape",
                        output: "var foo = '\\`foo`';"
                    }, {
                        messageId: "escapeBackslash",
                        output: "var foo = '\\`foo\\\\`';"
                    }]
                }
            ]
        },
        {
            code: "var foo = `\\\"${foo}\\\"`;",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    line: 1,
                    column: 12,
                    endColumn: 13,
                    message: "Unnecessary escape character: \\\".",
                    type: "TemplateElement",
                    suggestions: [{
                        messageId: "removeEscape",
                        output: "var foo = `\"${foo}\\\"`;"
                    }, {
                        messageId: "escapeBackslash",
                        output: "var foo = `\\\\\"${foo}\\\"`;"
                    }]
                },
                {
                    line: 1,
                    column: 20,
                    endColumn: 21,
                    message: "Unnecessary escape character: \\\".",
                    type: "TemplateElement",
                    suggestions: [{
                        messageId: "removeEscape",
                        output: "var foo = `\\\"${foo}\"`;"
                    }, {
                        messageId: "escapeBackslash",
                        output: "var foo = `\\\"${foo}\\\\\"`;"
                    }]
                }
            ]
        },
        {
            code: "var foo = `\\'${foo}\\'`;",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    line: 1,
                    column: 12,
                    endColumn: 13,
                    message: "Unnecessary escape character: \\'.",
                    type: "TemplateElement",
                    suggestions: [{
                        messageId: "removeEscape",
                        output: "var foo = `'${foo}\\'`;"
                    }, {
                        messageId: "escapeBackslash",
                        output: "var foo = `\\\\'${foo}\\'`;"
                    }]
                },
                {
                    line: 1,
                    column: 20,
                    endColumn: 21,
                    message: "Unnecessary escape character: \\'.",
                    type: "TemplateElement",
                    suggestions: [{
                        messageId: "removeEscape",
                        output: "var foo = `\\'${foo}'`;"
                    }, {
                        messageId: "escapeBackslash",
                        output: "var foo = `\\'${foo}\\\\'`;"
                    }]
                }
            ]
        },
        {
            code: "var foo = `\\#${foo}`;",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                line: 1,
                column: 12,
                endColumn: 13,
                message: "Unnecessary escape character: \\#.",
                type: "TemplateElement",
                suggestions: [{
                    messageId: "removeEscape",
                    output: "var foo = `#${foo}`;"
                }, {
                    messageId: "escapeBackslash",
                    output: "var foo = `\\\\#${foo}`;"
                }]
            }]
        },
        {
            code: "let foo = '\\ ';",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                line: 1,
                column: 12,
                endColumn: 13,
                message: "Unnecessary escape character: \\ .",
                type: "Literal",
                suggestions: [{
                    messageId: "removeEscape",
                    output: "let foo = ' ';"
                }, {
                    messageId: "escapeBackslash",
                    output: "let foo = '\\\\ ';"
                }]
            }]
        },
        {
            code: "let foo = /\\ /;",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                line: 1,
                column: 12,
                endColumn: 13,
                message: "Unnecessary escape character: \\ .",
                type: "Literal",
                suggestions: [{
                    messageId: "removeEscape",
                    output: "let foo = / /;"
                }, {
                    messageId: "escapeBackslash",
                    output: "let foo = /\\\\ /;"
                }]
            }]
        },
        {
            code: "var foo = `\\$\\{{${foo}`;",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    line: 1,
                    column: 12,
                    endColumn: 13,
                    message: "Unnecessary escape character: \\$.",
                    type: "TemplateElement",
                    suggestions: [{
                        messageId: "removeEscape",
                        output: "var foo = `$\\{{${foo}`;"
                    }, {
                        messageId: "escapeBackslash",
                        output: "var foo = `\\\\$\\{{${foo}`;"
                    }]
                }
            ]
        },
        {
            code: "var foo = `\\$a${foo}`;",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    line: 1,
                    column: 12,
                    endColumn: 13,
                    message: "Unnecessary escape character: \\$.",
                    type: "TemplateElement",
                    suggestions: [{
                        messageId: "removeEscape",
                        output: "var foo = `$a${foo}`;"
                    }, {
                        messageId: "escapeBackslash",
                        output: "var foo = `\\\\$a${foo}`;"
                    }]
                }
            ]
        },
        {
            code: "var foo = `a\\{{${foo}`;",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    line: 1,
                    column: 13,
                    endColumn: 14,
                    message: "Unnecessary escape character: \\{.",
                    type: "TemplateElement",
                    suggestions: [{
                        messageId: "removeEscape",
                        output: "var foo = `a{{${foo}`;"
                    }, {
                        messageId: "escapeBackslash",
                        output: "var foo = `a\\\\{{${foo}`;"
                    }]
                }
            ]
        },
        {
            code: String.raw`var foo = /[ab\-]/`,
            errors: [{
                line: 1,
                column: 15,
                endColumn: 16,
                message: "Unnecessary escape character: \\-.",
                type: "Literal",
                suggestions: [{
                    messageId: "removeEscape",
                    output: String.raw`var foo = /[ab-]/`
                }, {
                    messageId: "escapeBackslash",
                    output: String.raw`var foo = /[ab\\-]/`
                }]
            }]
        },
        {
            code: String.raw`var foo = /[\-ab]/`,
            errors: [{
                line: 1,
                column: 13,
                endColumn: 14,
                message: "Unnecessary escape character: \\-.",
                type: "Literal",
                suggestions: [{
                    messageId: "removeEscape",
                    output: String.raw`var foo = /[-ab]/`
                }, {
                    messageId: "escapeBackslash",
                    output: String.raw`var foo = /[\\-ab]/`
                }]
            }]
        },
        {
            code: String.raw`var foo = /[ab\?]/`,
            errors: [{
                line: 1,
                column: 15,
                endColumn: 16,
                message: "Unnecessary escape character: \\?.",
                type: "Literal",
                suggestions: [{
                    messageId: "removeEscape",
                    output: String.raw`var foo = /[ab?]/`
                }, {
                    messageId: "escapeBackslash",
                    output: String.raw`var foo = /[ab\\?]/`
                }]
            }]
        },
        {
            code: String.raw`var foo = /[ab\.]/`,
            errors: [{
                line: 1,
                column: 15,
                endColumn: 16,
                message: "Unnecessary escape character: \\..",
                type: "Literal",
                suggestions: [{
                    messageId: "removeEscape",
                    output: String.raw`var foo = /[ab.]/`
                }, {
                    messageId: "escapeBackslash",
                    output: String.raw`var foo = /[ab\\.]/`
                }]
            }]
        },
        {
            code: String.raw`var foo = /[a\|b]/`,
            errors: [{
                line: 1,
                column: 14,
                endColumn: 15,
                message: "Unnecessary escape character: \\|.",
                type: "Literal",
                suggestions: [{
                    messageId: "removeEscape",
                    output: String.raw`var foo = /[a|b]/`
                }, {
                    messageId: "escapeBackslash",
                    output: String.raw`var foo = /[a\\|b]/`
                }]
            }]
        },
        {
            code: String.raw`var foo = /\-/`,
            errors: [{
                line: 1,
                column: 12,
                endColumn: 13,
                message: "Unnecessary escape character: \\-.",
                type: "Literal",
                suggestions: [{
                    messageId: "removeEscape",
                    output: String.raw`var foo = /-/`
                }, {
                    messageId: "escapeBackslash",
                    output: String.raw`var foo = /\\-/`
                }]
            }]
        },
        {
            code: String.raw`var foo = /[\-]/`,
            errors: [{
                line: 1,
                column: 13,
                endColumn: 14,
                message: "Unnecessary escape character: \\-.",
                type: "Literal",
                suggestions: [{
                    messageId: "removeEscape",
                    output: String.raw`var foo = /[-]/`
                }, {
                    messageId: "escapeBackslash",
                    output: String.raw`var foo = /[\\-]/`
                }]
            }]
        },
        {
            code: String.raw`var foo = /[ab\$]/`,
            errors: [{
                line: 1,
                column: 15,
                endColumn: 16,
                message: "Unnecessary escape character: \\$.",
                type: "Literal",
                suggestions: [{
                    messageId: "removeEscape",
                    output: String.raw`var foo = /[ab$]/`
                }, {
                    messageId: "escapeBackslash",
                    output: String.raw`var foo = /[ab\\$]/`
                }]
            }]
        },
        {
            code: String.raw`var foo = /[\(paren]/`,
            errors: [{
                line: 1,
                column: 13,
                endColumn: 14,
                message: "Unnecessary escape character: \\(.",
                type: "Literal",
                suggestions: [{
                    messageId: "removeEscape",
                    output: String.raw`var foo = /[(paren]/`
                }, {
                    messageId: "escapeBackslash",
                    output: String.raw`var foo = /[\\(paren]/`
                }]
            }]
        },
        {
            code: String.raw`var foo = /[\[]/`,
            errors: [{
                line: 1,
                column: 13,
                endColumn: 14,
                message: "Unnecessary escape character: \\[.",
                type: "Literal",
                suggestions: [{
                    messageId: "removeEscape",
                    output: String.raw`var foo = /[[]/`
                }, {
                    messageId: "escapeBackslash",
                    output: String.raw`var foo = /[\\[]/`
                }]
            }]
        },
        {
            code: String.raw`var foo = /[\/]/`, // A character class containing '/'
            errors: [{
                line: 1,
                column: 13,
                endColumn: 14,
                message: "Unnecessary escape character: \\/.",
                type: "Literal",
                suggestions: [{
                    messageId: "removeEscape",
                    output: String.raw`var foo = /[/]/`
                }, {
                    messageId: "escapeBackslash",
                    output: String.raw`var foo = /[\\/]/`
                }]
            }]
        },
        {
            code: String.raw`var foo = /[\B]/`,
            errors: [{
                line: 1,
                column: 13,
                endColumn: 14,
                message: "Unnecessary escape character: \\B.",
                type: "Literal",
                suggestions: [{
                    messageId: "removeEscape",
                    output: String.raw`var foo = /[B]/`
                }, {
                    messageId: "escapeBackslash",
                    output: String.raw`var foo = /[\\B]/`
                }]
            }]
        },
        {
            code: String.raw`var foo = /[a][\-b]/`,
            errors: [{
                line: 1,
                column: 16,
                endColumn: 17,
                message: "Unnecessary escape character: \\-.",
                type: "Literal",
                suggestions: [{
                    messageId: "removeEscape",
                    output: String.raw`var foo = /[a][-b]/`
                }, {
                    messageId: "escapeBackslash",
                    output: String.raw`var foo = /[a][\\-b]/`
                }]
            }]
        },
        {
            code: String.raw`var foo = /\-[]/`,
            errors: [{
                line: 1,
                column: 12,
                endColumn: 13,
                message: "Unnecessary escape character: \\-.",
                type: "Literal",
                suggestions: [{
                    messageId: "removeEscape",
                    output: String.raw`var foo = /-[]/`
                }, {
                    messageId: "escapeBackslash",
                    output: String.raw`var foo = /\\-[]/`
                }]
            }]
        },
        {
            code: String.raw`var foo = /[a\^]/`,
            errors: [{
                line: 1,
                column: 14,
                endColumn: 15,
                message: "Unnecessary escape character: \\^.",
                type: "Literal",
                suggestions: [{
                    messageId: "removeEscape",
                    output: String.raw`var foo = /[a^]/`
                }, {
                    messageId: "escapeBackslash",
                    output: String.raw`var foo = /[a\\^]/`
                }]
            }]
        },
        {
            code: "`multiline template\nliteral with useless \\escape`",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                line: 2,
                column: 22,
                endColumn: 23,
                message: "Unnecessary escape character: \\e.",
                type: "TemplateElement",
                suggestions: [{
                    messageId: "removeEscape",
                    output: "`multiline template\nliteral with useless escape`"
                }, {
                    messageId: "escapeBackslash",
                    output: "`multiline template\nliteral with useless \\\\escape`"
                }]
            }]
        },
        {
            code: "`multiline template\r\nliteral with useless \\escape`",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                line: 2,
                column: 22,
                endColumn: 23,
                message: "Unnecessary escape character: \\e.",
                type: "TemplateElement",
                suggestions: [{
                    messageId: "removeEscape",
                    output: "`multiline template\r\nliteral with useless escape`"
                }, {
                    messageId: "escapeBackslash",
                    output: "`multiline template\r\nliteral with useless \\\\escape`"
                }]
            }]
        },
        {
            code: "`template literal with line continuation \\\nand useless \\escape`",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                line: 2,
                column: 13,
                endColumn: 14,
                message: "Unnecessary escape character: \\e.",
                type: "TemplateElement",
                suggestions: [{
                    messageId: "removeEscape",
                    output: "`template literal with line continuation \\\nand useless escape`"
                }, {
                    messageId: "escapeBackslash",
                    output: "`template literal with line continuation \\\nand useless \\\\escape`"
                }]
            }]
        },
        {
            code: "`template literal with line continuation \\\r\nand useless \\escape`",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                line: 2,
                column: 13,
                endColumn: 14,
                message: "Unnecessary escape character: \\e.",
                type: "TemplateElement",
                suggestions: [{
                    messageId: "removeEscape",
                    output: "`template literal with line continuation \\\r\nand useless escape`"
                }, {
                    messageId: "escapeBackslash",
                    output: "`template literal with line continuation \\\r\nand useless \\\\escape`"
                }]
            }]
        },
        {
            code: "`template literal with mixed linebreaks \r\r\n\n\\and useless escape`",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                line: 4,
                column: 1,
                endColumn: 2,
                message: "Unnecessary escape character: \\a.",
                type: "TemplateElement",
                suggestions: [{
                    messageId: "removeEscape",
                    output: "`template literal with mixed linebreaks \r\r\n\nand useless escape`"
                }, {
                    messageId: "escapeBackslash",
                    output: "`template literal with mixed linebreaks \r\r\n\n\\\\and useless escape`"
                }]
            }]
        },
        {
            code: "`template literal with mixed linebreaks in line continuations \\\n\\\r\\\r\n\\and useless escape`",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                line: 4,
                column: 1,
                endColumn: 2,
                message: "Unnecessary escape character: \\a.",
                type: "TemplateElement",
                suggestions: [{
                    messageId: "removeEscape",
                    output: "`template literal with mixed linebreaks in line continuations \\\n\\\r\\\r\nand useless escape`"
                }, {
                    messageId: "escapeBackslash",
                    output: "`template literal with mixed linebreaks in line continuations \\\n\\\r\\\r\n\\\\and useless escape`"
                }]
            }]
        },
        {
            code: "`\\a```",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                line: 1,
                column: 2,
                endColumn: 3,
                message: "Unnecessary escape character: \\a.",
                type: "TemplateElement",
                suggestions: [{
                    messageId: "removeEscape",
                    output: "`a```"
                }, {
                    messageId: "escapeBackslash",
                    output: "`\\\\a```"
                }]
            }]
        }
    ]
});
