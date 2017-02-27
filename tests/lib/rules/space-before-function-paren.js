/**
 * @fileoverview Tests for space-before-function-paren.
 * @author Mathias Schreck <https://github.com/lo1tuma>
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/space-before-function-paren"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("space-before-function-paren", rule, {

    valid: [
        { code: "function foo () {}" },
        { code: "var foo = function () {}" },
        { code: "var bar = function foo () {}" },
        { code: "var obj = { get foo () {}, set foo (val) {} };" },
        {
            code: "var obj = { foo () {} };",
            parserOptions: { ecmaVersion: 6 }
        },
        { code: "function* foo () {}", parserOptions: { ecmaVersion: 6 } },
        { code: "var foo = function *() {};", parserOptions: { ecmaVersion: 6 } },

        { code: "function foo() {}", options: ["never"] },
        { code: "var foo = function() {}", options: ["never"] },
        { code: "var bar = function foo() {}", options: ["never"] },
        { code: "var obj = { get foo() {}, set foo(val) {} };", options: ["never"] },
        {
            code: "var obj = { foo() {} };",
            options: ["never"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "function* foo() {}",
            options: ["never"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var foo = function*() {};",
            options: ["never"],
            parserOptions: { ecmaVersion: 6 }
        },

        {
            code: [
                "function foo() {}",
                "var bar = function () {}",
                "function* baz() {}",
                "var bat = function*() {};",
                "var obj = { get foo() {}, set foo(val) {}, bar() {} };"
            ].join("\n"),
            options: [{ named: "never", anonymous: "always" }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: [
                "function foo () {}",
                "var bar = function() {}",
                "function* baz () {}",
                "var bat = function* () {};",
                "var obj = { get foo () {}, set foo (val) {}, bar () {} };"
            ].join("\n"),
            options: [{ named: "always", anonymous: "never" }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "class Foo { constructor() {} *method() {} }",
            options: [{ named: "never", anonymous: "always" }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "class Foo { constructor () {} *method () {} }",
            options: [{ named: "always", anonymous: "never" }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var foo = function() {}",
            options: [{ named: "always", anonymous: "ignore" }]
        },
        {
            code: "var foo = function () {}",
            options: [{ named: "always", anonymous: "ignore" }]
        },
        {
            code: "var bar = function foo() {}",
            options: [{ named: "ignore", anonymous: "always" }]
        },
        {
            code: "var bar = function foo () {}",
            options: [{ named: "ignore", anonymous: "always" }]
        },

        // Async arrow functions
        { code: "() => 1", parserOptions: { ecmaVersion: 6 } },
        { code: "async a => a", parserOptions: { ecmaVersion: 8 } },
        { code: "async a => a", options: [{ asyncArrow: "always" }], parserOptions: { ecmaVersion: 8 } },
        { code: "async a => a", options: [{ asyncArrow: "never" }], parserOptions: { ecmaVersion: 8 } },
        { code: "async () => 1", options: [{ asyncArrow: "always" }], parserOptions: { ecmaVersion: 8 } },
        { code: "async() => 1", options: [{ asyncArrow: "never" }], parserOptions: { ecmaVersion: 8 } },
        { code: "async () => 1", options: [{ asyncArrow: "ignore" }], parserOptions: { ecmaVersion: 8 } },
        { code: "async() => 1", options: [{ asyncArrow: "ignore" }], parserOptions: { ecmaVersion: 8 } },

        // ignore by default for now.
        { code: "async () => 1", parserOptions: { ecmaVersion: 8 } },
        { code: "async() => 1", parserOptions: { ecmaVersion: 8 } },
        { code: "async () => 1", options: ["always"], parserOptions: { ecmaVersion: 8 } },
        { code: "async() => 1", options: ["always"], parserOptions: { ecmaVersion: 8 } },
        { code: "async () => 1", options: ["never"], parserOptions: { ecmaVersion: 8 } },
        { code: "async() => 1", options: ["never"], parserOptions: { ecmaVersion: 8 } }
    ],

    invalid: [
        {
            code: "function foo() {}",
            errors: [
                {
                    type: "FunctionDeclaration",
                    message: "Missing space before function parentheses.",
                    line: 1,
                    column: 13
                }
            ],
            output: "function foo () {}"
        },
        {
            code: "function foo/* */() {}",
            errors: [
                {
                    type: "FunctionDeclaration",
                    message: "Missing space before function parentheses.",
                    line: 1,
                    column: 13
                }
            ],
            output: "function foo /* */() {}"
        },
        {
            code: "var foo = function() {}",
            errors: [
                {
                    type: "FunctionExpression",
                    message: "Missing space before function parentheses.",
                    line: 1,
                    column: 19
                }
            ],
            output: "var foo = function () {}"
        },
        {
            code: "var bar = function foo() {}",
            errors: [
                {
                    type: "FunctionExpression",
                    message: "Missing space before function parentheses.",
                    line: 1,
                    column: 23
                }
            ],
            output: "var bar = function foo () {}"
        },
        {
            code: "var obj = { get foo() {}, set foo(val) {} };",
            errors: [
                {
                    type: "FunctionExpression",
                    message: "Missing space before function parentheses.",
                    line: 1,
                    column: 20
                },
                {
                    type: "FunctionExpression",
                    message: "Missing space before function parentheses.",
                    line: 1,
                    column: 34
                }
            ],
            output: "var obj = { get foo () {}, set foo (val) {} };"
        },
        {
            code: "var obj = { foo() {} };",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    type: "FunctionExpression",
                    message: "Missing space before function parentheses.",
                    line: 1,
                    column: 16
                }
            ],
            output: "var obj = { foo () {} };"
        },
        {
            code: "function* foo() {}",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    type: "FunctionDeclaration",
                    message: "Missing space before function parentheses.",
                    line: 1,
                    column: 14
                }
            ],
            output: "function* foo () {}"
        },

        {
            code: "function foo () {}",
            options: ["never"],
            errors: [
                {
                    type: "FunctionDeclaration",
                    message: "Unexpected space before function parentheses.",
                    line: 1,
                    column: 13
                }
            ],
            output: "function foo() {}"
        },
        {
            code: "var foo = function () {}",
            options: ["never"],
            errors: [
                {
                    type: "FunctionExpression",
                    message: "Unexpected space before function parentheses.",
                    line: 1,
                    column: 19
                }
            ],
            output: "var foo = function() {}"
        },
        {
            code: "var bar = function foo () {}",
            options: ["never"],
            errors: [
                {
                    type: "FunctionExpression",
                    message: "Unexpected space before function parentheses.",
                    line: 1,
                    column: 23
                }
            ],
            output: "var bar = function foo() {}"
        },
        {
            code: "var obj = { get foo () {}, set foo (val) {} };",
            options: ["never"],
            errors: [
                {
                    type: "FunctionExpression",
                    message: "Unexpected space before function parentheses.",
                    line: 1,
                    column: 20
                },
                {
                    type: "FunctionExpression",
                    message: "Unexpected space before function parentheses.",
                    line: 1,
                    column: 35
                }
            ],
            output: "var obj = { get foo() {}, set foo(val) {} };"
        },
        {
            code: "var obj = { foo () {} };",
            options: ["never"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    type: "FunctionExpression",
                    message: "Unexpected space before function parentheses.",
                    line: 1,
                    column: 16
                }
            ],
            output: "var obj = { foo() {} };"
        },
        {
            code: "function* foo () {}",
            options: ["never"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    type: "FunctionDeclaration",
                    message: "Unexpected space before function parentheses.",
                    line: 1,
                    column: 14
                }
            ],
            output: "function* foo() {}"
        },

        {
            code: [
                "function foo () {}",
                "var bar = function() {}",
                "var obj = { get foo () {}, set foo (val) {}, bar () {} };"
            ].join("\n"),
            options: [{ named: "never", anonymous: "always" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    type: "FunctionDeclaration",
                    message: "Unexpected space before function parentheses.",
                    line: 1,
                    column: 13
                },
                {
                    type: "FunctionExpression",
                    message: "Missing space before function parentheses.",
                    line: 2,
                    column: 19
                },
                {
                    type: "FunctionExpression",
                    message: "Unexpected space before function parentheses.",
                    line: 3,
                    column: 20
                },
                {
                    type: "FunctionExpression",
                    message: "Unexpected space before function parentheses.",
                    line: 3,
                    column: 35
                },
                {
                    type: "FunctionExpression",
                    message: "Unexpected space before function parentheses.",
                    line: 3,
                    column: 49
                }
            ],
            output: [
                "function foo() {}",
                "var bar = function () {}",
                "var obj = { get foo() {}, set foo(val) {}, bar() {} };"
            ].join("\n")
        },
        {
            code: "class Foo { constructor () {} *method () {} }",
            options: [{ named: "never", anonymous: "always" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    type: "FunctionExpression",
                    message: "Unexpected space before function parentheses.",
                    line: 1,
                    column: 24
                },
                {
                    type: "FunctionExpression",
                    message: "Unexpected space before function parentheses.",
                    line: 1,
                    column: 38
                }
            ],
            output: "class Foo { constructor() {} *method() {} }"
        },
        {
            code: "var foo = { bar () {} }",
            options: [{ named: "never", anonymous: "always" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    type: "FunctionExpression",
                    message: "Unexpected space before function parentheses.",
                    line: 1,
                    column: 16
                }
            ],
            output: "var foo = { bar() {} }"
        },
        {
            code: [
                "function foo() {}",
                "var bar = function () {}",
                "var obj = { get foo() {}, set foo(val) {}, bar() {} };"
            ].join("\n"),
            options: [{ named: "always", anonymous: "never" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    type: "FunctionDeclaration",
                    message: "Missing space before function parentheses.",
                    line: 1,
                    column: 13
                },
                {
                    type: "FunctionExpression",
                    message: "Unexpected space before function parentheses.",
                    line: 2,
                    column: 19
                },
                {
                    type: "FunctionExpression",
                    message: "Missing space before function parentheses.",
                    line: 3,
                    column: 20
                },
                {
                    type: "FunctionExpression",
                    message: "Missing space before function parentheses.",
                    line: 3,
                    column: 34
                },
                {
                    type: "FunctionExpression",
                    message: "Missing space before function parentheses.",
                    line: 3,
                    column: 47
                }
            ],
            output: [
                "function foo () {}",
                "var bar = function() {}",
                "var obj = { get foo () {}, set foo (val) {}, bar () {} };"
            ].join("\n")
        },
        {
            code: "var foo = function() {}",
            output: "var foo = function () {}",
            options: [{ named: "ignore", anonymous: "always" }],
            errors: [
                {
                    type: "FunctionExpression",
                    message: "Missing space before function parentheses.",
                    line: 1,
                    column: 19
                }
            ]
        },
        {
            code: "var foo = function () {}",
            output: "var foo = function() {}",
            options: [{ named: "ignore", anonymous: "never" }],
            errors: [
                {
                    type: "FunctionExpression",
                    message: "Unexpected space before function parentheses.",
                    line: 1,
                    column: 19
                }
            ]
        },
        {
            code: "var bar = function foo() {}",
            output: "var bar = function foo () {}",
            options: [{ named: "always", anonymous: "ignore" }],
            errors: [
                {
                    type: "FunctionExpression",
                    message: "Missing space before function parentheses.",
                    line: 1,
                    column: 23
                }
            ]
        },
        {
            code: "var bar = function foo () {}",
            output: "var bar = function foo() {}",
            options: [{ named: "never", anonymous: "ignore" }],
            errors: [
                {
                    type: "FunctionExpression",
                    message: "Unexpected space before function parentheses.",
                    line: 1,
                    column: 23
                }
            ]
        },

        // Async arrow functions
        {
            code: "async() => 1",
            output: "async () => 1",
            options: [{ asyncArrow: "always" }],
            parserOptions: { ecmaVersion: 8 },
            errors: ["Missing space before function parentheses."]
        },
        {
            code: "async () => 1",
            output: "async() => 1",
            options: [{ asyncArrow: "never" }],
            parserOptions: { ecmaVersion: 8 },
            errors: ["Unexpected space before function parentheses."]
        }
    ]
});
