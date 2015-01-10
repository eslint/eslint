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
        errors: [{ message: "Extra space before value for key \"key\".", type: "Identifier", line: 1, column: 48 }]
    }, {
        code: "fn({ foo:bar, 'key' :value });",
        args: [2, {
            beforeColon: false,
            afterColon: false
        }],
        errors: [{ message: "Extra space after key \"key\".", type: "Literal", line: 1, column: 14 }]
    }, {
        code: "var obj = {prop :(42)};",
        args: [2, {
            beforeColon: true,
            afterColon: true
        }],
        errors: [{ message: "Missing space before value for key \"prop\".", type: "Literal", line: 1, column: 17 }]
    }, {
        code: "({'a' : foo, b: bar() }).b();",
        args: [2, {
            beforeColon: true,
            afterColon: true
        }],
        errors: [{ message: "Missing space after key \"b\".", type: "Identifier", line: 1, column: 13 }]
    }, {
        code: "({'a'  :foo(), b:  bar() }).b();",
        args: [2, {
            beforeColon: true,
            afterColon: true
        }],
        errors: [
            { message: "Extra space after key \"a\".", type: "Literal", line: 1, column: 2 },
            { message: "Missing space before value for key \"a\".", type: "CallExpression", line: 1, column: 8 },
            { message: "Missing space after key \"b\".", type: "Identifier", line: 1, column: 15 },
            { message: "Extra space before value for key \"b\".", type: "CallExpression", line: 1, column: 19 }
        ]
    }, {
        code: "bar = { key:value };",
        args: [2, {
            beforeColon: false,
            afterColon: true
        }],
        errors: [{ message: "Missing space before value for key \"key\".", type: "Identifier", line: 1, column: 12 }]
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
            { message: "Missing space after key \"key\".", type: "Identifier", line: 2, column: 4 },
            { message: "Extra space before value for key \"key\".", type: "Identifier", line: 2, column: 11 },
            { message: "Missing space before value for key \"foobar\".", type: "CallExpression", line: 3, column: 11}
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
            { message: "Extra space before value for key \"a\".", type: "Identifier", line: 2, column: 10 },
            { message: "Missing space after key \"foo\".", type: "Identifier", line: 3, column: 4 },
            { message: "Extra space after key \"b\".", type: "Identifier", line: 4, column: 4 }
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
            { message: "Extra space before value for key \"a\".", type: "CallExpression", line: 2, column: 10 },
            { message: "Extra space after key \"b\".", type: "Literal", line: 3, column: 4 },
            { message: "Missing space before value for key \"foo\".", type: "Identifier", line: 4, column: 8 }
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
            { message: "Missing space after key \"a\".", type: "Identifier", line: 2, column: 4 },
            { message: "Extra space before value for key \"bar\".", type: "CallExpression", line: 5, column: 10 }
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
            { message: "Missing space after key \"a\".", type: "Identifier", line: 2, column: 4 },
            { message: "Missing space after key \"e\".", type: "Identifier", line: 5, column: 4 },
            { message: "Missing space before value for key \"fg\".", type: "Literal", line: 6, column: 7 }
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
            { message: "Extra space before value for key \"key\".", type: "Identifier", line: 3, column: 8 },
            { message: "Extra space after key \"key2\".", type: "Identifier", line: 4, column: 4 }
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
        args: [2, {
            align: "value"
        }],
        errors: [
            { message: "Missing space before value for key \"key1\".", type: "Literal" },
            { message: "Missing space before value for key \"key12\".", type: "Literal" }
        ]
    }, {
        code: "foo = { key:(1+2) };",
        errors: [
            { message: "Missing space before value for key \"key\".", line: 1, column: 12, type: "BinaryExpression" }
        ]
    }, {
        code: "foo = { key:( ( (1+2) ) ) };",
        errors: [
            { message: "Missing space before value for key \"key\".", line: 1, column: 12, type: "BinaryExpression" }
        ]
    }]

});
