/**
 * @fileoverview Tests for `no-restricted-syntax` rule
 * @author Burak Yigit Kaya
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-restricted-syntax"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-restricted-syntax", rule, {
    valid: [

        // string format
        "doSomething();",
        { code: "var foo = 42;", options: ["ConditionalExpression"] },
        { code: "foo += 42;", options: ["VariableDeclaration", "FunctionExpression"] },
        { code: "foo;", options: ["Identifier[name=\"bar\"]"] },
        { code: "() => 5", options: ["ArrowFunctionExpression > BlockStatement"], parserOptions: { ecmaVersion: 6 } },
        { code: "({ foo: 1, bar: 2 })", options: ["Property > Literal.key"] },
        { code: "A: for (;;) break;", options: ["BreakStatement[label]"] },
        { code: "function foo(bar, baz) {}", options: ["FunctionDeclaration[params.length>2]"] },

        //  object format
        { code: "var foo = 42;", options: [{ selector: "ConditionalExpression" }] },
        { code: "({ foo: 1, bar: 2 })", options: [{ selector: "Property > Literal.key" }] },
        {
            code: "({ foo: 1, bar: 2 })",
            options: [{ selector: "FunctionDeclaration[params.length>2]", message: "custom error message." }]
        },

        // https://github.com/eslint/eslint/issues/8733
        { code: "console.log(/a/);", options: ["Literal[regex.flags=/./]"] }
    ],
    invalid: [

        // string format
        {
            code: "var foo = 41;",
            options: ["VariableDeclaration"],
            errors: [{ message: "Using 'VariableDeclaration' is not allowed.", type: "VariableDeclaration" }]
        },
        {
            code: ";function lol(a) { return 42; }",
            options: ["EmptyStatement"],
            errors: [{ message: "Using 'EmptyStatement' is not allowed.", type: "EmptyStatement" }]
        },
        {
            code: "try { voila(); } catch (e) { oops(); }",
            options: ["TryStatement", "CallExpression", "CatchClause"],
            errors: [
                { message: "Using 'TryStatement' is not allowed.", type: "TryStatement" },
                { message: "Using 'CallExpression' is not allowed.", type: "CallExpression" },
                { message: "Using 'CatchClause' is not allowed.", type: "CatchClause" },
                { message: "Using 'CallExpression' is not allowed.", type: "CallExpression" }
            ]
        },
        {
            code: "bar;",
            options: ["Identifier[name=\"bar\"]"],
            errors: [{ message: "Using 'Identifier[name=\"bar\"]' is not allowed.", type: "Identifier" }]
        },
        {
            code: "bar;",
            options: ["Identifier", "Identifier[name=\"bar\"]"],
            errors: [
                { message: "Using 'Identifier' is not allowed.", type: "Identifier" },
                { message: "Using 'Identifier[name=\"bar\"]' is not allowed.", type: "Identifier" }
            ]
        },
        {
            code: "() => {}",
            options: ["ArrowFunctionExpression > BlockStatement"],
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "Using 'ArrowFunctionExpression > BlockStatement' is not allowed.", type: "BlockStatement" }]
        },
        {
            code: "({ foo: 1, 'bar': 2 })",
            options: ["Property > Literal.key"],
            errors: [{ message: "Using 'Property > Literal.key' is not allowed.", type: "Literal" }]
        },
        {
            code: "A: for (;;) break A;",
            options: ["BreakStatement[label]"],
            errors: [{ message: "Using 'BreakStatement[label]' is not allowed.", type: "BreakStatement" }]
        },
        {
            code: "function foo(bar, baz, qux) {}",
            options: ["FunctionDeclaration[params.length>2]"],
            errors: [{ message: "Using 'FunctionDeclaration[params.length>2]' is not allowed.", type: "FunctionDeclaration" }]
        },

        // object format
        {
            code: "var foo = 41;",
            options: [{ selector: "VariableDeclaration" }],
            errors: [{ message: "Using 'VariableDeclaration' is not allowed.", type: "VariableDeclaration" }]
        },
        {
            code: "function foo(bar, baz, qux) {}",
            options: [{ selector: "FunctionDeclaration[params.length>2]" }],
            errors: [{ message: "Using 'FunctionDeclaration[params.length>2]' is not allowed.", type: "FunctionDeclaration" }]
        },
        {
            code: "function foo(bar, baz, qux) {}",
            options: [{ selector: "FunctionDeclaration[params.length>2]", message: "custom error message." }],
            errors: [{ message: "custom error message.", type: "FunctionDeclaration" }]
        },

        // with object format, the custom message may contain the string '{{selector}}'
        {
            code: "function foo(bar, baz, qux) {}",
            options: [{ selector: "FunctionDeclaration[params.length>2]", message: "custom message with {{selector}}" }],
            errors: [{ message: "custom message with {{selector}}", type: "FunctionDeclaration" }]
        },

        // https://github.com/eslint/eslint/issues/8733
        {
            code: "console.log(/a/i);",
            options: ["Literal[regex.flags=/./]"],
            errors: [{ message: "Using 'Literal[regex.flags=/./]' is not allowed.", type: "Literal" }]
        }
    ]
});
