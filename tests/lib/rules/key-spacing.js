/**
 * @fileoverview  a rule that enforces or disallows spaces after Property names (and before Property values) inside of objects.
 * @author Emory Merryman
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslint = require("../../../lib/eslint"),
    ESLintTester = require("eslint-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var eslintTester = new ESLintTester(eslint);
eslintTester.addRuleTest("lib/rules/key-spacing", {

    valid: [{
        code: "var x={foo1 : bar};",
        args: [2, "always"]
    }, {
        code: "var x={'foo2' : 'bar'};",
        args: [2, "always"]
    }, {
        code: "var x={'foo3':bar};",
        args: [2, "never"]
    }, {
        code: "var x={'foo4':'bar'};",
        args: [2, "never"]
    }],

    invalid: [{
        code: "var x={foo5:'bar'};",
        args: [1, "always"],
        errors: [{
            message: "A single space is required before ':' in the foo5 property.",
            type: "Property"
        }, {
            message: "A single space is required after ':' in the foo5 property.",
            type: "Property"
        }]
    }, {
        code: "var x={'foo6':'bar'};",
        args: [2, "always"],
        errors: [{
            message: "A single space is required before ':' in the foo6 property.",
            type: "Property"
        }, {
            message: "A single space is required after ':' in the foo6 property.",
            type: "Property"
        }]
    }, {
        code: "var x={foo7: 'bar'};",
        args: [2, "always"],
        errors: [{
            message: "A single space is required before ':' in the foo7 property.",
            type: "Property"
        }]
    }, {
        code: "var x={'foo8': 'bar'};",
        args: [2, "always"],
        errors: [{
            message: "A single space is required before ':' in the foo8 property.",
            type: "Property"
        }]
    }, {
        code: "var x={foo9 :'bar'};",
        args: [2, "always"],
        errors: [{
            message: "A single space is required after ':' in the foo9 property.",
            type: "Property"
        }]
    }, {
        code: "var x={'foo10' :'bar'};",
        args: [2, "always"],
        errors: [{
            message: "A single space is required after ':' in the foo10 property.",
            type: "Property"
        }]
    }, {
        code: "var x={foo11 : 'bar'};",
        args: [2, "never"],
        errors: [{
            message: "There must not be any spaces before ':' in the foo11 property.",
            type: "Property"
        }, {
            message: "There must not be any spaces after ':' in the foo11 property.",
            type: "Property"
        }]
    }, {
        code: "var x={'foo12' : 'bar'};",
        args: [2, "never"],
        errors: [{
            message: "There must not be any spaces before ':' in the foo12 property.",
            type: "Property"
        }, {
            message: "There must not be any spaces after ':' in the foo12 property.",
            type: "Property"
        }]
    }, {
        code: "var x={foo13 :'bar'};",
        args: [2, "never"],
        errors: [{
            message: "There must not be any spaces before ':' in the foo13 property.",
            type: "Property"
        }]
    }, {
        code: "var x={'foo14' :'bar'};",
        args: [2, "never"],
        errors: [{
            message: "There must not be any spaces before ':' in the foo14 property.",
            type: "Property"
        }]
    }, {
        code: "var x={foo15: 'bar'};",
        args: [2, "never"],
        errors: [{
            message: "There must not be any spaces after ':' in the foo15 property.",
            type: "Property"
        }]
    }, {
        code: "var x={'foo16': 'bar'};",
        args: [2, "never"],
        errors: [{
            message: "There must not be any spaces after ':' in the foo16 property.",
            type: "Property"
        }]
    }, {
        code: "var x={foo17:'bar'};",
        args: [1],
        errors: [{
            message: "A single space is required before ':' in the foo17 property.",
            type: "Property"
        }, {
            message: "A single space is required after ':' in the foo17 property.",
            type: "Property"
        }]
    }, {
        code: "var x={'foo18':'bar'};",
        args: [2],
        errors: [{
            message: "A single space is required before ':' in the foo18 property.",
            type: "Property"
        }, {
            message: "A single space is required after ':' in the foo18 property.",
            type: "Property"
        }]
    }, {
        code: "var x={foo19: 'bar'};",
        args: [2],
        errors: [{
            message: "A single space is required before ':' in the foo19 property.",
            type: "Property"
        }]
    }, {
        code: "var x={'foo20': 'bar'};",
        args: [2],
        errors: [{
            message: "A single space is required before ':' in the foo20 property.",
            type: "Property"
        }]
    }, {
        code: "var x={foo21 :'bar'};",
        args: [2],
        errors: [{
            message: "A single space is required after ':' in the foo21 property.",
            type: "Property"
        }]
    }, {
        code: "var x={'foo22' :'bar'};",
        args: [2],
        errors: [{
            message: "A single space is required after ':' in the foo22 property.",
            type: "Property"
        }]
    }, {
        code: "var x={foo23:'bar'};",
        args: [1, "sometimes"],
        errors: [{
            message: "A single space is required before ':' in the foo23 property.",
            type: "Property"
        }, {
            message: "A single space is required after ':' in the foo23 property.",
            type: "Property"
        }]
    }, {
        code: "var x={'foo24':'bar'};",
        args: [2, "sometimes"],
        errors: [{
            message: "A single space is required before ':' in the foo24 property.",
            type: "Property"
        }, {
            message: "A single space is required after ':' in the foo24 property.",
            type: "Property"
        }]
    }, {
        code: "var x={foo25: 'bar'};",
        args: [2, "sometimes"],
        errors: [{
            message: "A single space is required before ':' in the foo19 property.",
            type: "Property"
        }]
    }, {
        code: "var x={'foo26': 'bar'};",
        args: [2, "sometimes"],
        errors: [{
            message: "A single space is required before ':' in the foo26 property.",
            type: "Property"
        }]
    }, {
        code: "var x={foo27 :'bar'};",
        args: [2, "sometimes"],
        errors: [{
            message: "A single space is required after ':' in the foo27 property.",
            type: "Property"
        }]
    }, {
        code: "var x={'foo28' :'bar'};",
        args: [2, "sometimes"],
        errors: [{
            message: "A single space is required after ':' in the foo28 property.",
            type: "Property"
        }]
    }]
});
