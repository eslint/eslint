/**
 * @fileoverview Tests for no-invalid-this rule.
 * @author Toru Nagashima
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const merge = require("lodash.merge");

const rule = require("../../../lib/rules/no-invalid-this");
const RuleTester = require("../../../lib/rule-tester/rule-tester");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * A constant value for non strict mode environment.
 * @returns {void}
 */
function NORMAL() {

    // do nothing.
}

/**
 * A constant value for strict mode environment.
 * This modifies pattern object to make strict mode.
 * @param {Object} pattern A pattern object to modify.
 * @returns {void}
 */
function USE_STRICT(pattern) {
    pattern.code = `"use strict"; ${pattern.code}`;
}

/**
 * A constant value for implied strict mode.
 * This modifies pattern object to impose strict mode.
 * @param {Object} pattern A pattern object to modify.
 * @returns {void}
 */
function IMPLIED_STRICT(pattern) {
    pattern.code = `/* implied strict mode */ ${pattern.code}`;
    pattern.languageOptions = pattern.languageOptions || {};
    pattern.languageOptions.parserOptions = pattern.languageOptions.parserOptions || {};
    pattern.languageOptions.parserOptions.ecmaFeatures = pattern.languageOptions.parserOptions.ecmaFeatures || {};
    pattern.languageOptions.parserOptions.ecmaFeatures.impliedStrict = true;
}

/**
 * A constant value for modules environment.
 * This modifies pattern object to make modules.
 * @param {Object} pattern A pattern object to modify.
 * @returns {void}
 */
function MODULES(pattern) {
    pattern.code = `/* modules */ ${pattern.code}`;
    pattern.languageOptions.sourceType = "module";
}

/**
 * Extracts patterns each condition for a specified type. The type is `valid` or `invalid`.
 * @param {Object[]} patterns Original patterns.
 * @param {string} type One of `"valid"` or `"invalid"`.
 * @returns {Object[]} Test patterns.
 */
function extractPatterns(patterns, type) {

    // Clone and apply the pattern environment.
    const patternsList = patterns.map(pattern => pattern[type].map(applyCondition => {
        const thisPattern = merge({}, pattern);

        applyCondition(thisPattern);

        if (type === "valid") {
            thisPattern.errors = [];
        } else {
            thisPattern.code += " /* should error */";
        }

        delete thisPattern.valid;
        delete thisPattern.invalid;

        return thisPattern;
    }));

    return patternsList.flat();
}

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const errors = [
    { messageId: "unexpectedThis", type: "ThisExpression" },
    { messageId: "unexpectedThis", type: "ThisExpression" }
];

