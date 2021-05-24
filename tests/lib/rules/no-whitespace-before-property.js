/**
 * @fileoverview Rule to disallow whitespace before properties
 * @author Kai Cataldo
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-whitespace-before-property"),
    { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

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
        "foo['bar ' + 1 + ' baz']",
        "5['toExponential']()",

        // Optional chaining
        {
            code: "obj?.prop",
            parserOptions: { ecmaVersion: 2020 }
        },
        {
            code: "( obj )?.prop",
            parserOptions: { ecmaVersion: 2020 }
        },
        {
            code: "obj\n  ?.prop",
            parserOptions: { ecmaVersion: 2020 }
        },
        {
            code: "obj?.\n  prop",
            parserOptions: { ecmaVersion: 2020 }
        },
        {
            code: "obj?.[key]",
            parserOptions: { ecmaVersion: 2020 }
        },
        {
            code: "( obj )?.[ key ]",
            parserOptions: { ecmaVersion: 2020 }
        },
        {
            code: "obj\n  ?.[key]",
            parserOptions: { ecmaVersion: 2020 }
        },
        {
            code: "obj?.\n  [key]",
            parserOptions: { ecmaVersion: 2020 }
        },
        {
            code: "obj\n  ?.\n  [key]",
            parserOptions: { ecmaVersion: 2020 }
        }
    ],

    invalid: [
        {
            code: "foo. bar",
            output: "foo.bar",
            errors: [{
                messageId: "unexpectedWhitespace",
                data: { propName: "bar" }
            }]
        },
        {
            code: "foo .bar",
            output: "foo.bar",
            errors: [{
                messageId: "unexpectedWhitespace",
                data: { propName: "bar" }
            }]
        },
        {
            code: "foo [bar]",
            output: "foo[bar]",
            errors: [{
                messageId: "unexpectedWhitespace",
                data: { propName: "bar" }
            }]
        },
        {
            code: "foo [0]",
            output: "foo[0]",
            errors: [{
                messageId: "unexpectedWhitespace",
                data: { propName: "0" }
            }]
        },
        {
            code: "foo ['bar']",
            output: "foo['bar']",
            errors: [{
                messageId: "unexpectedWhitespace",
                data: { propName: "'bar'" }
            }]
        },
        {
            code: "foo. bar. baz",
            output: "foo.bar.baz",
            errors: [{
                messageId: "unexpectedWhitespace",
                data: { propName: "baz" }
            }, {
                messageId: "unexpectedWhitespace",
                data: { propName: "bar" }
            }]
        },
        {
            code: "foo .bar. baz",
            output: "foo.bar.baz",
            errors: [{
                messageId: "unexpectedWhitespace",
                data: { propName: "baz" }
            }, {
                messageId: "unexpectedWhitespace",
                data: { propName: "bar" }
            }]
        },
        {
            code: "foo [bar] [baz]",
            output: "foo[bar][baz]",
            errors: [{
                messageId: "unexpectedWhitespace",
                data: { propName: "baz" }
            }, {
                messageId: "unexpectedWhitespace",
                data: { propName: "bar" }
            }]
        },
        {
            code: "foo [bar][baz]",
            output: "foo[bar][baz]",
            errors: [{
                messageId: "unexpectedWhitespace",
                data: { propName: "bar" }
            }]
        },
        {
            code: "foo[bar] [baz]",
            output: "foo[bar][baz]",
            errors: [{
                messageId: "unexpectedWhitespace",
                data: { propName: "baz" }
            }]
        },
        {
            code: "foo.bar [baz]",
            output: "foo.bar[baz]",
            errors: [{
                messageId: "unexpectedWhitespace",
                data: { propName: "baz" }
            }]
        },
        {
            code: "foo. bar[baz]",
            output: "foo.bar[baz]",
            errors: [{
                messageId: "unexpectedWhitespace",
                data: { propName: "bar" }
            }]
        },
        {
            code: "foo[bar]. baz",
            output: "foo[bar].baz",
            errors: [{
                messageId: "unexpectedWhitespace",
                data: { propName: "baz" }
            }]
        },
        {
            code: "foo[ bar ] [ baz ]",
            output: "foo[ bar ][ baz ]",
            errors: [{
                messageId: "unexpectedWhitespace",
                data: { propName: "baz" }
            }]
        },
        {
            code: "foo [ 0 ][ baz ]",
            output: "foo[ 0 ][ baz ]",
            errors: [{
                messageId: "unexpectedWhitespace",
                data: { propName: "0" }
            }]
        },
        {
            code: "foo[ 0 ] [ 'baz' ]",
            output: "foo[ 0 ][ 'baz' ]",
            errors: [{
                messageId: "unexpectedWhitespace",
                data: { propName: "'baz'" }
            }]
        },

        // tabs
        {
            code: "foo\t.bar",
            output: "foo.bar",
            errors: [{
                messageId: "unexpectedWhitespace",
                data: { propName: "bar" }
            }]
        },
        {
            code: "foo.\tbar",
            output: "foo.bar",
            errors: [{
                messageId: "unexpectedWhitespace",
                data: { propName: "bar" }
            }]
        },
        {
            code: "foo\t.bar()",
            output: "foo.bar()",
            errors: [{
                messageId: "unexpectedWhitespace",
                data: { propName: "bar" }
            }]
        },
        {
            code: "foo.\tbar()",
            output: "foo.bar()",
            errors: [{
                messageId: "unexpectedWhitespace",
                data: { propName: "bar" }
            }]
        },
        {
            code: "foo\t[bar]",
            output: "foo[bar]",
            errors: [{
                messageId: "unexpectedWhitespace",
                data: { propName: "bar" }
            }]
        },
        {
            code: "foo\t[0]",
            output: "foo[0]",
            errors: [{
                messageId: "unexpectedWhitespace",
                data: { propName: "0" }
            }]
        },
        {
            code: "foo\t['bar']",
            output: "foo['bar']",
            errors: [{
                messageId: "unexpectedWhitespace",
                data: { propName: "'bar'" }
            }]
        },
        {
            code: "foo.\tbar.\tbaz",
            output: "foo.bar.baz",
            errors: [{
                messageId: "unexpectedWhitespace",
                data: { propName: "baz" }
            }, {
                messageId: "unexpectedWhitespace",
                data: { propName: "bar" }
            }]
        },
        {
            code: "foo\t.bar.\tbaz",
            output: "foo.bar.baz",
            errors: [{
                messageId: "unexpectedWhitespace",
                data: { propName: "baz" }
            }, {
                messageId: "unexpectedWhitespace",
                data: { propName: "bar" }
            }]
        },
        {
            code: "foo.\tbar().\tbaz()",
            output: "foo.bar().baz()",
            errors: [{
                messageId: "unexpectedWhitespace",
                data: { propName: "baz" }
            }, {
                messageId: "unexpectedWhitespace",
                data: { propName: "bar" }
            }]
        },
        {
            code: "foo\t.bar().\tbaz()",
            output: "foo.bar().baz()",
            errors: [{
                messageId: "unexpectedWhitespace",
                data: { propName: "baz" }
            }, {
                messageId: "unexpectedWhitespace",
                data: { propName: "bar" }
            }]
        },
        {
            code: "foo\t[bar]\t[baz]",
            output: "foo[bar][baz]",
            errors: [{
                messageId: "unexpectedWhitespace",
                data: { propName: "baz" }
            }, {
                messageId: "unexpectedWhitespace",
                data: { propName: "bar" }
            }]
        },
        {
            code: "foo\t[bar][baz]",
            output: "foo[bar][baz]",
            errors: [{
                messageId: "unexpectedWhitespace",
                data: { propName: "bar" }
            }]
        },
        {
            code: "foo[bar]\t[baz]",
            output: "foo[bar][baz]",
            errors: [{
                messageId: "unexpectedWhitespace",
                data: { propName: "baz" }
            }]
        },
        {
            code: "foo.bar\t[baz]",
            output: "foo.bar[baz]",
            errors: [{
                messageId: "unexpectedWhitespace",
                data: { propName: "baz" }
            }]
        },
        {
            code: "foo.\tbar[baz]",
            output: "foo.bar[baz]",
            errors: [{
                messageId: "unexpectedWhitespace",
                data: { propName: "bar" }
            }]
        },
        {
            code: "foo[bar].\tbaz",
            output: "foo[bar].baz",
            errors: [{
                messageId: "unexpectedWhitespace",
                data: { propName: "baz" }
            }]
        },

        // newlines
        {
            code: "foo [bar]\n .baz",
            output: "foo[bar]\n .baz",
            errors: [{
                messageId: "unexpectedWhitespace",
                data: { propName: "bar" }
            }]
        },
        {
            code: "foo. bar\n .baz",
            output: "foo.bar\n .baz",
            errors: [{
                messageId: "unexpectedWhitespace",
                data: { propName: "bar" }
            }]
        },
        {
            code: "foo .bar\n.baz",
            output: "foo.bar\n.baz",
            errors: [{
                messageId: "unexpectedWhitespace",
                data: { propName: "bar" }
            }]
        },
        {
            code: "foo.\n bar. baz",
            output: "foo.\n bar.baz",
            errors: [{
                messageId: "unexpectedWhitespace",
                data: { propName: "baz" }
            }]
        },
        {
            code: "foo.\nbar . baz",
            output: "foo.\nbar.baz",
            errors: [{
                messageId: "unexpectedWhitespace",
                data: { propName: "baz" }
            }]
        },
        {
            code: "foo. bar()\n .baz()",
            output: "foo.bar()\n .baz()",
            errors: [{
                messageId: "unexpectedWhitespace",
                data: { propName: "bar" }
            }]
        },
        {
            code: "foo .bar()\n.baz()",
            output: "foo.bar()\n.baz()",
            errors: [{
                messageId: "unexpectedWhitespace",
                data: { propName: "bar" }
            }]
        },
        {
            code: "foo.\n bar(). baz()",
            output: "foo.\n bar().baz()",
            errors: [{
                messageId: "unexpectedWhitespace",
                data: { propName: "baz" }
            }]
        },
        {
            code: "foo.\nbar() . baz()",
            output: "foo.\nbar().baz()",
            errors: [{
                messageId: "unexpectedWhitespace",
                data: { propName: "baz" }
            }]
        },
        {
            code: "foo\t[bar]\n\t.baz",
            output: "foo[bar]\n\t.baz",
            errors: [{
                messageId: "unexpectedWhitespace",
                data: { propName: "bar" }
            }]
        },
        {
            code: "foo.\tbar\n\t.baz",
            output: "foo.bar\n\t.baz",
            errors: [{
                messageId: "unexpectedWhitespace",
                data: { propName: "bar" }
            }]
        },
        {
            code: "foo\t.bar\n.baz",
            output: "foo.bar\n.baz",
            errors: [{
                messageId: "unexpectedWhitespace",
                data: { propName: "bar" }
            }]
        },
        {
            code: "foo.\n\tbar.\tbaz",
            output: "foo.\n\tbar.baz",
            errors: [{
                messageId: "unexpectedWhitespace",
                data: { propName: "baz" }
            }]
        },
        {
            code: "foo.\nbar\t.\tbaz",
            output: "foo.\nbar.baz",
            errors: [{
                messageId: "unexpectedWhitespace",
                data: { propName: "baz" }
            }]
        },
        {
            code: "foo.\tbar()\n\t.baz()",
            output: "foo.bar()\n\t.baz()",
            errors: [{
                messageId: "unexpectedWhitespace",
                data: { propName: "bar" }
            }]
        },
        {
            code: "foo\t.bar()\n.baz()",
            output: "foo.bar()\n.baz()",
            errors: [{
                messageId: "unexpectedWhitespace",
                data: { propName: "bar" }
            }]
        },
        {
            code: "foo.\n\tbar().\tbaz()",
            output: "foo.\n\tbar().baz()",
            errors: [{
                messageId: "unexpectedWhitespace",
                data: { propName: "baz" }
            }]
        },
        {
            code: "foo.\nbar()\t.\tbaz()",
            output: "foo.\nbar().baz()",
            errors: [{
                messageId: "unexpectedWhitespace",
                data: { propName: "baz" }
            }]
        },

        // parens/computed properties
        {
            code: "foo ['bar' + baz]",
            output: "foo['bar' + baz]",
            errors: [{
                messageId: "unexpectedWhitespace",
                data: { propName: "'bar' + baz" }
            }]
        },
        {
            code: "(foo + bar) .baz",
            output: "(foo + bar).baz",
            errors: [{
                messageId: "unexpectedWhitespace",
                data: { propName: "baz" }
            }]
        },
        {
            code: "(foo + bar). baz",
            output: "(foo + bar).baz",
            errors: [{
                messageId: "unexpectedWhitespace",
                data: { propName: "baz" }
            }]
        },
        {
            code: "(foo + bar) [baz]",
            output: "(foo + bar)[baz]",
            errors: [{
                messageId: "unexpectedWhitespace",
                data: { propName: "baz" }
            }]
        },
        {
            code: "(foo ? bar : baz) .qux",
            output: "(foo ? bar : baz).qux",
            errors: [{
                messageId: "unexpectedWhitespace",
                data: { propName: "qux" }
            }]
        },
        {
            code: "(foo ? bar : baz). qux",
            output: "(foo ? bar : baz).qux",
            errors: [{
                messageId: "unexpectedWhitespace",
                data: { propName: "qux" }
            }]
        },
        {
            code: "(foo ? bar : baz) [qux]",
            output: "(foo ? bar : baz)[qux]",
            errors: [{
                messageId: "unexpectedWhitespace",
                data: { propName: "qux" }
            }]
        },
        {
            code: "( foo ? bar : baz ) [0].qux",
            output: "( foo ? bar : baz )[0].qux",
            errors: [{
                messageId: "unexpectedWhitespace",
                data: { propName: "0" }
            }]
        },
        {
            code: "( foo ? bar : baz )[0] .qux",
            output: "( foo ? bar : baz )[0].qux",
            errors: [{
                messageId: "unexpectedWhitespace",
                data: { propName: "qux" }
            }]
        },
        {
            code: "( foo ? bar : baz )[0]. qux",
            output: "( foo ? bar : baz )[0].qux",
            errors: [{
                messageId: "unexpectedWhitespace",
                data: { propName: "qux" }
            }]
        },
        {
            code: "( foo ? bar : baz ) [0]. qux",
            output: "( foo ? bar : baz )[0].qux",
            errors: [{
                messageId: "unexpectedWhitespace",
                data: { propName: "qux" }
            }, {
                messageId: "unexpectedWhitespace",
                data: { propName: "0" }
            }]
        },
        {
            code: "foo.bar [('baz')]",
            output: "foo.bar[('baz')]",
            errors: [{
                messageId: "unexpectedWhitespace",
                data: { propName: "'baz'" }
            }]
        },
        {
            code: "foo .bar[('baz')]",
            output: "foo.bar[('baz')]",
            errors: [{
                messageId: "unexpectedWhitespace",
                data: { propName: "bar" }
            }]
        },
        {
            code: "foo .bar [('baz')]",
            output: "foo.bar[('baz')]",
            errors: [{
                messageId: "unexpectedWhitespace",
                data: { propName: "'baz'" }
            }, {
                messageId: "unexpectedWhitespace",
                data: { propName: "bar" }
            }]
        },
        {
            code: "foo [(('baz'))]",
            output: "foo[(('baz'))]",
            errors: [{
                messageId: "unexpectedWhitespace",
                data: { propName: "'baz'" }
            }]
        },
        {
            code: "foo [[baz]]",
            output: "foo[[baz]]",
            errors: [{
                messageId: "unexpectedWhitespace",
                data: { propName: "[baz]" }
            }]
        },
        {
            code: "foo [ [ baz ] ]",
            output: "foo[ [ baz ] ]",
            errors: [{
                messageId: "unexpectedWhitespace",
                data: { propName: "[ baz ]" }
            }]
        },
        {
            code: "foo [['baz']]",
            output: "foo[['baz']]",
            errors: [{
                messageId: "unexpectedWhitespace",
                data: { propName: "['baz']" }
            }]
        },
        {
            code: "foo [ [ 'baz' ] ]",
            output: "foo[ [ 'baz' ] ]",
            errors: [{
                messageId: "unexpectedWhitespace",
                data: { propName: "[ 'baz' ]" }
            }]
        },
        {
            code: "foo[0] [[('baz')]]",
            output: "foo[0][[('baz')]]",
            errors: [{
                messageId: "unexpectedWhitespace",
                data: { propName: "[('baz')]" }
            }]
        },
        {
            code: "foo [0][[('baz')]]",
            output: "foo[0][[('baz')]]",
            errors: [{
                messageId: "unexpectedWhitespace",
                data: { propName: "0" }
            }]
        },
        {
            code: "foo [0] [[('baz')]]",
            output: "foo[0][[('baz')]]",
            errors: [{
                messageId: "unexpectedWhitespace",
                data: { propName: "[('baz')]" }
            }, {
                messageId: "unexpectedWhitespace",
                data: { propName: "0" }
            }]
        },
        {
            code: "foo [bar.baz('qux')]",
            output: "foo[bar.baz('qux')]",
            errors: [{
                messageId: "unexpectedWhitespace",
                data: { propName: "bar.baz('qux')" }
            }]
        },
        {
            code: "foo[bar .baz('qux')]",
            output: "foo[bar.baz('qux')]",
            errors: [{
                messageId: "unexpectedWhitespace",
                data: { propName: "baz" }
            }]
        },
        {
            code: "foo [bar . baz('qux')]",
            output: "foo[bar.baz('qux')]",
            errors: [{
                messageId: "unexpectedWhitespace",
                data: { propName: "bar . baz('qux')" }
            }, {
                messageId: "unexpectedWhitespace",
                data: { propName: "baz" }
            }]
        },
        {
            code: "foo [(bar.baz() + 0) + qux]",
            output: "foo[(bar.baz() + 0) + qux]",
            errors: [{
                messageId: "unexpectedWhitespace",
                data: { propName: "(bar.baz() + 0) + qux" }
            }]
        },
        {
            code: "foo[(bar. baz() + 0) + qux]",
            output: "foo[(bar.baz() + 0) + qux]",
            errors: [{
                messageId: "unexpectedWhitespace",
                data: { propName: "baz" }
            }]
        },
        {
            code: "foo [(bar. baz() + 0) + qux]",
            output: "foo[(bar.baz() + 0) + qux]",
            errors: [{
                messageId: "unexpectedWhitespace",
                data: { propName: "(bar. baz() + 0) + qux" }
            }, {
                messageId: "unexpectedWhitespace",
                data: { propName: "baz" }
            }]
        },
        {
            code: "foo ['bar ' + 1 + ' baz']",
            output: "foo['bar ' + 1 + ' baz']",
            errors: [{
                messageId: "unexpectedWhitespace",
                data: { propName: "'bar ' + 1 + ' baz'" }
            }]
        },
        {
            code: "5 .toExponential()",
            output: null, // This case is not fixed; can't be sure whether 5..toExponential or (5).toExponential is preferred
            errors: [{
                messageId: "unexpectedWhitespace",
                data: { propName: "toExponential" }
            }]
        },
        {
            code: "5       .toExponential()",
            output: null, // Not fixed
            errors: [{
                messageId: "unexpectedWhitespace",
                data: { propName: "toExponential" }
            }]
        },
        {
            code: "08      .toExponential()",
            output: null, // Not fixed
            errors: [{
                messageId: "unexpectedWhitespace",
                data: { propName: "toExponential" }
            }]
        },
        {
            code: "0192    .toExponential()",
            output: null, // Not fixed
            errors: [{
                messageId: "unexpectedWhitespace",
                data: { propName: "toExponential" }
            }]
        },
        {
            code: "5_000       .toExponential()",
            output: null, // Not fixed,
            parserOptions: { ecmaVersion: 2021 },
            errors: [{
                messageId: "unexpectedWhitespace",
                data: { propName: "toExponential" }
            }]
        },
        {
            code: "5_000_00       .toExponential()",
            output: null, // Not fixed,
            parserOptions: { ecmaVersion: 2021 },
            errors: [{
                messageId: "unexpectedWhitespace",
                data: { propName: "toExponential" }
            }]
        },
        {
            code: "5. .toExponential()",
            output: "5..toExponential()",
            errors: [{
                messageId: "unexpectedWhitespace",
                data: { propName: "toExponential" }
            }]
        },
        {
            code: "5.0 .toExponential()",
            output: "5.0.toExponential()",
            errors: [{
                messageId: "unexpectedWhitespace",
                data: { propName: "toExponential" }
            }]
        },
        {
            code: "5.0_0 .toExponential()",
            output: "5.0_0.toExponential()",
            parserOptions: { ecmaVersion: 2021 },
            errors: [{
                messageId: "unexpectedWhitespace",
                data: { propName: "toExponential" }
            }]
        },
        {
            code: "0x5 .toExponential()",
            output: "0x5.toExponential()",
            errors: [{
                messageId: "unexpectedWhitespace",
                data: { propName: "toExponential" }
            }]
        },
        {
            code: "0x56_78 .toExponential()",
            output: "0x56_78.toExponential()",
            parserOptions: { ecmaVersion: 2021 },
            errors: [{
                messageId: "unexpectedWhitespace",
                data: { propName: "toExponential" }
            }]
        },
        {
            code: "5e0 .toExponential()",
            output: "5e0.toExponential()",
            errors: [{
                messageId: "unexpectedWhitespace",
                data: { propName: "toExponential" }
            }]
        },
        {
            code: "5e-0 .toExponential()",
            output: "5e-0.toExponential()",
            errors: [{
                messageId: "unexpectedWhitespace",
                data: { propName: "toExponential" }
            }]
        },
        {
            code: "5 ['toExponential']()",
            output: "5['toExponential']()",
            errors: [{
                messageId: "unexpectedWhitespace",
                data: { propName: "'toExponential'" }
            }]
        },
        {
            code: "05 .toExponential()",
            output: "05.toExponential()",
            errors: [{
                messageId: "unexpectedWhitespace",
                data: { propName: "toExponential" }
            }]
        },

        // Optional chaining
        {
            code: "obj?. prop",
            output: "obj?.prop",
            parserOptions: { ecmaVersion: 2020 },
            errors: [{ messageId: "unexpectedWhitespace", data: { propName: "prop" } }]
        },
        {
            code: "obj ?.prop",
            output: "obj?.prop",
            parserOptions: { ecmaVersion: 2020 },
            errors: [{ messageId: "unexpectedWhitespace", data: { propName: "prop" } }]
        },
        {
            code: "obj?. [key]",
            output: "obj?.[key]",
            parserOptions: { ecmaVersion: 2020 },
            errors: [{ messageId: "unexpectedWhitespace", data: { propName: "key" } }]
        },
        {
            code: "obj ?.[key]",
            output: "obj?.[key]",
            parserOptions: { ecmaVersion: 2020 },
            errors: [{ messageId: "unexpectedWhitespace", data: { propName: "key" } }]
        },
        {
            code: "5 ?. prop",
            output: "5?.prop",
            parserOptions: { ecmaVersion: 2020 },
            errors: [{ messageId: "unexpectedWhitespace", data: { propName: "prop" } }]
        },
        {
            code: "5 ?. [key]",
            output: "5?.[key]",
            parserOptions: { ecmaVersion: 2020 },
            errors: [{ messageId: "unexpectedWhitespace", data: { propName: "key" } }]
        },
        {
            code: "obj/* comment */?. prop",
            output: null,
            parserOptions: { ecmaVersion: 2020 },
            errors: [{ messageId: "unexpectedWhitespace", data: { propName: "prop" } }]
        },
        {
            code: "obj ?./* comment */prop",
            output: null,
            parserOptions: { ecmaVersion: 2020 },
            errors: [{ messageId: "unexpectedWhitespace", data: { propName: "prop" } }]
        }
    ]
});
