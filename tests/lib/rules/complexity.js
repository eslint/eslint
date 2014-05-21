/**
 * @fileoverview Tests for complexity rule.
 * @author Patrick Brosset
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslint = require("../../../lib/eslint"),
    ESLintTester = require("eslint-tester");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------


var eslintTester = new ESLintTester(eslint);
eslintTester.addRuleTest("lib/rules/complexity", {
    valid: [
        { code: "function a(x) {}", args: [1,1] },
        { code: "function a(x) {if (true) {return x;}}", args: [1,2] },
        { code: "function a(x) {if (true) {return x;} else {return x+1;}}", args: [1,2] },
        { code: "function a(x) {if (true) {return x;} else if (false) {return x+1;} else {return 4;}}", args: [1,3] },
        { code: "function a(x) {for(var i = 0; i < 5; i ++) {x ++;} return x;}", args: [1,2] },
        { code: "function a(obj) {for(var i in obj) {obj[i] = 3;}}", args: [1,2] },
        { code: "function a(x) {for(var i = 0; i < 5; i ++) {if(i % 2 === 0) {x ++;}} return x;}", args: [1,3] },
        { code: "function a(obj) {if(obj){ for(var x in obj) {try {x.getThis();} catch (e) {x.getThat();}}} else {return false;}}", args: [1,4] },
        { code: "function a(x) {try {x.getThis();} catch (e) {x.getThat();}}", args: [1,2] },
        { code: "function a(x) {return x === 4 ? 3 : 5;}", args: [1,2] },
        { code: "function a(x) {return x === 4 ? 3 : (x === 3 ? 2 : 1);}", args: [1,3] },
        { code: "function a(x) {return x || 4;}", args: [1,2] },
        { code: "function a(x) {x && 4;}", args: [1,1] },
        { code: "function a(x) {switch(x){case 1: 1; break; case 2: 2; break; default: 3;}}", args: [1,3] },
        { code: "function a(x) {switch(x){case 1: 1; break; case 2: 2; break; default: if(x == 'foo') {5;};}}", args: [1,4] },
        { code: "function a(x) {while(true) {'foo';}}", args: [1,2] },
        { code: "function a(x) {do {'foo';} while (true)}", args: [1,2] },
        { code: "if (foo) { bar(); }", args: [1,3] }

    ],
    invalid: [
        { code: "function a(x) {}", args: [1,0], errors: 1 },
        { code: "function a(x) {if (true) {return x;}}", args: [1,1], errors: 1 },
        { code: "function a(x) {if (true) {return x;} else {return x+1;}}", args: [1,1], errors: 1 },
        { code: "function a(x) {if (true) {return x;} else if (false) {return x+1;} else {return 4;}}", args: [1,2], errors: 1 },
        { code: "function a(x) {for(var i = 0; i < 5; i ++) {x ++;} return x;}", args: [1,1], errors: 1 },
        { code: "function a(obj) {for(var i in obj) {obj[i] = 3;}}", args: [1,1], errors: 1 },
        { code: "function a(x) {for(var i = 0; i < 5; i ++) {if(i % 2 === 0) {x ++;}} return x;}", args: [1,2], errors: 1 },
        { code: "function a(obj) {if(obj){ for(var x in obj) {try {x.getThis();} catch (e) {x.getThat();}}} else {return false;}}", args: [1,3], errors: 1 },
        { code: "function a(x) {try {x.getThis();} catch (e) {x.getThat();}}", args: [1,1], errors: 1 },
        { code: "function a(x) {return x === 4 ? 3 : 5;}", args: [1,1], errors: 1 },
        { code: "function a(x) {return x === 4 ? 3 : (x === 3 ? 2 : 1);}", args: [1,2], errors: 1 },
        { code: "function a(x) {return x || 4;}", args: [1,1], errors: 1 },
        { code: "function a(x) {x && 4;}", args: [1,0], errors: 1 },
        { code: "function a(x) {switch(x){case 1: 1; break; case 2: 2; break; default: 3;}}", args: [1,2], errors: 1 },
        { code: "function a(x) {switch(x){case 1: 1; break; case 2: 2; break; default: if(x == 'foo') {5;};}}", args: [1,3], errors: 1 },
        { code: "function a(x) {while(true) {'foo';}}", args: [1,1], errors: 1 },
        { code: "function a(x) {do {'foo';} while (true)}", args: [1,1], errors: 1 },
        { code: "function a(x) {(function() {while(true){'foo';}})(); (function() {while(true){'bar';}})();}", args: [1,1], errors: 2 },
        { code: "function a(x) {(function() {while(true){'foo';}})(); (function() {'bar';})();}", args: [1,1], errors: 1 }
    ]
});
