/**
 * @fileoverview Tests for no-extra-semi rule.
 * @author Nicholas C. Zakas
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-extra-semi"),
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

ruleTester.run("no-extra-semi", rule, {
    valid: [
        "var x = 5;",
        "function foo(){}",
        "for(;;);",
        "while(0);",
        "do;while(0);",
        "for(a in b);",
        { code: "for(a of b);", languageOptions: { ecmaVersion: 6 } },
        "if(true);",
        "if(true); else;",
        "foo: ;",
        "with(foo);",

        // Class body.
        { code: "class A { }", languageOptions: { ecmaVersion: 6 } },
        { code: "var A = class { };", languageOptions: { ecmaVersion: 6 } },
        { code: "class A { a() { this; } }", languageOptions: { ecmaVersion: 6 } },
        { code: "var A = class { a() { this; } };", languageOptions: { ecmaVersion: 6 } },
        { code: "class A { } a;", languageOptions: { ecmaVersion: 6 } },
        { code: "class A { field; }", languageOptions: { ecmaVersion: 2022 } },
        { code: "class A { field = 0; }", languageOptions: { ecmaVersion: 2022 } },
        { code: "class A { static { foo; } }", languageOptions: { ecmaVersion: 2022 } },

        // modules
        { code: "export const x = 42;", languageOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "export default 42;", languageOptions: { ecmaVersion: 6, sourceType: "module" } }
    ],
    invalid: [
        {
            code: "var x = 5;;",
            output: "var x = 5;",
            errors: [{ messageId: "unexpected", type: "EmptyStatement" }]
        },
        {
            code: "function foo(){};",
            output: "function foo(){}",
            errors: [{ messageId: "unexpected", type: "EmptyStatement" }]
        },
        {
            code: "for(;;);;",
            output: "for(;;);",
            errors: [{ messageId: "unexpected", type: "EmptyStatement" }]
        },
        {
            code: "while(0);;",
            output: "while(0);",
            errors: [{ messageId: "unexpected", type: "EmptyStatement" }]
        },
        {
            code: "do;while(0);;",
            output: "do;while(0);",
            errors: [{ messageId: "unexpected", type: "EmptyStatement" }]
        },
        {
            code: "for(a in b);;",
            output: "for(a in b);",
            errors: [{ messageId: "unexpected", type: "EmptyStatement" }]
        },
        {
            code: "for(a of b);;",
            output: "for(a of b);",
            languageOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unexpected", type: "EmptyStatement" }]
        },
        {
            code: "if(true);;",
            output: "if(true);",
            errors: [{ messageId: "unexpected", type: "EmptyStatement" }]
        },
        {
            code: "if(true){} else;;",
            output: "if(true){} else;",
            errors: [{ messageId: "unexpected", type: "EmptyStatement" }]
        },
        {
            code: "if(true){;} else {;}",
            output: "if(true){} else {}",
            errors: [{ messageId: "unexpected", type: "EmptyStatement" }, { messageId: "unexpected", type: "EmptyStatement" }]
        },
        {
            code: "foo:;;",
            output: "foo:;",
            errors: [{ messageId: "unexpected", type: "EmptyStatement" }]
        },
        {
            code: "with(foo);;",
            output: "with(foo);",
            errors: [{ messageId: "unexpected", type: "EmptyStatement" }]
        },
        {
            code: "with(foo){;}",
            output: "with(foo){}",
            errors: [{ messageId: "unexpected", type: "EmptyStatement" }]
        },
        {
            code: "class A { static { ; } }",
            output: "class A { static {  } }",
            languageOptions: { ecmaVersion: 2022 },
            errors: [{ messageId: "unexpected", type: "EmptyStatement", column: 20 }]
        },
        {
            code: "class A { static { a;; } }",
            output: "class A { static { a; } }",
            languageOptions: { ecmaVersion: 2022 },
            errors: [{ messageId: "unexpected", type: "EmptyStatement", column: 22 }]
        },

        // Class body.
        {
            code: "class A { ; }",
            output: "class A {  }",
            languageOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unexpected", type: "Punctuator", column: 11 }]
        },
        {
            code: "class A { /*a*/; }",
            output: "class A { /*a*/ }",
            languageOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unexpected", type: "Punctuator", column: 16 }]
        },
        {
            code: "class A { ; a() {} }",
            output: "class A {  a() {} }",
            languageOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unexpected", type: "Punctuator", column: 11 }]
        },
        {
            code: "class A { a() {}; }",
            output: "class A { a() {} }",
            languageOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unexpected", type: "Punctuator", column: 17 }]
        },
        {
            code: "class A { a() {}; b() {} }",
            output: "class A { a() {} b() {} }",
            languageOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unexpected", type: "Punctuator", column: 17 }]
        },
        {
            code: "class A {; a() {}; b() {}; }",
            output: "class A { a() {} b() {} }",
            languageOptions: { ecmaVersion: 6 },
            errors: [
                { messageId: "unexpected", type: "Punctuator", column: 10 },
                { messageId: "unexpected", type: "Punctuator", column: 18 },
                { messageId: "unexpected", type: "Punctuator", column: 26 }
            ]
        },
        {
            code: "class A { a() {}; get b() {} }",
            output: "class A { a() {} get b() {} }",
            languageOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unexpected", type: "Punctuator", column: 17 }]
        },
        {
            code: "class A { field;; }",
            output: "class A { field; }",
            languageOptions: { ecmaVersion: 2022 },
            errors: [{ messageId: "unexpected", type: "Punctuator", column: 17 }]
        },
        {
            code: "class A { static {}; }",
            output: "class A { static {} }",
            languageOptions: { ecmaVersion: 2022 },
            errors: [{ messageId: "unexpected", type: "Punctuator", column: 20 }]
        },
        {
            code: "class A { static { a; }; foo(){} }",
            output: "class A { static { a; } foo(){} }",
            languageOptions: { ecmaVersion: 2022 },
            errors: [{ messageId: "unexpected", type: "Punctuator", column: 24 }]
        },

        // https://github.com/eslint/eslint/issues/16988
        {
            code: "; 'use strict'",
            output: null,
            errors: [{ messageId: "unexpected", type: "EmptyStatement" }]
        },
        {
            code: "; ; 'use strict'",
            output: " ; 'use strict'",
            errors: [{ messageId: "unexpected", type: "EmptyStatement" }, { messageId: "unexpected", type: "EmptyStatement" }]
        },
        {
            code: "debugger;\n;\n'use strict'",
            output: null,
            errors: [{ messageId: "unexpected", type: "EmptyStatement", line: 2 }]
        },
        {
            code: "function foo() { ; 'bar'; }",
            output: null,
            errors: [{ messageId: "unexpected", type: "EmptyStatement" }]
        },
        {
            code: "{ ; 'foo'; }",
            output: "{  'foo'; }",
            errors: [{ messageId: "unexpected", type: "EmptyStatement" }]
        },
        {
            code: "; ('use strict');",
            output: " ('use strict');",
            errors: [{ messageId: "unexpected", type: "EmptyStatement" }]
        },
        {
            code: "; 1;",
            output: " 1;",
            errors: [{ messageId: "unexpected", type: "EmptyStatement" }]
        }
    ]
});
