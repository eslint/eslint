/**
 * @fileoverview Look for useless escapes in strings and regexes
 * @author Onur Temizkan
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-useless-escape"),
    RuleTester = require("../../../lib/rule-tester/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
    languageOptions: {
        ecmaVersion: 5,
        sourceType: "script"
    }
});

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
        { code: "<foo attr=\"\\d\"/>", languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } } },
        { code: "<div> Testing: \\ </div>", languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } } },
        { code: "<div> Testing: &#x5C </div>", languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } } },
        { code: "<foo attr='\\d'></foo>", languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } } },
        { code: "<> Testing: \\ </>", languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } } },
        { code: "<> Testing: &#x5C </>", languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } } },
        { code: "var foo = `\\x123`", languageOptions: { ecmaVersion: 6 } },
        { code: "var foo = `\\u00a9`", languageOptions: { ecmaVersion: 6 } },
        { code: "var foo = `xs\\u2111`", languageOptions: { ecmaVersion: 6 } },
        { code: "var foo = `foo \\\\ bar`;", languageOptions: { ecmaVersion: 6 } },
        { code: "var foo = `\\t`;", languageOptions: { ecmaVersion: 6 } },
        { code: "var foo = `foo \\b bar`;", languageOptions: { ecmaVersion: 6 } },
        { code: "var foo = `\\n`;", languageOptions: { ecmaVersion: 6 } },
        { code: "var foo = `foo \\r bar`;", languageOptions: { ecmaVersion: 6 } },
        { code: "var foo = `\\v`;", languageOptions: { ecmaVersion: 6 } },
        { code: "var foo = `\\f`;", languageOptions: { ecmaVersion: 6 } },
        { code: "var foo = `\\\n`;", languageOptions: { ecmaVersion: 6 } },
        { code: "var foo = `\\\r\n`;", languageOptions: { ecmaVersion: 6 } },
        { code: "var foo = `${foo} \\x123`", languageOptions: { ecmaVersion: 6 } },
        { code: "var foo = `${foo} \\u00a9`", languageOptions: { ecmaVersion: 6 } },
        { code: "var foo = `${foo} xs\\u2111`", languageOptions: { ecmaVersion: 6 } },
        { code: "var foo = `${foo} \\\\ ${bar}`;", languageOptions: { ecmaVersion: 6 } },
        { code: "var foo = `${foo} \\b ${bar}`;", languageOptions: { ecmaVersion: 6 } },
        { code: "var foo = `${foo}\\t`;", languageOptions: { ecmaVersion: 6 } },
        { code: "var foo = `${foo}\\n`;", languageOptions: { ecmaVersion: 6 } },
        { code: "var foo = `${foo}\\r`;", languageOptions: { ecmaVersion: 6 } },
        { code: "var foo = `${foo}\\v`;", languageOptions: { ecmaVersion: 6 } },
        { code: "var foo = `${foo}\\f`;", languageOptions: { ecmaVersion: 6 } },
        { code: "var foo = `${foo}\\\n`;", languageOptions: { ecmaVersion: 6 } },
        { code: "var foo = `${foo}\\\r\n`;", languageOptions: { ecmaVersion: 6 } },
        { code: "var foo = `\\``", languageOptions: { ecmaVersion: 6 } },
        { code: "var foo = `\\`${foo}\\``", languageOptions: { ecmaVersion: 6 } },
        { code: "var foo = `\\${{${foo}`;", languageOptions: { ecmaVersion: 6 } },
        { code: "var foo = `$\\{{${foo}`;", languageOptions: { ecmaVersion: 6 } },
        { code: "var foo = String.raw`\\.`", languageOptions: { ecmaVersion: 6 } },
        { code: "var foo = myFunc`\\.`", languageOptions: { ecmaVersion: 6 } },

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
        { code: String.raw`/\]/u`, languageOptions: { ecmaVersion: 6 } },
        String.raw`var foo = /foo\]/`,
        String.raw`var foo = /[[]\]/`, // A character class containing '[', followed by a ']' character
        String.raw`var foo = /\[foo\.bar\]/`,

        // ES2018
        { code: String.raw`var foo = /(?<a>)\k<a>/`, languageOptions: { ecmaVersion: 2018 } },
        { code: String.raw`var foo = /(\\?<a>)/`, languageOptions: { ecmaVersion: 2018 } },
        { code: String.raw`var foo = /\p{ASCII}/u`, languageOptions: { ecmaVersion: 2018 } },
        { code: String.raw`var foo = /\P{ASCII}/u`, languageOptions: { ecmaVersion: 2018 } },
        { code: String.raw`var foo = /[\p{ASCII}]/u`, languageOptions: { ecmaVersion: 2018 } },
        { code: String.raw`var foo = /[\P{ASCII}]/u`, languageOptions: { ecmaVersion: 2018 } },

        // Carets
        String.raw`/[^^]/`,
        { code: String.raw`/[^^]/u`, languageOptions: { ecmaVersion: 2015 } },

        // ES2024
        { code: String.raw`/[\q{abc}]/v`, languageOptions: { ecmaVersion: 2024 } },
        { code: String.raw`/[\(]/v`, languageOptions: { ecmaVersion: 2024 } },
        { code: String.raw`/[\)]/v`, languageOptions: { ecmaVersion: 2024 } },
        { code: String.raw`/[\{]/v`, languageOptions: { ecmaVersion: 2024 } },
        { code: String.raw`/[\]]/v`, languageOptions: { ecmaVersion: 2024 } },
        { code: String.raw`/[\}]/v`, languageOptions: { ecmaVersion: 2024 } },
        { code: String.raw`/[\/]/v`, languageOptions: { ecmaVersion: 2024 } },
        { code: String.raw`/[\-]/v`, languageOptions: { ecmaVersion: 2024 } },
        { code: String.raw`/[\|]/v`, languageOptions: { ecmaVersion: 2024 } },
        { code: String.raw`/[\$$]/v`, languageOptions: { ecmaVersion: 2024 } },
        { code: String.raw`/[\&&]/v`, languageOptions: { ecmaVersion: 2024 } },
        { code: String.raw`/[\!!]/v`, languageOptions: { ecmaVersion: 2024 } },
        { code: String.raw`/[\##]/v`, languageOptions: { ecmaVersion: 2024 } },
        { code: String.raw`/[\%%]/v`, languageOptions: { ecmaVersion: 2024 } },
        { code: String.raw`/[\**]/v`, languageOptions: { ecmaVersion: 2024 } },
        { code: String.raw`/[\++]/v`, languageOptions: { ecmaVersion: 2024 } },
        { code: String.raw`/[\,,]/v`, languageOptions: { ecmaVersion: 2024 } },
        { code: String.raw`/[\..]/v`, languageOptions: { ecmaVersion: 2024 } },
        { code: String.raw`/[\::]/v`, languageOptions: { ecmaVersion: 2024 } },
        { code: String.raw`/[\;;]/v`, languageOptions: { ecmaVersion: 2024 } },
        { code: String.raw`/[\<<]/v`, languageOptions: { ecmaVersion: 2024 } },
        { code: String.raw`/[\==]/v`, languageOptions: { ecmaVersion: 2024 } },
        { code: String.raw`/[\>>]/v`, languageOptions: { ecmaVersion: 2024 } },
        { code: String.raw`/[\??]/v`, languageOptions: { ecmaVersion: 2024 } },
        { code: String.raw`/[\@@]/v`, languageOptions: { ecmaVersion: 2024 } },
        { code: "/[\\``]/v", languageOptions: { ecmaVersion: 2024 } },
        { code: String.raw`/[\~~]/v`, languageOptions: { ecmaVersion: 2024 } },
        { code: String.raw`/[^\^^]/v`, languageOptions: { ecmaVersion: 2024 } },
        { code: String.raw`/[_\^^]/v`, languageOptions: { ecmaVersion: 2024 } },
        { code: String.raw`/[$\$]/v`, languageOptions: { ecmaVersion: 2024 } },
        { code: String.raw`/[&\&]/v`, languageOptions: { ecmaVersion: 2024 } },
        { code: String.raw`/[!\!]/v`, languageOptions: { ecmaVersion: 2024 } },
        { code: String.raw`/[#\#]/v`, languageOptions: { ecmaVersion: 2024 } },
        { code: String.raw`/[%\%]/v`, languageOptions: { ecmaVersion: 2024 } },
        { code: String.raw`/[*\*]/v`, languageOptions: { ecmaVersion: 2024 } },
        { code: String.raw`/[+\+]/v`, languageOptions: { ecmaVersion: 2024 } },
        { code: String.raw`/[,\,]/v`, languageOptions: { ecmaVersion: 2024 } },
        { code: String.raw`/[.\.]/v`, languageOptions: { ecmaVersion: 2024 } },
        { code: String.raw`/[:\:]/v`, languageOptions: { ecmaVersion: 2024 } },
        { code: String.raw`/[;\;]/v`, languageOptions: { ecmaVersion: 2024 } },
        { code: String.raw`/[<\<]/v`, languageOptions: { ecmaVersion: 2024 } },
        { code: String.raw`/[=\=]/v`, languageOptions: { ecmaVersion: 2024 } },
        { code: String.raw`/[>\>]/v`, languageOptions: { ecmaVersion: 2024 } },
        { code: String.raw`/[?\?]/v`, languageOptions: { ecmaVersion: 2024 } },
        { code: String.raw`/[@\@]/v`, languageOptions: { ecmaVersion: 2024 } },
        { code: "/[`\\`]/v", languageOptions: { ecmaVersion: 2024 } },
        { code: String.raw`/[~\~]/v`, languageOptions: { ecmaVersion: 2024 } },
        { code: String.raw`/[^^\^]/v`, languageOptions: { ecmaVersion: 2024 } },
        { code: String.raw`/[_^\^]/v`, languageOptions: { ecmaVersion: 2024 } },
        { code: String.raw`/[\&&&\&]/v`, languageOptions: { ecmaVersion: 2024 } },
        { code: String.raw`/[[\-]\-]/v`, languageOptions: { ecmaVersion: 2024 } },
        { code: String.raw`/[\^]/v`, languageOptions: { ecmaVersion: 2024 } }
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
            languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } },
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
            languageOptions: { ecmaVersion: 6 },
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
            languageOptions: { ecmaVersion: 6 },
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
            languageOptions: { ecmaVersion: 6 },
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
            languageOptions: { ecmaVersion: 6 },
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
            languageOptions: { ecmaVersion: 6 },
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
            languageOptions: { ecmaVersion: 6 },
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
            languageOptions: { ecmaVersion: 6 },
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
            languageOptions: { ecmaVersion: 6 },
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
            languageOptions: { ecmaVersion: 6 },
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
            languageOptions: { ecmaVersion: 6 },
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
            languageOptions: { ecmaVersion: 6 },
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
            languageOptions: { ecmaVersion: 6 },
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
            languageOptions: { ecmaVersion: 6 },
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
            languageOptions: { ecmaVersion: 6 },
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
            languageOptions: { ecmaVersion: 6 },
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
            languageOptions: { ecmaVersion: 6 },
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
            languageOptions: { ecmaVersion: 6 },
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
            languageOptions: { ecmaVersion: 6 },
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
        },

        // https://github.com/eslint/eslint/issues/16988
        {
            code: String.raw`"use\ strict";`,
            errors: [{
                line: 1,
                column: 5,
                endColumn: 6,
                message: "Unnecessary escape character: \\ .",
                type: "Literal",
                suggestions: [{
                    messageId: "removeEscapeDoNotKeepSemantics",
                    output: String.raw`"use strict";`
                }, {
                    messageId: "escapeBackslash",
                    output: String.raw`"use\\ strict";`
                }]
            }]
        },
        {
            code: String.raw`({ foo() { "foo"; "bar"; "ba\z" } })`,
            languageOptions: { ecmaVersion: 6 },
            errors: [{
                line: 1,
                column: 29,
                endColumn: 30,
                message: "Unnecessary escape character: \\z.",
                type: "Literal",
                suggestions: [{
                    messageId: "removeEscapeDoNotKeepSemantics",
                    output: String.raw`({ foo() { "foo"; "bar"; "baz" } })`
                }, {
                    messageId: "escapeBackslash",
                    output: String.raw`({ foo() { "foo"; "bar"; "ba\\z" } })`
                }]
            }]
        },

        // Carets
        {
            code: String.raw`/[^\^]/`,
            errors: [{
                line: 1,
                column: 4,
                message: "Unnecessary escape character: \\^.",
                type: "Literal",
                suggestions: [
                    {
                        messageId: "removeEscape",
                        output: "/[^^]/"
                    },
                    {
                        messageId: "escapeBackslash",
                        output: String.raw`/[^\\^]/`
                    }
                ]
            }]
        },
        {
            code: String.raw`/[^\^]/u`,
            languageOptions: { ecmaVersion: 2015 },
            errors: [{
                line: 1,
                column: 4,
                message: "Unnecessary escape character: \\^.",
                type: "Literal",
                suggestions: [
                    {
                        messageId: "removeEscape",
                        output: "/[^^]/u"
                    },
                    {
                        messageId: "escapeBackslash",
                        output: String.raw`/[^\\^]/u`
                    }
                ]
            }]
        },

        // ES2024
        {
            code: String.raw`/[\$]/v`,
            languageOptions: { ecmaVersion: 2024 },
            errors: [{
                line: 1,
                column: 3,
                endColumn: 4,
                message: "Unnecessary escape character: \\$.",
                type: "Literal",
                suggestions: [
                    {
                        messageId: "removeEscape",
                        output: "/[$]/v"
                    },
                    {
                        messageId: "escapeBackslash",
                        output: String.raw`/[\\$]/v`
                    }
                ]
            }]
        },
        {
            code: String.raw`/[\&\&]/v`,
            languageOptions: { ecmaVersion: 2024 },
            errors: [{
                line: 1,
                column: 3,
                message: "Unnecessary escape character: \\&.",
                type: "Literal",
                suggestions: [
                    {
                        messageId: "removeEscape",
                        output: String.raw`/[&\&]/v`
                    },
                    {
                        messageId: "escapeBackslash",
                        output: String.raw`/[\\&\&]/v`
                    }
                ]
            }]
        },
        {
            code: String.raw`/[\!\!]/v`,
            languageOptions: { ecmaVersion: 2024 },
            errors: [{
                line: 1,
                column: 3,
                message: "Unnecessary escape character: \\!.",
                type: "Literal",
                suggestions: [
                    {
                        messageId: "removeEscape",
                        output: String.raw`/[!\!]/v`
                    },
                    {
                        messageId: "escapeBackslash",
                        output: String.raw`/[\\!\!]/v`
                    }
                ]
            }]
        },
        {
            code: String.raw`/[\#\#]/v`,
            languageOptions: { ecmaVersion: 2024 },
            errors: [{
                line: 1,
                column: 3,
                message: "Unnecessary escape character: \\#.",
                type: "Literal",
                suggestions: [
                    {
                        messageId: "removeEscape",
                        output: String.raw`/[#\#]/v`
                    },
                    {
                        messageId: "escapeBackslash",
                        output: String.raw`/[\\#\#]/v`
                    }
                ]
            }]
        },
        {
            code: String.raw`/[\%\%]/v`,
            languageOptions: { ecmaVersion: 2024 },
            errors: [{
                line: 1,
                column: 3,
                message: "Unnecessary escape character: \\%.",
                type: "Literal",
                suggestions: [
                    {
                        messageId: "removeEscape",
                        output: String.raw`/[%\%]/v`
                    },
                    {
                        messageId: "escapeBackslash",
                        output: String.raw`/[\\%\%]/v`
                    }
                ]
            }]
        },
        {
            code: String.raw`/[\*\*]/v`,
            languageOptions: { ecmaVersion: 2024 },
            errors: [{
                line: 1,
                column: 3,
                message: "Unnecessary escape character: \\*.",
                type: "Literal",
                suggestions: [
                    {
                        messageId: "removeEscape",
                        output: String.raw`/[*\*]/v`
                    },
                    {
                        messageId: "escapeBackslash",
                        output: String.raw`/[\\*\*]/v`
                    }
                ]
            }]
        },
        {
            code: String.raw`/[\+\+]/v`,
            languageOptions: { ecmaVersion: 2024 },
            errors: [{
                line: 1,
                column: 3,
                message: "Unnecessary escape character: \\+.",
                type: "Literal",
                suggestions: [
                    {
                        messageId: "removeEscape",
                        output: String.raw`/[+\+]/v`
                    },
                    {
                        messageId: "escapeBackslash",
                        output: String.raw`/[\\+\+]/v`
                    }
                ]
            }]
        },
        {
            code: String.raw`/[\,\,]/v`,
            languageOptions: { ecmaVersion: 2024 },
            errors: [{
                line: 1,
                column: 3,
                message: "Unnecessary escape character: \\,.",
                type: "Literal",
                suggestions: [
                    {
                        messageId: "removeEscape",
                        output: String.raw`/[,\,]/v`
                    },
                    {
                        messageId: "escapeBackslash",
                        output: String.raw`/[\\,\,]/v`
                    }
                ]
            }]
        },
        {
            code: String.raw`/[\.\.]/v`,
            languageOptions: { ecmaVersion: 2024 },
            errors: [{
                line: 1,
                column: 3,
                message: "Unnecessary escape character: \\..",
                type: "Literal",
                suggestions: [
                    {
                        messageId: "removeEscape",
                        output: String.raw`/[.\.]/v`
                    },
                    {
                        messageId: "escapeBackslash",
                        output: String.raw`/[\\.\.]/v`
                    }
                ]
            }]
        },
        {
            code: String.raw`/[\:\:]/v`,
            languageOptions: { ecmaVersion: 2024 },
            errors: [{
                line: 1,
                column: 3,
                message: "Unnecessary escape character: \\:.",
                type: "Literal",
                suggestions: [
                    {
                        messageId: "removeEscape",
                        output: String.raw`/[:\:]/v`
                    },
                    {
                        messageId: "escapeBackslash",
                        output: String.raw`/[\\:\:]/v`
                    }
                ]
            }]
        },
        {
            code: String.raw`/[\;\;]/v`,
            languageOptions: { ecmaVersion: 2024 },
            errors: [{
                line: 1,
                column: 3,
                message: "Unnecessary escape character: \\;.",
                type: "Literal",
                suggestions: [
                    {
                        messageId: "removeEscape",
                        output: String.raw`/[;\;]/v`
                    },
                    {
                        messageId: "escapeBackslash",
                        output: String.raw`/[\\;\;]/v`
                    }
                ]
            }]
        },
        {
            code: String.raw`/[\<\<]/v`,
            languageOptions: { ecmaVersion: 2024 },
            errors: [{
                line: 1,
                column: 3,
                message: "Unnecessary escape character: \\<.",
                type: "Literal",
                suggestions: [
                    {
                        messageId: "removeEscape",
                        output: String.raw`/[<\<]/v`
                    },
                    {
                        messageId: "escapeBackslash",
                        output: String.raw`/[\\<\<]/v`
                    }
                ]
            }]
        },
        {
            code: String.raw`/[\=\=]/v`,
            languageOptions: { ecmaVersion: 2024 },
            errors: [{
                line: 1,
                column: 3,
                message: "Unnecessary escape character: \\=.",
                type: "Literal",
                suggestions: [
                    {
                        messageId: "removeEscape",
                        output: String.raw`/[=\=]/v`
                    },
                    {
                        messageId: "escapeBackslash",
                        output: String.raw`/[\\=\=]/v`
                    }
                ]
            }]
        },
        {
            code: String.raw`/[\>\>]/v`,
            languageOptions: { ecmaVersion: 2024 },
            errors: [{
                line: 1,
                column: 3,
                message: "Unnecessary escape character: \\>.",
                type: "Literal",
                suggestions: [
                    {
                        messageId: "removeEscape",
                        output: String.raw`/[>\>]/v`
                    },
                    {
                        messageId: "escapeBackslash",
                        output: String.raw`/[\\>\>]/v`
                    }
                ]
            }]
        },
        {
            code: String.raw`/[\?\?]/v`,
            languageOptions: { ecmaVersion: 2024 },
            errors: [{
                line: 1,
                column: 3,
                message: "Unnecessary escape character: \\?.",
                type: "Literal",
                suggestions: [
                    {
                        messageId: "removeEscape",
                        output: String.raw`/[?\?]/v`
                    },
                    {
                        messageId: "escapeBackslash",
                        output: String.raw`/[\\?\?]/v`
                    }
                ]
            }]
        },
        {
            code: String.raw`/[\@\@]/v`,
            languageOptions: { ecmaVersion: 2024 },
            errors: [{
                line: 1,
                column: 3,
                message: "Unnecessary escape character: \\@.",
                type: "Literal",
                suggestions: [
                    {
                        messageId: "removeEscape",
                        output: String.raw`/[@\@]/v`
                    },
                    {
                        messageId: "escapeBackslash",
                        output: String.raw`/[\\@\@]/v`
                    }
                ]
            }]
        },
        {
            code: "/[\\`\\`]/v",
            languageOptions: { ecmaVersion: 2024 },
            errors: [{
                line: 1,
                column: 3,
                message: "Unnecessary escape character: \\`.",
                type: "Literal",
                suggestions: [
                    {
                        messageId: "removeEscape",
                        output: "/[`\\`]/v"
                    },
                    {
                        messageId: "escapeBackslash",
                        output: "/[\\\\`\\`]/v"
                    }
                ]
            }]
        },
        {
            code: String.raw`/[\~\~]/v`,
            languageOptions: { ecmaVersion: 2024 },
            errors: [{
                line: 1,
                column: 3,
                message: "Unnecessary escape character: \\~.",
                type: "Literal",
                suggestions: [
                    {
                        messageId: "removeEscape",
                        output: String.raw`/[~\~]/v`
                    },
                    {
                        messageId: "escapeBackslash",
                        output: String.raw`/[\\~\~]/v`
                    }
                ]
            }]
        },
        {
            code: String.raw`/[^\^\^]/v`,
            languageOptions: { ecmaVersion: 2024 },
            errors: [{
                line: 1,
                column: 4,
                message: "Unnecessary escape character: \\^.",
                type: "Literal",
                suggestions: [
                    {
                        messageId: "removeEscape",
                        output: String.raw`/[^^\^]/v`
                    },
                    {
                        messageId: "escapeBackslash",
                        output: String.raw`/[^\\^\^]/v`
                    }
                ]
            }]
        },
        {
            code: String.raw`/[_\^\^]/v`,
            languageOptions: { ecmaVersion: 2024 },
            errors: [{
                line: 1,
                column: 4,
                message: "Unnecessary escape character: \\^.",
                type: "Literal",
                suggestions: [
                    {
                        messageId: "removeEscape",
                        output: String.raw`/[_^\^]/v`
                    },
                    {
                        messageId: "escapeBackslash",
                        output: String.raw`/[_\\^\^]/v`
                    }
                ]
            }]
        },
        {
            code: String.raw`/[\&\&&\&]/v`,
            languageOptions: { ecmaVersion: 2024 },
            errors: [{
                line: 1,
                column: 3,
                message: "Unnecessary escape character: \\&.",
                type: "Literal",
                suggestions: [
                    {
                        messageId: "removeEscape",
                        output: String.raw`/[&\&&\&]/v`
                    },
                    {
                        messageId: "escapeBackslash",
                        output: String.raw`/[\\&\&&\&]/v`
                    }
                ]
            }]
        },
        {
            code: String.raw`/[\p{ASCII}--\.]/v`,
            languageOptions: { ecmaVersion: 2024 },
            errors: [{
                line: 1,
                column: 14,
                message: "Unnecessary escape character: \\..",
                type: "Literal",
                suggestions: [
                    {
                        messageId: "removeEscape",
                        output: String.raw`/[\p{ASCII}--.]/v`
                    }
                ]
            }]
        },
        {
            code: String.raw`/[\p{ASCII}&&\.]/v`,
            languageOptions: { ecmaVersion: 2024 },
            errors: [{
                line: 1,
                column: 14,
                message: "Unnecessary escape character: \\..",
                type: "Literal",
                suggestions: [
                    {
                        messageId: "removeEscape",
                        output: String.raw`/[\p{ASCII}&&.]/v`
                    }
                ]
            }]
        },
        {
            code: String.raw`/[\.--[.&]]/v`,
            languageOptions: { ecmaVersion: 2024 },
            errors: [{
                line: 1,
                column: 3,
                message: "Unnecessary escape character: \\..",
                type: "Literal",
                suggestions: [
                    {
                        messageId: "removeEscape",
                        output: String.raw`/[.--[.&]]/v`
                    }
                ]
            }]
        },
        {
            code: String.raw`/[\.&&[.&]]/v`,
            languageOptions: { ecmaVersion: 2024 },
            errors: [{
                line: 1,
                column: 3,
                message: "Unnecessary escape character: \\..",
                type: "Literal",
                suggestions: [
                    {
                        messageId: "removeEscape",
                        output: String.raw`/[.&&[.&]]/v`
                    }
                ]
            }]
        },
        {
            code: String.raw`/[\.--\.--\.]/v`,
            languageOptions: { ecmaVersion: 2024 },
            errors: [{
                line: 1,
                column: 3,
                message: "Unnecessary escape character: \\..",
                type: "Literal",
                suggestions: [
                    {
                        messageId: "removeEscape",
                        output: String.raw`/[.--\.--\.]/v`
                    }
                ]
            }, {
                line: 1,
                column: 7,
                message: "Unnecessary escape character: \\..",
                type: "Literal",
                suggestions: [
                    {
                        messageId: "removeEscape",
                        output: String.raw`/[\.--.--\.]/v`
                    }
                ]
            }, {
                line: 1,
                column: 11,
                message: "Unnecessary escape character: \\..",
                type: "Literal",
                suggestions: [
                    {
                        messageId: "removeEscape",
                        output: String.raw`/[\.--\.--.]/v`
                    }
                ]
            }]
        },
        {
            code: String.raw`/[\.&&\.&&\.]/v`,
            languageOptions: { ecmaVersion: 2024 },
            errors: [{
                line: 1,
                column: 3,
                message: "Unnecessary escape character: \\..",
                type: "Literal",
                suggestions: [
                    {
                        messageId: "removeEscape",
                        output: String.raw`/[.&&\.&&\.]/v`
                    }
                ]
            }, {
                line: 1,
                column: 7,
                message: "Unnecessary escape character: \\..",
                type: "Literal",
                suggestions: [
                    {
                        messageId: "removeEscape",
                        output: String.raw`/[\.&&.&&\.]/v`
                    }
                ]
            }, {
                line: 1,
                column: 11,
                message: "Unnecessary escape character: \\..",
                type: "Literal",
                suggestions: [
                    {
                        messageId: "removeEscape",
                        output: String.raw`/[\.&&\.&&.]/v`
                    }
                ]
            }]
        },
        {
            code: String.raw`/[[\.&]--[\.&]]/v`,
            languageOptions: { ecmaVersion: 2024 },
            errors: [{
                line: 1,
                column: 4,
                message: "Unnecessary escape character: \\..",
                type: "Literal",
                suggestions: [
                    {
                        messageId: "removeEscape",
                        output: String.raw`/[[.&]--[\.&]]/v`
                    },
                    {
                        messageId: "escapeBackslash",
                        output: String.raw`/[[\\.&]--[\.&]]/v`
                    }
                ]
            }, {
                line: 1,
                column: 11,
                message: "Unnecessary escape character: \\..",
                type: "Literal",
                suggestions: [
                    {
                        messageId: "removeEscape",
                        output: String.raw`/[[\.&]--[.&]]/v`
                    },
                    {
                        messageId: "escapeBackslash",
                        output: String.raw`/[[\.&]--[\\.&]]/v`
                    }
                ]
            }]
        },
        {
            code: String.raw`/[[\.&]&&[\.&]]/v`,
            languageOptions: { ecmaVersion: 2024 },
            errors: [{
                line: 1,
                column: 4,
                message: "Unnecessary escape character: \\..",
                type: "Literal",
                suggestions: [
                    {
                        messageId: "removeEscape",
                        output: String.raw`/[[.&]&&[\.&]]/v`
                    },
                    {
                        messageId: "escapeBackslash",
                        output: String.raw`/[[\\.&]&&[\.&]]/v`
                    }
                ]
            }, {
                line: 1,
                column: 11,
                message: "Unnecessary escape character: \\..",
                type: "Literal",
                suggestions: [
                    {
                        messageId: "removeEscape",
                        output: String.raw`/[[\.&]&&[.&]]/v`
                    },
                    {
                        messageId: "escapeBackslash",
                        output: String.raw`/[[\.&]&&[\\.&]]/v`
                    }
                ]
            }]
        }
    ]
});
