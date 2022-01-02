/**
 * @fileoverview Tests for the no-restricted-exports rule
 * @author Milos Djermanovic
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-restricted-exports");
const { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 2022, sourceType: "module" } });

ruleTester.run("no-restricted-exports", rule, {
    valid: [

        // nothing configured
        "export var a;",
        "export function a() {}",
        "export class A {}",
        "var a; export { a };",
        "var b; export { b as a };",
        "export { a } from 'foo';",
        "export { b as a } from 'foo';",
        { code: "export var a;", options: [{}] },
        { code: "export function a() {}", options: [{}] },
        { code: "export class A {}", options: [{}] },
        { code: "var a; export { a };", options: [{}] },
        { code: "var b; export { b as a };", options: [{}] },
        { code: "export { a } from 'foo';", options: [{}] },
        { code: "export { b as a } from 'foo';", options: [{}] },
        { code: "export var a;", options: [{ restrictedNamedExports: [] }] },
        { code: "export function a() {}", options: [{ restrictedNamedExports: [] }] },
        { code: "export class A {}", options: [{ restrictedNamedExports: [] }] },
        { code: "var a; export { a };", options: [{ restrictedNamedExports: [] }] },
        { code: "var b; export { b as a };", options: [{ restrictedNamedExports: [] }] },
        { code: "export { a } from 'foo';", options: [{ restrictedNamedExports: [] }] },
        { code: "export { b as a } from 'foo';", options: [{ restrictedNamedExports: [] }] },

        // not a restricted name
        { code: "export var a;", options: [{ restrictedNamedExports: ["x"] }] },
        { code: "export let a;", options: [{ restrictedNamedExports: ["x"] }] },
        { code: "export const a = 1;", options: [{ restrictedNamedExports: ["x"] }] },
        { code: "export function a() {}", options: [{ restrictedNamedExports: ["x"] }] },
        { code: "export function *a() {}", options: [{ restrictedNamedExports: ["x"] }] },
        { code: "export async function a() {}", options: [{ restrictedNamedExports: ["x"] }] },
        { code: "export async function *a() {}", options: [{ restrictedNamedExports: ["x"] }] },
        { code: "export class A {}", options: [{ restrictedNamedExports: ["x"] }] },
        { code: "var a; export { a };", options: [{ restrictedNamedExports: ["x"] }] },
        { code: "var b; export { b as a };", options: [{ restrictedNamedExports: ["x"] }] },
        { code: "export { a } from 'foo';", options: [{ restrictedNamedExports: ["x"] }] },
        { code: "export { b as a } from 'foo';", options: [{ restrictedNamedExports: ["x"] }] },
        { code: "export { '' } from 'foo';", options: [{ restrictedNamedExports: ["undefined"] }] },
        { code: "export { '' } from 'foo';", options: [{ restrictedNamedExports: [" "] }] },
        { code: "export { ' ' } from 'foo';", options: [{ restrictedNamedExports: [""] }] },
        { code: "export { ' a', 'a ' } from 'foo';", options: [{ restrictedNamedExports: ["a"] }] },

        // does not mistakenly disallow non-exported names that appear in named export declarations
        { code: "export var b = a;", options: [{ restrictedNamedExports: ["a"] }] },
        { code: "export let [b = a] = [];", options: [{ restrictedNamedExports: ["a"] }] },
        { code: "export const [b] = [a];", options: [{ restrictedNamedExports: ["a"] }] },
        { code: "export var { a: b } = {};", options: [{ restrictedNamedExports: ["a"] }] },
        { code: "export let { b = a } = {};", options: [{ restrictedNamedExports: ["a"] }] },
        { code: "export const { c: b = a } = {};", options: [{ restrictedNamedExports: ["a"] }] },
        { code: "export function b(a) {}", options: [{ restrictedNamedExports: ["a"] }] },
        { code: "export class A { a(){} }", options: [{ restrictedNamedExports: ["a"] }] },
        { code: "export class A extends B {}", options: [{ restrictedNamedExports: ["B"] }] },
        { code: "var a; export { a as b };", options: [{ restrictedNamedExports: ["a"] }] },
        { code: "var a; export { a as 'a ' };", options: [{ restrictedNamedExports: ["a"] }] },
        { code: "export { a as b } from 'foo';", options: [{ restrictedNamedExports: ["a"] }] },
        { code: "export { a as 'a ' } from 'foo';", options: [{ restrictedNamedExports: ["a"] }] },
        { code: "export { 'a' as 'a ' } from 'foo';", options: [{ restrictedNamedExports: ["a"] }] },

        // does not check source in re-export declarations
        { code: "export { b } from 'a';", options: [{ restrictedNamedExports: ["a"] }] },
        { code: "export * as b from 'a';", options: [{ restrictedNamedExports: ["a"] }] },

        // does not check non-export declarations
        { code: "var a;", options: [{ restrictedNamedExports: ["a"] }] },
        { code: "let a;", options: [{ restrictedNamedExports: ["a"] }] },
        { code: "const a = 1;", options: [{ restrictedNamedExports: ["a"] }] },
        { code: "function a() {}", options: [{ restrictedNamedExports: ["a"] }] },
        { code: "class A {}", options: [{ restrictedNamedExports: ["A"] }] },
        { code: "import a from 'foo';", options: [{ restrictedNamedExports: ["a"] }] },
        { code: "import { a } from 'foo';", options: [{ restrictedNamedExports: ["a"] }] },
        { code: "import { b as a } from 'foo';", options: [{ restrictedNamedExports: ["a"] }] },

        // does not check re-export all declarations
        { code: "export * from 'foo';", options: [{ restrictedNamedExports: ["a"] }] },
        { code: "export * from 'a';", options: [{ restrictedNamedExports: ["a"] }] },

        // does not mistakenly disallow identifiers in export default declarations (a default export will export "default" name)
        { code: "export default a;", options: [{ restrictedNamedExports: ["a"] }] },
        { code: "export default function a() {}", options: [{ restrictedNamedExports: ["a"] }] },
        { code: "export default class A {}", options: [{ restrictedNamedExports: ["A"] }] },
        { code: "export default (function a() {});", options: [{ restrictedNamedExports: ["a"] }] },
        { code: "export default (class A {});", options: [{ restrictedNamedExports: ["A"] }] },

        // by design, restricted name "default" does not apply to default export declarations, although they do export the "default" name.
        { code: "export default 1;", options: [{ restrictedNamedExports: ["default"] }] },

        // "default" does not disallow re-exporting a renamed default export from another module
        { code: "export { default as a } from 'foo';", options: [{ restrictedNamedExports: ["default"] }] }
    ],

    invalid: [

        {
            code: "export function someFunction() {}",
            options: [{ restrictedNamedExports: ["someFunction"] }],
            errors: [{ messageId: "restrictedNamed", data: { name: "someFunction" }, type: "Identifier" }]
        },

        // basic tests
        {
            code: "export var a;",
            options: [{ restrictedNamedExports: ["a"] }],
            errors: [{ messageId: "restrictedNamed", data: { name: "a" }, type: "Identifier" }]
        },
        {
            code: "export var a = 1;",
            options: [{ restrictedNamedExports: ["a"] }],
            errors: [{ messageId: "restrictedNamed", data: { name: "a" }, type: "Identifier" }]
        },
        {
            code: "export let a;",
            options: [{ restrictedNamedExports: ["a"] }],
            errors: [{ messageId: "restrictedNamed", data: { name: "a" }, type: "Identifier" }]
        },
        {
            code: "export let a = 1;",
            options: [{ restrictedNamedExports: ["a"] }],
            errors: [{ messageId: "restrictedNamed", data: { name: "a" }, type: "Identifier" }]
        },
        {
            code: "export const a = 1;",
            options: [{ restrictedNamedExports: ["a"] }],
            errors: [{ messageId: "restrictedNamed", data: { name: "a" }, type: "Identifier" }]
        },
        {
            code: "export function a() {}",
            options: [{ restrictedNamedExports: ["a"] }],
            errors: [{ messageId: "restrictedNamed", data: { name: "a" }, type: "Identifier" }]
        },
        {
            code: "export function *a() {}",
            options: [{ restrictedNamedExports: ["a"] }],
            errors: [{ messageId: "restrictedNamed", data: { name: "a" }, type: "Identifier" }]
        },
        {
            code: "export async function a() {}",
            options: [{ restrictedNamedExports: ["a"] }],
            errors: [{ messageId: "restrictedNamed", data: { name: "a" }, type: "Identifier" }]
        },
        {
            code: "export async function *a() {}",
            options: [{ restrictedNamedExports: ["a"] }],
            errors: [{ messageId: "restrictedNamed", data: { name: "a" }, type: "Identifier" }]
        },
        {
            code: "export class A {}",
            options: [{ restrictedNamedExports: ["A"] }],
            errors: [{ messageId: "restrictedNamed", data: { name: "A" }, type: "Identifier" }]
        },
        {
            code: "let a; export { a };",
            options: [{ restrictedNamedExports: ["a"] }],
            errors: [{ messageId: "restrictedNamed", data: { name: "a" }, type: "Identifier", column: 17 }]
        },
        {
            code: "export { a }; var a;",
            options: [{ restrictedNamedExports: ["a"] }],
            errors: [{ messageId: "restrictedNamed", data: { name: "a" }, type: "Identifier", column: 10 }]
        },
        {
            code: "let b; export { b as a };",
            options: [{ restrictedNamedExports: ["a"] }],
            errors: [{ messageId: "restrictedNamed", data: { name: "a" }, type: "Identifier" }]
        },
        {
            code: "export { a } from 'foo';",
            options: [{ restrictedNamedExports: ["a"] }],
            errors: [{ messageId: "restrictedNamed", data: { name: "a" }, type: "Identifier" }]
        },
        {
            code: "export { b as a } from 'foo';",
            options: [{ restrictedNamedExports: ["a"] }],
            errors: [{ messageId: "restrictedNamed", data: { name: "a" }, type: "Identifier" }]
        },

        // string literals
        {
            code: "let a; export { a as 'a' };",
            options: [{ restrictedNamedExports: ["a"] }],
            errors: [{ messageId: "restrictedNamed", data: { name: "a" }, type: "Literal", column: 22 }]
        },
        {
            code: "let a; export { a as 'b' };",
            options: [{ restrictedNamedExports: ["b"] }],
            errors: [{ messageId: "restrictedNamed", data: { name: "b" }, type: "Literal", column: 22 }]
        },
        {
            code: "let a; export { a as ' b ' };",
            options: [{ restrictedNamedExports: [" b "] }],
            errors: [{ messageId: "restrictedNamed", data: { name: " b " }, type: "Literal", column: 22 }]
        },
        {
            code: "let a; export { a as '👍' };",
            options: [{ restrictedNamedExports: ["👍"] }],
            errors: [{ messageId: "restrictedNamed", data: { name: "👍" }, type: "Literal", column: 22 }]
        },
        {
            code: "export { 'a' } from 'foo';",
            options: [{ restrictedNamedExports: ["a"] }],
            errors: [{ messageId: "restrictedNamed", data: { name: "a" }, type: "Literal" }]
        },
        {
            code: "export { '' } from 'foo';",
            options: [{ restrictedNamedExports: [""] }],
            errors: [{ messageId: "restrictedNamed", data: { name: "" }, type: "Literal" }]
        },
        {
            code: "export { ' ' } from 'foo';",
            options: [{ restrictedNamedExports: [" "] }],
            errors: [{ messageId: "restrictedNamed", data: { name: " " }, type: "Literal" }]
        },
        {
            code: "export { b as 'a' } from 'foo';",
            options: [{ restrictedNamedExports: ["a"] }],
            errors: [{ messageId: "restrictedNamed", data: { name: "a" }, type: "Literal" }]
        },
        {
            code: "export { b as '\\u0061' } from 'foo';",
            options: [{ restrictedNamedExports: ["a"] }],
            errors: [{ messageId: "restrictedNamed", data: { name: "a" }, type: "Literal" }]
        },
        {
            code: "export * as 'a' from 'foo';",
            options: [{ restrictedNamedExports: ["a"] }],
            errors: [{ messageId: "restrictedNamed", data: { name: "a" }, type: "Literal" }]
        },


        // destructuring
        {
            code: "export var [a] = [];",
            options: [{ restrictedNamedExports: ["a"] }],
            errors: [{ messageId: "restrictedNamed", data: { name: "a" }, type: "Identifier" }]
        },
        {
            code: "export let { a } = {};",
            options: [{ restrictedNamedExports: ["a"] }],
            errors: [{ messageId: "restrictedNamed", data: { name: "a" }, type: "Identifier" }]
        },
        {
            code: "export const { b: a } = {};",
            options: [{ restrictedNamedExports: ["a"] }],
            errors: [{ messageId: "restrictedNamed", data: { name: "a" }, type: "Identifier" }]
        },
        {
            code: "export var [{ a }] = [];",
            options: [{ restrictedNamedExports: ["a"] }],
            errors: [{ messageId: "restrictedNamed", data: { name: "a" }, type: "Identifier" }]
        },
        {
            code: "export let { b: { c: a = d } = e } = {};",
            options: [{ restrictedNamedExports: ["a"] }],
            errors: [{ messageId: "restrictedNamed", data: { name: "a" }, type: "Identifier" }]
        },

        // reports the correct identifier node in the case of a redeclaration. Note: functions cannot be redeclared in a module.
        {
            code: "var a; export var a;",
            options: [{ restrictedNamedExports: ["a"] }],
            errors: [{ messageId: "restrictedNamed", data: { name: "a" }, type: "Identifier", column: 19 }]
        },
        {
            code: "export var a; var a;",
            options: [{ restrictedNamedExports: ["a"] }],
            errors: [{ messageId: "restrictedNamed", data: { name: "a" }, type: "Identifier", column: 12 }]
        },

        // reports the correct identifier node when the same identifier appears elsewhere in the declaration
        {
            code: "export var a = a;",
            options: [{ restrictedNamedExports: ["a"] }],
            errors: [{ messageId: "restrictedNamed", data: { name: "a" }, type: "Identifier", column: 12 }]
        },
        {
            code: "export let b = a, a;",
            options: [{ restrictedNamedExports: ["a"] }],
            errors: [{ messageId: "restrictedNamed", data: { name: "a" }, type: "Identifier", column: 19 }]
        },
        {
            code: "export const a = 1, b = a;",
            options: [{ restrictedNamedExports: ["a"] }],
            errors: [{ messageId: "restrictedNamed", data: { name: "a" }, type: "Identifier", column: 14 }]
        },
        {
            code: "export var [a] = a;",
            options: [{ restrictedNamedExports: ["a"] }],
            errors: [{ messageId: "restrictedNamed", data: { name: "a" }, type: "Identifier", column: 13 }]
        },
        {
            code: "export let { a: a } = {};",
            options: [{ restrictedNamedExports: ["a"] }],
            errors: [{ messageId: "restrictedNamed", data: { name: "a" }, type: "Identifier", column: 17 }]
        },
        {
            code: "export const { a: b, b: a } = {};",
            options: [{ restrictedNamedExports: ["a"] }],
            errors: [{ messageId: "restrictedNamed", data: { name: "a" }, type: "Identifier", column: 25 }]
        },
        {
            code: "export var { b: a, a: b } = {};",
            options: [{ restrictedNamedExports: ["a"] }],
            errors: [{ messageId: "restrictedNamed", data: { name: "a" }, type: "Identifier", column: 17 }]
        },
        {
            code: "export let a, { a: b } = {};",
            options: [{ restrictedNamedExports: ["a"] }],
            errors: [{ messageId: "restrictedNamed", data: { name: "a" }, type: "Identifier", column: 12 }]
        },
        {
            code: "export const { a: b } = {}, a = 1;",
            options: [{ restrictedNamedExports: ["a"] }],
            errors: [{ messageId: "restrictedNamed", data: { name: "a" }, type: "Identifier", column: 29 }]
        },
        {
            code: "export var [a = a] = [];",
            options: [{ restrictedNamedExports: ["a"] }],
            errors: [{ messageId: "restrictedNamed", data: { name: "a" }, type: "Identifier", column: 13 }]
        },
        {
            code: "export var { a: a = a } = {};",
            options: [{ restrictedNamedExports: ["a"] }],
            errors: [{ messageId: "restrictedNamed", data: { name: "a" }, type: "Identifier", column: 17 }]
        },
        {
            code: "export let { a } = { a };",
            options: [{ restrictedNamedExports: ["a"] }],
            errors: [{ messageId: "restrictedNamed", data: { name: "a" }, type: "Identifier", column: 14 }]
        },
        {
            code: "export function a(a) {};",
            options: [{ restrictedNamedExports: ["a"] }],
            errors: [{ messageId: "restrictedNamed", data: { name: "a" }, type: "Identifier", column: 17 }]
        },
        {
            code: "export class A { A(){} };",
            options: [{ restrictedNamedExports: ["A"] }],
            errors: [{ messageId: "restrictedNamed", data: { name: "A" }, type: "Identifier", column: 14 }]
        },
        {
            code: "var a; export { a as a };",
            options: [{ restrictedNamedExports: ["a"] }],
            errors: [{ messageId: "restrictedNamed", data: { name: "a" }, type: "Identifier", column: 22 }]
        },
        {
            code: "let a, b; export { a as b, b as a };",
            options: [{ restrictedNamedExports: ["a"] }],
            errors: [{ messageId: "restrictedNamed", data: { name: "a" }, type: "Identifier", column: 33 }]
        },
        {
            code: "const a = 1, b = 2; export { b as a, a as b };",
            options: [{ restrictedNamedExports: ["a"] }],
            errors: [{ messageId: "restrictedNamed", data: { name: "a" }, type: "Identifier", column: 35 }]
        },
        {
            code: "var a; export { a as b, a };",
            options: [{ restrictedNamedExports: ["a"] }],
            errors: [{ messageId: "restrictedNamed", data: { name: "a" }, type: "Identifier", column: 25 }]
        },
        {
            code: "export { a as a } from 'a';",
            options: [{ restrictedNamedExports: ["a"] }],
            errors: [{ messageId: "restrictedNamed", data: { name: "a" }, type: "Identifier", column: 15 }]
        },
        {
            code: "export { a as b, b as a } from 'foo';",
            options: [{ restrictedNamedExports: ["a"] }],
            errors: [{ messageId: "restrictedNamed", data: { name: "a" }, type: "Identifier", column: 23 }]
        },
        {
            code: "export { b as a, a as b } from 'foo';",
            options: [{ restrictedNamedExports: ["a"] }],
            errors: [{ messageId: "restrictedNamed", data: { name: "a" }, type: "Identifier", column: 15 }]
        },
        {
            code: "export * as a from 'a';",
            options: [{ restrictedNamedExports: ["a"] }],
            errors: [{ messageId: "restrictedNamed", data: { name: "a" }, type: "Identifier", column: 13 }]
        },

        // Note: duplicate identifiers in the same export declaration are a 'duplicate export' syntax error. Example: export var a, a;

        // invalid and valid or multiple ivalid in the same declaration
        {
            code: "export var a, b;",
            options: [{ restrictedNamedExports: ["a"] }],
            errors: [{ messageId: "restrictedNamed", data: { name: "a" }, type: "Identifier" }]
        },
        {
            code: "export let b, a;",
            options: [{ restrictedNamedExports: ["a"] }],
            errors: [{ messageId: "restrictedNamed", data: { name: "a" }, type: "Identifier" }]
        },
        {
            code: "export const b = 1, a = 2;",
            options: [{ restrictedNamedExports: ["a", "b"] }],
            errors: [
                { messageId: "restrictedNamed", data: { name: "b" }, type: "Identifier" },
                { messageId: "restrictedNamed", data: { name: "a" }, type: "Identifier" }
            ]
        },
        {
            code: "export var a, b, c;",
            options: [{ restrictedNamedExports: ["a", "c"] }],
            errors: [
                { messageId: "restrictedNamed", data: { name: "a" }, type: "Identifier" },
                { messageId: "restrictedNamed", data: { name: "c" }, type: "Identifier" }
            ]
        },
        {
            code: "export let { a, b, c } = {};",
            options: [{ restrictedNamedExports: ["b", "c"] }],
            errors: [
                { messageId: "restrictedNamed", data: { name: "b" }, type: "Identifier" },
                { messageId: "restrictedNamed", data: { name: "c" }, type: "Identifier" }
            ]
        },
        {
            code: "export const [a, b, c, d] = {};",
            options: [{ restrictedNamedExports: ["b", "c"] }],
            errors: [
                { messageId: "restrictedNamed", data: { name: "b" }, type: "Identifier" },
                { messageId: "restrictedNamed", data: { name: "c" }, type: "Identifier" }
            ]
        },
        {
            code: "export var { a, x: b, c, d, e: y } = {}, e, f = {};",
            options: [{ restrictedNamedExports: ["foo", "a", "b", "bar", "d", "e", "baz"] }],
            errors: [
                { messageId: "restrictedNamed", data: { name: "a" }, type: "Identifier" },
                { messageId: "restrictedNamed", data: { name: "b" }, type: "Identifier" },
                { messageId: "restrictedNamed", data: { name: "d" }, type: "Identifier" },
                { messageId: "restrictedNamed", data: { name: "e" }, type: "Identifier", column: 42 }
            ]
        },
        {
            code: "var a, b; export { a, b };",
            options: [{ restrictedNamedExports: ["a"] }],
            errors: [{ messageId: "restrictedNamed", data: { name: "a" }, type: "Identifier" }]
        },
        {
            code: "let a, b; export { b, a };",
            options: [{ restrictedNamedExports: ["a"] }],
            errors: [{ messageId: "restrictedNamed", data: { name: "a" }, type: "Identifier" }]
        },
        {
            code: "const a = 1, b = 1; export { a, b };",
            options: [{ restrictedNamedExports: ["a", "b"] }],
            errors: [
                { messageId: "restrictedNamed", data: { name: "a" }, type: "Identifier" },
                { messageId: "restrictedNamed", data: { name: "b" }, type: "Identifier" }
            ]
        },
        {
            code: "export { a, b, c }; var a, b, c;",
            options: [{ restrictedNamedExports: ["a", "c"] }],
            errors: [
                { messageId: "restrictedNamed", data: { name: "a" }, type: "Identifier" },
                { messageId: "restrictedNamed", data: { name: "c" }, type: "Identifier" }
            ]
        },
        {
            code: "export { b as a, b } from 'foo';",
            options: [{ restrictedNamedExports: ["a"] }],
            errors: [{ messageId: "restrictedNamed", data: { name: "a" }, type: "Identifier" }]
        },
        {
            code: "export { b as a, b } from 'foo';",
            options: [{ restrictedNamedExports: ["b"] }],
            errors: [{ messageId: "restrictedNamed", data: { name: "b" }, type: "Identifier", column: 18 }]
        },
        {
            code: "export { b as a, b } from 'foo';",
            options: [{ restrictedNamedExports: ["a", "b"] }],
            errors: [
                { messageId: "restrictedNamed", data: { name: "a" }, type: "Identifier" },
                { messageId: "restrictedNamed", data: { name: "b" }, type: "Identifier", column: 18 }
            ]
        },
        {
            code: "export { a, b, c, d, x as e, f, g } from 'foo';",
            options: [{ restrictedNamedExports: ["foo", "b", "bar", "d", "e", "f", "baz"] }],
            errors: [
                { messageId: "restrictedNamed", data: { name: "b" }, type: "Identifier" },
                { messageId: "restrictedNamed", data: { name: "d" }, type: "Identifier" },
                { messageId: "restrictedNamed", data: { name: "e" }, type: "Identifier" },
                { messageId: "restrictedNamed", data: { name: "f" }, type: "Identifier" }
            ]
        },

        // reports "default" in named export declarations (when configured)
        {
            code: "var a; export { a as default };",
            options: [{ restrictedNamedExports: ["default"] }],
            errors: [{ messageId: "restrictedNamed", data: { name: "default" }, type: "Identifier", column: 22 }]
        },
        {
            code: "export { default } from 'foo';",
            options: [{ restrictedNamedExports: ["default"] }],
            errors: [{ messageId: "restrictedNamed", data: { name: "default" }, type: "Identifier", column: 10 }]
        }
    ]
});
