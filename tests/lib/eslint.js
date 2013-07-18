/**
 * @fileoverview Tests for eslint object.
 * @author Nicholas C. Zakas
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var vows = require("vows"),
    assert = require("assert"),
    sinon = require("sinon"),
    eslint = require("../../lib/eslint");

//------------------------------------------------------------------------------
// Constants
//------------------------------------------------------------------------------

var TEST_CODE = "var answer = 6 * 7;";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

vows.describe("eslint").addBatch({

    "when calling toSource()": {

        topic: TEST_CODE,

        "should retrieve all text when used without parameters": function(topic) {

            var config = { rules: {} };

            eslint.reset();
            eslint.on("Program", function() {
                var source = eslint.getSource();
                assert.equal(source, TEST_CODE);
            });

            eslint.verify(topic, config, true);
        },

        "should retrieve all text for root node": function(topic) {

            var config = { rules: {} };

            eslint.reset();
            eslint.on("Program", function(node) {
                var source = eslint.getSource(node);
                assert.equal(source, TEST_CODE);
            });

            eslint.verify(topic, config, true);
        },

        "should retrieve all text for binary expression": function(topic) {

            var config = { rules: {} };

            eslint.reset();
            eslint.on("BinaryExpression", function(node) {
                var source = eslint.getSource(node);
                assert.equal(source, "6 * 7");
            });

            eslint.verify(topic, config, true);
        },

        "should retrieve all text plus two characters before for binary expression": function(topic) {

            var config = { rules: {} };

            eslint.reset();
            eslint.on("BinaryExpression", function(node) {
                var source = eslint.getSource(node, 2);
                assert.equal(source, "= 6 * 7");
            });

            eslint.verify(topic, config, true);
        },

        "should retrieve all text plus one character after for binary expression": function(topic) {

            var config = { rules: {} };

            eslint.reset();
            eslint.on("BinaryExpression", function(node) {
                var source = eslint.getSource(node, 0, 1);
                assert.equal(source, "6 * 7;");
            });

            eslint.verify(topic, config, true);
        },

        "should retrieve all text plus two characters before and one character after for binary expression": function(topic) {

            var config = { rules: {} };

            eslint.reset();
            eslint.on("BinaryExpression", function(node) {
                var source = eslint.getSource(node, 2, 1);
                assert.equal(source, "= 6 * 7;");
            });

            eslint.verify(topic, config, true);
        }
    },

    "when calling getTokens": {

        topic: TEST_CODE,

        "should retrieve all tokens when used without parameters": function(topic) {

            var config = { rules: {} };

            eslint.reset();
            eslint.on("Program", function(node) {
                var tokens = eslint.getTokens();
                assert.equal(tokens.length, 7);
            });

            eslint.verify(topic, config, true);
        },

        "should retrieve all tokens for root node": function(topic) {

            var config = { rules: {} };

            eslint.reset();
            eslint.on("Program", function(node) {
                var tokens = eslint.getTokens(node);
                assert.equal(tokens.length, 7);
            });

            eslint.verify(topic, config, true);
        },

        "should retrieve all tokens for binary expression": function(topic) {

            var config = { rules: {} };

            eslint.reset();
            eslint.on("BinaryExpression", function(node) {
                var tokens = eslint.getTokens(node);
                assert.equal(tokens.length, 3);
            });

            eslint.verify(topic, config, true);
        },

        "should retrieve all tokens plus equals sign for binary expression": function(topic) {

            var config = { rules: {} };

            eslint.reset();
            eslint.on("BinaryExpression", function(node) {
                var tokens = eslint.getTokens(node, 2);
                assert.equal(tokens.length, 4);
            });

            eslint.verify(topic, config, true);
        },

        "should retrieve all tokens plus one character after for binary expression": function(topic) {

            var config = { rules: {} };

            eslint.reset();
            eslint.on("BinaryExpression", function(node) {
                var tokens = eslint.getTokens(node, 0, 1);
                assert.equal(tokens.length, 4);
            });

            eslint.verify(topic, config, true);
        },

        "should retrieve all tokens plus two characters before and one character after for binary expression": function(topic) {

            var config = { rules: {} };

            eslint.reset();
            eslint.on("BinaryExpression", function(node) {
                var tokens = eslint.getTokens(node, 2, 1);
                assert.equal(tokens.length, 5);
            });

            eslint.verify(topic, config, true);
        }
    },

    "when calling getAncestors": {

        topic: TEST_CODE,

        "should retrieve all ancestors when used": function(topic) {

            var config = { rules: {} };

            eslint.reset();
            eslint.on("BinaryExpression", function(node) {
                var ancestors = eslint.getAncestors();
                assert.equal(ancestors.length, 3);
            });

            eslint.verify(topic, config, true);
        },

        "should retrieve empty ancestors for root node": function(topic) {

            var config = { rules: {} };

            eslint.reset();
            eslint.on("Program", function(node) {
                var ancestors = eslint.getAncestors();
                assert.equal(ancestors.length, 0);
            });

            eslint.verify(topic, config, true);
        }

    },


    "when evaluating code": {

        topic: TEST_CODE,

        "events for each node type should fire": function(topic) {

            var config = { rules: {} };

            // spies for various AST node types
            var spyLiteral = sinon.spy(),
                spyVariableDeclarator = sinon.spy(),
                spyVariableDeclaration = sinon.spy(),
                spyIdentifier = sinon.spy(),
                spyBinaryExpression = sinon.spy();

            eslint.reset();
            eslint.on("Literal", spyLiteral);
            eslint.on("VariableDeclarator", spyVariableDeclarator);
            eslint.on("VariableDeclaration", spyVariableDeclaration);
            eslint.on("Identifier", spyIdentifier);
            eslint.on("BinaryExpression", spyBinaryExpression);

            var messages = eslint.verify(topic, config, true);

            assert.equal(messages.length, 0);
            sinon.assert.calledOnce(spyVariableDeclaration);
            sinon.assert.calledOnce(spyVariableDeclarator);
            sinon.assert.calledOnce(spyIdentifier);
            sinon.assert.calledTwice(spyLiteral);
            sinon.assert.calledOnce(spyBinaryExpression);
        }
    },

    "after calling reset()": {

        topic: TEST_CODE,

        "previously registered event handlers should not be called": function(topic) {

            var config = { rules: {} };

            // spies for various AST node types
            var spyLiteral = sinon.spy(),
                spyVariableDeclarator = sinon.spy(),
                spyVariableDeclaration = sinon.spy(),
                spyIdentifier = sinon.spy(),
                spyBinaryExpression = sinon.spy();

            eslint.reset();
            eslint.on("Literal", spyLiteral);
            eslint.on("VariableDeclarator", spyVariableDeclarator);
            eslint.on("VariableDeclaration", spyVariableDeclaration);
            eslint.on("Identifier", spyIdentifier);
            eslint.on("BinaryExpression", spyBinaryExpression);
            eslint.reset();

            var messages = eslint.verify(topic, config, true);

            assert.equal(messages.length, 0);
            sinon.assert.notCalled(spyVariableDeclaration);
            sinon.assert.notCalled(spyVariableDeclarator);
            sinon.assert.notCalled(spyIdentifier);
            sinon.assert.notCalled(spyLiteral);
            sinon.assert.notCalled(spyBinaryExpression);
        },

        "text should not be available": function(topic) {

            var config = { rules: {} };

            eslint.reset();
            var messages = eslint.verify(topic, config, true);
            eslint.reset();

            assert.equal(messages.length, 0);
            assert.isNull(eslint.getSource());
        },

        "source for nodes should not be available": function(topic) {

            var config = { rules: {} };

            eslint.reset();
            var messages = eslint.verify(topic, config, true);
            eslint.reset();

            assert.equal(messages.length, 0);
            assert.isNull(eslint.getSource({}));
        }



    }

}).export(module);
