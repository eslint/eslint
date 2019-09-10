/**
 * @fileoverview Tests for no-import-assign rule.
 * @author Toru Nagashima <https://github.com/mysticatea>
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-import-assign"),
    { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
    parserOptions: {
        ecmaVersion: 2015,
        sourceType: "module"
    }
});

ruleTester.run("no-import-assign", rule, {
    valid: [
        "import mod from 'mod'; mod.prop = 0",
        "import mod from 'mod'; mod.prop += 0",
        "import mod from 'mod'; mod.prop++",
        "import mod from 'mod'; delete mod.prop",
        "import {named} from 'mod'; named.prop = 0",
        "import {named} from 'mod'; named.prop += 0",
        "import {named} from 'mod'; named.prop++",
        "import {named} from 'mod'; delete named.prop",
        "import * as mod from 'mod'; mod.named.prop = 0",
        "import * as mod from 'mod'; mod.named.prop += 0",
        "import * as mod from 'mod'; mod.named.prop++",
        "import * as mod from 'mod'; delete mod.named.prop",
        "import * as mod from 'mod'; obj[mod] = 0",
        "import * as mod from 'mod'; obj[mod.named] = 0",
        "import mod from 'mod'; { let mod = 0; mod = 1 }",
        "import * as mod from 'mod'; { let mod = 0; mod = 1 }",
        "import {} from 'mod'"
    ],
    invalid: [
        {
            code: "import mod1 from 'mod'; mod1 = 0",
            errors: [{ messageId: "readonly", data: { name: "mod1" }, column: 25 }]
        },
        {
            code: "import mod2 from 'mod'; mod2 += 0",
            errors: [{ messageId: "readonly", data: { name: "mod2" }, column: 25 }]
        },
        {
            code: "import mod3 from 'mod'; mod3++",
            errors: [{ messageId: "readonly", data: { name: "mod3" }, column: 25 }]
        },
        {
            code: "import {named1} from 'mod'; named1 = 0",
            errors: [{ messageId: "readonly", data: { name: "named1" }, column: 29 }]
        },
        {
            code: "import {named2} from 'mod'; named2 += 0",
            errors: [{ messageId: "readonly", data: { name: "named2" }, column: 29 }]
        },
        {
            code: "import {named3} from 'mod'; named3++",
            errors: [{ messageId: "readonly", data: { name: "named3" }, column: 29 }]
        },
        {
            code: "import {named4 as foo} from 'mod'; foo = 0; named4 = 0",
            errors: [{ messageId: "readonly", data: { name: "foo" }, column: 36 }]
        },
        {
            code: "import * as mod1 from 'mod'; mod1 = 0",
            errors: [{ messageId: "readonly", data: { name: "mod1" }, column: 30 }]
        },
        {
            code: "import * as mod2 from 'mod'; mod2 += 0",
            errors: [{ messageId: "readonly", data: { name: "mod2" }, column: 30 }]
        },
        {
            code: "import * as mod3 from 'mod'; mod3++",
            errors: [{ messageId: "readonly", data: { name: "mod3" }, column: 30 }]
        },
        {
            code: "import * as mod4 from 'mod'; mod4.named = 0",
            errors: [{ messageId: "readonlyMember", data: { name: "mod4" }, column: 30 }]
        },
        {
            code: "import * as mod5 from 'mod'; mod5.named += 0",
            errors: [{ messageId: "readonlyMember", data: { name: "mod5" }, column: 30 }]
        },
        {
            code: "import * as mod6 from 'mod'; mod6.named++",
            errors: [{ messageId: "readonlyMember", data: { name: "mod6" }, column: 30 }]
        },
        {
            code: "import * as mod7 from 'mod'; delete mod7.named",
            errors: [{ messageId: "readonlyMember", data: { name: "mod7" }, column: 30 }]
        }
    ]
});
