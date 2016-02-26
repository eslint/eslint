/**
 * @fileoverview Tests for complexity rule.
 * @author Patrick Brosset
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/complexity"),
    RuleTester = require("../../../lib/testers/rule-tester");

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
    var funcString = "function test (a) { if (a === 1) {";

    for (var i = 2; i < complexity; i++) {
        funcString += "} else if (a === " + i + ") {";
    }

    funcString += "} };";

    return funcString;
}

var ruleTester = new RuleTester();
ruleTester.run("complexity", rule, {
    valid: [
        { code: "function a(x) {}" },
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
        { code: "function a(x) {x && 4;}", options: [1] },
        { code: "function a(x) {switch(x){case 1: 1; break; case 2: 2; break; default: 3;}}", options: [3] },
        { code: "function a(x) {switch(x){case 1: 1; break; case 2: 2; break; default: if(x == 'foo') {5;};}}", options: [4] },
        { code: "function a(x) {while(true) {'foo';}}", options: [2] },
        { code: "function a(x) {do {'foo';} while (true)}", options: [2] },
        { code: "if (foo) { bar(); }", options: [3] },
        { code: "var a = (x) => {do {'foo';} while (true)}", options: [2], parserOptions: { ecmaVersion: 6 } },

        // object property options
        { code: "function b(x) {}", options: [{ "maximum": 1 }] }
    ],
    invalid: [
        { code: "function a(x) {}", options: [0], errors: [{ message: "Function 'a' has a complexity of 1."}] },
        { code: "class Test { a(x){} }", options: [0], parserOptions: { ecmaVersion: 6 }, errors: [{ message: "Function 'a' has a complexity of 1."}] },
        { code: "var a = (x) => {if (true) {return x;}}", options: [1], settings: {ecmascript: 6 }, errors: 1 },
        { code: "function a(x) {if (true) {return x;}}", options: [1], errors: 1 },
        { code: "function a(x) {if (true) {return x;} else {return x+1;}}", options: [1], errors: 1 },
        { code: "function a(x) {if (true) {return x;} else if (false) {return x+1;} else {return 4;}}", options: [2], errors: 1 },
        { code: "function a(x) {for(var i = 0; i < 5; i ++) {x ++;} return x;}", options: [1], errors: 1 },
        { code: "function a(obj) {for(var i in obj) {obj[i] = 3;}}", options: [1], errors: 1 },
        { code: "function a(obj) {for(var i of obj) {obj[i] = 3;}}", parserOptions: { ecmaVersion: 6 }, options: [1], errors: 1 },
        { code: "function a(x) {for(var i = 0; i < 5; i ++) {if(i % 2 === 0) {x ++;}} return x;}", options: [2], errors: 1 },
        { code: "function a(obj) {if(obj){ for(var x in obj) {try {x.getThis();} catch (e) {x.getThat();}}} else {return false;}}", options: [3], errors: 1 },
        { code: "function a(x) {try {x.getThis();} catch (e) {x.getThat();}}", options: [1], errors: 1 },
        { code: "function a(x) {return x === 4 ? 3 : 5;}", options: [1], errors: 1 },
        { code: "function a(x) {return x === 4 ? 3 : (x === 3 ? 2 : 1);}", options: [2], errors: 1 },
        { code: "function a(x) {return x || 4;}", options: [1], errors: 1 },
        { code: "function a(x) {x && 4;}", options: [0], errors: 1 },
        { code: "function a(x) {switch(x){case 1: 1; break; case 2: 2; break; default: 3;}}", options: [2], errors: 1 },
        { code: "function a(x) {switch(x){case 1: 1; break; case 2: 2; break; default: if(x == 'foo') {5;};}}", options: [3], errors: 1 },
        { code: "function a(x) {while(true) {'foo';}}", options: [1], errors: 1 },
        { code: "function a(x) {do {'foo';} while (true)}", options: [1], errors: 1 },
        { code: "function a(x) {(function() {while(true){'foo';}})(); (function() {while(true){'bar';}})();}", options: [1], errors: 2 },
        { code: "function a(x) {(function() {while(true){'foo';}})(); (function() {'bar';})();}", options: [1], errors: 1 },
        { code: "var obj = { a(x) { return x ? 0 : 1; } };", options: [1], parserOptions: { ecmaVersion: 6 }, errors: [{ message: "Function 'a' has a complexity of 2."}] },
        { code: "var obj = { a: function b(x) { return x ? 0 : 1; } };", options: [1], errors: [{ message: "Function 'b' has a complexity of 2."}] },
        {
            code: createComplexity(21),
            errors: [{ message: "Function 'test' has a complexity of 21." }]
        },

        // object property options
        { code: "function a(x) {}", options: [{ "maximum": 0 }], errors: [{ message: "Function 'a' has a complexity of 1."}] }
    ]
});
