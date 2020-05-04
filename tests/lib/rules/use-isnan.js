/**
 * @fileoverview Tests for use-isnan rule.
 * @author James Allardice, Michael Paulukonis
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/use-isnan"),
    { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

const comparisonError = { messageId: "comparisonWithNaN", type: "BinaryExpression" };

ruleTester.run("use-isnan", rule, {
    valid: [
        "var x = NaN;",
        "isNaN(NaN) === true;",
        "isNaN(123) !== true;",
        "Number.isNaN(NaN) === true;",
        "Number.isNaN(123) !== true;",
        "foo(NaN + 1);",
        "foo(1 + NaN);",
        "foo(NaN - 1)",
        "foo(1 - NaN)",
        "foo(NaN * 2)",
        "foo(2 * NaN)",
        "foo(NaN / 2)",
        "foo(2 / NaN)",
        "var x; if (x = NaN) { }",

        //------------------------------------------------------------------------------
        // enforceForSwitchCase
        //------------------------------------------------------------------------------

        {
            code: "switch(NaN) { case foo: break; }",
            options: [{ enforceForSwitchCase: false }]
        },
        {
            code: "switch(foo) { case NaN: break; }",
            options: [{ enforceForSwitchCase: false }]
        },
        {
            code: "switch(NaN) { case NaN: break; }",
            options: [{ enforceForSwitchCase: false }]
        },
        {
            code: "switch(foo) { case bar: break; case NaN: break; default: break; }",
            options: [{ enforceForSwitchCase: false }]
        },
        {
            code: "switch(foo) {}",
            options: [{ enforceForSwitchCase: true }]
        },
        {
            code: "switch(foo) { case bar: NaN; }",
            options: [{ enforceForSwitchCase: true }]
        },
        {
            code: "switch(foo) { default: NaN; }",
            options: [{ enforceForSwitchCase: true }]
        },
        {
            code: "switch(Nan) {}",
            options: [{ enforceForSwitchCase: true }]
        },
        {
            code: "switch('NaN') { default: break; }",
            options: [{ enforceForSwitchCase: true }]
        },
        {
            code: "switch(foo(NaN)) {}",
            options: [{ enforceForSwitchCase: true }]
        },
        {
            code: "switch(foo.NaN) {}",
            options: [{ enforceForSwitchCase: true }]
        },
        {
            code: "switch(foo) { case Nan: break }",
            options: [{ enforceForSwitchCase: true }]
        },
        {
            code: "switch(foo) { case 'NaN': break }",
            options: [{ enforceForSwitchCase: true }]
        },
        {
            code: "switch(foo) { case foo(NaN): break }",
            options: [{ enforceForSwitchCase: true }]
        },
        {
            code: "switch(foo) { case foo.NaN: break }",
            options: [{ enforceForSwitchCase: true }]
        },
        {
            code: "switch(foo) { case bar: break; case 1: break; default: break; }",
            options: [{ enforceForSwitchCase: true }]
        },

        //------------------------------------------------------------------------------
        // enforceForIndexOf
        //------------------------------------------------------------------------------

        "foo.indexOf(NaN)",
        "foo.lastIndexOf(NaN)",
        {
            code: "foo.indexOf(NaN)",
            options: [{}]
        },
        {
            code: "foo.lastIndexOf(NaN)",
            options: [{}]
        },
        {
            code: "foo.indexOf(NaN)",
            options: [{ enforceForIndexOf: false }]
        },
        {
            code: "foo.lastIndexOf(NaN)",
            options: [{ enforceForIndexOf: false }]
        },
        {
            code: "indexOf(NaN)",
            options: [{ enforceForIndexOf: true }]
        },
        {
            code: "lastIndexOf(NaN)",
            options: [{ enforceForIndexOf: true }]
        },
        {
            code: "new foo.indexOf(NaN)",
            options: [{ enforceForIndexOf: true }]
        },
        {
            code: "foo.bar(NaN)",
            options: [{ enforceForIndexOf: true }]
        },
        {
            code: "foo.IndexOf(NaN)",
            options: [{ enforceForIndexOf: true }]
        },
        {
            code: "foo[indexOf](NaN)",
            options: [{ enforceForIndexOf: true }]
        },
        {
            code: "foo[lastIndexOf](NaN)",
            options: [{ enforceForIndexOf: true }]
        },
        {
            code: "indexOf.foo(NaN)",
            options: [{ enforceForIndexOf: true }]
        },
        {
            code: "foo.indexOf()",
            options: [{ enforceForIndexOf: true }]
        },
        {
            code: "foo.lastIndexOf()",
            options: [{ enforceForIndexOf: true }]
        },
        {
            code: "foo.indexOf(a)",
            options: [{ enforceForIndexOf: true }]
        },
        {
            code: "foo.lastIndexOf(Nan)",
            options: [{ enforceForIndexOf: true }]
        },
        {
            code: "foo.indexOf(a, NaN)",
            options: [{ enforceForIndexOf: true }]
        },
        {
            code: "foo.lastIndexOf(NaN, b)",
            options: [{ enforceForIndexOf: true }]
        },
        {
            code: "foo.indexOf(a, b)",
            options: [{ enforceForIndexOf: true }]
        },
        {
            code: "foo.lastIndexOf(NaN, NaN)",
            options: [{ enforceForIndexOf: true }]
        },
        {
            code: "foo.indexOf(...NaN)",
            options: [{ enforceForIndexOf: true }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "foo.lastIndexOf(NaN())",
            options: [{ enforceForIndexOf: true }]
        }
    ],
    invalid: [
        {
            code: "123 == NaN;",
            errors: [comparisonError]
        },
        {
            code: "123 === NaN;",
            errors: [comparisonError]
        },
        {
            code: "NaN === \"abc\";",
            errors: [comparisonError]
        },
        {
            code: "NaN == \"abc\";",
            errors: [comparisonError]
        },
        {
            code: "123 != NaN;",
            errors: [comparisonError]
        },
        {
            code: "123 !== NaN;",
            errors: [comparisonError]
        },
        {
            code: "NaN !== \"abc\";",
            errors: [comparisonError]
        },
        {
            code: "NaN != \"abc\";",
            errors: [comparisonError]
        },
        {
            code: "NaN < \"abc\";",
            errors: [comparisonError]
        },
        {
            code: "\"abc\" < NaN;",
            errors: [comparisonError]
        },
        {
            code: "NaN > \"abc\";",
            errors: [comparisonError]
        },
        {
            code: "\"abc\" > NaN;",
            errors: [comparisonError]
        },
        {
            code: "NaN <= \"abc\";",
            errors: [comparisonError]
        },
        {
            code: "\"abc\" <= NaN;",
            errors: [comparisonError]
        },
        {
            code: "NaN >= \"abc\";",
            errors: [comparisonError]
        },
        {
            code: "\"abc\" >= NaN;",
            errors: [comparisonError]
        },

        //------------------------------------------------------------------------------
        // enforceForSwitchCase
        //------------------------------------------------------------------------------

        {
            code: "switch(NaN) { case foo: break; }",
            errors: [{ messageId: "switchNaN", type: "SwitchStatement", column: 1 }]
        },
        {
            code: "switch(foo) { case NaN: break; }",
            errors: [{ messageId: "caseNaN", type: "SwitchCase", column: 15 }]
        },
        {
            code: "switch(NaN) { case foo: break; }",
            options: [{}],
            errors: [{ messageId: "switchNaN", type: "SwitchStatement", column: 1 }]
        },
        {
            code: "switch(foo) { case NaN: break; }",
            options: [{}],
            errors: [{ messageId: "caseNaN", type: "SwitchCase", column: 15 }]
        },
        {
            code: "switch(NaN) {}",
            options: [{ enforceForSwitchCase: true }],
            errors: [{ messageId: "switchNaN", type: "SwitchStatement", column: 1 }]
        },
        {
            code: "switch(NaN) { case foo: break; }",
            options: [{ enforceForSwitchCase: true }],
            errors: [{ messageId: "switchNaN", type: "SwitchStatement", column: 1 }]
        },
        {
            code: "switch(NaN) { default: break; }",
            options: [{ enforceForSwitchCase: true }],
            errors: [{ messageId: "switchNaN", type: "SwitchStatement", column: 1 }]
        },
        {
            code: "switch(NaN) { case foo: break; default: break; }",
            options: [{ enforceForSwitchCase: true }],
            errors: [{ messageId: "switchNaN", type: "SwitchStatement", column: 1 }]
        },
        {
            code: "switch(foo) { case NaN: }",
            options: [{ enforceForSwitchCase: true }],
            errors: [{ messageId: "caseNaN", type: "SwitchCase", column: 15 }]
        },
        {
            code: "switch(foo) { case NaN: break; }",
            options: [{ enforceForSwitchCase: true }],
            errors: [{ messageId: "caseNaN", type: "SwitchCase", column: 15 }]
        },
        {
            code: "switch(foo) { case (NaN): break; }",
            options: [{ enforceForSwitchCase: true }],
            errors: [{ messageId: "caseNaN", type: "SwitchCase", column: 15 }]
        },
        {
            code: "switch(foo) { case bar: break; case NaN: break; default: break; }",
            options: [{ enforceForSwitchCase: true }],
            errors: [{ messageId: "caseNaN", type: "SwitchCase", column: 32 }]
        },
        {
            code: "switch(foo) { case bar: case NaN: default: break; }",
            options: [{ enforceForSwitchCase: true }],
            errors: [{ messageId: "caseNaN", type: "SwitchCase", column: 25 }]
        },
        {
            code: "switch(foo) { case bar: break; case NaN: break; case baz: break; case NaN: break; }",
            options: [{ enforceForSwitchCase: true }],
            errors: [
                { messageId: "caseNaN", type: "SwitchCase", column: 32 },
                { messageId: "caseNaN", type: "SwitchCase", column: 66 }
            ]
        },
        {
            code: "switch(NaN) { case NaN: break; }",
            options: [{ enforceForSwitchCase: true }],
            errors: [
                { messageId: "switchNaN", type: "SwitchStatement", column: 1 },
                { messageId: "caseNaN", type: "SwitchCase", column: 15 }
            ]
        },

        //------------------------------------------------------------------------------
        // enforceForIndexOf
        //------------------------------------------------------------------------------

        {
            code: "foo.indexOf(NaN)",
            options: [{ enforceForIndexOf: true }],
            errors: [{ messageId: "indexOfNaN", type: "CallExpression", data: { methodName: "indexOf" } }]
        },
        {
            code: "foo.lastIndexOf(NaN)",
            options: [{ enforceForIndexOf: true }],
            errors: [{ messageId: "indexOfNaN", type: "CallExpression", data: { methodName: "lastIndexOf" } }]
        },
        {
            code: "foo['indexOf'](NaN)",
            options: [{ enforceForIndexOf: true }],
            errors: [{ messageId: "indexOfNaN", type: "CallExpression", data: { methodName: "indexOf" } }]
        },
        {
            code: "foo['lastIndexOf'](NaN)",
            options: [{ enforceForIndexOf: true }],
            errors: [{ messageId: "indexOfNaN", type: "CallExpression", data: { methodName: "lastIndexOf" } }]
        },
        {
            code: "foo().indexOf(NaN)",
            options: [{ enforceForIndexOf: true }],
            errors: [{ messageId: "indexOfNaN", type: "CallExpression", data: { methodName: "indexOf" } }]
        },
        {
            code: "foo.bar.lastIndexOf(NaN)",
            options: [{ enforceForIndexOf: true }],
            errors: [{ messageId: "indexOfNaN", type: "CallExpression", data: { methodName: "lastIndexOf" } }]
        }
    ]
});
