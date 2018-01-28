/**
 * @fileoverview Test enforcement of no inline comments rule.
 * @author Greg Cochard
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-inline-comments"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester(),
    lineError = {
        messsage: "Unexpected comment inline with code.",
        type: "Line"
    },
    blockError = {
        messsage: "Unexpected comment inline with code.",
        type: "Block"
    };

ruleTester.run("no-inline-comments", rule, {

    valid: [
        "// A valid comment before code\nvar a = 1;",
        "var a = 2;\n// A valid comment after code",
        "// A solitary comment",
        "var a = 1; // eslint-disable-line some-rule",
        "var a = 1; /* eslint-disable-line some-rule */"
    ],

    invalid: [
        {
            code: "var a = 1; /*A block comment inline after code*/",
            errors: [blockError]
        },
        {
            code: "/*A block comment inline before code*/ var a = 2;",
            errors: [blockError]
        },
        {
            code: "var a = 3; //A comment inline with code",
            errors: [lineError]
        },
        {
            code: "var a = 3; // someday use eslint-disable-line here",
            errors: [lineError]
        },
        {
            code: "var a = 4;\n/**A\n * block\n * comment\n * inline\n * between\n * code*/ var foo = a;",
            errors: [blockError]
        }
    ]

});
