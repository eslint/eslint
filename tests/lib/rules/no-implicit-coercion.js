/**
 * @fileoverview Tests for no-implicit-coercion rule.
 * @author Toru Nagashima
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-implicit-coercion");
const RuleTester = require("../../../lib/rule-tester/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-implicit-coercion", rule, {
    valid: [
        "Boolean(foo)",
        "foo.indexOf(1) !== -1",
        "Number(foo)",
        "parseInt(foo)",
        "parseFloat(foo)",
        "String(foo)",
        "!foo",
        "~foo",
        "-foo",
        "+1234",
        "-1234",
        "- -1234",
        "+Number(lol)",
        "-parseFloat(lol)",
        "2 * foo",
        "1 * 1234",
        "123 - 0",
        "1 * Number(foo)",
        "1 * parseInt(foo)",
        "1 * parseFloat(foo)",
        "Number(foo) * 1",
        "Number(foo) - 0",
        "parseInt(foo) * 1",
        "parseFloat(foo) * 1",
        "- -Number(foo)",
        "1 * 1234 * 678 * Number(foo)",
        "1 * 1234 * 678 * parseInt(foo)",
        "(1 - 0) * parseInt(foo)",
        "1234 * 1 * 678 * Number(foo)",
        "1234 * 1 * Number(foo) * Number(bar)",
        "1234 * 1 * Number(foo) * parseInt(bar)",
        "1234 * 1 * Number(foo) * parseFloat(bar)",
        "1234 * 1 * parseInt(foo) * parseFloat(bar)",
        "1234 * 1 * parseInt(foo) * Number(bar)",
        "1234 * 1 * parseFloat(foo) * Number(bar)",
        "1234 * Number(foo) * 1 * Number(bar)",
        "1234 * parseInt(foo) * 1 * Number(bar)",
        "1234 * parseFloat(foo) * 1 * parseInt(bar)",
        "1234 * parseFloat(foo) * 1 * Number(bar)",
        "(- -1234) * (parseFloat(foo) - 0) * (Number(bar) - 0)",
        "1234*foo*1",
        "1234*1*foo",
        "1234*bar*1*foo",
        "1234*1*foo*bar",
        "1234*1*foo*Number(bar)",
        "1234*1*Number(foo)*bar",
        "1234*1*parseInt(foo)*bar",
        "0 + foo",
        "~foo.bar()",
        "foo + 'bar'",
        { code: "foo + `${bar}`", languageOptions: { ecmaVersion: 6 } },

        { code: "!!foo", options: [{ boolean: false }] },
        { code: "~foo.indexOf(1)", options: [{ boolean: false }] },
        { code: "+foo", options: [{ number: false }] },
        { code: "-(-foo)", options: [{ number: false }] },
        { code: "foo - 0", options: [{ number: false }] },
        { code: "1*foo", options: [{ number: false }] },
        { code: "\"\"+foo", options: [{ string: false }] },
        { code: "foo += \"\"", options: [{ string: false }] },
        { code: "var a = !!foo", options: [{ boolean: true, allow: ["!!"] }] },
        { code: "var a = ~foo.indexOf(1)", options: [{ boolean: true, allow: ["~"] }] },
        { code: "var a = ~foo", options: [{ boolean: true }] },
        { code: "var a = 1 * foo", options: [{ boolean: true, allow: ["*"] }] },
        { code: "- -foo", options: [{ number: true, allow: ["- -"] }] },
        { code: "foo - 0", options: [{ number: true, allow: ["-"] }] },
        { code: "var a = +foo", options: [{ boolean: true, allow: ["+"] }] },
        { code: "var a = \"\" + foo", options: [{ boolean: true, string: true, allow: ["+"] }] },

        // https://github.com/eslint/eslint/issues/7057
        "'' + 'foo'",
        { code: "`` + 'foo'", languageOptions: { ecmaVersion: 6 } },
        { code: "'' + `${foo}`", languageOptions: { ecmaVersion: 6 } },
        "'foo' + ''",
        { code: "'foo' + ``", languageOptions: { ecmaVersion: 6 } },
        { code: "`${foo}` + ''", languageOptions: { ecmaVersion: 6 } },
        "foo += 'bar'",
        { code: "foo += `${bar}`", languageOptions: { ecmaVersion: 6 } },
        { code: "`a${foo}`", options: [{ disallowTemplateShorthand: true }], languageOptions: { ecmaVersion: 6 } },
        { code: "`${foo}b`", options: [{ disallowTemplateShorthand: true }], languageOptions: { ecmaVersion: 6 } },
        { code: "`${foo}${bar}`", options: [{ disallowTemplateShorthand: true }], languageOptions: { ecmaVersion: 6 } },
        { code: "tag`${foo}`", options: [{ disallowTemplateShorthand: true }], languageOptions: { ecmaVersion: 6 } },
        { code: "`${foo}`", languageOptions: { ecmaVersion: 6 } },
        { code: "`${foo}`", options: [{ }], languageOptions: { ecmaVersion: 6 } },
        { code: "`${foo}`", options: [{ disallowTemplateShorthand: false }], languageOptions: { ecmaVersion: 6 } },
        "+42",

        // https://github.com/eslint/eslint/issues/14623
        "'' + String(foo)",
        "String(foo) + ''",
        { code: "`` + String(foo)", languageOptions: { ecmaVersion: 6 } },
        { code: "String(foo) + ``", languageOptions: { ecmaVersion: 6 } },
        { code: "`${'foo'}`", options: [{ disallowTemplateShorthand: true }], languageOptions: { ecmaVersion: 6 } },
        { code: "`${`foo`}`", options: [{ disallowTemplateShorthand: true }], languageOptions: { ecmaVersion: 6 } },
        { code: "`${String(foo)}`", options: [{ disallowTemplateShorthand: true }], languageOptions: { ecmaVersion: 6 } },

        // https://github.com/eslint/eslint/issues/16373
        "console.log(Math.PI * 1/4)",
        "a * 1 / 2",
        "a * 1 / b"
    ],
    invalid: [
        {
            code: "!!foo",
            output: "Boolean(foo)",
            errors: [{
                messageId: "implicitCoercion",
                data: { recommendation: "Boolean(foo)" },
                type: "UnaryExpression"
            }]
        },
        {
            code: "!!(foo + bar)",
            output: "Boolean(foo + bar)",
            errors: [{
                messageId: "implicitCoercion",
                data: { recommendation: "Boolean(foo + bar)" },
                type: "UnaryExpression"
            }]
        },
        {
            code: "!!(foo + bar); var Boolean = null",
            output: null,
            errors: [{
                messageId: "implicitCoercion",
                data: { recommendation: "Boolean(foo + bar)" },
                suggestions: [{
                    messageId: "useRecommendation",
                    data: { recommendation: "Boolean(foo + bar)" },
                    output: "Boolean(foo + bar); var Boolean = null"
                }],
                type: "UnaryExpression"
            }]
        },
        {
            code: "!!(foo + bar)",
            output: null,
            languageOptions: {
                globals: {
                    Boolean: "off"
                }
            },
            errors: [{
                messageId: "implicitCoercion",
                data: { recommendation: "Boolean(foo + bar)" },
                suggestions: [{
                    messageId: "useRecommendation",
                    data: { recommendation: "Boolean(foo + bar)" },
                    output: "Boolean(foo + bar)"
                }],
                type: "UnaryExpression"
            }]
        },
        {
            code: "~foo.indexOf(1)",
            output: null,
            errors: [{
                messageId: "implicitCoercion",
                data: { recommendation: "foo.indexOf(1) !== -1" },
                type: "UnaryExpression"
            }]
        },
        {
            code: "~foo.bar.indexOf(2)",
            output: null,
            errors: [{
                messageId: "implicitCoercion",
                data: { recommendation: "foo.bar.indexOf(2) !== -1" },
                type: "UnaryExpression"
            }]
        },
        {
            code: "+foo",
            output: null,
            errors: [{
                messageId: "implicitCoercion",
                data: { recommendation: "Number(foo)" },
                suggestions: [{
                    messageId: "useRecommendation",
                    data: { recommendation: "Number(foo)" },
                    output: "Number(foo)"
                }],
                type: "UnaryExpression"
            }]
        },
        {
            code: "-(-foo)",
            output: null,
            errors: [{
                messageId: "implicitCoercion",
                data: { recommendation: "Number(foo)" },
                suggestions: [{
                    messageId: "useRecommendation",
                    data: { recommendation: "Number(foo)" },
                    output: "Number(foo)"
                }],
                type: "UnaryExpression"
            }]
        },
        {
            code: "+foo.bar",
            output: null,
            errors: [{
                messageId: "implicitCoercion",
                data: { recommendation: "Number(foo.bar)" },
                suggestions: [{
                    messageId: "useRecommendation",
                    data: { recommendation: "Number(foo.bar)" },
                    output: "Number(foo.bar)"
                }],
                type: "UnaryExpression"
            }]
        },
        {
            code: "1*foo",
            output: null,
            errors: [{
                messageId: "implicitCoercion",
                data: { recommendation: "Number(foo)" },
                suggestions: [{
                    messageId: "useRecommendation",
                    data: { recommendation: "Number(foo)" },
                    output: "Number(foo)"
                }],
                type: "BinaryExpression"
            }]
        },
        {
            code: "foo*1",
            output: null,
            errors: [{
                messageId: "implicitCoercion",
                data: { recommendation: "Number(foo)" },
                suggestions: [{
                    messageId: "useRecommendation",
                    data: { recommendation: "Number(foo)" },
                    output: "Number(foo)"
                }],
                type: "BinaryExpression"
            }]
        },
        {
            code: "1*foo.bar",
            output: null,
            errors: [{
                messageId: "implicitCoercion",
                data: { recommendation: "Number(foo.bar)" },
                suggestions: [{
                    messageId: "useRecommendation",
                    data: { recommendation: "Number(foo.bar)" },
                    output: "Number(foo.bar)"
                }],
                type: "BinaryExpression"
            }]
        },
        {
            code: "foo.bar-0",
            output: null,
            errors: [{
                messageId: "implicitCoercion",
                data: { recommendation: "Number(foo.bar)" },
                suggestions: [{
                    messageId: "useRecommendation",
                    data: { recommendation: "Number(foo.bar)" },
                    output: "Number(foo.bar)"
                }],
                type: "BinaryExpression"
            }]
        },
        {
            code: "\"\"+foo",
            output: null,
            errors: [{
                messageId: "implicitCoercion",
                data: { recommendation: "String(foo)" },
                suggestions: [{
                    messageId: "useRecommendation",
                    data: { recommendation: "String(foo)" },
                    output: "String(foo)"
                }],
                type: "BinaryExpression"
            }]
        },
        {
            code: "``+foo",
            output: null,
            languageOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "implicitCoercion",
                data: { recommendation: "String(foo)" },
                suggestions: [{
                    messageId: "useRecommendation",
                    data: { recommendation: "String(foo)" },
                    output: "String(foo)"
                }],
                type: "BinaryExpression"
            }]
        },
        {
            code: "foo+\"\"",
            output: null,
            errors: [{
                messageId: "implicitCoercion",
                data: { recommendation: "String(foo)" },
                suggestions: [{
                    messageId: "useRecommendation",
                    data: { recommendation: "String(foo)" },
                    output: "String(foo)"
                }],
                type: "BinaryExpression"
            }]
        },
        {
            code: "foo+``",
            output: null,
            languageOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "implicitCoercion",
                data: { recommendation: "String(foo)" },
                suggestions: [{
                    messageId: "useRecommendation",
                    data: { recommendation: "String(foo)" },
                    output: "String(foo)"
                }],
                type: "BinaryExpression"
            }]
        },
        {
            code: "\"\"+foo.bar",
            output: null,
            errors: [{
                messageId: "implicitCoercion",
                data: { recommendation: "String(foo.bar)" },
                suggestions: [{
                    messageId: "useRecommendation",
                    data: { recommendation: "String(foo.bar)" },
                    output: "String(foo.bar)"
                }],
                type: "BinaryExpression"
            }]
        },
        {
            code: "``+foo.bar",
            output: null,
            languageOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "implicitCoercion",
                data: { recommendation: "String(foo.bar)" },
                suggestions: [{
                    messageId: "useRecommendation",
                    data: { recommendation: "String(foo.bar)" },
                    output: "String(foo.bar)"
                }],
                type: "BinaryExpression"
            }]
        },
        {
            code: "foo.bar+\"\"",
            output: null,
            errors: [{
                messageId: "implicitCoercion",
                data: { recommendation: "String(foo.bar)" },
                suggestions: [{
                    messageId: "useRecommendation",
                    data: { recommendation: "String(foo.bar)" },
                    output: "String(foo.bar)"
                }],
                type: "BinaryExpression"
            }]
        },
        {
            code: "foo.bar+``",
            output: null,
            languageOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "implicitCoercion",
                data: { recommendation: "String(foo.bar)" },
                suggestions: [{
                    messageId: "useRecommendation",
                    data: { recommendation: "String(foo.bar)" },
                    output: "String(foo.bar)"
                }],
                type: "BinaryExpression"
            }]
        },
        {
            code: "`${foo}`",
            output: null,
            options: [{ disallowTemplateShorthand: true }],
            languageOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "implicitCoercion",
                data: { recommendation: "String(foo)" },
                suggestions: [{
                    messageId: "useRecommendation",
                    data: { recommendation: "String(foo)" },
                    output: "String(foo)"
                }],
                type: "TemplateLiteral"
            }]
        },
        {
            code: "`\\\n${foo}`",
            output: null,
            options: [{ disallowTemplateShorthand: true }],
            languageOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "implicitCoercion",
                data: { recommendation: "String(foo)" },
                suggestions: [{
                    messageId: "useRecommendation",
                    data: { recommendation: "String(foo)" },
                    output: "String(foo)"
                }],
                type: "TemplateLiteral"
            }]
        },
        {
            code: "`${foo}\\\n`",
            output: null,
            options: [{ disallowTemplateShorthand: true }],
            languageOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "implicitCoercion",
                data: { recommendation: "String(foo)" },
                suggestions: [{
                    messageId: "useRecommendation",
                    data: { recommendation: "String(foo)" },
                    output: "String(foo)"
                }],
                type: "TemplateLiteral"
            }]
        },
        {
            code: "foo += \"\"",
            output: null,
            errors: [{
                messageId: "implicitCoercion",
                data: { recommendation: "foo = String(foo)" },
                suggestions: [{
                    messageId: "useRecommendation",
                    data: { recommendation: "foo = String(foo)" },
                    output: "foo = String(foo)"
                }],
                type: "AssignmentExpression"
            }]
        },
        {
            code: "foo += ``",
            output: null,
            languageOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "implicitCoercion",
                data: { recommendation: "foo = String(foo)" },
                suggestions: [{
                    messageId: "useRecommendation",
                    data: { recommendation: "foo = String(foo)" },
                    output: "foo = String(foo)"
                }],
                type: "AssignmentExpression"
            }]
        },
        {
            code: "var a = !!foo",
            output: "var a = Boolean(foo)",
            options: [{ boolean: true, allow: ["~"] }],
            errors: [{
                messageId: "implicitCoercion",
                data: { recommendation: "Boolean(foo)" },
                type: "UnaryExpression"
            }]
        },
        {
            code: "var a = ~foo.indexOf(1)",
            output: null,
            options: [{ boolean: true, allow: ["!!"] }],
            errors: [{
                messageId: "implicitCoercion",
                data: { recommendation: "foo.indexOf(1) !== -1" },
                type: "UnaryExpression"
            }]
        },
        {
            code: "var a = 1 * foo",
            output: null,
            options: [{ boolean: true, allow: ["+"] }],
            errors: [{
                messageId: "implicitCoercion",
                data: { recommendation: "Number(foo)" },
                suggestions: [{
                    messageId: "useRecommendation",
                    data: { recommendation: "Number(foo)" },
                    output: "var a = Number(foo)"
                }],
                type: "BinaryExpression"
            }]
        },
        {
            code: "var a = +foo",
            output: null,
            options: [{ boolean: true, allow: ["*"] }],
            errors: [{
                messageId: "implicitCoercion",
                data: { recommendation: "Number(foo)" },
                suggestions: [{
                    messageId: "useRecommendation",
                    data: { recommendation: "Number(foo)" },
                    output: "var a = Number(foo)"
                }],
                type: "UnaryExpression"
            }]
        },
        {
            code: "var a = \"\" + foo",
            output: null,
            options: [{ boolean: true, allow: ["*"] }],
            errors: [{
                messageId: "implicitCoercion",
                data: { recommendation: "String(foo)" },
                suggestions: [{
                    messageId: "useRecommendation",
                    data: { recommendation: "String(foo)" },
                    output: "var a = String(foo)"
                }],
                type: "BinaryExpression"
            }]
        },
        {
            code: "var a = `` + foo",
            output: null,
            options: [{ boolean: true, allow: ["*"] }],
            languageOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "implicitCoercion",
                data: { recommendation: "String(foo)" },
                suggestions: [{
                    messageId: "useRecommendation",
                    data: { recommendation: "String(foo)" },
                    output: "var a = String(foo)"
                }],
                type: "BinaryExpression"
            }]
        },
        {
            code: "typeof+foo",
            output: null,
            errors: [{
                messageId: "implicitCoercion",
                data: { recommendation: "Number(foo)" },
                suggestions: [{
                    messageId: "useRecommendation",
                    data: { recommendation: "Number(foo)" },
                    output: "typeof Number(foo)"
                }],
                type: "UnaryExpression"
            }]
        },
        {
            code: "typeof +foo",
            output: null,
            errors: [{
                messageId: "implicitCoercion",
                data: { recommendation: "Number(foo)" },
                suggestions: [{
                    messageId: "useRecommendation",
                    data: { recommendation: "Number(foo)" },
                    output: "typeof Number(foo)"
                }],
                type: "UnaryExpression"
            }]
        },
        {
            code: "let x ='' + 1n;",
            output: null,
            languageOptions: { ecmaVersion: 2020 },
            errors: [{
                messageId: "implicitCoercion",
                data: { recommendation: "String(1n)" },
                suggestions: [{
                    messageId: "useRecommendation",
                    data: { recommendation: "String(1n)" },
                    output: "let x =String(1n);"
                }],
                type: "BinaryExpression"
            }]
        },

        // Optional chaining
        {
            code: "~foo?.indexOf(1)",
            output: null,
            languageOptions: { ecmaVersion: 2020 },
            errors: [{
                messageId: "implicitCoercion",
                data: { recommendation: "foo?.indexOf(1) >= 0" },
                type: "UnaryExpression"
            }]
        },
        {
            code: "~(foo?.indexOf)(1)",
            output: null,
            languageOptions: { ecmaVersion: 2020 },
            errors: [{
                messageId: "implicitCoercion",
                data: { recommendation: "(foo?.indexOf)(1) !== -1" },
                type: "UnaryExpression"
            }]
        },

        // https://github.com/eslint/eslint/issues/16373 regression tests
        {
            code: "1 * a / 2",
            output: null,
            errors: [{
                messageId: "implicitCoercion",
                data: { recommendation: "Number(a)" },
                suggestions: [{
                    messageId: "useRecommendation",
                    data: { recommendation: "Number(a)" },
                    output: "Number(a) / 2"
                }],
                type: "BinaryExpression"
            }]
        },
        {
            code: "(a * 1) / 2",
            output: null,
            errors: [{
                messageId: "implicitCoercion",
                data: { recommendation: "Number(a)" },
                suggestions: [{
                    messageId: "useRecommendation",
                    data: { recommendation: "Number(a)" },
                    output: "(Number(a)) / 2"
                }],
                type: "BinaryExpression"
            }]
        },
        {
            code: "a * 1 / (b * 1)",
            output: null,
            errors: [{
                messageId: "implicitCoercion",
                data: { recommendation: "Number(b)" },
                suggestions: [{
                    messageId: "useRecommendation",
                    data: { recommendation: "Number(b)" },
                    output: "a * 1 / (Number(b))"
                }],
                type: "BinaryExpression"
            }]
        },
        {
            code: "a * 1 + 2",
            output: null,
            errors: [{
                messageId: "implicitCoercion",
                data: { recommendation: "Number(a)" },
                suggestions: [{
                    messageId: "useRecommendation",
                    data: { recommendation: "Number(a)" },
                    output: "Number(a) + 2"
                }],
                type: "BinaryExpression"
            }]
        }
    ]
});
