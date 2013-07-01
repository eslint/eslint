/**
 * @fileoverview Tests for jscheck object.
 * @author Nicholas C. Zakas
 */

/*jshint node:true*/

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var vows = require("vows"),
    assert = require("assert"),
    sinon = require("sinon"),
    jscheck = require("../../lib/jscheck");

//------------------------------------------------------------------------------
// Constants
//------------------------------------------------------------------------------

var TEST_CODE = "var answer = 6 * 7;";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

vows.describe("jscheck").addBatch({

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

            jscheck.reset();
            jscheck.on("Literal", spyLiteral);
            jscheck.on("VariableDeclarator", spyVariableDeclarator);
            jscheck.on("VariableDeclaration", spyVariableDeclaration);
            jscheck.on("Identifier", spyIdentifier);
            jscheck.on("BinaryExpression", spyBinaryExpression);

            var messages = jscheck.verify(topic, config, true);

            assert.equal(messages.length, 0);
            sinon.assert.calledOnce(spyVariableDeclaration);
            sinon.assert.calledOnce(spyVariableDeclarator);
            sinon.assert.calledOnce(spyIdentifier);
            sinon.assert.calledTwice(spyLiteral);
            sinon.assert.calledOnce(spyBinaryExpression);
        },
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

            jscheck.reset();
            jscheck.on("Literal", spyLiteral);
            jscheck.on("VariableDeclarator", spyVariableDeclarator);
            jscheck.on("VariableDeclaration", spyVariableDeclaration);
            jscheck.on("Identifier", spyIdentifier);
            jscheck.on("BinaryExpression", spyBinaryExpression);
            jscheck.reset();

            var messages = jscheck.verify(topic, config, true);

            assert.equal(messages.length, 0);
            sinon.assert.notCalled(spyVariableDeclaration);
            sinon.assert.notCalled(spyVariableDeclarator);
            sinon.assert.notCalled(spyIdentifier);
            sinon.assert.notCalled(spyLiteral);
            sinon.assert.notCalled(spyBinaryExpression);
        },

        "text should not be available": function(topic) {

            var config = { rules: {} };

            jscheck.reset();
            var messages = jscheck.verify(topic, config, true);
            jscheck.reset();

            assert.equal(messages.length, 0);
            assert.isNull(jscheck.getCurrentText());
        },

        "source for nodes should not be available": function(topic) {

            var config = { rules: {} };

            jscheck.reset();
            var messages = jscheck.verify(topic, config, true);
            jscheck.reset();

            assert.equal(messages.length, 0);
            assert.isNull(jscheck.getSource({}));
        }



    }

}).export(module);
