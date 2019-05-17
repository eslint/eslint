/**
 * @fileoverview Tests for callback return rule.
 * @author Jamund Ferguson
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/callback-return"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("callback-return", rule, {
    valid: [

        // callbacks inside of functions should return
        "function a(err) { if (err) return callback (err); }",
        "function a(err) { if (err) return callback (err); callback(); }",
        "function a(err) { if (err) { return callback (err); } callback(); }",
        "function a(err) { if (err) { return /* confusing comment */ callback (err); } callback(); }",
        "function x(err) { if (err) { callback(); return; } }",
        "function x(err) { if (err) { \n log();\n callback(); return; } }",
        "function x(err) { if (err) { callback(); return; } return callback(); }",
        "function x(err) { if (err) { return callback(); } else { return callback(); } }",
        "function x(err) { if (err) { return callback(); } else if (x) { return callback(); } }",
        "function x(err) { if (err) return callback(); else return callback(); }",
        "function x(cb) { cb && cb(); }",
        "function x(next) { typeof next !== 'undefined' && next(); }",
        "function x(next) { if (typeof next === 'function')  { return next() } }",
        "function x() { switch(x) { case 'a': return next(); } }",
        "function x() { for(x = 0; x < 10; x++) { return next(); } }",
        "function x() { while(x) { return next(); } }",
        "function a(err) { if (err) { obj.method (err); } }",

        // callback() all you want outside of a function
        "callback()",
        "callback(); callback();",
        "while(x) { move(); }",
        "for (var i = 0; i < 10; i++) { move(); }",
        "for (var i = 0; i < 10; i++) move();",
        "if (x) callback();",
        "if (x) { callback(); }",

        // arrow functions
        {
            code: "var x = err => { if (err) { callback(); return; } }",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var x = err => callback(err)",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var x = err => { setTimeout( () => { callback(); }); }",
            parserOptions: { ecmaVersion: 6 }
        },

        // classes
        {
            code: "class x { horse() { callback(); } } ",
            parserOptions: { ecmaVersion: 6 }
        }, {
            code: "class x { horse() { if (err) { return callback(); } callback(); } } ",
            parserOptions: { ecmaVersion: 6 }
        },

        // options (only warns with the correct callback name)
        {
            code: "function a(err) { if (err) { callback(err) } }",
            options: [["cb"]]
        },
        {
            code: "function a(err) { if (err) { callback(err) } next(); }",
            options: [["cb", "next"]]
        },
        {
            code: "function a(err) { if (err) { return next(err) } else { callback(); } }",
            options: [["cb", "next"]]
        },

        // allow object methods (https://github.com/eslint/eslint/issues/4711)
        {
            code: "function a(err) { if (err) { return obj.method(err); } }",
            options: [["obj.method"]]
        },
        {
            code: "function a(err) { if (err) { return obj.prop.method(err); } }",
            options: [["obj.prop.method"]]
        },
        {
            code: "function a(err) { if (err) { return obj.prop.method(err); } otherObj.prop.method() }",
            options: [["obj.prop.method", "otherObj.prop.method"]]
        },
        {
            code: "function a(err) { if (err) { callback(err); } }",
            options: [["obj.method"]]
        },
        {
            code: "function a(err) { if (err) { otherObj.method(err); } }",
            options: [["obj.method"]]
        },
        {
            code: "function a(err) { if (err) { //comment\nreturn obj.method(err); } }",
            options: [["obj.method"]]
        },
        {
            code: "function a(err) { if (err) { /*comment*/return obj.method(err); } }",
            options: [["obj.method"]]
        },
        {
            code: "function a(err) { if (err) { return obj.method(err); //comment\n } }",
            options: [["obj.method"]]
        },
        {
            code: "function a(err) { if (err) { return obj.method(err); /*comment*/ } }",
            options: [["obj.method"]]
        },

        // only warns if object of MemberExpression is an Identifier
        {
            code: "function a(err) { if (err) { obj().method(err); } }",
            options: [["obj().method"]]
        },
        {
            code: "function a(err) { if (err) { obj.prop().method(err); } }",
            options: [["obj.prop().method"]]
        },
        {
            code: "function a(err) { if (err) { obj().prop.method(err); } }",
            options: [["obj().prop.method"]]
        },

        // does not warn if object of MemberExpression is invoked
        {
            code: "function a(err) { if (err) { obj().method(err); } }",
            options: [["obj.method"]]
        },
        {
            code: "function a(err) { if (err) { obj().method(err); } obj.method(); }",
            options: [["obj.method"]]
        },

        //  known bad examples that we know we are ignoring
        "function x(err) { if (err) { setTimeout(callback, 0); } callback(); }", // callback() called twice
        "function x(err) { if (err) { process.nextTick(function(err) { callback(); }); } callback(); }" // callback() called twice

    ],
    invalid: [
        {
            code: "function a(err) { if (err) { callback (err); } }",
            errors: [{
                messageId: "missingReturn",
                line: 1,
                column: 30,
                nodeType: "CallExpression"
            }]
        },
        {
            code: "function a(callback) { if (typeof callback !== 'undefined') { callback(); } }",
            errors: [{
                messageId: "missingReturn",
                line: 1,
                column: 63,
                nodeType: "CallExpression"
            }]
        },
        {
            code: "function a(callback) { if (typeof callback !== 'undefined') callback();  }",
            errors: [{
                messageId: "missingReturn",
                line: 1,
                column: 61,
                nodeType: "CallExpression"
            }]
        },
        {
            code: "function a(callback) { if (err) { callback(); horse && horse(); } }",
            errors: [{
                messageId: "missingReturn",
                line: 1,
                column: 35,
                nodeType: "CallExpression"
            }]
        },
        {
            code: "var x = (err) => { if (err) { callback (err); } }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "missingReturn",
                line: 1,
                column: 31,
                nodeType: "CallExpression"
            }]
        },
        {
            code: "var x = { x(err) { if (err) { callback (err); } } }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "missingReturn",
                line: 1,
                column: 31,
                nodeType: "CallExpression"
            }]
        },
        {
            code: "function x(err) { if (err) {\n log();\n callback(err); } }",
            errors: [{
                messageId: "missingReturn",
                line: 3,
                column: 2,
                nodeType: "CallExpression"
            }]
        },
        {
            code: "var x = { x(err) { if (err) { callback && callback (err); } } }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "missingReturn",
                line: 1,
                column: 43,
                nodeType: "CallExpression"
            }]
        },
        {
            code: "function a(err) { callback (err); callback(); }",
            errors: [{
                messageId: "missingReturn",
                line: 1,
                column: 19,
                nodeType: "CallExpression"
            }]
        },
        {
            code: "function a(err) { callback (err); horse(); }",
            errors: [{
                messageId: "missingReturn",
                line: 1,
                column: 19,
                nodeType: "CallExpression"
            }]
        },
        {
            code: "function a(err) { if (err) { callback (err); horse(); return; } }",
            errors: [{
                messageId: "missingReturn",
                line: 1,
                column: 30,
                nodeType: "CallExpression"
            }]
        },
        {
            code: "var a = (err) => { callback (err); callback(); }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "missingReturn",
                line: 1,
                column: 20,
                nodeType: "CallExpression"
            }]
        },
        {
            code: "function a(err) { if (err) { callback (err); } else if (x) { callback(err); return; } }",
            errors: [{
                messageId: "missingReturn",
                line: 1,
                column: 30,
                nodeType: "CallExpression"
            }]
        },
        {
            code: "function x(err) { if (err) { return callback(); }\nelse if (abc) {\ncallback(); }\nelse {\nreturn callback(); } }",
            errors: [{
                messageId: "missingReturn",
                line: 3,
                column: 1,
                nodeType: "CallExpression"

            }]
        },
        {
            code: "class x { horse() { if (err) { callback(); } callback(); } } ",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "missingReturn",
                line: 1,
                column: 32,
                nodeType: "CallExpression"
            }]
        },


        // generally good behavior which we must not allow to keep the rule simple
        {
            code: "function x(err) { if (err) { callback() } else { callback() } }",
            errors: [{
                messageId: "missingReturn",
                line: 1,
                column: 30,
                nodeType: "CallExpression"
            }, {
                messageId: "missingReturn",
                line: 1,
                column: 50,
                nodeType: "CallExpression"
            }]
        },
        {
            code: "function x(err) { if (err) return callback(); else callback(); }",
            errors: [
                {
                    messageId: "missingReturn",
                    line: 1,
                    column: 52,
                    nodeType: "CallExpression"
                }
            ]
        },
        {
            code: "() => { if (x) { callback(); } }",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "missingReturn",
                    line: 1,
                    column: 18,
                    nodeType: "CallExpression"
                }
            ]
        },
        {
            code: "function b() { switch(x) { case 'horse': callback(); } }",
            errors: [
                {
                    messageId: "missingReturn",
                    line: 1,
                    column: 42,
                    nodeType: "CallExpression"
                }
            ]
        },
        {
            code: "function a() { switch(x) { case 'horse': move(); } }",
            options: [["move"]],
            errors: [
                {
                    messageId: "missingReturn",
                    line: 1,
                    column: 42,
                    nodeType: "CallExpression"
                }
            ]
        },

        // loops
        {
            code: "var x = function() { while(x) { move(); } }",
            options: [["move"]],
            errors: [
                {
                    messageId: "missingReturn",
                    line: 1,
                    column: 33,
                    nodeType: "CallExpression"
                }
            ]
        },
        {
            code: "function x() { for (var i = 0; i < 10; i++) { move(); } }",
            options: [["move"]],
            errors: [
                {
                    messageId: "missingReturn",
                    line: 1,
                    column: 47,
                    nodeType: "CallExpression"
                }
            ]
        },
        {
            code: "var x = function() { for (var i = 0; i < 10; i++) move(); }",
            options: [["move"]],
            errors: [
                {
                    messageId: "missingReturn",
                    line: 1,
                    column: 51,
                    nodeType: "CallExpression"
                }
            ]
        },
        {
            code: "function a(err) { if (err) { obj.method(err); } }",
            options: [["obj.method"]],
            errors: [
                {
                    messageId: "missingReturn",
                    line: 1,
                    column: 30,
                    nodeType: "CallExpression"
                }
            ]
        },
        {
            code: "function a(err) { if (err) { obj.prop.method(err); } }",
            options: [["obj.prop.method"]],
            errors: [
                {
                    messageId: "missingReturn",
                    line: 1,
                    column: 30,
                    nodeType: "CallExpression"
                }
            ]
        },
        {
            code: "function a(err) { if (err) { obj.prop.method(err); } otherObj.prop.method() }",
            options: [["obj.prop.method", "otherObj.prop.method"]],
            errors: [
                {
                    messageId: "missingReturn",
                    line: 1,
                    column: 30,
                    nodeType: "CallExpression"
                }
            ]
        },
        {
            code: "function a(err) { if (err) { /*comment*/obj.method(err); } }",
            options: [["obj.method"]],
            errors: [
                {
                    messageId: "missingReturn",
                    line: 1,
                    column: 41,
                    nodeType: "CallExpression"
                }
            ]
        },
        {
            code: "function a(err) { if (err) { //comment\nobj.method(err); } }",
            options: [["obj.method"]],
            errors: [
                {
                    messageId: "missingReturn",
                    line: 2,
                    column: 1,
                    nodeType: "CallExpression"
                }
            ]
        },
        {
            code: "function a(err) { if (err) { obj.method(err); /*comment*/ } }",
            options: [["obj.method"]],
            errors: [
                {
                    messageId: "missingReturn",
                    line: 1,
                    column: 30,
                    nodeType: "CallExpression"
                }
            ]
        },
        {
            code: "function a(err) { if (err) { obj.method(err); //comment\n } }",
            options: [["obj.method"]],
            errors: [
                {
                    messageId: "missingReturn",
                    line: 1,
                    column: 30,
                    nodeType: "CallExpression"
                }
            ]
        }
    ]
});
