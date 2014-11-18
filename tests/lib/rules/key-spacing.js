/**
 * @fileoverview Tests for key-spacing rule.
 * @author Brandon Mills
 * @copyright 2014 Brandon Mills. All rights reserved.
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslint = require("../../../lib/eslint"),
    ESLintTester = require("eslint-tester");

var eslintTester = new ESLintTester(eslint);
eslintTester.addRuleTest("lib/rules/key-spacing", {

    valid: [{
        code: "var obj = { key: value };",
        args: {}
    }, {
        code: "var foo = { a:bar };",
        args: [2, {
            beforeColon: false,
            afterColon: false
        }]
    }, {
        code: "var foo = { a: bar };",
        args: [2, {
            beforeColon: false,
            afterColon: true
        }]
    }, {
        code: "foo({ 'default': function(){}});",
        args: [2, {
            beforeColon: false,
            afterColon: true
        }]
    }, {
        code: "function foo() { return {\n    key: (foo === 4)\n}; }",
        args: [2, {
            beforeColon: false,
            afterColon: true
        }]
    }, {
        code: "var obj = {'key' :42 };",
        args: [2, {
            beforeColon: true,
            afterColon: false
        }]
    }, {
        code: "({a : foo, b : bar})['a'];",
        args: [2, {
            beforeColon: true,
            afterColon: true
        }]
    }, {
        code: [
            "var obj = {",
            "    'a'   : (42 - 12),",
            "    foobar: 'value'",
            "};"
        ].join("\n"),
        args: [2, {
            align: "colon"
        }]
    }, {
        code: [
            "callExpr(arg, {",
            "    key       :val,",
            "    'another' :false,",
            "});"
        ].join("\n"),
        args: [2, {
            align: "colon",
            beforeColon: true,
            afterColon: false
        }]
    }, {
        code: [
            "var obj = {",
            "    a:        (42 - 12),",
            "    'foobar': 'value',",
            "    bat:      []",
            "};"
        ].join("\n"),
        args: [2, {
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
        args: [2, {
            align: "value",
            beforeColon: true,
            afterColon: false
        }]
    }, {
        code: [
            "({",
            "    a  : 0,",
            "    bcd: 0,",
            "",
            "    e: 0,",
            "    f: 0",
            "})"
        ].join("\n"),
        args: [2, {
            align: "colon"
        }]
    }, {
        code: [
            "obj = { key ",
            " : ",
            " longName };"
        ].join("\n"),
        args: [2, {
            beforeColon: true,
            afterColon: true
        }]
    }, {
        code: "var obj = { get fn() { return 42; } };",
        args: [2, {}]
    }, {
        code: "({ get fn() {} })",
        args: [2, { align: "colon" }]
    }],

    invalid: [{
        code: "var bat = function() { return { foo:bar, 'key': value }; };",
        args: [2, {
            beforeColon: false,
            afterColon: false
        }],
        errors: [{ message: "Extra space before value for key \"key\".", type: "Identifier"}]
    }, {
        code: "fn({ foo:bar, 'key' :value });",
        args: [2, {
            beforeColon: false,
            afterColon: false
        }],
        errors: [{ message: "Extra space after key \"key\".", type: "Literal"}]
    }, {
        code: "var obj = {prop :(42)};",
        args: [2, {
            beforeColon: true,
            afterColon: true
        }],
        errors: [{ message: "Missing space before value for key \"prop\".", type: "Literal"}]
    }, {
        code: "({'a' : foo, b: bar() }).b();",
        args: [2, {
            beforeColon: true,
            afterColon: true
        }],
        errors: [{ message: "Missing space after key \"b\".", type: "Identifier"}]
    }, {
        code: "({'a'  :foo(), b:  bar() }).b();",
        args: [2, {
            beforeColon: true,
            afterColon: true
        }],
        errors: [
            { message: "Extra space after key \"a\".", type: "Literal" },
            { message: "Missing space before value for key \"a\".", type: "CallExpression" },
            { message: "Missing space after key \"b\".", type: "Identifier"},
            { message: "Extra space before value for key \"b\".", type: "CallExpression" }
        ]
    }, {
        code: "bar = { key:value };",
        args: [2, {
            beforeColon: false,
            afterColon: true
        }],
        errors: [{ message: "Missing space before value for key \"key\".", type: "Identifier" }]
    }, {
        code: [
            "obj = {",
            "    key:   value,",
            "    foobar:fn(),",
            "    'a'   : (2 * 2)",
            "};"
        ].join("\n"),
        args: [2, {
            align: "colon"
        }],
        errors: [
            { message: "Missing space after key \"key\".", type: "Identifier" },
            { message: "Extra space before value for key \"key\".", type: "Identifier" },
            { message: "Missing space before value for key \"foobar\".", type: "CallExpression" }
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
        args: [2, {
            align: "colon",
            beforeColon: true,
            afterColon: false
        }],
        errors: [
            { message: "Extra space before value for key \"a\".", type: "Identifier" },
            { message: "Missing space after key \"foo\".", type: "Identifier" },
            { message: "Extra space after key \"b\".", type: "Identifier" }
        ]
    }, {
        code: [
            "var obj = {",
            "    a:    fn(),",
            "    'b' : 42,",
            "    foo:(bar),",
            "    bat: 'valid'",
            "};"
        ].join("\n"),
        args: [2, {
            align: "value"
        }],
        errors: [
            { message: "Extra space before value for key \"a\".", type: "CallExpression" },
            { message: "Extra space after key \"b\".", type: "Literal" },
            { message: "Missing space before value for key \"foo\".", type: "Identifier" }
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
        args: [2, {
            align: "value",
            beforeColon: true,
            afterColon: false
        }],
        errors: [
            { message: "Missing space after key \"a\".", type: "Identifier" },
            { message: "Extra space before value for key \"bar\".", type: "CallExpression" }
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
        args: [2, {
            align: "colon"
        }],
        errors: [
            { message: "Missing space after key \"a\".", type: "Identifier" },
            { message: "Missing space after key \"e\".", type: "Identifier" },
            { message: "Missing space before value for key \"fg\".", type: "Literal" }
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
        args: [2, {
            beforeColon: false,
            afterColon: false
        }],
        errors: [
            { message: "Extra space before value for key \"key\".", type: "Identifier" },
            { message: "Extra space after key \"key2\".", type: "Identifier" }
        ]
    }]

});
