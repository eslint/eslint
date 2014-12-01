/**
 * @fileoverview Tests for attach-comments.
 * @author Nicholas C. Zakas
 * @copyright 2014 Nicholas C. Zakas. All rights reserved.
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var assert = require("chai").assert,
    fs = require("fs"),
    esprima = require("esprima"),
    attachComments = require("../../../lib/util/attach-comments");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

function parse(text) {
    var ast = esprima.parse(text, {
        loc: true,
        range: true,
        raw: true,
        tokens: true,
        comment: true
    });

    attachComments(ast, ast.comments, ast.tokens);
    return ast;
}

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("attachComments()", function() {

    it("should throw an error if range information is missing", function() {
        assert.throws(function() {
            var ast = esprima.parse("var foo;", {
                tokens: true,
                comments: true
            });
            attachComments(ast, ast.comments, ast.tokens);
        }, /attachComments needs range information/);
    });

    it("should attach falls through comments to last SwitchCase trailingComments when present", function() {

        var ast = parse("switch(foo) { // foo\ncase 1: // falls through\ncase 2: doIt();\n}");
        assert.equal(ast.body[0].cases[0].trailingComments.length, 1);
        assert.equal(ast.body[0].cases[0].trailingComments[0].value, " falls through");
    });

    it("should attach falls through comments to last SwitchCase trailingComments inside a function when present", function() {

        var ast = parse("function bar(foo) { switch(foo) { // foo\ncase 1: // falls through\ncase 2: doIt();\n}\n}");
        assert.equal(ast.body[0].body.body[0].cases[0].trailingComments.length, 1);
        assert.equal(ast.body[0].body.body[0].cases[0].trailingComments[0].value, " falls through");
    });

    it("should attach no default comment to last SwitchCase trailingComments when present", function() {

        var ast = parse("switch (a) { case 1: break; \n //no default \n }");
        assert.equal(ast.body[0].cases[0].trailingComments.length, 1);
        assert.equal(ast.body[0].cases[0].trailingComments[0].value, "no default ");
    });

    it("should attach no default comment to last SwitchCase trailingComments when present with if statement", function() {

        var ast = parse("switch (a) { case 1: break; case 2: \nif (foo) {} \n //no default \n }");
        assert.equal(ast.body[0].cases[1].trailingComments.length, 1);
        assert.equal(ast.body[0].cases[1].trailingComments[0].value, "no default ");
    });

    it("should attach no default comment to last SwitchCase trailingComments inside a function when present", function() {

        var ast = parse("function bar(a) { \nswitch (a) { case 2: break; \ncase 1: break; \n //no default \n }\n}");
        assert.equal(ast.body[0].body.body[0].cases[1].trailingComments.length, 1);
        assert.equal(ast.body[0].body.body[0].cases[1].trailingComments[0].value, "no default ");
    });

    it("should attach no default comment to last SwitchCase trailingComments inside a function inside an if when present", function() {

        var ast = parse(fs.readFileSync("./tests/fixtures/attach-comments/default-case.js", "utf8"));
        var func = ast.body[0].expression.right.body.body[0].body,
            switchStatement = func.body[0];

        assert.equal(switchStatement.cases[0].trailingComments.length, 1);
        assert.equal(switchStatement.cases[0].trailingComments[0].value, " no default");
    });

    it("should attach trailing comments to last statement in a block when present", function() {

        var ast = parse("{\n\na();\n//comment\n}");
        assert.equal(ast.body[0].body[0].trailingComments.length, 1);
        assert.equal(ast.body[0].body[0].trailingComments[0].value, "comment");
    });

});
