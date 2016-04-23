/**
 * @fileoverview Tests for padded-blocks rule.
 * @author Mathias Schreck <https://github.com/lo1tuma>
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/padded-blocks"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester(),
    ALWAYS_MESSAGE = "Block must be padded by blank lines.",
    NEVER_MESSAGE = "Block must not be padded by blank lines.";

ruleTester.run("padded-blocks", rule, {
    valid: [
        {code: "{\n\na();\n\n}" },
        {code: "{\n\na();\n\n}" },
        {code: "{\n\n\na();\n\n\n}" },
        {code: "{\n\n//comment\na();\n\n}" },
        {code: "{\n\na();\n//comment\n\n}" },
        {code: "{\n\na()\n//comment\n\n}" },
        {code: "{\n\na = 1\n\n}" },
        {code: "{//comment\n\na();\n\n}" },
        {code: "{\n\na();\n\n/* comment */ }" },
        {code: "{\n\na();\n\n/* comment */ }", options: ["always"]},
        {code: "{\n\na();\n\n/* comment */ }", options: [{blocks: "always"}]},

        // Ignore switches by default
        {code: "switch (a) {\n\ncase 0: foo();\ncase 1: bar();\n\n}", options: ["always"]},
        {code: "switch (a) {\n\ncase 0: foo();\ncase 1: bar();\n\n}", options: ["never"]},

        // Ignore block statements if not configured
        {code: "{\na();\n}", options: [{switches: "always"}]},
        {code: "{\n\na();\n\n}", options: [{switches: "never"}]},

        {code: "switch (a) {}", options: [{switches: "always"}]},
        {code: "switch (a) {\n\ncase 0: foo();\ncase 1: bar();\n\n}", options: [{switches: "always"}]},
        {code: "switch (a) {\n\n//comment\ncase 0: foo();//comment\n\n}", options: [{switches: "always"}]},
        {code: "switch (a) {//coment\n\ncase 0: foo();\ncase 1: bar();\n\n/* comment */}", options: [{switches: "always"}]},

        // Ignore classes by default
        {code: "class A{\nfoo(){}\n}", parserOptions: { ecmaVersion: 6 }},
        {code: "class A{\n\nfoo(){}\n\n}", parserOptions: { ecmaVersion: 6 }},

        {code: "class A{}", parserOptions: { ecmaVersion: 6 }, options: [{classes: "always"}]},
        {code: "class A{\n\n}", parserOptions: { ecmaVersion: 6 }, options: [{classes: "always"}]},
        {code: "class A{\n\nfoo(){}\n\n}", parserOptions: { ecmaVersion: 6 }, options: [{classes: "always"}]},

        {code: "{\na();\n}", options: ["never"]},
        {code: "{\na();}", options: ["never"]},
        {code: "{a();\n}", options: ["never"]},
        {code: "{a();}", options: ["never"]},
        {code: "{//comment\na();}", options: ["never"]},
        {code: "{\n//comment\na()\n}", options: ["never"]},
        {code: "{a();//comment\n}", options: ["never"]},
        {code: "{\na();\n//comment\n}", options: ["never"]},
        {code: "{\na()\n//comment\n}", options: ["never"]},
        {code: "{\na()\n//comment\nb()\n}", options: ["never"]},
        {code: "function a() {\n/* comment */\nreturn;\n/* comment*/\n}", options: ["never"] },
        {code: "{\n// comment\ndebugger;\n// comment\n}", options: ["never"] },
        {code: "{\n\n// comment\nif (\n// comment\n a) {}\n\n }", options: ["always"] },
        {code: "{\n// comment\nif (\n// comment\n a) {}\n }", options: ["never"] },
        {code: "{\n// comment\nif (\n// comment\n a) {}\n }", options: [{blocks: "never"}] },
        {code: "switch (a) {\ncase 0: foo();\n}", options: [{switches: "never"}]},
        {code: "class A{\nfoo(){}\n}", parserOptions: { ecmaVersion: 6 }, options: [{classes: "never"}]}
    ],
    invalid: [
        {
            code: "{\n//comment\na();\n\n}",
            errors: [
                {
                    message: ALWAYS_MESSAGE,
                    line: 1,
                    column: 1
                }
            ]
        },
        {
            code: "{\n\na();\n//comment\n}",
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
            errors: [
                {
                    message: ALWAYS_MESSAGE,
                    line: 1
                }
            ]
        },
        {
            code: "{\n\na();\n}",
            errors: [
                {
                    message: ALWAYS_MESSAGE,
                    line: 4
                }
            ]
        },
        {
            code: "{\na();\n}",
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
            options: [{blocks: "always"}],
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
            options: [{switches: "always"}],
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
            options: [{switches: "always"}],
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
            parserOptions: { ecmaVersion: 6 },
            options: [{classes: "always"}],
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
            code: "{\n\n\na();\n\n\n}",
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
            options: [{blocks: "never"}],
            errors: [
                {
                    message: NEVER_MESSAGE,
                    line: 1,
                    column: 1
                }
            ]
        },
        {
            code: "switch (a) {\n\ncase 0: foo();\n}",
            options: [{switches: "never"}],
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
            options: [{switches: "never"}],
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
            parserOptions: { ecmaVersion: 6 },
            options: [{classes: "never"}],
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
            parserOptions: { ecmaVersion: 6 },
            options: [{blocks: "never", classes: "never"}],
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
        }
    ]
});
