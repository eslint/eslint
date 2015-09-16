/**
 * @fileoverview Tests for space-before-block rule.
 * @author Mathias Schreck <https://github.com/lo1tuma>
 * @copyright 2014 Mathias Schreck. All rights reserved.
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/space-before-blocks"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester(),
    neverArgs = ["never"],
    expectedSpacingErrorMessage = "Missing space before opening brace.",
    expectedSpacingError = { message: expectedSpacingErrorMessage },
    expectedNoSpacingError = { message: "Unexpected space before opening brace."};

ruleTester.run("space-before-blocks", rule, {
    valid: [
        { code: "if(a) {}" },
        { code: "if(a)  {}" },
        { code: "if(a){}", options: neverArgs },
        { code: "if(a)\n{}" },
        { code: "if(a)\n{}", options: neverArgs },
        { code: "if(a) {}else {}" },
        { code: "if(a){}else{}", options: neverArgs },
        { code: "function a() {}" },
        { code: "function a(){}", options: neverArgs },
        { code: "switch(a.b(c < d)) { case 'foo': foo(); break; default: if (a) { bar(); } }" },
        { code: "switch(a) { }" },
        { code: "switch(a)  {}" },
        { code: "switch(a.b(c < d)){ case 'foo': foo(); break; default: if (a){ bar(); } }", options: neverArgs },
        { code: "switch(a){}", options: neverArgs },
        { code: "try {}catch(a) {}" },
        { code: "try{}catch(a){}", options: neverArgs },
        { code: "for(;;) {}" },
        { code: "for(;;){}", options: neverArgs },
        { code: "while(a) {}" },
        { code: "while(a){}", options: neverArgs },
        {
            code: "class test{}",
            options: neverArgs,
            ecmaFeatures: {
                classes: true
            }
        },
        {
            code: "class test {}",
            ecmaFeatures: {
                classes: true
            }
        },

        // https://github.com/eslint/eslint/issues/3769
        {code: "()=>{};", options: ["always"], ecmaFeatures: {arrowFunctions: true}},
        {code: "() => {};", options: ["never"], ecmaFeatures: {arrowFunctions: true}}
    ],
    invalid: [
        {
            code: "if(a){}",
            errors: [ { message: expectedSpacingErrorMessage, line: 1, column: 6 } ],
            output: "if(a) {}"
        },
        {
            code: "if(a) {}",
            options: neverArgs,
            errors: [ expectedNoSpacingError ],
            output: "if(a){}"
        },
        {
            code: "if(a) {}else{}",
            errors: [ expectedSpacingError ],
            output: "if(a) {}else {}"
        },
        {
            code: "if(a){}else {}",
            options: neverArgs,
            errors: [ expectedNoSpacingError ],
            output: "if(a){}else{}"
        },
        {
            code: "function a(){}",
            errors: [ expectedSpacingError ],
            output: "function a() {}"
        },
        {
            code: "function a() {}",
            options: neverArgs,
            errors: [ expectedNoSpacingError ],
            output: "function a(){}"
        },
        {
            code: "function a()    {}",
            options: neverArgs,
            errors: [ expectedNoSpacingError ],
            output: "function a(){}"
        },
        {
            code: "switch(a){}",
            errors: [ expectedSpacingError ],
            output: "switch(a) {}"
        },
        {
            code: "switch(a) {}",
            options: neverArgs,
            errors: [ expectedNoSpacingError ],
            output: "switch(a){}"
        },
        {
            code: "switch(a.b()){ case 'foo': foo(); break; default: if (a) { bar(); } }",
            errors: [ expectedSpacingError ],
            output: "switch(a.b()) { case 'foo': foo(); break; default: if (a) { bar(); } }"
        },
        {
            code: "switch(a.b()) { case 'foo': foo(); break; default: if (a){ bar(); } }",
            options: neverArgs,
            errors: [ expectedNoSpacingError ],
            output: "switch(a.b()){ case 'foo': foo(); break; default: if (a){ bar(); } }"
        },
        {
            code: "try{}catch(a){}",
            errors: [ expectedSpacingError, expectedSpacingError ],
            output: "try {}catch(a) {}"
        },
        {
            code: "try {}catch(a) {}",
            options: neverArgs,
            errors: [ expectedNoSpacingError, expectedNoSpacingError ],
            output: "try{}catch(a){}"
        },
        {
            code: "for(;;){}",
            errors: [ expectedSpacingError ],
            output: "for(;;) {}"
        },
        {
            code: "for(;;) {}",
            options: neverArgs,
            errors: [ expectedNoSpacingError ],
            output: "for(;;){}"
        },
        {
            code: "while(a){}",
            errors: [ expectedSpacingError ],
            output: "while(a) {}"
        },
        {
            code: "while(a) {}",
            options: neverArgs,
            errors: [ expectedNoSpacingError ],
            output: "while(a){}"
        },
        {
            code: "class test{}",
            ecmaFeatures: {
                classes: true
            },
            errors: [ expectedSpacingError ],
            output: "class test {}"
        },
        {
            code: "class test {}",
            options: neverArgs,
            ecmaFeatures: {
                classes: true
            },
            errors: [ expectedNoSpacingError ],
            output: "class test{}"
        }
    ]
});