const patterns = [

    // Global.
    {
        code: "console.log(this); z(x => console.log(x, this));",
        languageOptions: { ecmaVersion: 6 },
        errors,
        valid: [NORMAL, USE_STRICT, IMPLIED_STRICT],
        invalid: [MODULES]
    },
    {
        code: "console.log(this); z(x => console.log(x, this));",
        languageOptions: {
            ecmaVersion: 6,
            parserOptions: {
                ecmaFeatures: { globalReturn: true }
            }
        },
        errors,
        valid: [NORMAL],
        invalid: [USE_STRICT, IMPLIED_STRICT, MODULES]
    },
    {
        code: "() => { this }; this;",
        languageOptions: {
            ecmaVersion: 6
        },
        errors,
        valid: [NORMAL, USE_STRICT, IMPLIED_STRICT],
        invalid: [MODULES]
    },
    {
        code: "this.eval('foo');",
        languageOptions: {
            ecmaVersion: 6
        },
        errors: [{ messageId: "unexpectedThis", type: "ThisExpression" }],
        valid: [NORMAL, USE_STRICT, IMPLIED_STRICT],
        invalid: [MODULES]
    },

    // IIFE.
    {
        code: "(function() { console.log(this); z(x => console.log(x, this)); })();",
        languageOptions: { ecmaVersion: 6 },
        errors,
        valid: [NORMAL],
        invalid: [USE_STRICT, IMPLIED_STRICT, MODULES]
    },

    /*
     * Just functions.
     * https://github.com/eslint/eslint/issues/3254
     */
    {
        code: "function foo() { console.log(this); z(x => console.log(x, this)); }",
        languageOptions: { ecmaVersion: 6 },
        errors,
        valid: [NORMAL],
        invalid: [USE_STRICT, IMPLIED_STRICT, MODULES]
    },
    {
        code: "function foo() { console.log(this); z(x => console.log(x, this)); }",
        languageOptions: { ecmaVersion: 6 },
        options: [{ capIsConstructor: false }], // test that the option doesn't reverse the logic and mistakenly allows lowercase functions
        errors,
        valid: [NORMAL],
        invalid: [USE_STRICT, IMPLIED_STRICT, MODULES]
    },
    {
        code: "function Foo() { console.log(this); z(x => console.log(x, this)); }",
        languageOptions: { ecmaVersion: 6 },
        options: [{ capIsConstructor: false }],
        errors,
        valid: [NORMAL],
        invalid: [USE_STRICT, IMPLIED_STRICT, MODULES]
    },
    {
        code: "function foo() { \"use strict\"; console.log(this); z(x => console.log(x, this)); }",
        languageOptions: { ecmaVersion: 6 },
        errors,
        valid: [],
        invalid: [NORMAL, USE_STRICT, IMPLIED_STRICT, MODULES]
    },
    {
        code: "function Foo() { \"use strict\"; console.log(this); z(x => console.log(x, this)); }",
        languageOptions: { ecmaVersion: 6 },
        options: [{ capIsConstructor: false }],
        errors,
        valid: [],
        invalid: [NORMAL, USE_STRICT, IMPLIED_STRICT, MODULES]
    },
    {
        code: "return function() { console.log(this); z(x => console.log(x, this)); };",
        languageOptions: {
            ecmaVersion: 6,
            parserOptions: {
                ecmaFeatures: { globalReturn: true }
            }
        },
        errors,
        valid: [NORMAL],
        invalid: [USE_STRICT, IMPLIED_STRICT] // modules cannot return on global.
    },
    {
        code: "var foo = (function() { console.log(this); z(x => console.log(x, this)); }).bar(obj);",
        languageOptions: { ecmaVersion: 6 },
        errors,
        valid: [NORMAL],
        invalid: [USE_STRICT, IMPLIED_STRICT, MODULES]
    },

    // Functions in methods.
    {
        code: "var obj = {foo: function() { function foo() { console.log(this); z(x => console.log(x, this)); } foo(); }};",
        languageOptions: { ecmaVersion: 6 },
        errors,
        valid: [NORMAL],
        invalid: [USE_STRICT, IMPLIED_STRICT, MODULES]
    },
    {
        code: "var obj = {foo() { function foo() { console.log(this); z(x => console.log(x, this)); } foo(); }};",
        languageOptions: { ecmaVersion: 6 },
        errors,
        valid: [NORMAL],
        invalid: [USE_STRICT, IMPLIED_STRICT, MODULES]
    },
    {
        code: "var obj = {foo: function() { return function() { console.log(this); z(x => console.log(x, this)); }; }};",
        languageOptions: { ecmaVersion: 6 },
        errors,
        valid: [NORMAL],
        invalid: [USE_STRICT, IMPLIED_STRICT, MODULES]
    },
    {
        code: "var obj = {foo: function() { \"use strict\"; return function() { console.log(this); z(x => console.log(x, this)); }; }};",
        languageOptions: { ecmaVersion: 6 },
        errors,
        valid: [],
        invalid: [NORMAL, USE_STRICT, IMPLIED_STRICT, MODULES]
    },
    {
        code: "obj.foo = function() { return function() { console.log(this); z(x => console.log(x, this)); }; };",
        languageOptions: { ecmaVersion: 6 },
        errors,
        valid: [NORMAL],
        invalid: [USE_STRICT, IMPLIED_STRICT, MODULES]
    },
    {
        code: "obj.foo = function() { \"use strict\"; return function() { console.log(this); z(x => console.log(x, this)); }; };",
        languageOptions: { ecmaVersion: 6 },
        errors,
        valid: [],
        invalid: [NORMAL, USE_STRICT, IMPLIED_STRICT, MODULES]
    },
    {
        code: "class A { foo() { return function() { console.log(this); z(x => console.log(x, this)); }; } }",
        languageOptions: { ecmaVersion: 6 },
        errors,
        valid: [],
        invalid: [NORMAL, USE_STRICT, IMPLIED_STRICT, MODULES]
    },

    // Class Static methods.
    {
        code: "class A {static foo() { console.log(this); z(x => console.log(x, this)); }};",
        languageOptions: { ecmaVersion: 6 },
        errors,
        valid: [NORMAL, USE_STRICT, IMPLIED_STRICT, MODULES],
        invalid: []
    },

    // Constructors.
    {
        code: "function Foo() { console.log(this); z(x => console.log(x, this)); }",
        languageOptions: { ecmaVersion: 6 },
        valid: [NORMAL, USE_STRICT, IMPLIED_STRICT, MODULES],
        invalid: []
    },
    {
        code: "function Foo() { console.log(this); z(x => console.log(x, this)); }",
        languageOptions: { ecmaVersion: 6 },
        options: [{}], // test the default value in schema
        valid: [NORMAL, USE_STRICT, IMPLIED_STRICT, MODULES],
        invalid: []
    },
    {
        code: "function Foo() { console.log(this); z(x => console.log(x, this)); }",
        languageOptions: { ecmaVersion: 6 },
        options: [{ capIsConstructor: true }], // test explicitly set option to the default value
        valid: [NORMAL, USE_STRICT, IMPLIED_STRICT, MODULES],
        invalid: []
    },
    {
        code: "var Foo = function Foo() { console.log(this); z(x => console.log(x, this)); };",
        languageOptions: { ecmaVersion: 6 },
        valid: [NORMAL, USE_STRICT, IMPLIED_STRICT, MODULES],
        invalid: []
    },
    {
        code: "class A {constructor() { console.log(this); z(x => console.log(x, this)); }};",
        languageOptions: { ecmaVersion: 6 },
        valid: [NORMAL, USE_STRICT, IMPLIED_STRICT, MODULES],
        invalid: []
    },

    // On a property.
    {
        code: "var obj = {foo: function() { console.log(this); z(x => console.log(x, this)); }};",
        languageOptions: { ecmaVersion: 6 },
        valid: [NORMAL, USE_STRICT, IMPLIED_STRICT, MODULES],
        invalid: []
    },
    {
        code: "var obj = {foo() { console.log(this); z(x => console.log(x, this)); }};",
        languageOptions: { ecmaVersion: 6 },
        valid: [NORMAL, USE_STRICT, IMPLIED_STRICT, MODULES],
        invalid: []
    },
    {
        code: "var obj = {foo: foo || function() { console.log(this); z(x => console.log(x, this)); }};",
        languageOptions: { ecmaVersion: 6 },
        valid: [NORMAL, USE_STRICT, IMPLIED_STRICT, MODULES],
        invalid: []
    },
    {
        code: "var obj = {foo: hasNative ? foo : function() { console.log(this); z(x => console.log(x, this)); }};",
        languageOptions: { ecmaVersion: 6 },
        valid: [NORMAL, USE_STRICT, IMPLIED_STRICT, MODULES],
        invalid: []
    },
    {
        code: "var obj = {foo: (function() { return function() { console.log(this); z(x => console.log(x, this)); }; })()};",
        languageOptions: { ecmaVersion: 6 },
        valid: [NORMAL, USE_STRICT, IMPLIED_STRICT, MODULES],
        invalid: []
    },
    {
        code: "Object.defineProperty(obj, \"foo\", {value: function() { console.log(this); z(x => console.log(x, this)); }})",
        languageOptions: { ecmaVersion: 6 },
        valid: [NORMAL, USE_STRICT, IMPLIED_STRICT, MODULES],
        invalid: []
    },
    {
        code: "Object.defineProperties(obj, {foo: {value: function() { console.log(this); z(x => console.log(x, this)); }}})",
        languageOptions: { ecmaVersion: 6 },
        valid: [NORMAL, USE_STRICT, IMPLIED_STRICT, MODULES],
        invalid: []
    },

    // Assigns to a property.
    {
        code: "obj.foo = function() { console.log(this); z(x => console.log(x, this)); };",
        languageOptions: { ecmaVersion: 6 },
        valid: [NORMAL, USE_STRICT, IMPLIED_STRICT, MODULES],
        invalid: []
    },
    {
        code: "obj.foo = foo || function() { console.log(this); z(x => console.log(x, this)); };",
        languageOptions: { ecmaVersion: 6 },
        valid: [NORMAL, USE_STRICT, IMPLIED_STRICT, MODULES],
        invalid: []
    },
    {
        code: "obj.foo = foo ? bar : function() { console.log(this); z(x => console.log(x, this)); };",
        languageOptions: { ecmaVersion: 6 },
        valid: [NORMAL, USE_STRICT, IMPLIED_STRICT, MODULES],
        invalid: []
    },
    {
        code: "obj.foo = (function() { return function() { console.log(this); z(x => console.log(x, this)); }; })();",
        languageOptions: { ecmaVersion: 6 },
        valid: [NORMAL, USE_STRICT, IMPLIED_STRICT, MODULES],
        invalid: []
    },
    {
        code: "obj.foo = (() => function() { console.log(this); z(x => console.log(x, this)); })();",
        languageOptions: { ecmaVersion: 6 },
        valid: [NORMAL, USE_STRICT, IMPLIED_STRICT, MODULES],
        invalid: []
    },
    {
        code: "obj.foo = (function() { return () => { console.log(this); z(x => console.log(x, this)); }; })();",
        languageOptions: { ecmaVersion: 6 },
        valid: [NORMAL],
        invalid: [USE_STRICT, IMPLIED_STRICT, MODULES],
        errors
    },
    {
        code: "obj.foo = (() => () => { console.log(this); z(x => console.log(x, this)); })();",
        languageOptions: { ecmaVersion: 6 },
        valid: [NORMAL, USE_STRICT, IMPLIED_STRICT],
        invalid: [MODULES],
        errors
    },
    {
        code: "obj.foo = (function() { return function() { console.log(this); z(x => console.log(x, this)); }; })?.();",
        languageOptions: { ecmaVersion: 2020 },
        valid: [NORMAL, USE_STRICT, IMPLIED_STRICT, MODULES],
        invalid: []
    },

    // Class Instance Methods.
    {
        code: "class A {foo() { console.log(this); z(x => console.log(x, this)); }};",
        languageOptions: { ecmaVersion: 6 },
        valid: [NORMAL, USE_STRICT, IMPLIED_STRICT, MODULES],
        invalid: []
    },

    // Bind/Call/Apply
    {
        code: "var foo = function() { console.log(this); z(x => console.log(x, this)); }.bind(obj);",
        languageOptions: { ecmaVersion: 6 },
        valid: [NORMAL, USE_STRICT, IMPLIED_STRICT, MODULES],
        invalid: []
    },
    {
        code: "var foo = function() { console.log(this); z(x => console.log(x, this)); }.bind(null);",
        languageOptions: { ecmaVersion: 6 },
        errors,
        valid: [NORMAL],
        invalid: [USE_STRICT, IMPLIED_STRICT, MODULES]
    },
    {
        code: "(function() { console.log(this); z(x => console.log(x, this)); }).call(obj);",
        languageOptions: { ecmaVersion: 6 },
        valid: [NORMAL, USE_STRICT, IMPLIED_STRICT, MODULES],
        invalid: []
    },
    {
        code: "(function() { console.log(this); z(x => console.log(x, this)); }).call(undefined);",
        languageOptions: { ecmaVersion: 6 },
        errors,
        valid: [NORMAL],
        invalid: [USE_STRICT, IMPLIED_STRICT, MODULES]
    },
    {
        code: "(function() { console.log(this); z(x => console.log(x, this)); }).apply(obj);",
        languageOptions: { ecmaVersion: 6 },
        valid: [NORMAL, USE_STRICT, IMPLIED_STRICT, MODULES],
        invalid: []
    },
    {
        code: "(function() { console.log(this); z(x => console.log(x, this)); }).apply(void 0);",
        languageOptions: { ecmaVersion: 6 },
        errors,
        valid: [NORMAL],
        invalid: [USE_STRICT, IMPLIED_STRICT, MODULES]
    },
    {
        code: "Reflect.apply(function() { console.log(this); z(x => console.log(x, this)); }, obj, []);",
        languageOptions: { ecmaVersion: 6 },
        valid: [NORMAL, USE_STRICT, IMPLIED_STRICT, MODULES],
        invalid: []
    },
    {
        code: "var foo = function() { console.log(this); z(x => console.log(x, this)); }?.bind(obj);",
        languageOptions: { ecmaVersion: 2020 },
        valid: [NORMAL, USE_STRICT, IMPLIED_STRICT, MODULES],
        invalid: []
    },
    {
        code: "var foo = (function() { console.log(this); z(x => console.log(x, this)); }?.bind)(obj);",
        languageOptions: { ecmaVersion: 2020 },
        valid: [NORMAL, USE_STRICT, IMPLIED_STRICT, MODULES],
        invalid: []
    },
    {
        code: "var foo = function() { console.log(this); z(x => console.log(x, this)); }.bind?.(obj);",
        languageOptions: { ecmaVersion: 2020 },
        valid: [NORMAL, USE_STRICT, IMPLIED_STRICT, MODULES],
        invalid: []
    },

    // Array methods.
    {
        code: "Array.from([], function() { console.log(this); z(x => console.log(x, this)); });",
        languageOptions: { ecmaVersion: 6 },
        errors,
        valid: [NORMAL],
        invalid: [USE_STRICT, IMPLIED_STRICT, MODULES]
    },
    ...[
        "every",
        "filter",
        "find",
        "findIndex",
        "findLast",
        "findLastIndex",
        "flatMap",
        "forEach",
        "map",
        "some"
    ].map(methodName => ({
        code: `foo.${methodName}(function() { console.log(this); z(x => console.log(x, this)); });`,
        languageOptions: { ecmaVersion: 6 },
        errors,
        valid: [NORMAL],
        invalid: [USE_STRICT, IMPLIED_STRICT, MODULES]
    })),
    {
        code: "Array.from([], function() { console.log(this); z(x => console.log(x, this)); }, obj);",
        languageOptions: { ecmaVersion: 6 },
        valid: [NORMAL, USE_STRICT, IMPLIED_STRICT, MODULES],
        invalid: []
    },
    ...[
        "every",
        "filter",
        "find",
        "findIndex",
        "findLast",
        "findLastIndex",
        "flatMap",
        "forEach",
        "map",
        "some"
    ].map(methodName => ({
        code: `foo.${methodName}(function() { console.log(this); z(x => console.log(x, this)); }, obj);`,
        languageOptions: { ecmaVersion: 6 },
        valid: [NORMAL, USE_STRICT, IMPLIED_STRICT, MODULES],
        invalid: []
    })),
    {
        code: "foo.forEach(function() { console.log(this); z(x => console.log(x, this)); }, null);",
        languageOptions: { ecmaVersion: 6 },
        errors,
        valid: [NORMAL],
        invalid: [USE_STRICT, IMPLIED_STRICT, MODULES]
    },
    {
        code: "Array?.from([], function() { console.log(this); z(x => console.log(x, this)); }, obj);",
        languageOptions: { ecmaVersion: 2020 },
        valid: [NORMAL, USE_STRICT, IMPLIED_STRICT, MODULES],
        invalid: []
    },
    {
        code: "foo?.every(function() { console.log(this); z(x => console.log(x, this)); }, obj);",
        languageOptions: { ecmaVersion: 2020 },
        valid: [NORMAL, USE_STRICT, IMPLIED_STRICT, MODULES],
        invalid: []
    },
    {
        code: "(Array?.from)([], function() { console.log(this); z(x => console.log(x, this)); }, obj);",
        languageOptions: { ecmaVersion: 2020 },
        valid: [NORMAL, USE_STRICT, IMPLIED_STRICT, MODULES],
        invalid: []
    },
    {
        code: "(foo?.every)(function() { console.log(this); z(x => console.log(x, this)); }, obj);",
        languageOptions: { ecmaVersion: 2020 },
        valid: [NORMAL, USE_STRICT, IMPLIED_STRICT, MODULES],
        invalid: []
    },

    // @this tag.
    {
        code: "/** @this Obj */ function foo() { console.log(this); z(x => console.log(x, this)); }",
        languageOptions: { ecmaVersion: 6 },
        valid: [NORMAL, USE_STRICT, IMPLIED_STRICT, MODULES],
        invalid: []
    },
    {
        code: "/**\n * @returns {void}\n * @this Obj\n */\nfunction foo() { console.log(this); z(x => console.log(x, this)); }",
        languageOptions: { ecmaVersion: 6 },
        valid: [NORMAL, USE_STRICT, IMPLIED_STRICT, MODULES],
        invalid: []
    },
    {
        code: "/** @returns {void} */ function foo() { console.log(this); z(x => console.log(x, this)); }",
        languageOptions: { ecmaVersion: 6 },
        errors,
        valid: [NORMAL],
        invalid: [USE_STRICT, IMPLIED_STRICT, MODULES]
    },
    {
        code: "/** @this Obj */ foo(function() { console.log(this); z(x => console.log(x, this)); });",
        languageOptions: { ecmaVersion: 6 },
        errors,
        valid: [NORMAL],
        invalid: [USE_STRICT, IMPLIED_STRICT, MODULES]
    },
    {
        code: "foo(/* @this Obj */ function() { console.log(this); z(x => console.log(x, this)); });",
        languageOptions: { ecmaVersion: 6 },
        errors,
        valid: [NORMAL, USE_STRICT, IMPLIED_STRICT, MODULES],
        invalid: []
    },

    // https://github.com/eslint/eslint/issues/3287
    {
        code: "function foo() { /** @this Obj*/ return function bar() { console.log(this); z(x => console.log(x, this)); }; }",
        languageOptions: { ecmaVersion: 6 },
        valid: [NORMAL, USE_STRICT, IMPLIED_STRICT, MODULES],
        invalid: []
    },

    // https://github.com/eslint/eslint/issues/6824
    {
        code: "var Ctor = function() { console.log(this); z(x => console.log(x, this)); }",
        languageOptions: { ecmaVersion: 6 },
        valid: [NORMAL, USE_STRICT, IMPLIED_STRICT, MODULES],
        invalid: []
    },
    {
        code: "var Ctor = function() { console.log(this); z(x => console.log(x, this)); }",
        languageOptions: { ecmaVersion: 6 },
        options: [{ capIsConstructor: false }],
        errors,
        valid: [NORMAL],
        invalid: [USE_STRICT, IMPLIED_STRICT, MODULES]
    },
    {
        code: "var func = function() { console.log(this); z(x => console.log(x, this)); }",
        languageOptions: { ecmaVersion: 6 },
        errors,
        valid: [NORMAL],
        invalid: [USE_STRICT, IMPLIED_STRICT, MODULES]
    },
    {
        code: "var func = function() { console.log(this); z(x => console.log(x, this)); }",
        languageOptions: { ecmaVersion: 6 },
        options: [{ capIsConstructor: false }],
        errors,
        valid: [NORMAL],
        invalid: [USE_STRICT, IMPLIED_STRICT, MODULES]
    },
    {
        code: "Ctor = function() { console.log(this); z(x => console.log(x, this)); }",
        languageOptions: { ecmaVersion: 6 },
        valid: [NORMAL, USE_STRICT, IMPLIED_STRICT, MODULES],
        invalid: []
    },
    {
        code: "Ctor = function() { console.log(this); z(x => console.log(x, this)); }",
        languageOptions: { ecmaVersion: 6 },
        options: [{ capIsConstructor: false }],
        errors,
        valid: [NORMAL],
        invalid: [USE_STRICT, IMPLIED_STRICT, MODULES]
    },
    {
        code: "func = function() { console.log(this); z(x => console.log(x, this)); }",
        languageOptions: { ecmaVersion: 6 },
        errors,
        valid: [NORMAL],
        invalid: [USE_STRICT, IMPLIED_STRICT, MODULES]
    },
    {
        code: "func = function() { console.log(this); z(x => console.log(x, this)); }",
        languageOptions: { ecmaVersion: 6 },
        options: [{ capIsConstructor: false }],
        errors,
        valid: [NORMAL],
        invalid: [USE_STRICT, IMPLIED_STRICT, MODULES]
    },
    {
        code: "function foo(Ctor = function() { console.log(this); z(x => console.log(x, this)); }) {}",
        languageOptions: { ecmaVersion: 6 },
        valid: [NORMAL, USE_STRICT, IMPLIED_STRICT, MODULES],
        invalid: []
    },
    {
        code: "function foo(func = function() { console.log(this); z(x => console.log(x, this)); }) {}",
        languageOptions: { ecmaVersion: 6 },
        errors,
        valid: [NORMAL],
        invalid: [USE_STRICT, IMPLIED_STRICT, MODULES]
    },
    {
        code: "[obj.method = function() { console.log(this); z(x => console.log(x, this)); }] = a",
        languageOptions: { ecmaVersion: 6 },
        valid: [NORMAL, USE_STRICT, IMPLIED_STRICT, MODULES],
        invalid: []
    },
    {
        code: "[func = function() { console.log(this); z(x => console.log(x, this)); }] = a",
        languageOptions: { ecmaVersion: 6 },
        errors,
        valid: [NORMAL],
        invalid: [USE_STRICT, IMPLIED_STRICT, MODULES]
    },

    // Logical assignments
    {
        code: "obj.method &&= function () { console.log(this); z(x => console.log(x, this)); }",
        languageOptions: { ecmaVersion: 2021 },
        valid: [NORMAL, USE_STRICT, IMPLIED_STRICT, MODULES],
        invalid: []
    },
    {
        code: "obj.method ||= function () { console.log(this); z(x => console.log(x, this)); }",
        languageOptions: { ecmaVersion: 2021 },
        valid: [NORMAL, USE_STRICT, IMPLIED_STRICT, MODULES],
        invalid: []
    },
    {
        code: "obj.method ??= function () { console.log(this); z(x => console.log(x, this)); }",
        languageOptions: { ecmaVersion: 2021 },
        valid: [NORMAL, USE_STRICT, IMPLIED_STRICT, MODULES],
        invalid: []
    },

    // Class fields.
    {
        code: "class C { field = this }",
        languageOptions: { ecmaVersion: 2022 },
        valid: [NORMAL, USE_STRICT, IMPLIED_STRICT, MODULES],
        invalid: []
    },
    {
        code: "class C { static field = this }",
        languageOptions: { ecmaVersion: 2022 },
        valid: [NORMAL, USE_STRICT, IMPLIED_STRICT, MODULES],
        invalid: []
    },
    {
        code: "class C { field = console.log(this); }",
        languageOptions: { ecmaVersion: 2022 },
        valid: [NORMAL, USE_STRICT, IMPLIED_STRICT, MODULES],
        invalid: []
    },
    {
        code: "class C { field = z(x => console.log(x, this)); }",
        languageOptions: { ecmaVersion: 2022 },
        valid: [NORMAL, USE_STRICT, IMPLIED_STRICT, MODULES],
        invalid: []
    },
    {
        code: "class C { field = function () { console.log(this); z(x => console.log(x, this)); }; }",
        languageOptions: { ecmaVersion: 2022 },
        valid: [NORMAL, USE_STRICT, IMPLIED_STRICT, MODULES],
        invalid: []
    },
    {
        code: "class C { #field = function () { console.log(this); z(x => console.log(x, this)); }; }",
        languageOptions: { ecmaVersion: 2022 },
        valid: [NORMAL, USE_STRICT, IMPLIED_STRICT, MODULES],
        invalid: []
    },
    {
        code: "class C { [this.foo]; }",
        languageOptions: { ecmaVersion: 2022 },
        valid: [NORMAL, USE_STRICT, IMPLIED_STRICT], // `this` is the top-level `this`
        invalid: [MODULES],
        errors: [{ messageId: "unexpectedThis", type: "ThisExpression" }]
    },
    {
        code: "class C { foo = () => this; }",
        languageOptions: { ecmaVersion: 2022 },
        valid: [NORMAL, USE_STRICT, IMPLIED_STRICT, MODULES],
        invalid: [],
        errors: [{ messageId: "unexpectedThis", type: "ThisExpression" }]
    },
    {
        code: "class C { foo = () => { this }; }",
        languageOptions: { ecmaVersion: 2022 },
        valid: [NORMAL, USE_STRICT, IMPLIED_STRICT, MODULES],
        invalid: [],
        errors: [{ messageId: "unexpectedThis", type: "ThisExpression" }]
    },

    // Class static blocks
    {
        code: "class C { static { this.x; } }",
        languageOptions: { ecmaVersion: 2022 },
        valid: [NORMAL, USE_STRICT, IMPLIED_STRICT, MODULES],
        invalid: []
    },
    {
        code: "class C { static { () => { this.x; } } }",
        languageOptions: { ecmaVersion: 2022 },
        valid: [NORMAL, USE_STRICT, IMPLIED_STRICT, MODULES],
        invalid: []
    },
    {
        code: "class C { static { class D { [this.x]; } } }",
        languageOptions: { ecmaVersion: 2022 },
        valid: [NORMAL, USE_STRICT, IMPLIED_STRICT, MODULES],
        invalid: []
    },
    {
        code: "class C { static { function foo() { this.x; } } }",
        languageOptions: { ecmaVersion: 2022 },
        valid: [],
        invalid: [NORMAL, USE_STRICT, IMPLIED_STRICT, MODULES],
        errors: [{ messageId: "unexpectedThis", type: "ThisExpression" }]
    },
    {
        code: "class C { static { (function() { this.x; }); } }",
        languageOptions: { ecmaVersion: 2022 },
        valid: [],
        invalid: [NORMAL, USE_STRICT, IMPLIED_STRICT, MODULES],
        errors: [{ messageId: "unexpectedThis", type: "ThisExpression" }]
    },
    {
        code: "class C { static { (function() { this.x; })(); } }",
        languageOptions: { ecmaVersion: 2022 },
        valid: [],
        invalid: [NORMAL, USE_STRICT, IMPLIED_STRICT, MODULES],
        errors: [{ messageId: "unexpectedThis", type: "ThisExpression" }]
    },
    {
        code: "class C { static {} [this]; }",
        languageOptions: { ecmaVersion: 2022 },
        valid: [NORMAL, USE_STRICT, IMPLIED_STRICT],
        invalid: [MODULES],
        errors: [{ messageId: "unexpectedThis", type: "ThisExpression" }]
    },
    {
        code: "class C { static {} [this.x]; }",
        languageOptions: { ecmaVersion: 2022 },
        valid: [NORMAL, USE_STRICT, IMPLIED_STRICT],
        invalid: [MODULES],
        errors: [{ messageId: "unexpectedThis", type: "ThisExpression" }]
    },

    // in es3, "use strict" directives do not apply
    {
        code: "function foo() { 'use strict'; this.eval(); }",
        languageOptions: { ecmaVersion: 3 },
        valid: [NORMAL, USE_STRICT, IMPLIED_STRICT],
        invalid: []
    }
];

const ruleTester = new RuleTester({
    languageOptions: {
        ecmaVersion: 5,
        sourceType: "script"
    }
});

ruleTester.run("no-invalid-this", rule, {
    valid: extractPatterns(patterns, "valid"),
    invalid: extractPatterns(patterns, "invalid")
});
