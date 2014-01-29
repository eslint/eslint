/**
 * @fileoverview Tests for one-true-brace rule.
 * @author Ian Christian Myers
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslintTester = require("eslint-tester"),
    MESSAGE = "Opening curly brace does not appear on the same line as controlling statement.";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

eslintTester.addRuleTest("lib/rules/brace-style", {
    valid: [
        "function foo () { return; }",
        "function a(b,\nc,\nd) { }",
        "if (foo) { \n bar(); }",
        "if (a) { b(); } else { c(); }",
        "if (a) { b(); } \n else { c(); }",
        "while (foo) { \n bar(); }",
        "for (;;) { \n bar(); }",
        "with (foo) { \n bar(); }",
        "switch (foo) { \n case \"bar\": break; }",
        "try { \n bar();\n } catch (e) {\n baz(); \n }",
        "do { \n bar();\n } while (true)",
        "for (foo in bar) { \n baz(); \n }",
        "if (a &&\n b &&\n c) { \n }",
        "switch(0) {}"
    ],
    invalid: [
        { code: "function foo() \n { \n return; }", errors: [{ message: MESSAGE, type: "FunctionDeclaration"}] },
        { code: "if (foo) \n { \n bar(); }", errors: [{ message: MESSAGE, type: "IfStatement"}] },
        { code: "if (a) { b(); } else \n { c(); }", errors: [{ message: MESSAGE, type: "IfStatement"}] },
        { code: "while (foo) \n { \n bar(); }", errors: [{ message: MESSAGE, type: "WhileStatement"}] },
        { code: "for (;;) \n { \n bar(); }", errors: [{ message: MESSAGE, type: "ForStatement"}] },
        { code: "with (foo) \n { \n bar(); }", errors: [{ message: MESSAGE, type: "WithStatement"}] },
        { code: "switch (foo) \n { \n case \"bar\": break; }", errors: [{ message: MESSAGE, type: "SwitchStatement"}] },
        { code: "switch (foo) \n { }", errors: [{ message: MESSAGE, type: "SwitchStatement"}] },
        { code: "try \n { \n bar(); \n } catch (e) {}", errors: [{ message: MESSAGE, type: "TryStatement"}] },
        { code: "try { \n bar(); \n } catch (e) \n {}", errors: [{ message: MESSAGE, type: "CatchClause"}] },
        { code: "do \n { \n bar(); \n} while (true)", errors: [{ message: MESSAGE, type: "DoWhileStatement"}] },
        { code: "for (foo in bar) \n { \n baz(); \n }", errors: [{ message: MESSAGE, type: "ForInStatement"}] }
    ]
});
