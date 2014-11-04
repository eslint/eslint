/**
 * @fileoverview Test enforcement of no inline comments rule.
 * @author Greg Cochard
 * @copyright 2014 Greg Cochard. All rights reserved.
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslint = require("../../../lib/eslint"),
    ESLintTester = require("eslint-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var eslintTester = new ESLintTester(eslint),
    lineError = {
        messsage: "Unexpected comment inline with code.",
        type: "Line"
    },
    blockError = {
        messsage: "Unexpected comment inline with code.",
        type: "Block"
    };

eslintTester.addRuleTest("lib/rules/no-inline-comments", {

    valid: [
        {
            code: "// A valid comment before code\nvar a = 1;"
        },
        {
            code: "var a = 2;\n// A valid comment after code"
        },
        {
            code: "// A solitary comment"
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
            code: "var a = 4;\n/**A\n * block\n * comment\n * inline\n * between\n * code*/ var foo = a;",
            errors: [ blockError ]
        }
    ]

});
