/**
 * @fileoverview Disallows or enforces spaces inside computed properties.
 * @author Jamund Ferguson
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/computed-property-spacing"),
    { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("computed-property-spacing", rule, {

    valid: [

        // default - never
        "obj[foo]",
        "obj['foo']",
        { code: "var x = {[b]: a}", parserOptions: { ecmaVersion: 6 } },

        // always
        { code: "obj[ foo ]", options: ["always"] },
        { code: "obj[\nfoo\n]", options: ["always"] },
        { code: "obj[ 'foo' ]", options: ["always"] },
        { code: "obj[ 'foo' + 'bar' ]", options: ["always"] },
        { code: "obj[ obj2[ foo ] ]", options: ["always"] },
        { code: "obj.map(function(item) { return [\n1,\n2,\n3,\n4\n]; })", options: ["always"] },
        { code: "obj[ 'map' ](function(item) { return [\n1,\n2,\n3,\n4\n]; })", options: ["always"] },
        { code: "obj[ 'for' + 'Each' ](function(item) { return [\n1,\n2,\n3,\n4\n]; })", options: ["always"] },
        { code: "var foo = obj[ 1 ]", options: ["always"] },
        { code: "var foo = obj[ 'foo' ];", options: ["always"] },
        { code: "var foo = obj[ [1, 1] ];", options: ["always"] },

        // always - objectLiteralComputedProperties
        { code: "var x = {[ \"a\" ]: a}", options: ["always"], parserOptions: { ecmaVersion: 6 } },
        { code: "var y = {[ x ]: a}", options: ["always"], parserOptions: { ecmaVersion: 6 } },
        { code: "var x = {[ \"a\" ]() {}}", options: ["always"], parserOptions: { ecmaVersion: 6 } },
        { code: "var y = {[ x ]() {}}", options: ["always"], parserOptions: { ecmaVersion: 6 } },

        // always - unrelated cases
        { code: "var foo = {};", options: ["always"] },
        { code: "var foo = [];", options: ["always"] },

        // never
        { code: "obj[foo]", options: ["never"] },
        { code: "obj['foo']", options: ["never"] },
        { code: "obj['foo' + 'bar']", options: ["never"] },
        { code: "obj['foo'+'bar']", options: ["never"] },
        { code: "obj[obj2[foo]]", options: ["never"] },
        { code: "obj.map(function(item) { return [\n1,\n2,\n3,\n4\n]; })", options: ["never"] },
        { code: "obj['map'](function(item) { return [\n1,\n2,\n3,\n4\n]; })", options: ["never"] },
        { code: "obj['for' + 'Each'](function(item) { return [\n1,\n2,\n3,\n4\n]; })", options: ["never"] },
        { code: "obj[\nfoo]", options: ["never"] },
        { code: "obj[foo\n]", options: ["never"] },
        { code: "var foo = obj[1]", options: ["never"] },
        { code: "var foo = obj['foo'];", options: ["never"] },
        { code: "var foo = obj[[ 1, 1 ]];", options: ["never"] },

        // never - objectLiteralComputedProperties
        { code: "var x = {[\"a\"]: a}", options: ["never"], parserOptions: { ecmaVersion: 6 } },
        { code: "var y = {[x]: a}", options: ["never"], parserOptions: { ecmaVersion: 6 } },
        { code: "var x = {[\"a\"]() {}}", options: ["never"], parserOptions: { ecmaVersion: 6 } },
        { code: "var y = {[x]() {}}", options: ["never"], parserOptions: { ecmaVersion: 6 } },

        // never - unrelated cases
        { code: "var foo = {};", options: ["never"] },
        { code: "var foo = [];", options: ["never"] },

        //------------------------------------------------------------------------------
        // Classes
        //------------------------------------------------------------------------------

        // test default settings
        {
            code: "class A { [ a ](){} }",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "class A { [ a ](){} get [ b ](){} set [ c ](foo){} static [ d ](){} static get [ e ](){} static set [ f ](bar){} }",
            options: ["never"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "A = class { [ a ](){} get [ b ](){} set [ c ](foo){} static [ d ](){} static get [ e ](){} static set [ f ](bar){} }",
            options: ["never", {}],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "A = class { [a](){} }",
            options: ["always"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "A = class { [a](){} get [b](){} set [c](foo){} static [d](){} static get [e](){} static set [f](bar){} }",
            options: ["always"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "class A { [a](){} get [b](){} set [c](foo){} static [d](){} static get [e](){} static set [f](bar){} }",
            options: ["always", {}],
            parserOptions: { ecmaVersion: 6 }
        },

        // explicitly disabled option
        {
            code: "class A { [ a ](){} }",
            options: ["never", { enforceForClassMembers: false }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "A = class { [ a ](){} get [ b ](){} set [ c ](foo){} static [ d ](){} static get [ e ](){} static set [ f ](bar){} }",
            options: ["never", { enforceForClassMembers: false }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "A = class { [a](){} }",
            options: ["always", { enforceForClassMembers: false }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "class A { [a](){} get [b](){} set [b](foo){} static [c](){} static get [d](){} static set [d](bar){} }",
            options: ["always", { enforceForClassMembers: false }],
            parserOptions: { ecmaVersion: 6 }
        },

        // valid spacing
        {
            code: "A = class { [a](){} }",
            options: ["never", { enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "class A { [a] ( ) { } }",
            options: ["never", { enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "A = class { [ \n a \n ](){} }",
            options: ["never", { enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "class A { [a](){} get [b](){} set [b](foo){} static [c](){} static get [d](){} static set [d](bar){} }",
            options: ["never", { enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "class A { [ a ](){} }",
            options: ["always", { enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "class A { [ a ](){}[ b ](){} }",
            options: ["always", { enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "A = class { [\na\n](){} }",
            options: ["always", { enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "A = class { [ a ](){} get [ b ](){} set [ c ](foo){} static [ d ](){} static get [ e ](){} static set [ f ](bar){} }",
            options: ["always", { enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 }
        },

        // non-computed
        {
            code: "class A { a ( ) { } get b(){} set b ( foo ){} static c (){} static get d() {} static set d( bar ) {} }",
            options: ["never", { enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "A = class {a(){}get b(){}set b(foo){}static c(){}static get d(){}static set d(bar){}}",
            options: ["always", { enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 }
        }
    ],

    invalid: [
        {
            code: "var foo = obj[ 1];",
            output: "var foo = obj[ 1 ];",
            options: ["always"],
            errors: [
                {
                    messageId: "missingSpaceBefore",
                    data: { tokenValue: "]" },
                    type: "MemberExpression",
                    column: 17,
                    line: 1
                }
            ]
        },
        {
            code: "var foo = obj[1 ];",
            output: "var foo = obj[ 1 ];",
            options: ["always"],
            errors: [
                {
                    messageId: "missingSpaceAfter",
                    data: { tokenValue: "[" },
                    type: "MemberExpression",
                    column: 14,
                    line: 1
                }
            ]
        },
        {
            code: "var foo = obj[ 1];",
            output: "var foo = obj[1];",
            options: ["never"],
            errors: [
                {
                    messageId: "unexpectedSpaceAfter",
                    data: { tokenValue: "[" },
                    type: "MemberExpression",
                    column: 14,
                    line: 1
                }
            ]
        },
        {
            code: "var foo = obj[1 ];",
            output: "var foo = obj[1];",
            options: ["never"],
            errors: [
                {
                    messageId: "unexpectedSpaceBefore",
                    data: { tokenValue: "]" },
                    type: "MemberExpression"
                }
            ]
        },
        {
            code: "obj[ foo ]",
            output: "obj[foo]",
            options: ["never"],
            errors: [
                {
                    messageId: "unexpectedSpaceAfter",
                    data: { tokenValue: "[" },
                    type: "MemberExpression",
                    column: 4,
                    line: 1
                },
                {
                    messageId: "unexpectedSpaceBefore",
                    data: { tokenValue: "]" },
                    type: "MemberExpression",
                    column: 10,
                    line: 1
                }
            ]
        },
        {
            code: "obj[foo ]",
            output: "obj[foo]",
            options: ["never"],
            errors: [
                {
                    messageId: "unexpectedSpaceBefore",
                    data: { tokenValue: "]" },
                    type: "MemberExpression",
                    column: 9,
                    line: 1
                }
            ]
        },
        {
            code: "obj[ foo]",
            output: "obj[foo]",
            options: ["never"],
            errors: [
                {
                    messageId: "unexpectedSpaceAfter",
                    data: { tokenValue: "[" },
                    type: "MemberExpression",
                    column: 4,
                    line: 1
                }
            ]
        },
        {
            code: "var foo = obj[1]",
            output: "var foo = obj[ 1 ]",
            options: ["always"],
            errors: [
                {
                    messageId: "missingSpaceAfter",
                    data: { tokenValue: "[" },
                    type: "MemberExpression",
                    column: 14,
                    line: 1
                },
                {
                    messageId: "missingSpaceBefore",
                    data: { tokenValue: "]" },
                    type: "MemberExpression",
                    column: 16,
                    line: 1
                }
            ]
        },

        // always - objectLiteralComputedProperties
        {
            code: "var x = {[a]: b}",
            output: "var x = {[ a ]: b}",
            options: ["always"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "missingSpaceAfter",
                    data: { tokenValue: "[" },
                    type: "Property",
                    column: 10,
                    line: 1
                },
                {
                    messageId: "missingSpaceBefore",
                    data: { tokenValue: "]" },
                    type: "Property",
                    column: 12,
                    line: 1
                }
            ]
        },
        {
            code: "var x = {[a ]: b}",
            output: "var x = {[ a ]: b}",
            options: ["always"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "missingSpaceAfter",
                    data: { tokenValue: "[" },
                    type: "Property",
                    column: 10,
                    line: 1
                }
            ]
        },
        {
            code: "var x = {[ a]: b}",
            output: "var x = {[ a ]: b}",
            options: ["always"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "missingSpaceBefore",
                    data: { tokenValue: "]" },
                    type: "Property",
                    column: 13,
                    line: 1
                }
            ]
        },

        // never - objectLiteralComputedProperties
        {
            code: "var x = {[ a ]: b}",
            output: "var x = {[a]: b}",
            options: ["never"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "unexpectedSpaceAfter",
                    data: { tokenValue: "[" },
                    type: "Property",
                    column: 10,
                    line: 1
                },
                {
                    messageId: "unexpectedSpaceBefore",
                    data: { tokenValue: "]" },
                    type: "Property",
                    column: 14,
                    line: 1
                }
            ]
        },
        {
            code: "var x = {[a ]: b}",
            output: "var x = {[a]: b}",
            options: ["never"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "unexpectedSpaceBefore",
                    data: { tokenValue: "]" },
                    type: "Property",
                    column: 13,
                    line: 1
                }
            ]
        },
        {
            code: "var x = {[ a]: b}",
            output: "var x = {[a]: b}",
            options: ["never"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "unexpectedSpaceAfter",
                    data: { tokenValue: "[" },
                    type: "Property",
                    column: 10,
                    line: 1
                }
            ]
        },
        {
            code: "var x = {[ a\n]: b}",
            output: "var x = {[a\n]: b}",
            options: ["never"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "unexpectedSpaceAfter",
                    data: { tokenValue: "[" },
                    type: "Property",
                    column: 10,
                    line: 1
                }
            ]
        },

        //------------------------------------------------------------------------------
        // Classes
        //------------------------------------------------------------------------------

        // never
        {
            code: "class A { [ a](){} }",
            output: "class A { [a](){} }",
            options: ["never", { enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "unexpectedSpaceAfter",
                    data: { tokenValue: "[" },
                    type: "MethodDefinition",
                    column: 11,
                    line: 1
                }
            ]
        },
        {
            code: "A = class { [a](){} b(){} static [c ](){} static [d](){}}",
            output: "A = class { [a](){} b(){} static [c](){} static [d](){}}",
            options: ["never", { enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "unexpectedSpaceBefore",
                    data: { tokenValue: "]" },
                    type: "MethodDefinition",
                    column: 37,
                    line: 1
                }
            ]
        },
        {
            code: "class A { get [a ](){} set [ a](foo){} get b(){} static set b(bar){} static get [ a](){} static set [a ](baz){} }",
            output: "class A { get [a](){} set [a](foo){} get b(){} static set b(bar){} static get [a](){} static set [a](baz){} }",
            options: ["never", { enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "unexpectedSpaceBefore",
                    data: { tokenValue: "]" },
                    type: "MethodDefinition",
                    column: 18,
                    line: 1
                },
                {
                    messageId: "unexpectedSpaceAfter",
                    data: { tokenValue: "[" },
                    type: "MethodDefinition",
                    column: 28,
                    line: 1
                },
                {
                    messageId: "unexpectedSpaceAfter",
                    data: { tokenValue: "[" },
                    type: "MethodDefinition",
                    column: 81,
                    line: 1
                },
                {
                    messageId: "unexpectedSpaceBefore",
                    data: { tokenValue: "]" },
                    type: "MethodDefinition",
                    column: 104,
                    line: 1
                }
            ]
        },
        {
            code: "A = class { [ a ](){} get [ b ](){} set [ c ](foo){} static [ d ](){} static get [ e ](){} static set [ f ](bar){} }",
            output: "A = class { [a](){} get [b](){} set [c](foo){} static [d](){} static get [e](){} static set [f](bar){} }",
            options: ["never", { enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "unexpectedSpaceAfter",
                    data: { tokenValue: "[" },
                    type: "MethodDefinition",
                    column: 13,
                    line: 1
                },
                {
                    messageId: "unexpectedSpaceBefore",
                    data: { tokenValue: "]" },
                    type: "MethodDefinition",
                    column: 17,
                    line: 1
                },
                {
                    messageId: "unexpectedSpaceAfter",
                    data: { tokenValue: "[" },
                    type: "MethodDefinition",
                    column: 27,
                    line: 1
                },
                {
                    messageId: "unexpectedSpaceBefore",
                    data: { tokenValue: "]" },
                    type: "MethodDefinition",
                    column: 31,
                    line: 1
                },
                {
                    messageId: "unexpectedSpaceAfter",
                    data: { tokenValue: "[" },
                    type: "MethodDefinition",
                    column: 41,
                    line: 1
                },
                {
                    messageId: "unexpectedSpaceBefore",
                    data: { tokenValue: "]" },
                    type: "MethodDefinition",
                    column: 45,
                    line: 1
                },
                {
                    messageId: "unexpectedSpaceAfter",
                    data: { tokenValue: "[" },
                    type: "MethodDefinition",
                    column: 61,
                    line: 1
                },
                {
                    messageId: "unexpectedSpaceBefore",
                    data: { tokenValue: "]" },
                    type: "MethodDefinition",
                    column: 65,
                    line: 1
                },
                {
                    messageId: "unexpectedSpaceAfter",
                    data: { tokenValue: "[" },
                    type: "MethodDefinition",
                    column: 82,
                    line: 1
                },
                {
                    messageId: "unexpectedSpaceBefore",
                    data: { tokenValue: "]" },
                    type: "MethodDefinition",
                    column: 86,
                    line: 1
                },
                {
                    messageId: "unexpectedSpaceAfter",
                    data: { tokenValue: "[" },
                    type: "MethodDefinition",
                    column: 103,
                    line: 1
                },
                {
                    messageId: "unexpectedSpaceBefore",
                    data: { tokenValue: "]" },
                    type: "MethodDefinition",
                    column: 107,
                    line: 1
                }
            ]
        },

        // always
        {
            code: "class A { [ a](){} }",
            output: "class A { [ a ](){} }",
            options: ["always", { enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "missingSpaceBefore",
                    data: { tokenValue: "]" },
                    type: "MethodDefinition",
                    column: 14,
                    line: 1
                }
            ]
        },
        {
            code: "A = class { [ a ](){} b(){} static [c ](){} static [ d ](){}}",
            output: "A = class { [ a ](){} b(){} static [ c ](){} static [ d ](){}}",
            options: ["always", { enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "missingSpaceAfter",
                    data: { tokenValue: "[" },
                    type: "MethodDefinition",
                    column: 36,
                    line: 1
                }
            ]
        },
        {
            code: "class A { get [a ](){} set [ a](foo){} get b(){} static set b(bar){} static get [ a](){} static set [a ](baz){} }",
            output: "class A { get [ a ](){} set [ a ](foo){} get b(){} static set b(bar){} static get [ a ](){} static set [ a ](baz){} }",
            options: ["always", { enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "missingSpaceAfter",
                    data: { tokenValue: "[" },
                    type: "MethodDefinition",
                    column: 15,
                    line: 1
                },
                {
                    messageId: "missingSpaceBefore",
                    data: { tokenValue: "]" },
                    type: "MethodDefinition",
                    column: 31,
                    line: 1
                },
                {
                    messageId: "missingSpaceBefore",
                    data: { tokenValue: "]" },
                    type: "MethodDefinition",
                    column: 84,
                    line: 1
                },
                {
                    messageId: "missingSpaceAfter",
                    data: { tokenValue: "[" },
                    type: "MethodDefinition",
                    column: 101,
                    line: 1
                }
            ]
        },
        {
            code: "A = class { [a](){} get [b](){} set [c](foo){} static [d](){} static get [e](){} static set [f](bar){} }",
            output: "A = class { [ a ](){} get [ b ](){} set [ c ](foo){} static [ d ](){} static get [ e ](){} static set [ f ](bar){} }",
            options: ["always", { enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "missingSpaceAfter",
                    data: { tokenValue: "[" },
                    type: "MethodDefinition",
                    column: 13,
                    line: 1
                },
                {
                    messageId: "missingSpaceBefore",
                    data: { tokenValue: "]" },
                    type: "MethodDefinition",
                    column: 15,
                    line: 1
                },
                {
                    messageId: "missingSpaceAfter",
                    data: { tokenValue: "[" },
                    type: "MethodDefinition",
                    column: 25,
                    line: 1
                },
                {
                    messageId: "missingSpaceBefore",
                    data: { tokenValue: "]" },
                    type: "MethodDefinition",
                    column: 27,
                    line: 1
                },
                {
                    messageId: "missingSpaceAfter",
                    data: { tokenValue: "[" },
                    type: "MethodDefinition",
                    column: 37,
                    line: 1
                },
                {
                    messageId: "missingSpaceBefore",
                    data: { tokenValue: "]" },
                    type: "MethodDefinition",
                    column: 39,
                    line: 1
                },
                {
                    messageId: "missingSpaceAfter",
                    data: { tokenValue: "[" },
                    type: "MethodDefinition",
                    column: 55,
                    line: 1
                },
                {
                    messageId: "missingSpaceBefore",
                    data: { tokenValue: "]" },
                    type: "MethodDefinition",
                    column: 57,
                    line: 1
                },
                {
                    messageId: "missingSpaceAfter",
                    data: { tokenValue: "[" },
                    type: "MethodDefinition",
                    column: 74,
                    line: 1
                },
                {
                    messageId: "missingSpaceBefore",
                    data: { tokenValue: "]" },
                    type: "MethodDefinition",
                    column: 76,
                    line: 1
                },
                {
                    messageId: "missingSpaceAfter",
                    data: { tokenValue: "[" },
                    type: "MethodDefinition",
                    column: 93,
                    line: 1
                },
                {
                    messageId: "missingSpaceBefore",
                    data: { tokenValue: "]" },
                    type: "MethodDefinition",
                    column: 95,
                    line: 1
                }
            ]
        }
    ]
});
