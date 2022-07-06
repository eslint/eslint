/**
 * @fileoverview Tests for no-loop-func rule.
 * @author Ilya Volodin
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-loop-func"),
    { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-loop-func", rule, {
    valid: [
        "string = 'function a() {}';",
        "for (var i=0; i<l; i++) { } var a = function() { i; };",
        "for (var i=0, a=function() { i; }; i<l; i++) { }",
        "for (var x in xs.filter(function(x) { return x != upper; })) { }",
        {
            code: "for (var x of xs.filter(function(x) { return x != upper; })) { }",
            parserOptions: { ecmaVersion: 6 }
        },

        // no refers to variables that declared on upper scope.
        "for (var i=0; i<l; i++) { (function() {}) }",
        "for (var i in {}) { (function() {}) }",
        {
            code: "for (var i of {}) { (function() {}) }",
            parserOptions: { ecmaVersion: 6 }
        },

        // functions which are using unmodified variables are OK.
        {
            code: "for (let i=0; i<l; i++) { (function() { i; }) }",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "for (let i in {}) { i = 7; (function() { i; }) }",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "for (const i of {}) { (function() { i; }) }",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "for (let i = 0; i < 10; ++i) { for (let x in xs.filter(x => x != i)) {  } }",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "let a = 0; for (let i=0; i<l; i++) { (function() { a; }); }",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "let a = 0; for (let i in {}) { (function() { a; }); }",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "let a = 0; for (let i of {}) { (function() { a; }); }",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "let a = 0; for (let i=0; i<l; i++) { (function() { (function() { a; }); }); }",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "let a = 0; for (let i in {}) { function foo() { (function() { a; }); } }",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "let a = 0; for (let i of {}) { (() => { (function() { a; }); }); }",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var a = 0; for (let i=0; i<l; i++) { (function() { a; }); }",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var a = 0; for (let i in {}) { (function() { a; }); }",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var a = 0; for (let i of {}) { (function() { a; }); }",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: [
                "let result = {};",
                "for (const score in scores) {",
                "  const letters = scores[score];",
                "  letters.split('').forEach(letter => {",
                "    result[letter] = score;",
                "  });",
                "}",
                "result.__default = 6;"
            ].join("\n"),
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: [
                "while (true) {",
                "    (function() { a; });",
                "}",
                "let a;"
            ].join("\n"),
            parserOptions: { ecmaVersion: 6 }
        }
    ],
    invalid: [
        {
            code: "for (var i=0; i<l; i++) { (function() { i; }) }",
            errors: [{ messageId: "unsafeRefs", data: { varNames: "'i'" }, type: "FunctionExpression" }]
        },
        {
            code: "for (var i=0; i<l; i++) { for (var j=0; j<m; j++) { (function() { i+j; }) } }",
            errors: [{ messageId: "unsafeRefs", data: { varNames: "'i', 'j'" }, type: "FunctionExpression" }]
        },
        {
            code: "for (var i in {}) { (function() { i; }) }",
            errors: [{ messageId: "unsafeRefs", data: { varNames: "'i'" }, type: "FunctionExpression" }]
        },
        {
            code: "for (var i of {}) { (function() { i; }) }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unsafeRefs", data: { varNames: "'i'" }, type: "FunctionExpression" }]
        },
        {
            code: "for (var i=0; i < l; i++) { (() => { i; }) }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unsafeRefs", data: { varNames: "'i'" }, type: "ArrowFunctionExpression" }]
        },
        {
            code: "for (var i=0; i < l; i++) { var a = function() { i; } }",
            errors: [{ messageId: "unsafeRefs", data: { varNames: "'i'" }, type: "FunctionExpression" }]
        },
        {
            code: "for (var i=0; i < l; i++) { function a() { i; }; a(); }",
            errors: [{ messageId: "unsafeRefs", data: { varNames: "'i'" }, type: "FunctionDeclaration" }]
        },
        {
            code: "for (var i=0; (function() { i; })(), i<l; i++) { }",
            errors: [{ messageId: "unsafeRefs", data: { varNames: "'i'" }, type: "FunctionExpression" }]
        },
        {
            code: "for (var i=0; i<l; (function() { i; })(), i++) { }",
            errors: [{ messageId: "unsafeRefs", data: { varNames: "'i'" }, type: "FunctionExpression" }]
        },
        {
            code: "while(i) { (function() { i; }) }",
            errors: [{ messageId: "unsafeRefs", data: { varNames: "'i'" }, type: "FunctionExpression" }]
        },
        {
            code: "do { (function() { i; }) } while (i)",
            errors: [{ messageId: "unsafeRefs", data: { varNames: "'i'" }, type: "FunctionExpression" }]
        },

        // Warns functions which are using modified variables.
        {
            code: "let a; for (let i=0; i<l; i++) { a = 1; (function() { a; });}",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unsafeRefs", data: { varNames: "'a'" }, type: "FunctionExpression" }]
        },
        {
            code: "let a; for (let i in {}) { (function() { a; }); a = 1; }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unsafeRefs", data: { varNames: "'a'" }, type: "FunctionExpression" }]
        },
        {
            code: "let a; for (let i of {}) { (function() { a; }); } a = 1; ",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unsafeRefs", data: { varNames: "'a'" }, type: "FunctionExpression" }]
        },
        {
            code: "let a; for (let i=0; i<l; i++) { (function() { (function() { a; }); }); a = 1; }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unsafeRefs", data: { varNames: "'a'" }, type: "FunctionExpression" }]
        },
        {
            code: "let a; for (let i in {}) { a = 1; function foo() { (function() { a; }); } }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unsafeRefs", data: { varNames: "'a'" }, type: "FunctionDeclaration" }]
        },
        {
            code: "let a; for (let i of {}) { (() => { (function() { a; }); }); } a = 1;",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unsafeRefs", data: { varNames: "'a'" }, type: "ArrowFunctionExpression" }]
        },
        {
            code: "for (var i = 0; i < 10; ++i) { for (let x in xs.filter(x => x != i)) {  } }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unsafeRefs", data: { varNames: "'i'" }, type: "ArrowFunctionExpression" }]
        },
        {
            code: "for (let x of xs) { let a; for (let y of ys) { a = 1; (function() { a; }); } }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unsafeRefs", data: { varNames: "'a'" }, type: "FunctionExpression" }]
        },
        {
            code: "for (var x of xs) { for (let y of ys) { (function() { x; }); } }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unsafeRefs", data: { varNames: "'x'" }, type: "FunctionExpression" }]
        },
        {
            code: "for (var x of xs) { (function() { x; }); }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unsafeRefs", data: { varNames: "'x'" }, type: "FunctionExpression" }]
        },
        {
            code: "var a; for (let x of xs) { a = 1; (function() { a; }); }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unsafeRefs", data: { varNames: "'a'" }, type: "FunctionExpression" }]
        },
        {
            code: "var a; for (let x of xs) { (function() { a; }); a = 1; }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unsafeRefs", data: { varNames: "'a'" }, type: "FunctionExpression" }]
        },
        {
            code: "let a; function foo() { a = 10; } for (let x of xs) { (function() { a; }); } foo();",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unsafeRefs", data: { varNames: "'a'" }, type: "FunctionExpression" }]
        },
        {
            code: "let a; function foo() { a = 10; for (let x of xs) { (function() { a; }); } } foo();",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unsafeRefs", data: { varNames: "'a'" }, type: "FunctionExpression" }]
        }
    ]
});
