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
            options: [{requireReturn: false}]
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
            options: [{requireReturn: false}]
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
            options: [{requireReturn: false}]
        },
        {
            code: "/**\n* Description\n* @return {void} */\nfunction foo(){}",
            options: [{}]
        },
        {
            code: "/**\n* Description\n* @param {string} p bar\n*/\nFoo.bar = (p) => {};",
            options: [{requireReturn: false}],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "/**\n* Description\n* @param {string} p bar\n*/\nFoo.bar = function({p}){};",
            options: [{requireReturn: false}],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "/**\n* Description\n* @param {string} p bar\n*/\nFoo.bar = function(p){};",
            options: [{requireReturn: false}]
        },
        {
            code: "/**\n* Description\n* @param {string} p mytest\n*/\nFoo.bar = function(p){var t = function(){return p;}};",
            options: [{requireReturn: false}]
        },
        {
            code: "/**\n* Description\n* @param {string} p mytest\n*/\nFoo.bar = function(p){function func(){return p;}};",
            options: [{requireReturn: false}]
        },
        {
            code: "/**\n* Description\n* @param {string} p mytest\n*/\nFoo.bar = function(p){var t = false; if(t){ return; }};",
            options: [{requireReturn: false}]
        },
        {
            code: "/**\n* Description\n* @param {string} p mytest\n* @returns {void} */\nFoo.bar = function(p){var t = false; if(t){ return; }};",
            options: [{requireReturn: false}]
        },
        {
            code: "/**\n* Description\n* @param {string} p mytest\n*/\nFoo.bar = function(p){var t = function(){function name(){return p;}}};",
            options: [{requireReturn: false}]
        },
        {
            code: "/**\n* Description\n* @param {string} p mytest\n*/\nFoo.bar = function(p){var t = function(){function name(){}; return name;}};",
            options: [{requireReturn: false}]
        },
        {
            code: "/**\n* Description\n* @param {string} p\n* @returns {void}*/\nFoo.bar = function(p){var t = function(){function name(){}; return name;}};",
            options: [{requireParamDescription: false}]
        },
        {
            code: "/**\n* Description\n* @param {string} p mytest\n* @returns {Object}*/\nFoo.bar = function(p){return name;};",
            options: [{requireReturnDescription: false}]
        },
        "var obj = {\n /**\n * Getter\n * @type {string}\n */\n get location() {\n return this._location;\n }\n }",
        "var obj = {\n /**\n * Setter\n * @param {string} value The location\n */\n set location(value) {\n this._location = value;\n }\n }",
        {
            code: "/**\n * Description for A.\n */\n class A {\n /**\n * Description for constructor.\n * @param {object[]} xs - xs\n */\n constructor(xs) {\n /**\n * Description for this.xs;\n * @type {object[]}\n */\n this.xs = xs.filter(x => x != null);\n }\n}",
            options: [{requireReturn: false}],
            parserOptions: {
                ecmaVersion: 6
            }
        },
        {
            code: "/** @returns {object} foo */ var foo = () => bar();",
            options: [{requireReturn: false}],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "/** @returns {object} foo */ var foo = () => { return bar(); };",
            options: [{requireReturn: false}],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "/** foo */ var foo = () => { bar(); };",
            options: [{requireReturn: false}],
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
            options: [{ prefer: { return: "return" }}]
        },
        {
            code: "/** Foo \n@return Foo\n */\nfunction foo(){}",
            options: [{ requireReturnType: false }]
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
            options: [{requireReturn: true}],
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
            options: [{requireReturn: false}],
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
            options: [{requireReturn: false}]
        },
        {
            code:
                "/**\n" +
                " * Use of this with a type expression.\n" +
                " * @this {some.name}\n" +
                " */\n" +
                "function foo() {}",
            options: [{requireReturn: false}]
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
            parserOptions: {ecmaVersion: 6}
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
            parserOptions: {ecmaVersion: 6}
        },

        // https://github.com/eslint/eslint/issues/7184
        {
            code:
            "/**\n" +
            "* Foo\n" +
            "* @param {{foo}} hi - desc\n" +
            "* @returns {ASTNode} returns a node\n" +
            "*/\n" +
            "function foo(hi){}"
        },
        {
            code:
            "/**\n" +
            "* Foo\n" +
            "* @param {{foo:String, bar, baz:Array}} hi - desc\n" +
            "* @returns {ASTNode} returns a node\n" +
            "*/\n" +
            "function foo(hi){}"
        },
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
            options: [{requireReturn: false}],
            errors: [{
                message: "Expected JSDoc for 'argName' but found 'bogusName'.",
                type: "Block"
            }]
        },
        {
            code: "/** @@foo */\nfunction foo(){}",
            errors: [{
                message: "JSDoc syntax error.",
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
            options: [{requireReturn: false}],
            errors: [{
                message: "Missing JSDoc @returns for function.",
                type: "Block"
            }]
        },
        {
            code: "/** @@returns {void} Foo */\nfunction foo(){}",
            errors: [{
                message: "JSDoc syntax error.",
                type: "Block"
            }]
        },
        {
            code: "/** Foo \n@returns {void Foo\n */\nfunction foo(){}",
            errors: [{
                message: "JSDoc type missing brace.",
                type: "Block"
            }]
        },
        {
            code: "/** Foo \n@return {void} Foo\n */\nfunction foo(){}",
            options: [{ prefer: { return: "returns" }}],
            errors: [{
                message: "Use @returns instead.",
                type: "Block"
            }]
        },
        {
            code: "/** Foo \n@argument {int} bar baz\n */\nfunction foo(bar){}",
            options: [{ prefer: { argument: "arg" }}],
            errors: [{
                message: "Use @arg instead.",
                type: "Block"
            }, {
                message: "Missing JSDoc @returns for function.",
                type: "Block"
            }]
        },
        {
            code: "/** Foo \n */\nfunction foo(){}",
            options: [{ prefer: { returns: "return" }}],
            errors: [{
                message: "Missing JSDoc @return for function.",
                type: "Block"
            }]
        },
        {
            code: "/** Foo \n@return {void} Foo\n */\nfoo.bar = () => {}",
            options: [{ prefer: { return: "returns" }}],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Use @returns instead.",
                type: "Block"
            }]
        },
        {
            code: "/** Foo \n@param {void Foo\n */\nfunction foo(){}",
            errors: [{
                message: "JSDoc type missing brace.",
                type: "Block"
            }]
        },
        {
            code: "/** Foo \n@param {} p Bar\n */\nfunction foo(){}",
            errors: [{
                message: "JSDoc syntax error.",
                type: "Block"
            }]
        },
        {
            code: "/** Foo \n@param {void Foo */\nfunction foo(){}",
            errors: [{
                message: "JSDoc type missing brace.",
                type: "Block"
            }]
        },
        {
            code: "/** Foo\n* @param p Desc \n*/\nfunction foo(){}",
            errors: [{
                message: "Missing JSDoc parameter type for 'p'.",
                type: "Block"
            }, {
                message: "Missing JSDoc @returns for function.",
                type: "Block"
            }]
        },
        {
            code: "/**\n* Foo\n* @param {string} p \n*/\nfunction foo(){}",
            errors: [{
                message: "Missing JSDoc parameter description for 'p'.",
                type: "Block"
            }, {
                message: "Missing JSDoc @returns for function.",
                type: "Block"
            }]
        },
        {
            code: "/**\n* Foo\n* @param {string} p \n*/\nvar foo = function(){}",
            errors: [{
                message: "Missing JSDoc parameter description for 'p'.",
                type: "Block"
            }, {
                message: "Missing JSDoc @returns for function.",
                type: "Block"
            }]
        },
        {
            code: "/**\n* Foo\n* @param {string} p \n*/\nvar foo = \nfunction(){}",
            errors: [{
                message: "Missing JSDoc parameter description for 'p'.",
                type: "Block"
            }, {
                message: "Missing JSDoc @returns for function.",
                type: "Block"
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
            options: [{
                requireReturn: true,
                matchDescription: "^[A-Z][A-Za-z0-9\\s]*[.]$"
            }],
            errors: [
                {
                    message: "JSDoc description does not satisfy the regex pattern.",
                    type: "Block"
                },
                {
                    message: "Missing JSDoc @returns for function.",
                    type: "Block"
                }
            ],
            parserOptions: {
                ecmaVersion: 6
            }
        },
        {
            code: "/**\n* Foo\n* @returns {string} \n*/\nfunction foo(){}",
            errors: [{
                message: "Missing JSDoc return description.",
                type: "Block"
            }]
        },
        {
            code: "/**\n* Foo\n* @returns {string} something \n*/\nfunction foo(p){}",
            errors: [{
                message: "Missing JSDoc for parameter 'p'.",
                type: "Block"
            }]
        },
        {
            code: "/**\n* Foo\n* @returns {string} something \n*/\nvar foo = \nfunction foo(a = 1){}",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Missing JSDoc for parameter 'a'.",
                type: "Block"
            }]
        },
        {
            code: "/**\n* Foo\n* @param {string} a Description \n* @param {string} b Description \n* @returns {string} something \n*/\nvar foo = \nfunction foo(b, a = 1){}",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Expected JSDoc for 'b' but found 'a'.",
                type: "Block"
            },
            {
                message: "Expected JSDoc for 'a' but found 'b'.",
                type: "Block"
            }]
        },
        {
            code: "/**\n* Foo\n* @param {string} p desc\n* @param {string} p desc \n*/\nfunction foo(){}",
            errors: [{
                message: "Duplicate JSDoc parameter 'p'.",
                type: "Block"
            }, {
                message: "Missing JSDoc @returns for function.",
                type: "Block"
            }]
        },
        {
            code: "/**\n* Foo\n* @param {string} a desc\n@returns {void}*/\nfunction foo(b){}",
            errors: [{
                message: "Expected JSDoc for 'b' but found 'a'.",
                type: "Block"
            }]
        },
        {
            code: "/**\n* Foo\n* @override\n* @param {string} a desc\n */\nfunction foo(b){}",
            errors: [{
                message: "Expected JSDoc for 'b' but found 'a'.",
                type: "Block"
            }]
        },
        {
            code: "/**\n* Foo\n* @inheritdoc\n* @param {string} a desc\n */\nfunction foo(b){}",
            errors: [{
                message: "Expected JSDoc for 'b' but found 'a'.",
                type: "Block"
            }]
        },
        {
            code: "/**\n* Foo\n* @param {string} a desc\n*/\nfunction foo(a){var t = false; if(t) {return t;}}",
            options: [{requireReturn: false}],
            errors: [{
                message: "Missing JSDoc @returns for function.",
                type: "Block"
            }]
        },
        {
            code: "/**\n* Foo\n* @param {string} a desc\n*/\nfunction foo(a){var t = false; if(t) {return null;}}",
            options: [{requireReturn: false}],
            errors: [{
                message: "Missing JSDoc @returns for function.",
                type: "Block"
            }]
        },
        {
            code: "/**\n* Foo\n* @param {string} a desc\n@returns {MyClass}*/\nfunction foo(a){var t = false; if(t) {process(t);}}",
            options: [{requireReturn: false}],
            errors: [{
                message: "Unexpected @returns tag; function has no return statement.",
                type: "Block"
            }]
        },
        {
            code: "/**\n * Does something. \n* @param {string} a - this is a \n* @return {Array<number>} The result of doing it \n*/\n export function doSomething(a) { }",
            options: [{prefer: { return: "returns" }}],
            parserOptions: { sourceType: "module" },
            errors: [{
                message: "Use @returns instead.",
                type: "Block"
            }]
        },
        {
            code: "/**\n * Does something. \n* @param {string} a - this is a \n* @return {Array<number>} The result of doing it \n*/\n export default function doSomething(a) { }",
            options: [{prefer: { return: "returns" }}],
            parserOptions: { sourceType: "module" },
            errors: [{
                message: "Use @returns instead.",
                type: "Block"
            }]
        },
        {
            code: "/** foo */ var foo = () => bar();",
            options: [{requireReturn: false}],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Missing JSDoc @returns for function.",
                type: "Block"
            }]
        },
        {
            code: "/** foo */ var foo = () => { return bar(); };",
            options: [{requireReturn: false}],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Missing JSDoc @returns for function.",
                type: "Block"
            }]
        },
        {
            code: "/** @returns {object} foo */ var foo = () => { bar(); };",
            options: [{requireReturn: false}],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Unexpected @returns tag; function has no return statement.",
                type: "Block"
            }]
        },
        {
            code: "/**\n* @param fields [Array]\n */\n function foo(){}",
            errors: [
                {
                    message: "Missing JSDoc parameter type for 'fields'.",
                    type: "Block"
                },
                {
                    message: "Missing JSDoc @returns for function.",
                    type: "Block"
                }
            ]
        },
        {
            code: "/**\n* Start with caps and end with period\n* @return {void} */\nfunction foo(){}",
            options: [{
                matchDescription: "^[A-Z][A-Za-z0-9\\s]*[.]$"
            }],
            errors: [{
                message: "JSDoc description does not satisfy the regex pattern.",
                type: "Block"
            }]
        },
        {
            code: "/** Foo \n@return Foo\n */\nfunction foo(){}",
            options: [{ prefer: { return: "return" }}],
            errors: [{
                message: "Missing JSDoc return type.",
                type: "Block"
            }]
        },
        {
            code: "/** Foo \n@return sdf\n */\nfunction foo(){}",
            options: [{
                prefer: { return: "return" },
                requireReturn: false
            }],
            errors: [{
                message: "Unexpected @return tag; function has no return statement.",
                type: "Block"
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
            options: [{
                requireReturn: false,
                matchDescription: "^[A-Z][A-Za-z0-9\\s]*[.]$"
            }],
            errors: [
                {
                    message: "JSDoc description does not satisfy the regex pattern.",
                    type: "Block"
                },
                {
                    message: "JSDoc description does not satisfy the regex pattern.",
                    type: "Block"
                }
            ],
            parserOptions: {
                ecmaVersion: 6
            }
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
            options: [{
                requireReturn: true,
                matchDescription: "^[A-Z][A-Za-z0-9\\s]*[.]$"
            }],
            errors: [
                {
                    message: "JSDoc description does not satisfy the regex pattern.",
                    type: "Block"
                },
                {
                    message: "Missing JSDoc @returns for function.",
                    type: "Block"
                }
            ],
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
                "     */\n" +
                "    print(xs) {\n" +
                "        this.a = xs;" +
                "    }\n" +
                "}",
            options: [],
            errors: [
                {
                    message: "Missing JSDoc @returns for function.",
                    type: "Block"
                },
                {
                    message: "Missing JSDoc for parameter 'xs'.",
                    type: "Block"
                }
            ],
            parserOptions: {
                ecmaVersion: 6
            }
        },
        {
            code:
                "/**\n" +
                " * Use of this with an invalid type expression\n" +
                " * @this {not.a.valid.type.expression\n" +
                " */\n" +
                "function foo() {}",
            options: [{requireReturn: false}],
            errors: [{
                message: "JSDoc type missing brace.",
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
            options: [{requireReturn: false}],
            errors: [{
                message: "JSDoc syntax error.",
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
            options: [{
                preferType: {
                    String: "string",
                    Astnode: "ASTNode"
                }
            }],
            errors: [
                {
                    message: "Use 'string' instead of 'String'.",
                    type: "Block"
                },
                {
                    message: "Use 'ASTNode' instead of 'Astnode'.",
                    type: "Block"
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
            options: [{
                preferType: {
                    String: "string",
                    Astnode: "ASTNode"
                }
            }],
            errors: [
                {
                    message: "Use 'string' instead of 'String'.",
                    type: "Block"
                },
                {
                    message: "Use 'ASTNode' instead of 'Astnode'.",
                    type: "Block"
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
            options: [{
                preferType: {
                    test: "Test"
                }
            }],
            errors: [
                {
                    message: "Use 'Test' instead of 'test'.",
                    type: "Block"
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
            options: [{
                preferType: {
                    String: "string",
                    astnode: "ASTNode"
                }
            }],
            errors: [
                {
                    message: "Use 'string' instead of 'String'.",
                    type: "Block"
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
            options: [{
                preferType: {
                    Number: "number",
                    String: "string"
                }
            }],
            errors: [
                {
                    message: "Use 'number' instead of 'Number'.",
                    type: "Block"
                },
                {
                    message: "Use 'number' instead of 'Number'.",
                    type: "Block"
                },
                {
                    message: "Use 'string' instead of 'String'.",
                    type: "Block"
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
            options: [{
                preferType: {
                    Number: "number",
                    String: "string"
                }
            }],
            errors: [
                {
                    message: "Use 'string' instead of 'String'.",
                    type: "Block"
                },
                {
                    message: "Use 'number' instead of 'Number'.",
                    type: "Block"
                },
                {
                    message: "Use 'string' instead of 'String'.",
                    type: "Block"
                },
                {
                    message: "Use 'string' instead of 'String'.",
                    type: "Block"
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
            options: [{
                preferType: {
                    Number: "number",
                    String: "string",
                    object: "Object"
                }
            }],
            errors: [
                {
                    message: "Use 'string' instead of 'String'.",
                    type: "Block"
                },
                {
                    message: "Use 'string' instead of 'String'.",
                    type: "Block"
                },
                {
                    message: "Use 'number' instead of 'Number'.",
                    type: "Block"
                },
                {
                    message: "Use 'Object' instead of 'object'.",
                    type: "Block"
                },
                {
                    message: "Use 'Object' instead of 'object'.",
                    type: "Block"
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
            options: [{
                preferType: {
                    String: "string",
                    astnode: "ASTNode"
                }
            }],
            errors: [
                {
                    message: "Use 'string' instead of 'String'.",
                    type: "Block"
                }
            ]
        }
    ]
});
