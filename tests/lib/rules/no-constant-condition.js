/**
 * @fileoverview Tests for no-constant-condition rule.
 * @author Christian Schulz <http://rndm.de>
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-constant-condition"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-constant-condition", rule, {
    valid: [
        "if(a);",
        "if(a == 0);",
        "if(a = f());",
        "if(1, a);",
        "if ('every' in []);",
        "while(~!a);",
        "while(a = b);",
        "for(;x < 10;);",
        "for(;;);",
        "do{ }while(x)",
        "q > 0 ? 1 : 2;",
        "while(x += 3) {}",

        // #5228, typeof conditions
        "if(typeof x === 'undefined'){}",
        "if(a === 'str' && typeof b){}",
        "typeof a == typeof b",
        "typeof 'a' === 'string'|| typeof b === 'string'",

        // #5726, void conditions
        "if (void a || a);",
        "if (a || void a);",

        // #5693
        "if(xyz === 'str1' && abc==='str2'){}",
        "if(xyz === 'str1' || abc==='str2'){}",
        "if(xyz === 'str1' || abc==='str2' && pqr === 5){}",
        "if(typeof abc === 'string' && abc==='str2'){}",
        "if(false || abc==='str'){}",
        "if(true && abc==='str'){}",
        "if(typeof 'str' && abc==='str'){}",
        "if(abc==='str' || false || def ==='str'){}",
        "if(true && abc==='str' || def ==='str'){}",
        "if(true && typeof abc==='string'){}",

        // { checkLoops: false }
        { code: "while(true);", options: [{ checkLoops: false }] },
        { code: "for(;true;);", options: [{ checkLoops: false }] },
        { code: "do{}while(true)", options: [{ checkLoops: false }] }
    ],
    invalid: [
        { code: "for(;true;);", errors: [{ message: "Unexpected constant condition.", type: "ForStatement" }] },
        { code: "do{}while(true)", errors: [{ message: "Unexpected constant condition.", type: "DoWhileStatement" }] },
        { code: "do{}while(t = -2)", errors: [{ message: "Unexpected constant condition.", type: "DoWhileStatement" }] },
        { code: "true ? 1 : 2;", errors: [{ message: "Unexpected constant condition.", type: "ConditionalExpression" }] },
        { code: "q = 0 ? 1 : 2;", errors: [{ message: "Unexpected constant condition.", type: "ConditionalExpression" }] },
        { code: "(q = 0) ? 1 : 2;", errors: [{ message: "Unexpected constant condition.", type: "ConditionalExpression" }] },
        { code: "if(-2);", errors: [{ message: "Unexpected constant condition.", type: "IfStatement" }] },
        { code: "if(true);", errors: [{ message: "Unexpected constant condition.", type: "IfStatement" }] },
        { code: "if({});", errors: [{ message: "Unexpected constant condition.", type: "IfStatement" }] },
        { code: "if(0 < 1);", errors: [{ message: "Unexpected constant condition.", type: "IfStatement" }] },
        { code: "if(0 || 1);", errors: [{ message: "Unexpected constant condition.", type: "IfStatement" }] },
        { code: "if(a, 1);", errors: [{ message: "Unexpected constant condition.", type: "IfStatement" }] },

        { code: "while([]);", errors: [{ message: "Unexpected constant condition.", type: "WhileStatement" }] },
        { code: "while(~!0);", errors: [{ message: "Unexpected constant condition.", type: "WhileStatement" }] },
        { code: "while(x = 1);", errors: [{ message: "Unexpected constant condition.", type: "WhileStatement" }] },
        { code: "while(function(){});", errors: [{ message: "Unexpected constant condition.", type: "WhileStatement" }] },
        { code: "while(() => {});", parserOptions: { ecmaVersion: 6 }, errors: [{ message: "Unexpected constant condition.", type: "WhileStatement" }] },

        // #5228 , typeof conditions
        { code: "if(typeof x){}", errors: [{ message: "Unexpected constant condition.", type: "IfStatement" }] },
        { code: "if(typeof 'abc' === 'string'){}", errors: [{ message: "Unexpected constant condition.", type: "IfStatement" }] },
        { code: "if(a = typeof b){}", errors: [{ message: "Unexpected constant condition.", type: "IfStatement" }] },
        { code: "if(a, typeof b){}", errors: [{ message: "Unexpected constant condition.", type: "IfStatement" }] },
        { code: "if(typeof 'a' == 'string' || typeof 'b' == 'string'){}", errors: [{ message: "Unexpected constant condition.", type: "IfStatement" }] },
        { code: "while(typeof x){}", errors: [{ message: "Unexpected constant condition.", type: "WhileStatement" }] },

        // #5726, void conditions
        { code: "if(1 || void x);", errors: [{ message: "Unexpected constant condition.", type: "IfStatement" }] },
        { code: "if(void x);", errors: [{ message: "Unexpected constant condition.", type: "IfStatement" }] },
        { code: "if(y = void x);", errors: [{ message: "Unexpected constant condition.", type: "IfStatement" }] },
        { code: "if(x, void x);", errors: [{ message: "Unexpected constant condition.", type: "IfStatement" }] },
        { code: "if(void x === void y);", errors: [{ message: "Unexpected constant condition.", type: "IfStatement" }] },
        { code: "if(void x && a);", errors: [{ message: "Unexpected constant condition.", type: "IfStatement" }] },
        { code: "if(a && void x);", errors: [{ message: "Unexpected constant condition.", type: "IfStatement" }] },

        // #5693
        { code: "if(false && abc==='str'){}", errors: [{ message: "Unexpected constant condition.", type: "IfStatement" }] },
        { code: "if(true || abc==='str'){}", errors: [{ message: "Unexpected constant condition.", type: "IfStatement" }] },
        { code: "if(abc==='str' || true){}", errors: [{ message: "Unexpected constant condition.", type: "IfStatement" }] },
        { code: "if(abc==='str' || true || def ==='str'){}", errors: [{ message: "Unexpected constant condition.", type: "IfStatement" }] },
        { code: "if(false || true){}", errors: [{ message: "Unexpected constant condition.", type: "IfStatement" }] },
        { code: "if(typeof abc==='str' || true){}", errors: [{ message: "Unexpected constant condition.", type: "IfStatement" }] }
    ]
});
