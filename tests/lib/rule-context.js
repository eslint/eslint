/**
 * @fileoverview Tests for RuleContext object.
 * @author Nicholas C. Zakas
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var assert = require("chai").assert,
    sinon = require("sinon"),
    RuleContext = require("../../lib/rule-context");

//------------------------------------------------------------------------------
// Constants
//------------------------------------------------------------------------------

var TEST_CODE = "var answer = 6 * 7;",
    BROKEN_TEST_CODE = "var;";

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

function getVariable(scope, name) {
    var variable = null;
    scope.variables.some(function(v) {
        if (v.name === name) {
            variable = v;
            return true;
        }
        return false;
    });
    return variable;
}

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("RuleContext", function() {

    var context,
        sandbox,
        eslint;

    beforeEach(function() {
        eslint = {};
        sandbox = sinon.sandbox.create();
    });

    afterEach(function() {
        sandbox.verifyAndRestore();
        eslint = null;
        context = null;
    });

    describe("options", function() {

        it("should contain options when passed in from the constructor", function() {
            context = new RuleContext("id", eslint, [ "foo" ]);
            assert.equal(context.options[0], "foo");
        });
    });

    describe("id", function() {

        it("should contain the rule ID when passed in from the constructor", function() {
            context = new RuleContext("id", eslint, [ "foo" ]);
            assert.equal(context.id, "id");
        });
    });

    describe("report()", function() {

        it("should call eslint.report() with appropriate arguments when called", function() {
            var node = {},
                opts = {};

            eslint.report = sandbox.mock().withArgs("id", node, "Foo", opts);
            context = new RuleContext("id", eslint, [ "foo" ]);
            context.report(node, "Foo", opts);
        });
    });

    describe("getSource", function() {

        it("should call eslint.getSource() with appropriate arguments when called", function() {
            var node = {};

            eslint.getSource = sandbox.mock().withArgs(node).returns("foo");
            context = new RuleContext("id", eslint, [ "foo" ]);
            var result = context.getSource(node);
            assert.equal(result, "foo");
        });
    });

    describe("getTokens", function() {

        it("should call eslint.getTokens() with appropriate arguments when called", function() {
            var node = {};

            eslint.getTokens = sandbox.mock().withArgs(node).returns("foo");
            context = new RuleContext("id", eslint, [ "foo" ]);
            var result = context.getTokens(node);
            assert.equal(result, "foo");
        });
    });

    describe("getComments", function() {

        it("should call eslint.getComments() with appropriate arguments when called", function() {
            var node = {};

            eslint.getComments = sandbox.mock().withArgs(node).returns("foo");
            context = new RuleContext("id", eslint, [ "foo" ]);
            var result = context.getComments(node);
            assert.equal(result, "foo");
        });
    });

    describe("getAncestors", function() {

        it("should call eslint.getAncestors() with appropriate arguments when called", function() {
            var node = {};

            eslint.getAncestors = sandbox.mock().withArgs(node).returns("foo");
            context = new RuleContext("id", eslint, [ "foo" ]);
            var result = context.getAncestors(node);
            assert.equal(result, "foo");
        });
    });

    describe("getJSDocComment", function() {

        it("should call eslint.getJSDocComment() with appropriate arguments when called", function() {
            var node = {};

            eslint.getJSDocComment = sandbox.mock().withArgs(node).returns("foo");
            context = new RuleContext("id", eslint, [ "foo" ]);
            var result = context.getJSDocComment(node);
            assert.equal(result, "foo");
        });
    });

    describe("getScope", function() {

        it("should call eslint.getScope() with appropriate arguments when called", function() {
            var node = {};

            eslint.getScope = sandbox.mock().withArgs(node).returns("foo");
            context = new RuleContext("id", eslint, [ "foo" ]);
            var result = context.getScope(node);
            assert.equal(result, "foo");
        });
    });

    describe("getIndent", function() {

        it("should call eslint.getIndent() with appropriate arguments when called", function() {
            var node = {};

            eslint.getIndent = sandbox.mock().withArgs(node).returns("foo");
            context = new RuleContext("id", eslint, [ "foo" ]);
            var result = context.getIndent(node);
            assert.equal(result, "foo");
        });
    });



});
