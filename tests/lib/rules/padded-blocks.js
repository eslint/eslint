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
    ALWAYS_MESSAGE_INSIDE = "Block must be padded by blank lines on the inside.",
    ALWAYS_MESSAGE_OUTSIDE = "Block must be padded by blank lines on the outside.",
    NEVER_MESSAGE_INSIDE = "Block must not be padded by blank lines on the inside.",
    NEVER_MESSAGE_OUTSIDE = "Block must not be padded by blank lines on the outside.";

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
        {code: "class A{\nfoo(){}\n}", parserOptions: { ecmaVersion: 6 }, options: [{classes: "never"}]},

        // above/below:
        {
            code: "{}\n\n{\na();\n}",
            options: [{ inside: "never", above: "always", below: "always" }]
        },
        {
            code: "{}\n\nif (a) {\nb();\n}",
            options: [{ inside: "never", above: "always", below: "always" }]
        },
        {
            code: "if (c) {}\n\nif (a) {\nb();\n}",
            options: [{ inside: "never", above: "always", below: "always" }]
        },
        {
            code: "if (c) {}\nif (a) {\nb();\n}",
            options: [{ inside: "never", above: "never", below: "never" }]
        },

        {
            code: "{\na();\n}\n\n{}",
            options: [{ inside: "never", above: "always", below: "always" }]
        },
        {
            code: "{\nb();\n}\n\nif(b) {}",
            options: [{ inside: "never", above: "always", below: "always" }]
        },
        {
            code: "var a = 5;\n\n{\nb();\n}",
            options: [{ inside: "never", above: "always", below: "always" }]
        },
        {
            code: "if (a) {\nb();\n}\n{}",
            options: [{ inside: "never", above: "never", below: "never" }]
        },
        {
            code: "if (a) {\nb();\n}\nif (a) {}",
            options: [{ inside: "never", above: "never", below: "never" }]
        },
        {
            code: "var a = 5;\n\nclass A {\nconstructor(){}\n}\nvar b = 3;",
            parserOptions: { ecmaVersion: 6 },
            options: [{ inside: "never", above: "always", below: "never" }]
        },
        {
            code: "var a = 5;\n\nswitch (a) {\ncase 1: break;\n}\nvar b = 3;",
            options: [{ inside: "never", above: "always", below: "never" }]
        },
        {
            code: "var a = 5;\n\nswitch (a) {\n\ncase 1: break;\n\n}\nvar b = 3;",
            options: [{ inside: { switches: "always" }, above: "always", below: "never" }]
        },

        // Inside should have presedence, by ignoring first and final nested blocks:
        {
            code: "class A{\nfoo(){\na();\n}\n\nb() { c(); }\n}",
            parserOptions: { ecmaVersion: 6 },
            options: [{ inside: "never", above: "always", below: "always" }]
        },
        {
            code: "{\nif (b) { c(); }\n\na();\n}",
            options: [{ inside: "never", above: "always", below: "always" }]
        },

        // The padding for SwitchCase blocks should be before the case itself:
        {
            code: "switch (a) {\ncase 1: break;\n\ncase 2: { c(); }\n}",
            options: [{ inside: "never", above: "always", below: "always" }]
        },

        // Do nothing if outside options aren't explicitly set:
        {code: "{}\n{\na();\n}\n\n{}", options: [{ inside: "never" }]},

        // above/below classes and switches:
        {
            code: "var a = 5;\n\nclass A {}\nvar b = 3;",
            parserOptions: { ecmaVersion: 6 },
            options: [{ inside: "never", above: "always", below: "never" }]
        },
        {
            code: "var a = 5;\n\nswitch (a) {}\nvar b = 3;",
            parserOptions: { ecmaVersion: 6 },
            options: [{ inside: "never", above: "always", below: "never" }]
        }
    ],
    invalid: [
        {
            code: "{\n//comment\na();\n\n}",
            output: "{\n\n//comment\na();\n\n}",
            errors: [
                {
                    message: ALWAYS_MESSAGE_INSIDE,
                    line: 1,
                    column: 1
                }
            ]
        },
        {
            code: "{\n\na();\n//comment\n}",
            output: "{\n\na();\n//comment\n\n}",
            errors: [
                {
                    message: ALWAYS_MESSAGE_INSIDE,
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
                    message: ALWAYS_MESSAGE_INSIDE,
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
                    message: ALWAYS_MESSAGE_INSIDE,
                    line: 1
                }
            ]
        },
        {
            code: "{\n\na();\n}",
            output: "{\n\na();\n\n}",
            errors: [
                {
                    message: ALWAYS_MESSAGE_INSIDE,
                    line: 4
                }
            ]
        },
        {
            code: "{\na();\n}",
            output: "{\n\na();\n\n}",
            errors: [
                {
                    message: ALWAYS_MESSAGE_INSIDE,
                    line: 1
                },
                {
                    message: ALWAYS_MESSAGE_INSIDE,
                    line: 3
                }
            ]
        },
        {
            code: "{\r\na();\r\n}",
            output: "{\n\r\na();\r\n\n}",
            errors: [
                {
                    message: ALWAYS_MESSAGE_INSIDE,
                    line: 1
                },
                {
                    message: ALWAYS_MESSAGE_INSIDE,
                    line: 3
                }
            ]
        },
        {
            code: "{\na();}",
            output: "{\n\na();\n}",
            errors: [
                {
                    message: ALWAYS_MESSAGE_INSIDE,
                    line: 1
                },
                {
                    message: ALWAYS_MESSAGE_INSIDE,
                    line: 2
                }
            ]
        },
        {
            code: "{a();\n}",
            output: "{\na();\n\n}",
            errors: [
                {
                    message: ALWAYS_MESSAGE_INSIDE,
                    line: 1
                },
                {
                    message: ALWAYS_MESSAGE_INSIDE,
                    line: 2
                }
            ]
        },
        {
            code: "{a();\n}",
            output: "{\na();\n\n}",
            options: [{blocks: "always"}],
            errors: [
                {
                    message: ALWAYS_MESSAGE_INSIDE,
                    line: 1
                },
                {
                    message: ALWAYS_MESSAGE_INSIDE,
                    line: 2
                }
            ]
        },
        {
            code: "switch (a) {\ncase 0: foo();\ncase 1: bar();\n}",
            output: "switch (a) {\n\ncase 0: foo();\ncase 1: bar();\n\n}",
            options: [{switches: "always"}],
            errors: [
                {
                    message: ALWAYS_MESSAGE_INSIDE,
                    line: 1,
                    column: 12
                },
                {
                    message: ALWAYS_MESSAGE_INSIDE,
                    line: 4,
                    column: 1
                }
            ]
        },
        {
            code: "switch (a) {\n//comment\ncase 0: foo();//comment\n}",
            output: "switch (a) {\n\n//comment\ncase 0: foo();//comment\n\n}",
            options: [{switches: "always"}],
            errors: [
                {
                    message: ALWAYS_MESSAGE_INSIDE,
                    line: 1,
                    column: 12
                },
                {
                    message: ALWAYS_MESSAGE_INSIDE,
                    line: 4,
                    column: 1
                }
            ]
        },
        {
            code: "class A {\nconstructor(){}\n}",
            output: "class A {\n\nconstructor(){}\n\n}",
            parserOptions: { ecmaVersion: 6 },
            options: [{classes: "always"}],
            errors: [
                {
                    message: ALWAYS_MESSAGE_INSIDE,
                    line: 1,
                    column: 9
                },
                {
                    message: ALWAYS_MESSAGE_INSIDE,
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
                    message: ALWAYS_MESSAGE_INSIDE,
                    line: 1
                },
                {
                    message: ALWAYS_MESSAGE_INSIDE,
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
                    message: NEVER_MESSAGE_INSIDE,
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
                    message: NEVER_MESSAGE_INSIDE,
                    line: 1
                },
                {
                    message: NEVER_MESSAGE_INSIDE,
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
                    message: NEVER_MESSAGE_INSIDE,
                    line: 1
                },
                {
                    message: NEVER_MESSAGE_INSIDE,
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
                    message: NEVER_MESSAGE_INSIDE,
                    line: 1
                },
                {
                    message: NEVER_MESSAGE_INSIDE,
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
                    message: NEVER_MESSAGE_INSIDE,
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
                    message: NEVER_MESSAGE_INSIDE,
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
                    message: ALWAYS_MESSAGE_INSIDE,
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
                    message: NEVER_MESSAGE_INSIDE,
                    line: 1,
                    column: 1
                }
            ]
        },
        {
            code: "{\n\n// comment\nif (\n// comment\n a) {}\n}",
            output: "{\n// comment\nif (\n// comment\n a) {}\n}",
            options: [{blocks: "never"}],
            errors: [
                {
                    message: NEVER_MESSAGE_INSIDE,
                    line: 1,
                    column: 1
                }
            ]
        },
        {
            code: "switch (a) {\n\ncase 0: foo();\n}",
            output: "switch (a) {\ncase 0: foo();\n}",
            options: [{switches: "never"}],
            errors: [
                {
                    message: NEVER_MESSAGE_INSIDE,
                    line: 1,
                    column: 12
                }
            ]
        },
        {
            code: "switch (a) {\ncase 0: foo();\n\n  }",
            output: "switch (a) {\ncase 0: foo();\n  }",
            options: [{switches: "never"}],
            errors: [
                {
                    message: NEVER_MESSAGE_INSIDE,
                    line: 4,
                    column: 3
                }
            ]
        },
        {
            code: "class A {\n\nconstructor(){\n\nfoo();\n\n}\n\n}",
            output: "class A {\nconstructor(){\n\nfoo();\n\n}\n}",
            parserOptions: { ecmaVersion: 6 },
            options: [{classes: "never"}],
            errors: [
                {
                    message: NEVER_MESSAGE_INSIDE,
                    line: 1
                },
                {
                    message: NEVER_MESSAGE_INSIDE,
                    line: 9
                }
            ]
        },
        {
            code: "class A {\n\nconstructor(){\n\nfoo();\n\n}\n\n}",
            output: "class A {\nconstructor(){\nfoo();\n}\n}",
            parserOptions: { ecmaVersion: 6 },
            options: [{blocks: "never", classes: "never"}],
            errors: [
                {
                    message: NEVER_MESSAGE_INSIDE,
                    line: 1
                },
                {
                    message: NEVER_MESSAGE_INSIDE,
                    line: 3
                },
                {
                    message: NEVER_MESSAGE_INSIDE,
                    line: 7
                },
                {
                    message: NEVER_MESSAGE_INSIDE,
                    line: 9
                }
            ]
        },

        // Outside:
        {
            code: "switch (a) {\ncase 1: break;\ncase 2: { c(); }\n}",
            output: "switch (a) {\ncase 1: break;\n\ncase 2: { c(); }\n}",
            options: [{ inside: "never", above: "always", below: "always" }],
            errors: [
                {
                    message: ALWAYS_MESSAGE_OUTSIDE,
                    line: 3
                }
            ]
        },

        // Empty blocks should still be checked:
        {
            code: "if (a) {}\nc();",
            output: "if (a) {}\n\nc();",
            options: [{ inside: "never", above: "always", below: "always" }],
            errors: [
                {
                    message: ALWAYS_MESSAGE_OUTSIDE,
                    line: 1
                }
            ]
        },
        {
            code: "if (a) {}\n\n//test\n\n{}",
            output: "if (a) {}\n//test\n{}",
            options: [{ inside: "never", above: "never", below: "never" }],
            errors: [
                {
                    message: NEVER_MESSAGE_OUTSIDE,
                    line: 1
                },
                {
                    message: NEVER_MESSAGE_OUTSIDE,
                    line: 5
                }
            ]
        },
        {
            code: "if (a) {}\n//test\n{}",
            output: "if (a) {}\n\n//test\n\n{}",
            options: [{ inside: "never", above: "always", below: "always" }],
            errors: [
                {
                    message: ALWAYS_MESSAGE_OUTSIDE,
                    line: 1
                },
                {
                    message: ALWAYS_MESSAGE_OUTSIDE,
                    line: 3
                }
            ]
        },
        {
            code: "if (a) {}\n\n{}",
            output: "if (a) {}\n{}",
            options: [{ inside: "never", above: "never", below: "never" }],
            errors: [
                {
                    message: NEVER_MESSAGE_OUTSIDE,
                    line: 1
                },
                {
                    message: NEVER_MESSAGE_OUTSIDE,
                    line: 3
                }
            ]
        },
        {
            code: "if (a) {}\n{}",
            output: "if (a) {}\n\n{}",
            options: [{ inside: "never", above: "always", below: "always" }],
            errors: [
                {
                    message: ALWAYS_MESSAGE_OUTSIDE,
                    line: 1
                },
                {
                    message: ALWAYS_MESSAGE_OUTSIDE,
                    line: 2
                }
            ]
        },
        {
            code: "if (a) {\nc();\n}\n\nvar b = 3;",
            output: "if (a) {\nc();\n}\nvar b = 3;",
            options: [{ inside: "never", above: "never", below: "never" }],
            errors: [
                {
                    message: NEVER_MESSAGE_OUTSIDE,
                    line: 3
                }
            ]
        },
        {
            code: "var c = 3;\n\nif (a) {\nc();\n}\n\nvar b = 3;",
            output: "var c = 3;\nif (a) {\nc();\n}\n\nvar b = 3;",
            options: [{ inside: "never", above: "never" }],
            errors: [
                {
                    message: NEVER_MESSAGE_OUTSIDE,
                    line: 3
                }
            ]
        },
        {
            code: "var e = 123;\nvar a = function() {\nc();\n}\nvar b = 3;",
            output: "var e = 123;\n\nvar a = function() {\nc();\n}\n\nvar b = 3;",
            options: [{ inside: "never", above: "always", below: "always" }],
            errors: [
                {
                    message: ALWAYS_MESSAGE_OUTSIDE,
                    line: 2
                },
                {
                    message: ALWAYS_MESSAGE_OUTSIDE,
                    line: 4
                }
            ]
        },
        {
            code: "class A {\nconstructor(){}\nb() {}\n\nc() {}\n}",
            output: "class A {\nconstructor(){}\nb() {}\nc() {}\n}",
            parserOptions: { ecmaVersion: 6 },
            options: [{inside: "never", above: "never", below: "never"}],
            errors: [
                {
                    message: NEVER_MESSAGE_OUTSIDE,
                    line: 3
                },
                {
                    message: NEVER_MESSAGE_OUTSIDE,
                    line: 5
                }
            ]
        },
        {
            code: "class A {\nconstructor(){}\nb() {}\n\nc() {}\n}",
            output: "class A {\nconstructor(){}\n\nb() {}\n\nc() {}\n}",
            parserOptions: { ecmaVersion: 6 },
            options: [{inside: "never", above: "always", below: "always"}],
            errors: [
                {
                    message: ALWAYS_MESSAGE_OUTSIDE,
                    line: 2
                },
                {
                    message: ALWAYS_MESSAGE_OUTSIDE,
                    line: 3
                }
            ]
        },

        // above/below classes and switches:
        {
            code: "var a = 5;\nclass A {\nconstructor(){}\n}\n\nvar b = 3;",
            output: "var a = 5;\n\nclass A {\nconstructor(){}\n}\nvar b = 3;",
            parserOptions: { ecmaVersion: 6 },
            options: [{ inside: "never", above: "always", below: "never" }],
            errors: [
                {
                    message: ALWAYS_MESSAGE_OUTSIDE,
                    line: 2
                },
                {
                    message: NEVER_MESSAGE_OUTSIDE,
                    line: 4
                }
            ]
        },
        {
            code: "var a = 5;\nswitch (a) {\ncase 1: break;\n}\n\nvar b = 3;",
            output: "var a = 5;\n\nswitch (a) {\ncase 1: break;\n}\nvar b = 3;",
            options: [{ inside: "never", above: "always", below: "never" }],
            errors: [
                {
                    message: ALWAYS_MESSAGE_OUTSIDE,
                    line: 2
                },
                {
                    message: NEVER_MESSAGE_OUTSIDE,
                    line: 4
                }
            ]
        }
    ]
});
