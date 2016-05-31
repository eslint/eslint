/**
 * @fileoverview Disallow renaming import, export, and destructured assignments to the same name.
 * @author Kai Cataldo
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/no-useless-rename"),
    RuleTester = require("../../../lib/testers/rule-tester");

var ruleTester = new RuleTester();

ruleTester.run("no-useless-rename", rule, {
    valid: [
        { code: "let {foo} = obj;", parserOptions: { ecmaVersion: 6 } },
        { code: "let {foo: bar} = obj;", parserOptions: { ecmaVersion: 6 } },
        { code: "let {foo: bar, baz: qux} = obj;", parserOptions: { ecmaVersion: 6 } },
        { code: "let {foo: {bar: baz}} = obj;", parserOptions: { ecmaVersion: 6 } },
        { code: "let {foo, bar: {baz: qux}} = obj;", parserOptions: { ecmaVersion: 6 } },
        { code: "let {'foo': bar} = obj;", parserOptions: { ecmaVersion: 6 } },
        { code: "let {'foo': bar, 'baz': qux} = obj;", parserOptions: { ecmaVersion: 6 } },
        { code: "let {'foo': {'bar': baz}} = obj;", parserOptions: { ecmaVersion: 6 } },
        { code: "let {foo, 'bar': {'baz': qux}} = obj;", parserOptions: { ecmaVersion: 6 } },
        { code: "let {['foo']: bar} = obj;", parserOptions: { ecmaVersion: 6 } },
        { code: "let {['foo']: bar, ['baz']: qux} = obj;", parserOptions: { ecmaVersion: 6 } },
        { code: "let {['foo']: {['bar']: baz}} = obj;", parserOptions: { ecmaVersion: 6 } },
        { code: "let {foo, ['bar']: {['baz']: qux}} = obj;", parserOptions: { ecmaVersion: 6 } },
        { code: "let {[foo]: foo} = obj;", parserOptions: { ecmaVersion: 6 } },
        { code: "let {['foo']: foo} = obj;", parserOptions: { ecmaVersion: 6 } },
        { code: "let {[foo]: bar} = obj;", parserOptions: { ecmaVersion: 6 } },
        { code: "let {['foo']: bar} = obj;", parserOptions: { ecmaVersion: 6 } },
        { code: "function func({foo}) {}", parserOptions: { ecmaVersion: 6 } },
        { code: "function func({foo: bar}) {}", parserOptions: { ecmaVersion: 6 } },
        { code: "function func({foo: bar, baz: qux}) {}", parserOptions: { ecmaVersion: 6 } },
        { code: "({foo}) => {}", parserOptions: { ecmaVersion: 6 } },
        { code: "({foo: bar}) => {}", parserOptions: { ecmaVersion: 6 } },
        { code: "({foo: bar, baz: qui}) => {}", parserOptions: { ecmaVersion: 6 } },
        { code: "import * as foo from 'foo';", parserOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "import foo from 'foo';", parserOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "import {foo} from 'foo';", parserOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "import {foo as bar} from 'foo';", parserOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "import {foo as bar, baz as qux} from 'foo';", parserOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "export {foo} from 'foo';", parserOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "export {foo as bar};", parserOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "export {foo as bar, baz as qux};", parserOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "export {foo as bar} from 'foo';", parserOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "export {foo as bar, baz as qux} from 'foo';", parserOptions: { ecmaVersion: 6, sourceType: "module" } },
        {
            code: "const {...stuff} = myObject;",
            parserOptions: {
                ecmaFeatures: { experimentalObjectRestSpread: true },
                ecmaVersion: 6
            }
        },
        {
            code: "const {foo, ...stuff} = myObject;",
            parserOptions: {
                ecmaFeatures: { experimentalObjectRestSpread: true },
                ecmaVersion: 6
            }
        },
        {
            code: "const {foo: bar, ...stuff} = myObject;",
            parserOptions: {
                ecmaFeatures: { experimentalObjectRestSpread: true },
                ecmaVersion: 6
            }
        },

        // { ignoreDestructuring: true }
        {
            code: "let {foo: foo} = obj;",
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            options: [{ ignoreDestructuring: true}]
        },
        {
            code: "let {foo: foo, bar: baz} = obj;",
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            options: [{ ignoreDestructuring: true}]
        },
        {
            code: "let {foo: foo, bar: bar} = obj;",
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            options: [{ ignoreDestructuring: true}]
        },

        // { ignoreImport: true }
        {
            code: "import {foo as foo} from 'foo';",
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            options: [{ ignoreImport: true}]
        },
        {
            code: "import {foo as foo, bar as baz} from 'foo';",
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            options: [{ ignoreImport: true}]
        },
        {
            code: "import {foo as foo, bar as bar} from 'foo';",
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            options: [{ ignoreImport: true}]
        },

        // { ignoreExport: true }
        {
            code: "export {foo as foo};",
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            options: [{ ignoreExport: true}]
        },
        {
            code: "export {foo as foo, bar as baz};",
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            options: [{ ignoreExport: true}]
        },
        {
            code: "export {foo as foo, bar as bar};",
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            options: [{ ignoreExport: true}]
        },
        {
            code: "export {foo as foo} from 'foo';",
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            options: [{ ignoreExport: true}]
        },
        {
            code: "export {foo as foo, bar as baz} from 'foo';",
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            options: [{ ignoreExport: true}]
        },
        {
            code: "export {foo as foo, bar as bar} from 'foo';",
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            options: [{ ignoreExport: true}]
        }
    ],

    invalid: [
        {
            code: "let {foo: foo} = obj;",
            output: "let {foo} = obj;",
            parserOptions: { ecmaVersion: 6 },
            errors: ["Destructuring assignment foo unnecessarily renamed."]
        },
        {
            code: "let {foo: foo, bar: baz} = obj;",
            output: "let {foo, bar: baz} = obj;",
            parserOptions: { ecmaVersion: 6 },
            errors: ["Destructuring assignment foo unnecessarily renamed."]
        },
        {
            code: "let {foo: bar, baz: baz} = obj;",
            output: "let {foo: bar, baz} = obj;",
            parserOptions: { ecmaVersion: 6 },
            errors: ["Destructuring assignment baz unnecessarily renamed."]
        },
        {
            code: "let {foo: foo, bar: bar} = obj;",
            output: "let {foo, bar} = obj;",
            parserOptions: { ecmaVersion: 6 },
            errors: ["Destructuring assignment foo unnecessarily renamed.", "Destructuring assignment bar unnecessarily renamed."]
        },
        {
            code: "let {foo: {bar: bar}} = obj;",
            output: "let {foo: {bar}} = obj;",
            parserOptions: { ecmaVersion: 6 },
            errors: ["Destructuring assignment bar unnecessarily renamed."]
        },
        {
            code: "let {foo: {bar: bar}, baz: baz} = obj;",
            output: "let {foo: {bar}, baz} = obj;",
            parserOptions: { ecmaVersion: 6 },
            errors: ["Destructuring assignment bar unnecessarily renamed.", "Destructuring assignment baz unnecessarily renamed."]
        },
        {
            code: "let {'foo': foo} = obj;",
            output: "let {foo} = obj;",
            parserOptions: { ecmaVersion: 6 },
            errors: ["Destructuring assignment foo unnecessarily renamed."]
        },
        {
            code: "let {'foo': foo, 'bar': baz} = obj;",
            output: "let {foo, 'bar': baz} = obj;",
            parserOptions: { ecmaVersion: 6 },
            errors: ["Destructuring assignment foo unnecessarily renamed."]
        },
        {
            code: "let {'foo': bar, 'baz': baz} = obj;",
            output: "let {'foo': bar, baz} = obj;",
            parserOptions: { ecmaVersion: 6 },
            errors: ["Destructuring assignment baz unnecessarily renamed."]
        },
        {
            code: "let {'foo': foo, 'bar': bar} = obj;",
            output: "let {foo, bar} = obj;",
            parserOptions: { ecmaVersion: 6 },
            errors: ["Destructuring assignment foo unnecessarily renamed.", "Destructuring assignment bar unnecessarily renamed."]
        },
        {
            code: "let {'foo': {'bar': bar}} = obj;",
            output: "let {'foo': {bar}} = obj;",
            parserOptions: { ecmaVersion: 6 },
            errors: ["Destructuring assignment bar unnecessarily renamed."]
        },
        {
            code: "let {'foo': {'bar': bar}, 'baz': baz} = obj;",
            output: "let {'foo': {bar}, baz} = obj;",
            parserOptions: { ecmaVersion: 6 },
            errors: ["Destructuring assignment bar unnecessarily renamed.", "Destructuring assignment baz unnecessarily renamed."]
        },
        {
            code: "function func({foo: foo}) {}",
            output: "function func({foo}) {}",
            parserOptions: { ecmaVersion: 6 },
            errors: ["Destructuring assignment foo unnecessarily renamed."]
        },
        {
            code: "function func({foo: foo, bar: baz}) {}",
            output: "function func({foo, bar: baz}) {}",
            parserOptions: { ecmaVersion: 6 },
            errors: ["Destructuring assignment foo unnecessarily renamed."]
        },
        {
            code: "function func({foo: bar, baz: baz}) {}",
            output: "function func({foo: bar, baz}) {}",
            parserOptions: { ecmaVersion: 6 },
            errors: ["Destructuring assignment baz unnecessarily renamed."]
        },
        {
            code: "function func({foo: foo, bar: bar}) {}",
            output: "function func({foo, bar}) {}",
            parserOptions: { ecmaVersion: 6 },
            errors: ["Destructuring assignment foo unnecessarily renamed.", "Destructuring assignment bar unnecessarily renamed."]
        },
        {
            code: "({foo: foo}) => {}",
            output: "({foo}) => {}",
            parserOptions: { ecmaVersion: 6 },
            errors: ["Destructuring assignment foo unnecessarily renamed."]
        },
        {
            code: "({foo: foo, bar: baz}) => {}",
            output: "({foo, bar: baz}) => {}",
            parserOptions: { ecmaVersion: 6 },
            errors: ["Destructuring assignment foo unnecessarily renamed."]
        },
        {
            code: "({foo: bar, baz: baz}) => {}",
            output: "({foo: bar, baz}) => {}",
            parserOptions: { ecmaVersion: 6 },
            errors: ["Destructuring assignment baz unnecessarily renamed."]
        },
        {
            code: "({foo: foo, bar: bar}) => {}",
            output: "({foo, bar}) => {}",
            parserOptions: { ecmaVersion: 6 },
            errors: ["Destructuring assignment foo unnecessarily renamed.", "Destructuring assignment bar unnecessarily renamed."]
        },
        {
            code: "const {foo: foo, ...stuff} = myObject;",
            output: "const {foo, ...stuff} = myObject;",
            parserOptions: {
                ecmaFeatures: { experimentalObjectRestSpread: true },
                ecmaVersion: 6
            },
            errors: ["Destructuring assignment foo unnecessarily renamed."]
        },
        {
            code: "const {foo: foo, bar: baz, ...stuff} = myObject;",
            output: "const {foo, bar: baz, ...stuff} = myObject;",
            parserOptions: {
                ecmaFeatures: { experimentalObjectRestSpread: true },
                ecmaVersion: 6
            },
            errors: ["Destructuring assignment foo unnecessarily renamed."]
        },
        {
            code: "const {foo: foo, bar: bar, ...stuff} = myObject;",
            output: "const {foo, bar, ...stuff} = myObject;",
            parserOptions: {
                ecmaFeatures: { experimentalObjectRestSpread: true },
                ecmaVersion: 6
            },
            errors: ["Destructuring assignment foo unnecessarily renamed.", "Destructuring assignment bar unnecessarily renamed."]
        },
        {
            code: "import {foo as foo} from 'foo';",
            output: "import {foo} from 'foo';",
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: ["Import foo unnecessarily renamed."]
        },
        {
            code: "import {foo as foo, bar as baz} from 'foo';",
            output: "import {foo, bar as baz} from 'foo';",
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: ["Import foo unnecessarily renamed."]
        },
        {
            code: "import {foo as bar, baz as baz} from 'foo';",
            output: "import {foo as bar, baz} from 'foo';",
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: ["Import baz unnecessarily renamed."]
        },
        {
            code: "import {foo as foo, bar as bar} from 'foo';",
            output: "import {foo, bar} from 'foo';",
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: ["Import foo unnecessarily renamed.", "Import bar unnecessarily renamed."]
        },
        {
            code: "export {foo as foo};",
            output: "export {foo};",
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: ["Export foo unnecessarily renamed."]
        },
        {
            code: "export {foo as foo, bar as baz};",
            output: "export {foo, bar as baz};",
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: ["Export foo unnecessarily renamed."]
        },
        {
            code: "export {foo as bar, baz as baz};",
            output: "export {foo as bar, baz};",
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: ["Export baz unnecessarily renamed."]
        },
        {
            code: "export {foo as foo, bar as bar};",
            output: "export {foo, bar};",
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: ["Export foo unnecessarily renamed.", "Export bar unnecessarily renamed."]
        },
        {
            code: "export {foo as foo} from 'foo';",
            output: "export {foo} from 'foo';",
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: ["Export foo unnecessarily renamed."]
        },
        {
            code: "export {foo as foo, bar as baz} from 'foo';",
            output: "export {foo, bar as baz} from 'foo';",
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: ["Export foo unnecessarily renamed."]
        },
        {
            code: "export {foo as bar, baz as baz} from 'foo';",
            output: "export {foo as bar, baz} from 'foo';",
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: ["Export baz unnecessarily renamed."]
        },
        {
            code: "export {foo as foo, bar as bar} from 'foo';",
            output: "export {foo, bar} from 'foo';",
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: ["Export foo unnecessarily renamed.", "Export bar unnecessarily renamed."]
        }
    ]
});
