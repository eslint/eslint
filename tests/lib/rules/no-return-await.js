/**
 * @fileoverview Disallows unnecessary `return await`
 * @author Jordan Harband
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-return-await");
const RuleTester = require("../../../lib/testers/rule-tester");


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 2017 } });

ruleTester.run("no-return-await", rule, {

    valid: [
        { code: "\nasync function foo() {\n\tawait bar(); return;\n}\n" },
        { code: "\nasync function foo() {\n\tconst x = await bar(); return x;\n}\n" },
        { code: "\nasync () => { return bar(); }\n" },
        { code: "\nasync () => bar()\n" },
        { code: "\nasync function foo() {\nif (a) {\n\t\tif (b) {\n\t\t\treturn bar();\n\t\t}\n\t}\n}\n" },
        { code: "\nasync () => {\nif (a) {\n\t\tif (b) {\n\t\t\treturn bar();\n\t\t}\n\t}\n}\n" },
    ],

    invalid: [
        {
            code: "\nasync function foo() {\n\treturn await bar();\n}\n",
            errors: [{
                message: "Redundant use of `await` on a return value.",
                type: "Identifier", // pending https://github.com/eslint/espree/issues/304, should be "Keyword"
            }],
        },
        {
            code: "\nasync () => { return await bar(); }\n",
            errors: [{
                message: "Redundant use of `await` on a return value.",
                type: "Identifier", // pending https://github.com/eslint/espree/issues/304, should be "Keyword"
            }],
        },
        {
            code: "\nasync () => await bar()\n",
            errors: [{
                message: "Redundant use of `await` on a return value.",
                type: "Identifier", // pending https://github.com/eslint/espree/issues/304, should be "Keyword"
            }],
        },
        {
            code: "\nasync function foo() {\nif (a) {\n\t\tif (b) {\n\t\t\treturn await bar();\n\t\t}\n\t}\n}\n",
            errors: [{
                message: "Redundant use of `await` on a return value.",
                type: "Identifier", // pending https://github.com/eslint/espree/issues/304, should be "Keyword"
            }],
        },
        {
            code: "\nasync () => {\nif (a) {\n\t\tif (b) {\n\t\t\treturn await bar();\n\t\t}\n\t}\n}\n",
            errors: [{
                message: "Redundant use of `await` on a return value.",
                type: "Identifier", // pending https://github.com/eslint/espree/issues/304, should be "Keyword"
            }],
        },
    ]
});
