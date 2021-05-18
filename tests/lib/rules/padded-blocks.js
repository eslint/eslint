/**
 * @fileoverview Tests for padded-blocks rule.
 * @author Mathias Schreck <https://github.com/lo1tuma>
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/padded-blocks"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester(),
    ALWAYS_MESSAGE = "Block must be padded by blank lines.",
    NEVER_MESSAGE = "Block must not be padded by blank lines.";

ruleTester.run("padded-blocks", rule, {
    valid: [
        "{\n\na();\n\n}",
        "{\n\n\na();\n\n\n}",
        "{\n\n//comment\na();\n\n}",
        "{\n\na();\n//comment\n\n}",
        "{\n\na()\n//comment\n\n}",
        "{\n\na = 1\n\n}",
        "{//comment\n\na();\n\n}",
        "{ /* comment */\n\na();\n\n}",
        "{ /* comment \n */\n\na();\n\n}",
        "{ /* comment \n */ /* another comment \n */\n\na();\n\n}",
        "{ /* comment \n */ /* another comment \n */\n\na();\n\n/* comment \n */ /* another comment \n */}",

        "{\n\na();\n\n/* comment */ }",
        { code: "{\n\na();\n\n/* comment */ }", options: ["always"] },
        { code: "{\n\na();\n\n/* comment */ }", options: [{ blocks: "always" }] },

        { code: "switch (a) {}", options: [{ switches: "always" }] },
        { code: "switch (a) {\n\ncase 0: foo();\ncase 1: bar();\n\n}", options: ["always"] },
        { code: "switch (a) {\n\ncase 0: foo();\ncase 1: bar();\n\n}", options: [{ switches: "always" }] },
        { code: "switch (a) {\n\n//comment\ncase 0: foo();//comment\n\n}", options: [{ switches: "always" }] },
        { code: "switch (a) {//coment\n\ncase 0: foo();\ncase 1: bar();\n\n/* comment */}", options: [{ switches: "always" }] },

        { code: "class A{\n\nfoo(){}\n\n}", parserOptions: { ecmaVersion: 6 } },
        { code: "class A{\n\nfoo(){}\n\n}", options: ["always"], parserOptions: { ecmaVersion: 6 } },
        { code: "class A{}", options: [{ classes: "always" }], parserOptions: { ecmaVersion: 6 } },
        { code: "class A{\n\n}", options: [{ classes: "always" }], parserOptions: { ecmaVersion: 6 } },
        { code: "class A{\n\nfoo(){}\n\n}", options: [{ classes: "always" }], parserOptions: { ecmaVersion: 6 } },

        { code: "{\na();\n}", options: ["never"] },
        { code: "{\na();}", options: ["never"] },
        { code: "{a();\n}", options: ["never"] },
        { code: "{a();}", options: ["never"] },
        { code: "{a();}", options: ["always", { allowSingleLineBlocks: true }] },
        { code: "{\n\na();\n\n}", options: ["always", { allowSingleLineBlocks: true }] },
        { code: "{//comment\na();}", options: ["never"] },
        { code: "{\n//comment\na()\n}", options: ["never"] },
        { code: "{a();//comment\n}", options: ["never"] },
        { code: "{\na();\n//comment\n}", options: ["never"] },
        { code: "{\na()\n//comment\n}", options: ["never"] },
        { code: "{\na()\n//comment\nb()\n}", options: ["never"] },
        { code: "function a() {\n/* comment */\nreturn;\n/* comment*/\n}", options: ["never"] },
        { code: "{\n// comment\ndebugger;\n// comment\n}", options: ["never"] },
        { code: "{\n\n// comment\nif (\n// comment\n a) {}\n\n }", options: ["always"] },
        { code: "{\n// comment\nif (\n// comment\n a) {}\n }", options: ["never"] },
        { code: "{\n// comment\nif (\n// comment\n a) {}\n }", options: [{ blocks: "never" }] },

        { code: "switch (a) {\ncase 0: foo();\n}", options: ["never"] },
        { code: "switch (a) {\ncase 0: foo();\n}", options: [{ switches: "never" }] },


        { code: "class A{\nfoo(){}\n}", options: ["never"], parserOptions: { ecmaVersion: 6 } },
        { code: "class A{\nfoo(){}\n}", options: [{ classes: "never" }], parserOptions: { ecmaVersion: 6 } },

        // Ignore block statements if not configured
        { code: "{\na();\n}", options: [{ switches: "always" }] },
        { code: "{\n\na();\n\n}", options: [{ switches: "never" }] },

        // Ignore switch statements if not configured
        { code: "switch (a) {\ncase 0: foo();\ncase 1: bar();\n}", options: [{ blocks: "always", classes: "always" }] },
        { code: "switch (a) {\n\ncase 0: foo();\ncase 1: bar();\n\n}", options: [{ blocks: "never", classes: "never" }] },


        // Ignore class statements if not configured
        { code: "class A{\nfoo(){}\n}", options: [{ blocks: "always" }], parserOptions: { ecmaVersion: 6 } },
        { code: "class A{\n\nfoo(){}\n\n}", options: [{ blocks: "never" }], parserOptions: { ecmaVersion: 6 } }

    ],
    invalid: [
        {
            code: "{\n//comment\na();\n\n}",
            output: "{\n\n//comment\na();\n\n}",
            errors: [
                {
                    message: ALWAYS_MESSAGE,
                    line: 1,
                    column: 1
                }
            ]
        },
        {
            code: "{ //comment\na();\n\n}",
            output: "{ //comment\n\na();\n\n}",
            errors: [
                {
                    message: ALWAYS_MESSAGE,
                    line: 1,
                    column: 3
                }
            ]
        },
        {
            code: "{\n\na();\n//comment\n}",
            output: "{\n\na();\n//comment\n\n}",
            errors: [
                {
                    message: ALWAYS_MESSAGE,
                    line: 5,
                    column: 1
                }
            ]
        },
        {
            code: "{\n\na()\n//comment\n}",
            output: "{\n\na()\n//comment\n\n}",
            errors: [
                {
                    message: ALWAYS_MESSAGE,
                    line: 5,
                    column: 1
                }
            ]
        },
        {
            code: "{\na();\n\n}",
            output: "{\n\na();\n\n}",
            errors: [
                {
                    message: ALWAYS_MESSAGE,
                    line: 1
                }
            ]
        },
        {
            code: "{\n\na();\n}",
            output: "{\n\na();\n\n}",
            errors: [
                {
                    message: ALWAYS_MESSAGE,
                    line: 4
                }
            ]
        },
        {
            code: "{\na();\n}",
            output: "{\n\na();\n\n}",
            errors: [
                {
                    message: ALWAYS_MESSAGE,
                    line: 1
                },
                {
                    message: ALWAYS_MESSAGE,
                    line: 3
                }
            ]
        },
        {
            code: "{\r\na();\r\n}",
            output: "{\n\r\na();\r\n\n}",
            errors: [
                {
                    message: ALWAYS_MESSAGE,
                    line: 1
                },
                {
                    message: ALWAYS_MESSAGE,
                    line: 3
                }
            ]
        },
        {
            code: "{\na();}",
            output: "{\n\na();\n}",
            errors: [
                {
                    message: ALWAYS_MESSAGE,
                    line: 1
                },
                {
                    message: ALWAYS_MESSAGE,
                    line: 2
                }
            ]
        },
        {
            code: "{a();\n}",
            output: "{\na();\n\n}",
            errors: [
                {
                    message: ALWAYS_MESSAGE,
                    line: 1
                },
                {
                    message: ALWAYS_MESSAGE,
                    line: 2
                }
            ]
        },
        {
            code: "{a();\n}",
            output: "{\na();\n\n}",
            options: [{ blocks: "always" }],
            errors: [
                {
                    message: ALWAYS_MESSAGE,
                    line: 1
                },
                {
                    message: ALWAYS_MESSAGE,
                    line: 2
                }
            ]
        },
        {
            code: "switch (a) {\ncase 0: foo();\ncase 1: bar();\n}",
            output: "switch (a) {\n\ncase 0: foo();\ncase 1: bar();\n\n}",
            options: ["always"],
            errors: [
                {
                    message: ALWAYS_MESSAGE,
                    line: 1,
                    column: 12
                },
                {
                    message: ALWAYS_MESSAGE,
                    line: 4,
                    column: 1
                }
            ]
        },
        {
            code: "switch (a) {\ncase 0: foo();\ncase 1: bar();\n}",
            output: "switch (a) {\n\ncase 0: foo();\ncase 1: bar();\n\n}",
            options: [{ switches: "always" }],
            errors: [
                {
                    message: ALWAYS_MESSAGE,
                    line: 1,
                    column: 12
                },
                {
                    message: ALWAYS_MESSAGE,
                    line: 4,
                    column: 1
                }
            ]
        },
        {
            code: "switch (a) {\n//comment\ncase 0: foo();//comment\n}",
            output: "switch (a) {\n\n//comment\ncase 0: foo();//comment\n\n}",
            options: [{ switches: "always" }],
            errors: [
                {
                    message: ALWAYS_MESSAGE,
                    line: 1,
                    column: 12
                },
                {
                    message: ALWAYS_MESSAGE,
                    line: 4,
                    column: 1
                }
            ]
        },
        {
            code: "class A {\nconstructor(){}\n}",
            output: "class A {\n\nconstructor(){}\n\n}",
            options: ["always"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    message: ALWAYS_MESSAGE,
                    line: 1,
                    column: 9
                },
                {
                    message: ALWAYS_MESSAGE,
                    line: 3,
                    column: 1
                }
            ]
        },
        {
            code: "class A {\nconstructor(){}\n}",
            output: "class A {\n\nconstructor(){}\n\n}",
            options: [{ classes: "always" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    message: ALWAYS_MESSAGE,
                    line: 1,
                    column: 9
                },
                {
                    message: ALWAYS_MESSAGE,
                    line: 3,
                    column: 1
                }
            ]
        },
        {
            code: "{a();}",
            output: "{\na();\n}",
            errors: [
                {
                    message: ALWAYS_MESSAGE,
                    line: 1
                },
                {
                    message: ALWAYS_MESSAGE,
                    line: 1
                }
            ]
        },
        {
            code: "{\na()\n//comment\n\n}",
            output: "{\na()\n//comment\n}",
            options: ["never"],
            errors: [
                {
                    message: NEVER_MESSAGE,
                    line: 5
                }
            ]
        },
        {
            code: "{\n\na();\n\n}",
            output: "{\na();\n}",
            options: ["never"],
            errors: [
                {
                    message: NEVER_MESSAGE,
                    line: 1
                },
                {
                    message: NEVER_MESSAGE,
                    line: 5
                }
            ]
        },
        {
            code: "{\r\n\r\na();\r\n\r\n}",
            output: "{\na();\n}",
            options: ["never"],
            errors: [
                {
                    message: NEVER_MESSAGE,
                    line: 1
                },
                {
                    message: NEVER_MESSAGE,
                    line: 5
                }
            ]
        },
        {
            code: "{\n\n\n  a();\n\n\n}",
            output: "{\n  a();\n}",
            options: ["never"],
            errors: [
                {
                    message: NEVER_MESSAGE,
                    line: 1
                },
                {
                    message: NEVER_MESSAGE,
                    line: 7
                }
            ]
        },
        {
            code: "{\n\na();\n}",
            output: "{\na();\n}",
            options: ["never"],
            errors: [
                {
                    message: NEVER_MESSAGE,
                    line: 1
                }
            ]
        },
        {
            code: "{\n\n\ta();\n}",
            output: "{\n\ta();\n}",
            options: ["never"],
            errors: [
                {
                    message: NEVER_MESSAGE,
                    line: 1
                }
            ]
        },
        {
            code: "{\na();\n\n}",
            output: "{\na();\n}",
            options: ["never"],
            errors: [
                {
                    message: NEVER_MESSAGE,
                    line: 4
                }
            ]
        },
        {
            code: "  {\n    a();\n\n  }",
            output: "  {\n    a();\n  }",
            options: ["never"],
            errors: [
                {
                    message: NEVER_MESSAGE,
                    line: 4
                }
            ]
        },
        {
            code: "{\n// comment\nif (\n// comment\n a) {}\n\n}",
            output: "{\n\n// comment\nif (\n// comment\n a) {}\n\n}",
            options: ["always"],
            errors: [
                {
                    message: ALWAYS_MESSAGE,
                    line: 1,
                    column: 1
                }
            ]
        },
        {
            code: "{\n\n// comment\nif (\n// comment\n a) {}\n}",
            output: "{\n// comment\nif (\n// comment\n a) {}\n}",
            options: ["never"],
            errors: [
                {
                    message: NEVER_MESSAGE,
                    line: 1,
                    column: 1
                }
            ]
        },
        {
            code: "{\n\n// comment\nif (\n// comment\n a) {}\n}",
            output: "{\n// comment\nif (\n// comment\n a) {}\n}",
            options: [{ blocks: "never" }],
            errors: [
                {
                    message: NEVER_MESSAGE,
                    line: 1,
                    column: 1
                }
            ]
        },
        {
            code: "switch (a) {\n\ncase 0: foo();\n\n}",
            output: "switch (a) {\ncase 0: foo();\n}",
            options: ["never"],
            errors: [
                {
                    message: NEVER_MESSAGE,
                    line: 1,
                    column: 12
                },
                {
                    message: NEVER_MESSAGE,
                    line: 5,
                    column: 1
                }
            ]
        },
        {
            code: "switch (a) {\n\ncase 0: foo();\n}",
            output: "switch (a) {\ncase 0: foo();\n}",
            options: [{ switches: "never" }],
            errors: [
                {
                    message: NEVER_MESSAGE,
                    line: 1,
                    column: 12
                }
            ]
        },
        {
            code: "switch (a) {\ncase 0: foo();\n\n  }",
            output: "switch (a) {\ncase 0: foo();\n  }",
            options: [{ switches: "never" }],
            errors: [
                {
                    message: NEVER_MESSAGE,
                    line: 4,
                    column: 3
                }
            ]
        },
        {
            code: "class A {\n\nconstructor(){\n\nfoo();\n\n}\n\n}",
            output: "class A {\nconstructor(){\nfoo();\n}\n}",
            options: ["never"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    message: NEVER_MESSAGE,
                    line: 1
                },
                {
                    message: NEVER_MESSAGE,
                    line: 3
                },
                {
                    message: NEVER_MESSAGE,
                    line: 7
                },
                {
                    message: NEVER_MESSAGE,
                    line: 9
                }
            ]
        },
        {
            code: "class A {\n\nconstructor(){\n\nfoo();\n\n}\n\n}",
            output: "class A {\nconstructor(){\n\nfoo();\n\n}\n}",
            options: [{ classes: "never" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    message: NEVER_MESSAGE,
                    line: 1
                },
                {
                    message: NEVER_MESSAGE,
                    line: 9
                }
            ]
        },
        {
            code: "class A {\n\nconstructor(){\n\nfoo();\n\n}\n\n}",
            output: "class A {\nconstructor(){\nfoo();\n}\n}",
            options: [{ blocks: "never", classes: "never" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    message: NEVER_MESSAGE,
                    line: 1
                },
                {
                    message: NEVER_MESSAGE,
                    line: 3
                },
                {
                    message: NEVER_MESSAGE,
                    line: 7
                },
                {
                    message: NEVER_MESSAGE,
                    line: 9
                }
            ]
        },
        {
            code: "function foo() { // a\n\n  b;\n}",
            output: "function foo() { // a\n  b;\n}",
            options: ["never"],
            errors: [NEVER_MESSAGE]
        },
        {
            code: "function foo() { /* a\n */\n\n  bar;\n}",
            output: "function foo() { /* a\n */\n  bar;\n}",
            options: ["never"],
            errors: [NEVER_MESSAGE]
        },
        {
            code: "function foo() {\n\n  bar;\n/* a\n */}",
            output: "function foo() {\n\n  bar;\n\n/* a\n */}",
            options: ["always"],
            errors: [ALWAYS_MESSAGE]
        },
        {
            code: "function foo() { /* a\n */\n/* b\n */\n  bar;\n}",
            output: "function foo() { /* a\n */\n\n/* b\n */\n  bar;\n\n}",
            options: ["always"],
            errors: [ALWAYS_MESSAGE, ALWAYS_MESSAGE]
        },
        {
            code: "function foo() { /* a\n */ /* b\n */\n  bar;\n}",
            output: "function foo() { /* a\n */ /* b\n */\n\n  bar;\n\n}",
            options: ["always"],
            errors: [ALWAYS_MESSAGE, ALWAYS_MESSAGE]
        },
        {
            code: "function foo() { /* a\n */ /* b\n */\n  bar;\n/* c\n *//* d\n */}",
            output: "function foo() { /* a\n */ /* b\n */\n\n  bar;\n\n/* c\n *//* d\n */}",
            options: ["always"],
            errors: [ALWAYS_MESSAGE, ALWAYS_MESSAGE]
        }
    ]
});
