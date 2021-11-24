/**
 * @fileoverview Tests for semi-style rule.
 * @author Toru Nagashima
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/semi-style"),
    { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("semi-style", rule, {
    valid: [
        ";",
        ";foo;bar;baz;",
        "foo;\nbar;",
        "for(a;b;c);",
        "for(a;\nb;\nc);",
        "for((a\n);\n(b\n);\n(c));",
        "if(a)foo;\nbar",
        { code: ";", options: ["last"] },
        { code: ";foo;bar;baz;", options: ["last"] },
        { code: "foo;\nbar;", options: ["last"] },
        { code: "for(a;b;c);", options: ["last"] },
        { code: "for(a;\nb;\nc);", options: ["last"] },
        { code: "for((a\n);\n(b\n);\n(c));", options: ["last"] },
        { code: "class C { a; b; }", options: ["last"], parserOptions: { ecmaVersion: 2022 } },
        { code: "class C {\na;\nb;\n}", options: ["last"], parserOptions: { ecmaVersion: 2022 } },
        { code: "if(a)foo;\nbar", options: ["last"] },
        { code: ";", options: ["first"] },
        { code: ";foo;bar;baz;", options: ["first"] },
        { code: "foo\n;bar;", options: ["first"] },
        { code: "for(a;b;c);", options: ["first"] },
        { code: "for(a;\nb;\nc);", options: ["first"] },
        { code: "for((a\n);\n(b\n);\n(c));", options: ["first"] },
        { code: "class C { a ;b }", options: ["first"], parserOptions: { ecmaVersion: 2022 } },
        { code: "class C {\na\n;b\n}", options: ["first"], parserOptions: { ecmaVersion: 2022 } },

        // edge cases
        {
            code: `
                {
                    ;
                }
            `,
            options: ["first"]
        },
        {
            code: `
                while (a)
                    ;
                foo
            `,
            options: ["first"]
        },
        {
            code: `
                do
                    ;
                while (a)
            `,
            options: ["first"]
        },
        {
            code: `
                do
                    foo;
                while (a)
            `,
            options: ["first"]
        },
        {
            code: `
                if (a)
                    foo;
                else
                    bar
            `,
            options: ["first"]
        },
        {
            code: `
                if (a)
                    foo
                ;bar
            `,
            options: ["first"]
        },
        {
            code: `
                {
                    ;
                }
            `,
            options: ["last"]
        },
        {
            code: `
                switch (a) {
                    case 1:
                        ;foo
                }
            `,
            options: ["last"]
        },
        {
            code: `
                while (a)
                    ;
                foo
            `,
            options: ["last"]
        },
        {
            code: `
                do
                    ;
                while (a)
            `,
            options: ["last"]
        },

        // Class static blocks
        {
            code: `
                class C {
                    static {}
                }
            `,
            options: ["last"],
            parserOptions: { ecmaVersion: 2022 }
        },
        {
            code: `
                class C {
                    static {
                        foo
                    }
                }
            `,
            options: ["last"],
            parserOptions: { ecmaVersion: 2022 }
        },
        {
            code: `
                class C {
                    static {
                        foo
                        bar
                    }
                }
            `,
            options: ["last"],
            parserOptions: { ecmaVersion: 2022 }
        },
        {
            code: `
                class C {
                    static {
                        ;
                    }
                }
            `,
            options: ["last"],
            parserOptions: { ecmaVersion: 2022 }
        },
        {
            code: `
                class C {
                    static {
                        foo;
                    }
                }
            `,
            options: ["last"],
            parserOptions: { ecmaVersion: 2022 }
        },
        {
            code: `
                class C {
                    static {
                        foo;
                        bar;
                    }
                }
            `,
            options: ["last"],
            parserOptions: { ecmaVersion: 2022 }
        },
        {
            code: `
                class C {
                    static {
                        foo;
                        bar;
                        baz;
                    }
                }
            `,
            options: ["last"],
            parserOptions: { ecmaVersion: 2022 }
        },
        {
            code: `
                class C {
                    static {}
                }
            `,
            options: ["first"],
            parserOptions: { ecmaVersion: 2022 }
        },
        {
            code: `
                class C {
                    static {
                        foo
                    }
                }
            `,
            options: ["first"],
            parserOptions: { ecmaVersion: 2022 }
        },
        {
            code: `
                class C {
                    static {
                        foo
                        bar
                    }
                }
            `,
            options: ["first"],
            parserOptions: { ecmaVersion: 2022 }
        },
        {
            code: `
                class C {
                    static {
                        ;
                    }
                }
            `,
            options: ["first"],
            parserOptions: { ecmaVersion: 2022 }
        },
        {
            code: `
                class C {
                    static {
                        ;foo
                    }
                }
            `,
            options: ["first"],
            parserOptions: { ecmaVersion: 2022 }
        },
        {
            code: `
                class C {
                    static {
                        foo;
                    }
                }
            `,
            options: ["first"],
            parserOptions: { ecmaVersion: 2022 }
        },
        {
            code: `
                class C {
                    static {
                        foo
                        ;bar
                    }
                }
            `,
            options: ["first"],
            parserOptions: { ecmaVersion: 2022 }
        },
        {
            code: `
                class C {
                    static {
                        foo
                        ;bar;
                    }
                }
            `,
            options: ["first"],
            parserOptions: { ecmaVersion: 2022 }
        },
        {
            code: `
                class C {
                    static {
                        foo
                        ;bar
                        ;baz
                    }
                }
            `,
            options: ["first"],
            parserOptions: { ecmaVersion: 2022 }
        },
        {
            code: `
                class C {
                    static {
                        foo
                        ;bar
                        ;baz;
                    }
                }
            `,
            options: ["first"],
            parserOptions: { ecmaVersion: 2022 }
        }
    ],
    invalid: [
        {
            code: "foo\n;bar",
            output: "foo;\nbar",
            errors: [{
                messageId: "expectedSemiColon",
                data: {
                    pos: "the end of the previous line"
                }
            }]
        },
        {
            code: "if(a)foo\n;bar",
            output: "if(a)foo;\nbar",
            errors: [{
                messageId: "expectedSemiColon",
                data: {
                    pos: "the end of the previous line"
                }
            }]
        },
        {
            code: "var foo\n;bar",
            output: "var foo;\nbar",
            errors: [{
                messageId: "expectedSemiColon",
                data: {
                    pos: "the end of the previous line"
                }
            }]
        },
        {
            code: "foo\n;\nbar",
            output: "foo;\nbar",
            errors: [{
                messageId: "expectedSemiColon",
                data: {
                    pos: "the end of the previous line"
                }
            }]
        },
        {
            code: "for(a\n;b;c)d",
            output: "for(a;\nb;c)d",
            errors: [{
                messageId: "expectedSemiColon",
                data: {
                    pos: "the end of the previous line"
                }
            }]
        },
        {
            code: "for(a;b\n;c)d",
            output: "for(a;b;\nc)d",
            errors: [{
                messageId: "expectedSemiColon",
                data: {
                    pos: "the end of the previous line"
                }
            }]
        },
        {
            code: "do;while(a)\n;b",
            output: "do;while(a);\nb",
            errors: [{
                messageId: "expectedSemiColon",
                data: {
                    pos: "the end of the previous line"
                }
            }]
        },

        {
            code: "foo\n;bar",
            output: "foo;\nbar",
            options: ["last"],
            errors: [{
                messageId: "expectedSemiColon",
                data: {
                    pos: "the end of the previous line"
                }
            }]
        },
        {
            code: "if(a)foo\n;bar",
            output: "if(a)foo;\nbar",
            options: ["last"],
            errors: [{
                messageId: "expectedSemiColon",
                data: {
                    pos: "the end of the previous line"
                }
            }]
        },
        {
            code: "var foo\n;bar",
            output: "var foo;\nbar",
            options: ["last"],
            errors: [{
                messageId: "expectedSemiColon",
                data: {
                    pos: "the end of the previous line"
                }
            }]
        },
        {
            code: "foo\n;\nbar",
            output: "foo;\nbar",
            options: ["last"],
            errors: [{
                messageId: "expectedSemiColon",
                data: {
                    pos: "the end of the previous line"
                }
            }]
        },
        {
            code: "for(a\n;b;c)d",
            output: "for(a;\nb;c)d",
            options: ["last"],
            errors: [{
                messageId: "expectedSemiColon",
                data: {
                    pos: "the end of the previous line"
                }
            }]
        },
        {
            code: "for(a;b\n;c)d",
            output: "for(a;b;\nc)d",
            options: ["last"],
            errors: [{
                messageId: "expectedSemiColon",
                data: {
                    pos: "the end of the previous line"
                }
            }]
        },
        {
            code: "foo()\n;",
            output: "foo();\n",
            options: ["last"],
            errors: [{
                messageId: "expectedSemiColon",
                data: {
                    pos: "the end of the previous line"
                }
            }]
        },

        {
            code: "foo;\nbar",
            output: "foo\n;bar",
            options: ["first"],
            errors: [{
                messageId: "expectedSemiColon",
                data: {
                    pos: "the beginning of the next line"
                }
            }]
        },
        {
            code: "if(a)foo;\nbar",
            output: "if(a)foo\n;bar",
            options: ["first"],
            errors: [{
                messageId: "expectedSemiColon",
                data: {
                    pos: "the beginning of the next line"
                }
            }]
        },
        {
            code: "var foo;\nbar",
            output: "var foo\n;bar",
            options: ["first"],
            errors: [{
                messageId: "expectedSemiColon",
                data: {
                    pos: "the beginning of the next line"
                }
            }]
        },
        {
            code: "foo\n;\nbar",
            output: "foo\n;bar",
            options: ["first"],
            errors: [{
                messageId: "expectedSemiColon",
                data: {
                    pos: "the beginning of the next line"
                }
            }]
        },
        {
            code: "for(a\n;b;c)d",
            output: "for(a;\nb;c)d",
            options: ["first"],
            errors: [{
                messageId: "expectedSemiColon",
                data: {
                    pos: "the end of the previous line"
                }
            }]
        },
        {
            code: "for(a;b\n;c)d",
            output: "for(a;b;\nc)d",
            options: ["first"],
            errors: [{
                messageId: "expectedSemiColon",
                data: {
                    pos: "the end of the previous line"
                }
            }]
        },

        {
            code: "foo\n;/**/bar",
            output: null,
            errors: [{
                messageId: "expectedSemiColon",
                data: {
                    pos: "the end of the previous line"
                }
            }]
        },
        {
            code: "foo\n/**/;bar",
            output: null,
            errors: [{
                messageId: "expectedSemiColon",
                data: {
                    pos: "the end of the previous line"
                }
            }]
        },

        {
            code: "foo;\n/**/bar",
            output: null,
            options: ["first"],
            errors: [{
                messageId: "expectedSemiColon",
                data: {
                    pos: "the beginning of the next line"
                }
            }]
        },
        {
            code: "foo/**/;\nbar",
            output: null,
            options: ["first"],
            errors: [{
                messageId: "expectedSemiColon",
                data: {
                    pos: "the beginning of the next line"
                }
            }]
        },

        // Class fields
        {
            code: "class C { foo\n;bar }",
            output: "class C { foo;\nbar }",
            options: ["last"],
            parserOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "expectedSemiColon",
                data: {
                    pos: "the end of the previous line"
                }
            }]
        },
        {
            code: "class C { foo;\nbar }",
            output: "class C { foo\n;bar }",
            options: ["first"],
            parserOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "expectedSemiColon",
                data: {
                    pos: "the beginning of the next line"
                }
            }]
        },

        // Class static blocks
        {
            code: "class C { static { foo\n; } }",
            output: "class C { static { foo;\n} }",
            options: ["last"],
            parserOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "expectedSemiColon",
                data: {
                    pos: "the end of the previous line"
                }
            }]
        },
        {
            code: "class C { static { foo\n ;bar } }",
            output: "class C { static { foo;\nbar } }",
            options: ["last"],
            parserOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "expectedSemiColon",
                data: {
                    pos: "the end of the previous line"
                }
            }]
        },
        {
            code: "class C { static { foo;\nbar\n ; } }",
            output: "class C { static { foo;\nbar;\n} }",
            options: ["last"],
            parserOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "expectedSemiColon",
                data: {
                    pos: "the end of the previous line"
                }
            }]
        },
        {
            code: "class C { static { foo;\nbar } }",
            output: "class C { static { foo\n;bar } }",
            options: ["first"],
            parserOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "expectedSemiColon",
                data: {
                    pos: "the beginning of the next line"
                }
            }]
        }
    ]
});
