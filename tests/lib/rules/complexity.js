/**
 * @fileoverview Tests for complexity rule.
 * @author Patrick Brosset
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/complexity"),
    { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Generates a code string with the amount of complexity specified in the parameter
 * @param {int} complexity The level of complexity
 * @returns {string} Code with the amount of complexity specified in the parameter
 * @private
 */
function createComplexity(complexity) {
    let funcString = "function test (a) { if (a === 1) {";

    for (let i = 2; i < complexity; i++) {
        funcString += `} else if (a === ${i}) {`;
    }

    funcString += "} };";

    return funcString;
}

/**
 * Create an expected error object
 * @param {string} name The name of the symbol being tested
 * @param {number} complexity The cyclomatic complexity value of the symbol
 * @param {number} max The maximum cyclomatic complexity value of the symbol
 * @returns {Object} The error object
 */
function makeError(name, complexity, max) {
    return {
        messageId: "complex",
        data: { name, complexity, max }
    };
}

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 2021 } });

ruleTester.run("complexity", rule, {
    valid: [
        "function a(x) {}",
        { code: "function b(x) {}", options: [1] },
        { code: "function a(x) {if (true) {return x;}}", options: [2] },
        { code: "function a(x) {if (true) {return x;} else {return x+1;}}", options: [2] },
        { code: "function a(x) {if (true) {return x;} else if (false) {return x+1;} else {return 4;}}", options: [3] },
        { code: "function a(x) {for(var i = 0; i < 5; i ++) {x ++;} return x;}", options: [2] },
        { code: "function a(obj) {for(var i in obj) {obj[i] = 3;}}", options: [2] },
        { code: "function a(x) {for(var i = 0; i < 5; i ++) {if(i % 2 === 0) {x ++;}} return x;}", options: [3] },
        { code: "function a(obj) {if(obj){ for(var x in obj) {try {x.getThis();} catch (e) {x.getThat();}}} else {return false;}}", options: [4] },
        { code: "function a(x) {try {x.getThis();} catch (e) {x.getThat();}}", options: [2] },
        { code: "function a(x) {return x === 4 ? 3 : 5;}", options: [2] },
        { code: "function a(x) {return x === 4 ? 3 : (x === 3 ? 2 : 1);}", options: [3] },
        { code: "function a(x) {return x || 4;}", options: [2] },
        { code: "function a(x) {x && 4;}", options: [2] },
        { code: "function a(x) {x ?? 4;}", options: [2] },
        { code: "function a(x) {x ||= 4;}", options: [2] },
        { code: "function a(x) {x &&= 4;}", options: [2] },
        { code: "function a(x) {x ??= 4;}", options: [2] },
        { code: "function a(x) {x = 4;}", options: [1] },
        { code: "function a(x) {x |= 4;}", options: [1] },
        { code: "function a(x) {x &= 4;}", options: [1] },
        { code: "function a(x) {x += 4;}", options: [1] },
        { code: "function a(x) {x >>= 4;}", options: [1] },
        { code: "function a(x) {x >>>= 4;}", options: [1] },
        { code: "function a(x) {x == 4;}", options: [1] },
        { code: "function a(x) {x === 4;}", options: [1] },
        { code: "function a(x) {switch(x){case 1: 1; break; case 2: 2; break; default: 3;}}", options: [3] },
        { code: "function a(x) {switch(x){case 1: 1; break; case 2: 2; break; default: if(x == 'foo') {5;};}}", options: [4] },
        { code: "function a(x) {while(true) {'foo';}}", options: [2] },
        { code: "function a(x) {do {'foo';} while (true)}", options: [2] },
        { code: "if (foo) { bar(); }", options: [3] },
        { code: "var a = (x) => {do {'foo';} while (true)}", options: [2], parserOptions: { ecmaVersion: 6 } },

        // class fields
        { code: "function foo() { class C { x = a || b; y = c || d; } }", options: [2], parserOptions: { ecmaVersion: 2022 } },
        { code: "function foo() { class C { static x = a || b; static y = c || d; } }", options: [2], parserOptions: { ecmaVersion: 2022 } },
        { code: "function foo() { class C { x = a || b; y = c || d; } e || f; }", options: [2], parserOptions: { ecmaVersion: 2022 } },
        { code: "function foo() { a || b; class C { x = c || d; y = e || f; } }", options: [2], parserOptions: { ecmaVersion: 2022 } },
        { code: "function foo() { class C { [x || y] = a || b; } }", options: [2], parserOptions: { ecmaVersion: 2022 } },
        { code: "class C { x = a || b; y() { c || d; } z = e || f; }", options: [2], parserOptions: { ecmaVersion: 2022 } },
        { code: "class C { x() { a || b; } y = c || d; z() { e || f; } }", options: [2], parserOptions: { ecmaVersion: 2022 } },
        { code: "class C { x = (() => { a || b }) || (() => { c || d }) }", options: [2], parserOptions: { ecmaVersion: 2022 } },
        { code: "class C { x = () => { a || b }; y = () => { c || d } }", options: [2], parserOptions: { ecmaVersion: 2022 } },
        { code: "class C { x = a || (() => { b || c }); }", options: [2], parserOptions: { ecmaVersion: 2022 } },
        { code: "class C { x = class { y = a || b; z = c || d; }; }", options: [2], parserOptions: { ecmaVersion: 2022 } },
        { code: "class C { x = a || class { y = b || c; z = d || e; }; }", options: [2], parserOptions: { ecmaVersion: 2022 } },
        { code: "class C { x; y = a; static z; static q = b; }", options: [1], parserOptions: { ecmaVersion: 2022 } },

        // class static blocks
        { code: "function foo() { class C { static { a || b; } static { c || d; } } }", options: [2], parserOptions: { ecmaVersion: 2022 } },
        { code: "function foo() { a || b; class C { static { c || d; } } }", options: [2], parserOptions: { ecmaVersion: 2022 } },
        { code: "function foo() { class C { static { a || b; } } c || d; }", options: [2], parserOptions: { ecmaVersion: 2022 } },
        { code: "function foo() { class C { static { a || b; } } class D { static { c || d; } } }", options: [2], parserOptions: { ecmaVersion: 2022 } },
        { code: "class C { static { a || b; } static { c || d; } }", options: [2], parserOptions: { ecmaVersion: 2022 } },
        { code: "class C { static { a || b; } static { c || d; } static { e || f; } }", options: [2], parserOptions: { ecmaVersion: 2022 } },
        { code: "class C { static { () => a || b; c || d; } }", options: [2], parserOptions: { ecmaVersion: 2022 } },
        { code: "class C { static { a || b; () => c || d; } static { c || d; } }", options: [2], parserOptions: { ecmaVersion: 2022 } },
        { code: "class C { static { a } }", options: [1], parserOptions: { ecmaVersion: 2022 } },
        { code: "class C { static { a } static { b } }", options: [1], parserOptions: { ecmaVersion: 2022 } },
        { code: "class C { static { a || b; } } class D { static { c || d; } }", options: [2], parserOptions: { ecmaVersion: 2022 } },
        { code: "class C { static { a || b; } static c = d || e; }", options: [2], parserOptions: { ecmaVersion: 2022 } },
        { code: "class C { static a = b || c; static { c || d; } }", options: [2], parserOptions: { ecmaVersion: 2022 } },
        { code: "class C { static { a || b; } c = d || e; }", options: [2], parserOptions: { ecmaVersion: 2022 } },
        { code: "class C { a = b || c; static { d || e; } }", options: [2], parserOptions: { ecmaVersion: 2022 } },
        { code: "class C { static { a || b; c || d; } }", options: [3], parserOptions: { ecmaVersion: 2022 } },
        { code: "class C { static { if (a || b) c = d || e; } }", options: [4], parserOptions: { ecmaVersion: 2022 } },

        // object property options
        { code: "function b(x) {}", options: [{ max: 1 }] }
    ],
    invalid: [
        { code: "function a(x) {}", options: [0], errors: [makeError("Function 'a'", 1, 0)] },
        { code: "var func = function () {}", options: [0], errors: [makeError("Function", 1, 0)] },
        { code: "var obj = { a(x) {} }", options: [0], parserOptions: { ecmaVersion: 6 }, errors: [makeError("Method 'a'", 1, 0)] },
        { code: "class Test { a(x) {} }", options: [0], parserOptions: { ecmaVersion: 6 }, errors: [makeError("Method 'a'", 1, 0)] },
        { code: "var a = (x) => {if (true) {return x;}}", options: [1], parserOptions: { ecmaVersion: 6 }, errors: 1 },
        { code: "function a(x) {if (true) {return x;}}", options: [1], errors: 1 },
        { code: "function a(x) {if (true) {return x;} else {return x+1;}}", options: [1], errors: 1 },
        { code: "function a(x) {if (true) {return x;} else if (false) {return x+1;} else {return 4;}}", options: [2], errors: 1 },
        { code: "function a(x) {for(var i = 0; i < 5; i ++) {x ++;} return x;}", options: [1], errors: 1 },
        { code: "function a(obj) {for(var i in obj) {obj[i] = 3;}}", options: [1], errors: 1 },
        { code: "function a(obj) {for(var i of obj) {obj[i] = 3;}}", options: [1], parserOptions: { ecmaVersion: 6 }, errors: 1 },
        { code: "function a(x) {for(var i = 0; i < 5; i ++) {if(i % 2 === 0) {x ++;}} return x;}", options: [2], errors: 1 },
        { code: "function a(obj) {if(obj){ for(var x in obj) {try {x.getThis();} catch (e) {x.getThat();}}} else {return false;}}", options: [3], errors: 1 },
        { code: "function a(x) {try {x.getThis();} catch (e) {x.getThat();}}", options: [1], errors: 1 },
        { code: "function a(x) {return x === 4 ? 3 : 5;}", options: [1], errors: 1 },
        { code: "function a(x) {return x === 4 ? 3 : (x === 3 ? 2 : 1);}", options: [2], errors: 1 },
        { code: "function a(x) {return x || 4;}", options: [1], errors: 1 },
        { code: "function a(x) {x && 4;}", options: [1], errors: 1 },
        { code: "function a(x) {x ?? 4;}", options: [1], errors: 1 },
        { code: "function a(x) {x ||= 4;}", options: [1], errors: 1 },
        { code: "function a(x) {x &&= 4;}", options: [1], errors: 1 },
        { code: "function a(x) {x ??= 4;}", options: [1], errors: 1 },
        { code: "function a(x) {switch(x){case 1: 1; break; case 2: 2; break; default: 3;}}", options: [2], errors: 1 },
        { code: "function a(x) {switch(x){case 1: 1; break; case 2: 2; break; default: if(x == 'foo') {5;};}}", options: [3], errors: 1 },
        { code: "function a(x) {while(true) {'foo';}}", options: [1], errors: 1 },
        { code: "function a(x) {do {'foo';} while (true)}", options: [1], errors: 1 },
        { code: "function a(x) {(function() {while(true){'foo';}})(); (function() {while(true){'bar';}})();}", options: [1], errors: 2 },
        { code: "function a(x) {(function() {while(true){'foo';}})(); (function() {'bar';})();}", options: [1], errors: 1 },
        { code: "var obj = { a(x) { return x ? 0 : 1; } };", options: [1], parserOptions: { ecmaVersion: 6 }, errors: [makeError("Method 'a'", 2, 1)] },
        { code: "var obj = { a: function b(x) { return x ? 0 : 1; } };", options: [1], errors: [makeError("Method 'a'", 2, 1)] },
        {
            code: createComplexity(21),
            errors: [makeError("Function 'test'", 21, 20)]
        },
        {
            code: createComplexity(21),
            options: [{}],
            errors: [makeError("Function 'test'", 21, 20)]
        },

        // class fields
        {
            code: "function foo () { a || b; class C { x; } c || d; }",
            options: [2],
            parserOptions: { ecmaVersion: 2022 },
            errors: [makeError("Function 'foo'", 3, 2)]
        },
        {
            code: "function foo () { a || b; class C { x = c; } d || e; }",
            options: [2],
            parserOptions: { ecmaVersion: 2022 },
            errors: [makeError("Function 'foo'", 3, 2)]
        },
        {
            code: "function foo () { a || b; class C { [x || y]; } }",
            options: [2],
            parserOptions: { ecmaVersion: 2022 },
            errors: [makeError("Function 'foo'", 3, 2)]
        },
        {
            code: "function foo () { a || b; class C { [x || y] = c; } }",
            options: [2],
            parserOptions: { ecmaVersion: 2022 },
            errors: [makeError("Function 'foo'", 3, 2)]
        },
        {
            code: "function foo () { class C { [x || y]; } a || b; }",
            options: [2],
            parserOptions: { ecmaVersion: 2022 },
            errors: [makeError("Function 'foo'", 3, 2)]
        },
        {
            code: "function foo () { class C { [x || y] = a; } b || c; }",
            options: [2],
            parserOptions: { ecmaVersion: 2022 },
            errors: [makeError("Function 'foo'", 3, 2)]
        },
        {
            code: "function foo () { class C { [x || y]; [z || q]; } }",
            options: [2],
            parserOptions: { ecmaVersion: 2022 },
            errors: [makeError("Function 'foo'", 3, 2)]
        },
        {
            code: "function foo () { class C { [x || y] = a; [z || q] = b; } }",
            options: [2],
            parserOptions: { ecmaVersion: 2022 },
            errors: [makeError("Function 'foo'", 3, 2)]
        },
        {
            code: "function foo () { a || b; class C { x = c || d; } e || f; }",
            options: [2],
            parserOptions: { ecmaVersion: 2022 },
            errors: [makeError("Function 'foo'", 3, 2)]
        },
        {
            code: "class C { x(){ a || b; } y = c || d || e; z() { f || g; } }",
            options: [2],
            parserOptions: { ecmaVersion: 2022 },
            errors: [makeError("Class field initializer", 3, 2)]
        },
        {
            code: "class C { x = a || b; y() { c || d || e; } z = f || g; }",
            options: [2],
            parserOptions: { ecmaVersion: 2022 },
            errors: [makeError("Method 'y'", 3, 2)]
        },
        {
            code: "class C { x; y() { c || d || e; } z; }",
            options: [2],
            parserOptions: { ecmaVersion: 2022 },
            errors: [makeError("Method 'y'", 3, 2)]
        },
        {
            code: "class C { x = a || b; }",
            options: [1],
            parserOptions: { ecmaVersion: 2022 },
            errors: [makeError("Class field initializer", 2, 1)]
        },
        {
            code: "(class { x = a || b; })",
            options: [1],
            parserOptions: { ecmaVersion: 2022 },
            errors: [makeError("Class field initializer", 2, 1)]
        },
        {
            code: "class C { static x = a || b; }",
            options: [1],
            parserOptions: { ecmaVersion: 2022 },
            errors: [makeError("Class field initializer", 2, 1)]
        },
        {
            code: "(class { x = a ? b : c; })",
            options: [1],
            parserOptions: { ecmaVersion: 2022 },
            errors: [makeError("Class field initializer", 2, 1)]
        },
        {
            code: "class C { x = a || b || c; }",
            options: [2],
            parserOptions: { ecmaVersion: 2022 },
            errors: [makeError("Class field initializer", 3, 2)]
        },
        {
            code: "class C { x = a || b; y = b || c || d; z = e || f; }",
            options: [2],
            parserOptions: { ecmaVersion: 2022 },
            errors: [{
                ...makeError("Class field initializer", 3, 2),
                line: 1,
                column: 27,
                endLine: 1,
                endColumn: 38
            }]
        },
        {
            code: "class C { x = a || b || c; y = d || e; z = f || g || h; }",
            options: [2],
            parserOptions: { ecmaVersion: 2022 },
            errors: [
                {
                    ...makeError("Class field initializer", 3, 2),
                    line: 1,
                    column: 15,
                    endLine: 1,
                    endColumn: 26
                },
                {
                    ...makeError("Class field initializer", 3, 2),
                    line: 1,
                    column: 44,
                    endLine: 1,
                    endColumn: 55
                }
            ]
        },
        {
            code: "class C { x = () => a || b || c; }",
            options: [2],
            parserOptions: { ecmaVersion: 2022 },
            errors: [makeError("Method 'x'", 3, 2)]
        },
        {
            code: "class C { x = (() => a || b || c) || d; }",
            options: [2],
            parserOptions: { ecmaVersion: 2022 },
            errors: [makeError("Arrow function", 3, 2)]
        },
        {
            code: "class C { x = () => a || b || c; y = d || e; }",
            options: [2],
            parserOptions: { ecmaVersion: 2022 },
            errors: [makeError("Method 'x'", 3, 2)]
        },
        {
            code: "class C { x = () => a || b || c; y = d || e || f; }",
            options: [2],
            parserOptions: { ecmaVersion: 2022 },
            errors: [
                makeError("Method 'x'", 3, 2),
                {
                    ...makeError("Class field initializer", 3, 2),
                    line: 1,
                    column: 38,
                    endLine: 1,
                    endColumn: 49
                }
            ]
        },
        {
            code: "class C { x = function () { a || b }; y = function () { c || d }; }",
            options: [1],
            parserOptions: { ecmaVersion: 2022 },
            errors: [
                makeError("Method 'x'", 2, 1),
                makeError("Method 'y'", 2, 1)
            ]
        },
        {
            code: "class C { x = class { [y || z]; }; }",
            options: [1],
            parserOptions: { ecmaVersion: 2022 },
            errors: [
                {
                    ...makeError("Class field initializer", 2, 1),
                    line: 1,
                    column: 15,
                    endLine: 1,
                    endColumn: 34
                }
            ]
        },
        {
            code: "class C { x = class { [y || z] = a; }; }",
            options: [1],
            parserOptions: { ecmaVersion: 2022 },
            errors: [
                {
                    ...makeError("Class field initializer", 2, 1),
                    line: 1,
                    column: 15,
                    endLine: 1,
                    endColumn: 38
                }
            ]
        },
        {
            code: "class C { x = class { y = a || b; }; }",
            options: [1],
            parserOptions: { ecmaVersion: 2022 },
            errors: [
                {
                    ...makeError("Class field initializer", 2, 1),
                    line: 1,
                    column: 27,
                    endLine: 1,
                    endColumn: 33
                }
            ]
        },

        // class static blocks
        {
            code: "function foo () { a || b; class C { static {} } c || d; }",
            options: [2],
            parserOptions: { ecmaVersion: 2022 },
            errors: [makeError("Function 'foo'", 3, 2)]
        },
        {
            code: "function foo () { a || b; class C { static { c || d; } } e || f; }",
            options: [2],
            parserOptions: { ecmaVersion: 2022 },
            errors: [makeError("Function 'foo'", 3, 2)]
        },
        {
            code: "class C { static { a || b; }  }",
            options: [1],
            parserOptions: { ecmaVersion: 2022 },
            errors: [makeError("Class static block", 2, 1)]
        },
        {
            code: "class C { static { a || b || c; }  }",
            options: [2],
            parserOptions: { ecmaVersion: 2022 },
            errors: [makeError("Class static block", 3, 2)]
        },
        {
            code: "class C { static { a || b; c || d; }  }",
            options: [2],
            parserOptions: { ecmaVersion: 2022 },
            errors: [makeError("Class static block", 3, 2)]
        },
        {
            code: "class C { static { a || b; c || d; e || f; }  }",
            options: [3],
            parserOptions: { ecmaVersion: 2022 },
            errors: [makeError("Class static block", 4, 3)]
        },
        {
            code: "class C { static { a || b; c || d; { e || f; } }  }",
            options: [3],
            parserOptions: { ecmaVersion: 2022 },
            errors: [makeError("Class static block", 4, 3)]
        },
        {
            code: "class C { static { if (a || b) c = d || e; } }",
            options: [3],
            parserOptions: { ecmaVersion: 2022 },
            errors: [makeError("Class static block", 4, 3)]
        },
        {
            code: "class C { static { if (a || b) c = (d => e || f)() || (g => h || i)(); } }",
            options: [3],
            parserOptions: { ecmaVersion: 2022 },
            errors: [makeError("Class static block", 4, 3)]
        },
        {
            code: "class C { x(){ a || b; } static { c || d || e; } z() { f || g; } }",
            options: [2],
            parserOptions: { ecmaVersion: 2022 },
            errors: [makeError("Class static block", 3, 2)]
        },
        {
            code: "class C { x = a || b; static { c || d || e; } y = f || g; }",
            options: [2],
            parserOptions: { ecmaVersion: 2022 },
            errors: [makeError("Class static block", 3, 2)]
        },
        {
            code: "class C { static x = a || b; static { c || d || e; } static y = f || g; }",
            options: [2],
            parserOptions: { ecmaVersion: 2022 },
            errors: [makeError("Class static block", 3, 2)]
        },
        {
            code: "class C { static { a || b; } static(){ c || d || e; } static { f || g; } }",
            options: [2],
            parserOptions: { ecmaVersion: 2022 },
            errors: [makeError("Method 'static'", 3, 2)]
        },
        {
            code: "class C { static { a || b; } static static(){ c || d || e; } static { f || g; } }",
            options: [2],
            parserOptions: { ecmaVersion: 2022 },
            errors: [makeError("Static method 'static'", 3, 2)]
        },
        {
            code: "class C { static { a || b; } static x = c || d || e; static { f || g; } }",
            options: [2],
            parserOptions: { ecmaVersion: 2022 },
            errors: [{
                ...makeError("Class field initializer", 3, 2),
                column: 41,
                endColumn: 52
            }]
        },
        {
            code: "class C { static { a || b || c || d; } static { e || f || g; } }",
            options: [3],
            parserOptions: { ecmaVersion: 2022 },
            errors: [{
                ...makeError("Class static block", 4, 3),
                column: 11,
                endColumn: 39
            }]
        },
        {
            code: "class C { static { a || b || c; } static { d || e || f || g; } }",
            options: [3],
            parserOptions: { ecmaVersion: 2022 },
            errors: [{
                ...makeError("Class static block", 4, 3),
                column: 35,
                endColumn: 63
            }]
        },
        {
            code: "class C { static { a || b || c || d; } static { e || f || g || h; } }",
            options: [3],
            parserOptions: { ecmaVersion: 2022 },
            errors: [
                {
                    ...makeError("Class static block", 4, 3),
                    column: 11,
                    endColumn: 39
                },
                {
                    ...makeError("Class static block", 4, 3),
                    column: 40,
                    endColumn: 68
                }
            ]
        },

        // object property options
        { code: "function a(x) {}", options: [{ max: 0 }], errors: [makeError("Function 'a'", 1, 0)] }
    ]
});
