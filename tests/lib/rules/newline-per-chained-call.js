/**
 * @fileoverview Tests for newline-per-chained-call rule.
 * @author Rajendra Patil
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/newline-per-chained-call"),
    { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("newline-per-chained-call", rule, {
    valid: ["_\n.chain({})\n.map(foo)\n.filter(bar)\n.value();", "a.b.c.d.e.f", "a()\n.b()\n.c\n.e", "var a = m1.m2(); var b = m1.m2();\nvar c = m1.m2()", "var a = m1()\n.m2();", "var a = m1();", "a()\n.b().c.e.d()", "a().b().c.e.d()", "a.b.c.e.d()", "var a = window\n.location\n.href\n.match(/(^[^#]*)/)[0];", "var a = window['location']\n.href\n.match(/(^[^#]*)/)[0];", "var a = window['location'].href.match(/(^[^#]*)/)[0];", {
        code: "var a = m1().m2.m3();",
        options: [{
            ignoreChainWithDepth: 3
        }]
    }, {
        code: "var a = m1().m2.m3().m4.m5().m6.m7().m8;",
        options: [{
            ignoreChainWithDepth: 8
        }]
    }],
    invalid: [{
        code: "_\n.chain({}).map(foo).filter(bar).value();",
        output: "_\n.chain({}).map(foo)\n.filter(bar)\n.value();",
        errors: [{
            messageId: "expected",
            data: { callee: ".filter" },
            line: 2,
            column: 20,
            endLine: 2,
            endColumn: 27
        }, {
            messageId: "expected",
            data: { callee: ".value" },
            line: 2,
            column: 32,
            endLine: 2,
            endColumn: 38
        }]
    }, {
        code: "_\n.chain({})\n.map(foo)\n.filter(bar).value();",
        output: "_\n.chain({})\n.map(foo)\n.filter(bar)\n.value();",
        errors: [{
            messageId: "expected",
            data: { callee: ".value" },
            line: 4,
            column: 13,
            endLine: 4,
            endColumn: 19
        }]
    }, {
        code: "a().b().c().e.d()",
        output: "a().b()\n.c().e.d()",
        errors: [{
            messageId: "expected",
            data: { callee: ".c" },
            line: 1,
            column: 8,
            endLine: 1,
            endColumn: 10
        }]
    }, {
        code: "a.b.c().e().d()",
        output: "a.b.c().e()\n.d()",
        errors: [{
            messageId: "expected",
            data: { callee: ".d" },
            line: 1,
            column: 12,
            endLine: 1,
            endColumn: 14
        }]
    }, {
        code: "_.chain({}).map(a).value(); ",
        output: "_.chain({}).map(a)\n.value(); ",
        errors: [{
            messageId: "expected",
            data: { callee: ".value" },
            line: 1,
            column: 19,
            endLine: 1,
            endColumn: 25
        }]
    }, {
        code: "var a = m1.m2();\n var b = m1.m2().m3().m4().m5();",
        output: "var a = m1.m2();\n var b = m1.m2().m3()\n.m4()\n.m5();",
        errors: [{
            messageId: "expected",
            data: { callee: ".m4" },
            line: 2,
            column: 22,
            endLine: 2,
            endColumn: 25
        }, {
            messageId: "expected",
            data: { callee: ".m5" },
            line: 2,
            column: 27,
            endLine: 2,
            endColumn: 30
        }]
    }, {
        code: "var a = m1.m2();\n var b = m1.m2().m3()\n.m4().m5();",
        output: "var a = m1.m2();\n var b = m1.m2().m3()\n.m4()\n.m5();",
        errors: [{
            messageId: "expected",
            data: { callee: ".m5" },
            line: 3,
            column: 6,
            endLine: 3,
            endColumn: 9
        }]
    }, {
        code: "var a = m1().m2\n.m3().m4().m5().m6().m7();",
        output: "var a = m1().m2\n.m3().m4().m5()\n.m6()\n.m7();",
        options: [{
            ignoreChainWithDepth: 3
        }],
        errors: [{
            messageId: "expected",
            data: { callee: ".m6" },
            line: 2,
            column: 16,
            endLine: 2,
            endColumn: 19
        }, {
            messageId: "expected",
            data: { callee: ".m7" },
            line: 2,
            column: 21,
            endLine: 2,
            endColumn: 24
        }]
    }, {
        code: [
            "http.request({",
            "    // Param",
            "    // Param",
            "    // Param",
            "}).on('response', function(response) {",
            "    // Do something with response.",
            "    // Do something with response.",
            "    // Do something with response.",
            "    // Do something with response.",
            "    // Do something with response.",
            "    // Do something with response.",
            "    // Do something with response.",
            "    // Do something with response.",
            "    // Do something with response.",
            "    // Do something with response.",
            "}).on('error', function(error) {",
            "    // Do something with error.",
            "    // Do something with error.",
            "    // Do something with error.",
            "    // Do something with error.",
            "    // Do something with error.",
            "    // Do something with error.",
            "    // Do something with error.",
            "    // Do something with error.",
            "    // Do something with error.",
            "    // Do something with error.",
            "}).end();"
        ].join("\n"),
        output: [
            "http.request({",
            "    // Param",
            "    // Param",
            "    // Param",
            "}).on('response', function(response) {",
            "    // Do something with response.",
            "    // Do something with response.",
            "    // Do something with response.",
            "    // Do something with response.",
            "    // Do something with response.",
            "    // Do something with response.",
            "    // Do something with response.",
            "    // Do something with response.",
            "    // Do something with response.",
            "    // Do something with response.",
            "})",
            ".on('error', function(error) {",
            "    // Do something with error.",
            "    // Do something with error.",
            "    // Do something with error.",
            "    // Do something with error.",
            "    // Do something with error.",
            "    // Do something with error.",
            "    // Do something with error.",
            "    // Do something with error.",
            "    // Do something with error.",
            "    // Do something with error.",
            "})",
            ".end();"
        ].join("\n"),
        errors: [{
            messageId: "expected",
            data: { callee: ".on" },
            line: 16,
            column: 3,
            endLine: 16,
            endColumn: 6
        }, {
            messageId: "expected",
            data: { callee: ".end" },
            line: 27,
            column: 3,
            endLine: 27,
            endColumn: 7
        }]
    }, {
        code: [
            "anObject.method1().method2()['method' + n]()[aCondition ?",
            "    'method3' :",
            "    'method4']()"
        ].join("\n"),
        output: [
            "anObject.method1().method2()",
            "['method' + n]()",
            "[aCondition ?",
            "    'method3' :",
            "    'method4']()"
        ].join("\n"),
        errors: [{
            messageId: "expected",
            data: { callee: "['method' + n]" },
            line: 1,
            column: 29,
            endLine: 1,
            endColumn: 43
        }, {
            messageId: "expected",
            data: { callee: "[aCondition ?" },
            line: 1,
            column: 45,
            endLine: 3,
            endColumn: 15
        }]
    }, {
        code: "foo.bar()['foo' + \u2029 + 'bar']()",
        output: "foo.bar()\n['foo' + \u2029 + 'bar']()",
        options: [{ ignoreChainWithDepth: 1 }],
        errors: [{
            messageId: "expected",
            data: { callee: "['foo' + " },
            line: 1,
            column: 10,
            endLine: 2,
            endColumn: 10
        }]
    }, {
        code: "foo.bar()[(biz)]()",
        output: "foo.bar()\n[(biz)]()",
        options: [{ ignoreChainWithDepth: 1 }],
        errors: [{
            messageId: "expected",
            data: { callee: "[biz]" },
            line: 1,
            column: 10,
            endLine: 1,
            endColumn: 17
        }]
    }, {
        code: "(foo).bar().biz()",
        output: "(foo).bar()\n.biz()",
        options: [{ ignoreChainWithDepth: 1 }],
        errors: [{
            messageId: "expected",
            data: { callee: ".biz" },
            line: 1,
            column: 12,
            endLine: 1,
            endColumn: 16
        }]
    }, {
        code: "foo.bar(). /* comment */ biz()",
        output: "foo.bar()\n. /* comment */ biz()",
        options: [{ ignoreChainWithDepth: 1 }],
        errors: [{
            messageId: "expected",
            data: { callee: ".biz" },
            line: 1,
            column: 10,
            endLine: 1,
            endColumn: 29
        }]
    }, {
        code: "foo.bar() /* comment */ .biz()",
        output: "foo.bar() /* comment */ \n.biz()",
        options: [{ ignoreChainWithDepth: 1 }],
        errors: [{
            messageId: "expected",
            data: { callee: ".biz" },
            line: 1,
            column: 25,
            endLine: 1,
            endColumn: 29
        }]
    }, {
        code: "((foo.bar()) . baz()).quux();",
        output: "((foo.bar()) \n. baz())\n.quux();",
        options: [{ ignoreChainWithDepth: 1 }],
        errors: [{
            messageId: "expected",
            data: { callee: ".baz" },
            line: 1,
            column: 14,
            endLine: 1,
            endColumn: 19
        }, {
            messageId: "expected",
            data: { callee: ".quux" },
            line: 1,
            column: 22,
            endLine: 1,
            endColumn: 27
        }]
    }, {
        code: "((foo.bar()) [a + b] ()) [(c + d)]()",
        output: "((foo.bar()) \n[a + b] ()) \n[(c + d)]()",
        options: [{ ignoreChainWithDepth: 1 }],
        errors: [{
            messageId: "expected",
            data: { callee: "[a + b]" },
            line: 1,
            column: 14,
            endLine: 1,
            endColumn: 21
        }, {
            messageId: "expected",
            data: { callee: "[c + d]" },
            line: 1,
            column: 26,
            endLine: 1,
            endColumn: 35
        }]
    },

    // Optional chaining
    {
        code: "obj?.foo1()?.foo2()?.foo3()",
        output: "obj?.foo1()\n?.foo2()\n?.foo3()",
        options: [{ ignoreChainWithDepth: 1 }],
        parserOptions: { ecmaVersion: 2020 },
        errors: [
            { messageId: "expected", data: { callee: "?.foo2" } },
            { messageId: "expected", data: { callee: "?.foo3" } }
        ]
    },
    {
        code: "(obj?.foo1()?.foo2)()?.foo3()",
        output: "(obj?.foo1()\n?.foo2)()\n?.foo3()",
        options: [{ ignoreChainWithDepth: 1 }],
        parserOptions: { ecmaVersion: 2020 },
        errors: [
            { messageId: "expected", data: { callee: "?.foo2" } },
            { messageId: "expected", data: { callee: "?.foo3" } }
        ]
    },
    {
        code: "(obj?.foo1())?.foo2()?.foo3()",
        output: "(obj?.foo1())\n?.foo2()\n?.foo3()",
        options: [{ ignoreChainWithDepth: 1 }],
        parserOptions: { ecmaVersion: 2020 },
        errors: [
            { messageId: "expected", data: { callee: "?.foo2" } },
            { messageId: "expected", data: { callee: "?.foo3" } }
        ]
    },
    {
        code: "obj?.[foo1]()?.[foo2]()?.[foo3]()",
        output: "obj?.[foo1]()\n?.[foo2]()\n?.[foo3]()",
        options: [{ ignoreChainWithDepth: 1 }],
        parserOptions: { ecmaVersion: 2020 },
        errors: [
            { messageId: "expected", data: { callee: "?.[foo2]" } },
            { messageId: "expected", data: { callee: "?.[foo3]" } }
        ]
    },
    {
        code: "(obj?.[foo1]()?.[foo2])()?.[foo3]()",
        output: "(obj?.[foo1]()\n?.[foo2])()\n?.[foo3]()",
        options: [{ ignoreChainWithDepth: 1 }],
        parserOptions: { ecmaVersion: 2020 },
        errors: [
            { messageId: "expected", data: { callee: "?.[foo2]" } },
            { messageId: "expected", data: { callee: "?.[foo3]" } }
        ]
    },
    {
        code: "(obj?.[foo1]())?.[foo2]()?.[foo3]()",
        output: "(obj?.[foo1]())\n?.[foo2]()\n?.[foo3]()",
        options: [{ ignoreChainWithDepth: 1 }],
        parserOptions: { ecmaVersion: 2020 },
        errors: [
            { messageId: "expected", data: { callee: "?.[foo2]" } },
            { messageId: "expected", data: { callee: "?.[foo3]" } }
        ]
    }

    ]
});
