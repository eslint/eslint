/**
 * @fileoverview Tests for no-invalid-this rule.
 * @author Toru Nagashima
 * @copyright 2015 Toru Nagashima. All rights reserved.
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var assign = require("object-assign");
var rule = require("../../../lib/rules/no-invalid-this");
var RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * A constant value for non strict mode environment.
 * @returns {void}
 */
function NORMAL() {
    // do nohting.
}

/**
 * A constant value for strict mode environment.
 * This modifies pattern object to make strict mode.
 * @param {object} pattern - A pattern object to modify.
 * @returns {void}
 */
function USE_STRICT(pattern) {
    pattern.code = "\"use strict\"; " + pattern.code;
}

/**
 * A constant value for modules environment.
 * This modifies pattern object to make modules.
 * @param {object} pattern - A pattern object to modify.
 * @returns {void}
 */
function MODULES(pattern) {
    pattern.code = "/* modules */ " + pattern.code;
    pattern.ecmaFeatures = assign({}, pattern.ecmaFeatures, {modules: true});
}

/**
 * Extracts patterns each condition for a specified type. The type is `valid` or `invalid`.
 * @param {object[]} patterns - Original patterns.
 * @param {string} type - One of `"valid"` or `"invalid"`.
 * @returns {object[]} Test patterns.
 */
function extractPatterns(patterns, type) {
    // Clone and apply the pattern environment.
    var patternsList = patterns.map(function(pattern) {
        return pattern[type].map(function(applyCondition) {
            var thisPattern = assign({}, pattern);
            applyCondition(thisPattern);

            if (type === "valid") {
                thisPattern.errors = [];
            } else {
                thisPattern.code += " /* should error */";
            }

            return thisPattern;
        });
    });

    // Flatten.
    return Array.prototype.concat.apply([], patternsList);
}


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var errors = [
    {message: "Unexpected `this`.", type: "ThisExpression"},
    {message: "Unexpected `this`.", type: "ThisExpression"}
];

