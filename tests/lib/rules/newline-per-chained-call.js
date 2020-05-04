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
            messageId: "expected", data: { callee: ".filter" }
        }, {
            messageId: "expected", data: { callee: ".value" }
        }]
    }, {
        code: "_\n.chain({})\n.map(foo)\n.filter(bar).value();",
        output: "_\n.chain({})\n.map(foo)\n.filter(bar)\n.value();",
        errors: [{
            messageId: "expected", data: { callee: ".value" }
        }]
    }, {
        code: "a().b().c().e.d()",
        output: "a().b()\n.c().e.d()",
        errors: [{
            messageId: "expected", data: { callee: ".c" }
        }]
    }, {
        code: "a.b.c().e().d()",
        output: "a.b.c().e()\n.d()",
        errors: [{
            messageId: "expected", data: { callee: ".d" }
        }]
    }, {
        code: "_.chain({}).map(a).value(); ",
        output: "_.chain({}).map(a)\n.value(); ",
        errors: [{
            messageId: "expected", data: { callee: ".value" }
        }]
    }, {
        code: "var a = m1.m2();\n var b = m1.m2().m3().m4().m5();",
        output: "var a = m1.m2();\n var b = m1.m2().m3()\n.m4()\n.m5();",
        errors: [{
            messageId: "expected", data: { callee: ".m4" }
        }, {
            messageId: "expected", data: { callee: ".m5" }
        }]
    }, {
        code: "var a = m1.m2();\n var b = m1.m2().m3()\n.m4().m5();",
        output: "var a = m1.m2();\n var b = m1.m2().m3()\n.m4()\n.m5();",
        errors: [{
            messageId: "expected", data: { callee: ".m5" }
        }]
    }, {
        code: "var a = m1().m2\n.m3().m4().m5().m6().m7();",
        output: "var a = m1().m2\n.m3().m4().m5()\n.m6()\n.m7();",
        options: [{
            ignoreChainWithDepth: 3
        }],
        errors: [{
            messageId: "expected", data: { callee: ".m6" }
        }, {
            messageId: "expected", data: { callee: ".m7" }
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
            messageId: "expected", data: { callee: ".on" }
        }, {
            messageId: "expected", data: { callee: ".end" }
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
            messageId: "expected", data: { callee: "['method' + n]" }
        }, {
            messageId: "expected", data: { callee: "[aCondition ?" }
        }]
    }, {
        code: "foo.bar()['foo' + \u2029 + 'bar']()",
        output: "foo.bar()\n['foo' + \u2029 + 'bar']()",
        options: [{ ignoreChainWithDepth: 1 }],
        errors: [{ messageId: "expected", data: { callee: "['foo' + " } }]
    }, {
        code: "foo.bar()[(biz)]()",
        output: "foo.bar()\n[(biz)]()",
        options: [{ ignoreChainWithDepth: 1 }],
        errors: [{ messageId: "expected", data: { callee: "[biz]" } }]
    }, {
        code: "(foo).bar().biz()",
        output: "(foo).bar()\n.biz()",
        options: [{ ignoreChainWithDepth: 1 }],
        errors: [{ messageId: "expected", data: { callee: ".biz" } }]
    }, {
        code: "foo.bar(). /* comment */ biz()",
        output: "foo.bar()\n. /* comment */ biz()",
        options: [{ ignoreChainWithDepth: 1 }],
        errors: [{ messageId: "expected", data: { callee: ".biz" } }]
    }, {
        code: "foo.bar() /* comment */ .biz()",
        output: "foo.bar() /* comment */ \n.biz()",
        options: [{ ignoreChainWithDepth: 1 }],
        errors: [{ messageId: "expected", data: { callee: ".biz" } }]
    }]
});
