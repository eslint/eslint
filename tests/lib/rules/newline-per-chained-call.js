/**
 * @fileoverview Tests for newline-per-chained-call rule.
 * @author Rajendra Patil
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/newline-per-chained-call"),
    RuleTester = require("../../../lib/testers/rule-tester");

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
            message: "Expected line break before `.filter`."
        }, {
            message: "Expected line break before `.value`."
        }]
    }, {
        code: "_\n.chain({})\n.map(foo)\n.filter(bar).value();",
        output: "_\n.chain({})\n.map(foo)\n.filter(bar)\n.value();",
        errors: [{
            message: "Expected line break before `.value`."
        }]
    }, {
        code: "a().b().c().e.d()",
        output: "a().b()\n.c().e.d()",
        errors: [{
            message: "Expected line break before `.c`."
        }]
    }, {
        code: "a.b.c().e().d()",
        output: "a.b.c().e()\n.d()",
        errors: [{
            message: "Expected line break before `.d`."
        }]
    }, {
        code: "_.chain({}).map(a).value(); ",
        output: "_.chain({}).map(a)\n.value(); ",
        errors: [{
            message: "Expected line break before `.value`."
        }]
    }, {
        code: "var a = m1.m2();\n var b = m1.m2().m3().m4().m5();",
        output: "var a = m1.m2();\n var b = m1.m2().m3()\n.m4()\n.m5();",
        errors: [{
            message: "Expected line break before `.m4`."
        }, {
            message: "Expected line break before `.m5`."
        }]
    }, {
        code: "var a = m1.m2();\n var b = m1.m2().m3()\n.m4().m5();",
        output: "var a = m1.m2();\n var b = m1.m2().m3()\n.m4()\n.m5();",
        errors: [{
            message: "Expected line break before `.m5`."
        }]
    }, {
        code: "var a = m1().m2\n.m3().m4().m5().m6().m7();",
        output: "var a = m1().m2\n.m3().m4().m5()\n.m6()\n.m7();",
        options: [{
            ignoreChainWithDepth: 3
        }],
        errors: [{
            message: "Expected line break before `.m6`."
        }, {
            message: "Expected line break before `.m7`."
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
            message: "Expected line break before `.on`."
        }, {
            message: "Expected line break before `.end`."
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
            message: "Expected line break before `['method' + n]`."
        }, {
            message: "Expected line break before `[aCondition ?`."
        }]
    }, {
        code: "foo.bar()['foo' + \u2029 + 'bar']()",
        output: "foo.bar()\n['foo' + \u2029 + 'bar']()",
        options: [{ ignoreChainWithDepth: 1 }],
        errors: [{ message: "Expected line break before `['foo' + `." }]
    }, {
        code: "foo.bar()[(biz)]()",
        output: "foo.bar()\n[(biz)]()",
        options: [{ ignoreChainWithDepth: 1 }],
        errors: [{ message: "Expected line break before `[biz]`." }]
    }, {
        code: "(foo).bar().biz()",
        output: "(foo).bar()\n.biz()",
        options: [{ ignoreChainWithDepth: 1 }],
        errors: [{ message: "Expected line break before `.biz`." }]
    }, {
        code: "foo.bar(). /* comment */ biz()",
        output: "foo.bar()\n. /* comment */ biz()",
        options: [{ ignoreChainWithDepth: 1 }],
        errors: [{ message: "Expected line break before `.biz`." }]
    }, {
        code: "foo.bar() /* comment */ .biz()",
        output: "foo.bar() /* comment */ \n.biz()",
        options: [{ ignoreChainWithDepth: 1 }],
        errors: [{ message: "Expected line break before `.biz`." }]
    }]
});
