/**
 * @fileoverview Prevents misspelling the 'length' property.
 * @author Eric Schaefer <omg@eric-schaefer.com>
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-misspelled-length"),
    { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-misspelled-length", rule, {
    valid: [
        "var wordLength = 'Word'.length;",
        "foo.bar.length ? true : false;",
        "var foo = bar.wordWithLength;",
        "var foo = bar.wordwithlength;"
    ],

    invalid: [
        {
            code: "var wordLength = 'Word'.lentgh;",
            errors: [
                {
                    message: "Property 'length' may be misspelled.",
                    type: "MemberExpression"
                }
            ]
        },
        {
            code: "foo.bar.lneght ? true : false;",
            errors: [
                {
                    message: "Property 'length' may be misspelled.",
                    type: "MemberExpression"
                }
            ]
        }
    ]
});
