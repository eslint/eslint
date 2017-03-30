/**
 * @fileoverview Tests for newline-between-statements rule.
 * @author Toru Nagashima
 */

"use strict";

/* eslint
    object-curly-newline: [error, {minProperties:2}],
    object-property-newline: error
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/newline-between-statements");
const RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 2015 } });

ruleTester.run("newline-between-statements", rule, {
    valid: [

        // do nothing if no options.
        "'use strict'; foo(); if (a) { bar(); }",

        // do nothing for single statement.
        {
            code: "foo()",
            options: [[
                ["never", "*", "*"]
            ]]
        },
        {
            code: "foo()",
            options: [[
                ["always", "*", "*"]
            ]]
        },

        //----------------------------------------------------------------------
        // wildcard
        //----------------------------------------------------------------------

        {
            code: "foo();bar();",
            options: [[
                ["never", "*", "*"]
            ]]
        },
        {
            code: "foo();\nbar();",
            options: [[
                ["never", "*", "*"]
            ]]
        },
        {
            code: "foo();\n//comment\nbar();",
            options: [[
                ["never", "*", "*"]
            ]]
        },
        {
            code: "foo();\n/*comment*/\nbar();",
            options: [[
                ["never", "*", "*"]
            ]]
        },
        {
            code: "foo();\n\nbar();",
            options: [[
                ["always", "*", "*"]
            ]]
        },
        {
            code: "foo();\n\n//comment\nbar();",
            options: [[
                ["always", "*", "*"]
            ]]
        },
        {
            code: "foo();\n//comment\n\nbar();",
            options: [[
                ["always", "*", "*"]
            ]]
        },
        {
            code: "foo();\n//comment\n\n//comment\nbar();",
            options: [[
                ["always", "*", "*"]
            ]]
        },

        //----------------------------------------------------------------------
        // block-like
        //----------------------------------------------------------------------

        {
            code: "foo();\n\n{ foo() }\n\nfoo();",
            options: [[
                ["always", "*", "*"],
                ["never", "block-like", "block-like"]
            ]]
        },
        {
            code: "{ foo() } { foo() }",
            options: [[
                ["always", "*", "*"],
                ["never", "block-like", "block-like"]
            ]]
        },
        {
            code: "{ foo() }\n{ foo() }",
            options: [[
                ["always", "*", "*"],
                ["never", "block-like", "block-like"]
            ]]
        },
        {
            code: "{ foo() }\n\n{ foo() }",
            options: [[
                ["never", "*", "*"],
                ["always", "block-like", "block-like"]
            ]]
        },
        {
            code: "{ foo() }\n\n//comment\n{ foo() }",
            options: [[
                ["never", "*", "*"],
                ["always", "block-like", "block-like"]
            ]]
        },
        {
            code: "if(a);\nfoo()",
            options: [[
                ["never", "*", "*"],
                ["always", "block-like", "*"]
            ]]
        },
        {
            code: "do;while(a);\nfoo()",
            options: [[
                ["never", "*", "*"],
                ["always", "block-like", "*"]
            ]]
        },
        {
            code: "do{}while(a);\n\nfoo()",
            options: [[
                ["never", "*", "*"],
                ["always", "block-like", "*"]
            ]]
        },
        {
            code: "a={}\nfoo()",
            options: [[
                ["never", "*", "*"],
                ["always", "block-like", "*"]
            ]]
        },
        {
            code: "let a={}\nfoo()",
            options: [[
                ["never", "*", "*"],
                ["always", "block-like", "*"]
            ]]
        },
        {
            code: "foo(function(){})\nfoo()",
            options: [[
                ["never", "*", "*"],
                ["always", "block-like", "*"]
            ]]
        },

        //----------------------------------------------------------------------
        // cjs-export
        //----------------------------------------------------------------------

        {
            code: "module.exports=1",
            options: [[
                ["never", "*", "*"],
                ["always", "cjs-export", "*"]
            ]]
        },
        {
            code: "module.exports=1\n\nfoo()",
            options: [[
                ["never", "*", "*"],
                ["always", "cjs-export", "*"]
            ]]
        },
        {
            code: "module.exports.foo=1\n\nfoo()",
            options: [[
                ["never", "*", "*"],
                ["always", "cjs-export", "*"]
            ]]
        },
        {
            code: "exports.foo=1\n\nfoo()",
            options: [[
                ["never", "*", "*"],
                ["always", "cjs-export", "*"]
            ]]
        },
        {
            code: "m.exports=1\nfoo()",
            options: [[
                ["never", "*", "*"],
                ["always", "cjs-export", "*"]
            ]]
        },
        {
            code: "module.foo=1\nfoo()",
            options: [[
                ["never", "*", "*"],
                ["always", "cjs-export", "*"]
            ]]
        },

        //----------------------------------------------------------------------
        // cjs-import
        //----------------------------------------------------------------------

        {
            code: "foo=require(\"foo\")\nfoo()",
            options: [[
                ["never", "*", "*"],
                ["always", "cjs-import", "*"]
            ]]
        },
        {
            code: "const foo=a.require(\"foo\")\nfoo()",
            options: [[
                ["never", "*", "*"],
                ["always", "cjs-import", "*"]
            ]]
        },

        //----------------------------------------------------------------------
        // directive
        //----------------------------------------------------------------------

        {
            code: "\"use strict\"\n\nfoo()",
            options: [[
                ["never", "*", "*"],
                ["always", "directive", "*"]
            ]]
        },
        {
            code: "function foo(){\"use strict\"\n\nfoo()}",
            options: [[
                ["never", "*", "*"],
                ["always", "directive", "*"]
            ]]
        },
        {
            code: "(function foo(){\"use strict\"\n\nfoo()})",
            options: [[
                ["never", "*", "*"],
                ["always", "directive", "*"]
            ]]
        },
        {
            code: "(()=>{\"use strict\"\n\nfoo()})",
            options: [[
                ["never", "*", "*"],
                ["always", "directive", "*"]
            ]]
        },
        {
            code: "'use strict'\n\nfoo()",
            options: [[
                ["never", "*", "*"],
                ["always", "directive", "*"]
            ]]
        },
        {
            code: "foo(\"use strict\")\nfoo()",
            options: [[
                ["never", "*", "*"],
                ["always", "directive", "*"]
            ]]
        },
        {
            code: "`use strict`\nfoo()",
            options: [[
                ["never", "*", "*"],
                ["always", "directive", "*"]
            ]]
        },
        {
            code: "(\"use strict\")\nfoo()",
            options: [[
                ["never", "*", "*"],
                ["always", "directive", "*"]
            ]]
        },
        {
            code: "'use '+'strict'\nfoo()",
            options: [[
                ["never", "*", "*"],
                ["always", "directive", "*"]
            ]]
        },
        {
            code: "foo()\n\"use strict\"\nfoo()",
            options: [[
                ["never", "*", "*"],
                ["always", "directive", "*"]
            ]]
        },
        {
            code: "{\"use strict\"\nfoo()}",
            options: [[
                ["never", "*", "*"],
                ["always", "directive", "*"]
            ]]
        },

        //----------------------------------------------------------------------
        // multiline-block-like
        //----------------------------------------------------------------------

        {
            code: "{}\nfoo()",
            options: [[
                ["never", "*", "*"],
                ["always", "multiline-block-like", "*"]
            ]]
        },
        {
            code: "if(a){}\nfoo()",
            options: [[
                ["never", "*", "*"],
                ["always", "multiline-block-like", "*"]
            ]]
        },
        {
            code: "while(a){}\nfoo()",
            options: [[
                ["never", "*", "*"],
                ["always", "multiline-block-like", "*"]
            ]]
        },
        {
            code: "{\n}\n\nfoo()",
            options: [[
                ["never", "*", "*"],
                ["always", "multiline-block-like", "*"]
            ]]
        },
        {
            code: "if(a){\n}\n\nfoo()",
            options: [[
                ["never", "*", "*"],
                ["always", "multiline-block-like", "*"]
            ]]
        },
        {
            code: "while(a){\n}\n\nfoo()",
            options: [[
                ["never", "*", "*"],
                ["always", "multiline-block-like", "*"]
            ]]
        },
        {
            code: "do{\n}while(a)\n\nfoo()",
            options: [[
                ["never", "*", "*"],
                ["always", "multiline-block-like", "*"]
            ]]
        },
        {
            code: "for(;;){\n}\n\nfoo()",
            options: [[
                ["never", "*", "*"],
                ["always", "multiline-block-like", "*"]
            ]]
        },
        {
            code: "for(a in b){\n}\n\nfoo()",
            options: [[
                ["never", "*", "*"],
                ["always", "multiline-block-like", "*"]
            ]]
        },
        {
            code: "for(a of b){\n}\n\nfoo()",
            options: [[
                ["never", "*", "*"],
                ["always", "multiline-block-like", "*"]
            ]]
        },
        {
            code: "switch(a){\n}\n\nfoo()",
            options: [[
                ["never", "*", "*"],
                ["always", "multiline-block-like", "*"]
            ]]
        },
        {
            code: "function foo(a){\n}\n\nfoo()",
            options: [[
                ["never", "*", "*"],
                ["always", "multiline-block-like", "*"]
            ]]
        },
        {
            code: "var a=function foo(a){\n}\n\nfoo()",
            options: [[
                ["never", "*", "*"],
                ["always", "multiline-block-like", "*"]
            ]]
        },

        //----------------------------------------------------------------------
        // block
        //----------------------------------------------------------------------

        {
            code: "{}\n\nfoo()",
            options: [[
                ["never", "*", "*"],
                ["always", "block", "*"]
            ]]
        },
        {
            code: "{\n}\n\nfoo()",
            options: [[
                ["never", "*", "*"],
                ["always", "block", "*"]
            ]]
        },
        {
            code: "{\nfoo()\n}\n\nfoo()",
            options: [[
                ["never", "*", "*"],
                ["always", "block", "*"]
            ]]
        },
        {
            code: "if(a){}\nfoo()",
            options: [[
                ["never", "*", "*"],
                ["always", "block", "*"]
            ]]
        },
        {
            code: "a={}\nfoo()",
            options: [[
                ["never", "*", "*"],
                ["always", "block", "*"]
            ]]
        },

        //----------------------------------------------------------------------
        // empty
        //----------------------------------------------------------------------

        {
            code: ";\n\nfoo()",
            options: [[
                ["never", "*", "*"],
                ["always", "empty", "*"]
            ]]
        },
        {
            code: "1;\nfoo()",
            options: [[
                ["never", "*", "*"],
                ["always", "empty", "*"]
            ]]
        },

        //----------------------------------------------------------------------
        // expression
        //----------------------------------------------------------------------

        {
            code: "foo()\n\nfoo()",
            options: [[
                ["never", "*", "*"],
                ["always", "expression", "*"]
            ]]
        },
        {
            code: "a=b+c\n\nfoo()",
            options: [[
                ["never", "*", "*"],
                ["always", "expression", "*"]
            ]]
        },
        {
            code: "var a=1\nfoo()",
            options: [[
                ["never", "*", "*"],
                ["always", "expression", "*"]
            ]]
        },
        {
            code: "'use strict'\nfoo()",
            options: [[
                ["never", "*", "*"],
                ["always", "expression", "*"]
            ]]
        },

        //----------------------------------------------------------------------
        // break
        //----------------------------------------------------------------------

        {
            code: "A:{break A\n\nfoo()}",
            options: [[
                ["never", "*", "*"],
                ["always", "break", "*"]
            ]]
        },
        {
            code: "while(a){break\n\nfoo()}",
            options: [[
                ["never", "*", "*"],
                ["always", "break", "*"]
            ]]
        },
        {
            code: "switch(a){case 0:break\n\nfoo()}",
            options: [[
                ["never", "*", "*"],
                ["always", "break", "*"]
            ]]
        },
        {
            code: "switch(a){case 0:break\ncase 1:break}",
            options: [[
                ["never", "*", "*"],
                ["always", "break", "*"]
            ]]
        },

        //----------------------------------------------------------------------
        // case
        //----------------------------------------------------------------------

        {
            code: "switch(a){case 0:\nfoo()\n\ncase 1:\nfoo()}",
            options: [[
                ["never", "*", "*"],
                ["always", "case", "*"]
            ]]
        },
        {
            code: "switch(a){case 0:\nfoo()\n\ndefault:\nfoo()}",
            options: [[
                ["never", "*", "*"],
                ["always", "case", "*"]
            ]]
        },

        //----------------------------------------------------------------------
        // class
        //----------------------------------------------------------------------

        {
            code: "class A{}\n\nfoo()",
            options: [[
                ["never", "*", "*"],
                ["always", "class", "*"]
            ]]
        },
        {
            code: "var A = class{}\nfoo()",
            options: [[
                ["never", "*", "*"],
                ["always", "class", "*"]
            ]]
        },

        //----------------------------------------------------------------------
        // const
        //----------------------------------------------------------------------

        {
            code: "const a=1\n\nfoo()",
            options: [[
                ["never", "*", "*"],
                ["always", "const", "*"]
            ]]
        },
        {
            code: "let a=1\nfoo()",
            options: [[
                ["never", "*", "*"],
                ["always", "const", "*"]
            ]]
        },

        //----------------------------------------------------------------------
        // continue
        //----------------------------------------------------------------------

        {
            code: "while(a){continue\n\nfoo()}",
            options: [[
                ["never", "*", "*"],
                ["always", "continue", "*"]
            ]]
        },
        {
            code: "while(a){break\nfoo()}",
            options: [[
                ["never", "*", "*"],
                ["always", "continue", "*"]
            ]]
        },

        //----------------------------------------------------------------------
        // debugger
        //----------------------------------------------------------------------

        {
            code: "debugger\n\nfoo()",
            options: [[
                ["never", "*", "*"],
                ["always", "debugger", "*"]
            ]]
        },

        //----------------------------------------------------------------------
        // default
        //----------------------------------------------------------------------

        {
            code: "switch(a){default:\nfoo()\n\ncase 0:\nfoo()\ncase 1:}",
            options: [[
                ["never", "*", "*"],
                ["always", "default", "*"]
            ]]
        },

        //----------------------------------------------------------------------
        // do
        //----------------------------------------------------------------------

        {
            code: "do;while(a)\n\nfoo()",
            options: [[
                ["never", "*", "*"],
                ["always", "do", "*"]
            ]]
        },
        {
            code: "while(a);\nfoo()",
            options: [[
                ["never", "*", "*"],
                ["always", "do", "*"]
            ]]
        },

        //----------------------------------------------------------------------
        // export
        //----------------------------------------------------------------------

        {
            code: "export default 1\n\nfoo()",
            parserOptions: { sourceType: "module" },
            options: [[
                ["never", "*", "*"],
                ["always", "export", "*"]
            ]]
        },
        {
            code: "export let a=1\n\nfoo()",
            parserOptions: { sourceType: "module" },
            options: [[
                ["never", "*", "*"],
                ["always", "export", "*"]
            ]]
        },
        {
            code: "export {a}\n\nfoo()",
            parserOptions: { sourceType: "module" },
            options: [[
                ["never", "*", "*"],
                ["always", "export", "*"]
            ]]
        },
        {
            code: "exports.foo=1\nfoo()",
            parserOptions: { sourceType: "module" },
            options: [[
                ["never", "*", "*"],
                ["always", "export", "*"]
            ]]
        },
        {
            code: "module.exports={}\nfoo()",
            parserOptions: { sourceType: "module" },
            options: [[
                ["never", "*", "*"],
                ["always", "export", "*"]
            ]]
        },

        //----------------------------------------------------------------------
        // for
        //----------------------------------------------------------------------

        {
            code: "for(;;);\n\nfoo()",
            options: [[
                ["never", "*", "*"],
                ["always", "for", "*"]
            ]]
        },
        {
            code: "for(a in b);\n\nfoo()",
            options: [[
                ["never", "*", "*"],
                ["always", "for", "*"]
            ]]
        },
        {
            code: "for(a of b);\n\nfoo()",
            options: [[
                ["never", "*", "*"],
                ["always", "for", "*"]
            ]]
        },
        {
            code: "while(a);\nfoo()",
            options: [[
                ["never", "*", "*"],
                ["always", "for", "*"]
            ]]
        },

        //----------------------------------------------------------------------
        // function
        //----------------------------------------------------------------------

        {
            code: "function foo(){}\n\nfoo()",
            options: [[
                ["never", "*", "*"],
                ["always", "function", "*"]
            ]]
        },
        {
            code: "var foo=function(){}\nfoo()",
            options: [[
                ["never", "*", "*"],
                ["always", "function", "*"]
            ]]
        },

        //----------------------------------------------------------------------
        // if
        //----------------------------------------------------------------------

        {
            code: "if(a);\n\nfoo()",
            options: [[
                ["never", "*", "*"],
                ["always", "if", "*"]
            ]]
        },
        {
            code: "if(a);else;\n\nfoo()",
            options: [[
                ["never", "*", "*"],
                ["always", "if", "*"]
            ]]
        },
        {
            code: "if(a);else if(b);else;\n\nfoo()",
            options: [[
                ["never", "*", "*"],
                ["always", "if", "*"]
            ]]
        },
        {
            code: "for(;;);\nfoo()",
            options: [[
                ["never", "*", "*"],
                ["always", "if", "*"]
            ]]
        },

        //----------------------------------------------------------------------
        // import
        //----------------------------------------------------------------------

        {
            code: "import 'a'\n\nfoo()",
            parserOptions: { sourceType: "module" },
            options: [[
                ["never", "*", "*"],
                ["always", "import", "*"]
            ]]
        },
        {
            code: "import a from 'a'\n\nfoo()",
            parserOptions: { sourceType: "module" },
            options: [[
                ["never", "*", "*"],
                ["always", "import", "*"]
            ]]
        },
        {
            code: "import * as a from 'a'\n\nfoo()",
            parserOptions: { sourceType: "module" },
            options: [[
                ["never", "*", "*"],
                ["always", "import", "*"]
            ]]
        },
        {
            code: "import {a} from 'a'\n\nfoo()",
            parserOptions: { sourceType: "module" },
            options: [[
                ["never", "*", "*"],
                ["always", "import", "*"]
            ]]
        },
        {
            code: "const a=require('a')\nfoo()",
            parserOptions: { sourceType: "module" },
            options: [[
                ["never", "*", "*"],
                ["always", "import", "*"]
            ]]
        },

        //----------------------------------------------------------------------
        // let
        //----------------------------------------------------------------------

        {
            code: "let a=1\n\nfoo()",
            options: [[
                ["never", "*", "*"],
                ["always", "let", "*"]
            ]]
        },
        {
            code: "var a=1\nfoo()",
            options: [[
                ["never", "*", "*"],
                ["always", "let", "*"]
            ]]
        },

        //----------------------------------------------------------------------
        // return
        //----------------------------------------------------------------------

        {
            code: "function foo(){return\n\nfoo()}",
            options: [[
                ["never", "*", "*"],
                ["always", "return", "*"]
            ]]
        },
        {
            code: "throw a\nfoo()",
            options: [[
                ["never", "*", "*"],
                ["always", "return", "*"]
            ]]
        },

        //----------------------------------------------------------------------
        // switch
        //----------------------------------------------------------------------

        {
            code: "switch(a){}\n\nfoo()",
            options: [[
                ["never", "*", "*"],
                ["always", "switch", "*"]
            ]]
        },
        {
            code: "if(a){}\nfoo()",
            options: [[
                ["never", "*", "*"],
                ["always", "switch", "*"]
            ]]
        },

        //----------------------------------------------------------------------
        // throw
        //----------------------------------------------------------------------

        {
            code: "throw a\n\nfoo()",
            options: [[
                ["never", "*", "*"],
                ["always", "throw", "*"]
            ]]
        },

        //----------------------------------------------------------------------
        // try
        //----------------------------------------------------------------------

        {
            code: "try{}catch(e){}\n\nfoo()",
            options: [[
                ["never", "*", "*"],
                ["always", "try", "*"]
            ]]
        },
        {
            code: "try{}finally{}\n\nfoo()",
            options: [[
                ["never", "*", "*"],
                ["always", "try", "*"]
            ]]
        },
        {
            code: "try{}catch(e){}finally{}\n\nfoo()",
            options: [[
                ["never", "*", "*"],
                ["always", "try", "*"]
            ]]
        },

        //----------------------------------------------------------------------
        // var
        //----------------------------------------------------------------------

        {
            code: "var a=1\n\nfoo()",
            options: [[
                ["never", "*", "*"],
                ["always", "var", "*"]
            ]]
        },
        {
            code: "const a=1\nfoo()",
            options: [[
                ["never", "*", "*"],
                ["always", "var", "*"]
            ]]
        },

        //----------------------------------------------------------------------
        // while
        //----------------------------------------------------------------------

        {
            code: "while(a);\n\nfoo()",
            options: [[
                ["never", "*", "*"],
                ["always", "while", "*"]
            ]]
        },
        {
            code: "do;while(a)\nfoo()",
            options: [[
                ["never", "*", "*"],
                ["always", "while", "*"]
            ]]
        },

        //----------------------------------------------------------------------
        // with
        //----------------------------------------------------------------------

        {
            code: "with(a);\n\nfoo()",
            options: [[
                ["never", "*", "*"],
                ["always", "with", "*"]
            ]]
        },

        //----------------------------------------------------------------------
        // Tests from newline-after-var
        //----------------------------------------------------------------------

        // should skip rule entirely
        {
            code: "console.log(greet);",
            options: [[
                ["always", ["const", "let", "var"], "*"],
                ["any", ["const", "let", "var"], ["const", "let", "var"]]
            ]]
        },
        {
            code: "console.log(greet);",
            options: [[
                ["never", ["const", "let", "var"], "*"],
                ["any", ["const", "let", "var"], ["const", "let", "var"]]
            ]]
        },

        // should ignore a `var` with no following token
        {
            code: "var greet = 'hello';",
            options: [[
                ["always", ["const", "let", "var"], "*"],
                ["any", ["const", "let", "var"], ["const", "let", "var"]]
            ]]
        },
        {
            code: "var greet = 'hello';",
            options: [[
                ["never", ["const", "let", "var"], "*"],
                ["any", ["const", "let", "var"], ["const", "let", "var"]]
            ]]
        },

        // should allow no line break in "never" mode
        {
            code: "var greet = 'hello';console.log(greet);",
            options: [[
                ["never", ["const", "let", "var"], "*"],
                ["any", ["const", "let", "var"], ["const", "let", "var"]]
            ]]
        },

        // should allow no blank line in "never" mode
        {
            code: "var greet = 'hello';\nconsole.log(greet);",
            options: [[
                ["never", ["const", "let", "var"], "*"],
                ["any", ["const", "let", "var"], ["const", "let", "var"]]
            ]]
        },

        // should allow one blank line in "always" mode
        {
            code: "var greet = 'hello';\n\nconsole.log(greet);",
            options: [[
                ["always", ["const", "let", "var"], "*"],
                ["any", ["const", "let", "var"], ["const", "let", "var"]]
            ]]
        },

        // should allow two or more blank lines in "always" mode
        {
            code: "var greet = 'hello';\n\n\nconsole.log(greet);",
            options: [[
                ["always", ["const", "let", "var"], "*"],
                ["any", ["const", "let", "var"], ["const", "let", "var"]]
            ]]
        },
        {
            code: "var greet = 'hello';\n\n\n\nconsole.log(greet);",
            options: [[
                ["always", ["const", "let", "var"], "*"],
                ["any", ["const", "let", "var"], ["const", "let", "var"]]
            ]]
        },

        // should allow trailing whitespace after the `var`
        {
            code: "var greet = 'hello';    \n\nconsole.log(greet);",
            options: [[
                ["always", ["const", "let", "var"], "*"],
                ["any", ["const", "let", "var"], ["const", "let", "var"]]
            ]]
        },
        {
            code: "var greet = 'hello';    \nconsole.log(greet);",
            options: [[
                ["never", ["const", "let", "var"], "*"],
                ["any", ["const", "let", "var"], ["const", "let", "var"]]
            ]]
        },

        // should allow inline comments after the `var`
        {
            code: "var greet = 'hello'; // inline comment\n\nconsole.log(greet);",
            options: [[
                ["always", ["const", "let", "var"], "*"],
                ["any", ["const", "let", "var"], ["const", "let", "var"]]
            ]]
        },
        {
            code: "var greet = 'hello'; // inline comment\nconsole.log(greet);",
            options: [[
                ["never", ["const", "let", "var"], "*"],
                ["any", ["const", "let", "var"], ["const", "let", "var"]]
            ]]
        },

        // should allow a comment on the next line in "never" mode
        {
            code: "var greet = 'hello';\n// next-line comment\nconsole.log(greet);",
            options: [[
                ["never", ["const", "let", "var"], "*"],
                ["any", ["const", "let", "var"], ["const", "let", "var"]]
            ]]
        },
        {
            code: "var greet = 'hello';\n/* block comment\nblock comment */\nconsole.log(greet);",
            options: [[
                ["never", ["const", "let", "var"], "*"],
                ["any", ["const", "let", "var"], ["const", "let", "var"]]
            ]]
        },

        // should allow comments on the next line followed by a blank in "always" mode
        {
            code: "var greet = 'hello';\n// next-line comment\n\nconsole.log(greet);",
            options: [[
                ["always", ["const", "let", "var"], "*"],
                ["any", ["const", "let", "var"], ["const", "let", "var"]]
            ]]
        },
        {
            code: "var greet = 'hello';\n/* block comment\nblock comment */\n\nconsole.log(greet);",
            options: [[
                ["always", ["const", "let", "var"], "*"],
                ["any", ["const", "let", "var"], ["const", "let", "var"]]
            ]]
        },
        {
            code: "var greet = 'hello';\n// next-line comment\n// second-line comment\n\nconsole.log(greet);",
            options: [[
                ["always", ["const", "let", "var"], "*"],
                ["any", ["const", "let", "var"], ["const", "let", "var"]]
            ]]
        },

        // should allow comments on the next line followed by no blank in "never" mode
        {
            code: "var greet = 'hello';\n// next-line comment\n// second-line comment\nconsole.log(greet);",
            options: [[
                ["never", ["const", "let", "var"], "*"],
                ["any", ["const", "let", "var"], ["const", "let", "var"]]
            ]]
        },
        {
            code: "var greet = 'hello';\n// next-line comment\n/* block comment\nblock comment */\nconsole.log(greet);",
            options: [[
                ["never", ["const", "let", "var"], "*"],
                ["any", ["const", "let", "var"], ["const", "let", "var"]]
            ]]
        },

        // should allow another `var` statement to follow without blank line
        {
            code: "var greet = 'hello';var name = 'world';console.log(greet, name);",
            options: [[
                ["never", ["const", "let", "var"], "*"],
                ["any", ["const", "let", "var"], ["const", "let", "var"]]
            ]]
        },
        {
            code: "var greet = 'hello';\nvar name = 'world';\nconsole.log(greet, name);",
            options: [[
                ["never", ["const", "let", "var"], "*"],
                ["any", ["const", "let", "var"], ["const", "let", "var"]]
            ]]
        },
        {
            code: "var greet = 'hello';\nvar name = 'world';\n\nconsole.log(greet, name);",
            options: [[
                ["always", ["const", "let", "var"], "*"],
                ["any", ["const", "let", "var"], ["const", "let", "var"]]
            ]]
        },

        // should allow a comment directly between `var` statements
        {
            code: "var greet = 'hello';\n// inline comment\nvar name = 'world';\n\nconsole.log(greet, name);",
            options: [[
                ["always", ["const", "let", "var"], "*"],
                ["any", ["const", "let", "var"], ["const", "let", "var"]]
            ]]
        },
        {
            code: "var greet = 'hello';\n/* block comment\nblock comment */\nvar name = 'world';\n\nconsole.log(greet, name);",
            options: [[
                ["always", ["const", "let", "var"], "*"],
                ["any", ["const", "let", "var"], ["const", "let", "var"]]
            ]]
        },
        {
            code: "var greet = 'hello';\n// inline comment\nvar name = 'world';\nconsole.log(greet, name);",
            options: [[
                ["never", ["const", "let", "var"], "*"],
                ["any", ["const", "let", "var"], ["const", "let", "var"]]
            ]]
        },
        {
            code: "var greet = 'hello';\n/* block comment\nblock comment */\nvar name = 'world';\nconsole.log(greet, name);",
            options: [[
                ["never", ["const", "let", "var"], "*"],
                ["any", ["const", "let", "var"], ["const", "let", "var"]]
            ]]
        },

        // should handle single `var` statement with multiple declarations
        {
            code: "var greet = 'hello', name = 'world';console.log(greet, name);",
            options: [[
                ["never", ["const", "let", "var"], "*"],
                ["any", ["const", "let", "var"], ["const", "let", "var"]]
            ]]
        },
        {
            code: "var greet = 'hello', name = 'world';\nconsole.log(greet, name);",
            options: [[
                ["never", ["const", "let", "var"], "*"],
                ["any", ["const", "let", "var"], ["const", "let", "var"]]
            ]]
        },
        {
            code: "var greet = 'hello', name = 'world';\n\nconsole.log(greet, name);",
            options: [[
                ["always", ["const", "let", "var"], "*"],
                ["any", ["const", "let", "var"], ["const", "let", "var"]]
            ]]
        },

        // should handle single `var` statement with multi-line declaration
        {
            code: "var greet = 'hello',\nname = 'world';\n\nconsole.log(greet, name);",
            options: [[
                ["always", ["const", "let", "var"], "*"],
                ["any", ["const", "let", "var"], ["const", "let", "var"]]
            ]]
        },
        {
            code: "var greet = 'hello',\nname = 'world';\nconsole.log(greet, name);",
            options: [[
                ["never", ["const", "let", "var"], "*"],
                ["any", ["const", "let", "var"], ["const", "let", "var"]]
            ]]
        },
        {
            code: "var greet = 'hello', // inline comment\nname = 'world'; // inline comment\n\nconsole.log(greet, name);",
            options: [[
                ["always", ["const", "let", "var"], "*"],
                ["any", ["const", "let", "var"], ["const", "let", "var"]]
            ]]
        },
        {
            code: "var greet = 'hello', // inline comment\nname = 'world'; // inline comment\nconsole.log(greet, name);",
            options: [[
                ["never", ["const", "let", "var"], "*"],
                ["any", ["const", "let", "var"], ["const", "let", "var"]]
            ]]
        },
        {
            code: "var greet = 'hello',\nname = 'world';\n// next-line comment\nconsole.log(greet);",
            options: [[
                ["never", ["const", "let", "var"], "*"],
                ["any", ["const", "let", "var"], ["const", "let", "var"]]
            ]]
        },
        {
            code: "var greet = 'hello',\nname = 'world';\n/* block comment\nblock comment */\nconsole.log(greet);",
            options: [[
                ["never", ["const", "let", "var"], "*"],
                ["any", ["const", "let", "var"], ["const", "let", "var"]]
            ]]
        },

        // should handle ES6 `let` block binding
        {
            code: "let greet = 'hello';\n\nconsole.log(greet);",
            options: [[
                ["always", ["const", "let", "var"], "*"],
                ["any", ["const", "let", "var"], ["const", "let", "var"]]
            ]]
        },
        {
            code: "let greet = 'hello';\nconsole.log(greet);",
            options: [[
                ["never", ["const", "let", "var"], "*"],
                ["any", ["const", "let", "var"], ["const", "let", "var"]]
            ]]
        },

        // should handle ES6 `const` block binding
        {
            code: "const greet = 'hello';\n\nconsole.log(greet);",
            options: [[
                ["always", ["const", "let", "var"], "*"],
                ["any", ["const", "let", "var"], ["const", "let", "var"]]
            ]]
        },
        {
            code: "const greet = 'hello';\nconsole.log(greet);",
            options: [[
                ["never", ["const", "let", "var"], "*"],
                ["any", ["const", "let", "var"], ["const", "let", "var"]]
            ]]
        },

        // should handle a mix of `var`, `let`, or `const`
        {
            code: "let greet = 'hello';\nvar name = 'world';\n\nconsole.log(greet, name);",
            options: [[
                ["always", ["const", "let", "var"], "*"],
                ["any", ["const", "let", "var"], ["const", "let", "var"]]
            ]]
        },
        {
            code: "const greet = 'hello';\nvar name = 'world';\n\nconsole.log(greet, name);",
            options: [[
                ["always", ["const", "let", "var"], "*"],
                ["any", ["const", "let", "var"], ["const", "let", "var"]]
            ]]
        },
        {
            code: "let greet = 'hello';\nconst name = 'world';\n\nconsole.log(greet, name);",
            options: [[
                ["always", ["const", "let", "var"], "*"],
                ["any", ["const", "let", "var"], ["const", "let", "var"]]
            ]]
        },

        // should handle a mix of `var` or `let` inside for variations
        {
            code: "for(let a = 1; a < 1; a++){\n break;\n}",
            options: [[
                ["always", ["const", "let", "var"], "*"],
                ["any", ["const", "let", "var"], ["const", "let", "var"]]
            ]]
        },
        {
            code: "for(var a = 1; a < 1; a++){\n break;\n}",
            options: [[
                ["always", ["const", "let", "var"], "*"],
                ["any", ["const", "let", "var"], ["const", "let", "var"]]
            ]]
        },
        {
            code: "for(let a = 1; a < 1; a++){\n break;\n}",
            options: [[
                ["never", ["const", "let", "var"], "*"],
                ["any", ["const", "let", "var"], ["const", "let", "var"]]
            ]]
        },
        {
            code: "for(var a = 1; a < 1; a++){\n break;\n}",
            options: [[
                ["never", ["const", "let", "var"], "*"],
                ["any", ["const", "let", "var"], ["const", "let", "var"]]
            ]]
        },
        {
            code: "for(let a in obj){\n break;\n}",
            options: [[
                ["always", ["const", "let", "var"], "*"],
                ["any", ["const", "let", "var"], ["const", "let", "var"]]
            ]]
        },
        {
            code: "for(var a in obj){\n break;\n}",
            options: [[
                ["always", ["const", "let", "var"], "*"],
                ["any", ["const", "let", "var"], ["const", "let", "var"]]
            ]]
        },
        {
            code: "for(let a in obj){\n break;\n}",
            options: [[
                ["never", ["const", "let", "var"], "*"],
                ["any", ["const", "let", "var"], ["const", "let", "var"]]
            ]]
        },
        {
            code: "for(var a in obj){\n break;\n}",
            options: [[
                ["never", ["const", "let", "var"], "*"],
                ["any", ["const", "let", "var"], ["const", "let", "var"]]
            ]]
        },
        {
            code: "for(let a in obj){\n break;\n}",
            options: [[
                ["always", ["const", "let", "var"], "*"],
                ["any", ["const", "let", "var"], ["const", "let", "var"]]
            ]]
        },
        {
            code: "for(var a in obj){\n break;\n}",
            options: [[
                ["always", ["const", "let", "var"], "*"],
                ["any", ["const", "let", "var"], ["const", "let", "var"]]
            ]]
        },
        {
            code: "for(let a in obj){\n break;\n}",
            options: [[
                ["never", ["const", "let", "var"], "*"],
                ["any", ["const", "let", "var"], ["const", "let", "var"]]
            ]]
        },
        {
            code: "for(var a in obj){\n break;\n}",
            options: [[
                ["never", ["const", "let", "var"], "*"],
                ["any", ["const", "let", "var"], ["const", "let", "var"]]
            ]]
        },

        // should handle export specifiers
        {
            code: "export let a = 1;\nexport let b = 2;",
            options: [[
                ["never", ["const", "let", "var"], "*"],
                ["any", ["const", "let", "var"], ["const", "let", "var"]]
            ]],
            parserOptions: { sourceType: "module" }
        },
        {
            code: "export let a = 1;\nexport let b = 2;",
            options: [[
                ["always", ["const", "let", "var"], "*"],
                ["any", ["const", "let", "var"], ["const", "let", "var"]]
            ]],
            parserOptions: { sourceType: "module" }
        },
        {
            code: "export var a = 1;\nexport var b = 2;",
            options: [[
                ["never", ["const", "let", "var"], "*"],
                ["any", ["const", "let", "var"], ["const", "let", "var"]]
            ]],
            parserOptions: { sourceType: "module" }
        },
        {
            code: "export var a = 1;\nexport var b = 2;",
            options: [[
                ["always", ["const", "let", "var"], "*"],
                ["any", ["const", "let", "var"], ["const", "let", "var"]]
            ]],
            parserOptions: { sourceType: "module" }
        },
        {
            code: "export const a = 1;\nexport const b = 2;",
            options: [[
                ["never", ["const", "let", "var"], "*"],
                ["any", ["const", "let", "var"], ["const", "let", "var"]]
            ]],
            parserOptions: { sourceType: "module" }
        },
        {
            code: "export const a = 1;\nexport const b = 2;",
            options: [[
                ["always", ["const", "let", "var"], "*"],
                ["any", ["const", "let", "var"], ["const", "let", "var"]]
            ]],
            parserOptions: { sourceType: "module" }
        },

        // should allow no blank line at end of block
        {
            code: "function example() {\nvar greet = 'hello'\n}",
            options: [[
                ["always", ["const", "let", "var"], "*"],
                ["any", ["const", "let", "var"], ["const", "let", "var"]]
            ]]
        },
        {
            code: "function example() {\nvar greet = 'hello'\n}",
            options: [[
                ["never", ["const", "let", "var"], "*"],
                ["any", ["const", "let", "var"], ["const", "let", "var"]]
            ]]
        },
        {
            code: "function example() {\nvar greet = 'hello';\nconsole.log(greet);\n}",
            options: [[
                ["never", ["const", "let", "var"], "*"],
                ["any", ["const", "let", "var"], ["const", "let", "var"]]
            ]]
        },
        {
            code: "var f = function() {\nvar greet = 'hello'\n};",
            options: [[
                ["always", ["const", "let", "var"], "*"],
                ["any", ["const", "let", "var"], ["const", "let", "var"]]
            ]]
        },
        {
            code: "var f = function() {\nvar greet = 'hello'\n};",
            options: [[
                ["never", ["const", "let", "var"], "*"],
                ["any", ["const", "let", "var"], ["const", "let", "var"]]
            ]]
        },
        {
            code: "var f = function() {\nvar greet = 'hello';\nconsole.log(greet);\n};",
            options: [[
                ["never", ["const", "let", "var"], "*"],
                ["any", ["const", "let", "var"], ["const", "let", "var"]]
            ]]
        },
        {
            code: "() => {\nvar greet = 'hello';\n}",
            options: [[
                ["always", ["const", "let", "var"], "*"],
                ["any", ["const", "let", "var"], ["const", "let", "var"]]
            ]]
        },
        {
            code: "() => {\nvar greet = 'hello';\n}",
            options: [[
                ["never", ["const", "let", "var"], "*"],
                ["any", ["const", "let", "var"], ["const", "let", "var"]]
            ]]
        },
        {
            code: "() => {\nvar greet = 'hello';\nconsole.log(greet);\n}",
            options: [[
                ["never", ["const", "let", "var"], "*"],
                ["any", ["const", "let", "var"], ["const", "let", "var"]]
            ]]
        },
        {
            code: "{\nvar foo;\n}",
            options: [[
                ["always", ["const", "let", "var"], "*"],
                ["any", ["const", "let", "var"], ["const", "let", "var"]]
            ]]
        },
        {
            code: "{\nvar foo;\n}",
            options: [[
                ["never", ["const", "let", "var"], "*"],
                ["any", ["const", "let", "var"], ["const", "let", "var"]]
            ]]
        },
        {
            code: "if(true) {\nvar foo;\n}",
            options: [[
                ["always", ["const", "let", "var"], "*"],
                ["any", ["const", "let", "var"], ["const", "let", "var"]]
            ]]
        },
        {
            code: "if(true) {\nvar foo;\n}",
            options: [[
                ["never", ["const", "let", "var"], "*"],
                ["any", ["const", "let", "var"], ["const", "let", "var"]]
            ]]
        },
        {
            code: "switch(a) {\ncase 0:\nvar foo;\n}",
            options: [[
                ["always", ["const", "let", "var"], "*"],
                ["any", ["const", "let", "var"], ["const", "let", "var"]]
            ]]
        },
        {
            code: "switch(a) {\ncase 0:\nvar foo;\n}",
            options: [[
                ["never", ["const", "let", "var"], "*"],
                ["any", ["const", "let", "var"], ["const", "let", "var"]]
            ]]
        },

        // should handle one/no blank before case.
        {
            code: "switch(a) {\ncase 0:\nvar foo;\n\ncase 1:}",
            options: [[
                ["always", ["const", "let", "var"], "*"],
                ["any", ["const", "let", "var"], ["const", "let", "var"]]
            ]]
        },
        {
            code: "switch(a) {\ncase 0:\nvar foo;\ncase 1:}",
            options: [[
                ["never", ["const", "let", "var"], "*"],
                ["any", ["const", "let", "var"], ["const", "let", "var"]]
            ]]
        },

        // https://github.com/eslint/eslint/issues/6834
        {
            code: `
                var a = 1

                ;(b || c).doSomething()
            `,
            options: [[
                ["always", ["const", "let", "var"], "*"],
                ["any", ["const", "let", "var"], ["const", "let", "var"]]
            ]]
        },
        {
            code: `
                var a = 1
                ;(b || c).doSomething()
            `,
            options: [[
                ["never", ["const", "let", "var"], "*"],
                ["any", ["const", "let", "var"], ["const", "let", "var"]]
            ]]
        },
        {
            code: `
                var a = 1
                ;
                (b || c).doSomething();
            `,
            options: [[
                ["never", ["const", "let", "var"], "*"],
                ["any", ["const", "let", "var"], ["const", "let", "var"]]
            ]]
        },

        {
            code: "switch(a) {\ncase 0:\nvar foo;\n\ncase 1:}",
            options: [[
                ["never", ["const", "let", "var"], "*"],
                ["any", ["const", "let", "var"], ["const", "let", "var"]]
            ]]
        },
        {
            code: "switch(a) {\ncase 0:\nvar foo;\ncase 1:}",
            options: [[
                ["always", ["const", "let", "var"], "*"],
                ["any", ["const", "let", "var"], ["const", "let", "var"]]
            ]]
        },
        {
            code: `
                var a = 1

                ;
                (b || c).doSomething();
            `,
            options: [[
                ["never", ["const", "let", "var"], "*"],
                ["any", ["const", "let", "var"], ["const", "let", "var"]]
            ]]
        },

        //----------------------------------------------------------------------
        // Tests from newline-before-return
        //----------------------------------------------------------------------

        {
            code: "function a() {\nreturn;\n}",
            options: [[
                ["always", "*", "return"]
            ]]
        },
        {
            code: "function a() {\n\nreturn;\n}",
            options: [[
                ["always", "*", "return"]
            ]]
        },
        {
            code: "function a() {\nvar b;\n\nreturn;\n}",
            options: [[
                ["always", "*", "return"]
            ]]
        },
        {
            code: "function a() {\nif (b) return;\n}",
            options: [[
                ["always", "*", "return"]
            ]]
        },
        {
            code: "function a() {\nif (b) { return; }\n}",
            options: [[
                ["always", "*", "return"]
            ]]
        },
        {
            code: "function a() {\nif (b) {\nreturn;\n}\n}",
            options: [[
                ["always", "*", "return"]
            ]]
        },
        {
            code: "function a() {\nif (b) {\n\nreturn;\n}\n}",
            options: [[
                ["always", "*", "return"]
            ]]
        },
        {
            code: "function a() {\nif (b) {\nreturn;\n}\n\nreturn c;\n}",
            options: [[
                ["always", "*", "return"]
            ]]
        },
        {
            code: "function a() {\nif (b) {\n\nreturn;\n}\n\nreturn c;\n}",
            options: [[
                ["always", "*", "return"]
            ]]
        },
        {
            code: "function a() {\nif (!b) {\nreturn;\n} else {\nreturn b;\n}\n}",
            options: [[
                ["always", "*", "return"]
            ]]
        },
        {
            code: "function a() {\nif (!b) {\nreturn;\n} else {\n\nreturn b;\n}\n}",
            options: [[
                ["always", "*", "return"]
            ]]
        },
        {
            code: "function a() {\nif (b) {\nreturn b;\n} else if (c) {\nreturn c;\n}\n}",
            options: [[
                ["always", "*", "return"]
            ]]
        },
        {
            code: "function a() {\nif (b) {\nreturn b;\n} else if (c) {\nreturn c;\n} else {\nreturn d;\n}\n}",
            options: [[
                ["always", "*", "return"]
            ]]
        },
        {
            code: "function a() {\nif (b) {\nreturn b;\n} else if (c) {\nreturn c;\n} else {\nreturn d;\n}\n\nreturn a;\n}",
            options: [[
                ["always", "*", "return"]
            ]]
        },
        {
            code: "function a() {\nif (b) return b;\nelse if (c) return c;\nelse return d;\n}",
            options: [[
                ["always", "*", "return"]
            ]]
        },
        {
            code: "function a() {\nif (b) return b;\nelse if (c) return c;\nelse {\nreturn d;\n}\n}",
            options: [[
                ["always", "*", "return"]
            ]]
        },
        {
            code: "function a() {\nif (b) return b;\nelse if (c) return c;\nelse {\ne();\n\nreturn d;\n}\n}",
            options: [[
                ["always", "*", "return"]
            ]]
        },
        {
            code: "function a() {\nwhile (b) return;\n}",
            options: [[
                ["always", "*", "return"]
            ]]
        },
        {
            code: "function a() {\n while (b) \nreturn;\n}",
            options: [[
                ["always", "*", "return"]
            ]]
        },
        {
            code: "function a() {\n while (b) { return; }\n}",
            options: [[
                ["always", "*", "return"]
            ]]
        },
        {
            code: "function a() {\n while (b) {\nreturn;\n}\n}",
            options: [[
                ["always", "*", "return"]
            ]]
        },
        {
            code: "function a() {\n while (b) {\nc();\n\nreturn;\n}\n}",
            options: [[
                ["always", "*", "return"]
            ]]
        },
        {
            code: "function a() {\nvar c;\nwhile (b) {\n c = d; //comment\n}\n\nreturn c;\n}",
            options: [[
                ["always", "*", "return"]
            ]]
        },
        {
            code: "function a() {\ndo return;\nwhile (b);\n}",
            options: [[
                ["always", "*", "return"]
            ]]
        },
        {
            code: "function a() {\ndo \nreturn;\nwhile (b);\n}",
            options: [[
                ["always", "*", "return"]
            ]]
        },
        {
            code: "function a() {\ndo { return; } while (b);\n}",
            options: [[
                ["always", "*", "return"]
            ]]
        },
        {
            code: "function a() {\ndo { return; }\nwhile (b);\n}",
            options: [[
                ["always", "*", "return"]
            ]]
        },
        {
            code: "function a() {\ndo {\nreturn;\n} while (b);\n}",
            options: [[
                ["always", "*", "return"]
            ]]
        },
        {
            code: "function a() {\ndo {\nc();\n\nreturn;\n} while (b);\n}",
            options: [[
                ["always", "*", "return"]
            ]]
        },
        {
            code: "function a() {\nfor (var b; b < c; b++) return;\n}",
            options: [[
                ["always", "*", "return"]
            ]]
        },
        {
            code: "function a() {\nfor (var b; b < c; b++)\nreturn;\n}",
            options: [[
                ["always", "*", "return"]
            ]]
        },
        {
            code: "function a() {\nfor (var b; b < c; b++) {\nreturn;\n}\n}",
            options: [[
                ["always", "*", "return"]
            ]]
        },
        {
            code: "function a() {\nfor (var b; b < c; b++) {\nc();\n\nreturn;\n}\n}",
            options: [[
                ["always", "*", "return"]
            ]]
        },
        {
            code: "function a() {\nfor (var b; b < c; b++) {\nif (d) {\nbreak; //comment\n}\n\nreturn;\n}\n}",
            options: [[
                ["always", "*", "return"]
            ]]
        },
        {
            code: "function a() {\nfor (b in c)\nreturn;\n}",
            options: [[
                ["always", "*", "return"]
            ]]
        },
        {
            code: "function a() {\nfor (b in c) { return; }\n}",
            options: [[
                ["always", "*", "return"]
            ]]
        },
        {
            code: "function a() {\nfor (b in c) {\nreturn;\n}\n}",
            options: [[
                ["always", "*", "return"]
            ]]
        },
        {
            code: "function a() {\nfor (b in c) {\nd();\n\nreturn;\n}\n}",
            options: [[
                ["always", "*", "return"]
            ]]
        },
        {
            code: "function a() {\nfor (b of c) return;\n}",
            options: [[
                ["always", "*", "return"]
            ]]
        },
        {
            code: "function a() {\nfor (b of c)\nreturn;\n}",
            options: [[
                ["always", "*", "return"]
            ]]
        },
        {
            code: "function a() {\nfor (b of c) {\nreturn;\n}\n}",
            options: [[
                ["always", "*", "return"]
            ]]
        },
        {
            code: "function a() {\nfor (b of c) {\nd();\n\nreturn;\n}\n}",
            options: [[
                ["always", "*", "return"]
            ]]
        },
        {
            code: "function a() {\nswitch (b) {\ncase 'b': return;\n}\n}",
            options: [[
                ["always", "*", "return"]
            ]]
        },
        {
            code: "function a() {\nswitch (b) {\ncase 'b':\nreturn;\n}\n}",
            options: [[
                ["always", "*", "return"]
            ]]
        },
        {
            code: "function a() {\nswitch (b) {\ncase 'b': {\nreturn;\n}\n}\n}",
            options: [[
                ["always", "*", "return"]
            ]]
        },
        {
            code: "function a() {\n//comment\nreturn b;\n}",
            options: [[
                ["always", "*", "return"]
            ]]
        },
        {
            code: "function a() {\n{\n//comment\n}\n\nreturn\n}",
            options: [[
                ["always", "*", "return"]
            ]]
        },
        {
            code: "function a() {\nvar b = {\n//comment\n};\n\nreturn;\n}",
            options: [[
                ["always", "*", "return"]
            ]]
        },
        {
            code: "function a() {/*multi-line\ncomment*/return b;\n}",
            options: [[
                ["always", "*", "return"]
            ]]
        },
        {
            code: "function a() {\n/*comment\ncomment*/\n//comment\nreturn b;\n}",
            options: [[
                ["always", "*", "return"]
            ]]
        },
        {
            code: "function a() {\n/*comment\ncomment*/\n//comment\nif (b) return;\n}",
            options: [[
                ["always", "*", "return"]
            ]]
        },
        {
            code: "function a() {\n/*comment\ncomment*/\n//comment\nif (b) {\nc();\n\nreturn b;\n} else {\n//comment\nreturn d;\n}\n\n/*multi-line\ncomment*/\nreturn e;\n}",
            options: [[
                ["always", "*", "return"]
            ]]
        },
        {
            code: "function a() {\nif (b) { //comment\nreturn;\n}\n\nreturn c;\n}",
            options: [[
                ["always", "*", "return"]
            ]]
        },
        {
            code: "function a() {\nif (b) { return; } //comment\n\nreturn c;\n}",
            options: [[
                ["always", "*", "return"]
            ]]
        },
        {
            code: "function a() {\nif (b) { return; } /*multi-line\ncomment*/\n\nreturn c;\n}",
            options: [[
                ["always", "*", "return"]
            ]]
        },
        {
            code: "function a() {\nif (b) { return; }\n\n/*multi-line\ncomment*/ return c;\n}",
            options: [[
                ["always", "*", "return"]
            ]]
        },
        {
            code: "return;",
            parserOptions: { ecmaFeatures: { globalReturn: true } },
            options: [[
                ["always", "*", "return"]
            ]]
        },
        {
            code: "var a;\n\nreturn;",
            parserOptions: { ecmaFeatures: { globalReturn: true } },
            options: [[
                ["always", "*", "return"]
            ]]
        },
        {
            code: "// comment\nreturn;",
            parserOptions: { ecmaFeatures: { globalReturn: true } },
            options: [[
                ["always", "*", "return"]
            ]]
        },
        {
            code: "/* comment */\nreturn;",
            parserOptions: { ecmaFeatures: { globalReturn: true } },
            options: [[
                ["always", "*", "return"]
            ]]
        },
        {
            code: "/* multi-line\ncomment */\nreturn;",
            parserOptions: { ecmaFeatures: { globalReturn: true } },
            options: [[
                ["always", "*", "return"]
            ]]
        },

        //----------------------------------------------------------------------
        // From JSCS disallowPaddingNewLinesAfterBlocks
        // https://github.com/jscs-dev/node-jscs/blob/44f9b86eb0757fd4ca05a81a50450c5f1b25c37b/test/specs/rules/disallow-padding-newlines-after-blocks.js
        //----------------------------------------------------------------------

        {
            code: "if(true){}",
            options: [[
                ["never", "block-like", "*"]
            ]]
        },
        {
            code: "if(true){}\n",
            options: [[
                ["never", "block-like", "*"]
            ]]
        },
        {
            code: "if(true){}\nvar a = 2;",
            options: [[
                ["never", "block-like", "*"]
            ]]
        },
        {
            code: "if(true){\nif(true) {}\n}",
            options: [[
                ["never", "block-like", "*"]
            ]]
        },
        {
            code: "var a = {\nfoo: function() {\n},\nbar: function() {\n}}",
            options: [[
                ["never", "block-like", "*"]
            ]]
        },
        {
            code: "(function(){\n})()\nvar a = 2;",
            options: [[
                ["never", "block-like", "*"]
            ]]
        },
        {
            code: "if(true) {\n}\nelse\n{\n}",
            options: [[
                ["never", "block-like", "*"]
            ]]
        },
        {
            code: "if(true) {\n} else {\n var a = 2; }",
            options: [[
                ["never", "block-like", "*"]
            ]]
        },
        {
            code: "if(true) {\n}\nelse if(true)\n{\n}\nelse {\n}",
            options: [[
                ["never", "block-like", "*"]
            ]]
        },
        {
            code: "do{\n}\nwhile(true)",
            options: [[
                ["never", "block-like", "*"]
            ]]
        },
        {
            code: "try{\n}\ncatch(e) {}",
            options: [[
                ["never", "block-like", "*"]
            ]]
        },
        {
            code: "try{\n}\nfinally {}",
            options: [[
                ["never", "block-like", "*"]
            ]]
        },
        {
            code: "try{\n}\ncatch(e) {\n}\nfinally {\n}",
            options: [[
                ["never", "block-like", "*"]
            ]]
        },
        {
            code: "[].map(function() {})\n.filter(function(){})",
            options: [[
                ["never", "block-like", "*"]
            ]]
        },

        //----------------------------------------------------------------------
        // From JSCS disallowPaddingNewLinesBeforeExport
        // https://github.com/jscs-dev/node-jscs/blob/44f9b86eb0757fd4ca05a81a50450c5f1b25c37b/test/specs/rules/disallow-padding-newlines-before-export.js
        //----------------------------------------------------------------------

        {
            code: "var a = 2;\nmodule.exports = a;",
            options: [[
                ["never", "*", "cjs-export"]
            ]]
        },
        {
            code: "module.exports = 2;",
            options: [[
                ["never", "*", "cjs-export"]
            ]]
        },
        {
            code: "var a = 2;\n// foo\nmodule.exports = a;",
            options: [[
                ["never", "*", "cjs-export"]
            ]]
        },

        /* TODO: May it need an option to ignore blank lines followed by comments?
         * {
         *     code: "var a = 2;\n\n// foo\nmodule.exports = a;",
         *     options: [[
         *         ["never", "*", "cjs-export"]
         *     ]]
         * },
         */
        {
            code: "var a = 2;\n\nfoo.exports = a;",
            options: [[
                ["never", "*", "cjs-export"]
            ]]
        },
        {
            code: "var a = 2;\n\nmodule.foo = a;",
            options: [[
                ["never", "*", "cjs-export"]
            ]]
        },
        {
            code: "var a = 2;\n\nfoo = a;",
            options: [[
                ["never", "*", "cjs-export"]
            ]]
        },

        //----------------------------------------------------------------------
        // From JSCS requirePaddingNewLinesAfterBlocks
        // https://github.com/jscs-dev/node-jscs/blob/44f9b86eb0757fd4ca05a81a50450c5f1b25c37b/test/specs/rules/require-padding-newlines-after-blocks.js
        //----------------------------------------------------------------------

        {
            code: "{}",
            options: [[
                ["always", "block-like", "*"]
            ]]
        },
        {
            code: "if(true){}",
            options: [[
                ["always", "block-like", "*"]
            ]]
        },
        {
            code: "if(true){}\n",
            options: [[
                ["always", "block-like", "*"]
            ]]
        },
        {
            code: "if(true){}\n\nvar a = 2;",
            options: [[
                ["always", "block-like", "*"]
            ]]
        },
        {
            code: "if(true){}\n\n\nvar a = 2;",
            options: [[
                ["always", "block-like", "*"]
            ]]
        },
        {
            code: "if(true){\nif(true) {}\n}",
            options: [[
                ["always", "block-like", "*"]
            ]]
        },
        {
            code: "var a = {\nfoo: function() {\n},\n\nbar: function() {\n}}",
            options: [[
                ["always", "block-like", "*"]
            ]]
        },
        {
            code: "(function(){\n})()\n\nvar a = 2;",
            options: [[
                ["always", "block-like", "*"]
            ]]
        },
        {
            code: "if(true) {\n}\nelse\n{\n}",
            options: [[
                ["always", "block-like", "*"]
            ]]
        },
        {
            code: "if(true) {\n} else {\n var a = 2; }",
            options: [[
                ["always", "block-like", "*"]
            ]]
        },
        {
            code: "if(true) {\n}\nelse if(true)\n{\n}\nelse {\n}",
            options: [[
                ["always", "block-like", "*"]
            ]]
        },
        {
            code: "do{\n}\nwhile(true)",
            options: [[
                ["always", "block-like", "*"]
            ]]
        },
        {
            code: "try{\n}\ncatch(e) {}",
            options: [[
                ["always", "block-like", "*"]
            ]]
        },
        {
            code: "try{\n}\nfinally {}",
            options: [[
                ["always", "block-like", "*"]
            ]]
        },
        {
            code: "try{\n}\ncatch(e) {\n}\nfinally {\n}",
            options: [[
                ["always", "block-like", "*"]
            ]]
        },
        {
            code: "[].map(function() {})\n.filter(function(){})",
            options: [[
                ["always", "block-like", "*"]
            ]]
        },
        {
            code: "func(\n2,\n3,\nfunction() {\n}\n)",
            options: [[
                ["always", "block-like", "*"]
            ]]
        },
        {
            code: "[\n2,\n3,\nfunction() {\n}\n]",
            options: [[
                ["always", "block-like", "*"]
            ]]
        },
        {
            code: "a(res => {\n})\n.b();",
            options: [[
                ["always", "block-like", "*"]
            ]]
        },
        {
            code: "var foo = (\n<div\nref={function() {\n}}\n>\nfoo\n</div>\n);",
            options: [[
                ["always", "block-like", "*"]
            ]],
            parserOptions: { ecmaFeatures: { jsx: true } }
        },
        {
            code: "var i = 0;\nwhile (i < 100) {\nif(i % 2 === 0) {continue;}\n++i;\n}",
            options: [[
                ["always", "multiline-block-like", "*"]
            ]]
        },
        {
            code: "var i = 0;\nwhile (i < 100) {\nif(i % 2 === 0) {if(i === 4) {continue;}}\n++i;\n}",
            options: [[
                ["always", "multiline-block-like", "*"]
            ]]
        },

        //----------------------------------------------------------------------
        // From JSCS requirePaddingNewLinesBeforeExport
        // https://github.com/jscs-dev/node-jscs/blob/44f9b86eb0757fd4ca05a81a50450c5f1b25c37b/test/specs/rules/require-padding-newlines-before-export.js
        //----------------------------------------------------------------------

        {
            code: "module.exports = 2;",
            options: [[
                ["always", "*", "cjs-export"]
            ]]
        },
        {
            code: "var a = 2;\n\nmodule.exports = a;",
            options: [[
                ["always", "*", "cjs-export"]
            ]]
        },
        {
            code: "var a = 2;\nfoo.exports = a;",
            options: [[
                ["always", "*", "cjs-export"]
            ]]
        },
        {
            code: "var a = 2;\nmodule.foo = a;",
            options: [[
                ["always", "*", "cjs-export"]
            ]]
        },
        {
            code: "if (true) {\nmodule.exports = a;\n}",
            options: [[
                ["always", "*", "cjs-export"]
            ]]
        },

        //----------------------------------------------------------------------
        // From JSCS requirePaddingNewlinesBeforeKeywords
        // https://github.com/jscs-dev/node-jscs/blob/44f9b86eb0757fd4ca05a81a50450c5f1b25c37b/test/specs/rules/require-padding-newlines-before-keywords.js
        //----------------------------------------------------------------------

        {
            code: "function x() { return; }",
            options: [[
                ["always", "*", ["if", "for", "return", "switch", "case", "break", "throw", "while", "default"]]
            ]]
        },
        {
            code: "if (true) {} else if (false) {}",
            options: [[
                ["always", "*", ["if", "for", "return", "switch", "case", "break", "throw", "while", "default"]]
            ]]
        },
        {
            code: "function x() { var a = true; do { a = !a; } while (a); }",
            options: [[
                ["always", "*", ["if", "for", "return", "switch", "case", "break", "throw", "while", "default"]]
            ]]
        },
        {
            code: "function x() { if (true) return; }",
            options: [[
                ["always", "*", ["if", "for", "return", "switch", "case", "break", "throw", "while", "default"]]
            ]]
        }
    ],
    invalid: [

        //----------------------------------------------------------------------
        // wildcard
        //----------------------------------------------------------------------

        {
            code: "foo();\n\nfoo();",
            output: "foo();\nfoo();",
            options: [[
                ["never", "*", "*"]
            ]],
            errors: ["Unexpected blank lines before this statement."]
        },
        {
            code: "foo();\n\n//comment\nfoo();",
            output: "foo();\n//comment\nfoo();",
            options: [[
                ["never", "*", "*"]
            ]],
            errors: ["Unexpected blank lines before this statement."]
        },
        {
            code: "    foo();\n    \n    //comment\n    foo();",
            output: "    foo();\n    //comment\n    foo();",
            options: [[
                ["never", "*", "*"]
            ]],
            errors: ["Unexpected blank lines before this statement."]
        },
        {
            code: "if (a) {}\n\nfor (;;) {}",
            output: "if (a) {}\nfor (;;) {}",
            options: [[
                ["never", "*", "*"]
            ]],
            errors: ["Unexpected blank lines before this statement."]
        },
        {
            code: "foo();\nfoo();",
            output: "foo();\n\nfoo();",
            options: [[
                ["always", "*", "*"]
            ]],
            errors: ["Expected one or more blank lines before this statement."]
        },
        {
            code: "    function a() {}\n    do {} while (a)",
            output: "    function a() {}\n\n    do {} while (a)",
            options: [[
                ["always", "*", "*"]
            ]],
            errors: ["Expected one or more blank lines before this statement."]
        },
        {
            code: "foo();//trailing-comment\n//comment\n//comment\nfoo();",
            output: "foo();//trailing-comment\n\n//comment\n//comment\nfoo();",
            options: [[
                ["always", "*", "*"]
            ]],
            errors: ["Expected one or more blank lines before this statement."]
        },

        //----------------------------------------------------------------------
        // block-like
        //----------------------------------------------------------------------

        {
            code: "{}\n\nfoo()",
            output: "{}\nfoo()",
            options: [[
                ["never", "block-like", "*"]
            ]],
            errors: ["Unexpected blank lines before this statement."]
        },
        {
            code: "{}\nfoo()",
            output: "{}\n\nfoo()",
            options: [[
                ["always", "block-like", "*"]
            ]],
            errors: ["Expected one or more blank lines before this statement."]
        },
        {
            code: "{}\nfoo()",
            output: "{}\n\nfoo()",
            options: [[
                ["always", "block-like", "*"]
            ]],
            errors: ["Expected one or more blank lines before this statement."]
        },
        {
            code: "if(a){}\nfoo()",
            output: "if(a){}\n\nfoo()",
            options: [[
                ["always", "block-like", "*"]
            ]],
            errors: ["Expected one or more blank lines before this statement."]
        },
        {
            code: "if(a){}else{}\nfoo()",
            output: "if(a){}else{}\n\nfoo()",
            options: [[
                ["always", "block-like", "*"]
            ]],
            errors: ["Expected one or more blank lines before this statement."]
        },
        {
            code: "if(a){}else if(b){}\nfoo()",
            output: "if(a){}else if(b){}\n\nfoo()",
            options: [[
                ["always", "block-like", "*"]
            ]],
            errors: ["Expected one or more blank lines before this statement."]
        },
        {
            code: "if(a){}else if(b){}else{}\nfoo()",
            output: "if(a){}else if(b){}else{}\n\nfoo()",
            options: [[
                ["always", "block-like", "*"]
            ]],
            errors: ["Expected one or more blank lines before this statement."]
        },
        {
            code: "switch(a){}\nfoo()",
            output: "switch(a){}\n\nfoo()",
            options: [[
                ["always", "block-like", "*"]
            ]],
            errors: ["Expected one or more blank lines before this statement."]
        },
        {
            code: "switch(a){case 0:}\nfoo()",
            output: "switch(a){case 0:}\n\nfoo()",
            options: [[
                ["always", "block-like", "*"]
            ]],
            errors: ["Expected one or more blank lines before this statement."]
        },
        {
            code: "try{}catch(e){}\nfoo()",
            output: "try{}catch(e){}\n\nfoo()",
            options: [[
                ["always", "block-like", "*"]
            ]],
            errors: ["Expected one or more blank lines before this statement."]
        },
        {
            code: "try{}finally{}\nfoo()",
            output: "try{}finally{}\n\nfoo()",
            options: [[
                ["always", "block-like", "*"]
            ]],
            errors: ["Expected one or more blank lines before this statement."]
        },
        {
            code: "try{}catch(e){}finally{}\nfoo()",
            output: "try{}catch(e){}finally{}\n\nfoo()",
            options: [[
                ["always", "block-like", "*"]
            ]],
            errors: ["Expected one or more blank lines before this statement."]
        },
        {
            code: "while(a){}\nfoo()",
            output: "while(a){}\n\nfoo()",
            options: [[
                ["always", "block-like", "*"]
            ]],
            errors: ["Expected one or more blank lines before this statement."]
        },
        {
            code: "do{}while(a)\nfoo()",
            output: "do{}while(a)\n\nfoo()",
            options: [[
                ["always", "block-like", "*"]
            ]],
            errors: ["Expected one or more blank lines before this statement."]
        },
        {
            code: "for(;;){}\nfoo()",
            output: "for(;;){}\n\nfoo()",
            options: [[
                ["always", "block-like", "*"]
            ]],
            errors: ["Expected one or more blank lines before this statement."]
        },
        {
            code: "for(a in b){}\nfoo()",
            output: "for(a in b){}\n\nfoo()",
            options: [[
                ["always", "block-like", "*"]
            ]],
            errors: ["Expected one or more blank lines before this statement."]
        },
        {
            code: "for(a of b){}\nfoo()",
            output: "for(a of b){}\n\nfoo()",
            options: [[
                ["always", "block-like", "*"]
            ]],
            errors: ["Expected one or more blank lines before this statement."]
        },
        {
            code: "a=function(){}\nfoo()",
            output: "a=function(){}\n\nfoo()",
            options: [[
                ["always", "block-like", "*"]
            ]],
            errors: ["Expected one or more blank lines before this statement."]
        },
        {
            code: "a=()=>{}\nfoo()",
            output: "a=()=>{}\n\nfoo()",
            options: [[
                ["always", "block-like", "*"]
            ]],
            errors: ["Expected one or more blank lines before this statement."]
        },
        {
            code: "function a(){}\nfoo()",
            output: "function a(){}\n\nfoo()",
            options: [[
                ["always", "block-like", "*"]
            ]],
            errors: ["Expected one or more blank lines before this statement."]
        },
        {
            code: "let a=function(){}\nfoo()",
            output: "let a=function(){}\n\nfoo()",
            options: [[
                ["always", "block-like", "*"]
            ]],
            errors: ["Expected one or more blank lines before this statement."]
        },

        //----------------------------------------------------------------------
        // cjs-export
        //----------------------------------------------------------------------

        {
            code: "module.exports=1\n\nfoo()",
            output: "module.exports=1\nfoo()",
            options: [[
                ["never", "cjs-export", "*"]
            ]],
            errors: ["Unexpected blank lines before this statement."]
        },
        {
            code: "module.exports=1\nfoo()",
            output: "module.exports=1\n\nfoo()",
            options: [[
                ["always", "cjs-export", "*"]
            ]],
            errors: ["Expected one or more blank lines before this statement."]
        },
        {
            code: "module.exports.foo=1\nfoo()",
            output: "module.exports.foo=1\n\nfoo()",
            options: [[
                ["always", "cjs-export", "*"]
            ]],
            errors: ["Expected one or more blank lines before this statement."]
        },
        {
            code: "module.exports[foo]=1\nfoo()",
            output: "module.exports[foo]=1\n\nfoo()",
            options: [[
                ["always", "cjs-export", "*"]
            ]],
            errors: ["Expected one or more blank lines before this statement."]
        },
        {
            code: "exports.foo=1\nfoo()",
            output: "exports.foo=1\n\nfoo()",
            options: [[
                ["always", "cjs-export", "*"]
            ]],
            errors: ["Expected one or more blank lines before this statement."]
        },
        {
            code: "exports[foo]=1\nfoo()",
            output: "exports[foo]=1\n\nfoo()",
            options: [[
                ["always", "cjs-export", "*"]
            ]],
            errors: ["Expected one or more blank lines before this statement."]
        },

        //----------------------------------------------------------------------
        // cjs-import
        //----------------------------------------------------------------------

        {
            code: "const foo=require(\"foo\")\n\nfoo()",
            output: "const foo=require(\"foo\")\nfoo()",
            options: [[
                ["never", "cjs-import", "*"]
            ]],
            errors: ["Unexpected blank lines before this statement."]
        },
        {
            code: "const foo=require(\"foo\")\nfoo()",
            output: "const foo=require(\"foo\")\n\nfoo()",
            options: [[
                ["always", "cjs-import", "*"]
            ]],
            errors: ["Expected one or more blank lines before this statement."]
        },
        {
            code: "const foo=require(\"foo\").Foo\nfoo()",
            output: "const foo=require(\"foo\").Foo\n\nfoo()",
            options: [[
                ["always", "cjs-import", "*"]
            ]],
            errors: ["Expected one or more blank lines before this statement."]
        },
        {
            code: "const foo=require(\"foo\")[a]\nfoo()",
            output: "const foo=require(\"foo\")[a]\n\nfoo()",
            options: [[
                ["always", "cjs-import", "*"]
            ]],
            errors: ["Expected one or more blank lines before this statement."]
        },

        //----------------------------------------------------------------------
        // directive
        //----------------------------------------------------------------------

        {
            code: "\"use strict\"\n\nfoo()",
            output: "\"use strict\"\nfoo()",
            options: [[
                ["never", "directive", "*"]
            ]],
            errors: ["Unexpected blank lines before this statement."]
        },
        {
            code: "\"use strict\"\nfoo()",
            output: "\"use strict\"\n\nfoo()",
            options: [[
                ["always", "directive", "*"]
            ]],
            errors: ["Expected one or more blank lines before this statement."]
        },
        {
            code: "'use strict'\nfoo()",
            output: "'use strict'\n\nfoo()",
            options: [[
                ["always", "directive", "*"]
            ]],
            errors: ["Expected one or more blank lines before this statement."]
        },
        {
            code: "'use asm'\nfoo()",
            output: "'use asm'\n\nfoo()",
            options: [[
                ["always", "directive", "*"]
            ]],
            errors: ["Expected one or more blank lines before this statement."]
        },

        //----------------------------------------------------------------------
        // multiline-block-like
        //----------------------------------------------------------------------

        {
            code: "{\n}\n\nfoo()",
            output: "{\n}\nfoo()",
            options: [[
                ["never", "block-like", "*"]
            ]],
            errors: ["Unexpected blank lines before this statement."]
        },
        {
            code: "{\n}\nfoo()",
            output: "{\n}\n\nfoo()",
            options: [[
                ["always", "block-like", "*"]
            ]],
            errors: ["Expected one or more blank lines before this statement."]
        },
        {
            code: "{\n}\nfoo()",
            output: "{\n}\n\nfoo()",
            options: [[
                ["always", "block-like", "*"]
            ]],
            errors: ["Expected one or more blank lines before this statement."]
        },
        {
            code: "if(a){\n}\nfoo()",
            output: "if(a){\n}\n\nfoo()",
            options: [[
                ["always", "block-like", "*"]
            ]],
            errors: ["Expected one or more blank lines before this statement."]
        },
        {
            code: "if(a){\n}else{\n}\nfoo()",
            output: "if(a){\n}else{\n}\n\nfoo()",
            options: [[
                ["always", "block-like", "*"]
            ]],
            errors: ["Expected one or more blank lines before this statement."]
        },
        {
            code: "if(a){\n}else if(b){\n}\nfoo()",
            output: "if(a){\n}else if(b){\n}\n\nfoo()",
            options: [[
                ["always", "block-like", "*"]
            ]],
            errors: ["Expected one or more blank lines before this statement."]
        },
        {
            code: "if(a){\n}else if(b){\n}else{\n}\nfoo()",
            output: "if(a){\n}else if(b){\n}else{\n}\n\nfoo()",
            options: [[
                ["always", "block-like", "*"]
            ]],
            errors: ["Expected one or more blank lines before this statement."]
        },
        {
            code: "switch(a){\n}\nfoo()",
            output: "switch(a){\n}\n\nfoo()",
            options: [[
                ["always", "block-like", "*"]
            ]],
            errors: ["Expected one or more blank lines before this statement."]
        },
        {
            code: "switch(a){case 0:}\nfoo()",
            output: "switch(a){case 0:}\n\nfoo()",
            options: [[
                ["always", "block-like", "*"]
            ]],
            errors: ["Expected one or more blank lines before this statement."]
        },
        {
            code: "try{\n}catch(e){\n}\nfoo()",
            output: "try{\n}catch(e){\n}\n\nfoo()",
            options: [[
                ["always", "block-like", "*"]
            ]],
            errors: ["Expected one or more blank lines before this statement."]
        },
        {
            code: "try{\n}finally{\n}\nfoo()",
            output: "try{\n}finally{\n}\n\nfoo()",
            options: [[
                ["always", "block-like", "*"]
            ]],
            errors: ["Expected one or more blank lines before this statement."]
        },
        {
            code: "try{\n}catch(e){\n}finally{\n}\nfoo()",
            output: "try{\n}catch(e){\n}finally{\n}\n\nfoo()",
            options: [[
                ["always", "block-like", "*"]
            ]],
            errors: ["Expected one or more blank lines before this statement."]
        },
        {
            code: "while(a){\n}\nfoo()",
            output: "while(a){\n}\n\nfoo()",
            options: [[
                ["always", "block-like", "*"]
            ]],
            errors: ["Expected one or more blank lines before this statement."]
        },
        {
            code: "do{\n}while(a)\nfoo()",
            output: "do{\n}while(a)\n\nfoo()",
            options: [[
                ["always", "block-like", "*"]
            ]],
            errors: ["Expected one or more blank lines before this statement."]
        },
        {
            code: "for(;;){\n}\nfoo()",
            output: "for(;;){\n}\n\nfoo()",
            options: [[
                ["always", "block-like", "*"]
            ]],
            errors: ["Expected one or more blank lines before this statement."]
        },
        {
            code: "for(a in b){\n}\nfoo()",
            output: "for(a in b){\n}\n\nfoo()",
            options: [[
                ["always", "block-like", "*"]
            ]],
            errors: ["Expected one or more blank lines before this statement."]
        },
        {
            code: "for(a of b){\n}\nfoo()",
            output: "for(a of b){\n}\n\nfoo()",
            options: [[
                ["always", "block-like", "*"]
            ]],
            errors: ["Expected one or more blank lines before this statement."]
        },
        {
            code: "a=function(){\n}\nfoo()",
            output: "a=function(){\n}\n\nfoo()",
            options: [[
                ["always", "block-like", "*"]
            ]],
            errors: ["Expected one or more blank lines before this statement."]
        },
        {
            code: "a=()=>{\n}\nfoo()",
            output: "a=()=>{\n}\n\nfoo()",
            options: [[
                ["always", "block-like", "*"]
            ]],
            errors: ["Expected one or more blank lines before this statement."]
        },
        {
            code: "function a(){\n}\nfoo()",
            output: "function a(){\n}\n\nfoo()",
            options: [[
                ["always", "block-like", "*"]
            ]],
            errors: ["Expected one or more blank lines before this statement."]
        },
        {
            code: "let a=function(){\n}\nfoo()",
            output: "let a=function(){\n}\n\nfoo()",
            options: [[
                ["always", "block-like", "*"]
            ]],
            errors: ["Expected one or more blank lines before this statement."]
        },

        //----------------------------------------------------------------------
        // block
        //----------------------------------------------------------------------

        {
            code: "{}\n\nfoo()",
            output: "{}\nfoo()",
            options: [[
                ["never", "block", "*"]
            ]],
            errors: ["Unexpected blank lines before this statement."]
        },
        {
            code: "{}\nfoo()",
            output: "{}\n\nfoo()",
            options: [[
                ["always", "block", "*"]
            ]],
            errors: ["Expected one or more blank lines before this statement."]
        },

        //----------------------------------------------------------------------
        // empty
        //----------------------------------------------------------------------

        {
            code: ";\n\nfoo()",
            output: ";\nfoo()",
            options: [[
                ["never", "empty", "*"]
            ]],
            errors: ["Unexpected blank lines before this statement."]
        },
        {
            code: ";\nfoo()",
            output: ";\n\nfoo()",
            options: [[
                ["always", "empty", "*"]
            ]],
            errors: ["Expected one or more blank lines before this statement."]
        },

        //----------------------------------------------------------------------
        // expression
        //----------------------------------------------------------------------

        {
            code: "foo()\n\nfoo()",
            output: "foo()\nfoo()",
            options: [[
                ["never", "expression", "*"]
            ]],
            errors: ["Unexpected blank lines before this statement."]
        },
        {
            code: "foo()\nfoo()",
            output: "foo()\n\nfoo()",
            options: [[
                ["always", "expression", "*"]
            ]],
            errors: ["Expected one or more blank lines before this statement."]
        },

        //----------------------------------------------------------------------
        // break
        //----------------------------------------------------------------------

        {
            code: "while(a){break\n\nfoo()}",
            output: "while(a){break\nfoo()}",
            options: [[
                ["never", "break", "*"]
            ]],
            errors: ["Unexpected blank lines before this statement."]
        },
        {
            code: "switch(a){case 0:break\n\nfoo()}",
            output: "switch(a){case 0:break\nfoo()}",
            options: [[
                ["never", "break", "*"]
            ]],
            errors: ["Unexpected blank lines before this statement."]
        },
        {
            code: "while(a){break\nfoo()}",
            output: "while(a){break\n\nfoo()}",
            options: [[
                ["always", "break", "*"]
            ]],
            errors: ["Expected one or more blank lines before this statement."]
        },
        {
            code: "switch(a){case 0:break\nfoo()}",
            output: "switch(a){case 0:break\n\nfoo()}",
            options: [[
                ["always", "break", "*"]
            ]],
            errors: ["Expected one or more blank lines before this statement."]
        },

        //----------------------------------------------------------------------
        // case
        //----------------------------------------------------------------------

        {
            code: "switch(a){case 0:\nfoo()\n\ndefault:}",
            output: "switch(a){case 0:\nfoo()\ndefault:}",
            options: [[
                ["never", "case", "*"]
            ]],
            errors: ["Unexpected blank lines before this statement."]
        },
        {
            code: "switch(a){case 0:\nfoo()\ndefault:}",
            output: "switch(a){case 0:\nfoo()\n\ndefault:}",
            options: [[
                ["always", "case", "*"]
            ]],
            errors: ["Expected one or more blank lines before this statement."]
        },

        //----------------------------------------------------------------------
        // class
        //----------------------------------------------------------------------

        {
            code: "class A{}\n\nfoo()",
            output: "class A{}\nfoo()",
            options: [[
                ["never", "class", "*"]
            ]],
            errors: ["Unexpected blank lines before this statement."]
        },
        {
            code: "class A{}\nfoo()",
            output: "class A{}\n\nfoo()",
            options: [[
                ["always", "class", "*"]
            ]],
            errors: ["Expected one or more blank lines before this statement."]
        },

        //----------------------------------------------------------------------
        // const
        //----------------------------------------------------------------------

        {
            code: "const a=1\n\nfoo()",
            output: "const a=1\nfoo()",
            options: [[
                ["never", "const", "*"]
            ]],
            errors: ["Unexpected blank lines before this statement."]
        },
        {
            code: "const a=1\nfoo()",
            output: "const a=1\n\nfoo()",
            options: [[
                ["always", "const", "*"]
            ]],
            errors: ["Expected one or more blank lines before this statement."]
        },

        //----------------------------------------------------------------------
        // continue
        //----------------------------------------------------------------------

        {
            code: "while(a){continue\n\nfoo()}",
            output: "while(a){continue\nfoo()}",
            options: [[
                ["never", "continue", "*"]
            ]],
            errors: ["Unexpected blank lines before this statement."]
        },
        {
            code: "while(a){continue\nfoo()}",
            output: "while(a){continue\n\nfoo()}",
            options: [[
                ["always", "continue", "*"]
            ]],
            errors: ["Expected one or more blank lines before this statement."]
        },

        //----------------------------------------------------------------------
        // debugger
        //----------------------------------------------------------------------

        {
            code: "debugger\n\nfoo()",
            output: "debugger\nfoo()",
            options: [[
                ["never", "debugger", "*"]
            ]],
            errors: ["Unexpected blank lines before this statement."]
        },
        {
            code: "debugger\nfoo()",
            output: "debugger\n\nfoo()",
            options: [[
                ["always", "debugger", "*"]
            ]],
            errors: ["Expected one or more blank lines before this statement."]
        },

        //----------------------------------------------------------------------
        // default
        //----------------------------------------------------------------------

        {
            code: "switch(a){default:\nfoo()\n\ncase 0:}",
            output: "switch(a){default:\nfoo()\ncase 0:}",
            options: [[
                ["never", "default", "*"]
            ]],
            errors: ["Unexpected blank lines before this statement."]
        },
        {
            code: "switch(a){default:\nfoo()\ncase 0:}",
            output: "switch(a){default:\nfoo()\n\ncase 0:}",
            options: [[
                ["always", "default", "*"]
            ]],
            errors: ["Expected one or more blank lines before this statement."]
        },

        //----------------------------------------------------------------------
        // do
        //----------------------------------------------------------------------

        {
            code: "do;while(a)\n\nfoo()",
            output: "do;while(a)\nfoo()",
            options: [[
                ["never", "do", "*"]
            ]],
            errors: ["Unexpected blank lines before this statement."]
        },
        {
            code: "do;while(a)\nfoo()",
            output: "do;while(a)\n\nfoo()",
            options: [[
                ["always", "do", "*"]
            ]],
            errors: ["Expected one or more blank lines before this statement."]
        },

        //----------------------------------------------------------------------
        // export
        //----------------------------------------------------------------------

        {
            code: "export default 1\n\nfoo()",
            output: "export default 1\nfoo()",
            parserOptions: { sourceType: "module" },
            options: [[
                ["never", "export", "*"]
            ]],
            errors: ["Unexpected blank lines before this statement."]
        },
        {
            code: "export let a=1\n\nfoo()",
            output: "export let a=1\nfoo()",
            parserOptions: { sourceType: "module" },
            options: [[
                ["never", "export", "*"]
            ]],
            errors: ["Unexpected blank lines before this statement."]
        },
        {
            code: "export {a}\n\nfoo()",
            output: "export {a}\nfoo()",
            parserOptions: { sourceType: "module" },
            options: [[
                ["never", "export", "*"]
            ]],
            errors: ["Unexpected blank lines before this statement."]
        },
        {
            code: "export default 1\nfoo()",
            output: "export default 1\n\nfoo()",
            parserOptions: { sourceType: "module" },
            options: [[
                ["always", "export", "*"]
            ]],
            errors: ["Expected one or more blank lines before this statement."]
        },
        {
            code: "export let a=1\nfoo()",
            output: "export let a=1\n\nfoo()",
            parserOptions: { sourceType: "module" },
            options: [[
                ["always", "export", "*"]
            ]],
            errors: ["Expected one or more blank lines before this statement."]
        },
        {
            code: "export {a}\nfoo()",
            output: "export {a}\n\nfoo()",
            parserOptions: { sourceType: "module" },
            options: [[
                ["always", "export", "*"]
            ]],
            errors: ["Expected one or more blank lines before this statement."]
        },

        //----------------------------------------------------------------------
        // for
        //----------------------------------------------------------------------

        {
            code: "for(;;);\n\nfoo()",
            output: "for(;;);\nfoo()",
            options: [[
                ["never", "for", "*"]
            ]],
            errors: ["Unexpected blank lines before this statement."]
        },
        {
            code: "for(a in b);\n\nfoo()",
            output: "for(a in b);\nfoo()",
            options: [[
                ["never", "for", "*"]
            ]],
            errors: ["Unexpected blank lines before this statement."]
        },
        {
            code: "for(a of b);\n\nfoo()",
            output: "for(a of b);\nfoo()",
            options: [[
                ["never", "for", "*"]
            ]],
            errors: ["Unexpected blank lines before this statement."]
        },
        {
            code: "for(;;);\nfoo()",
            output: "for(;;);\n\nfoo()",
            options: [[
                ["always", "for", "*"]
            ]],
            errors: ["Expected one or more blank lines before this statement."]
        },
        {
            code: "for(a in b);\nfoo()",
            output: "for(a in b);\n\nfoo()",
            options: [[
                ["always", "for", "*"]
            ]],
            errors: ["Expected one or more blank lines before this statement."]
        },
        {
            code: "for(a of b);\nfoo()",
            output: "for(a of b);\n\nfoo()",
            options: [[
                ["always", "for", "*"]
            ]],
            errors: ["Expected one or more blank lines before this statement."]
        },

        //----------------------------------------------------------------------
        // function
        //----------------------------------------------------------------------

        {
            code: "function foo(){}\n\nfoo()",
            output: "function foo(){}\nfoo()",
            options: [[
                ["never", "function", "*"]
            ]],
            errors: ["Unexpected blank lines before this statement."]
        },
        {
            code: "function foo(){}\nfoo()",
            output: "function foo(){}\n\nfoo()",
            options: [[
                ["always", "function", "*"]
            ]],
            errors: ["Expected one or more blank lines before this statement."]
        },

        //----------------------------------------------------------------------
        // if
        //----------------------------------------------------------------------

        {
            code: "if(a);\n\nfoo()",
            output: "if(a);\nfoo()",
            options: [[
                ["never", "if", "*"]
            ]],
            errors: ["Unexpected blank lines before this statement."]
        },
        {
            code: "if(a);else;\n\nfoo()",
            output: "if(a);else;\nfoo()",
            options: [[
                ["never", "if", "*"]
            ]],
            errors: ["Unexpected blank lines before this statement."]
        },
        {
            code: "if(a);\nfoo()",
            output: "if(a);\n\nfoo()",
            options: [[
                ["always", "if", "*"]
            ]],
            errors: ["Expected one or more blank lines before this statement."]
        },
        {
            code: "if(a);else;\nfoo()",
            output: "if(a);else;\n\nfoo()",
            options: [[
                ["always", "if", "*"]
            ]],
            errors: ["Expected one or more blank lines before this statement."]
        },

        //----------------------------------------------------------------------
        // import
        //----------------------------------------------------------------------

        {
            code: "import a from 'a'\n\nfoo()",
            output: "import a from 'a'\nfoo()",
            parserOptions: { sourceType: "module" },
            options: [[
                ["never", "import", "*"]
            ]],
            errors: ["Unexpected blank lines before this statement."]
        },
        {
            code: "import * as a from 'a'\n\nfoo()",
            output: "import * as a from 'a'\nfoo()",
            parserOptions: { sourceType: "module" },
            options: [[
                ["never", "import", "*"]
            ]],
            errors: ["Unexpected blank lines before this statement."]
        },
        {
            code: "import {a} from 'a'\n\nfoo()",
            output: "import {a} from 'a'\nfoo()",
            parserOptions: { sourceType: "module" },
            options: [[
                ["never", "import", "*"]
            ]],
            errors: ["Unexpected blank lines before this statement."]
        },
        {
            code: "import a from 'a'\nfoo()",
            output: "import a from 'a'\n\nfoo()",
            parserOptions: { sourceType: "module" },
            options: [[
                ["always", "import", "*"]
            ]],
            errors: ["Expected one or more blank lines before this statement."]
        },
        {
            code: "import * as a from 'a'\nfoo()",
            output: "import * as a from 'a'\n\nfoo()",
            parserOptions: { sourceType: "module" },
            options: [[
                ["always", "import", "*"]
            ]],
            errors: ["Expected one or more blank lines before this statement."]
        },
        {
            code: "import {a} from 'a'\nfoo()",
            output: "import {a} from 'a'\n\nfoo()",
            parserOptions: { sourceType: "module" },
            options: [[
                ["always", "import", "*"]
            ]],
            errors: ["Expected one or more blank lines before this statement."]
        },

        //----------------------------------------------------------------------
        // let
        //----------------------------------------------------------------------

        {
            code: "let a\n\nfoo()",
            output: "let a\nfoo()",
            options: [[
                ["never", "let", "*"]
            ]],
            errors: ["Unexpected blank lines before this statement."]
        },
        {
            code: "let a\nfoo()",
            output: "let a\n\nfoo()",
            options: [[
                ["always", "let", "*"]
            ]],
            errors: ["Expected one or more blank lines before this statement."]
        },

        //----------------------------------------------------------------------
        // return
        //----------------------------------------------------------------------

        {
            code: "function foo(){return\n\nfoo()}",
            output: "function foo(){return\nfoo()}",
            options: [[
                ["never", "return", "*"]
            ]],
            errors: ["Unexpected blank lines before this statement."]
        },
        {
            code: "function foo(){return\nfoo()}",
            output: "function foo(){return\n\nfoo()}",
            options: [[
                ["always", "return", "*"]
            ]],
            errors: ["Expected one or more blank lines before this statement."]
        },

        //----------------------------------------------------------------------
        // switch
        //----------------------------------------------------------------------

        {
            code: "switch(a){}\n\nfoo()",
            output: "switch(a){}\nfoo()",
            options: [[
                ["never", "switch", "*"]
            ]],
            errors: ["Unexpected blank lines before this statement."]
        },
        {
            code: "switch(a){}\nfoo()",
            output: "switch(a){}\n\nfoo()",
            options: [[
                ["always", "switch", "*"]
            ]],
            errors: ["Expected one or more blank lines before this statement."]
        },

        //----------------------------------------------------------------------
        // throw
        //----------------------------------------------------------------------

        {
            code: "throw a\n\nfoo()",
            output: "throw a\nfoo()",
            options: [[
                ["never", "throw", "*"]
            ]],
            errors: ["Unexpected blank lines before this statement."]
        },
        {
            code: "throw a\nfoo()",
            output: "throw a\n\nfoo()",
            options: [[
                ["always", "throw", "*"]
            ]],
            errors: ["Expected one or more blank lines before this statement."]
        },

        //----------------------------------------------------------------------
        // try
        //----------------------------------------------------------------------

        {
            code: "try{}catch(e){}\n\nfoo()",
            output: "try{}catch(e){}\nfoo()",
            options: [[
                ["never", "try", "*"]
            ]],
            errors: ["Unexpected blank lines before this statement."]
        },
        {
            code: "try{}finally{}\n\nfoo()",
            output: "try{}finally{}\nfoo()",
            options: [[
                ["never", "try", "*"]
            ]],
            errors: ["Unexpected blank lines before this statement."]
        },
        {
            code: "try{}catch(e){}finally{}\n\nfoo()",
            output: "try{}catch(e){}finally{}\nfoo()",
            options: [[
                ["never", "try", "*"]
            ]],
            errors: ["Unexpected blank lines before this statement."]
        },
        {
            code: "try{}catch(e){}\nfoo()",
            output: "try{}catch(e){}\n\nfoo()",
            options: [[
                ["always", "try", "*"]
            ]],
            errors: ["Expected one or more blank lines before this statement."]
        },
        {
            code: "try{}finally{}\nfoo()",
            output: "try{}finally{}\n\nfoo()",
            options: [[
                ["always", "try", "*"]
            ]],
            errors: ["Expected one or more blank lines before this statement."]
        },
        {
            code: "try{}catch(e){}finally{}\nfoo()",
            output: "try{}catch(e){}finally{}\n\nfoo()",
            options: [[
                ["always", "try", "*"]
            ]],
            errors: ["Expected one or more blank lines before this statement."]
        },

        //----------------------------------------------------------------------
        // var
        //----------------------------------------------------------------------

        {
            code: "var a\n\nfoo()",
            output: "var a\nfoo()",
            options: [[
                ["never", "var", "*"]
            ]],
            errors: ["Unexpected blank lines before this statement."]
        },
        {
            code: "var a\nfoo()",
            output: "var a\n\nfoo()",
            options: [[
                ["always", "var", "*"]
            ]],
            errors: ["Expected one or more blank lines before this statement."]
        },

        //----------------------------------------------------------------------
        // while
        //----------------------------------------------------------------------

        {
            code: "while(a);\n\nfoo()",
            output: "while(a);\nfoo()",
            options: [[
                ["never", "while", "*"]
            ]],
            errors: ["Unexpected blank lines before this statement."]
        },
        {
            code: "while(a);\nfoo()",
            output: "while(a);\n\nfoo()",
            options: [[
                ["always", "while", "*"]
            ]],
            errors: ["Expected one or more blank lines before this statement."]
        },

        //----------------------------------------------------------------------
        // with
        //----------------------------------------------------------------------

        {
            code: "with(a);\n\nfoo()",
            output: "with(a);\nfoo()",
            options: [[
                ["never", "with", "*"]
            ]],
            errors: ["Unexpected blank lines before this statement."]
        },
        {
            code: "with(a);\nfoo()",
            output: "with(a);\n\nfoo()",
            options: [[
                ["always", "with", "*"]
            ]],
            errors: ["Expected one or more blank lines before this statement."]
        },

        //----------------------------------------------------------------------
        // Tests from newline-after-var
        //----------------------------------------------------------------------

        // should disallow no line break in "always" mode
        {
            code: "var greet = 'hello';console.log(greet);",
            output: "var greet = 'hello';\n\nconsole.log(greet);",
            options: [[
                ["always", ["const", "let", "var"], "*"],
                ["any", ["const", "let", "var"], ["const", "let", "var"]]
            ]],
            errors: ["Expected one or more blank lines before this statement."]
        },
        {
            code: "var greet = 'hello';var name = 'world';console.log(greet, name);",
            output: "var greet = 'hello';var name = 'world';\n\nconsole.log(greet, name);",
            options: [[
                ["always", ["const", "let", "var"], "*"],
                ["any", ["const", "let", "var"], ["const", "let", "var"]]
            ]],
            errors: ["Expected one or more blank lines before this statement."]
        },
        {
            code: "var greet = 'hello', name = 'world';console.log(greet, name);",
            output: "var greet = 'hello', name = 'world';\n\nconsole.log(greet, name);",
            options: [[
                ["always", ["const", "let", "var"], "*"],
                ["any", ["const", "let", "var"], ["const", "let", "var"]]
            ]],
            errors: ["Expected one or more blank lines before this statement."]
        },

        // should disallow no blank line in "always" mode
        {
            code: "var greet = 'hello';\nconsole.log(greet);",
            output: "var greet = 'hello';\n\nconsole.log(greet);",
            options: [[
                ["always", ["const", "let", "var"], "*"],
                ["any", ["const", "let", "var"], ["const", "let", "var"]]
            ]],
            errors: ["Expected one or more blank lines before this statement."]
        },
        {
            code: "var greet = 'hello';    \nconsole.log(greet);",
            output: "var greet = 'hello';\n    \nconsole.log(greet);",
            options: [[
                ["always", ["const", "let", "var"], "*"],
                ["any", ["const", "let", "var"], ["const", "let", "var"]]
            ]],
            errors: ["Expected one or more blank lines before this statement."]
        },
        {
            code: "var greet = 'hello'; // inline comment\nconsole.log(greet);",
            output: "var greet = 'hello'; // inline comment\n\nconsole.log(greet);",
            options: [[
                ["always", ["const", "let", "var"], "*"],
                ["any", ["const", "let", "var"], ["const", "let", "var"]]
            ]],
            errors: ["Expected one or more blank lines before this statement."]
        },
        {
            code: "var greet = 'hello';\nvar name = 'world';\nconsole.log(greet, name);",
            output: "var greet = 'hello';\nvar name = 'world';\n\nconsole.log(greet, name);",
            options: [[
                ["always", ["const", "let", "var"], "*"],
                ["any", ["const", "let", "var"], ["const", "let", "var"]]
            ]],
            errors: ["Expected one or more blank lines before this statement."]
        },
        {
            code: "var greet = 'hello', name = 'world';\nconsole.log(greet, name);",
            output: "var greet = 'hello', name = 'world';\n\nconsole.log(greet, name);",
            options: [[
                ["always", ["const", "let", "var"], "*"],
                ["any", ["const", "let", "var"], ["const", "let", "var"]]
            ]],
            errors: ["Expected one or more blank lines before this statement."]
        },
        {
            code: "var greet = 'hello',\nname = 'world';\nconsole.log(greet, name);",
            output: "var greet = 'hello',\nname = 'world';\n\nconsole.log(greet, name);",
            options: [[
                ["always", ["const", "let", "var"], "*"],
                ["any", ["const", "let", "var"], ["const", "let", "var"]]
            ]],
            errors: ["Expected one or more blank lines before this statement."]
        },
        {
            code: "let greet = 'hello';\nconsole.log(greet);",
            output: "let greet = 'hello';\n\nconsole.log(greet);",
            options: [[
                ["always", ["const", "let", "var"], "*"],
                ["any", ["const", "let", "var"], ["const", "let", "var"]]
            ]],
            errors: ["Expected one or more blank lines before this statement."]
        },
        {
            code: "const greet = 'hello';\nconsole.log(greet);",
            output: "const greet = 'hello';\n\nconsole.log(greet);",
            options: [[
                ["always", ["const", "let", "var"], "*"],
                ["any", ["const", "let", "var"], ["const", "let", "var"]]
            ]],
            errors: ["Expected one or more blank lines before this statement."]
        },
        {
            code: "function example() {\nvar greet = 'hello';\nconsole.log(greet);\n}",
            output: "function example() {\nvar greet = 'hello';\n\nconsole.log(greet);\n}",
            options: [[
                ["always", ["const", "let", "var"], "*"],
                ["any", ["const", "let", "var"], ["const", "let", "var"]]
            ]],
            errors: ["Expected one or more blank lines before this statement."]
        },
        {
            code: "var f = function() {\nvar greet = 'hello';\nconsole.log(greet);\n};",
            output: "var f = function() {\nvar greet = 'hello';\n\nconsole.log(greet);\n};",
            options: [[
                ["always", ["const", "let", "var"], "*"],
                ["any", ["const", "let", "var"], ["const", "let", "var"]]
            ]],
            errors: ["Expected one or more blank lines before this statement."]
        },
        {
            code: "() => {\nvar greet = 'hello';\nconsole.log(greet);\n}",
            output: "() => {\nvar greet = 'hello';\n\nconsole.log(greet);\n}",
            options: [[
                ["always", ["const", "let", "var"], "*"],
                ["any", ["const", "let", "var"], ["const", "let", "var"]]
            ]],
            errors: ["Expected one or more blank lines before this statement."]
        },

        // should disallow blank lines in "never" mode
        {
            code: "var greet = 'hello';\n\nconsole.log(greet);",
            output: "var greet = 'hello';\nconsole.log(greet);",
            options: [[
                ["never", ["const", "let", "var"], "*"],
                ["any", ["const", "let", "var"], ["const", "let", "var"]]
            ]],
            errors: ["Unexpected blank lines before this statement."]
        },
        {
            code: "var greet = 'hello';\n\n\nconsole.log(greet);",
            output: "var greet = 'hello';\nconsole.log(greet);",
            options: [[
                ["never", ["const", "let", "var"], "*"],
                ["any", ["const", "let", "var"], ["const", "let", "var"]]
            ]],
            errors: ["Unexpected blank lines before this statement."]
        },
        {
            code: "var greet = 'hello';\n\n\n\nconsole.log(greet);",
            output: "var greet = 'hello';\nconsole.log(greet);",
            options: [[
                ["never", ["const", "let", "var"], "*"],
                ["any", ["const", "let", "var"], ["const", "let", "var"]]
            ]],
            errors: ["Unexpected blank lines before this statement."]
        },
        {
            code: "var greet = 'hello';    \n\nconsole.log(greet);",
            output: "var greet = 'hello';    \nconsole.log(greet);",
            options: [[
                ["never", ["const", "let", "var"], "*"],
                ["any", ["const", "let", "var"], ["const", "let", "var"]]
            ]],
            errors: ["Unexpected blank lines before this statement."]
        },
        {
            code: "var greet = 'hello'; // inline comment\n\nconsole.log(greet);",
            output: "var greet = 'hello'; // inline comment\nconsole.log(greet);",
            options: [[
                ["never", ["const", "let", "var"], "*"],
                ["any", ["const", "let", "var"], ["const", "let", "var"]]
            ]],
            errors: ["Unexpected blank lines before this statement."]
        },
        {
            code: "var greet = 'hello';\nvar name = 'world';\n\nconsole.log(greet, name);",
            output: "var greet = 'hello';\nvar name = 'world';\nconsole.log(greet, name);",
            options: [[
                ["never", ["const", "let", "var"], "*"],
                ["any", ["const", "let", "var"], ["const", "let", "var"]]
            ]],
            errors: ["Unexpected blank lines before this statement."]
        },
        {
            code: "var greet = 'hello', name = 'world';\n\nconsole.log(greet, name);",
            output: "var greet = 'hello', name = 'world';\nconsole.log(greet, name);",
            options: [[
                ["never", ["const", "let", "var"], "*"],
                ["any", ["const", "let", "var"], ["const", "let", "var"]]
            ]],
            errors: ["Unexpected blank lines before this statement."]
        },
        {
            code: "var greet = 'hello',\nname = 'world';\n\nconsole.log(greet, name);",
            output: "var greet = 'hello',\nname = 'world';\nconsole.log(greet, name);",
            options: [[
                ["never", ["const", "let", "var"], "*"],
                ["any", ["const", "let", "var"], ["const", "let", "var"]]
            ]],
            errors: ["Unexpected blank lines before this statement."]
        },
        {
            code: "var greet = 'hello', // inline comment\nname = 'world'; // inline comment\n\nconsole.log(greet, name);",
            output: "var greet = 'hello', // inline comment\nname = 'world'; // inline comment\nconsole.log(greet, name);",
            options: [[
                ["never", ["const", "let", "var"], "*"],
                ["any", ["const", "let", "var"], ["const", "let", "var"]]
            ]],
            errors: ["Unexpected blank lines before this statement."]
        },
        {
            code: "let greet = 'hello';\n\nconsole.log(greet);",
            output: "let greet = 'hello';\nconsole.log(greet);",
            options: [[
                ["never", ["const", "let", "var"], "*"],
                ["any", ["const", "let", "var"], ["const", "let", "var"]]
            ]],
            errors: ["Unexpected blank lines before this statement."]
        },
        {
            code: "const greet = 'hello';\n\nconsole.log(greet);",
            output: "const greet = 'hello';\nconsole.log(greet);",
            options: [[
                ["never", ["const", "let", "var"], "*"],
                ["any", ["const", "let", "var"], ["const", "let", "var"]]
            ]],
            errors: ["Unexpected blank lines before this statement."]
        },

        // should disallow a comment on the next line that's not in turn followed by a blank in "always" mode
        {
            code: "var greet = 'hello';\n// next-line comment\nconsole.log(greet);",
            output: "var greet = 'hello';\n\n// next-line comment\nconsole.log(greet);",
            options: [[
                ["always", ["const", "let", "var"], "*"],
                ["any", ["const", "let", "var"], ["const", "let", "var"]]
            ]],
            errors: ["Expected one or more blank lines before this statement."]
        },
        {
            code: "var greet = 'hello';\n/* block comment\nblock comment */\nconsole.log(greet);",
            output: "var greet = 'hello';\n\n/* block comment\nblock comment */\nconsole.log(greet);",
            options: [[
                ["always", ["const", "let", "var"], "*"],
                ["any", ["const", "let", "var"], ["const", "let", "var"]]
            ]],
            errors: ["Expected one or more blank lines before this statement."]
        },
        {
            code: "var greet = 'hello',\nname = 'world';\n// next-line comment\nconsole.log(greet);",
            output: "var greet = 'hello',\nname = 'world';\n\n// next-line comment\nconsole.log(greet);",
            options: [[
                ["always", ["const", "let", "var"], "*"],
                ["any", ["const", "let", "var"], ["const", "let", "var"]]
            ]],
            errors: ["Expected one or more blank lines before this statement."]
        },
        {
            code: "var greet = 'hello',\nname = 'world';\n/* block comment\nblock comment */\nconsole.log(greet);",
            output: "var greet = 'hello',\nname = 'world';\n\n/* block comment\nblock comment */\nconsole.log(greet);",
            options: [[
                ["always", ["const", "let", "var"], "*"],
                ["any", ["const", "let", "var"], ["const", "let", "var"]]
            ]],
            errors: ["Expected one or more blank lines before this statement."]
        },
        {
            code: "var greet = 'hello';\n// next-line comment\n// second-line comment\nconsole.log(greet);",
            output: "var greet = 'hello';\n\n// next-line comment\n// second-line comment\nconsole.log(greet);",
            options: [[
                ["always", ["const", "let", "var"], "*"],
                ["any", ["const", "let", "var"], ["const", "let", "var"]]
            ]],
            errors: ["Expected one or more blank lines before this statement."]
        },
        {
            code: "var greet = 'hello';\n// next-line comment\n/* block comment\nblock comment */\nconsole.log(greet);",
            output: "var greet = 'hello';\n\n// next-line comment\n/* block comment\nblock comment */\nconsole.log(greet);",
            options: [[
                ["always", ["const", "let", "var"], "*"],
                ["any", ["const", "let", "var"], ["const", "let", "var"]]
            ]],
            errors: ["Expected one or more blank lines before this statement."]
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
            options: [[
                ["always", ["const", "let", "var"], "*"],
                ["any", ["const", "let", "var"], ["const", "let", "var"]]
            ]],
            errors: ["Expected one or more blank lines before this statement."]
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
            options: [[
                ["never", ["const", "let", "var"], "*"],
                ["any", ["const", "let", "var"], ["const", "let", "var"]]
            ]],
            errors: ["Unexpected blank lines before this statement."]
        },

        //----------------------------------------------------------------------
        // Tests from newline-before-return
        //----------------------------------------------------------------------

        {
            code: "function a() {\nvar b; return;\n}",
            errors: ["Expected one or more blank lines before this statement."],
            output: "function a() {\nvar b;\n\n return;\n}",
            options: [[
                ["always", "*", "return"]
            ]]
        },
        {
            code: "function a() {\nvar b;\nreturn;\n}",
            errors: ["Expected one or more blank lines before this statement."],
            output: "function a() {\nvar b;\n\nreturn;\n}",
            options: [[
                ["always", "*", "return"]
            ]]
        },
        {
            code: "function a() {\nif (b) return b;\nelse if (c) return c;\nelse {\ne();\nreturn d;\n}\n}",
            errors: ["Expected one or more blank lines before this statement."],
            output: "function a() {\nif (b) return b;\nelse if (c) return c;\nelse {\ne();\n\nreturn d;\n}\n}",
            options: [[
                ["always", "*", "return"]
            ]]
        },
        {
            code: "function a() {\nif (b) return b;\nelse if (c) return c;\nelse {\ne(); return d;\n}\n}",
            errors: ["Expected one or more blank lines before this statement."],
            output: "function a() {\nif (b) return b;\nelse if (c) return c;\nelse {\ne();\n\n return d;\n}\n}",
            options: [[
                ["always", "*", "return"]
            ]]
        },
        {
            code: "function a() {\n while (b) {\nc();\nreturn;\n}\n}",
            errors: ["Expected one or more blank lines before this statement."],
            output: "function a() {\n while (b) {\nc();\n\nreturn;\n}\n}",
            options: [[
                ["always", "*", "return"]
            ]]
        },
        {
            code: "function a() {\ndo {\nc();\nreturn;\n} while (b);\n}",
            errors: ["Expected one or more blank lines before this statement."],
            output: "function a() {\ndo {\nc();\n\nreturn;\n} while (b);\n}",
            options: [[
                ["always", "*", "return"]
            ]]
        },
        {
            code: "function a() {\nfor (var b; b < c; b++) {\nc();\nreturn;\n}\n}",
            errors: ["Expected one or more blank lines before this statement."],
            output: "function a() {\nfor (var b; b < c; b++) {\nc();\n\nreturn;\n}\n}",
            options: [[
                ["always", "*", "return"]
            ]]
        },
        {
            code: "function a() {\nfor (b in c) {\nd();\nreturn;\n}\n}",
            errors: ["Expected one or more blank lines before this statement."],
            output: "function a() {\nfor (b in c) {\nd();\n\nreturn;\n}\n}",
            options: [[
                ["always", "*", "return"]
            ]]
        },
        {
            code: "function a() {\nfor (b of c) {\nd();\nreturn;\n}\n}",
            errors: ["Expected one or more blank lines before this statement."],
            output: "function a() {\nfor (b of c) {\nd();\n\nreturn;\n}\n}",
            options: [[
                ["always", "*", "return"]
            ]]
        },
        {
            code: "function a() {\nif (b) {\nc();\n}\n//comment\nreturn b;\n}",
            errors: ["Expected one or more blank lines before this statement."],
            output: "function a() {\nif (b) {\nc();\n}\n\n//comment\nreturn b;\n}",
            options: [[
                ["always", "*", "return"]
            ]]
        },
        {
            code: "function a() {\n/*comment\ncomment*/\nif (b) {\nc();\nreturn b;\n} else {\n//comment\n\nreturn d;\n}\n/*multi-line\ncomment*/\nreturn e;\n}",
            errors: ["Expected one or more blank lines before this statement.", "Expected one or more blank lines before this statement."],
            output: "function a() {\n/*comment\ncomment*/\nif (b) {\nc();\n\nreturn b;\n} else {\n//comment\n\nreturn d;\n}\n\n/*multi-line\ncomment*/\nreturn e;\n}",
            options: [[
                ["always", "*", "return"]
            ]]
        },
        {
            code: "function a() {\nif (b) { return; } //comment\nreturn c;\n}",
            errors: ["Expected one or more blank lines before this statement."],
            output: "function a() {\nif (b) { return; } //comment\n\nreturn c;\n}",
            options: [[
                ["always", "*", "return"]
            ]]
        },
        {
            code: "function a() {\nif (b) { return; } /*multi-line\ncomment*/\nreturn c;\n}",
            errors: ["Expected one or more blank lines before this statement."],
            output: "function a() {\nif (b) { return; } /*multi-line\ncomment*/\n\nreturn c;\n}",
            options: [[
                ["always", "*", "return"]
            ]]
        },
        {
            code: "function a() {\nif (b) { return; }\n/*multi-line\ncomment*/ return c;\n}",
            errors: ["Expected one or more blank lines before this statement."],
            output: "function a() {\nif (b) { return; }\n\n/*multi-line\ncomment*/ return c;\n}",
            options: [[
                ["always", "*", "return"]
            ]]
        },
        {
            code: "function a() {\nif (b) { return; } /*multi-line\ncomment*/ return c;\n}",
            errors: ["Expected one or more blank lines before this statement."],
            output: "function a() {\nif (b) { return; } /*multi-line\ncomment*/\n\n return c;\n}",
            options: [[
                ["always", "*", "return"]
            ]]
        },
        {
            code: "var a;\nreturn;",
            parserOptions: { ecmaFeatures: { globalReturn: true } },
            errors: ["Expected one or more blank lines before this statement."],
            output: "var a;\n\nreturn;",
            options: [[
                ["always", "*", "return"]
            ]]
        },
        {
            code: "var a; return;",
            parserOptions: { ecmaFeatures: { globalReturn: true } },
            errors: ["Expected one or more blank lines before this statement."],
            output: "var a;\n\n return;",
            options: [[
                ["always", "*", "return"]
            ]]
        },
        {
            code: "function a() {\n{\n//comment\n}\nreturn\n}",
            errors: ["Expected one or more blank lines before this statement."],
            output: "function a() {\n{\n//comment\n}\n\nreturn\n}",
            options: [[
                ["always", "*", "return"]
            ]]
        },
        {
            code: "function a() {\n{\n//comment\n} return\n}",
            errors: ["Expected one or more blank lines before this statement."],
            output: "function a() {\n{\n//comment\n}\n\n return\n}",
            options: [[
                ["always", "*", "return"]
            ]]
        },
        {
            code: "function a() {\nvar c;\nwhile (b) {\n c = d; //comment\n}\nreturn c;\n}",
            errors: ["Expected one or more blank lines before this statement."],
            output: "function a() {\nvar c;\nwhile (b) {\n c = d; //comment\n}\n\nreturn c;\n}",
            options: [[
                ["always", "*", "return"]
            ]]
        },
        {
            code: "function a() {\nfor (var b; b < c; b++) {\nif (d) {\nbreak; //comment\n}\nreturn;\n}\n}",
            errors: ["Expected one or more blank lines before this statement."],
            output: "function a() {\nfor (var b; b < c; b++) {\nif (d) {\nbreak; //comment\n}\n\nreturn;\n}\n}",
            options: [[
                ["always", "*", "return"]
            ]]
        },
        {
            code: "function a() {\nvar b; /*multi-line\ncomment*/\nreturn c;\n}",
            errors: ["Expected one or more blank lines before this statement."],
            output: "function a() {\nvar b; /*multi-line\ncomment*/\n\nreturn c;\n}",
            options: [[
                ["always", "*", "return"]
            ]]
        },
        {
            code: "function a() {\nvar b;\n/*multi-line\ncomment*/ return c;\n}",
            errors: ["Expected one or more blank lines before this statement."],
            output: "function a() {\nvar b;\n\n/*multi-line\ncomment*/ return c;\n}",
            options: [[
                ["always", "*", "return"]
            ]]
        },
        {
            code: "function a() {\nvar b; /*multi-line\ncomment*/ return c;\n}",
            errors: ["Expected one or more blank lines before this statement."],
            output: "function a() {\nvar b; /*multi-line\ncomment*/\n\n return c;\n}",
            options: [[
                ["always", "*", "return"]
            ]]
        },
        {
            code: "function a() {\nvar b;\n//comment\nreturn;\n}",
            errors: ["Expected one or more blank lines before this statement."],
            output: "function a() {\nvar b;\n\n//comment\nreturn;\n}",
            options: [[
                ["always", "*", "return"]
            ]]
        },
        {
            code: "function a() {\nvar b; //comment\nreturn;\n}",
            errors: ["Expected one or more blank lines before this statement."],
            output: "function a() {\nvar b; //comment\n\nreturn;\n}",
            options: [[
                ["always", "*", "return"]
            ]]
        },
        {
            code: "function a() {\nvar b;\n/* comment */ return;\n}",
            errors: ["Expected one or more blank lines before this statement."],
            output: "function a() {\nvar b;\n\n/* comment */ return;\n}",
            options: [[
                ["always", "*", "return"]
            ]]
        },
        {
            code: "function a() {\nvar b;\n//comment\n/* comment */ return;\n}",
            errors: ["Expected one or more blank lines before this statement."],
            output: "function a() {\nvar b;\n\n//comment\n/* comment */ return;\n}",
            options: [[
                ["always", "*", "return"]
            ]]
        },
        {
            code: "function a() {\nvar b; /* comment */ return;\n}",
            errors: ["Expected one or more blank lines before this statement."],
            output: "function a() {\nvar b; /* comment */\n\n return;\n}",
            options: [[
                ["always", "*", "return"]
            ]]
        },
        {
            code: "function a() {\nvar b; /* comment */\nreturn;\n}",
            errors: ["Expected one or more blank lines before this statement."],
            output: "function a() {\nvar b; /* comment */\n\nreturn;\n}",
            options: [[
                ["always", "*", "return"]
            ]]
        },
        {
            code: "function a() {\nvar b;\nreturn; //comment\n}",
            errors: ["Expected one or more blank lines before this statement."],
            output: "function a() {\nvar b;\n\nreturn; //comment\n}",
            options: [[
                ["always", "*", "return"]
            ]]
        },
        {
            code: "function a() {\nvar b; return; //comment\n}",
            errors: ["Expected one or more blank lines before this statement."],
            output: "function a() {\nvar b;\n\n return; //comment\n}",
            options: [[
                ["always", "*", "return"]
            ]]
        },

        //----------------------------------------------------------------------
        // From JSCS disallowPaddingNewLinesAfterBlocks
        // https://github.com/jscs-dev/node-jscs/blob/44f9b86eb0757fd4ca05a81a50450c5f1b25c37b/test/specs/rules/disallow-padding-newlines-after-blocks.js
        //----------------------------------------------------------------------

        {
            code: "if(true){}\n\nvar a = 2;",
            output: "if(true){}\nvar a = 2;",
            options: [[
                ["never", "block-like", "*"]
            ]],
            errors: ["Unexpected blank lines before this statement."]
        },
        {
            code: "if(true){\nif(true) {}\n\nvar a = 2;}",
            output: "if(true){\nif(true) {}\nvar a = 2;}",
            options: [[
                ["never", "block-like", "*"]
            ]],
            errors: ["Unexpected blank lines before this statement."]
        },
        {
            code: "(function(){\n})()\n\nvar a = 2;",
            output: "(function(){\n})()\nvar a = 2;",
            options: [[
                ["never", "block-like", "*"]
            ]],
            errors: ["Unexpected blank lines before this statement."]
        },
        {
            code: "var a = function() {};\n\nvar b = 2;",
            output: "var a = function() {};\nvar b = 2;",
            options: [[
                ["never", "block-like", "*"]
            ]],
            errors: ["Unexpected blank lines before this statement."]
        },

        //----------------------------------------------------------------------
        // From JSCS disallowPaddingNewLinesBeforeExport
        // https://github.com/jscs-dev/node-jscs/blob/44f9b86eb0757fd4ca05a81a50450c5f1b25c37b/test/specs/rules/disallow-padding-newlines-before-export.js
        //----------------------------------------------------------------------

        {
            code: "var a = 2;\n\nmodule.exports = a;",
            output: "var a = 2;\nmodule.exports = a;",
            options: [[
                ["never", "*", "cjs-export"]
            ]],
            errors: ["Unexpected blank lines before this statement."]
        },

        //----------------------------------------------------------------------
        // From JSCS disallowPaddingNewLinesBeforeExport
        // https://github.com/jscs-dev/node-jscs/blob/44f9b86eb0757fd4ca05a81a50450c5f1b25c37b/test/specs/rules/disallow-padding-newlines-before-keywords.js
        //----------------------------------------------------------------------

        {
            code: "function x() { var a;\n\nreturn; }",
            output: "function x() { var a;\nreturn; }",
            options: [[
                ["never", "*", ["if", "for", "return", "switch", "case", "break", "throw"]]
            ]],
            errors: ["Unexpected blank lines before this statement."]
        },
        {
            code: "function x() { var a = true;\n\nif (a) { a = !a; }; }",
            output: "function x() { var a = true;\nif (a) { a = !a; }; }",
            options: [[
                ["never", "*", ["if", "for", "return", "switch", "case", "break", "throw"]]
            ]],
            errors: ["Unexpected blank lines before this statement."]
        },
        {
            code: "function x() { var a = true;\n\nfor (var i = 0; i < 10; i++) { a = !a; }; }",
            output: "function x() { var a = true;\nfor (var i = 0; i < 10; i++) { a = !a; }; }",
            options: [[
                ["never", "*", ["if", "for", "return", "switch", "case", "break", "throw"]]
            ]],
            errors: ["Unexpected blank lines before this statement."]
        },
        {
            code: "function x() { var y = true;\n\nswitch (\"Oranges\") { case \"Oranges\": y = !y;\n\nbreak;\n\ncase \"Apples\": y = !y;\n\nbreak; default: y = !y; } }",
            output: "function x() { var y = true;\nswitch (\"Oranges\") { case \"Oranges\": y = !y;\nbreak;\ncase \"Apples\": y = !y;\nbreak; default: y = !y; } }",
            options: [[
                ["never", "*", ["if", "for", "return", "switch", "case", "break", "throw"]]
            ]],
            errors: [
                "Unexpected blank lines before this statement.",
                "Unexpected blank lines before this statement.",
                "Unexpected blank lines before this statement.",
                "Unexpected blank lines before this statement."
            ]
        },
        {
            code: "function x() {try { var a;\n\nthrow 0; } catch (e) { var b = 0;\n\nthrow e; } }",
            output: "function x() {try { var a;\nthrow 0; } catch (e) { var b = 0;\nthrow e; } }",
            options: [[
                ["never", "*", ["if", "for", "return", "switch", "case", "break", "throw"]]
            ]],
            errors: [
                "Unexpected blank lines before this statement.",
                "Unexpected blank lines before this statement."
            ]
        },
        {
            code: "function x(a) { var b = 0;\n\nif (!a) { return false; };\n\nfor (var i = 0; i < b; i++) { if (!a[i]) return false; }\n\nreturn true; }",
            output: "function x(a) { var b = 0;\nif (!a) { return false; };\nfor (var i = 0; i < b; i++) { if (!a[i]) return false; }\nreturn true; }",
            options: [[
                ["never", "*", ["if", "for", "return", "switch", "case", "break", "throw"]]
            ]],
            errors: [
                "Unexpected blank lines before this statement.",
                "Unexpected blank lines before this statement.",
                "Unexpected blank lines before this statement."
            ]
        },

        //----------------------------------------------------------------------
        // From JSCS requirePaddingNewLinesAfterBlocks
        // https://github.com/jscs-dev/node-jscs/blob/44f9b86eb0757fd4ca05a81a50450c5f1b25c37b/test/specs/rules/require-padding-newlines-after-blocks.js
        //----------------------------------------------------------------------

        {
            code: "if(true){}\nvar a = 2;",
            output: "if(true){}\n\nvar a = 2;",
            options: [[
                ["always", "block-like", "*"]
            ]],
            errors: ["Expected one or more blank lines before this statement."]
        },
        {
            code: "var a = function() {\n};\nvar b = 2;",
            output: "var a = function() {\n};\n\nvar b = 2;",
            options: [[
                ["always", "block-like", "*"]
            ]],
            errors: ["Expected one or more blank lines before this statement."]
        },
        {
            code: "if(true){\nif(true) {}\nvar a = 2;}",
            output: "if(true){\nif(true) {}\n\nvar a = 2;}",
            options: [[
                ["always", "block-like", "*"]
            ]],
            errors: ["Expected one or more blank lines before this statement."]
        },
        {
            code: "(function(){\n})()\nvar a = 2;",
            output: "(function(){\n})()\n\nvar a = 2;",
            options: [[
                ["always", "block-like", "*"]
            ]],
            errors: ["Expected one or more blank lines before this statement."]
        },
        {
            code: "var a = function() {\n};\nvar b = 2;",
            output: "var a = function() {\n};\n\nvar b = 2;",
            options: [[
                ["always", "multiline-block-like", "*"]
            ]],
            errors: ["Expected one or more blank lines before this statement."]
        },
        {
            code: "(function(){\n})()\nvar a = 2;",
            output: "(function(){\n})()\n\nvar a = 2;",
            options: [[
                ["always", "multiline-block-like", "*"]
            ]],
            errors: ["Expected one or more blank lines before this statement."]
        },

        //----------------------------------------------------------------------
        // From JSCS requirePaddingNewLinesBeforeExport
        // https://github.com/jscs-dev/node-jscs/blob/44f9b86eb0757fd4ca05a81a50450c5f1b25c37b/test/specs/rules/require-padding-newlines-before-export.js
        //----------------------------------------------------------------------

        {
            code: "var a = 2;\nmodule.exports = a;",
            output: "var a = 2;\n\nmodule.exports = a;",
            options: [[
                ["always", "*", "cjs-export"]
            ]],
            errors: ["Expected one or more blank lines before this statement."]
        },

        //----------------------------------------------------------------------
        // From JSCS requirePaddingNewlinesBeforeKeywords
        // https://github.com/jscs-dev/node-jscs/blob/44f9b86eb0757fd4ca05a81a50450c5f1b25c37b/test/specs/rules/require-padding-newlines-before-keywords.js
        //----------------------------------------------------------------------

        {
            code: "function x() { var a; return; }",
            output: "function x() { var a;\n\n return; }",
            options: [[
                ["always", "*", ["if", "for", "return", "switch", "case", "break", "throw", "while", "default"]]
            ]],
            errors: ["Expected one or more blank lines before this statement."]
        },
        {
            code: "function x() { var a = true; for (var i = 0; i < 10; i++) { a = !a; }; }",
            output: "function x() { var a = true;\n\n for (var i = 0; i < 10; i++) { a = !a; }; }",
            options: [[
                ["always", "*", ["if", "for", "return", "switch", "case", "break", "throw", "while", "default"]]
            ]],
            errors: ["Expected one or more blank lines before this statement."]
        },
        {
            code: "function x() { var y = true; switch (\"Oranges\") { case \"Oranges\": y = !y; break; case \"Apples\": y = !y; break; default: y = !y; } }",
            output: "function x() { var y = true;\n\n switch (\"Oranges\") { case \"Oranges\": y = !y;\n\n break;\n\n case \"Apples\": y = !y;\n\n break;\n\n default: y = !y; } }",
            options: [[
                ["always", "*", ["if", "for", "return", "switch", "case", "break", "throw", "while", "default"]]
            ]],
            errors: [
                "Expected one or more blank lines before this statement.",
                "Expected one or more blank lines before this statement.",
                "Expected one or more blank lines before this statement.",
                "Expected one or more blank lines before this statement.",
                "Expected one or more blank lines before this statement."
            ]
        },
        {
            code: "function x() { var a = true; while (!a) { a = !a; }; }",
            output: "function x() { var a = true;\n\n while (!a) { a = !a; }; }",
            options: [[
                ["always", "*", ["if", "for", "return", "switch", "case", "break", "throw", "while", "default"]]
            ]],
            errors: ["Expected one or more blank lines before this statement."]
        },
        {
            code: "function x() {try { var a; throw 0; } catch (e) { var b = 0; throw e; } }",
            output: "function x() {try { var a;\n\n throw 0; } catch (e) { var b = 0;\n\n throw e; } }",
            options: [[
                ["always", "*", ["if", "for", "return", "switch", "case", "break", "throw", "while", "default"]]
            ]],
            errors: [
                "Expected one or more blank lines before this statement.",
                "Expected one or more blank lines before this statement."
            ]
        },
        {
            code: "function x(a) { var b = 0; if (!a) { return false; }; for (var i = 0; i < b; i++) { if (!a[i]) return false; } return true; }",
            output: "function x(a) { var b = 0;\n\n if (!a) { return false; };\n\n for (var i = 0; i < b; i++) { if (!a[i]) return false; }\n\n return true; }",
            options: [[
                ["always", "*", ["if", "for", "return", "switch", "case", "break", "throw", "while", "default"]]
            ]],
            errors: [
                "Expected one or more blank lines before this statement.",
                "Expected one or more blank lines before this statement.",
                "Expected one or more blank lines before this statement."
            ]
        }
    ]
});
