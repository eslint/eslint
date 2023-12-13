/**
 * @fileoverview Tests for no-implicit-globals rule.
 * @author Joshua Peek
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-implicit-globals"),
    RuleTester = require("../../../lib/rule-tester/flat-rule-tester"),
    globals = require("globals");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
    languageOptions: {
        ecmaVersion: 5,
        sourceType: "script"
    }
});

const varMessage = "Unexpected 'var' declaration in the global scope, wrap in an IIFE for a local variable, assign as global property for a global variable.";
const functionMessage = "Unexpected function declaration in the global scope, wrap in an IIFE for a local variable, assign as global property for a global variable.";
const constMessage = "Unexpected 'const' declaration in the global scope, wrap in a block or in an IIFE.";
const letMessage = "Unexpected 'let' declaration in the global scope, wrap in a block or in an IIFE.";
const classMessage = "Unexpected class declaration in the global scope, wrap in a block or in an IIFE.";
const readonlyRedeclarationMessage = "Unexpected redeclaration of read-only global variable.";
const readonlyAssignmentMessage = "Unexpected assignment to read-only global variable.";
const leakMessage = "Global variable leak, declare the variable if it is intended to be local.";

ruleTester.run("no-implicit-globals", rule, {
    valid: [

        //------------------------------------------------------------------------------
        // General
        //------------------------------------------------------------------------------

        // Recommended way to create a global variable in the browser
        {
            code: "window.foo = 1;",
            languageOptions: { globals: globals.browser }
        },
        {
            code: "window.foo = function() {};",
            languageOptions: { globals: globals.browser }
        },
        {
            code: "window.foo = function foo() {};",
            languageOptions: { globals: globals.browser }
        },
        {
            code: "window.foo = function bar() {};",
            languageOptions: { globals: globals.browser }
        },
        {
            code: "window.foo = function*() {};",
            languageOptions: {
                ecmaVersion: 2015,
                globals: globals.browser
            }
        },
        {
            code: "window.foo = function *foo() {};",
            languageOptions: {
                ecmaVersion: 2015,
                globals: globals.browser
            }
        },
        {
            code: "window.foo = async function() {};",
            languageOptions: {
                ecmaVersion: 2017,
                globals: globals.browser
            }
        },
        {
            code: "window.foo = async function foo() {};",
            languageOptions: {
                ecmaVersion: 2017,
                globals: globals.browser
            }
        },
        {
            code: "window.foo = async function*() {};",
            languageOptions: {
                ecmaVersion: 2018,
                globals: globals.browser
            }
        },
        {
            code: "window.foo = async function *foo() {};",
            languageOptions: {
                ecmaVersion: 2018,
                globals: globals.browser
            }
        },
        {
            code: "window.foo = class {};",
            languageOptions: {
                ecmaVersion: 2015,
                globals: globals.browser
            }
        },
        {
            code: "window.foo = class foo {};",
            languageOptions: {
                ecmaVersion: 2015,
                globals: globals.browser
            }
        },
        {
            code: "window.foo = class bar {};",
            languageOptions: {
                ecmaVersion: 2015,
                globals: globals.browser
            }
        },
        {
            code: "self.foo = 1;",
            languageOptions: { globals: globals.browser }
        },
        {
            code: "self.foo = function() {};",
            languageOptions: { globals: globals.browser }
        },

        // Another way to create a global variable. Not the best practice, but that isn't the responsibility of this rule.
        "this.foo = 1;",
        "this.foo = function() {};",
        "this.foo = function bar() {};",

        // Test that the rule doesn't report global comments
        "/*global foo:readonly*/",
        "/*global foo:writable*/",
        "/*global Array:readonly*/",
        "/*global Array:writable*/",
        {
            code: "/*global foo:readonly*/",
            languageOptions: { globals: { foo: "readonly" } }
        },
        {
            code: "/*global foo:writable*/",
            languageOptions: { globals: { foo: "readonly" } }
        },
        {
            code: "/*global foo:readonly*/",
            languageOptions: { globals: { foo: "writable" } }
        },
        {
            code: "/*global foo:writable*/",
            languageOptions: { globals: { foo: "writable" } }
        },

        //------------------------------------------------------------------------------
        // `var` and function declarations
        //------------------------------------------------------------------------------

        // Doesn't report function expressions
        "typeof function() {}",
        "typeof function foo() {}",
        "(function() {}) + (function foo() {})",
        {
            code: "typeof function *foo() {}",
            languageOptions: { ecmaVersion: 2015 }
        },
        {
            code: "typeof async function foo() {}",
            languageOptions: { ecmaVersion: 2017 }
        },
        {
            code: "typeof async function *foo() {}",
            languageOptions: { ecmaVersion: 2018 }
        },

        // Recommended way to create local variables
        "(function() { var foo = 1; })();",
        "(function() { function foo() {} })();",
        {
            code: "(function() { function *foo() {} })();",
            languageOptions: { ecmaVersion: 2015 }
        },
        {
            code: "(function() { async function foo() {} })();",
            languageOptions: { ecmaVersion: 2017 }
        },
        {
            code: "(function() { async function *foo() {} })();",
            languageOptions: { ecmaVersion: 2018 }
        },
        {
            code: "window.foo = (function() { var bar; function foo () {}; return function bar() {} })();",
            languageOptions: { globals: globals.browser }
        },

        // Different scoping
        {
            code: "var foo = 1;",
            languageOptions: { ecmaVersion: 2015, sourceType: "module" }
        },
        {
            code: "function foo() {}",
            languageOptions: { ecmaVersion: 2015, sourceType: "module" }
        },
        {
            code: "function *foo() {}",
            languageOptions: { ecmaVersion: 2015, sourceType: "module" }
        },
        {
            code: "var foo = 1;",
            languageOptions: { parserOptions: { ecmaFeatures: { globalReturn: true } } }
        },
        {
            code: "function foo() {}",
            languageOptions: { parserOptions: { ecmaFeatures: { globalReturn: true } } }
        },
        {
            code: "var foo = 1;",
            languageOptions: { sourceType: "commonjs" }
        },
        {
            code: "function foo() {}",
            languageOptions: { sourceType: "commonjs" }
        },

        //------------------------------------------------------------------------------
        // `const`, `let` and class declarations
        //------------------------------------------------------------------------------

        // Test default option
        {
            code: "const foo = 1; let bar; class Baz {}",
            languageOptions: { ecmaVersion: 2015 }
        },
        {
            code: "const foo = 1; let bar; class Baz {}",
            options: [{ lexicalBindings: false }],
            languageOptions: { ecmaVersion: 2015 }
        },

        // If the option is not set to true, even the redeclarations of read-only global variables are allowed.
        {
            code: "const Array = 1; let Object; class Math {}",
            languageOptions: { ecmaVersion: 2015 }
        },
        {
            code: "/*global foo:readonly, bar:readonly, Baz:readonly*/ const foo = 1; let bar; class Baz {}",
            languageOptions: { ecmaVersion: 2015 }
        },

        // Doesn't report class expressions
        {
            code: "typeof class {}",
            options: [{ lexicalBindings: true }],
            languageOptions: { ecmaVersion: 2015 }
        },
        {
            code: "typeof class foo {}",
            options: [{ lexicalBindings: true }],
            languageOptions: { ecmaVersion: 2015 }
        },

        // Recommended ways to create local variables
        {
            code: "{ const foo = 1; let bar; class Baz {} }",
            options: [{ lexicalBindings: true }],
            languageOptions: { ecmaVersion: 2015 }
        },
        {
            code: "(function() { const foo = 1; let bar; class Baz {} })();",
            options: [{ lexicalBindings: true }],
            languageOptions: { ecmaVersion: 2015 }
        },
        {
            code: "window.foo = (function() { const bar = 1; let baz; class Quux {} return function () {} })();",
            options: [{ lexicalBindings: true }],
            languageOptions: { ecmaVersion: 2015 }
        },

        // different scoping
        {
            code: "const foo = 1; let bar; class Baz {}",
            languageOptions: { ecmaVersion: 2015, sourceType: "module" }
        },
        {
            code: "const foo = 1; let bar; class Baz {}",
            languageOptions: {
                ecmaVersion: 2015,
                sourceType: "commonjs"
            }
        },
        {
            code: "const foo = 1; let bar; class Baz {}",
            languageOptions: { ecmaVersion: 2015, parserOptions: { ecmaFeatures: { globalReturn: true } } }
        },

        // Regression tests
        {
            code: "const foo = 1;",
            languageOptions: { ecmaVersion: 2015 }
        },
        {
            code: "let foo = 1;",
            languageOptions: { ecmaVersion: 2015 }
        },
        {
            code: "let foo = function() {};",
            languageOptions: { ecmaVersion: 2015 }
        },
        {
            code: "const foo = function() {};",
            languageOptions: { ecmaVersion: 2015 }
        },
        {
            code: "class Foo {}",
            languageOptions: { ecmaVersion: 2015 }
        },
        {
            code: "(function() { let foo = 1; })();",
            languageOptions: { ecmaVersion: 2015 }
        },
        {
            code: "(function() { const foo = 1; })();",
            languageOptions: { ecmaVersion: 2015 }
        },
        {
            code: "let foo = 1;",
            languageOptions: { ecmaVersion: 2015, sourceType: "module" }
        },
        {
            code: "const foo = 1;",
            languageOptions: { ecmaVersion: 2015, sourceType: "module" }
        },
        {
            code: "let foo = 1;",
            languageOptions: { ecmaVersion: 2015, parserOptions: { ecmaFeatures: { globalReturn: true } } }
        },
        {
            code: "const foo = 1;",
            languageOptions: { ecmaVersion: 2015, parserOptions: { ecmaFeatures: { globalReturn: true } } }
        },

        //------------------------------------------------------------------------------
        // leaks
        //------------------------------------------------------------------------------

        // This rule doesn't report all undeclared variables, just leaks (assignments to an undeclared variable)
        "foo",
        "foo + bar",
        "foo(bar)",

        // Leaks are not possible in strict mode (explicit or implicit). Therefore, rule doesn't report assignments in strict mode.
        "'use strict';foo = 1;",
        "(function() {'use strict'; foo = 1; })();",
        {
            code: "{ class Foo { constructor() { bar = 1; } baz() { bar = 1; } } }",
            languageOptions: { ecmaVersion: 2015 }
        },
        {
            code: "foo = 1;",
            languageOptions: { ecmaVersion: 2015, sourceType: "module" }
        },

        // This rule doesn't check the existence of the objects in property assignments. These are reference errors, not leaks. Note that the env is not set.
        "Foo.bar = 1;",
        "Utils.foo = 1;",
        "Utils.foo = function() {};",
        "window.foo = 1;",
        "window.foo = function() {};",
        "window.foo = function foo() {};",
        "self.foo = 1;",
        "self.foo = function() {};",

        // These are also just reference errors, thus not reported as leaks
        "++foo",
        "foo--",

        // Not a leak
        {
            code: "foo = 1;",
            languageOptions: { globals: { foo: "writable" } }
        },
        {
            code: "window.foo = function bar() { bar = 1; };",
            languageOptions: { globals: globals.browser }
        },
        {
            code: "window.foo = function bar(baz) { baz = 1; };",
            languageOptions: { globals: globals.browser }
        },
        {
            code: "window.foo = function bar() { var baz; function quux() { quux = 1; } };",
            languageOptions: { globals: globals.browser }
        },

        //------------------------------------------------------------------------------
        // globals
        //------------------------------------------------------------------------------

        // Redeclarations of writable global variables are allowed
        "/*global foo:writable*/ var foo = 1;",
        {
            code: "function foo() {}",
            languageOptions: { globals: { foo: "writable" } }
        },
        {
            code: "/*global foo:writable*/ function *foo() {}",
            languageOptions: { ecmaVersion: 2015 }
        },
        {
            code: "/*global foo:writable*/ const foo = 1;",
            options: [{ lexicalBindings: true }],
            languageOptions: { ecmaVersion: 2015 }
        },
        {
            code: "/*global foo:writable*/ let foo;",
            options: [{ lexicalBindings: true }],
            languageOptions: { ecmaVersion: 2015 }
        },
        {
            code: "/*global Foo:writable*/ class Foo {}",
            options: [{ lexicalBindings: true }],
            languageOptions: { ecmaVersion: 2015 }
        },

        // Assignments to writable global variables are allowed
        "/*global foo:writable*/ foo = 1;",
        {
            code: "foo = 1",
            languageOptions: { globals: { foo: "writable" } }
        },


        // This rule doesn't disallow assignments to properties of readonly globals
        "Array.from = 1;",
        "Object['assign'] = 1;",
        "/*global foo:readonly*/ foo.bar = 1;",


        //------------------------------------------------------------------------------
        // exported
        //------------------------------------------------------------------------------

        // `var` and functions
        "/* exported foo */ var foo = 'foo';",
        "/* exported foo */ function foo() {}",
        {
            code: "/* exported foo */ function *foo() {}",
            languageOptions: { ecmaVersion: 2015 }
        },
        {
            code: "/* exported foo */ async function foo() {}",
            languageOptions: { ecmaVersion: 2017 }
        },
        {
            code: "/* exported foo */ async function *foo() {}",
            languageOptions: { ecmaVersion: 2018 }
        },
        "/* exported foo */ var foo = function() {};",
        "/* exported foo */ var foo = function foo() {};",
        {
            code: "/* exported foo */ var foo = function*() {};",
            languageOptions: { ecmaVersion: 2015 }
        },
        {
            code: "/* exported foo */ var foo = function *foo() {};",
            languageOptions: { ecmaVersion: 2015 }
        },
        "/* exported foo, bar */ var foo = 1, bar = 2;",


        // `const`, `let` and `class`
        {
            code: "/* exported a */ const a = 1;",
            options: [{ lexicalBindings: true }],
            languageOptions: { ecmaVersion: 2015 }
        },
        {
            code: "/* exported a */ let a;",
            options: [{ lexicalBindings: true }],
            languageOptions: { ecmaVersion: 2015 }
        },
        {
            code: "/* exported a */ let a = 1;",
            options: [{ lexicalBindings: true }],
            languageOptions: { ecmaVersion: 2015 }
        },
        {
            code: "/* exported A */ class A {}",
            options: [{ lexicalBindings: true }],
            languageOptions: { ecmaVersion: 2015 }
        },
        {
            code: "/* exported a, b */ const a = 1; const b = 2;",
            options: [{ lexicalBindings: true }],
            languageOptions: { ecmaVersion: 2015 }
        },
        {
            code: "/* exported a, b */ const a = 1, b = 2;",
            options: [{ lexicalBindings: true }],
            languageOptions: { ecmaVersion: 2015 }
        },
        {
            code: "/* exported a, b */ let a, b = 1;",
            options: [{ lexicalBindings: true }],
            languageOptions: { ecmaVersion: 2015 }
        },
        {
            code: "/* exported a, b, C */ const a = 1; let b; class C {}",
            options: [{ lexicalBindings: true }],
            languageOptions: { ecmaVersion: 2015 }
        },
        {
            code: "/* exported a, b, c */ const [a, b, ...c] = [];",
            options: [{ lexicalBindings: true }],
            languageOptions: { ecmaVersion: 2015 }
        },
        {
            code: "/* exported a, b, c */ let { a, foo: b, bar: { c } } = {};",
            options: [{ lexicalBindings: true }],
            languageOptions: { ecmaVersion: 2015 }
        }
    ],

    invalid: [

        //------------------------------------------------------------------------------
        // `var` and function declarations
        //------------------------------------------------------------------------------

        {
            code: "var foo = 1;",
            errors: [
                {
                    message: varMessage,
                    type: "VariableDeclarator"
                }
            ]
        },
        {
            code: "function foo() {}",
            errors: [
                {
                    message: functionMessage,
                    type: "FunctionDeclaration"
                }
            ]
        },
        {
            code: "function *foo() {}",
            languageOptions: { ecmaVersion: 2015 },
            errors: [
                {
                    message: functionMessage,
                    type: "FunctionDeclaration"
                }
            ]
        },
        {
            code: "async function foo() {}",
            languageOptions: { ecmaVersion: 2017 },
            errors: [
                {
                    message: functionMessage,
                    type: "FunctionDeclaration"
                }
            ]
        },
        {
            code: "async function *foo() {}",
            languageOptions: { ecmaVersion: 2018 },
            errors: [
                {
                    message: functionMessage,
                    type: "FunctionDeclaration"
                }
            ]
        },
        {
            code: "var foo = function() {};",
            errors: [
                {
                    message: varMessage,
                    type: "VariableDeclarator"
                }
            ]
        },
        {
            code: "var foo = function foo() {};",
            errors: [
                {
                    message: varMessage,
                    type: "VariableDeclarator"
                }
            ]
        },
        {
            code: "var foo = function*() {};",
            languageOptions: { ecmaVersion: 2015 },
            errors: [
                {
                    message: varMessage,
                    type: "VariableDeclarator"
                }
            ]
        },
        {
            code: "var foo = function *foo() {};",
            languageOptions: { ecmaVersion: 2015 },
            errors: [
                {
                    message: varMessage,
                    type: "VariableDeclarator"
                }
            ]
        },
        {
            code: "var foo = 1, bar = 2;",
            errors: [
                {
                    message: varMessage,
                    type: "VariableDeclarator"
                },
                {
                    message: varMessage,
                    type: "VariableDeclarator"
                }
            ]
        },


        //------------------------------------------------------------------------------
        // `const`, `let` and class declarations
        //------------------------------------------------------------------------------

        // Basic tests
        {
            code: "const a = 1;",
            options: [{ lexicalBindings: true }],
            languageOptions: { ecmaVersion: 2015 },
            errors: [{
                message: constMessage
            }]
        },
        {
            code: "let a;",
            options: [{ lexicalBindings: true }],
            languageOptions: { ecmaVersion: 2015 },
            errors: [{
                message: letMessage
            }]
        },
        {
            code: "let a = 1;",
            options: [{ lexicalBindings: true }],
            languageOptions: { ecmaVersion: 2015 },
            errors: [{
                message: letMessage
            }]
        },
        {
            code: "class A {}",
            options: [{ lexicalBindings: true }],
            languageOptions: { ecmaVersion: 2015 },
            errors: [{
                message: classMessage
            }]
        },

        // Multiple and mixed tests
        {
            code: "const a = 1; const b = 2;",
            options: [{ lexicalBindings: true }],
            languageOptions: { ecmaVersion: 2015 },
            errors: [
                { message: constMessage },
                { message: constMessage }
            ]
        },
        {
            code: "const a = 1, b = 2;",
            options: [{ lexicalBindings: true }],
            languageOptions: { ecmaVersion: 2015 },
            errors: [
                { message: constMessage },
                { message: constMessage }
            ]
        },
        {
            code: "let a, b = 1;",
            options: [{ lexicalBindings: true }],
            languageOptions: { ecmaVersion: 2015 },
            errors: [
                { message: letMessage },
                { message: letMessage }
            ]
        },
        {
            code: "const a = 1; let b; class C {}",
            options: [{ lexicalBindings: true }],
            languageOptions: { ecmaVersion: 2015 },
            errors: [
                { message: constMessage },
                { message: letMessage },
                { message: classMessage }
            ]
        },
        {
            code: "const [a, b, ...c] = [];",
            options: [{ lexicalBindings: true }],
            languageOptions: { ecmaVersion: 2015 },
            errors: [
                { message: constMessage },
                { message: constMessage },
                { message: constMessage }
            ]
        },
        {
            code: "let { a, foo: b, bar: { c } } = {};",
            options: [{ lexicalBindings: true }],
            languageOptions: { ecmaVersion: 2015 },
            errors: [
                { message: letMessage },
                { message: letMessage },
                { message: letMessage }
            ]
        },

        //------------------------------------------------------------------------------
        // leaks
        //------------------------------------------------------------------------------

        // Basic tests
        {
            code: "foo = 1",
            errors: [
                {
                    message: leakMessage,
                    type: "AssignmentExpression"
                }
            ]
        },
        {
            code: "foo = function() {};",
            errors: [
                {
                    message: leakMessage,
                    type: "AssignmentExpression"
                }
            ]
        },
        {
            code: "foo = function*() {};",
            languageOptions: { ecmaVersion: 2015 },
            errors: [
                {
                    message: leakMessage,
                    type: "AssignmentExpression"
                }
            ]
        },
        {
            code: "window.foo = function() { bar = 1; }",
            errors: [
                {
                    message: leakMessage,
                    type: "AssignmentExpression"
                }
            ]
        },
        {
            code: "(function() {}(foo = 1));",
            errors: [
                {
                    message: leakMessage,
                    type: "AssignmentExpression"
                }
            ]
        },
        {
            code: "for (foo in {});",
            errors: [
                {
                    message: leakMessage,
                    type: "ForInStatement"
                }
            ]
        },
        {
            code: "for (foo of []);",
            languageOptions: { ecmaVersion: 2015 },
            errors: [
                {
                    message: leakMessage,
                    type: "ForOfStatement"
                }
            ]
        },

        // Not implicit strict
        {
            code: "window.foo = { bar() { foo = 1 } }",
            languageOptions: { ecmaVersion: 2015 },
            errors: [
                {
                    message: leakMessage,
                    type: "AssignmentExpression"
                }
            ]
        },
        {
            code: "foo = 1",
            languageOptions: { sourceType: "commonjs" },
            errors: [
                {
                    message: leakMessage,
                    type: "AssignmentExpression"
                }
            ]
        },
        {
            code: "foo = 1;",
            languageOptions: { parserOptions: { ecmaFeatures: { globalReturn: true } } },
            errors: [
                {
                    message: leakMessage,
                    type: "AssignmentExpression"
                }
            ]
        },

        // Multiple and mixed
        {
            code: "foo = 1, bar = 2;",
            errors: [
                {
                    message: leakMessage,
                    type: "AssignmentExpression"
                },
                {
                    message: leakMessage,
                    type: "AssignmentExpression"
                }
            ]
        },
        {
            code: "foo = bar = 1",
            errors: [
                {
                    message: leakMessage,
                    type: "AssignmentExpression"
                },
                {
                    message: leakMessage,
                    type: "AssignmentExpression"
                }
            ]
        },
        {
            code: "/*global foo:writable*/ foo = bar = 1",
            errors: [
                {
                    message: leakMessage,
                    type: "AssignmentExpression"
                }
            ]
        },
        {
            code: "/*global bar:writable*/ foo = bar = 1",
            errors: [
                {
                    message: leakMessage,
                    type: "AssignmentExpression"
                }
            ]
        },
        {
            code: "foo = 1; var bar;",
            errors: [
                {
                    message: leakMessage,
                    type: "AssignmentExpression"
                },
                {
                    message: varMessage,
                    type: "VariableDeclarator"
                }
            ]
        },
        {
            code: "var foo = bar = 1;",
            errors: [
                {
                    message: varMessage,
                    type: "VariableDeclarator"
                },
                {
                    message: leakMessage,
                    type: "AssignmentExpression"
                }
            ]
        },
        {
            code: "/*global foo:writable*/ var foo = bar = 1;",
            errors: [
                {
                    message: leakMessage,
                    type: "AssignmentExpression"
                }
            ]
        },
        {
            code: "/*global bar:writable*/ var foo = bar = 1;",
            errors: [
                {
                    message: varMessage,
                    type: "VariableDeclarator"
                }
            ]
        },
        {
            code: "[foo, bar] = [];",
            languageOptions: { ecmaVersion: 2015 },
            errors: [
                {
                    message: leakMessage,
                    type: "AssignmentExpression"
                },
                {
                    message: leakMessage,
                    type: "AssignmentExpression"
                }
            ]
        },
        {
            code: "/*global foo:writable*/ [foo, bar] = [];",
            languageOptions: { ecmaVersion: 2015 },
            errors: [
                {
                    message: leakMessage,
                    type: "AssignmentExpression"
                }
            ]
        },
        {
            code: "/*global bar:writable*/ [foo, bar] = [];",
            languageOptions: { ecmaVersion: 2015 },
            errors: [
                {
                    message: leakMessage,
                    type: "AssignmentExpression"
                }
            ]
        },

        //------------------------------------------------------------------------------
        // globals
        //------------------------------------------------------------------------------

        // Basic assignment tests
        {
            code: "Array = 1",
            errors: [
                {
                    message: readonlyAssignmentMessage,
                    type: "AssignmentExpression"
                }
            ]
        },
        {
            code: "window = 1;",
            languageOptions: { globals: globals.browser },
            errors: [
                {
                    message: readonlyAssignmentMessage,
                    type: "AssignmentExpression"
                }
            ]
        },
        {
            code: "/*global foo:readonly*/ foo = 1",
            errors: [
                {
                    message: readonlyAssignmentMessage,
                    type: "AssignmentExpression"
                }
            ]
        },
        {
            code: "foo = 1;",
            languageOptions: { globals: { foo: "readonly" } },
            errors: [
                {
                    message: readonlyAssignmentMessage,
                    type: "AssignmentExpression"
                }
            ]
        },
        {
            code: "/*global foo:readonly*/ for (foo in {});",
            errors: [
                {
                    message: readonlyAssignmentMessage,
                    type: "ForInStatement"
                }
            ]
        },
        {
            code: "/*global foo:readonly*/ for (foo of []);",
            languageOptions: { ecmaVersion: 2015 },
            errors: [
                {
                    message: readonlyAssignmentMessage,
                    type: "ForOfStatement"
                }
            ]
        },

        // Basic redeclaration tests
        {
            code: "var Array = 1",
            errors: [
                {
                    message: readonlyRedeclarationMessage,
                    type: "VariableDeclarator"
                }
            ]
        },
        {
            code: "/*global foo:readonly*/ var foo",
            errors: [
                {
                    message: readonlyRedeclarationMessage,
                    type: "VariableDeclarator"
                }
            ]
        },
        {
            code: "/*global foo:readonly*/ var foo = 1",
            errors: [
                {
                    message: readonlyRedeclarationMessage,
                    type: "VariableDeclarator"
                }
            ]
        },
        {
            code: "/*global foo:readonly*/ function foo() {}",
            errors: [
                {
                    message: readonlyRedeclarationMessage,
                    type: "FunctionDeclaration"
                }
            ]
        },
        {
            code: "/*global foo:readonly*/ const foo = 1",
            options: [{ lexicalBindings: true }],
            languageOptions: { ecmaVersion: 2015 },
            errors: [
                {
                    message: readonlyRedeclarationMessage,
                    type: "VariableDeclarator"
                }
            ]
        },
        {
            code: "/*global foo:readonly*/ let foo",
            options: [{ lexicalBindings: true }],
            languageOptions: { ecmaVersion: 2015 },
            errors: [
                {
                    message: readonlyRedeclarationMessage,
                    type: "VariableDeclarator"
                }
            ]
        },
        {
            code: "/*global foo:readonly*/ let foo = 1",
            options: [{ lexicalBindings: true }],
            languageOptions: { ecmaVersion: 2015 },
            errors: [
                {
                    message: readonlyRedeclarationMessage,
                    type: "VariableDeclarator"
                }
            ]
        },
        {
            code: "/*global Foo:readonly*/ class Foo {}",
            options: [{ lexicalBindings: true }],
            languageOptions: { ecmaVersion: 2015 },
            errors: [
                {
                    message: readonlyRedeclarationMessage,
                    type: "ClassDeclaration"
                }
            ]
        },

        // Multiple and mixed assignments
        {
            code: "/*global foo:readonly, bar: readonly*/ foo = bar = 1",
            errors: [
                {
                    message: readonlyAssignmentMessage,
                    type: "AssignmentExpression"
                },
                {
                    message: readonlyAssignmentMessage,
                    type: "AssignmentExpression"
                }
            ]
        },
        {
            code: "/*global foo:writable, bar: readonly*/ foo = bar = 1",
            errors: [
                {
                    message: readonlyAssignmentMessage,
                    type: "AssignmentExpression"
                }
            ]
        },
        {
            code: "/*global foo:readonly, bar: writable*/ foo = bar = 1",
            errors: [
                {
                    message: readonlyAssignmentMessage,
                    type: "AssignmentExpression"
                }
            ]
        },
        {
            code: "/*global foo: readonly*/ foo = bar = 1",
            errors: [
                {
                    message: readonlyAssignmentMessage,
                    type: "AssignmentExpression"
                },
                {
                    message: leakMessage,
                    type: "AssignmentExpression"
                }
            ]
        },
        {
            code: "/*global bar: readonly*/ foo = bar = 1",
            errors: [
                {
                    message: leakMessage,
                    type: "AssignmentExpression"
                },
                {
                    message: readonlyAssignmentMessage,
                    type: "AssignmentExpression"
                }
            ]
        },

        // Multiple and mixed redeclarations
        {
            code: "/*global foo:readonly, bar: readonly*/ var foo, bar;",
            errors: [
                {
                    message: readonlyRedeclarationMessage,
                    type: "VariableDeclarator"
                },
                {
                    message: readonlyRedeclarationMessage,
                    type: "VariableDeclarator"
                }
            ]
        },
        {
            code: "/*global foo:writable, bar: readonly*/ var foo, bar;",
            errors: [
                {
                    message: readonlyRedeclarationMessage,
                    type: "VariableDeclarator"
                }
            ]
        },
        {
            code: "/*global foo:readonly, bar: writable*/ var foo, bar;",
            errors: [
                {
                    message: readonlyRedeclarationMessage,
                    type: "VariableDeclarator"
                }
            ]
        },
        {
            code: "/*global foo:readonly*/ var foo, bar;",
            errors: [
                {
                    message: readonlyRedeclarationMessage,
                    type: "VariableDeclarator"
                },
                {
                    message: varMessage,
                    type: "VariableDeclarator"
                }
            ]
        },
        {
            code: "/*global bar: readonly*/ var foo, bar;",
            errors: [
                {
                    message: varMessage,
                    type: "VariableDeclarator"
                },
                {
                    message: readonlyRedeclarationMessage,
                    type: "VariableDeclarator"
                }
            ]
        },
        {
            code: "/*global foo:readonly, bar: readonly*/ const foo = 1, bar = 2;",
            options: [{ lexicalBindings: true }],
            languageOptions: { ecmaVersion: 2015 },
            errors: [
                {
                    message: readonlyRedeclarationMessage,
                    type: "VariableDeclarator"
                },
                {
                    message: readonlyRedeclarationMessage,
                    type: "VariableDeclarator"
                }
            ]
        },
        {
            code: "/*global foo:writable, bar: readonly*/ const foo = 1, bar = 2;",
            options: [{ lexicalBindings: true }],
            languageOptions: { ecmaVersion: 2015 },
            errors: [
                {
                    message: readonlyRedeclarationMessage,
                    type: "VariableDeclarator"
                }
            ]
        },
        {
            code: "/*global foo:readonly, bar: writable*/ const foo = 1, bar = 2;",
            options: [{ lexicalBindings: true }],
            languageOptions: { ecmaVersion: 2015 },
            errors: [
                {
                    message: readonlyRedeclarationMessage,
                    type: "VariableDeclarator"
                }
            ]
        },
        {
            code: "/*global foo:readonly*/ const foo = 1, bar = 2;",
            options: [{ lexicalBindings: true }],
            languageOptions: { ecmaVersion: 2015 },
            errors: [
                {
                    message: readonlyRedeclarationMessage,
                    type: "VariableDeclarator"
                },
                {
                    message: constMessage,
                    type: "VariableDeclarator"
                }
            ]
        },
        {
            code: "/*global bar: readonly*/ const foo = 1, bar = 2;",
            options: [{ lexicalBindings: true }],
            languageOptions: { ecmaVersion: 2015 },
            errors: [
                {
                    message: constMessage,
                    type: "VariableDeclarator"
                },
                {
                    message: readonlyRedeclarationMessage,
                    type: "VariableDeclarator"
                }
            ]
        },
        {
            code: "/*global foo:readonly, bar: readonly*/ let foo, bar;",
            options: [{ lexicalBindings: true }],
            languageOptions: { ecmaVersion: 2015 },
            errors: [
                {
                    message: readonlyRedeclarationMessage,
                    type: "VariableDeclarator"
                },
                {
                    message: readonlyRedeclarationMessage,
                    type: "VariableDeclarator"
                }
            ]
        },
        {
            code: "/*global foo:writable, bar: readonly*/ let foo, bar;",
            options: [{ lexicalBindings: true }],
            languageOptions: { ecmaVersion: 2015 },
            errors: [
                {
                    message: readonlyRedeclarationMessage,
                    type: "VariableDeclarator"
                }
            ]
        },
        {
            code: "/*global foo:readonly, bar: writable*/ let foo, bar;",
            options: [{ lexicalBindings: true }],
            languageOptions: { ecmaVersion: 2015 },
            errors: [
                {
                    message: readonlyRedeclarationMessage,
                    type: "VariableDeclarator"
                }
            ]
        },
        {
            code: "/*global foo:readonly*/ let foo, bar;",
            options: [{ lexicalBindings: true }],
            languageOptions: { ecmaVersion: 2015 },
            errors: [
                {
                    message: readonlyRedeclarationMessage,
                    type: "VariableDeclarator"
                },
                {
                    message: letMessage,
                    type: "VariableDeclarator"
                }
            ]
        },
        {
            code: "/*global bar: readonly*/ let foo, bar;",
            options: [{ lexicalBindings: true }],
            languageOptions: { ecmaVersion: 2015 },
            errors: [
                {
                    message: letMessage,
                    type: "VariableDeclarator"
                },
                {
                    message: readonlyRedeclarationMessage,
                    type: "VariableDeclarator"
                }
            ]
        },

        //------------------------------------------------------------------------------
        // exported
        //------------------------------------------------------------------------------

        // `var` and `function`
        {
            code: "/* exported bar */ var foo = 'text';",
            errors: [
                {
                    message: varMessage,
                    type: "VariableDeclarator"
                }
            ]
        },
        {
            code: "/* exported bar */ function foo() {}",
            errors: [
                {
                    message: functionMessage,
                    type: "FunctionDeclaration"
                }
            ]
        },
        {
            code: "/* exported bar */ function *foo() {}",
            languageOptions: { ecmaVersion: 2015 },
            errors: [
                {
                    message: functionMessage,
                    type: "FunctionDeclaration"
                }
            ]
        },
        {
            code: "/* exported bar */ async function foo() {}",
            languageOptions: { ecmaVersion: 2017 },
            errors: [
                {
                    message: functionMessage,
                    type: "FunctionDeclaration"
                }
            ]
        },
        {
            code: "/* exported bar */ async function *foo() {}",
            languageOptions: { ecmaVersion: 2018 },
            errors: [
                {
                    message: functionMessage,
                    type: "FunctionDeclaration"
                }
            ]
        },
        {
            code: "/* exported bar */ var foo = function() {};",
            errors: [
                {
                    message: varMessage,
                    type: "VariableDeclarator"
                }
            ]
        },
        {
            code: "/* exported bar */ var foo = function foo() {};",
            errors: [
                {
                    message: varMessage,
                    type: "VariableDeclarator"
                }
            ]
        },
        {
            code: "/* exported bar */ var foo = function*() {};",
            languageOptions: { ecmaVersion: 2015 },
            errors: [
                {
                    message: varMessage,
                    type: "VariableDeclarator"
                }
            ]
        },
        {
            code: "/* exported bar */ var foo = function *foo() {};",
            languageOptions: { ecmaVersion: 2015 },
            errors: [
                {
                    message: varMessage,
                    type: "VariableDeclarator"
                }
            ]
        },
        {
            code: "/* exported bar */ var foo = 1, bar = 2;",
            errors: [
                {
                    message: varMessage,
                    type: "VariableDeclarator"
                }
            ]
        },

        // `let`, `const` and `class`
        {
            code: "/* exported b */ const a = 1;",
            options: [{ lexicalBindings: true }],
            languageOptions: { ecmaVersion: 2015 },
            errors: [
                {
                    message: constMessage,
                    type: "VariableDeclarator"
                }
            ]
        },
        {
            code: "/* exported b */ let a;",
            options: [{ lexicalBindings: true }],
            languageOptions: { ecmaVersion: 2015 },
            errors: [
                {
                    message: letMessage,
                    type: "VariableDeclarator"
                }
            ]
        },
        {
            code: "/* exported b */ let a = 1;",
            options: [{ lexicalBindings: true }],
            languageOptions: { ecmaVersion: 2015 },
            errors: [
                {
                    message: letMessage,
                    type: "VariableDeclarator"
                }
            ]
        },
        {
            code: "/* exported B */ class A {}",
            options: [{ lexicalBindings: true }],
            languageOptions: { ecmaVersion: 2015 },
            errors: [
                {
                    message: classMessage,
                    type: "ClassDeclaration"
                }
            ]
        },
        {
            code: "/* exported a */ const a = 1; const b = 2;",
            options: [{ lexicalBindings: true }],
            languageOptions: { ecmaVersion: 2015 },
            errors: [
                {
                    message: constMessage,
                    type: "VariableDeclarator"
                }
            ]
        },
        {
            code: "/* exported a */ const a = 1, b = 2;",
            options: [{ lexicalBindings: true }],
            languageOptions: { ecmaVersion: 2015 },
            errors: [
                {
                    message: constMessage,
                    type: "VariableDeclarator"
                }
            ]
        },
        {
            code: "/* exported a */ let a, b = 1;",
            options: [{ lexicalBindings: true }],
            languageOptions: { ecmaVersion: 2015 },
            errors: [
                {
                    message: letMessage,
                    type: "VariableDeclarator"
                }
            ]
        },
        {
            code: "/* exported a */ const a = 1; let b; class C {}",
            options: [{ lexicalBindings: true }],
            languageOptions: { ecmaVersion: 2015 },
            errors: [
                {
                    message: letMessage,
                    type: "VariableDeclarator"
                },
                {
                    message: classMessage,
                    type: "ClassDeclaration"
                }
            ]
        },
        {
            code: "/* exported a */ const [a, b, ...c] = [];",
            options: [{ lexicalBindings: true }],
            languageOptions: { ecmaVersion: 2015 },
            errors: [
                {
                    message: constMessage,
                    type: "VariableDeclarator"
                },
                {
                    message: constMessage,
                    type: "VariableDeclarator"
                }
            ]
        },
        {
            code: "/* exported a */ let { a, foo: b, bar: { c } } = {};",
            options: [{ lexicalBindings: true }],
            languageOptions: { ecmaVersion: 2015 },
            errors: [
                {
                    message: letMessage,
                    type: "VariableDeclarator"
                },
                {
                    message: letMessage,
                    type: "VariableDeclarator"
                }
            ]
        },

        // Global variable leaks
        {
            code: "/* exported foo */ foo = 1",
            errors: [
                {
                    message: leakMessage,
                    type: "AssignmentExpression"
                }
            ]
        },
        {
            code: "/* exported foo */ foo = function() {};",
            errors: [
                {
                    message: leakMessage,
                    type: "AssignmentExpression"
                }
            ]
        },
        {
            code: "/* exported foo */ foo = function*() {};",
            languageOptions: { ecmaVersion: 2015 },
            errors: [
                {
                    message: leakMessage,
                    type: "AssignmentExpression"
                }
            ]
        },
        {
            code: "/* exported foo */ window.foo = function() { bar = 1; }",
            errors: [
                {
                    message: leakMessage,
                    type: "AssignmentExpression"
                }
            ]
        },
        {
            code: "/* exported foo */ (function() {}(foo = 1));",
            errors: [
                {
                    message: leakMessage,
                    type: "AssignmentExpression"
                }
            ]
        },
        {
            code: "/* exported foo */ for (foo in {});",
            errors: [
                {
                    message: leakMessage,
                    type: "ForInStatement"
                }
            ]
        },
        {
            code: "/* exported foo */ for (foo of []);",
            languageOptions: { ecmaVersion: 2015 },
            errors: [
                {
                    message: leakMessage,
                    type: "ForOfStatement"
                }
            ]
        }
    ]
});
