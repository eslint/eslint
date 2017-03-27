/**
 * @fileoverview Tests for no-else-return rule.
 * @author Ian Christian Myers
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-else-return"),
    RuleTester = require("../../../lib/testers/rule-tester");

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
        `
    ],
    invalid: [
        {
            code: "function foo1() { if (true) { return x; } else { return y; } }",
            output: "function foo1() { if (true) { return x; }  return y;  }",
            errors: [{ message: "Unnecessary 'else' after 'return'.", type: "BlockStatement" }]
        },
        {
            code: "function foo2() { if (true) { var x = bar; return x; } else { var y = baz; return y; } }",
            output: "function foo2() { if (true) { var x = bar; return x; }  var y = baz; return y;  }",
            errors: [{ message: "Unnecessary 'else' after 'return'.", type: "BlockStatement" }]
        },
        {
            code: "function foo3() { if (true) return x; else return y; }",
            output: "function foo3() { if (true) return x; return y; }",
            errors: [{ message: "Unnecessary 'else' after 'return'.", type: "ReturnStatement" }] },
        {
            code: "function foo4() { if (true) { if (false) return x; else return y; } else { return z; } }",
            output: "function foo4() { if (true) { if (false) return x; return y; } else { return z; } }",  // Other case is fixed in the second pass.
            errors: [{ message: "Unnecessary 'else' after 'return'.", type: "ReturnStatement" }, { message: "Unnecessary 'else' after 'return'.", type: "BlockStatement" }]
        },
        {
            code: "function foo5() { if (true) { if (false) { if (true) return x; else { w = y; } } else { w = x; } } else { return z; } }",
            output: "function foo5() { if (true) { if (false) { if (true) return x;  w = y;  } else { w = x; } } else { return z; } }",
            errors: [{ message: "Unnecessary 'else' after 'return'.", type: "BlockStatement" }]
        },
        {
            code: "function foo6() { if (true) { if (false) { if (true) return x; else return y; } } else { return z; } }",
            output: "function foo6() { if (true) { if (false) { if (true) return x; return y; } } else { return z; } }",
            errors: [{ message: "Unnecessary 'else' after 'return'.", type: "ReturnStatement" }]
        },
        {
            code: "function foo7() { if (true) { if (false) { if (true) return x; else return y; } return w; } else { return z; } }",
            output: "function foo7() { if (true) { if (false) { if (true) return x; return y; } return w; } else { return z; } }",  // Other case is fixed in the second pass.
            errors: [
                { message: "Unnecessary 'else' after 'return'.", type: "ReturnStatement" },
                { message: "Unnecessary 'else' after 'return'.", type: "BlockStatement" }
            ]
        },
        {
            code: "function foo8() { if (true) { if (false) { if (true) return x; else return y; } else { w = x; } } else { return z; } }",
            output: "function foo8() { if (true) { if (false) { if (true) return x; return y; } else { w = x; } } else { return z; } }",  // Other case is fixed in the second pass.
            errors: [
                { message: "Unnecessary 'else' after 'return'.", type: "ReturnStatement" },
                { message: "Unnecessary 'else' after 'return'.", type: "BlockStatement" }
            ]
        },
        {
            code: "function foo9() {if (x) { return true; } else if (y) { return true; } else { notAReturn(); } }",
            output: "function foo9() {if (x) { return true; } else if (y) { return true; }  notAReturn();  }",
            errors: [{ message: "Unnecessary 'else' after 'return'.", type: "BlockStatement" }]
        },
        {
            code: "function foo10() { if (foo) return bar; else (foo).bar(); }",
            output: "function foo10() { if (foo) return bar; (foo).bar(); }",
            errors: [{ message: "Unnecessary 'else' after 'return'.", type: "ExpressionStatement" }]
        },
        {
            code: "function foo11() { if (foo) return bar \nelse { [1, 2, 3].map(foo) } }",
            output: null,
            errors: [{ message: "Unnecessary 'else' after 'return'.", type: "BlockStatement" }]
        },
        {
            code: "function foo12() { if (foo) return bar \nelse { baz() } \n[1, 2, 3].map(foo) }",
            output: null,
            errors: [{ message: "Unnecessary 'else' after 'return'.", type: "BlockStatement" }]
        },
        {
            code: "function foo13() { if (foo) return bar; \nelse { [1, 2, 3].map(foo) } }",
            output: "function foo13() { if (foo) return bar; \n [1, 2, 3].map(foo)  }",
            errors: [{ message: "Unnecessary 'else' after 'return'.", type: "BlockStatement" }]
        },
        {
            code: "function foo14() { if (foo) return bar \nelse { baz(); } \n[1, 2, 3].map(foo) }",
            output: "function foo14() { if (foo) return bar \n baz();  \n[1, 2, 3].map(foo) }",
            errors: [{ message: "Unnecessary 'else' after 'return'.", type: "BlockStatement" }]
        },
        {
            code: "function foo15() { if (foo) return bar; else { baz() } qaz() }",
            output: null,
            errors: [{ message: "Unnecessary 'else' after 'return'.", type: "BlockStatement" }]
        },
        {
            code: "function foo16() { if (foo) return bar \nelse { baz() } qaz() }",
            output: null,
            errors: [{ message: "Unnecessary 'else' after 'return'.", type: "BlockStatement" }]
        },
        {
            code: "function foo17() { if (foo) return bar \nelse { baz() } \nqaz() }",
            output: "function foo17() { if (foo) return bar \n baz()  \nqaz() }",
            errors: [{ message: "Unnecessary 'else' after 'return'.", type: "BlockStatement" }]
        },
        {
            code: "function foo18() { if (foo) return function() {} \nelse [1, 2, 3].map(bar) }",
            output: null,
            errors: [{ message: "Unnecessary 'else' after 'return'.", type: "ExpressionStatement" }]
        }
    ]
});
