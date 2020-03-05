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

const ruleTester = new RuleTester();

ruleTester.run("newline-per-chained-call", rule, {
    valid: [
        "_\n.chain({}).map(foo).length\n.filter(bar).value();",
        "_\n.chain({})\n.map(foo)\n.filter(bar)\n.value();",
        "a.b.c.d.e.f",
        "a()\n.b()\n.c\n.e",
        "var a = m1.m2(); var b = m1.m2();\nvar c = m1.m2()",
        "var a = m1()\n.m2();",
        "var a = m1();",
        "a()\n.b().c.e.d()",
        "a().b().c.e.d()",
        "a.b.c.e.d()",
        "var a = window\n.location\n.href\n.match(/(^[^#]*)/)[0];",
        "var a = window['location']\n.href\n.match(/(^[^#]*)/)[0];",
        "var a = window['location'].href.match(/(^[^#]*)/)[0];",
        {
            code: "var a = m1().m2.m3();",
            options: [{
                ignoreChainWithDepth: 3
            }]
        }, {
            code: "var a = m1().m2.m3().m4.m5().m6.m7().m8;",
            options: [{
                ignoreChainWithDepth: 8
            }]
        },

        /*
         * depthCalculationStyle: "all"
         * ignoreChainWithDepth: 3
         * includeBracketedProperties: false
         * includeMethodCalls: true (default)
         * includeProperties: true
         */
        {
            code: "foo.bar()['foo' + \u2029 + 'bar']()",
            options: [{
                depthCalculationStyle: "all",
                ignoreChainWithDepth: 3,
                includeBracketedProperties: false,
                includeProperties: true
            }]
        }, {
            code: "foo.bar()[(biz)]()",
            options: [{
                depthCalculationStyle: "all",
                ignoreChainWithDepth: 3,
                includeBracketedProperties: false,
                includeProperties: true
            }]
        }, {
            code: "(foo).bar().biz()",
            options: [{
                depthCalculationStyle: "all",
                ignoreChainWithDepth: 3,
                includeBracketedProperties: false,
                includeProperties: true
            }]
        }, {
            code: "foo.bar(). /* comment */ biz()",
            options: [{
                depthCalculationStyle: "all",
                ignoreChainWithDepth: 3,
                includeBracketedProperties: false,
                includeProperties: true
            }]
        }, {
            code: "foo.bar() /* comment */ .biz()",
            options: [{
                depthCalculationStyle: "all",
                ignoreChainWithDepth: 3,
                includeBracketedProperties: false,
                includeProperties: true
            }]
        }, {
            code: "foo\n.bar() /* comment */ .biz()",
            options: [{
                depthCalculationStyle: "all",
                ignoreChainWithDepth: 3,
                includeBracketedProperties: false,
                includeProperties: true
            }]
        }
    ],

    /*
     * depthCalculationStyle: "trailingMembers" (default)
     * ignoreChainWithDepth: 2 (default)
     * includeBracketedProperties: true (default)
     * includeMethodCalls: true (default)
     * includeProperties: false (default)
     * multilineBreakStyle: "never" (default)
     */
    invalid: [{
        code: "_.chain({}).map(foo).filter(bar).value();",
        output: "_.chain({}).map(foo)\n.filter(bar)\n.value();",
        errors: [{
            messageId: "expectedLineBreak", data: { propertyName: ".filter" }
        }, {
            messageId: "expectedLineBreak", data: { propertyName: ".value" }
        }]
    }, {
        code: "_\n.chain({}).map(foo).filter(bar).value();",
        output: "_\n.chain({}).map(foo)\n.filter(bar)\n.value();",
        errors: [{
            messageId: "expectedLineBreak", data: { propertyName: ".filter" }
        }, {
            messageId: "expectedLineBreak", data: { propertyName: ".value" }
        }]
    }, {
        code: "_\n.chain({})\n.map(foo)\n.filter(bar).value();",
        output: "_\n.chain({})\n.map(foo)\n.filter(bar)\n.value();",
        errors: [{
            messageId: "expectedLineBreak", data: { propertyName: ".value" }
        }]
    }, {
        code: "a().b().c().e.d()",
        output: "a().b()\n.c().e.d()",
        errors: [{
            messageId: "expectedLineBreak", data: { propertyName: ".c" }
        }]
    }, {
        code: "a.b.c().e().d()",
        output: "a.b.c().e()\n.d()",
        errors: [{
            messageId: "expectedLineBreak", data: { propertyName: ".d" }
        }]
    }, {
        code: "_.chain({}).map(a).value(); ",
        output: "_.chain({}).map(a)\n.value(); ",
        errors: [{
            messageId: "expectedLineBreak", data: { propertyName: ".value" }
        }]
    }, {
        code: "var a = m1.m2();\nvar b = m1.m2().m3().m4().m5();",
        output: "var a = m1.m2();\nvar b = m1.m2().m3()\n.m4()\n.m5();",
        errors: [{
            messageId: "expectedLineBreak", data: { propertyName: ".m4" }
        }, {
            messageId: "expectedLineBreak", data: { propertyName: ".m5" }
        }]
    }, {
        code: "var a = m1.m2();\nvar b = m1.m2().m3()\n.m4().m5();",
        output: "var a = m1.m2();\nvar b = m1.m2().m3()\n.m4()\n.m5();",
        errors: [{
            messageId: "expectedLineBreak", data: { propertyName: ".m5" }
        }]
    }, {
        code: "var a = m1().m2\n.m3().m4().m5().m6().m7();",
        output: "var a = m1().m2\n.m3().m4().m5()\n.m6()\n.m7();",
        options: [{
            ignoreChainWithDepth: 3
        }],
        errors: [{
            messageId: "expectedLineBreak", data: { propertyName: ".m6" }
        }, {
            messageId: "expectedLineBreak", data: { propertyName: ".m7" }
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
            messageId: "expectedLineBreak", data: { propertyName: ".on" }
        }, {
            messageId: "expectedLineBreak", data: { propertyName: ".end" }
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
            messageId: "expectedLineBreak", data: { propertyName: "['method' + n]" }
        }, {
            messageId: "expectedLineBreak", data: { propertyName: "[aCondition ?" }
        }]
    },

    /*
     * depthCalculationStyle: "trailingMembers" (default)
     * ignoreChainWithDepth: 1
     * includeBracketedProperties: true (default)
     * includeMethodCalls: true (default)
     * includeProperties: false (default)
     * multilineBreakStyle: "never" (default)
     */
    {
        code: "foo.bar()['foo' + \u2029 + 'bar']",
        output: null,
        options: [{ ignoreChainWithDepth: 1 }],
        errors: []
    }, {
        code: "foo.bar()['foo' + \u2029 + 'bar']()",
        output: "foo.bar()\n['foo' + \u2029 + 'bar']()",
        options: [{ ignoreChainWithDepth: 1 }],
        errors: [{ messageId: "expectedLineBreak", data: { propertyName: "['foo' + " } }]
    }, {
        code: "foo.bar()[(biz)]()",
        output: "foo.bar()\n[(biz)]()",
        options: [{ ignoreChainWithDepth: 1 }],
        errors: [{ messageId: "expectedLineBreak", data: { propertyName: "[biz]" } }]
    }, {
        code: "(foo).bar().biz()",
        output: "(foo).bar()\n.biz()",
        options: [{ ignoreChainWithDepth: 1 }],
        errors: [{ messageId: "expectedLineBreak", data: { propertyName: ".biz" } }]
    }, {
        code: "foo.bar(). /* comment */ biz()",
        output: "foo.bar()\n. /* comment */ biz()",
        options: [{ ignoreChainWithDepth: 1 }],
        errors: [{ messageId: "expectedLineBreak", data: { propertyName: ".biz" } }]
    }, {
        code: "foo.bar() /* comment */ .biz()",
        output: "foo.bar() /* comment */ \n.biz()",
        options: [{ ignoreChainWithDepth: 1 }],
        errors: [{ messageId: "expectedLineBreak", data: { propertyName: ".biz" } }]
    }, {
        code: "obj.prop.method1()['prop']['method2']().method3().method4().prop;",
        output: "obj.prop.method1()['prop']['method2']().method3()\n.method4().prop;",
        errors: [{
            messageId: "expectedLineBreak", data: { propertyName: ".method4" }
        }]
    },

    /*
     * depthCalculationStyle: "all"
     * ignoreChainWithDepth: 1
     * includeBracketedProperties: true (default)
     * includeMethodCalls: true (default)
     * includeProperties: true
     * multilineBreakStyle: "never" (default)
     */
    {
        code: "a.b",
        output: "a\n.b",
        options: [{
            depthCalculationStyle: "all",
            ignoreChainWithDepth: 1,
            includeProperties: true
        }],
        errors: [{
            messageId: "expectedLineBreak", data: { propertyName: ".b" }
        }]
    }, {
        code: "a.b()",
        output: "a\n.b()",
        options: [{
            depthCalculationStyle: "all",
            ignoreChainWithDepth: 1,
            includeProperties: true
        }],
        errors: [{
            messageId: "expectedLineBreak", data: { propertyName: ".b" }
        }]
    }, {
        code: "a().b()",
        output: "a()\n.b()",
        options: [{
            depthCalculationStyle: "all",
            ignoreChainWithDepth: 1,
            includeProperties: true
        }],
        errors: [{
            messageId: "expectedLineBreak", data: { propertyName: ".b" }
        }]
    }, {
        code: "a['propertyNameString']",
        output: "a\n['propertyNameString']",
        options: [{
            depthCalculationStyle: "all",
            ignoreChainWithDepth: 1,
            includeProperties: true
        }],
        errors: [{
            messageId: "expectedLineBreak", data: { propertyName: "['propertyNameString']" }
        }]
    }, {
        code: "a()['propertyNameString']",
        output: "a()\n['propertyNameString']",
        options: [{
            depthCalculationStyle: "all",
            ignoreChainWithDepth: 1,
            includeProperties: true
        }],
        errors: [{
            messageId: "expectedLineBreak", data: { propertyName: "['propertyNameString']" }
        }]
    }, {
        code: "a['propertyNameString'].b()",
        output: "a\n['propertyNameString']\n.b()",
        options: [{
            depthCalculationStyle: "all",
            ignoreChainWithDepth: 1,
            includeProperties: true
        }],
        errors: [{
            messageId: "expectedLineBreak", data: { propertyName: "['propertyNameString']" }
        }, {
            messageId: "expectedLineBreak", data: { propertyName: ".b" }
        }]
    }, {
        code: "a[propertyNameVariable]",
        output: "a\n[propertyNameVariable]",
        options: [{
            depthCalculationStyle: "all",
            ignoreChainWithDepth: 1,
            includeProperties: true
        }],
        errors: [{
            messageId: "expectedLineBreak", data: { propertyName: "[propertyNameVariable]" }
        }]
    }, {
        code: "a()[propertyNameVariable]",
        output: "a()\n[propertyNameVariable]",
        options: [{
            depthCalculationStyle: "all",
            ignoreChainWithDepth: 1,
            includeProperties: true
        }],
        errors: [{
            messageId: "expectedLineBreak", data: { propertyName: "[propertyNameVariable]" }
        }]
    }, {
        code: "void [1, 2, 3].forEach(func)",
        output: "void [1, 2, 3]\n.forEach(func)",
        options: [{
            depthCalculationStyle: "all",
            ignoreChainWithDepth: 1,
            includeProperties: true
        }],
        errors: [{
            messageId: "expectedLineBreak", data: { propertyName: ".forEach" }
        }]
    }, {
        code: "test ? condition : [1, 2, 3].forEach(func)",
        output: "test ? condition : [1, 2, 3]\n.forEach(func)",
        options: [{
            depthCalculationStyle: "all",
            ignoreChainWithDepth: 1,
            includeProperties: true
        }],
        errors: [{
            messageId: "expectedLineBreak", data: { propertyName: ".forEach" }
        }]
    }, {
        code: "test ? condition : a[1, 2, 3].forEach(func)",
        output: "test ? condition : a\n[1, 2, 3]\n.forEach(func)",
        options: [{
            depthCalculationStyle: "all",
            ignoreChainWithDepth: 1,
            includeProperties: true
        }],
        errors: [{
            messageId: "expectedLineBreak", data: { propertyName: "[1, 2, 3]" }
        }, {
            messageId: "expectedLineBreak", data: { propertyName: ".forEach" }
        }]
    }, {
        code: "test ? condition : a[1, 2, 3].forEach(func).length",
        output: "test ? condition : a\n[1, 2, 3]\n.forEach(func)\n.length",
        options: [{
            depthCalculationStyle: "all",
            ignoreChainWithDepth: 1,
            includeProperties: true
        }],
        errors: [{
            messageId: "expectedLineBreak", data: { propertyName: "[1, 2, 3]" }
        }, {
            messageId: "expectedLineBreak", data: { propertyName: ".forEach" }
        }, {
            messageId: "expectedLineBreak", data: { propertyName: ".length" }
        }]
    }, {
        code: "obj.prop.method1()['prop']['method2']().method3().method4().prop;",
        output: "obj\n.prop\n.method1()\n['prop']\n['method2']()\n.method3()\n.method4()\n.prop;",
        options: [{
            depthCalculationStyle: "all",
            ignoreChainWithDepth: 1,
            includeProperties: true
        }],
        errors: [{
            messageId: "expectedLineBreak", data: { propertyName: ".prop" }
        }, {
            messageId: "expectedLineBreak", data: { propertyName: ".method1" }
        }, {
            messageId: "expectedLineBreak", data: { propertyName: "['prop']" }
        }, {
            messageId: "expectedLineBreak", data: { propertyName: "['method2']" }
        }, {
            messageId: "expectedLineBreak", data: { propertyName: ".method3" }
        }, {
            messageId: "expectedLineBreak", data: { propertyName: ".method4" }
        }, {
            messageId: "expectedLineBreak", data: { propertyName: ".prop" }
        }]
    },

    /*
     * depthCalculationStyle: "all"
     * ignoreChainWithDepth: 1
     * includeBracketedProperties: true (default)
     * includeMethodCalls: false
     * includeProperties: true
     * multilineBreakStyle: "never" (default)
     */
    {
        code: "a.b",
        output: "a\n.b",
        options: [{
            depthCalculationStyle: "all",
            ignoreChainWithDepth: 1,
            includeMethodCalls: false,
            includeProperties: true
        }],
        errors: [{
            messageId: "expectedLineBreak", data: { propertyName: ".b" }
        }]
    }, {
        code: "a.b()",
        output: null,
        options: [{
            depthCalculationStyle: "all",
            ignoreChainWithDepth: 1,
            includeMethodCalls: false,
            includeProperties: true
        }],
        errors: []
    }, {
        code: "a().b()",
        output: null,
        options: [{
            depthCalculationStyle: "all",
            ignoreChainWithDepth: 1,
            includeMethodCalls: false,
            includeProperties: true
        }],
        errors: []
    }, {
        code: "a['propertyNameString']",
        output: "a\n['propertyNameString']",
        options: [{
            depthCalculationStyle: "all",
            ignoreChainWithDepth: 1,
            includeMethodCalls: false,
            includeProperties: true
        }],
        errors: [{
            messageId: "expectedLineBreak", data: { propertyName: "['propertyNameString']" }
        }]
    }, {
        code: "a()['propertyNameString']",
        output: null,
        options: [{
            depthCalculationStyle: "all",
            ignoreChainWithDepth: 1,
            includeMethodCalls: false,
            includeProperties: true
        }],
        errors: []
    }, {
        code: "a['propertyNameString'].b()",
        output: "a\n['propertyNameString'].b()",
        options: [{
            depthCalculationStyle: "all",
            ignoreChainWithDepth: 1,
            includeMethodCalls: false,
            includeProperties: true
        }],
        errors: [{
            messageId: "expectedLineBreak", data: { propertyName: "['propertyNameString']" }
        }]
    },
    {
        code: "a['propertyNameString'].b().c",
        output: "a\n['propertyNameString'].b()\n.c",
        options: [{
            depthCalculationStyle: "all",
            ignoreChainWithDepth: 1,
            includeMethodCalls: false,
            includeProperties: true
        }],
        errors: [{
            messageId: "expectedLineBreak", data: { propertyName: "['propertyNameString']" }
        }, {
            messageId: "expectedLineBreak", data: { propertyName: ".c" }
        }]
    },
    {
        code: "a[propertyNameVariable]",
        output: "a\n[propertyNameVariable]",
        options: [{
            depthCalculationStyle: "all",
            ignoreChainWithDepth: 1,
            includeMethodCalls: false,
            includeProperties: true
        }],
        errors: [{
            messageId: "expectedLineBreak", data: { propertyName: "[propertyNameVariable]" }
        }]
    }, {
        code: "a()[propertyNameVariable]",
        output: null,
        options: [{
            depthCalculationStyle: "all",
            ignoreChainWithDepth: 1,
            includeMethodCalls: false,
            includeProperties: true
        }],
        errors: []
    },

    /*
     * depthCalculationStyle: "all"
     * ignoreChainWithDepth: 2 (default)
     * includeBracketedProperties: true (default)
     * includeMethodCalls: true (default)
     * includeProperties: true
     * multilineBreakStyle: "never" (default)
     */
    {
        code: "_\n.chain({}).map(foo).filter(bar).value();",
        output: "_\n.chain({})\n.map(foo)\n.filter(bar)\n.value();",
        options: [{
            depthCalculationStyle: "all",
            ignoreChainWithDepth: 2,
            includeProperties: true
        }],
        errors: [{
            messageId: "expectedLineBreak", data: { propertyName: ".map" }
        }, {
            messageId: "expectedLineBreak", data: { propertyName: ".filter" }
        }, {
            messageId: "expectedLineBreak", data: { propertyName: ".value" }
        }]
    }, {
        code: "_\n.chain({})\n.map(foo)\n.filter(bar).value();",
        output: "_\n.chain({})\n.map(foo)\n.filter(bar)\n.value();",
        options: [{
            depthCalculationStyle: "all",
            ignoreChainWithDepth: 2,
            includeProperties: true
        }],
        errors: [{
            messageId: "expectedLineBreak", data: { propertyName: ".value" }
        }]
    }, {
        code: "a().b().c().e.d()",
        output: "a()\n.b()\n.c()\n.e\n.d()",
        options: [{
            depthCalculationStyle: "all",
            ignoreChainWithDepth: 2,
            includeProperties: true
        }],
        errors: [{
            messageId: "expectedLineBreak", data: { propertyName: ".b" }
        }, {
            messageId: "expectedLineBreak", data: { propertyName: ".c" }
        }, {
            messageId: "expectedLineBreak", data: { propertyName: ".e" }
        }, {
            messageId: "expectedLineBreak", data: { propertyName: ".d" }
        }]
    }, {
        code: "a.b.c().e().d()",
        output: "a\n.b\n.c()\n.e()\n.d()",
        options: [{
            depthCalculationStyle: "all",
            ignoreChainWithDepth: 2,
            includeProperties: true
        }],
        errors: [{
            messageId: "expectedLineBreak", data: { propertyName: ".b" }
        }, {
            messageId: "expectedLineBreak", data: { propertyName: ".c" }
        }, {
            messageId: "expectedLineBreak", data: { propertyName: ".e" }
        }, {
            messageId: "expectedLineBreak", data: { propertyName: ".d" }
        }]
    }, {
        code: "_.chain({}).map(a).value(); ",
        output: "_\n.chain({})\n.map(a)\n.value(); ",
        options: [{
            depthCalculationStyle: "all",
            ignoreChainWithDepth: 2,
            includeProperties: true
        }],
        errors: [{
            messageId: "expectedLineBreak", data: { propertyName: ".chain" }
        }, {
            messageId: "expectedLineBreak", data: { propertyName: ".map" }
        }, {
            messageId: "expectedLineBreak", data: { propertyName: ".value" }
        }]
    }, {
        code: "var a = m1.m2();\nvar b = m1.m2().m3().m4().m5();",
        output: "var a = m1.m2();\nvar b = m1\n.m2()\n.m3()\n.m4()\n.m5();",
        options: [{
            depthCalculationStyle: "all",
            ignoreChainWithDepth: 2,
            includeProperties: true
        }],
        errors: [{
            messageId: "expectedLineBreak", data: { propertyName: ".m2" }
        }, {
            messageId: "expectedLineBreak", data: { propertyName: ".m3" }
        }, {
            messageId: "expectedLineBreak", data: { propertyName: ".m4" }
        }, {
            messageId: "expectedLineBreak", data: { propertyName: ".m5" }
        }]
    }, {
        code: "var a = m1.m2();\nvar b = m1.m2().m3()\n.m4().m5();",
        output: "var a = m1.m2();\nvar b = m1\n.m2()\n.m3()\n.m4()\n.m5();",
        options: [{
            depthCalculationStyle: "all",
            ignoreChainWithDepth: 2,
            includeProperties: true
        }],
        errors: [{
            messageId: "expectedLineBreak", data: { propertyName: ".m2" }
        }, {
            messageId: "expectedLineBreak", data: { propertyName: ".m3" }
        }, {
            messageId: "expectedLineBreak", data: { propertyName: ".m5" }
        }]
    }, {
        code: "var a = m1().m2\n.m3().m4().m5().m6().m7();",
        output: "var a = m1()\n.m2\n.m3()\n.m4()\n.m5()\n.m6()\n.m7();",
        options: [{
            depthCalculationStyle: "all",
            ignoreChainWithDepth: 2,
            includeProperties: true
        }],
        errors: [{
            messageId: "expectedLineBreak", data: { propertyName: ".m2" }
        }, {
            messageId: "expectedLineBreak", data: { propertyName: ".m4" }
        }, {
            messageId: "expectedLineBreak", data: { propertyName: ".m5" }
        }, {
            messageId: "expectedLineBreak", data: { propertyName: ".m6" }
        }, {
            messageId: "expectedLineBreak", data: { propertyName: ".m7" }
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
            "http",
            ".request({",
            "    // Param",
            "    // Param",
            "    // Param",
            "})",
            ".on('response', function(response) {",
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
        options: [{
            depthCalculationStyle: "all",
            ignoreChainWithDepth: 2,
            includeProperties: true
        }],
        errors: [{
            messageId: "expectedLineBreak", data: { propertyName: ".request" }
        }, {
            messageId: "expectedLineBreak", data: { propertyName: ".on" }
        }, {
            messageId: "expectedLineBreak", data: { propertyName: ".on" }
        }, {
            messageId: "expectedLineBreak", data: { propertyName: ".end" }
        }]
    }, {
        code: [
            "anObject.method1().method2()['method' + n]()[aCondition ?",
            "    'method3' :",
            "    'method4']()"
        ].join("\n"),
        output: [
            "anObject",
            ".method1()",
            ".method2()",
            "['method' + n]()",
            "[aCondition ?",
            "    'method3' :",
            "    'method4']()"
        ].join("\n"),
        options: [{
            depthCalculationStyle: "all",
            ignoreChainWithDepth: 2,
            includeProperties: true
        }],
        errors: [{
            messageId: "expectedLineBreak", data: { propertyName: ".method1" }
        }, {
            messageId: "expectedLineBreak", data: { propertyName: ".method2" }
        }, {
            messageId: "expectedLineBreak", data: { propertyName: "['method' + n]" }
        }, {
            messageId: "expectedLineBreak", data: { propertyName: "[aCondition ?" }
        }]
    }, {
        code: "foo.bar()['foo' + \u2029 + 'bar']()",
        output: "foo\n.bar()\n['foo' + \u2029 + 'bar']()",
        options: [{
            depthCalculationStyle: "all",
            ignoreChainWithDepth: 2,
            includeProperties: true
        }],
        errors: [
            { messageId: "expectedLineBreak", data: { propertyName: ".bar" } },
            { messageId: "expectedLineBreak", data: { propertyName: "['foo' + " } }
        ]
    }, {
        code: "foo.bar()[(biz)]()",
        output: "foo\n.bar()\n[(biz)]()",
        options: [{
            depthCalculationStyle: "all",
            ignoreChainWithDepth: 2,
            includeProperties: true
        }],
        errors: [
            { messageId: "expectedLineBreak", data: { propertyName: ".bar" } },
            { messageId: "expectedLineBreak", data: { propertyName: "[biz]" } }
        ]
    }, {
        code: "(foo).bar().biz()",
        output: "(foo)\n.bar()\n.biz()",
        options: [{
            depthCalculationStyle: "all",
            ignoreChainWithDepth: 2,
            includeProperties: true
        }],
        errors: [
            { messageId: "expectedLineBreak", data: { propertyName: ".bar" } },
            { messageId: "expectedLineBreak", data: { propertyName: ".biz" } }
        ]
    }, {
        code: "foo.bar(). /* comment */ biz()",
        output: "foo\n.bar()\n. /* comment */ biz()",
        options: [{
            depthCalculationStyle: "all",
            ignoreChainWithDepth: 2,
            includeProperties: true
        }],
        errors: [
            { messageId: "expectedLineBreak", data: { propertyName: ".bar" } },
            { messageId: "expectedLineBreak", data: { propertyName: ".biz" } }
        ]
    }, {
        code: "foo.bar() /* comment */ .biz()",
        output: "foo\n.bar() /* comment */ \n.biz()",
        options: [{
            depthCalculationStyle: "all",
            ignoreChainWithDepth: 2,
            includeProperties: true
        }],
        errors: [
            { messageId: "expectedLineBreak", data: { propertyName: ".bar" } },
            { messageId: "expectedLineBreak", data: { propertyName: ".biz" } }
        ]
    }, {
        code: "foo\n.bar() /* comment */ .biz()",
        output: "foo\n.bar() /* comment */ \n.biz()",
        options: [{
            depthCalculationStyle: "all",
            ignoreChainWithDepth: 2,
            includeProperties: true
        }],
        errors: [{ messageId: "expectedLineBreak", data: { propertyName: ".biz" } }]
    }, {
        code: "test ? condition : [1, 2, 3].forEach(func)",
        output: null,
        options: [{
            depthCalculationStyle: "all",
            ignoreChainWithDepth: 2,
            includeProperties: true
        }],
        errors: []
    },

    /*
     * depthCalculationStyle: "all"
     * ignoreChainWithDepth: 2 (default)
     * includeBracketedProperties: true (default)
     * includeMethodCalls: false
     * includeProperties: true
     * multilineBreakStyle: "never" (default)
     */
    {
        code: "a['propertyNameString'].b().c",
        output: "a\n['propertyNameString'].b()\n.c",
        options: [{
            depthCalculationStyle: "all",
            ignoreChainWithDepth: 2,
            includeMethodCalls: false,
            includeProperties: true
        }],
        errors: [{
            messageId: "expectedLineBreak", data: { propertyName: "['propertyNameString']" }
        }, {
            messageId: "expectedLineBreak", data: { propertyName: ".c" }
        }]
    },

    /*
     * depthCalculationStyle: "all"
     * ignoreChainWithDepth: 2 (default)
     * includeBracketedProperties: false
     * includeMethodCalls: true (default)
     * includeProperties: true
     * multilineBreakStyle: "never" (default)
     */
    {
        code: [
            "anObject.method1().method2()['method' + n]()[aCondition ?",
            "    'method3' :",
            "    'method4']()"
        ].join("\n"),
        output: [
            "anObject",
            ".method1()",
            ".method2()['method' + n]()[aCondition ?",
            "    'method3' :",
            "    'method4']()"
        ].join("\n"),
        options: [{
            depthCalculationStyle: "all",
            ignoreChainWithDepth: 2,
            includeBracketedProperties: false,
            includeProperties: true
        }],
        errors: [{
            messageId: "expectedLineBreak", data: { propertyName: ".method1" }
        }, {
            messageId: "expectedLineBreak", data: { propertyName: ".method2" }
        }]
    }, {
        code: "foo.bar()['foo' + \u2029 + 'bar']()",
        output: null,
        options: [{
            depthCalculationStyle: "all",
            ignoreChainWithDepth: 2,
            includeBracketedProperties: false,
            includeProperties: true
        }],
        errors: []
    }, {
        code: "foo.bar()[(biz)]()",
        output: null,
        options: [{
            depthCalculationStyle: "all",
            ignoreChainWithDepth: 2,
            includeBracketedProperties: false,
            includeProperties: true
        }],
        errors: []
    }, {
        code: "(foo).bar().biz()",
        output: "(foo)\n.bar()\n.biz()",
        options: [{
            depthCalculationStyle: "all",
            ignoreChainWithDepth: 2,
            includeBracketedProperties: false,
            includeProperties: true
        }],
        errors: [
            { messageId: "expectedLineBreak", data: { propertyName: ".bar" } },
            { messageId: "expectedLineBreak", data: { propertyName: ".biz" } }
        ]
    }, {
        code: "foo.bar(). /* comment */ biz()",
        output: "foo\n.bar()\n. /* comment */ biz()",
        options: [{
            depthCalculationStyle: "all",
            ignoreChainWithDepth: 2,
            includeBracketedProperties: false,
            includeProperties: true
        }],
        errors: [
            { messageId: "expectedLineBreak", data: { propertyName: ".bar" } },
            { messageId: "expectedLineBreak", data: { propertyName: ".biz" } }
        ]
    }, {
        code: "foo.bar() /* comment */ .biz()",
        output: "foo\n.bar() /* comment */ \n.biz()",
        options: [{
            depthCalculationStyle: "all",
            ignoreChainWithDepth: 2,
            includeBracketedProperties: false,
            includeProperties: true
        }],
        errors: [
            { messageId: "expectedLineBreak", data: { propertyName: ".bar" } },
            { messageId: "expectedLineBreak", data: { propertyName: ".biz" } }
        ]
    }, {
        code: "foo\n.bar() /* comment */ .biz()",
        output: "foo\n.bar() /* comment */ \n.biz()",
        options: [{
            depthCalculationStyle: "all",
            ignoreChainWithDepth: 2,
            includeBracketedProperties: false,
            includeProperties: true
        }],
        errors: [{ messageId: "expectedLineBreak", data: { propertyName: ".biz" } }]
    },

    /*
     * depthCalculationStyle: "all"
     * ignoreChainWithDepth: 2 (default)
     * includeBracketedProperties: true (default)
     * includeMethodCalls: false
     * includeProperties: true
     * multilineBreakStyle: "object"
     */
    {
        code: "test ? condition : [1, 2, 3].forEach(func)",
        output: null,
        options: [{
            depthCalculationStyle: "all",
            ignoreChainWithDepth: 2,
            includeProperties: true,
            multilineBreakStyle: "object"
        }],
        errors: []
    }, {
        code: "test ? condition : [\n  1,\n  2,\n  3\n].forEach(func)",
        output: "test ? condition : [\n  1,\n  2,\n  3\n]\n.forEach(func)",
        options: [{
            depthCalculationStyle: "all",
            ignoreChainWithDepth: 2,
            includeProperties: true,
            multilineBreakStyle: "object"
        }],
        errors: [{
            messageId: "expectedLineBreak", data: { propertyName: ".forEach" }
        }]
    },

    /*
     * depthCalculationStyle: "all"
     * ignoreChainWithDepth: 2 (default)
     * includeBracketedProperties: true (default)
     * includeMethodCalls: false
     * includeProperties: true
     * multilineBreakStyle: "statement"
     */
    {
        code: "test ? condition : [1, 2, 3].forEach(func)",
        output: null,
        options: [{
            depthCalculationStyle: "all",
            ignoreChainWithDepth: 2,
            includeProperties: true,
            multilineBreakStyle: "statement"
        }],
        errors: []
    }, {
        code: "test ? condition : [1, 2, 3].forEach(function() {\n  return\n})",
        output: "test ? condition : [1, 2, 3]\n.forEach(function() {\n  return\n})",
        options: [{
            depthCalculationStyle: "all",
            ignoreChainWithDepth: 2,
            includeProperties: true,
            multilineBreakStyle: "statement"
        }],
        errors: [{
            messageId: "expectedLineBreak", data: { propertyName: ".forEach" }
        }]
    }, {
        code: "test ? condition : [\n  1,\n  2,\n  3\n].forEach(func)",
        output: "test ? condition : [\n  1,\n  2,\n  3\n]\n.forEach(func)",
        options: [{
            depthCalculationStyle: "all",
            ignoreChainWithDepth: 2,
            includeProperties: true,
            multilineBreakStyle: "statement"
        }],
        errors: [{
            messageId: "expectedLineBreak", data: { propertyName: ".forEach" }
        }]
    }]
});
