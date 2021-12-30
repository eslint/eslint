/**
 * @fileoverview Tests for padded-blocks rule.
 * @author Mathias Schreck <https://github.com/lo1tuma>
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/padded-blocks"),
    { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

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
        { code: "switch (a) {//comment\n\ncase 0: foo();\ncase 1: bar();\n\n/* comment */}", options: [{ switches: "always" }] },

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

        { code: "class A{\n\nfoo;\n\n}", parserOptions: { ecmaVersion: 2022 } },
        { code: "class A{\nfoo;\n}", options: ["never"], parserOptions: { ecmaVersion: 2022 } },

        // Ignore block statements if not configured
        { code: "{\na();\n}", options: [{ switches: "always" }] },
        { code: "{\n\na();\n\n}", options: [{ switches: "never" }] },

        // Ignore switch statements if not configured
        { code: "switch (a) {\ncase 0: foo();\ncase 1: bar();\n}", options: [{ blocks: "always", classes: "always" }] },
        { code: "switch (a) {\n\ncase 0: foo();\ncase 1: bar();\n\n}", options: [{ blocks: "never", classes: "never" }] },


        // Ignore class statements if not configured
        { code: "class A{\nfoo(){}\n}", options: [{ blocks: "always" }], parserOptions: { ecmaVersion: 6 } },
        { code: "class A{\n\nfoo(){}\n\n}", options: [{ blocks: "never" }], parserOptions: { ecmaVersion: 6 } },

        // class static blocks
        {
            code: "class C {\n\n static {\n\nfoo;\n\n} \n\n}",
            options: ["always"],
            parserOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C {\n\n static {// comment\n\nfoo;\n\n/* comment */} \n\n}",
            options: ["always"],
            parserOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C {\n\n static {\n\n// comment\nfoo;\n// comment\n\n} \n\n}",
            options: ["always"],
            parserOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C {\n\n static {\n\n// comment\n\nfoo;\n\n// comment\n\n} \n\n}",
            options: ["always"],
            parserOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C {\n\n static { foo; } \n\n}",
            options: ["always", { allowSingleLineBlocks: true }],
            parserOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C {\n\n static\n { foo; } \n\n}",
            options: ["always", { allowSingleLineBlocks: true }],
            parserOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C {\n\n static {} static {\n} static {\n\n} \n\n}", // empty blocks are ignored
            options: ["always"],
            parserOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C {\n\n static\n\n { foo; } \n\n}",
            options: ["always", { allowSingleLineBlocks: true }],
            parserOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C {\n static {\n\nfoo;\n\n} \n}",
            options: [{ blocks: "always", classes: "never" }], // "blocks" applies to static blocks
            parserOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C {\n static {\nfoo;\n} \n}",
            options: ["never"],
            parserOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C {\n static {foo;} \n}",
            options: ["never"],
            parserOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C {\n static\n {\nfoo;\n} \n}",
            options: ["never"],
            parserOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C {\n static\n\n {\nfoo;\n} \n}",
            options: ["never"],
            parserOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C {\n static\n\n {foo;} \n}",
            options: ["never"],
            parserOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C {\n static {// comment\nfoo;\n/* comment */} \n}",
            options: ["never"],
            parserOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C {\n static {\n// comment\nfoo;\n// comment\n} \n}",
            options: ["never"],
            parserOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C {\n static {} static {\n} static {\n\n} \n}", // empty blocks are ignored
            options: ["never"],
            parserOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C {\n\n static {\nfoo;\n} \n\n}",
            options: [{ blocks: "never", classes: "always" }], // "blocks" applies to static blocks
            parserOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C {\n\n static {\nfoo;\n} static {\n\nfoo;\n\n} \n\n}",
            options: [{ classes: "always" }], // if there's no "blocks" in the object option, static blocks are ignored
            parserOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C {\n static {\nfoo;\n} static {\n\nfoo;\n\n} \n}",
            options: [{ classes: "never" }], // if there's no "blocks" in the object option, static blocks are ignored
            parserOptions: { ecmaVersion: 2022 }
        }

    ],
    invalid: [
        {
            code: "{\n//comment\na();\n\n}",
            output: "{\n\n//comment\na();\n\n}",
            errors: [
                {
                    messageId: "alwaysPadBlock",
                    line: 1,
                    column: 1,
                    endLine: 2,
                    endColumn: 1
                }
            ]
        },
        {
            code: "{ //comment\na();\n\n}",
            output: "{ //comment\n\na();\n\n}",
            errors: [
                {
                    messageId: "alwaysPadBlock",
                    line: 1,
                    column: 3,
                    endLine: 2,
                    endColumn: 1
                }
            ]
        },
        {
            code: "{\n\na();\n//comment\n}",
            output: "{\n\na();\n//comment\n\n}",
            errors: [
                {
                    messageId: "alwaysPadBlock",
                    line: 4,
                    column: 10,
                    endLine: 5,
                    endColumn: 1
                }
            ]
        },
        {
            code: "{\n\na()\n//comment\n}",
            output: "{\n\na()\n//comment\n\n}",
            errors: [
                {
                    messageId: "alwaysPadBlock",
                    line: 4,
                    column: 10,
                    endLine: 5,
                    endColumn: 1
                }
            ]
        },
        {
            code: "{\na();\n\n}",
            output: "{\n\na();\n\n}",
            errors: [
                {
                    messageId: "alwaysPadBlock",
                    line: 1,
                    column: 1,
                    endLine: 2,
                    endColumn: 1
                }
            ]
        },
        {
            code: "{\n\na();\n}",
            output: "{\n\na();\n\n}",
            errors: [
                {
                    messageId: "alwaysPadBlock",
                    line: 3,
                    column: 5,
                    endLine: 4,
                    endColumn: 1
                }
            ]
        },
        {
            code: "{\na();\n}",
            output: "{\n\na();\n\n}",
            errors: [
                {
                    messageId: "alwaysPadBlock",
                    line: 1,
                    column: 1,
                    endLine: 2,
                    endColumn: 1
                },
                {
                    messageId: "alwaysPadBlock",
                    line: 2,
                    column: 5,
                    endLine: 3,
                    endColumn: 1
                }
            ]
        },
        {
            code: "{\r\na();\r\n}",
            output: "{\n\r\na();\r\n\n}",
            errors: [
                {
                    messageId: "alwaysPadBlock",
                    line: 1,
                    column: 1,
                    endLine: 2,
                    endColumn: 1
                },
                {
                    messageId: "alwaysPadBlock",
                    line: 2,
                    column: 5,
                    endLine: 3,
                    endColumn: 1
                }
            ]
        },
        {
            code: "{\na();}",
            output: "{\n\na();\n}",
            errors: [
                {
                    messageId: "alwaysPadBlock",
                    line: 1,
                    column: 1,
                    endLine: 2,
                    endColumn: 1
                },
                {
                    messageId: "alwaysPadBlock",
                    line: 2,
                    column: 5,
                    endLine: 2,
                    endColumn: 5
                }
            ]
        },
        {
            code: "{a();\n}",
            output: "{\na();\n\n}",
            errors: [
                {
                    messageId: "alwaysPadBlock",
                    line: 1,
                    column: 1,
                    endLine: 1,
                    endColumn: 2
                },
                {
                    messageId: "alwaysPadBlock",
                    line: 1,
                    column: 6,
                    endLine: 2,
                    endColumn: 1
                }
            ]
        },
        {
            code: "{a();\n}",
            output: "{\na();\n\n}",
            options: [{ blocks: "always" }],
            errors: [
                {
                    messageId: "alwaysPadBlock",
                    line: 1,
                    column: 1,
                    endLine: 1,
                    endColumn: 2
                },
                {
                    messageId: "alwaysPadBlock",
                    line: 1,
                    column: 6,
                    endLine: 2,
                    endColumn: 1
                }
            ]
        },
        {
            code: "switch (a) {\ncase 0: foo();\ncase 1: bar();\n}",
            output: "switch (a) {\n\ncase 0: foo();\ncase 1: bar();\n\n}",
            options: ["always"],
            errors: [
                {
                    messageId: "alwaysPadBlock",
                    line: 1,
                    column: 12,
                    endLine: 2,
                    endColumn: 1
                },
                {
                    messageId: "alwaysPadBlock",
                    line: 3,
                    column: 15,
                    endLine: 4,
                    endColumn: 1
                }
            ]
        },
        {
            code: "switch (a) {\ncase 0: foo();\ncase 1: bar();\n}",
            output: "switch (a) {\n\ncase 0: foo();\ncase 1: bar();\n\n}",
            options: [{ switches: "always" }],
            errors: [
                {
                    messageId: "alwaysPadBlock",
                    line: 1,
                    column: 12,
                    endLine: 2,
                    endColumn: 1
                },
                {
                    messageId: "alwaysPadBlock",
                    line: 3,
                    column: 15,
                    endLine: 4,
                    endColumn: 1
                }
            ]
        },
        {
            code: "switch (a) {\n//comment\ncase 0: foo();//comment\n}",
            output: "switch (a) {\n\n//comment\ncase 0: foo();//comment\n\n}",
            options: [{ switches: "always" }],
            errors: [
                {
                    messageId: "alwaysPadBlock",
                    line: 1,
                    column: 12,
                    endLine: 2,
                    endColumn: 1
                },
                {
                    messageId: "alwaysPadBlock",
                    line: 3,
                    column: 24,
                    endLine: 4,
                    endColumn: 1
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
                    messageId: "alwaysPadBlock",
                    line: 1,
                    column: 9,
                    endLine: 2,
                    endColumn: 1
                },
                {
                    messageId: "alwaysPadBlock",
                    line: 2,
                    column: 16,
                    endLine: 3,
                    endColumn: 1
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
                    messageId: "alwaysPadBlock",
                    line: 1,
                    column: 9,
                    endLine: 2,
                    endColumn: 1
                },
                {
                    messageId: "alwaysPadBlock",
                    line: 2,
                    column: 16,
                    endLine: 3,
                    endColumn: 1
                }
            ]
        },
        {
            code: "{a();}",
            output: "{\na();\n}",
            errors: [
                {
                    messageId: "alwaysPadBlock",
                    line: 1,
                    column: 1,
                    endLine: 1,
                    endColumn: 2
                },
                {
                    messageId: "alwaysPadBlock",
                    line: 1,
                    column: 6,
                    endLine: 1,
                    endColumn: 6
                }
            ]
        },
        {
            code: "{\na()\n//comment\n\n}",
            output: "{\na()\n//comment\n}",
            options: ["never"],
            errors: [
                {
                    messageId: "neverPadBlock",
                    line: 3,
                    column: 10,
                    endLine: 5,
                    endColumn: 1
                }
            ]
        },
        {
            code: "{\n\na();\n\n}",
            output: "{\na();\n}",
            options: ["never"],
            errors: [
                {
                    messageId: "neverPadBlock",
                    line: 1,
                    column: 1,
                    endLine: 3,
                    endColumn: 1
                },
                {
                    messageId: "neverPadBlock",
                    line: 3,
                    column: 5,
                    endLine: 5,
                    endColumn: 1
                }
            ]
        },
        {
            code: "{\r\n\r\na();\r\n\r\n}",
            output: "{\na();\n}",
            options: ["never"],
            errors: [
                {
                    messageId: "neverPadBlock",
                    line: 1,
                    column: 1,
                    endLine: 3,
                    endColumn: 1
                },
                {
                    messageId: "neverPadBlock",
                    line: 3,
                    column: 5,
                    endLine: 5,
                    endColumn: 1
                }
            ]
        },
        {
            code: "{\n\n\n  a();\n\n\n}",
            output: "{\n  a();\n}",
            options: ["never"],
            errors: [
                {
                    messageId: "neverPadBlock",
                    line: 1,
                    column: 1,
                    endLine: 4,
                    endColumn: 3
                },
                {
                    messageId: "neverPadBlock",
                    line: 4,
                    column: 7,
                    endLine: 7,
                    endColumn: 1
                }
            ]
        },
        {
            code: "{\n\na();\n}",
            output: "{\na();\n}",
            options: ["never"],
            errors: [
                {
                    messageId: "neverPadBlock",
                    line: 1,
                    column: 1,
                    endLine: 3,
                    endColumn: 1
                }
            ]
        },
        {
            code: "{\n\n\ta();\n}",
            output: "{\n\ta();\n}",
            options: ["never"],
            errors: [
                {
                    messageId: "neverPadBlock",
                    line: 1,
                    column: 1,
                    endLine: 3,
                    endColumn: 2
                }
            ]
        },
        {
            code: "{\na();\n\n}",
            output: "{\na();\n}",
            options: ["never"],
            errors: [
                {
                    messageId: "neverPadBlock",
                    line: 2,
                    column: 5,
                    endLine: 4,
                    endColumn: 1
                }
            ]
        },
        {
            code: "  {\n    a();\n\n  }",
            output: "  {\n    a();\n  }",
            options: ["never"],
            errors: [
                {
                    messageId: "neverPadBlock",
                    line: 2,
                    column: 9,
                    endLine: 4,
                    endColumn: 3
                }
            ]
        },
        {
            code: "{\n// comment\nif (\n// comment\n a) {}\n\n}",
            output: "{\n\n// comment\nif (\n// comment\n a) {}\n\n}",
            options: ["always"],
            errors: [
                {
                    messageId: "alwaysPadBlock",
                    line: 1,
                    column: 1,
                    endLine: 2,
                    endColumn: 1
                }
            ]
        },
        {
            code: "{\n\n// comment\nif (\n// comment\n a) {}\n}",
            output: "{\n// comment\nif (\n// comment\n a) {}\n}",
            options: ["never"],
            errors: [
                {
                    messageId: "neverPadBlock",
                    line: 1,
                    column: 1,
                    endLine: 3,
                    endColumn: 1
                }
            ]
        },
        {
            code: "{\n\n// comment\nif (\n// comment\n a) {}\n}",
            output: "{\n// comment\nif (\n// comment\n a) {}\n}",
            options: [{ blocks: "never" }],
            errors: [
                {
                    messageId: "neverPadBlock",
                    line: 1,
                    column: 1,
                    endLine: 3,
                    endColumn: 1
                }
            ]
        },
        {
            code: "switch (a) {\n\ncase 0: foo();\n\n}",
            output: "switch (a) {\ncase 0: foo();\n}",
            options: ["never"],
            errors: [
                {
                    messageId: "neverPadBlock",
                    line: 1,
                    column: 12,
                    endLine: 3,
                    endColumn: 1
                },
                {
                    messageId: "neverPadBlock",
                    line: 3,
                    column: 15,
                    endLine: 5,
                    endColumn: 1
                }
            ]
        },
        {
            code: "switch (a) {\n\ncase 0: foo();\n}",
            output: "switch (a) {\ncase 0: foo();\n}",
            options: [{ switches: "never" }],
            errors: [
                {
                    messageId: "neverPadBlock",
                    line: 1,
                    column: 12,
                    endLine: 3,
                    endColumn: 1
                }
            ]
        },
        {
            code: "switch (a) {\ncase 0: foo();\n\n  }",
            output: "switch (a) {\ncase 0: foo();\n  }",
            options: [{ switches: "never" }],
            errors: [
                {
                    messageId: "neverPadBlock",
                    line: 2,
                    column: 15,
                    endLine: 4,
                    endColumn: 3
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
                    messageId: "neverPadBlock",
                    line: 1,
                    column: 9,
                    endLine: 3,
                    endColumn: 1
                },
                {
                    messageId: "neverPadBlock",
                    line: 3,
                    column: 14,
                    endLine: 5,
                    endColumn: 1
                },
                {
                    messageId: "neverPadBlock",
                    line: 5,
                    column: 7,
                    endLine: 7,
                    endColumn: 1
                },
                {
                    messageId: "neverPadBlock",
                    line: 7,
                    column: 2,
                    endLine: 9,
                    endColumn: 1
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
                    messageId: "neverPadBlock",
                    line: 1,
                    column: 9,
                    endLine: 3,
                    endColumn: 1
                },
                {
                    messageId: "neverPadBlock",
                    line: 7,
                    column: 2,
                    endLine: 9,
                    endColumn: 1
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
                    messageId: "neverPadBlock",
                    line: 1,
                    column: 9,
                    endLine: 3,
                    endColumn: 1
                },
                {
                    messageId: "neverPadBlock",
                    line: 3,
                    column: 14,
                    endLine: 5,
                    endColumn: 1
                },
                {
                    messageId: "neverPadBlock",
                    line: 5,
                    column: 7,
                    endLine: 7,
                    endColumn: 1
                },
                {
                    messageId: "neverPadBlock",
                    line: 7,
                    column: 2,
                    endLine: 9,
                    endColumn: 1
                }
            ]
        },
        {
            code: "function foo() { // a\n\n  b;\n}",
            output: "function foo() { // a\n  b;\n}",
            options: ["never"],
            errors: [{ messageId: "neverPadBlock" }]
        },
        {
            code: "function foo() { /* a\n */\n\n  bar;\n}",
            output: "function foo() { /* a\n */\n  bar;\n}",
            options: ["never"],
            errors: [{ messageId: "neverPadBlock" }]
        },
        {
            code: "function foo() {\n\n  bar;\n/* a\n */}",
            output: "function foo() {\n\n  bar;\n\n/* a\n */}",
            options: ["always"],
            errors: [{ messageId: "alwaysPadBlock" }]
        },
        {
            code: "function foo() { /* a\n */\n/* b\n */\n  bar;\n}",
            output: "function foo() { /* a\n */\n\n/* b\n */\n  bar;\n\n}",
            options: ["always"],
            errors: [{ messageId: "alwaysPadBlock" }, { messageId: "alwaysPadBlock" }]
        },
        {
            code: "function foo() { /* a\n */ /* b\n */\n  bar;\n}",
            output: "function foo() { /* a\n */ /* b\n */\n\n  bar;\n\n}",
            options: ["always"],
            errors: [{ messageId: "alwaysPadBlock" }, { messageId: "alwaysPadBlock" }]
        },
        {
            code: "function foo() { /* a\n */ /* b\n */\n  bar;\n/* c\n *//* d\n */}",
            output: "function foo() { /* a\n */ /* b\n */\n\n  bar;\n\n/* c\n *//* d\n */}",
            options: ["always"],
            errors: [{ messageId: "alwaysPadBlock" }, { messageId: "alwaysPadBlock" }]
        },
        {
            code: "class A{\nfoo;\n}",
            output: "class A{\n\nfoo;\n\n}",
            parserOptions: { ecmaVersion: 2022 },
            errors: [{ messageId: "alwaysPadBlock" }, { messageId: "alwaysPadBlock" }]
        },
        {
            code: "class A{\n\nfoo;\n\n}",
            output: "class A{\nfoo;\n}",
            options: ["never"],
            parserOptions: { ecmaVersion: 2022 },
            errors: [{ messageId: "neverPadBlock" }, { messageId: "neverPadBlock" }]
        },

        // class static blocks
        {
            code: "class C {\n\n static {\nfoo;\n\n} \n\n}",
            output: "class C {\n\n static {\n\nfoo;\n\n} \n\n}",
            options: ["always"],
            parserOptions: { ecmaVersion: 2022 },
            errors: [{ messageId: "alwaysPadBlock" }]
        },
        {
            code: "class C {\n\n static\n {\nfoo;\n\n} \n\n}",
            output: "class C {\n\n static\n {\n\nfoo;\n\n} \n\n}",
            options: ["always"],
            parserOptions: { ecmaVersion: 2022 },
            errors: [{ messageId: "alwaysPadBlock" }]
        },
        {
            code: "class C {\n\n static\n\n {\nfoo;\n\n} \n\n}",
            output: "class C {\n\n static\n\n {\n\nfoo;\n\n} \n\n}",
            options: ["always"],
            parserOptions: { ecmaVersion: 2022 },
            errors: [{ messageId: "alwaysPadBlock" }]
        },
        {
            code: "class C {\n\n static {\n\nfoo;\n} \n\n}",
            output: "class C {\n\n static {\n\nfoo;\n\n} \n\n}",
            options: ["always"],
            parserOptions: { ecmaVersion: 2022 },
            errors: [{ messageId: "alwaysPadBlock" }]
        },
        {
            code: "class C {\n\n static {foo;} \n\n}",
            output: "class C {\n\n static {\nfoo;\n} \n\n}", // this is still not padded, the subsequent fix below will add another pair of `\n`.
            options: ["always"],
            parserOptions: { ecmaVersion: 2022 },
            errors: [
                { messageId: "alwaysPadBlock" },
                { messageId: "alwaysPadBlock" }
            ]
        },
        {
            code: "class C {\n\n static {\nfoo;\n} \n\n}",
            output: "class C {\n\n static {\n\nfoo;\n\n} \n\n}",
            options: ["always"],
            parserOptions: { ecmaVersion: 2022 },
            errors: [
                { messageId: "alwaysPadBlock" },
                { messageId: "alwaysPadBlock" }
            ]
        },
        {
            code: "class C {\n\n static {// comment\nfoo;\n/* comment */} \n\n}",
            output: "class C {\n\n static {// comment\n\nfoo;\n\n/* comment */} \n\n}",
            options: ["always"],
            parserOptions: { ecmaVersion: 2022 },
            errors: [
                { messageId: "alwaysPadBlock" },
                { messageId: "alwaysPadBlock" }
            ]
        },
        {
            code: "class C {\n\n static {\n// comment\nfoo;\n// comment\n} \n\n}",
            output: "class C {\n\n static {\n\n// comment\nfoo;\n// comment\n\n} \n\n}",
            options: ["always"],
            parserOptions: { ecmaVersion: 2022 },
            errors: [
                { messageId: "alwaysPadBlock" },
                { messageId: "alwaysPadBlock" }
            ]
        },
        {
            code: "class C {\n\n static {\n// comment\n\nfoo;\n\n// comment\n} \n\n}",
            output: "class C {\n\n static {\n\n// comment\n\nfoo;\n\n// comment\n\n} \n\n}",
            options: ["always"],
            parserOptions: { ecmaVersion: 2022 },
            errors: [
                { messageId: "alwaysPadBlock" },
                { messageId: "alwaysPadBlock" }
            ]
        },
        {
            code: "class C {\n static {\nfoo;\n} \n}",
            output: "class C {\n static {\n\nfoo;\n\n} \n}",
            options: [{ blocks: "always", classes: "never" }], // "blocks" applies to static blocks
            parserOptions: { ecmaVersion: 2022 },
            errors: [
                { messageId: "alwaysPadBlock" },
                { messageId: "alwaysPadBlock" }
            ]
        },
        {
            code: "class C {\n static {\n\nfoo;\n} \n}",
            output: "class C {\n static {\nfoo;\n} \n}",
            options: ["never"],
            parserOptions: { ecmaVersion: 2022 },
            errors: [{ messageId: "neverPadBlock" }]
        },
        {
            code: "class C {\n static\n {\n\nfoo;\n} \n}",
            output: "class C {\n static\n {\nfoo;\n} \n}",
            options: ["never"],
            parserOptions: { ecmaVersion: 2022 },
            errors: [{ messageId: "neverPadBlock" }]
        },
        {
            code: "class C {\n static\n\n {\n\nfoo;\n} \n}",
            output: "class C {\n static\n\n {\nfoo;\n} \n}",
            options: ["never"],
            parserOptions: { ecmaVersion: 2022 },
            errors: [{ messageId: "neverPadBlock" }]
        },
        {
            code: "class C {\n static {\nfoo;\n\n} \n}",
            output: "class C {\n static {\nfoo;\n} \n}",
            options: ["never"],
            parserOptions: { ecmaVersion: 2022 },
            errors: [{ messageId: "neverPadBlock" }]
        },
        {
            code: "class C {\n static {\n\nfoo;\n\n} \n}",
            output: "class C {\n static {\nfoo;\n} \n}",
            options: ["never"],
            parserOptions: { ecmaVersion: 2022 },
            errors: [
                { messageId: "neverPadBlock" },
                { messageId: "neverPadBlock" }
            ]
        },
        {
            code: "class C {\n static {// comment\n\nfoo;\n\n/* comment */} \n}",
            output: "class C {\n static {// comment\nfoo;\n/* comment */} \n}",
            options: ["never"],
            parserOptions: { ecmaVersion: 2022 },
            errors: [
                { messageId: "neverPadBlock" },
                { messageId: "neverPadBlock" }
            ]
        },
        {
            code: "class C {\n static {\n\n// comment\nfoo;\n// comment\n\n} \n}",
            output: "class C {\n static {\n// comment\nfoo;\n// comment\n} \n}",
            options: ["never"],
            parserOptions: { ecmaVersion: 2022 },
            errors: [
                { messageId: "neverPadBlock" },
                { messageId: "neverPadBlock" }
            ]
        },
        {
            code: "class C {\n\n static {\n\nfoo;\n\n} \n\n}",
            output: "class C {\n\n static {\nfoo;\n} \n\n}",
            options: [{ blocks: "never", classes: "always" }], // "blocks" applies to static blocks
            parserOptions: { ecmaVersion: 2022 },
            errors: [
                { messageId: "neverPadBlock" },
                { messageId: "neverPadBlock" }
            ]
        }
    ]
});
