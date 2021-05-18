/**
 * @fileoverview Validate strings passed to the RegExp constructor
 * @author Michael Ficarra
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-invalid-regexp"),
    RuleTester = require("../../../lib/testers/rule-tester");

const ruleTester = new RuleTester();

ruleTester.run("no-invalid-regexp", rule, {
    valid: [
        "RegExp('')",
        "RegExp()",
        "RegExp('.', 'g')",
        "new RegExp('.')",
        "new RegExp",
        "new RegExp('.', 'im')",
        "global.RegExp('\\\\')",
        "new RegExp('.', y)",
        { code: "new RegExp('.', 'y')", options: [{ allowConstructorFlags: ["y"] }] },
        { code: "new RegExp('.', 'u')", options: [{ allowConstructorFlags: ["U"] }] },
        { code: "new RegExp('.', 'yu')", options: [{ allowConstructorFlags: ["y", "u"] }] },
        { code: "new RegExp('/', 'yu')", options: [{ allowConstructorFlags: ["y", "u"] }] },
        { code: "new RegExp('\\/', 'yu')", options: [{ allowConstructorFlags: ["y", "u"] }] },
        { code: "new RegExp('.', 'y')", parserOptions: { ecmaVersion: 6 } },
        { code: "new RegExp('.', 'u')", parserOptions: { ecmaVersion: 6 } },
        { code: "new RegExp('.', 'yu')", parserOptions: { ecmaVersion: 6 } },
        { code: "new RegExp('/', 'yu')", parserOptions: { ecmaVersion: 6 } },
        { code: "new RegExp('\\/', 'yu')", parserOptions: { ecmaVersion: 6 } },
        { code: "new RegExp('\\\\u{65}', 'u')", parserOptions: { ecmaVersion: 2015 } },
        { code: "new RegExp('[\\\\u{0}-\\\\u{1F}]', 'u')", parserOptions: { ecmaVersion: 2015 } },
        { code: "new RegExp('.', 's')", parserOptions: { ecmaVersion: 2018 } },
        { code: "new RegExp('(?<=a)b')", parserOptions: { ecmaVersion: 2018 } },
        { code: "new RegExp('(?<!a)b')", parserOptions: { ecmaVersion: 2018 } },
        { code: "new RegExp('(?<a>b)\\k<a>')", parserOptions: { ecmaVersion: 2018 } },
        { code: "new RegExp('(?<a>b)\\k<a>', 'u')", parserOptions: { ecmaVersion: 2018 } },
        { code: "new RegExp('\\\\p{Letter}', 'u')", parserOptions: { ecmaVersion: 2018 } }
    ],
    invalid: [
        { code: "RegExp('[');", errors: [{ message: "Invalid regular expression: /[/: Unterminated character class.", type: "CallExpression" }] },
        { code: "RegExp('.', 'z');", errors: [{ message: "Invalid flags supplied to RegExp constructor 'z'.", type: "CallExpression" }] },
        { code: "new RegExp(')');", errors: [{ message: "Invalid regular expression: /)/: Unmatched ')'.", type: "NewExpression" }] },

        // https://github.com/eslint/eslint/issues/10861
        {
            code: String.raw`new RegExp('\\');`,
            errors: [{ message: "Invalid regular expression: /\\/: \\ at end of pattern.", type: "NewExpression" }]
        }
    ]
});
