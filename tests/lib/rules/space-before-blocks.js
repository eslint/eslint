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
        }
    ],
    invalid: [
        {
            code: "if(a){}",
            errors: [ { message: expectedSpacingErrorMessage, line: 1, column: 6 } ]
        },
        {
            code: "if(a) {}",
            options: neverArgs,
            errors: [ expectedNoSpacingError ]
        },
        {
            code: "if(a) {}else{}",
            errors: [ expectedSpacingError ]
        },
        {
            code: "if(a){}else {}",
            options: neverArgs,
            errors: [ expectedNoSpacingError ]
        },
        {
            code: "function a(){}",
            errors: [ expectedSpacingError ]
        },
        {
            code: "function a() {}",
            options: neverArgs,
            errors: [ expectedNoSpacingError ]
        },
        {
            code: "switch(a){}",
            errors: [ expectedSpacingError ]
        },
        {
            code: "switch(a) {}",
            options: neverArgs,
            errors: [ expectedNoSpacingError ]
        },
        {
            code: "switch(a.b()){ case 'foo': foo(); break; default: if (a) { bar(); } }",
            errors: [ expectedSpacingError ]
        },
        {
            code: "switch(a.b()) { case 'foo': foo(); break; default: if (a){ bar(); } }",
            options: neverArgs,
            errors: [ expectedNoSpacingError ]
        },
        {
            code: "try{}catch(a){}",
            errors: [ expectedSpacingError, expectedSpacingError ]
        },
        {
            code: "try {}catch(a) {}",
            options: neverArgs,
            errors: [ expectedNoSpacingError, expectedNoSpacingError ]
        },
        {
            code: "for(;;){}",
            errors: [ expectedSpacingError ]
        },
        {
            code: "for(;;) {}",
            options: neverArgs,
            errors: [ expectedNoSpacingError ]
        },
        {
            code: "while(a){}",
            errors: [ expectedSpacingError ]
        },
        {
            code: "while(a) {}",
            options: neverArgs,
            errors: [ expectedNoSpacingError ]
        },
        {
            code: "class test{}",
            ecmaFeatures: {
                classes: true
            },
            errors: [ expectedSpacingError ]
        },
        {
            code: "class test {}",
            options: neverArgs,
            ecmaFeatures: {
                classes: true
            },
            errors: [ expectedNoSpacingError ]
        }
    ]
});
