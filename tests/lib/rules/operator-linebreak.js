/**
 * @fileoverview Operator linebreak rule tests
 * @author Benoît Zugmeyer
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/operator-linebreak"),
    { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("operator-linebreak", rule, {

    valid: [
        "1 + 1",
        "1 + 1 + 1",
        "1 +\n1",
        "1 + (1 +\n1)",
        "f(1 +\n1)",
        "1 || 1",
        "1 || \n1",
        "a += 1",
        "var a;",
        "var o = \nsomething",
        "o = \nsomething",
        "'a\\\n' +\n 'c'",
        "'a' +\n 'b\\\n'",
        "(a\n) + b",
        "answer = everything \n?  42 \n:  foo;",
        { code: "answer = everything ?\n  42 :\n  foo;", options: ["after"] },

        { code: "a ? 1 + 1\n:2", options: [null, { overrides: { "?": "after" } }] },
        { code: "a ?\n1 +\n 1\n:2", options: [null, { overrides: { "?": "after" } }] },
        { code: "o = 1 \n+ 1 - foo", options: [null, { overrides: { "+": "before" } }] },

        { code: "1\n+ 1", options: ["before"] },
        { code: "1 + 1\n+ 1", options: ["before"] },
        { code: "f(1\n+ 1)", options: ["before"] },
        { code: "1 \n|| 1", options: ["before"] },
        { code: "a += 1", options: ["before"] },
        { code: "answer = everything \n?  42 \n:  foo;", options: ["before"] },

        { code: "1 + 1", options: ["none"] },
        { code: "1 + 1 + 1", options: ["none"] },
        { code: "1 || 1", options: ["none"] },
        { code: "a += 1", options: ["none"] },
        { code: "var a;", options: ["none"] },
        { code: "\n1 + 1", options: ["none"] },
        { code: "1 + 1\n", options: ["none"] },
        { code: "answer = everything ? 42 : foo;", options: ["none"] },
        { code: "(a\n) + (\nb)", options: ["none"] },
        { code: "answer = everything \n?\n 42 : foo;", options: [null, { overrides: { "?": "ignore" } }] },
        { code: "answer = everything ? 42 \n:\n foo;", options: [null, { overrides: { ":": "ignore" } }] },

        {
            code: "a \n &&= b",
            options: ["after", { overrides: { "&&=": "ignore" } }],
            parserOptions: { ecmaVersion: 2021 }
        },
        {
            code: "a ??= \n b",
            options: ["before", { overrides: { "??=": "ignore" } }],
            parserOptions: { ecmaVersion: 2021 }
        },
        {
            code: "a ||= \n b",
            options: ["after", { overrides: { "=": "before" } }],
            parserOptions: { ecmaVersion: 2021 }
        },
        {
            code: "a \n &&= b",
            options: ["before", { overrides: { "&=": "after" } }],
            parserOptions: { ecmaVersion: 2021 }
        },
        {
            code: "a \n ||= b",
            options: ["before", { overrides: { "|=": "after" } }],
            parserOptions: { ecmaVersion: 2021 }
        },
        {
            code: "a &&= \n b",
            options: ["after", { overrides: { "&&": "before" } }],
            parserOptions: { ecmaVersion: 2021 }
        },
        {
            code: "a ||= \n b",
            options: ["after", { overrides: { "||": "before" } }],
            parserOptions: { ecmaVersion: 2021 }
        },
        {
            code: "a ??= \n b",
            options: ["after", { overrides: { "??": "before" } }],
            parserOptions: { ecmaVersion: 2021 }
        },

        // class fields
        {
            code: "class C { foo =\n0 }",
            parserOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C { foo\n= 0 }",
            options: ["before"],
            parserOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C { [foo\n]= 0 }",
            options: ["before"],
            parserOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C { [foo]\n= 0 }",
            options: ["before"],
            parserOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C { [foo\n]\n= 0 }",
            options: ["before"],
            parserOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C { [foo\n]= 0 }",
            options: ["after"],
            parserOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C { [foo\n]=\n0 }",
            options: ["after"],
            parserOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C { [foo\n]= 0 }",
            options: ["none"],
            parserOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C { foo\n=\n0 }",
            options: ["none", { overrides: { "=": "ignore" } }],
            parserOptions: { ecmaVersion: 2022 }
        }
    ],

    invalid: [
        {
            code: "1\n+ 1",
            output: "1 +\n1",
            errors: [{
                messageId: "operatorAtEnd",
                data: { operator: "+" },
                type: "BinaryExpression",
                line: 2,
                column: 1,
                endLine: 2,
                endColumn: 2
            }]
        },
        {
            code: "1 + 2 \n + 3",
            output: "1 + 2 + \n 3",
            errors: [{
                messageId: "operatorAtEnd",
                data: { operator: "+" },
                type: "BinaryExpression",
                line: 2,
                column: 2,
                endLine: 2,
                endColumn: 3
            }]
        },
        {
            code: "1\n+\n1",
            output: "1+\n1",
            errors: [{
                messageId: "badLinebreak",
                data: { operator: "+" },
                type: "BinaryExpression",
                line: 2,
                column: 1,
                endLine: 2,
                endColumn: 2
            }]
        },
        {
            code: "1 + (1\n+ 1)",
            output: "1 + (1 +\n1)",
            errors: [{
                messageId: "operatorAtEnd",
                data: { operator: "+" },
                type: "BinaryExpression",
                line: 2,
                column: 1,
                endLine: 2,
                endColumn: 2
            }]
        },
        {
            code: "f(1\n+ 1);",
            output: "f(1 +\n1);",
            errors: [{
                messageId: "operatorAtEnd",
                data: { operator: "+" },
                type: "BinaryExpression",
                line: 2,
                column: 1,
                endLine: 2,
                endColumn: 2
            }]
        },
        {
            code: "1 \n || 1",
            output: "1 || \n 1",
            errors: [{
                messageId: "operatorAtEnd",
                data: { operator: "||" },
                type: "LogicalExpression",
                line: 2,
                column: 2,
                endLine: 2,
                endColumn: 4
            }]
        },
        {
            code: "a\n += 1",
            output: "a +=\n 1",
            errors: [{
                messageId: "operatorAtEnd",
                data: { operator: "+=" },
                type: "AssignmentExpression",
                line: 2,
                column: 2,
                endLine: 2,
                endColumn: 4
            }]
        },
        {
            code: "var a\n = 1",
            output: "var a =\n 1",
            errors: [{
                messageId: "operatorAtEnd",
                data: { operator: "=" },
                type: "VariableDeclarator",
                line: 2,
                column: 2,
                endLine: 2,
                endColumn: 3
            }]
        },
        {
            code: "(b)\n*\n(c)",
            output: "(b)*\n(c)",
            errors: [{
                messageId: "badLinebreak",
                data: { operator: "*" },
                type: "BinaryExpression",
                line: 2,
                column: 1,
                endLine: 2,
                endColumn: 2
            }]
        },
        {
            code: "answer = everything ?\n  42 :\n  foo;",
            output: "answer = everything\n  ? 42\n  : foo;",
            errors: [{
                messageId: "operatorAtBeginning",
                data: { operator: "?" },
                type: "ConditionalExpression",
                line: 1,
                column: 21,
                endLine: 1,
                endColumn: 22
            },
            {
                messageId: "operatorAtBeginning",
                data: { operator: ":" },
                type: "ConditionalExpression",
                line: 2,
                column: 6,
                endLine: 2,
                endColumn: 7
            }]
        },

        {
            code: "answer = everything \n?  42 \n:  foo;",
            output: "answer = everything  ? \n42  : \nfoo;",
            options: ["after"],
            errors: [{
                messageId: "operatorAtEnd",
                data: { operator: "?" },
                type: "ConditionalExpression",
                line: 2,
                column: 1,
                endLine: 2,
                endColumn: 2
            },
            {
                messageId: "operatorAtEnd",
                data: { operator: ":" },
                type: "ConditionalExpression",
                line: 3,
                column: 1,
                endLine: 3,
                endColumn: 2
            }]
        },

        {
            code: "1 +\n1",
            output: "1\n+ 1",
            options: ["before"],
            errors: [{
                messageId: "operatorAtBeginning",
                data: { operator: "+" },
                type: "BinaryExpression",
                line: 1,
                column: 3,
                endLine: 1,
                endColumn: 4
            }]
        },
        {
            code: "f(1 +\n1);",
            output: "f(1\n+ 1);",
            options: ["before"],
            errors: [{
                messageId: "operatorAtBeginning",
                data: { operator: "+" },
                type: "BinaryExpression",
                line: 1,
                column: 5,
                endLine: 1,
                endColumn: 6
            }]
        },
        {
            code: "1 || \n 1",
            output: "1 \n || 1",
            options: ["before"],
            errors: [{
                messageId: "operatorAtBeginning",
                data: { operator: "||" },
                type: "LogicalExpression",
                line: 1,
                column: 3,
                endLine: 1,
                endColumn: 5
            }]
        },
        {
            code: "a += \n1",
            output: "a \n+= 1",
            options: ["before"],
            errors: [{
                messageId: "operatorAtBeginning",
                data: { operator: "+=" },
                type: "AssignmentExpression",
                line: 1,
                column: 3,
                endLine: 1,
                endColumn: 5
            }]
        },
        {
            code: "var a = \n1",
            output: "var a \n= 1",
            options: ["before"],
            errors: [{
                messageId: "operatorAtBeginning",
                data: { operator: "=" },
                type: "VariableDeclarator",
                line: 1,
                column: 7,
                endLine: 1,
                endColumn: 8
            }]
        },
        {
            code: "answer = everything ?\n  42 :\n  foo;",
            output: "answer = everything\n  ? 42\n  : foo;",
            options: ["before"],
            errors: [{
                messageId: "operatorAtBeginning",
                data: { operator: "?" },
                type: "ConditionalExpression",
                line: 1,
                column: 21,
                endLine: 1,
                endColumn: 22
            },
            {
                messageId: "operatorAtBeginning",
                data: { operator: ":" },
                type: "ConditionalExpression",
                line: 2,
                column: 6,
                endLine: 2,
                endColumn: 7
            }]
        },

        {
            code: "1 +\n1",
            output: "1 +1",
            options: ["none"],
            errors: [{
                messageId: "noLinebreak",
                data: { operator: "+" },
                type: "BinaryExpression",
                line: 1,
                column: 3,
                endLine: 1,
                endColumn: 4
            }]
        },
        {
            code: "1\n+1",
            output: "1+1",
            options: ["none"],
            errors: [{
                messageId: "noLinebreak",
                data: { operator: "+" },
                type: "BinaryExpression",
                line: 2,
                column: 1,
                endLine: 2,
                endColumn: 2
            }]
        },
        {
            code: "f(1 +\n1);",
            output: "f(1 +1);",
            options: ["none"],
            errors: [{
                messageId: "noLinebreak",
                data: { operator: "+" },
                type: "BinaryExpression",
                line: 1,
                column: 5,
                endLine: 1,
                endColumn: 6
            }]
        },
        {
            code: "f(1\n+ 1);",
            output: "f(1+ 1);",
            options: ["none"],
            errors: [{
                messageId: "noLinebreak",
                data: { operator: "+" },
                type: "BinaryExpression",
                line: 2,
                column: 1,
                endLine: 2,
                endColumn: 2
            }]
        },
        {
            code: "1 || \n 1",
            output: "1 ||  1",
            options: ["none"],
            errors: [{
                messageId: "noLinebreak",
                data: { operator: "||" },
                type: "LogicalExpression",
                line: 1,
                column: 3,
                endLine: 1,
                endColumn: 5
            }]
        },
        {
            code: "1 \n || 1",
            output: "1  || 1",
            options: ["none"],
            errors: [{
                messageId: "noLinebreak",
                data: { operator: "||" },
                type: "LogicalExpression",
                line: 2,
                column: 2,
                endLine: 2,
                endColumn: 4
            }]
        },
        {
            code: "a += \n1",
            output: "a += 1",
            options: ["none"],
            errors: [{
                messageId: "noLinebreak",
                data: { operator: "+=" },
                type: "AssignmentExpression",
                line: 1,
                column: 3,
                endLine: 1,
                endColumn: 5
            }]
        },
        {
            code: "a \n+= 1",
            output: "a += 1",
            options: ["none"],
            errors: [{
                messageId: "noLinebreak",
                data: { operator: "+=" },
                type: "AssignmentExpression",
                line: 2,
                column: 1,
                endLine: 2,
                endColumn: 3
            }]
        },
        {
            code: "var a = \n1",
            output: "var a = 1",
            options: ["none"],
            errors: [{
                messageId: "noLinebreak",
                data: { operator: "=" },
                type: "VariableDeclarator",
                line: 1,
                column: 7,
                endLine: 1,
                endColumn: 8
            }]
        },
        {
            code: "var a \n = 1",
            output: "var a  = 1",
            options: ["none"],
            errors: [{
                messageId: "noLinebreak",
                data: { operator: "=" },
                type: "VariableDeclarator",
                line: 2,
                column: 2,
                endLine: 2,
                endColumn: 3
            }]
        },
        {
            code: "answer = everything ?\n  42 \n:  foo;",
            output: "answer = everything ?  42 :  foo;",
            options: ["none"],
            errors: [{
                messageId: "noLinebreak",
                data: { operator: "?" },
                type: "ConditionalExpression",
                line: 1,
                column: 21,
                endLine: 1,
                endColumn: 22
            },
            {
                messageId: "noLinebreak",
                data: { operator: ":" },
                type: "ConditionalExpression",
                line: 3,
                column: 1,
                endLine: 3,
                endColumn: 2
            }]
        },
        {
            code: "answer = everything\n?\n42 + 43\n:\nfoo;",
            output: "answer = everything?42 + 43:foo;",
            options: ["none"],
            errors: [{
                messageId: "badLinebreak",
                data: { operator: "?" },
                type: "ConditionalExpression",
                line: 2,
                column: 1,
                endLine: 2,
                endColumn: 2
            },
            {
                messageId: "badLinebreak",
                data: { operator: ":" },
                type: "ConditionalExpression",
                line: 4,
                column: 1,
                endLine: 4,
                endColumn: 2
            }]
        },
        {
            code: "a = b \n  >>> \n c;",
            output: "a = b   >>> \n c;",
            errors: [{
                messageId: "badLinebreak",
                data: { operator: ">>>" },
                type: "BinaryExpression",
                line: 2,
                column: 3,
                endLine: 2,
                endColumn: 6
            }]
        },
        {
            code: "foo +=\n42;\nbar -=\n12\n+ 5;",
            output: "foo +=42;\nbar -=\n12\n+ 5;",
            options: ["after", { overrides: { "+=": "none", "+": "before" } }],
            errors: [{
                messageId: "noLinebreak",
                data: { operator: "+=" },
                type: "AssignmentExpression",
                line: 1,
                column: 5,
                endLine: 1,
                endColumn: 7
            }]
        },
        {
            code: "answer = everything\n?\n42\n:\nfoo;",
            output: "answer = everything\n?\n42\n:foo;",
            options: ["after", { overrides: { "?": "ignore", ":": "before" } }],
            errors: [{
                messageId: "badLinebreak",
                data: { operator: ":" },
                type: "ConditionalExpression",
                line: 4,
                column: 1,
                endLine: 4,
                endColumn: 2
            }]
        },
        {

            // Insert an additional space to avoid changing the operator to ++ or --.
            code: "foo+\n+bar",
            output: "foo\n+ +bar",
            options: ["before"],
            errors: [{
                messageId: "operatorAtBeginning",
                data: { operator: "+" },
                type: "BinaryExpression",
                line: 1,
                column: 4,
                endLine: 1,
                endColumn: 5
            }]
        },
        {
            code: "foo //comment\n&& bar",
            output: "foo && //comment\nbar",
            errors: [{
                messageId: "operatorAtEnd",
                data: { operator: "&&" },
                type: "LogicalExpression",
                line: 2,
                column: 1,
                endLine: 2,
                endColumn: 3
            }]
        },
        {
            code: "foo//comment\n+\nbar",
            output: null,
            errors: [{
                messageId: "badLinebreak",
                data: { operator: "+" },
                type: "BinaryExpression",
                line: 2,
                column: 1,
                endLine: 2,
                endColumn: 2
            }]
        },
        {
            code: "foo\n+//comment\nbar",
            output: null,
            options: ["before"],
            errors: [{
                messageId: "badLinebreak",
                data: { operator: "+" },
                type: "BinaryExpression",
                line: 2,
                column: 1,
                endLine: 2,
                endColumn: 2
            }]
        },
        {
            code: "foo /* a */ \n+ /* b */ bar",
            output: null, // Not fixed because there is a comment on both sides
            errors: [{
                messageId: "operatorAtEnd",
                data: { operator: "+" },
                type: "BinaryExpression",
                line: 2,
                column: 1,
                endLine: 2,
                endColumn: 2
            }]
        },
        {
            code: "foo /* a */ +\n /* b */ bar",
            output: null, // Not fixed because there is a comment on both sides
            options: ["before"],
            errors: [{
                messageId: "operatorAtBeginning",
                data: { operator: "+" },
                type: "BinaryExpression",
                line: 1,
                column: 13,
                endLine: 1,
                endColumn: 14
            }]
        },
        {
            code: "foo ??\n bar",
            output: "foo\n ?? bar",
            options: ["after", { overrides: { "??": "before" } }],
            parserOptions: { ecmaVersion: 2020 },
            errors: [{
                messageId: "operatorAtBeginning",
                data: { operator: "??" }
            }]
        },

        {
            code: "a \n  &&= b",
            output: "a &&= \n  b",
            options: ["after"],
            parserOptions: { ecmaVersion: 2021 },
            errors: [{
                messageId: "operatorAtEnd",
                data: { operator: "&&=" },
                type: "AssignmentExpression",
                line: 2,
                column: 3,
                endLine: 2,
                endColumn: 6
            }]
        },
        {
            code: "a ||=\n b",
            output: "a\n ||= b",
            options: ["before"],
            parserOptions: { ecmaVersion: 2021 },
            errors: [{
                messageId: "operatorAtBeginning",
                data: { operator: "||=" },
                type: "AssignmentExpression",
                line: 1,
                column: 3,
                endLine: 1,
                endColumn: 6
            }]
        },
        {
            code: "a  ??=\n b",
            output: "a  ??= b",
            options: ["none"],
            parserOptions: { ecmaVersion: 2021 },
            errors: [{
                messageId: "noLinebreak",
                data: { operator: "??=" },
                type: "AssignmentExpression",
                line: 1,
                column: 4,
                endLine: 1,
                endColumn: 7
            }]
        },
        {
            code: "a \n  &&= b",
            output: "a   &&= b",
            options: ["before", { overrides: { "&&=": "none" } }],
            parserOptions: { ecmaVersion: 2021 },
            errors: [{
                messageId: "noLinebreak",
                data: { operator: "&&=" },
                type: "AssignmentExpression",
                line: 2,
                column: 3,
                endLine: 2,
                endColumn: 6
            }]
        },
        {
            code: "a ||=\nb",
            output: "a\n||= b",
            options: ["after", { overrides: { "||=": "before" } }],
            parserOptions: { ecmaVersion: 2021 },
            errors: [{
                messageId: "operatorAtBeginning",
                data: { operator: "||=" },
                type: "AssignmentExpression",
                line: 1,
                column: 3,
                endLine: 1,
                endColumn: 6
            }]
        },
        {
            code: "a\n??=b",
            output: "a??=\nb",
            options: ["none", { overrides: { "??=": "after" } }],
            parserOptions: { ecmaVersion: 2021 },
            errors: [{
                messageId: "operatorAtEnd",
                data: { operator: "??=" },
                type: "AssignmentExpression",
                line: 2,
                column: 1,
                endLine: 2,
                endColumn: 4
            }]
        },

        // class fields
        {
            code: "class C { a\n= 0; }",
            output: "class C { a =\n0; }",
            options: ["after"],
            parserOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "operatorAtEnd",
                data: { operator: "=" },
                type: "PropertyDefinition",
                line: 2,
                column: 1,
                endLine: 2,
                endColumn: 2
            }]
        },
        {
            code: "class C { a =\n0; }",
            output: "class C { a\n= 0; }",
            options: ["before"],
            parserOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "operatorAtBeginning",
                data: { operator: "=" },
                type: "PropertyDefinition",
                line: 1,
                column: 13,
                endLine: 1,
                endColumn: 14
            }]
        },
        {
            code: "class C { a =\n0; }",
            output: "class C { a =0; }",
            options: ["none"],
            parserOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "noLinebreak",
                data: { operator: "=" },
                type: "PropertyDefinition",
                line: 1,
                column: 13,
                endLine: 1,
                endColumn: 14
            }]
        },
        {
            code: "class C { [a]\n= 0; }",
            output: "class C { [a] =\n0; }",
            options: ["after"],
            parserOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "operatorAtEnd",
                data: { operator: "=" },
                type: "PropertyDefinition",
                line: 2,
                column: 1,
                endLine: 2,
                endColumn: 2
            }]
        },
        {
            code: "class C { [a] =\n0; }",
            output: "class C { [a]\n= 0; }",
            options: ["before"],
            parserOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "operatorAtBeginning",
                data: { operator: "=" },
                type: "PropertyDefinition",
                line: 1,
                column: 15,
                endLine: 1,
                endColumn: 16
            }]
        },
        {
            code: "class C { [a]\n =0; }",
            output: "class C { [a] =0; }",
            options: ["none"],
            parserOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "noLinebreak",
                data: { operator: "=" },
                type: "PropertyDefinition",
                line: 2,
                column: 2,
                endLine: 2,
                endColumn: 3
            }]
        }
    ]
});
