/**
 * @fileoverview Tests for no-irregular-whitespace rule.
 * @author Jonathan Kingston
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-irregular-whitespace"),
    { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

const expectedErrors = [{
    messageId: "noIrregularWhitespace",
    type: "Program"
}];
const expectedCommentErrors = [{
    messageId: "noIrregularWhitespace",
    type: "Program",
    line: 1,
    column: 4
}];

ruleTester.run("no-irregular-whitespace", rule, {
    valid: [
        "'\\u000B';",
        "'\\u000C';",
        "'\\u0085';",
        "'\\u00A0';",
        "'\\u180E';",
        "'\\ufeff';",
        "'\\u2000';",
        "'\\u2001';",
        "'\\u2002';",
        "'\\u2003';",
        "'\\u2004';",
        "'\\u2005';",
        "'\\u2006';",
        "'\\u2007';",
        "'\\u2008';",
        "'\\u2009';",
        "'\\u200A';",
        "'\\u200B';",
        "'\\u2028';",
        "'\\u2029';",
        "'\\u202F';",
        "'\\u205f';",
        "'\\u3000';",
        "'\u000B';",
        "'\u000C';",
        "'\u0085';",
        "'\u00A0';",
        "'\u180E';",
        "'\ufeff';",
        "'\u2000';",
        "'\u2001';",
        "'\u2002';",
        "'\u2003';",
        "'\u2004';",
        "'\u2005';",
        "'\u2006';",
        "'\u2007';",
        "'\u2008';",
        "'\u2009';",
        "'\u200A';",
        "'\u200B';",
        "'\\\u2028';", // multiline string
        "'\\\u2029';", // multiline string
        "'\u202F';",
        "'\u205f';",
        "'\u3000';",
        { code: "// \u000B", options: [{ skipComments: true }] },
        { code: "// \u000C", options: [{ skipComments: true }] },
        { code: "// \u0085", options: [{ skipComments: true }] },
        { code: "// \u00A0", options: [{ skipComments: true }] },
        { code: "// \u180E", options: [{ skipComments: true }] },
        { code: "// \ufeff", options: [{ skipComments: true }] },
        { code: "// \u2000", options: [{ skipComments: true }] },
        { code: "// \u2001", options: [{ skipComments: true }] },
        { code: "// \u2002", options: [{ skipComments: true }] },
        { code: "// \u2003", options: [{ skipComments: true }] },
        { code: "// \u2004", options: [{ skipComments: true }] },
        { code: "// \u2005", options: [{ skipComments: true }] },
        { code: "// \u2006", options: [{ skipComments: true }] },
        { code: "// \u2007", options: [{ skipComments: true }] },
        { code: "// \u2008", options: [{ skipComments: true }] },
        { code: "// \u2009", options: [{ skipComments: true }] },
        { code: "// \u200A", options: [{ skipComments: true }] },
        { code: "// \u200B", options: [{ skipComments: true }] },
        { code: "// \u202F", options: [{ skipComments: true }] },
        { code: "// \u205f", options: [{ skipComments: true }] },
        { code: "// \u3000", options: [{ skipComments: true }] },
        { code: "/* \u000B */", options: [{ skipComments: true }] },
        { code: "/* \u000C */", options: [{ skipComments: true }] },
        { code: "/* \u0085 */", options: [{ skipComments: true }] },
        { code: "/* \u00A0 */", options: [{ skipComments: true }] },
        { code: "/* \u180E */", options: [{ skipComments: true }] },
        { code: "/* \ufeff */", options: [{ skipComments: true }] },
        { code: "/* \u2000 */", options: [{ skipComments: true }] },
        { code: "/* \u2001 */", options: [{ skipComments: true }] },
        { code: "/* \u2002 */", options: [{ skipComments: true }] },
        { code: "/* \u2003 */", options: [{ skipComments: true }] },
        { code: "/* \u2004 */", options: [{ skipComments: true }] },
        { code: "/* \u2005 */", options: [{ skipComments: true }] },
        { code: "/* \u2006 */", options: [{ skipComments: true }] },
        { code: "/* \u2007 */", options: [{ skipComments: true }] },
        { code: "/* \u2008 */", options: [{ skipComments: true }] },
        { code: "/* \u2009 */", options: [{ skipComments: true }] },
        { code: "/* \u200A */", options: [{ skipComments: true }] },
        { code: "/* \u200B */", options: [{ skipComments: true }] },
        { code: "/* \u2028 */", options: [{ skipComments: true }] },
        { code: "/* \u2029 */", options: [{ skipComments: true }] },
        { code: "/* \u202F */", options: [{ skipComments: true }] },
        { code: "/* \u205f */", options: [{ skipComments: true }] },
        { code: "/* \u3000 */", options: [{ skipComments: true }] },
        { code: "/\u000B/", options: [{ skipRegExps: true }] },
        { code: "/\u000C/", options: [{ skipRegExps: true }] },
        { code: "/\u0085/", options: [{ skipRegExps: true }] },
        { code: "/\u00A0/", options: [{ skipRegExps: true }] },
        { code: "/\u180E/", options: [{ skipRegExps: true }] },
        { code: "/\ufeff/", options: [{ skipRegExps: true }] },
        { code: "/\u2000/", options: [{ skipRegExps: true }] },
        { code: "/\u2001/", options: [{ skipRegExps: true }] },
        { code: "/\u2002/", options: [{ skipRegExps: true }] },
        { code: "/\u2003/", options: [{ skipRegExps: true }] },
        { code: "/\u2004/", options: [{ skipRegExps: true }] },
        { code: "/\u2005/", options: [{ skipRegExps: true }] },
        { code: "/\u2006/", options: [{ skipRegExps: true }] },
        { code: "/\u2007/", options: [{ skipRegExps: true }] },
        { code: "/\u2008/", options: [{ skipRegExps: true }] },
        { code: "/\u2009/", options: [{ skipRegExps: true }] },
        { code: "/\u200A/", options: [{ skipRegExps: true }] },
        { code: "/\u200B/", options: [{ skipRegExps: true }] },
        { code: "/\u202F/", options: [{ skipRegExps: true }] },
        { code: "/\u205f/", options: [{ skipRegExps: true }] },
        { code: "/\u3000/", options: [{ skipRegExps: true }] },
        { code: "`\u000B`", options: [{ skipTemplates: true }], parserOptions: { ecmaVersion: 6 } },
        { code: "`\u000C`", options: [{ skipTemplates: true }], parserOptions: { ecmaVersion: 6 } },
        { code: "`\u0085`", options: [{ skipTemplates: true }], parserOptions: { ecmaVersion: 6 } },
        { code: "`\u00A0`", options: [{ skipTemplates: true }], parserOptions: { ecmaVersion: 6 } },
        { code: "`\u180E`", options: [{ skipTemplates: true }], parserOptions: { ecmaVersion: 6 } },
        { code: "`\ufeff`", options: [{ skipTemplates: true }], parserOptions: { ecmaVersion: 6 } },
        { code: "`\u2000`", options: [{ skipTemplates: true }], parserOptions: { ecmaVersion: 6 } },
        { code: "`\u2001`", options: [{ skipTemplates: true }], parserOptions: { ecmaVersion: 6 } },
        { code: "`\u2002`", options: [{ skipTemplates: true }], parserOptions: { ecmaVersion: 6 } },
        { code: "`\u2003`", options: [{ skipTemplates: true }], parserOptions: { ecmaVersion: 6 } },
        { code: "`\u2004`", options: [{ skipTemplates: true }], parserOptions: { ecmaVersion: 6 } },
        { code: "`\u2005`", options: [{ skipTemplates: true }], parserOptions: { ecmaVersion: 6 } },
        { code: "`\u2006`", options: [{ skipTemplates: true }], parserOptions: { ecmaVersion: 6 } },
        { code: "`\u2007`", options: [{ skipTemplates: true }], parserOptions: { ecmaVersion: 6 } },
        { code: "`\u2008`", options: [{ skipTemplates: true }], parserOptions: { ecmaVersion: 6 } },
        { code: "`\u2009`", options: [{ skipTemplates: true }], parserOptions: { ecmaVersion: 6 } },
        { code: "`\u200A`", options: [{ skipTemplates: true }], parserOptions: { ecmaVersion: 6 } },
        { code: "`\u200B`", options: [{ skipTemplates: true }], parserOptions: { ecmaVersion: 6 } },
        { code: "`\u202F`", options: [{ skipTemplates: true }], parserOptions: { ecmaVersion: 6 } },
        { code: "`\u205f`", options: [{ skipTemplates: true }], parserOptions: { ecmaVersion: 6 } },
        { code: "`\u3000`", options: [{ skipTemplates: true }], parserOptions: { ecmaVersion: 6 } },

        { code: "`\u3000${foo}\u3000`", options: [{ skipTemplates: true }], parserOptions: { ecmaVersion: 6 } },
        { code: "const error = ` \u3000 `;", options: [{ skipTemplates: true }], parserOptions: { ecmaVersion: 6 } },
        { code: "const error = `\n\u3000`;", options: [{ skipTemplates: true }], parserOptions: { ecmaVersion: 6 } },
        { code: "const error = `\u3000\n`;", options: [{ skipTemplates: true }], parserOptions: { ecmaVersion: 6 } },
        { code: "const error = `\n\u3000\n`;", options: [{ skipTemplates: true }], parserOptions: { ecmaVersion: 6 } },
        { code: "const error = `foo\u3000bar\nfoo\u3000bar`;", options: [{ skipTemplates: true }], parserOptions: { ecmaVersion: 6 } },

        // Unicode BOM.
        "\uFEFFconsole.log('hello BOM');"
    ],

    invalid: [
        {
            code: "var any \u000B = 'thing';",
            errors: expectedErrors
        },
        {
            code: "var any \u000C = 'thing';",
            errors: expectedErrors
        },
        {
            code: "var any \u00A0 = 'thing';",
            errors: expectedErrors
        },

        /*
         * it was moved out of General_Category=Zs (separator, space) in Unicode 6.3.0, so should not be considered a whitespace character.
         * https://codeblog.jonskeet.uk/2014/12/01/when-is-an-identifier-not-an-identifier-attack-of-the-mongolian-vowel-separator/
         * {
         *     code: "var any \u180E = 'thing';",
         *     errors: expectedErrors
         * },
         */
        {
            code: "var any \ufeff = 'thing';",
            errors: expectedErrors
        },
        {
            code: "var any \u2000 = 'thing';",
            errors: expectedErrors
        },
        {
            code: "var any \u2001 = 'thing';",
            errors: expectedErrors
        },
        {
            code: "var any \u2002 = 'thing';",
            errors: expectedErrors
        },
        {
            code: "var any \u2003 = 'thing';",
            errors: expectedErrors
        },
        {
            code: "var any \u2004 = 'thing';",
            errors: expectedErrors
        },
        {
            code: "var any \u2005 = 'thing';",
            errors: expectedErrors
        },
        {
            code: "var any \u2006 = 'thing';",
            errors: expectedErrors
        },
        {
            code: "var any \u2007 = 'thing';",
            errors: expectedErrors
        },
        {
            code: "var any \u2008 = 'thing';",
            errors: expectedErrors
        },
        {
            code: "var any \u2009 = 'thing';",
            errors: expectedErrors
        },
        {
            code: "var any \u200A = 'thing';",
            errors: expectedErrors
        },
        {
            code: "var any \u2028 = 'thing';",
            errors: expectedErrors
        },
        {
            code: "var any \u2029 = 'thing';",
            errors: expectedErrors
        },
        {
            code: "var any \u202F = 'thing';",
            errors: expectedErrors
        },
        {
            code: "var any \u205f = 'thing';",
            errors: expectedErrors
        },
        {
            code: "var any \u3000 = 'thing';",
            errors: expectedErrors
        },
        {
            code: "var a = 'b',\u2028c = 'd',\ne = 'f'\u2028",
            errors: [
                {
                    messageId: "noIrregularWhitespace",
                    type: "Program",
                    line: 1,
                    column: 13
                },
                {
                    messageId: "noIrregularWhitespace",
                    type: "Program",
                    line: 3,
                    column: 8
                }
            ]
        },
        {
            code: "var any \u3000 = 'thing', other \u3000 = 'thing';\nvar third \u3000 = 'thing';",
            errors: [
                {
                    messageId: "noIrregularWhitespace",
                    type: "Program",
                    line: 1,
                    column: 9
                },
                {
                    messageId: "noIrregularWhitespace",
                    type: "Program",
                    line: 1,
                    column: 28
                },
                {
                    messageId: "noIrregularWhitespace",
                    type: "Program",
                    line: 2,
                    column: 11
                }
            ]
        },
        {
            code: "// \u000B",
            errors: expectedCommentErrors
        },
        {
            code: "// \u000C",
            errors: expectedCommentErrors
        },
        {
            code: "// \u0085",
            errors: expectedCommentErrors
        },
        {
            code: "// \u00A0",
            errors: expectedCommentErrors
        },
        {
            code: "// \u180E",
            errors: expectedCommentErrors
        },
        {
            code: "// \ufeff",
            errors: expectedCommentErrors
        },
        {
            code: "// \u2000",
            errors: expectedCommentErrors
        },
        {
            code: "// \u2001",
            errors: expectedCommentErrors
        },
        {
            code: "// \u2002",
            errors: expectedCommentErrors
        },
        {
            code: "// \u2003",
            errors: expectedCommentErrors
        },
        {
            code: "// \u2004",
            errors: expectedCommentErrors
        },
        {
            code: "// \u2005",
            errors: expectedCommentErrors
        },
        {
            code: "// \u2006",
            errors: expectedCommentErrors
        },
        {
            code: "// \u2007",
            errors: expectedCommentErrors
        },
        {
            code: "// \u2008",
            errors: expectedCommentErrors
        },
        {
            code: "// \u2009",
            errors: expectedCommentErrors
        },
        {
            code: "// \u200A",
            errors: expectedCommentErrors
        },
        {
            code: "// \u200B",
            errors: expectedCommentErrors
        },
        {
            code: "// \u202F",
            errors: expectedCommentErrors
        },
        {
            code: "// \u205f",
            errors: expectedCommentErrors
        },
        {
            code: "// \u3000",
            errors: expectedCommentErrors
        },
        {
            code: "/* \u000B */",
            errors: expectedCommentErrors
        },
        {
            code: "/* \u000C */",
            errors: expectedCommentErrors
        },
        {
            code: "/* \u0085 */",
            errors: expectedCommentErrors
        },
        {
            code: "/* \u00A0 */",
            errors: expectedCommentErrors
        },
        {
            code: "/* \u180E */",
            errors: expectedCommentErrors
        },
        {
            code: "/* \ufeff */",
            errors: expectedCommentErrors
        },
        {
            code: "/* \u2000 */",
            errors: expectedCommentErrors
        },
        {
            code: "/* \u2001 */",
            errors: expectedCommentErrors
        },
        {
            code: "/* \u2002 */",
            errors: expectedCommentErrors
        },
        {
            code: "/* \u2003 */",
            errors: expectedCommentErrors
        },
        {
            code: "/* \u2004 */",
            errors: expectedCommentErrors
        },
        {
            code: "/* \u2005 */",
            errors: expectedCommentErrors
        },
        {
            code: "/* \u2006 */",
            errors: expectedCommentErrors
        },
        {
            code: "/* \u2007 */",
            errors: expectedCommentErrors
        },
        {
            code: "/* \u2008 */",
            errors: expectedCommentErrors
        },
        {
            code: "/* \u2009 */",
            errors: expectedCommentErrors
        },
        {
            code: "/* \u200A */",
            errors: expectedCommentErrors
        },
        {
            code: "/* \u200B */",
            errors: expectedCommentErrors
        },
        {
            code: "/* \u2028 */",
            errors: expectedCommentErrors
        },
        {
            code: "/* \u2029 */",
            errors: expectedCommentErrors
        },
        {
            code: "/* \u202F */",
            errors: expectedCommentErrors
        },
        {
            code: "/* \u205f */",
            errors: expectedCommentErrors
        },
        {
            code: "/* \u3000 */",
            errors: expectedCommentErrors
        },
        {
            code: "var any = /\u3000/, other = /\u000B/;",
            errors: [
                {
                    messageId: "noIrregularWhitespace",
                    type: "Program",
                    line: 1,
                    column: 12
                },
                {
                    messageId: "noIrregularWhitespace",
                    type: "Program",
                    line: 1,
                    column: 25
                }
            ]
        },
        {
            code: "var any = '\u3000', other = '\u000B';",
            options: [{ skipStrings: false }],
            errors: [
                {
                    messageId: "noIrregularWhitespace",
                    type: "Program",
                    line: 1,
                    column: 12
                },
                {
                    messageId: "noIrregularWhitespace",
                    type: "Program",
                    line: 1,
                    column: 25
                }
            ]
        },
        {
            code: "var any = `\u3000`, other = `\u000B`;",
            options: [{ skipTemplates: false }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "noIrregularWhitespace",
                    type: "Program",
                    line: 1,
                    column: 12
                },
                {
                    messageId: "noIrregularWhitespace",
                    type: "Program",
                    line: 1,
                    column: 25
                }
            ]
        },
        {
            code: "`something ${\u3000 10} another thing`",
            options: [{ skipTemplates: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "noIrregularWhitespace",
                    type: "Program",
                    line: 1,
                    column: 14
                }
            ]
        },
        {
            code: "`something ${10\u3000} another thing`",
            options: [{ skipTemplates: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "noIrregularWhitespace",
                    type: "Program",
                    line: 1,
                    column: 16
                }
            ]
        },
        {
            code: "\u3000\n`\u3000template`",
            options: [{ skipTemplates: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "noIrregularWhitespace",
                    type: "Program",
                    line: 1,
                    column: 1
                }
            ]
        },
        {
            code: "\u3000\n`\u3000multiline\ntemplate`",
            options: [{ skipTemplates: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "noIrregularWhitespace",
                    type: "Program",
                    line: 1,
                    column: 1
                }
            ]
        },
        {
            code: "\u3000`\u3000template`",
            options: [{ skipTemplates: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "noIrregularWhitespace",
                    type: "Program",
                    line: 1,
                    column: 1
                }
            ]
        },
        {
            code: "\u3000`\u3000multiline\ntemplate`",
            options: [{ skipTemplates: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "noIrregularWhitespace",
                    type: "Program",
                    line: 1,
                    column: 1
                }
            ]
        },
        {
            code: "`\u3000template`\u3000",
            options: [{ skipTemplates: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "noIrregularWhitespace",
                    type: "Program",
                    line: 1,
                    column: 12
                }
            ]
        },
        {
            code: "`\u3000multiline\ntemplate`\u3000",
            options: [{ skipTemplates: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "noIrregularWhitespace",
                    type: "Program",
                    line: 2,
                    column: 10
                }
            ]
        },
        {
            code: "`\u3000template`\n\u3000",
            options: [{ skipTemplates: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "noIrregularWhitespace",
                    type: "Program",
                    line: 2,
                    column: 1
                }
            ]
        },
        {
            code: "`\u3000multiline\ntemplate`\n\u3000",
            options: [{ skipTemplates: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "noIrregularWhitespace",
                    type: "Program",
                    line: 3,
                    column: 1
                }
            ]
        },

        // full location tests
        {
            code: "var foo = \u000B bar;",
            errors: [
                {
                    messageId: "noIrregularWhitespace",
                    type: "Program",
                    line: 1,
                    column: 11,
                    endLine: 1,
                    endColumn: 12
                }
            ]
        },
        {
            code: "var foo =\u000Bbar;",
            errors: [
                {
                    messageId: "noIrregularWhitespace",
                    type: "Program",
                    line: 1,
                    column: 10,
                    endLine: 1,
                    endColumn: 11
                }
            ]
        },
        {
            code: "var foo = \u000B\u000B bar;",
            errors: [
                {
                    messageId: "noIrregularWhitespace",
                    type: "Program",
                    line: 1,
                    column: 11,
                    endLine: 1,
                    endColumn: 13
                }
            ]
        },
        {
            code: "var foo = \u000B\u000C bar;",
            errors: [
                {
                    messageId: "noIrregularWhitespace",
                    type: "Program",
                    line: 1,
                    column: 11,
                    endLine: 1,
                    endColumn: 13
                }
            ]
        },
        {
            code: "var foo = \u000B \u000B bar;",
            errors: [
                {
                    messageId: "noIrregularWhitespace",
                    type: "Program",
                    line: 1,
                    column: 11,
                    endLine: 1,
                    endColumn: 12
                },
                {
                    messageId: "noIrregularWhitespace",
                    type: "Program",
                    line: 1,
                    column: 13,
                    endLine: 1,
                    endColumn: 14
                }
            ]
        },
        {
            code: "var foo = \u000Bbar\u000B;",
            errors: [
                {
                    messageId: "noIrregularWhitespace",
                    type: "Program",
                    line: 1,
                    column: 11,
                    endLine: 1,
                    endColumn: 12
                },
                {
                    messageId: "noIrregularWhitespace",
                    type: "Program",
                    line: 1,
                    column: 15,
                    endLine: 1,
                    endColumn: 16
                }
            ]
        },
        {
            code: "\u000B",
            errors: [
                {
                    messageId: "noIrregularWhitespace",
                    type: "Program",
                    line: 1,
                    column: 1,
                    endLine: 1,
                    endColumn: 2
                }
            ]
        },
        {
            code: "\u00A0\u2002\u2003",
            errors: [
                {
                    messageId: "noIrregularWhitespace",
                    type: "Program",
                    line: 1,
                    column: 1,
                    endLine: 1,
                    endColumn: 4
                }
            ]
        },
        {
            code: "var foo = \u000B\nbar;",
            errors: [
                {
                    messageId: "noIrregularWhitespace",
                    type: "Program",
                    line: 1,
                    column: 11,
                    endLine: 1,
                    endColumn: 12
                }
            ]
        },
        {
            code: "var foo =\u000B\n\u000Bbar;",
            errors: [
                {
                    messageId: "noIrregularWhitespace",
                    type: "Program",
                    line: 1,
                    column: 10,
                    endLine: 1,
                    endColumn: 11
                },
                {
                    messageId: "noIrregularWhitespace",
                    type: "Program",
                    line: 2,
                    column: 1,
                    endLine: 2,
                    endColumn: 2
                }
            ]
        },
        {
            code: "var foo = \u000C\u000B\n\u000C\u000B\u000Cbar\n;\u000B\u000C\n",
            errors: [
                {
                    messageId: "noIrregularWhitespace",
                    type: "Program",
                    line: 1,
                    column: 11,
                    endLine: 1,
                    endColumn: 13
                },
                {
                    messageId: "noIrregularWhitespace",
                    type: "Program",
                    line: 2,
                    column: 1,
                    endLine: 2,
                    endColumn: 4
                },
                {
                    messageId: "noIrregularWhitespace",
                    type: "Program",
                    line: 3,
                    column: 2,
                    endLine: 3,
                    endColumn: 4
                }
            ]
        },
        {
            code: "var foo = \u2028bar;",
            errors: [
                {
                    messageId: "noIrregularWhitespace",
                    type: "Program",
                    line: 1,
                    column: 11,
                    endLine: 2,
                    endColumn: 1
                }
            ]
        },
        {
            code: "var foo =\u2029 bar;",
            errors: [
                {
                    messageId: "noIrregularWhitespace",
                    type: "Program",
                    line: 1,
                    column: 10,
                    endLine: 2,
                    endColumn: 1
                }
            ]
        },
        {
            code: "var foo = bar;\u2028",
            errors: [
                {
                    messageId: "noIrregularWhitespace",
                    type: "Program",
                    line: 1,
                    column: 15,
                    endLine: 2,
                    endColumn: 1
                }
            ]
        },
        {
            code: "\u2029",
            errors: [
                {
                    messageId: "noIrregularWhitespace",
                    type: "Program",
                    line: 1,
                    column: 1,
                    endLine: 2,
                    endColumn: 1
                }
            ]
        },
        {
            code: "foo\u2028\u2028",
            errors: [
                {
                    messageId: "noIrregularWhitespace",
                    type: "Program",
                    line: 1,
                    column: 4,
                    endLine: 2,
                    endColumn: 1
                },
                {
                    messageId: "noIrregularWhitespace",
                    type: "Program",
                    line: 2,
                    column: 1,
                    endLine: 3,
                    endColumn: 1
                }
            ]
        },
        {
            code: "foo\u2029\u2028",
            errors: [
                {
                    messageId: "noIrregularWhitespace",
                    type: "Program",
                    line: 1,
                    column: 4,
                    endLine: 2,
                    endColumn: 1
                },
                {
                    messageId: "noIrregularWhitespace",
                    type: "Program",
                    line: 2,
                    column: 1,
                    endLine: 3,
                    endColumn: 1
                }
            ]
        },
        {
            code: "foo\u2028\n\u2028",
            errors: [
                {
                    messageId: "noIrregularWhitespace",
                    type: "Program",
                    line: 1,
                    column: 4,
                    endLine: 2,
                    endColumn: 1
                },
                {
                    messageId: "noIrregularWhitespace",
                    type: "Program",
                    line: 3,
                    column: 1,
                    endLine: 4,
                    endColumn: 1
                }
            ]
        },
        {
            code: "foo\u000B\u2028\u000B",
            errors: [
                {
                    messageId: "noIrregularWhitespace",
                    type: "Program",
                    line: 1,
                    column: 4,
                    endLine: 1,
                    endColumn: 5
                },
                {
                    messageId: "noIrregularWhitespace",
                    type: "Program",
                    line: 1,
                    column: 5,
                    endLine: 2,
                    endColumn: 1
                },
                {
                    messageId: "noIrregularWhitespace",
                    type: "Program",
                    line: 2,
                    column: 1,
                    endLine: 2,
                    endColumn: 2
                }
            ]
        }
    ]
});
