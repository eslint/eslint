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

function expectedSpacingErrorMessageTpl(keyword) {
    return "Missing space before keyword \"" + keyword + "\".";
}

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
        { code: "switch ('') {\ncase 'foo': '' }" },
        { code: "; switch ('') {}", options: never },
        { code: ";\nswitch ('') {}", options: never },
        { code: "switch ('') { case 'foo': '' }", options: never },
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
        // FunctionExpression
        { code: "var foo = function bar () {}" },
        { code: "var foo =\nfunction bar () {}" },
        { code: "function foo () { return function () {} }" },
        { code: "var foo = (function bar () {})()" },
        { code: "var foo = function bar () {}", options: never },
        { code: "var foo =\nfunction bar () {}", options: never },
        { code: "function foo () { return function () {} }", options: never },
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
            code: "; class Bar {}",
            ecmaFeatures: { classes: true },
            options: never
        },
        {
            code: ";\nclass Bar {}",
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
            errors: [ { message: expectedSpacingErrorMessageTpl("if"), type: "IfStatement" } ]
        },
        {
            code: "if ('') {}else {}",
            errors: [ { message: expectedSpacingErrorMessageTpl("else"), type: "Keyword", line: 1, column: 11 } ]
        },
        {
            code: "if ('') {} else {}",
            errors: [ { message: expectedNoSpacingErrorMessageTpl("else"), type: "Keyword", line: 1, column: 12 } ],
            options: never
        },
        {
            code: "if ('') {}\nelse {}",
            errors: [ { message: expectedNoSpacingErrorMessageTpl("else"), type: "Keyword", line: 2, column: 1 } ],
            options: never
        },
        // ForStatement
        {
            code: ";for (;;) {}",
            errors: [ { message: expectedSpacingErrorMessageTpl("for"), type: "ForStatement" } ]
        },
        // ForInStatement
        {
            code: ";for (var foo in [1, 2, 3]) {}",
            errors: [ { message: expectedSpacingErrorMessageTpl("for"), type: "ForInStatement" } ]
        },
        // WhileStatement
        {
            code: ";while (false) {}",
            errors: [ { message: expectedSpacingErrorMessageTpl("while"), type: "WhileStatement" } ]
        },
        // DoWhileStatement
        {
            code: ";do {} while (false)",
            errors: [ { message: expectedSpacingErrorMessageTpl("do"), type: "DoWhileStatement" } ]
        },
        {
            code: "do {}while (false)",
            errors: [ { message: expectedSpacingErrorMessageTpl("while"), type: "Keyword", line: 1, column: 6 } ]
        },
        {
            code: "do {} while (false)",
            errors: [ { message: expectedNoSpacingErrorMessageTpl("while"), type: "Keyword", line: 1, column: 7 } ],
            options: never
        },
        {
            code: "do {}\nwhile (false)",
            errors: [ { message: expectedNoSpacingErrorMessageTpl("while"), type: "Keyword", line: 2, column: 1 } ],
            options: never
        },
        // SwitchStatement
        {
            code: ";switch ('') {}",
            errors: [ { message: expectedSpacingErrorMessageTpl("switch"), type: "SwitchStatement" } ]
        },
        {
            code: "switch ('') {case 'foo': '' }",
            errors: [ { message: expectedSpacingErrorMessageTpl("case"), type: "SwitchCase", line: 1, column: 14 } ]
        },
        // ThrowStatement
        {
            code: ";throw new Error()",
            errors: [ { message: expectedSpacingErrorMessageTpl("throw"), type: "ThrowStatement" } ]
        },
        // TryStatement
        {
            code: ";try {} finally {}",
            errors: [ { message: expectedSpacingErrorMessageTpl("try"), type: "TryStatement" } ]
        },
        {
            code: "try {}finally {}",
            errors: [ { message: expectedSpacingErrorMessageTpl("finally"), type: "Keyword", line: 1, column: 7 } ]
        },
        {
            code: "try {} finally {}",
            errors: [ { message: expectedNoSpacingErrorMessageTpl("finally"), type: "Keyword", line: 1, column: 8 } ],
            options: never
        },
        {
            code: "try {}\nfinally {}",
            errors: [ { message: expectedNoSpacingErrorMessageTpl("finally"), type: "Keyword", line: 2, column: 1 } ],
            options: never
        },
        // CatchClause
        {
            code: "try {}catch (e) {}",
            errors: [ { message: expectedSpacingErrorMessageTpl("catch"), type: "CatchClause", line: 1, column: 7 } ]
        },
        {
            code: "try {} catch (e) {}",
            errors: [ { message: expectedNoSpacingErrorMessageTpl("catch"), type: "CatchClause", line: 1, column: 8 } ],
            options: never
        },
        {
            code: "try {}\ncatch (e) {}",
            errors: [ { message: expectedNoSpacingErrorMessageTpl("catch"), type: "CatchClause", line: 2, column: 1 } ],
            options: never
        },
        // WithStatement
        {
            code: ";with (false) {}",
            errors: [ { message: expectedSpacingErrorMessageTpl("with"), type: "WithStatement" } ]
        },
        // VariableDeclaration
        {
            code: ";var foo = 1",
            errors: [ { message: expectedSpacingErrorMessageTpl("var"), type: "VariableDeclaration" } ]
        },
        // BreakStatement
        {
            code: "for (;;) {break; }",
            errors: [ { message: expectedSpacingErrorMessageTpl("break"), type: "BreakStatement" } ]
        },
        // LabeledStatement
        {
            code: "foo: for (;;) {bar: for (;;) {} }",
            errors: [ { message: expectedSpacingErrorMessageTpl("bar"), type: "LabeledStatement" } ]
        },
        // ContinueStatement
        {
            code: "for (;;) {continue; }",
            errors: [ { message: expectedSpacingErrorMessageTpl("continue"), type: "ContinueStatement" } ]
        },
        // ReturnStatement
        {
            code: "function foo() {return; }",
            errors: [ { message: expectedSpacingErrorMessageTpl("return"), type: "ReturnStatement" } ]
        },
        // FunctionDeclaration
        {
            code: ";function foo () {}",
            errors: [ { message: expectedSpacingErrorMessageTpl("function"), type: "FunctionDeclaration" } ]
        },
        // FunctionExpression
        {
            code: "var foo =function bar () {}",
            errors: [ { message: expectedSpacingErrorMessageTpl("function"), type: "FunctionExpression" } ]
        },
        // YieldExpression
        {
            code: "function* foo() {yield 0; }",
            errors: [ { message: expectedSpacingErrorMessageTpl("yield"), type: "YieldExpression" } ],
            ecmaFeatures: { generators: true }
        },
        // ForOfStatement
        {
            code: ";for (var b of [1, 2, 3]) {}",
            errors: [ { message: expectedSpacingErrorMessageTpl("for"), type: "ForOfStatement" } ],
            ecmaFeatures: { forOf: true }
        },
        // ClassBody
        {
            code: ";class Bar {}",
            errors: [ { message: expectedSpacingErrorMessageTpl("class"), type: "Keyword" } ],
            ecmaFeatures: { classes: true }
        },
        // Super
        {
            code: "class Bar { constructor() {super.foo(); } }",
            errors: [ { message: expectedSpacingErrorMessageTpl("super"), type: "Super" } ],
            ecmaFeatures: { classes: true }
        }
    ]
});
