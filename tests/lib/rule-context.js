/**
 * @fileoverview Tests for RuleContext object.
 * @author Kevin Partington
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const sinon = require("sinon"),
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
                    node: node,
                    loc: location,
                    message: message,
                    data: messageOpts,
                    fix: fix
                });

                fix.verify();
                mockESLint.verify();
            });
        });
    });

});
