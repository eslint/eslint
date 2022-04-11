/**
 * @fileoverview Test enforcement of no inline comments rule.
 * @author Greg Cochard
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-inline-comments"),
    { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
        parserOptions: {
            ecmaFeatures: {
                jsx: true
            }
        }
    }),
    lineError = {
        messageId: "unexpectedInlineComment",
        type: "Line"
    },
    blockError = {
        messageId: "unexpectedInlineComment",
        type: "Block"
    };

ruleTester.run("no-inline-comments", rule, {

    valid: [
        "// A valid comment before code\nvar a = 1;",
        "var a = 2;\n// A valid comment after code",
        "// A solitary comment",
        "var a = 1; // eslint-disable-line no-debugger",
        "var a = 1; /* eslint-disable-line no-debugger */",
        "foo(); /* global foo */",
        "foo(); /* globals foo */",
        "var foo; /* exported foo */",

        // JSX exception
        `var a = (
            <div>
            {/*comment*/}
            </div>
        )`,
        `var a = (
            <div>
            { /* comment */ }
            <h1>Some heading</h1>
            </div>
        )`,
        `var a = (
            <div>
            {// comment
            }
            </div>
        )`,
        `var a = (
            <div>
            { // comment
            }
            </div>
        )`,
        `var a = (
            <div>
            {/* comment 1 */
            /* comment 2 */}
            </div>
        )`,
        `var a = (
            <div>
            {/*
              * comment 1
              */
             /*
              * comment 2
              */}
            </div>
        )`,
        `var a = (
            <div>
            {/*
               multi
               line
               comment
            */}
            </div>
        )`,
        {
            code: "import(/* webpackChunkName: \"my-chunk-name\" */ './locale/en');",
            options: [
                {
                    ignorePattern: "(?:webpackChunkName):\\s.+"
                }
            ],
            parserOptions: { ecmaVersion: 2020 }
        },
        {
            code: "var foo = 2; // Note: This comment is legal.",
            options: [
                {
                    ignorePattern: "Note: "
                }
            ]
        }
    ],

    invalid: [
        {
            code: "var a = 1; /*A block comment inline after code*/",
            errors: [blockError]
        },
        {
            code: "/*A block comment inline before code*/ var a = 2;",
            errors: [blockError]
        },
        {
            code: "/* something */ var a = 2;",
            options: [
                {
                    ignorePattern: "otherthing"
                }
            ],
            errors: [blockError]
        },
        {
            code: "var a = 3; //A comment inline with code",
            errors: [lineError]
        },
        {
            code: "var a = 3; // someday use eslint-disable-line here",
            errors: [lineError]
        },
        {
            code: "var a = 3; // other line comment",
            options: [
                {
                    ignorePattern: "something"
                }
            ],
            errors: [lineError]
        },
        {
            code: "var a = 4;\n/**A\n * block\n * comment\n * inline\n * between\n * code*/ var foo = a;",
            errors: [blockError]
        },
        {
            code: "var a = \n{/**/}",
            errors: [blockError]
        },

        // JSX
        {
            code: `var a = (
                <div>{/* comment */}</div>
            )`,
            errors: [blockError]
        },
        {
            code: `var a = (
                <div>{// comment
                }
                </div>
            )`,
            errors: [lineError]
        },
        {
            code: `var a = (
                <div>{/* comment */
                }
                </div>
            )`,
            errors: [blockError]
        },
        {
            code: `var a = (
                <div>{/*
                       * comment
                       */
                }
                </div>
            )`,
            errors: [blockError]
        },
        {
            code: `var a = (
                <div>{/*
                       * comment
                       */}
                </div>
            )`,
            errors: [blockError]
        },
        {
            code: `var a = (
                <div>{/*
                       * comment
                       */}</div>
            )`,
            errors: [blockError]
        },
        {
            code: `var a = (
                <div>
                {/*
                  * comment
                  */}</div>
            )`,
            errors: [blockError]
        },
        {
            code: `var a = (
                <div>
                {
                 /*
                  * comment
                  */}</div>
            )`,
            errors: [blockError]
        },
        {
            code: `var a = (
                <div>
                {
                /* comment */}</div>
            )`,
            errors: [blockError]
        },
        {
            code: `var a = (
                <div>
                {b/* comment */}
                </div>
            )`,
            errors: [blockError]
        },
        {
            code: `var a = (
                <div>
                {/* comment */b}
                </div>
            )`,
            errors: [blockError]
        },
        {
            code: `var a = (
                <div>
                {// comment
                    b
                }
                </div>
            )`,
            errors: [lineError]
        },
        {
            code: `var a = (
                <div>
                {/* comment */
                    b
                }
                </div>
            )`,
            errors: [blockError]
        },
        {
            code: `var a = (
                <div>
                {/*
                  * comment
                  */
                    b
                }
                </div>
            )`,
            errors: [blockError]
        },
        {
            code: `var a = (
                <div>
                {
                    b// comment
                }
                </div>
            )`,
            errors: [lineError]
        },
        {
            code: `var a = (
                <div>
                {
                    /* comment */b
                }
                </div>
            )`,
            errors: [blockError]
        },
        {
            code: `var a = (
                <div>
                {
                    b/* comment */
                }
                </div>
            )`,
            errors: [blockError]
        },
        {
            code: `var a = (
                <div>
                {
                    b
                /*
                 * comment
                 */}
                </div>
            )`,
            errors: [blockError]
        },
        {
            code: `var a = (
                <div>
                {
                    b
                /* comment */}
                </div>
            )`,
            errors: [blockError]
        },
        {
            code: `var a = (
                <div>
                {
                    { /* this is an empty object literal, not braces for js code! */ }
                }
                </div>
            )`,
            errors: [blockError]
        },
        {
            code: `var a = (
                <div>
                {
                    {// comment
                    }
                }
                </div>
            )`,
            errors: [lineError]
        },
        {
            code: `var a = (
                <div>
                {
                    {
                    /* comment */}
                }
                </div>
            )`,
            errors: [blockError]
        },
        {
            code: `var a = (
                <div>
                { /* two comments on the same line... */ /* ...are not allowed, same as with a non-JSX code */}
                </div>
            )`,
            errors: [blockError, blockError]
        },
        {
            code: `var a = (
                <div>
                {
                    /* overlapping
                    */ /*
                       lines */
                }
                </div>
            )`,
            errors: [blockError, blockError]
        }
    ]
});
