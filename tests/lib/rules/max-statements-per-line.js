/**
 * @fileoverview Tests for max-statements-per-line rule.
 * @author Kenneth Williams
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/max-statements-per-line"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();

ruleTester.run("max-statements-per-line", rule, {
    valid: [
        { code: "", options: [{ max: 0 }] },
        { code: "{ }", options: [{ max: 1 }] },
        { code: "var bar = 1;" },
        { code: "var bar = 1;", options: [{ max: 1 }] },
        { code: "if (condition) var bar = 1;", options: [{ max: 1 }] },
        { code: "if (condition) { }", options: [{ max: 1 }] },
        { code: "if (condition) { } else { }", options: [{ max: 1 }] },
        { code: "if (condition) {\nvar bar = 1;\n} else {\nvar bar = 1;\n}", options: [{ max: 1 }] },
        { code: "for (var i = 0; i < length; ++i) { }", options: [{ max: 1 }] },
        { code: "for (var i = 0; i < length; ++i) {\nvar bar  = 1;\n}", options: [{ max: 1 }] },
        { code: "switch (discriminant) { default: }", options: [{ max: 1 }] },
        { code: "switch (discriminant) {\ndefault: break;\n}", options: [{ max: 1 }] },
        { code: "function foo() { }", options: [{ max: 1 }] },
        { code: "function foo() {\nif (condition) var bar = 1;\n}", options: [{ max: 1 }] },
        { code: "function foo() {\nif (condition) {\nvar bar = 1;\n}\n}", options: [{ max: 1 }] },
        { code: "(function() { })();", options: [{ max: 1 }] },
        { code: "(function() {\nvar bar = 1;\n})();", options: [{ max: 1 }] },
        { code: "var foo = function foo() { };", options: [{ max: 1 }] },
        { code: "var foo = function foo() {\nvar bar = 1;\n};", options: [{ max: 1 }] },
        { code: "var foo = { prop: () => { } };", options: [{ max: 1 }], parserOptions: { ecmaVersion: 6 } },
        { code: "var bar = 1; var baz = 2;", options: [{ max: 2 }] },
        { code: "if (condition) { var bar = 1; }", options: [{ max: 2 }] },
        { code: "if (condition) {\nvar bar = 1; var baz = 2;\n} else {\nvar bar = 1; var baz = 2;\n}", options: [{ max: 2 }] },
        { code: "for (var i = 0; i < length; ++i) { var bar = 1; }", options: [{ max: 2 }] },
        { code: "for (var i = 0; i < length; ++i) {\nvar bar = 1; var baz = 2;\n}", options: [{ max: 2 }] },
        { code: "switch (discriminant) { default: break; }", options: [{ max: 2 }] },
        { code: "switch (discriminant) {\ncase 'test': var bar = 1; break;\ndefault: var bar = 1; break;\n}", options: [{ max: 2 }] },
        { code: "function foo() { var bar = 1; }", options: [{ max: 2 }] },
        { code: "function foo() {\nvar bar = 1; var baz = 2;\n}", options: [{ max: 2 }] },
        { code: "function foo() {\nif (condition) { var bar = 1; }\n}", options: [{ max: 2 }] },
        { code: "function foo() {\nif (condition) {\nvar bar = 1; var baz = 2;\n}\n}", options: [{ max: 2 }] },
        { code: "(function() { var bar = 1; })();", options: [{ max: 2 }] },
        { code: "(function() {\nvar bar = 1; var baz = 2;\n})();", options: [{ max: 2 }] },
        { code: "var foo = function foo() { var bar = 1; };", options: [{ max: 2 }] },
        { code: "var foo = function foo() {\nvar bar = 1; var baz = 2;\n};", options: [{ max: 2 }] },
        { code: "var foo = { prop: () => { var bar = 1; } };", options: [{ max: 2 }], parserOptions: { ecmaVersion: 6 } },
        { code: "var bar = 1; var baz = 2; var qux = 3;", options: [{ max: 3 }] },
        { code: "if (condition) { var bar = 1; var baz = 2; }", options: [{ max: 3 }] },
        { code: "if (condition) { var bar = 1; } else { var bar = 1; }", options: [{ max: 3 }] },
        { code: "switch (discriminant) { case 'test1': ; case 'test2': ; }", options: [{ max: 3 }] },
        { code: "let bar = bar => { ; }, baz = baz => { ; };", options: [{ max: 3 }], parserOptions: { ecmaVersion: 6 } },
        { code: "function foo({[bar => { ; }]: baz = qux => { ; }}) { }", options: [{ max: 3 }], parserOptions: { ecmaVersion: 6 } },
        { code: "bar => { ; }, baz => { ; }, qux => { ; };", options: [{ max: 4 }], parserOptions: { ecmaVersion: 6 } },
        { code: "[bar => { ; }, baz => { ; }, qux => { ; }];", options: [{ max: 4 }], parserOptions: { ecmaVersion: 6 } },
        { code: "foo(bar => { ; }, baz => { ; }, qux => { ; });", options: [{ max: 4 }], parserOptions: { ecmaVersion: 6 } },
        { code: "({ bar: bar => { ; }, baz: baz => { ; }, qux: qux => { ; }});", options: [{ max: 4 }], parserOptions: { ecmaVersion: 6 } },
        { code: "(bar => { ; }) ? (baz => { ; }) : (qux => { ; });", options: [{ max: 4 }], parserOptions: { ecmaVersion: 6 } }
    ],
    invalid: [
        { code: "{ }", options: [{ max: 0 }], errors: [{ message: "This line has too many statements. Maximum allowed is 0." }] },
        { code: "var bar = 1;", options: [{ max: 0 }], errors: [{ message: "This line has too many statements. Maximum allowed is 0." }] },
        { code: "var bar = 1; var baz = 2;", errors: [{ message: "This line has too many statements. Maximum allowed is 1." }] },
        { code: "var bar = 1; var baz = 2;", options: [{ max: 1 }], errors: [{ message: "This line has too many statements. Maximum allowed is 1." }] },
        { code: "if (condition) var bar = 1; if (condition) var baz = 2;", options: [{ max: 1 }], errors: [{ message: "This line has too many statements. Maximum allowed is 1." }] },
        { code: "if (condition) var bar = 1; else var baz = 1;", options: [{ max: 1 }], errors: [{ message: "This line has too many statements. Maximum allowed is 1." }] },
        { code: "if (condition) { } if (condition) { }", options: [{ max: 1 }], errors: [{ message: "This line has too many statements. Maximum allowed is 1." }] },
        { code: "if (condition) { var bar = 1; } else { }", options: [{ max: 1 }], errors: [{ message: "This line has too many statements. Maximum allowed is 1." }] },
        { code: "if (condition) { } else { var bar = 1; }", options: [{ max: 1 }], errors: [{ message: "This line has too many statements. Maximum allowed is 1." }] },
        { code: "if (condition) { var bar = 1; } else { var bar = 1; }", options: [{ max: 1 }], errors: [{ message: "This line has too many statements. Maximum allowed is 1." }] },
        { code: "for (var i = 0; i < length; ++i) { var bar = 1; }", options: [{ max: 1 }], errors: [{ message: "This line has too many statements. Maximum allowed is 1." }] },
        { code: "switch (discriminant) { default: break; }", options: [{ max: 1 }], errors: [{ message: "This line has too many statements. Maximum allowed is 1." }] },
        { code: "function foo() { var bar = 1; }", options: [{ max: 1 }], errors: [{ message: "This line has too many statements. Maximum allowed is 1." }] },
        { code: "function foo() { if (condition) var bar = 1; }", options: [{ max: 1 }], errors: [{ message: "This line has too many statements. Maximum allowed is 1." }] },
        { code: "function foo() { if (condition) { var bar = 1; } }", options: [{ max: 1 }], errors: [{ message: "This line has too many statements. Maximum allowed is 1." }] },
        { code: "(function() { var bar = 1; })();", options: [{ max: 1 }], errors: [{ message: "This line has too many statements. Maximum allowed is 1." }] },
        { code: "var foo = function foo() { var bar = 1; };", options: [{ max: 1 }], errors: [{ message: "This line has too many statements. Maximum allowed is 1." }] },
        { code: "var foo = { prop: () => { var bar = 1; } };", options: [{ max: 1 }], parserOptions: { ecmaVersion: 6 }, errors: [{ message: "This line has too many statements. Maximum allowed is 1." }] },
        { code: "var bar = 1; var baz = 2; var qux = 3;", options: [{ max: 2 }], errors: [{ message: "This line has too many statements. Maximum allowed is 2." }] },
        { code: "if (condition) { var bar = 1; var baz = 2; }", options: [{ max: 2 }], errors: [{ message: "This line has too many statements. Maximum allowed is 2." }] },
        { code: "if (condition) { var bar = 1; } else { var bar = 1; }", options: [{ max: 2 }], errors: [{ message: "This line has too many statements. Maximum allowed is 2." }] },
        { code: "if (condition) { var bar = 1; var baz = 2; } else { var bar = 1; var baz = 2; }", options: [{ max: 2 }], errors: [{ message: "This line has too many statements. Maximum allowed is 2." }] },
        { code: "for (var i = 0; i < length; ++i) { var bar = 1; var baz = 2; }", options: [{ max: 2 }], errors: [{ message: "This line has too many statements. Maximum allowed is 2." }] },
        { code: "switch (discriminant) { case 'test': break; default: break; }", options: [{ max: 2 }], errors: [{ message: "This line has too many statements. Maximum allowed is 2." }] },
        { code: "function foo() { var bar = 1; var baz = 2; }", options: [{ max: 2 }], errors: [{ message: "This line has too many statements. Maximum allowed is 2." }] },
        { code: "function foo() { if (condition) { var bar = 1; } }", options: [{ max: 2 }], errors: [{ message: "This line has too many statements. Maximum allowed is 2." }] },
        { code: "(function() { var bar = 1; var baz = 2; })();", options: [{ max: 2 }], errors: [{ message: "This line has too many statements. Maximum allowed is 2." }] },
        { code: "var foo = function foo() { var bar = 1; var baz = 2; };", options: [{ max: 2 }], errors: [{ message: "This line has too many statements. Maximum allowed is 2." }] },
        { code: "var foo = { prop: () => { var bar = 1; var baz = 2; } };", options: [{ max: 2 }], parserOptions: { ecmaVersion: 6 }, errors: [{ message: "This line has too many statements. Maximum allowed is 2." }] },
        { code: "var bar = 1; var baz = 2; var qux = 3; var waldo = 4;", options: [{ max: 3 }], errors: [{ message: "This line has too many statements. Maximum allowed is 3." }] },
        { code: "if (condition) { var bar = 1; var baz = 2; var qux = 3; }", options: [{ max: 3 }], errors: [{ message: "This line has too many statements. Maximum allowed is 3." }] },
        { code: "if (condition) { var bar = 1; var baz = 2; } else { var bar = 1; var baz = 2; }", options: [{ max: 3 }], errors: [{ message: "This line has too many statements. Maximum allowed is 3." }] },
        { code: "switch (discriminant) { case 'test': var bar = 1; break; default: var bar = 1; break; }", options: [{ max: 3 }], errors: [{ message: "This line has too many statements. Maximum allowed is 3." }] },
        { code: "let bar = bar => { ; }, baz = baz => { ; }, qux = qux => { ; };", options: [{ max: 3 }], parserOptions: { ecmaVersion: 6 }, errors: [{ message: "This line has too many statements. Maximum allowed is 3." }] },
        { code: "(bar => { ; }) ? (baz => { ; }) : (qux => { ; });", options: [{ max: 3 }], parserOptions: { ecmaVersion: 6 }, errors: [{ message: "This line has too many statements. Maximum allowed is 3." }] },
        { code: "bar => { ; }, baz => { ; }, qux => { ; }, quux => { ; };", options: [{ max: 4 }], parserOptions: { ecmaVersion: 6 }, errors: [{ message: "This line has too many statements. Maximum allowed is 4." }] },
        { code: "[bar => { ; }, baz => { ; }, qux => { ; }, quux => { ; }];", options: [{ max: 4 }], parserOptions: { ecmaVersion: 6 }, errors: [{ message: "This line has too many statements. Maximum allowed is 4." }] },
        { code: "foo(bar => { ; }, baz => { ; }, qux => { ; }, quux => { ; });", options: [{ max: 4 }], parserOptions: { ecmaVersion: 6 }, errors: [{ message: "This line has too many statements. Maximum allowed is 4." }] },
        { code: "({ bar: bar => { ; }, baz: baz => { ; }, qux: qux => { ; }, quux: quux => { ; }});", options: [{ max: 4 }], parserOptions: { ecmaVersion: 6 }, errors: [{ message: "This line has too many statements. Maximum allowed is 4." }] }
    ]
});
