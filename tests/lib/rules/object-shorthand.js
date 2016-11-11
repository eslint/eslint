/**
 * @fileoverview Tests for concise-object rule
 * @author Jamund Ferguson <http://www.jamund.com>
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/object-shorthand"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

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

        // avoidQuotes
        { code: "var x = {'a': function(){}}", parserOptions: { ecmaVersion: 6 }, options: ["always", {avoidQuotes: true}] },
        { code: "var x = {['a']: function(){}}", parserOptions: { ecmaVersion: 6 }, options: ["methods", {avoidQuotes: true}] },
        { code: "var x = {'y': y}", parserOptions: { ecmaVersion: 6 }, options: ["properties", {avoidQuotes: true}] },

        // ignore object shorthand
        { code: "let {a, b} = o;", parserOptions: { ecmaVersion: 6 }, options: ["never"] },
        { code: "var x = {foo: foo, bar: bar, ...baz}", parserOptions: { ecmaVersion: 6, ecmaFeatures: { experimentalObjectRestSpread: true } }, options: ["never"] },

        // consistent
        { code: "var x = {a: a, b: b}", parserOptions: { ecmaVersion: 6}, options: ["consistent"] },
        { code: "var x = {a: b, c: d, f: g}", parserOptions: { ecmaVersion: 6}, options: ["consistent"] },
        { code: "var x = {a, b}", parserOptions: { ecmaVersion: 6}, options: ["consistent"] },
        { code: "var x = {a, b, get test() { return 1; }}", parserOptions: { ecmaVersion: 6}, options: ["consistent"] },
        { code: "var x = {...bar}", parserOptions: { ecmaVersion: 6, ecmaFeatures: { experimentalObjectRestSpread: true } }, options: ["consistent-as-needed"] },
        { code: "var x = {foo, bar, ...baz}", parserOptions: { ecmaVersion: 6, ecmaFeatures: { experimentalObjectRestSpread: true } }, options: ["consistent"] },
        { code: "var x = {bar: baz, ...qux}", parserOptions: { ecmaVersion: 6, ecmaFeatures: { experimentalObjectRestSpread: true } }, options: ["consistent"] },
        { code: "var x = {...foo, bar: bar, baz: baz}", parserOptions: { ecmaVersion: 6, ecmaFeatures: { experimentalObjectRestSpread: true } }, options: ["consistent"] },

        // consistent-as-needed
        { code: "var x = {a, b}", parserOptions: { ecmaVersion: 6}, options: ["consistent-as-needed"] },
        { code: "var x = {a, b, get test(){return 1;}}", parserOptions: { ecmaVersion: 6}, options: ["consistent-as-needed"] },
        { code: "var x = {0: 'foo'}", parserOptions: { ecmaVersion: 6}, options: ["consistent-as-needed"] },
        { code: "var x = {'key': 'baz'}", parserOptions: { ecmaVersion: 6}, options: ["consistent-as-needed"] },
        { code: "var x = {foo: 'foo'}", parserOptions: { ecmaVersion: 6}, options: ["consistent-as-needed"] },
        { code: "var x = {[foo]: foo}", parserOptions: { ecmaVersion: 6}, options: ["consistent-as-needed"] },
        { code: "var x = {foo: function foo() {}}", parserOptions: { ecmaVersion: 6}, options: ["consistent-as-needed"] },
        { code: "var x = {[foo]: 'foo'}", parserOptions: { ecmaVersion: 6}, options: ["consistent-as-needed"] },
        { code: "var x = {...bar}", parserOptions: { ecmaVersion: 6, ecmaFeatures: { experimentalObjectRestSpread: true } }, options: ["consistent-as-needed"] },
        { code: "var x = {bar, ...baz}", parserOptions: { ecmaVersion: 6, ecmaFeatures: { experimentalObjectRestSpread: true } }, options: ["consistent-as-needed"] },
        { code: "var x = {bar: baz, ...qux}", parserOptions: { ecmaVersion: 6, ecmaFeatures: { experimentalObjectRestSpread: true } }, options: ["consistent-as-needed"] },
        { code: "var x = {...foo, bar, baz}", parserOptions: { ecmaVersion: 6, ecmaFeatures: { experimentalObjectRestSpread: true } }, options: ["consistent-as-needed"] },
    ],
    invalid: [
        { code: "var x = {x: x}", output: "var x = {x}", parserOptions: { ecmaVersion: 6 }, errors: [{ message: "Expected property shorthand.", type: "Property" }] },
        { code: "var x = {'x': x}", output: "var x = {x}", parserOptions: { ecmaVersion: 6 }, errors: [{ message: "Expected property shorthand.", type: "Property" }] },
        { code: "var x = {y: y, x: x}", output: "var x = {y, x}", parserOptions: { ecmaVersion: 6 }, errors: [{ message: "Expected property shorthand.", type: "Property" }, { message: "Expected property shorthand.", type: "Property" }] },
        { code: "var x = {y: z, x: x, a: b}", output: "var x = {y: z, x, a: b}", parserOptions: { ecmaVersion: 6 }, errors: [{ message: "Expected property shorthand.", type: "Property" }] },
        { code: "var x = {y: z,\n x: x,\n a: b\n // comment \n}", output: "var x = {y: z,\n x,\n a: b\n // comment \n}", parserOptions: { ecmaVersion: 6 }, errors: [{ message: "Expected property shorthand.", type: "Property" }] },
        { code: "var x = {y: z,\n a: b,\n // comment \nf: function() {}}", output: "var x = {y: z,\n a: b,\n // comment \nf() {}}", parserOptions: { ecmaVersion: 6 }, errors: [{ message: "Expected method shorthand.", type: "Property" }] },
        { code: "var x = {a: b,\n/* comment */\ny: y\n }", output: "var x = {a: b,\n/* comment */\ny\n }", parserOptions: { ecmaVersion: 6 }, errors: [{ message: "Expected property shorthand.", type: "Property" }] },
        { code: "var x = {\n  a: b,\n  /* comment */\n  y: y\n}", output: "var x = {\n  a: b,\n  /* comment */\n  y\n}", parserOptions: { ecmaVersion: 6 }, errors: [{ message: "Expected property shorthand.", type: "Property" }] },
        { code: "var x = {\n  f: function() {\n    /* comment */\n    a(b);\n    }\n  }", output: "var x = {\n  f() {\n    /* comment */\n    a(b);\n    }\n  }", parserOptions: { ecmaVersion: 6 }, errors: [{ message: "Expected method shorthand.", type: "Property" }] },
        { code: "var x = {\n  [f]: function() {\n    /* comment */\n    a(b);\n    }\n  }", output: "var x = {\n  [f]() {\n    /* comment */\n    a(b);\n    }\n  }", parserOptions: { ecmaVersion: 6 }, errors: [{ message: "Expected method shorthand.", type: "Property" }] },
        { code: "var x = {\n  f: function*() {\n    /* comment */\n    a(b);\n    }\n  }", output: "var x = {\n  *f() {\n    /* comment */\n    a(b);\n    }\n  }", parserOptions: { ecmaVersion: 6 }, errors: [{ message: "Expected method shorthand.", type: "Property" }] },
        { code: "var x = {y: function() {}}", output: "var x = {y() {}}", parserOptions: { ecmaVersion: 6 }, errors: [{ message: "Expected method shorthand.", type: "Property" }] },
        { code: "var x = {y: function*() {}}", output: "var x = {*y() {}}", parserOptions: { ecmaVersion: 6 }, errors: [{ message: "Expected method shorthand.", type: "Property" }] },
        { code: "var x = {x: y, y: z, a: a}", output: "var x = {x: y, y: z, a}", parserOptions: { ecmaVersion: 6 }, errors: [{ message: "Expected property shorthand.", type: "Property" }] },
        { code: "var x = {ConstructorFunction: function(){}, a: b}", output: "var x = {ConstructorFunction(){}, a: b}", parserOptions: { ecmaVersion: 6 }, errors: [{ message: "Expected method shorthand.", type: "Property" }] },
        { code: "var x = {x: y, y: z, a: function(){}, b() {}}", output: "var x = {x: y, y: z, a(){}, b() {}}", parserOptions: { ecmaVersion: 6 }, errors: [{ message: "Expected method shorthand.", type: "Property" }] },
        { code: "var x = {x: x, y: function() {}}", output: "var x = {x, y() {}}", parserOptions: { ecmaVersion: 6 }, errors: [{ message: "Expected property shorthand.", type: "Property" }, { message: "Expected method shorthand.", type: "Property" }]},
        { code: "doSomething({x: x})", output: "doSomething({x})", parserOptions: { ecmaVersion: 6 }, errors: [{ message: "Expected property shorthand.", type: "Property" }] },
        { code: "doSomething({'x': x})", output: "doSomething({x})", parserOptions: { ecmaVersion: 6 }, errors: [{ message: "Expected property shorthand.", type: "Property" }] },
        { code: "doSomething({a: 'a', 'x': x})", output: "doSomething({a: 'a', x})", parserOptions: { ecmaVersion: 6 }, errors: [{ message: "Expected property shorthand.", type: "Property" }] },
        { code: "doSomething({y: function() {}})", output: "doSomething({y() {}})", parserOptions: { ecmaVersion: 6 }, errors: [{ message: "Expected method shorthand.", type: "Property" }] },
        { code: "doSomething({[y]: function() {}})", output: "doSomething({[y]() {}})", parserOptions: { ecmaVersion: 6 }, errors: [{ message: "Expected method shorthand.", type: "Property" }] },
        { code: "doSomething({['y']: function() {}})", output: "doSomething({['y']() {}})", parserOptions: { ecmaVersion: 6 }, errors: [{ message: "Expected method shorthand.", type: "Property" }] },
        { code: "({ foo: async function () {} })", output: "({ async foo () {} })", parserOptions: { ecmaVersion: 8 }, errors: [{ message: "Expected method shorthand.", type: "Property" }] },
        { code: "({ 'foo': async function() {} })", output: "({ async 'foo'() {} })", parserOptions: { ecmaVersion: 8 }, errors: [{ message: "Expected method shorthand.", type: "Property" }] },
        { code: "({ [foo]: async function() {} })", output: "({ async [foo]() {} })", parserOptions: { ecmaVersion: 8 }, errors: [{ message: "Expected method shorthand.", type: "Property" }] },
        { code: "({ [foo.bar]: function*() {} })", output: "({ *[foo.bar]() {} })", parserOptions: { ecmaVersion: 6 }, errors: [{ message: "Expected method shorthand.", type: "Property" }] },
        { code: "({ [foo   ]: function() {} })", output: "({ [foo   ]() {} })", parserOptions: { ecmaVersion: 6 }, errors: [{ message: "Expected method shorthand.", type: "Property" }] },
        { code: "({ [ foo ]: async function() {} })", output: "({ async [foo]() {} })", parserOptions: { ecmaVersion: 8 }, errors: [{ message: "Expected method shorthand.", type: "Property" }] },
        { code: "({ foo: function *() {} })", output: "({ *foo() {} })", parserOptions: { ecmaVersion: 6 }, errors: [{ message: "Expected method shorthand.", type: "Property" }] },
        { code: "({ [  foo   ]: function() {} })", output: "({ [  foo   ]() {} })", parserOptions: { ecmaVersion: 6 }, errors: [{ message: "Expected method shorthand.", type: "Property" }] },
        { code: "({ [  foo]: function() {} })", output: "({ [  foo]() {} })", parserOptions: { ecmaVersion: 6 }, errors: [{ message: "Expected method shorthand.", type: "Property" }] },

        // options
        { code: "var x = {y: function() {}}", output: "var x = {y() {}}", parserOptions: { ecmaVersion: 6 }, errors: [{ message: "Expected method shorthand.", type: "Property" }], options: ["methods"] },
        { code: "var x = {x, y() {}, z: function() {}}", output: "var x = {x, y() {}, z() {}}", parserOptions: { ecmaVersion: 6 }, errors: [{ message: "Expected method shorthand.", type: "Property" }], options: ["methods"] },
        { code: "var x = {ConstructorFunction: function(){}, a: b}", output: "var x = {ConstructorFunction(){}, a: b}", parserOptions: { ecmaVersion: 6 }, errors: [{ message: "Expected method shorthand.", type: "Property" }], options: ["methods"] },
        { code: "var x = {[y]: function() {}}", output: "var x = {[y]() {}}", parserOptions: { ecmaVersion: 6 }, errors: [{ message: "Expected method shorthand.", type: "Property" }], options: ["methods"] },
        { code: "var x = {x: x}", output: "var x = {x}", parserOptions: { ecmaVersion: 6 }, errors: [{ message: "Expected property shorthand.", type: "Property" }], options: ["properties"] },
        { code: "var x = {a, b, c(){}, x: x}", output: "var x = {a, b, c(){}, x}", parserOptions: { ecmaVersion: 6 }, errors: [{ message: "Expected property shorthand.", type: "Property" }], options: ["properties"] },
        { code: "var x = {y() {}}", output: "var x = {y: function() {}}", parserOptions: { ecmaVersion: 6 }, errors: [{ message: "Expected longform method syntax.", type: "Property" }], options: ["never"] },
        { code: "var x = {*y() {}}", output: "var x = {y: function*() {}}", parserOptions: { ecmaVersion: 6 }, errors: [{ message: "Expected longform method syntax.", type: "Property" }], options: ["never"] },
        { code: "var x = {y}", output: "var x = {y: y}", parserOptions: { ecmaVersion: 6 }, errors: [{ message: "Expected longform property syntax.", type: "Property" }], options: ["never"]},
        { code: "var x = {y, a: b, *x(){}}", output: "var x = {y: y, a: b, x: function*(){}}", parserOptions: { ecmaVersion: 6 }, errors: [{ message: "Expected longform property syntax.", type: "Property" }, { message: "Expected longform method syntax.", type: "Property" }], options: ["never"]},
        { code: "var x = {y: {x}}", output: "var x = {y: {x: x}}", parserOptions: { ecmaVersion: 6 }, errors: [{ message: "Expected longform property syntax.", type: "Property" }], options: ["never"]},
        { code: "var x = {ConstructorFunction(){}, a: b}", output: "var x = {ConstructorFunction: function(){}, a: b}", parserOptions: { ecmaVersion: 6 }, errors: [{ message: "Expected longform method syntax.", type: "Property" }], options: ["never"] },
        { code: "var x = {notConstructorFunction(){}, b: c}", output: "var x = {notConstructorFunction: function(){}, b: c}", parserOptions: { ecmaVersion: 6 }, errors: [{ message: "Expected longform method syntax.", type: "Property" }], options: ["never"] },
        { code: "var x = {foo: foo, bar: baz, ...qux}", output: "var x = {foo, bar: baz, ...qux}", parserOptions: { ecmaVersion: 6, ecmaFeatures: { experimentalObjectRestSpread: true } }, errors: [{ message: "Expected property shorthand.", type: "" }], options: ["always"] },
        { code: "var x = {foo, bar: baz, ...qux}", output: "var x = {foo: foo, bar: baz, ...qux}", parserOptions: { ecmaVersion: 6, ecmaFeatures: { experimentalObjectRestSpread: true } }, errors: [{ message: "Expected longform property syntax.", type: "" }], options: ["never"] },

        // avoidQuotes
        { code: "var x = {a: a}", output: "var x = {a}", parserOptions: { ecmaVersion: 6 }, errors: [{ message: "Expected property shorthand.", type: "Property" }], options: ["always", {avoidQuotes: true}] },
        { code: "var x = {a: function(){}}", output: "var x = {a(){}}", parserOptions: { ecmaVersion: 6 }, errors: [{ message: "Expected method shorthand.", type: "Property" }], options: ["methods", {avoidQuotes: true}] },
        { code: "var x = {[a]: function(){}}", output: "var x = {[a](){}}", parserOptions: { ecmaVersion: 6 }, errors: [{ message: "Expected method shorthand.", type: "Property" }], options: ["methods", {avoidQuotes: true}] },
        { code: "var x = {'a'(){}}", output: "var x = {'a': function(){}}", parserOptions: { ecmaVersion: 6 }, errors: [{ message: "Expected longform method syntax for string literal keys.", type: "Property" }], options: ["always", {avoidQuotes: true}] },
        { code: "var x = {['a'](){}}", output: "var x = {['a']: function(){}}", parserOptions: { ecmaVersion: 6 }, errors: [{ message: "Expected longform method syntax for string literal keys.", type: "Property" }], options: ["methods", {avoidQuotes: true}] },

        // consistent
        { code: "var x = {a: a, b}", parserOptions: { ecmaVersion: 6}, errors: [{ message: "Unexpected mix of shorthand and non-shorthand properties.", type: "" }], options: ["consistent"] },
        { code: "var x = {b, c: d, f: g}", parserOptions: { ecmaVersion: 6}, errors: [{ message: "Unexpected mix of shorthand and non-shorthand properties.", type: "" }], options: ["consistent"] },
        { code: "var x = {foo, bar: baz, ...qux}", parserOptions: { ecmaVersion: 6, ecmaFeatures: { experimentalObjectRestSpread: true } }, errors: [{ message: "Unexpected mix of shorthand and non-shorthand properties.", type: "" }], options: ["consistent"] },

        // consistent-as-needed
        { code: "var x = {a: a, b: b}", parserOptions: { ecmaVersion: 6}, errors: [{ message: "Expected shorthand for all properties.", type: "" }], options: ["consistent-as-needed"] },
        { code: "var x = {a, z: function z(){}}", parserOptions: { ecmaVersion: 6}, errors: [{ message: "Unexpected mix of shorthand and non-shorthand properties.", type: "" }], options: ["consistent-as-needed"] },
        { code: "var x = {foo: function() {}}", parserOptions: { ecmaVersion: 6}, errors: [{ message: "Expected shorthand for all properties.", type: "" }], options: ["consistent-as-needed"] },
        { code: "var x = {a: a, b: b, ...baz}", parserOptions: { ecmaVersion: 6, ecmaFeatures: { experimentalObjectRestSpread: true } }, errors: [{ message: "Expected shorthand for all properties.", type: "" }], options: ["consistent-as-needed"] },
        { code: "var x = {foo, bar: bar, ...qux}", parserOptions: { ecmaVersion: 6, ecmaFeatures: { experimentalObjectRestSpread: true } }, errors: [{ message: "Unexpected mix of shorthand and non-shorthand properties.", type: "" }], options: ["consistent-as-needed"] }
    ]
});
