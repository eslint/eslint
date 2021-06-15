/**
 * @fileoverview Disallow mixed spaces and tabs for indentation
 * @author Jary Niebur
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-mixed-spaces-and-tabs"),
    { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-mixed-spaces-and-tabs", rule, {

    valid: [
        "foo",
        "foo \t",
        "foo\t ",
        "\tvar x = 5;",
        "\t\tvar x = 5;",
        " var x = 5;",
        "    var x = 5;",
        " foo\t",
        "\tfoo ",
        "\t/*\n\t * Hello\n\t */",
        "// foo\n\t/**\n\t * Hello\n\t */",
        "/*\n\n \t \n*/",
        "/*\t */ //",
        "/*\n \t*/ //",
        "/*\n\t *//*\n \t*/",
        "// \t",
        "/*\n*/\t ",
        "/* \t\n\t \n \t\n\t */ \t",
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
        "' \t\\\n\t multiline string';",
        "'\t \\\n \tmultiline string';",
        {
            code: "\tvar x = 5,\n\t    y = 2;",
            options: ["smart-tabs"]
        },
        {
            code: "\t\t\t   foo",
            options: ["smart-tabs"]
        },
        {
            code: "foo",
            options: ["smart-tabs"]
        },
        {
            code: "foo \t",
            options: ["smart-tabs"]
        },
        {
            code: "foo\t ",
            options: ["smart-tabs"]
        },
        {
            code: "\tfoo \t",
            options: ["smart-tabs"]
        },
        {
            code: "\tvar x = 5;",
            options: ["smart-tabs"]
        },
        {
            code: "\t\tvar x = 5;",
            options: ["smart-tabs"]
        },
        {
            code: " var x = 5;",
            options: ["smart-tabs"]
        },
        {
            code: "    var x = 5;",
            options: ["smart-tabs"]
        },
        {
            code: " foo\t",
            options: ["smart-tabs"]
        },
        {
            code: "\tfoo ",
            options: ["smart-tabs"]
        }
    ],

    invalid: [
        {
            code: "function add(x, y) {\n\t return x + y;\n}",
            errors: [
                {
                    messageId: "mixedSpacesAndTabs",
                    type: "Program",
                    line: 2,
                    column: 1,
                    endLine: 2,
                    endColumn: 3
                }
            ]
        },
        {
            code: "\t ;\n/*\n\t * Hello\n\t */",
            errors: [
                {
                    messageId: "mixedSpacesAndTabs",
                    type: "Program",
                    line: 1,
                    column: 1,
                    endLine: 1,
                    endColumn: 3
                }
            ]
        },
        {
            code: " \t/* comment */",
            errors: [
                {
                    messageId: "mixedSpacesAndTabs",
                    type: "Program",
                    line: 1,
                    column: 1,
                    endLine: 1,
                    endColumn: 3
                }
            ]
        },
        {
            code: "\t // comment",
            errors: [
                {
                    messageId: "mixedSpacesAndTabs",
                    type: "Program",
                    line: 1,
                    column: 1,
                    endLine: 1,
                    endColumn: 3
                }
            ]
        },
        {
            code: "\t var a /* comment */ = 1;",
            errors: [
                {
                    messageId: "mixedSpacesAndTabs",
                    type: "Program",
                    line: 1,
                    column: 1,
                    endLine: 1,
                    endColumn: 3
                }
            ]
        },
        {
            code: " \tvar b = 1; // comment",
            errors: [
                {
                    messageId: "mixedSpacesAndTabs",
                    type: "Program",
                    line: 1,
                    column: 1,
                    endLine: 1,
                    endColumn: 3
                }
            ]
        },
        {
            code: "/**/\n \t/*\n \t*/",
            errors: [
                {
                    messageId: "mixedSpacesAndTabs",
                    type: "Program",
                    line: 2,
                    column: 1,
                    endLine: 2,
                    endColumn: 3
                }
            ]
        },
        {
            code: "\t var x = 5, y = 2, z = 5;\n\n\t \tvar j =\t x + y;\nz *= j;",
            errors: [
                {
                    messageId: "mixedSpacesAndTabs",
                    type: "Program",
                    line: 1,
                    column: 1,
                    endLine: 1,
                    endColumn: 3
                },
                {
                    messageId: "mixedSpacesAndTabs",
                    type: "Program",
                    line: 3,
                    column: 1,
                    endLine: 3,
                    endColumn: 3
                }
            ]
        },
        {
            code: "\tvar x = 5,\n  \t  y = 2;",
            options: [true],
            errors: [
                {
                    messageId: "mixedSpacesAndTabs",
                    type: "Program",
                    line: 2,
                    column: 2,
                    endLine: 2,
                    endColumn: 4
                }
            ]
        },
        {
            code: "\tvar x = 5,\n  \t  y = 2;",
            options: ["smart-tabs"],
            errors: [
                {
                    messageId: "mixedSpacesAndTabs",
                    type: "Program",
                    line: 2,
                    column: 2,
                    endLine: 2,
                    endColumn: 4
                }
            ]
        },
        {
            code: "`foo${\n \t  5 }bar`;",
            options: ["smart-tabs"],
            env: { es6: true },
            errors: [
                {
                    messageId: "mixedSpacesAndTabs",
                    type: "Program",
                    line: 2,
                    column: 1,
                    endLine: 2,
                    endColumn: 3
                }
            ]
        },
        {
            code: "`foo${\n\t  5 }bar`;",
            env: { es6: true },
            errors: [
                {
                    messageId: "mixedSpacesAndTabs",
                    type: "Program",
                    line: 2,
                    column: 1,
                    endLine: 2,
                    endColumn: 3
                }
            ]
        },
        {
            code: "  \t'';",
            errors: [
                {
                    messageId: "mixedSpacesAndTabs",
                    type: "Program",
                    line: 1,
                    column: 2,
                    endLine: 1,
                    endColumn: 4
                }
            ]
        },
        {
            code: "''\n\t ",
            errors: [
                {
                    messageId: "mixedSpacesAndTabs",
                    type: "Program",
                    line: 2,
                    column: 1,
                    endLine: 2,
                    endColumn: 3
                }
            ]
        },
        {
            code: "   \tfoo",
            errors: [
                {
                    messageId: "mixedSpacesAndTabs",
                    type: "Program",
                    line: 1,
                    column: 3,
                    endLine: 1,
                    endColumn: 5
                }
            ]
        },
        {
            code: "\t\t\t foo",
            errors: [
                {
                    messageId: "mixedSpacesAndTabs",
                    type: "Program",
                    line: 1,
                    column: 3,
                    endLine: 1,
                    endColumn: 5
                }
            ]
        },
        {
            code: "\t \tfoo",
            options: ["smart-tabs"],
            errors: [
                {
                    messageId: "mixedSpacesAndTabs",
                    type: "Program",
                    line: 1,
                    column: 2,
                    endLine: 1,
                    endColumn: 4
                }
            ]
        },
        {
            code: "\t\t\t   \tfoo",
            options: ["smart-tabs"],
            errors: [
                {
                    messageId: "mixedSpacesAndTabs",
                    type: "Program",
                    line: 1,
                    column: 6,
                    endLine: 1,
                    endColumn: 8
                }
            ]
        }
    ]
});
