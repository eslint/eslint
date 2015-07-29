/**
 * @fileoverview This option sets a specific tab width for your code
 * @author Dmitriy Shekhovtsov
 * @author Gyandeep Singh
 * @copyright 2014 Dmitriy Shekhovtsov. All rights reserved.
 * @copyright 2015 Gyandeep Singh. All rights reserved.
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/indent"),
    RuleTester = require("../../../lib/testers/rule-tester");
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

    return errors.map(function(err) {
        return {
            message: "Expected indentation of " + err[1] + " characters.",
            type: err[2] || "Program",
            line: err[0]
        };
    });
}

var ruleTester = new RuleTester();
ruleTester.run("indent", rule, {

    valid: [
        {
            code:
            "var geometry, box, face1, face2, colorT, colorB, sprite, padding, maxWidth,\n" +
            "  height, rotate;",
            options: [2, {"indentSwitchCase": true}]
        },
        {
            code:
            "var geometry, box, face1, face2, colorT, colorB, sprite, padding, maxWidth;",
            options: [2, {"indentSwitchCase": true}]
        },
        {
            code:
            "if (1 < 2){\n" +
            "//hi sd \n" +
            "}",
            options: [2]
        },
        {
            code:
            "while (1 < 2){\n" +
            "  //hi sd \n" +
            "}",
            options: [2]
        },
        {
            code:
            "while (1 < 2) console.log('hi');",
            options: [2]
        },
        {
            code:
            "[a, b, \nc].forEach((index) => {\n" +
            "    index;\n" +
            "});\n",
            options: [4],
            ecmaFeatures: { arrowFunctions: true }
        },
        {
            code:
            "[a, b, \nc].forEach(function(index){\n" +
            "    return index;\n" +
            "});\n",
            options: [4],
            ecmaFeatures: { arrowFunctions: true }
        },
        {
            code:
            "[a, b, c].forEach((index) => {\n" +
            "    index;\n" +
            "});\n",
            options: [4],
            ecmaFeatures: { arrowFunctions: true }
        },
        {
            code:
            "[a, b, c].forEach(function(index){\n" +
            "    return index;\n" +
            "});\n",
            options: [4],
            ecmaFeatures: { arrowFunctions: true }
        },
        {
            code:
            "var a = new Test({\n" +
            "        a: 1\n" +
            "    }),\n" +
            "    b = 4;\n",
            options: [4]
        },
        {
            code:
            "switch (x) {\n" +
            "    case \"foo\":\n" +
            "        a();\n" +
            "        break;\n" +
            "    case \"bar\":\n" +
            "        switch (y) {\n" +
            "            case \"1\":\n" +
            "                break;\n" +
            "            case \"2\":\n" +
            "                a = 6;\n" +
            "                break;\n" +
            "        }\n" +
            "    case \"test\":\n" +
            "        break;\n" +
            "}",
            options: [4, {indentSwitchCase: true}]
        },
        {
            code:
            "switch (a) {\n" +
            "case \"foo\":\n" +
            "    a();\n" +
            "    break;\n" +
            "case \"bar\":\n" +
            "    switch(x){\n" +
            "    case '1':\n" +
            "        break;\n" +
            "    case '2':\n" +
            "        a = 6;\n" +
            "        break;\n" +
            "    }\n" +
            "}"
        },
        {
            code:
            "switch (a) {\n" +
            "case \"foo\":\n" +
            "    a();\n" +
            "    break;\n" +
            "case \"bar\":\n" +
            "    if(x){\n" +
            "        a = 2;\n" +
            "    }\n" +
            "    else{\n" +
            "        a = 6;\n" +
            "    }\n" +
            "}"
        },
        {
            code:
            "switch (a) {\n" +
            "case \"foo\":\n" +
            "    a();\n" +
            "    break;\n" +
            "case \"bar\":\n" +
            "    if(x){\n" +
            "        a = 2;\n" +
            "    }\n" +
            "    else\n" +
            "        a = 6;\n" +
            "}"
        },
        {
            code:
            "switch (a) {\n" +
            "case \"foo\":\n" +
            "    a();\n" +
            "    break;\n" +
            "case \"bar\":\n" +
            "    a(); break;\n" +
            "case \"baz\":\n" +
            "    a(); break;\n" +
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
            "    case \"a\":\n" +
            "        return \"A\";\n" +
            "    case \"b\":\n" +
            "        return \"B\";\n" +
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
            "        break;\n" +
            "    default:\n" +
            "        a();\n" +
            "        break;\n" +
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
            options: [4, {indentSwitchCase: true}]
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
            code: "import {addons} from 'react/addons'\nimport React from 'react'",
            options: [2],
            ecmaFeatures: {
                modules: true
            }
        },
        {
            code:
            "var a = 1,\n" +
            "    b = 2,\n" +
            "    c = 3;\n",
            options: [4]
        },
        {
            code:
            "var a = 1\n" +
            "   ,b = 2\n" +
            "   ,c = 3;\n",
            options: [4]
        },
        {
            code: "while (1 < 2) console.log('hi')\n",
            options: [2]
        },
        {
            code:
                "function salutation () {\n" +
                "  switch (1) {\n" +
                "    case 0: return console.log('hi')\n" +
                "    case 1: return console.log('hey')\n" +
                "  }\n" +
                "}\n",
            options: [2, { indentSwitchCase: true }]
        }
    ],
    invalid: [
        {
            code:
                "var a = b;\n" +
                "if (a) {\n" +
                "b();\n" +
                "}\n",
            options: [2],
            errors: expectedErrors([[3, 2, "ExpressionStatement"]])
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
            errors: expectedErrors([[4, 2, "ExpressionStatement"], [6, 2, "ExpressionStatement"]])
        },
        {
            code: "if (a){\n\tb=c;\n\t\tc=d;\ne=f;\n}",
            options: ["tab"],
            errors: expectedErrors([[3, 1, "ExpressionStatement"], [4, 1, "ExpressionStatement"]])
        },
        {
            code: "if (a){\n    b=c;\n      c=d;\n e=f;\n}",
            options: [4],
            errors: expectedErrors([[3, 4, "ExpressionStatement"], [4, 4, "ExpressionStatement"]])
        },
        {
            code: fixture,
            options: [2, {indentSwitchCase: true}],
            errors: expectedErrors([
                [5, 2, "VariableDeclaration"],
                [10, 4, "BlockStatement"],
                [11, 2, "BlockStatement"],
                [15, 4, "ExpressionStatement"],
                [16, 2, "BlockStatement"],
                [23, 2, "BlockStatement"],
                [29, 2, "ForStatement"],
                [31, 4, "BlockStatement"],
                [36, 4, "ExpressionStatement"],
                [38, 2, "BlockStatement"],
                [39, 4, "ExpressionStatement"],
                [40, 2, "BlockStatement"],
                [46, 0, "VariableDeclaration"],
                [54, 2, "BlockStatement"],
                [114, 4, "VariableDeclaration"],
                [120, 4, "VariableDeclaration"],
                [124, 4, "BreakStatement"],
                [128, 4, "BlockStatement"],
                [134, 4, "BreakStatement"],
                [143, 4, "ExpressionStatement"],
                [151, 4, "ExpressionStatement"],
                [159, 4, "ExpressionStatement"],
                [161, 4, "ExpressionStatement"],
                [175, 2, "ExpressionStatement"],
                [177, 2, "ExpressionStatement"],
                [189, 2, "VariableDeclaration"],
                [193, 6, "ExpressionStatement"],
                [195, 6, "ExpressionStatement"],
                [197, 2, "VariableDeclaration"],
                [305, 6, "ExpressionStatement"],
                [306, 6, "ExpressionStatement"],
                [308, 2, "VariableDeclarator"],
                [311, 2, "Identifier"],
                [312, 2, "Identifier"],
                [313, 2, "Identifier"],
                [314, 0, "ArrayExpression"],
                [315, 2, "VariableDeclarator"],
                [318, 2, "Property"],
                [319, 2, "Property"],
                [320, 2, "Property"],
                [321, 0, "ObjectExpression"],
                [322, 2, "VariableDeclarator"],
                [326, 2, "Literal"],
                [327, 2, "Literal"],
                [328, 2, "Literal"],
                [329, 2, "Literal"],
                [330, 2, "Literal"],
                [331, 2, "Literal"],
                [332, 2, "Literal"],
                [333, 2, "Literal"],
                [334, 2, "Literal"],
                [335, 2, "Literal"],
                [340, 2, "ExpressionStatement"],
                [341, 2, "ExpressionStatement"],
                [344, 2, "ExpressionStatement"],
                [345, 2, "ExpressionStatement"],
                [348, 2, "ExpressionStatement"],
                [349, 2, "ExpressionStatement"],
                [355, 2, "ExpressionStatement"],
                [357, 2, "ExpressionStatement"],
                [363, 2, "VariableDeclarator"],
                [368, 2, "SwitchCase"],
                [370, 2, "SwitchCase"],
                [374, 4, "VariableDeclaration"],
                [376, 4, "VariableDeclaration"],
                [383, 2, "ExpressionStatement"],
                [385, 2, "ExpressionStatement"],
                [390, 2, "ExpressionStatement"],
                [392, 2, "ExpressionStatement"],
                [409, 2, "ExpressionStatement"],
                [410, 2, "ExpressionStatement"],
                [416, 2, "ExpressionStatement"],
                [417, 2, "ExpressionStatement"],
                [422, 2, "ExpressionStatement"],
                [423, 2, "ExpressionStatement"],
                [428, 6, "ExpressionStatement"],
                [429, 6, "ExpressionStatement"],
                [434, 2, "BlockStatement"],
                [437, 2, "ExpressionStatement"],
                [438, 0, "BlockStatement"],
                [451, 2, "ExpressionStatement"],
                [453, 2, "ExpressionStatement"],
                [499, 6, "BlockStatement"],
                [500, 10, "ExpressionStatement"],
                [501, 8, "BlockStatement"],
                [506, 6, "BlockStatement"]
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
            errors: expectedErrors([[4, 8, "BreakStatement"], [7, 8, "BreakStatement"]])
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
            errors: expectedErrors([9, 8, "BreakStatement"])
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
            errors: expectedErrors([[11, 8, "BreakStatement"], [14, 8, "BreakStatement"], [17, 8, "BreakStatement"]])
        },
        {
            code:
                "switch(value){\n" +
                "case \"1\":\n" +
                "        a();\n" +
                "        break;\n" +
                "    case \"2\":\n" +
                "        break;\n" +
                "    default:\n" +
                "        break;\n" +
                "}",
            options: [4],
            errors: expectedErrors([
                [3, 4, "ExpressionStatement"],
                [4, 4, "BreakStatement"],
                [5, 0, "SwitchCase"],
                [6, 4, "BreakStatement"],
                [7, 0, "SwitchCase"],
                [8, 4, "BreakStatement"]
            ])
        },
        {
            code:
                "var obj = {foo: 1, bar: 2};\n" +
                "with (obj) {\n" +
                "console.log(foo + bar);\n" +
                "}\n",
            args: [2],
            errors: expectedErrors([3, 4, "ExpressionStatement"])
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
                "}\n",
            options: [4, {indentSwitchCase: true}],
            errors: expectedErrors([
                [2, 4, "SwitchCase"],
                [3, 8, "ExpressionStatement"],
                [4, 8, "BreakStatement"],
                [5, 4, "SwitchCase"],
                [6, 8, "ExpressionStatement"],
                [7, 8, "BreakStatement"]
            ])
        },
        {
            code:
                "while (a) \n" +
                "b();",
            options: [4],
            errors: expectedErrors([
                [2, 4, "ExpressionStatement"]
            ])
        },
        {
            code:
            "for (;;) \n" +
            "b();",
            options: [4],
            errors: expectedErrors([
                [2, 4, "ExpressionStatement"]
            ])
        },
        {
            code:
            "for (a in x) \n" +
            "b();",
            options: [4],
            errors: expectedErrors([
                [2, 4, "ExpressionStatement"]
            ])
        },
        {
            code:
            "do \n" +
            "b();\n" +
            "while(true)",
            options: [4],
            errors: expectedErrors([
                [2, 4, "ExpressionStatement"]
            ])
        },
        {
            code:
            "if(true) \n" +
            "b();",
            options: [4],
            errors: expectedErrors([
                [2, 4, "ExpressionStatement"]
            ])
        },
        {
            code:
            "var test = {\n" +
            "      a: 1,\n" +
            "    b: 2\n" +
            "    };\n",
            options: [2],
            errors: expectedErrors([
                [2, 2, "Property"],
                [3, 2, "Property"],
                [4, 0, "ObjectExpression"]
            ])
        },
        {
            code:
            "var a = function() {\n" +
            "      a++;\n" +
            "    b++;\n" +
            "          c++;\n" +
            "    },\n" +
            "    b;\n",
            options: [4],
            errors: expectedErrors([
                [2, 8, "ExpressionStatement"],
                [3, 8, "ExpressionStatement"],
                [4, 8, "ExpressionStatement"]
            ])
        },
        {
            code:
            "var a = 1,\n" +
            "b = 2,\n" +
            "c = 3;\n",
            options: [4],
            errors: expectedErrors([
                [2, 4, "VariableDeclarator"],
                [3, 4, "VariableDeclarator"]
            ])
        },
        {
            code:
            "[a, b, \nc].forEach((index) => {\n" +
            "  index;\n" +
            "});\n",
            options: [4],
            ecmaFeatures: { arrowFunctions: true },
            errors: expectedErrors([
                [3, 4, "ExpressionStatement"]
            ])
        },
        {
            code:
            "[a, b, \nc].forEach(function(index){\n" +
            "  return index;\n" +
            "});\n",
            options: [4],
            ecmaFeatures: { arrowFunctions: true },
            errors: expectedErrors([
                [3, 4, "ReturnStatement"]
            ])
        },
        {
            code:
            "[a, b, c].forEach((index) => {\n" +
            "  index;\n" +
            "});\n",
            options: [4],
            ecmaFeatures: { arrowFunctions: true },
            errors: expectedErrors([
                [2, 4, "ExpressionStatement"]
            ])
        },
        {
            code:
            "[a, b, c].forEach(function(index){\n" +
            "  return index;\n" +
            "});\n",
            options: [4],
            ecmaFeatures: { arrowFunctions: true },
            errors: expectedErrors([
                [2, 4, "ReturnStatement"]
            ])
        },
        {
            code: "while (1 < 2)\nconsole.log('foo')\n  console.log('bar')",
            options: [2],
            errors: expectedErrors([
                [2, 2, "ExpressionStatement"],
                [3, 0, "ExpressionStatement"]
            ])
        },
        {
            code:
            "function salutation () {\n" +
            "  switch (1) {\n" +
            "  case 0: return console.log('hi')\n" +
            "    case 1: return console.log('hey')\n" +
            "  }\n" +
            "}\n",
            options: [2, { indentSwitchCase: true }],
            errors: expectedErrors([
                [3, 4, "SwitchCase"]
            ])
        },
        {
            code:
            "var geometry, box, face1, face2, colorT, colorB, sprite, padding, maxWidth,\n" +
            "height, rotate;",
            options: [2, {"indentSwitchCase": true}],
            errors: expectedErrors([
                [2, 2, "VariableDeclarator"]
            ])
        }
    ]
});
