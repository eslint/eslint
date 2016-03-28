/**
 * @fileoverview Tests for newline-per-chained-call rule.
 * @author Rajendra Patil
 * @copyright 2016 Rajendra Patil. All rights reserved.
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/newline-per-chained-call"),
    RuleTester = require("../../../lib/testers/rule-tester");

var ruleTester = new RuleTester();

ruleTester.run("newline-per-chained-call", rule, {
    valid: [{
        code: "_\n.chain({})\n.map(foo)\n.filter(bar)\n.value();"
    }, {
        code: "a.b.c.d.e.f"
    }, {
        code: "a()\n.b()\n.c\n.e"
    }, {
        code: "var a = m1.m2(); var b = m1.m2();\nvar c = m1.m2()"
    }, {
        code: "var a = m1()\n.m2();"
    }, {
        code: "var a = m1();"
    }, {
        code: "a()\n.b().c.e.d()"
    }, {
        code: "a().b().c.e.d()"
    }, {
        code: "a.b.c.e.d()"
    }, {
        code: "var a = window\n.location\n.href\n.match(/(^[^#]*)/)[0];"
    }, {
        code: "var a = window['location']\n.href\n.match(/(^[^#]*)/)[0];"
    }, {
        code: "var a = window['location'].href.match(/(^[^#]*)/)[0];"
    }, {
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
        errors: [{
            message: "Expected line break after `_\\n.chain({}).map(foo)`."
        }, {
            message: "Expected line break after `_\\n.chain({}).map(foo).filter(bar)`."
        }]
    }, {
        code: "_\n.chain({})\n.map(foo)\n.filter(bar).value();",
        errors: [{
            message: "Expected line break after `_\\n.chain({})\\n.map(foo)\\n.filter(bar)`."
        }]
    }, {
        code: "a().b().c().e.d()",
        errors: [{
            message: "Expected line break after `a().b()`."
        }]
    }, {
        code: "a().b().c().e.d()",
        errors: [{
            message: "Expected line break after `a().b()`."
        }]
    }, {
        code: "a.b.c().e().d()",
        errors: [{
            message: "Expected line break after `a.b.c().e()`."
        }]
    }, {
        code: "_.chain({}).map(a).value(); ",
        errors: [{
            message: "Expected line break after `_.chain({}).map(a)`."
        }]
    }, {
        code: "var a = m1.m2();\n var b = m1.m2().m3().m4().m5();",
        errors: [{
            message: "Expected line break after `m1.m2().m3()`."
        }, {
            message: "Expected line break after `m1.m2().m3().m4()`."
        }]
    }, {
        code: "var a = m1.m2();\n var b = m1.m2().m3()\n.m4().m5();",
        errors: [{
            message: "Expected line break after `m1.m2().m3()\\n.m4()`."
        }]
    }, {
        code: "var a = m1().m2\n.m3().m4().m5().m6().m7();",
        options: [{
            ignoreChainWithDepth: 3
        }],
        errors: [{
            message: "Expected line break after `m1().m2\\n.m3().m4().m5()`."
        }, {
            message: "Expected line break after `m1().m2\\n.m3().m4().m5().m6()`."
        }]
    }]

});
