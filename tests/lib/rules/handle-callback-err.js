/**
 * @fileoverview Tests for missing-err rule.
 * @author Jamund Ferguson
 * @copyright 2014 Jamund Ferguson. All rights reserved.
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

var expectedErrorMessage = "Expected error to be handled.";
var expectedFunctionDeclarationError = { message: expectedErrorMessage, type: "FunctionDeclaration" };
var expectedFunctionExpressionError = { message: expectedErrorMessage, type: "FunctionExpression" };

eslintTester.addRuleTest("lib/rules/handle-callback-err", {
    valid: [
        "function test(error) {}",
        "function test(err) {console.log(err);}",
        "function test(err, data) {if(err){ data = 'ERROR';}}",
        "var test = function(err) {console.log(err);};",
        "var test = function(err) {if(err){/* do nothing */}};",
        "var test = function(err) {if(!err){doSomethingHere();}else{};}",
        "var test = function(err, data) {if(!err) { good(); } else { bad(); }}",
        "try { } catch(err) {}",
        "getData(function(err, data) {if (err) {}getMoreDataWith(data, function(err, moreData) {if (err) {}getEvenMoreDataWith(moreData, function(err, allOfTheThings) {if (err) {}});});});",
        "var test = function(err) {if(! err){doSomethingHere();}};",
        "function test(err, data) {if (data) {doSomething(function(err) {console.error(err);});} else if (err) {console.log(err);}}",
        "function handler(err, data) {if (data) {doSomethingWith(data);} else if (err) {console.log(err);}}",
        "function handler(err) {logThisAction(function(err) {if (err) {}}); console.log(err);}",
        "function userHandler(err) {process.nextTick(function() {if (err) {}})}",
        "function help() { function userHandler(err) {function tester() { err; process.nextTick(function() { err; }); } } }",
        "function help(done) { var err = new Error('error'); done(); }",
        { code: "var test = function(error) {if(error){/* do nothing */}};", args: [2, "error"] },
        { code: "var test = (error) => {if(error){/* do nothing */}};", args: [2, "error"], ecmaFeatures: { arrowFunctions: true } },
        { code: "var test = function(error) {if(! error){doSomethingHere();}};", args: [2, "error"] },
        { code: "var test = function(err) { console.log(err); };", args: [2, "^(err|error)$"] },
        { code: "var test = function(error) { console.log(error); };", args: [2, "^(err|error)$"] },
        { code: "var test = function(anyError) { console.log(anyError); };", args: [2, "^.+Error$"] },
        { code: "var test = function(any_error) { console.log(anyError); };", args: [2, "^.+Error$"] },
        { code: "var test = function(any_error) { console.log(any_error); };", args: [2, "^.+(e|E)rror$"] }
    ],
    invalid: [
        { code: "function test(err) {}", errors: [expectedFunctionDeclarationError] },
        { code: "function test(err, data) {}", errors: [expectedFunctionDeclarationError] },
        { code: "function test(err) {errorLookingWord();}", errors: [expectedFunctionDeclarationError] },
        { code: "function test(err) {try{} catch(err) {}}", errors: [expectedFunctionDeclarationError] },
        { code: "function test(err, callback) { foo(function(err, callback) {}); }", errors: [expectedFunctionDeclarationError, expectedFunctionExpressionError]},
        { code: "var test = (err) => {};", ecmaFeatures: { arrowFunctions: true }, errors: [{ message: expectedErrorMessage, type: "ArrowFunctionExpression" }] },
        { code: "var test = function(err) {};", errors: [expectedFunctionExpressionError] },
        { code: "var test = function test(err, data) {};", errors: [expectedFunctionExpressionError] },
        { code: "var test = function test(err) {/* if(err){} */};", errors: [expectedFunctionExpressionError] },
        { code: "function test(err) {doSomethingHere(function(err){console.log(err);})}", errors: [expectedFunctionDeclarationError] },
        { code: "function test(error) {}", args: [2, "error"], errors: [expectedFunctionDeclarationError] },
        { code: "getData(function(err, data) {getMoreDataWith(data, function(err, moreData) {if (err) {}getEvenMoreDataWith(moreData, function(err, allOfTheThings) {if (err) {}});}); });", errors: [expectedFunctionExpressionError]},
        { code: "getData(function(err, data) {getMoreDataWith(data, function(err, moreData) {getEvenMoreDataWith(moreData, function(err, allOfTheThings) {if (err) {}});}); });", errors: [expectedFunctionExpressionError, expectedFunctionExpressionError]},
        { code: "function userHandler(err) {logThisAction(function(err) {if (err) { console.log(err); } })}", errors: [expectedFunctionDeclarationError]},
        { code: "function help() { function userHandler(err) {function tester(err) { err; process.nextTick(function() { err; }); } } }", errors: [expectedFunctionDeclarationError]},
        { code: "var test = function(anyError) { console.log(otherError); };", args: [2, "^.+Error$"], errors: [expectedFunctionExpressionError]},
        { code: "var test = function(anyError) { };", args: [2, "^.+Error$"], errors: [expectedFunctionExpressionError]},
        { code: "var test = function(err) { console.log(error); };", args: [2, "^(err|error)$"], errors: [expectedFunctionExpressionError]}
    ]
});
