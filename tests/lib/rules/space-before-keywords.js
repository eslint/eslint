/**
 * @fileoverview Require or disallow spaces before keywords
 * @author Marko Raatikka
 * @copyright 2015 Marko Raatikka. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/space-before-keywords"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
var never = [ "never" ];

/**
 * Create expected space error message
 * @param {string} keyword keyword to flag
 * @returns {string} Created a string
 * @private
 */
function expectedSpacingErrorMessageTpl(keyword) {
    return "Missing space before keyword \"" + keyword + "\".";
}

/**
 * Create expected no space error message
 * @param {string} keyword keyword to flag
 * @returns {string} Created a string
 * @private
 */
function expectedNoSpacingErrorMessageTpl(keyword) {
    return "Unexpected space before keyword \"" + keyword + "\".";
}

ruleTester.run("space-before-keywords", rule, {
    valid: [
        // IfStatement
        { code: "; if ('') {}" },
        { code: ";\nif ('') {}" },
        { code: "if ('') {} else {}" },
        { code: "if ('') {}\nelse {}" },
        { code: "; if ('') {}", options: never },
        { code: ";\nif ('') {}", options: never },
        { code: "if ('') {}else {}", options: never },
        // ForStatement
        { code: "; for (;;) {}" },
        { code: ";\nfor (;;) {}" },
        { code: "; for (;;) {}", options: never },
        { code: ";\nfor (;;) {}", options: never },
        // ForInStatement
        { code: "; for (var foo in [1, 2, 3]) {}" },
        { code: ";\nfor (var foo in [1, 2, 3]) {}" },
        { code: "; for (var foo in [1, 2, 3]) {}", options: never },
        { code: ";\nfor (var foo in [1, 2, 3]) {}", options: never },
        // WhileStatement
        { code: "; while (false) {}" },
        { code: ";\nwhile (false) {}" },
        { code: "; while (false) {}", options: never },
        { code: ";\nwhile (false) {}", options: never },
        // DoWhileStatement
        { code: "; do {} while (false)" },
        { code: ";\ndo {} while (false)" },
        { code: "do {}\nwhile (false)" },
        { code: "; do {}while (false)", options: never },
        // SwitchStatement
        { code: "; switch ('') {}" },
        { code: ";\nswitch ('') {}" },
        { code: "switch ('') { case 'foo': '' }" },
        { code: "switch ('') { case 'foo': break; case 'bar': '' }" },
        { code: "switch ('') {\ncase 'foo': '' }" },
        { code: "; switch ('') {}", options: never },
        { code: ";\nswitch ('') {}", options: never },
        { code: "switch ('') { case 'foo': '' }", options: never },
        { code: "switch ('') { case 'foo': break; case 'bar': '' }", options: never },
        { code: "switch ('') {\ncase 'foo': '' }", options: never },
        // ThrowStatement
        { code: "; throw new Error()" },
        { code: ";\nthrow new Error()" },
        { code: "; throw new Error()", options: never },
        { code: ";\nthrow new Error()", options: never },
        // TryStatement
        { code: "; try {} finally {}" },
        { code: ";\ntry {} finally {}" },
        { code: "try {}\nfinally {}" },
        { code: "; try {}finally {}", options: never },
        { code: ";\ntry {}finally {}", options: never },
        // CatchStatement
        { code: "try {} catch (e) {}" },
        { code: "try {}\ncatch (e) {}" },
        { code: "try {}catch (e) {}", options: never },
        // WithStatement
        { code: "; with (false) {}" },
        { code: ";\nwith (false) {}" },
        { code: "; with (false) {}", options: never },
        { code: ";\nwith (false) {}", options: never },
        // VariableDeclaration
        { code: "; var foo = 1" },
        { code: ";\nvar foo = 1" },
        { code: "for (var foo in [1, 2, 3]) {}" },
        { code: "; var foo = 1", options: never },
        { code: ";\nvar foo = 1", options: never },
        // BreakStatement
        { code: "for (;;) { break }"},
        { code: "for (;;) {\nbreak }"},
        { code: "for (;;) {\nbreak }", options: never},
        // LabeledStatement
        { code: "foo: for (;;) { bar: for (;;) {} }" },
        { code: "foo: for (;;) {\nbar: for (;;) {} }" },
        { code: "foo: for (;;) { bar: for (;;) {} }", options: never },
        { code: "foo: for (;;) {\nbar: for (;;) {} }", options: never },
        // ContinueStatement
        { code: "for (;;) { continue }" },
        { code: "for (;;) {\ncontinue }" },
        { code: "for (;;) { continue }", options: never },
        { code: "for (;;) {\ncontinue }", options: never },
        // ReturnStatement
        { code: "function foo() { return }" },
        { code: "function foo() {\nreturn }" },
        { code: "function foo() { return }", options: never },
        { code: "function foo() {\nreturn }", options: never },
        // FunctionDeclaration
        { code: "; function foo () {}" },
        { code: ";\nfunction foo () {}" },
        { code: "; function foo () {}", options: never },
        { code: ";\nfunction foo () {}", options: never },
        { code: "var foo = {bar() {}}", ecmaFeatures: { objectLiteralShorthandMethods: true } },
        { code: "var foo = { bar() {} }", ecmaFeatures: { objectLiteralShorthandMethods: true }, options: never },
        { code: "var foo = {\nbar() {}}", ecmaFeatures: { objectLiteralShorthandMethods: true }, options: never },
        // FunctionExpression
        { code: "var foo = function bar () {}" },
        { code: "var foo =\nfunction bar () {}" },
        { code: "function foo () { return function () {} }" },
        { code: "var foo = (function bar () {})()" },
        { code: "var foo = { foo: function () {} }" },
        { code: "<Foo onClick={function () {}} />", ecmaFeatures: { jsx: true } },
        { code: "var foo = function bar () {}", options: never },
        { code: "var foo =\nfunction bar () {}", options: never },
        { code: "function foo () { return function () {} }", options: never },
        { code: "var foo = { foo:function () {} }", options: never },
        // YieldExpression
        {
            code: "function* foo() { yield 0; }",
            ecmaFeatures: { generators: true }
        },
        {
            code: "function* foo() { if (yield 0) {} }",
            ecmaFeatures: { generators: true }
        },
        {
            code: "function* foo() {\nyield 0; }",
            ecmaFeatures: { generators: true }
        },
        {
            code: "function* foo() { yield 0; }",
            ecmaFeatures: { generators: true },
            options: never
        },
        {
            code: "function* foo() {\nyield 0; }",
            ecmaFeatures: { generators: true },
            options: never
        },
        // ForOfStatement
        {
            code: "; for (var foo of [1, 2, 3]) {}",
            ecmaFeatures: { forOf: true }
        },
        {
            code: ";\nfor (var foo of [1, 2, 3]) {}",
            ecmaFeatures: { forOf: true }
        },
        {
            code: "; for (var foo of [1, 2, 3]) {}",
            ecmaFeatures: { forOf: true },
            options: never
        },
        {
            code: ";\nfor (var foo of [1, 2, 3]) {}",
            ecmaFeatures: { forOf: true },
            options: never
        },
        // ClassBody
        {
            code: "; class Bar {}",
            ecmaFeatures: { classes: true }
        },
        {
            code: ";\nclass Bar {}",
            ecmaFeatures: { classes: true }
        },
        {
            code: "; class Bar extends Foo.Baz {}",
            ecmaFeatures: { classes: true }
        },
        {
            code: "; class Bar {}",
            ecmaFeatures: { classes: true },
            options: never
        },
        {
            code: ";\nclass Bar {}",
            ecmaFeatures: { classes: true },
            options: never
        },
        {
            code: "; class Bar extends Foo.Baz {}",
            ecmaFeatures: { classes: true },
            options: never
        },
        // Super
        {
            code: "class Bar { constructor() { super(); } }",
            ecmaFeatures: { classes: true }
        },
        {
            code: "class Bar { constructor() {\nsuper(); } }",
            ecmaFeatures: { classes: true }
        },
        {
            code: "class Bar { constructor() { super(); } }",
            ecmaFeatures: { classes: true },
            options: never
        },
        {
            code: "class Bar { constructor() {\nsuper(); } }",
            ecmaFeatures: { classes: true },
            options: never
        }
    ],
    invalid: [
        // IfStatement
        {
            code: ";if ('') {}",
            errors: [ { message: expectedSpacingErrorMessageTpl("if"), type: "IfStatement" } ],
            output: "; if ('') {}"
        },
        {
            code: "if ('') {}else {}",
            errors: [ { message: expectedSpacingErrorMessageTpl("else"), type: "Keyword", line: 1, column: 11 } ],
            output: "if ('') {} else {}"
        },
        {
            code: "if ('') {} else {}",
            errors: [ { message: expectedNoSpacingErrorMessageTpl("else"), type: "Keyword", line: 1, column: 12 } ],
            options: never,
            output: "if ('') {}else {}"
        },
        {
            code: "if ('') {}\nelse {}",
            errors: [ { message: expectedNoSpacingErrorMessageTpl("else"), type: "Keyword", line: 2, column: 1 } ],
            options: never,
            output: "if ('') {}else {}"
        },
        // ForStatement
        {
            code: ";for (;;) {}",
            errors: [ { message: expectedSpacingErrorMessageTpl("for"), type: "ForStatement" } ],
            output: "; for (;;) {}"
        },
        // ForInStatement
        {
            code: ";for (var foo in [1, 2, 3]) {}",
            errors: [ { message: expectedSpacingErrorMessageTpl("for"), type: "ForInStatement" } ],
            output: "; for (var foo in [1, 2, 3]) {}"
        },
        // WhileStatement
        {
            code: ";while (false) {}",
            errors: [ { message: expectedSpacingErrorMessageTpl("while"), type: "WhileStatement" } ],
            output: "; while (false) {}"
        },
        // DoWhileStatement
        {
            code: ";do {} while (false)",
            errors: [ { message: expectedSpacingErrorMessageTpl("do"), type: "DoWhileStatement" } ],
            output: "; do {} while (false)"
        },
        {
            code: "do {}while (false)",
            errors: [ { message: expectedSpacingErrorMessageTpl("while"), type: "Keyword", line: 1, column: 6 } ],
            output: "do {} while (false)"
        },
        {
            code: "do {} while (false)",
            errors: [ { message: expectedNoSpacingErrorMessageTpl("while"), type: "Keyword", line: 1, column: 7 } ],
            options: never,
            output: "do {}while (false)"
        },
        {
            code: "do {}   while (false)",
            errors: [ { message: expectedNoSpacingErrorMessageTpl("while"), type: "Keyword", line: 1, column: 9 } ],
            options: never,
            output: "do {}while (false)"
        },
        {
            code: "do {}\nwhile (false)",
            errors: [ { message: expectedNoSpacingErrorMessageTpl("while"), type: "Keyword", line: 2, column: 1 } ],
            options: never,
            output: "do {}while (false)"
        },
        // SwitchStatement
        {
            code: ";switch ('') {}",
            errors: [ { message: expectedSpacingErrorMessageTpl("switch"), type: "SwitchStatement" } ],
            output: "; switch ('') {}"
        },
        {
            code: "switch ('') { case 'foo': break;case 'bar': break; }",
            errors: [ { message: expectedSpacingErrorMessageTpl("case"), type: "SwitchCase", line: 1, column: 33 } ],
            output: "switch ('') { case 'foo': break; case 'bar': break; }"
        },
        // ThrowStatement
        {
            code: ";throw new Error()",
            errors: [ { message: expectedSpacingErrorMessageTpl("throw"), type: "ThrowStatement" } ],
            output: "; throw new Error()"
        },
        // TryStatement
        {
            code: ";try {} finally {}",
            errors: [ { message: expectedSpacingErrorMessageTpl("try"), type: "TryStatement" } ],
            output: "; try {} finally {}"
        },
        {
            code: "try {}finally {}",
            errors: [ { message: expectedSpacingErrorMessageTpl("finally"), type: "Keyword", line: 1, column: 7 } ],
            output: "try {} finally {}"
        },
        {
            code: "try {} finally {}",
            errors: [ { message: expectedNoSpacingErrorMessageTpl("finally"), type: "Keyword", line: 1, column: 8 } ],
            options: never,
            output: "try {}finally {}"
        },
        {
            code: "try {}\nfinally {}",
            errors: [ { message: expectedNoSpacingErrorMessageTpl("finally"), type: "Keyword", line: 2, column: 1 } ],
            options: never,
            output: "try {}finally {}"
        },
        // CatchClause
        {
            code: "try {}catch (e) {}",
            errors: [ { message: expectedSpacingErrorMessageTpl("catch"), type: "CatchClause", line: 1, column: 7 } ],
            output: "try {} catch (e) {}"
        },
        {
            code: "try {} catch (e) {}",
            errors: [ { message: expectedNoSpacingErrorMessageTpl("catch"), type: "CatchClause", line: 1, column: 8 } ],
            options: never,
            output: "try {}catch (e) {}"
        },
        {
            code: "try {}\ncatch (e) {}",
            errors: [ { message: expectedNoSpacingErrorMessageTpl("catch"), type: "CatchClause", line: 2, column: 1 } ],
            options: never,
            output: "try {}catch (e) {}"
        },
        // WithStatement
        {
            code: ";with (false) {}",
            errors: [ { message: expectedSpacingErrorMessageTpl("with"), type: "WithStatement" } ],
            output: "; with (false) {}"
        },
        // VariableDeclaration
        {
            code: ";var foo = 1",
            errors: [ { message: expectedSpacingErrorMessageTpl("var"), type: "VariableDeclaration" } ],
            output: "; var foo = 1"
        },
        // BreakStatement
        {
            code: "for (;;) { var foo = 'bar';break; }",
            errors: [ { message: expectedSpacingErrorMessageTpl("break"), type: "BreakStatement" } ],
            output: "for (;;) { var foo = 'bar'; break; }"
        },
        // LabeledStatement
        {
            code: "foo: for (;;) { var foo = 'bar';bar: for (;;) {} }",
            errors: [ { message: expectedSpacingErrorMessageTpl("bar"), type: "LabeledStatement" } ],
            output: "foo: for (;;) { var foo = 'bar'; bar: for (;;) {} }"
        },
        // ContinueStatement
        {
            code: "for (;;) { var foo = 'bar';continue; }",
            errors: [ { message: expectedSpacingErrorMessageTpl("continue"), type: "ContinueStatement" } ],
            output: "for (;;) { var foo = 'bar'; continue; }"
        },
        // ReturnStatement
        {
            code: "function foo() { var foo = 'bar';return foo; }",
            errors: [ { message: expectedSpacingErrorMessageTpl("return"), type: "ReturnStatement" } ],
            output: "function foo() { var foo = 'bar'; return foo; }"
        },
        // FunctionDeclaration
        {
            code: ";function foo () {}",
            errors: [ { message: expectedSpacingErrorMessageTpl("function"), type: "FunctionDeclaration" } ],
            output: "; function foo () {}"
        },
        // FunctionExpression
        {
            code: "var foo =function bar () {}",
            errors: [ { message: expectedSpacingErrorMessageTpl("function"), type: "FunctionExpression" } ],
            output: "var foo = function bar () {}"
        },
        {
            code: "var foo = { foo:function () {} }",
            errors: [ { message: expectedSpacingErrorMessageTpl("function"), type: "FunctionExpression" } ],
            output: "var foo = { foo: function () {} }"
        },
        // YieldExpression
        {
            code: "function* foo() { var foo = 'bar';yield foo; }",
            errors: [ { message: expectedSpacingErrorMessageTpl("yield"), type: "YieldExpression" } ],
            ecmaFeatures: { generators: true },
            output: "function* foo() { var foo = 'bar'; yield foo; }"
        },
        // ForOfStatement
        {
            code: ";for (var b of [1, 2, 3]) {}",
            errors: [ { message: expectedSpacingErrorMessageTpl("for"), type: "ForOfStatement" } ],
            ecmaFeatures: { forOf: true },
            output: "; for (var b of [1, 2, 3]) {}"
        },
        // ClassBody
        {
            code: ";class Bar {}",
            errors: [ { message: expectedSpacingErrorMessageTpl("class"), type: "Keyword" } ],
            ecmaFeatures: { classes: true },
            output: "; class Bar {}"
        },
        {
            code: ";class Bar extends Foo.Baz {}",
            errors: [ { message: expectedSpacingErrorMessageTpl("class"), type: "Keyword" } ],
            ecmaFeatures: { classes: true },
            output: "; class Bar extends Foo.Baz {}"
        },
        // Super
        {
            code: "class Bar { constructor() { var foo = 'bar';super.bar(foo); } }",
            errors: [ { message: expectedSpacingErrorMessageTpl("super"), type: "Super" } ],
            ecmaFeatures: { classes: true },
            output: "class Bar { constructor() { var foo = 'bar'; super.bar(foo); } }"
        }
    ]
});
