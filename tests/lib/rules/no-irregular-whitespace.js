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

ruleTester.run("no-irregular-whitespace", rule, {
    valid: [
        "'\\u000B';",
        "'\\u000C';",
        "'\\u0085';",
        "'\\u00A0'",
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
        "'\u00A0'",
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
        "'\u3000';"
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
        }
    ]
});
