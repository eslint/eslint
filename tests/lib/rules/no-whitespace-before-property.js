/**
 * @fileoverview Rule to disallow whitespace before properties
 * @author Kai Cataldo
 * @copyright 2015 Kai Cataldo. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/no-whitespace-before-property"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();

ruleTester.run("no-whitespace-before-property", rule, {

    valid: [
        "foo.bar",
        "foo.bar()",
        "foo[bar]",
        "foo['bar']",
        "foo[0]",
        "foo[ bar ]",
        "foo[ 'bar' ]",
        "foo[ 0 ]",
        "foo\n.bar",
        "foo.\nbar",
        "foo\n.bar()",
        "foo.\nbar()",
        "foo\n[bar]",
        "foo\n['bar']",
        "foo\n[0]",
        "foo\n[ bar ]",
        "foo.\n bar",
        "foo\n. bar",
        "foo.\n bar()",
        "foo\n. bar()",
        "foo\n [bar]",
        "foo\n ['bar']",
        "foo\n [0]",
        "foo\n [ bar ]",
        "foo.\n\tbar",
        "foo\n.\tbar",
        "foo.\n\tbar()",
        "foo\n.\tbar()",
        "foo\n\t[bar]",
        "foo\n\t['bar']",
        "foo\n\t[0]",
        "foo\n\t[ bar ]",
        "foo.bar.baz",
        "foo\n.bar\n.baz",
        "foo.\nbar.\nbaz",
        "foo.bar().baz()",
        "foo\n.bar()\n.baz()",
        "foo.\nbar().\nbaz()",
        "foo\n.bar\n[baz]",
        "foo\n.bar\n['baz']",
        "foo\n.bar\n[0]",
        "foo\n.bar\n[ baz ]",
        "foo\n .bar\n .baz",
        "foo.\n bar.\n baz",
        "foo\n .bar()\n .baz()",
        "foo.\n bar().\n baz()",
        "foo\n .bar\n [baz]",
        "foo\n .bar\n ['baz']",
        "foo\n .bar\n [0]",
        "foo\n .bar\n [ baz ]",
        "foo\n\t.bar\n\t.baz",
        "foo.\n\tbar.\n\tbaz",
        "foo\n\t.bar()\n\t.baz()",
        "foo.\n\tbar().\n\tbaz()",
        "foo\n\t.bar\n\t[baz]",
        "foo\n\t.bar\n\t['baz']",
        "foo\n\t.bar\n\t[0]",
        "foo\n\t.bar\n\t[ baz ]",
        "foo['bar' + baz]",
        "foo[ 'bar' + baz ]",
        "(foo + bar).baz",
        "( foo + bar ).baz",
        "(foo ? bar : baz).qux",
        "( foo ? bar : baz ).qux",
        "(foo ? bar : baz)[qux]",
        "( foo ? bar : baz )[qux]",
        "( foo ? bar : baz )[0].qux",
        "foo.bar[('baz')]",
        "foo.bar[ ('baz') ]",
        "foo[[bar]]",
        "foo[ [ bar ] ]",
        "foo[['bar']]",
        "foo[ [ 'bar' ] ]",
        "foo[(('baz'))]",
        "foo[ (('baz'))]",
        "foo[0][[('baz')]]",
        "foo[bar.baz('qux')]",
        "foo[(bar.baz() + 0) + qux]",
        "foo['bar ' + 1 + ' baz']"
    ],

    invalid: [
        {
            code: "foo. bar",
            errors: ["Unexpected whitespace before property bar."]
        },
        {
            code: "foo .bar",
            errors: ["Unexpected whitespace before property bar."]
        },
        {
            code: "foo [bar]",
            errors: ["Unexpected whitespace before property bar."]
        },
        {
            code: "foo [0]",
            errors: ["Unexpected whitespace before property 0."]
        },
        {
            code: "foo ['bar']",
            errors: ["Unexpected whitespace before property 'bar'."]
        },
        {
            code: "foo. bar. baz",
            errors: ["Unexpected whitespace before property baz.", "Unexpected whitespace before property bar."]
        },
        {
            code: "foo .bar. baz",
            errors: ["Unexpected whitespace before property baz.", "Unexpected whitespace before property bar."]
        },
        {
            code: "foo [bar] [baz]",
            errors: ["Unexpected whitespace before property baz.", "Unexpected whitespace before property bar."]
        },
        {
            code: "foo [bar][baz]",
            errors: ["Unexpected whitespace before property bar."]
        },
        {
            code: "foo[bar] [baz]",
            errors: ["Unexpected whitespace before property baz."]
        },
        {
            code: "foo.bar [baz]",
            errors: ["Unexpected whitespace before property baz."]
        },
        {
            code: "foo. bar[baz]",
            errors: ["Unexpected whitespace before property bar."]
        },
        {
            code: "foo[bar]. baz",
            errors: ["Unexpected whitespace before property baz."]
        },
        {
            code: "foo[ bar ] [ baz ]",
            errors: ["Unexpected whitespace before property baz."]
        },
        {
            code: "foo [ 0 ][ baz ]",
            errors: ["Unexpected whitespace before property 0."]
        },
        {
            code: "foo[ 0 ] [ 'baz' ]",
            errors: ["Unexpected whitespace before property 'baz'."]
        },

        // tabs
        {
            code: "foo\t.bar",
            errors: ["Unexpected whitespace before property bar."]
        },
        {
            code: "foo.\tbar",
            errors: ["Unexpected whitespace before property bar."]
        },
        {
            code: "foo\t.bar()",
            errors: ["Unexpected whitespace before property bar."]
        },
        {
            code: "foo.\tbar()",
            errors: ["Unexpected whitespace before property bar."]
        },
        {
            code: "foo\t[bar]",
            errors: ["Unexpected whitespace before property bar."]
        },
        {
            code: "foo\t[0]",
            errors: ["Unexpected whitespace before property 0."]
        },
        {
            code: "foo\t['bar']",
            errors: ["Unexpected whitespace before property 'bar'."]
        },
        {
            code: "foo.\tbar.\tbaz",
            errors: ["Unexpected whitespace before property baz.", "Unexpected whitespace before property bar."]
        },
        {
            code: "foo\t.bar.\tbaz",
            errors: ["Unexpected whitespace before property baz.", "Unexpected whitespace before property bar."]
        },
        {
            code: "foo.\tbar().\tbaz()",
            errors: ["Unexpected whitespace before property baz.", "Unexpected whitespace before property bar."]
        },
        {
            code: "foo\t.bar().\tbaz()",
            errors: ["Unexpected whitespace before property baz.", "Unexpected whitespace before property bar."]
        },
        {
            code: "foo\t[bar]\t[baz]",
            errors: ["Unexpected whitespace before property baz.", "Unexpected whitespace before property bar."]
        },
        {
            code: "foo\t[bar][baz]",
            errors: ["Unexpected whitespace before property bar."]
        },
        {
            code: "foo[bar]\t[baz]",
            errors: ["Unexpected whitespace before property baz."]
        },
        {
            code: "foo.bar\t[baz]",
            errors: ["Unexpected whitespace before property baz."]
        },
        {
            code: "foo.\tbar[baz]",
            errors: ["Unexpected whitespace before property bar."]
        },
        {
            code: "foo[bar].\tbaz",
            errors: ["Unexpected whitespace before property baz."]
        },

        // newlines
        {
            code: "foo [bar]\n .baz",
            errors: ["Unexpected whitespace before property bar."]
        },
        {
            code: "foo. bar\n .baz",
            errors: ["Unexpected whitespace before property bar."]
        },
        {
            code: "foo .bar\n.baz",
            errors: ["Unexpected whitespace before property bar."]
        },
        {
            code: "foo.\n bar. baz",
            errors: ["Unexpected whitespace before property baz."]
        },
        {
            code: "foo.\nbar . baz",
            errors: ["Unexpected whitespace before property baz."]
        },
        {
            code: "foo. bar()\n .baz()",
            errors: ["Unexpected whitespace before property bar."]
        },
        {
            code: "foo .bar()\n.baz()",
            errors: ["Unexpected whitespace before property bar."]
        },
        {
            code: "foo.\n bar(). baz()",
            errors: ["Unexpected whitespace before property baz."]
        },
        {
            code: "foo.\nbar() . baz()",
            errors: ["Unexpected whitespace before property baz."]
        },
        {
            code: "foo\t[bar]\n\t.baz",
            errors: ["Unexpected whitespace before property bar."]
        },
        {
            code: "foo.\tbar\n\t.baz",
            errors: ["Unexpected whitespace before property bar."]
        },
        {
            code: "foo\t.bar\n.baz",
            errors: ["Unexpected whitespace before property bar."]
        },
        {
            code: "foo.\n\tbar.\tbaz",
            errors: ["Unexpected whitespace before property baz."]
        },
        {
            code: "foo.\nbar\t.\tbaz",
            errors: ["Unexpected whitespace before property baz."]
        },
        {
            code: "foo.\tbar()\n\t.baz()",
            errors: ["Unexpected whitespace before property bar."]
        },
        {
            code: "foo\t.bar()\n.baz()",
            errors: ["Unexpected whitespace before property bar."]
        },
        {
            code: "foo.\n\tbar().\tbaz()",
            errors: ["Unexpected whitespace before property baz."]
        },
        {
            code: "foo.\nbar()\t.\tbaz()",
            errors: ["Unexpected whitespace before property baz."]
        },

        // parens/computed properties
        {
            code: "foo ['bar' + baz]",
            errors: ["Unexpected whitespace before property 'bar' + baz."]
        },
        {
            code: "(foo + bar) .baz",
            errors: ["Unexpected whitespace before property baz."]
        },
        {
            code: "(foo + bar). baz",
            errors: ["Unexpected whitespace before property baz."]
        },
        {
            code: "(foo + bar) [baz]",
            errors: ["Unexpected whitespace before property baz."]
        },
        {
            code: "(foo ? bar : baz) .qux",
            errors: ["Unexpected whitespace before property qux."]
        },
        {
            code: "(foo ? bar : baz). qux",
            errors: ["Unexpected whitespace before property qux."]
        },
        {
            code: "(foo ? bar : baz) [qux]",
            errors: ["Unexpected whitespace before property qux."]
        },
        {
            code: "( foo ? bar : baz ) [0].qux",
            errors: ["Unexpected whitespace before property 0."]
        },
        {
            code: "( foo ? bar : baz )[0] .qux",
            errors: ["Unexpected whitespace before property qux."]
        },
        {
            code: "( foo ? bar : baz )[0]. qux",
            errors: ["Unexpected whitespace before property qux."]
        },
        {
            code: "( foo ? bar : baz ) [0]. qux",
            errors: ["Unexpected whitespace before property qux.", "Unexpected whitespace before property 0."]
        },
        {
            code: "foo.bar [('baz')]",
            errors: ["Unexpected whitespace before property 'baz'."]
        },
        {
            code: "foo .bar[('baz')]",
            errors: ["Unexpected whitespace before property bar."]
        },
        {
            code: "foo .bar [('baz')]",
            errors: ["Unexpected whitespace before property 'baz'.", "Unexpected whitespace before property bar."]
        },
        {
            code: "foo [(('baz'))]",
            errors: ["Unexpected whitespace before property 'baz'."]
        },
        {
            code: "foo [[baz]]",
            errors: ["Unexpected whitespace before property [baz]."]
        },
        {
            code: "foo [ [ baz ] ]",
            errors: ["Unexpected whitespace before property [ baz ]."]
        },
        {
            code: "foo [['baz']]",
            errors: ["Unexpected whitespace before property ['baz']."]
        },
        {
            code: "foo [ [ 'baz' ] ]",
            errors: ["Unexpected whitespace before property [ 'baz' ]."]
        },
        {
            code: "foo[0] [[('baz')]]",
            errors: ["Unexpected whitespace before property [('baz')]."]
        },
        {
            code: "foo [0][[('baz')]]",
            errors: ["Unexpected whitespace before property 0."]
        },
        {
            code: "foo [0] [[('baz')]]",
            errors: ["Unexpected whitespace before property [('baz')].", "Unexpected whitespace before property 0."]
        },
        {
            code: "foo [bar.baz('qux')]",
            errors: ["Unexpected whitespace before property bar.baz('qux')."]
        },
        {
            code: "foo[bar .baz('qux')]",
            errors: ["Unexpected whitespace before property baz."]
        },
        {
            code: "foo [bar . baz('qux')]",
            errors: ["Unexpected whitespace before property bar . baz('qux').", "Unexpected whitespace before property baz."]
        },
        {
            code: "foo [(bar.baz() + 0) + qux]",
            errors: ["Unexpected whitespace before property (bar.baz() + 0) + qux."]
        },
        {
            code: "foo[(bar. baz() + 0) + qux]",
            errors: ["Unexpected whitespace before property baz."]
        },
        {
            code: "foo [(bar. baz() + 0) + qux]",
            errors: ["Unexpected whitespace before property (bar. baz() + 0) + qux.", "Unexpected whitespace before property baz."]
        },
        {
            code: "foo ['bar ' + 1 + ' baz']",
            errors: ["Unexpected whitespace before property 'bar ' + 1 + ' baz'."]
        }
    ]
});
