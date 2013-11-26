/**
 * @fileoverview Tests for no-sync.
 * @author Matt DuVall <http://www.mattduvall.com>
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslintTester = require("../../../lib/tests/eslintTester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

eslintTester.add("no-sync", {
    valid: [
        "var foo = fs.foo.foo();"
    ],
    invalid: [
        { code: "var foo = fs.fooSync();", errors: [{ message: "Unexpected sync method: 'fooSync'.", type: "MemberExpression"}] },
        { code: "var foo = fs.fooSync;", errors: [{ message: "Unexpected sync method: 'fooSync'.", type: "MemberExpression"}] }
    ]
});
