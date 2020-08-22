/**
 * @fileoverview Disallow redundant continue statements
 * @author Fabrice TIERCELIN
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-useless-continue"),
    { RuleTester } = require("../../../lib/rule-tester");


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-useless-continue", rule, {

    valid: [
        `
          function foo() {
            var sum = 0,
                i;

            for(i = 0; i < 10; i++) {
                if(i >= 5) {
                    continue;
                }
            
                sum += i;
            }
          }
        `,
        `
          function foo() {
            var sum = 0,
                i;

            doNotLoseMe: for(k = 0; k < 10; k++) {
                for(i = 0; i < 10; i++) {
                    sum += i;
                    continue doNotLoseMe;
                }
            }
          }
        `,
        `
          function foo() {
            for(k = 0; k < 10; k++) {
                switch (bar) {
                  case 3:
                    doSomething();
                    continue;
                  default:
                    doSomethingElse();
                }
            }
          }
        `
    ],

    invalid: [
        {
            code: "function foo() {var i = 0;while (i < 10) { i++;continue; } }",
            output: "function foo() {var i = 0;while (i < 10) { i++; } }"
        },
        {
            code: "function foo() {var i = 0;do { i++;continue; } while (i < 10); }",
            output: "function foo() {var i = 0;do { i++; } while (i < 10); }"
        },
        {
            code: "function foo() {var i = 0;do { i++;if (i >= 5) { continue; } } while (i < 10); }",
            output: "function foo() {var i = 0;do { i++;if (i >= 5) {  } } while (i < 10); }"
        },
        {
            code: "function foo() {for(i = 0; i < 10; i++) { continue; } }",
            output: "function foo() {for(i = 0; i < 10; i++) {  } }"
        },
        {
            code: `
              function foo() {
                for(j = 0; j < 20; j++) {
                  switch (bar) {
                    case 4:
                      doSomething();
                    default:
                      doSomethingElse();
                      continue;
                  }
                }
              }
            `,
            output: `
              function foo() {
                for(j = 0; j < 20; j++) {
                  switch (bar) {
                    case 4:
                      doSomething();
                    default:
                      doSomethingElse();
                      
                  }
                }
              }
            `
        }
    ].map(invalidCase => Object.assign({ errors: [{ messageId: "unnecessaryContinue", type: "ContinueStatement" }] }, invalidCase))
});
