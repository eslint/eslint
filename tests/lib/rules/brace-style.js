/**
 * @fileoverview Tests for one-true-brace rule.
 * @author Ian Christian Myers
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslintTester = require("eslint-tester");
var OPEN_MESSAGE = "Opening curly brace does not appear on the same line as controlling statement.",
    CLOSE_MESSAGE = "Closing curly brace does not appear on the same line as the subsequent block.",
    CLOSE_MESSAGE_STROUSTRUP = "Closing curly brace appears on the same line as the subsequent block.";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

eslintTester.addRuleTest("lib/rules/brace-style", {
    valid: [
        "function foo () { return; }",
        "function a(b,\nc,\nd) { }",
        "!function foo () { return; }",
        "!function a(b,\nc,\nd) { }",
        "if (foo) { \n bar(); }",
        "if (a) { b(); } else { c(); }",
        "while (foo) { \n bar(); }",
        "for (;;) { \n bar(); }",
        "with (foo) { \n bar(); }",
        "switch (foo) { \n case \"bar\": break; }",
        "try { \n bar();\n } catch (e) {\n baz(); \n }",
        "do { \n bar();\n } while (true)",
        "for (foo in bar) { \n baz(); \n }",
        "if (a &&\n b &&\n c) { \n }",
        "switch(0) {}",
        { code: "if (foo) {\n}\nelse {\n}", args: ["2", "stroustrup"] },
        { code: "try { \n bar();\n }\ncatch (e) {\n baz(); \n }", args: ["2", "stroustrup"] }
    ],
    invalid: [
        { code: "function foo() \n { \n return; }", errors: [{ message: OPEN_MESSAGE, type: "FunctionDeclaration"}] },
        { code: "!function foo() \n { \n return; }", errors: [{ message: OPEN_MESSAGE, type: "FunctionExpression"}] },
        { code: "if (foo) \n { \n bar(); }", errors: [{ message: OPEN_MESSAGE, type: "IfStatement"}] },
        { code: "if (a) { b(); } else \n { c(); }", errors: [{ message: OPEN_MESSAGE, type: "IfStatement"}] },
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
        { code: "if (a) { b(); } \n else { c(); }", errors: [{ message: CLOSE_MESSAGE, type: "BlockStatement" }]},
        { code: "try { \n bar(); \n }\ncatch (e) {\n} finally {\n}", args: ["2", "stroustrup"], errors: [{ message: CLOSE_MESSAGE_STROUSTRUP, type: "BlockStatement"}] },
        { code: "try { \n bar(); \n } catch (e) {\n}\n finally {\n}", args: ["2", "stroustrup"], errors: [{ message: CLOSE_MESSAGE_STROUSTRUP, type: "CatchClause"}] },
        { code: "if (a) { b(); } else { c(); }", args: ["2", "stroustrup"], errors: [{ message: CLOSE_MESSAGE_STROUSTRUP, type: "BlockStatement" }]}
    ]
});
