/**
 * @fileoverview Tests for space-before-block rule.
 * @author Mathias Schreck <https://github.com/lo1tuma>
 * @copyright 2014 Mathias Schreck. All rights reserved.
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslint = require("../../../lib/eslint"),
    ESLintTester = require("eslint-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var eslintTester = new ESLintTester(eslint),
    neverArgs = [1, "never"],
    expectedSpacingErrorMessage = "Missing space before opening brace.",
    expectedSpacingError = { message: expectedSpacingErrorMessage },
    expectedNoSpacingError = { message: "Unexpected space before opening brace."};

eslintTester.addRuleTest("lib/rules/space-before-blocks", {
    valid: [
        { code: "if(a) {}" },
        { code: "if(a)  {}" },
        { code: "if(a){}", args: neverArgs },
        { code: "if(a)\n{}" },
        { code: "if(a)\n{}", args: neverArgs },
        { code: "if(a) {}else {}" },
        { code: "if(a){}else{}", args: neverArgs },
        { code: "function a() {}" },
        { code: "function a(){}", args: neverArgs },
        { code: "switch(a.b(c < d)) { case 'foo': foo(); break; default: if (a) { bar(); } }" },
        { code: "switch(a) { }" },
        { code: "switch(a)  {}" },
        { code: "switch(a.b(c < d)){ case 'foo': foo(); break; default: if (a){ bar(); } }", args: neverArgs },
        { code: "switch(a){}", args: neverArgs },
        { code: "try {}catch(a) {}" },
        { code: "try{}catch(a){}", args: neverArgs },
        { code: "for(;;) {}" },
        { code: "for(;;){}", args: neverArgs },
        { code: "while(a) {}" },
        { code: "while(a){}", args: neverArgs }
    ],
    invalid: [
        {
            code: "if(a){}",
            errors: [ { message: expectedSpacingErrorMessage, line: 1, column: 5 } ]
        },
        {
            code: "if(a) {}",
            args: neverArgs,
            errors: [ expectedNoSpacingError ]
        },
        {
            code: "if(a) {}else{}",
            errors: [ expectedSpacingError ]
        },
        {
            code: "if(a){}else {}",
            args: neverArgs,
            errors: [ expectedNoSpacingError ]
        },
        {
            code: "function a(){}",
            errors: [ expectedSpacingError ]
        },
        {
            code: "function a() {}",
            args: neverArgs,
            errors: [ expectedNoSpacingError ]
        },
        {
            code: "switch(a){}",
            errors: [ expectedSpacingError ]
        },
        {
            code: "switch(a) {}",
            args: neverArgs,
            errors: [ expectedNoSpacingError ]
        },
        {
            code: "switch(a.b()){ case 'foo': foo(); break; default: if (a) { bar(); } }",
            errors: [ expectedSpacingError ]
        },
        {
            code: "switch(a.b()) { case 'foo': foo(); break; default: if (a){ bar(); } }",
            args: neverArgs,
            errors: [ expectedNoSpacingError ]
        },
        {
            code: "try{}catch(a){}",
            errors: [ expectedSpacingError, expectedSpacingError ]
        },
        {
            code: "try {}catch(a) {}",
            args: neverArgs,
            errors: [ expectedNoSpacingError, expectedNoSpacingError ]
        },
        {
            code: "for(;;){}",
            errors: [ expectedSpacingError ]
        },
        {
            code: "for(;;) {}",
            args: neverArgs,
            errors: [ expectedNoSpacingError ]
        },
        {
            code: "while(a){}",
            errors: [ expectedSpacingError ]
        },
        {
            code: "while(a) {}",
            args: neverArgs,
            errors: [ expectedNoSpacingError ]
        }
    ]
});
