/**
 * @fileoverview Tests for arrow-spacing
 * @author Jxck
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------
//

var eslint = require("../../../lib/eslint"),
    ESLintTester = require("eslint-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var eslintTester = new ESLintTester(eslint);

var valid = [
    {
        ecmaFeatures: { arrowFunctions: true },
        code: "a => a",
        options: [{ after: true, before: true }]
    },
    {
        ecmaFeatures: { arrowFunctions: true },
        code: "() => {}",
        options: [{ after: true, before: true }]
    },
    {
        ecmaFeatures: { arrowFunctions: true },
        code: "(a) => {}",
        options: [{ after: true, before: true }]
    },
    {
        ecmaFeatures: { arrowFunctions: true },
        code: "a=> a",
        options: [{ after: true, before: false }]
    },
    {
        ecmaFeatures: { arrowFunctions: true },
        code: "()=> {}",
        options: [{ after: true, before: false }]
    },
    {
        ecmaFeatures: { arrowFunctions: true },
        code: "(a)=> {}",
        options: [{ after: true, before: false }]
    },
    {
        ecmaFeatures: { arrowFunctions: true },
        code: "a =>a",
        options: [{ after: false, before: true }]
    },
    {
        ecmaFeatures: { arrowFunctions: true },
        code: "() =>{}",
        options: [{ after: false, before: true }]
    },
    {
        ecmaFeatures: { arrowFunctions: true },
        code: "(a) =>{}",
        options: [{ after: false, before: true }]
    },
    {
        ecmaFeatures: { arrowFunctions: true },
        code: "a=>a",
        options: [{ after: false, before: false }]
    },
    {
        ecmaFeatures: { arrowFunctions: true },
        code: "()=>{}",
        options: [{ after: false, before: false }]
    },
    {
        ecmaFeatures: { arrowFunctions: true },
        code: "(a)=>{}",
        options: [{ after: false, before: false }]
    },
    {
        ecmaFeatures: { arrowFunctions: true },
        code: "a => a",
        options: [{}]
    },
    {
        ecmaFeatures: { arrowFunctions: true },
        code: "() => {}",
        options: [{}]
    },
    {
        ecmaFeatures: { arrowFunctions: true },
        code: "(a) => {}",
        options: [{}]
    },
    {
        ecmaFeatures: { arrowFunctions: true },
        code: "(a) =>\n{}"
    },
    {
        ecmaFeatures: { arrowFunctions: true },
        code: "(a) =>\r\n{}"
    },
    {
        ecmaFeatures: { arrowFunctions: true },
        code: "(a) =>\n    0"
    }
];


var invalid = [
    {
        code: "a=>a",
        options: [{ after: true, before: true }],
        ecmaFeatures: { arrowFunctions: true },
        errors: [
            { column: 1, line: 1, type: "Identifier" },
            { column: 4, line: 1, type: "Identifier" }
        ]
    },
    {
        code: "()=>{}",
        options: [{ after: true, before: true }],
        ecmaFeatures: { arrowFunctions: true },
        errors: [
            { column: 2, line: 1, type: "Punctuator" },
            { column: 5, line: 1, type: "Punctuator" }
        ]
    },
    {
        code: "(a)=>{}",
        options: [{ after: true, before: true }],
        ecmaFeatures: { arrowFunctions: true },
        errors: [
            { column: 3, line: 1, type: "Punctuator" },
            { column: 6, line: 1, type: "Punctuator" }
        ]
    },
    {
        code: "a=> a",
        options: [{ after: false, before: true }],
        ecmaFeatures: { arrowFunctions: true },
        errors: [
            { column: 1, line: 1, type: "Identifier" },
            { column: 5, line: 1, type: "Identifier" }
        ]
    },
    {
        code: "()=> {}",
        options: [{ after: false, before: true }],
        ecmaFeatures: { arrowFunctions: true },
        errors: [
            { column: 2, line: 1, type: "Punctuator" },
            { column: 6, line: 1, type: "Punctuator" }
        ]
    },
    {
        code: "(a)=> {}",
        options: [{ after: false, before: true }],
        ecmaFeatures: { arrowFunctions: true },
        errors: [
            { column: 3, line: 1, type: "Punctuator" },
            { column: 7, line: 1, type: "Punctuator" }
        ]
    },
    {
        code: "a=>  a",
        options: [{ after: false, before: true }],
        ecmaFeatures: { arrowFunctions: true },
        errors: [
            { column: 1, line: 1, type: "Identifier" },
            { column: 6, line: 1, type: "Identifier" }
        ]
    },
    {
        code: "()=>  {}",
        options: [{ after: false, before: true }],
        ecmaFeatures: { arrowFunctions: true },
        errors: [
            { column: 2, line: 1, type: "Punctuator" },
            { column: 7, line: 1, type: "Punctuator" }
        ]
    },
    {
        code: "(a)=>  {}",
        options: [{ after: false, before: true }],
        ecmaFeatures: { arrowFunctions: true },
        errors: [
            { column: 3, line: 1, type: "Punctuator" },
            { column: 8, line: 1, type: "Punctuator" }
        ]
    },
    {
        code: "a =>a",
        options: [{ after: true, before: false }],
        ecmaFeatures: { arrowFunctions: true },
        errors: [
            { column: 1, line: 1, type: "Identifier" },
            { column: 5, line: 1, type: "Identifier" }
        ]
    },
    {
        code: "() =>{}",
        options: [{ after: true, before: false }],
        ecmaFeatures: { arrowFunctions: true },
        errors: [
            { column: 2, line: 1, type: "Punctuator" },
            { column: 6, line: 1, type: "Punctuator" }
        ]
    },
    {
        code: "(a) =>{}",
        options: [{ after: true, before: false }],
        ecmaFeatures: { arrowFunctions: true },
        errors: [
            { column: 3, line: 1, type: "Punctuator" },
            { column: 7, line: 1, type: "Punctuator" }
        ]
    },
    {
        code: "a  =>a",
        options: [{ after: true, before: false }],
        ecmaFeatures: { arrowFunctions: true },
        errors: [
            { column: 1, line: 1, type: "Identifier" },
            { column: 6, line: 1, type: "Identifier" }
        ]
    },
    {
        code: "()  =>{}",
        options: [{ after: true, before: false }],
        ecmaFeatures: { arrowFunctions: true },
        errors: [
            { column: 2, line: 1, type: "Punctuator" },
            { column: 7, line: 1, type: "Punctuator" }
        ]
    },
    {
        code: "(a)  =>{}",
        options: [{ after: true, before: false }],
        ecmaFeatures: { arrowFunctions: true },
        errors: [
            { column: 3, line: 1, type: "Punctuator" },
            { column: 8, line: 1, type: "Punctuator" }
        ]
    },
    {
        code: "a => a",
        options: [{ after: false, before: false }],
        ecmaFeatures: { arrowFunctions: true },
        errors: [
            { column: 1, line: 1, type: "Identifier" },
            { column: 6, line: 1, type: "Identifier" }
        ]
    },
    {
        code: "() => {}",
        options: [{ after: false, before: false }],
        ecmaFeatures: { arrowFunctions: true },
        errors: [
            { column: 2, line: 1, type: "Punctuator" },
            { column: 7, line: 1, type: "Punctuator" }
        ]
    },
    {
        code: "(a) => {}",
        options: [{ after: false, before: false }],
        ecmaFeatures: { arrowFunctions: true },
        errors: [
            { column: 3, line: 1, type: "Punctuator" },
            { column: 8, line: 1, type: "Punctuator" }
        ]
    },
    {
        code: "a  =>  a",
        options: [{ after: false, before: false }],
        ecmaFeatures: { arrowFunctions: true },
        errors: [
            { column: 1, line: 1, type: "Identifier" },
            { column: 8, line: 1, type: "Identifier" }
        ]
    },
    {
        code: "()  =>  {}",
        options: [{ after: false, before: false }],
        ecmaFeatures: { arrowFunctions: true },
        errors: [
            { column: 2, line: 1, type: "Punctuator" },
            { column: 9, line: 1, type: "Punctuator" }
        ]
    },
    {
        code: "(a)  =>  {}",
        options: [{ after: false, before: false }],
        ecmaFeatures: { arrowFunctions: true },
        errors: [
            { column: 3, line: 1, type: "Punctuator" },
            { column: 10, line: 1, type: "Punctuator" }
        ]
    },
    {
        code: "(a)  =>\n{}",
        options: [{ after: false }],
        ecmaFeatures: { arrowFunctions: true },
        errors: [
            { column: 1, line: 2, type: "Punctuator" }
        ]
    }
];

eslintTester.addRuleTest("lib/rules/arrow-spacing", {
    valid: valid,
    invalid: invalid
});
