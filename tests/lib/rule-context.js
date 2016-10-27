/**
 * @fileoverview Tests for RuleContext object.
 * @author Kevin Partington
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const sinon = require("sinon"),
    assert = require("chai").assert,
    leche = require("leche"),
    realESLint = require("../../lib/eslint"),
    RuleContext = require("../../lib/rule-context");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("RuleContext", function() {
    const sandbox = sinon.sandbox.create();

    describe("report()", function() {
        let ruleContext, eslint;

        beforeEach(function() {
            eslint = leche.fake(realESLint);
            ruleContext = new RuleContext("fake-rule", eslint, 2, {}, {}, {}, "espree");
        });

        describe("old-style call with location", function() {
            it("should call eslint.report() with rule ID and severity prepended", function() {
                const node = {},
                    location = {},
                    message = "Message",
                    messageOpts = {};

                const mockESLint = sandbox.mock(eslint);

                mockESLint.expects("report")
                    .once()
                    .withArgs("fake-rule", 2, node, location, message, messageOpts);

                ruleContext.report(node, location, message, messageOpts);

                mockESLint.verify();
            });
        });

        describe("old-style call without location", function() {
            it("should call eslint.report() with rule ID and severity prepended", function() {
                const node = {},
                    message = "Message",
                    messageOpts = {};

                const mockESLint = sandbox.mock(eslint);

                mockESLint.expects("report")
                    .once()
                    .withArgs("fake-rule", 2, node, message, messageOpts);

                ruleContext.report(node, message, messageOpts);

                mockESLint.verify();
            });
        });

        describe("new-style call with all options", function() {
            it("should call eslint.report() with rule ID and severity prepended and all new-style options", function() {
                const node = {},
                    location = {},
                    message = "Message",
                    messageOpts = {},
                    fixerObj = {},
                    fix = sandbox.mock().returns(fixerObj).once();

                const mockESLint = sandbox.mock(eslint);

                mockESLint.expects("report")
                    .once()
                    .withArgs("fake-rule", 2, node, location, message, messageOpts, fixerObj);

                ruleContext.report({
                    node,
                    loc: location,
                    message,
                    data: messageOpts,
                    fix
                });

                fix.verify();
                mockESLint.verify();
            });
        });
    });

    describe("parserServices", function() {

        it("should pass through parserServices properties to context", function() {
            const services = {
                test: {}
            };
            const ruleContext = new RuleContext("fake-rule", {}, 2, {}, {}, {}, "espree", {}, services);

            assert.equal(ruleContext.parserServices.test, services.test);
        });

        it("should copy parserServices properties to a new object", function() {
            const services = {
                test: {}
            };
            const ruleContext = new RuleContext("fake-rule", {}, 2, {}, {}, {}, "espree", {}, services);

            assert.notEqual(ruleContext.parserServices, services);
        });

        it("should make context.parserServices a frozen object", function() {
            const services = {
                test: {}
            };
            const ruleContext = new RuleContext("fake-rule", {}, 2, {}, {}, {}, "espree", {}, services);

            assert.ok(Object.isFrozen(ruleContext.parserServices));
        });

    });

});
