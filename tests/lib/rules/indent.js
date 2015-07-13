/**
 * @fileoverview This option sets a specific tab width for your code
 * @author Dmitriy Shekhovtsov
 * @copyright 2014 Dmitriy Shekhovtsov. All rights reserved.
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslint = require("../../../lib/eslint"),
    ESLintTester = require("eslint-tester");
var fs = require("fs");
var path = require("path");
//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------
var fixture = fs.readFileSync(path.join(__dirname, "../../fixtures/rules/indent/indent-invalid-fixture-1.js"), "utf8");

function expectedErrors(errors) {
    if (!errors[0].length) {
        errors = [errors];
    }

    return errors.map(function (err) {
        return {
            message: "Expected indentation of " + err[1] + " characters.",
            type: "Program",
            line: err[0]
        };
    });
}

var eslintTester = new ESLintTester(eslint);


eslintTester.addRuleTest("lib/rules/indent", {

    valid: [
        {
            code:
            "switch (a) {\n" +
            "    case \"foo\":\n" +
            "        a();\n" +
            "    break;\n" +
            "    case \"bar\":\n" +
            "    a(); break;\n" +
            "    case \"baz\":\n" +
            "        a(); break;\n" +
            "}"
        },
        {
            code: "switch (0) {\n}"
        },
        {
            code:
            "function foo() {\n" +
            "    var a = \"a\";\n" +
            "    switch(a) {\n" +
            "        case \"a\":\n" +
            "            return \"A\";\n" +
            "        case \"b\":\n" +
            "            return \"B\";\n" +
            "    }\n" +
            "}\n" +
            "foo();"
        },
        {
            code:
            "switch(value){\n" +
            "    case \"1\":\n" +
            "    case \"2\":\n" +
            "        a();\n" +
            "    break;\n" +
            "    default:\n" +
            "        a();\n" +
            "    break;\n" +
            "}\n" +
            "switch(value){\n" +
            "    case \"1\":\n" +
            "        a();\n" +
            "        break;\n" +
            "    case \"2\":\n" +
            "        break;\n" +
            "    default:\n" +
            "        break;\n" +
            "}",
            options: [4]
        },
        {
            code:
                "var obj = {foo: 1, bar: 2};\n" +
                "with (obj) {\n" +
                "    console.log(foo + bar);\n" +
                "}\n"
        },
        {
            code:
                "if (a) {\n" +
                "    (1 + 2 + 3);\n" + // no error on this line
                "}"
        },
        {
            code:
                "switch(value){ default: a(); break; }\n"
        },
        {
            code: "import {addons} from 'react/addons'\rimport React from 'react'",
            options: [2],
            ecmaFeatures: {
                modules: true
            }
        }
    ],
    invalid: [
        {
             code:
                 "  var a = b;\n" +
                 "if (a) {\n" +
                 "  b();\n" +
                 "}\n",
             options: [2],
             errors: expectedErrors([[1, 0]])
        },
        {
             code:
                 "if (array.some(function(){\n" +
                 "  return true;\n" +
                 "})) {\n" +
                 "a++; // ->\n" +
                 "  b++;\n" +
                 "    c++; // <-\n" +
                 "}\n",
             options: [2],
             errors: expectedErrors([[4, 2], [6, 2]])
        },
        {
            code: "if (a){\n\tb=c;\n\t\tc=d;\ne=f;\n}",
            options: ["tab"],
            errors: expectedErrors([[3, 1], [4, 1]])
        },
        {
            code: "if (a){\n    b=c;\n      c=d;\n e=f;\n}",
            options: [4],
            errors: expectedErrors([[3, 4], [4, 4]])
        },
        {
            code: fixture,
            options: [2, {indentSwitchCase: true}],
            errors: expectedErrors([
                [5, 2],
                [10, 4],
                [11, 2],
                [15, 4],
                [16, 2],
                [23, 2],
                [29, 2],
                [30, 4],
                [36, 4],
                [38, 2],
                [39, 4],
                [40, 2],
                [46, 0],
                [54, 2],
                [114, 4],
                [120, 4],
                [124, 4],
                [127, 4],
                [134, 4],
                [139, 2],
                [145, 2],
                [149, 2],
                [152, 2],
                [159, 2],
                [168, 4],
                [176, 4],
                [184, 4],
                [186, 4],
                [200, 2],
                [202, 2],
                [214, 2],
                [218, 6],
                [220, 6],
                [330, 6],
                [331, 6],
                [371, 2],
                [372, 2],
                [375, 2],
                [376, 2],
                [379, 2],
                [380, 2],
                [386, 2],
                [388, 2],
                [399, 2],
                [401, 2],
                [405, 4],
                [407, 4],
                [414, 2],
                [416, 2],
                [421, 2],
                [423, 2],
                [440, 2],
                [441, 2],
                [447, 2],
                [448, 2],
                [454, 2],
                [455, 2],
                [461, 6],
                [462, 6],
                [467, 6],
                [472, 6],
                [486, 2],
                [488, 2],
                [534, 6],
                [541, 6]
            ])
        },
        {
            code:
                "switch(value){\n" +
                "    case \"1\":\n" +
                "        a();\n" +
                "    break;\n" +
                "    case \"2\":\n" +
                "        a();\n" +
                "    break;\n" +
                "    default:\n" +
                "        a();\n" +
                "        break;\n" +
                "}",
            options: [4, {indentSwitchCase: true}],
            errors: expectedErrors([[4, 8], [7, 8]])
        },
        {
            code:
                "switch(value){\n" +
                "    case \"1\":\n" +
                "        a();\n" +
                "        break;\n" +
                "    case \"2\":\n" +
                "        a();\n" +
                "        break;\n" +
                "    default:\n" +
                "    break;\n" +
                "}",
            options: [4, {indentSwitchCase: true}],
            errors: expectedErrors([9, 8])
        },
        {
            code:
                "switch(value){\n" +
                "    case \"1\":\n" +
                "    case \"2\":\n" +
                "        a();\n" +
                "        break;\n" +
                "    default:\n" +
                "        break;\n" +
                "}\n" +
                "switch(value){\n" +
                "    case \"1\":\n" +
                "    break;\n" +
                "    case \"2\":\n" +
                "        a();\n" +
                "    break;\n" +
                "    default:\n" +
                "        a();\n" +
                "    break;\n" +
                "}",
            options: [4, {indentSwitchCase: true}],
            errors: expectedErrors([[11, 8], [14, 8], [17, 8]])
        },
        {
            code:
                "switch(value){\n" +
                "    case \"1\":\n" +
                "    case \"2\":\n" +
                "        a();\n" +
                "    break;\n" +
                "    default:\n" +
                "        a();\n" +
                "    break;\n" +
                "}\n" +
                "switch(value){\n" +
                "    case \"1\":\n" +
                "        a();\n" +
                "        break;\n" +
                "    case \"2\":\n" +
                "        break;\n" +
                "    default:\n" +
                "        break;\n" +
                "}",
            options: [4, {indentSwitchCase: true}],
            errors: expectedErrors([[5, 8], [8, 8]])
        },
        {
            code:
                "switch (a) {\n" +
                "case '1':\n" +
                "b();\n" +
                "break;\n" +
                "default:\n" +
                "c();\n" +
                "break;\n" +
                "}",
            options: [4, {indentSwitchCase: true}],
            errors: expectedErrors([[3, 4], [4, 4], [6, 4], [7, 4]])
        },
        {
            code:
                "var obj = {foo: 1, bar: 2};\n" +
                "with (obj) {\n" +
                "console.log(foo + bar);\n" +
                "}\n",
            args: [2],
            errors: expectedErrors([3, 4])
        }
    ]
});

