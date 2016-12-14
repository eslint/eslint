/* eslint no-octal-escape: 0 */
/**
 * @fileoverview Tests for no-octal-escape rule.
 * @author Ian Christian Myers
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-octal-escape"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-octal-escape", rule, {
    valid: [
        "var foo = \"\\x51\";",
        "var foo = \"foo \\\\251 bar\";",
        "var foo = /([abc]) \\1/g;",
        "var foo = '\\0';"
    ],
    invalid: [
        { code: "var foo = \"foo \\01 bar\";", errors: [{ message: "Don't use octal: '\\01'. Use '\\u....' instead.", type: "Literal" }] },
        { code: "var foo = \"foo \\251 bar\";", errors: [{ message: "Don't use octal: '\\251'. Use '\\u....' instead.", type: "Literal" }] },
        { code: "var foo = \"\\751\";", errors: [{ message: "Don't use octal: '\\75'. Use '\\u....' instead.", type: "Literal" }] },
        { code: "var foo = \"\\3s51\";", errors: [{ message: "Don't use octal: '\\3'. Use '\\u....' instead.", type: "Literal" }] },
        { code: "var foo = \"\\\\\\751\";", errors: [{ message: "Don't use octal: '\\75'. Use '\\u....' instead.", type: "Literal" }] }
    ]
});
