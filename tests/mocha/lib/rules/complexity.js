/**
 * @fileoverview Tests for complexity rule.
 * @author Patrick Brosset
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslintTester = require("../../../../lib/tests/eslintTester");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------


eslintTester.add("complexity", {
    valid: [
        { topic: "function a(x) {}", args: [1,1] },
        { topic: "function a(x) {if (true) {return x;}}", args: [1,2] },
        { topic: "function a(x) {if (true) {return x;} else {return x+1;}}", args: [1,2] },
        { topic: "function a(x) {if (true) {return x;} else if (false) {return x+1;} else {return 4;}}", args: [1,3] },
        { topic: "function a(x) {for(var i = 0; i < 5; i ++) {x ++;} return x;}", args: [1,2] },
        { topic: "function a(obj) {for(var i in obj) {obj[i] = 3;}}", args: [1,2] },
        { topic: "function a(x) {for(var i = 0; i < 5; i ++) {if(i % 2 === 0) {x ++;}} return x;}", args: [1,3] },
        { topic: "function a(obj) {if(obj){ for(var x in obj) {try {x.getThis();} catch (e) {x.getThat();}}} else {return false;}}", args: [1,4] },
        { topic: "function a(x) {try {x.getThis();} catch (e) {x.getThat();}}", args: [1,2] },
        { topic: "function a(x) {return x === 4 ? 3 : 5;}", args: [1,2] },
        { topic: "function a(x) {return x === 4 ? 3 : (x === 3 ? 2 : 1);}", args: [1,3] },
        { topic: "function a(x) {return x || 4;}", args: [1,2] },
        { topic: "function a(x) {x && 4;}", args: [1,1] },
        { topic: "function a(x) {switch(x){case 1: 1; break; case 2: 2; break; default: 3;}}", args: [1,3] },
        { topic: "function a(x) {switch(x){case 1: 1; break; case 2: 2; break; default: if(x == 'foo') {5;};}}", args: [1,4] },
        { topic: "function a(x) {while(true) {'foo';}}", args: [1,2] },
        { topic: "function a(x) {do {'foo';} while (true)}", args: [1,2] },
        { topic: "if (foo) { bar(); }", args: [1,3] }

    ],
    invalid: [
        { topic: "function a(x) {}", args: [1,0], errors: [{}] },
        { topic: "function a(x) {if (true) {return x;}}", args: [1,1], errors: [{}] },
        { topic: "function a(x) {if (true) {return x;} else {return x+1;}}", args: [1,1], errors: [{}] },
        { topic: "function a(x) {if (true) {return x;} else if (false) {return x+1;} else {return 4;}}", args: [1,2], errors: [{}] },
        { topic: "function a(x) {for(var i = 0; i < 5; i ++) {x ++;} return x;}", args: [1,1], errors: [{}] },
        { topic: "function a(obj) {for(var i in obj) {obj[i] = 3;}}", args: [1,1], errors: [{}] },
        { topic: "function a(x) {for(var i = 0; i < 5; i ++) {if(i % 2 === 0) {x ++;}} return x;}", args: [1,2], errors: [{}] },
        { topic: "function a(obj) {if(obj){ for(var x in obj) {try {x.getThis();} catch (e) {x.getThat();}}} else {return false;}}", args: [1,3], errors: [{}] },
        { topic: "function a(x) {try {x.getThis();} catch (e) {x.getThat();}}", args: [1,1], errors: [{}] },
        { topic: "function a(x) {return x === 4 ? 3 : 5;}", args: [1,1], errors: [{}] },
        { topic: "function a(x) {return x === 4 ? 3 : (x === 3 ? 2 : 1);}", args: [1,2], errors: [{}] },
        { topic: "function a(x) {return x || 4;}", args: [1,1], errors: [{}] },
        { topic: "function a(x) {x && 4;}", args: [1,0], errors: [{}]},
        { topic: "function a(x) {switch(x){case 1: 1; break; case 2: 2; break; default: 3;}}", args: [1,2], errors: [{}] },
        { topic: "function a(x) {switch(x){case 1: 1; break; case 2: 2; break; default: if(x == 'foo') {5;};}}", args: [1,3], errors: [{}] },
        { topic: "function a(x) {while(true) {'foo';}}", args: [1,1], errors: [{}] },
        { topic: "function a(x) {do {'foo';} while (true)}", args: [1,1], errors: [{}] },
        { topic: "function a(x) {(function() {while(true){'foo';}})(); (function() {while(true){'bar';}})();}", args: [1,1], errors: [{}, {}] },
        { topic: "function a(x) {(function() {while(true){'foo';}})(); (function() {'bar';})();}", args: [1,1], errors: [{}] }
    ]
});
