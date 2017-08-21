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
    Linter = require("../../lib/linter"),
    RuleContext = require("../../lib/rule-context");

const realESLint = new Linter();

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("RuleContext", () => {
    const sandbox = sinon.sandbox.create();

    describe("report()", () => {
        let ruleContext, eslint;

        beforeEach(() => {
            eslint = leche.fake(realESLint);
            ruleContext = new RuleContext("fake-rule", eslint, 2, {}, {}, {}, "espree");
        });

        describe("old-style call with location", () => {
            it("should call eslint.report() with rule ID and severity prepended", () => {
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

        describe("old-style call without location", () => {
            it("should call eslint.report() with rule ID and severity prepended", () => {
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

        describe("new-style call with all options", () => {
            it("should call eslint.report() with rule ID and severity prepended and all new-style options", () => {
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
                mockESLint.expects("getSourceCode")
                    .once()
                    .returns(null);

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

            it("should merge fixes to one if 'fix' function returns an array of fixes.", () => {
                const mockESLint = sandbox.mock(eslint);

                mockESLint.expects("getSourceCode")
                    .returns({ text: "var foo = 100;" });
                mockESLint.expects("report")
                    .once()
                    .withArgs(
                        sinon.match.any,
                        sinon.match.any,
                        sinon.match.any,
                        sinon.match.any,
                        sinon.match.any,
                        sinon.match.any,
                        sinon.match({
                            range: [4, 13],
                            text: "bar = 234"
                        })
                    );

                ruleContext.report({
                    node: {},
                    loc: {},
                    message: "Message",
                    fix(fixer) {
                        return [
                            fixer.replaceTextRange([10, 13], "234"),
                            fixer.replaceTextRange([4, 7], "bar")
                        ];
                    }
                });

                mockESLint.verify();
            });

            it("should merge fixes to one if 'fix' function returns an iterator of fixes.", () => {
                const mockESLint = sandbox.mock(eslint);

                mockESLint.expects("getSourceCode").returns({ text: "var foo = 100;" });
                mockESLint.expects("report").once().withArgs(
                    sinon.match.any,
                    sinon.match.any,
                    sinon.match.any,
                    sinon.match.any,
                    sinon.match.any,
                    sinon.match.any,
                    sinon.match({
                        range: [4, 13],
                        text: "bar = 234"
                    })
                );

                ruleContext.report({
                    node: {},
                    loc: {},
                    message: "Message",
                    *fix(fixer) {
                        yield fixer.replaceTextRange([10, 13], "234");
                        yield fixer.replaceTextRange([4, 7], "bar");
                    }
                });

                mockESLint.verify();
            });

            it("should pass through fixes if only one is present", () => {
                const mockESLint = sandbox.mock(eslint);

                mockESLint.expects("getSourceCode").returns({ text: "var foo = 100;" });
                mockESLint.expects("report").once().withArgs(
                    sinon.match.any,
                    sinon.match.any,
                    sinon.match.any,
                    sinon.match.any,
                    sinon.match.any,
                    sinon.match.any,
                    sinon.match({
                        range: [10, 13],
                        text: "234"
                    })
                );

                ruleContext.report({
                    node: {},
                    loc: {},
                    message: "Message",
                    *fix(fixer) {
                        yield fixer.replaceTextRange([10, 13], "234");
                    }
                });

                mockESLint.verify();
            });

            it("should handle inserting BOM correctly.", () => {
                const mockESLint = sandbox.mock(eslint);

                mockESLint.expects("getSourceCode")
                    .returns({ text: "var foo = 100;" });
                mockESLint.expects("report")
                    .once()
                    .withArgs(
                        sinon.match.any,
                        sinon.match.any,
                        sinon.match.any,
                        sinon.match.any,
                        sinon.match.any,
                        sinon.match.any,
                        sinon.match({
                            range: [0, 13],
                            text: "\uFEFFvar bar = 234"
                        })
                    );

                ruleContext.report({
                    node: {},
                    loc: {},
                    message: "Message",
                    fix(fixer) {
                        return [
                            fixer.insertTextBeforeRange([0, 1], "\uFEFF"),
                            fixer.replaceTextRange([10, 13], "234"),
                            fixer.replaceTextRange([4, 7], "bar")
                        ];
                    }
                });

                mockESLint.verify();
            });


            it("should handle removing BOM correctly.", () => {
                const mockESLint = sandbox.mock(eslint);

                mockESLint.expects("getSourceCode")
                    .returns({ text: "var foo = 100;" });
                mockESLint.expects("report")
                    .once()
                    .withArgs(
                        sinon.match.any,
                        sinon.match.any,
                        sinon.match.any,
                        sinon.match.any,
                        sinon.match.any,
                        sinon.match.any,
                        sinon.match({
                            range: [-1, 13],
                            text: "var bar = 234"
                        })
                    );

                ruleContext.report({
                    node: {},
                    loc: {},
                    message: "Message",
                    fix(fixer) {
                        return [
                            fixer.removeRange([-1, 0]),
                            fixer.replaceTextRange([10, 13], "234"),
                            fixer.replaceTextRange([4, 7], "bar")
                        ];
                    }
                });

                mockESLint.verify();
            });

            it("should throw an assertion error if ranges are overlapped.", () => {
                const mockESLint = sandbox.mock(eslint);

                mockESLint.expects("getSourceCode")
                    .returns({ text: "var foo = 100;" });
                mockESLint.expects("report")
                    .never();

                assert.throws(() => {
                    ruleContext.report({
                        node: {},
                        loc: {},
                        message: "Message",
                        fix(fixer) {
                            return [
                                fixer.removeRange([-1, 0]),
                                fixer.removeRange([-1, 0])
                            ];
                        }
                    });
                }, "Fix objects must not be overlapped in a report.");

                mockESLint.verify();
            });

        });
    });

    describe("parserServices", () => {

        it("should pass through parserServices properties to context", () => {
            const services = {
                test: {}
            };
            const ruleContext = new RuleContext("fake-rule", {}, 2, {}, {}, {}, "espree", {}, services);

            assert.equal(ruleContext.parserServices.test, services.test);
        });

        it("should copy parserServices properties to a new object", () => {
            const services = {
                test: {}
            };
            const ruleContext = new RuleContext("fake-rule", {}, 2, {}, {}, {}, "espree", {}, services);

            assert.notEqual(ruleContext.parserServices, services);
        });

        it("should make context.parserServices a frozen object", () => {
            const services = {
                test: {}
            };
            const ruleContext = new RuleContext("fake-rule", {}, 2, {}, {}, {}, "espree", {}, services);

            assert.ok(Object.isFrozen(ruleContext.parserServices));
        });

    });

});
