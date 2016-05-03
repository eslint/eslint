/**
 * @fileoverview Tests for concise-object rule
 * @author Jamund Ferguson <http://www.jamund.com>
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/object-shorthand"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();

ruleTester.run("object-shorthand", rule, {
    valid: [
        { code: "var x = {y() {}}", parserOptions: { ecmaVersion: 6 } },
        { code: "var x = {y}", parserOptions: { ecmaVersion: 6 } },
        { code: "var x = {a: b}", parserOptions: { ecmaVersion: 6 } },
        { code: "var x = {a: 'a'}", parserOptions: { ecmaVersion: 6 } },
        { code: "var x = {'a': 'a'}", parserOptions: { ecmaVersion: 6 } },
        { code: "var x = {'a': b}", parserOptions: { ecmaVersion: 6 } },
        { code: "var x = {y(x) {}}", parserOptions: { ecmaVersion: 6 } },
        { code: "var {x,y,z} = x", parserOptions: { ecmaVersion: 6 } },
        { code: "var {x: {y}} = z", parserOptions: { ecmaVersion: 6 } },
        { code: "var x = {*x() {}}", parserOptions: { ecmaVersion: 6 } },
        { code: "var x = {x: y}", parserOptions: { ecmaVersion: 6 } },
        { code: "var x = {x: y, y: z}", parserOptions: { ecmaVersion: 6 }},
        { code: "var x = {x: y, y: z, z: 'z'}", parserOptions: { ecmaVersion: 6 }},
        { code: "var x = {x() {}, y: z, l(){}}", parserOptions: { ecmaVersion: 6 }},
        { code: "var x = {x: y, y: z, a: b}", parserOptions: { ecmaVersion: 6 }},
        { code: "var x = {x: y, y: z, 'a': b}", parserOptions: { ecmaVersion: 6 }},
        { code: "var x = {x: y, y() {}, z: a}", parserOptions: { ecmaVersion: 6 }},
        { code: "var x = {[y]: y}", parserOptions: { ecmaVersion: 6 }},
        { code: "doSomething({x: y})", parserOptions: { ecmaVersion: 6 }},
        { code: "doSomething({'x': y})", parserOptions: { ecmaVersion: 6 }},
        { code: "doSomething({x: 'x'})", parserOptions: { ecmaVersion: 6 }},
        { code: "doSomething({'x': 'x'})", parserOptions: { ecmaVersion: 6 }},
        { code: "doSomething({y() {}})", parserOptions: { ecmaVersion: 6 }},
        { code: "doSomething({x: y, y() {}})", parserOptions: { ecmaVersion: 6 }},
        { code: "doSomething({y() {}, z: a})", parserOptions: { ecmaVersion: 6 }},
        { code: "!{ a: function a(){} };", parserOptions: { ecmaVersion: 6 } },

        // arrows functions are still alright
        { code: "var x = {y: (x)=>x}", parserOptions: { ecmaVersion: 6 } },
        { code: "doSomething({y: (x)=>x})", parserOptions: { ecmaVersion: 6 } },
        { code: "var x = {y: (x)=>x, y: a}", parserOptions: { ecmaVersion: 6 } },
        { code: "doSomething({x, y: (x)=>x})", parserOptions: { ecmaVersion: 6 } },

        // getters and setters are ok
        { code: "var x = {get y() {}}", parserOptions: { ecmaVersion: 6 } },
        { code: "var x = {set y(z) {}}", parserOptions: { ecmaVersion: 6 } },
        { code: "var x = {get y() {}, set y(z) {}}", parserOptions: { ecmaVersion: 6 } },
        { code: "doSomething({get y() {}})", parserOptions: { ecmaVersion: 6 } },
        { code: "doSomething({set y(z) {}})", parserOptions: { ecmaVersion: 6 } },
        { code: "doSomething({get y() {}, set y(z) {}})", parserOptions: { ecmaVersion: 6 } },

        // object literal computed properties
        { code: "var x = {[y]: y}", parserOptions: { ecmaVersion: 6 }, options: ["properties"] },
        { code: "var x = {['y']: 'y'}", parserOptions: { ecmaVersion: 6 }, options: ["properties"] },
        { code: "var x = {['y']: y}", parserOptions: { ecmaVersion: 6 }, options: ["properties"] },

        // object literal computed methods
        { code: "var x = {[y]() {}}", parserOptions: { ecmaVersion: 6 }, options: ["methods"] },
        { code: "var x = {[y]: function x() {}}", parserOptions: { ecmaVersion: 6 }, options: ["methods"] },
        { code: "var x = {[y]: y}", parserOptions: { ecmaVersion: 6 }, options: ["methods"] },

        // options
        { code: "var x = {y() {}}", parserOptions: { ecmaVersion: 6 }, options: ["methods"] },
        { code: "var x = {x, y() {}, a:b}", parserOptions: { ecmaVersion: 6 }, options: ["methods"] },
        { code: "var x = {y}", parserOptions: { ecmaVersion: 6 }, options: ["properties"] },
        { code: "var x = {y: {b}}", parserOptions: { ecmaVersion: 6 }, options: ["properties"] },
        { code: "var x = {a: n, c: d, f: g}", parserOptions: { ecmaVersion: 6 }, options: ["never"] },
        { code: "var x = {a: function(){}, b: {c: d}}", parserOptions: { ecmaVersion: 6 }, options: ["never"] },

        // ignoreConstructors
        { code: "var x = {ConstructorFunction: function(){}, a: b}", parserOptions: { ecmaVersion: 6 }, options: ["always", { ignoreConstructors: true }] },
        { code: "var x = {notConstructorFunction(){}, b: c}", parserOptions: { ecmaVersion: 6 }, options: ["always", { ignoreConstructors: true }] },
        { code: "var x = {ConstructorFunction: function(){}, a: b}", parserOptions: { ecmaVersion: 6 }, options: ["methods", { ignoreConstructors: true }] },
        { code: "var x = {notConstructorFunction(){}, b: c}", parserOptions: { ecmaVersion: 6 }, options: ["methods", { ignoreConstructors: true }] },
        { code: "var x = {ConstructorFunction: function(){}, a: b}", parserOptions: { ecmaVersion: 6 }, options: ["never"] },
        { code: "var x = {notConstructorFunction: function(){}, b: c}", parserOptions: { ecmaVersion: 6 }, options: ["never"] },

        // ignore object shorthand
        { code: "let {a, b} = o;", parserOptions: { ecmaVersion: 6 }, options: ["never"] }
    ],
    invalid: [
        { code: "var x = {x: x}", parserOptions: { ecmaVersion: 6 }, errors: [{ message: "Expected property shorthand.", type: "Property" }] },
        { code: "var x = {'x': x}", parserOptions: { ecmaVersion: 6 }, errors: [{ message: "Expected property shorthand.", type: "Property" }] },
        { code: "var x = {y: y, x: x}", parserOptions: { ecmaVersion: 6 }, errors: [{ message: "Expected property shorthand.", type: "Property" }, { message: "Expected property shorthand.", type: "Property" }] },
        { code: "var x = {y: z, x: x, a: b}", parserOptions: { ecmaVersion: 6 }, errors: [{ message: "Expected property shorthand.", type: "Property" }] },
        { code: "var x = {y: function() {}}", parserOptions: { ecmaVersion: 6 }, errors: [{ message: "Expected method shorthand.", type: "Property" }] },
        { code: "var x = {y: function*() {}}", parserOptions: { ecmaVersion: 6 }, errors: [{ message: "Expected method shorthand.", type: "Property" }] },
        { code: "var x = {x: y, y: z, a: a}", parserOptions: { ecmaVersion: 6 }, errors: [{ message: "Expected property shorthand.", type: "Property" }] },
        { code: "var x = {ConstructorFunction: function(){}, a: b}", parserOptions: { ecmaVersion: 6 }, errors: [{ message: "Expected method shorthand.", type: "Property" }] },
        { code: "var x = {x: y, y: z, a: function(){}, b() {}}", parserOptions: { ecmaVersion: 6 }, errors: [{ message: "Expected method shorthand.", type: "Property" }] },
        { code: "var x = {x: x, y: function() {}}", parserOptions: { ecmaVersion: 6 }, errors: [{ message: "Expected property shorthand.", type: "Property" }, { message: "Expected method shorthand.", type: "Property" }]},
        { code: "doSomething({x: x})", parserOptions: { ecmaVersion: 6 }, errors: [{ message: "Expected property shorthand.", type: "Property" }] },
        { code: "doSomething({'x': x})", parserOptions: { ecmaVersion: 6 }, errors: [{ message: "Expected property shorthand.", type: "Property" }] },
        { code: "doSomething({a: 'a', 'x': x})", parserOptions: { ecmaVersion: 6 }, errors: [{ message: "Expected property shorthand.", type: "Property" }] },
        { code: "doSomething({y: function() {}})", parserOptions: { ecmaVersion: 6 }, errors: [{ message: "Expected method shorthand.", type: "Property" }] },
        { code: "doSomething({[y]: function() {}})", parserOptions: { ecmaVersion: 6 }, errors: [{ message: "Expected method shorthand.", type: "Property" }] },
        { code: "doSomething({['y']: function() {}})", parserOptions: { ecmaVersion: 6 }, errors: [{ message: "Expected method shorthand.", type: "Property" }] },

        // options
        { code: "var x = {y: function() {}}", parserOptions: { ecmaVersion: 6 }, errors: [{ message: "Expected method shorthand.", type: "Property" }], options: ["methods"] },
        { code: "var x = {x, y() {}, z: function() {}}", parserOptions: { ecmaVersion: 6 }, errors: [{ message: "Expected method shorthand.", type: "Property" }], options: ["methods"] },
        { code: "var x = {ConstructorFunction: function(){}, a: b}", parserOptions: { ecmaVersion: 6 }, errors: [{ message: "Expected method shorthand.", type: "Property" }], options: ["methods"] },
        { code: "var x = {[y]: function() {}}", parserOptions: { ecmaVersion: 6 }, errors: [{ message: "Expected method shorthand.", type: "Property" }], options: ["methods"] },
        { code: "var x = {x: x}", parserOptions: { ecmaVersion: 6 }, errors: [{ message: "Expected property shorthand.", type: "Property" }], options: ["properties"] },
        { code: "var x = {a, b, c(){}, x: x}", parserOptions: { ecmaVersion: 6 }, errors: [{ message: "Expected property shorthand.", type: "Property" }], options: ["properties"] },
        { code: "var x = {y() {}}", parserOptions: { ecmaVersion: 6 }, errors: [{ message: "Expected longform method syntax.", type: "Property" }], options: ["never"] },
        { code: "var x = {*y() {}}", parserOptions: { ecmaVersion: 6 }, errors: [{ message: "Expected longform method syntax.", type: "Property" }], options: ["never"] },
        { code: "var x = {y}", parserOptions: { ecmaVersion: 6 }, errors: [{ message: "Expected longform property syntax.", type: "Property" }], options: ["never"]},
        { code: "var x = {y, a: b, *x(){}}", parserOptions: { ecmaVersion: 6 }, errors: [{ message: "Expected longform property syntax.", type: "Property" }, { message: "Expected longform method syntax.", type: "Property" }], options: ["never"]},
        { code: "var x = {y: {x}}", parserOptions: { ecmaVersion: 6 }, errors: [{ message: "Expected longform property syntax.", type: "Property" }], options: ["never"]},
        { code: "var x = {ConstructorFunction(){}, a: b}", parserOptions: { ecmaVersion: 6 }, errors: [{ message: "Expected longform method syntax.", type: "Property" }], options: ["never"] },
        { code: "var x = {notConstructorFunction(){}, b: c}", parserOptions: { ecmaVersion: 6 }, errors: [{ message: "Expected longform method syntax.", type: "Property" }], options: ["never"] }
    ]
});
