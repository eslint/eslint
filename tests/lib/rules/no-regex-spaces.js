/**
 * @fileoverview Tests for regex-spaces rule.
 * @author Matt DuVall <http://www.mattduvall.com/>
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/no-regex-spaces"),
    RuleTester = require("../../../lib/testers/rule-tester");

var ruleTester = new RuleTester();
ruleTester.run("no-regex-spaces", rule, {
    valid: [
        "var foo = /bar {3}baz/;",
        "var foo = /bar\t\t\tbaz/;"
    ],

    invalid: [
        {
            code: "var foo = /bar    baz/;",
            errors: [
                {
                    message: "Spaces are hard to count. Use {4}.",
                    type: "Literal"
                }
            ]
        }
    ]
});
