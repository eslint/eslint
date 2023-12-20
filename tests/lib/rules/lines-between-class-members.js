/**
 * @fileoverview Tests for lines-between-class-members rule.
 * @author 薛定谔的猫<hh_2013@foxmail.com>
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/lines-between-class-members");
const RuleTester = require("../../../lib/rule-tester/flat-rule-tester");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

const alwaysError = { messageId: "always" };
const neverError = { messageId: "never" };

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({ languageOptions: { ecmaVersion: 2022 } });

ruleTester.run("lines-between-class-members", rule, {
    valid: [
        "class foo{}",
        "class foo{;;}",
        "class foo{\n\n}",
        "class foo{constructor(){}\n}",
        "class foo{\nconstructor(){}}",

        "class foo{ bar(){}\n\nbaz(){}}",
        "class foo{ bar(){}\n\n/*comments*/baz(){}}",
        "class foo{ bar(){}\n\n//comments\nbaz(){}}",
        "class foo{ bar(){}\n//comments\n\nbaz(){}}",
        "class A{ foo() {} // a comment\n\nbar() {}}",
        "class A{ foo() {}\n/* a */ /* b */\n\nbar() {}}",
        "class A{ foo() {}/* a */ \n\n /* b */bar() {}}",

        "class A {\nfoo() {}\n/* comment */;\n;\n\nbar() {}\n}",
        "class A {\nfoo() {}\n// comment\n\n;\n;\nbar() {}\n}",

        "class foo{ bar(){}\n\n;;baz(){}}",
        "class foo{ bar(){};\n\nbaz(){}}",

        "class C {\naaa;\n\n#bbb;\n\nccc(){}\n\n#ddd(){}\n}",

        { code: "class foo{ bar(){}\nbaz(){}}", options: ["never"] },
        {
            code: "class foo{ bar(){}\n/*comments*/baz(){}}",
            options: ["never"]
        },
        {
            code: "class foo{ bar(){}\n//comments\nbaz(){}}",
            options: ["never"]
        },
        {
            code: "class foo{ bar(){}/* comments\n\n*/baz(){}}",
            options: ["never"]
        },
        {
            code: "class foo{ bar(){}/* \ncomments\n*/baz(){}}",
            options: ["never"]
        },
        {
            code: "class foo{ bar(){}\n/* \ncomments\n*/\nbaz(){}}",
            options: ["never"]
        },

        { code: "class foo{ bar(){}\n\nbaz(){}}", options: ["always"] },
        {
            code: "class foo{ bar(){}\n\n/*comments*/baz(){}}",
            options: ["always"]
        },
        {
            code: "class foo{ bar(){}\n\n//comments\nbaz(){}}",
            options: ["always"]
        },

        {
            code: "class foo{ bar(){}\nbaz(){}}",
            options: ["always", { exceptAfterSingleLine: true }]
        },
        {
            code: "class foo{ bar(){\n}\n\nbaz(){}}",
            options: ["always", { exceptAfterSingleLine: true }]
        },
        {
            code: "class foo{\naaa;\n#bbb;\nccc(){\n}\n\n#ddd(){\n}\n}",
            options: ["always", { exceptAfterSingleLine: true }]
        },

        // semicolon-less style (semicolons are at the beginning of lines)
        { code: "class C { foo\n\n;bar }", options: ["always"] },
        {
            code: "class C { foo\n;bar }",
            options: ["always", { exceptAfterSingleLine: true }]
        },
        { code: "class C { foo\n;bar }", options: ["never"] },

        // enforce option with blankLine: "always"
        {
            code: `
              class MyClass {
                constructor(height, width) {
                    this.height = height;
                    this.width = width;
                }
                fieldA = 'Field A';
                #fieldB = 'Field B';

                method1() {}

                get area() {
                    return this.method1();
                }

                method2() {}
              }
            `,
            options: [
                {
                    enforce: [
                        { blankLine: "always", prev: "method", next: "method" }
                    ]
                }
            ]
        },
        {
            code: `
              class MyClass {
                constructor(height, width) {
                    this.height = height;
                    this.width = width;
                }

                fieldA = 'Field A';

                #fieldB = 'Field B';

                method1() {}

                get area() {
                    return this.method1();
                }

                method2() {}
              }
            `,
            options: [
                {
                    enforce: [
                        { blankLine: "always", prev: "method", next: "method" }
                    ]
                }
            ]
        },
        {
            code: `
              class MyClass {
                constructor(height, width) {
                    this.height = height;
                    this.width = width;
                }

                fieldA = 'Field A';
                #fieldB = 'Field B';

                method1() {}
                get area() {
                    return this.method1();
                }
                method2() {}
              }
            `,
            options: [
                {
                    enforce: [
                        { blankLine: "always", prev: "method", next: "field" }
                    ]
                }
            ]
        },
        {
            code: `
              class MyClass {
                constructor(height, width) {
                    this.height = height;
                    this.width = width;
                }

                fieldA = 'Field A';

                #fieldB = 'Field B';

                method1() {}

                get area() {
                    return this.method1();
                }

                method2() {}
              }
            `,
            options: [
                {
                    enforce: [
                        { blankLine: "always", prev: "method", next: "field" }
                    ]
                }
            ]
        },
        {
            code: `
              class MyClass {
                constructor(height, width) {
                    this.height = height;
                    this.width = width;
                }

                fieldA = 'Field A';
                #fieldB = 'Field B';

                method1() {}

                get area() {
                    return this.method1();
                }

                method2() {}
              }
            `,
            options: [
                {
                    enforce: [
                        { blankLine: "always", prev: "method", next: "*" }
                    ]
                }
            ]
        },
        {
            code: `
              class MyClass {
                constructor(height, width) {
                    this.height = height;
                    this.width = width;
                }

                fieldA = 'Field A';
                #fieldB = 'Field B';

                method1() {}
                get area() {
                    return this.method1();
                }
                method2() {}
              }
            `,
            options: [
                {
                    enforce: [
                        { blankLine: "always", prev: "field", next: "method" }
                    ]
                }
            ]
        },

        {
            code: `
              class MyClass {
                constructor(height, width) {
                    this.height = height;
                    this.width = width;
                }
                fieldA = 'Field A';

                #fieldB = 'Field B';
                method1() {}
                get area() {
                    return this.method1();
                }
                method2() {}
              }
            `,
            options: [
                {
                    enforce: [
                        { blankLine: "always", prev: "field", next: "field" }
                    ]
                }
            ]
        },
        {
            code: `
              class MyClass {
                constructor(height, width) {
                    this.height = height;
                    this.width = width;
                }
                fieldA = 'Field A';

                #fieldB = 'Field B';

                method1() {}
                get area() {
                    return this.method1();
                }
                method2() {}
              }
            `,
            options: [
                {
                    enforce: [
                        { blankLine: "always", prev: "field", next: "*" }
                    ]
                }
            ]
        },
        {
            code: `
              class MyClass {
                constructor(height, width) {
                    this.height = height;
                    this.width = width;
                }

                fieldA = 'Field A';
                #fieldB = 'Field B';

                method1() {}

                get area() {
                    return this.method1();
                }

                method2() {}
              }
            `,
            options: [
                {
                    enforce: [
                        { blankLine: "always", prev: "*", next: "method" }
                    ]
                }
            ]
        },
        {
            code: `
              class MyClass {
                constructor(height, width) {
                    this.height = height;
                    this.width = width;
                }

                fieldA = 'Field A';

                #fieldB = 'Field B';
                method1() {}
                get area() {
                    return this.method1();
                }
                method2() {}
              }
            `,
            options: [
                {
                    enforce: [
                        { blankLine: "always", prev: "*", next: "field" }
                    ]
                }
            ]
        },
        {
            code: `
              class MyClass {
                constructor(height, width) {
                    this.height = height;
                    this.width = width;
                }

                fieldA = 'Field A';

                #fieldB = 'Field B';

                method1() {}

                get area() {
                    return this.method1();
                }

                method2() {}
              }
            `,
            options: [
                { enforce: [{ blankLine: "always", prev: "*", next: "*" }] }
            ]
        },

        // enforce option - blankLine: "never"
        {
            code: `
              class MyClass {
                constructor(height, width) {
                    this.height = height;
                    this.width = width;
                }
                fieldA = 'Field A';
                #fieldB = 'Field B';
                method1() {}
                get area() {
                    return this.method1();
                }
                method2() {}
              }
            `,
            options: [
                {
                    enforce: [
                        { blankLine: "never", prev: "method", next: "method" }
                    ]
                }
            ]
        },
        {
            code: `
              class MyClass {
                constructor(height, width) {
                    this.height = height;
                    this.width = width;
                }

                fieldA = 'Field A';

                #fieldB = 'Field B';

                method1() {}
                get area() {
                    return this.method1();
                }
                method2() {}
              }
            `,
            options: [
                {
                    enforce: [
                        { blankLine: "never", prev: "method", next: "method" }
                    ]
                }
            ]
        },
        {
            code: `
              class MyClass {
                constructor(height, width) {
                    this.height = height;
                    this.width = width;
                }
                fieldA = 'Field A';
                #fieldB = 'Field B';

                method1() {}
                get area() {
                    return this.method1();
                }
                method2() {}
              }
            `,
            options: [
                {
                    enforce: [
                        { blankLine: "never", prev: "method", next: "field" }
                    ]
                }
            ]
        },
        {
            code: `
              class MyClass {
                constructor(height, width) {
                    this.height = height;
                    this.width = width;
                }
                fieldA = 'Field A';

                #fieldB = 'Field B';

                method1() {}

                get area() {
                    return this.method1();
                }

                method2() {}
              }
            `,
            options: [
                {
                    enforce: [
                        { blankLine: "never", prev: "method", next: "field" }
                    ]
                }
            ]
        },
        {
            code: `
              class MyClass {
                constructor(height, width) {
                    this.height = height;
                    this.width = width;
                }
                fieldA = 'Field A';

                #fieldB = 'Field B';

                method1() {}
                get area() {
                    return this.method1();
                }
                method2() {}
              }
            `,
            options: [
                {
                    enforce: [
                        { blankLine: "never", prev: "method", next: "*" }
                    ]
                }
            ]
        },
        {
            code: `
              class MyClass {
                constructor(height, width) {
                    this.height = height;
                    this.width = width;
                }

                fieldA = 'Field A';

                #fieldB = 'Field B';
                method1() {}

                get area() {
                    return this.method1();
                }

                method2() {}
              }
            `,
            options: [
                {
                    enforce: [
                        { blankLine: "never", prev: "field", next: "method" }
                    ]
                }
            ]
        },

        {
            code: `
              class MyClass {
                constructor(height, width) {
                    this.height = height;
                    this.width = width;
                }

                fieldA = 'Field A';
                #fieldB = 'Field B';

                method1() {}

                get area() {
                    return this.method1();
                }

                method2() {}
              }
            `,
            options: [
                {
                    enforce: [
                        { blankLine: "never", prev: "field", next: "field" }
                    ]
                }
            ]
        },
        {
            code: `
              class MyClass {
                constructor(height, width) {
                    this.height = height;
                    this.width = width;
                }

                fieldA = 'Field A';
                #fieldB = 'Field B';
                method1() {}

                get area() {
                    return this.method1();
                }

                method2() {}
              }
            `,
            options: [
                {
                    enforce: [{ blankLine: "never", prev: "field", next: "*" }]
                }
            ]
        },
        {
            code: `
              class MyClass {
                constructor(height, width) {
                    this.height = height;
                    this.width = width;
                }

                fieldA = 'Field A';

                #fieldB = 'Field B';
                method1() {}
                get area() {
                    return this.method1();
                }
                method2() {}
              }
            `,
            options: [
                {
                    enforce: [
                        { blankLine: "never", prev: "*", next: "method" }
                    ]
                }
            ]
        },
        {
            code: `
              class MyClass {
                constructor(height, width) {
                    this.height = height;
                    this.width = width;
                }
                fieldA = 'Field A';
                #fieldB = 'Field B';

                method1() {}

                get area() {
                    return this.method1();
                }
                method2() {}
              }
            `,
            options: [
                {
                    enforce: [{ blankLine: "never", prev: "*", next: "field" }]
                }
            ]
        },
        {
            code: `
              class MyClass {
                constructor(height, width) {
                    this.height = height;
                    this.width = width;
                }
                fieldA = 'Field A';
                #fieldB = 'Field B';
                method1() {}
                get area() {
                    return this.method1();
                }
                method2() {}
              }
            `,
            options: [
                { enforce: [{ blankLine: "never", prev: "*", next: "*" }] }
            ]
        },

        // enforce option - multiple configurations
        {
            code: `
              class MyClass {
                constructor(height, width) {
                    this.height = height;
                    this.width = width;
                }

                fieldA = 'Field A';
                #fieldB = 'Field B';

                method1() {}

                get area() {
                    return this.method1();
                }

                method2() {}
              }
            `,
            options: [
                {

                    // requires blank lines around methods, disallows blank lines between fields
                    enforce: [
                        { blankLine: "always", prev: "*", next: "method" },
                        { blankLine: "always", prev: "method", next: "*" },
                        { blankLine: "never", prev: "field", next: "field" }
                    ]
                }
            ]
        },
        {
            code: `
              class MyClass {
                constructor(height, width) {
                    this.height = height;
                    this.width = width;
                }

                fieldA = 'Field A';

                #fieldB = 'Field B';

                method1() {}
                get area() {
                    return this.method1();
                }
                method2() {}
              }
            `,
            options: [
                {

                    // requires blank lines around fields, disallows blank lines between methods
                    enforce: [
                        { blankLine: "always", prev: "*", next: "field" },
                        { blankLine: "always", prev: "field", next: "*" },
                        { blankLine: "never", prev: "method", next: "method" }
                    ]
                }
            ]
        },
        {
            code: `
              class MyClass {
                constructor(height, width) {
                    this.height = height;
                    this.width = width;
                }

                fieldA = 'Field A';

                #fieldB = 'Field B';

                method1() {}

                get area() {
                    return this.method1();
                }

                method2() {}
              }
            `,
            options: [
                {

                    // requires blank lines around methods and fields
                    enforce: [
                        { blankLine: "always", prev: "*", next: "method" },
                        { blankLine: "always", prev: "method", next: "*" },
                        { blankLine: "always", prev: "field", next: "field" }
                    ]
                }
            ]
        },
        {
            code: `
              class MyClass {
                constructor(height, width) {
                    this.height = height;
                    this.width = width;
                }

                fieldA = 'Field A';

                #fieldB = 'Field B';

                method1() {}

                get area() {
                    return this.method1();
                }

                method2() {}
              }
            `,
            options: [
                {

                    // requires blank lines around methods and fields
                    enforce: [
                        { blankLine: "never", prev: "*", next: "method" },
                        { blankLine: "never", prev: "method", next: "*" },
                        { blankLine: "never", prev: "field", next: "field" },

                        // This should take precedence over the above
                        { blankLine: "always", prev: "*", next: "method" },
                        { blankLine: "always", prev: "method", next: "*" },
                        { blankLine: "always", prev: "field", next: "field" }
                    ]
                }
            ]
        },

        // enforce with exceptAfterSingleLine option
        {
            code: `
              class MyClass {
                constructor(height, width) {
                    this.height = height;
                    this.width = width;
                }

                fieldA = 'Field A';
                #fieldB = 'Field B';
                method1() {}
                get area() {
                    return this.method1();
                }

                method2() {}
              }
            `,
            options: [
                {

                    // requires blank lines around methods and fields
                    enforce: [
                        { blankLine: "always", prev: "*", next: "method" },
                        { blankLine: "always", prev: "method", next: "*" },
                        { blankLine: "always", prev: "field", next: "field" }
                    ]
                },
                {
                    exceptAfterSingleLine: true
                }
            ]
        }
    ],
    invalid: [
        {
            code: "class foo{ bar(){}\nbaz(){}}",
            output: "class foo{ bar(){}\n\nbaz(){}}",
            options: ["always"],
            errors: [alwaysError]
        },
        {
            code: "class foo{ bar(){}\n\nbaz(){}}",
            output: "class foo{ bar(){}\nbaz(){}}",
            options: ["never"],
            errors: [neverError]
        },
        {
            code: "class foo{ bar(){\n}\nbaz(){}}",
            output: "class foo{ bar(){\n}\n\nbaz(){}}",
            options: ["always", { exceptAfterSingleLine: true }],
            errors: [alwaysError]
        },
        {
            code: "class foo{ bar(){\n}\n/* comment */\nbaz(){}}",
            output: "class foo{ bar(){\n}\n\n/* comment */\nbaz(){}}",
            options: ["always", { exceptAfterSingleLine: true }],
            errors: [alwaysError]
        },
        {
            code: "class foo{ bar(){}\n\n// comment\nbaz(){}}",
            output: "class foo{ bar(){}\n// comment\nbaz(){}}",
            options: ["never"],
            errors: [neverError]
        },
        {
            code: "class foo{ bar(){}\n\n/* comment */\nbaz(){}}",
            output: "class foo{ bar(){}\n/* comment */\nbaz(){}}",
            options: ["never"],
            errors: [neverError]
        },
        {
            code: "class foo{ bar(){}\n/* comment-1 */\n\n/* comment-2 */\nbaz(){}}",
            output: "class foo{ bar(){}\n/* comment-1 */\n/* comment-2 */\nbaz(){}}",
            options: ["never"],
            errors: [neverError]
        },
        {
            code: "class foo{ bar(){}\n\n/* comment */\n\nbaz(){}}",
            output: null,
            options: ["never"],
            errors: [neverError]
        },
        {
            code: "class foo{ bar(){}\n\n// comment\n\nbaz(){}}",
            output: null,
            options: ["never"],
            errors: [neverError]
        },
        {
            code: "class foo{ bar(){}\n/* comment-1 */\n\n/* comment-2 */\n\n/* comment-3 */\nbaz(){}}",
            output: null,
            options: ["never"],
            errors: [neverError]
        },
        {
            code: "class foo{ bar(){}\n/* comment-1 */\n\n;\n\n/* comment-3 */\nbaz(){}}",
            output: null,
            options: ["never"],
            errors: [neverError]
        },
        {
            code: "class A {\nfoo() {}// comment\n;\n/* comment */\nbar() {}\n}",
            output: "class A {\nfoo() {}// comment\n\n;\n/* comment */\nbar() {}\n}",
            options: ["always"],
            errors: [alwaysError]
        },
        {
            code: "class A {\nfoo() {}\n/* comment */;\n;\n/* comment */\nbar() {}\n}",
            output: "class A {\nfoo() {}\n\n/* comment */;\n;\n/* comment */\nbar() {}\n}",
            options: ["always"],
            errors: [alwaysError]
        },
        {
            code: "class foo{ bar(){};\nbaz(){}}",
            output: "class foo{ bar(){};\n\nbaz(){}}",
            options: ["always"],
            errors: [alwaysError]
        },
        {
            code: "class foo{ bar(){} // comment \nbaz(){}}",
            output: "class foo{ bar(){} // comment \n\nbaz(){}}",
            options: ["always"],
            errors: [alwaysError]
        },
        {
            code: "class A {\nfoo() {}\n/* comment */;\n;\nbar() {}\n}",
            output: "class A {\nfoo() {}\n\n/* comment */;\n;\nbar() {}\n}",
            options: ["always"],
            errors: [alwaysError]
        },
        {
            code: "class C {\nfield1\nfield2\n}",
            output: "class C {\nfield1\n\nfield2\n}",
            options: ["always"],
            errors: [alwaysError]
        },
        {
            code: "class C {\n#field1\n#field2\n}",
            output: "class C {\n#field1\n\n#field2\n}",
            options: ["always"],
            errors: [alwaysError]
        },
        {
            code: "class C {\nfield1\n\nfield2\n}",
            output: "class C {\nfield1\nfield2\n}",
            options: ["never"],
            errors: [neverError]
        },
        {
            code: "class C {\nfield1 = () => {\n}\nfield2\nfield3\n}",
            output: "class C {\nfield1 = () => {\n}\n\nfield2\nfield3\n}",
            options: ["always", { exceptAfterSingleLine: true }],
            errors: [alwaysError]
        },
        {
            code: "class C { foo;bar }",
            output: "class C { foo;\nbar }",
            options: ["always"],
            errors: [alwaysError]
        },
        {
            code: "class C { foo;\nbar; }",
            output: "class C { foo;\n\nbar; }",
            options: ["always"],
            errors: [alwaysError]
        },
        {
            code: "class C { foo;\n;bar }",
            output: "class C { foo;\n\n;bar }",
            options: ["always"],
            errors: [alwaysError]
        },

        // semicolon-less style (semicolons are at the beginning of lines)
        {
            code: "class C { foo\n;bar }",
            output: "class C { foo\n\n;bar }",
            options: ["always"],
            errors: [alwaysError]
        },
        {
            code: "class C { foo\n\n;bar }",
            output: "class C { foo\n;bar }",
            options: ["never"],
            errors: [neverError]
        },
        {
            code: "class C { foo\n;;bar }",
            output: "class C { foo\n\n;;bar }",
            options: ["always"],
            errors: [alwaysError]
        },

        // enforce option with blankLine: "always"
        {
            code: `
              class MyClass {
                constructor(height, width) {
                    this.height = height;
                    this.width = width;
                }
                fieldA = 'Field A';
                #fieldB = 'Field B';

                method1() {}
                get area() {
                    return this.method1();
                }
                method2() {}
              }
            `,
            output: `
              class MyClass {
                constructor(height, width) {
                    this.height = height;
                    this.width = width;
                }
                fieldA = 'Field A';
                #fieldB = 'Field B';

                method1() {}

                get area() {
                    return this.method1();
                }

                method2() {}
              }
            `,
            options: [
                {
                    enforce: [
                        { blankLine: "always", prev: "method", next: "method" }
                    ]
                }
            ],
            errors: [
                {
                    messageId: "always",
                    line: 11,
                    column: 17
                },
                {
                    messageId: "always",
                    line: 14,
                    column: 17
                }
            ]
        },
        {
            code: `
              class MyClass {
                constructor(height, width) {
                    this.height = height;
                    this.width = width;
                }

                fieldA = 'Field A';

                #fieldB = 'Field B';

                method1() {}
                get area() {
                    return this.method1();
                }
                method2() {}
              }
            `,
            output: `
              class MyClass {
                constructor(height, width) {
                    this.height = height;
                    this.width = width;
                }

                fieldA = 'Field A';

                #fieldB = 'Field B';

                method1() {}

                get area() {
                    return this.method1();
                }

                method2() {}
              }
            `,
            options: [
                {
                    enforce: [
                        { blankLine: "always", prev: "method", next: "method" }
                    ]
                }
            ],
            errors: [
                {
                    messageId: "always",
                    line: 13,
                    column: 17
                },
                {
                    messageId: "always",
                    line: 16,
                    column: 17
                }
            ]
        },
        {
            code: `
              class MyClass {
                constructor(height, width) {
                    this.height = height;
                    this.width = width;
                }
                fieldA = 'Field A';
                #fieldB = 'Field B';

                method1() {}
                get area() {
                    return this.method1();
                }
                method2() {}
              }
            `,
            output: `
              class MyClass {
                constructor(height, width) {
                    this.height = height;
                    this.width = width;
                }

                fieldA = 'Field A';
                #fieldB = 'Field B';

                method1() {}
                get area() {
                    return this.method1();
                }
                method2() {}
              }
            `,
            options: [
                {
                    enforce: [
                        { blankLine: "always", prev: "method", next: "field" }
                    ]
                }
            ],
            errors: [
                {
                    messageId: "always",
                    line: 7,
                    column: 17
                }
            ]
        },
        {
            code: `
              class MyClass {
                constructor(height, width) {
                    this.height = height;
                    this.width = width;
                }
                fieldA = 'Field A';
                #fieldB = 'Field B';
                method1() {}
                get area() {
                    return this.method1();
                }
                method2() {}
              }
            `,
            output: `
              class MyClass {
                constructor(height, width) {
                    this.height = height;
                    this.width = width;
                }

                fieldA = 'Field A';
                #fieldB = 'Field B';
                method1() {}
                get area() {
                    return this.method1();
                }
                method2() {}
              }
            `,
            options: [
                {
                    enforce: [
                        { blankLine: "always", prev: "method", next: "field" }
                    ]
                }
            ],
            errors: [
                {
                    messageId: "always",
                    line: 7,
                    column: 17
                }
            ]
        },
        {
            code: `
              class MyClass {
                constructor(height, width) {
                    this.height = height;
                    this.width = width;
                }
                fieldA = 'Field A';
                #fieldB = 'Field B';

                method1() {}
                get area() {
                    return this.method1();
                }
                method2() {}
              }
            `,
            output: `
              class MyClass {
                constructor(height, width) {
                    this.height = height;
                    this.width = width;
                }

                fieldA = 'Field A';
                #fieldB = 'Field B';

                method1() {}

                get area() {
                    return this.method1();
                }

                method2() {}
              }
            `,
            options: [
                {
                    enforce: [
                        { blankLine: "always", prev: "method", next: "*" }
                    ]
                }
            ],
            errors: [
                {
                    messageId: "always",
                    line: 7,
                    column: 17
                },
                {
                    messageId: "always",
                    line: 11,
                    column: 17
                },
                {
                    messageId: "always",
                    line: 14,
                    column: 17
                }
            ]
        },
        {
            code: `
              class MyClass {
                constructor(height, width) {
                    this.height = height;
                    this.width = width;
                }
                fieldA = 'Field A';
                #fieldB = 'Field B';
                method1() {}
                get area() {
                    return this.method1();
                }
                method2() {}
              }
            `,
            output: `
              class MyClass {
                constructor(height, width) {
                    this.height = height;
                    this.width = width;
                }
                fieldA = 'Field A';
                #fieldB = 'Field B';

                method1() {}
                get area() {
                    return this.method1();
                }
                method2() {}
              }
            `,
            options: [
                {
                    enforce: [
                        { blankLine: "always", prev: "field", next: "method" }
                    ]
                }
            ],
            errors: [
                {
                    messageId: "always",
                    line: 9,
                    column: 17
                }
            ]
        },
        {
            code: `
              class MyClass {
                constructor(height, width) {
                    this.height = height;
                    this.width = width;
                }
                fieldA = 'Field A';
                #fieldB = 'Field B';
                method1() {}
                get area() {
                    return this.method1();
                }
                method2() {}
              }
            `,
            output: `
              class MyClass {
                constructor(height, width) {
                    this.height = height;
                    this.width = width;
                }
                fieldA = 'Field A';

                #fieldB = 'Field B';
                method1() {}
                get area() {
                    return this.method1();
                }
                method2() {}
              }
            `,
            options: [
                {
                    enforce: [
                        { blankLine: "always", prev: "field", next: "field" }
                    ]
                }
            ],
            errors: [
                {
                    messageId: "always",
                    line: 8,
                    column: 17
                }
            ]
        },
        {
            code: `
              class MyClass {
                constructor(height, width) {
                    this.height = height;
                    this.width = width;
                }
                fieldA = 'Field A';
                #fieldB = 'Field B';
                method1() {}
                get area() {
                    return this.method1();
                }
                method2() {}
              }
            `,
            output: `
              class MyClass {
                constructor(height, width) {
                    this.height = height;
                    this.width = width;
                }
                fieldA = 'Field A';

                #fieldB = 'Field B';

                method1() {}
                get area() {
                    return this.method1();
                }
                method2() {}
              }
            `,
            options: [
                {
                    enforce: [
                        { blankLine: "always", prev: "field", next: "*" }
                    ]
                }
            ],
            errors: [
                {
                    messageId: "always",
                    line: 8,
                    column: 17
                },
                {
                    messageId: "always",
                    line: 9,
                    column: 17
                }
            ]
        },
        {
            code: `
              class MyClass {
                constructor(height, width) {
                    this.height = height;
                    this.width = width;
                }
                fieldA = 'Field A';
                #fieldB = 'Field B';
                method1() {}
                get area() {
                    return this.method1();
                }
                method2() {}
              }
            `,
            output: `
              class MyClass {
                constructor(height, width) {
                    this.height = height;
                    this.width = width;
                }
                fieldA = 'Field A';
                #fieldB = 'Field B';

                method1() {}

                get area() {
                    return this.method1();
                }

                method2() {}
              }
            `,
            options: [
                {
                    enforce: [
                        { blankLine: "always", prev: "*", next: "method" }
                    ]
                }
            ],
            errors: [
                {
                    messageId: "always",
                    line: 9,
                    column: 17
                },
                {
                    messageId: "always",
                    line: 10,
                    column: 17
                },
                {
                    messageId: "always",
                    line: 13,
                    column: 17
                }
            ]
        },
        {
            code: `
              class MyClass {
                constructor(height, width) {
                    this.height = height;
                    this.width = width;
                }
                fieldA = 'Field A';
                #fieldB = 'Field B';
                method1() {}
                get area() {
                    return this.method1();
                }
                method2() {}
              }
            `,
            output: `
              class MyClass {
                constructor(height, width) {
                    this.height = height;
                    this.width = width;
                }

                fieldA = 'Field A';

                #fieldB = 'Field B';
                method1() {}
                get area() {
                    return this.method1();
                }
                method2() {}
              }
            `,
            options: [
                {
                    enforce: [
                        { blankLine: "always", prev: "*", next: "field" }
                    ]
                }
            ],
            errors: [
                {
                    messageId: "always",
                    line: 7,
                    column: 17
                },
                {
                    messageId: "always",
                    line: 8,
                    column: 17
                }
            ]
        },
        {
            code: `
              class MyClass {
                constructor(height, width) {
                    this.height = height;
                    this.width = width;
                }
                fieldA = 'Field A';
                #fieldB = 'Field B';
                method1() {}
                get area() {
                    return this.method1();
                }
                method2() {}
              }
            `,
            output: `
              class MyClass {
                constructor(height, width) {
                    this.height = height;
                    this.width = width;
                }

                fieldA = 'Field A';

                #fieldB = 'Field B';

                method1() {}

                get area() {
                    return this.method1();
                }

                method2() {}
              }
            `,
            options: [
                { enforce: [{ blankLine: "always", prev: "*", next: "*" }] }
            ],
            errors: [
                {
                    messageId: "always",
                    line: 7,
                    column: 17
                },
                {
                    messageId: "always",
                    line: 8,
                    column: 17
                },
                {
                    messageId: "always",
                    line: 9,
                    column: 17
                },
                {
                    messageId: "always",
                    line: 10,
                    column: 17
                },
                {
                    messageId: "always",
                    line: 13,
                    column: 17
                }
            ]
        },

        // enforce option - blankLine: "never"
        {
            code: `
              class MyClass {
                constructor(height, width) {
                    this.height = height;
                    this.width = width;
                }
                fieldA = 'Field A';
                #fieldB = 'Field B';
                method1() {}

                get area() {
                    return this.method1();
                }

                method2() {}
              }
            `,
            output: `
              class MyClass {
                constructor(height, width) {
                    this.height = height;
                    this.width = width;
                }
                fieldA = 'Field A';
                #fieldB = 'Field B';
                method1() {}
get area() {
                    return this.method1();
                }
method2() {}
              }
            `,
            options: [
                {
                    enforce: [
                        { blankLine: "never", prev: "method", next: "method" }
                    ]
                }
            ],
            errors: [
                {
                    messageId: "never",
                    line: 11,
                    column: 17
                },
                {
                    messageId: "never",
                    line: 15,
                    column: 17
                }
            ]
        },
        {
            code: `
              class MyClass {
                constructor(height, width) {
                    this.height = height;
                    this.width = width;
                }

                fieldA = 'Field A';

                #fieldB = 'Field B';

                method1() {}

                get area() {
                    return this.method1();
                }

                method2() {}
              }
            `,
            output: `
              class MyClass {
                constructor(height, width) {
                    this.height = height;
                    this.width = width;
                }

                fieldA = 'Field A';

                #fieldB = 'Field B';

                method1() {}
get area() {
                    return this.method1();
                }
method2() {}
              }
            `,
            options: [
                {
                    enforce: [
                        { blankLine: "never", prev: "method", next: "method" }
                    ]
                }
            ],
            errors: [
                {
                    messageId: "never",
                    line: 14,
                    column: 17
                },
                {
                    messageId: "never",
                    line: 18,
                    column: 17
                }
            ]
        },
        {
            code: `
              class MyClass {
                constructor(height, width) {
                    this.height = height;
                    this.width = width;
                }

                fieldA = 'Field A';
                #fieldB = 'Field B';

                method1() {}

                get area() {
                    return this.method1();
                }

                method2() {}
              }
            `,
            output: `
              class MyClass {
                constructor(height, width) {
                    this.height = height;
                    this.width = width;
                }
fieldA = 'Field A';
                #fieldB = 'Field B';

                method1() {}

                get area() {
                    return this.method1();
                }

                method2() {}
              }
            `,
            options: [
                {
                    enforce: [
                        { blankLine: "never", prev: "method", next: "field" }
                    ]
                }
            ],
            errors: [
                {
                    messageId: "never",
                    line: 8,
                    column: 17
                }
            ]
        },
        {
            code: `
              class MyClass {
                constructor(height, width) {
                    this.height = height;
                    this.width = width;
                }

                fieldA = 'Field A';

                #fieldB = 'Field B';

                method1() {}

                get area() {
                    return this.method1();
                }

                method2() {}
              }
            `,
            output: `
              class MyClass {
                constructor(height, width) {
                    this.height = height;
                    this.width = width;
                }
fieldA = 'Field A';

                #fieldB = 'Field B';

                method1() {}

                get area() {
                    return this.method1();
                }

                method2() {}
              }
            `,
            options: [
                {
                    enforce: [
                        { blankLine: "never", prev: "method", next: "field" }
                    ]
                }
            ],
            errors: [
                {
                    messageId: "never",
                    line: 8,
                    column: 17
                }
            ]
        },
        {
            code: `
              class MyClass {
                constructor(height, width) {
                    this.height = height;
                    this.width = width;
                }

                fieldA = 'Field A';

                #fieldB = 'Field B';

                method1() {}

                get area() {
                    return this.method1();
                }

                method2() {}
              }
            `,
            output: `
              class MyClass {
                constructor(height, width) {
                    this.height = height;
                    this.width = width;
                }
fieldA = 'Field A';

                #fieldB = 'Field B';

                method1() {}
get area() {
                    return this.method1();
                }
method2() {}
              }
            `,
            options: [
                {
                    enforce: [
                        { blankLine: "never", prev: "method", next: "*" }
                    ]
                }
            ],
            errors: [
                {
                    messageId: "never",
                    line: 8,
                    column: 17
                },
                {
                    messageId: "never",
                    line: 14,
                    column: 17
                },
                {
                    messageId: "never",
                    line: 18,
                    column: 17
                }
            ]
        },
        {
            code: `
              class MyClass {
                constructor(height, width) {
                    this.height = height;
                    this.width = width;
                }

                fieldA = 'Field A';

                #fieldB = 'Field B';

                method1() {}

                get area() {
                    return this.method1();
                }

                method2() {}
              }
            `,
            output: `
              class MyClass {
                constructor(height, width) {
                    this.height = height;
                    this.width = width;
                }

                fieldA = 'Field A';

                #fieldB = 'Field B';
method1() {}

                get area() {
                    return this.method1();
                }

                method2() {}
              }
            `,
            options: [
                {
                    enforce: [
                        { blankLine: "never", prev: "field", next: "method" }
                    ]
                }
            ],
            errors: [
                {
                    messageId: "never",
                    line: 12,
                    column: 17
                }
            ]
        },
        {
            code: `
              class MyClass {
                constructor(height, width) {
                    this.height = height;
                    this.width = width;
                }

                fieldA = 'Field A';

                #fieldB = 'Field B';

                method1() {}

                get area() {
                    return this.method1();
                }

                method2() {}
              }
            `,
            output: `
              class MyClass {
                constructor(height, width) {
                    this.height = height;
                    this.width = width;
                }

                fieldA = 'Field A';
#fieldB = 'Field B';

                method1() {}

                get area() {
                    return this.method1();
                }

                method2() {}
              }
            `,
            options: [
                {
                    enforce: [
                        { blankLine: "never", prev: "field", next: "field" }
                    ]
                }
            ],
            errors: [
                {
                    messageId: "never",
                    line: 10,
                    column: 17
                }
            ]
        },
        {
            code: `
              class MyClass {
                constructor(height, width) {
                    this.height = height;
                    this.width = width;
                }

                fieldA = 'Field A';

                #fieldB = 'Field B';

                method1() {}

                get area() {
                    return this.method1();
                }

                method2() {}
              }
            `,
            output: `
              class MyClass {
                constructor(height, width) {
                    this.height = height;
                    this.width = width;
                }

                fieldA = 'Field A';
#fieldB = 'Field B';
method1() {}

                get area() {
                    return this.method1();
                }

                method2() {}
              }
            `,
            options: [
                {
                    enforce: [
                        { blankLine: "never", prev: "field", next: "*" }
                    ]
                }
            ],
            errors: [
                {
                    messageId: "never",
                    line: 10,
                    column: 17
                },
                {
                    messageId: "never",
                    line: 12,
                    column: 17
                }
            ]
        },
        {
            code: `
              class MyClass {
                constructor(height, width) {
                    this.height = height;
                    this.width = width;
                }

                fieldA = 'Field A';

                #fieldB = 'Field B';

                method1() {}

                get area() {
                    return this.method1();
                }

                method2() {}
              }
            `,
            output: `
              class MyClass {
                constructor(height, width) {
                    this.height = height;
                    this.width = width;
                }

                fieldA = 'Field A';

                #fieldB = 'Field B';
method1() {}
get area() {
                    return this.method1();
                }
method2() {}
              }
            `,
            options: [
                {
                    enforce: [
                        { blankLine: "never", prev: "*", next: "method" }
                    ]
                }
            ],
            errors: [
                {
                    messageId: "never",
                    line: 12,
                    column: 17
                },
                {
                    messageId: "never",
                    line: 14,
                    column: 17
                },
                {
                    messageId: "never",
                    line: 18,
                    column: 17
                }
            ]
        },
        {
            code: `
              class MyClass {
                constructor(height, width) {
                    this.height = height;
                    this.width = width;
                }

                fieldA = 'Field A';

                #fieldB = 'Field B';

                method1() {}

                get area() {
                    return this.method1();
                }
                method2() {}
              }
            `,
            output: `
              class MyClass {
                constructor(height, width) {
                    this.height = height;
                    this.width = width;
                }
fieldA = 'Field A';
#fieldB = 'Field B';

                method1() {}

                get area() {
                    return this.method1();
                }
                method2() {}
              }
            `,
            options: [
                {
                    enforce: [
                        { blankLine: "never", prev: "*", next: "field" }
                    ]
                }
            ],
            errors: [
                {
                    messageId: "never",
                    line: 8,
                    column: 17
                },
                {
                    messageId: "never",
                    line: 10,
                    column: 17
                }
            ]
        },
        {
            code: `
              class MyClass {
                constructor(height, width) {
                    this.height = height;
                    this.width = width;
                }

                fieldA = 'Field A';

                #fieldB = 'Field B';

                method1() {}

                get area() {
                    return this.method1();
                }

                method2() {}
              }
            `,
            output: `
              class MyClass {
                constructor(height, width) {
                    this.height = height;
                    this.width = width;
                }
fieldA = 'Field A';
#fieldB = 'Field B';
method1() {}
get area() {
                    return this.method1();
                }
method2() {}
              }
            `,
            options: [
                { enforce: [{ blankLine: "never", prev: "*", next: "*" }] }
            ],
            errors: [
                {
                    messageId: "never",
                    line: 8,
                    column: 17
                },
                {
                    messageId: "never",
                    line: 10,
                    column: 17
                },
                {
                    messageId: "never",
                    line: 12,
                    column: 17
                },
                {
                    messageId: "never",
                    line: 14,
                    column: 17
                }, {
                    messageId: "never",
                    line: 18,
                    column: 17
                }
            ]
        },

        // enforce option - multiple configurations
        {
            code: `
              class MyClass {
                constructor(height, width) {
                    this.height = height;
                    this.width = width;
                }
                fieldA = 'Field A';

                #fieldB = 'Field B';
                method1() {}
                get area() {
                    return this.method1();
                }
                method2() {}
              }
            `,
            output: `
              class MyClass {
                constructor(height, width) {
                    this.height = height;
                    this.width = width;
                }

                fieldA = 'Field A';
#fieldB = 'Field B';

                method1() {}

                get area() {
                    return this.method1();
                }

                method2() {}
              }
            `,
            options: [
                {

                    // requires blank lines around methods, disallows blank lines between fields
                    enforce: [
                        { blankLine: "always", prev: "*", next: "method" },
                        { blankLine: "always", prev: "method", next: "*" },
                        { blankLine: "never", prev: "field", next: "field" }
                    ]
                }
            ],
            errors: [
                {
                    messageId: "always",
                    line: 7,
                    column: 17
                },
                {
                    messageId: "never",
                    line: 9,
                    column: 17
                },
                {
                    messageId: "always",
                    line: 10,
                    column: 17
                },
                {
                    messageId: "always",
                    line: 11,
                    column: 17
                }, {
                    messageId: "always",
                    line: 14,
                    column: 17
                }
            ]
        },
        {
            code: `
              class MyClass {
                constructor(height, width) {
                    this.height = height;
                    this.width = width;
                }
                fieldA = 'Field A';
                #fieldB = 'Field B';
                method1() {}

                get area() {
                    return this.method1();
                }

                method2() {}
              }
            `,
            output: `
              class MyClass {
                constructor(height, width) {
                    this.height = height;
                    this.width = width;
                }

                fieldA = 'Field A';

                #fieldB = 'Field B';

                method1() {}
get area() {
                    return this.method1();
                }
method2() {}
              }
            `,
            options: [
                {

                    // requires blank lines around fields, disallows blank lines between methods
                    enforce: [
                        { blankLine: "always", prev: "*", next: "field" },
                        { blankLine: "always", prev: "field", next: "*" },
                        { blankLine: "never", prev: "method", next: "method" }
                    ]
                }
            ],
            errors: [
                {
                    messageId: "always",
                    line: 7,
                    column: 17
                },
                {
                    messageId: "always",
                    line: 8,
                    column: 17
                },
                {
                    messageId: "always",
                    line: 9,
                    column: 17
                },
                {
                    messageId: "never",
                    line: 11,
                    column: 17
                }, {
                    messageId: "never",
                    line: 15,
                    column: 17
                }
            ]
        },
        {
            code: `
              class MyClass {
                constructor(height, width) {
                    this.height = height;
                    this.width = width;
                }
                fieldA = 'Field A';
                #fieldB = 'Field B';
                method1() {}
                get area() {
                    return this.method1();
                }
                method2() {}
              }
            `,
            output: `
              class MyClass {
                constructor(height, width) {
                    this.height = height;
                    this.width = width;
                }

                fieldA = 'Field A';

                #fieldB = 'Field B';

                method1() {}

                get area() {
                    return this.method1();
                }

                method2() {}
              }
            `,
            options: [
                {

                    // requires blank lines around methods and fields
                    enforce: [
                        { blankLine: "always", prev: "*", next: "method" },
                        { blankLine: "always", prev: "method", next: "*" },
                        { blankLine: "always", prev: "field", next: "field" }
                    ]
                }
            ],
            errors: [
                {
                    messageId: "always",
                    line: 7,
                    column: 17
                },
                {
                    messageId: "always",
                    line: 8,
                    column: 17
                },
                {
                    messageId: "always",
                    line: 9,
                    column: 17
                },
                {
                    messageId: "always",
                    line: 10,
                    column: 17
                }, {
                    messageId: "always",
                    line: 13,
                    column: 17
                }
            ]
        },
        {
            code: `
              class MyClass {
                constructor(height, width) {
                    this.height = height;
                    this.width = width;
                }
                fieldA = 'Field A';
                #fieldB = 'Field B';
                method1() {}
                get area() {
                    return this.method1();
                }
                method2() {}
              }
            `,
            output: `
              class MyClass {
                constructor(height, width) {
                    this.height = height;
                    this.width = width;
                }

                fieldA = 'Field A';

                #fieldB = 'Field B';

                method1() {}

                get area() {
                    return this.method1();
                }

                method2() {}
              }
            `,
            options: [
                {

                    // requires blank lines around methods and fields
                    enforce: [
                        { blankLine: "never", prev: "*", next: "method" },
                        { blankLine: "never", prev: "method", next: "*" },
                        { blankLine: "never", prev: "field", next: "field" },

                        // This should take precedence over the above
                        { blankLine: "always", prev: "*", next: "method" },
                        { blankLine: "always", prev: "method", next: "*" },
                        { blankLine: "always", prev: "field", next: "field" }
                    ]
                }
            ],
            errors: [
                {
                    messageId: "always",
                    line: 7,
                    column: 17
                },
                {
                    messageId: "always",
                    line: 8,
                    column: 17
                },
                {
                    messageId: "always",
                    line: 9,
                    column: 17
                },
                {
                    messageId: "always",
                    line: 10,
                    column: 17
                }, {
                    messageId: "always",
                    line: 13,
                    column: 17
                }
            ]
        },

        // enforce with exceptAfterSingleLine option
        {
            code: `
              class MyClass {
                constructor(height, width) {
                    this.height = height;
                    this.width = width;
                }
                fieldA = 'Field A';
                #fieldB = 'Field B';
                method1() {}
                get area() {
                    return this.method1();
                }
                method2() {}
              }
            `,
            output: `
              class MyClass {
                constructor(height, width) {
                    this.height = height;
                    this.width = width;
                }

                fieldA = 'Field A';
                #fieldB = 'Field B';
                method1() {}
                get area() {
                    return this.method1();
                }

                method2() {}
              }
            `,
            options: [
                {

                    // requires blank lines around methods and fields
                    enforce: [
                        { blankLine: "always", prev: "*", next: "method" },
                        { blankLine: "always", prev: "method", next: "*" },
                        { blankLine: "always", prev: "field", next: "field" }
                    ]
                },
                {
                    exceptAfterSingleLine: true
                }
            ],
            errors: [
                {
                    messageId: "always",
                    line: 7,
                    column: 17
                },
                {
                    messageId: "always",
                    line: 13,
                    column: 17
                }
            ]
        }
    ]
});
