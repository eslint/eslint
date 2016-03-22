/**
 * @fileoverview Tests for one-true-brace rule.
 * @author Ian Christian Myers
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/brace-style"),
    RuleTester = require("../../../lib/testers/rule-tester");
var OPEN_MESSAGE = "Opening curly brace does not appear on the same line as controlling statement.",
    OPEN_MESSAGE_ALLMAN = "Opening curly brace appears on the same line as controlling statement.",
    BODY_MESSAGE = "Statement inside of curly braces should be on next line.",
    CLOSE_MESSAGE = "Closing curly brace does not appear on the same line as the subsequent block.",
    CLOSE_MESSAGE_SINGLE = "Closing curly brace should be on the same line as opening curly brace or on the line after the previous block.",
    CLOSE_MESSAGE_STROUSTRUP_ALLMAN = "Closing curly brace appears on the same line as the subsequent block.";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("brace-style", rule, {
    valid: [
        "function f() {\n" +
        "   if (true)\n" +
        "       return {x: 1}\n" +
        "   else {\n" +
        "       var y = 2\n" +
        "       return y\n" +
        "   }\n" +
        "}",
        "if (tag === 1) glyph.id = pbf.readVarint();\nelse if (tag === 2) glyph.bitmap = pbf.readBytes();",
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
        { code: "if (foo) {\n}\nelse {\n}", options: ["stroustrup"] },
        { code: "if (foo)\n{\n}\nelse\n{\n}", options: ["allman"] },
        { code: "try { \n bar();\n }\ncatch (e) {\n baz(); \n }", options: ["stroustrup"] },
        { code: "try\n{\n bar();\n}\ncatch (e)\n{\n baz(); \n}", options: ["allman"] },
        // allowSingleLine: true
        { code: "function foo () { return; }", options: ["1tbs", { allowSingleLine: true }] },
        { code: "function foo () { a(); b(); return; }", options: ["1tbs", { allowSingleLine: true }] },
        { code: "function a(b,c,d) { }", options: ["1tbs", { allowSingleLine: true }] },
        { code: "!function foo () { return; }", options: ["1tbs", { allowSingleLine: true }] },
        { code: "!function a(b,c,d) { }", options: ["1tbs", { allowSingleLine: true }] },
        { code: "if (foo) {  bar(); }", options: ["1tbs", { allowSingleLine: true }] },
        { code: "if (a) { b(); } else { c(); }", options: ["1tbs", { allowSingleLine: true }] },
        { code: "while (foo) {  bar(); }", options: ["1tbs", { allowSingleLine: true }] },
        { code: "for (;;) {  bar(); }", options: ["1tbs", { allowSingleLine: true }] },
        { code: "with (foo) {  bar(); }", options: ["1tbs", { allowSingleLine: true }] },
        { code: "switch (foo) {  case \"bar\": break; }", options: ["1tbs", { allowSingleLine: true }] },
        { code: "try {  bar(); } catch (e) { baz();  }", options: ["1tbs", { allowSingleLine: true }] },
        { code: "do {  bar(); } while (true)", options: ["1tbs", { allowSingleLine: true }] },
        { code: "for (foo in bar) {  baz();  }", options: ["1tbs", { allowSingleLine: true }] },
        { code: "if (a && b && c) {  }", options: ["1tbs", { allowSingleLine: true }] },
        { code: "switch(0) {}", options: ["1tbs", { allowSingleLine: true }] },
        { code: "if (foo) {}\nelse {}", options: ["stroustrup", { allowSingleLine: true }] },
        { code: "try {  bar(); }\ncatch (e) { baz();  }", options: ["stroustrup", { allowSingleLine: true }] },
        { code: "var foo = () => { return; }", parserOptions: { ecmaVersion: 6 }, options: ["stroustrup", { allowSingleLine: true }] },
        { code: "if (foo) {}\nelse {}", options: ["allman", { allowSingleLine: true }] },
        { code: "try {  bar(); }\ncatch (e) { baz();  }", options: ["allman", { allowSingleLine: true }] },
        { code: "var foo = () => { return; }", parserOptions: { ecmaVersion: 6 }, options: ["allman", { allowSingleLine: true }] },
        {
            code: "if (tag === 1) fontstack.name = pbf.readString(); \nelse if (tag === 2) fontstack.range = pbf.readString(); \nelse if (tag === 3) {\n var glyph = pbf.readMessage(readGlyph, {});\n fontstack.glyphs[glyph.id] = glyph; \n}",
            options: ["1tbs"]
        },
        {
            code: "if (tag === 1) fontstack.name = pbf.readString(); \nelse if (tag === 2) fontstack.range = pbf.readString(); \nelse if (tag === 3) {\n var glyph = pbf.readMessage(readGlyph, {});\n fontstack.glyphs[glyph.id] = glyph; \n}",
            options: ["stroustrup"]
        },
        {
            code: "switch(x) \n{ \n case 1: \nbar(); \n }\n ",
            options: ["allman"]
        }
    ],
    invalid: [
        { code: "if (f) {\nbar;\n}\nelse\nbaz;", errors: [{ message: CLOSE_MESSAGE, type: "ExpressionStatement"}] },
        { code: "var foo = () => { return; }", parserOptions: { ecmaVersion: 6 }, errors: [{ message: BODY_MESSAGE, type: "ReturnStatement"}, { message: CLOSE_MESSAGE_SINGLE, type: "ReturnStatement"}] },
        { code: "function foo() { return; }", errors: [{ message: BODY_MESSAGE, type: "ReturnStatement"}, { message: CLOSE_MESSAGE_SINGLE, type: "ReturnStatement"}] },
        { code: "function foo() \n { \n return; }", errors: [{ message: OPEN_MESSAGE, type: "FunctionDeclaration"}, { message: CLOSE_MESSAGE_SINGLE, type: "ReturnStatement"}] },
        { code: "!function foo() \n { \n return; }", errors: [{ message: OPEN_MESSAGE, type: "FunctionExpression"}, { message: CLOSE_MESSAGE_SINGLE, type: "ReturnStatement"}] },
        { code: "if (foo) \n { \n bar(); }", errors: [{ message: OPEN_MESSAGE, type: "IfStatement"}, { message: CLOSE_MESSAGE_SINGLE, type: "ExpressionStatement"}] },
        { code: "if (a) { \nb();\n } else \n { c(); }", errors: [{ message: OPEN_MESSAGE, type: "IfStatement"}, { message: BODY_MESSAGE, type: "ExpressionStatement"}, { message: CLOSE_MESSAGE_SINGLE, type: "ExpressionStatement"}] },
        { code: "while (foo) \n { \n bar(); }", errors: [{ message: OPEN_MESSAGE, type: "WhileStatement"}, { message: CLOSE_MESSAGE_SINGLE, type: "ExpressionStatement"}] },
        { code: "for (;;) \n { \n bar(); }", errors: [{ message: OPEN_MESSAGE, type: "ForStatement"}, { message: CLOSE_MESSAGE_SINGLE, type: "ExpressionStatement"}] },
        { code: "with (foo) \n { \n bar(); }", errors: [{ message: OPEN_MESSAGE, type: "WithStatement"}, { message: CLOSE_MESSAGE_SINGLE, type: "ExpressionStatement"}] },
        { code: "switch (foo) \n { \n case \"bar\": break; }", errors: [{ message: OPEN_MESSAGE, type: "SwitchStatement"}] },
        { code: "switch (foo) \n { }", errors: [{ message: OPEN_MESSAGE, type: "SwitchStatement"}] },
        { code: "try \n { \n bar(); \n } catch (e) {}", errors: [{ message: OPEN_MESSAGE, type: "TryStatement"}] },
        { code: "try { \n bar(); \n } catch (e) \n {}", errors: [{ message: OPEN_MESSAGE, type: "CatchClause"}] },
        { code: "do \n { \n bar(); \n} while (true)", errors: [{ message: OPEN_MESSAGE, type: "DoWhileStatement"}] },
        { code: "for (foo in bar) \n { \n baz(); \n }", errors: [{ message: OPEN_MESSAGE, type: "ForInStatement"}] },
        { code: "for (foo of bar) \n { \n baz(); \n }", parserOptions: { ecmaVersion: 6 }, errors: [{ message: OPEN_MESSAGE, type: "ForOfStatement"}] },
        { code: "try { \n bar(); \n }\ncatch (e) {\n}", errors: [{ message: CLOSE_MESSAGE, type: "CatchClause"}] },
        { code: "try { \n bar(); \n } catch (e) {\n}\n finally {\n}", errors: [{ message: CLOSE_MESSAGE, type: "BlockStatement"}] },
        { code: "if (a) { \nb();\n } \n else { \nc();\n }", errors: [{ message: CLOSE_MESSAGE, type: "BlockStatement" }]},
        { code: "try { \n bar(); \n }\ncatch (e) {\n} finally {\n}", options: ["stroustrup"], errors: [{ message: CLOSE_MESSAGE_STROUSTRUP_ALLMAN, type: "BlockStatement"}] },
        { code: "try { \n bar(); \n } catch (e) {\n}\n finally {\n}", options: ["stroustrup"], errors: [{ message: CLOSE_MESSAGE_STROUSTRUP_ALLMAN, type: "CatchClause"}] },
        { code: "if (a) { \nb();\n } else { \nc();\n }", options: ["stroustrup"], errors: [{ message: CLOSE_MESSAGE_STROUSTRUP_ALLMAN, type: "BlockStatement" }]},
        { code: "if (foo) {\nbaz();\n} else if (bar) {\nbaz();\n}\nelse {\nqux();\n}", options: ["stroustrup"], errors: [{ message: CLOSE_MESSAGE_STROUSTRUP_ALLMAN, type: "IfStatement" }] },
        { code: "if (foo) {\npoop();\n} \nelse if (bar) {\nbaz();\n} else if (thing) {\nboom();\n}\nelse {\nqux();\n}", options: ["stroustrup"], errors: [{ message: CLOSE_MESSAGE_STROUSTRUP_ALLMAN, type: "IfStatement" }] },

        { code: "try { \n bar(); \n }\n catch (e) {\n}\n finally {\n}", options: ["allman"], errors: [
            { message: OPEN_MESSAGE_ALLMAN, type: "TryStatement", line: 1},
            { message: OPEN_MESSAGE_ALLMAN, type: "TryStatement", line: 1},
            { message: OPEN_MESSAGE_ALLMAN, type: "CatchClause", line: 4}
        ] },
        { code: "switch(x) { case 1: \nbar(); }\n ", options: ["allman"], errors: [
            { message: OPEN_MESSAGE_ALLMAN, type: "SwitchStatement", line: 1}
        ] },
        { code: "if (a) { \nb();\n } else { \nc();\n }", options: ["allman"], errors: [
            { message: OPEN_MESSAGE_ALLMAN, type: "IfStatement" },
            { message: OPEN_MESSAGE_ALLMAN, type: "IfStatement" },
            { message: CLOSE_MESSAGE_STROUSTRUP_ALLMAN, type: "BlockStatement" }
        ]},
        { code: "if (foo) {\nbaz();\n} else if (bar) {\nbaz();\n}\nelse {\nqux();\n}", options: ["allman"], errors: [
            { message: OPEN_MESSAGE_ALLMAN, type: "IfStatement" },
            { message: CLOSE_MESSAGE_STROUSTRUP_ALLMAN, type: "IfStatement" },
            { message: OPEN_MESSAGE_ALLMAN, type: "IfStatement" },
            { message: OPEN_MESSAGE_ALLMAN, type: "IfStatement" }
        ] },
        { code: "if (foo)\n{ poop();\n} \nelse if (bar) {\nbaz();\n} else if (thing) {\nboom();\n}\nelse {\nqux();\n}", options: ["allman"], errors: [
            { message: BODY_MESSAGE, type: "ExpressionStatement" },
            { message: OPEN_MESSAGE_ALLMAN, type: "IfStatement" },
            { message: CLOSE_MESSAGE_STROUSTRUP_ALLMAN, type: "IfStatement" },
            { message: OPEN_MESSAGE_ALLMAN, type: "IfStatement" },
            { message: OPEN_MESSAGE_ALLMAN, type: "IfStatement" }
        ] },
        { code: "if (foo)\n{\n  bar(); }", options: ["allman"], errors: [
            { message: CLOSE_MESSAGE_SINGLE, type: "ExpressionStatement" }
        ] },
        { code: "try\n{\n  somethingRisky();\n} catch (e)\n{\n  handleError()\n}", options: ["allman"], errors: [
            { message: CLOSE_MESSAGE_STROUSTRUP_ALLMAN, type: "CatchClause" }
        ] },

        // allowSingleLine: true
        { code: "function foo() { return; \n}", options: ["1tbs", { allowSingleLine: true }], errors: [{ message: BODY_MESSAGE, type: "ReturnStatement"}] },
        { code: "function foo() { a(); b(); return; \n}", options: ["1tbs", { allowSingleLine: true }], errors: [{ message: BODY_MESSAGE, type: "ExpressionStatement"}] },
        { code: "function foo() { \n return; }", options: ["1tbs", { allowSingleLine: true }], errors: [{ message: CLOSE_MESSAGE_SINGLE, type: "ReturnStatement"}] },
        { code: "function foo() {\na();\nb();\nreturn; }", options: ["1tbs", { allowSingleLine: true }], errors: [{ message: CLOSE_MESSAGE_SINGLE, type: "ReturnStatement"}] },
        { code: "!function foo() { \n return; }", options: ["1tbs", { allowSingleLine: true }], errors: [{ message: CLOSE_MESSAGE_SINGLE, type: "ReturnStatement"}] },
        { code: "if (foo) \n { bar(); }", options: ["1tbs", { allowSingleLine: true }], errors: [
            { message: OPEN_MESSAGE, type: "IfStatement"},
            { message: BODY_MESSAGE, type: "ExpressionStatement"},
            { message: CLOSE_MESSAGE_SINGLE, type: "ExpressionStatement"}
        ] },
        { code: "if (a) { b();\n } else { c(); }", options: ["1tbs", { allowSingleLine: true }], errors: [{ message: BODY_MESSAGE, type: "ExpressionStatement"}] },
        { code: "if (a) { b(); }\nelse { c(); }", options: ["1tbs", { allowSingleLine: true }], errors: [{ message: CLOSE_MESSAGE, type: "BlockStatement" }] },
        { code: "while (foo) { \n bar(); }", options: ["1tbs", { allowSingleLine: true }], errors: [{ message: CLOSE_MESSAGE_SINGLE, type: "ExpressionStatement"}] },
        { code: "for (;;) { bar(); \n }", options: ["1tbs", { allowSingleLine: true }], errors: [{ message: BODY_MESSAGE, type: "ExpressionStatement"}] },
        { code: "with (foo) { bar(); \n }", options: ["1tbs", { allowSingleLine: true }], errors: [{ message: BODY_MESSAGE, type: "ExpressionStatement"}] },
        { code: "switch (foo) \n { \n case \"bar\": break; }", options: ["1tbs", { allowSingleLine: true }], errors: [{ message: OPEN_MESSAGE, type: "SwitchStatement"}] },
        { code: "switch (foo) \n { }", options: ["1tbs", { allowSingleLine: true }], errors: [{ message: OPEN_MESSAGE, type: "SwitchStatement"}] },
        { code: "try {  bar(); }\ncatch (e) { baz();  }", options: ["1tbs", { allowSingleLine: true }], errors: [{ message: CLOSE_MESSAGE, type: "CatchClause" }] },
        { code: "try \n { \n bar(); \n } catch (e) {}", options: ["1tbs", { allowSingleLine: true }], errors: [{ message: OPEN_MESSAGE, type: "TryStatement"}] },
        { code: "try { \n bar(); \n } catch (e) \n {}", options: ["1tbs", { allowSingleLine: true }], errors: [{ message: OPEN_MESSAGE, type: "CatchClause"}] },
        { code: "do \n { \n bar(); \n} while (true)", options: ["1tbs", { allowSingleLine: true }], errors: [{ message: OPEN_MESSAGE, type: "DoWhileStatement"}] },
        { code: "for (foo in bar) \n { \n baz(); \n }", options: ["1tbs", { allowSingleLine: true }], errors: [{ message: OPEN_MESSAGE, type: "ForInStatement"}] },
        { code: "try { \n bar(); \n }\ncatch (e) {\n}", options: ["1tbs", { allowSingleLine: true }], errors: [{ message: CLOSE_MESSAGE, type: "CatchClause"}] },
        { code: "try { \n bar(); \n } catch (e) {\n}\n finally {\n}", options: ["1tbs", { allowSingleLine: true }], errors: [{ message: CLOSE_MESSAGE, type: "BlockStatement"}] },
        { code: "if (a) { \nb();\n } \n else { \nc();\n }", options: ["1tbs", { allowSingleLine: true }], errors: [{ message: CLOSE_MESSAGE, type: "BlockStatement" }]},
        { code: "try { \n bar(); \n }\ncatch (e) {\n} finally {\n}", options: ["stroustrup", { allowSingleLine: true }], errors: [{ message: CLOSE_MESSAGE_STROUSTRUP_ALLMAN, type: "BlockStatement"}] },
        { code: "try { \n bar(); \n } catch (e) {\n}\n finally {\n}", options: ["stroustrup", { allowSingleLine: true }], errors: [{ message: CLOSE_MESSAGE_STROUSTRUP_ALLMAN, type: "CatchClause"}] },
        { code: "if (a) { \nb();\n } else { \nc();\n }", options: ["stroustrup", { allowSingleLine: true }], errors: [{ message: CLOSE_MESSAGE_STROUSTRUP_ALLMAN, type: "BlockStatement" }]},
        { code: "if (foo)\n{ poop();\n} \nelse if (bar) {\nbaz();\n} else if (thing) {\nboom();\n}\nelse {\nqux();\n}", options: ["allman", { allowSingleLine: true }], errors: [
            { message: BODY_MESSAGE, type: "ExpressionStatement" },
            { message: OPEN_MESSAGE_ALLMAN, type: "IfStatement" },
            { message: CLOSE_MESSAGE_STROUSTRUP_ALLMAN, type: "IfStatement" },
            { message: OPEN_MESSAGE_ALLMAN, type: "IfStatement" },
            { message: OPEN_MESSAGE_ALLMAN, type: "IfStatement" }
        ] }
    ]
});
