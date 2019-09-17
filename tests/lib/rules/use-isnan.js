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

        "switch(NaN) { case foo: break; }",
        "switch(foo) { case NaN: break; }",
        {
            code: "switch(NaN) { case foo: break; }",
            options: [{}]
        },
        {
            code: "switch(foo) { case NaN: break; }",
            options: [{}]
        },
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
        }
    ]
});
