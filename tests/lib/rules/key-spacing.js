/**
 * @fileoverview Tests for key-spacing rule.
 * @author Brandon Mills
 * @copyright 2014 Brandon Mills. All rights reserved.
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/key-spacing"),
    RuleTester = require("../../../lib/testers/rule-tester");

var ruleTester = new RuleTester();
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
        ecmaFeatures: { objectLiteralComputedProperties: true }
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
        ecmaFeatures: { objectLiteralComputedProperties: true }
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
        ecmaFeatures: { objectLiteralComputedProperties: true }
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
            "    :     ",
            " longName };"
        ].join("\n"),
        options: [{
            beforeColon: true,
            afterColon: false,
            mode: "minimum"
        }]
    }, {
        code: "obj = { key     :      longName };",
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
        ecmaFeatures: { modules: true, objectLiteralShorthandProperties: true },
        options: [{ "align": "value" }]
    }, {
        code: [
            "var test = {",
            "    prop: 123,",
            "    a,",
            "    b",
            "};"
        ].join("\n"),
        ecmaFeatures: { objectLiteralShorthandProperties: true }
    }, {
        code: [
            "var test = {",
            "    prop: 456,",
            "    c,",
            "    d",
            "};"
        ].join("\n"),
        ecmaFeatures: { objectLiteralShorthandProperties: true },
        options: [{ "align": "value" }]
    }, {
        code: [
            "var obj = {",
            "    foobar: 123,",
            "    prop,",
            "    baz:    456",
            "};"
        ].join("\n"),
        ecmaFeatures: { objectLiteralShorthandProperties: true },
        options: [{ "align": "value" }]
    }, {
        code: [
            "var test = {",
            "    prop: 123,",
            "    a() { }",
            "};"
        ].join("\n"),
        ecmaFeatures: { objectLiteralShorthandMethods: true }
    }, {
        code: [
            "var test = {",
            "    prop: 123,",
            "    a() { },",
            "    b() { }",
            "};"
        ].join("\n"),
        ecmaFeatures: { objectLiteralShorthandMethods: true },
        options: [{ "align": "value" }]
    }, {
        code: [
            "var obj = {",
            "    foobar: 123,",
            "    method() { },",
            "    baz:    456",
            "};"
        ].join("\n"),
        ecmaFeatures: { objectLiteralShorthandMethods: true },
        options: [{ "align": "value" }]
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
        ecmaFeatures: { objectLiteralShorthandMethods: true },
        options: [{ "align": "value" }]
    }, {
        code: [
            "var obj = {",
            "    foo : foo",
            "  , bar : bar",
            "  , cats: cats",
            "};"
        ].join("\n"),
        options: [{ "align": "colon" }]
    }, {
        code: [
            "var obj = { foo : foo",
            "          , bar : bar",
            "          , cats: cats",
            "};"
        ].join("\n"),
        options: [{ "align": "colon" }]
    }, {
        code: [
            "var obj = {",
            "    foo :  foo",
            "  , bar :  bar",
            "  , cats : cats",
            "};"
        ].join("\n"),
        options: [{
            "align": "value",
            "beforeColon": true
        }]
    }],

    invalid: [{
        code: "var bat = function() { return { foo:bar, 'key': value }; };",
        options: [{
            beforeColon: false,
            afterColon: false
        }],
        errors: [{ message: "Extra space before value for key \"key\".", type: "Identifier", line: 1, column: 49 }]
    }, {
        code: "var obj = { [ (a + b) ]:value };",
        options: [{}],
        ecmaFeatures: { objectLiteralComputedProperties: true },
        errors: [{ message: "Missing space before value for computed key \"(a + b)\".", type: "Identifier", line: 1, column: 24 }]
    }, {
        code: "fn({ foo:bar, 'key' :value });",
        options: [{
            beforeColon: false,
            afterColon: false
        }],
        errors: [{ message: "Extra space after key \"key\".", type: "Literal", line: 1, column: 15 }]
    }, {
        code: "var obj = {prop :(42)};",
        options: [{
            beforeColon: true,
            afterColon: true
        }],
        errors: [{ message: "Missing space before value for key \"prop\".", type: "Literal", line: 1, column: 18 }]
    }, {
        code: "({'a' : foo, b: bar() }).b();",
        options: [{
            beforeColon: true,
            afterColon: true
        }],
        errors: [{ message: "Missing space after key \"b\".", type: "Identifier", line: 1, column: 14 }]
    }, {
        code: "({'a'  :foo(), b:  bar() }).b();",
        options: [{
            beforeColon: true,
            afterColon: true
        }],
        errors: [
            { message: "Extra space after key \"a\".", type: "Literal", line: 1, column: 3 },
            { message: "Missing space before value for key \"a\".", type: "CallExpression", line: 1, column: 9 },
            { message: "Missing space after key \"b\".", type: "Identifier", line: 1, column: 16 },
            { message: "Extra space before value for key \"b\".", type: "CallExpression", line: 1, column: 20 }
        ]
    }, {
        code: "bar = { key:value };",
        options: [{
            beforeColon: false,
            afterColon: true
        }],
        errors: [{ message: "Missing space before value for key \"key\".", type: "Identifier", line: 1, column: 13 }]
    }, {
        code: [
            "obj = {",
            "    key:   value,",
            "    foobar:fn(),",
            "    'a'   : (2 * 2)",
            "};"
        ].join("\n"),
        options: [{
            align: "colon"
        }],
        errors: [
            { message: "Missing space after key \"key\".", type: "Identifier", line: 2, column: 5 },
            { message: "Extra space before value for key \"key\".", type: "Identifier", line: 2, column: 12 },
            { message: "Missing space before value for key \"foobar\".", type: "CallExpression", line: 3, column: 12}
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
        options: [{
            align: "colon",
            beforeColon: true,
            afterColon: false
        }],
        errors: [
            { message: "Extra space before value for key \"a\".", type: "Identifier", line: 2, column: 11 },
            { message: "Missing space after key \"foo\".", type: "Identifier", line: 3, column: 5 },
            { message: "Extra space after key \"b\".", type: "Identifier", line: 4, column: 5 }
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
        options: [{
            align: "value"
        }],
        ecmaFeatures: { objectLiteralComputedProperties: true },
        errors: [
            { message: "Extra space before value for key \"a\".", type: "CallExpression", line: 2, column: 11 },
            { message: "Extra space after key \"b\".", type: "Literal", line: 3, column: 5 },
            { message: "Missing space before value for key \"foo\".", type: "Identifier", line: 4, column: 9 },
            { message: "Extra space after computed key \"a\".", type: "Identifier", line: 6, column: 6 }
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
        options: [{
            align: "value",
            beforeColon: true,
            afterColon: false
        }],
        errors: [
            { message: "Missing space after key \"a\".", type: "Identifier", line: 2, column: 5 },
            { message: "Extra space before value for key \"bar\".", type: "CallExpression", line: 5, column: 11 }
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
        options: [{
            align: "colon"
        }],
        errors: [
            { message: "Missing space after key \"a\".", type: "Identifier", line: 2, column: 5 },
            { message: "Missing space after key \"e\".", type: "Identifier", line: 5, column: 5 },
            { message: "Missing space before value for key \"fg\".", type: "Literal", line: 6, column: 8 }
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
        options: [{
            beforeColon: false,
            afterColon: false
        }],
        errors: [
            { message: "Extra space before value for key \"key\".", type: "Identifier", line: 3, column: 9 },
            { message: "Extra space after key \"key2\".", type: "Identifier", line: 4, column: 5 }
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
        options: [{
            align: "value"
        }],
        errors: [
            { message: "Missing space before value for key \"key1\".", type: "Literal" },
            { message: "Missing space before value for key \"key12\".", type: "Literal" }
        ]
    }, {
        code: "foo = { key:(1+2) };",
        errors: [
            { message: "Missing space before value for key \"key\".", line: 1, column: 13, type: "BinaryExpression" }
        ]
    }, {
        code: "foo = { key:( ( (1+2) ) ) };",
        errors: [
            { message: "Missing space before value for key \"key\".", line: 1, column: 13, type: "BinaryExpression" }
        ]
    }, {
        code: "var obj = {a  : 'foo', bar: 'bam'};",
        options: [{ align: "colon" }],
        errors: [
            { message: "Extra space after key \"a\".", line: 1, column: 12, type: "Identifier" }
        ]
    }, {
        code: [
            "var x = {",
            "    foo: 10",
            "  , b   : 20",
            "};"
        ].join("\n"),
        options: [{ align: "colon" }],
        errors: [
            { message: "Extra space after key \"b\".", line: 3, column: 5, type: "Identifier" }
        ]
    }, {
        code: [
            "var x = {",
            "        foo : 10,",
            " /*lol*/  b : 20",
            "};"
        ].join("\n"),
        options: [{ align: "colon", beforeColon: true }],
        errors: [
            { message: "Missing space after key \"b\".", line: 3, column: 11, type: "Identifier" }
        ]
    }, {
        code: [
            "obj = { key ",
            " :     longName };"
        ].join("\n"),
        options: [{
            beforeColon: true,
            afterColon: true
        }],
        errors: [
            { message: "Extra space before value for key \"key\".", line: 2, column: 8, type: "Identifier" }
        ]
    }, {
        code: [
            "var obj = {",
            "    foobar: 123,",
            "    prop,",
            "    baz: 456",
            "};"
        ].join("\n"),
        ecmaFeatures: { objectLiteralShorthandProperties: true },
        options: [{ "align": "value" }],
        errors: [
            { message: "Missing space before value for key \"baz\".", line: 4, column: 10, type: "Literal" }
        ]
    }, {
        code: [
            "var obj = {",
            "    foobar:  123,",
            "    prop,",
            "    baz:    456",
            "};"
        ].join("\n"),
        ecmaFeatures: { objectLiteralShorthandProperties: true },
        options: [{ "align": "value" }],
        errors: [
            { message: "Extra space before value for key \"foobar\".", line: 2, column: 14, type: "Literal" }
        ]
    }, {
        code: [
            "var obj = {",
            "    foobar: 123,",
            "    method() { },",
            "    baz: 456",
            "};"
        ].join("\n"),
        ecmaFeatures: { objectLiteralShorthandMethods: true },
        options: [{ "align": "value" }],
        errors: [
            { message: "Missing space before value for key \"baz\".", line: 4, column: 10, type: "Literal" }
        ]
    }, {
        code: [
            "var obj = {",
            "    foobar:  123,",
            "    method() { },",
            "    baz:    456",
            "};"
        ].join("\n"),
        ecmaFeatures: { objectLiteralShorthandMethods: true },
        options: [{ "align": "value" }],
        errors: [
            { message: "Extra space before value for key \"foobar\".", line: 2, column: 14, type: "Literal" }
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
        ecmaFeatures: { objectLiteralShorthandMethods: true },
        options: [{ "align": "value" }],
        errors: [
            { message: "Extra space before value for key \"baz\".", line: 6, column: 13, type: "Literal" }
        ]
    }, {
        code: [
            "var obj = {",
            "    foo: foo",
            "  , cats: cats",
            "};"
        ].join("\n"),
        options: [{ "align": "colon" }],
        errors: [
            { message: "Missing space after key \"foo\".", line: 2, column: 5, type: "Identifier" }
        ]
    }, {
        code: [
            "var obj = {",
            "    foo : foo",
            "  , cats:  cats",
            "};"
        ].join("\n"),
        options: [{ "align": "colon" }],
        errors: [
            { message: "Extra space before value for key \"cats\".", line: 3, column: 12, type: "Identifier" }
        ]
    }, {
        code: [
            "var obj = { foo: foo",
            "          , cats: cats",
            "};"
        ].join("\n"),
        options: [{ "align": "colon" }],
        errors: [
            { message: "Missing space after key \"foo\".", line: 1, column: 13, type: "Identifier" }
        ]
    }, {
        code: [
            "var obj = { foo  : foo",
            "          , cats: cats",
            "};"
        ].join("\n"),
        options: [{ "align": "colon" }],
        errors: [
            { message: "Extra space after key \"foo\".", line: 1, column: 13, type: "Identifier" }
        ]
    }, {
        code: [
            "var obj = { foo :foo",
            "          , cats: cats",
            "};"
        ].join("\n"),
        options: [{ "align": "colon" }],
        errors: [
            { message: "Missing space before value for key \"foo\".", line: 1, column: 18, type: "Identifier" }
        ]
    }, {
        code: [
            "var obj = { foo :  foo",
            "          , cats: cats",
            "};"
        ].join("\n"),
        options: [{ "align": "colon" }],
        errors: [
            { message: "Extra space before value for key \"foo\".", line: 1, column: 20, type: "Identifier" }
        ]
    }, {
        code: [
            "var obj = { foo : foo",
            "          , cats:  cats",
            "};"
        ].join("\n"),
        options: [{ "align": "colon" }],
        errors: [
            { message: "Extra space before value for key \"cats\".", line: 2, column: 20, type: "Identifier" }
        ]
    }]
});
