/**
 * @fileoverview Tests for no-irregular-whitespace rule.
 * @author Jonathan Kingston
 * @copyright 2014 Jonathan Kingston. All rights reserved.
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/no-irregular-whitespace"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();

var expectedErrors = [{
    message: "Irregular whitespace not allowed",
    type: "Program"
}];
var expectedCommentErrors = [{
    message: "Irregular whitespace not allowed",
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
        {
            code: "var any \u180E = 'thing';",
            errors: expectedErrors
        },
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
                    message: "Irregular whitespace not allowed",
                    type: "Program",
                    line: 1,
                    column: 13
                },
                {
                    message: "Irregular whitespace not allowed",
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
                    message: "Irregular whitespace not allowed",
                    type: "Program",
                    line: 1,
                    column: 9
                },
                {
                    message: "Irregular whitespace not allowed",
                    type: "Program",
                    line: 1,
                    column: 28
                },
                {
                    message: "Irregular whitespace not allowed",
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
        }
    ]
});
