/**
 * @fileoverview Tests for `no-restricted-syntax` rule
 * @author Burak Yigit Kaya
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-restricted-syntax"),
    { RuleTester } = require("../../../lib/rule-tester");

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
            errors: [{ messageId: "restrictedSyntax", data: { message: "Using 'VariableDeclaration' is not allowed." }, type: "VariableDeclaration" }]
        },
        {
            code: ";function lol(a) { return 42; }",
            options: ["EmptyStatement"],
            errors: [{ messageId: "restrictedSyntax", data: { message: "Using 'EmptyStatement' is not allowed." }, type: "EmptyStatement" }]
        },
        {
            code: "try { voila(); } catch (e) { oops(); }",
            options: ["TryStatement", "CallExpression", "CatchClause"],
            errors: [
                { messageId: "restrictedSyntax", data: { message: "Using 'TryStatement' is not allowed." }, type: "TryStatement" },
                { messageId: "restrictedSyntax", data: { message: "Using 'CallExpression' is not allowed." }, type: "CallExpression" },
                { messageId: "restrictedSyntax", data: { message: "Using 'CatchClause' is not allowed." }, type: "CatchClause" },
                { messageId: "restrictedSyntax", data: { message: "Using 'CallExpression' is not allowed." }, type: "CallExpression" }
            ]
        },
        {
            code: "bar;",
            options: ["Identifier[name=\"bar\"]"],
            errors: [{ messageId: "restrictedSyntax", data: { message: "Using 'Identifier[name=\"bar\"]' is not allowed." }, type: "Identifier" }]
        },
        {
            code: "bar;",
            options: ["Identifier", "Identifier[name=\"bar\"]"],
            errors: [
                { messageId: "restrictedSyntax", data: { message: "Using 'Identifier' is not allowed." }, type: "Identifier" },
                { messageId: "restrictedSyntax", data: { message: "Using 'Identifier[name=\"bar\"]' is not allowed." }, type: "Identifier" }
            ]
        },
        {
            code: "() => {}",
            options: ["ArrowFunctionExpression > BlockStatement"],
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "restrictedSyntax", data: { message: "Using 'ArrowFunctionExpression > BlockStatement' is not allowed." }, type: "BlockStatement" }]
        },
        {
            code: "({ foo: 1, 'bar': 2 })",
            options: ["Property > Literal.key"],
            errors: [{ messageId: "restrictedSyntax", data: { message: "Using 'Property > Literal.key' is not allowed." }, type: "Literal" }]
        },
        {
            code: "A: for (;;) break A;",
            options: ["BreakStatement[label]"],
            errors: [{ messageId: "restrictedSyntax", data: { message: "Using 'BreakStatement[label]' is not allowed." }, type: "BreakStatement" }]
        },
        {
            code: "function foo(bar, baz, qux) {}",
            options: ["FunctionDeclaration[params.length>2]"],
            errors: [{ messageId: "restrictedSyntax", data: { message: "Using 'FunctionDeclaration[params.length>2]' is not allowed." }, type: "FunctionDeclaration" }]
        },

        // object format
        {
            code: "var foo = 41;",
            options: [{ selector: "VariableDeclaration" }],
            errors: [{ messageId: "restrictedSyntax", data: { message: "Using 'VariableDeclaration' is not allowed." }, type: "VariableDeclaration" }]
        },
        {
            code: "function foo(bar, baz, qux) {}",
            options: [{ selector: "FunctionDeclaration[params.length>2]" }],
            errors: [{ messageId: "restrictedSyntax", data: { message: "Using 'FunctionDeclaration[params.length>2]' is not allowed." }, type: "FunctionDeclaration" }]
        },
        {
            code: "function foo(bar, baz, qux) {}",
            options: [{ selector: "FunctionDeclaration[params.length>2]", message: "custom error message." }],
            errors: [{ messageId: "restrictedSyntax", data: { message: "custom error message." }, type: "FunctionDeclaration" }]
        },

        // with object format, the custom message may contain the string '{{selector}}'
        {
            code: "function foo(bar, baz, qux) {}",
            options: [{ selector: "FunctionDeclaration[params.length>2]", message: "custom message with {{selector}}" }],
            errors: [{ messageId: "restrictedSyntax", data: { message: "custom message with {{selector}}" }, type: "FunctionDeclaration" }]
        },

        // https://github.com/eslint/eslint/issues/8733
        {
            code: "console.log(/a/i);",
            options: ["Literal[regex.flags=/./]"],
            errors: [{ messageId: "restrictedSyntax", data: { message: "Using 'Literal[regex.flags=/./]' is not allowed." }, type: "Literal" }]
        },

        // Optional chaining
        {
            code: "var foo = foo?.bar?.();",
            options: ["ChainExpression"],
            parserOptions: { ecmaVersion: 2020 },
            errors: [{ messageId: "restrictedSyntax", data: { message: "Using 'ChainExpression' is not allowed." }, type: "ChainExpression" }]
        },
        {
            code: "var foo = foo?.bar?.();",
            options: ["[optional=true]"],
            parserOptions: { ecmaVersion: 2020 },
            errors: [
                { messageId: "restrictedSyntax", data: { message: "Using '[optional=true]' is not allowed." }, type: "CallExpression" },
                { messageId: "restrictedSyntax", data: { message: "Using '[optional=true]' is not allowed." }, type: "MemberExpression" }
            ]
        },

        // fix https://github.com/estools/esquery/issues/110
        {
            code: "a?.b",
            options: [":nth-child(1)"],
            parserOptions: { ecmaVersion: 2020 },
            errors: [
                { messageId: "restrictedSyntax", data: { message: "Using ':nth-child(1)' is not allowed." }, type: "ExpressionStatement" }
            ]
        },

        // https://github.com/eslint/eslint/issues/13639#issuecomment-683976062
        {
            code: "const foo = [<div/>, <div/>]",
            options: ["* ~ *"],
            parserOptions: { ecmaVersion: 2020, ecmaFeatures: { jsx: true } },
            errors: [
                { messageId: "restrictedSyntax", data: { message: "Using '* ~ *' is not allowed." }, type: "JSXElement" }
            ]
        }
    ]
});