var patterns = [
    // Global.
    {
        code: "console.log(this); z(x => console.log(x, this));",
        ecmaFeatures: {arrowFunctions: true},
        errors: errors,
        valid: [NORMAL],
        invalid: [USE_STRICT, MODULES]
    },
    {
        code: "console.log(this); z(x => console.log(x, this));",
        ecmaFeatures: {arrowFunctions: true, globalReturn: true},
        errors: errors,
        valid: [NORMAL],
        invalid: [USE_STRICT, MODULES]
    },

    // IIFE.
    {
        code: "(function() { console.log(this); z(x => console.log(x, this)); })();",
        ecmaFeatures: {arrowFunctions: true},
        errors: errors,
        valid: [NORMAL],
        invalid: [USE_STRICT, MODULES]
    },

    // Just functions.
    {
        code: "function foo() { console.log(this); z(x => console.log(x, this)); }",
        ecmaFeatures: {arrowFunctions: true},
        errors: errors,
        valid: [NORMAL],
        invalid: [USE_STRICT, MODULES]
    },
    {
        code: "function foo() { \"use strict\"; console.log(this); z(x => console.log(x, this)); }",
        ecmaFeatures: {arrowFunctions: true},
        errors: errors,
        valid: [],
        invalid: [NORMAL, USE_STRICT, MODULES]
    },
    {
        code: "return function() { console.log(this); z(x => console.log(x, this)); };",
        ecmaFeatures: {arrowFunctions: true, globalReturn: true},
        errors: errors,
        valid: [NORMAL],
        invalid: [USE_STRICT] // modules cannot return on global.
    },
    {
        code: "var foo = (function() { console.log(this); z(x => console.log(x, this)); }).bar(obj);",
        ecmaFeatures: {arrowFunctions: true},
        errors: errors,
        valid: [NORMAL],
        invalid: [USE_STRICT, MODULES]
    },

    // Functions in methods.
    {
        code: "var obj = {foo: function() { function foo() { console.log(this); z(x => console.log(x, this)); } foo(); }};",
        ecmaFeatures: {arrowFunctions: true},
        errors: errors,
        valid: [NORMAL],
        invalid: [USE_STRICT, MODULES]
    },
    {
        code: "var obj = {foo() { function foo() { console.log(this); z(x => console.log(x, this)); } foo(); }};",
        ecmaFeatures: {arrowFunctions: true, objectLiteralShorthandMethods: true},
        errors: errors,
        valid: [NORMAL],
        invalid: [USE_STRICT, MODULES]
    },
    {
        code: "var obj = {foo: function() { return function() { console.log(this); z(x => console.log(x, this)); }; }};",
        ecmaFeatures: {arrowFunctions: true},
        errors: errors,
        valid: [NORMAL],
        invalid: [USE_STRICT, MODULES]
    },
    {
        code: "var obj = {foo: function() { \"use strict\"; return function() { console.log(this); z(x => console.log(x, this)); }; }};",
        ecmaFeatures: {arrowFunctions: true},
        errors: errors,
        valid: [],
        invalid: [NORMAL, USE_STRICT, MODULES]
    },
    {
        code: "obj.foo = function() { return function() { console.log(this); z(x => console.log(x, this)); }; };",
        ecmaFeatures: {arrowFunctions: true},
        errors: errors,
        valid: [NORMAL],
        invalid: [USE_STRICT, MODULES]
    },
    {
        code: "obj.foo = function() { \"use strict\"; return function() { console.log(this); z(x => console.log(x, this)); }; };",
        ecmaFeatures: {arrowFunctions: true},
        errors: errors,
        valid: [],
        invalid: [NORMAL, USE_STRICT, MODULES]
    },
    {
        code: "class A { foo() { return function() { console.log(this); z(x => console.log(x, this)); }; } }",
        ecmaFeatures: {arrowFunctions: true, classes: true},
        errors: errors,
        valid: [],
        invalid: [NORMAL, USE_STRICT, MODULES]
    },

    // Class Static methods.
    {
        code: "class A {static foo() { console.log(this); z(x => console.log(x, this)); }};",
        ecmaFeatures: {arrowFunctions: true, classes: true},
        errors: errors,
        valid: [],
        invalid: [NORMAL, USE_STRICT, MODULES]
    },

    // Constructors.
    {
        code: "function Foo() { console.log(this); z(x => console.log(x, this)); }",
        ecmaFeatures: {arrowFunctions: true},
        valid: [NORMAL, USE_STRICT, MODULES],
        invalid: []
    },
    {
        code: "var Foo = function Foo() { console.log(this); z(x => console.log(x, this)); };",
        ecmaFeatures: {arrowFunctions: true},
        valid: [NORMAL, USE_STRICT, MODULES],
        invalid: []
    },
    {
        code: "class A {constructor() { console.log(this); z(x => console.log(x, this)); }};",
        ecmaFeatures: {arrowFunctions: true, classes: true},
        valid: [NORMAL, USE_STRICT, MODULES],
        invalid: []
    },

    // On a property.
    {
        code: "var obj = {foo: function() { console.log(this); z(x => console.log(x, this)); }};",
        ecmaFeatures: {arrowFunctions: true},
        valid: [NORMAL, USE_STRICT, MODULES],
        invalid: []
    },
    {
        code: "var obj = {foo() { console.log(this); z(x => console.log(x, this)); }};",
        ecmaFeatures: {arrowFunctions: true, objectLiteralShorthandMethods: true},
        valid: [NORMAL, USE_STRICT, MODULES],
        invalid: []
    },
    {
        code: "var obj = {foo: foo || function() { console.log(this); z(x => console.log(x, this)); }};",
        ecmaFeatures: {arrowFunctions: true},
        valid: [NORMAL, USE_STRICT, MODULES],
        invalid: []
    },
    {
        code: "var obj = {foo: hasNative ? foo : function() { console.log(this); z(x => console.log(x, this)); }};",
        ecmaFeatures: {arrowFunctions: true},
        valid: [NORMAL, USE_STRICT, MODULES],
        invalid: []
    },
    {
        code: "var obj = {foo: (function() { return function() { console.log(this); z(x => console.log(x, this)); }; })()};",
        ecmaFeatures: {arrowFunctions: true},
        valid: [NORMAL, USE_STRICT, MODULES],
        invalid: []
    },
    {
        code: "Object.defineProperty(obj, \"foo\", {value: function() { console.log(this); z(x => console.log(x, this)); }})",
        ecmaFeatures: {arrowFunctions: true},
        valid: [NORMAL, USE_STRICT, MODULES],
        invalid: []
    },
    {
        code: "Object.defineProperties(obj, {foo: {value: function() { console.log(this); z(x => console.log(x, this)); }}})",
        ecmaFeatures: {arrowFunctions: true},
        valid: [NORMAL, USE_STRICT, MODULES],
        invalid: []
    },

    // Assigns to a property.
    {
        code: "obj.foo = function() { console.log(this); z(x => console.log(x, this)); };",
        ecmaFeatures: {arrowFunctions: true},
        valid: [NORMAL, USE_STRICT, MODULES],
        invalid: []
    },
    {
        code: "obj.foo = foo || function() { console.log(this); z(x => console.log(x, this)); };",
        ecmaFeatures: {arrowFunctions: true},
        valid: [NORMAL, USE_STRICT, MODULES],
        invalid: []
    },
    {
        code: "obj.foo = foo ? bar : function() { console.log(this); z(x => console.log(x, this)); };",
        ecmaFeatures: {arrowFunctions: true},
        valid: [NORMAL, USE_STRICT, MODULES],
        invalid: []
    },
    {
        code: "obj.foo = (function() { return function() { console.log(this); z(x => console.log(x, this)); }; })();",
        ecmaFeatures: {arrowFunctions: true},
        valid: [NORMAL, USE_STRICT, MODULES],
        invalid: []
    },

    // Class Instance Methods.
    {
        code: "class A {foo() { console.log(this); z(x => console.log(x, this)); }};",
        ecmaFeatures: {arrowFunctions: true, classes: true},
        valid: [NORMAL, USE_STRICT, MODULES],
        invalid: []
    },

    // Bind/Call/Apply
    {
        code: "var foo = function() { console.log(this); z(x => console.log(x, this)); }.bind(obj);",
        ecmaFeatures: {arrowFunctions: true},
        valid: [NORMAL, USE_STRICT, MODULES],
        invalid: []
    },
    {
        code: "var foo = function() { console.log(this); z(x => console.log(x, this)); }.bind(null);",
        ecmaFeatures: {arrowFunctions: true},
        errors: errors,
        valid: [NORMAL],
        invalid: [USE_STRICT, MODULES]
    },
    {
        code: "(function() { console.log(this); z(x => console.log(x, this)); }).call(obj);",
        ecmaFeatures: {arrowFunctions: true},
        valid: [NORMAL, USE_STRICT, MODULES],
        invalid: []
    },
    {
        code: "(function() { console.log(this); z(x => console.log(x, this)); }).call(undefined);",
        ecmaFeatures: {arrowFunctions: true},
        errors: errors,
        valid: [NORMAL],
        invalid: [USE_STRICT, MODULES]
    },
    {
        code: "(function() { console.log(this); z(x => console.log(x, this)); }).apply(obj);",
        ecmaFeatures: {arrowFunctions: true},
        valid: [NORMAL, USE_STRICT, MODULES],
        invalid: []
    },
    {
        code: "(function() { console.log(this); z(x => console.log(x, this)); }).apply(void 0);",
        ecmaFeatures: {arrowFunctions: true},
        errors: errors,
        valid: [NORMAL],
        invalid: [USE_STRICT, MODULES]
    },
    {
        code: "Reflect.apply(function() { console.log(this); z(x => console.log(x, this)); }, obj, []);",
        ecmaFeatures: {arrowFunctions: true},
        valid: [NORMAL, USE_STRICT, MODULES],
        invalid: []
    },

    // Array methods.
    {
        code: "Array.from([], function() { console.log(this); z(x => console.log(x, this)); });",
        ecmaFeatures: {arrowFunctions: true},
        errors: errors,
        valid: [NORMAL],
        invalid: [USE_STRICT, MODULES]
    },
    {
        code: "foo.every(function() { console.log(this); z(x => console.log(x, this)); });",
        ecmaFeatures: {arrowFunctions: true},
        errors: errors,
        valid: [NORMAL],
        invalid: [USE_STRICT, MODULES]
    },
    {
        code: "foo.filter(function() { console.log(this); z(x => console.log(x, this)); });",
        ecmaFeatures: {arrowFunctions: true},
        errors: errors,
        valid: [NORMAL],
        invalid: [USE_STRICT, MODULES]
    },
    {
        code: "foo.find(function() { console.log(this); z(x => console.log(x, this)); });",
        ecmaFeatures: {arrowFunctions: true},
        errors: errors,
        valid: [NORMAL],
        invalid: [USE_STRICT, MODULES]
    },
    {
        code: "foo.findIndex(function() { console.log(this); z(x => console.log(x, this)); });",
        ecmaFeatures: {arrowFunctions: true},
        errors: errors,
        valid: [NORMAL],
        invalid: [USE_STRICT, MODULES]
    },
    {
        code: "foo.forEach(function() { console.log(this); z(x => console.log(x, this)); });",
        ecmaFeatures: {arrowFunctions: true},
        errors: errors,
        valid: [NORMAL],
        invalid: [USE_STRICT, MODULES]
    },
    {
        code: "foo.map(function() { console.log(this); z(x => console.log(x, this)); });",
        ecmaFeatures: {arrowFunctions: true},
        errors: errors,
        valid: [NORMAL],
        invalid: [USE_STRICT, MODULES]
    },
    {
        code: "foo.some(function() { console.log(this); z(x => console.log(x, this)); });",
        ecmaFeatures: {arrowFunctions: true},
        errors: errors,
        valid: [NORMAL],
        invalid: [USE_STRICT, MODULES]
    },
    {
        code: "Array.from([], function() { console.log(this); z(x => console.log(x, this)); }, obj);",
        ecmaFeatures: {arrowFunctions: true},
        valid: [NORMAL, USE_STRICT, MODULES],
        invalid: []
    },
    {
        code: "foo.every(function() { console.log(this); z(x => console.log(x, this)); }, obj);",
        ecmaFeatures: {arrowFunctions: true},
        valid: [NORMAL, USE_STRICT, MODULES],
        invalid: []
    },
    {
        code: "foo.filter(function() { console.log(this); z(x => console.log(x, this)); }, obj);",
        ecmaFeatures: {arrowFunctions: true},
        valid: [NORMAL, USE_STRICT, MODULES],
        invalid: []
    },
    {
        code: "foo.find(function() { console.log(this); z(x => console.log(x, this)); }, obj);",
        ecmaFeatures: {arrowFunctions: true},
        valid: [NORMAL, USE_STRICT, MODULES],
        invalid: []
    },
    {
        code: "foo.findIndex(function() { console.log(this); z(x => console.log(x, this)); }, obj);",
        ecmaFeatures: {arrowFunctions: true},
        valid: [NORMAL, USE_STRICT, MODULES],
        invalid: []
    },
    {
        code: "foo.forEach(function() { console.log(this); z(x => console.log(x, this)); }, obj);",
        ecmaFeatures: {arrowFunctions: true},
        valid: [NORMAL, USE_STRICT, MODULES],
        invalid: []
    },
    {
        code: "foo.map(function() { console.log(this); z(x => console.log(x, this)); }, obj);",
        ecmaFeatures: {arrowFunctions: true},
        valid: [NORMAL, USE_STRICT, MODULES],
        invalid: []
    },
    {
        code: "foo.some(function() { console.log(this); z(x => console.log(x, this)); }, obj);",
        ecmaFeatures: {arrowFunctions: true},
        valid: [NORMAL, USE_STRICT, MODULES],
        invalid: []
    },
    {
        code: "foo.forEach(function() { console.log(this); z(x => console.log(x, this)); }, null);",
        ecmaFeatures: {arrowFunctions: true},
        errors: errors,
        valid: [NORMAL],
        invalid: [USE_STRICT, MODULES]
    },

    // @this tag.
    {
        code: "/** @this Obj */ function foo() { console.log(this); z(x => console.log(x, this)); }",
        ecmaFeatures: {arrowFunctions: true},
        valid: [NORMAL, USE_STRICT, MODULES],
        invalid: []
    },
    {
        code: "/**\n * @returns {void}\n * @this Obj\n */\nfunction foo() { console.log(this); z(x => console.log(x, this)); }",
        ecmaFeatures: {arrowFunctions: true},
        valid: [NORMAL, USE_STRICT, MODULES],
        invalid: []
    },
    {
        code: "/** @returns {void} */ function foo() { console.log(this); z(x => console.log(x, this)); }",
        ecmaFeatures: {arrowFunctions: true},
        errors: errors,
        valid: [NORMAL],
        invalid: [USE_STRICT, MODULES]
    },
    {
        code: "/** @this Obj */ foo(function() { console.log(this); z(x => console.log(x, this)); });",
        ecmaFeatures: {arrowFunctions: true},
        errors: errors,
        valid: [NORMAL],
        invalid: [USE_STRICT, MODULES]
    },
    {
        code: "foo(/* @this Obj */ function() { console.log(this); z(x => console.log(x, this)); });",
        ecmaFeatures: {arrowFunctions: true},
        errors: errors,
        valid: [NORMAL, USE_STRICT, MODULES],
        invalid: []
    },

    // https://github.com/eslint/eslint/issues/3254
    {
        code: "function foo() { console.log(this); z(x => console.log(x, this)); }",
        ecmaFeatures: {arrowFunctions: true, blockBindings: true},
        errors: errors,
        valid: [NORMAL],
        invalid: [USE_STRICT, MODULES]
    },

    // https://github.com/eslint/eslint/issues/3287
    {
        code: "function foo() { /** @this Obj*/ return function bar() { console.log(this); z(x => console.log(x, this)); }; }",
        ecmaFeatures: {arrowFunctions: true},
        valid: [NORMAL, USE_STRICT, MODULES],
        invalid: []
    }
];

var ruleTester = new RuleTester();
ruleTester.run("no-invalid-this", rule, {
    valid: extractPatterns(patterns, "valid"),
    invalid: extractPatterns(patterns, "invalid")
});
