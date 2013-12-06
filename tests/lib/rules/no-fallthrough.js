/**
 * @fileoverview Tests for no-fallthrough rule.
 * @author Matt DuVall<http://mattduvall.com/>
 */

/*jshint node:true*/

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslintTester = require("../../../lib/tests/eslintTester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

eslintTester.addRuleTest("no-fallthrough", {
    valid: [
        "switch(foo) { case 0: a(); /* falls through */ case 1: b(); }",
        "function foo() { switch(foo) { case 0: a(); return; case 1: b(); }; }",
        "switch(foo) { case 0: a(); throw 'foo'; case 1: b(); }",
        "switch(foo) { case 0: a(); break; case 1: b(); }",
        "switch(foo) { case 0: case 1: a(); break; case 2: b(); }",
        "switch(foo) { case 0: case 1: break; case 2: b(); }",
        "switch(foo) { case 0: case 1: a(); }",
        "switch(foo) { case 0: case 1: a(); break; }",
        "switch(foo) { case 0: case 1: break; }",
        "switch(foo) { }",
        "switch(foo) { case 0: switch(bar) { case 1: break; case 2: break } /* falls through */ case 3: return }"
    ],
    invalid: [
        { code: "switch(foo) { case 0: a(); case 1: b() }", errors: [{ message: "No fall-through without explicit comment.", type: "SwitchCase"}] }
    ]
});
