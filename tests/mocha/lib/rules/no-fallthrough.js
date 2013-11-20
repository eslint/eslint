/**
 * @fileoverview Tests for no-fallthrough rule.
 * @author Matt DuVall<http://mattduvall.com/>
 */

/*jshint node:true*/

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslintTester = require("../../../../lib/tests/eslintTester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

eslintTester.add("no-fallthrough", {
    valid: [
        "switch(foo) { case 'foo': foo.bar(); /* falls through */}",
        "function foo() { switch(foo) { case 'foo': foo.bar(); return; }; }",
        "switch(foo) { case 'foo': foo.bar(); throw 'bar'; }",
        "switch(foo) { case 'bar': case 'foo': foo.bar(); break; }",
        "switch(foo) { case 'bar': case 'foo': break; }",
        "switch(foo) { }"
    ],
    invalid: [
        { code: "switch(foo) { case 'foo': foo.bar(); }", errors: [{ message: "No fall-through without explicit comment."}] }
    ]
});
