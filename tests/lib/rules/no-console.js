/**
 * @fileoverview Tests for no-console rule.
 * @author Nicholas C. Zakas
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-console"),
    RuleTester = require("../../../lib/rule-tester/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-console", rule, {
    valid: [
        "Console.info(foo)",

        // single array item
        { code: "console.info(foo)", options: [{ allow: ["info"] }] },
        { code: "console.warn(foo)", options: [{ allow: ["warn"] }] },
        { code: "console.error(foo)", options: [{ allow: ["error"] }] },
        { code: "console.log(foo)", options: [{ allow: ["log"] }] },

        // multiple array items
        { code: "console.info(foo)", options: [{ allow: ["warn", "info"] }] },
        { code: "console.warn(foo)", options: [{ allow: ["error", "warn"] }] },
        { code: "console.error(foo)", options: [{ allow: ["log", "error"] }] },
        { code: "console.log(foo)", options: [{ allow: ["info", "log", "warn"] }] },

        // https://github.com/eslint/eslint/issues/7010
        "var console = require('myconsole'); console.log(foo)"
    ],
    invalid: [

        // no options
        {
            code: "if (a) console.warn(foo)",
            errors: [{
                messageId: "unexpected",
                type: "MemberExpression",
                suggestions: null
            }]
        },
        {
            code: "foo(console.log)",
            errors: [{
                messageId: "unexpected",
                type: "MemberExpression",
                suggestions: null
            }]
        },
        {
            code: "console.log(foo)",
            errors: [{
                messageId: "unexpected",
                type: "MemberExpression",
                suggestions: [{
                    messageId: "removeConsole",
                    data: { propertyName: "log" },
                    output: ""
                }]
            }]
        },
        {
            code: "console.error(foo)",
            errors: [{
                messageId: "unexpected",
                type: "MemberExpression",
                suggestions: [{
                    messageId: "removeConsole",
                    data: { propertyName: "error" },
                    output: ""
                }]
            }]
        },
        {
            code: "console.info(foo)",
            errors: [{
                messageId: "unexpected",
                type: "MemberExpression",
                suggestions: [{
                    messageId: "removeConsole",
                    data: { propertyName: "info" },
                    output: ""
                }]
            }]
        },
        {
            code: "console.warn(foo)",
            errors: [{
                messageId: "unexpected",
                type: "MemberExpression",
                suggestions: [{
                    messageId: "removeConsole",
                    data: { propertyName: "warn" },
                    output: ""
                }]
            }]
        },
        {
            code: "switch (a) { case 1: console.log(foo) }",
            errors: [{
                messageId: "unexpected",
                type: "MemberExpression",
                suggestions: [{
                    messageId: "removeConsole",
                    data: { propertyName: "log" },
                    output: "switch (a) { case 1:  }"
                }]
            }]
        },
        {
            code: "if (a) { console.warn(foo) }",
            errors: [{
                messageId: "unexpected",
                type: "MemberExpression",
                suggestions: [{
                    messageId: "removeConsole",
                    data: { propertyName: "warn" },
                    output: "if (a) {  }"
                }]
            }]
        },
        {
            code: "a();\nconsole.log(foo);\nb();",
            errors: [{
                messageId: "unexpected",
                type: "MemberExpression",
                suggestions: [{
                    messageId: "removeConsole",
                    data: { propertyName: "log" },
                    output: "a();\n\nb();"
                }]
            }]
        },
        {
            code: "class A { static { console.info(foo) } }",
            languageOptions: { ecmaVersion: "latest" },
            errors: [{
                messageId: "unexpected",
                type: "MemberExpression",
                suggestions: [{
                    messageId: "removeConsole",
                    data: { propertyName: "info" },
                    output: "class A { static {  } }"
                }]
            }]
        },
        {
            code: "a()\nconsole.log(foo);\n[1, 2, 3].forEach(a => doSomething(a))",
            languageOptions: { ecmaVersion: "latest" },
            errors: [{
                messageId: "unexpected",
                type: "MemberExpression",
                suggestions: null
            }]
        },
        {
            code: "a++\nconsole.log();\n/b/",
            languageOptions: { ecmaVersion: "latest" },
            errors: [{
                messageId: "unexpected",
                type: "MemberExpression",
                suggestions: null
            }]
        },
        {
            code: "a();\nconsole.log(foo);\n[1, 2, 3].forEach(a => doSomething(a));",
            languageOptions: { ecmaVersion: "latest" },
            errors: [{
                messageId: "unexpected",
                type: "MemberExpression",
                suggestions: [{
                    messageId: "removeConsole",
                    data: { propertyName: "log" },
                    output: "a();\n\n[1, 2, 3].forEach(a => doSomething(a));"
                }]
            }]
        },

        //  one option
        {
            code: "if (a) console.info(foo)",
            options: [{ allow: ["warn"] }],
            errors: [{
                messageId: "limited",
                data: { allowed: "warn" },
                type: "MemberExpression",
                suggestions: null
            }]
        },
        {
            code: "foo(console.warn)",
            options: [{ allow: ["log"] }],
            errors: [{
                messageId: "limited",
                data: { allowed: "log" },
                type: "MemberExpression",
                suggestions: null
            }]
        },
        {
            code: "console.log(foo)",
            options: [{ allow: ["error"] }],
            errors: [{
                messageId: "limited",
                data: { allowed: "error" },
                type: "MemberExpression",
                suggestions: [{
                    messageId: "removeConsole",
                    data: { propertyName: "log" },
                    output: ""
                }]
            }]
        },
        {
            code: "console.error(foo)",
            options: [{ allow: ["warn"] }],
            errors: [{
                messageId: "limited",
                data: { allowed: "warn" },
                type: "MemberExpression",
                suggestions: [{
                    messageId: "removeConsole",
                    data: { propertyName: "error" },
                    output: ""
                }]
            }]
        },
        {
            code: "console.info(foo)",
            options: [{ allow: ["log"] }],
            errors: [{
                messageId: "limited",
                data: { allowed: "log" },
                type: "MemberExpression",
                suggestions: [{
                    messageId: "removeConsole",
                    data: { propertyName: "info" },
                    output: ""
                }]
            }]
        },
        {
            code: "console.warn(foo)",
            options: [{ allow: ["error"] }],
            errors: [{
                messageId: "limited",
                data: { allowed: "error" },
                type: "MemberExpression",
                suggestions: [{
                    messageId: "removeConsole",
                    data: { propertyName: "warn" },
                    output: ""
                }]
            }]
        },
        {
            code: "switch (a) { case 1: console.log(foo) }",
            options: [{ allow: ["error"] }],
            errors: [{
                messageId: "limited",
                data: { allowed: "error" },
                type: "MemberExpression",
                suggestions: [{
                    messageId: "removeConsole",
                    data: { propertyName: "log" },
                    output: "switch (a) { case 1:  }"
                }]
            }]
        },
        {
            code: "if (a) { console.info(foo) }",
            options: [{ allow: ["warn"] }],
            errors: [{
                messageId: "limited",
                data: { allowed: "warn" },
                type: "MemberExpression",
                suggestions: [{
                    messageId: "removeConsole",
                    data: { propertyName: "info" },
                    output: "if (a) {  }"
                }]
            }]
        },
        {
            code: "class A { static { console.error(foo) } }",
            options: [{ allow: ["log"] }],
            languageOptions: { ecmaVersion: "latest" },
            errors: [{
                messageId: "limited",
                data: { allowed: "log" },
                type: "MemberExpression",
                suggestions: [{
                    messageId: "removeConsole",
                    data: { propertyName: "error" },
                    output: "class A { static {  } }"
                }]
            }]
        },

        // multiple options
        {
            code: "if (a) console.log(foo)",
            options: [{ allow: ["warn", "error"] }],
            errors: [{
                messageId: "limited",
                data: { allowed: "warn, error" },
                type: "MemberExpression",
                suggestions: null
            }]
        },
        {
            code: "foo(console.info)",
            options: [{ allow: ["warn", "error"] }],
            errors: [{
                messageId: "limited",
                data: { allowed: "warn, error" },
                type: "MemberExpression",
                suggestions: null
            }]
        },
        {
            code: "console.log(foo)",
            options: [{ allow: ["warn", "info"] }],
            errors: [{
                messageId: "limited",
                data: { allowed: "warn, info" },
                type: "MemberExpression",
                suggestions: [{
                    messageId: "removeConsole",
                    data: { propertyName: "log" },
                    output: ""
                }]
            }]
        },
        {
            code: "console.error(foo)",
            options: [{ allow: ["warn", "info", "log"] }],
            errors: [{
                messageId: "limited",
                data: { allowed: "warn, info, log" },
                type: "MemberExpression",
                suggestions: [{
                    messageId: "removeConsole",
                    data: { propertyName: "error" },
                    output: ""
                }]
            }]
        },
        {
            code: "console.info(foo)",
            options: [{ allow: ["warn", "error", "log"] }],
            errors: [{
                messageId: "limited",
                data: { allowed: "warn, error, log" },
                type: "MemberExpression",
                suggestions: [{
                    messageId: "removeConsole",
                    data: { propertyName: "info" },
                    output: ""
                }]
            }]
        },
        {
            code: "console.warn(foo)",
            options: [{ allow: ["info", "log"] }],
            errors: [{
                messageId: "limited",
                data: { allowed: "info, log" },
                type: "MemberExpression",
                suggestions: [{
                    messageId: "removeConsole",
                    data: { propertyName: "warn" },
                    output: ""
                }]
            }]
        },
        {
            code: "switch (a) { case 1: console.error(foo) }",
            options: [{ allow: ["info", "log"] }],
            errors: [{
                messageId: "limited",
                data: { allowed: "info, log" },
                type: "MemberExpression",
                suggestions: [{
                    messageId: "removeConsole",
                    data: { propertyName: "error" },
                    output: "switch (a) { case 1:  }"
                }]
            }]
        },
        {
            code: "if (a) { console.log(foo) }",
            options: [{ allow: ["warn", "error"] }],
            errors: [{
                messageId: "limited",
                data: { allowed: "warn, error" },
                type: "MemberExpression",
                suggestions: [{
                    messageId: "removeConsole",
                    data: { propertyName: "log" },
                    output: "if (a) {  }"
                }]
            }]
        },
        {
            code: "class A { static { console.info(foo) } }",
            options: [{ allow: ["log", "error", "warn"] }],
            languageOptions: { ecmaVersion: "latest" },
            errors: [{
                messageId: "limited",
                data: { allowed: "log, error, warn" },
                type: "MemberExpression",
                suggestions: [{
                    messageId: "removeConsole",
                    data: { propertyName: "info" },
                    output: "class A { static {  } }"
                }]
            }]
        },

        // In case that implicit global variable of 'console' exists
        {
            code: "console.log(foo)",
            languageOptions: {
                globals: {
                    console: "readonly"
                }
            },
            errors: [{
                messageId: "unexpected",
                type: "MemberExpression",
                suggestions: [{
                    messageId: "removeConsole",
                    data: { propertyName: "log" },
                    output: ""
                }]
            }]
        }
    ]
});
