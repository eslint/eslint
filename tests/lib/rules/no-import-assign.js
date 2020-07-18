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
        ecmaVersion: 2018,
        sourceType: "module"
    },
    globals: {
        Reflect: "readonly"
    }
});

ruleTester.run("no-import-assign", rule, {
    valid: [
        "import mod from 'mod'; mod.prop = 0",
        "import mod from 'mod'; mod.prop += 0",
        "import mod from 'mod'; mod.prop++",
        "import mod from 'mod'; delete mod.prop",
        "import mod from 'mod'; for (mod.prop in foo);",
        "import mod from 'mod'; for (mod.prop of foo);",
        "import mod from 'mod'; [mod.prop] = foo;",
        "import mod from 'mod'; [...mod.prop] = foo;",
        "import mod from 'mod'; ({ bar: mod.prop } = foo);",
        "import mod from 'mod'; ({ ...mod.prop } = foo);",
        "import {named} from 'mod'; named.prop = 0",
        "import {named} from 'mod'; named.prop += 0",
        "import {named} from 'mod'; named.prop++",
        "import {named} from 'mod'; delete named.prop",
        "import {named} from 'mod'; for (named.prop in foo);",
        "import {named} from 'mod'; for (named.prop of foo);",
        "import {named} from 'mod'; [named.prop] = foo;",
        "import {named} from 'mod'; [...named.prop] = foo;",
        "import {named} from 'mod'; ({ bar: named.prop } = foo);",
        "import {named} from 'mod'; ({ ...named.prop } = foo);",
        "import * as mod from 'mod'; mod.named.prop = 0",
        "import * as mod from 'mod'; mod.named.prop += 0",
        "import * as mod from 'mod'; mod.named.prop++",
        "import * as mod from 'mod'; delete mod.named.prop",
        "import * as mod from 'mod'; for (mod.named.prop in foo);",
        "import * as mod from 'mod'; for (mod.named.prop of foo);",
        "import * as mod from 'mod'; [mod.named.prop] = foo;",
        "import * as mod from 'mod'; [...mod.named.prop] = foo;",
        "import * as mod from 'mod'; ({ bar: mod.named.prop } = foo);",
        "import * as mod from 'mod'; ({ ...mod.named.prop } = foo);",
        "import * as mod from 'mod'; obj[mod] = 0",
        "import * as mod from 'mod'; obj[mod.named] = 0",
        "import * as mod from 'mod'; for (var foo in mod.named);",
        "import * as mod from 'mod'; for (var foo of mod.named);",
        "import * as mod from 'mod'; [bar = mod.named] = foo;",
        "import * as mod from 'mod'; ({ bar = mod.named } = foo);",
        "import * as mod from 'mod'; ({ bar: baz = mod.named } = foo);",
        "import * as mod from 'mod'; ({ [mod.named]: bar } = foo);",
        "import * as mod from 'mod'; var obj = { ...mod.named };",
        "import * as mod from 'mod'; var obj = { foo: mod.named };",
        "import mod from 'mod'; { let mod = 0; mod = 1 }",
        "import * as mod from 'mod'; { let mod = 0; mod = 1 }",
        "import * as mod from 'mod'; { let mod = 0; mod.named = 1 }",
        "import {} from 'mod'",
        "import 'mod'",
        "import mod from 'mod'; Object.assign(mod, obj);",
        "import {named} from 'mod'; Object.assign(named, obj);",
        "import * as mod from 'mod'; Object.assign(mod.prop, obj);",
        "import * as mod from 'mod'; Object.assign(obj, mod, other);",
        "import * as mod from 'mod'; Object[assign](mod, obj);",
        "import * as mod from 'mod'; Object.getPrototypeOf(mod);",
        "import * as mod from 'mod'; Reflect.set(obj, key, mod);",
        "import * as mod from 'mod'; { var Object; Object.assign(mod, obj); }",
        "import * as mod from 'mod'; var Object; Object.assign(mod, obj);",
        "import * as mod from 'mod'; Object.seal(mod, obj)",
        "import * as mod from 'mod'; Object.preventExtensions(mod)",
        "import * as mod from 'mod'; Reflect.preventExtensions(mod)"
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
            code: "import mod4 from 'mod'; for (mod4 in foo);",
            errors: [{ messageId: "readonly", data: { name: "mod4" }, column: 25 }]
        },
        {
            code: "import mod5 from 'mod'; for (mod5 of foo);",
            errors: [{ messageId: "readonly", data: { name: "mod5" }, column: 25 }]
        },
        {
            code: "import mod6 from 'mod'; [mod6] = foo",
            errors: [{ messageId: "readonly", data: { name: "mod6" }, column: 25 }]
        },
        {
            code: "import mod7 from 'mod'; [mod7 = 0] = foo",
            errors: [{ messageId: "readonly", data: { name: "mod7" }, column: 25 }]
        },
        {
            code: "import mod8 from 'mod'; [...mod8] = foo",
            errors: [{ messageId: "readonly", data: { name: "mod8" }, column: 25 }]
        },
        {
            code: "import mod9 from 'mod'; ({ bar: mod9 } = foo)",
            errors: [{ messageId: "readonly", data: { name: "mod9" }, column: 26 }]
        },
        {
            code: "import mod10 from 'mod'; ({ bar: mod10 = 0 } = foo)",
            errors: [{ messageId: "readonly", data: { name: "mod10" }, column: 27 }]
        },
        {
            code: "import mod11 from 'mod'; ({ ...mod11 } = foo)",
            errors: [{ messageId: "readonly", data: { name: "mod11" }, column: 27 }]
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
            code: "import {named4} from 'mod'; for (named4 in foo);",
            errors: [{ messageId: "readonly", data: { name: "named4" }, column: 29 }]
        },
        {
            code: "import {named5} from 'mod'; for (named5 of foo);",
            errors: [{ messageId: "readonly", data: { name: "named5" }, column: 29 }]
        },
        {
            code: "import {named6} from 'mod'; [named6] = foo",
            errors: [{ messageId: "readonly", data: { name: "named6" }, column: 29 }]
        },
        {
            code: "import {named7} from 'mod'; [named7 = 0] = foo",
            errors: [{ messageId: "readonly", data: { name: "named7" }, column: 29 }]
        },
        {
            code: "import {named8} from 'mod'; [...named8] = foo",
            errors: [{ messageId: "readonly", data: { name: "named8" }, column: 29 }]
        },
        {
            code: "import {named9} from 'mod'; ({ bar: named9 } = foo)",
            errors: [{ messageId: "readonly", data: { name: "named9" }, column: 30 }]
        },
        {
            code: "import {named10} from 'mod'; ({ bar: named10 = 0 } = foo)",
            errors: [{ messageId: "readonly", data: { name: "named10" }, column: 31 }]
        },
        {
            code: "import {named11} from 'mod'; ({ ...named11 } = foo)",
            errors: [{ messageId: "readonly", data: { name: "named11" }, column: 31 }]
        },
        {
            code: "import {named12 as foo} from 'mod'; foo = 0; named12 = 0",
            errors: [{ messageId: "readonly", data: { name: "foo" }, column: 37 }]
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
            code: "import * as mod4 from 'mod'; for (mod4 in foo);",
            errors: [{ messageId: "readonly", data: { name: "mod4" }, column: 30 }]
        },
        {
            code: "import * as mod5 from 'mod'; for (mod5 of foo);",
            errors: [{ messageId: "readonly", data: { name: "mod5" }, column: 30 }]
        },
        {
            code: "import * as mod6 from 'mod'; [mod6] = foo",
            errors: [{ messageId: "readonly", data: { name: "mod6" }, column: 30 }]
        },
        {
            code: "import * as mod7 from 'mod'; [mod7 = 0] = foo",
            errors: [{ messageId: "readonly", data: { name: "mod7" }, column: 30 }]
        },
        {
            code: "import * as mod8 from 'mod'; [...mod8] = foo",
            errors: [{ messageId: "readonly", data: { name: "mod8" }, column: 30 }]
        },
        {
            code: "import * as mod9 from 'mod'; ({ bar: mod9 } = foo)",
            errors: [{ messageId: "readonly", data: { name: "mod9" }, column: 31 }]
        },
        {
            code: "import * as mod10 from 'mod'; ({ bar: mod10 = 0 } = foo)",
            errors: [{ messageId: "readonly", data: { name: "mod10" }, column: 32 }]
        },
        {
            code: "import * as mod11 from 'mod'; ({ ...mod11 } = foo)",
            errors: [{ messageId: "readonly", data: { name: "mod11" }, column: 32 }]
        },
        {
            code: "import * as mod1 from 'mod'; mod1.named = 0",
            errors: [{ messageId: "readonlyMember", data: { name: "mod1" }, column: 30 }]
        },
        {
            code: "import * as mod2 from 'mod'; mod2.named += 0",
            errors: [{ messageId: "readonlyMember", data: { name: "mod2" }, column: 30 }]
        },
        {
            code: "import * as mod3 from 'mod'; mod3.named++",
            errors: [{ messageId: "readonlyMember", data: { name: "mod3" }, column: 30 }]
        },
        {
            code: "import * as mod4 from 'mod'; for (mod4.named in foo);",
            errors: [{ messageId: "readonlyMember", data: { name: "mod4" }, column: 30 }]
        },
        {
            code: "import * as mod5 from 'mod'; for (mod5.named of foo);",
            errors: [{ messageId: "readonlyMember", data: { name: "mod5" }, column: 30 }]
        },
        {
            code: "import * as mod6 from 'mod'; [mod6.named] = foo",
            errors: [{ messageId: "readonlyMember", data: { name: "mod6" }, column: 30 }]
        },
        {
            code: "import * as mod7 from 'mod'; [mod7.named = 0] = foo",
            errors: [{ messageId: "readonlyMember", data: { name: "mod7" }, column: 30 }]
        },
        {
            code: "import * as mod8 from 'mod'; [...mod8.named] = foo",
            errors: [{ messageId: "readonlyMember", data: { name: "mod8" }, column: 30 }]
        },
        {
            code: "import * as mod9 from 'mod'; ({ bar: mod9.named } = foo)",
            errors: [{ messageId: "readonlyMember", data: { name: "mod9" }, column: 31 }]
        },
        {
            code: "import * as mod10 from 'mod'; ({ bar: mod10.named = 0 } = foo)",
            errors: [{ messageId: "readonlyMember", data: { name: "mod10" }, column: 32 }]
        },
        {
            code: "import * as mod11 from 'mod'; ({ ...mod11.named } = foo)",
            errors: [{ messageId: "readonlyMember", data: { name: "mod11" }, column: 32 }]
        },
        {
            code: "import * as mod12 from 'mod'; delete mod12.named",
            errors: [{ messageId: "readonlyMember", data: { name: "mod12" }, column: 31 }]
        },
        {
            code: "import * as mod from 'mod'; Object.assign(mod, obj)",
            errors: [{ messageId: "readonlyMember", data: { name: "mod" }, column: 29 }]
        },
        {
            code: "import * as mod from 'mod'; Object.defineProperty(mod, key, d)",
            errors: [{ messageId: "readonlyMember", data: { name: "mod" }, column: 29 }]
        },
        {
            code: "import * as mod from 'mod'; Object.defineProperties(mod, d)",
            errors: [{ messageId: "readonlyMember", data: { name: "mod" }, column: 29 }]
        },
        {
            code: "import * as mod from 'mod'; Object.setPrototypeOf(mod, proto)",
            errors: [{ messageId: "readonlyMember", data: { name: "mod" }, column: 29 }]
        },
        {
            code: "import * as mod from 'mod'; Object.freeze(mod)",
            errors: [{ messageId: "readonlyMember", data: { name: "mod" }, column: 29 }]
        },
        {
            code: "import * as mod from 'mod'; Reflect.defineProperty(mod, key, d)",
            errors: [{ messageId: "readonlyMember", data: { name: "mod" }, column: 29 }]
        },
        {
            code: "import * as mod from 'mod'; Reflect.deleteProperty(mod, key)",
            errors: [{ messageId: "readonlyMember", data: { name: "mod" }, column: 29 }]
        },
        {
            code: "import * as mod from 'mod'; Reflect.set(mod, key, value)",
            errors: [{ messageId: "readonlyMember", data: { name: "mod" }, column: 29 }]
        },
        {
            code: "import * as mod from 'mod'; Reflect.setPrototypeOf(mod, proto)",
            errors: [{ messageId: "readonlyMember", data: { name: "mod" }, column: 29 }]
        },
        {
            code: "import mod, * as mod_ns from 'mod'; mod.prop = 0; mod_ns.prop = 0",
            errors: [{ messageId: "readonlyMember", data: { name: "mod_ns" }, column: 51 }]
        },

        // Optional chaining
        {
            code: "import * as mod from 'mod'; Object?.defineProperty(mod, key, d)",
            parserOptions: { ecmaVersion: 2020 },
            errors: [{ messageId: "readonlyMember", data: { name: "mod" }, column: 29 }]
        },
        {
            code: "import * as mod from 'mod'; (Object?.defineProperty)(mod, key, d)",
            parserOptions: { ecmaVersion: 2020 },
            errors: [{ messageId: "readonlyMember", data: { name: "mod" }, column: 29 }]
        },
        {
            code: "import * as mod from 'mod'; delete mod?.prop",
            parserOptions: { ecmaVersion: 2020 },
            errors: [{ messageId: "readonlyMember", data: { name: "mod" }, column: 29 }]
        }
    ]
});
