/**
 * @fileoverview Rule to encourage the use of inclusive language that avoids discrimination against groups of people.
 * @author Drew Wyatt
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/prefer-inclusive-language"),
    { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("prefer-inclusive-language", rule, {
    valid: [
        "var allowList = ['foo', 'bar'];",
        {
            code: "const denyList = ['foo', 'bar'];",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "const denyList = ['master', 'bar'];",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "const masterDetailView = new View({ with: 'stuff' });",
            options: [{ allow: ["masterDetailView"] }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "const masterDetailView = new View({ with: 'stuff' });",
            options: [{ deny: ["whitelist", "blacklist", "slave"] }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "const { masterList } = someObject;",
            options: [{ ignoreDestructuring: true }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "const { masterList: list } = someObject;",
            parserOptions: { ecmaVersion: 6 }
        }
    ],
    invalid: [
        {
            code: "var blacklist = ['foo', 'bar'];",
            errors: [{
                messageId: "exclusive",
                data: { name: "blacklist" }
            }]
        },
        {
            code: "const blacklist = ['foo', 'bar'];",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "exclusive",
                data: { name: "blacklist" }
            }]
        },
        {
            code: "const blackList = ['foo', 'bar'];",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "exclusive",
                data: { name: "blackList" }
            }]
        },
        {
            code: "const masterDetailView = new View({ with: 'stuff' });",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "exclusive",
                data: { name: "masterDetailView" }
            }]
        },
        {
            code: "const MasterDetailView = new View({ with: 'stuff' });",
            options: [{ allow: ["masterDetailView"] }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "exclusive",
                data: { name: "MasterDetailView" }
            }]
        },
        {
            code: "const { masterList } = someObject;",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "exclusive",
                data: { name: "masterList" }
            }]
        },
        {
            code: "const { list: masterList } = someObject;",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "exclusive",
                data: { name: "masterList" }
            }]
        },
        {
            code: "function attach(slave) { /* ... */ }",
            errors: [{
                messageId: "exclusive",
                data: { name: "slave" }
            }]
        },
        {
            code: "class Dispatcher { attachSlave(node) {} }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "exclusive",
                data: { name: "attachSlave" }
            }]
        },
        {
            code: "class Dispatcher { attach(slave) {} }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "exclusive",
                data: { name: "slave" }
            }]
        },
        {
            code: "class Dispatcher { attachSlave(slave) {} }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "exclusive",
                data: { name: "attachSlave" }
            },
            {
                messageId: "exclusive",
                data: { name: "slave" }
            }]
        }
    ]
});
