/**
 * @fileoverview Disallow redundant return statements
 * @author Teddy Katz
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-useless-return"),
    RuleTester = require("../../../lib/testers/rule-tester");


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-useless-return", rule, {

    valid: [
        "function foo() { return 5; }",
        "function foo() { return null; }",
        "function foo() { return doSomething(); }",
        `
          function foo() {
            if (bar) {
              doSomething();
              return;
            } else {
              doSomethingElse();
            }
            qux();
          }
        `,
        `
          function foo() {
            switch (bar) {
              case 1:
                doSomething();
                return;
              default:
                doSomethingElse();
            }
          }
        `,
        `
          function foo() {
            switch (bar) {
              default:
                doSomething();
                return;
              case 1:
                doSomethingElse();
            }
          }
        `,
        `
          function foo() {
            switch (bar) {
              case 1:
                if (a) {
                  doSomething();
                  return;
                } else {
                  doSomething();
                  return;
                }
              default:
                doSomethingElse();
            }
          }
        `,
        `
          function foo() {
            for (var foo = 0; foo < 10; foo++) {
              return;
            }
          }
        `,
        `
          function foo() {
            for (var foo in bar) {
              return;
            }
          }
        `,
        `
          function foo() {
            try {
              return 5;
            } finally {
              return; // This is allowed because it can override the returned value of 5
            }
          }
        `,
        `
          function foo() {
            return;
            doSomething();
          }
        `,
        {
            code: `
              function foo() {
                for (var foo of bar) return;
              }
            `,
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "() => { if (foo) return; bar(); }",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "() => 5",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "() => { return; doSomething(); }",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "if (foo) { return; } doSomething();",
            parserOptions: { ecmaFeatures: { globalReturn: true } }
        },

        // https://github.com/eslint/eslint/issues/7477
        `
          function foo() {
            if (bar) return;
            return baz;
          }
        `,
        `
          function foo() {
            if (bar) {
              return;
            }
            return baz;
          }
        `,
        `
          function foo() {
            if (bar) baz();
            else return;
            return 5;
          }
        `,

        // https://github.com/eslint/eslint/issues/7583
        `
          function foo() {
            return;
            while (foo) return;
            foo;
          }
        `,

        // https://github.com/eslint/eslint/issues/7855
        `
          try {
            throw new Error('foo');
            while (false);
          } catch (err) {}
        `
    ],

    invalid: [
        {
            code: "function foo() { return; }",
            output: "function foo() {  }"
        },
        {
            code: "function foo() { doSomething(); return; }",
            output: "function foo() { doSomething();  }"
        },
        {
            code: "function foo() { if (condition) { bar(); return; } else { baz(); } }",
            output: "function foo() { if (condition) { bar();  } else { baz(); } }"
        },
        {
            code: "function foo() { if (foo) return; }",
            output: "function foo() { if (foo) return; }"
        },
        {
            code: "foo(); return;",
            output: "foo(); ",
            parserOptions: { ecmaFeatures: { globalReturn: true } }
        },
        {
            code: "if (foo) { bar(); return; } else { baz(); }",
            output: "if (foo) { bar();  } else { baz(); }",
            parserOptions: { ecmaFeatures: { globalReturn: true } }
        },
        {
            code: `
              function foo() {
                if (foo) {
                  return;
                }
                return;
              }
            `,
            output: `
              function foo() {
                if (foo) {
                  
                }
                return;
              }
            `, // Other case is fixed in the second pass.
            errors: [
                { message: "Unnecessary return statement.", type: "ReturnStatement" },
                { message: "Unnecessary return statement.", type: "ReturnStatement" }
            ]
        },
        {
            code: `
              function foo() {
                switch (bar) {
                  case 1:
                    doSomething();
                  default:
                    doSomethingElse();
                    return;
                }
              }
            `,
            output: `
              function foo() {
                switch (bar) {
                  case 1:
                    doSomething();
                  default:
                    doSomethingElse();
                    
                }
              }
            `
        },
        {
            code: `
              function foo() {
                switch (bar) {
                  default:
                    doSomething();
                  case 1:
                    doSomething();
                    return;
                }
              }
            `,
            output: `
              function foo() {
                switch (bar) {
                  default:
                    doSomething();
                  case 1:
                    doSomething();
                    
                }
              }
            `
        },
        {
            code: `
              function foo() {
                switch (bar) {
                  case 1:
                    if (a) {
                      doSomething();
                      return;
                    }
                    break;
                  default:
                    doSomethingElse();
                }
              }
            `,
            output: `
              function foo() {
                switch (bar) {
                  case 1:
                    if (a) {
                      doSomething();
                      
                    }
                    break;
                  default:
                    doSomethingElse();
                }
              }
            `
        },
        {
            code: `
              function foo() {
                switch (bar) {
                  case 1:
                    if (a) {
                      doSomething();
                      return;
                    } else {
                      doSomething();
                    }
                    break;
                  default:
                    doSomethingElse();
                }
              }
            `,
            output: `
              function foo() {
                switch (bar) {
                  case 1:
                    if (a) {
                      doSomething();
                      
                    } else {
                      doSomething();
                    }
                    break;
                  default:
                    doSomethingElse();
                }
              }
            `
        },
        {
            code: `
              function foo() {
                switch (bar) {
                  case 1:
                    if (a) {
                      doSomething();
                      return;
                    }
                  default:
                }
              }
            `,
            output: `
              function foo() {
                switch (bar) {
                  case 1:
                    if (a) {
                      doSomething();
                      
                    }
                  default:
                }
              }
            `
        },
        {
            code: `
              function foo() {
                try {} catch (err) { return; }
              }
            `,
            output: `
              function foo() {
                try {} catch (err) {  }
              }
            `
        },

        /*
         * FIXME: Re-add this case (removed due to https://github.com/eslint/eslint/issues/7481):
         * https://github.com/eslint/eslint/blob/261d7287820253408ec87c344beccdba2fe829a4/tests/lib/rules/no-useless-return.js#L308-L329
         */

        {
            code: `
              function foo() {
                try {} finally {}
                return;
              }
            `,
            output: `
              function foo() {
                try {} finally {}
                
              }
            `
        },
        {
            code: `
              function foo() {
                try {
                  return 5;
                } finally {
                  function bar() {
                    return;
                  }
                }
              }
            `,
            output: `
              function foo() {
                try {
                  return 5;
                } finally {
                  function bar() {
                    
                  }
                }
              }
            `
        },
        {
            code: "() => { return; }",
            output: "() => {  }",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "function foo() { return; return; }",
            output: "function foo() {  return; }", // Other case is fixed in the second pass.
            errors: [
                { message: "Unnecessary return statement.", type: "ReturnStatement" },
                { message: "Unnecessary return statement.", type: "ReturnStatement" }
            ]
        }
    ].map(invalidCase => Object.assign({ errors: [{ message: "Unnecessary return statement.", type: "ReturnStatement" }] }, invalidCase))
});
