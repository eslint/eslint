/**
 * @fileoverview Tests for space-before-block rule.
 * @author Mathias Schreck <https://github.com/lo1tuma>
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/space-before-blocks"),
    RuleTester = require("../../../lib/rule-tester/flat-rule-tester"),
    fixtureParser = require("../../fixtures/fixture-parser");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester(),
    alwaysArgs = ["always"],
    neverArgs = ["never"],
    functionsOnlyArgs = [{ functions: "always", keywords: "never", classes: "never" }],
    keywordOnlyArgs = [{ functions: "never", keywords: "always", classes: "never" }],
    classesOnlyArgs = [{ functions: "never", keywords: "never", classes: "always" }],
    functionsAlwaysOthersOffArgs = [{ functions: "always", keywords: "off", classes: "off" }],
    keywordAlwaysOthersOffArgs = [{ functions: "off", keywords: "always", classes: "off" }],
    classesAlwaysOthersOffArgs = [{ functions: "off", keywords: "off", classes: "always" }],
    functionsNeverOthersOffArgs = [{ functions: "never", keywords: "off", classes: "off" }],
    keywordNeverOthersOffArgs = [{ functions: "off", keywords: "never", classes: "off" }],
    classesNeverOthersOffArgs = [{ functions: "off", keywords: "off", classes: "never" }],
    expectedSpacingError = { messageId: "missingSpace" },
    expectedNoSpacingError = { messageId: "unexpectedSpace" };

ruleTester.run("space-before-blocks", rule, {
    valid: [
        "if(a) {}",
        "if(a)  {}",
        { code: "if(a){}", options: neverArgs },
        { code: "if(a){}", options: functionsOnlyArgs },
        { code: "if(a) {}", options: keywordOnlyArgs },
        { code: "if(a){ function b() {} }", options: functionsOnlyArgs },
        { code: "if(a) { function b(){} }", options: keywordOnlyArgs },
        "if(a)\n{}",
        { code: "if(a)\n{}", options: neverArgs },
        "if(a) {}else {}",
        { code: "if(a){}else{}", options: neverArgs },
        { code: "if(a){}else{}", options: functionsOnlyArgs },
        { code: "if(a) {} else {}", options: keywordOnlyArgs },
        { code: "if(a){ function b() {} }else{}", options: functionsOnlyArgs },
        { code: "if(a) { function b(){} } else {}", options: keywordOnlyArgs },
        "function a() {}",
        { code: "function a(){}", options: neverArgs },
        {
            code: "export default class{}",
            options: functionsOnlyArgs,
            languageOptions: { ecmaVersion: 6, sourceType: "module" }
        },
        {
            code: "export default class {}",
            options: classesOnlyArgs,
            languageOptions: { ecmaVersion: 6, sourceType: "module" }
        },
        {
            code: "export default function a() {}",
            options: functionsOnlyArgs,
            languageOptions: { ecmaVersion: 6, sourceType: "module" }
        },
        {
            code: "export default function a(){}",
            options: keywordOnlyArgs,
            languageOptions: { ecmaVersion: 6, sourceType: "module" }
        },
        { code: "export function a(){}", options: keywordOnlyArgs, languageOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "export function a() {}", options: functionsOnlyArgs, languageOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "function a(){}", options: keywordOnlyArgs },
        { code: "function a() {}", options: functionsOnlyArgs },
        { code: "function a(){ if(b) {} }", options: keywordOnlyArgs },
        { code: "function a() { if(b){} }", options: functionsOnlyArgs },
        "switch(a.b(c < d)) { case 'foo': foo(); break; default: if (a) { bar(); } }",
        "switch(a) { }",
        "switch(a)  {}",
        { code: "switch(a.b(c < d)){ case 'foo': foo(); break; default: if (a){ bar(); } }", options: neverArgs },
        { code: "switch(a.b(c < d)){ case 'foo': foo(); break; default: if (a){ bar(); } }", options: functionsOnlyArgs },
        { code: "switch(a){}", options: neverArgs },
        { code: "switch(a){}", options: functionsOnlyArgs },
        { code: "switch(a) {}", options: keywordOnlyArgs },
        "try {}catch(a) {}",
        { code: "try{}catch(a){}", options: neverArgs },
        { code: "try{}catch(a){}", options: functionsOnlyArgs },
        { code: "try {} catch(a) {}", options: keywordOnlyArgs },
        { code: "try{ function b() {} }catch(a){}", options: functionsOnlyArgs },
        { code: "try { function b(){} } catch(a) {}", options: keywordOnlyArgs },
        "for(;;) {}",
        { code: "for(;;){}", options: neverArgs },
        { code: "for(;;){}", options: functionsOnlyArgs },
        { code: "for(;;) {}", options: keywordOnlyArgs },
        { code: "for(;;){ function a() {} }", options: functionsOnlyArgs },
        { code: "for(;;) { function a(){} }", options: keywordOnlyArgs },
        "while(a) {}",
        { code: "while(a){}", options: neverArgs },
        { code: "while(a){}", options: functionsOnlyArgs },
        { code: "while(a) {}", options: keywordOnlyArgs },
        { code: "while(a){ function b() {} }", options: functionsOnlyArgs },
        { code: "while(a) { function b(){} }", options: keywordOnlyArgs },
        {
            code: "class test { constructor() {} }",
            options: [{ functions: "always", keywords: "never" }],
            languageOptions: { ecmaVersion: 6 }
        },
        {
            code: "class test { constructor(){} }",
            options: classesOnlyArgs,
            languageOptions: { ecmaVersion: 6 }
        },
        {
            code: "class test{ constructor() {} }",
            options: functionsOnlyArgs,
            languageOptions: { ecmaVersion: 6 }
        },
        {
            code: "class test {}",
            options: classesOnlyArgs,
            languageOptions: { ecmaVersion: 6 }
        },
        {
            code: "class test{}",
            options: functionsOnlyArgs,
            languageOptions: { ecmaVersion: 6 }
        },
        {
            code: "class test{}",
            options: neverArgs,
            languageOptions: { ecmaVersion: 6 }
        },
        {
            code: "class test {}",
            languageOptions: { ecmaVersion: 6 }
        },
        { code: "function a(){if(b) {}}", options: keywordAlwaysOthersOffArgs },
        { code: "function a() {if(b) {}}", options: keywordAlwaysOthersOffArgs },
        { code: "function a() {if(b){}}", options: functionsAlwaysOthersOffArgs },
        { code: "function a() {if(b) {}}", options: functionsAlwaysOthersOffArgs },
        {
            code: "class test { constructor(){if(a){}} }",
            options: classesAlwaysOthersOffArgs,
            languageOptions: { ecmaVersion: 6 }
        },
        {
            code: "class test { constructor() {if(a){}} }",
            options: classesAlwaysOthersOffArgs,
            languageOptions: { ecmaVersion: 6 }
        },
        {
            code: "class test { constructor(){if(a) {}} }",
            options: classesAlwaysOthersOffArgs,
            languageOptions: { ecmaVersion: 6 }
        },
        {
            code: "class test { constructor() {if(a) {}} }",
            options: classesAlwaysOthersOffArgs,
            languageOptions: { ecmaVersion: 6 }
        },
        { code: "function a(){if(b){}}", options: keywordNeverOthersOffArgs },
        { code: "function a() {if(b){}}", options: keywordNeverOthersOffArgs },
        { code: "function a(){if(b){}}", options: functionsNeverOthersOffArgs },
        { code: "function a(){if(b) {}}", options: functionsNeverOthersOffArgs },
        {
            code: "class test{ constructor(){if(a){}} }",
            options: classesNeverOthersOffArgs,
            languageOptions: { ecmaVersion: 6 }
        },
        {
            code: "class test{ constructor() {if(a){}} }",
            options: classesNeverOthersOffArgs,
            languageOptions: { ecmaVersion: 6 }
        },
        {
            code: "class test{ constructor(){if(a) {}} }",
            options: classesNeverOthersOffArgs,
            languageOptions: { ecmaVersion: 6 }
        },
        {
            code: "class test{ constructor() {if(a) {}} }",
            options: classesNeverOthersOffArgs,
            languageOptions: { ecmaVersion: 6 }
        },

        // https://github.com/eslint/eslint/issues/3769
        { code: "()=>{};", options: ["always"], languageOptions: { ecmaVersion: 6 } },
        { code: "() => {};", options: ["never"], languageOptions: { ecmaVersion: 6 } },

        // https://github.com/eslint/eslint/issues/1338
        "if(a) {}else{}",
        { code: "if(a){}else {}", options: neverArgs },
        { code: "try {}catch(a){}", options: functionsOnlyArgs },
        { code: "export default class{}", options: classesOnlyArgs, languageOptions: { ecmaVersion: 6, sourceType: "module" } },

        // https://github.com/eslint/eslint/issues/15082
        { code: "switch(x) { case 9:{ break; } }", options: alwaysArgs },
        { code: "switch(x){ case 9: { break; } }", options: neverArgs },
        { code: "switch(x) { case (9):{ break; } }", options: alwaysArgs },
        { code: "switch(x){ case (9): { break; } }", options: neverArgs },
        { code: "switch(x) { default:{ break; } }", options: alwaysArgs },
        { code: "switch(x){ default: { break; } }", options: neverArgs },

        // not conflict with `keyword-spacing`
        {
            code: "(class{ static{} })",
            options: ["always"],
            languageOptions: { ecmaVersion: 2022 }
        },
        {
            code: "(class { static {} })",
            options: ["never"],
            languageOptions: { ecmaVersion: 2022 }
        }
    ],
    invalid: [
        {
            code: "if(a){}",
            output: "if(a) {}",
            errors: [{ messageId: "missingSpace", line: 1, column: 6 }]
        },
        {
            code: "if(a){}",
            output: "if(a) {}",
            options: keywordOnlyArgs,
            errors: [expectedSpacingError]
        },
        {
            code: "if(a) {}",
            output: "if(a){}",
            options: functionsOnlyArgs,
            errors: [expectedNoSpacingError]
        },
        {
            code: "if(a) { function a() {} }",
            output: "if(a){ function a() {} }",
            options: functionsOnlyArgs,
            errors: [{ messageId: "unexpectedSpace", line: 1, column: 7 }]
        },
        {
            code: "if(a) { function a() {} }",
            output: "if(a) { function a(){} }",
            options: keywordOnlyArgs,
            errors: [{ messageId: "unexpectedSpace", line: 1, column: 22 }]
        },
        {
            code: "if(a) {}",
            output: "if(a){}",
            options: neverArgs,
            errors: [expectedNoSpacingError]
        },
        {
            code: "function a(){}",
            output: "function a() {}",
            errors: [expectedSpacingError]
        },
        {
            code: "function a() {}",
            output: "function a(){}",
            options: neverArgs,
            errors: [expectedNoSpacingError]
        },
        {
            code: "function a()    {}",
            output: "function a(){}",
            options: neverArgs,
            errors: [expectedNoSpacingError]
        },
        {
            code: "function a(){ if (a){} }",
            output: "function a() { if (a){} }",
            options: functionsOnlyArgs,
            errors: [{ messageId: "missingSpace", line: 1, column: 13 }]
        },
        {
            code: "function a() { if (a) {} }",
            output: "function a(){ if (a) {} }",
            options: keywordOnlyArgs,
            errors: [{ messageId: "unexpectedSpace", line: 1, column: 14 }]
        },
        {
            code: "function a(){}",
            output: "function a() {}",
            options: functionsOnlyArgs,
            errors: [expectedSpacingError]
        },
        {
            code: "function a() {}",
            output: "function a(){}",
            options: keywordOnlyArgs,
            errors: [expectedNoSpacingError]
        },
        {
            code: "switch(a){}",
            output: "switch(a) {}",
            errors: [expectedSpacingError]
        },
        {
            code: "switch(a) {}",
            output: "switch(a){}",
            options: neverArgs,
            errors: [expectedNoSpacingError]
        },
        {
            code: "switch(a){}",
            output: "switch(a) {}",
            options: keywordOnlyArgs,
            errors: [expectedSpacingError]
        },
        {
            code: "switch(a) {}",
            output: "switch(a){}",
            options: functionsOnlyArgs,
            errors: [expectedNoSpacingError]
        },
        {
            code: "switch(a.b()){ case 'foo': foo(); break; default: if (a) { bar(); } }",
            output: "switch(a.b()) { case 'foo': foo(); break; default: if (a) { bar(); } }",
            errors: [expectedSpacingError]
        },
        {
            code: "switch(a.b()) { case 'foo': foo(); break; default: if (a){ bar(); } }",
            output: "switch(a.b()){ case 'foo': foo(); break; default: if (a){ bar(); } }",
            options: neverArgs,
            errors: [expectedNoSpacingError]
        },
        {
            code: "try{}catch(a){}",
            output: "try{}catch(a) {}",
            errors: [expectedSpacingError]
        },
        {
            code: "try {}catch(a) {}",
            output: "try {}catch(a){}",
            options: neverArgs,
            errors: [expectedNoSpacingError]
        },
        {
            code: "try {} catch(a){}",
            output: "try {} catch(a) {}",
            options: keywordOnlyArgs,
            errors: [expectedSpacingError]
        },
        {
            code: "try { function b() {} } catch(a) {}",
            output: "try { function b(){} } catch(a) {}",
            options: keywordOnlyArgs,
            errors: [{ messageId: "unexpectedSpace", line: 1, column: 20 }]
        },
        {
            code: "try{ function b(){} }catch(a){}",
            output: "try{ function b() {} }catch(a){}",
            options: functionsOnlyArgs,
            errors: [{ messageId: "missingSpace", line: 1, column: 18 }]
        },
        {
            code: "for(;;){}",
            output: "for(;;) {}",
            errors: [expectedSpacingError]
        },
        {
            code: "for(;;) {}",
            output: "for(;;){}",
            options: neverArgs,
            errors: [expectedNoSpacingError]
        },
        {
            code: "for(;;){}",
            output: "for(;;) {}",
            options: keywordOnlyArgs,
            errors: [expectedSpacingError]
        },
        {
            code: "for(;;) {}",
            output: "for(;;){}",
            options: functionsOnlyArgs,
            errors: [expectedNoSpacingError]
        },
        {
            code: "for(;;){ function a(){} }",
            output: "for(;;){ function a() {} }",
            options: functionsOnlyArgs,
            errors: [expectedSpacingError]
        },
        {
            code: "for(;;) { function a() {} }",
            output: "for(;;) { function a(){} }",
            options: keywordOnlyArgs,
            errors: [expectedNoSpacingError]
        },
        {
            code: "while(a){}",
            output: "while(a) {}",
            errors: [expectedSpacingError]
        },
        {
            code: "while(a) {}",
            output: "while(a){}",
            options: neverArgs,
            errors: [expectedNoSpacingError]
        },
        {
            code: "while(a){}",
            output: "while(a) {}",
            options: keywordOnlyArgs,
            errors: [expectedSpacingError]
        },
        {
            code: "while(a) {}",
            output: "while(a){}",
            options: functionsOnlyArgs,
            errors: [expectedNoSpacingError]
        },
        {
            code: "while(a){ function a(){} }",
            output: "while(a){ function a() {} }",
            options: functionsOnlyArgs,
            errors: [expectedSpacingError]
        },
        {
            code: "while(a) { function a() {} }",
            output: "while(a) { function a(){} }",
            options: keywordOnlyArgs,
            errors: [expectedNoSpacingError]
        },
        {
            code: "export function a() { if(b) {} }",
            output: "export function a() { if(b){} }",
            options: functionsOnlyArgs,
            errors: [expectedNoSpacingError],
            languageOptions: { ecmaVersion: 6, sourceType: "module" }
        },
        {
            code: "export function a(){ if(b){} }",
            output: "export function a(){ if(b) {} }",
            options: keywordOnlyArgs,
            errors: [expectedSpacingError],
            languageOptions: { ecmaVersion: 6, sourceType: "module" }
        },
        {
            code: "export function a(){}",
            output: "export function a() {}",
            options: functionsOnlyArgs,
            errors: [expectedSpacingError],
            languageOptions: { ecmaVersion: 6, sourceType: "module" }
        },
        {
            code: "export default function (a) {}",
            output: "export default function (a){}",
            options: keywordOnlyArgs,
            errors: [expectedNoSpacingError],
            languageOptions: { ecmaVersion: 6, sourceType: "module" }
        },
        {
            code: "export function a() {}",
            output: "export function a(){}",
            options: keywordOnlyArgs,
            errors: [expectedNoSpacingError],
            languageOptions: { ecmaVersion: 6, sourceType: "module" }
        },
        {
            code: "class test{}",
            output: "class test {}",
            errors: [expectedSpacingError],
            languageOptions: { ecmaVersion: 6 }
        },
        {
            code: "class test{}",
            output: "class test {}",
            options: classesOnlyArgs,
            errors: [expectedSpacingError],
            languageOptions: { ecmaVersion: 6 }
        },
        {
            code: "class test{ constructor(){} }",
            output: "class test{ constructor() {} }",
            options: functionsOnlyArgs,
            errors: [expectedSpacingError],
            languageOptions: { ecmaVersion: 6 }
        },
        {
            code: "class test { constructor() {} }",
            output: "class test { constructor(){} }",
            options: classesOnlyArgs,
            errors: [expectedNoSpacingError],
            languageOptions: { ecmaVersion: 6 }
        },
        {
            code: "class test {}",
            output: "class test{}",
            options: functionsOnlyArgs,
            errors: [expectedNoSpacingError],
            languageOptions: { ecmaVersion: 6 }
        },
        {
            code: "class test {}",
            output: "class test{}",
            options: neverArgs,
            errors: [expectedNoSpacingError],
            languageOptions: { ecmaVersion: 6 }
        },
        {
            code: "if(a){ function a(){} }",
            output: "if(a){ function a() {} }",
            options: functionsAlwaysOthersOffArgs,
            errors: [expectedSpacingError]
        },
        {
            code: "if(a) { function a(){} }",
            output: "if(a) { function a() {} }",
            options: functionsAlwaysOthersOffArgs,
            errors: [expectedSpacingError]
        },
        {
            code: "if(a){ function a(){} }",
            output: "if(a) { function a(){} }",
            options: keywordAlwaysOthersOffArgs,
            errors: [expectedSpacingError]
        },
        {
            code: "if(a){ function a() {} }",
            output: "if(a) { function a() {} }",
            options: keywordAlwaysOthersOffArgs,
            errors: [expectedSpacingError]
        },
        {
            code: "class test{ constructor(){} }",
            output: "class test { constructor(){} }",
            options: classesAlwaysOthersOffArgs,
            errors: [expectedSpacingError],
            languageOptions: { ecmaVersion: 6 }
        },
        {
            code: "class test{ constructor() {} }",
            output: "class test { constructor() {} }",
            options: classesAlwaysOthersOffArgs,
            errors: [expectedSpacingError],
            languageOptions: { ecmaVersion: 6 }
        },
        {
            code: "if(a){ function a() {} }",
            output: "if(a){ function a(){} }",
            options: functionsNeverOthersOffArgs,
            errors: [expectedNoSpacingError]
        },
        {
            code: "if(a) { function a() {} }",
            output: "if(a) { function a(){} }",
            options: functionsNeverOthersOffArgs,
            errors: [expectedNoSpacingError]
        },
        {
            code: "if(a) { function a(){} }",
            output: "if(a){ function a(){} }",
            options: keywordNeverOthersOffArgs,
            errors: [expectedNoSpacingError]
        },
        {
            code: "if(a) { function a() {} }",
            output: "if(a){ function a() {} }",
            options: keywordNeverOthersOffArgs,
            errors: [expectedNoSpacingError]
        },
        {
            code: "class test { constructor(){} }",
            output: "class test{ constructor(){} }",
            options: classesNeverOthersOffArgs,
            errors: [expectedNoSpacingError],
            languageOptions: { ecmaVersion: 6 }
        },
        {
            code: "class test { constructor() {} }",
            output: "class test{ constructor() {} }",
            options: classesNeverOthersOffArgs,
            errors: [expectedNoSpacingError],
            languageOptions: { ecmaVersion: 6 }
        },

        // https://github.com/eslint/eslint/issues/13553
        {
            code: "class A { foo(bar: string): void{} }",
            output: "class A { foo(bar: string): void {} }",
            errors: [expectedSpacingError],
            languageOptions: {
                parser: require(fixtureParser("space-before-blocks", "return-type-keyword-1"))
            }
        },
        {
            code: "function foo(): null {}",
            output: "function foo(): null{}",
            options: neverArgs,
            errors: [expectedNoSpacingError],
            languageOptions: {
                parser: require(fixtureParser("space-before-blocks", "return-type-keyword-2"))
            }
        },

        // https://github.com/eslint/eslint/issues/15082 regression tests (only blocks after switch case colons should be excluded)
        {
            code: "label:{}",
            output: "label: {}",
            options: alwaysArgs,
            errors: [expectedSpacingError]
        },
        {
            code: "label: {}",
            output: "label:{}",
            options: neverArgs,
            errors: [expectedNoSpacingError]
        },
        {
            code: "switch(x) { case 9: label:{ break; } }",
            output: "switch(x) { case 9: label: { break; } }",
            options: alwaysArgs,
            errors: [expectedSpacingError]
        },
        {
            code: "switch(x){ case 9: label: { break; } }",
            output: "switch(x){ case 9: label:{ break; } }",
            options: neverArgs,
            errors: [expectedNoSpacingError]
        },
        {
            code: "switch(x) { case 9: if(y){ break; } }",
            output: "switch(x) { case 9: if(y) { break; } }",
            options: alwaysArgs,
            errors: [expectedSpacingError]
        },
        {
            code: "switch(x){ case 9: if(y) { break; } }",
            output: "switch(x){ case 9: if(y){ break; } }",
            options: neverArgs,
            errors: [expectedNoSpacingError]
        },
        {
            code: "switch(x) { case 9: y;{ break; } }",
            output: "switch(x) { case 9: y; { break; } }",
            options: alwaysArgs,
            errors: [expectedSpacingError]
        },
        {
            code: "switch(x){ case 9: y; { break; } }",
            output: "switch(x){ case 9: y;{ break; } }",
            options: neverArgs,
            errors: [expectedNoSpacingError]
        },
        {
            code: "switch(x) { case 9: switch(y){} }",
            output: "switch(x) { case 9: switch(y) {} }",
            options: alwaysArgs,
            errors: [expectedSpacingError]
        },
        {
            code: "switch(x){ case 9: switch(y) {} }",
            output: "switch(x){ case 9: switch(y){} }",
            options: neverArgs,
            errors: [expectedNoSpacingError]
        }
    ]
});
