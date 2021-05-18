/**
 * @fileoverview Tests for arrow-spacing
 * @author Jxck
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------
//

const rule = require("../../../lib/rules/arrow-spacing"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 6 } });

const valid = [
    {
        code: "a => a",
        options: [{ after: true, before: true }]
    },
    {
        code: "() => {}",
        options: [{ after: true, before: true }]
    },
    {
        code: "(a) => {}",
        options: [{ after: true, before: true }]
    },
    {
        code: "a=> a",
        options: [{ after: true, before: false }]
    },
    {
        code: "()=> {}",
        options: [{ after: true, before: false }]
    },
    {
        code: "(a)=> {}",
        options: [{ after: true, before: false }]
    },
    {
        code: "a =>a",
        options: [{ after: false, before: true }]
    },
    {
        code: "() =>{}",
        options: [{ after: false, before: true }]
    },
    {
        code: "(a) =>{}",
        options: [{ after: false, before: true }]
    },
    {
        code: "a=>a",
        options: [{ after: false, before: false }]
    },
    {
        code: "()=>{}",
        options: [{ after: false, before: false }]
    },
    {
        code: "(a)=>{}",
        options: [{ after: false, before: false }]
    },
    {
        code: "a => a",
        options: [{}]
    },
    {
        code: "() => {}",
        options: [{}]
    },
    {
        code: "(a) => {}",
        options: [{}]
    },
    "(a) =>\n{}",
    "(a) =>\r\n{}",
    "(a) =>\n    0"
];


const invalid = [
    {
        code: "a=>a",
        output: "a => a",
        options: [{ after: true, before: true }],
        errors: [
            { column: 1, line: 1, type: "Identifier", messageId: "expectedBefore" },
            { column: 4, line: 1, type: "Identifier", messageId: "expectedAfter" }
        ]
    },
    {
        code: "()=>{}",
        output: "() => {}",
        options: [{ after: true, before: true }],
        errors: [
            { column: 2, line: 1, type: "Punctuator", messageId: "expectedBefore" },
            { column: 5, line: 1, type: "Punctuator", messageId: "expectedAfter" }
        ]
    },
    {
        code: "(a)=>{}",
        output: "(a) => {}",
        options: [{ after: true, before: true }],
        errors: [
            { column: 3, line: 1, type: "Punctuator", messageId: "expectedBefore" },
            { column: 6, line: 1, type: "Punctuator", messageId: "expectedAfter" }
        ]
    },
    {
        code: "a=> a",
        output: "a =>a",
        options: [{ after: false, before: true }],
        errors: [
            { column: 1, line: 1, type: "Identifier", messageId: "expectedBefore" },
            { column: 5, line: 1, type: "Identifier", messageId: "unexpectedAfter" }
        ]
    },
    {
        code: "()=> {}",
        output: "() =>{}",
        options: [{ after: false, before: true }],
        errors: [
            { column: 2, line: 1, type: "Punctuator", messageId: "expectedBefore" },
            { column: 6, line: 1, type: "Punctuator", messageId: "unexpectedAfter" }
        ]
    },
    {
        code: "(a)=> {}",
        output: "(a) =>{}",
        options: [{ after: false, before: true }],
        errors: [
            { column: 3, line: 1, type: "Punctuator", messageId: "expectedBefore" },
            { column: 7, line: 1, type: "Punctuator", messageId: "unexpectedAfter" }
        ]
    },
    {
        code: "a=>  a",
        output: "a =>a",
        options: [{ after: false, before: true }],
        errors: [
            { column: 1, line: 1, type: "Identifier", messageId: "expectedBefore" },
            { column: 6, line: 1, type: "Identifier", messageId: "unexpectedAfter" }
        ]
    },
    {
        code: "()=>  {}",
        output: "() =>{}",
        options: [{ after: false, before: true }],
        errors: [
            { column: 2, line: 1, type: "Punctuator", messageId: "expectedBefore" },
            { column: 7, line: 1, type: "Punctuator", messageId: "unexpectedAfter" }
        ]
    },
    {
        code: "(a)=>  {}",
        output: "(a) =>{}",
        options: [{ after: false, before: true }],
        errors: [
            { column: 3, line: 1, type: "Punctuator", messageId: "expectedBefore" },
            { column: 8, line: 1, type: "Punctuator", messageId: "unexpectedAfter" }
        ]
    },
    {
        code: "a =>a",
        output: "a=> a",
        options: [{ after: true, before: false }],
        errors: [
            { column: 1, line: 1, type: "Identifier", messageId: "unexpectedBefore" },
            { column: 5, line: 1, type: "Identifier", messageId: "expectedAfter" }
        ]
    },
    {
        code: "() =>{}",
        output: "()=> {}",
        options: [{ after: true, before: false }],
        errors: [
            { column: 2, line: 1, type: "Punctuator", messageId: "unexpectedBefore" },
            { column: 6, line: 1, type: "Punctuator", messageId: "expectedAfter" }
        ]
    },
    {
        code: "(a) =>{}",
        output: "(a)=> {}",
        options: [{ after: true, before: false }],
        errors: [
            { column: 3, line: 1, type: "Punctuator", messageId: "unexpectedBefore" },
            { column: 7, line: 1, type: "Punctuator", messageId: "expectedAfter" }
        ]
    },
    {
        code: "a  =>a",
        output: "a=> a",
        options: [{ after: true, before: false }],
        errors: [
            { column: 1, line: 1, type: "Identifier", messageId: "unexpectedBefore" },
            { column: 6, line: 1, type: "Identifier", messageId: "expectedAfter" }
        ]
    },
    {
        code: "()  =>{}",
        output: "()=> {}",
        options: [{ after: true, before: false }],
        errors: [
            { column: 2, line: 1, type: "Punctuator", messageId: "unexpectedBefore" },
            { column: 7, line: 1, type: "Punctuator", messageId: "expectedAfter" }
        ]
    },
    {
        code: "(a)  =>{}",
        output: "(a)=> {}",
        options: [{ after: true, before: false }],
        errors: [
            { column: 3, line: 1, type: "Punctuator", messageId: "unexpectedBefore" },
            { column: 8, line: 1, type: "Punctuator", messageId: "expectedAfter" }
        ]
    },
    {
        code: "a => a",
        output: "a=>a",
        options: [{ after: false, before: false }],
        errors: [
            { column: 1, line: 1, type: "Identifier", messageId: "unexpectedBefore" },
            { column: 6, line: 1, type: "Identifier", messageId: "unexpectedAfter" }
        ]
    },
    {
        code: "() => {}",
        output: "()=>{}",
        options: [{ after: false, before: false }],
        errors: [
            { column: 2, line: 1, type: "Punctuator", messageId: "unexpectedBefore" },
            { column: 7, line: 1, type: "Punctuator", messageId: "unexpectedAfter" }
        ]
    },
    {
        code: "(a) => {}",
        output: "(a)=>{}",
        options: [{ after: false, before: false }],
        errors: [
            { column: 3, line: 1, type: "Punctuator", messageId: "unexpectedBefore" },
            { column: 8, line: 1, type: "Punctuator", messageId: "unexpectedAfter" }
        ]
    },
    {
        code: "a  =>  a",
        output: "a=>a",
        options: [{ after: false, before: false }],
        errors: [
            { column: 1, line: 1, type: "Identifier", messageId: "unexpectedBefore" },
            { column: 8, line: 1, type: "Identifier", messageId: "unexpectedAfter" }
        ]
    },
    {
        code: "()  =>  {}",
        output: "()=>{}",
        options: [{ after: false, before: false }],
        errors: [
            { column: 2, line: 1, type: "Punctuator", messageId: "unexpectedBefore" },
            { column: 9, line: 1, type: "Punctuator", messageId: "unexpectedAfter" }
        ]
    },
    {
        code: "(a)  =>  {}",
        output: "(a)=>{}",
        options: [{ after: false, before: false }],
        errors: [
            { column: 3, line: 1, type: "Punctuator", messageId: "unexpectedBefore" },
            { column: 10, line: 1, type: "Punctuator", messageId: "unexpectedAfter" }
        ]
    },
    {
        code: "(a)  =>\n{}",
        output: "(a)  =>{}",
        options: [{ after: false }],
        errors: [
            { column: 1, line: 2, type: "Punctuator", messageId: "unexpectedAfter" }
        ]
    },

    // https://github.com/eslint/eslint/issues/7079
    {
        code: "(a = ()=>0)=>1",
        output: "(a = () => 0) => 1",
        errors: [
            { column: 7, line: 1, messageId: "expectedBefore" },
            { column: 10, line: 1, messageId: "expectedAfter" },
            { column: 11, line: 1, messageId: "expectedBefore" },
            { column: 14, line: 1, messageId: "expectedAfter" }
        ]
    },
    {
        code: "(a = ()=>0)=>(1)",
        output: "(a = () => 0) => (1)",
        errors: [
            { column: 7, line: 1, messageId: "expectedBefore" },
            { column: 10, line: 1, messageId: "expectedAfter" },
            { column: 11, line: 1, messageId: "expectedBefore" },
            { column: 14, line: 1, messageId: "expectedAfter" }
        ]
    }
];

ruleTester.run("arrow-spacing", rule, {
    valid,
    invalid
});
