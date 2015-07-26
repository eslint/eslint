/**
 * @fileoverview Tests for ast utils.
 * @author Gyandeep Singh
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var assert = require("chai").assert,
    sinon = require("sinon"),
    astUtils = require("../../lib/ast-utils"),
    eslint = require("../../lib/eslint");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("ast-utils", function() {
    var filename = "filename.js",
        sandbox;

    beforeEach(function() {
        sandbox = sinon.sandbox.create();
    });

    afterEach(function() {
        eslint.reset();
        sandbox.verifyAndRestore();
    });

    describe("getJSDocComment()", function() {

        beforeEach(function() {
            eslint.reset();
        });

        it("should not take a JSDoc comment from a FunctionDeclaration parent node when the node is a FunctionExpression", function() {

            var code = [
                "/** Desc*/",
                "function Foo(){var t = function(){}}"
            ].join("\n");

            function assertJSDoc(node) {
                var jsdoc = astUtils.getJSDocComment(node);
                assert.equal(jsdoc, null);
            }

            var spy = sandbox.spy(assertJSDoc);

            eslint.on("FunctionExpression", spy);
            eslint.verify(code, { rules: {}}, filename, true);
            assert.isTrue(spy.calledOnce, "Event handler should be called.");

        });

        it("should not take a JSDoc comment from a FunctionExpression parent node when the node is a FunctionExpression", function() {

            var code = [
                "/** Desc*/",
                "var f = function(){var t = function(arg){}}"
            ].join("\n");

            function assertJSDoc(node) {
                if (node.params.length === 1) {
                    var jsdoc = astUtils.getJSDocComment(node);
                    assert.equal(jsdoc, null);
                }
            }

            var spy = sandbox.spy(assertJSDoc);

            eslint.on("FunctionExpression", spy);
            eslint.verify(code, { rules: {}}, filename, true);
            assert.isTrue(spy.calledTwice, "Event handler should be called twice.");

        });

        it("should get JSDoc comment for node when the node is a FunctionDeclaration", function() {

            var code = [
                "/** Desc*/",
                "function Foo(){}"
            ].join("\n");

            function assertJSDoc(node) {
                var jsdoc = astUtils.getJSDocComment(node);
                assert.equal(jsdoc.type, "Block");
                assert.equal(jsdoc.value, "* Desc");
            }

            var spy = sandbox.spy(assertJSDoc);

            eslint.on("FunctionDeclaration", spy);
            eslint.verify(code, { rules: {}}, filename, true);
            assert.isTrue(spy.calledOnce, "Event handler should be called.");

        });

        it("should get JSDoc comment for node when the node is a FunctionDeclaration but its parent is an export", function() {

            var code = [
                "/** Desc*/",
                "export function Foo(){}"
            ].join("\n");

            function assertJSDoc(node) {
                var jsdoc = astUtils.getJSDocComment(node);
                assert.equal(jsdoc.type, "Block");
                assert.equal(jsdoc.value, "* Desc");
            }

            var spy = sandbox.spy(assertJSDoc);

            eslint.on("FunctionDeclaration", spy);
            eslint.verify(code, { ecmaFeatures: { modules: true }, rules: {}}, filename, true);
            assert.isTrue(spy.calledOnce, "Event handler should be called.");

        });


        it("should get JSDoc comment for node when the node is a FunctionDeclaration but not the first statement", function() {

            var code = [
                "'use strict';",
                "/** Desc*/",
                "function Foo(){}"
            ].join("\n");

            function assertJSDoc(node) {
                var jsdoc = astUtils.getJSDocComment(node);
                assert.equal(jsdoc.type, "Block");
                assert.equal(jsdoc.value, "* Desc");
            }

            var spy = sandbox.spy(assertJSDoc);

            eslint.on("FunctionDeclaration", spy);
            eslint.verify(code, { rules: {}}, filename, true);
            assert.isTrue(spy.calledOnce, "Event handler should be called.");

        });


        it("should not get JSDoc comment for node when the node is a FunctionDeclaration inside of an IIFE without a JSDoc comment", function() {

            var code = [
                "/** Desc*/",
                "(function(){",
                "function Foo(){}",
                "}())"
            ].join("\n");

            function assertJSDoc(node) {
                var jsdoc = astUtils.getJSDocComment(node);
                assert.isNull(jsdoc);
            }

            var spy = sandbox.spy(assertJSDoc);

            eslint.on("FunctionDeclaration", spy);
            eslint.verify(code, { rules: {}}, filename, true);
            assert.isTrue(spy.calledOnce, "Event handler should be called.");

        });

        it("should get JSDoc comment for node when the node is a FunctionDeclaration and there are multiple comments", function() {

            var code = [
                "/* Code is good */",
                "/** Desc*/",
                "function Foo(){}"
            ].join("\n");

            function assertJSDoc(node) {
                var jsdoc = astUtils.getJSDocComment(node);
                assert.equal(jsdoc.type, "Block");
                assert.equal(jsdoc.value, "* Desc");
            }

            var spy = sandbox.spy(assertJSDoc);

            eslint.on("FunctionDeclaration", spy);
            eslint.verify(code, { rules: {}}, filename, true);
            assert.isTrue(spy.calledOnce, "Event handler should be called.");

        });

        it("should get JSDoc comment for node when the node is a FunctionDeclaration inside of an IIFE", function() {

            var code = [
                "/** Code is good */",
                "(function() {",
                "/** Desc*/",
                "function Foo(){}",
                "}())"
            ].join("\n");

            function assertJSDoc(node) {
                var jsdoc = astUtils.getJSDocComment(node);
                assert.equal(jsdoc.type, "Block");
                assert.equal(jsdoc.value, "* Desc");
            }

            var spy = sandbox.spy(assertJSDoc);

            eslint.on("FunctionDeclaration", spy);
            eslint.verify(code, { rules: {}}, filename, true);
            assert.isTrue(spy.calledOnce, "Event handler should be called.");
        });

        it("should get JSDoc comment for node when the node is a FunctionExpression inside of an object literal", function() {

            var code = [
                "/** Code is good */",
                "var o = {",
                "/** Desc*/",
                "foo: function(){}",
                "};"
            ].join("\n");

            function assertJSDoc(node) {
                var jsdoc = astUtils.getJSDocComment(node);
                assert.equal(jsdoc.type, "Block");
                assert.equal(jsdoc.value, "* Desc");
            }

            var spy = sandbox.spy(assertJSDoc);

            eslint.on("FunctionExpression", spy);
            eslint.verify(code, { rules: {}}, filename, true);
            assert.isTrue(spy.calledOnce, "Event handler should be called.");
        });

        it("should get JSDoc comment for node when the node is a ArrowFunctionExpression inside of an object literal", function() {

            var code = [
                "/** Code is good */",
                "var o = {",
                "/** Desc*/",
                "foo: () => {}",
                "};"
            ].join("\n");

            function assertJSDoc(node) {
                var jsdoc = astUtils.getJSDocComment(node);
                assert.equal(jsdoc.type, "Block");
                assert.equal(jsdoc.value, "* Desc");
            }

            var spy = sandbox.spy(assertJSDoc);

            eslint.on("ArrowFunctionExpression", spy);
            eslint.verify(code, { ecmaFeatures: { arrowFunctions: true }, rules: {}}, filename, true);
            assert.isTrue(spy.calledOnce, "Event handler should be called.");
        });

        it("should get JSDoc comment for node when the node is a FunctionExpression in an assignment", function() {

            var code = [
                "/** Code is good */",
                "/** Desc*/",
                "Foo.bar = function(){}"
            ].join("\n");

            function assertJSDoc(node) {
                var jsdoc = astUtils.getJSDocComment(node);
                assert.equal(jsdoc.type, "Block");
                assert.equal(jsdoc.value, "* Desc");
            }

            var spy = sandbox.spy(assertJSDoc);

            eslint.on("FunctionExpression", spy);
            eslint.verify(code, { rules: {}}, filename, true);
            assert.isTrue(spy.calledOnce, "Event handler should be called.");
        });

        it("should get JSDoc comment for node when the node is a FunctionExpression in an assignment inside an IIFE", function() {

            var code = [
                "/** Code is good */",
                "(function iife() {",
                "/** Desc*/",
                "Foo.bar = function(){}",
                "}());"
            ].join("\n");

            function assertJSDoc(node) {
                if (!node.id) {
                    var jsdoc = astUtils.getJSDocComment(node);
                    assert.equal(jsdoc.type, "Block");
                    assert.equal(jsdoc.value, "* Desc");
                }
            }

            var spy = sandbox.spy(assertJSDoc);

            eslint.on("FunctionExpression", spy);
            eslint.verify(code, { rules: {}}, filename, true);
            assert.isTrue(spy.calledTwice, "Event handler should be called.");
        });

        it("should not get JSDoc comment for node when the node is a FunctionExpression in an assignment inside an IIFE without a JSDoc comment", function() {

            var code = [
                "/** Code is good */",
                "(function iife() {",
                "//* whatever",
                "Foo.bar = function(){}",
                "}());"
            ].join("\n");

            function assertJSDoc(node) {
                if (!node.id) {
                    var jsdoc = astUtils.getJSDocComment(node);
                    assert.isNull(jsdoc);
                }
            }

            var spy = sandbox.spy(assertJSDoc);

            eslint.on("FunctionExpression", spy);
            eslint.verify(code, { rules: {}}, filename, true);
            assert.isTrue(spy.calledTwice, "Event handler should be called.");
        });

        it("should not get JSDoc comment for node when the node is a FunctionExpression inside of a CallExpression", function() {

            var code = [
                "/** Code is good */",
                "module.exports = (function() {",
                "}());"
            ].join("\n");

            function assertJSDoc(node) {
                if (!node.id) {
                    var jsdoc = astUtils.getJSDocComment(node);
                    assert.isNull(jsdoc);
                }
            }

            var spy = sandbox.spy(assertJSDoc);

            eslint.on("FunctionExpression", spy);
            eslint.verify(code, { rules: {}}, filename, true);
            assert.isTrue(spy.calledOnce, "Event handler should be called.");
        });

        it("should not get JSDoc comment for node when the node is a FunctionExpression in an assignment inside an IIFE without a JSDoc comment", function() {

            var code = [
                "/**",
                " * Merges two objects together.",
                " * @param {Object} target of the cloning operation",
                " * @param {Object} [source] object",
                " * @returns {void}",
                " */",
                "exports.mixin = function(target, source) {",
                "    Object.keys(source).forEach(function forEach(key) {",
                "        target[key] = source[key];",
                "    });",
                "};"
            ].join("\n");

            function assertJSDoc(node) {
                if (node.id) {
                    var jsdoc = astUtils.getJSDocComment(node);
                    assert.isNull(jsdoc);
                }
            }

            var spy = sandbox.spy(assertJSDoc);

            eslint.on("FunctionExpression", spy);
            eslint.verify(code, { rules: {}}, filename, true);
            assert.isTrue(spy.calledTwice, "Event handler should be called.");
        });

    });

    describe("when retrieving comments", function() {
        var code = [
            "// my line comment",
            "var a = 42;",
            "/* my block comment */"
        ].join("\n");

        it("should attach them to all nodes", function() {
            function assertCommentCount(leading, trailing) {
                return function(node) {
                    var comments = astUtils.getComments(node);
                    assert.equal(comments.leading.length, leading);
                    assert.equal(comments.trailing.length, trailing);
                };
            }

            var config = { rules: {} };

            eslint.reset();
            eslint.on("Program", assertCommentCount(0, 0));
            eslint.on("VariableDeclaration", assertCommentCount(1, 1));
            eslint.on("VariableDeclarator", assertCommentCount(0, 0));
            eslint.on("Identifier", assertCommentCount(0, 0));
            eslint.on("Literal", assertCommentCount(0, 0));

            eslint.verify(code, config, filename, true);
        });

        it("should fire LineComment event", function() {

            function handler(node) {
                var sourceCode = eslint.getSource(node);
                assert.equal(node.value, " my line comment");
                assert.equal(sourceCode, "// my line comment");
            }

            var config = { rules: {} },
                spy = sandbox.spy(handler);

            eslint.reset();
            eslint.on("LineComment", spy);

            eslint.verify(code, config, filename, true);
            assert(spy.calledOnce, "Handler should be called.");
        });

        it("should fire LineComment and LineComment:exit events", function() {

            function handler(node) {
                var sourceCode = eslint.getSource(node);
                assert.equal(node.value, " my line comment");
                assert.equal(sourceCode, "// my line comment");
            }

            var config = { rules: {} },
                spy = sandbox.spy(handler);

            eslint.reset();
            eslint.on("LineComment", spy);
            eslint.on("LineComment:exit", spy);

            eslint.verify(code, config, filename, true);
            assert(spy.calledTwice, "Handler should be called.");
        });

        it("should fire BlockComment event", function() {

            function handler(node) {
                var sourceCode = eslint.getSource(node);
                assert.equal(node.value, " my block comment ");
                assert.equal(sourceCode, "/* my block comment */");
            }

            var config = { rules: {} },
                spy = sandbox.spy(handler);

            eslint.reset();
            eslint.on("BlockComment", spy);

            eslint.verify(code, config, filename, true);
            assert(spy.calledOnce, "Handler should be called.");
        });

        it("should fire LineComment event for top-level comment", function() {

            function handler(node) {
                var sourceCode = eslint.getSource(node);
                assert.equal(node.value, " fixme");
                assert.equal(sourceCode, "// fixme");
            }

            var config = { rules: {} },
                spy = sandbox.spy(handler);

            eslint.reset();
            eslint.on("LineComment", spy);

            eslint.verify("// fixme", config, filename, true);
            assert(spy.calledOnce, "Handler should be called.");
        });

        it("should fire BlockComment:exit event", function() {

            function handler(node) {
                var sourceCode = eslint.getSource(node);
                assert.equal(node.value, " my block comment ");
                assert.equal(sourceCode, "/* my block comment */");
            }

            var config = { rules: {} },
                spy = sandbox.spy(handler);

            eslint.reset();
            eslint.on("BlockComment", spy);
            eslint.on("BlockComment:exit", spy);

            eslint.verify(code, config, filename, true);
            assert(spy.calledTwice, "Handler should be called.");
        });

    });

    describe("isTokenSpaced", function() {
        it("should return false if its not spaced", function() {
            function checker(node) {
                assert.isFalse(astUtils.isTokenSpaced(eslint.getTokenBefore(node), node));
            }

            eslint.reset();
            eslint.on("BlockStatement", checker);
            eslint.verify("if(a){}", {}, filename, true);
        });

        it("should return true if its spaced", function() {
            function checker(node) {
                assert.isTrue(astUtils.isTokenSpaced(eslint.getTokenBefore(node), node));
            }

            eslint.reset();
            eslint.on("BlockStatement", checker);
            eslint.verify("if(a) {}", {}, filename, true);
        });
    });

    describe("isTokenOnSameLine", function() {
        it("should return false if its not on sameline", function() {
            function checker(node) {
                assert.isFalse(astUtils.isTokenOnSameLine(eslint.getTokenBefore(node), node));
            }

            eslint.reset();
            eslint.on("BlockStatement", checker);
            eslint.verify("if(a)\n{}", {}, filename, true);
        });

        it("should return true if its on sameline", function() {
            function checker(node) {
                assert.isTrue(astUtils.isTokenOnSameLine(eslint.getTokenBefore(node), node));
            }

            eslint.reset();
            eslint.on("BlockStatement", checker);
            eslint.verify("if(a){}", {}, filename, true);
        });
    });

    describe("isNullOrUndefined", function() {
        it("should return true if its null", function() {
            function checker(node) {
                assert.isTrue(astUtils.isNullOrUndefined(node.arguments[0]));
            }

            eslint.reset();
            eslint.on("CallExpression", checker);
            eslint.verify("foo.apply(null, a, b);", {}, filename, true);
        });

        it("should return true if its undefined", function() {
            function checker(node) {
                assert.isTrue(astUtils.isNullOrUndefined(node.arguments[0]));
            }

            eslint.reset();
            eslint.on("CallExpression", checker);
            eslint.verify("foo.apply(undefined, a, b);", {}, filename, true);
        });

        it("should return false if its a number", function() {
            function checker(node) {
                assert.isFalse(astUtils.isNullOrUndefined(node.arguments[0]));
            }

            eslint.reset();
            eslint.on("CallExpression", checker);
            eslint.verify("foo.apply(1, a, b);", {}, filename, true);
        });

        it("should return false if its a string", function() {
            function checker(node) {
                assert.isFalse(astUtils.isNullOrUndefined(node.arguments[0]));
            }

            eslint.reset();
            eslint.on("CallExpression", checker);
            eslint.verify("foo.apply(`test`, a, b);", {}, filename, true);
        });

        it("should return false if its a boolean", function() {
            function checker(node) {
                assert.isFalse(astUtils.isNullOrUndefined(node.arguments[0]));
            }

            eslint.reset();
            eslint.on("CallExpression", checker);
            eslint.verify("foo.apply(false, a, b);", {}, filename, true);
        });

        it("should return false if its an object", function() {
            function checker(node) {
                assert.isFalse(astUtils.isNullOrUndefined(node.arguments[0]));
            }

            eslint.reset();
            eslint.on("CallExpression", checker);
            eslint.verify("foo.apply({}, a, b);", {}, filename, true);
        });
    });

    describe("checkReference", function() {
        // catch
        it("should return true if reference is assigned for catch", function() {
            function checker(node) {
                var variables = eslint.getDeclaredVariables(node);
                assert.lengthOf(astUtils.getModifyingReferences(variables[0].references), 1);
            }

            eslint.reset();
            eslint.on("CatchClause", checker);
            eslint.verify("try { } catch (e) { e = 10; }", { rules: {} }, filename, true);
        });

        // const
        it("should return true if reference is assigned for const", function() {
            function checker(node) {
                var variables = eslint.getDeclaredVariables(node);
                assert.lengthOf(astUtils.getModifyingReferences(variables[0].references), 1);
            }

            eslint.reset();
            eslint.on("VariableDeclaration", checker);
            eslint.verify("const a = 1; a = 2;", {ecmaFeatures: {blockBindings: true}}, filename, true);
        });

        it("should return false if reference is not assigned for const", function() {
            function checker(node) {
                var variables = eslint.getDeclaredVariables(node);
                assert.lengthOf(astUtils.getModifyingReferences(variables[0].references), 0);
            }

            eslint.reset();
            eslint.on("VariableDeclaration", checker);
            eslint.verify("const a = 1; c = 2;", {ecmaFeatures: {blockBindings: true}}, filename, true);
        });

        // class
        it("should return true if reference is assigned for class", function() {
            function checker(node) {
                var variables = eslint.getDeclaredVariables(node);
                assert.lengthOf(astUtils.getModifyingReferences(variables[0].references), 1);
                assert.lengthOf(astUtils.getModifyingReferences(variables[1].references), 0);
            }

            eslint.reset();
            eslint.on("ClassDeclaration", checker);
            eslint.verify("class A { }\n A = 1;", {ecmaFeatures: {classes: true}}, filename, true);
        });

        it("should return false if reference is not assigned for class", function() {
            function checker(node) {
                var variables = eslint.getDeclaredVariables(node);
                assert.lengthOf(astUtils.getModifyingReferences(variables[0].references), 0);
            }

            eslint.reset();
            eslint.on("ClassDeclaration", checker);
            eslint.verify("class A { } foo(A);", {ecmaFeatures: {classes: true}}, filename, true);
        });
    });
});
