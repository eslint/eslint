/**
 * @fileoverview Tests for key-spacing rule.
 * @author Brandon Mills
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/key-spacing"),
    RuleTester = require("../../../lib/testers/rule-tester");

const ruleTester = new RuleTester();

ruleTester.run("key-spacing", rule, {

    valid: [{
        code: "({\n})"
    }, {
        code: "({\na: b\n})"
    }, {
        code: "({\n})",
        options: [{ align: "colon" }]
    }, {
        code: "({\na: b\n})",
        options: [{ align: "value" }]
    }, {
        code: "var obj = { key: value };",
        options: [{}]
    }, {
        code: "var obj = { [(a + b)]: value };",
        options: [{}],
        parserOptions: { ecmaVersion: 6 }
    }, {
        code: "var foo = { a:bar };",
        options: [{
            beforeColon: false,
            afterColon: false
        }]
    }, {
        code: "var foo = { a: bar };",
        options: [{
            beforeColon: false,
            afterColon: true
        }]
    }, {
        code: "foo({ 'default': function(){}});",
        options: [{
            beforeColon: false,
            afterColon: true
        }]
    }, {
        code: "function foo() { return {\n    key: (foo === 4)\n}; }",
        options: [{
            beforeColon: false,
            afterColon: true
        }]
    }, {
        code: "var obj = {'key' :42 };",
        options: [{
            beforeColon: true,
            afterColon: false
        }]
    }, {
        code: "({a : foo, b : bar})['a'];",
        options: [{
            beforeColon: true,
            afterColon: true
        }]
    }, {
        code: [
            "var obj = {",
            "    'a'     : (42 - 12),",
            "    foobar  : 'value',",
            "    [(expr)]: val",
            "};"
        ].join("\n"),
        options: [{
            align: "colon"
        }],
        parserOptions: { ecmaVersion: 6 }
    }, {
        code: [
            "callExpr(arg, {",
            "    key       :val,",
            "    'another' :false,",
            "    [compute] :'value'",
            "});"
        ].join("\n"),
        options: [{
            align: "colon",
            beforeColon: true,
            afterColon: false
        }],
        parserOptions: { ecmaVersion: 6 }
    }, {
        code: [
            "var obj = {",
            "    a:        (42 - 12),",
            "    'foobar': 'value',",
            "    bat:      function() {",
            "        return this.a;",
            "    },",
            "    baz: 42",
            "};"
        ].join("\n"),
        options: [{
            align: "value"
        }]
    }, {
        code: [
            "callExpr(arg, {",
            "    'asdf' :val,",
            "    foobar :false,",
            "    key :   value",
            "});"
        ].join("\n"),
        options: [{
            align: "value",
            beforeColon: true,
            afterColon: false
        }]
    }, {
        code: [
            "({",
            "    a  : 0,",
            "    // same group",
            "    bcd: 0, /*",
            "    end of group */",
            "",
            "    // different group",
            "    e: 0,",
            "    /* group b */",
            "    f: 0",
            "})"
        ].join("\n"),
        options: [{
            align: "colon"
        }]
    }, {
        code: [
            "obj = { key ",
            " : ",
            " longName };"
        ].join("\n"),
        options: [{
            beforeColon: true,
            afterColon: true
        }]
    }, {
        code: [
            "obj = { key ",
            "    :longName };"
        ].join("\n"),
        options: [{
            beforeColon: true,
            afterColon: false,
            mode: "minimum"
        }]
    }, {
        code: "obj = { key     :longName };",
        options: [{
            beforeColon: true,
            afterColon: false,
            mode: "minimum"
        }]
    }, {
        code: "var obj = { get fn() { return 42; } };",
        options: [{}]
    }, {
        code: "({ get fn() {} })",
        options: [{ align: "colon" }]
    }, {
        code: "var obj = {foo: 'fee', bar: 'bam'};",
        options: [{ align: "colon" }]
    }, {
        code: "var obj = {a: 'foo', bar: 'bam'};",
        options: [{ align: "colon" }]
    }, {
        code: [
            "var x = {",
            "    foo: 10",
            "  , b  : 20",
            "};"
        ].join("\n"),
        options: [{ align: "colon" }]
    }, {
        code: [
            "var x = {",
            "    foo : 10",
            "  , b   : 20",
            "};"
        ].join("\n"),
        options: [{ align: "colon", beforeColon: true }]
    }, {
        code: [
            "var x = {",
            "        foo: 10,",
            " /*lol*/b  : 20",
            "};"
        ].join("\n"),
        options: [{ align: "colon" }]
    }, {
        code: [
            "var a = 'a';",
            "var b = 'b';",
            "",
            "export default {",
            "    a,",
            "    b",
            "};"
        ].join("\n"),
        parserOptions: { sourceType: "module" },
        options: [{ align: "value" }]
    }, {
        code: [
            "var test = {",
            "    prop: 123,",
            "    a,",
            "    b",
            "};"
        ].join("\n"),
        parserOptions: { ecmaVersion: 6 }
    }, {
        code: [
            "var test = {",
            "    prop: 456,",
            "    c,",
            "    d",
            "};"
        ].join("\n"),
        parserOptions: { ecmaVersion: 6 },
        options: [{ align: "value" }]
    }, {
        code: [
            "var obj = {",
            "    foobar: 123,",
            "    prop,",
            "    baz:    456",
            "};"
        ].join("\n"),
        parserOptions: { ecmaVersion: 6 },
        options: [{ align: "value" }]
    }, {
        code: [
            "var test = {",
            "    prop: 123,",
            "    a() { }",
            "};"
        ].join("\n"),
        parserOptions: { ecmaVersion: 6 }
    }, {
        code: [
            "var test = {",
            "    prop: 123,",
            "    a() { },",
            "    b() { }",
            "};"
        ].join("\n"),
        parserOptions: { ecmaVersion: 6 },
        options: [{ align: "value" }]
    }, {
        code: [
            "var obj = {",
            "    foobar: 123,",
            "    method() { },",
            "    baz:    456",
            "};"
        ].join("\n"),
        parserOptions: { ecmaVersion: 6 },
        options: [{ align: "value" }]
    }, {
        code: [
            "var obj = {",
            "    foobar: 123,",
            "    method() {",
            "        return 42;",
            "    },",
            "    baz: 456",
            "};"
        ].join("\n"),
        parserOptions: { ecmaVersion: 6 },
        options: [{ align: "value" }]
    }, {
        code: [
            "var obj = {",
            "    foo : foo",
            "  , bar : bar",
            "  , cats: cats",
            "};"
        ].join("\n"),
        options: [{ align: "colon" }]
    }, {
        code: [
            "var obj = { foo : foo",
            "          , bar : bar",
            "          , cats: cats",
            "};"
        ].join("\n"),
        options: [{ align: "colon" }]
    }, {
        code: [
            "var obj = {",
            "    foo :  foo",
            "  , bar :  bar",
            "  , cats : cats",
            "};"
        ].join("\n"),
        options: [{
            align: "value",
            beforeColon: true
        }]
    },

    // https://github.com/eslint/eslint/issues/4763
    {
        code: "({a : foo, ...x, b : bar})['a'];",
        options: [{
            beforeColon: true,
            afterColon: true
        }],
        parserOptions: { ecmaVersion: 6, ecmaFeatures: { experimentalObjectRestSpread: true } }
    }, {
        code: [
            "var obj = {",
            "    'a'     : (42 - 12),",
            "    ...x,",
            "    foobar  : 'value',",
            "    [(expr)]: val",
            "};"
        ].join("\n"),
        options: [{
            align: "colon"
        }],
        parserOptions: { ecmaVersion: 6, ecmaFeatures: { experimentalObjectRestSpread: true } }
    }, {
        code: [
            "callExpr(arg, {",
            "    key       :val,",
            "    ...x,",
            "    ...y,",
            "    'another' :false,",
            "    [compute] :'value'",
            "});"
        ].join("\n"),
        options: [{
            align: "colon",
            beforeColon: true,
            afterColon: false
        }],
        parserOptions: { ecmaVersion: 6, ecmaFeatures: { experimentalObjectRestSpread: true } }
    }, {
        code: [
            "var obj = {",
            "    a:        (42 - 12),",
            "    ...x,",
            "    'foobar': 'value',",
            "    bat:      function() {",
            "        return this.a;",
            "    },",
            "    baz: 42",
            "};"
        ].join("\n"),
        options: [{
            align: "value"
        }],
        parserOptions: { ecmaVersion: 6, ecmaFeatures: { experimentalObjectRestSpread: true } }
    }, {
        code: [
            "({",
            "    ...x,",
            "    a  : 0,",
            "    // same group",
            "    bcd: 0, /*",
            "    end of group */",
            "",
            "    // different group",
            "    e: 0,",
            "    ...y,",
            "    /* group b */",
            "    f: 0",
            "})"
        ].join("\n"),
        options: [{
            align: "colon"
        }],
        parserOptions: { ecmaVersion: 6, ecmaFeatures: { experimentalObjectRestSpread: true } }
    },

    // https://github.com/eslint/eslint/issues/4792
    {
        code: [
            "({",
            "    a: 42,",
            "    get b() { return 42; }",
            "})"
        ].join("\n"),
        options: [{
            align: "colon"
        }]
    }, {
        code: [
            "({",
            "    set a(b) { b; },",
            "    c: 42",
            "})"
        ].join("\n"),
        options: [{
            align: "value"
        }]
    }, {
        code: [
            "({",
            "    a  : 42,",
            "    get b() { return 42; },",
            "    set c(v) { v; },",
            "    def: 42",
            "})"
        ].join("\n"),
        options: [{
            align: "colon"
        }]
    }, {
        code: [
            "({",
            "    a  : 42,",
            "    get b() { return 42; },",
            "    set c(v) { v; },",
            "    def: 42",
            "})"
        ].join("\n"),
        options: [{
            multiLine: {
                afterColon: true,
                align: "colon"
            }
        }]
    }, {
        code: [
            "({",
            "    a   : 42,",
            "    get b() { return 42; },",
            "    set c(v) { v; },",
            "    def : 42,",
            "    obj : {a: 1, b: 2, c: 3}",
            "})"
        ].join("\n"),
        options: [{
            singleLine: {
                afterColon: true,
                beforeColon: false
            },
            multiLine: {
                afterColon: true,
                beforeColon: true,
                align: "colon"
            }
        }]
    }, {
        code: [
            "({",
            "    a   : 42,",
            "    get b() { return 42; },",
            "    set c(v) { v; },",
            "    def : 42,",
            "    def : {a: 1, b: 2, c: 3}",
            "})"
        ].join("\n"),
        options: [{
            multiLine: {
                afterColon: true,
                beforeColon: true,
                align: "colon"
            },
            singleLine: {
                afterColon: true,
                beforeColon: false
            }
        }]
    }, {
        code: [
            "var obj = {",
            "    foobar: 42,",
            "    bat:    2",
            "};"
        ].join("\n"),
        options: [{
            singleLine: {
                beforeColon: false,
                afterColon: true,
                mode: "strict"
            },
            multiLine: {
                beforeColon: false,
                afterColon: true,
                mode: "minimum"
            }
        }]
    },

    // https://github.com/eslint/eslint/issues/5724
    {
        code: "({...object})",
        options: [{
            align: "colon"
        }],
        parserOptions: { ecmaVersion: 6, ecmaFeatures: { experimentalObjectRestSpread: true } }
    },

    // https://github.com/eslint/eslint/issues/5613

    { // if `align` is an object, but `on` is not declared, `on` defaults to `colon`
        code: [
            "({",
            "    longName: 1,",
            "    small   : 2,",
            "    f       : function() {",
            "    },",
            "    xs :3",
            "})"
        ].join("\n"),
        options: [{
            align: {
                afterColon: true
            },
            beforeColon: true,
            afterColon: false
        }],
        parserOptions: { ecmaVersion: 6, ecmaFeatures: { experimentalObjectRestSpread: true } }
    }, {
        code: [
            "({",
            "    longName: 1,",
            "    small:    2,",
            "    f:        function() {",
            "    },",
            "    xs :3",
            "})"
        ].join("\n"),
        options: [{
            align: {
                on: "value",
                afterColon: true
            },
            beforeColon: true,
            afterColon: false
        }],
        parserOptions: { ecmaVersion: 6, ecmaFeatures: { experimentalObjectRestSpread: true } }
    }, {
        code: [
            "({",
            "    longName : 1,",
            "    small :    2,",
            "    xs :       3",
            "})"
        ].join("\n"),
        options: [{
            multiLine: {
                align: {
                    on: "value",
                    beforeColon: true,
                    afterColon: true
                }
            }
        }],
        parserOptions: { ecmaVersion: 6, ecmaFeatures: { experimentalObjectRestSpread: true } }
    }, {
        code: [
            "({",
            "    longName :1,",
            "    small    :2,",
            "    xs       :3",
            "})"
        ].join("\n"),
        options: [{
            align: {
                on: "colon",
                beforeColon: true,
                afterColon: false
            }
        }],
        parserOptions: { ecmaVersion: 6, ecmaFeatures: { experimentalObjectRestSpread: true } },
        errors: []
    }, {
        code: [
            "({",
            "    longName: 1,",
            "    small   : 2,",
            "    xs      :        3",
            "})"
        ].join("\n"),
        options: [{
            align: {
                on: "colon",
                beforeColon: false,
                afterColon: true,
                mode: "minimum"
            }
        }],
        parserOptions: { ecmaVersion: 6, ecmaFeatures: { experimentalObjectRestSpread: true } }
    }, {
        code: [
            "({",
            "    longName: 1,",
            "    small   : 2,",
            "    xs      : 3",
            "})"
        ].join("\n"),
        options: [{
            multiLine: {
                align: {
                    on: "colon",
                    beforeColon: false,
                    afterColon: true
                }
            }
        }],
        parserOptions: { ecmaVersion: 6, ecmaFeatures: { experimentalObjectRestSpread: true } }
    }, {
        code: [
            "({",
            "    func: function() {",
            "        var test = true;",
            "    },",
            "    longName : 1,",
            "    small    : 2,",
            "    xs       : 3,",
            "    func2    : function() {",
            "        var test2 = true;",
            "    },",
            "    internalGroup: {",
            "        internal : true,",
            "        ext      : false",
            "    }",
            "})"
        ].join("\n"),
        options: [{
            singleLine: {
                beforeColon: false,
                afterColon: true
            },
            multiLine: {
                beforeColon: false,
                afterColon: true
            },
            align: {
                on: "colon",
                beforeColon: true,
                afterColon: true
            }
        }],
        parserOptions: { ecmaVersion: 6, ecmaFeatures: { experimentalObjectRestSpread: true } }
    }, {
        code: [
            "({",
            "    func: function() {",
            "        var test = true;",
            "    },",
            "    longName: 1,",
            "    small:    2,",
            "    xs:       3,",
            "    func2:    function() {",
            "        var test2 = true;",
            "    },",
            "    final: 10",
            "})"
        ].join("\n"),
        options: [{
            singleLine: {
                beforeColon: false,
                afterColon: true
            },
            multiLine: {
                align: {
                    on: "value",
                    beforeColon: false,
                    afterColon: true
                },
                beforeColon: false,
                afterColon: true
            }
        }],
        parserOptions: { ecmaVersion: 6, ecmaFeatures: { experimentalObjectRestSpread: true } }
    }, {
        code: [
            "({",
            "    f:function() {",
            "        var test = true;",
            "    },",
            "    stateName : 'NY',",
            "    borough   : 'Brooklyn',",
            "    zip       : 11201,",
            "    f2        : function() {",
            "        var test2 = true;",
            "    },",
            "    final:10",
            "})"
        ].join("\n"),
        options: [{
            multiLine: {
                align: {
                    on: "colon",
                    beforeColon: true,
                    afterColon: true,
                    mode: "strict"
                },
                beforeColon: false,
                afterColon: false
            }
        }],
        parserOptions: { ecmaVersion: 6, ecmaFeatures: { experimentalObjectRestSpread: true } }
    }, {
        code: [
            "var obj = {",
            "    key1: 1,",
            "",
            "    key2:    2,",
            "    key3:    3,",
            "",
            "    key4: 4",
            "}"
        ].join("\n"),
        options: [{
            multiLine: {
                beforeColon: false,
                afterColon: true,
                mode: "strict",
                align: {
                    beforeColon: false,
                    afterColon: true,
                    on: "colon",
                    mode: "minimum"
                }
            }
        }],
        parserOptions: { ecmaVersion: 6, ecmaFeatures: { experimentalObjectRestSpread: true } }
    }, {
        code: [
            "var obj = {",
            "    key1: 1,",
            "",
            "    key2:    2,",
            "    key3:    3,",
            "",
            "    key4: 4",
            "}"
        ].join("\n"),
        options: [{
            multiLine: {
                beforeColon: false,
                afterColon: true,
                mode: "strict"
            },
            align: {
                beforeColon: false,
                afterColon: true,
                on: "colon",
                mode: "minimum"
            }
        }],
        parserOptions: { ecmaVersion: 6, ecmaFeatures: { experimentalObjectRestSpread: true } }
    }],

    invalid: [{
        code: "var bat = function() { return { foo:bar, 'key': value }; };",
        output: "var bat = function() { return { foo:bar, 'key':value }; };",
        options: [{
            beforeColon: false,
            afterColon: false
        }],
        errors: [{ message: "Extra space before value for key 'key'.", type: "Identifier", line: 1, column: 49 }]
    }, {
        code: "var obj = { [ (a + b) ]:value };",
        output: "var obj = { [ (a + b) ]: value };",
        options: [{}],
        parserOptions: { ecmaVersion: 6 },
        errors: [{ message: "Missing space before value for computed key 'a + b'.", type: "Identifier", line: 1, column: 25 }]
    }, {
        code: "fn({ foo:bar, 'key' :value });",
        output: "fn({ foo:bar, 'key':value });",
        options: [{
            beforeColon: false,
            afterColon: false
        }],
        errors: [{ message: "Extra space after key 'key'.", type: "Literal", line: 1, column: 15 }]
    }, {
        code: "var obj = {prop :(42)};",
        output: "var obj = {prop : (42)};",
        options: [{
            beforeColon: true,
            afterColon: true
        }],
        errors: [{ message: "Missing space before value for key 'prop'.", type: "Literal", line: 1, column: 18 }]
    }, {
        code: "({'a' : foo, b: bar() }).b();",
        output: "({'a' : foo, b : bar() }).b();",
        options: [{
            beforeColon: true,
            afterColon: true
        }],
        errors: [{ message: "Missing space after key 'b'.", type: "Identifier", line: 1, column: 14 }]
    }, {
        code: "({'a'  :foo(), b:  bar() }).b();",
        output: "({'a' : foo(), b : bar() }).b();",
        options: [{
            beforeColon: true,
            afterColon: true
        }],
        errors: [
            { message: "Extra space after key 'a'.", type: "Literal", line: 1, column: 3 },
            { message: "Missing space before value for key 'a'.", type: "CallExpression", line: 1, column: 9 },
            { message: "Missing space after key 'b'.", type: "Identifier", line: 1, column: 16 },
            { message: "Extra space before value for key 'b'.", type: "CallExpression", line: 1, column: 20 }
        ]
    }, {
        code: "bar = { key:value };",
        output: "bar = { key: value };",
        options: [{
            beforeColon: false,
            afterColon: true
        }],
        errors: [{ message: "Missing space before value for key 'key'.", type: "Identifier", line: 1, column: 13 }]
    }, {
        code: [
            "obj = {",
            "    key:   value,",
            "    foobar:fn(),",
            "    'a'   : (2 * 2)",
            "};"
        ].join("\n"),
        output: [
            "obj = {",
            "    key   : value,",
            "    foobar: fn(),",
            "    'a'   : (2 * 2)",
            "};"
        ].join("\n"),
        options: [{
            align: "colon"
        }],
        errors: [
            { message: "Missing space after key 'key'.", type: "Identifier", line: 2, column: 5 },
            { message: "Extra space before value for key 'key'.", type: "Identifier", line: 2, column: 12 },
            { message: "Missing space before value for key 'foobar'.", type: "CallExpression", line: 3, column: 12}
        ]
    }, {
        code: [
            "({",
            "    'a' : val,",
            "    foo:fn(),",
            "    b    :[42],",
            "    c   :call()",
            "}).a();"
        ].join("\n"),
        output: [
            "({",
            "    'a' :val,",
            "    foo :fn(),",
            "    b   :[42],",
            "    c   :call()",
            "}).a();"
        ].join("\n"),
        options: [{
            align: "colon",
            beforeColon: true,
            afterColon: false
        }],
        errors: [
            { message: "Extra space before value for key 'a'.", type: "Identifier", line: 2, column: 11 },
            { message: "Missing space after key 'foo'.", type: "Identifier", line: 3, column: 5 },
            { message: "Extra space after key 'b'.", type: "Identifier", line: 4, column: 5 }
        ]
    }, {
        code: [
            "var obj = {",
            "    a:    fn(),",
            "    'b' : 42,",
            "    foo:(bar),",
            "    bat: 'valid',",
            "    [a] : value",
            "};"
        ].join("\n"),
        output: [
            "var obj = {",
            "    a:   fn(),",
            "    'b': 42,",
            "    foo: (bar),",
            "    bat: 'valid',",
            "    [a]: value",
            "};"
        ].join("\n"),
        options: [{
            align: "value"
        }],
        parserOptions: { ecmaVersion: 6 },
        errors: [
            { message: "Extra space before value for key 'a'.", type: "CallExpression", line: 2, column: 11 },
            { message: "Extra space after key 'b'.", type: "Literal", line: 3, column: 5 },
            { message: "Missing space before value for key 'foo'.", type: "Identifier", line: 4, column: 9 },
            { message: "Extra space after computed key 'a'.", type: "Identifier", line: 6, column: 7 }
        ]
    }, {
        code: [
            "foo = {",
            "    a:  value,",
            "    b :  42,",
            "    foo :['a'],",
            "    bar : call()",
            "};"
        ].join("\n"),
        output: [
            "foo = {",
            "    a :  value,",
            "    b :  42,",
            "    foo :['a'],",
            "    bar :call()",
            "};"
        ].join("\n"),
        options: [{
            align: "value",
            beforeColon: true,
            afterColon: false
        }],
        errors: [
            { message: "Missing space after key 'a'.", type: "Identifier", line: 2, column: 5 },
            { message: "Extra space before value for key 'bar'.", type: "CallExpression", line: 5, column: 11 }
        ]
    }, {
        code: [
            "({",
            "    a : 0,",
            "    bcd: 0,",
            "",
            "    e: 0,",
            "    fg:0",
            "})"
        ].join("\n"),
        output: [
            "({",
            "    a  : 0,",
            "    bcd: 0,",
            "",
            "    e : 0,",
            "    fg: 0",
            "})"
        ].join("\n"),
        options: [{
            align: "colon"
        }],
        errors: [
            { message: "Missing space after key 'a'.", type: "Identifier", line: 2, column: 5 },
            { message: "Missing space after key 'e'.", type: "Identifier", line: 5, column: 5 },
            { message: "Missing space before value for key 'fg'.", type: "Literal", line: 6, column: 8 }
        ]
    }, {
        code: [
            "foo = {",
            "    key:",
            "        longValueName,",
            "    key2",
            "        :anotherLongValue",
            "};"
        ].join("\n"),
        output: [
            "foo = {",
            "    key:longValueName,",
            "    key2:anotherLongValue",
            "};"
        ].join("\n"),
        options: [{
            beforeColon: false,
            afterColon: false
        }],
        errors: [
            { message: "Extra space before value for key 'key'.", type: "Identifier", line: 3, column: 9 },
            { message: "Extra space after key 'key2'.", type: "Identifier", line: 4, column: 5 }
        ]
    }, {
        code: [
            "foo = {",
            "    key1: 42,",
            "    // still the same group",
            "    key12: '42', /*",
            "",
            "    */",
            "    key123: 'forty two'",
            "};"
        ].join("\n"),
        output: [
            "foo = {",
            "    key1:   42,",
            "    // still the same group",
            "    key12:  '42', /*",
            "",
            "    */",
            "    key123: 'forty two'",
            "};"
        ].join("\n"),
        options: [{
            align: "value"
        }],
        errors: [
            { message: "Missing space before value for key 'key1'.", type: "Literal" },
            { message: "Missing space before value for key 'key12'.", type: "Literal" }
        ]
    }, {
        code: "foo = { key:(1+2) };",
        output: "foo = { key: (1+2) };",
        errors: [
            { message: "Missing space before value for key 'key'.", line: 1, column: 13, type: "BinaryExpression" }
        ]
    }, {
        code: "foo = { key:( ( (1+2) ) ) };",
        output: "foo = { key: ( ( (1+2) ) ) };",
        errors: [
            { message: "Missing space before value for key 'key'.", line: 1, column: 13, type: "BinaryExpression" }
        ]
    }, {
        code: "var obj = {a  : 'foo', bar: 'bam'};",
        output: "var obj = {a: 'foo', bar: 'bam'};",
        options: [{ align: "colon" }],
        errors: [
            { message: "Extra space after key 'a'.", line: 1, column: 12, type: "Identifier" }
        ]
    }, {
        code: [
            "var x = {",
            "    foo: 10",
            "  , b   : 20",
            "};"
        ].join("\n"),
        output: [
            "var x = {",
            "    foo: 10",
            "  , b  : 20",
            "};"
        ].join("\n"),
        options: [{ align: "colon" }],
        errors: [
            { message: "Extra space after key 'b'.", line: 3, column: 5, type: "Identifier" }
        ]
    }, {
        code: [
            "var x = {",
            "        foo : 10,",
            " /*lol*/  b : 20",
            "};"
        ].join("\n"),
        output: [
            "var x = {",
            "        foo : 10,",
            " /*lol*/  b   : 20",
            "};"
        ].join("\n"),
        options: [{ align: "colon", beforeColon: true }],
        errors: [
            { message: "Missing space after key 'b'.", line: 3, column: 11, type: "Identifier" }
        ]
    }, {
        code: [
            "obj = { key ",
            " :     longName };"
        ].join("\n"),
        output: [
            "obj = { key ",
            " : longName };"
        ].join("\n"),
        options: [{
            beforeColon: true,
            afterColon: true
        }],
        errors: [
            { message: "Extra space before value for key 'key'.", line: 2, column: 8, type: "Identifier" }
        ]
    }, {
        code: [
            "var obj = {",
            "    foobar: 123,",
            "    prop,",
            "    baz: 456",
            "};"
        ].join("\n"),
        output: [
            "var obj = {",
            "    foobar: 123,",
            "    prop,",
            "    baz:    456",
            "};"
        ].join("\n"),
        parserOptions: { ecmaVersion: 6 },
        options: [{ align: "value" }],
        errors: [
            { message: "Missing space before value for key 'baz'.", line: 4, column: 10, type: "Literal" }
        ]
    }, {
        code: [
            "var obj = {",
            "    foobar:  123,",
            "    prop,",
            "    baz:    456",
            "};"
        ].join("\n"),
        output: [
            "var obj = {",
            "    foobar: 123,",
            "    prop,",
            "    baz:    456",
            "};"
        ].join("\n"),
        parserOptions: { ecmaVersion: 6 },
        options: [{ align: "value" }],
        errors: [
            { message: "Extra space before value for key 'foobar'.", line: 2, column: 14, type: "Literal" }
        ]
    }, {
        code: [
            "var obj = {",
            "    foobar: 123,",
            "    method() { },",
            "    baz: 456",
            "};"
        ].join("\n"),
        output: [
            "var obj = {",
            "    foobar: 123,",
            "    method() { },",
            "    baz:    456",
            "};"
        ].join("\n"),
        parserOptions: { ecmaVersion: 6 },
        options: [{ align: "value" }],
        errors: [
            { message: "Missing space before value for key 'baz'.", line: 4, column: 10, type: "Literal" }
        ]
    }, {
        code: [
            "var obj = {",
            "    foobar:  123,",
            "    method() { },",
            "    baz:    456",
            "};"
        ].join("\n"),
        output: [
            "var obj = {",
            "    foobar: 123,",
            "    method() { },",
            "    baz:    456",
            "};"
        ].join("\n"),
        parserOptions: { ecmaVersion: 6 },
        options: [{ align: "value" }],
        errors: [
            { message: "Extra space before value for key 'foobar'.", line: 2, column: 14, type: "Literal" }
        ]
    }, {
        code: [
            "var obj = {",
            "    foobar: 123,",
            "    method() {",
            "        return 42;",
            "    },",
            "    baz:    456",
            "};"
        ].join("\n"),
        output: [
            "var obj = {",
            "    foobar: 123,",
            "    method() {",
            "        return 42;",
            "    },",
            "    baz: 456",
            "};"
        ].join("\n"),
        parserOptions: { ecmaVersion: 6 },
        options: [{ align: "value" }],
        errors: [
            { message: "Extra space before value for key 'baz'.", line: 6, column: 13, type: "Literal" }
        ]
    }, {
        code: [
            "var obj = {",
            "    foo: foo",
            "  , cats: cats",
            "};"
        ].join("\n"),
        output: [
            "var obj = {",
            "    foo : foo",
            "  , cats: cats",
            "};"
        ].join("\n"),
        options: [{ align: "colon" }],
        errors: [
            { message: "Missing space after key 'foo'.", line: 2, column: 5, type: "Identifier" }
        ]
    }, {
        code: [
            "var obj = {",
            "    foo : foo",
            "  , cats:  cats",
            "};"
        ].join("\n"),
        output: [
            "var obj = {",
            "    foo : foo",
            "  , cats: cats",
            "};"
        ].join("\n"),
        options: [{ align: "colon" }],
        errors: [
            { message: "Extra space before value for key 'cats'.", line: 3, column: 12, type: "Identifier" }
        ]
    }, {
        code: [
            "var obj = { foo: foo",
            "          , cats: cats",
            "};"
        ].join("\n"),
        output: [
            "var obj = { foo : foo",
            "          , cats: cats",
            "};"
        ].join("\n"),
        options: [{ align: "colon" }],
        errors: [
            { message: "Missing space after key 'foo'.", line: 1, column: 13, type: "Identifier" }
        ]
    }, {
        code: [
            "var obj = { foo  : foo",
            "          , cats: cats",
            "};"
        ].join("\n"),
        options: [{ align: "colon" }],
        errors: [
            { message: "Extra space after key 'foo'.", line: 1, column: 13, type: "Identifier" }
        ]
    }, {
        code: [
            "var obj = { foo :foo",
            "          , cats: cats",
            "};"
        ].join("\n"),
        output: [
            "var obj = { foo : foo",
            "          , cats: cats",
            "};"
        ].join("\n"),
        options: [{ align: "colon" }],
        errors: [
            { message: "Missing space before value for key 'foo'.", line: 1, column: 18, type: "Identifier" }
        ]
    }, {
        code: [
            "var obj = { foo :  foo",
            "          , cats: cats",
            "};"
        ].join("\n"),
        output: [
            "var obj = { foo : foo",
            "          , cats: cats",
            "};"
        ].join("\n"),
        options: [{ align: "colon" }],
        errors: [
            { message: "Extra space before value for key 'foo'.", line: 1, column: 20, type: "Identifier" }
        ]
    }, {
        code: [
            "var obj = { foo : foo",
            "          , cats:  cats",
            "};"
        ].join("\n"),
        output: [
            "var obj = { foo : foo",
            "          , cats: cats",
            "};"
        ].join("\n"),
        options: [{ align: "colon" }],
        errors: [
            { message: "Extra space before value for key 'cats'.", line: 2, column: 20, type: "Identifier" }
        ]
    },

    // https://github.com/eslint/eslint/issues/4763
    {
        code: [
            "({",
            "    ...x,",
            "    a : 0,",
            "    // same group",
            "    bcd: 0, /*",
            "    end of group */",
            "",
            "    // different group",
            "    e: 0,",
            "    ...y,",
            "    /* group b */",
            "    f : 0",
            "})"
        ].join("\n"),
        output: [
            "({",
            "    ...x,",
            "    a  : 0,",
            "    // same group",
            "    bcd: 0, /*",
            "    end of group */",
            "",
            "    // different group",
            "    e: 0,",
            "    ...y,",
            "    /* group b */",
            "    f: 0",
            "})"
        ].join("\n"),
        options: [{ align: "colon" }],
        parserOptions: { ecmaVersion: 6, ecmaFeatures: { experimentalObjectRestSpread: true } },
        errors: [
            { message: "Missing space after key 'a'.", line: 3, column: 5, type: "Identifier" },
            { message: "Extra space after key 'f'.", line: 12, column: 5, type: "Identifier" }
        ]
    },

    // https://github.com/eslint/eslint/issues/4792
    {
        code: [
            "({",
            "    a : 42,",
            "    get b() { return 42; }",
            "})"
        ].join("\n"),
        output: [
            "({",
            "    a: 42,",
            "    get b() { return 42; }",
            "})"
        ].join("\n"),
        options: [{
            align: "colon"
        }],
        errors: [
            { message: "Extra space after key 'a'.", line: 2, column: 5, type: "Identifier" }
        ]
    }, {
        code: [
            "({",
            "    set a(b) { b; },",
            "    c : 42",
            "})"
        ].join("\n"),
        output: [
            "({",
            "    set a(b) { b; },",
            "    c: 42",
            "})"
        ].join("\n"),
        options: [{
            align: "value"
        }],
        errors: [
            { message: "Extra space after key 'c'.", line: 3, column: 5, type: "Identifier" }
        ]
    }, {
        code: [
            "({",
            "    a: 42,",
            "    get b() { return 42; },",
            "    set c(v) { v; },",
            "    def: 42",
            "})"
        ].join("\n"),
        output: [
            "({",
            "    a  : 42,",
            "    get b() { return 42; },",
            "    set c(v) { v; },",
            "    def: 42",
            "})"
        ].join("\n"),
        options: [{
            align: "colon"
        }],
        errors: [
            { message: "Missing space after key 'a'.", line: 2, column: 5, type: "Identifier" }
        ]
    }, {
        code: [
            "({",
            "    a :    42,",
            "    get b() { return 42; },",
            "    set c(v) { v; },",
            "    def  :  42,",
            "    def2 : {a1: 1, b1:2, c1:3}",
            "})"
        ].join("\n"),
        output: [
            "({",
            "    a :    42,",
            "    get b() { return 42; },",
            "    set c(v) { v; },",
            "    def  :  42,",
            "    def2 : {a1:1, b1:2, c1:3}",
            "})"
        ].join("\n"),
        options: [{
            singleLine: {
                afterColon: false,
                beforeColon: false
            },
            multiLine: {
                mode: "minimum",
                afterColon: true,
                beforeColon: true,
                align: "value"
            }
        }],
        errors: [
            { message: "Extra space before value for key 'a1'.", line: 6, column: 17, type: "Literal" }
        ]
    }, {
        code: [
            "({",
            "    a  : 42,",
            "    get b() { return 42; },",
            "    set c(v) { v; },",
            "    def: 42,",
            "    de1: {a2: 1, b2 : 2, c2 : 3}",
            "})"
        ].join("\n"),
        output: [
            "({",
            "    a  : 42,",
            "    get b() { return 42; },",
            "    set c(v) { v; },",
            "    def: 42,",
            "    de1: {a2 : 1, b2 : 2, c2 : 3}",
            "})"
        ].join("\n"),
        options: [{
            multiLine: {
                afterColon: true,
                beforeColon: false,
                align: "colon"
            },
            singleLine: {
                afterColon: true,
                beforeColon: true
            }
        }],
        errors: [
            { message: "Missing space after key 'a2'.", line: 6, column: 11, type: "Identifier" }
        ]
    }, {
        code: [
            "obj = {",
            "   get fx() { return 'f'; },",
            "   get gx() { return 'g'; },",
            "   ex:e",
            "};"
        ].join("\n"),
        output: [
            "obj = {",
            "   get fx() { return 'f'; },",
            "   get gx() { return 'g'; },",
            "   ex: e",
            "};"
        ].join("\n"),
        options: [{
            align: "colon",
            beforeColon: false,
            afterColon: true,
            mode: "minimum"
        }],
        errors: [
            { message: "Missing space before value for key 'ex'.", line: 4, column: 7, type: "Identifier" }
        ]
    }, {
        code: [
            "obj = {",
            "   get fx() { return 'f'; },",
            "   get gx() { return 'g'; },",
            "   ex : e",
            "};"
        ].join("\n"),
        output: [
            "obj = {",
            "   get fx() { return 'f'; },",
            "   get gx() { return 'g'; },",
            "   ex: e",
            "};"
        ].join("\n"),
        options: [{
            align: "colon",
            beforeColon: false,
            afterColon: true,
            mode: "minimum"
        }],
        errors: [
            { message: "Extra space after key 'ex'.", line: 4, column: 4, type: "Identifier" }
        ]
    }, {
        code: [
            "({",
            "    aInv :43,",
            "    get b() { return 43; },",
            "    set c(v) { v; },",
            "    defInv: 43",
            "})"
        ].join("\n"),
        output: [
            "({",
            "    aInv  : 43,",
            "    get b() { return 43; },",
            "    set c(v) { v; },",
            "    defInv: 43",
            "})"
        ].join("\n"),
        options: [{
            multiLine: {
                afterColon: true,
                align: "colon"
            }
        }],
        errors: [
            { message: "Missing space after key 'aInv'.", line: 2, column: 5, type: "Identifier" },
            { message: "Missing space before value for key 'aInv'.", line: 2, column: 11, type: "Literal" }
        ]
    },

    // https://github.com/eslint/eslint/issues/5724
    {
        code: "({ a:b, ...object, c : d })",
        output: "({ a: b, ...object, c: d })",
        options: [{ align: "colon" }],
        parserOptions: { ecmaVersion: 6, ecmaFeatures: { experimentalObjectRestSpread: true } },
        errors: [
            { message: "Missing space before value for key 'a'.", line: 1, column: 6, type: "Identifier" },
            { message: "Extra space after key 'c'.", line: 1, column: 20, type: "Identifier" }
        ]
    },

    // https://github.com/eslint/eslint/issues/5613
    {
        code: [
            "({",
            "    longName:1,",
            "    small    :2,",
            "    xs      : 3",
            "})"
        ].join("\n"),
        output: [
            "({",
            "    longName : 1,",
            "    small    : 2,",
            "    xs       : 3",
            "})"
        ].join("\n"),
        options: [{
            align: {
                on: "colon",
                beforeColon: true,
                afterColon: true,
                mode: "strict"
            }
        }],
        parserOptions: { ecmaVersion: 6, ecmaFeatures: { experimentalObjectRestSpread: true } },
        errors: [
            { message: "Missing space after key \'longName\'.", line: 2, column: 5, type: "Identifier" },
            { message: "Missing space before value for key \'longName\'.", line: 2, column: 14, type: "Literal" },
            { message: "Missing space before value for key \'small\'.", line: 3, column: 15, type: "Literal" },
            { message: "Missing space after key \'xs\'.", line: 4, column: 5, type: "Identifier" }
        ]
    }, {
        code: [
            "({",
            "    func:function() {",
            "        var test = true;",
            "    },",
            "    longName: 1,",
            "    small: 2,",
            "    xs            : 3,",
            "    func2    : function() {",
            "        var test2 = true;",
            "    },",
            "    singleLine : 10",
            "})"
        ].join("\n"),
        output: [
            "({",
            "    func: function() {",
            "        var test = true;",
            "    },",
            "    longName : 1,",
            "    small    : 2,",
            "    xs       : 3,",
            "    func2    : function() {",
            "        var test2 = true;",
            "    },",
            "    singleLine: 10",
            "})"
        ].join("\n"),
        options: [{
            multiLine: {
                beforeColon: false,
                afterColon: true
            },
            align: {
                on: "colon",
                beforeColon: true,
                afterColon: true,
                mode: "strict"
            }
        }],
        parserOptions: { ecmaVersion: 6, ecmaFeatures: { experimentalObjectRestSpread: true } },
        errors: [
            { message: "Missing space before value for key \'func\'.", line: 2, column: 10, type: "FunctionExpression" },
            { message: "Missing space after key \'longName\'.", line: 5, column: 5, type: "Identifier" },
            { message: "Missing space after key \'small\'.", line: 6, column: 5, type: "Identifier" },
            { message: "Extra space after key \'xs\'.", line: 7, column: 5, type: "Identifier" },
            { message: "Extra space after key \'singleLine\'.", line: 11, column: 5, type: "Identifier" }
        ]
    }, {
        code: [
            "({",
            "    func:function() {",
            "        var test = false;",
            "    },",
            "    longName :1,",
            "    small :2,",
            "    xs            : 3,",
            "    func2    : function() {",
            "        var test2 = true;",
            "    },",
            "    singleLine : 10",
            "})"
        ].join("\n"),
        output: [
            "({",
            "    func: function() {",
            "        var test = false;",
            "    },",
            "    longName :1,",
            "    small    :2,",
            "    xs       :3,",
            "    func2    :function() {",
            "        var test2 = true;",
            "    },",
            "    singleLine: 10",
            "})"
        ].join("\n"),
        options: [{
            multiLine: {
                beforeColon: false,
                afterColon: true,
                align: {
                    on: "colon",
                    beforeColon: true,
                    afterColon: false,
                    mode: "strict"
                }
            }
        }],
        parserOptions: { ecmaVersion: 6, ecmaFeatures: { experimentalObjectRestSpread: true } },
        errors: [
            { message: "Missing space before value for key \'func\'.", line: 2, column: 10, type: "FunctionExpression" },
            { message: "Missing space after key \'small\'.", line: 6, column: 5, type: "Identifier" },
            { message: "Extra space after key \'xs\'.", line: 7, column: 5, type: "Identifier" },
            { message: "Extra space before value for key \'xs\'.", line: 7, column: 21, type: "Literal" },
            { message: "Extra space before value for key \'func2\'.", line: 8, column: 16, type: "FunctionExpression" },
            { message: "Extra space after key \'singleLine\'.", line: 11, column: 5, type: "Identifier" }
        ]
    }, {
        code: [
            "var obj = {",
            "    key1: 1,",
            "",
            "    key2:    2,",
            "    key3:    3,",
            "",
            "    key4: 4",
            "}"
        ].join("\n"),
        options: [{
            multiLine: {
                beforeColon: false,
                afterColon: true,
                mode: "strict",
                align: {
                    beforeColon: false,
                    afterColon: true,
                    on: "colon",
                }
            }
        }],
        parserOptions: { ecmaVersion: 6, ecmaFeatures: { experimentalObjectRestSpread: true } },
        errors: [
            { message: "Extra space before value for key \'key2\'.", line: 4, column: 14, type: "Literal" },
            { message: "Extra space before value for key \'key3\'.", line: 5, column: 14, type: "Literal" }
        ]
    }, {
        code: [
            "var obj = {",
            "    key1: 1,",
            "",
            "    key2:    2,",
            "    key3:    3,",
            "",
            "    key4: 4",
            "}"
        ].join("\n"),
        options: [{
            multiLine: {
                beforeColon: false,
                afterColon: true,
                mode: "strict"
            },
            align: {
                beforeColon: false,
                afterColon: true,
                on: "colon",
            }
        }],
        parserOptions: { ecmaVersion: 6, ecmaFeatures: { experimentalObjectRestSpread: true } },
        errors: [
            { message: "Extra space before value for key \'key2\'.", line: 4, column: 14, type: "Literal" },
            { message: "Extra space before value for key \'key3\'.", line: 5, column: 14, type: "Literal" }
        ]
    }]
});
