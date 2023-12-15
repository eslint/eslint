/**
 * @fileoverview Disallow redundant return statements
 * @author Teddy Katz
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-useless-return"),
    RuleTester = require("../../../lib/rule-tester/flat-rule-tester");


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
    languageOptions: {
        ecmaVersion: 5,
        sourceType: "script"
    }
});

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
            try {
              bar();
              return;
            } catch (err) {}
            baz();
          }
        `,
        `
          function foo() {
              if (something) {
                  try {
                      bar();
                      return;
                  } catch (err) {}
              }
              baz();
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
            languageOptions: { ecmaVersion: 6 }
        },
        {
            code: "() => { if (foo) return; bar(); }",
            languageOptions: { ecmaVersion: 6 }
        },
        {
            code: "() => 5",
            languageOptions: { ecmaVersion: 6 }
        },
        {
            code: "() => { return; doSomething(); }",
            languageOptions: { ecmaVersion: 6 }
        },
        {
            code: "if (foo) { return; } doSomething();",
            languageOptions: { parserOptions: { ecmaFeatures: { globalReturn: true } } }
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
        `,

        // https://github.com/eslint/eslint/issues/11647
        `
          function foo(arg) {
            throw new Error("Debugging...");
            if (!arg) {
              return;
            }
            console.log(arg);
          }
        `,

        // https://github.com/eslint/eslint/pull/16996#discussion_r1138622844
        `
        function foo() {
          try {
              bar();
              return;
          } finally {
              baz();
          }
          qux();
        }
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
            code: "function foo() { bar(); return/**/; }",
            output: null
        },
        {
            code: "function foo() { bar(); return//\n; }",
            output: null
        },
        {
            code: "foo(); return;",
            output: "foo(); ",
            languageOptions: { parserOptions: { ecmaFeatures: { globalReturn: true } } }
        },
        {
            code: "if (foo) { bar(); return; } else { baz(); }",
            output: "if (foo) { bar();  } else { baz(); }",
            languageOptions: { parserOptions: { ecmaFeatures: { globalReturn: true } } }
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
                { messageId: "unnecessaryReturn", type: "ReturnStatement" },
                { messageId: "unnecessaryReturn", type: "ReturnStatement" }
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
        {
            code: `
              function foo() {
                try {
                  foo();
                  return;
                } catch (err) {
                  return 5;
                }
              }
            `,
            output: `
              function foo() {
                try {
                  foo();
                  
                } catch (err) {
                  return 5;
                }
              }
            `
        },
        {
            code: `
              function foo() {
                  if (something) {
                      try {
                          bar();
                          return;
                      } catch (err) {}
                  }
              }
            `,
            output: `
              function foo() {
                  if (something) {
                      try {
                          bar();
                          
                      } catch (err) {}
                  }
              }
            `
        },
        {
            code: `
              function foo() {
                try {
                  return;
                } catch (err) {
                  foo();
                }
              }
            `,
            output: `
              function foo() {
                try {
                  
                } catch (err) {
                  foo();
                }
              }
            `
        },
        {
            code: `
              function foo() {
                  try {
                      return;
                  } finally {
                      bar();
                  }
              }
            `,
            output: `
              function foo() {
                  try {
                      
                  } finally {
                      bar();
                  }
              }
            `
        },
        {
            code: `
              function foo() {
                try {
                  bar();
                } catch (e) {
                  try {
                    baz();
                    return;
                  } catch (e) {
                    qux();
                  }
                }
              }
            `,
            output: `
              function foo() {
                try {
                  bar();
                } catch (e) {
                  try {
                    baz();
                    
                  } catch (e) {
                    qux();
                  }
                }
              }
            `
        },
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
            languageOptions: { ecmaVersion: 6 }
        },
        {
            code: "function foo() { return; return; }",
            output: "function foo() {  return; }",
            errors: [
                {
                    messageId: "unnecessaryReturn",
                    type: "ReturnStatement",
                    column: 18
                }
            ]
        }
    ].map(invalidCase =>
        Object.assign(
            {
                errors: [
                    { messageId: "unnecessaryReturn", type: "ReturnStatement" }
                ]
            },
            invalidCase
        ))
});
