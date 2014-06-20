/**
 * @fileoverview Tests for missing-err rule.
 * @author Jamund Ferguson
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
		{ code: "var test = function(error) {if(! error){doSomethingHere();}};", args: [2, "error"] }
	],
	invalid: [
		{ code: "function test(err) {}", errors: [{ message: "Expected error to be handled.", type: "FunctionDeclaration"}] },
		{ code: "function test(err, data) {}", errors: [{ message: "Expected error to be handled.", type: "FunctionDeclaration"}] },
		{ code: "function test(err) {errorLookingWord();}", errors: [{ message: "Expected error to be handled.", type: "FunctionDeclaration"}] },
		{ code: "function test(err) {try{} catch(err) {}}", errors: [{ message: "Expected error to be handled.", type: "FunctionDeclaration"}] },
		{ code: "function test(err, callback) { foo(function(err, callback) {}); }", errors: [{ message: "Expected error to be handled.", type: "FunctionExpression"}, { message: "Expected error to be handled.", type: "FunctionDeclaration"}]},
		{ code: "var test = function(err) {};", errors: [{ message: "Expected error to be handled.", type: "FunctionExpression"}] },
		{ code: "var test = function test(err, data) {};", errors: [{ message: "Expected error to be handled.", type: "FunctionExpression"}] },
		{ code: "var test = function test(err) {/* if(err){} */};", errors: [{ message: "Expected error to be handled.", type: "FunctionExpression"}] },
		{ code: "function test(err) {doSomethingHere(function(err){console.log(err);})}", errors: [{ message: "Expected error to be handled.", type: "FunctionDeclaration"}] },
		{ code: "function test(error) {}", args: [2, "error"], errors: [{ message: "Expected error to be handled.", type: "FunctionDeclaration"}] },
		{ code: "getData(function(err, data) {getMoreDataWith(data, function(err, moreData) {if (err) {}getEvenMoreDataWith(moreData, function(err, allOfTheThings) {if (err) {}});}); });", errors: [{ message: "Expected error to be handled.", type: "FunctionExpression"}]},
		{ code: "getData(function(err, data) {getMoreDataWith(data, function(err, moreData) {getEvenMoreDataWith(moreData, function(err, allOfTheThings) {if (err) {}});}); });", errors: [{ message: "Expected error to be handled.", type: "FunctionExpression"}, { message: "Expected error to be handled.", type: "FunctionExpression"}]},
		{ code: "function userHandler(err) {logThisAction(function(err) {if (err) { console.log(err); } })}", errors: [{ message: "Expected error to be handled."}]},
		{ code: "function help() { function userHandler(err) {function tester(err) { err; process.nextTick(function() { err; }); } } }",  errors: [{ message: "Expected error to be handled."}]}
	]
});
