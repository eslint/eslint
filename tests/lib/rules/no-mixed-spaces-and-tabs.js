/**
 * @fileoverview Disallow mixed spaces and tabs for indentation
 * @author Jary Niebur
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-mixed-spaces-and-tabs"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-mixed-spaces-and-tabs", rule, {

    valid: [
        "\tvar x = 5;",
        "    var x = 5;",
        "\t/*\n\t * Hello\n\t */",
        "// foo\n\t/**\n\t * Hello\n\t */",
        "/*\n\n \t \n*/",
        {
            code: "\tvar x = 5,\n\t    y = 2;",
            options: [true]
        },
        {
            code: "/*\n\t */`\n\t   `;",
            env: { es6: true }
        },
        {
            code: "/*\n\t */var a = `\n\t   `, b = `\n\t   `/*\t \n\t \n*/;",
            env: { es6: true }
        },
        {
            code: "/*\t `template inside comment` */",
            env: { es6: true }
        },
        {
            code: "var foo = `\t /* comment inside template\t */`;",
            env: { es6: true }
        },
        {
            code: "`\n\t   `;",
            env: { es6: true }
        },
        {
            code: "`\n\t   \n`;",
            env: { es6: true }
        },
        {
            code: "`\t   `;",
            env: { es6: true }
        },
        {
            code: "const foo = `${console}\n\t foo`;",
            env: { es6: true }
        },
        {
            code: "`\t   `;`   \t`",
            env: { es6: true }
        },
        {
            code: "`foo${ 5 }\t    `;",
            env: { es6: true }
        },
        {
            code: "\tvar x = 5,\n\t    y = 2;",
            options: ["smart-tabs"]
        }
    ],

    invalid: [
        {
            code: "function add(x, y) {\n\t return x + y;\n}",
            errors: [
                {
                    message: "Mixed spaces and tabs.",
                    type: "Program",
                    line: 2
                }
            ]
        },
        {
            code: "\t ;\n/*\n\t * Hello\n\t */",
            errors: [
                {
                    message: "Mixed spaces and tabs.",
                    type: "Program",
                    line: 1
                }
            ]
        },
        {
            code: "\t var x = 5, y = 2, z = 5;\n\n\t \tvar j =\t x + y;\nz *= j;",
            errors: [
                {
                    message: "Mixed spaces and tabs.",
                    type: "Program",
                    line: 1
                },
                {
                    message: "Mixed spaces and tabs.",
                    type: "Program",
                    line: 3
                }
            ]
        },
        {
            code: "\tvar x = 5,\n  \t  y = 2;",
            options: [true],
            errors: [
                {
                    message: "Mixed spaces and tabs.",
                    type: "Program",
                    line: 2
                }
            ]
        },
        {
            code: "\tvar x = 5,\n  \t  y = 2;",
            options: ["smart-tabs"],
            errors: [
                {
                    message: "Mixed spaces and tabs.",
                    type: "Program",
                    line: 2
                }
            ]
        },
        {
            code: "`foo${\n \t  5 }bar`;",
            options: ["smart-tabs"],
            errors: [
                {
                    message: "Mixed spaces and tabs.",
                    type: "Program",
                    line: 2,
                    column: 2
                }
            ],
            env: { es6: true }
        },
        {
            code: "`foo${\n\t  5 }bar`;",
            errors: [
                {
                    message: "Mixed spaces and tabs.",
                    type: "Program",
                    line: 2,
                    column: 2
                }
            ],
            env: { es6: true }
        }
    ]
});
