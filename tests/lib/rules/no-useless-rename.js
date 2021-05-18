/**
 * @fileoverview Disallow renaming import, export, and destructured assignments to the same name.
 * @author Kai Cataldo
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-useless-rename"),
    RuleTester = require("../../../lib/testers/rule-tester");

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 6, sourceType: "module" } });

ruleTester.run("no-useless-rename", rule, {
    valid: [
        "let {foo} = obj;",
        "let {foo: bar} = obj;",
        "let {foo: bar, baz: qux} = obj;",
        "let {foo: {bar: baz}} = obj;",
        "let {foo, bar: {baz: qux}} = obj;",
        "let {'foo': bar} = obj;",
        "let {'foo': bar, 'baz': qux} = obj;",
        "let {'foo': {'bar': baz}} = obj;",
        "let {foo, 'bar': {'baz': qux}} = obj;",
        "let {['foo']: bar} = obj;",
        "let {['foo']: bar, ['baz']: qux} = obj;",
        "let {['foo']: {['bar']: baz}} = obj;",
        "let {foo, ['bar']: {['baz']: qux}} = obj;",
        "let {[foo]: foo} = obj;",
        "let {['foo']: foo} = obj;",
        "let {[foo]: bar} = obj;",
        "function func({foo}) {}",
        "function func({foo: bar}) {}",
        "function func({foo: bar, baz: qux}) {}",
        "({foo}) => {}",
        "({foo: bar}) => {}",
        "({foo: bar, baz: qui}) => {}",
        "import * as foo from 'foo';",
        "import foo from 'foo';",
        "import {foo} from 'foo';",
        "import {foo as bar} from 'foo';",
        "import {foo as bar, baz as qux} from 'foo';",
        "export {foo} from 'foo';",
        "var foo = 0;export {foo as bar};",
        "var foo = 0; var baz = 0; export {foo as bar, baz as qux};",
        "export {foo as bar} from 'foo';",
        "export {foo as bar, baz as qux} from 'foo';",
        {
            code: "const {...stuff} = myObject;",
            parserOptions: { ecmaVersion: 2018 }
        },
        {
            code: "const {foo, ...stuff} = myObject;",
            parserOptions: { ecmaVersion: 2018 }
        },
        {
            code: "const {foo: bar, ...stuff} = myObject;",
            parserOptions: { ecmaVersion: 2018 }
        },

        // { ignoreDestructuring: true }
        {
            code: "let {foo: foo} = obj;",
            options: [{ ignoreDestructuring: true }]
        },
        {
            code: "let {foo: foo, bar: baz} = obj;",
            options: [{ ignoreDestructuring: true }]
        },
        {
            code: "let {foo: foo, bar: bar} = obj;",
            options: [{ ignoreDestructuring: true }]
        },

        // { ignoreImport: true }
        {
            code: "import {foo as foo} from 'foo';",
            options: [{ ignoreImport: true }]
        },
        {
            code: "import {foo as foo, bar as baz} from 'foo';",
            options: [{ ignoreImport: true }]
        },
        {
            code: "import {foo as foo, bar as bar} from 'foo';",
            options: [{ ignoreImport: true }]
        },

        // { ignoreExport: true }
        {
            code: "var foo = 0;export {foo as foo};",
            options: [{ ignoreExport: true }]
        },
        {
            code: "var foo = 0;var bar = 0;export {foo as foo, bar as baz};",
            options: [{ ignoreExport: true }]
        },
        {
            code: "var foo = 0;var bar = 0;export {foo as foo, bar as bar};",
            options: [{ ignoreExport: true }]
        },
        {
            code: "export {foo as foo} from 'foo';",
            options: [{ ignoreExport: true }]
        },
        {
            code: "export {foo as foo, bar as baz} from 'foo';",
            options: [{ ignoreExport: true }]
        },
        {
            code: "export {foo as foo, bar as bar} from 'foo';",
            options: [{ ignoreExport: true }]
        }
    ],

    invalid: [
        {
            code: "let {foo: foo} = obj;",
            output: "let {foo} = obj;",
            errors: ["Destructuring assignment foo unnecessarily renamed."]
        },
        {
            code: "let {a, foo: foo} = obj;",
            output: "let {a, foo} = obj;",
            errors: ["Destructuring assignment foo unnecessarily renamed."]
        },
        {
            code: "let {foo: foo, bar: baz} = obj;",
            output: "let {foo, bar: baz} = obj;",
            errors: ["Destructuring assignment foo unnecessarily renamed."]
        },
        {
            code: "let {foo: bar, baz: baz} = obj;",
            output: "let {foo: bar, baz} = obj;",
            errors: ["Destructuring assignment baz unnecessarily renamed."]
        },
        {
            code: "let {foo: foo, bar: bar} = obj;",
            output: "let {foo, bar} = obj;",
            errors: ["Destructuring assignment foo unnecessarily renamed.", "Destructuring assignment bar unnecessarily renamed."]
        },
        {
            code: "let {foo: {bar: bar}} = obj;",
            output: "let {foo: {bar}} = obj;",
            errors: ["Destructuring assignment bar unnecessarily renamed."]
        },
        {
            code: "let {foo: {bar: bar}, baz: baz} = obj;",
            output: "let {foo: {bar}, baz} = obj;",
            errors: ["Destructuring assignment bar unnecessarily renamed.", "Destructuring assignment baz unnecessarily renamed."]
        },
        {
            code: "let {'foo': foo} = obj;",
            output: "let {foo} = obj;",
            errors: ["Destructuring assignment foo unnecessarily renamed."]
        },
        {
            code: "let {'foo': foo, 'bar': baz} = obj;",
            output: "let {foo, 'bar': baz} = obj;",
            errors: ["Destructuring assignment foo unnecessarily renamed."]
        },
        {
            code: "let {'foo': bar, 'baz': baz} = obj;",
            output: "let {'foo': bar, baz} = obj;",
            errors: ["Destructuring assignment baz unnecessarily renamed."]
        },
        {
            code: "let {'foo': foo, 'bar': bar} = obj;",
            output: "let {foo, bar} = obj;",
            errors: ["Destructuring assignment foo unnecessarily renamed.", "Destructuring assignment bar unnecessarily renamed."]
        },
        {
            code: "let {'foo': {'bar': bar}} = obj;",
            output: "let {'foo': {bar}} = obj;",
            errors: ["Destructuring assignment bar unnecessarily renamed."]
        },
        {
            code: "let {'foo': {'bar': bar}, 'baz': baz} = obj;",
            output: "let {'foo': {bar}, baz} = obj;",
            errors: ["Destructuring assignment bar unnecessarily renamed.", "Destructuring assignment baz unnecessarily renamed."]
        },
        {
            code: "function func({foo: foo}) {}",
            output: "function func({foo}) {}",
            errors: ["Destructuring assignment foo unnecessarily renamed."]
        },
        {
            code: "function func({foo: foo, bar: baz}) {}",
            output: "function func({foo, bar: baz}) {}",
            errors: ["Destructuring assignment foo unnecessarily renamed."]
        },
        {
            code: "function func({foo: bar, baz: baz}) {}",
            output: "function func({foo: bar, baz}) {}",
            errors: ["Destructuring assignment baz unnecessarily renamed."]
        },
        {
            code: "function func({foo: foo, bar: bar}) {}",
            output: "function func({foo, bar}) {}",
            errors: ["Destructuring assignment foo unnecessarily renamed.", "Destructuring assignment bar unnecessarily renamed."]
        },
        {
            code: "({foo: foo}) => {}",
            output: "({foo}) => {}",
            errors: ["Destructuring assignment foo unnecessarily renamed."]
        },
        {
            code: "({foo: foo, bar: baz}) => {}",
            output: "({foo, bar: baz}) => {}",
            errors: ["Destructuring assignment foo unnecessarily renamed."]
        },
        {
            code: "({foo: bar, baz: baz}) => {}",
            output: "({foo: bar, baz}) => {}",
            errors: ["Destructuring assignment baz unnecessarily renamed."]
        },
        {
            code: "({foo: foo, bar: bar}) => {}",
            output: "({foo, bar}) => {}",
            errors: ["Destructuring assignment foo unnecessarily renamed.", "Destructuring assignment bar unnecessarily renamed."]
        },
        {
            code: "const {foo: foo, ...stuff} = myObject;",
            output: "const {foo, ...stuff} = myObject;",
            parserOptions: { ecmaVersion: 2018 },
            errors: ["Destructuring assignment foo unnecessarily renamed."]
        },
        {
            code: "const {foo: foo, bar: baz, ...stuff} = myObject;",
            output: "const {foo, bar: baz, ...stuff} = myObject;",
            parserOptions: { ecmaVersion: 2018 },
            errors: ["Destructuring assignment foo unnecessarily renamed."]
        },
        {
            code: "const {foo: foo, bar: bar, ...stuff} = myObject;",
            output: "const {foo, bar, ...stuff} = myObject;",
            parserOptions: { ecmaVersion: 2018 },
            errors: ["Destructuring assignment foo unnecessarily renamed.", "Destructuring assignment bar unnecessarily renamed."]
        },
        {
            code: "import {foo as foo} from 'foo';",
            output: "import {foo} from 'foo';",
            errors: ["Import foo unnecessarily renamed."]
        },
        {
            code: "import {foo as foo, bar as baz} from 'foo';",
            output: "import {foo, bar as baz} from 'foo';",
            errors: ["Import foo unnecessarily renamed."]
        },
        {
            code: "import {foo as bar, baz as baz} from 'foo';",
            output: "import {foo as bar, baz} from 'foo';",
            errors: ["Import baz unnecessarily renamed."]
        },
        {
            code: "import {foo as foo, bar as bar} from 'foo';",
            output: "import {foo, bar} from 'foo';",
            errors: ["Import foo unnecessarily renamed.", "Import bar unnecessarily renamed."]
        },
        {
            code: "var foo = 0; export {foo as foo};",
            output: "var foo = 0; export {foo};",
            errors: ["Export foo unnecessarily renamed."]
        },
        {
            code: "var foo = 0; var bar = 0; export {foo as foo, bar as baz};",
            output: "var foo = 0; var bar = 0; export {foo, bar as baz};",
            errors: ["Export foo unnecessarily renamed."]
        },
        {
            code: "var foo = 0; var baz = 0; export {foo as bar, baz as baz};",
            output: "var foo = 0; var baz = 0; export {foo as bar, baz};",
            errors: ["Export baz unnecessarily renamed."]
        },
        {
            code: "var foo = 0; var bar = 0;export {foo as foo, bar as bar};",
            output: "var foo = 0; var bar = 0;export {foo, bar};",
            errors: ["Export foo unnecessarily renamed.", "Export bar unnecessarily renamed."]
        },
        {
            code: "export {foo as foo} from 'foo';",
            output: "export {foo} from 'foo';",
            errors: ["Export foo unnecessarily renamed."]
        },
        {
            code: "export {foo as foo, bar as baz} from 'foo';",
            output: "export {foo, bar as baz} from 'foo';",
            errors: ["Export foo unnecessarily renamed."]
        },
        {
            code: "var foo = 0; var bar = 0; export {foo as bar, baz as baz} from 'foo';",
            output: "var foo = 0; var bar = 0; export {foo as bar, baz} from 'foo';",
            errors: ["Export baz unnecessarily renamed."]
        },
        {
            code: "export {foo as foo, bar as bar} from 'foo';",
            output: "export {foo, bar} from 'foo';",
            errors: ["Export foo unnecessarily renamed.", "Export bar unnecessarily renamed."]
        }
    ]
});
