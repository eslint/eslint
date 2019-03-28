/**
 * @fileoverview Validates JSDoc comments are syntactically correct
 * @author Nicholas C. Zakas
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/valid-jsdoc"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("valid-jsdoc", rule, {

    valid: [
        "/**\n* Description\n * @param {Object[]} screenings Array of screenings.\n * @param {Number} screenings[].timestamp its a time stamp \n @return {void} */\nfunction foo(){}",
        "/**\n* Description\n */\nvar x = new Foo(function foo(){})",
        "/**\n* Description\n* @returns {void} */\nfunction foo(){}",
        "/**\n* Description\n* @returns {undefined} */\nfunction foo(){}",
        "/**\n* Description\n* @alias Test#test\n* @returns {void} */\nfunction foo(){}",
        "/**\n* Description\n*@extends MyClass\n* @returns {void} */\nfunction foo(){}",
        "/**\n* Description\n* @constructor */\nfunction Foo(){}",
        "/**\n* Description\n* @class */\nfunction Foo(){}",
        "/**\n* Description\n* @param {string} p bar\n* @returns {string} desc */\nfunction foo(p){}",
        "/**\n* Description\n* @arg {string} p bar\n* @returns {string} desc */\nfunction foo(p){}",
        "/**\n* Description\n* @argument {string} p bar\n* @returns {string} desc */\nfunction foo(p){}",
        "/**\n* Description\n* @param {string} [p] bar\n* @returns {string} desc */\nfunction foo(p){}",
        "/**\n* Description\n* @param {Object} p bar\n* @param {string} p.name bar\n* @returns {string} desc */\nFoo.bar = function(p){};",
        "(function(){\n/**\n* Description\n* @param {string} p bar\n* @returns {string} desc */\nfunction foo(p){}\n}())",
        "var o = {\n/**\n* Description\n* @param {string} p bar\n* @returns {string} desc */\nfoo: function(p){}\n};",
        "/**\n* Description\n* @param {Object} p bar\n* @param {string[]} p.files qux\n* @param {Function} cb baz\n* @returns {void} */\nfunction foo(p, cb){}",
        "/**\n* Description\n* @override */\nfunction foo(arg1, arg2){ return ''; }",
        "/**\n* Description\n* @inheritdoc */\nfunction foo(arg1, arg2){ return ''; }",
        "/**\n* Description\n* @inheritDoc */\nfunction foo(arg1, arg2){ return ''; }",
        "/**\n* Description\n* @Returns {void} */\nfunction foo(){}",
        {
            code:
                "call(\n" +
                "  /**\n" +
                "   * Doc for a function expression in a call expression.\n" +
                "   * @param {string} argName This is the param description.\n" +
                "   * @return {string} This is the return description.\n" +
                "   */\n" +
                "  function(argName) {\n" +
                "    return 'the return';\n" +
                "  }\n" +
                ");\n",
            options: [{ requireReturn: false }]
        },
        {
            code:
                "/**\n" +
                "* Create a new thing.\n" +
                "*/\n" +
                "var thing = new Thing({\n" +
                "  foo: function() {\n" +
                "    return 'bar';\n" +
                "  }\n" +
                "});\n",
            options: [{ requireReturn: false }]
        },
        {
            code:
                "/**\n" +
                "* Create a new thing.\n" +
                "*/\n" +
                "var thing = new Thing({\n" +
                "  /**\n" +
                "   * @return {string} A string.\n" +
                "   */\n" +
                "  foo: function() {\n" +
                "    return 'bar';\n" +
                "  }\n" +
                "});\n",
            options: [{ requireReturn: false }]
        },
        {
            code: "/**\n* Description\n* @return {void} */\nfunction foo(){}",
            options: [{}]
        },
        {
            code: "/**\n* Description\n* @param {string} p bar\n*/\nFoo.bar = (p) => {};",
            options: [{ requireReturn: false }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "/**\n* Description\n* @param {string} p bar\n*/\nFoo.bar = function({p}){};",
            options: [{ requireReturn: false }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "/**\n* Description\n* @param {string} p bar\n*/\nFoo.bar = function(p){};",
            options: [{ requireReturn: false }]
        },
        {
            code: "/**\n* Description\n* @param {string} p mytest\n*/\nFoo.bar = function(p){var t = function(){return p;}};",
            options: [{ requireReturn: false }]
        },
        {
            code: "/**\n* Description\n* @param {string} p mytest\n*/\nFoo.bar = function(p){function func(){return p;}};",
            options: [{ requireReturn: false }]
        },
        {
            code: "/**\n* Description\n* @param {string} p mytest\n*/\nFoo.bar = function(p){var t = false; if(t){ return; }};",
            options: [{ requireReturn: false }]
        },
        {
            code: "/**\n* Description\n* @param {string} p mytest\n* @returns {void} */\nFoo.bar = function(p){var t = false; if(t){ return; }};",
            options: [{ requireReturn: false }]
        },
        {
            code: "/**\n* Description\n* @param {string} p mytest\n*/\nFoo.bar = function(p){var t = function(){function name(){return p;}}};",
            options: [{ requireReturn: false }]
        },
        {
            code: "/**\n* Description\n* @param {string} p mytest\n*/\nFoo.bar = function(p){var t = function(){function name(){}; return name;}};",
            options: [{ requireReturn: false }]
        },
        {
            code: "/**\n* Description\n* @param {string} p\n* @returns {void}*/\nFoo.bar = function(p){var t = function(){function name(){}; return name;}};",
            options: [{ requireParamDescription: false }]
        },
        {
            code: "/**\n* Description\n* @param {string} p mytest\n* @returns {Object}*/\nFoo.bar = function(p){return name;};",
            options: [{ requireReturnDescription: false }]
        },
        "var obj = {\n /**\n * Getter\n * @type {string}\n */\n get location() {\n return this._location;\n }\n }",
        "var obj = {\n /**\n * Setter\n * @param {string} value The location\n */\n set location(value) {\n this._location = value;\n }\n }",
        {
            code: "/**\n * Description for A.\n */\n class A {\n /**\n * Description for constructor.\n * @param {object[]} xs - xs\n */\n constructor(xs) {\n /**\n * Description for this.xs;\n * @type {object[]}\n */\n this.xs = xs.filter(x => x != null);\n }\n}",
            options: [{ requireReturn: false }],
            parserOptions: {
                ecmaVersion: 6
            }
        },
        {
            code: "/** @returns {object} foo */ var foo = () => bar();",
            options: [{ requireReturn: false }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "/** @returns {object} foo */ var foo = () => { return bar(); };",
            options: [{ requireReturn: false }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "/** foo */ var foo = () => { bar(); };",
            options: [{ requireReturn: false }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "/**\n* Start with caps and end with period.\n* @return {void} */\nfunction foo(){}",
            options: [{
                matchDescription: "^[A-Z][A-Za-z0-9\\s]*[.]$"
            }]
        },
        {
            code: "/** Foo \n@return {void} Foo\n */\nfunction foo(){}",
            options: [{ prefer: { return: "return" } }]
        },
        {
            code: "/** Foo \n@return Foo\n */\nfunction foo(){}",
            options: [{ requireReturnType: false }]
        },
        {
            code: "/**\n* Description\n* @param p bar\n* @returns {void}*/\nFoo.bar = function(p){var t = function(){function name(){}; return name;}};",
            options: [{ requireParamType: false }]
        },
        {
            code:
                "/**\n" +
                " * A thing interface. \n" +
                " * @interface\n" +
                " */\n" +
                "function Thing() {}",
            options: [{ requireReturn: true }]
        },

        // classes
        {
            code:
                "/**\n" +
                " * Description for A.\n" +
                " */\n" +
                "class A {\n" +
                "    /**\n" +
                "     * Description for constructor.\n" +
                "     * @param {object[]} xs - xs\n" +
                "     */\n" +
                "    constructor(xs) {\n" +
                "        this.a = xs;" +
                "    }\n" +
                "}",
            options: [{ requireReturn: true }],
            parserOptions: {
                ecmaVersion: 6
            }
        },
        {
            code:
            "/**\n" +
            " * Description for A.\n" +
            " */\n" +
            "class A {\n" +
            "    /**\n" +
            "     * Description for method.\n" +
            "     * @param {object[]} xs - xs\n" +
            "     */\n" +
            "    print(xs) {\n" +
            "        this.a = xs;" +
            "    }\n" +
            "}",
            options: [{ requireReturn: false }],
            parserOptions: {
                ecmaVersion: 6
            }
        },
        {
            code:
                "/**\n" +
                " * Description for A.\n" +
                " */\n" +
                "class A {\n" +
                "    /**\n" +
                "     * Description for constructor.\n" +
                "     * @param {object[]} xs - xs\n" +
                "     * @returns {void}\n" +
                "     */\n" +
                "    constructor(xs) {\n" +
                "        this.a = xs;" +
                "    }\n" +
                "    /**\n" +
                "     * Description for method.\n" +
                "     * @param {object[]} xs - xs\n" +
                "     * @returns {void}\n" +
                "     */\n" +
                "    print(xs) {\n" +
                "        this.a = xs;" +
                "    }\n" +
                "}",
            options: [],
            parserOptions: {
                ecmaVersion: 6
            }
        },


        {
            code:
                "/**\n" +
                " * Use of this with a 'namepath'.\n" +
                " * @this some.name\n" +
                " */\n" +
                "function foo() {}",
            options: [{ requireReturn: false }]
        },
        {
            code:
                "/**\n" +
                " * Use of this with a type expression.\n" +
                " * @this {some.name}\n" +
                " */\n" +
                "function foo() {}",
            options: [{ requireReturn: false }]
        },

        // async function
        {
            code:
              "/**\n" +
              " * An async function. Options requires return.\n" +
              " * @returns {Promise} that is empty\n" +
              " */\n" +
              "async function a() {}",
            options: [{ requireReturn: true }],
            parserOptions: {
                ecmaVersion: 2017
            }
        },
        {
            code:
              "/**\n" +
              " * An async function. Options do not require return.\n" +
              " * @returns {Promise} that is empty\n" +
              " */\n" +
              "async function a() {}",
            options: [{ requireReturn: false }],
            parserOptions: {
                ecmaVersion: 2017
            }
        },
        {
            code:
              "/**\n" +
              " * An async function. Options do not require return.\n" +
              " */\n" +
              "async function a() {}",
            options: [{ requireReturn: false }],
            parserOptions: {
                ecmaVersion: 2017
            }
        },

        // type validations
        {
            code:
            "/**\n" +
            "* Foo\n" +
            "* @param {Array.<*>} hi - desc\n" +
            "* @returns {*} returns a node\n" +
            "*/\n" +
            "function foo(hi){}",
            options: [{
                preferType: {
                    String: "string",
                    Astnode: "ASTNode"
                }
            }]
        },
        {
            code:
            "/**\n" +
            "* Foo\n" +
            "* @param {string} hi - desc\n" +
            "* @returns {ASTNode} returns a node\n" +
            "*/\n" +
            "function foo(hi){}",
            options: [{
                preferType: {
                    String: "string",
                    Astnode: "ASTNode"
                }
            }]
        },
        {
            code:
            "/**\n" +
            "* Foo\n" +
            "* @param {{20:string}} hi - desc\n" +
            "* @returns {Astnode} returns a node\n" +
            "*/\n" +
            "function foo(hi){}",
            options: [{
                preferType: {
                    String: "string",
                    astnode: "ASTNode"
                }
            }]
        },
        {
            code:
            "/**\n" +
            "* Foo\n" +
            "* @param {{String:foo}} hi - desc\n" +
            "* @returns {ASTNode} returns a node\n" +
            "*/\n" +
            "function foo(hi){}",
            options: [{
                preferType: {
                    String: "string",
                    astnode: "ASTNode"
                }
            }]
        },
        {
            code:
            "/**\n" +
            "* Foo\n" +
            "* @param {String|number|Test} hi - desc\n" +
            "* @returns {Astnode} returns a node\n" +
            "*/\n" +
            "function foo(hi){}",
            options: [{
                preferType: {
                    test: "Test"
                }
            }]
        },
        {
            code:
            "/**\n" +
            "* Foo\n" +
            "* @param {Array.<string>} hi - desc\n" +
            "* @returns {Astnode} returns a node\n" +
            "*/\n" +
            "function foo(hi){}",
            options: [{
                preferType: {
                    String: "string",
                    astnode: "ASTNode"
                }
            }]
        },
        {
            code:
            "/**\n" +
            " * Test dash and slash.\n" +
            " * @extends module:stb/emitter~Emitter\n" +
            " */\n" +
            "function foo() {}",
            options: [{
                requireReturn: false
            }]
        },
        {
            code:
            "/**\n" +
            " * Test dash and slash.\n" +
            " * @requires module:config\n" +
            " * @requires module:modules/notifications\n" +
            " */\n" +
            "function foo() {}",
            options: [{
                requireReturn: false
            }]
        },
        {
            code:
            "/**\n" +
            " * Foo\n" +
            " * @module module-name\n" +
            " */\n" +
            "function foo() {}",
            options: [{
                requireReturn: false
            }]
        },
        {
            code:
            "/**\n" +
            " * Foo\n" +
            " * @alias module:module-name\n" +
            " */\n" +
            "function foo() {}",
            options: [{
                requireReturn: false
            }]
        },
        {
            code:
            "/**\n" +
            "* Foo\n" +
            "* @param {Array.<string>} hi - desc\n" +
            "* @returns {Array.<string|number>} desc\n" +
            "*/\n" +
            "function foo(hi){}",
            options: [{
                preferType: {
                    String: "string"
                }
            }]
        },
        {
            code:
            "/**\n" +
            "* Foo\n" +
            "* @param {Array.<string|number>} hi - desc\n" +
            "* @returns {Array.<string>} desc\n" +
            "*/\n" +
            "function foo(hi){}",
            options: [{
                preferType: {
                    String: "string"
                }
            }]
        },
        {
            code:
            "/**\n" +
            "* Foo\n" +
            "* @param {Array.<{id: number, votes: number}>} hi - desc\n" +
            "* @returns {Array.<{summary: string}>} desc\n" +
            "*/\n" +
            "function foo(hi){}",
            options: [{
                preferType: {
                    Number: "number",
                    String: "string"
                }
            }]
        },
        {
            code:
            "/**\n" +
            "* Foo\n" +
            "* @param {Array.<[string, number]>} hi - desc\n" +
            "* @returns {Array.<[string, string]>} desc\n" +
            "*/\n" +
            "function foo(hi){}",
            options: [{
                preferType: {
                    Number: "number",
                    String: "string"
                }
            }]
        },
        {
            code:
            "/**\n" +
            "* Foo\n" +
            "* @param {Object<string,Object<string, number>>} hi - because why not\n" +
            "* @returns {Boolean} desc\n" +
            "*/\n" +
            "function foo(hi){}",
            options: [{
                preferType: {
                    Number: "number",
                    String: "string"
                }
            }]
        },
        {
            code: "/**\n* Description\n* @param {string} a bar\n* @returns {string} desc */\nfunction foo(a = 1){}",
            parserOptions: {
                ecmaVersion: 6
            }
        },
        {
            code: "/**\n* Description\n* @param {string} b bar\n* @param {string} a bar\n* @returns {string} desc */\nfunction foo(b, a = 1){}",
            parserOptions: {
                ecmaVersion: 6
            }
        },

        // abstract
        {
            code:
            "/**\n" +
            "* Description\n" +
            "* @abstract\n" +
            "* @returns {Number} desc\n" +
            "*/\n" +
            "function foo(){ throw new Error('Not Implemented'); }",
            options: [{ requireReturn: false }]
        },

        // https://github.com/eslint/eslint/issues/9412 - different orders for jsodc tags
        {
            code:
            "/**\n" +
            "* Description\n" +
            "* @return {Number} desc\n" +
            "* @constructor \n" +
            "* @override\n" +
            "* @abstract\n" +
            "* @interface\n" +
            "* @param {string} hi - desc\n" +
            "*/\n" +
            "function foo(hi){ return 1; }",
            options: [{ requireReturn: false }]
        },
        {
            code:
            "/**\n" +
            "* Description\n" +
            "* @returns {Number} desc\n" +
            "* @class \n" +
            "* @inheritdoc\n" +
            "* @virtual\n" +
            "* @interface\n" +
            "* @param {string} hi - desc\n" +
            "*/\n" +
            "function foo(hi){ return 1; }",
            options: [{ requireReturn: false }]
        },
        {
            code:
            "/**\n" +
            "* Description\n" +
            "* @return {Number} desc\n" +
            "* @constructor \n" +
            "* @override\n" +
            "* @abstract\n" +
            "* @interface\n" +
            "* @arg {string} hi - desc\n" +
            "*/\n" +
            "function foo(hi){ return 1; }",
            options: [{ requireReturn: false }]
        },
        {
            code:
            "/**\n" +
            "* Description\n" +
            "* @returns {Number} desc\n" +
            "* @class \n" +
            "* @inheritdoc\n" +
            "* @virtual\n" +
            "* @interface\n" +
            "* @arg {string} hi - desc\n" +
            "*/\n" +
            "function foo(hi){ return 1; }",
            options: [{ requireReturn: false }]
        },
        {
            code:
            "/**\n" +
            "* Description\n" +
            "* @return {Number} desc\n" +
            "* @constructor \n" +
            "* @override\n" +
            "* @abstract\n" +
            "* @interface\n" +
            "* @argument {string} hi - desc\n" +
            "*/\n" +
            "function foo(hi){ return 1; }",
            options: [{ requireReturn: false }]
        },
        {
            code:
            "/**\n" +
            "* Description\n" +
            "* @returns {Number} desc\n" +
            "* @class \n" +
            "* @inheritdoc\n" +
            "* @virtual\n" +
            "* @interface\n" +
            "* @argument {string} hi - desc\n" +
            "*/\n" +
            "function foo(hi){ return 1; }",
            options: [{ requireReturn: false }]
        },
        {
            code:
            "/**\n" +
            "* Description\n" +
            "* @constructor \n" +
            "* @override\n" +
            "* @abstract\n" +
            "* @interface\n" +
            "* @param {string} hi - desc\n" +
            "* @return {Number} desc\n" +
            "*/\n" +
            "function foo(hi){ return 1; }",
            options: [{ requireReturn: false }]
        },
        {
            code:
            "/**\n" +
            "* Description\n" +
            "* @class \n" +
            "* @inheritdoc\n" +
            "* @virtual\n" +
            "* @interface\n" +
            "* @arg {string} hi - desc\n" +
            "* @return {Number} desc\n" +
            "*/\n" +
            "function foo(hi){ return 1; }",
            options: [{ requireReturn: false }]
        },
        {
            code:
            "/**\n" +
            "* Description\n" +
            "* @argument {string} hi - desc\n" +
            "* @return {Number} desc\n" +
            "*/\n" +
            "function foo(hi){ return 1; }",
            options: [{ requireReturn: false }]
        },
        {
            code:
            "/**\n" +
            "* Description\n" +
            "* @constructor \n" +
            "* @override\n" +
            "* @abstract\n" +
            "* @interface\n" +
            "* @param {string} hi - desc\n" +
            "* @returns {Number} desc\n" +
            "*/\n" +
            "function foo(hi){ return 1; }",
            options: [{ requireReturn: false }]
        },
        {
            code:
            "/**\n" +
            "* Description\n" +
            "* @class \n" +
            "* @inheritdoc\n" +
            "* @virtual\n" +
            "* @interface\n" +
            "* @arg {string} hi - desc\n" +
            "* @returns {Number} desc\n" +
            "*/\n" +
            "function foo(hi){ return 1; }",
            options: [{ requireReturn: false }]
        },
        {
            code:
            "/**\n" +
            "* Description\n" +
            "* @argument {string} hi - desc\n" +
            "* @returns {Number} desc\n" +
            "*/\n" +
            "function foo(hi){ return 1; }",
            options: [{ requireReturn: false }]
        },
        {
            code:
            "/**\n" +
            "* Description\n" +
            "* @override\n" +
            "* @abstract\n" +
            "* @interface\n" +
            "* @param {string} hi - desc\n" +
            "* @return {Number} desc\n" +
            "* @constructor\n" +
            "*/\n" +
            "function foo(hi){ return 1; }",
            options: [{ requireReturn: false }]
        },
        {
            code:
            "/**\n" +
            "* Description\n" +
            "* @inheritdoc\n" +
            "* @virtual\n" +
            "* @interface\n" +
            "* @arg {string} hi - desc\n" +
            "* @returns {Number} desc\n" +
            "* @constructor\n" +
            "*/\n" +
            "function foo(hi){ return 1; }",
            options: [{ requireReturn: false }]
        },
        {
            code:
            "/**\n" +
            "* Description\n" +
            "* @argument {string} hi - desc\n" +
            "* @constructor\n" +
            "*/\n" +
            "function foo(hi){}",
            options: [{ requireReturn: false }]
        },
        {
            code:
            "/**\n" +
            "* Description\n" +
            "* @override\n" +
            "* @abstract\n" +
            "* @interface\n" +
            "* @param {string} hi - desc\n" +
            "* @return {Number} desc\n" +
            "* @class\n" +
            "*/\n" +
            "function foo(hi){ return 1; }",
            options: [{ requireReturn: false }]
        },
        {
            code:
            "/**\n" +
            "* Description\n" +
            "* @inheritdoc\n" +
            "* @virtual\n" +
            "* @interface\n" +
            "* @arg {string} hi - desc\n" +
            "* @returns {Number} desc\n" +
            "* @class\n" +
            "*/\n" +
            "function foo(hi){ return 1; }",
            options: [{ requireReturn: false }]
        },
        {
            code:
            "/**\n" +
            "* Description\n" +
            "* @argument {string} hi - desc\n" +
            "* @class \n" +
            "*/\n" +
            "function foo(hi){}",
            options: [{ requireReturn: false }]
        },
        {
            code:
            "/**\n" +
            "* Description\n" +
            "* @abstract\n" +
            "* @interface\n" +
            "* @param {string} hi - desc\n" +
            "* @return {Number} desc\n" +
            "* @constructor\n" +
            "* @override\n" +
            "*/\n" +
            "function foo(hi){ return 1; }",
            options: [{ requireReturn: false }]
        },
        {
            code:
            "/**\n" +
            "* Description\n" +
            "* @virtual\n" +
            "* @interface\n" +
            "* @arg {string} hi - desc\n" +
            "* @returns {Number} desc\n" +
            "* @class\n" +
            "* @override\n" +
            "*/\n" +
            "function foo(hi){ return 1; }",
            options: [{ requireReturn: false }]
        },
        {
            code:
            "/**\n" +
            "* Description\n" +
            "* @argument {string} hi - desc\n" +
            "* @override\n" +
            "*/\n" +
            "function foo(hi){}",
            options: [{ requireReturn: false }]
        },
        {
            code:
            "/**\n" +
            "* Description\n" +
            "* @abstract\n" +
            "* @interface\n" +
            "* @param {string} hi - desc\n" +
            "* @return {Number} desc\n" +
            "* @constructor\n" +
            "* @inheritdoc\n" +
            "*/\n" +
            "function foo(hi){ return 1; }",
            options: [{ requireReturn: false }]
        },
        {
            code:
            "/**\n" +
            "* Description\n" +
            "* @virtual\n" +
            "* @interface\n" +
            "* @arg {string} hi - desc\n" +
            "* @returns {Number} desc\n" +
            "* @class\n" +
            "* @inheritdoc\n" +
            "*/\n" +
            "function foo(hi){ return 1; }",
            options: [{ requireReturn: false }]
        },
        {
            code:
            "/**\n" +
            "* Description\n" +
            "* @argument {string} hi - desc\n" +
            "* @inheritdoc\n" +
            "*/\n" +
            "function foo(hi){}",
            options: [{ requireReturn: false }]
        },
        {
            code:
            "/**\n" +
            "* Description\n" +
            "* @interface\n" +
            "* @param {string} hi - desc\n" +
            "* @return {Number} desc\n" +
            "* @constructor\n" +
            "* @override\n" +
            "* @abstract\n" +
            "*/\n" +
            "function foo(hi){ return 1; }",
            options: [{ requireReturn: false }]
        },
        {
            code:
            "/**\n" +
            "* Description\n" +
            "* @interface\n" +
            "* @arg {string} hi - desc\n" +
            "* @returns {Number} desc\n" +
            "* @class\n" +
            "* @override\n" +
            "* @abstract\n" +
            "*/\n" +
            "function foo(hi){ return 1; }",
            options: [{ requireReturn: false }]
        },
        {
            code:
            "/**\n" +
            "* Description\n" +
            "* @argument {string} hi - desc\n" +
            "* @abstract\n" +
            "*/\n" +
            "function foo(hi){}",
            options: [{ requireReturn: false }]
        },
        {
            code:
            "/**\n" +
            "* Description\n" +
            "* @interface\n" +
            "* @param {string} hi - desc\n" +
            "* @return {Number} desc\n" +
            "* @constructor\n" +
            "* @override\n" +
            "* @virtual\n" +
            "*/\n" +
            "function foo(hi){ return 1; }",
            options: [{ requireReturn: false }]
        },
        {
            code:
            "/**\n" +
            "* Description\n" +
            "* @interface\n" +
            "* @arg {string} hi - desc\n" +
            "* @returns {Number} desc\n" +
            "* @class\n" +
            "* @override\n" +
            "* @virtual\n" +
            "*/\n" +
            "function foo(hi){ return 1; }",
            options: [{ requireReturn: false }]
        },
        {
            code:
            "/**\n" +
            "* Description\n" +
            "* @argument {string} hi - desc\n" +
            "* @virtual\n" +
            "*/\n" +
            "function foo(hi){}",
            options: [{ requireReturn: false }]
        },
        {
            code:
            "/**\n" +
            "* Description\n" +
            "* @param {string} hi - desc\n" +
            "* @return {Number} desc\n" +
            "* @constructor \n" +
            "* @override\n" +
            "* @abstract\n" +
            "* @interface\n" +
            "*/\n" +
            "function foo(hi){ return 1; }",
            options: [{ requireReturn: false }]
        },
        {
            code:
            "/**\n" +
            "* Description\n" +
            "* @arg {string} hi - desc\n" +
            "* @returns {Number} desc\n" +
            "* @class\n" +
            "* @override\n" +
            "* @virtual\n" +
            "* @interface\n" +
            "*/\n" +
            "function foo(hi){ return 1; }",
            options: [{ requireReturn: false }]
        },
        {
            code:
            "/**\n" +
            "* Description\n" +
            "* @argument {string} hi - desc\n" +
            "* @interface\n" +
            "*/\n" +
            "function foo(hi){}",
            options: [{ requireReturn: false }]
        },
        {
            code:
            "/**\n" +
            "* Description\n" +
            "* @virtual\n" +
            "* @returns {Number} desc\n" +
            "*/\n" +
            "function foo(){ throw new Error('Not Implemented'); }",
            options: [{ requireReturn: false }]
        },
        {
            code:
            "/**\n" +
            "* Description\n" +
            "* @abstract\n" +
            "* @returns {Number} desc\n" +
            "*/\n" +
            "function foo(){ throw new Error('Not Implemented'); }",
            options: [{ requireReturn: true }]
        },
        {
            code:
            "/**\n" +
            "* Description\n" +
            "* @abstract\n" +
            "* @returns {Number} desc\n" +
            "*/\n" +
            "function foo(){}",
            options: [{ requireReturn: true }]
        },
        {
            code: [
                "/**",
                " * @param {string} a - a.",
                " * @param {object} [obj] - obj.",
                " * @param {string} obj.b - b.",
                " * @param {string} obj.c - c.",
                " * @returns {void}",
                " */",
                "function foo(a, {b, c} = {}) {",
                "    // empty",
                "}"
            ].join("\n"),
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: [
                "/**",
                " * @param {string} a - a.",
                " * @param {any[]} [list] - list.",
                " * @returns {void}",
                " */",
                "function foo(a, [b, c] = []) {",
                "    // empty",
                "}"
            ].join("\n"),
            parserOptions: { ecmaVersion: 6 }
        },

        // https://github.com/eslint/eslint/issues/7184
        "/**\n" +
            "* Foo\n" +
            "* @param {{foo}} hi - desc\n" +
            "* @returns {ASTNode} returns a node\n" +
            "*/\n" +
            "function foo(hi){}",
        "/**\n" +
            "* Foo\n" +
            "* @param {{foo:String, bar, baz:Array}} hi - desc\n" +
            "* @returns {ASTNode} returns a node\n" +
            "*/\n" +
            "function foo(hi){}",
        {
            code:
            "/**\n" +
            "* Foo\n" +
            "* @param {{String}} hi - desc\n" +
            "* @returns {ASTNode} returns a node\n" +
            "*/\n" +
            "function foo(hi){}",
            options: [{
                preferType: {
                    String: "string",
                    astnode: "ASTNode"
                }
            }]
        },
        {
            code:
            "/**\n" +
            "* Foo\n" +
            "* @param {{foo:string, astnode:Object, bar}} hi - desc\n" +
            "* @returns {ASTNode} returns a node\n" +
            "*/\n" +
            "function foo(hi){}",
            options: [{
                preferType: {
                    String: "string",
                    astnode: "ASTNode"
                }
            }]
        }
    ],

    invalid: [
        {
            code:
                "call(\n" +
                "  /**\n" +
                "   * Doc for a function expression in a call expression.\n" +
                "   * @param {string} bogusName This is the param description.\n" +
                "   * @return {string} This is the return description.\n" +
                "   */\n" +
                "  function(argName) {\n" +
                "    return 'the return';\n" +
                "  }\n" +
                ");\n",
            output: null,
            options: [{ requireReturn: false }],
            errors: [{
                messageId: "expected",
                data: { name: "argName", jsdocName: "bogusName" },
                type: "Block",
                line: 4,
                column: 6,
                endLine: 4,
                endColumn: 62
            }]
        },
        {
            code: "/** @@foo */\nfunction foo(){}",
            output: null,
            errors: [{
                messageId: "syntaxError",
                type: "Block"
            }]
        },
        {
            code:
                "/**\n" +
                "* Create a new thing.\n" +
                "*/\n" +
                "var thing = new Thing({\n" +
                "  /**\n" +
                "   * Missing return tag.\n" +
                "   */\n" +
                "  foo: function() {\n" +
                "    return 'bar';\n" +
                "  }\n" +
                "});\n",
            output: null,
            options: [{ requireReturn: false }],
            errors: [{
                messageId: "missingReturn",
                data: { returns: "returns" },
                type: "Block"
            }]
        },
        {
            code: "/** @@returns {void} Foo */\nfunction foo(){}",
            output: null,
            errors: [{
                messageId: "syntaxError",
                type: "Block"
            }]
        },
        {
            code: "/** Foo \n@returns {void Foo\n */\nfunction foo(){}",
            output: null,
            errors: [{
                messageId: "missingBrace",
                type: "Block"
            }]
        },
        {
            code: "/** Foo \n@return {void} Foo\n */\nfunction foo(){}",
            output: "/** Foo \n@returns {void} Foo\n */\nfunction foo(){}",
            options: [{ prefer: { return: "returns" } }],
            errors: [{
                messageId: "use",
                data: { name: "returns" },
                type: "Block",
                line: 2,
                column: 1,
                endLine: 2,
                endColumn: 8
            }]
        },
        {
            code: "/** Foo \n@argument {int} bar baz\n */\nfunction foo(bar){}",
            output: "/** Foo \n@arg {int} bar baz\n */\nfunction foo(bar){}",
            options: [{ prefer: { argument: "arg" } }],
            errors: [{
                messageId: "missingReturn",
                data: { returns: "returns" },
                type: "Block"
            }, {
                messageId: "use",
                data: { name: "arg" },
                type: "Block",
                line: 2,
                column: 1,
                endLine: 2,
                endColumn: 10
            }]
        },
        {
            code: "/** Foo \n */\nfunction foo(){}",
            output: null,
            options: [{ prefer: { returns: "return" } }],
            errors: [{
                messageId: "missingReturn",
                data: { returns: "return" },
                type: "Block"
            }]
        },
        {
            code: "/** Foo \n@return {void} Foo\n */\nfoo.bar = () => {}",
            output: "/** Foo \n@returns {void} Foo\n */\nfoo.bar = () => {}",
            options: [{ prefer: { return: "returns" } }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "use",
                data: { name: "returns" },
                type: "Block",
                line: 2,
                column: 1,
                endLine: 2,
                endColumn: 8
            }]
        },
        {
            code: "/** Foo \n@param {void Foo\n */\nfunction foo(){}",
            output: null,
            errors: [{
                messageId: "missingBrace",
                type: "Block"
            }]
        },
        {
            code: "/** Foo \n@param {} p Bar\n */\nfunction foo(){}",
            output: null,
            errors: [{
                messageId: "syntaxError",
                type: "Block"
            }]
        },
        {
            code: "/** Foo \n@param {void Foo */\nfunction foo(){}",
            output: null,
            errors: [{
                messageId: "missingBrace",
                type: "Block"
            }]
        },
        {
            code: "/** Foo\n* @param p Desc \n*/\nfunction foo(){}",
            output: null,
            errors: [{
                messageId: "missingReturn",
                data: { returns: "returns" },
                type: "Block"
            }, {
                messageId: "missingParamType",
                data: { name: "p" },
                type: "Block",
                line: 2,
                column: 3,
                endLine: 2,
                endColumn: 16
            }]
        },
        {
            code: "/**\n* Foo\n* @param {string} p \n*/\nfunction foo(){}",
            output: null,
            errors: [{
                messageId: "missingReturn",
                data: { returns: "returns" },
                type: "Block"
            }, {
                messageId: "missingParamDesc",
                data: { name: "p" },
                type: "Block",
                line: 3,
                column: 3,
                endLine: 3,
                endColumn: 20
            }]
        },
        {
            code: "/**\n* Foo\n* @param {string} p \n*/\nvar foo = function(){}",
            output: null,
            errors: [{
                messageId: "missingReturn",
                data: { returns: "returns" },
                type: "Block"
            }, {
                messageId: "missingParamDesc",
                data: { name: "p" },
                type: "Block",
                line: 3,
                column: 3,
                endLine: 3,
                endColumn: 20
            }]
        },
        {
            code: "/**\n* Foo\n* @param {string} p \n*/\nvar foo = \nfunction(){}",
            output: null,
            errors: [{
                messageId: "missingReturn",
                data: { returns: "returns" },
                type: "Block"
            }, {
                messageId: "missingParamDesc",
                data: { name: "p" },
                type: "Block",
                line: 3,
                column: 3,
                endLine: 3,
                endColumn: 20
            }]
        },
        {
            code:
            "/**\n" +
            " * Description for a\n" +
            " */\n" +
            "var A = \n" +
            "  class {\n" +
            "    /**\n" +
            "     * Description for method.\n" +
            "     * @param {object[]} xs - xs\n" +
            "     */\n" +
            "    print(xs) {\n" +
            "        this.a = xs;" +
            "    }\n" +
            "};",
            output: null,
            options: [{
                requireReturn: true,
                matchDescription: "^[A-Z][A-Za-z0-9\\s]*[.]$"
            }],
            parserOptions: {
                ecmaVersion: 6
            },
            errors: [
                {
                    messageId: "unsatisfiedDesc",
                    type: "Block"
                },
                {
                    messageId: "missingReturn",
                    data: { returns: "returns" },
                    type: "Block"
                }
            ]
        },
        {
            code: "/**\n* Foo\n* @returns {string} \n*/\nfunction foo(){}",
            output: null,
            errors: [{
                messageId: "missingReturnDesc",
                type: "Block"
            }]
        },
        {
            code: "/**\n* Foo\n* @returns {string} something \n*/\nfunction foo(p){}",
            output: null,
            errors: [{
                messageId: "missingParam",
                data: { name: "p" },
                type: "Block"
            }]
        },
        {
            code: "/**\n* Foo\n* @returns {string} something \n*/\nvar foo = \nfunction foo(a = 1){}",
            output: null,
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "missingParam",
                data: { name: "a" },
                type: "Block"
            }]
        },
        {
            code: "/**\n* Foo\n* @param {string} a Description \n* @param {string} b Description \n* @returns {string} something \n*/\nvar foo = \nfunction foo(b, a = 1){}",
            output: null,
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "expected",
                data: { name: "b", jsdocName: "a" },
                type: "Block",
                line: 3,
                column: 3,
                endLine: 3,
                endColumn: 32
            },
            {
                messageId: "expected",
                data: { name: "a", jsdocName: "b" },
                type: "Block",
                line: 4,
                column: 3,
                endLine: 4,
                endColumn: 32
            }]
        },
        {
            code: "/**\n* Foo\n* @param {string} p desc\n* @param {string} p desc \n*/\nfunction foo(){}",
            output: null,
            errors: [{
                messageId: "missingReturn",
                data: { returns: "returns" },
                type: "Block"
            }, {
                messageId: "duplicateParam",
                data: { name: "p" },
                type: "Block",
                line: 4,
                column: 3,
                endLine: 4,
                endColumn: 25
            }]
        },
        {
            code: "/**\n* Foo\n* @param {string} a desc\n@returns {void}*/\nfunction foo(b){}",
            output: null,
            errors: [{
                messageId: "expected",
                data: { name: "b", jsdocName: "a" },
                type: "Block",
                line: 3,
                column: 3,
                endLine: 3,
                endColumn: 25
            }]
        },
        {
            code: "/**\n* Foo\n* @override\n* @param {string} a desc\n */\nfunction foo(b){}",
            output: null,
            errors: [{
                messageId: "expected",
                data: { name: "b", jsdocName: "a" },
                type: "Block",
                line: 4,
                column: 3,
                endLine: 4,
                endColumn: 25
            }]
        },
        {
            code: "/**\n* Foo\n* @inheritdoc\n* @param {string} a desc\n */\nfunction foo(b){}",
            output: null,
            errors: [{
                messageId: "expected",
                data: { name: "b", jsdocName: "a" },
                type: "Block",
                line: 4,
                column: 3,
                endLine: 4,
                endColumn: 25
            }]
        },
        {
            code: "/**\n* Foo\n* @param {string} a desc\n*/\nfunction foo(a){var t = false; if(t) {return t;}}",
            output: null,
            options: [{ requireReturn: false }],
            errors: [{
                messageId: "missingReturn",
                data: { returns: "returns" },
                type: "Block"
            }]
        },
        {
            code: "/**\n* Foo\n* @param {string} a desc\n*/\nfunction foo(a){var t = false; if(t) {return null;}}",
            output: null,
            options: [{ requireReturn: false }],
            errors: [{
                messageId: "missingReturn",
                data: { returns: "returns" },
                type: "Block"
            }]
        },
        {
            code: "/**\n* Foo\n* @param {string} a desc\n@returns {MyClass}*/\nfunction foo(a){var t = false; if(t) {process(t);}}",
            output: null,
            options: [{ requireReturn: false }],
            errors: [{
                messageId: "unexpectedTag",
                data: { title: "returns" },
                type: "Block",
                line: 4,
                column: 1,
                endLine: 4,
                endColumn: 19
            }]
        },
        {
            code: "/**\n * Does something. \n* @param {string} a - this is a \n* @return {Array<number>} The result of doing it \n*/\n export function doSomething(a) { }",
            output: "/**\n * Does something. \n* @param {string} a - this is a \n* @returns {Array<number>} The result of doing it \n*/\n export function doSomething(a) { }",
            options: [{ prefer: { return: "returns" } }],
            parserOptions: { sourceType: "module" },
            errors: [{
                messageId: "use",
                data: { name: "returns" },
                type: "Block",
                line: 4,
                column: 3,
                endLine: 4,
                endColumn: 10
            }]
        },
        {
            code: "/**\n * Does something. \n* @param {string} a - this is a \n* @return {Array<number>} The result of doing it \n*/\n export default function doSomething(a) { }",
            output: "/**\n * Does something. \n* @param {string} a - this is a \n* @returns {Array<number>} The result of doing it \n*/\n export default function doSomething(a) { }",
            options: [{ prefer: { return: "returns" } }],
            parserOptions: { sourceType: "module" },
            errors: [{
                messageId: "use",
                data: { name: "returns" },
                type: "Block",
                line: 4,
                column: 3,
                endLine: 4,
                endColumn: 10
            }]
        },
        {
            code: "/** foo */ var foo = () => bar();",
            output: null,
            options: [{ requireReturn: false }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "missingReturn",
                data: { returns: "returns" },
                type: "Block"
            }]
        },
        {
            code: "/** foo */ var foo = () => { return bar(); };",
            output: null,
            options: [{ requireReturn: false }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "missingReturn",
                data: { returns: "returns" },
                type: "Block"
            }]
        },
        {
            code: "/** @returns {object} foo */ var foo = () => { bar(); };",
            output: null,
            options: [{ requireReturn: false }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "unexpectedTag",
                data: { title: "returns" },
                type: "Block",
                line: 1,
                column: 5,
                endLine: 1,
                endColumn: 26
            }]
        },
        {
            code: "/**\n* @param fields [Array]\n */\n function foo(){}",
            output: null,
            errors: [
                {
                    messageId: "missingReturn",
                    data: { returns: "returns" },
                    type: "Block"
                },
                {
                    messageId: "missingParamType",
                    data: { name: "fields" },
                    type: "Block",
                    line: 2,
                    column: 3,
                    endLine: 2,
                    endColumn: 24
                }
            ]
        },
        {
            code: "/**\n* Start with caps and end with period\n* @return {void} */\nfunction foo(){}",
            output: null,
            options: [{
                matchDescription: "^[A-Z][A-Za-z0-9\\s]*[.]$"
            }],
            errors: [{
                messageId: "unsatisfiedDesc",
                type: "Block"
            }]
        },
        {
            code: "/** Foo \n@return Foo\n */\nfunction foo(){}",
            output: null,
            options: [{ prefer: { return: "return" } }],
            errors: [{
                messageId: "missingReturnType",
                type: "Block"
            }]
        },
        {
            code: "/** Foo \n@return sdf\n */\nfunction foo(){}",
            output: null,
            options: [{
                prefer: { return: "return" },
                requireReturn: false
            }],
            errors: [{
                messageId: "unexpectedTag",
                data: { title: "return" },
                type: "Block",
                line: 2,
                column: 1,
                endLine: 2,
                endColumn: 12
            }]
        },

        // classes
        {
            code:
                "/**\n" +
                " * Description for A\n" +
                " */\n" +
                "class A {\n" +
                "    /**\n" +
                "     * Description for constructor\n" +
                "     * @param {object[]} xs - xs\n" +
                "     */\n" +
                "    constructor(xs) {\n" +
                "        this.a = xs;" +
                "    }\n" +
                "}",
            output: null,
            options: [{
                requireReturn: false,
                matchDescription: "^[A-Z][A-Za-z0-9\\s]*[.]$"
            }],
            parserOptions: {
                ecmaVersion: 6
            },
            errors: [
                {
                    messageId: "unsatisfiedDesc",
                    type: "Block"
                },
                {
                    messageId: "unsatisfiedDesc",
                    type: "Block"
                }
            ]
        },
        {
            code:
                "/**\n" +
                " * Description for a\n" +
                " */\n" +
                "var A = class {\n" +
                "    /**\n" +
                "     * Description for constructor.\n" +
                "     * @param {object[]} xs - xs\n" +
                "     */\n" +
                "    print(xs) {\n" +
                "        this.a = xs;" +
                "    }\n" +
                "};",
            output: null,
            options: [{
                requireReturn: true,
                matchDescription: "^[A-Z][A-Za-z0-9\\s]*[.]$"
            }],
            parserOptions: {
                ecmaVersion: 6
            },
            errors: [
                {
                    messageId: "unsatisfiedDesc",
                    type: "Block"
                },
                {
                    messageId: "missingReturn",
                    data: { returns: "returns" },
                    type: "Block"
                }
            ]
        },
        {
            code:
                "/**\n" +
                " * Description for A.\n" +
                " */\n" +
                "class A {\n" +
                "    /**\n" +
                "     * Description for constructor.\n" +
                "     * @param {object[]} xs - xs\n" +
                "     * @returns {void}\n" +
                "     */\n" +
                "    constructor(xs) {\n" +
                "        this.a = xs;" +
                "    }\n" +
                "    /**\n" +
                "     * Description for method.\n" +
                "     */\n" +
                "    print(xs) {\n" +
                "        this.a = xs;" +
                "    }\n" +
                "}",
            output: null,
            options: [],
            parserOptions: {
                ecmaVersion: 6
            },
            errors: [
                {
                    messageId: "missingReturn",
                    data: { returns: "returns" },
                    type: "Block"
                },
                {
                    messageId: "missingParam",
                    data: { name: "xs" },
                    type: "Block"
                }
            ]
        },
        {
            code:
                "/**\n" +
                " * Use of this with an invalid type expression\n" +
                " * @this {not.a.valid.type.expression\n" +
                " */\n" +
                "function foo() {}",
            output: null,
            options: [{ requireReturn: false }],
            errors: [{
                messageId: "missingBrace",
                type: "Block"
            }]
        },
        {
            code:
                "/**\n" +
                " * Use of this with a type that is not a member expression\n" +
                " * @this {Array<string>}\n" +
                " */\n" +
                "function foo() {}",
            output: null,
            options: [{ requireReturn: false }],
            errors: [{
                messageId: "syntaxError",
                type: "Block"
            }]
        },

        // async function
        {
            code:
              "/**\n" +
              " * An async function. Options requires return.\n" +
              " */\n" +
              "async function a() {}",
            output: null,
            options: [{ requireReturn: true }],
            parserOptions: {
                ecmaVersion: 2017
            },
            errors: [{
                messageId: "missingReturn",
                data: { returns: "returns" },
                type: "Block"
            }]
        },

        // type validations
        {
            code:
            "/**\n" +
            "* Foo\n" +
            "* @param {String} hi - desc\n" +
            "* @returns {Astnode} returns a node\n" +
            "*/\n" +
            "function foo(hi){}",
            output:
            "/**\n" +
            "* Foo\n" +
            "* @param {string} hi - desc\n" +
            "* @returns {ASTNode} returns a node\n" +
            "*/\n" +
            "function foo(hi){}",
            options: [{
                preferType: {
                    String: "string",
                    Astnode: "ASTNode"
                }
            }],
            errors: [
                {
                    messageId: "useType",
                    data: { expectedTypeName: "string", currentTypeName: "String" },
                    type: "Block",
                    line: 3,
                    column: 11,
                    endLine: 3,
                    endColumn: 17
                },
                {
                    messageId: "useType",
                    data: { expectedTypeName: "ASTNode", currentTypeName: "Astnode" },
                    type: "Block",
                    line: 4,
                    column: 13,
                    endLine: 4,
                    endColumn: 20
                }
            ]
        },
        {
            code:
            "/**\n" +
            "* Foo\n" +
            "* @param {{20:String}} hi - desc\n" +
            "* @returns {Astnode} returns a node\n" +
            "*/\n" +
            "function foo(hi){}",
            output:
            "/**\n" +
            "* Foo\n" +
            "* @param {{20:string}} hi - desc\n" +
            "* @returns {ASTNode} returns a node\n" +
            "*/\n" +
            "function foo(hi){}",
            options: [{
                preferType: {
                    String: "string",
                    Astnode: "ASTNode"
                }
            }],
            errors: [
                {
                    messageId: "useType",
                    data: { expectedTypeName: "string", currentTypeName: "String" },
                    type: "Block",
                    line: 3,
                    column: 15,
                    endLine: 3,
                    endColumn: 21
                },
                {
                    messageId: "useType",
                    data: { expectedTypeName: "ASTNode", currentTypeName: "Astnode" },
                    type: "Block",
                    line: 4,
                    column: 13,
                    endLine: 4,
                    endColumn: 20
                }
            ]
        },
        {
            code:
            "/**\n" +
            "* Foo\n" +
            "* @param {String|number|test} hi - desc\n" +
            "* @returns {Astnode} returns a node\n" +
            "*/\n" +
            "function foo(hi){}",
            output:
            "/**\n" +
            "* Foo\n" +
            "* @param {String|number|Test} hi - desc\n" +
            "* @returns {Astnode} returns a node\n" +
            "*/\n" +
            "function foo(hi){}",
            options: [{
                preferType: {
                    test: "Test"
                }
            }],
            errors: [
                {
                    messageId: "useType",
                    data: { expectedTypeName: "Test", currentTypeName: "test" },
                    type: "Block",
                    line: 3,
                    column: 25,
                    endLine: 3,
                    endColumn: 29
                }
            ]
        },
        {
            code:
            "/**\n" +
            "* Foo\n" +
            "* @param {Array.<String>} hi - desc\n" +
            "* @returns {Astnode} returns a node\n" +
            "*/\n" +
            "function foo(hi){}",
            output:
            "/**\n" +
            "* Foo\n" +
            "* @param {Array.<string>} hi - desc\n" +
            "* @returns {Astnode} returns a node\n" +
            "*/\n" +
            "function foo(hi){}",
            options: [{
                preferType: {
                    String: "string",
                    astnode: "ASTNode"
                }
            }],
            errors: [
                {
                    messageId: "useType",
                    data: { expectedTypeName: "string", currentTypeName: "String" },
                    type: "Block",
                    line: 3,
                    column: 18,
                    endLine: 3,
                    endColumn: 24
                }
            ]
        },
        {
            code:
            "/**\n" +
            "* Foo\n" +
            "* @param {Array.<{id: Number, votes: Number}>} hi - desc\n" +
            "* @returns {Array.<{summary: String}>} desc\n" +
            "*/\n" +
            "function foo(hi){}",
            output:
            "/**\n" +
            "* Foo\n" +
            "* @param {Array.<{id: number, votes: number}>} hi - desc\n" +
            "* @returns {Array.<{summary: string}>} desc\n" +
            "*/\n" +
            "function foo(hi){}",
            options: [{
                preferType: {
                    Number: "number",
                    String: "string"
                }
            }],
            errors: [
                {
                    messageId: "useType",
                    data: { expectedTypeName: "number", currentTypeName: "Number" },
                    type: "Block",
                    line: 3,
                    column: 23,
                    endLine: 3,
                    endColumn: 29
                },
                {
                    messageId: "useType",
                    data: { expectedTypeName: "number", currentTypeName: "Number" },
                    type: "Block",
                    line: 3,
                    column: 38,
                    endLine: 3,
                    endColumn: 44
                },
                {
                    messageId: "useType",
                    data: { expectedTypeName: "string", currentTypeName: "String" },
                    type: "Block",
                    line: 4,
                    column: 30,
                    endLine: 4,
                    endColumn: 36
                }
            ]
        },
        {
            code:
            "/**\n" +
            "* Foo\n" +
            "* @param {Array.<[String, Number]>} hi - desc\n" +
            "* @returns {Array.<[String, String]>} desc\n" +
            "*/\n" +
            "function foo(hi){}",
            output:
            "/**\n" +
            "* Foo\n" +
            "* @param {Array.<[string, number]>} hi - desc\n" +
            "* @returns {Array.<[string, string]>} desc\n" +
            "*/\n" +
            "function foo(hi){}",
            options: [{
                preferType: {
                    Number: "number",
                    String: "string"
                }
            }],
            errors: [
                {
                    messageId: "useType",
                    data: { expectedTypeName: "string", currentTypeName: "String" },
                    type: "Block",
                    line: 3,
                    column: 19,
                    endLine: 3,
                    endColumn: 25
                },
                {
                    messageId: "useType",
                    data: { expectedTypeName: "number", currentTypeName: "Number" },
                    type: "Block",
                    line: 3,
                    column: 27,
                    endLine: 3,
                    endColumn: 33
                },
                {
                    messageId: "useType",
                    data: { expectedTypeName: "string", currentTypeName: "String" },
                    type: "Block",
                    line: 4,
                    column: 21,
                    endLine: 4,
                    endColumn: 27
                },
                {
                    messageId: "useType",
                    data: { expectedTypeName: "string", currentTypeName: "String" },
                    type: "Block",
                    line: 4,
                    column: 29,
                    endLine: 4,
                    endColumn: 35
                }
            ]
        },
        {
            code:
            "/**\n" +
            "* Foo\n" +
            "* @param {object<String,object<String, Number>>} hi - because why not\n" +
            "* @returns {Boolean} desc\n" +
            "*/\n" +
            "function foo(hi){}",
            output:
            "/**\n" +
            "* Foo\n" +
            "* @param {Object<string,Object<string, number>>} hi - because why not\n" +
            "* @returns {Boolean} desc\n" +
            "*/\n" +
            "function foo(hi){}",
            options: [{
                preferType: {
                    Number: "number",
                    String: "string",
                    object: "Object"
                }
            }],
            errors: [
                {
                    messageId: "useType",
                    data: { expectedTypeName: "Object", currentTypeName: "object" },
                    type: "Block",
                    line: 3,
                    column: 11,
                    endLine: 3,
                    endColumn: 17
                },
                {
                    messageId: "useType",
                    data: { expectedTypeName: "string", currentTypeName: "String" },
                    type: "Block",
                    line: 3,
                    column: 18,
                    endLine: 3,
                    endColumn: 24
                },
                {
                    messageId: "useType",
                    data: { expectedTypeName: "Object", currentTypeName: "object" },
                    type: "Block",
                    line: 3,
                    column: 25,
                    endLine: 3,
                    endColumn: 31
                },
                {
                    messageId: "useType",
                    data: { expectedTypeName: "string", currentTypeName: "String" },
                    type: "Block",
                    line: 3,
                    column: 32,
                    endLine: 3,
                    endColumn: 38
                },
                {
                    messageId: "useType",
                    data: { expectedTypeName: "number", currentTypeName: "Number" },
                    type: "Block",
                    line: 3,
                    column: 40,
                    endLine: 3,
                    endColumn: 46
                }
            ]
        },

        // https://github.com/eslint/eslint/issues/7184
        {
            code:
            "/**\n" +
            "* Foo\n" +
            "* @param {{foo:String, astnode:Object, bar}} hi - desc\n" +
            "* @returns {ASTnode} returns a node\n" +
            "*/\n" +
            "function foo(hi){}",
            output:
            "/**\n" +
            "* Foo\n" +
            "* @param {{foo:string, astnode:Object, bar}} hi - desc\n" +
            "* @returns {ASTnode} returns a node\n" +
            "*/\n" +
            "function foo(hi){}",
            options: [{
                preferType: {
                    String: "string",
                    astnode: "ASTNode"
                }
            }],
            errors: [
                {
                    messageId: "useType",
                    data: { expectedTypeName: "string", currentTypeName: "String" },
                    type: "Block",
                    line: 3,
                    column: 16,
                    endLine: 3,
                    endColumn: 22
                }
            ]
        }
    ]
});
