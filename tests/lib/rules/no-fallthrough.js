/**
 * @fileoverview Tests for no-fallthrough rule.
 * @author Matt DuVall<http://mattduvall.com/>
 */

"use strict";

/* jshint node:true */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/no-fallthrough"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("no-fallthrough", rule, {
    valid: [
        "switch(foo) { case 0: a(); /* falls through */ case 1: b(); }",
        "switch(foo) { case 0: a()\n /* falls through */ case 1: b(); }",
        "switch(foo) { case 0: a(); /* fall through */ case 1: b(); }",
        "switch(foo) { case 0: a(); /* falls through */ case 1: b(); }",
        "switch(foo) { case 0: a(); /* fallthrough */ case 1: b(); }",
        "switch(foo) { case 0: a(); /* FALLS THROUGH */ case 1: b(); }",
        "function foo() { switch(foo) { case 0: a(); return; case 1: b(); }; }",
        "switch(foo) { case 0: a(); throw 'foo'; case 1: b(); }",
        "while (a) { switch(foo) { case 0: a(); continue; case 1: b(); } }",
        "switch(foo) { case 0: a(); break; case 1: b(); }",
        "switch(foo) { case 0: case 1: a(); break; case 2: b(); }",
        "switch(foo) { case 0: case 1: break; case 2: b(); }",
        "switch(foo) { case 0: case 1: break; default: b(); }",
        "switch(foo) { case 0: case 1: a(); }",
        "switch(foo) { case 0: case 1: a(); break; }",
        "switch(foo) { case 0: case 1: break; }",
        "function foo() { switch(foo) { case 0: case 1: return; } }",
        "function foo() { switch(foo) { case 0: {return;}\n case 1: {return;} } }",
        "switch(foo) { case 0: case 1: {break;} }",
        "switch(foo) { }",
        "switch(foo) { case 0: switch(bar) { case 2: break; } /* falls through */ case 1: break; }",
        "function foo() { switch(foo) { case 1: return a; a++; }}",
        "switch (foo) { case 0: a(); /* falls through */ default:  b(); /* comment */ }",
        "switch (foo) { case 0: a(); /* falls through */ default: /* comment */ b(); }"
    ],
    invalid: [
        {
            code: "switch(foo) { case 0: a();\ncase 1: b() }",
            errors: [
                {
                    message: "Expected a \"break\" statement before \"case\".",
                    type: "SwitchCase",
                    line: 2,
                    column: 1
                }
            ]
        },
        {
            code: "switch(foo) { case 0: a();\ndefault: b() }",
            errors: [
                {
                    message: "Expected a \"break\" statement before \"default\".",
                    type: "SwitchCase",
                    line: 2,
                    column: 1
                }
            ]
        }

    ]
});
