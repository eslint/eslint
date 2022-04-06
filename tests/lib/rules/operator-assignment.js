/**
 * @fileoverview Tests for operator-assignment rule.
 * @author Brandon Mills
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/operator-assignment"),
    { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 2022 } });

ruleTester.run("operator-assignment", rule, {

    valid: [
        "x = y",
        "x = y + x",
        "x += x + y",
        "x = (x + y) - z",
        "x -= y",
        "x = y - x",
        "x *= x",
        "x = y * z",
        "x = (x * y) * z",
        "x = y / x",
        "x /= y",
        "x %= y",
        "x <<= y",
        "x >>= x >> y",
        "x >>>= y",
        "x &= y",
        "x **= y",
        "x ^= y ^ z",
        "x |= x | y",
        "x = x && y",
        "x = x || y",
        "x = x < y",
        "x = x > y",
        "x = x <= y",
        "x = x >= y",
        "x = x instanceof y",
        "x = x in y",
        "x = x == y",
        "x = x != y",
        "x = x === y",
        "x = x !== y",
        "x[y] = x['y'] + z",
        "x.y = x['y'] / z",
        "x.y = z + x.y",
        "x[fn()] = x[fn()] + y",
        {
            code: "x += x + y",
            options: ["always"]
        },
        {
            code: "x = x + y",
            options: ["never"]
        },
        {
            code: "x = x ** y",
            options: ["never"]
        },
        "x = y ** x",
        "x = x * y + z",
        {
            code: "this.x = this.y + z",
            options: ["always"]
        },
        {
            code: "this.x = foo.x + y",
            options: ["always"]
        },
        {
            code: "this.x = foo.this.x + y",
            options: ["always"]
        },
        "const foo = 0; class C { foo = foo + 1; }",

        // does not check logical operators
        {
            code: "x = x && y",
            options: ["always"]
        },
        {
            code: "x = x || y",
            options: ["always"]
        },
        {
            code: "x = x ?? y",
            options: ["always"]
        },
        {
            code: "x &&= y",
            options: ["never"]
        },
        {
            code: "x ||= y",
            options: ["never"]
        },
        {
            code: "x ??= y",
            options: ["never"]
        }
    ],

    invalid: [{
        code: "x = x + y",
        output: "x += y",
        errors: [{ messageId: "replaced", type: "AssignmentExpression", data: { operator: "+=" } }]
    }, {
        code: "x = x - y",
        output: "x -= y",
        errors: [{ messageId: "replaced", type: "AssignmentExpression", data: { operator: "-=" } }]
    }, {
        code: "x = x * y",
        output: "x *= y",
        errors: [{ messageId: "replaced", type: "AssignmentExpression", data: { operator: "*=" } }]
    }, {
        code: "x = y * x",
        output: null, // not fixed (possible change in behavior if y and x have valueOf() functions)
        errors: [{ messageId: "replaced", type: "AssignmentExpression", data: { operator: "*=" } }]
    }, {
        code: "x = (y * z) * x",
        output: null, // not fixed (possible change in behavior if y/z and x have valueOf() functions)
        errors: [{ messageId: "replaced", type: "AssignmentExpression", data: { operator: "*=" } }]
    }, {
        code: "x = x / y",
        output: "x /= y",
        errors: [{ messageId: "replaced", type: "AssignmentExpression", data: { operator: "/=" } }]
    }, {
        code: "x = x % y",
        output: "x %= y",
        errors: [{ messageId: "replaced", type: "AssignmentExpression", data: { operator: "%=" } }]
    }, {
        code: "x = x << y",
        output: "x <<= y",
        errors: [{ messageId: "replaced", type: "AssignmentExpression", data: { operator: "<<=" } }]
    }, {
        code: "x = x >> y",
        output: "x >>= y",
        errors: [{ messageId: "replaced", type: "AssignmentExpression", data: { operator: ">>=" } }]
    }, {
        code: "x = x >>> y",
        output: "x >>>= y",
        errors: [{ messageId: "replaced", type: "AssignmentExpression", data: { operator: ">>>=" } }]
    }, {
        code: "x = x & y",
        output: "x &= y",
        errors: [{ messageId: "replaced", type: "AssignmentExpression", data: { operator: "&=" } }]
    }, {
        code: "x = x ^ y",
        output: "x ^= y",
        errors: [{ messageId: "replaced", type: "AssignmentExpression", data: { operator: "^=" } }]
    }, {
        code: "x = x | y",
        output: "x |= y",
        errors: [{ messageId: "replaced", type: "AssignmentExpression", data: { operator: "|=" } }]
    }, {
        code: "x[0] = x[0] - y",
        output: "x[0] -= y",
        errors: [{ messageId: "replaced", type: "AssignmentExpression", data: { operator: "-=" } }]
    }, {
        code: "x.y[z['a']][0].b = x.y[z['a']][0].b * 2",
        output: null, // not fixed; might activate getters more than before
        errors: [{ messageId: "replaced", type: "AssignmentExpression", data: { operator: "*=" } }]
    }, {
        code: "x = x + y",
        output: "x += y",
        options: ["always"],
        errors: [{ messageId: "replaced", type: "AssignmentExpression", data: { operator: "+=" } }]
    }, {
        code: "x = (x + y)",
        output: "x += y",
        options: ["always"],
        errors: [{ messageId: "replaced", type: "AssignmentExpression", data: { operator: "+=" } }]
    }, {
        code: "x = x + (y)",
        output: "x += (y)",
        options: ["always"],
        errors: [{ messageId: "replaced", type: "AssignmentExpression", data: { operator: "+=" } }]
    }, {
        code: "x += (y)",
        output: "x = x + (y)",
        options: ["never"],
        errors: [{ messageId: "unexpected", type: "AssignmentExpression", data: { operator: "+=" } }]
    }, {
        code: "x += y",
        output: "x = x + y",
        options: ["never"],
        errors: [{ messageId: "unexpected", type: "AssignmentExpression", data: { operator: "+=" } }]
    }, {
        code: "foo.bar = foo.bar + baz",
        output: "foo.bar += baz",
        errors: [{ messageId: "replaced", type: "AssignmentExpression", data: { operator: "+=" } }]
    }, {
        code: "foo.bar += baz",
        output: "foo.bar = foo.bar + baz",
        options: ["never"],
        errors: [{ messageId: "unexpected", type: "AssignmentExpression", data: { operator: "+=" } }]
    }, {
        code: "this.foo = this.foo + bar",
        output: "this.foo += bar",
        errors: [{ messageId: "replaced", type: "AssignmentExpression", data: { operator: "+=" } }]
    }, {
        code: "this.foo += bar",
        output: "this.foo = this.foo + bar",
        options: ["never"],
        errors: [{ messageId: "unexpected", type: "AssignmentExpression", data: { operator: "+=" } }]
    }, {
        code: "foo.bar.baz = foo.bar.baz + qux",
        output: null, // not fixed; fixing would cause a foo.bar getter to activate once rather than twice
        errors: [{ messageId: "replaced", type: "AssignmentExpression", data: { operator: "+=" } }]
    }, {
        code: "foo.bar.baz += qux",
        output: null, // not fixed; fixing would cause a foo.bar getter to activate twice rather than once
        options: ["never"],
        errors: [{ messageId: "unexpected", type: "AssignmentExpression", data: { operator: "+=" } }]
    }, {
        code: "this.foo.bar = this.foo.bar + baz",
        output: null, // not fixed; fixing would cause a this.foo getter to activate once rather than twice
        errors: [{ messageId: "replaced", type: "AssignmentExpression", data: { operator: "+=" } }]
    }, {
        code: "this.foo.bar += baz",
        output: null, // not fixed; fixing would cause a this.foo getter to activate twice rather than once
        options: ["never"],
        errors: [{ messageId: "unexpected", type: "AssignmentExpression", data: { operator: "+=" } }]
    }, {
        code: "foo[bar] = foo[bar] + baz",
        output: null, // not fixed; fixing would cause bar.toString() to get called once instead of twice
        errors: [{ messageId: "replaced", type: "AssignmentExpression", data: { operator: "+=" } }]
    }, {
        code: "this[foo] = this[foo] + bar",
        output: null, // not fixed; fixing would cause foo.toString() to get called once instead of twice
        errors: [{ messageId: "replaced", type: "AssignmentExpression", data: { operator: "+=" } }]
    }, {
        code: "foo[bar] >>>= baz",
        output: null, // not fixed; fixing would cause bar.toString() to get called twice instead of once
        options: ["never"],
        errors: [{ messageId: "unexpected", type: "AssignmentExpression", data: { operator: ">>>=" } }]
    }, {
        code: "this[foo] >>>= bar",
        output: null, // not fixed; fixing would cause foo.toString() to get called twice instead of once
        options: ["never"],
        errors: [{ messageId: "unexpected", type: "AssignmentExpression", data: { operator: ">>>=" } }]
    }, {
        code: "foo[5] = foo[5] / baz",
        output: "foo[5] /= baz", // this is ok because 5 is a literal, so toString won't get called
        errors: [{ messageId: "replaced", type: "AssignmentExpression", data: { operator: "/=" } }]
    }, {
        code: "this[5] = this[5] / foo",
        output: "this[5] /= foo", // this is ok because 5 is a literal, so toString won't get called
        errors: [{ messageId: "replaced", type: "AssignmentExpression", data: { operator: "/=" } }]
    }, {
        code: "/*1*/x/*2*/./*3*/y/*4*/= x.y +/*5*/z/*6*/./*7*/w/*8*/;",
        output: "/*1*/x/*2*/./*3*/y/*4*/+=/*5*/z/*6*/./*7*/w/*8*/;", // these comments are preserved
        options: ["always"],
        errors: [{ messageId: "replaced", type: "AssignmentExpression", data: { operator: "+=" } }]
    }, {
        code: "x // 1\n . // 2\n y // 3\n = x.y + //4\n z //5\n . //6\n w;",
        output: "x // 1\n . // 2\n y // 3\n += //4\n z //5\n . //6\n w;", // these comments are preserved
        options: ["always"],
        errors: [{ messageId: "replaced", type: "AssignmentExpression", data: { operator: "+=" } }]
    }, {
        code: "x = /*1*/ x + y",
        output: null, // not fixed; fixing would remove this comment
        options: ["always"],
        errors: [{ messageId: "replaced", type: "AssignmentExpression", data: { operator: "+=" } }]
    }, {
        code: "x = //1\n x + y",
        output: null, // not fixed; fixing would remove this comment
        options: ["always"],
        errors: [{ messageId: "replaced", type: "AssignmentExpression", data: { operator: "+=" } }]
    }, {
        code: "x.y = x/*1*/.y + z",
        output: null, // not fixed; fixing would remove this comment
        options: ["always"],
        errors: [{ messageId: "replaced", type: "AssignmentExpression", data: { operator: "+=" } }]
    }, {
        code: "x.y = x. //1\n y + z",
        output: null, // not fixed; fixing would remove this comment
        options: ["always"],
        errors: [{ messageId: "replaced", type: "AssignmentExpression", data: { operator: "+=" } }]
    }, {
        code: "x = x /*1*/ + y",
        output: null, // not fixed; fixing would remove this comment
        options: ["always"],
        errors: [{ messageId: "replaced", type: "AssignmentExpression", data: { operator: "+=" } }]
    }, {
        code: "x = x //1\n + y",
        output: null, // not fixed; fixing would remove this comment
        options: ["always"],
        errors: [{ messageId: "replaced", type: "AssignmentExpression", data: { operator: "+=" } }]
    }, {
        code: "/*1*/x +=/*2*/y/*3*/;",
        output: "/*1*/x = x +/*2*/y/*3*/;", // these comments are preserved and not duplicated
        options: ["never"],
        errors: [{ messageId: "unexpected", type: "AssignmentExpression", data: { operator: "+=" } }]
    }, {
        code: "x +=//1\n y",
        output: "x = x +//1\n y", // this comment is preserved and not duplicated
        options: ["never"],
        errors: [{ messageId: "unexpected", type: "AssignmentExpression", data: { operator: "+=" } }]
    }, {
        code: "(/*1*/x += y)",
        output: "(/*1*/x = x + y)", // this comment is preserved and not duplicated
        options: ["never"],
        errors: [{ messageId: "unexpected", type: "AssignmentExpression", data: { operator: "+=" } }]
    }, {
        code: "x/*1*/+=  y",
        output: null, // not fixed; fixing would duplicate this comment
        options: ["never"],
        errors: [{ messageId: "unexpected", type: "AssignmentExpression", data: { operator: "+=" } }]
    }, {
        code: "x //1\n +=  y",
        output: null, // not fixed; fixing would duplicate this comment
        options: ["never"],
        errors: [{ messageId: "unexpected", type: "AssignmentExpression", data: { operator: "+=" } }]
    }, {
        code: "(/*1*/x) +=  y",
        output: null, // not fixed; fixing would duplicate this comment
        options: ["never"],
        errors: [{ messageId: "unexpected", type: "AssignmentExpression", data: { operator: "+=" } }]
    }, {
        code: "x/*1*/.y +=  z",
        output: null, // not fixed; fixing would duplicate this comment
        options: ["never"],
        errors: [{ messageId: "unexpected", type: "AssignmentExpression", data: { operator: "+=" } }]
    }, {
        code: "x.//1\n y +=  z",
        output: null, // not fixed; fixing would duplicate this comment
        options: ["never"],
        errors: [{ messageId: "unexpected", type: "AssignmentExpression", data: { operator: "+=" } }]
    }, {
        code: "(foo.bar) ^= ((((((((((((((((baz))))))))))))))))",
        output: "(foo.bar) = (foo.bar) ^ ((((((((((((((((baz))))))))))))))))",
        options: ["never"],
        errors: [{ messageId: "unexpected", type: "AssignmentExpression", data: { operator: "^=" } }]
    }, {
        code: "foo = foo ** bar",
        output: "foo **= bar",
        errors: [{ messageId: "replaced", type: "AssignmentExpression", data: { operator: "**=" } }]
    }, {
        code: "foo **= bar",
        output: "foo = foo ** bar",
        options: ["never"],
        errors: [{ messageId: "unexpected", type: "AssignmentExpression", data: { operator: "**=" } }]
    }, {
        code: "foo *= bar + 1",
        output: "foo = foo * (bar + 1)",
        options: ["never"],
        errors: [{ messageId: "unexpected", type: "AssignmentExpression", data: { operator: "*=" } }]
    }, {
        code: "foo -= bar - baz",
        output: "foo = foo - (bar - baz)",
        options: ["never"],
        errors: [{ messageId: "unexpected", type: "AssignmentExpression", data: { operator: "-=" } }]
    }, {
        code: "foo += bar + baz",
        output: "foo = foo + (bar + baz)", // addition is not associative in JS, e.g. (1 + 2) + '3' !== 1 + (2 + '3')
        options: ["never"],
        errors: [{ messageId: "unexpected", type: "AssignmentExpression", data: { operator: "+=" } }]
    }, {
        code: "foo += bar = 1",
        output: "foo = foo + (bar = 1)",
        options: ["never"],
        errors: [{ messageId: "unexpected", type: "AssignmentExpression", data: { operator: "+=" } }]
    }, {
        code: "foo *= (bar + 1)",
        output: "foo = foo * (bar + 1)",
        options: ["never"],
        errors: [{ messageId: "unexpected", type: "AssignmentExpression", data: { operator: "*=" } }]
    }, {
        code: "foo+=-bar",
        output: "foo= foo+-bar", // tokens can be adjacent
        options: ["never"],
        errors: [{ messageId: "unexpected", type: "AssignmentExpression", data: { operator: "+=" } }]
    }, {
        code: "foo/=bar",
        output: "foo= foo/bar", // tokens can be adjacent
        options: ["never"],
        errors: [{ messageId: "unexpected", type: "AssignmentExpression", data: { operator: "/=" } }]
    }, {
        code: "foo/=/**/bar",
        output: "foo= foo/ /**/bar", // // tokens cannot be adjacent, insert a space between
        options: ["never"],
        errors: [{ messageId: "unexpected", type: "AssignmentExpression", data: { operator: "/=" } }]
    }, {
        code: "foo/=//\nbar",
        output: "foo= foo/ //\nbar", // // tokens cannot be adjacent, insert a space between
        options: ["never"],
        errors: [{ messageId: "unexpected", type: "AssignmentExpression", data: { operator: "/=" } }]
    }, {
        code: "foo/=/^bar$/",
        output: "foo= foo/ /^bar$/", // // tokens cannot be adjacent, insert a space between
        options: ["never"],
        errors: [{ messageId: "unexpected", type: "AssignmentExpression", data: { operator: "/=" } }]
    }, {
        code: "foo+=+bar",
        output: "foo= foo+ +bar", // tokens cannot be adjacent, insert a space between
        options: ["never"],
        errors: [{ messageId: "unexpected", type: "AssignmentExpression", data: { operator: "+=" } }]
    }, {
        code: "foo+= +bar",
        output: "foo= foo+ +bar", // tokens cannot be adjacent, but there is already a space between
        options: ["never"],
        errors: [{ messageId: "unexpected", type: "AssignmentExpression", data: { operator: "+=" } }]
    }, {
        code: "foo+=/**/+bar",
        output: "foo= foo+/**/+bar", // tokens cannot be adjacent, but there is a comment between
        options: ["never"],
        errors: [{ messageId: "unexpected", type: "AssignmentExpression", data: { operator: "+=" } }]
    }, {
        code: "foo+=+bar===baz",
        output: "foo= foo+(+bar===baz)", // tokens cannot be adjacent, but the right side will be parenthesised
        options: ["never"],
        errors: [{ messageId: "unexpected", type: "AssignmentExpression", data: { operator: "+=" } }]
    },

    // Optional chaining
    {
        code: "(obj?.a).b = (obj?.a).b + y",
        output: null,
        errors: [{ messageId: "replaced", type: "AssignmentExpression", data: { operator: "+=" } }]
    },
    {
        code: "obj.a = obj?.a + b",
        output: null,
        errors: [{ messageId: "replaced", type: "AssignmentExpression", data: { operator: "+=" } }]
    }

    ]

});
