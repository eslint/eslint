/**
 * @fileoverview Tests for no-irregular-whitespace rule.
 * @author Jonathan Kingston
 * @copyright 2014 Jonathan Kingston. All rights reserved.
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslint = require("../../../lib/eslint"),
    ESLintTester = require("eslint-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var eslintTester = new ESLintTester(eslint);
/* Ignored chars as cause parse errors: \u0085 \u200B \u2028 \u2029*/
var invalidChars = "\u000B\u000C\u00A0\u180E\ufeff\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205f\u3000";
var invalid = [];
var valid = [
    "var thing1 = ' 	';",
    "var thing2 = '\\u000B';",
    "var thing3 = '\\u000C';",
    "var thing4 = '\\u0085';",
    "var thing5 = '\\u00A0'",
    "var thing6 = '\\u180E';",
    "var thing7 = '\\ufeff';",
    "var thing8 = '\\u2000';",
    "var thing9 = '\\u2001';",
    "var thing10 = '\\u2002';",
    "var thing11 = '\\u2003';",
    "var thing12 = '\\u2004';",
    "var thing13 = '\\u2005';",
    "var thing14 = '\\u2006';",
    "var thing15 = '\\u2007';",
    "var thing16 = '\\u2008';",
    "var thing17 = '\\u2009';",
    "var thing18 = '\\u200A';",
    "var thing19 = '\\u200B';",
    "var thing20 = '\\u2028';",
    "var thing21 = '\\u2029';",
    "var thing22 = '\\u202F';",
    "var thing23 = '\\u205f';",
    "var thing24 = '\\u3000';",
    "var thing25 = 'test';"
];
var errors = [{
    message: "Irregular whitespace not allowed",
    type: "Program"
}];
var charArray = invalidChars.split("");
charArray.forEach(function (char, i) {
    var invalidCode = "var thing" + i + " = 'test'; " + char + " var thingElse = 'test';";
    invalid.push({
      code: invalidCode,
      errors: errors
    });

    valid.push("var test" + i + " = '" + char + "';");
});

valid.push("var test = 'Is this ok?';"); // Test regular string

eslintTester.addRuleTest("lib/rules/no-irregular-whitespace", {
    valid: valid,
    invalid: invalid
});
