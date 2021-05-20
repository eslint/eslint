/**
 * @fileoverview Tests for no-else-return rule.
 * @author Ian Christian Myers
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-else-return"),
    { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-else-return", rule, {
    valid: [
        "function foo() { if (true) { if (false) { return x; } } else { return y; } }",
        "function foo() { if (true) { return x; } return y; }",
        "function foo() { if (true) { for (;;) { return x; } } else { return y; } }",
        "function foo() { var x = true; if (x) { return x; } else if (x === false) { return false; } }",
        "function foo() { if (true) notAReturn(); else return y; }",
        "function foo() {if (x) { notAReturn(); } else if (y) { return true; } else { notAReturn(); } }",
        "function foo() {if (x) { return true; } else if (y) { notAReturn() } else { notAReturn(); } }",
        "if (0) { if (0) {} else {} } else {}",
        `
            function foo() {
                if (foo)
                    if (bar) return;
                    else baz;
                else qux;
            }
        `,
        `
            function foo() {
                while (foo)
                    if (bar) return;
                    else baz;
            }
        `,
        {
            code: "function foo19() { if (true) { return x; } else if (false) { return y; } }",
            options: [{ allowElseIf: true }]
        },
        {
            code: "function foo20() {if (x) { return true; } else if (y) { notAReturn() } else { notAReturn(); } }",
            options: [{ allowElseIf: true }]
        },
        {
            code: "function foo21() { var x = true; if (x) { return x; } else if (x === false) { return false; } }",
            options: [{ allowElseIf: true }]
        }
    ],
    invalid: [
        {
            code: "function foo1() { if (true) { return x; } else { return y; } }",
            output: "function foo1() { if (true) { return x; }  return y;  }",
            errors: [{ messageId: "unexpected", type: "BlockStatement" }]
        },
        {
            code: "function foo2() { if (true) { var x = bar; return x; } else { var y = baz; return y; } }",
            output: "function foo2() { if (true) { var x = bar; return x; }  var y = baz; return y;  }",
            errors: [{ messageId: "unexpected", type: "BlockStatement" }]
        },
        {
            code: "function foo3() { if (true) return x; else return y; }",
            output: "function foo3() { if (true) return x; return y; }",
            errors: [{ messageId: "unexpected", type: "ReturnStatement" }]
        },
        {
            code: "function foo4() { if (true) { if (false) return x; else return y; } else { return z; } }",
            output: "function foo4() { if (true) { if (false) return x; return y; } else { return z; } }", // Other case is fixed in the second pass.
            errors: [{ messageId: "unexpected", type: "ReturnStatement" }, { messageId: "unexpected", type: "BlockStatement" }]
        },
        {
            code: "function foo5() { if (true) { if (false) { if (true) return x; else { w = y; } } else { w = x; } } else { return z; } }",
            output: "function foo5() { if (true) { if (false) { if (true) return x;  w = y;  } else { w = x; } } else { return z; } }",
            errors: [{ messageId: "unexpected", type: "BlockStatement" }]
        },
        {
            code: "function foo6() { if (true) { if (false) { if (true) return x; else return y; } } else { return z; } }",
            output: "function foo6() { if (true) { if (false) { if (true) return x; return y; } } else { return z; } }",
            errors: [{ messageId: "unexpected", type: "ReturnStatement" }]
        },
        {
            code: "function foo7() { if (true) { if (false) { if (true) return x; else return y; } return w; } else { return z; } }",
            output: "function foo7() { if (true) { if (false) { if (true) return x; return y; } return w; } else { return z; } }", // Other case is fixed in the second pass.
            errors: [
                { messageId: "unexpected", type: "ReturnStatement" },
                { messageId: "unexpected", type: "BlockStatement" }
            ]
        },
        {
            code: "function foo8() { if (true) { if (false) { if (true) return x; else return y; } else { w = x; } } else { return z; } }",
            output: "function foo8() { if (true) { if (false) { if (true) return x; return y; } else { w = x; } } else { return z; } }", // Other case is fixed in the second pass.
            errors: [
                { messageId: "unexpected", type: "ReturnStatement" },
                { messageId: "unexpected", type: "BlockStatement" }
            ]
        },
        {
            code: "function foo9() {if (x) { return true; } else if (y) { return true; } else { notAReturn(); } }",
            output: "function foo9() {if (x) { return true; } else if (y) { return true; }  notAReturn();  }",
            errors: [{ messageId: "unexpected", type: "BlockStatement" }]
        },
        {
            code: "function foo9a() {if (x) { return true; } else if (y) { return true; } else { notAReturn(); } }",
            output: "function foo9a() {if (x) { return true; } if (y) { return true; } else { notAReturn(); } }",
            options: [{ allowElseIf: false }],
            errors: [{ messageId: "unexpected", type: "IfStatement" }]
        },
        {
            code: "function foo9b() {if (x) { return true; } if (y) { return true; } else { notAReturn(); } }",
            output: "function foo9b() {if (x) { return true; } if (y) { return true; }  notAReturn();  }",
            options: [{ allowElseIf: false }],
            errors: [{ messageId: "unexpected", type: "BlockStatement" }]
        },
        {
            code: "function foo10() { if (foo) return bar; else (foo).bar(); }",
            output: "function foo10() { if (foo) return bar; (foo).bar(); }",
            errors: [{ messageId: "unexpected", type: "ExpressionStatement" }]
        },
        {
            code: "function foo11() { if (foo) return bar \nelse { [1, 2, 3].map(foo) } }",
            output: null,
            errors: [{ messageId: "unexpected", type: "BlockStatement" }]
        },
        {
            code: "function foo12() { if (foo) return bar \nelse { baz() } \n[1, 2, 3].map(foo) }",
            output: null,
            errors: [{ messageId: "unexpected", type: "BlockStatement" }]
        },
        {
            code: "function foo13() { if (foo) return bar; \nelse { [1, 2, 3].map(foo) } }",
            output: "function foo13() { if (foo) return bar; \n [1, 2, 3].map(foo)  }",
            errors: [{ messageId: "unexpected", type: "BlockStatement" }]
        },
        {
            code: "function foo14() { if (foo) return bar \nelse { baz(); } \n[1, 2, 3].map(foo) }",
            output: "function foo14() { if (foo) return bar \n baz();  \n[1, 2, 3].map(foo) }",
            errors: [{ messageId: "unexpected", type: "BlockStatement" }]
        },
        {
            code: "function foo15() { if (foo) return bar; else { baz() } qaz() }",
            output: null,
            errors: [{ messageId: "unexpected", type: "BlockStatement" }]
        },
        {
            code: "function foo16() { if (foo) return bar \nelse { baz() } qaz() }",
            output: null,
            errors: [{ messageId: "unexpected", type: "BlockStatement" }]
        },
        {
            code: "function foo17() { if (foo) return bar \nelse { baz() } \nqaz() }",
            output: "function foo17() { if (foo) return bar \n baz()  \nqaz() }",
            errors: [{ messageId: "unexpected", type: "BlockStatement" }]
        },
        {
            code: "function foo18() { if (foo) return function() {} \nelse [1, 2, 3].map(bar) }",
            output: null,
            errors: [{ messageId: "unexpected", type: "ExpressionStatement" }]
        },
        {
            code: "function foo19() { if (true) { return x; } else if (false) { return y; } }",
            output: "function foo19() { if (true) { return x; } if (false) { return y; } }",
            options: [{ allowElseIf: false }],
            errors: [{ messageId: "unexpected", type: "IfStatement" }]
        },
        {
            code: "function foo20() {if (x) { return true; } else if (y) { notAReturn() } else { notAReturn(); } }",
            output: "function foo20() {if (x) { return true; } if (y) { notAReturn() } else { notAReturn(); } }",
            options: [{ allowElseIf: false }],
            errors: [{ messageId: "unexpected", type: "IfStatement" }]
        },
        {
            code: "function foo21() { var x = true; if (x) { return x; } else if (x === false) { return false; } }",
            output: "function foo21() { var x = true; if (x) { return x; } if (x === false) { return false; } }",
            options: [{ allowElseIf: false }],
            errors: [{ messageId: "unexpected", type: "IfStatement" }]
        },

        // https://github.com/eslint/eslint/issues/11069
        {
            code: "function foo() { var a; if (bar) { return true; } else { var a; } }",
            output: "function foo() { var a; if (bar) { return true; }  var a;  }",
            errors: [{ messageId: "unexpected", type: "BlockStatement" }]
        },
        {
            code: "function foo() { if (bar) { var a; if (baz) { return true; } else { var a; } } }",
            output: "function foo() { if (bar) { var a; if (baz) { return true; }  var a;  } }",
            errors: [{ messageId: "unexpected", type: "BlockStatement" }]
        },
        {
            code: "function foo() { var a; if (bar) { return true; } else { var a; } }",
            output: "function foo() { var a; if (bar) { return true; }  var a;  }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unexpected", type: "BlockStatement" }]
        },
        {
            code: "function foo() { if (bar) { var a; if (baz) { return true; } else { var a; } } }",
            output: "function foo() { if (bar) { var a; if (baz) { return true; }  var a;  } }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unexpected", type: "BlockStatement" }]
        },
        {
            code: "function foo() { let a; if (bar) { return true; } else { let a; } }",
            output: null,
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unexpected", type: "BlockStatement" }]
        },
        {
            code: "class foo { bar() { let a; if (baz) { return true; } else { let a; } } }",
            output: null,
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unexpected", type: "BlockStatement" }]
        },
        {
            code: "function foo() { if (bar) { let a; if (baz) { return true; } else { let a; } } }",
            output: null,
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unexpected", type: "BlockStatement" }]
        },
        {
            code: "function foo() {let a; if (bar) { if (baz) { return true; } else { let a; } } }",
            output: "function foo() {let a; if (bar) { if (baz) { return true; }  let a;  } }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unexpected", type: "BlockStatement" }]
        },
        {
            code: "function foo() { const a = 1; if (bar) { return true; } else { let a; } }",
            output: null,
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unexpected", type: "BlockStatement" }]
        },
        {
            code: "function foo() { if (bar) { const a = 1; if (baz) { return true; } else { let a; } } }",
            output: null,
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unexpected", type: "BlockStatement" }]
        },
        {
            code: "function foo() { let a; if (bar) { return true; } else { const a = 1 } }",
            output: null,
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unexpected", type: "BlockStatement" }]
        },
        {
            code: "function foo() { if (bar) { let a; if (baz) { return true; } else { const a = 1; } } }",
            output: null,
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unexpected", type: "BlockStatement" }]
        },
        {
            code: "function foo() { class a {}; if (bar) { return true; } else { const a = 1; } }",
            output: null,
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unexpected", type: "BlockStatement" }]
        },
        {
            code: "function foo() { if (bar) { class a {}; if (baz) { return true; } else { const a = 1; } } }",
            output: null,
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unexpected", type: "BlockStatement" }]
        },
        {
            code: "function foo() { const a = 1; if (bar) { return true; } else { class a {} } }",
            output: null,
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unexpected", type: "BlockStatement" }]
        },
        {
            code: "function foo() { if (bar) { const a = 1; if (baz) { return true; } else { class a {} } } }",
            output: null,
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unexpected", type: "BlockStatement" }]
        },
        {
            code: "function foo() { var a; if (bar) { return true; } else { let a; } }",
            output: null,
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unexpected", type: "BlockStatement" }]
        },
        {
            code: "function foo() { if (bar) { var a; return true; } else { let a; } }",
            output: null,
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unexpected", type: "BlockStatement" }]
        },
        {
            code: "function foo() { if (bar) { return true; } else { let a; }  while (baz) { var a; } }",
            output: null,
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unexpected", type: "BlockStatement" }]
        },
        {
            code: "function foo(a) { if (bar) { return true; } else { let a; } }",
            output: null,
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { messageId: "unexpected", type: "BlockStatement" }
            ]
        },
        {
            code: "function foo(a = 1) { if (bar) { return true; } else { let a; } }",
            output: null,
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unexpected", type: "BlockStatement" }]
        },
        {
            code: "function foo(a, b = a) { if (bar) { return true; } else { let a; }  if (bar) { return true; } else { let b; }}",
            output: null,
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { messageId: "unexpected", type: "BlockStatement" },
                { messageId: "unexpected", type: "BlockStatement" }
            ]
        },
        {
            code: "function foo(...args) { if (bar) { return true; } else { let args; } }",
            output: null,
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unexpected", type: "BlockStatement" }]
        },
        {
            code: "function foo() { try {} catch (a) { if (bar) { return true; } else { let a; } } }",
            output: null,
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unexpected", type: "BlockStatement" }]
        },
        {
            code: "function foo() { try {} catch (a) { if (bar) { if (baz) { return true; } else { let a; } } } }",
            output: "function foo() { try {} catch (a) { if (bar) { if (baz) { return true; }  let a;  } } }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unexpected", type: "BlockStatement" }]
        },
        {
            code: "function foo() { try {} catch ({bar, a = 1}) { if (baz) { return true; } else { let a; } } }",
            output: null,
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unexpected", type: "BlockStatement" }]
        },
        {
            code: "function foo() { if (bar) { return true; } else { let arguments; } }",
            output: "function foo() { if (bar) { return true; }  let arguments;  }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unexpected", type: "BlockStatement" }]
        },
        {
            code: "function foo() { if (bar) { return true; } else { let arguments; } return arguments[0]; }",
            output: null,
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unexpected", type: "BlockStatement" }]
        },
        {
            code: "function foo() { if (bar) { return true; } else { let arguments; } if (baz) { return arguments[0]; } }",
            output: null,
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unexpected", type: "BlockStatement" }]
        },
        {
            code: "function foo() { if (bar) { if (baz) { return true; } else { let arguments; } } }",
            output: "function foo() { if (bar) { if (baz) { return true; }  let arguments;  } }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unexpected", type: "BlockStatement" }]
        },
        {
            code: "function foo() { if (bar) { return true; } else { let a; } a; }",
            output: null,
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unexpected", type: "BlockStatement" }]
        },
        {
            code: "function foo() { if (bar) { return true; } else { let a; } if (baz) { a; } }",
            output: null,
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unexpected", type: "BlockStatement" }]
        },
        {
            code: "function foo() { if (bar) { if (baz) { return true; } else { let a; } } a; }",
            output: "function foo() { if (bar) { if (baz) { return true; }  let a;  } a; }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unexpected", type: "BlockStatement" }]
        },
        {
            code: "function foo() { if (bar) { if (baz) { return true; } else { let a; } a; } }",
            output: null,
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unexpected", type: "BlockStatement" }]
        },
        {
            code: "function foo() { if (bar) { if (baz) { return true; } else { let a; } if (quux) { a; } } }",
            output: null,
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unexpected", type: "BlockStatement" }]
        },
        {
            code: "function a() { if (foo) { return true; } else { let a; } a(); }",
            output: null,
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unexpected", type: "BlockStatement" }]
        },
        {
            code: "function a() { if (a) { return true; } else { let a; } }",
            output: null,
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unexpected", type: "BlockStatement" }]
        },
        {
            code: "function a() { if (foo) { return a; } else { let a; } }",
            output: null,
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unexpected", type: "BlockStatement" }]
        },
        {
            code: "function foo() { if (bar) { return true; } else { let a; } function baz() { a; } }",
            output: null,
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unexpected", type: "BlockStatement" }]
        },
        {
            code: "function foo() { if (bar) { if (baz) { return true; } else { let a; } (() => a) } }",
            output: null,
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unexpected", type: "BlockStatement" }]
        },
        {
            code: "function foo() { if (bar) { return true; } else { let a; } var a; }",
            output: null,
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unexpected", type: "BlockStatement" }]
        },
        {
            code: "function foo() { if (bar) { if (baz) { return true; } else { let a; } var a; } }",
            output: null,
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unexpected", type: "BlockStatement" }]
        },
        {
            code: "function foo() { if (bar) { if (baz) { return true; } else { let a; } var { a } = {}; } }",
            output: null,
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unexpected", type: "BlockStatement" }]
        },
        {
            code: "function foo() { if (bar) { if (baz) { return true; } else { let a; } if (quux) { var a; } } }",
            output: null,
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unexpected", type: "BlockStatement" }]
        },
        {
            code: "function foo() { if (bar) { if (baz) { return true; } else { let a; } } if (quux) { var a; } }",
            output: "function foo() { if (bar) { if (baz) { return true; }  let a;  } if (quux) { var a; } }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unexpected", type: "BlockStatement" }]
        },
        {
            code: "function foo() { if (quux) { var a; } if (bar) { if (baz) { return true; } else { let a; } } }",
            output: "function foo() { if (quux) { var a; } if (bar) { if (baz) { return true; }  let a;  } }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unexpected", type: "BlockStatement" }]
        },
        {
            code: "function foo() { if (bar) { return true; } else { let a; } function a(){} }",
            output: null,
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unexpected", type: "BlockStatement" }]
        },
        {
            code: "function foo() { if (baz) { if (bar) { return true; } else { let a; } function a(){} } }",
            output: null,
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unexpected", type: "BlockStatement" }]
        },
        {
            code: "function foo() { if (bar) { if (baz) { return true; } else { let a; } } if (quux) { function a(){}  } }",
            output: "function foo() { if (bar) { if (baz) { return true; }  let a;  } if (quux) { function a(){}  } }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unexpected", type: "BlockStatement" }]
        },
        {
            code: "function foo() { if (bar) { if (baz) { return true; } else { let a; } } function a(){} }",
            output: "function foo() { if (bar) { if (baz) { return true; }  let a;  } function a(){} }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unexpected", type: "BlockStatement" }]
        },
        {
            code: "function foo() { let a; if (bar) { return true; } else { function a(){} } }",
            output: null,
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unexpected", type: "BlockStatement" }]
        },
        {
            code: "function foo() { var a; if (bar) { return true; } else { function a(){} } }",
            output: null,
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unexpected", type: "BlockStatement" }]
        },
        {
            code: "function foo() { if (bar) { return true; } else function baz() {} };",
            output: null,
            errors: [{ messageId: "unexpected", type: "FunctionDeclaration" }]
        },
        {
            code: "if (foo) { return true; } else { let a; }",
            output: "if (foo) { return true; }  let a; ",
            parserOptions: { ecmaVersion: 6 },
            env: { node: true },
            errors: [{ messageId: "unexpected", type: "BlockStatement" }]
        },
        {
            code: "let a; if (foo) { return true; } else { let a; }",
            output: null,
            parserOptions: { ecmaVersion: 6 },
            env: { node: true },
            errors: [{ messageId: "unexpected", type: "BlockStatement" }]
        }
    ]
});
