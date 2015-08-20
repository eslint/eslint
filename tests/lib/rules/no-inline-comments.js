/**
 * @fileoverview Test enforcement of no inline comments rule.
 * @author Greg Cochard
 * @copyright 2014 Greg Cochard. All rights reserved.
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/no-inline-comments"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester(),
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
        {
            code: "// A valid comment before code\nvar a = 1;"
        },
        {
            code: "var a = 2;\n// A valid comment after code"
        },
        {
            code: "// A solitary comment"
        },
        {
            code: "var a = 1; // eslint-disable-line some-rule"
        },
        {
            code: "var a = 1; /* eslint-disable-line some-rule */"
        }
    ],

    invalid: [
        {
            code: "var a = 1; /*A block comment inline after code*/",
            errors: [ blockError ]
        },
        {
            code: "/*A block comment inline before code*/ var a = 2;",
            errors: [ blockError ]
        },
        {
            code: "var a = 3; //A comment inline with code",
            errors: [ lineError ]
        },
        {
            code: "var a = 3; // someday use eslint-disable-line here",
            errors: [ lineError ]
        },
        {
            code: "var a = 4;\n/**A\n * block\n * comment\n * inline\n * between\n * code*/ var foo = a;",
            errors: [ blockError ]
        }
    ]

});
