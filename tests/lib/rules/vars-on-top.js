/**
 * @fileoverview Tests for vars-on-top rule.
 * @author Danny Fritz
 * @author Gyandeep Singh
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/vars-on-top"),
    EslintTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new EslintTester();
const error = { messageId: "top", type: "VariableDeclaration" };

ruleTester.run("vars-on-top", rule, {

    valid: [
        [
            "var first = 0;",
            "function foo() {",
            "    first = 2;",
            "}"
        ].join("\n"),
        [
            "function foo() {",
            "}"
        ].join("\n"),
        [
            "function foo() {",
            "   var first;",
            "   if (true) {",
            "       first = true;",
            "   } else {",
            "       first = 1;",
            "   }",
            "}"
        ].join("\n"),
        [
            "function foo() {",
            "   var first;",
            "   var second = 1;",
            "   var third;",
            "   var fourth = 1, fifth, sixth = third;",
            "   var seventh;",
            "   if (true) {",
            "       third = true;",
            "   }",
            "   first = second;",
            "}"
        ].join("\n"),
        [
            "function foo() {",
            "   var i;",
            "   for (i = 0; i < 10; i++) {",
            "       alert(i);",
            "   }",
            "}"
        ].join("\n"),
        [
            "function foo() {",
            "   var outer;",
            "   function inner() {",
            "       var inner = 1;",
            "       var outer = inner;",
            "   }",
            "   outer = 1;",
            "}"
        ].join("\n"),
        [
            "function foo() {",
            "   var first;",
            "   //Hello",
            "   var second = 1;",
            "   first = second;",
            "}"
        ].join("\n"),
        [
            "function foo() {",
            "   var first;",
            "   /*",
            "       Hello Clarice",
            "   */",
            "   var second = 1;",
            "   first = second;",
            "}"
        ].join("\n"),
        [
            "function foo() {",
            "   var first;",
            "   var second = 1;",
            "   function bar(){",
            "       var first;",
            "       first = 5;",
            "   }",
            "   first = second;",
            "}"
        ].join("\n"),
        [
            "function foo() {",
            "   var first;",
            "   var second = 1;",
            "   function bar(){",
            "       var third;",
            "       third = 5;",
            "   }",
            "   first = second;",
            "}"
        ].join("\n"),
        [
            "function foo() {",
            "   var first;",
            "   var bar = function(){",
            "       var third;",
            "       third = 5;",
            "   }",
            "   first = 5;",
            "}"
        ].join("\n"),
        [
            "function foo() {",
            "   var first;",
            "   first.onclick(function(){",
            "       var third;",
            "       third = 5;",
            "   });",
            "   first = 5;",
            "}"
        ].join("\n"),
        {
            code: [
                "function foo() {",
                "   var i = 0;",
                "   for (let j = 0; j < 10; j++) {",
                "       alert(j);",
                "   }",
                "   i = i + 1;",
                "}"
            ].join("\n"),
            parserOptions: {
                ecmaVersion: 6
            }
        },
        "'use strict'; var x; f();",
        "'use strict'; 'directive'; var x; var y; f();",
        "function f() { 'use strict'; var x; f(); }",
        "function f() { 'use strict'; 'directive'; var x; var y; f(); }",
        { code: "import React from 'react'; var y; function f() { 'use strict'; var x; var y; f(); }", parserOptions: { sourceType: "module" } },
        { code: "'use strict'; import React from 'react'; var y; function f() { 'use strict'; var x; var y; f(); }", parserOptions: { sourceType: "module" } },
        { code: "import React from 'react'; 'use strict'; var y; function f() { 'use strict'; var x; var y; f(); }", parserOptions: { sourceType: "module" } },
        { code: "import * as foo from 'mod.js'; 'use strict'; var y; function f() { 'use strict'; var x; var y; f(); }", parserOptions: { sourceType: "module" } },
        { code: "import { square, diag } from 'lib'; 'use strict'; var y; function f() { 'use strict'; var x; var y; f(); }", parserOptions: { sourceType: "module" } },
        { code: "import { default as foo } from 'lib'; 'use strict'; var y; function f() { 'use strict'; var x; var y; f(); }", parserOptions: { sourceType: "module" } },
        { code: "import 'src/mylib'; 'use strict'; var y; function f() { 'use strict'; var x; var y; f(); }", parserOptions: { sourceType: "module" } },
        { code: "import theDefault, { named1, named2 } from 'src/mylib'; 'use strict'; var y; function f() { 'use strict'; var x; var y; f(); }", parserOptions: { sourceType: "module" } },
        {
            code: [
                "export var x;",
                "var y;",
                "var z;"
            ].join("\n"),
            parserOptions: {
                ecmaVersion: 6,
                sourceType: "module"
            }
        },
        {
            code: [
                "var x;",
                "export var y;",
                "var z;"
            ].join("\n"),
            parserOptions: {
                ecmaVersion: 6,
                sourceType: "module"
            }
        },
        {
            code: [
                "var x;",
                "var y;",
                "export var z;"
            ].join("\n"),
            parserOptions: {
                ecmaVersion: 6,
                sourceType: "module"
            }
        }
    ],

    invalid: [
        {
            code: [
                "var first = 0;",
                "function foo() {",
                "    first = 2;",
                "    second = 2;",
                "}",
                "var second = 0;"
            ].join("\n"),
            errors: [error]
        },
        {
            code: [
                "function foo() {",
                "   var first;",
                "   first = 1;",
                "   first = 2;",
                "   first = 3;",
                "   first = 4;",
                "   var second = 1;",
                "   second = 2;",
                "   first = second;",
                "}"
            ].join("\n"),
            errors: [error]
        },
        {
            code: [
                "function foo() {",
                "   var first;",
                "   if (true) {",
                "       var second = true;",
                "   }",
                "   first = second;",
                "}"
            ].join("\n"),
            errors: [error]
        },
        {
            code: [
                "function foo() {",
                "   for (var i = 0; i < 10; i++) {",
                "       alert(i);",
                "   }",
                "}"
            ].join("\n"),
            errors: [error]
        },
        {
            code: [
                "function foo() {",
                "   var first = 10;",
                "   var i;",
                "   for (i = 0; i < first; i ++) {",
                "       var second = i;",
                "   }",
                "}"
            ].join("\n"),
            errors: [error]
        },
        {
            code: [
                "function foo() {",
                "   var first = 10;",
                "   var i;",
                "   switch (first) {",
                "       case 10:",
                "           var hello = 1;",
                "           break;",
                "   }",
                "}"
            ].join("\n"),
            errors: [error]
        },
        {
            code: [
                "function foo() {",
                "   var first = 10;",
                "   var i;",
                "   try {",
                "       var hello = 1;",
                "   } catch (e) {",
                "       alert('error');",
                "   }",
                "}"
            ].join("\n"),
            errors: [error]
        },
        {
            code: [
                "function foo() {",
                "   var first = 10;",
                "   var i;",
                "   try {",
                "       asdf;",
                "   } catch (e) {",
                "       var hello = 1;",
                "   }",
                "}"
            ].join("\n"),
            errors: [error]
        },
        {
            code: [
                "function foo() {",
                "   var first = 10;",
                "   while (first) {",
                "       var hello = 1;",
                "   }",
                "}"
            ].join("\n"),
            errors: [error]
        },
        {
            code: [
                "function foo() {",
                "   var first = 10;",
                "   do {",
                "       var hello = 1;",
                "   } while (first == 10);",
                "}"
            ].join("\n"),
            errors: [error]
        },
        {
            code: [
                "function foo() {",
                "   var first = [1,2,3];",
                "   for (var item in first) {",
                "       item++;",
                "   }",
                "}"
            ].join("\n"),
            errors: [error]
        },
        {
            code: [
                "function foo() {",
                "   var first = [1,2,3];",
                "   var item;",
                "   for (item in first) {",
                "       var hello = item;",
                "   }",
                "}"
            ].join("\n"),
            errors: [error]
        },
        {
            code: [
                "var foo = () => {",
                "   var first = [1,2,3];",
                "   var item;",
                "   for (item in first) {",
                "       var hello = item;",
                "   }",
                "}"
            ].join("\n"),
            parserOptions: { ecmaVersion: 6 },
            errors: [error]
        },
        {
            code: "'use strict'; 0; var x; f();",
            errors: [error]
        },
        {
            code: "'use strict'; var x; 'directive'; var y; f();",
            errors: [error]
        },
        {
            code: "function f() { 'use strict'; 0; var x; f(); }",
            errors: [error]
        },
        {
            code: "function f() { 'use strict'; var x; 'directive';  var y; f(); }",
            errors: [error]
        },
        {
            code: [
                "export function f() {}",
                "var x;"
            ].join("\n"),
            parserOptions: {
                ecmaVersion: 6,
                sourceType: "module"
            },
            errors: [error]
        },
        {
            code: [
                "var x;",
                "export function f() {}",
                "var y;"
            ].join("\n"),
            parserOptions: {
                ecmaVersion: 6,
                sourceType: "module"
            },
            errors: [error]
        },
        {
            code: [
                "import {foo} from 'foo';",
                "export {foo};",
                "var test = 1;"
            ].join("\n"),
            parserOptions: {
                ecmaVersion: 6,
                sourceType: "module"
            },
            errors: [error]
        },
        {
            code: [
                "export {foo} from 'foo';",
                "var test = 1;"
            ].join("\n"),
            parserOptions: {
                ecmaVersion: 6,
                sourceType: "module"
            },
            errors: [error]
        },
        {
            code: [
                "export * from 'foo';",
                "var test = 1;"
            ].join("\n"),
            parserOptions: {
                ecmaVersion: 6,
                sourceType: "module"
            },
            errors: [error]
        }
    ]
});
