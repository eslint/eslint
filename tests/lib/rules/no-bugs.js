/**
 * @fileoverview Disallows bugs in source code
 * @author Teddy Katz
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-bugs");
const RuleTester = require("../../../lib/testers/rule-tester");


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-bugs", rule, {

    valid: [
        "var foo = 'bar';",
        "var foo = 'hello'",
        "var correctCode = 5;",
        "var feature = 3;",
        "debugger;"
    ],

    invalid: [
        {
            code: "var foo = '🐞';",
            output: "var foo = '';",
            errors: [{ messageId: "🐞" }]
        },
        {
            code: "var foo = '🐛';",
            output: "var foo = '';",
            errors: [{ messageId: "🐛" }]
        },
        {
            code: "var foo = '🐜';",
            output: "var foo = '';",
            errors: [{ messageId: "🐜" }]
        },
        {
            code: "var foo = '🕷';",
            output: "var foo = '';",
            errors: [{ messageId: "🕷" }]
        },
        {
            code: "var foo = '🦟';",
            output: "var foo = '';",
            errors: [{ messageId: "🦟" }]
        },
        {
            code: "var foo = `🐞`;",
            output: "var foo = ``;",
            parserOptions: { ecmaVersion: 2015 },
            errors: [{ messageId: "🐞" }]
        },
        {
            code: "// foo 🐛 bar",
            output: "// foo  bar",
            errors: [{ messageId: "🐛" }]
        }
    ]
});
