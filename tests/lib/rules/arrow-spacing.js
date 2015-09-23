/**
 * @fileoverview Tests for arrow-spacing
 * @author Jxck
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------
//

var rule = require("../../../lib/rules/arrow-spacing"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();

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
        output: "a => a",
        options: [{ after: true, before: true }],
        ecmaFeatures: { arrowFunctions: true },
        errors: [
            { column: 1, line: 1, type: "Identifier" },
            { column: 4, line: 1, type: "Identifier" }
        ]
    },
    {
        code: "()=>{}",
        output: "() => {}",
        options: [{ after: true, before: true }],
        ecmaFeatures: { arrowFunctions: true },
        errors: [
            { column: 2, line: 1, type: "Punctuator" },
            { column: 5, line: 1, type: "Punctuator" }
        ]
    },
    {
        code: "(a)=>{}",
        output: "(a) => {}",
        options: [{ after: true, before: true }],
        ecmaFeatures: { arrowFunctions: true },
        errors: [
            { column: 3, line: 1, type: "Punctuator" },
            { column: 6, line: 1, type: "Punctuator" }
        ]
    },
    {
        code: "a=> a",
        output: "a =>a",
        options: [{ after: false, before: true }],
        ecmaFeatures: { arrowFunctions: true },
        errors: [
            { column: 1, line: 1, type: "Identifier" },
            { column: 5, line: 1, type: "Identifier" }
        ]
    },
    {
        code: "()=> {}",
        output: "() =>{}",
        options: [{ after: false, before: true }],
        ecmaFeatures: { arrowFunctions: true },
        errors: [
            { column: 2, line: 1, type: "Punctuator" },
            { column: 6, line: 1, type: "Punctuator" }
        ]
    },
    {
        code: "(a)=> {}",
        output: "(a) =>{}",
        options: [{ after: false, before: true }],
        ecmaFeatures: { arrowFunctions: true },
        errors: [
            { column: 3, line: 1, type: "Punctuator" },
            { column: 7, line: 1, type: "Punctuator" }
        ]
    },
    {
        code: "a=>  a",
        output: "a =>a",
        options: [{ after: false, before: true }],
        ecmaFeatures: { arrowFunctions: true },
        errors: [
            { column: 1, line: 1, type: "Identifier" },
            { column: 6, line: 1, type: "Identifier" }
        ]
    },
    {
        code: "()=>  {}",
        output: "() =>{}",
        options: [{ after: false, before: true }],
        ecmaFeatures: { arrowFunctions: true },
        errors: [
            { column: 2, line: 1, type: "Punctuator" },
            { column: 7, line: 1, type: "Punctuator" }
        ]
    },
    {
        code: "(a)=>  {}",
        output: "(a) =>{}",
        options: [{ after: false, before: true }],
        ecmaFeatures: { arrowFunctions: true },
        errors: [
            { column: 3, line: 1, type: "Punctuator" },
            { column: 8, line: 1, type: "Punctuator" }
        ]
    },
    {
        code: "a =>a",
        output: "a=> a",
        options: [{ after: true, before: false }],
        ecmaFeatures: { arrowFunctions: true },
        errors: [
            { column: 1, line: 1, type: "Identifier" },
            { column: 5, line: 1, type: "Identifier" }
        ]
    },
    {
        code: "() =>{}",
        output: "()=> {}",
        options: [{ after: true, before: false }],
        ecmaFeatures: { arrowFunctions: true },
        errors: [
            { column: 2, line: 1, type: "Punctuator" },
            { column: 6, line: 1, type: "Punctuator" }
        ]
    },
    {
        code: "(a) =>{}",
        output: "(a)=> {}",
        options: [{ after: true, before: false }],
        ecmaFeatures: { arrowFunctions: true },
        errors: [
            { column: 3, line: 1, type: "Punctuator" },
            { column: 7, line: 1, type: "Punctuator" }
        ]
    },
    {
        code: "a  =>a",
        output: "a=> a",
        options: [{ after: true, before: false }],
        ecmaFeatures: { arrowFunctions: true },
        errors: [
            { column: 1, line: 1, type: "Identifier" },
            { column: 6, line: 1, type: "Identifier" }
        ]
    },
    {
        code: "()  =>{}",
        output: "()=> {}",
        options: [{ after: true, before: false }],
        ecmaFeatures: { arrowFunctions: true },
        errors: [
            { column: 2, line: 1, type: "Punctuator" },
            { column: 7, line: 1, type: "Punctuator" }
        ]
    },
    {
        code: "(a)  =>{}",
        output: "(a)=> {}",
        options: [{ after: true, before: false }],
        ecmaFeatures: { arrowFunctions: true },
        errors: [
            { column: 3, line: 1, type: "Punctuator" },
            { column: 8, line: 1, type: "Punctuator" }
        ]
    },
    {
        code: "a => a",
        output: "a=>a",
        options: [{ after: false, before: false }],
        ecmaFeatures: { arrowFunctions: true },
        errors: [
            { column: 1, line: 1, type: "Identifier" },
            { column: 6, line: 1, type: "Identifier" }
        ]
    },
    {
        code: "() => {}",
        output: "()=>{}",
        options: [{ after: false, before: false }],
        ecmaFeatures: { arrowFunctions: true },
        errors: [
            { column: 2, line: 1, type: "Punctuator" },
            { column: 7, line: 1, type: "Punctuator" }
        ]
    },
    {
        code: "(a) => {}",
        output: "(a)=>{}",
        options: [{ after: false, before: false }],
        ecmaFeatures: { arrowFunctions: true },
        errors: [
            { column: 3, line: 1, type: "Punctuator" },
            { column: 8, line: 1, type: "Punctuator" }
        ]
    },
    {
        code: "a  =>  a",
        output: "a=>a",
        options: [{ after: false, before: false }],
        ecmaFeatures: { arrowFunctions: true },
        errors: [
            { column: 1, line: 1, type: "Identifier" },
            { column: 8, line: 1, type: "Identifier" }
        ]
    },
    {
        code: "()  =>  {}",
        output: "()=>{}",
        options: [{ after: false, before: false }],
        ecmaFeatures: { arrowFunctions: true },
        errors: [
            { column: 2, line: 1, type: "Punctuator" },
            { column: 9, line: 1, type: "Punctuator" }
        ]
    },
    {
        code: "(a)  =>  {}",
        output: "(a)=>{}",
        options: [{ after: false, before: false }],
        ecmaFeatures: { arrowFunctions: true },
        errors: [
            { column: 3, line: 1, type: "Punctuator" },
            { column: 10, line: 1, type: "Punctuator" }
        ]
    },
    {
        code: "(a)  =>\n{}",
        output: "(a)  =>{}",
        options: [{ after: false }],
        ecmaFeatures: { arrowFunctions: true },
        errors: [
            { column: 1, line: 2, type: "Punctuator" }
        ]
    }
];

ruleTester.run("arrow-spacing", rule, {
    valid: valid,
    invalid: invalid
});
