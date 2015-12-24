/**
 * @fileoverview Tests for no-double-assignments rule.
 */

"use strict";

var rule = require("../../../lib/rules/no-double-assignments"),
    RuleTester = require("../../../lib/testers/rule-tester");

var defaultErrors = [{ message: "Double assignment to the same variable, probably a mistake.", type: "Identifier"}];
var defaultPropertyErrors = [{ message: "Double assignment to the same variable, probably a mistake.", type: "MemberExpression"}];

var ruleTester = new RuleTester();
ruleTester.run("no-double-assignments", rule, {
    valid: [
        "foo = 5;",
        "foo = 5; bar = 5;",
        "foo = 5; foo += 5;",
        "foo = 5; foo *= 5;",

        "foo = 5; bar(foo); foo = 6;",

        "foo.x = 1; foo.y = 2",
        "foo.bar.x = 1; foo.bar.y = 2",
        "foo.bar.x = 1; foo.quux.x = 2",

        "foo = []; foo = add(foo);",
        "foo = []; foo = add(foo.concat(bar));",
        "foo = ''; foo = bar + foo",

        // Whitespace tests
        "foo = 5;bar = 5;",
        "foo=5;bar=5;",
        "   foo = 5   ; ",
        "foo = 5\nbar = 5",
        "foo = 5  \n  bar = 5"
    ],
    invalid: [
        { code: "foo = 5; foo = 6;", errors: defaultErrors },
        { code: "foo = 5; \n foo = 6", errors: defaultErrors },
        { code: "foo += 5; foo = 6;", errors: defaultErrors },
        { code: "foo = bar(); foo = quux();", errors: defaultErrors },
        { code: "foo1=true;foo1=false;", errors: defaultErrors },
        { code: "foo.x = 12; foo.x = 15;", errors: defaultPropertyErrors },
        { code: "foo.bar.x = 12; foo.bar.x = 15;", errors: defaultPropertyErrors }
    ]
});
