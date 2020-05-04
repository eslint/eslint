/**
 * @fileoverview Tests for padding-line-between-statements rule.
 * @author Toru Nagashima
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/padding-line-between-statements");
const RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const MESSAGE_NEVER = "Unexpected blank line before this statement.";
const MESSAGE_ALWAYS = "Expected blank line before this statement.";

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 2017 } });

ruleTester.run("padding-line-between-statements", rule, {
    valid: [

        // do nothing if no options.
        "'use strict'; foo(); if (a) { bar(); }",

        // do nothing for single statement.
        {
            code: "foo()",
            options: [
                { blankLine: "never", prev: "*", next: "*" }
            ]
        },
        {
            code: "foo()",
            options: [
                { blankLine: "always", prev: "*", next: "*" }
            ]
        },

        //----------------------------------------------------------------------
        // wildcard
        //----------------------------------------------------------------------

        {
            code: "foo();bar();",
            options: [
                { blankLine: "never", prev: "*", next: "*" }
            ]
        },
        {
            code: "foo();\nbar();",
            options: [
                { blankLine: "never", prev: "*", next: "*" }
            ]
        },
        {
            code: "foo();\n//comment\nbar();",
            options: [
                { blankLine: "never", prev: "*", next: "*" }
            ]
        },
        {
            code: "foo();\n/*comment*/\nbar();",
            options: [
                { blankLine: "never", prev: "*", next: "*" }
            ]
        },
        {
            code: "foo();\n\nbar();",
            options: [
                { blankLine: "always", prev: "*", next: "*" }
            ]
        },
        {
            code: "foo();\n\n//comment\nbar();",
            options: [
                { blankLine: "always", prev: "*", next: "*" }
            ]
        },
        {
            code: "foo();\n//comment\n\nbar();",
            options: [
                { blankLine: "always", prev: "*", next: "*" }
            ]
        },
        {
            code: "foo();\n//comment\n\n//comment\nbar();",
            options: [
                { blankLine: "always", prev: "*", next: "*" }
            ]
        },
        {
            code: "if(a){}\n\n;[].map(b)",
            options: [
                { blankLine: "always", prev: "if", next: "*" },
                { blankLine: "never", prev: "empty", next: "*" }
            ]
        },


        //----------------------------------------------------------------------
        // block-like
        //----------------------------------------------------------------------

        {
            code: "foo();\n\n{ foo() }\n\nfoo();",
            options: [
                { blankLine: "always", prev: "*", next: "*" },
                { blankLine: "never", prev: "block-like", next: "block-like" }
            ]
        },
        {
            code: "{ foo() } { foo() }",
            options: [
                { blankLine: "always", prev: "*", next: "*" },
                { blankLine: "never", prev: "block-like", next: "block-like" }
            ]
        },
        {
            code: "{ foo() }\n{ foo() }",
            options: [
                { blankLine: "always", prev: "*", next: "*" },
                { blankLine: "never", prev: "block-like", next: "block-like" }
            ]
        },
        {
            code: "{ foo() }\n\n{ foo() }",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "block-like", next: "block-like" }
            ]
        },
        {
            code: "{ foo() }\n\n//comment\n{ foo() }",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "block-like", next: "block-like" }
            ]
        },
        {
            code: "if(a);\nfoo()",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "block-like", next: "*" }
            ]
        },
        {
            code: "do;while(a);\nfoo()",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "block-like", next: "*" }
            ]
        },
        {
            code: "do{}while(a);\n\nfoo()",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "block-like", next: "*" }
            ]
        },
        {
            code: "a={}\nfoo()",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "block-like", next: "*" }
            ]
        },
        {
            code: "let a={}\nfoo()",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "block-like", next: "*" }
            ]
        },
        {
            code: "foo(function(){})\nfoo()",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "block-like", next: "*" }
            ]
        },
        {
            code: "(function(){})()\n\nfoo()",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "block-like", next: "*" }
            ]
        },
        {
            code: "!function(){}()\n\nfoo()",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "block-like", next: "*" }
            ]
        },

        //----------------------------------------------------------------------
        // cjs-export
        //----------------------------------------------------------------------

        {
            code: "module.exports=1",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "cjs-export", next: "*" }
            ]
        },
        {
            code: "module.exports=1\n\nfoo()",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "cjs-export", next: "*" }
            ]
        },
        {
            code: "module.exports.foo=1\n\nfoo()",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "cjs-export", next: "*" }
            ]
        },
        {
            code: "exports.foo=1\n\nfoo()",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "cjs-export", next: "*" }
            ]
        },
        {
            code: "m.exports=1\nfoo()",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "cjs-export", next: "*" }
            ]
        },
        {
            code: "module.foo=1\nfoo()",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "cjs-export", next: "*" }
            ]
        },

        //----------------------------------------------------------------------
        // cjs-import
        //----------------------------------------------------------------------

        {
            code: "foo=require(\"foo\")\nfoo()",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "cjs-import", next: "*" }
            ]
        },
        {
            code: "const foo=a.require(\"foo\")\nfoo()",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "cjs-import", next: "*" }
            ]
        },

        //----------------------------------------------------------------------
        // directive
        //----------------------------------------------------------------------

        {
            code: "\"use strict\"\n\nfoo()",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "directive", next: "*" }
            ]
        },
        {
            code: "function foo(){\"use strict\"\n\nfoo()}",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "directive", next: "*" }
            ]
        },
        {
            code: "(function foo(){\"use strict\"\n\nfoo()})",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "directive", next: "*" }
            ]
        },
        {
            code: "(()=>{\"use strict\"\n\nfoo()})",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "directive", next: "*" }
            ]
        },
        {
            code: "'use strict'\n\nfoo()",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "directive", next: "*" }
            ]
        },
        {
            code: "foo(\"use strict\")\nfoo()",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "directive", next: "*" }
            ]
        },
        {
            code: "`use strict`\nfoo()",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "directive", next: "*" }
            ]
        },
        {
            code: "(\"use strict\")\nfoo()",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "directive", next: "*" }
            ]
        },
        {
            code: "'use '+'strict'\nfoo()",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "directive", next: "*" }
            ]
        },
        {
            code: "foo()\n\"use strict\"\nfoo()",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "directive", next: "*" }
            ]
        },
        {
            code: "{\"use strict\"\nfoo()}",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "directive", next: "*" }
            ]
        },

        //----------------------------------------------------------------------
        // multiline-block-like
        //----------------------------------------------------------------------

        {
            code: "{}\nfoo()",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "multiline-block-like", next: "*" }
            ]
        },
        {
            code: "if(a){}\nfoo()",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "multiline-block-like", next: "*" }
            ]
        },
        {
            code: "while(a){}\nfoo()",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "multiline-block-like", next: "*" }
            ]
        },
        {
            code: "{\n}\n\nfoo()",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "multiline-block-like", next: "*" }
            ]
        },
        {
            code: "if(a){\n}\n\nfoo()",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "multiline-block-like", next: "*" }
            ]
        },
        {
            code: "while(a){\n}\n\nfoo()",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "multiline-block-like", next: "*" }
            ]
        },
        {
            code: "do{\n}while(a)\n\nfoo()",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "multiline-block-like", next: "*" }
            ]
        },
        {
            code: "for(;;){\n}\n\nfoo()",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "multiline-block-like", next: "*" }
            ]
        },
        {
            code: "for(a in b){\n}\n\nfoo()",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "multiline-block-like", next: "*" }
            ]
        },
        {
            code: "for(a of b){\n}\n\nfoo()",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "multiline-block-like", next: "*" }
            ]
        },
        {
            code: "switch(a){\n}\n\nfoo()",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "multiline-block-like", next: "*" }
            ]
        },
        {
            code: "function foo(a){\n}\n\nfoo()",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "multiline-block-like", next: "*" }
            ]
        },
        {
            code: "var a=function foo(a){\n}\n\nfoo()",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "multiline-block-like", next: "*" }
            ]
        },

        //----------------------------------------------------------------------
        // block
        //----------------------------------------------------------------------

        {
            code: "{}\n\nfoo()",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "block", next: "*" }
            ]
        },
        {
            code: "{\n}\n\nfoo()",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "block", next: "*" }
            ]
        },
        {
            code: "{\nfoo()\n}\n\nfoo()",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "block", next: "*" }
            ]
        },
        {
            code: "if(a){}\nfoo()",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "block", next: "*" }
            ]
        },
        {
            code: "a={}\nfoo()",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "block", next: "*" }
            ]
        },

        //----------------------------------------------------------------------
        // empty
        //----------------------------------------------------------------------

        {
            code: ";\n\nfoo()",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "empty", next: "*" }
            ]
        },
        {
            code: "1;\nfoo()",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "empty", next: "*" }
            ]
        },

        //----------------------------------------------------------------------
        // expression
        //----------------------------------------------------------------------

        {
            code: "foo()\n\nfoo()",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "expression", next: "*" }
            ]
        },
        {
            code: "a=b+c\n\nfoo()",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "expression", next: "*" }
            ]
        },
        {
            code: "var a=1\nfoo()",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "expression", next: "*" }
            ]
        },
        {
            code: "'use strict'\nfoo()",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "expression", next: "*" }
            ]
        },

        //----------------------------------------------------------------------
        // multiline-expression
        //----------------------------------------------------------------------

        {
            code: "foo()\n\nfoo(\n\tx,\n\ty\n)",
            options: [
                { blankLine: "always", prev: "*", next: "multiline-expression" }
            ]
        },
        {
            code: "foo()\nfoo()",
            options: [
                { blankLine: "always", prev: "*", next: "multiline-expression" }
            ]
        },
        {
            code: "() => {\n\tsomeArray.forEach(x => doSomething(x));\n\treturn theThing;\n}",
            options: [
                { blankLine: "always", prev: "multiline-expression", next: "return" }
            ]
        },
        {
            code: "() => {\n\tsomeArray.forEach(\n\t\tx => doSomething(x)\n\t);\n\n\treturn theThing;\n}",
            options: [
                { blankLine: "always", prev: "multiline-expression", next: "return" }
            ]
        },

        //----------------------------------------------------------------------
        // break
        //----------------------------------------------------------------------

        {
            code: "A:{break A\n\nfoo()}",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "break", next: "*" }
            ]
        },
        {
            code: "while(a){break\n\nfoo()}",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "break", next: "*" }
            ]
        },
        {
            code: "switch(a){case 0:break\n\nfoo()}",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "break", next: "*" }
            ]
        },
        {
            code: "switch(a){case 0:break\ncase 1:break}",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "break", next: "*" }
            ]
        },

        //----------------------------------------------------------------------
        // case
        //----------------------------------------------------------------------

        {
            code: "switch(a){case 0:\nfoo()\n\ncase 1:\nfoo()}",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "case", next: "*" }
            ]
        },
        {
            code: "switch(a){case 0:\nfoo()\n\ndefault:\nfoo()}",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "case", next: "*" }
            ]
        },

        //----------------------------------------------------------------------
        // class
        //----------------------------------------------------------------------

        {
            code: "class A{}\n\nfoo()",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "class", next: "*" }
            ]
        },
        {
            code: "var A = class{}\nfoo()",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "class", next: "*" }
            ]
        },

        //----------------------------------------------------------------------
        // const
        //----------------------------------------------------------------------

        {
            code: "const a=1\n\nfoo()",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "const", next: "*" }
            ]
        },
        {
            code: "let a=1\nfoo()",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "const", next: "*" }
            ]
        },

        //----------------------------------------------------------------------
        // continue
        //----------------------------------------------------------------------

        {
            code: "while(a){continue\n\nfoo()}",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "continue", next: "*" }
            ]
        },
        {
            code: "while(a){break\nfoo()}",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "continue", next: "*" }
            ]
        },

        //----------------------------------------------------------------------
        // debugger
        //----------------------------------------------------------------------

        {
            code: "debugger\n\nfoo()",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "debugger", next: "*" }
            ]
        },

        //----------------------------------------------------------------------
        // default
        //----------------------------------------------------------------------

        {
            code: "switch(a){default:\nfoo()\n\ncase 0:\nfoo()\ncase 1:}",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "default", next: "*" }
            ]
        },

        //----------------------------------------------------------------------
        // do
        //----------------------------------------------------------------------

        {
            code: "do;while(a)\n\nfoo()",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "do", next: "*" }
            ]
        },
        {
            code: "while(a);\nfoo()",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "do", next: "*" }
            ]
        },

        //----------------------------------------------------------------------
        // export
        //----------------------------------------------------------------------

        {
            code: "export default 1\n\nfoo()",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "export", next: "*" }
            ],
            parserOptions: { sourceType: "module" }
        },
        {
            code: "export let a=1\n\nfoo()",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "export", next: "*" }
            ],
            parserOptions: { sourceType: "module" }
        },
        {
            code: "var a = 0; export {a}\n\nfoo()",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "export", next: "*" }
            ],
            parserOptions: { sourceType: "module" }
        },
        {
            code: "exports.foo=1\nfoo()",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "export", next: "*" }
            ],
            parserOptions: { sourceType: "module" }
        },
        {
            code: "module.exports={}\nfoo()",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "export", next: "*" }
            ],
            parserOptions: { sourceType: "module" }
        },

        //----------------------------------------------------------------------
        // for
        //----------------------------------------------------------------------

        {
            code: "for(;;);\n\nfoo()",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "for", next: "*" }
            ]
        },
        {
            code: "for(a in b);\n\nfoo()",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "for", next: "*" }
            ]
        },
        {
            code: "for(a of b);\n\nfoo()",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "for", next: "*" }
            ]
        },
        {
            code: "while(a);\nfoo()",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "for", next: "*" }
            ]
        },

        //----------------------------------------------------------------------
        // function
        //----------------------------------------------------------------------

        {
            code: "function foo(){}\n\nfoo()",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "function", next: "*" }
            ]
        },
        {
            code: "var foo=function(){}\nfoo()",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "function", next: "*" }
            ]
        },
        {
            code: "async function foo(){}\n\nfoo()",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "function", next: "*" }
            ]
        },

        //----------------------------------------------------------------------
        // if
        //----------------------------------------------------------------------

        {
            code: "if(a);\n\nfoo()",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "if", next: "*" }
            ]
        },
        {
            code: "if(a);else;\n\nfoo()",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "if", next: "*" }
            ]
        },
        {
            code: "if(a);else if(b);else;\n\nfoo()",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "if", next: "*" }
            ]
        },
        {
            code: "for(;;);\nfoo()",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "if", next: "*" }
            ]
        },

        //----------------------------------------------------------------------
        // iife
        //----------------------------------------------------------------------

        {
            code: "(function(){\n})()\n\nvar a = 2;",
            options: [
                { blankLine: "always", prev: "iife", next: "*" }
            ]
        },
        {
            code: "+(function(){\n})()\n\nvar a = 2;",
            options: [
                { blankLine: "always", prev: "iife", next: "*" }
            ]
        },
        {
            code: "(function(){\n})()\nvar a = 2;",
            options: [
                { blankLine: "never", prev: "iife", next: "*" }
            ]
        },
        {
            code: "+(function(){\n})()\nvar a = 2;",
            options: [
                { blankLine: "never", prev: "iife", next: "*" }
            ]
        },

        //----------------------------------------------------------------------
        // import
        //----------------------------------------------------------------------

        {
            code: "import 'a'\n\nfoo()",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "import", next: "*" }
            ],
            parserOptions: { sourceType: "module" }
        },
        {
            code: "import a from 'a'\n\nfoo()",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "import", next: "*" }
            ],
            parserOptions: { sourceType: "module" }
        },
        {
            code: "import * as a from 'a'\n\nfoo()",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "import", next: "*" }
            ],
            parserOptions: { sourceType: "module" }
        },
        {
            code: "import {a} from 'a'\n\nfoo()",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "import", next: "*" }
            ],
            parserOptions: { sourceType: "module" }
        },
        {
            code: "const a=require('a')\nfoo()",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "import", next: "*" }
            ],
            parserOptions: { sourceType: "module" }
        },

        //----------------------------------------------------------------------
        // let
        //----------------------------------------------------------------------

        {
            code: "let a=1\n\nfoo()",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "let", next: "*" }
            ]
        },
        {
            code: "var a=1\nfoo()",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "let", next: "*" }
            ]
        },

        //----------------------------------------------------------------------
        // return
        //----------------------------------------------------------------------

        {
            code: "function foo(){return\n\nfoo()}",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "return", next: "*" }
            ]
        },
        {
            code: "throw a\nfoo()",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "return", next: "*" }
            ]
        },

        //----------------------------------------------------------------------
        // switch
        //----------------------------------------------------------------------

        {
            code: "switch(a){}\n\nfoo()",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "switch", next: "*" }
            ]
        },
        {
            code: "if(a){}\nfoo()",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "switch", next: "*" }
            ]
        },

        //----------------------------------------------------------------------
        // throw
        //----------------------------------------------------------------------

        {
            code: "throw a\n\nfoo()",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "throw", next: "*" }
            ]
        },

        //----------------------------------------------------------------------
        // try
        //----------------------------------------------------------------------

        {
            code: "try{}catch(e){}\n\nfoo()",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "try", next: "*" }
            ]
        },
        {
            code: "try{}finally{}\n\nfoo()",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "try", next: "*" }
            ]
        },
        {
            code: "try{}catch(e){}finally{}\n\nfoo()",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "try", next: "*" }
            ]
        },

        //----------------------------------------------------------------------
        // var
        //----------------------------------------------------------------------

        {
            code: "var a=1\n\nfoo()",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "var", next: "*" }
            ]
        },
        {
            code: "const a=1\nfoo()",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "var", next: "*" }
            ]
        },

        //----------------------------------------------------------------------
        // while
        //----------------------------------------------------------------------

        {
            code: "while(a);\n\nfoo()",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "while", next: "*" }
            ]
        },
        {
            code: "do;while(a)\nfoo()",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "while", next: "*" }
            ]
        },

        //----------------------------------------------------------------------
        // with
        //----------------------------------------------------------------------

        {
            code: "with(a);\n\nfoo()",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "with", next: "*" }
            ]
        },

        //----------------------------------------------------------------------
        // multiline-const
        //----------------------------------------------------------------------

        {
            code: "const a={\nb:1,\nc:2\n}\n\nconst d=3",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "multiline-const", next: "*" }
            ]
        },
        {
            code: "const a=1\n\nconst b={\nc:2,\nd:3\n}",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "*", next: "multiline-const" }
            ]
        },
        {
            code: "const a=1\nconst b=2",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "multiline-const", next: "*" }
            ]
        },
        {
            code: "const a=1\nconst b=2",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "*", next: "multiline-const" }
            ]
        },

        //----------------------------------------------------------------------
        // multiline-let
        //----------------------------------------------------------------------

        {
            code: "let a={\nb:1,\nc:2\n}\n\nlet d=3",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "multiline-let", next: "*" }
            ]
        },
        {
            code: "let a=1\n\nlet b={\nc:2,\nd:3\n}",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "*", next: "multiline-let" }
            ]
        },
        {
            code: "let a=1\nlet b=2",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "multiline-let", next: "*" }
            ]
        },
        {
            code: "let a=1\nlet b=2",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "*", next: "multiline-let" }
            ]
        },

        //----------------------------------------------------------------------
        // multiline-var
        //----------------------------------------------------------------------

        {
            code: "var a={\nb:1,\nc:2\n}\n\nvar d=3",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "multiline-var", next: "*" }
            ]
        },
        {
            code: "var a=1\n\nvar b={\nc:2,\nd:3\n}",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "*", next: "multiline-var" }
            ]
        },
        {
            code: "var a=1\nvar b=2",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "multiline-var", next: "*" }
            ]
        },
        {
            code: "var a=1\nvar b=2",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "*", next: "multiline-var" }
            ]
        },

        //----------------------------------------------------------------------
        // singleline-const
        //----------------------------------------------------------------------

        {
            code: "const a=1\n\nconst b=2",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "singleline-const", next: "*" }
            ]
        },
        {
            code: "const a=1\n\nconst b=2",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "*", next: "singleline-const" }
            ]
        },
        {
            code: "const a={\nb:1,\nc:2\n}\nconst d={\ne:3,\nf:4\n}",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "singleline-const", next: "*" }
            ]
        },
        {
            code: "const a={\nb:1,\nc:2\n}\nconst d={\ne:3,\nf:4\n}",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "*", next: "singleline-const" }
            ]
        },

        //----------------------------------------------------------------------
        // singleline-let
        //----------------------------------------------------------------------

        {
            code: "let a=1\n\nlet b=2",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "singleline-let", next: "*" }
            ]
        },
        {
            code: "let a=1\n\nlet b=2",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "*", next: "singleline-let" }
            ]
        },
        {
            code: "let a={\nb:1,\nc:2\n}\nlet d={\ne:3,\nf:4\n}",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "singleline-let", next: "*" }
            ]
        },
        {
            code: "let a={\nb:1,\nc:2\n}\nlet d={\ne:3,\nf:4\n}",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "*", next: "singleline-let" }
            ]
        },

        //----------------------------------------------------------------------
        // singleline-var
        //----------------------------------------------------------------------

        {
            code: "var a=1\n\nvar b=2",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "singleline-var", next: "*" }
            ]
        },
        {
            code: "var a=1\n\nvar b=2",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "*", next: "singleline-var" }
            ]
        },
        {
            code: "var a={\nb:1,\nc:2\n}\nvar d={\ne:3,\nf:4\n}",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "singleline-var", next: "*" }
            ]
        },
        {
            code: "var a={\nb:1,\nc:2\n}\nvar d={\ne:3,\nf:4\n}",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "*", next: "singleline-var" }
            ]
        },

        //----------------------------------------------------------------------
        // Tests from newline-after-var
        //----------------------------------------------------------------------

        // should skip rule entirely
        {
            code: "console.log(greet);",
            options: [
                { blankLine: "always", prev: ["const", "let", "var"], next: "*" },
                { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] }
            ]
        },
        {
            code: "console.log(greet);",
            options: [
                { blankLine: "never", prev: ["const", "let", "var"], next: "*" },
                { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] }
            ]
        },

        // should ignore a `var` with no following token
        {
            code: "var greet = 'hello';",
            options: [
                { blankLine: "always", prev: ["const", "let", "var"], next: "*" },
                { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] }
            ]
        },
        {
            code: "var greet = 'hello';",
            options: [
                { blankLine: "never", prev: ["const", "let", "var"], next: "*" },
                { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] }
            ]
        },

        // should allow no line break in "never" mode
        {
            code: "var greet = 'hello';console.log(greet);",
            options: [
                { blankLine: "never", prev: ["const", "let", "var"], next: "*" },
                { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] }
            ]
        },

        // should allow no blank line in "never" mode
        {
            code: "var greet = 'hello';\nconsole.log(greet);",
            options: [
                { blankLine: "never", prev: ["const", "let", "var"], next: "*" },
                { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] }
            ]
        },

        // should allow one blank line in "always" mode
        {
            code: "var greet = 'hello';\n\nconsole.log(greet);",
            options: [
                { blankLine: "always", prev: ["const", "let", "var"], next: "*" },
                { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] }
            ]
        },

        // should allow two or more blank lines in "always" mode
        {
            code: "var greet = 'hello';\n\n\nconsole.log(greet);",
            options: [
                { blankLine: "always", prev: ["const", "let", "var"], next: "*" },
                { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] }
            ]
        },
        {
            code: "var greet = 'hello';\n\n\n\nconsole.log(greet);",
            options: [
                { blankLine: "always", prev: ["const", "let", "var"], next: "*" },
                { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] }
            ]
        },

        // should allow trailing whitespace after the `var`
        {
            code: "var greet = 'hello';    \n\nconsole.log(greet);",
            options: [
                { blankLine: "always", prev: ["const", "let", "var"], next: "*" },
                { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] }
            ]
        },
        {
            code: "var greet = 'hello';    \nconsole.log(greet);",
            options: [
                { blankLine: "never", prev: ["const", "let", "var"], next: "*" },
                { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] }
            ]
        },

        // should allow inline comments after the `var`
        {
            code: "var greet = 'hello'; // inline comment\n\nconsole.log(greet);",
            options: [
                { blankLine: "always", prev: ["const", "let", "var"], next: "*" },
                { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] }
            ]
        },
        {
            code: "var greet = 'hello'; // inline comment\nconsole.log(greet);",
            options: [
                { blankLine: "never", prev: ["const", "let", "var"], next: "*" },
                { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] }
            ]
        },

        // should allow a comment on the next line in "never" mode
        {
            code: "var greet = 'hello';\n// next-line comment\nconsole.log(greet);",
            options: [
                { blankLine: "never", prev: ["const", "let", "var"], next: "*" },
                { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] }
            ]
        },
        {
            code: "var greet = 'hello';\n/* block comment\nblock comment */\nconsole.log(greet);",
            options: [
                { blankLine: "never", prev: ["const", "let", "var"], next: "*" },
                { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] }
            ]
        },

        // should allow comments on the next line followed by a blank in "always" mode
        {
            code: "var greet = 'hello';\n// next-line comment\n\nconsole.log(greet);",
            options: [
                { blankLine: "always", prev: ["const", "let", "var"], next: "*" },
                { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] }
            ]
        },
        {
            code: "var greet = 'hello';\n/* block comment\nblock comment */\n\nconsole.log(greet);",
            options: [
                { blankLine: "always", prev: ["const", "let", "var"], next: "*" },
                { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] }
            ]
        },
        {
            code: "var greet = 'hello';\n// next-line comment\n// second-line comment\n\nconsole.log(greet);",
            options: [
                { blankLine: "always", prev: ["const", "let", "var"], next: "*" },
                { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] }
            ]
        },

        // should allow comments on the next line followed by no blank in "never" mode
        {
            code: "var greet = 'hello';\n// next-line comment\n// second-line comment\nconsole.log(greet);",
            options: [
                { blankLine: "never", prev: ["const", "let", "var"], next: "*" },
                { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] }
            ]
        },
        {
            code: "var greet = 'hello';\n// next-line comment\n/* block comment\nblock comment */\nconsole.log(greet);",
            options: [
                { blankLine: "never", prev: ["const", "let", "var"], next: "*" },
                { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] }
            ]
        },

        // should allow another `var` statement to follow without blank line
        {
            code: "var greet = 'hello';var name = 'world';console.log(greet, name);",
            options: [
                { blankLine: "never", prev: ["const", "let", "var"], next: "*" },
                { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] }
            ]
        },
        {
            code: "var greet = 'hello';\nvar name = 'world';\nconsole.log(greet, name);",
            options: [
                { blankLine: "never", prev: ["const", "let", "var"], next: "*" },
                { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] }
            ]
        },
        {
            code: "var greet = 'hello';\nvar name = 'world';\n\nconsole.log(greet, name);",
            options: [
                { blankLine: "always", prev: ["const", "let", "var"], next: "*" },
                { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] }
            ]
        },

        // should allow a comment directly between `var` statements
        {
            code: "var greet = 'hello';\n// inline comment\nvar name = 'world';\n\nconsole.log(greet, name);",
            options: [
                { blankLine: "always", prev: ["const", "let", "var"], next: "*" },
                { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] }
            ]
        },
        {
            code: "var greet = 'hello';\n/* block comment\nblock comment */\nvar name = 'world';\n\nconsole.log(greet, name);",
            options: [
                { blankLine: "always", prev: ["const", "let", "var"], next: "*" },
                { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] }
            ]
        },
        {
            code: "var greet = 'hello';\n// inline comment\nvar name = 'world';\nconsole.log(greet, name);",
            options: [
                { blankLine: "never", prev: ["const", "let", "var"], next: "*" },
                { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] }
            ]
        },
        {
            code: "var greet = 'hello';\n/* block comment\nblock comment */\nvar name = 'world';\nconsole.log(greet, name);",
            options: [
                { blankLine: "never", prev: ["const", "let", "var"], next: "*" },
                { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] }
            ]
        },

        // should handle single `var` statement with multiple declarations
        {
            code: "var greet = 'hello', name = 'world';console.log(greet, name);",
            options: [
                { blankLine: "never", prev: ["const", "let", "var"], next: "*" },
                { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] }
            ]
        },
        {
            code: "var greet = 'hello', name = 'world';\nconsole.log(greet, name);",
            options: [
                { blankLine: "never", prev: ["const", "let", "var"], next: "*" },
                { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] }
            ]
        },
        {
            code: "var greet = 'hello', name = 'world';\n\nconsole.log(greet, name);",
            options: [
                { blankLine: "always", prev: ["const", "let", "var"], next: "*" },
                { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] }
            ]
        },

        // should handle single `var` statement with multi-line declaration
        {
            code: "var greet = 'hello',\nname = 'world';\n\nconsole.log(greet, name);",
            options: [
                { blankLine: "always", prev: ["const", "let", "var"], next: "*" },
                { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] }
            ]
        },
        {
            code: "var greet = 'hello',\nname = 'world';\nconsole.log(greet, name);",
            options: [
                { blankLine: "never", prev: ["const", "let", "var"], next: "*" },
                { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] }
            ]
        },
        {
            code: "var greet = 'hello', // inline comment\nname = 'world'; // inline comment\n\nconsole.log(greet, name);",
            options: [
                { blankLine: "always", prev: ["const", "let", "var"], next: "*" },
                { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] }
            ]
        },
        {
            code: "var greet = 'hello', // inline comment\nname = 'world'; // inline comment\nconsole.log(greet, name);",
            options: [
                { blankLine: "never", prev: ["const", "let", "var"], next: "*" },
                { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] }
            ]
        },
        {
            code: "var greet = 'hello',\nname = 'world';\n// next-line comment\nconsole.log(greet);",
            options: [
                { blankLine: "never", prev: ["const", "let", "var"], next: "*" },
                { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] }
            ]
        },
        {
            code: "var greet = 'hello',\nname = 'world';\n/* block comment\nblock comment */\nconsole.log(greet);",
            options: [
                { blankLine: "never", prev: ["const", "let", "var"], next: "*" },
                { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] }
            ]
        },

        // should handle ES6 `let` block binding
        {
            code: "let greet = 'hello';\n\nconsole.log(greet);",
            options: [
                { blankLine: "always", prev: ["const", "let", "var"], next: "*" },
                { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] }
            ]
        },
        {
            code: "let greet = 'hello';\nconsole.log(greet);",
            options: [
                { blankLine: "never", prev: ["const", "let", "var"], next: "*" },
                { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] }
            ]
        },

        // should handle ES6 `const` block binding
        {
            code: "const greet = 'hello';\n\nconsole.log(greet);",
            options: [
                { blankLine: "always", prev: ["const", "let", "var"], next: "*" },
                { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] }
            ]
        },
        {
            code: "const greet = 'hello';\nconsole.log(greet);",
            options: [
                { blankLine: "never", prev: ["const", "let", "var"], next: "*" },
                { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] }
            ]
        },

        // should handle a mix of `var`, `let`, or `const`
        {
            code: "let greet = 'hello';\nvar name = 'world';\n\nconsole.log(greet, name);",
            options: [
                { blankLine: "always", prev: ["const", "let", "var"], next: "*" },
                { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] }
            ]
        },
        {
            code: "const greet = 'hello';\nvar name = 'world';\n\nconsole.log(greet, name);",
            options: [
                { blankLine: "always", prev: ["const", "let", "var"], next: "*" },
                { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] }
            ]
        },
        {
            code: "let greet = 'hello';\nconst name = 'world';\n\nconsole.log(greet, name);",
            options: [
                { blankLine: "always", prev: ["const", "let", "var"], next: "*" },
                { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] }
            ]
        },

        // should handle a mix of `var` or `let` inside for variations
        {
            code: "for(let a = 1; a < 1; a++){\n break;\n}",
            options: [
                { blankLine: "always", prev: ["const", "let", "var"], next: "*" },
                { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] }
            ]
        },
        {
            code: "for(var a = 1; a < 1; a++){\n break;\n}",
            options: [
                { blankLine: "always", prev: ["const", "let", "var"], next: "*" },
                { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] }
            ]
        },
        {
            code: "for(let a = 1; a < 1; a++){\n break;\n}",
            options: [
                { blankLine: "never", prev: ["const", "let", "var"], next: "*" },
                { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] }
            ]
        },
        {
            code: "for(var a = 1; a < 1; a++){\n break;\n}",
            options: [
                { blankLine: "never", prev: ["const", "let", "var"], next: "*" },
                { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] }
            ]
        },
        {
            code: "for(let a in obj){\n break;\n}",
            options: [
                { blankLine: "always", prev: ["const", "let", "var"], next: "*" },
                { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] }
            ]
        },
        {
            code: "for(var a in obj){\n break;\n}",
            options: [
                { blankLine: "always", prev: ["const", "let", "var"], next: "*" },
                { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] }
            ]
        },
        {
            code: "for(let a in obj){\n break;\n}",
            options: [
                { blankLine: "never", prev: ["const", "let", "var"], next: "*" },
                { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] }
            ]
        },
        {
            code: "for(var a in obj){\n break;\n}",
            options: [
                { blankLine: "never", prev: ["const", "let", "var"], next: "*" },
                { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] }
            ]
        },

        // should handle export specifiers
        {
            code: "export let a = 1;\nexport let b = 2;",
            options: [
                { blankLine: "never", prev: ["const", "let", "var"], next: "*" },
                { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] }
            ],
            parserOptions: { sourceType: "module" }
        },
        {
            code: "export let a = 1;\nexport let b = 2;",
            options: [
                { blankLine: "always", prev: ["const", "let", "var"], next: "*" },
                { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] }
            ],
            parserOptions: { sourceType: "module" }
        },
        {
            code: "export var a = 1;\nexport var b = 2;",
            options: [
                { blankLine: "never", prev: ["const", "let", "var"], next: "*" },
                { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] }
            ],
            parserOptions: { sourceType: "module" }
        },
        {
            code: "export var a = 1;\nexport var b = 2;",
            options: [
                { blankLine: "always", prev: ["const", "let", "var"], next: "*" },
                { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] }
            ],
            parserOptions: { sourceType: "module" }
        },
        {
            code: "export const a = 1;\nexport const b = 2;",
            options: [
                { blankLine: "never", prev: ["const", "let", "var"], next: "*" },
                { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] }
            ],
            parserOptions: { sourceType: "module" }
        },
        {
            code: "export const a = 1;\nexport const b = 2;",
            options: [
                { blankLine: "always", prev: ["const", "let", "var"], next: "*" },
                { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] }
            ],
            parserOptions: { sourceType: "module" }
        },

        // should allow no blank line at end of block
        {
            code: "function example() {\nvar greet = 'hello'\n}",
            options: [
                { blankLine: "always", prev: ["const", "let", "var"], next: "*" },
                { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] }
            ]
        },
        {
            code: "function example() {\nvar greet = 'hello'\n}",
            options: [
                { blankLine: "never", prev: ["const", "let", "var"], next: "*" },
                { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] }
            ]
        },
        {
            code: "function example() {\nvar greet = 'hello';\nconsole.log(greet);\n}",
            options: [
                { blankLine: "never", prev: ["const", "let", "var"], next: "*" },
                { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] }
            ]
        },
        {
            code: "var f = function() {\nvar greet = 'hello'\n};",
            options: [
                { blankLine: "always", prev: ["const", "let", "var"], next: "*" },
                { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] }
            ]
        },
        {
            code: "var f = function() {\nvar greet = 'hello'\n};",
            options: [
                { blankLine: "never", prev: ["const", "let", "var"], next: "*" },
                { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] }
            ]
        },
        {
            code: "var f = function() {\nvar greet = 'hello';\nconsole.log(greet);\n};",
            options: [
                { blankLine: "never", prev: ["const", "let", "var"], next: "*" },
                { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] }
            ]
        },
        {
            code: "() => {\nvar greet = 'hello';\n}",
            options: [
                { blankLine: "always", prev: ["const", "let", "var"], next: "*" },
                { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] }
            ]
        },
        {
            code: "() => {\nvar greet = 'hello';\n}",
            options: [
                { blankLine: "never", prev: ["const", "let", "var"], next: "*" },
                { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] }
            ]
        },
        {
            code: "() => {\nvar greet = 'hello';\nconsole.log(greet);\n}",
            options: [
                { blankLine: "never", prev: ["const", "let", "var"], next: "*" },
                { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] }
            ]
        },
        {
            code: "{\nvar foo;\n}",
            options: [
                { blankLine: "always", prev: ["const", "let", "var"], next: "*" },
                { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] }
            ]
        },
        {
            code: "{\nvar foo;\n}",
            options: [
                { blankLine: "never", prev: ["const", "let", "var"], next: "*" },
                { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] }
            ]
        },
        {
            code: "if(true) {\nvar foo;\n}",
            options: [
                { blankLine: "always", prev: ["const", "let", "var"], next: "*" },
                { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] }
            ]
        },
        {
            code: "if(true) {\nvar foo;\n}",
            options: [
                { blankLine: "never", prev: ["const", "let", "var"], next: "*" },
                { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] }
            ]
        },
        {
            code: "switch(a) {\ncase 0:\nvar foo;\n}",
            options: [
                { blankLine: "always", prev: ["const", "let", "var"], next: "*" },
                { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] }
            ]
        },
        {
            code: "switch(a) {\ncase 0:\nvar foo;\n}",
            options: [
                { blankLine: "never", prev: ["const", "let", "var"], next: "*" },
                { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] }
            ]
        },

        // should handle one/no blank before case.
        {
            code: "switch(a) {\ncase 0:\nvar foo;\n\ncase 1:}",
            options: [
                { blankLine: "always", prev: ["const", "let", "var"], next: "*" },
                { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] }
            ]
        },
        {
            code: "switch(a) {\ncase 0:\nvar foo;\ncase 1:}",
            options: [
                { blankLine: "never", prev: ["const", "let", "var"], next: "*" },
                { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] }
            ]
        },

        // https://github.com/eslint/eslint/issues/6834
        {
            code: `
                var a = 1

                ;(b || c).doSomething()
            `,
            options: [
                { blankLine: "always", prev: ["const", "let", "var"], next: "*" },
                { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] }
            ]
        },
        {
            code: `
                var a = 1
                ;(b || c).doSomething()
            `,
            options: [
                { blankLine: "never", prev: ["const", "let", "var"], next: "*" },
                { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] }
            ]
        },
        {
            code: `
                var a = 1
                ;
                (b || c).doSomething();
            `,
            options: [
                { blankLine: "never", prev: ["const", "let", "var"], next: "*" },
                { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] }
            ]
        },

        {
            code: "switch(a) {\ncase 0:\nvar foo;\n\ncase 1:}",
            options: [
                { blankLine: "never", prev: ["const", "let", "var"], next: "*" },
                { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] }
            ]
        },
        {
            code: "switch(a) {\ncase 0:\nvar foo;\ncase 1:}",
            options: [
                { blankLine: "always", prev: ["const", "let", "var"], next: "*" },
                { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] }
            ]
        },
        {
            code: `
                var a = 1

                ;
                (b || c).doSomething();
            `,
            options: [
                { blankLine: "never", prev: ["const", "let", "var"], next: "*" },
                { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] }
            ]
        },

        //----------------------------------------------------------------------
        // Tests from newline-before-return
        //----------------------------------------------------------------------

        {
            code: "function a() {\nreturn;\n}",
            options: [
                { blankLine: "always", prev: "*", next: "return" }
            ]
        },
        {
            code: "function a() {\n\nreturn;\n}",
            options: [
                { blankLine: "always", prev: "*", next: "return" }
            ]
        },
        {
            code: "function a() {\nvar b;\n\nreturn;\n}",
            options: [
                { blankLine: "always", prev: "*", next: "return" }
            ]
        },
        {
            code: "function a() {\nif (b) return;\n}",
            options: [
                { blankLine: "always", prev: "*", next: "return" }
            ]
        },
        {
            code: "function a() {\nif (b) { return; }\n}",
            options: [
                { blankLine: "always", prev: "*", next: "return" }
            ]
        },
        {
            code: "function a() {\nif (b) {\nreturn;\n}\n}",
            options: [
                { blankLine: "always", prev: "*", next: "return" }
            ]
        },
        {
            code: "function a() {\nif (b) {\n\nreturn;\n}\n}",
            options: [
                { blankLine: "always", prev: "*", next: "return" }
            ]
        },
        {
            code: "function a() {\nif (b) {\nreturn;\n}\n\nreturn c;\n}",
            options: [
                { blankLine: "always", prev: "*", next: "return" }
            ]
        },
        {
            code: "function a() {\nif (b) {\n\nreturn;\n}\n\nreturn c;\n}",
            options: [
                { blankLine: "always", prev: "*", next: "return" }
            ]
        },
        {
            code: "function a() {\nif (!b) {\nreturn;\n} else {\nreturn b;\n}\n}",
            options: [
                { blankLine: "always", prev: "*", next: "return" }
            ]
        },
        {
            code: "function a() {\nif (!b) {\nreturn;\n} else {\n\nreturn b;\n}\n}",
            options: [
                { blankLine: "always", prev: "*", next: "return" }
            ]
        },
        {
            code: "function a() {\nif (b) {\nreturn b;\n} else if (c) {\nreturn c;\n}\n}",
            options: [
                { blankLine: "always", prev: "*", next: "return" }
            ]
        },
        {
            code: "function a() {\nif (b) {\nreturn b;\n} else if (c) {\nreturn c;\n} else {\nreturn d;\n}\n}",
            options: [
                { blankLine: "always", prev: "*", next: "return" }
            ]
        },
        {
            code: "function a() {\nif (b) {\nreturn b;\n} else if (c) {\nreturn c;\n} else {\nreturn d;\n}\n\nreturn a;\n}",
            options: [
                { blankLine: "always", prev: "*", next: "return" }
            ]
        },
        {
            code: "function a() {\nif (b) return b;\nelse if (c) return c;\nelse return d;\n}",
            options: [
                { blankLine: "always", prev: "*", next: "return" }
            ]
        },
        {
            code: "function a() {\nif (b) return b;\nelse if (c) return c;\nelse {\nreturn d;\n}\n}",
            options: [
                { blankLine: "always", prev: "*", next: "return" }
            ]
        },
        {
            code: "function a() {\nif (b) return b;\nelse if (c) return c;\nelse {\ne();\n\nreturn d;\n}\n}",
            options: [
                { blankLine: "always", prev: "*", next: "return" }
            ]
        },
        {
            code: "function a() {\nwhile (b) return;\n}",
            options: [
                { blankLine: "always", prev: "*", next: "return" }
            ]
        },
        {
            code: "function a() {\n while (b) \nreturn;\n}",
            options: [
                { blankLine: "always", prev: "*", next: "return" }
            ]
        },
        {
            code: "function a() {\n while (b) { return; }\n}",
            options: [
                { blankLine: "always", prev: "*", next: "return" }
            ]
        },
        {
            code: "function a() {\n while (b) {\nreturn;\n}\n}",
            options: [
                { blankLine: "always", prev: "*", next: "return" }
            ]
        },
        {
            code: "function a() {\n while (b) {\nc();\n\nreturn;\n}\n}",
            options: [
                { blankLine: "always", prev: "*", next: "return" }
            ]
        },
        {
            code: "function a() {\nvar c;\nwhile (b) {\n c = d; //comment\n}\n\nreturn c;\n}",
            options: [
                { blankLine: "always", prev: "*", next: "return" }
            ]
        },
        {
            code: "function a() {\ndo return;\nwhile (b);\n}",
            options: [
                { blankLine: "always", prev: "*", next: "return" }
            ]
        },
        {
            code: "function a() {\ndo \nreturn;\nwhile (b);\n}",
            options: [
                { blankLine: "always", prev: "*", next: "return" }
            ]
        },
        {
            code: "function a() {\ndo { return; } while (b);\n}",
            options: [
                { blankLine: "always", prev: "*", next: "return" }
            ]
        },
        {
            code: "function a() {\ndo { return; }\nwhile (b);\n}",
            options: [
                { blankLine: "always", prev: "*", next: "return" }
            ]
        },
        {
            code: "function a() {\ndo {\nreturn;\n} while (b);\n}",
            options: [
                { blankLine: "always", prev: "*", next: "return" }
            ]
        },
        {
            code: "function a() {\ndo {\nc();\n\nreturn;\n} while (b);\n}",
            options: [
                { blankLine: "always", prev: "*", next: "return" }
            ]
        },
        {
            code: "function a() {\nfor (var b; b < c; b++) return;\n}",
            options: [
                { blankLine: "always", prev: "*", next: "return" }
            ]
        },
        {
            code: "function a() {\nfor (var b; b < c; b++)\nreturn;\n}",
            options: [
                { blankLine: "always", prev: "*", next: "return" }
            ]
        },
        {
            code: "function a() {\nfor (var b; b < c; b++) {\nreturn;\n}\n}",
            options: [
                { blankLine: "always", prev: "*", next: "return" }
            ]
        },
        {
            code: "function a() {\nfor (var b; b < c; b++) {\nc();\n\nreturn;\n}\n}",
            options: [
                { blankLine: "always", prev: "*", next: "return" }
            ]
        },
        {
            code: "function a() {\nfor (var b; b < c; b++) {\nif (d) {\nbreak; //comment\n}\n\nreturn;\n}\n}",
            options: [
                { blankLine: "always", prev: "*", next: "return" }
            ]
        },
        {
            code: "function a() {\nfor (b in c)\nreturn;\n}",
            options: [
                { blankLine: "always", prev: "*", next: "return" }
            ]
        },
        {
            code: "function a() {\nfor (b in c) { return; }\n}",
            options: [
                { blankLine: "always", prev: "*", next: "return" }
            ]
        },
        {
            code: "function a() {\nfor (b in c) {\nreturn;\n}\n}",
            options: [
                { blankLine: "always", prev: "*", next: "return" }
            ]
        },
        {
            code: "function a() {\nfor (b in c) {\nd();\n\nreturn;\n}\n}",
            options: [
                { blankLine: "always", prev: "*", next: "return" }
            ]
        },
        {
            code: "function a() {\nfor (b of c) return;\n}",
            options: [
                { blankLine: "always", prev: "*", next: "return" }
            ]
        },
        {
            code: "function a() {\nfor (b of c)\nreturn;\n}",
            options: [
                { blankLine: "always", prev: "*", next: "return" }
            ]
        },
        {
            code: "function a() {\nfor (b of c) {\nreturn;\n}\n}",
            options: [
                { blankLine: "always", prev: "*", next: "return" }
            ]
        },
        {
            code: "function a() {\nfor (b of c) {\nd();\n\nreturn;\n}\n}",
            options: [
                { blankLine: "always", prev: "*", next: "return" }
            ]
        },
        {
            code: "function a() {\nswitch (b) {\ncase 'b': return;\n}\n}",
            options: [
                { blankLine: "always", prev: "*", next: "return" }
            ]
        },
        {
            code: "function a() {\nswitch (b) {\ncase 'b':\nreturn;\n}\n}",
            options: [
                { blankLine: "always", prev: "*", next: "return" }
            ]
        },
        {
            code: "function a() {\nswitch (b) {\ncase 'b': {\nreturn;\n}\n}\n}",
            options: [
                { blankLine: "always", prev: "*", next: "return" }
            ]
        },
        {
            code: "function a() {\n//comment\nreturn b;\n}",
            options: [
                { blankLine: "always", prev: "*", next: "return" }
            ]
        },
        {
            code: "function a() {\n{\n//comment\n}\n\nreturn\n}",
            options: [
                { blankLine: "always", prev: "*", next: "return" }
            ]
        },
        {
            code: "function a() {\nvar b = {\n//comment\n};\n\nreturn;\n}",
            options: [
                { blankLine: "always", prev: "*", next: "return" }
            ]
        },
        {
            code: "function a() {/*multi-line\ncomment*/return b;\n}",
            options: [
                { blankLine: "always", prev: "*", next: "return" }
            ]
        },
        {
            code: "function a() {\n/*comment\ncomment*/\n//comment\nreturn b;\n}",
            options: [
                { blankLine: "always", prev: "*", next: "return" }
            ]
        },
        {
            code: "function a() {\n/*comment\ncomment*/\n//comment\nif (b) return;\n}",
            options: [
                { blankLine: "always", prev: "*", next: "return" }
            ]
        },
        {
            code: "function a() {\n/*comment\ncomment*/\n//comment\nif (b) {\nc();\n\nreturn b;\n} else {\n//comment\nreturn d;\n}\n\n/*multi-line\ncomment*/\nreturn e;\n}",
            options: [
                { blankLine: "always", prev: "*", next: "return" }
            ]
        },
        {
            code: "function a() {\nif (b) { //comment\nreturn;\n}\n\nreturn c;\n}",
            options: [
                { blankLine: "always", prev: "*", next: "return" }
            ]
        },
        {
            code: "function a() {\nif (b) { return; } //comment\n\nreturn c;\n}",
            options: [
                { blankLine: "always", prev: "*", next: "return" }
            ]
        },
        {
            code: "function a() {\nif (b) { return; } /*multi-line\ncomment*/\n\nreturn c;\n}",
            options: [
                { blankLine: "always", prev: "*", next: "return" }
            ]
        },
        {
            code: "function a() {\nif (b) { return; }\n\n/*multi-line\ncomment*/ return c;\n}",
            options: [
                { blankLine: "always", prev: "*", next: "return" }
            ]
        },
        {
            code: "return;",
            options: [
                { blankLine: "always", prev: "*", next: "return" }
            ],
            parserOptions: { ecmaFeatures: { globalReturn: true } }
        },
        {
            code: "var a;\n\nreturn;",
            options: [
                { blankLine: "always", prev: "*", next: "return" }
            ],
            parserOptions: { ecmaFeatures: { globalReturn: true } }
        },
        {
            code: "// comment\nreturn;",
            options: [
                { blankLine: "always", prev: "*", next: "return" }
            ],
            parserOptions: { ecmaFeatures: { globalReturn: true } }
        },
        {
            code: "/* comment */\nreturn;",
            options: [
                { blankLine: "always", prev: "*", next: "return" }
            ],
            parserOptions: { ecmaFeatures: { globalReturn: true } }
        },
        {
            code: "/* multi-line\ncomment */\nreturn;",
            options: [
                { blankLine: "always", prev: "*", next: "return" }
            ],
            parserOptions: { ecmaFeatures: { globalReturn: true } }
        },

        //----------------------------------------------------------------------
        // From JSCS disallowPaddingNewLinesAfterBlocks
        // https://github.com/jscs-dev/node-jscs/blob/44f9b86eb0757fd4ca05a81a50450c5f1b25c37b/test/specs/rules/disallow-padding-newlines-after-blocks.js
        //----------------------------------------------------------------------

        {
            code: "if(true){}",
            options: [
                { blankLine: "never", prev: "block-like", next: "*" }
            ]
        },
        {
            code: "if(true){}\n",
            options: [
                { blankLine: "never", prev: "block-like", next: "*" }
            ]
        },
        {
            code: "if(true){}\nvar a = 2;",
            options: [
                { blankLine: "never", prev: "block-like", next: "*" }
            ]
        },
        {
            code: "if(true){\nif(true) {}\n}",
            options: [
                { blankLine: "never", prev: "block-like", next: "*" }
            ]
        },
        {
            code: "var a = {\nfoo: function() {\n},\nbar: function() {\n}}",
            options: [
                { blankLine: "never", prev: "block-like", next: "*" }
            ]
        },
        {
            code: "(function(){\n})()\nvar a = 2;",
            options: [
                { blankLine: "never", prev: "block-like", next: "*" }
            ]
        },
        {
            code: "if(true) {\n}\nelse\n{\n}",
            options: [
                { blankLine: "never", prev: "block-like", next: "*" }
            ]
        },
        {
            code: "if(true) {\n} else {\n var a = 2; }",
            options: [
                { blankLine: "never", prev: "block-like", next: "*" }
            ]
        },
        {
            code: "if(true) {\n}\nelse if(true)\n{\n}\nelse {\n}",
            options: [
                { blankLine: "never", prev: "block-like", next: "*" }
            ]
        },
        {
            code: "do{\n}\nwhile(true)",
            options: [
                { blankLine: "never", prev: "block-like", next: "*" }
            ]
        },
        {
            code: "try{\n}\ncatch(e) {}",
            options: [
                { blankLine: "never", prev: "block-like", next: "*" }
            ]
        },
        {
            code: "try{\n}\nfinally {}",
            options: [
                { blankLine: "never", prev: "block-like", next: "*" }
            ]
        },
        {
            code: "try{\n}\ncatch(e) {\n}\nfinally {\n}",
            options: [
                { blankLine: "never", prev: "block-like", next: "*" }
            ]
        },
        {
            code: "[].map(function() {})\n.filter(function(){})",
            options: [
                { blankLine: "never", prev: "block-like", next: "*" }
            ]
        },

        //----------------------------------------------------------------------
        // From JSCS disallowPaddingNewLinesBeforeExport
        // https://github.com/jscs-dev/node-jscs/blob/44f9b86eb0757fd4ca05a81a50450c5f1b25c37b/test/specs/rules/disallow-padding-newlines-before-export.js
        //----------------------------------------------------------------------

        {
            code: "var a = 2;\nmodule.exports = a;",
            options: [
                { blankLine: "never", prev: "*", next: "cjs-export" }
            ]
        },
        {
            code: "module.exports = 2;",
            options: [
                { blankLine: "never", prev: "*", next: "cjs-export" }
            ]
        },
        {
            code: "var a = 2;\n// foo\nmodule.exports = a;",
            options: [
                { blankLine: "never", prev: "*", next: "cjs-export" }
            ]
        },

        /*
         * TODO: May it need an option to ignore blank lines followed by comments?
         * {
         *     code: "var a = 2;\n\n// foo\nmodule.exports = a;",
         *     options: [
         *         { blankLine: "never", prev: "*", next: "cjs-export" }
         *     ]
         * },
         */
        {
            code: "var a = 2;\n\nfoo.exports = a;",
            options: [
                { blankLine: "never", prev: "*", next: "cjs-export" }
            ]
        },
        {
            code: "var a = 2;\n\nmodule.foo = a;",
            options: [
                { blankLine: "never", prev: "*", next: "cjs-export" }
            ]
        },
        {
            code: "var a = 2;\n\nfoo = a;",
            options: [
                { blankLine: "never", prev: "*", next: "cjs-export" }
            ]
        },

        //----------------------------------------------------------------------
        // From JSCS requirePaddingNewLinesAfterBlocks
        // https://github.com/jscs-dev/node-jscs/blob/44f9b86eb0757fd4ca05a81a50450c5f1b25c37b/test/specs/rules/require-padding-newlines-after-blocks.js
        //----------------------------------------------------------------------

        {
            code: "{}",
            options: [
                { blankLine: "always", prev: "block-like", next: "*" }
            ]
        },
        {
            code: "if(true){}",
            options: [
                { blankLine: "always", prev: "block-like", next: "*" }
            ]
        },
        {
            code: "if(true){}\n",
            options: [
                { blankLine: "always", prev: "block-like", next: "*" }
            ]
        },
        {
            code: "if(true){}\n\nvar a = 2;",
            options: [
                { blankLine: "always", prev: "block-like", next: "*" }
            ]
        },
        {
            code: "if(true){}\n\n\nvar a = 2;",
            options: [
                { blankLine: "always", prev: "block-like", next: "*" }
            ]
        },
        {
            code: "if(true){\nif(true) {}\n}",
            options: [
                { blankLine: "always", prev: "block-like", next: "*" }
            ]
        },
        {
            code: "var a = {\nfoo: function() {\n},\n\nbar: function() {\n}}",
            options: [
                { blankLine: "always", prev: "block-like", next: "*" }
            ]
        },
        {
            code: "(function(){\n})()\n\nvar a = 2;",
            options: [
                { blankLine: "always", prev: "block-like", next: "*" }
            ]
        },
        {
            code: "if(true) {\n}\nelse\n{\n}",
            options: [
                { blankLine: "always", prev: "block-like", next: "*" }
            ]
        },
        {
            code: "if(true) {\n} else {\n var a = 2; }",
            options: [
                { blankLine: "always", prev: "block-like", next: "*" }
            ]
        },
        {
            code: "if(true) {\n}\nelse if(true)\n{\n}\nelse {\n}",
            options: [
                { blankLine: "always", prev: "block-like", next: "*" }
            ]
        },
        {
            code: "do{\n}\nwhile(true)",
            options: [
                { blankLine: "always", prev: "block-like", next: "*" }
            ]
        },
        {
            code: "try{\n}\ncatch(e) {}",
            options: [
                { blankLine: "always", prev: "block-like", next: "*" }
            ]
        },
        {
            code: "try{\n}\nfinally {}",
            options: [
                { blankLine: "always", prev: "block-like", next: "*" }
            ]
        },
        {
            code: "try{\n}\ncatch(e) {\n}\nfinally {\n}",
            options: [
                { blankLine: "always", prev: "block-like", next: "*" }
            ]
        },
        {
            code: "[].map(function() {})\n.filter(function(){})",
            options: [
                { blankLine: "always", prev: "block-like", next: "*" }
            ]
        },
        {
            code: "func(\n2,\n3,\nfunction() {\n}\n)",
            options: [
                { blankLine: "always", prev: "block-like", next: "*" }
            ]
        },
        {
            code: "[\n2,\n3,\nfunction() {\n}\n]",
            options: [
                { blankLine: "always", prev: "block-like", next: "*" }
            ]
        },
        {
            code: "a(res => {\n})\n.b();",
            options: [
                { blankLine: "always", prev: "block-like", next: "*" }
            ]
        },
        {
            code: "var foo = (\n<div\nref={function() {\n}}\n>\nfoo\n</div>\n);",
            options: [
                { blankLine: "always", prev: "block-like", next: "*" }
            ],
            parserOptions: { ecmaFeatures: { jsx: true } }
        },
        {
            code: "var i = 0;\nwhile (i < 100) {\nif(i % 2 === 0) {continue;}\n++i;\n}",
            options: [
                { blankLine: "always", prev: "multiline-block-like", next: "*" }
            ]
        },
        {
            code: "var i = 0;\nwhile (i < 100) {\nif(i % 2 === 0) {if(i === 4) {continue;}}\n++i;\n}",
            options: [
                { blankLine: "always", prev: "multiline-block-like", next: "*" }
            ]
        },

        //----------------------------------------------------------------------
        // From JSCS requirePaddingNewLinesBeforeExport
        // https://github.com/jscs-dev/node-jscs/blob/44f9b86eb0757fd4ca05a81a50450c5f1b25c37b/test/specs/rules/require-padding-newlines-before-export.js
        //----------------------------------------------------------------------

        {
            code: "module.exports = 2;",
            options: [
                { blankLine: "always", prev: "*", next: "cjs-export" }
            ]
        },
        {
            code: "var a = 2;\n\nmodule.exports = a;",
            options: [
                { blankLine: "always", prev: "*", next: "cjs-export" }
            ]
        },
        {
            code: "var a = 2;\nfoo.exports = a;",
            options: [
                { blankLine: "always", prev: "*", next: "cjs-export" }
            ]
        },
        {
            code: "var a = 2;\nmodule.foo = a;",
            options: [
                { blankLine: "always", prev: "*", next: "cjs-export" }
            ]
        },
        {
            code: "if (true) {\nmodule.exports = a;\n}",
            options: [
                { blankLine: "always", prev: "*", next: "cjs-export" }
            ]
        },

        //----------------------------------------------------------------------
        // From JSCS requirePaddingNewlinesBeforeKeywords
        // https://github.com/jscs-dev/node-jscs/blob/44f9b86eb0757fd4ca05a81a50450c5f1b25c37b/test/specs/rules/require-padding-newlines-before-keywords.js
        //----------------------------------------------------------------------

        {
            code: "function x() { return; }",
            options: [
                { blankLine: "always", prev: "*", next: ["if", "for", "return", "switch", "case", "break", "throw", "while", "default"] }
            ]
        },
        {
            code: "if (true) {} else if (false) {}",
            options: [
                { blankLine: "always", prev: "*", next: ["if", "for", "return", "switch", "case", "break", "throw", "while", "default"] }
            ]
        },
        {
            code: "function x() { var a = true; do { a = !a; } while (a); }",
            options: [
                { blankLine: "always", prev: "*", next: ["if", "for", "return", "switch", "case", "break", "throw", "while", "default"] }
            ]
        },
        {
            code: "function x() { if (true) return; }",
            options: [
                { blankLine: "always", prev: "*", next: ["if", "for", "return", "switch", "case", "break", "throw", "while", "default"] }
            ]
        },
        {
            code: "function test() {};",
            options: [
                { blankLine: "always", prev: "block-like", next: "block-like" }
            ]
        }
    ],
    invalid: [

        //----------------------------------------------------------------------
        // wildcard
        //----------------------------------------------------------------------

        {
            code: "foo();\n\nfoo();",
            output: "foo();\nfoo();",
            options: [
                { blankLine: "never", prev: "*", next: "*" }
            ],
            errors: [MESSAGE_NEVER]
        },
        {
            code: "foo();\n\n//comment\nfoo();",
            output: "foo();\n//comment\nfoo();",
            options: [
                { blankLine: "never", prev: "*", next: "*" }
            ],
            errors: [MESSAGE_NEVER]
        },
        {
            code: "    foo();\n    \n    //comment\n    foo();",
            output: "    foo();\n    //comment\n    foo();",
            options: [
                { blankLine: "never", prev: "*", next: "*" }
            ],
            errors: [MESSAGE_NEVER]
        },
        {
            code: "if (a) {}\n\nfor (;;) {}",
            output: "if (a) {}\nfor (;;) {}",
            options: [
                { blankLine: "never", prev: "*", next: "*" }
            ],
            errors: [MESSAGE_NEVER]
        },
        {
            code: "foo();\nfoo();",
            output: "foo();\n\nfoo();",
            options: [
                { blankLine: "always", prev: "*", next: "*" }
            ],
            errors: [MESSAGE_ALWAYS]
        },
        {
            code: "    function a() {}\n    do {} while (a)",
            output: "    function a() {}\n\n    do {} while (a)",
            options: [
                { blankLine: "always", prev: "*", next: "*" }
            ],
            errors: [MESSAGE_ALWAYS]
        },
        {
            code: "foo();//trailing-comment\n//comment\n//comment\nfoo();",
            output: "foo();//trailing-comment\n\n//comment\n//comment\nfoo();",
            options: [
                { blankLine: "always", prev: "*", next: "*" }
            ],
            errors: [MESSAGE_ALWAYS]
        },

        //----------------------------------------------------------------------
        // block-like
        //----------------------------------------------------------------------

        {
            code: "{}\n\nfoo()",
            output: "{}\nfoo()",
            options: [
                { blankLine: "never", prev: "block-like", next: "*" }
            ],
            errors: [MESSAGE_NEVER]
        },
        {
            code: "{}\nfoo()",
            output: "{}\n\nfoo()",
            options: [
                { blankLine: "always", prev: "block-like", next: "*" }
            ],
            errors: [MESSAGE_ALWAYS]
        },
        {
            code: "if(a){}\nfoo()",
            output: "if(a){}\n\nfoo()",
            options: [
                { blankLine: "always", prev: "block-like", next: "*" }
            ],
            errors: [MESSAGE_ALWAYS]
        },
        {
            code: "if(a){}else{}\nfoo()",
            output: "if(a){}else{}\n\nfoo()",
            options: [
                { blankLine: "always", prev: "block-like", next: "*" }
            ],
            errors: [MESSAGE_ALWAYS]
        },
        {
            code: "if(a){}else if(b){}\nfoo()",
            output: "if(a){}else if(b){}\n\nfoo()",
            options: [
                { blankLine: "always", prev: "block-like", next: "*" }
            ],
            errors: [MESSAGE_ALWAYS]
        },
        {
            code: "if(a){}else if(b){}else{}\nfoo()",
            output: "if(a){}else if(b){}else{}\n\nfoo()",
            options: [
                { blankLine: "always", prev: "block-like", next: "*" }
            ],
            errors: [MESSAGE_ALWAYS]
        },
        {
            code: "switch(a){}\nfoo()",
            output: "switch(a){}\n\nfoo()",
            options: [
                { blankLine: "always", prev: "block-like", next: "*" }
            ],
            errors: [MESSAGE_ALWAYS]
        },
        {
            code: "switch(a){case 0:}\nfoo()",
            output: "switch(a){case 0:}\n\nfoo()",
            options: [
                { blankLine: "always", prev: "block-like", next: "*" }
            ],
            errors: [MESSAGE_ALWAYS]
        },
        {
            code: "try{}catch(e){}\nfoo()",
            output: "try{}catch(e){}\n\nfoo()",
            options: [
                { blankLine: "always", prev: "block-like", next: "*" }
            ],
            errors: [MESSAGE_ALWAYS]
        },
        {
            code: "try{}finally{}\nfoo()",
            output: "try{}finally{}\n\nfoo()",
            options: [
                { blankLine: "always", prev: "block-like", next: "*" }
            ],
            errors: [MESSAGE_ALWAYS]
        },
        {
            code: "try{}catch(e){}finally{}\nfoo()",
            output: "try{}catch(e){}finally{}\n\nfoo()",
            options: [
                { blankLine: "always", prev: "block-like", next: "*" }
            ],
            errors: [MESSAGE_ALWAYS]
        },
        {
            code: "while(a){}\nfoo()",
            output: "while(a){}\n\nfoo()",
            options: [
                { blankLine: "always", prev: "block-like", next: "*" }
            ],
            errors: [MESSAGE_ALWAYS]
        },
        {
            code: "do{}while(a)\nfoo()",
            output: "do{}while(a)\n\nfoo()",
            options: [
                { blankLine: "always", prev: "block-like", next: "*" }
            ],
            errors: [MESSAGE_ALWAYS]
        },
        {
            code: "for(;;){}\nfoo()",
            output: "for(;;){}\n\nfoo()",
            options: [
                { blankLine: "always", prev: "block-like", next: "*" }
            ],
            errors: [MESSAGE_ALWAYS]
        },
        {
            code: "for(a in b){}\nfoo()",
            output: "for(a in b){}\n\nfoo()",
            options: [
                { blankLine: "always", prev: "block-like", next: "*" }
            ],
            errors: [MESSAGE_ALWAYS]
        },
        {
            code: "for(a of b){}\nfoo()",
            output: "for(a of b){}\n\nfoo()",
            options: [
                { blankLine: "always", prev: "block-like", next: "*" }
            ],
            errors: [MESSAGE_ALWAYS]
        },
        {
            code: "a=function(){}\nfoo()",
            output: "a=function(){}\n\nfoo()",
            options: [
                { blankLine: "always", prev: "block-like", next: "*" }
            ],
            errors: [MESSAGE_ALWAYS]
        },
        {
            code: "a=()=>{}\nfoo()",
            output: "a=()=>{}\n\nfoo()",
            options: [
                { blankLine: "always", prev: "block-like", next: "*" }
            ],
            errors: [MESSAGE_ALWAYS]
        },
        {
            code: "function a(){}\nfoo()",
            output: "function a(){}\n\nfoo()",
            options: [
                { blankLine: "always", prev: "block-like", next: "*" }
            ],
            errors: [MESSAGE_ALWAYS]
        },
        {
            code: "let a=function(){}\nfoo()",
            output: "let a=function(){}\n\nfoo()",
            options: [
                { blankLine: "always", prev: "block-like", next: "*" }
            ],
            errors: [MESSAGE_ALWAYS]
        },

        //----------------------------------------------------------------------
        // cjs-export
        //----------------------------------------------------------------------

        {
            code: "module.exports=1\n\nfoo()",
            output: "module.exports=1\nfoo()",
            options: [
                { blankLine: "never", prev: "cjs-export", next: "*" }
            ],
            errors: [MESSAGE_NEVER]
        },
        {
            code: "module.exports=1\nfoo()",
            output: "module.exports=1\n\nfoo()",
            options: [
                { blankLine: "always", prev: "cjs-export", next: "*" }
            ],
            errors: [MESSAGE_ALWAYS]
        },
        {
            code: "module.exports.foo=1\nfoo()",
            output: "module.exports.foo=1\n\nfoo()",
            options: [
                { blankLine: "always", prev: "cjs-export", next: "*" }
            ],
            errors: [MESSAGE_ALWAYS]
        },
        {
            code: "module.exports[foo]=1\nfoo()",
            output: "module.exports[foo]=1\n\nfoo()",
            options: [
                { blankLine: "always", prev: "cjs-export", next: "*" }
            ],
            errors: [MESSAGE_ALWAYS]
        },
        {
            code: "exports.foo=1\nfoo()",
            output: "exports.foo=1\n\nfoo()",
            options: [
                { blankLine: "always", prev: "cjs-export", next: "*" }
            ],
            errors: [MESSAGE_ALWAYS]
        },
        {
            code: "exports[foo]=1\nfoo()",
            output: "exports[foo]=1\n\nfoo()",
            options: [
                { blankLine: "always", prev: "cjs-export", next: "*" }
            ],
            errors: [MESSAGE_ALWAYS]
        },

        //----------------------------------------------------------------------
        // cjs-import
        //----------------------------------------------------------------------

        {
            code: "const foo=require(\"foo\")\n\nfoo()",
            output: "const foo=require(\"foo\")\nfoo()",
            options: [
                { blankLine: "never", prev: "cjs-import", next: "*" }
            ],
            errors: [MESSAGE_NEVER]
        },
        {
            code: "const foo=require(\"foo\")\nfoo()",
            output: "const foo=require(\"foo\")\n\nfoo()",
            options: [
                { blankLine: "always", prev: "cjs-import", next: "*" }
            ],
            errors: [MESSAGE_ALWAYS]
        },
        {
            code: "const foo=require(\"foo\").Foo\nfoo()",
            output: "const foo=require(\"foo\").Foo\n\nfoo()",
            options: [
                { blankLine: "always", prev: "cjs-import", next: "*" }
            ],
            errors: [MESSAGE_ALWAYS]
        },
        {
            code: "const foo=require(\"foo\")[a]\nfoo()",
            output: "const foo=require(\"foo\")[a]\n\nfoo()",
            options: [
                { blankLine: "always", prev: "cjs-import", next: "*" }
            ],
            errors: [MESSAGE_ALWAYS]
        },

        //----------------------------------------------------------------------
        // directive
        //----------------------------------------------------------------------

        {
            code: "\"use strict\"\n\nfoo()",
            output: "\"use strict\"\nfoo()",
            options: [
                { blankLine: "never", prev: "directive", next: "*" }
            ],
            errors: [MESSAGE_NEVER]
        },
        {
            code: "\"use strict\"\nfoo()",
            output: "\"use strict\"\n\nfoo()",
            options: [
                { blankLine: "always", prev: "directive", next: "*" }
            ],
            errors: [MESSAGE_ALWAYS]
        },
        {
            code: "'use strict'\nfoo()",
            output: "'use strict'\n\nfoo()",
            options: [
                { blankLine: "always", prev: "directive", next: "*" }
            ],
            errors: [MESSAGE_ALWAYS]
        },
        {
            code: "'use asm'\nfoo()",
            output: "'use asm'\n\nfoo()",
            options: [
                { blankLine: "always", prev: "directive", next: "*" }
            ],
            errors: [MESSAGE_ALWAYS]
        },

        //----------------------------------------------------------------------
        // multiline-block-like
        //----------------------------------------------------------------------

        {
            code: "{\n}\n\nfoo()",
            output: "{\n}\nfoo()",
            options: [
                { blankLine: "never", prev: "block-like", next: "*" }
            ],
            errors: [MESSAGE_NEVER]
        },
        {
            code: "{\n}\nfoo()",
            output: "{\n}\n\nfoo()",
            options: [
                { blankLine: "always", prev: "block-like", next: "*" }
            ],
            errors: [MESSAGE_ALWAYS]
        },
        {
            code: "if(a){\n}\nfoo()",
            output: "if(a){\n}\n\nfoo()",
            options: [
                { blankLine: "always", prev: "block-like", next: "*" }
            ],
            errors: [MESSAGE_ALWAYS]
        },
        {
            code: "if(a){\n}else{\n}\nfoo()",
            output: "if(a){\n}else{\n}\n\nfoo()",
            options: [
                { blankLine: "always", prev: "block-like", next: "*" }
            ],
            errors: [MESSAGE_ALWAYS]
        },
        {
            code: "if(a){\n}else if(b){\n}\nfoo()",
            output: "if(a){\n}else if(b){\n}\n\nfoo()",
            options: [
                { blankLine: "always", prev: "block-like", next: "*" }
            ],
            errors: [MESSAGE_ALWAYS]
        },
        {
            code: "if(a){\n}else if(b){\n}else{\n}\nfoo()",
            output: "if(a){\n}else if(b){\n}else{\n}\n\nfoo()",
            options: [
                { blankLine: "always", prev: "block-like", next: "*" }
            ],
            errors: [MESSAGE_ALWAYS]
        },
        {
            code: "switch(a){\n}\nfoo()",
            output: "switch(a){\n}\n\nfoo()",
            options: [
                { blankLine: "always", prev: "block-like", next: "*" }
            ],
            errors: [MESSAGE_ALWAYS]
        },
        {
            code: "try{\n}catch(e){\n}\nfoo()",
            output: "try{\n}catch(e){\n}\n\nfoo()",
            options: [
                { blankLine: "always", prev: "block-like", next: "*" }
            ],
            errors: [MESSAGE_ALWAYS]
        },
        {
            code: "try{\n}finally{\n}\nfoo()",
            output: "try{\n}finally{\n}\n\nfoo()",
            options: [
                { blankLine: "always", prev: "block-like", next: "*" }
            ],
            errors: [MESSAGE_ALWAYS]
        },
        {
            code: "try{\n}catch(e){\n}finally{\n}\nfoo()",
            output: "try{\n}catch(e){\n}finally{\n}\n\nfoo()",
            options: [
                { blankLine: "always", prev: "block-like", next: "*" }
            ],
            errors: [MESSAGE_ALWAYS]
        },
        {
            code: "while(a){\n}\nfoo()",
            output: "while(a){\n}\n\nfoo()",
            options: [
                { blankLine: "always", prev: "block-like", next: "*" }
            ],
            errors: [MESSAGE_ALWAYS]
        },
        {
            code: "do{\n}while(a)\nfoo()",
            output: "do{\n}while(a)\n\nfoo()",
            options: [
                { blankLine: "always", prev: "block-like", next: "*" }
            ],
            errors: [MESSAGE_ALWAYS]
        },
        {
            code: "for(;;){\n}\nfoo()",
            output: "for(;;){\n}\n\nfoo()",
            options: [
                { blankLine: "always", prev: "block-like", next: "*" }
            ],
            errors: [MESSAGE_ALWAYS]
        },
        {
            code: "for(a in b){\n}\nfoo()",
            output: "for(a in b){\n}\n\nfoo()",
            options: [
                { blankLine: "always", prev: "block-like", next: "*" }
            ],
            errors: [MESSAGE_ALWAYS]
        },
        {
            code: "for(a of b){\n}\nfoo()",
            output: "for(a of b){\n}\n\nfoo()",
            options: [
                { blankLine: "always", prev: "block-like", next: "*" }
            ],
            errors: [MESSAGE_ALWAYS]
        },
        {
            code: "a=function(){\n}\nfoo()",
            output: "a=function(){\n}\n\nfoo()",
            options: [
                { blankLine: "always", prev: "block-like", next: "*" }
            ],
            errors: [MESSAGE_ALWAYS]
        },
        {
            code: "a=()=>{\n}\nfoo()",
            output: "a=()=>{\n}\n\nfoo()",
            options: [
                { blankLine: "always", prev: "block-like", next: "*" }
            ],
            errors: [MESSAGE_ALWAYS]
        },
        {
            code: "function a(){\n}\nfoo()",
            output: "function a(){\n}\n\nfoo()",
            options: [
                { blankLine: "always", prev: "block-like", next: "*" }
            ],
            errors: [MESSAGE_ALWAYS]
        },
        {
            code: "let a=function(){\n}\nfoo()",
            output: "let a=function(){\n}\n\nfoo()",
            options: [
                { blankLine: "always", prev: "block-like", next: "*" }
            ],
            errors: [MESSAGE_ALWAYS]
        },

        //----------------------------------------------------------------------
        // block
        //----------------------------------------------------------------------

        {
            code: "{}\n\nfoo()",
            output: "{}\nfoo()",
            options: [
                { blankLine: "never", prev: "block", next: "*" }
            ],
            errors: [MESSAGE_NEVER]
        },
        {
            code: "{}\nfoo()",
            output: "{}\n\nfoo()",
            options: [
                { blankLine: "always", prev: "block", next: "*" }
            ],
            errors: [MESSAGE_ALWAYS]
        },

        //----------------------------------------------------------------------
        // empty
        //----------------------------------------------------------------------

        {
            code: ";\n\nfoo()",
            output: ";\nfoo()",
            options: [
                { blankLine: "never", prev: "empty", next: "*" }
            ],
            errors: [MESSAGE_NEVER]
        },
        {
            code: ";\nfoo()",
            output: ";\n\nfoo()",
            options: [
                { blankLine: "always", prev: "empty", next: "*" }
            ],
            errors: [MESSAGE_ALWAYS]
        },

        //----------------------------------------------------------------------
        // expression
        //----------------------------------------------------------------------

        {
            code: "foo()\n\nfoo()",
            output: "foo()\nfoo()",
            options: [
                { blankLine: "never", prev: "expression", next: "*" }
            ],
            errors: [MESSAGE_NEVER]
        },
        {
            code: "foo()\nfoo()",
            output: "foo()\n\nfoo()",
            options: [
                { blankLine: "always", prev: "expression", next: "*" }
            ],
            errors: [MESSAGE_ALWAYS]
        },

        //----------------------------------------------------------------------
        // multiline-expression
        //----------------------------------------------------------------------

        {
            code: "foo()\n\nfoo(\n\tx,\n\ty\n)",
            output: "foo()\nfoo(\n\tx,\n\ty\n)",
            options: [
                { blankLine: "never", prev: "*", next: "multiline-expression" }
            ],
            errors: [MESSAGE_NEVER]
        },
        {
            code: "foo()\nfoo(\n\tx,\n\ty\n)",
            output: "foo()\n\nfoo(\n\tx,\n\ty\n)",
            options: [
                { blankLine: "always", prev: "*", next: "multiline-expression" }
            ],
            errors: [MESSAGE_ALWAYS]
        },
        {
            code: "() => {\n\tsomeArray.forEach(\n\t\tx => doSomething(x)\n\t);\n\treturn theThing;\n}",
            output: "() => {\n\tsomeArray.forEach(\n\t\tx => doSomething(x)\n\t);\n\n\treturn theThing;\n}",
            options: [
                { blankLine: "always", prev: "multiline-expression", next: "return" }
            ],
            errors: [MESSAGE_ALWAYS]
        },

        //----------------------------------------------------------------------
        // break
        //----------------------------------------------------------------------

        {
            code: "while(a){break\n\nfoo()}",
            output: "while(a){break\nfoo()}",
            options: [
                { blankLine: "never", prev: "break", next: "*" }
            ],
            errors: [MESSAGE_NEVER]
        },
        {
            code: "switch(a){case 0:break\n\nfoo()}",
            output: "switch(a){case 0:break\nfoo()}",
            options: [
                { blankLine: "never", prev: "break", next: "*" }
            ],
            errors: [MESSAGE_NEVER]
        },
        {
            code: "while(a){break\nfoo()}",
            output: "while(a){break\n\nfoo()}",
            options: [
                { blankLine: "always", prev: "break", next: "*" }
            ],
            errors: [MESSAGE_ALWAYS]
        },
        {
            code: "switch(a){case 0:break\nfoo()}",
            output: "switch(a){case 0:break\n\nfoo()}",
            options: [
                { blankLine: "always", prev: "break", next: "*" }
            ],
            errors: [MESSAGE_ALWAYS]
        },

        //----------------------------------------------------------------------
        // case
        //----------------------------------------------------------------------

        {
            code: "switch(a){case 0:\nfoo()\n\ndefault:}",
            output: "switch(a){case 0:\nfoo()\ndefault:}",
            options: [
                { blankLine: "never", prev: "case", next: "*" }
            ],
            errors: [MESSAGE_NEVER]
        },
        {
            code: "switch(a){case 0:\nfoo()\ndefault:}",
            output: "switch(a){case 0:\nfoo()\n\ndefault:}",
            options: [
                { blankLine: "always", prev: "case", next: "*" }
            ],
            errors: [MESSAGE_ALWAYS]
        },

        //----------------------------------------------------------------------
        // class
        //----------------------------------------------------------------------

        {
            code: "class A{}\n\nfoo()",
            output: "class A{}\nfoo()",
            options: [
                { blankLine: "never", prev: "class", next: "*" }
            ],
            errors: [MESSAGE_NEVER]
        },
        {
            code: "class A{}\nfoo()",
            output: "class A{}\n\nfoo()",
            options: [
                { blankLine: "always", prev: "class", next: "*" }
            ],
            errors: [MESSAGE_ALWAYS]
        },

        //----------------------------------------------------------------------
        // const
        //----------------------------------------------------------------------

        {
            code: "const a=1\n\nfoo()",
            output: "const a=1\nfoo()",
            options: [
                { blankLine: "never", prev: "const", next: "*" }
            ],
            errors: [MESSAGE_NEVER]
        },
        {
            code: "const a=1\nfoo()",
            output: "const a=1\n\nfoo()",
            options: [
                { blankLine: "always", prev: "const", next: "*" }
            ],
            errors: [MESSAGE_ALWAYS]
        },

        //----------------------------------------------------------------------
        // continue
        //----------------------------------------------------------------------

        {
            code: "while(a){continue\n\nfoo()}",
            output: "while(a){continue\nfoo()}",
            options: [
                { blankLine: "never", prev: "continue", next: "*" }
            ],
            errors: [MESSAGE_NEVER]
        },
        {
            code: "while(a){continue\nfoo()}",
            output: "while(a){continue\n\nfoo()}",
            options: [
                { blankLine: "always", prev: "continue", next: "*" }
            ],
            errors: [MESSAGE_ALWAYS]
        },

        //----------------------------------------------------------------------
        // debugger
        //----------------------------------------------------------------------

        {
            code: "debugger\n\nfoo()",
            output: "debugger\nfoo()",
            options: [
                { blankLine: "never", prev: "debugger", next: "*" }
            ],
            errors: [MESSAGE_NEVER]
        },
        {
            code: "debugger\nfoo()",
            output: "debugger\n\nfoo()",
            options: [
                { blankLine: "always", prev: "debugger", next: "*" }
            ],
            errors: [MESSAGE_ALWAYS]
        },

        //----------------------------------------------------------------------
        // default
        //----------------------------------------------------------------------

        {
            code: "switch(a){default:\nfoo()\n\ncase 0:}",
            output: "switch(a){default:\nfoo()\ncase 0:}",
            options: [
                { blankLine: "never", prev: "default", next: "*" }
            ],
            errors: [MESSAGE_NEVER]
        },
        {
            code: "switch(a){default:\nfoo()\ncase 0:}",
            output: "switch(a){default:\nfoo()\n\ncase 0:}",
            options: [
                { blankLine: "always", prev: "default", next: "*" }
            ],
            errors: [MESSAGE_ALWAYS]
        },

        //----------------------------------------------------------------------
        // do
        //----------------------------------------------------------------------

        {
            code: "do;while(a)\n\nfoo()",
            output: "do;while(a)\nfoo()",
            options: [
                { blankLine: "never", prev: "do", next: "*" }
            ],
            errors: [MESSAGE_NEVER]
        },
        {
            code: "do;while(a)\nfoo()",
            output: "do;while(a)\n\nfoo()",
            options: [
                { blankLine: "always", prev: "do", next: "*" }
            ],
            errors: [MESSAGE_ALWAYS]
        },

        //----------------------------------------------------------------------
        // export
        //----------------------------------------------------------------------

        {
            code: "export default 1\n\nfoo()",
            output: "export default 1\nfoo()",
            options: [
                { blankLine: "never", prev: "export", next: "*" }
            ],
            parserOptions: { sourceType: "module" },
            errors: [MESSAGE_NEVER]
        },
        {
            code: "export let a=1\n\nfoo()",
            output: "export let a=1\nfoo()",
            options: [
                { blankLine: "never", prev: "export", next: "*" }
            ],
            parserOptions: { sourceType: "module" },
            errors: [MESSAGE_NEVER]
        },
        {
            code: "var a = 0;export {a}\n\nfoo()",
            output: "var a = 0;export {a}\nfoo()",
            options: [
                { blankLine: "never", prev: "export", next: "*" }
            ],
            parserOptions: { sourceType: "module" },
            errors: [MESSAGE_NEVER]
        },
        {
            code: "export default 1\nfoo()",
            output: "export default 1\n\nfoo()",
            options: [
                { blankLine: "always", prev: "export", next: "*" }
            ],
            parserOptions: { sourceType: "module" },
            errors: [MESSAGE_ALWAYS]
        },
        {
            code: "export let a=1\nfoo()",
            output: "export let a=1\n\nfoo()",
            options: [
                { blankLine: "always", prev: "export", next: "*" }
            ],
            parserOptions: { sourceType: "module" },
            errors: [MESSAGE_ALWAYS]
        },
        {
            code: "var a = 0;export {a}\nfoo()",
            output: "var a = 0;export {a}\n\nfoo()",
            options: [
                { blankLine: "always", prev: "export", next: "*" }
            ],
            parserOptions: { sourceType: "module" },
            errors: [MESSAGE_ALWAYS]
        },

        //----------------------------------------------------------------------
        // for
        //----------------------------------------------------------------------

        {
            code: "for(;;);\n\nfoo()",
            output: "for(;;);\nfoo()",
            options: [
                { blankLine: "never", prev: "for", next: "*" }
            ],
            errors: [MESSAGE_NEVER]
        },
        {
            code: "for(a in b);\n\nfoo()",
            output: "for(a in b);\nfoo()",
            options: [
                { blankLine: "never", prev: "for", next: "*" }
            ],
            errors: [MESSAGE_NEVER]
        },
        {
            code: "for(a of b);\n\nfoo()",
            output: "for(a of b);\nfoo()",
            options: [
                { blankLine: "never", prev: "for", next: "*" }
            ],
            errors: [MESSAGE_NEVER]
        },
        {
            code: "for(;;);\nfoo()",
            output: "for(;;);\n\nfoo()",
            options: [
                { blankLine: "always", prev: "for", next: "*" }
            ],
            errors: [MESSAGE_ALWAYS]
        },
        {
            code: "for(a in b);\nfoo()",
            output: "for(a in b);\n\nfoo()",
            options: [
                { blankLine: "always", prev: "for", next: "*" }
            ],
            errors: [MESSAGE_ALWAYS]
        },
        {
            code: "for(a of b);\nfoo()",
            output: "for(a of b);\n\nfoo()",
            options: [
                { blankLine: "always", prev: "for", next: "*" }
            ],
            errors: [MESSAGE_ALWAYS]
        },

        //----------------------------------------------------------------------
        // function
        //----------------------------------------------------------------------

        {
            code: "function foo(){}\n\nfoo()",
            output: "function foo(){}\nfoo()",
            options: [
                { blankLine: "never", prev: "function", next: "*" }
            ],
            errors: [MESSAGE_NEVER]
        },
        {
            code: "function foo(){}\nfoo()",
            output: "function foo(){}\n\nfoo()",
            options: [
                { blankLine: "always", prev: "function", next: "*" }
            ],
            errors: [MESSAGE_ALWAYS]
        },
        {
            code: "async function foo(){}\nfoo()",
            output: "async function foo(){}\n\nfoo()",
            options: [
                { blankLine: "never", prev: "*", next: "*" },
                { blankLine: "always", prev: "function", next: "*" }
            ],
            errors: [MESSAGE_ALWAYS]
        },

        //----------------------------------------------------------------------
        // if
        //----------------------------------------------------------------------

        {
            code: "if(a);\n\nfoo()",
            output: "if(a);\nfoo()",
            options: [
                { blankLine: "never", prev: "if", next: "*" }
            ],
            errors: [MESSAGE_NEVER]
        },
        {
            code: "if(a);else;\n\nfoo()",
            output: "if(a);else;\nfoo()",
            options: [
                { blankLine: "never", prev: "if", next: "*" }
            ],
            errors: [MESSAGE_NEVER]
        },
        {
            code: "if(a);\nfoo()",
            output: "if(a);\n\nfoo()",
            options: [
                { blankLine: "always", prev: "if", next: "*" }
            ],
            errors: [MESSAGE_ALWAYS]
        },
        {
            code: "if(a);else;\nfoo()",
            output: "if(a);else;\n\nfoo()",
            options: [
                { blankLine: "always", prev: "if", next: "*" }
            ],
            errors: [MESSAGE_ALWAYS]
        },

        //----------------------------------------------------------------------
        // iife
        //----------------------------------------------------------------------

        {
            code: "(function(){\n})()\n\nvar a = 2;",
            output: "(function(){\n})()\nvar a = 2;",
            options: [
                { blankLine: "never", prev: "iife", next: "*" }
            ],
            errors: [MESSAGE_NEVER]
        },
        {
            code: "+(function(){\n})()\n\nvar a = 2;",
            output: "+(function(){\n})()\nvar a = 2;",
            options: [
                { blankLine: "never", prev: "iife", next: "*" }
            ],
            errors: [MESSAGE_NEVER]
        },
        {
            code: "(function(){\n})()\nvar a = 2;",
            output: "(function(){\n})()\n\nvar a = 2;",
            options: [
                { blankLine: "always", prev: "iife", next: "*" }
            ],
            errors: [MESSAGE_ALWAYS]
        },
        {
            code: "+(function(){\n})()\nvar a = 2;",
            output: "+(function(){\n})()\n\nvar a = 2;",
            options: [
                { blankLine: "always", prev: "iife", next: "*" }
            ],
            errors: [MESSAGE_ALWAYS]
        },

        //----------------------------------------------------------------------
        // import
        //----------------------------------------------------------------------

        {
            code: "import a from 'a'\n\nfoo()",
            output: "import a from 'a'\nfoo()",
            options: [
                { blankLine: "never", prev: "import", next: "*" }
            ],
            parserOptions: { sourceType: "module" },
            errors: [MESSAGE_NEVER]
        },
        {
            code: "import * as a from 'a'\n\nfoo()",
            output: "import * as a from 'a'\nfoo()",
            options: [
                { blankLine: "never", prev: "import", next: "*" }
            ],
            parserOptions: { sourceType: "module" },
            errors: [MESSAGE_NEVER]
        },
        {
            code: "import {a} from 'a'\n\nfoo()",
            output: "import {a} from 'a'\nfoo()",
            options: [
                { blankLine: "never", prev: "import", next: "*" }
            ],
            parserOptions: { sourceType: "module" },
            errors: [MESSAGE_NEVER]
        },
        {
            code: "import a from 'a'\nfoo()",
            output: "import a from 'a'\n\nfoo()",
            options: [
                { blankLine: "always", prev: "import", next: "*" }
            ],
            parserOptions: { sourceType: "module" },
            errors: [MESSAGE_ALWAYS]
        },
        {
            code: "import * as a from 'a'\nfoo()",
            output: "import * as a from 'a'\n\nfoo()",
            options: [
                { blankLine: "always", prev: "import", next: "*" }
            ],
            parserOptions: { sourceType: "module" },
            errors: [MESSAGE_ALWAYS]
        },
        {
            code: "import {a} from 'a'\nfoo()",
            output: "import {a} from 'a'\n\nfoo()",
            options: [
                { blankLine: "always", prev: "import", next: "*" }
            ],
            parserOptions: { sourceType: "module" },
            errors: [MESSAGE_ALWAYS]
        },

        //----------------------------------------------------------------------
        // let
        //----------------------------------------------------------------------

        {
            code: "let a\n\nfoo()",
            output: "let a\nfoo()",
            options: [
                { blankLine: "never", prev: "let", next: "*" }
            ],
            errors: [MESSAGE_NEVER]
        },
        {
            code: "let a\nfoo()",
            output: "let a\n\nfoo()",
            options: [
                { blankLine: "always", prev: "let", next: "*" }
            ],
            errors: [MESSAGE_ALWAYS]
        },

        //----------------------------------------------------------------------
        // return
        //----------------------------------------------------------------------

        {
            code: "function foo(){return\n\nfoo()}",
            output: "function foo(){return\nfoo()}",
            options: [
                { blankLine: "never", prev: "return", next: "*" }
            ],
            errors: [MESSAGE_NEVER]
        },
        {
            code: "function foo(){return\nfoo()}",
            output: "function foo(){return\n\nfoo()}",
            options: [
                { blankLine: "always", prev: "return", next: "*" }
            ],
            errors: [MESSAGE_ALWAYS]
        },

        //----------------------------------------------------------------------
        // switch
        //----------------------------------------------------------------------

        {
            code: "switch(a){}\n\nfoo()",
            output: "switch(a){}\nfoo()",
            options: [
                { blankLine: "never", prev: "switch", next: "*" }
            ],
            errors: [MESSAGE_NEVER]
        },
        {
            code: "switch(a){}\nfoo()",
            output: "switch(a){}\n\nfoo()",
            options: [
                { blankLine: "always", prev: "switch", next: "*" }
            ],
            errors: [MESSAGE_ALWAYS]
        },

        //----------------------------------------------------------------------
        // throw
        //----------------------------------------------------------------------

        {
            code: "throw a\n\nfoo()",
            output: "throw a\nfoo()",
            options: [
                { blankLine: "never", prev: "throw", next: "*" }
            ],
            errors: [MESSAGE_NEVER]
        },
        {
            code: "throw a\nfoo()",
            output: "throw a\n\nfoo()",
            options: [
                { blankLine: "always", prev: "throw", next: "*" }
            ],
            errors: [MESSAGE_ALWAYS]
        },

        //----------------------------------------------------------------------
        // try
        //----------------------------------------------------------------------

        {
            code: "try{}catch(e){}\n\nfoo()",
            output: "try{}catch(e){}\nfoo()",
            options: [
                { blankLine: "never", prev: "try", next: "*" }
            ],
            errors: [MESSAGE_NEVER]
        },
        {
            code: "try{}finally{}\n\nfoo()",
            output: "try{}finally{}\nfoo()",
            options: [
                { blankLine: "never", prev: "try", next: "*" }
            ],
            errors: [MESSAGE_NEVER]
        },
        {
            code: "try{}catch(e){}finally{}\n\nfoo()",
            output: "try{}catch(e){}finally{}\nfoo()",
            options: [
                { blankLine: "never", prev: "try", next: "*" }
            ],
            errors: [MESSAGE_NEVER]
        },
        {
            code: "try{}catch(e){}\nfoo()",
            output: "try{}catch(e){}\n\nfoo()",
            options: [
                { blankLine: "always", prev: "try", next: "*" }
            ],
            errors: [MESSAGE_ALWAYS]
        },
        {
            code: "try{}finally{}\nfoo()",
            output: "try{}finally{}\n\nfoo()",
            options: [
                { blankLine: "always", prev: "try", next: "*" }
            ],
            errors: [MESSAGE_ALWAYS]
        },
        {
            code: "try{}catch(e){}finally{}\nfoo()",
            output: "try{}catch(e){}finally{}\n\nfoo()",
            options: [
                { blankLine: "always", prev: "try", next: "*" }
            ],
            errors: [MESSAGE_ALWAYS]
        },

        //----------------------------------------------------------------------
        // var
        //----------------------------------------------------------------------

        {
            code: "var a\n\nfoo()",
            output: "var a\nfoo()",
            options: [
                { blankLine: "never", prev: "var", next: "*" }
            ],
            errors: [MESSAGE_NEVER]
        },
        {
            code: "var a\nfoo()",
            output: "var a\n\nfoo()",
            options: [
                { blankLine: "always", prev: "var", next: "*" }
            ],
            errors: [MESSAGE_ALWAYS]
        },

        //----------------------------------------------------------------------
        // while
        //----------------------------------------------------------------------

        {
            code: "while(a);\n\nfoo()",
            output: "while(a);\nfoo()",
            options: [
                { blankLine: "never", prev: "while", next: "*" }
            ],
            errors: [MESSAGE_NEVER]
        },
        {
            code: "while(a);\nfoo()",
            output: "while(a);\n\nfoo()",
            options: [
                { blankLine: "always", prev: "while", next: "*" }
            ],
            errors: [MESSAGE_ALWAYS]
        },

        //----------------------------------------------------------------------
        // with
        //----------------------------------------------------------------------

        {
            code: "with(a);\n\nfoo()",
            output: "with(a);\nfoo()",
            options: [
                { blankLine: "never", prev: "with", next: "*" }
            ],
            errors: [MESSAGE_NEVER]
        },
        {
            code: "with(a);\nfoo()",
            output: "with(a);\n\nfoo()",
            options: [
                { blankLine: "always", prev: "with", next: "*" }
            ],
            errors: [MESSAGE_ALWAYS]
        },

        //----------------------------------------------------------------------
        // multiline-const
        //----------------------------------------------------------------------

        {
            code: "const a={\nb:1,\nc:2\n}\n\nconst d=3",
            output: "const a={\nb:1,\nc:2\n}\nconst d=3",
            options: [
                { blankLine: "never", prev: "multiline-const", next: "*" }
            ],
            errors: [MESSAGE_NEVER]
        },
        {
            code: "const a={\nb:1,\nc:2\n}\nconst d=3",
            output: "const a={\nb:1,\nc:2\n}\n\nconst d=3",
            options: [
                { blankLine: "always", prev: "multiline-const", next: "*" }
            ],
            errors: [MESSAGE_ALWAYS]
        },
        {
            code: "const a=1\n\nconst b={\nc:2,\nd:3\n}",
            output: "const a=1\nconst b={\nc:2,\nd:3\n}",
            options: [
                { blankLine: "never", prev: "*", next: "multiline-const" }
            ],
            errors: [MESSAGE_NEVER]
        },
        {
            code: "const a=1\nconst b={\nc:2,\nd:3\n}",
            output: "const a=1\n\nconst b={\nc:2,\nd:3\n}",
            options: [
                { blankLine: "always", prev: "*", next: "multiline-const" }
            ],
            errors: [MESSAGE_ALWAYS]
        },

        //----------------------------------------------------------------------
        // multiline-let
        //----------------------------------------------------------------------

        {
            code: "let a={\nb:1,\nc:2\n}\n\nlet d=3",
            output: "let a={\nb:1,\nc:2\n}\nlet d=3",
            options: [
                { blankLine: "never", prev: "multiline-let", next: "*" }
            ],
            errors: [MESSAGE_NEVER]
        },
        {
            code: "let a={\nb:1,\nc:2\n}\nlet d=3",
            output: "let a={\nb:1,\nc:2\n}\n\nlet d=3",
            options: [
                { blankLine: "always", prev: "multiline-let", next: "*" }
            ],
            errors: [MESSAGE_ALWAYS]
        },
        {
            code: "let a=1\n\nlet b={\nc:2,\nd:3\n}",
            output: "let a=1\nlet b={\nc:2,\nd:3\n}",
            options: [
                { blankLine: "never", prev: "*", next: "multiline-let" }
            ],
            errors: [MESSAGE_NEVER]
        },
        {
            code: "let a=1\nlet b={\nc:2,\nd:3\n}",
            output: "let a=1\n\nlet b={\nc:2,\nd:3\n}",
            options: [
                { blankLine: "always", prev: "*", next: "multiline-let" }
            ],
            errors: [MESSAGE_ALWAYS]
        },

        //----------------------------------------------------------------------
        // multiline-var
        //----------------------------------------------------------------------

        {
            code: "var a={\nb:1,\nc:2\n}\n\nvar d=3",
            output: "var a={\nb:1,\nc:2\n}\nvar d=3",
            options: [
                { blankLine: "never", prev: "multiline-var", next: "*" }
            ],
            errors: [MESSAGE_NEVER]
        },
        {
            code: "var a={\nb:1,\nc:2\n}\nvar d=3",
            output: "var a={\nb:1,\nc:2\n}\n\nvar d=3",
            options: [
                { blankLine: "always", prev: "multiline-var", next: "*" }
            ],
            errors: [MESSAGE_ALWAYS]
        },
        {
            code: "var a=1\n\nvar b={\nc:2,\nd:3\n}",
            output: "var a=1\nvar b={\nc:2,\nd:3\n}",
            options: [
                { blankLine: "never", prev: "*", next: "multiline-var" }
            ],
            errors: [MESSAGE_NEVER]
        },
        {
            code: "var a=1\nvar b={\nc:2,\nd:3\n}",
            output: "var a=1\n\nvar b={\nc:2,\nd:3\n}",
            options: [
                { blankLine: "always", prev: "*", next: "multiline-var" }
            ],
            errors: [MESSAGE_ALWAYS]
        },

        //----------------------------------------------------------------------
        // singleline-const
        //----------------------------------------------------------------------

        {
            code: "const a=1\n\nconst b=2",
            output: "const a=1\nconst b=2",
            options: [
                { blankLine: "never", prev: "singleline-const", next: "*" }
            ],
            errors: [MESSAGE_NEVER]
        },
        {
            code: "const a=1\nconst b=2",
            output: "const a=1\n\nconst b=2",
            options: [
                { blankLine: "always", prev: "singleline-const", next: "*" }
            ],
            errors: [MESSAGE_ALWAYS]
        },
        {
            code: "const a=1\n\nconst b=2",
            output: "const a=1\nconst b=2",
            options: [
                { blankLine: "never", prev: "*", next: "singleline-const" }
            ],
            errors: [MESSAGE_NEVER]
        },
        {
            code: "const a=1\nconst b=2",
            output: "const a=1\n\nconst b=2",
            options: [
                { blankLine: "always", prev: "*", next: "singleline-const" }
            ],
            errors: [MESSAGE_ALWAYS]
        },

        //----------------------------------------------------------------------
        // singleline-let
        //----------------------------------------------------------------------

        {
            code: "let a=1\n\nlet b=2",
            output: "let a=1\nlet b=2",
            options: [
                { blankLine: "never", prev: "singleline-let", next: "*" }
            ],
            errors: [MESSAGE_NEVER]
        },
        {
            code: "let a=1\nlet b=2",
            output: "let a=1\n\nlet b=2",
            options: [
                { blankLine: "always", prev: "singleline-let", next: "*" }
            ],
            errors: [MESSAGE_ALWAYS]
        },
        {
            code: "let a=1\n\nlet b=2",
            output: "let a=1\nlet b=2",
            options: [
                { blankLine: "never", prev: "*", next: "singleline-let" }
            ],
            errors: [MESSAGE_NEVER]
        },
        {
            code: "let a=1\nlet b=2",
            output: "let a=1\n\nlet b=2",
            options: [
                { blankLine: "always", prev: "*", next: "singleline-let" }
            ],
            errors: [MESSAGE_ALWAYS]
        },

        //----------------------------------------------------------------------
        // singleline-var
        //----------------------------------------------------------------------

        {
            code: "var a=1\n\nvar b=2",
            output: "var a=1\nvar b=2",
            options: [
                { blankLine: "never", prev: "singleline-var", next: "*" }
            ],
            errors: [MESSAGE_NEVER]
        },
        {
            code: "var a=1\nvar b=2",
            output: "var a=1\n\nvar b=2",
            options: [
                { blankLine: "always", prev: "singleline-var", next: "*" }
            ],
            errors: [MESSAGE_ALWAYS]
        },
        {
            code: "var a=1\n\nvar b=2",
            output: "var a=1\nvar b=2",
            options: [
                { blankLine: "never", prev: "*", next: "singleline-var" }
            ],
            errors: [MESSAGE_NEVER]
        },
        {
            code: "var a=1\nvar b=2",
            output: "var a=1\n\nvar b=2",
            options: [
                { blankLine: "always", prev: "*", next: "singleline-var" }
            ],
            errors: [MESSAGE_ALWAYS]
        },

        //----------------------------------------------------------------------
        // Tests from newline-after-var
        //----------------------------------------------------------------------

        // should disallow no line break in "always" mode
        {
            code: "var greet = 'hello';console.log(greet);",
            output: "var greet = 'hello';\n\nconsole.log(greet);",
            options: [
                { blankLine: "always", prev: ["const", "let", "var"], next: "*" },
                { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] }
            ],
            errors: [MESSAGE_ALWAYS]
        },
        {
            code: "var greet = 'hello';var name = 'world';console.log(greet, name);",
            output: "var greet = 'hello';var name = 'world';\n\nconsole.log(greet, name);",
            options: [
                { blankLine: "always", prev: ["const", "let", "var"], next: "*" },
                { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] }
            ],
            errors: [MESSAGE_ALWAYS]
        },
        {
            code: "var greet = 'hello', name = 'world';console.log(greet, name);",
            output: "var greet = 'hello', name = 'world';\n\nconsole.log(greet, name);",
            options: [
                { blankLine: "always", prev: ["const", "let", "var"], next: "*" },
                { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] }
            ],
            errors: [MESSAGE_ALWAYS]
        },

        // should disallow no blank line in "always" mode
        {
            code: "var greet = 'hello';\nconsole.log(greet);",
            output: "var greet = 'hello';\n\nconsole.log(greet);",
            options: [
                { blankLine: "always", prev: ["const", "let", "var"], next: "*" },
                { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] }
            ],
            errors: [MESSAGE_ALWAYS]
        },
        {
            code: "var greet = 'hello';    \nconsole.log(greet);",
            output: "var greet = 'hello';\n    \nconsole.log(greet);",
            options: [
                { blankLine: "always", prev: ["const", "let", "var"], next: "*" },
                { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] }
            ],
            errors: [MESSAGE_ALWAYS]
        },
        {
            code: "var greet = 'hello'; // inline comment\nconsole.log(greet);",
            output: "var greet = 'hello'; // inline comment\n\nconsole.log(greet);",
            options: [
                { blankLine: "always", prev: ["const", "let", "var"], next: "*" },
                { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] }
            ],
            errors: [MESSAGE_ALWAYS]
        },
        {
            code: "var greet = 'hello';\nvar name = 'world';\nconsole.log(greet, name);",
            output: "var greet = 'hello';\nvar name = 'world';\n\nconsole.log(greet, name);",
            options: [
                { blankLine: "always", prev: ["const", "let", "var"], next: "*" },
                { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] }
            ],
            errors: [MESSAGE_ALWAYS]
        },
        {
            code: "var greet = 'hello', name = 'world';\nconsole.log(greet, name);",
            output: "var greet = 'hello', name = 'world';\n\nconsole.log(greet, name);",
            options: [
                { blankLine: "always", prev: ["const", "let", "var"], next: "*" },
                { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] }
            ],
            errors: [MESSAGE_ALWAYS]
        },
        {
            code: "var greet = 'hello',\nname = 'world';\nconsole.log(greet, name);",
            output: "var greet = 'hello',\nname = 'world';\n\nconsole.log(greet, name);",
            options: [
                { blankLine: "always", prev: ["const", "let", "var"], next: "*" },
                { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] }
            ],
            errors: [MESSAGE_ALWAYS]
        },
        {
            code: "let greet = 'hello';\nconsole.log(greet);",
            output: "let greet = 'hello';\n\nconsole.log(greet);",
            options: [
                { blankLine: "always", prev: ["const", "let", "var"], next: "*" },
                { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] }
            ],
            errors: [MESSAGE_ALWAYS]
        },
        {
            code: "const greet = 'hello';\nconsole.log(greet);",
            output: "const greet = 'hello';\n\nconsole.log(greet);",
            options: [
                { blankLine: "always", prev: ["const", "let", "var"], next: "*" },
                { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] }
            ],
            errors: [MESSAGE_ALWAYS]
        },
        {
            code: "function example() {\nvar greet = 'hello';\nconsole.log(greet);\n}",
            output: "function example() {\nvar greet = 'hello';\n\nconsole.log(greet);\n}",
            options: [
                { blankLine: "always", prev: ["const", "let", "var"], next: "*" },
                { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] }
            ],
            errors: [MESSAGE_ALWAYS]
        },
        {
            code: "var f = function() {\nvar greet = 'hello';\nconsole.log(greet);\n};",
            output: "var f = function() {\nvar greet = 'hello';\n\nconsole.log(greet);\n};",
            options: [
                { blankLine: "always", prev: ["const", "let", "var"], next: "*" },
                { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] }
            ],
            errors: [MESSAGE_ALWAYS]
        },
        {
            code: "() => {\nvar greet = 'hello';\nconsole.log(greet);\n}",
            output: "() => {\nvar greet = 'hello';\n\nconsole.log(greet);\n}",
            options: [
                { blankLine: "always", prev: ["const", "let", "var"], next: "*" },
                { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] }
            ],
            errors: [MESSAGE_ALWAYS]
        },

        // should disallow blank lines in "never" mode
        {
            code: "var greet = 'hello';\n\nconsole.log(greet);",
            output: "var greet = 'hello';\nconsole.log(greet);",
            options: [
                { blankLine: "never", prev: ["const", "let", "var"], next: "*" },
                { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] }
            ],
            errors: [MESSAGE_NEVER]
        },
        {
            code: "var greet = 'hello';\n\n\nconsole.log(greet);",
            output: "var greet = 'hello';\nconsole.log(greet);",
            options: [
                { blankLine: "never", prev: ["const", "let", "var"], next: "*" },
                { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] }
            ],
            errors: [MESSAGE_NEVER]
        },
        {
            code: "var greet = 'hello';\n\n\n\nconsole.log(greet);",
            output: "var greet = 'hello';\nconsole.log(greet);",
            options: [
                { blankLine: "never", prev: ["const", "let", "var"], next: "*" },
                { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] }
            ],
            errors: [MESSAGE_NEVER]
        },
        {
            code: "var greet = 'hello';    \n\nconsole.log(greet);",
            output: "var greet = 'hello';    \nconsole.log(greet);",
            options: [
                { blankLine: "never", prev: ["const", "let", "var"], next: "*" },
                { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] }
            ],
            errors: [MESSAGE_NEVER]
        },
        {
            code: "var greet = 'hello'; // inline comment\n\nconsole.log(greet);",
            output: "var greet = 'hello'; // inline comment\nconsole.log(greet);",
            options: [
                { blankLine: "never", prev: ["const", "let", "var"], next: "*" },
                { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] }
            ],
            errors: [MESSAGE_NEVER]
        },
        {
            code: "var greet = 'hello';\nvar name = 'world';\n\nconsole.log(greet, name);",
            output: "var greet = 'hello';\nvar name = 'world';\nconsole.log(greet, name);",
            options: [
                { blankLine: "never", prev: ["const", "let", "var"], next: "*" },
                { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] }
            ],
            errors: [MESSAGE_NEVER]
        },
        {
            code: "var greet = 'hello', name = 'world';\n\nconsole.log(greet, name);",
            output: "var greet = 'hello', name = 'world';\nconsole.log(greet, name);",
            options: [
                { blankLine: "never", prev: ["const", "let", "var"], next: "*" },
                { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] }
            ],
            errors: [MESSAGE_NEVER]
        },
        {
            code: "var greet = 'hello',\nname = 'world';\n\nconsole.log(greet, name);",
            output: "var greet = 'hello',\nname = 'world';\nconsole.log(greet, name);",
            options: [
                { blankLine: "never", prev: ["const", "let", "var"], next: "*" },
                { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] }
            ],
            errors: [MESSAGE_NEVER]
        },
        {
            code: "var greet = 'hello', // inline comment\nname = 'world'; // inline comment\n\nconsole.log(greet, name);",
            output: "var greet = 'hello', // inline comment\nname = 'world'; // inline comment\nconsole.log(greet, name);",
            options: [
                { blankLine: "never", prev: ["const", "let", "var"], next: "*" },
                { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] }
            ],
            errors: [MESSAGE_NEVER]
        },
        {
            code: "let greet = 'hello';\n\nconsole.log(greet);",
            output: "let greet = 'hello';\nconsole.log(greet);",
            options: [
                { blankLine: "never", prev: ["const", "let", "var"], next: "*" },
                { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] }
            ],
            errors: [MESSAGE_NEVER]
        },
        {
            code: "const greet = 'hello';\n\nconsole.log(greet);",
            output: "const greet = 'hello';\nconsole.log(greet);",
            options: [
                { blankLine: "never", prev: ["const", "let", "var"], next: "*" },
                { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] }
            ],
            errors: [MESSAGE_NEVER]
        },

        // should disallow a comment on the next line that's not in turn followed by a blank in "always" mode
        {
            code: "var greet = 'hello';\n// next-line comment\nconsole.log(greet);",
            output: "var greet = 'hello';\n\n// next-line comment\nconsole.log(greet);",
            options: [
                { blankLine: "always", prev: ["const", "let", "var"], next: "*" },
                { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] }
            ],
            errors: [MESSAGE_ALWAYS]
        },
        {
            code: "var greet = 'hello';\n/* block comment\nblock comment */\nconsole.log(greet);",
            output: "var greet = 'hello';\n\n/* block comment\nblock comment */\nconsole.log(greet);",
            options: [
                { blankLine: "always", prev: ["const", "let", "var"], next: "*" },
                { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] }
            ],
            errors: [MESSAGE_ALWAYS]
        },
        {
            code: "var greet = 'hello',\nname = 'world';\n// next-line comment\nconsole.log(greet);",
            output: "var greet = 'hello',\nname = 'world';\n\n// next-line comment\nconsole.log(greet);",
            options: [
                { blankLine: "always", prev: ["const", "let", "var"], next: "*" },
                { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] }
            ],
            errors: [MESSAGE_ALWAYS]
        },
        {
            code: "var greet = 'hello',\nname = 'world';\n/* block comment\nblock comment */\nconsole.log(greet);",
            output: "var greet = 'hello',\nname = 'world';\n\n/* block comment\nblock comment */\nconsole.log(greet);",
            options: [
                { blankLine: "always", prev: ["const", "let", "var"], next: "*" },
                { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] }
            ],
            errors: [MESSAGE_ALWAYS]
        },
        {
            code: "var greet = 'hello';\n// next-line comment\n// second-line comment\nconsole.log(greet);",
            output: "var greet = 'hello';\n\n// next-line comment\n// second-line comment\nconsole.log(greet);",
            options: [
                { blankLine: "always", prev: ["const", "let", "var"], next: "*" },
                { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] }
            ],
            errors: [MESSAGE_ALWAYS]
        },
        {
            code: "var greet = 'hello';\n// next-line comment\n/* block comment\nblock comment */\nconsole.log(greet);",
            output: "var greet = 'hello';\n\n// next-line comment\n/* block comment\nblock comment */\nconsole.log(greet);",
            options: [
                { blankLine: "always", prev: ["const", "let", "var"], next: "*" },
                { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] }
            ],
            errors: [MESSAGE_ALWAYS]
        },

        // https://github.com/eslint/eslint/issues/6834
        {
            code: `
                var a = 1
                ;(b || c).doSomething()
            `,
            output: `
                var a = 1

                ;(b || c).doSomething()
            `,
            options: [
                { blankLine: "always", prev: ["const", "let", "var"], next: "*" },
                { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] }
            ],
            errors: [MESSAGE_ALWAYS]
        },
        {
            code: `
                var a = 1

                ;(b || c).doSomething()
            `,
            output: `
                var a = 1
                ;(b || c).doSomething()
            `,
            options: [
                { blankLine: "never", prev: ["const", "let", "var"], next: "*" },
                { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] }
            ],
            errors: [MESSAGE_NEVER]
        },

        //----------------------------------------------------------------------
        // Tests from newline-before-return
        //----------------------------------------------------------------------

        {
            code: "function a() {\nvar b; return;\n}",
            output: "function a() {\nvar b;\n\n return;\n}",
            options: [
                { blankLine: "always", prev: "*", next: "return" }
            ],
            errors: [MESSAGE_ALWAYS]
        },
        {
            code: "function a() {\nvar b;\nreturn;\n}",
            output: "function a() {\nvar b;\n\nreturn;\n}",
            options: [
                { blankLine: "always", prev: "*", next: "return" }
            ],
            errors: [MESSAGE_ALWAYS]
        },
        {
            code: "function a() {\nif (b) return b;\nelse if (c) return c;\nelse {\ne();\nreturn d;\n}\n}",
            output: "function a() {\nif (b) return b;\nelse if (c) return c;\nelse {\ne();\n\nreturn d;\n}\n}",
            options: [
                { blankLine: "always", prev: "*", next: "return" }
            ],
            errors: [MESSAGE_ALWAYS]
        },
        {
            code: "function a() {\nif (b) return b;\nelse if (c) return c;\nelse {\ne(); return d;\n}\n}",
            output: "function a() {\nif (b) return b;\nelse if (c) return c;\nelse {\ne();\n\n return d;\n}\n}",
            options: [
                { blankLine: "always", prev: "*", next: "return" }
            ],
            errors: [MESSAGE_ALWAYS]
        },
        {
            code: "function a() {\n while (b) {\nc();\nreturn;\n}\n}",
            output: "function a() {\n while (b) {\nc();\n\nreturn;\n}\n}",
            options: [
                { blankLine: "always", prev: "*", next: "return" }
            ],
            errors: [MESSAGE_ALWAYS]
        },
        {
            code: "function a() {\ndo {\nc();\nreturn;\n} while (b);\n}",
            output: "function a() {\ndo {\nc();\n\nreturn;\n} while (b);\n}",
            options: [
                { blankLine: "always", prev: "*", next: "return" }
            ],
            errors: [MESSAGE_ALWAYS]
        },
        {
            code: "function a() {\nfor (var b; b < c; b++) {\nc();\nreturn;\n}\n}",
            output: "function a() {\nfor (var b; b < c; b++) {\nc();\n\nreturn;\n}\n}",
            options: [
                { blankLine: "always", prev: "*", next: "return" }
            ],
            errors: [MESSAGE_ALWAYS]
        },
        {
            code: "function a() {\nfor (b in c) {\nd();\nreturn;\n}\n}",
            output: "function a() {\nfor (b in c) {\nd();\n\nreturn;\n}\n}",
            options: [
                { blankLine: "always", prev: "*", next: "return" }
            ],
            errors: [MESSAGE_ALWAYS]
        },
        {
            code: "function a() {\nfor (b of c) {\nd();\nreturn;\n}\n}",
            output: "function a() {\nfor (b of c) {\nd();\n\nreturn;\n}\n}",
            options: [
                { blankLine: "always", prev: "*", next: "return" }
            ],
            errors: [MESSAGE_ALWAYS]
        },
        {
            code: "function a() {\nif (b) {\nc();\n}\n//comment\nreturn b;\n}",
            output: "function a() {\nif (b) {\nc();\n}\n\n//comment\nreturn b;\n}",
            options: [
                { blankLine: "always", prev: "*", next: "return" }
            ],
            errors: [MESSAGE_ALWAYS]
        },
        {
            code: "function a() {\n/*comment\ncomment*/\nif (b) {\nc();\nreturn b;\n} else {\n//comment\n\nreturn d;\n}\n/*multi-line\ncomment*/\nreturn e;\n}",
            output: "function a() {\n/*comment\ncomment*/\nif (b) {\nc();\n\nreturn b;\n} else {\n//comment\n\nreturn d;\n}\n\n/*multi-line\ncomment*/\nreturn e;\n}",
            options: [
                { blankLine: "always", prev: "*", next: "return" }
            ],
            errors: [MESSAGE_ALWAYS, MESSAGE_ALWAYS]
        },
        {
            code: "function a() {\nif (b) { return; } //comment\nreturn c;\n}",
            output: "function a() {\nif (b) { return; } //comment\n\nreturn c;\n}",
            options: [
                { blankLine: "always", prev: "*", next: "return" }
            ],
            errors: [MESSAGE_ALWAYS]
        },
        {
            code: "function a() {\nif (b) { return; } /*multi-line\ncomment*/\nreturn c;\n}",
            output: "function a() {\nif (b) { return; } /*multi-line\ncomment*/\n\nreturn c;\n}",
            options: [
                { blankLine: "always", prev: "*", next: "return" }
            ],
            errors: [MESSAGE_ALWAYS]
        },
        {
            code: "function a() {\nif (b) { return; }\n/*multi-line\ncomment*/ return c;\n}",
            output: "function a() {\nif (b) { return; }\n\n/*multi-line\ncomment*/ return c;\n}",
            options: [
                { blankLine: "always", prev: "*", next: "return" }
            ],
            errors: [MESSAGE_ALWAYS]
        },
        {
            code: "function a() {\nif (b) { return; } /*multi-line\ncomment*/ return c;\n}",
            output: "function a() {\nif (b) { return; } /*multi-line\ncomment*/\n\n return c;\n}",
            options: [
                { blankLine: "always", prev: "*", next: "return" }
            ],
            errors: [MESSAGE_ALWAYS]
        },
        {
            code: "var a;\nreturn;",
            output: "var a;\n\nreturn;",
            options: [
                { blankLine: "always", prev: "*", next: "return" }
            ],
            parserOptions: { ecmaFeatures: { globalReturn: true } },
            errors: [MESSAGE_ALWAYS]
        },
        {
            code: "var a; return;",
            output: "var a;\n\n return;",
            options: [
                { blankLine: "always", prev: "*", next: "return" }
            ],
            parserOptions: { ecmaFeatures: { globalReturn: true } },
            errors: [MESSAGE_ALWAYS]
        },
        {
            code: "function a() {\n{\n//comment\n}\nreturn\n}",
            output: "function a() {\n{\n//comment\n}\n\nreturn\n}",
            options: [
                { blankLine: "always", prev: "*", next: "return" }
            ],
            errors: [MESSAGE_ALWAYS]
        },
        {
            code: "function a() {\n{\n//comment\n} return\n}",
            output: "function a() {\n{\n//comment\n}\n\n return\n}",
            options: [
                { blankLine: "always", prev: "*", next: "return" }
            ],
            errors: [MESSAGE_ALWAYS]
        },
        {
            code: "function a() {\nvar c;\nwhile (b) {\n c = d; //comment\n}\nreturn c;\n}",
            output: "function a() {\nvar c;\nwhile (b) {\n c = d; //comment\n}\n\nreturn c;\n}",
            options: [
                { blankLine: "always", prev: "*", next: "return" }
            ],
            errors: [MESSAGE_ALWAYS]
        },
        {
            code: "function a() {\nfor (var b; b < c; b++) {\nif (d) {\nbreak; //comment\n}\nreturn;\n}\n}",
            output: "function a() {\nfor (var b; b < c; b++) {\nif (d) {\nbreak; //comment\n}\n\nreturn;\n}\n}",
            options: [
                { blankLine: "always", prev: "*", next: "return" }
            ],
            errors: [MESSAGE_ALWAYS]
        },
        {
            code: "function a() {\nvar b; /*multi-line\ncomment*/\nreturn c;\n}",
            output: "function a() {\nvar b; /*multi-line\ncomment*/\n\nreturn c;\n}",
            options: [
                { blankLine: "always", prev: "*", next: "return" }
            ],
            errors: [MESSAGE_ALWAYS]
        },
        {
            code: "function a() {\nvar b;\n/*multi-line\ncomment*/ return c;\n}",
            output: "function a() {\nvar b;\n\n/*multi-line\ncomment*/ return c;\n}",
            options: [
                { blankLine: "always", prev: "*", next: "return" }
            ],
            errors: [MESSAGE_ALWAYS]
        },
        {
            code: "function a() {\nvar b; /*multi-line\ncomment*/ return c;\n}",
            output: "function a() {\nvar b; /*multi-line\ncomment*/\n\n return c;\n}",
            options: [
                { blankLine: "always", prev: "*", next: "return" }
            ],
            errors: [MESSAGE_ALWAYS]
        },
        {
            code: "function a() {\nvar b;\n//comment\nreturn;\n}",
            output: "function a() {\nvar b;\n\n//comment\nreturn;\n}",
            options: [
                { blankLine: "always", prev: "*", next: "return" }
            ],
            errors: [MESSAGE_ALWAYS]
        },
        {
            code: "function a() {\nvar b; //comment\nreturn;\n}",
            output: "function a() {\nvar b; //comment\n\nreturn;\n}",
            options: [
                { blankLine: "always", prev: "*", next: "return" }
            ],
            errors: [MESSAGE_ALWAYS]
        },
        {
            code: "function a() {\nvar b;\n/* comment */ return;\n}",
            output: "function a() {\nvar b;\n\n/* comment */ return;\n}",
            options: [
                { blankLine: "always", prev: "*", next: "return" }
            ],
            errors: [MESSAGE_ALWAYS]
        },
        {
            code: "function a() {\nvar b;\n//comment\n/* comment */ return;\n}",
            output: "function a() {\nvar b;\n\n//comment\n/* comment */ return;\n}",
            options: [
                { blankLine: "always", prev: "*", next: "return" }
            ],
            errors: [MESSAGE_ALWAYS]
        },
        {
            code: "function a() {\nvar b; /* comment */ return;\n}",
            output: "function a() {\nvar b; /* comment */\n\n return;\n}",
            options: [
                { blankLine: "always", prev: "*", next: "return" }
            ],
            errors: [MESSAGE_ALWAYS]
        },
        {
            code: "function a() {\nvar b; /* comment */\nreturn;\n}",
            output: "function a() {\nvar b; /* comment */\n\nreturn;\n}",
            options: [
                { blankLine: "always", prev: "*", next: "return" }
            ],
            errors: [MESSAGE_ALWAYS]
        },
        {
            code: "function a() {\nvar b;\nreturn; //comment\n}",
            output: "function a() {\nvar b;\n\nreturn; //comment\n}",
            options: [
                { blankLine: "always", prev: "*", next: "return" }
            ],
            errors: [MESSAGE_ALWAYS]
        },
        {
            code: "function a() {\nvar b; return; //comment\n}",
            output: "function a() {\nvar b;\n\n return; //comment\n}",
            options: [
                { blankLine: "always", prev: "*", next: "return" }
            ],
            errors: [MESSAGE_ALWAYS]
        },

        //----------------------------------------------------------------------
        // From JSCS disallowPaddingNewLinesAfterBlocks
        // https://github.com/jscs-dev/node-jscs/blob/44f9b86eb0757fd4ca05a81a50450c5f1b25c37b/test/specs/rules/disallow-padding-newlines-after-blocks.js
        //----------------------------------------------------------------------

        {
            code: "if(true){}\n\nvar a = 2;",
            output: "if(true){}\nvar a = 2;",
            options: [
                { blankLine: "never", prev: "block-like", next: "*" }
            ],
            errors: [MESSAGE_NEVER]
        },
        {
            code: "if(true){\nif(true) {}\n\nvar a = 2;}",
            output: "if(true){\nif(true) {}\nvar a = 2;}",
            options: [
                { blankLine: "never", prev: "block-like", next: "*" }
            ],
            errors: [MESSAGE_NEVER]
        },
        {
            code: "(function(){\n})()\n\nvar a = 2;",
            output: "(function(){\n})()\nvar a = 2;",
            options: [
                { blankLine: "never", prev: "block-like", next: "*" }
            ],
            errors: [MESSAGE_NEVER]
        },
        {
            code: "+(function(){\n})()\n\nvar a = 2;",
            output: "+(function(){\n})()\nvar a = 2;",
            options: [
                { blankLine: "never", prev: "block-like", next: "*" }
            ],
            errors: [MESSAGE_NEVER]
        },
        {
            code: "var a = function() {};\n\nvar b = 2;",
            output: "var a = function() {};\nvar b = 2;",
            options: [
                { blankLine: "never", prev: "block-like", next: "*" }
            ],
            errors: [MESSAGE_NEVER]
        },

        //----------------------------------------------------------------------
        // From JSCS disallowPaddingNewLinesBeforeExport
        // https://github.com/jscs-dev/node-jscs/blob/44f9b86eb0757fd4ca05a81a50450c5f1b25c37b/test/specs/rules/disallow-padding-newlines-before-export.js
        //----------------------------------------------------------------------

        {
            code: "var a = 2;\n\nmodule.exports = a;",
            output: "var a = 2;\nmodule.exports = a;",
            options: [
                { blankLine: "never", prev: "*", next: "cjs-export" }
            ],
            errors: [MESSAGE_NEVER]
        },

        //----------------------------------------------------------------------
        // From JSCS disallowPaddingNewLinesBeforeExport
        // https://github.com/jscs-dev/node-jscs/blob/44f9b86eb0757fd4ca05a81a50450c5f1b25c37b/test/specs/rules/disallow-padding-newlines-before-keywords.js
        //----------------------------------------------------------------------

        {
            code: "function x() { var a;\n\nreturn; }",
            output: "function x() { var a;\nreturn; }",
            options: [
                { blankLine: "never", prev: "*", next: ["if", "for", "return", "switch", "case", "break", "throw"] }
            ],
            errors: [MESSAGE_NEVER]
        },
        {
            code: "function x() { var a = true;\n\nif (a) { a = !a; }; }",
            output: "function x() { var a = true;\nif (a) { a = !a; }; }",
            options: [
                { blankLine: "never", prev: "*", next: ["if", "for", "return", "switch", "case", "break", "throw"] }
            ],
            errors: [MESSAGE_NEVER]
        },
        {
            code: "function x() { var a = true;\n\nfor (var i = 0; i < 10; i++) { a = !a; }; }",
            output: "function x() { var a = true;\nfor (var i = 0; i < 10; i++) { a = !a; }; }",
            options: [
                { blankLine: "never", prev: "*", next: ["if", "for", "return", "switch", "case", "break", "throw"] }
            ],
            errors: [MESSAGE_NEVER]
        },
        {
            code: "function x() { var y = true;\n\nswitch (\"Oranges\") { case \"Oranges\": y = !y;\n\nbreak;\n\ncase \"Apples\": y = !y;\n\nbreak; default: y = !y; } }",
            output: "function x() { var y = true;\nswitch (\"Oranges\") { case \"Oranges\": y = !y;\nbreak;\ncase \"Apples\": y = !y;\nbreak; default: y = !y; } }",
            options: [
                { blankLine: "never", prev: "*", next: ["if", "for", "return", "switch", "case", "break", "throw"] }
            ],
            errors: [
                MESSAGE_NEVER,
                MESSAGE_NEVER,
                MESSAGE_NEVER,
                MESSAGE_NEVER
            ]
        },
        {
            code: "function x() {try { var a;\n\nthrow 0; } catch (e) { var b = 0;\n\nthrow e; } }",
            output: "function x() {try { var a;\nthrow 0; } catch (e) { var b = 0;\nthrow e; } }",
            options: [
                { blankLine: "never", prev: "*", next: ["if", "for", "return", "switch", "case", "break", "throw"] }
            ],
            errors: [
                MESSAGE_NEVER,
                MESSAGE_NEVER
            ]
        },
        {
            code: "function x(a) { var b = 0;\n\nif (!a) { return false; };\n\nfor (var i = 0; i < b; i++) { if (!a[i]) return false; }\n\nreturn true; }",
            output: "function x(a) { var b = 0;\nif (!a) { return false; };\nfor (var i = 0; i < b; i++) { if (!a[i]) return false; }\nreturn true; }",
            options: [
                { blankLine: "never", prev: "*", next: ["if", "for", "return", "switch", "case", "break", "throw"] }
            ],
            errors: [
                MESSAGE_NEVER,
                MESSAGE_NEVER,
                MESSAGE_NEVER
            ]
        },

        //----------------------------------------------------------------------
        // From JSCS requirePaddingNewLinesAfterBlocks
        // https://github.com/jscs-dev/node-jscs/blob/44f9b86eb0757fd4ca05a81a50450c5f1b25c37b/test/specs/rules/require-padding-newlines-after-blocks.js
        //----------------------------------------------------------------------

        {
            code: "if(true){}\nvar a = 2;",
            output: "if(true){}\n\nvar a = 2;",
            options: [
                { blankLine: "always", prev: "block-like", next: "*" }
            ],
            errors: [MESSAGE_ALWAYS]
        },
        {
            code: "var a = function() {\n};\nvar b = 2;",
            output: "var a = function() {\n};\n\nvar b = 2;",
            options: [
                { blankLine: "always", prev: "block-like", next: "*" }
            ],
            errors: [MESSAGE_ALWAYS]
        },
        {
            code: "if(true){\nif(true) {}\nvar a = 2;}",
            output: "if(true){\nif(true) {}\n\nvar a = 2;}",
            options: [
                { blankLine: "always", prev: "block-like", next: "*" }
            ],
            errors: [MESSAGE_ALWAYS]
        },
        {
            code: "(function(){\n})()\nvar a = 2;",
            output: "(function(){\n})()\n\nvar a = 2;",
            options: [
                { blankLine: "always", prev: "block-like", next: "*" }
            ],
            errors: [MESSAGE_ALWAYS]
        },
        {
            code: "var a = function() {\n};\nvar b = 2;",
            output: "var a = function() {\n};\n\nvar b = 2;",
            options: [
                { blankLine: "always", prev: "multiline-block-like", next: "*" }
            ],
            errors: [MESSAGE_ALWAYS]
        },
        {
            code: "(function(){\n})()\nvar a = 2;",
            output: "(function(){\n})()\n\nvar a = 2;",
            options: [
                { blankLine: "always", prev: "multiline-block-like", next: "*" }
            ],
            errors: [MESSAGE_ALWAYS]
        },

        //----------------------------------------------------------------------
        // From JSCS requirePaddingNewLinesBeforeExport
        // https://github.com/jscs-dev/node-jscs/blob/44f9b86eb0757fd4ca05a81a50450c5f1b25c37b/test/specs/rules/require-padding-newlines-before-export.js
        //----------------------------------------------------------------------

        {
            code: "var a = 2;\nmodule.exports = a;",
            output: "var a = 2;\n\nmodule.exports = a;",
            options: [
                { blankLine: "always", prev: "*", next: "cjs-export" }
            ],
            errors: [MESSAGE_ALWAYS]
        },

        //----------------------------------------------------------------------
        // From JSCS requirePaddingNewlinesBeforeKeywords
        // https://github.com/jscs-dev/node-jscs/blob/44f9b86eb0757fd4ca05a81a50450c5f1b25c37b/test/specs/rules/require-padding-newlines-before-keywords.js
        //----------------------------------------------------------------------

        {
            code: "function x() { var a; return; }",
            output: "function x() { var a;\n\n return; }",
            options: [
                { blankLine: "always", prev: "*", next: ["if", "for", "return", "switch", "case", "break", "throw", "while", "default"] }
            ],
            errors: [MESSAGE_ALWAYS]
        },
        {
            code: "function x() { var a = true; for (var i = 0; i < 10; i++) { a = !a; }; }",
            output: "function x() { var a = true;\n\n for (var i = 0; i < 10; i++) { a = !a; }; }",
            options: [
                { blankLine: "always", prev: "*", next: ["if", "for", "return", "switch", "case", "break", "throw", "while", "default"] }
            ],
            errors: [MESSAGE_ALWAYS]
        },
        {
            code: "function x() { var y = true; switch (\"Oranges\") { case \"Oranges\": y = !y; break; case \"Apples\": y = !y; break; default: y = !y; } }",
            output: "function x() { var y = true;\n\n switch (\"Oranges\") { case \"Oranges\": y = !y;\n\n break;\n\n case \"Apples\": y = !y;\n\n break;\n\n default: y = !y; } }",
            options: [
                { blankLine: "always", prev: "*", next: ["if", "for", "return", "switch", "case", "break", "throw", "while", "default"] }
            ],
            errors: [
                MESSAGE_ALWAYS,
                MESSAGE_ALWAYS,
                MESSAGE_ALWAYS,
                MESSAGE_ALWAYS,
                MESSAGE_ALWAYS
            ]
        },
        {
            code: "function x() { var a = true; while (!a) { a = !a; }; }",
            output: "function x() { var a = true;\n\n while (!a) { a = !a; }; }",
            options: [
                { blankLine: "always", prev: "*", next: ["if", "for", "return", "switch", "case", "break", "throw", "while", "default"] }
            ],
            errors: [MESSAGE_ALWAYS]
        },
        {
            code: "function x() {try { var a; throw 0; } catch (e) { var b = 0; throw e; } }",
            output: "function x() {try { var a;\n\n throw 0; } catch (e) { var b = 0;\n\n throw e; } }",
            options: [
                { blankLine: "always", prev: "*", next: ["if", "for", "return", "switch", "case", "break", "throw", "while", "default"] }
            ],
            errors: [
                MESSAGE_ALWAYS,
                MESSAGE_ALWAYS
            ]
        },
        {
            code: "function x(a) { var b = 0; if (!a) { return false; }; for (var i = 0; i < b; i++) { if (!a[i]) return false; } return true; }",
            output: "function x(a) { var b = 0;\n\n if (!a) { return false; };\n\n for (var i = 0; i < b; i++) { if (!a[i]) return false; }\n\n return true; }",
            options: [
                { blankLine: "always", prev: "*", next: ["if", "for", "return", "switch", "case", "break", "throw", "while", "default"] }
            ],
            errors: [
                MESSAGE_ALWAYS,
                MESSAGE_ALWAYS,
                MESSAGE_ALWAYS
            ]
        }
    ]
});
