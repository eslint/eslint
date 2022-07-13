/**
 * @fileoverview Tests for logical-assignment-operators.
 * @author Daniel Martens
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/logical-assignment-operators"),
    { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 2021 } });

ruleTester.run("logical-assignment-operators", rule, {
    valid: [

        // Unrelated
        "a || b",
        "a && b",
        "a ?? b",
        "a || a || b",
        "var a = a || b",
        "a === undefined ? a : b",
        "while (a) a = b",

        // Preferred
        "a ||= b",
        "a &&= b",
        "a ??= b",

        // > Operator
        "a += a || b",
        "a *= a || b",
        "a ||= a || b",
        "a &&= a || b",

        // > Right
        "a = a",
        "a = b",
        "a = a === b",
        "a = a + b",
        "a = a / b",
        "a = fn(a) || b",

        // > Reference
        "a = false || c",
        "a = f() || g()",
        "a = b || c",
        "a = b || a",
        "object.a = object.b || c",
        "[a] = a || b",
        "({ a } = a || b)",

        // Logical
        "(a = b) || a",
        "a + (a = b)",
        "a || (b ||= c)",
        "a || (b &&= c)",
        "a || b === 0",
        "a || fn()",
        "a || (b && c)",
        "a || (b ?? c)",

        // > Reference
        "a || (b = c)",
        "a || (a ||= b)",
        "fn() || (a = b)",
        "a.b || (a = b)",

        // If
        "if (a) a = b",
        {
            code: "if (a) a = b",
            options: ["always", { enforceForIfStatements: false }]
        }, {
            code: "if (a) { a = b } else {}",
            options: ["always", { enforceForIfStatements: true }]
        }, {
            code: "if (a) { a = b } else if (a) {}",
            options: ["always", { enforceForIfStatements: true }]
        },

        // > Body
        {
            code: "if (a) {}",
            options: ["always", { enforceForIfStatements: true }]
        }, {
            code: "if (a) { before; a = b }",
            options: ["always", { enforceForIfStatements: true }]
        }, {
            code: "if (a) { a = b; after }",
            options: ["always", { enforceForIfStatements: true }]
        }, {
            code: "if (a) throw new Error()",
            options: ["always", { enforceForIfStatements: true }]
        }, {
            code: "if (a) a",
            options: ["always", { enforceForIfStatements: true }]
        }, {
            code: "if (a) a ||= b",
            options: ["always", { enforceForIfStatements: true }]
        }, {
            code: "if (a) b = a",
            options: ["always", { enforceForIfStatements: true }]
        }, {
            code: "if (a) { a() }",
            options: ["always", { enforceForIfStatements: true }]
        }, {
            code: "if (a) { a += a || b }",
            options: ["always", { enforceForIfStatements: true }]
        },

        // > Test
        {
            code: "if (true) a = b",
            options: ["always", { enforceForIfStatements: true }]
        }, {
            code: "if (predicate(a)) a = b",
            options: ["always", { enforceForIfStatements: true }]
        }, {
            code: "if (a?.b) a.b = c",
            options: ["always", { enforceForIfStatements: true }]
        }, {
            code: "if (!a?.b) a.b = c",
            options: ["always", { enforceForIfStatements: true }]
        }, {
            code: "if (a === b) a = b",
            options: ["always", { enforceForIfStatements: true }]
        }, {
            code: "if (a === undefined) a = b",
            options: ["always", { enforceForIfStatements: true }]
        }, {
            code: "if (a === null) a = b",
            options: ["always", { enforceForIfStatements: true }]
        }, {
            code: "if (a != null) a = b",
            options: ["always", { enforceForIfStatements: true }]
        }, {
            code: "if (a === null && a === undefined) a = b",
            options: ["always", { enforceForIfStatements: true }]
        }, {
            code: "if (a === 0 || a === undefined) a = b",
            options: ["always", { enforceForIfStatements: true }]
        }, {
            code: "if (a === null || a === 1) a = b",
            options: ["always", { enforceForIfStatements: true }]
        }, {
            code: "if (a == null || a == undefined) a = b",
            options: ["always", { enforceForIfStatements: true }]
        }, {
            code: "if (a === null || a === !0) a = b",
            options: ["always", { enforceForIfStatements: true }]
        }, {
            code: "if (a === null || a === +0) a = b",
            options: ["always", { enforceForIfStatements: true }]
        }, {
            code: "if (a === null || a === null) a = b",
            options: ["always", { enforceForIfStatements: true }]
        }, {
            code: "if (a === undefined || a === void 0) a = b",
            options: ["always", { enforceForIfStatements: true }]
        }, {
            code: "if (a === null || a === void void 0) a = b",
            output: "a ??= b"
        }, {
            code: "if (a === null || a === void 'string') a = b",
            output: "a ??= b"
        }, {
            code: "if (a === null || a === void fn()) a = b",
            output: "a ??= b"
        },

        // > Test > Yoda
        {
            code: "if (a == a) a = b",
            options: ["always", { enforceForIfStatements: true }]
        }, {
            code: "if (a == b) a = b",
            options: ["always", { enforceForIfStatements: true }]
        }, {
            code: "if (null == null) a = b",
            options: ["always", { enforceForIfStatements: true }]
        }, {
            code: "if (undefined == undefined) undefined = b",
            options: ["always", { enforceForIfStatements: true }]
        }, {
            code: "if (null == x) a = b",
            options: ["always", { enforceForIfStatements: true }]
        }, {
            code: "if (null == fn()) a = b",
            options: ["always", { enforceForIfStatements: true }]
        }, {
            code: "if (null === a || a === 0) a = b",
            options: ["always", { enforceForIfStatements: true }]
        }, {
            code: "if (0 === a || null === a) a = b",
            options: ["always", { enforceForIfStatements: true }]
        }, {
            code: "if (1 === a || a === undefined) a = b",
            options: ["always", { enforceForIfStatements: true }]
        }, {
            code: "if (undefined === a || 1 === a) a = b",
            options: ["always", { enforceForIfStatements: true }]
        }, {
            code: "if (a === null || a === b) a = b",
            options: ["always", { enforceForIfStatements: true }]
        }, {
            code: "if (b === undefined || a === null) a = b",
            options: ["always", { enforceForIfStatements: true }]
        }, {
            code: "if (null === a || b === a) a = b",
            options: ["always", { enforceForIfStatements: true }]
        }, {
            code: "if (null === null || undefined === undefined) a = b",
            options: ["always", { enforceForIfStatements: true }]
        }, {
            code: "if (null === null || a === a) a = b",
            options: ["always", { enforceForIfStatements: true }]
        }, {
            code: "if (undefined === undefined || a === a) a = b",
            options: ["always", { enforceForIfStatements: true }]
        }, {
            code: "if (null === undefined || a === a) a = b",
            options: ["always", { enforceForIfStatements: true }]
        },

        // > Test > Undefined
        {
            code: [
                "{",
                "   const undefined = 0;",
                "   if (a == undefined) a = b",
                "}"
            ].join("\n"),
            options: ["always", { enforceForIfStatements: true }]
        }, {
            code: [
                "(() => {",
                "   const undefined = 0;",
                "   if (condition) {",
                "       if (a == undefined) a = b",
                "   }",
                "})()"
            ].join("\n"),
            options: ["always", { enforceForIfStatements: true }]
        }, {
            code: [
                "{",
                "   if (a == undefined) a = b",
                "}",
                "var undefined = 0;"
            ].join("\n"),
            options: ["always", { enforceForIfStatements: true }]
        }, {
            code: [
                "{",
                "   const undefined = 0;",
                "   if (undefined == null) undefined = b",
                "}"
            ].join("\n"),
            options: ["always", { enforceForIfStatements: true }]
        }, {
            code: [
                "{",
                "   const undefined = 0;",
                "   if (a === undefined || a === null) a = b",
                "}"
            ].join("\n"),
            options: ["always", { enforceForIfStatements: true }]
        }, {
            code: [
                "{",
                "   const undefined = 0;",
                "   if (undefined === a || null === a) a = b",
                "}"
            ].join("\n"),
            options: ["always", { enforceForIfStatements: true }]
        },

        // > Reference
        {
            code: "if (a) b = c",
            options: ["always", { enforceForIfStatements: true }]
        }, {
            code: "if (!a) b = c",
            options: ["always", { enforceForIfStatements: true }]
        }, {
            code: "if (!!a) b = c",
            options: ["always", { enforceForIfStatements: true }]
        }, {
            code: "if (a == null) b = c",
            options: ["always", { enforceForIfStatements: true }]
        }, {
            code: "if (a === null || a === undefined) b = c",
            options: ["always", { enforceForIfStatements: true }]
        }, {
            code: "if (a === null || b === undefined) a = b",
            options: ["always", { enforceForIfStatements: true }]
        }, {
            code: "if (a === null || b === undefined) b = c",
            options: ["always", { enforceForIfStatements: true }]
        }, {
            code: "if (Boolean(a)) b = c",
            options: ["always", { enforceForIfStatements: true }]
        },

        // Never
        {
            code: "a = a || b",
            options: ["never"]
        }, {
            code: "a = a && b",
            options: ["never"]
        }, {
            code: "a = a ?? b",
            options: ["never"]
        }, {
            code: "a = b",
            options: ["never"]
        }, {
            code: "a += b",
            options: ["never"]
        }, {
            code: "a -= b",
            options: ["never"]
        }, {
            code: "a.b = a.b || c",
            options: ["never"]
        }
    ],
    invalid: [

        // Assignment
        {
            code: "a = a || b",
            output: "a ||= b",
            errors: [{ messageId: "assignment", type: "AssignmentExpression", data: { operator: "||" }, suggestions: [] }]
        }, {
            code: "a = a && b",
            output: "a &&= b",
            errors: [{ messageId: "assignment", type: "AssignmentExpression", data: { operator: "&&" }, suggestions: [] }]
        }, {
            code: "a = a ?? b",
            output: "a ??= b",
            errors: [{ messageId: "assignment", type: "AssignmentExpression", data: { operator: "??" }, suggestions: [] }]
        }, {
            code: "foo = foo || bar",
            output: "foo ||= bar",
            errors: [{ messageId: "assignment", type: "AssignmentExpression", data: { operator: "||" }, suggestions: [] }]
        },

        // > Right
        {
            code: "a = a || fn()",
            output: "a ||= fn()",
            errors: [{ messageId: "assignment", type: "AssignmentExpression", data: { operator: "||" }, suggestions: [] }]
        }, {
            code: "a = a || b && c",
            output: "a ||= b && c",
            errors: [{ messageId: "assignment", type: "AssignmentExpression", data: { operator: "||" }, suggestions: [] }]
        }, {
            code: "a = a || (b || c)",
            output: "a ||= b || c",
            errors: [{ messageId: "assignment", type: "AssignmentExpression", data: { operator: "||" }, suggestions: [] }]
        }, {
            code: "a = a || (b ? c : d)",
            output: "a ||= b ? c : d",
            errors: [{ messageId: "assignment", type: "AssignmentExpression", data: { operator: "||" }, suggestions: [] }]
        },

        // > Comments
        {
            code: "/* before */ a = a || b",
            output: "/* before */ a ||= b",
            errors: [{ messageId: "assignment", type: "AssignmentExpression", data: { operator: "||" }, suggestions: [] }]
        }, {
            code: "a = a || b // after",
            output: "a ||= b // after",
            errors: [{ messageId: "assignment", type: "AssignmentExpression", data: { operator: "||" }, suggestions: [] }]
        }, {
            code: "a /* between */ = a || b",
            output: null,
            errors: [{ messageId: "assignment", type: "AssignmentExpression", data: { operator: "||" }, suggestions: [] }]
        }, {
            code: "a = a || /* between */ b",
            output: null,
            errors: [{ messageId: "assignment", type: "AssignmentExpression", data: { operator: "||" }, suggestions: [] }]
        },

        // > Parenthesis
        {
            code: "(a) = a || b",
            output: "(a) ||= b",
            errors: [{ messageId: "assignment", type: "AssignmentExpression", data: { operator: "||" }, suggestions: [] }]
        }, {
            code: "a = (a) || b",
            output: "a ||= b",
            errors: [{ messageId: "assignment", type: "AssignmentExpression", data: { operator: "||" }, suggestions: [] }]
        }, {
            code: "a = a || (b)",
            output: "a ||= b",
            errors: [{ messageId: "assignment", type: "AssignmentExpression", data: { operator: "||" }, suggestions: [] }]
        }, {
            code: "(a = a || b)",
            output: "(a ||= b)",
            errors: [{ messageId: "assignment", type: "AssignmentExpression", data: { operator: "||" }, suggestions: [] }]
        },

        // > Suggestions
        {
            code: "a.b = a.b ?? c",
            output: null,
            errors: [{
                messageId: "assignment",
                type: "AssignmentExpression",
                data: { operator: "??" },
                suggestions: [{
                    messageId: "useLogicalOperator",
                    output: "a.b ??= c"
                }]
            }]
        }, {
            code: "a.b.c = a.b.c ?? d",
            output: null,
            errors: [{
                messageId: "assignment",
                type: "AssignmentExpression",
                data: { operator: "??" },
                suggestions: [{
                    messageId: "useLogicalOperator",
                    output: "a.b.c ??= d"
                }]
            }]
        }, {
            code: "a[b] = a[b] ?? c",
            output: null,
            errors: [{
                messageId: "assignment",
                type: "AssignmentExpression",
                data: { operator: "??" },
                suggestions: [{
                    messageId: "useLogicalOperator",
                    output: "a[b] ??= c"
                }]
            }]
        }, {
            code: "this.prop = this.prop ?? {}",
            output: null,
            errors: [{
                messageId: "assignment",
                type: "AssignmentExpression",
                data: { operator: "??" },
                suggestions: [{
                    messageId: "useLogicalOperator",
                    output: "this.prop ??= {}"
                }]
            }]
        },

        // > With
        {
            code: "with (object) a = a || b",
            output: null,
            errors: [{
                messageId: "assignment",
                type: "AssignmentExpression",
                data: { operator: "||" },
                suggestions: [{
                    messageId: "useLogicalOperator",
                    output: "with (object) a ||= b"
                }]
            }]
        }, {
            code: "with (object) { a = a || b }",
            output: null,
            errors: [{
                messageId: "assignment",
                type: "AssignmentExpression",
                data: { operator: "||" },
                suggestions: [{
                    messageId: "useLogicalOperator",
                    output: "with (object) { a ||= b }"
                }]
            }]
        }, {
            code: "with (object) { if (condition) a = a || b }",
            output: null,
            errors: [{
                messageId: "assignment",
                type: "AssignmentExpression",
                data: { operator: "||" },
                suggestions: [{
                    messageId: "useLogicalOperator",
                    output: "with (object) { if (condition) a ||= b }"
                }]
            }]
        }, {
            code: "with (a = a || b) {}",
            output: "with (a ||= b) {}",
            errors: [{ messageId: "assignment", type: "AssignmentExpression", data: { operator: "||" }, suggestions: [] }]
        }, {
            code: "with (object) {} a = a || b",
            output: "with (object) {} a ||= b",
            errors: [{ messageId: "assignment", type: "AssignmentExpression", data: { operator: "||" }, suggestions: [] }]
        }, {
            code: "a = a || b; with (object) {}",
            output: "a ||= b; with (object) {}",
            errors: [{ messageId: "assignment", type: "AssignmentExpression", data: { operator: "||" }, suggestions: [] }]
        }, {
            code: "if (condition) a = a || b",
            output: "if (condition) a ||= b",
            errors: [{ messageId: "assignment", type: "AssignmentExpression", data: { operator: "||" }, suggestions: [] }]
        }, {
            code: [
                "with (object) {",
                '  "use strict";',
                "   a = a || b",
                "}"
            ].join("\n"),
            output: null,
            errors: [{
                messageId: "assignment",
                type: "AssignmentExpression",
                data: { operator: "||" },
                suggestions: [{
                    messageId: "useLogicalOperator",
                    output: [
                        "with (object) {",
                        '  "use strict";',
                        "   a ||= b",
                        "}"
                    ].join("\n")
                }]
            }]
        },

        // > Context
        {
            code: "fn(a = a || b)",
            output: "fn(a ||= b)",
            errors: [{ messageId: "assignment", type: "AssignmentExpression", data: { operator: "||" }, suggestions: [] }]
        }, {
            code: "fn((a = a || b))",
            output: "fn((a ||= b))",
            errors: [{ messageId: "assignment", type: "AssignmentExpression", data: { operator: "||" }, suggestions: [] }]
        }, {
            code: "(a = a || b) ? c : d",
            output: "(a ||= b) ? c : d",
            errors: [{ messageId: "assignment", type: "AssignmentExpression", data: { operator: "||" }, suggestions: [] }]
        }, {
            code: "a = b = b || c",
            output: "a = b ||= c",
            errors: [{ messageId: "assignment", type: "AssignmentExpression", data: { operator: "||" }, suggestions: [] }]
        },

        // Logical
        {
            code: "a || (a = b)",
            output: "a ||= b",
            errors: [{ messageId: "logical", type: "LogicalExpression", data: { operator: "||" } }]
        }, {
            code: "a && (a = b)",
            output: "a &&= b",
            errors: [{ messageId: "logical", type: "LogicalExpression", data: { operator: "&&" } }]
        }, {
            code: "a ?? (a = b)",
            output: "a ??= b",
            errors: [{ messageId: "logical", type: "LogicalExpression", data: { operator: "??" } }]
        }, {
            code: "foo ?? (foo = bar)",
            output: "foo ??= bar",
            errors: [{ messageId: "logical", type: "LogicalExpression", data: { operator: "??" } }]
        },

        // > Right
        {
            code: "a || (a = 0)",
            output: "a ||= 0",
            errors: [{ messageId: "logical", type: "LogicalExpression", data: { operator: "||" } }]
        }, {
            code: "a || (a = fn())",
            output: "a ||= fn()",
            errors: [{ messageId: "logical", type: "LogicalExpression", data: { operator: "||" } }]
        }, {
            code: "a || (a = (b || c))",
            output: "a ||= (b || c)",
            errors: [{ messageId: "logical", type: "LogicalExpression", data: { operator: "||" } }]
        },

        // > Parenthesis
        {
            code: "(a) || (a = b)",
            output: "a ||= b",
            errors: [{ messageId: "logical", type: "LogicalExpression", data: { operator: "||" } }]
        }, {
            code: "a || ((a) = b)",
            output: "(a) ||= b",
            errors: [{ messageId: "logical", type: "LogicalExpression", data: { operator: "||" } }]
        }, {
            code: "a || (a = (b))",
            output: "a ||= (b)",
            errors: [{ messageId: "logical", type: "LogicalExpression", data: { operator: "||" } }]
        },

        // > Comments
        {
            code: "/* before */ a || (a = b)",
            output: "/* before */ a ||= b",
            errors: [{ messageId: "logical", type: "LogicalExpression", data: { operator: "||" } }]
        }, {
            code: "a || (a = b) // after",
            output: "a ||= b // after",
            errors: [{ messageId: "logical", type: "LogicalExpression", data: { operator: "||" } }]
        }, {
            code: "a /* between */ || (a = b)",
            output: null,
            errors: [{ messageId: "logical", type: "LogicalExpression", data: { operator: "||" } }]
        }, {
            code: "a || /* between */ (a = b)",
            output: null,
            errors: [{ messageId: "logical", type: "LogicalExpression", data: { operator: "||" } }]
        },

        // > Possible Getter
        {
            code: "a.b || (a.b = c)",
            output: "a.b ||= c",
            errors: [{ messageId: "logical", type: "LogicalExpression", data: { operator: "||" } }]
        }, {
            code: "foo.bar || (foo.bar = baz)",
            output: "foo.bar ||= baz",
            errors: [{ messageId: "logical", type: "LogicalExpression", data: { operator: "||" } }]
        }, {
            code: "with (object) a.b || (a.b = c)",
            output: "with (object) a.b ||= c",
            errors: [{ messageId: "logical", type: "LogicalExpression", data: { operator: "||" } }]
        },

        // > Context
        {
            code: "a || (a = 0) || b",
            output: "(a ||= 0) || b",
            errors: [{ messageId: "logical", type: "LogicalExpression", data: { operator: "||" } }]
        }, {
            code: "(a || (a = 0)) || b",
            output: "(a ||= 0) || b",
            errors: [{ messageId: "logical", type: "LogicalExpression", data: { operator: "||" } }]
        }, {
            code: "a || (b || (b = 0))",
            output: "a || (b ||= 0)",
            errors: [{ messageId: "logical", type: "LogicalExpression", data: { operator: "||" } }]
        }, {
            code: "a = b || (b = c)",
            output: "a = b ||= c",
            errors: [{ messageId: "logical", type: "LogicalExpression", data: { operator: "||" } }]
        }, {
            code: "a || (a = 0) ? b : c",
            output: "(a ||= 0) ? b : c",
            errors: [{ messageId: "logical", type: "LogicalExpression", data: { operator: "||" } }]
        }, {
            code: "fn(a || (a = 0))",
            output: "fn(a ||= 0)",
            errors: [{ messageId: "logical", type: "LogicalExpression", data: { operator: "||" } }]
        },

        // If
        {
            code: "if (a) a = b",
            output: "a &&= b",
            options: ["always", { enforceForIfStatements: true }],
            errors: [{ messageId: "if", type: "IfStatement" }]
        }, {
            code: "if (Boolean(a)) a = b",
            output: "a &&= b",
            options: ["always", { enforceForIfStatements: true }],
            errors: [{ messageId: "if", type: "IfStatement" }]
        }, {
            code: "if (!!a) a = b",
            output: "a &&= b",
            options: ["always", { enforceForIfStatements: true }],
            errors: [{ messageId: "if", type: "IfStatement" }]
        }, {
            code: "if (!a) a = b",
            output: "a ||= b",
            options: ["always", { enforceForIfStatements: true }],
            errors: [{ messageId: "if", type: "IfStatement" }]
        }, {
            code: "if (!Boolean(a)) a = b",
            output: "a ||= b",
            options: ["always", { enforceForIfStatements: true }],
            errors: [{ messageId: "if", type: "IfStatement" }]
        }, {
            code: "if (a == undefined) a = b",
            output: "a ??= b",
            options: ["always", { enforceForIfStatements: true }],
            errors: [{ messageId: "if", type: "IfStatement" }]
        }, {
            code: "if (a == null) a = b",
            output: "a ??= b",
            options: ["always", { enforceForIfStatements: true }],
            errors: [{ messageId: "if", type: "IfStatement" }]
        }, {
            code: "if (a === null || a === undefined) a = b",
            output: "a ??= b",
            options: ["always", { enforceForIfStatements: true }],
            errors: [{ messageId: "if", type: "IfStatement" }]
        }, {
            code: "if (a === undefined || a === null) a = b",
            output: "a ??= b",
            options: ["always", { enforceForIfStatements: true }],
            errors: [{ messageId: "if", type: "IfStatement" }]
        }, {
            code: "if (a === null || a === void 0) a = b",
            output: "a ??= b",
            options: ["always", { enforceForIfStatements: true }],
            errors: [{ messageId: "if", type: "IfStatement" }]
        }, {
            code: "if (a === void 0 || a === null) a = b",
            output: "a ??= b",
            options: ["always", { enforceForIfStatements: true }],
            errors: [{ messageId: "if", type: "IfStatement" }]
        }, {
            code: "if (a) { a = b; }",
            output: "a &&= b;",
            options: ["always", { enforceForIfStatements: true }],
            errors: [{ messageId: "if", type: "IfStatement" }]
        }, {
            code: [
                "{ const undefined = 0; }",
                "if (a == undefined) a = b"
            ].join("\n"),
            output: [
                "{ const undefined = 0; }",
                "a ??= b"
            ].join("\n"),
            options: ["always", { enforceForIfStatements: true }],
            errors: [{ messageId: "if", type: "IfStatement" }]
        }, {
            code: [
                "if (a == undefined) a = b",
                "{ const undefined = 0; }"
            ].join("\n"),
            output: [
                "a ??= b",
                "{ const undefined = 0; }"
            ].join("\n"),
            options: ["always", { enforceForIfStatements: true }],
            errors: [{ messageId: "if", type: "IfStatement" }]
        },

        // > Yoda
        {
            code: "if (null == a) a = b",
            output: "a ??= b",
            options: ["always", { enforceForIfStatements: true }],
            errors: [{ messageId: "if", type: "IfStatement" }]
        }, {
            code: "if (undefined == a) a = b",
            output: "a ??= b",
            options: ["always", { enforceForIfStatements: true }],
            errors: [{ messageId: "if", type: "IfStatement" }]
        }, {
            code: "if (undefined === a || a === null) a = b",
            output: "a ??= b",
            options: ["always", { enforceForIfStatements: true }],
            errors: [{ messageId: "if", type: "IfStatement" }]
        }, {
            code: "if (a === undefined || null === a) a = b",
            output: "a ??= b",
            options: ["always", { enforceForIfStatements: true }],
            errors: [{ messageId: "if", type: "IfStatement" }]
        }, {
            code: "if (undefined === a || null === a) a = b",
            output: "a ??= b",
            options: ["always", { enforceForIfStatements: true }],
            errors: [{ messageId: "if", type: "IfStatement" }]
        }, {
            code: "if (null === a || a === undefined) a = b",
            output: "a ??= b",
            options: ["always", { enforceForIfStatements: true }],
            errors: [{ messageId: "if", type: "IfStatement" }]
        }, {
            code: "if (a === null || undefined === a) a = b",
            output: "a ??= b",
            options: ["always", { enforceForIfStatements: true }],
            errors: [{ messageId: "if", type: "IfStatement" }]
        }, {
            code: "if (null === a || undefined === a) a = b",
            output: "a ??= b",
            options: ["always", { enforceForIfStatements: true }],
            errors: [{ messageId: "if", type: "IfStatement" }]
        },

        // > Parenthesis
        {
            code: "if ((a)) a = b",
            output: "a &&= b",
            options: ["always", { enforceForIfStatements: true }],
            errors: [{ messageId: "if", type: "IfStatement" }]
        }, {
            code: "if (a) (a) = b",
            output: "(a) &&= b",
            options: ["always", { enforceForIfStatements: true }],
            errors: [{ messageId: "if", type: "IfStatement" }]
        }, {
            code: "if (a) a = (b)",
            output: "a &&= (b)",
            options: ["always", { enforceForIfStatements: true }],
            errors: [{ messageId: "if", type: "IfStatement" }]
        }, {
            code: "if (a) (a = b)",
            output: "(a &&= b)",
            options: ["always", { enforceForIfStatements: true }],
            errors: [{ messageId: "if", type: "IfStatement" }]
        },

        // > Removing Parenthesis
        {
            code: ";if (a) (a) = b",
            output: ";(a) &&= b",
            options: ["always", { enforceForIfStatements: true }],
            errors: [{ messageId: "if", type: "IfStatement" }]
        }, {
            code: "fn();if (a) (a) = b",
            output: "fn();(a) &&= b",
            options: ["always", { enforceForIfStatements: true }],
            errors: [{ messageId: "if", type: "IfStatement" }]
        }, {
            code: "id\nif (a) (a) = b",
            output: "id\na &&= b",
            options: ["always", { enforceForIfStatements: true }],
            errors: [{ messageId: "if", type: "IfStatement" }]
        }, {
            code: "fn()\nif (a) (a) = b",
            output: "fn()\na &&= b",
            options: ["always", { enforceForIfStatements: true }],
            errors: [{ messageId: "if", type: "IfStatement" }]
        }, {
            code: "fn()\nif (a) ((a)) = b",
            output: "fn()\na &&= b",
            options: ["always", { enforceForIfStatements: true }],
            errors: [{ messageId: "if", type: "IfStatement" }]
        }, {
            code: "fn()\nif (a) ( a ) = b",
            output: "fn()\n a  &&= b",
            options: ["always", { enforceForIfStatements: true }],
            errors: [{ messageId: "if", type: "IfStatement" }]
        }, {
            code: "fn()\nif (a) (a)= b",
            output: "fn()\na&&= b",
            options: ["always", { enforceForIfStatements: true }],
            errors: [{ messageId: "if", type: "IfStatement" }]
        }, {
            code: "fn()\nif (a) (a)\n= b",
            output: "fn()\na\n&&= b",
            options: ["always", { enforceForIfStatements: true }],
            errors: [{ messageId: "if", type: "IfStatement" }]
        },

        // > Adding semicolon
        {
            code: "if (a) a = b; fn();",
            output: "a &&= b; fn();",
            options: ["always", { enforceForIfStatements: true }],
            errors: [{ messageId: "if", type: "IfStatement" }]
        }, {
            code: "if (a) { a = b }",
            output: "a &&= b;",
            options: ["always", { enforceForIfStatements: true }],
            errors: [{ messageId: "if", type: "IfStatement" }]
        }, {
            code: "if (a) { a = b; }\nfn();",
            output: "a &&= b;\nfn();",
            options: ["always", { enforceForIfStatements: true }],
            errors: [{ messageId: "if", type: "IfStatement" }]
        }, {
            code: "if (a) { a = b }\nfn();",
            output: "a &&= b;\nfn();",
            options: ["always", { enforceForIfStatements: true }],
            errors: [{ messageId: "if", type: "IfStatement" }]
        }, {
            code: "if (a) { a = b } fn();",
            output: "a &&= b; fn();",
            options: ["always", { enforceForIfStatements: true }],
            errors: [{ messageId: "if", type: "IfStatement" }]
        }, {
            code: "if (a) { a = b\n} fn();",
            output: "a &&= b; fn();",
            options: ["always", { enforceForIfStatements: true }],
            errors: [{ messageId: "if", type: "IfStatement" }]
        },

        // > Spacing
        {
            code: "if (a) a  =  b",
            output: "a  &&=  b",
            options: ["always", { enforceForIfStatements: true }],
            errors: [{ messageId: "if", type: "IfStatement" }]
        }, {
            code: "if (a)\n a = b",
            output: "a &&= b",
            options: ["always", { enforceForIfStatements: true }],
            errors: [{ messageId: "if", type: "IfStatement" }]
        }, {
            code: "if (a) {\n a = b; \n}",
            output: "a &&= b;",
            options: ["always", { enforceForIfStatements: true }],
            errors: [{ messageId: "if", type: "IfStatement" }]
        },

        // > Comments
        {
            code: "/* before */ if (a) a = b",
            output: "/* before */ a &&= b",
            options: ["always", { enforceForIfStatements: true }],
            errors: [{ messageId: "if", type: "IfStatement" }]
        }, {
            code: "if (a) a = b /* after */",
            output: "a &&= b /* after */",
            options: ["always", { enforceForIfStatements: true }],
            errors: [{ messageId: "if", type: "IfStatement" }]
        }, {
            code: "if (a) /* between */ a = b",
            output: null,
            options: ["always", { enforceForIfStatements: true }],
            errors: [{ messageId: "if", type: "IfStatement" }]
        }, {
            code: "if (a) a = /* between */ b",
            output: null,
            options: ["always", { enforceForIfStatements: true }],
            errors: [{ messageId: "if", type: "IfStatement" }]
        },

        // > Suggestions
        {
            code: "if (a.b) a.b = b",
            output: null,
            options: ["always", { enforceForIfStatements: true }],
            errors: [{
                messageId: "if",
                type: "IfStatement",
                suggestions: [{
                    messageId: "convertIf",
                    output: "a.b &&= b"
                }]
            }]
        }, {
            code: "if (a[b].c) a[b].c = d",
            output: null,
            options: ["always", { enforceForIfStatements: true }],
            errors: [{
                messageId: "if",
                type: "IfStatement",
                suggestions: [{
                    messageId: "convertIf",
                    output: "a[b].c &&= d"
                }]
            }]
        }, {
            code: "with (object) if (a.b) a.b = b",
            output: null,
            options: ["always", { enforceForIfStatements: true }],
            errors: [{
                messageId: "if",
                type: "IfStatement",
                suggestions: [{
                    messageId: "convertIf",
                    output: "with (object) a.b &&= b"
                }]
            }]
        },

        // Never
        {
            code: "a ||= b",
            output: "a = a || b",
            options: ["never"],
            errors: [{ messageId: "unexpected", type: "AssignmentExpression", data: { operator: "||=" } }]
        }, {
            code: "a &&= b",
            output: "a = a && b",
            options: ["never"],
            errors: [{ messageId: "unexpected", type: "AssignmentExpression", data: { operator: "&&=" } }]
        }, {
            code: "a ??= b",
            output: "a = a ?? b",
            options: ["never"],
            errors: [{ messageId: "unexpected", type: "AssignmentExpression", data: { operator: "??=" } }]
        }, {
            code: "foo ||= bar",
            output: "foo = foo || bar",
            options: ["never"],
            errors: [{ messageId: "unexpected", type: "AssignmentExpression", data: { operator: "||=" } }]
        },

        // > Suggestions
        {
            code: "a.b ||= c",
            output: null,
            options: ["never"],
            errors: [{
                messageId: "unexpected",
                type: "AssignmentExpression",
                data: { operator: "||=" },
                suggestions: [{
                    messageId: "separate",
                    output: "a.b = a.b || c"
                }]
            }]
        }, {
            code: "a[b] ||= c",
            output: null,
            options: ["never"],
            errors: [{
                messageId: "unexpected",
                type: "AssignmentExpression",
                data: { operator: "||=" },
                suggestions: [{
                    messageId: "separate",
                    output: "a[b] = a[b] || c"
                }]
            }]
        }, {
            code: "this.prop ||= 0",
            output: null,
            options: ["never"],
            errors: [{
                messageId: "unexpected",
                type: "AssignmentExpression",
                data: { operator: "||=" },
                suggestions: [{
                    messageId: "separate",
                    output: "this.prop = this.prop || 0"
                }]
            }]
        }, {
            code: "with (object) a ||= b",
            output: null,
            options: ["never"],
            errors: [{
                messageId: "unexpected",
                type: "AssignmentExpression",
                data: { operator: "||=" },
                suggestions: [{
                    messageId: "separate",
                    output: "with (object) a = a || b"
                }]
            }]
        },

        // > Parenthesis
        {
            code: "(a) ||= b",
            output: "(a) = a || b",
            options: ["never"],
            errors: [{ messageId: "unexpected", type: "AssignmentExpression", data: { operator: "||=" } }]
        }, {
            code: "a ||= (b)",
            output: "a = a || (b)",
            options: ["never"],
            errors: [{ messageId: "unexpected", type: "AssignmentExpression", data: { operator: "||=" } }]
        }, {
            code: "(a ||= b)",
            output: "(a = a || b)",
            options: ["never"],
            errors: [{ messageId: "unexpected", type: "AssignmentExpression", data: { operator: "||=" } }]
        },

        // > Comments
        {
            code: "/* before */ a ||= b",
            output: "/* before */ a = a || b",
            options: ["never"],
            errors: [{ messageId: "unexpected", type: "AssignmentExpression", data: { operator: "||=" } }]
        }, {
            code: "a ||= b // after",
            output: "a = a || b // after",
            options: ["never"],
            errors: [{ messageId: "unexpected", type: "AssignmentExpression", data: { operator: "||=" } }]
        }, {
            code: "a /* before */ ||= b",
            output: null,
            options: ["never"],
            errors: [{ messageId: "unexpected", type: "AssignmentExpression", data: { operator: "||=" } }]
        }, {
            code: "a ||= /* after */ b",
            output: null,
            options: ["never"],
            errors: [{ messageId: "unexpected", type: "AssignmentExpression", data: { operator: "||=" } }]
        },

        // > Precedence
        {
            code: "a ||= b && c",
            output: "a = a || b && c",
            options: ["never"],
            errors: [{ messageId: "unexpected", type: "AssignmentExpression", data: { operator: "||=" } }]
        }, {
            code: "a &&= b || c",
            output: "a = a && (b || c)",
            options: ["never"],
            errors: [{ messageId: "unexpected", type: "AssignmentExpression", data: { operator: "&&=" } }]
        }, {
            code: "a ||= b || c",
            output: "a = a || (b || c)",
            options: ["never"],
            errors: [{ messageId: "unexpected", type: "AssignmentExpression", data: { operator: "||=" } }]
        }, {
            code: "a &&= b && c",
            output: "a = a && (b && c)",
            options: ["never"],
            errors: [{ messageId: "unexpected", type: "AssignmentExpression", data: { operator: "&&=" } }]
        }]
});
