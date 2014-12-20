/**
 * @fileoverview Tests for one-true-brace rule.
 * @author Ian Christian Myers
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslint = require("../../../lib/eslint"),
    ESLintTester = require("eslint-tester");
var OPEN_MESSAGE = "Opening curly brace does not appear on the same line as controlling statement.",
    BODY_MESSAGE = "Statement inside of curly braces should be on next line.",
    CLOSE_MESSAGE = "Closing curly brace does not appear on the same line as the subsequent block.",
    CLOSE_MESSAGE_SINGLE = "Closing curly brace should be on the same line as opening curly brace or on the line after the previous block.",
    CLOSE_MESSAGE_STROUSTRUP = "Closing curly brace appears on the same line as the subsequent block.";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var eslintTester = new ESLintTester(eslint);
eslintTester.addRuleTest("lib/rules/brace-style", {
    valid: [
        "function foo () { \nreturn; \n}",
        "function a(b,\nc,\nd) { }",
        "!function foo () { \nreturn;\n }",
        "!function a(b,\nc,\nd) { }",
        "if (foo) { \n bar(); \n}",
        "if (a) { \nb();\n } else { \nc();\n }",
        "while (foo) { \n bar();\n }",
        "for (;;) { \n bar(); \n}",
        "with (foo) { \n bar(); \n}",
        "switch (foo) { \n case \"bar\": break;\n }",
        "try { \n bar();\n } catch (e) {\n baz(); \n }",
        "do { \n bar();\n } while (true)",
        "for (foo in bar) { \n baz(); \n }",
        "if (a &&\n b &&\n c) { \n }",
        "switch(0) {\n}",
        { code: "if (foo) {\n}\nelse {\n}", args: ["2", "stroustrup"] },
        { code: "try { \n bar();\n }\ncatch (e) {\n baz(); \n }", args: ["2", "stroustrup"] },
        // allowSingleLine: true
        { code: "function foo () { return; }", args: ["2", "1tbs", { allowSingleLine: true }] },
        { code: "function foo () { a(); b(); return; }", args: ["2", "1tbs", { allowSingleLine: true }] },
        { code: "function a(b,c,d) { }", args: ["2", "1tbs", { allowSingleLine: true }] },
        { code: "!function foo () { return; }", args: ["2", "1tbs", { allowSingleLine: true }] },
        { code: "!function a(b,c,d) { }", args: ["2", "1tbs", { allowSingleLine: true }] },
        { code: "if (foo) {  bar(); }", args: ["2", "1tbs", { allowSingleLine: true }] },
        { code: "if (a) { b(); } else { c(); }", args: ["2", "1tbs", { allowSingleLine: true }] },
        { code: "while (foo) {  bar(); }", args: ["2", "1tbs", { allowSingleLine: true }] },
        { code: "for (;;) {  bar(); }", args: ["2", "1tbs", { allowSingleLine: true }] },
        { code: "with (foo) {  bar(); }", args: ["2", "1tbs", { allowSingleLine: true }] },
        { code: "switch (foo) {  case \"bar\": break; }", args: ["2", "1tbs", { allowSingleLine: true }] },
        { code: "try {  bar(); } catch (e) { baz();  }", args: ["2", "1tbs", { allowSingleLine: true }] },
        { code: "do {  bar(); } while (true)", args: ["2", "1tbs", { allowSingleLine: true }] },
        { code: "for (foo in bar) {  baz();  }", args: ["2", "1tbs", { allowSingleLine: true }] },
        { code: "if (a && b && c) {  }", args: ["2", "1tbs", { allowSingleLine: true }] },
        { code: "switch(0) {}", args: ["2", "1tbs", { allowSingleLine: true }] },
        { code: "if (foo) {}\nelse {}", args: ["2", "stroustrup", { allowSingleLine: true }] },
        { code: "try {  bar(); }\ncatch (e) { baz();  }", args: ["2", "stroustrup", { allowSingleLine: true }] }
    ],
    invalid: [
        { code: "function foo() { return; }", errors: [{ message: BODY_MESSAGE, type: "ReturnStatement"}] },
        { code: "function foo() \n { \n return; }", errors: [{ message: OPEN_MESSAGE, type: "FunctionDeclaration"}] },
        { code: "!function foo() \n { \n return; }", errors: [{ message: OPEN_MESSAGE, type: "FunctionExpression"}] },
        { code: "if (foo) \n { \n bar(); }", errors: [{ message: OPEN_MESSAGE, type: "IfStatement"}] },
        { code: "if (a) { \nb();\n } else \n { c(); }", errors: [{ message: OPEN_MESSAGE, type: "IfStatement"}] },
        { code: "while (foo) \n { \n bar(); }", errors: [{ message: OPEN_MESSAGE, type: "WhileStatement"}] },
        { code: "for (;;) \n { \n bar(); }", errors: [{ message: OPEN_MESSAGE, type: "ForStatement"}] },
        { code: "with (foo) \n { \n bar(); }", errors: [{ message: OPEN_MESSAGE, type: "WithStatement"}] },
        { code: "switch (foo) \n { \n case \"bar\": break; }", errors: [{ message: OPEN_MESSAGE, type: "SwitchStatement"}] },
        { code: "switch (foo) \n { }", errors: [{ message: OPEN_MESSAGE, type: "SwitchStatement"}] },
        { code: "try \n { \n bar(); \n } catch (e) {}", errors: [{ message: OPEN_MESSAGE, type: "TryStatement"}] },
        { code: "try { \n bar(); \n } catch (e) \n {}", errors: [{ message: OPEN_MESSAGE, type: "CatchClause"}] },
        { code: "do \n { \n bar(); \n} while (true)", errors: [{ message: OPEN_MESSAGE, type: "DoWhileStatement"}] },
        { code: "for (foo in bar) \n { \n baz(); \n }", errors: [{ message: OPEN_MESSAGE, type: "ForInStatement"}] },
        { code: "try { \n bar(); \n }\ncatch (e) {\n}", errors: [{ message: CLOSE_MESSAGE, type: "CatchClause"}] },
        { code: "try { \n bar(); \n } catch (e) {\n}\n finally {\n}", errors: [{ message: CLOSE_MESSAGE, type: "BlockStatement"}] },
        { code: "if (a) { \nb();\n } \n else { \nc();\n }", errors: [{ message: CLOSE_MESSAGE, type: "BlockStatement" }]},
        { code: "try { \n bar(); \n }\ncatch (e) {\n} finally {\n}", args: ["2", "stroustrup"], errors: [{ message: CLOSE_MESSAGE_STROUSTRUP, type: "BlockStatement"}] },
        { code: "try { \n bar(); \n } catch (e) {\n}\n finally {\n}", args: ["2", "stroustrup"], errors: [{ message: CLOSE_MESSAGE_STROUSTRUP, type: "CatchClause"}] },
        { code: "if (a) { \nb();\n } else { \nc();\n }", args: ["2", "stroustrup"], errors: [{ message: CLOSE_MESSAGE_STROUSTRUP, type: "BlockStatement" }]},
        { code: "if (foo) {\nbaz();\n} else if (bar) {\nbaz();\n}\nelse {\nqux();\n}", args: ["2", "stroustrup"], errors: [{ message: CLOSE_MESSAGE_STROUSTRUP, type: "IfStatement" }] },
        { code: "if (foo) {\npoop();\n} \nelse if (bar) {\nbaz();\n} else if (thing) {\nboom();\n}\nelse {\nqux();\n}", args: ["2", "stroustrup"], errors: [{ message: CLOSE_MESSAGE_STROUSTRUP, type: "IfStatement" }] },
        // allowSingleLine: true
        { code: "function foo() { return; \n}", args: ["2", "1tbs", { allowSingleLine: true }], errors: [{ message: BODY_MESSAGE, type: "ReturnStatement"}] },
        { code: "function foo() { a(); b(); return; \n}", args: ["2", "1tbs", { allowSingleLine: true }], errors: [{ message: BODY_MESSAGE, type: "ExpressionStatement"}] },
        { code: "function foo() { \n return; }", args: ["2", "1tbs", { allowSingleLine: true }], errors: [{ message: CLOSE_MESSAGE_SINGLE, type: "ReturnStatement"}] },
        { code: "function foo() {\na();\nb();\nreturn; }", args: ["2", "1tbs", { allowSingleLine: true }], errors: [{ message: CLOSE_MESSAGE_SINGLE, type: "ReturnStatement"}] },
        { code: "!function foo() { \n return; }", args: ["2", "1tbs", { allowSingleLine: true }], errors: [{ message: CLOSE_MESSAGE_SINGLE, type: "ReturnStatement"}] },
        { code: "if (foo) \n { bar(); }", args: ["2", "1tbs", { allowSingleLine: true }], errors: [{ message: OPEN_MESSAGE, type: "IfStatement"}] },
        { code: "if (a) { b();\n } else { c(); }", args: ["2", "1tbs", { allowSingleLine: true }], errors: [{ message: BODY_MESSAGE, type: "ExpressionStatement"}] },
        { code: "if (a) { b(); }\nelse { c(); }", args: ["2", "1tbs", { allowSingleLine: true }], errors: [{ message: CLOSE_MESSAGE, type: "BlockStatement" }] },
        { code: "while (foo) { \n bar(); }", args: ["2", "1tbs", { allowSingleLine: true }], errors: [{ message: CLOSE_MESSAGE_SINGLE, type: "ExpressionStatement"}] },
        { code: "for (;;) { bar(); \n }", args: ["2", "1tbs", { allowSingleLine: true }], errors: [{ message: BODY_MESSAGE, type: "ExpressionStatement"}] },
        { code: "with (foo) { bar(); \n }", args: ["2", "1tbs", { allowSingleLine: true }], errors: [{ message: BODY_MESSAGE, type: "ExpressionStatement"}] },
        { code: "switch (foo) \n { \n case \"bar\": break; }", args: ["2", "1tbs", { allowSingleLine: true }], errors: [{ message: OPEN_MESSAGE, type: "SwitchStatement"}] },
        { code: "switch (foo) \n { }", args: ["2", "1tbs", { allowSingleLine: true }], errors: [{ message: OPEN_MESSAGE, type: "SwitchStatement"}] },
        { code: "try {  bar(); }\ncatch (e) { baz();  }", args: ["2", "1tbs", { allowSingleLine: true }], errors: [{ message: CLOSE_MESSAGE, type: "CatchClause" }] },
        { code: "try \n { \n bar(); \n } catch (e) {}", args: ["2", "1tbs", { allowSingleLine: true }], errors: [{ message: OPEN_MESSAGE, type: "TryStatement"}] },
        { code: "try { \n bar(); \n } catch (e) \n {}", args: ["2", "1tbs", { allowSingleLine: true }], errors: [{ message: OPEN_MESSAGE, type: "CatchClause"}] },
        { code: "do \n { \n bar(); \n} while (true)", args: ["2", "1tbs", { allowSingleLine: true }], errors: [{ message: OPEN_MESSAGE, type: "DoWhileStatement"}] },
        { code: "for (foo in bar) \n { \n baz(); \n }", args: ["2", "1tbs", { allowSingleLine: true }], errors: [{ message: OPEN_MESSAGE, type: "ForInStatement"}] },
        { code: "try { \n bar(); \n }\ncatch (e) {\n}", args: ["2", "1tbs", { allowSingleLine: true }], errors: [{ message: CLOSE_MESSAGE, type: "CatchClause"}] },
        { code: "try { \n bar(); \n } catch (e) {\n}\n finally {\n}", args: ["2", "1tbs", { allowSingleLine: true }], errors: [{ message: CLOSE_MESSAGE, type: "BlockStatement"}] },
        { code: "if (a) { \nb();\n } \n else { \nc();\n }", args: ["2", "1tbs", { allowSingleLine: true }], errors: [{ message: CLOSE_MESSAGE, type: "BlockStatement" }]},
        { code: "try { \n bar(); \n }\ncatch (e) {\n} finally {\n}", args: ["2", "stroustrup", { allowSingleLine: true }], errors: [{ message: CLOSE_MESSAGE_STROUSTRUP, type: "BlockStatement"}] },
        { code: "try { \n bar(); \n } catch (e) {\n}\n finally {\n}", args: ["2", "stroustrup", { allowSingleLine: true }], errors: [{ message: CLOSE_MESSAGE_STROUSTRUP, type: "CatchClause"}] },
        { code: "if (a) { \nb();\n } else { \nc();\n }", args: ["2", "stroustrup", { allowSingleLine: true }], errors: [{ message: CLOSE_MESSAGE_STROUSTRUP, type: "BlockStatement" }]}
    ]
});
