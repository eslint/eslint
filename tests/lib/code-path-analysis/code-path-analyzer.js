/**
 * @fileoverview Tests for CodePathAnalyzer.
 * @author Toru Nagashima
 * @copyright 2015 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var assert = require("assert"),
    EventEmitter = require("events").EventEmitter,
    fs = require("fs"),
    path = require("path"),
    eslint = require("../../../lib/eslint"),
    EventGeneratorTester = require("../../../lib/testers/event-generator-tester"),
    debug = require("../../../lib/code-path-analysis/debug-helpers"),
    CodePath = require("../../../lib/code-path-analysis/code-path"),
    CodePathAnalyzer = require("../../../lib/code-path-analysis/code-path-analyzer"),
    CodePathSegment = require("../../../lib/code-path-analysis/code-path-segment"),
    NodeEventGenerator = require("../../../lib/util/node-event-generator");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

var expectedPattern = /\/\*expected\s+((?:.|[\r\n])+?)\s*\*\//g;
var lineEndingPattern = /\r?\n/g;

/**
 * Extracts the content of `/*expected` comments from a given source code.
 * It's expected DOT arrows.
 *
 * @param {string} source - A source code text.
 * @returns {string[]} DOT arrows.
 */
function getExpectedDotArrows(source) {
    expectedPattern.lastIndex = 0;

    var retv = [];
    var m;
    while ((m = expectedPattern.exec(source)) !== null) {
        retv.push(m[1].replace(lineEndingPattern, "\n"));
    }

    return retv;
}

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("CodePathAnalyzer", function() {

    afterEach(function() {
        eslint.reset();
    });

    EventGeneratorTester.testEventGeneratorInterface(
        new CodePathAnalyzer(new NodeEventGenerator(new EventEmitter()))
    );

    describe("interface of code paths", function() {
        var actual = [];

        beforeEach(function() {
            actual = [];
            eslint.defineRule("test", function() {
                return {
                    "onCodePathStart": function(codePath) {
                        actual.push(codePath);
                    }
                };
            });
            eslint.verify(
                "function foo(a) { if (a) return 0; else throw new Error(); }",
                {rules: {test: 2}}
            );
        });

        it("should have `id` as unique string", function() {
            assert(typeof actual[0].id === "string");
            assert(typeof actual[1].id === "string");
            assert(actual[0].id !== actual[1].id);
        });

        it("should have `upper` as CodePath", function() {
            assert(actual[0].upper === null);
            assert(actual[1].upper === actual[0]);
        });

        it("should have `childCodePaths` as CodePath[]", function() {
            assert(Array.isArray(actual[0].childCodePaths));
            assert(Array.isArray(actual[1].childCodePaths));
            assert(actual[0].childCodePaths.length === 1);
            assert(actual[1].childCodePaths.length === 0);
            assert(actual[0].childCodePaths[0] === actual[1]);
        });

        it("should have `initialSegment` as CodePathSegment", function() {
            assert(actual[0].initialSegment instanceof CodePathSegment);
            assert(actual[1].initialSegment instanceof CodePathSegment);
            assert(actual[0].initialSegment.prevSegments.length === 0);
            assert(actual[1].initialSegment.prevSegments.length === 0);
        });

        it("should have `finalSegments` as CodePathSegment[]", function() {
            assert(Array.isArray(actual[0].finalSegments));
            assert(Array.isArray(actual[1].finalSegments));
            assert(actual[0].finalSegments.length === 1);
            assert(actual[1].finalSegments.length === 2);
            assert(actual[0].finalSegments[0].nextSegments.length === 0);
            assert(actual[1].finalSegments[0].nextSegments.length === 0);
            assert(actual[1].finalSegments[1].nextSegments.length === 0);

            // finalSegments should include returnedSegments and thrownSegments.
            assert(actual[0].finalSegments[0] === actual[0].returnedSegments[0]);
            assert(actual[1].finalSegments[0] === actual[1].returnedSegments[0]);
            assert(actual[1].finalSegments[1] === actual[1].thrownSegments[0]);
        });

        it("should have `returnedSegments` as CodePathSegment[]", function() {
            assert(Array.isArray(actual[0].returnedSegments));
            assert(Array.isArray(actual[1].returnedSegments));
            assert(actual[0].returnedSegments.length === 1);
            assert(actual[1].returnedSegments.length === 1);
            assert(actual[0].returnedSegments[0] instanceof CodePathSegment);
            assert(actual[1].returnedSegments[0] instanceof CodePathSegment);
        });

        it("should have `thrownSegments` as CodePathSegment[]", function() {
            assert(Array.isArray(actual[0].thrownSegments));
            assert(Array.isArray(actual[1].thrownSegments));
            assert(actual[0].thrownSegments.length === 0);
            assert(actual[1].thrownSegments.length === 1);
            assert(actual[1].thrownSegments[0] instanceof CodePathSegment);
        });

        it("should have `currentSegments` as CodePathSegment[]", function() {
            assert(Array.isArray(actual[0].currentSegments));
            assert(Array.isArray(actual[1].currentSegments));
            assert(actual[0].currentSegments.length === 0);
            assert(actual[1].currentSegments.length === 0);

            // there is the current segment in progress.
            eslint.defineRule("test", function() {
                var codePath = null;
                return {
                    "onCodePathStart": function(cp) {
                        codePath = cp;
                    },
                    "ReturnStatement": function() {
                        assert(codePath.currentSegments.length === 1);
                        assert(codePath.currentSegments[0] instanceof CodePathSegment);
                    },
                    "ThrowStatement": function() {
                        assert(codePath.currentSegments.length === 1);
                        assert(codePath.currentSegments[0] instanceof CodePathSegment);
                    }
                };
            });
            eslint.verify(
                "function foo(a) { if (a) return 0; else throw new Error(); }",
                {rules: {test: 2}}
            );
        });
    });

    describe("interface of code path segments", function() {
        var actual = [];

        beforeEach(function() {
            actual = [];
            eslint.defineRule("test", function() {
                return {
                    "onCodePathSegmentStart": function(segment) {
                        actual.push(segment);
                    }
                };
            });
            eslint.verify(
                "function foo(a) { if (a) return 0; else throw new Error(); }",
                {rules: {test: 2}}
            );
        });

        it("should have `id` as unique string", function() {
            assert(typeof actual[0].id === "string");
            assert(typeof actual[1].id === "string");
            assert(typeof actual[2].id === "string");
            assert(typeof actual[3].id === "string");
            assert(actual[0].id !== actual[1].id);
            assert(actual[0].id !== actual[2].id);
            assert(actual[0].id !== actual[3].id);
            assert(actual[1].id !== actual[2].id);
            assert(actual[1].id !== actual[3].id);
            assert(actual[2].id !== actual[3].id);
        });

        it("should have `nextSegments` as CodePathSegment[]", function() {
            assert(Array.isArray(actual[0].nextSegments));
            assert(Array.isArray(actual[1].nextSegments));
            assert(Array.isArray(actual[2].nextSegments));
            assert(Array.isArray(actual[3].nextSegments));
            assert(actual[0].nextSegments.length === 0);
            assert(actual[1].nextSegments.length === 2);
            assert(actual[2].nextSegments.length === 0);
            assert(actual[3].nextSegments.length === 0);
            assert(actual[1].nextSegments[0] === actual[2]);
            assert(actual[1].nextSegments[1] === actual[3]);
        });

        it("should have `allNextSegments` as CodePathSegment[]", function() {
            assert(Array.isArray(actual[0].allNextSegments));
            assert(Array.isArray(actual[1].allNextSegments));
            assert(Array.isArray(actual[2].allNextSegments));
            assert(Array.isArray(actual[3].allNextSegments));
            assert(actual[0].allNextSegments.length === 0);
            assert(actual[1].allNextSegments.length === 2);
            assert(actual[2].allNextSegments.length === 1);
            assert(actual[3].allNextSegments.length === 1);
            assert(actual[2].allNextSegments[0].reachable === false);
            assert(actual[3].allNextSegments[0].reachable === false);
        });

        it("should have `prevSegments` as CodePathSegment[]", function() {
            assert(Array.isArray(actual[0].prevSegments));
            assert(Array.isArray(actual[1].prevSegments));
            assert(Array.isArray(actual[2].prevSegments));
            assert(Array.isArray(actual[3].prevSegments));
            assert(actual[0].prevSegments.length === 0);
            assert(actual[1].prevSegments.length === 0);
            assert(actual[2].prevSegments.length === 1);
            assert(actual[3].prevSegments.length === 1);
            assert(actual[2].prevSegments[0] === actual[1]);
            assert(actual[3].prevSegments[0] === actual[1]);
        });

        it("should have `allPrevSegments` as CodePathSegment[]", function() {
            assert(Array.isArray(actual[0].allPrevSegments));
            assert(Array.isArray(actual[1].allPrevSegments));
            assert(Array.isArray(actual[2].allPrevSegments));
            assert(Array.isArray(actual[3].allPrevSegments));
            assert(actual[0].allPrevSegments.length === 0);
            assert(actual[1].allPrevSegments.length === 0);
            assert(actual[2].allPrevSegments.length === 1);
            assert(actual[3].allPrevSegments.length === 1);
        });

        it("should have `reachable` as boolean", function() {
            assert(actual[0].reachable === true);
            assert(actual[1].reachable === true);
            assert(actual[2].reachable === true);
            assert(actual[3].reachable === true);
        });
    });

    describe("onCodePathStart", function() {
        it("should be fired at the head of programs/functions", function() {
            var count = 0;
            var lastCodePathNodeType = null;

            eslint.defineRule("test", function() {
                return {
                    "onCodePathStart": function(cp, node) {
                        count += 1;
                        lastCodePathNodeType = node.type;

                        assert(cp instanceof CodePath);
                        if (count === 1) {
                            assert(node.type === "Program");
                        } else if (count === 2) {
                            assert(node.type === "FunctionDeclaration");
                        } else if (count === 3) {
                            assert(node.type === "FunctionExpression");
                        } else if (count === 4) {
                            assert(node.type === "ArrowFunctionExpression");
                        }
                    },
                    "Program": function() {
                        assert(lastCodePathNodeType === "Program");
                    },
                    "FunctionDeclaration": function() {
                        assert(lastCodePathNodeType === "FunctionDeclaration");
                    },
                    "FunctionExpression": function() {
                        assert(lastCodePathNodeType === "FunctionExpression");
                    },
                    "ArrowFunctionExpression": function() {
                        assert(lastCodePathNodeType === "ArrowFunctionExpression");
                    }
                };
            });
            eslint.verify(
                "foo(); function foo() {} var foo = function() {}; var foo = () => {};",
                {rules: {test: 2}, env: {es6: true}}
            );

            assert(count === 4);
        });
    });

    describe("onCodePathEnd", function() {
        it("should be fired at the end of programs/functions", function() {
            var count = 0;
            var lastNodeType = null;

            eslint.defineRule("test", function() {
                return {
                    "onCodePathEnd": function(cp, node) {
                        count += 1;

                        assert(cp instanceof CodePath);
                        if (count === 4) {
                            assert(node.type === "Program");
                        } else if (count === 1) {
                            assert(node.type === "FunctionDeclaration");
                        } else if (count === 2) {
                            assert(node.type === "FunctionExpression");
                        } else if (count === 3) {
                            assert(node.type === "ArrowFunctionExpression");
                        }
                        assert(node.type === lastNodeType);
                    },
                    "Program:exit": function() {
                        lastNodeType = "Program";
                    },
                    "FunctionDeclaration:exit": function() {
                        lastNodeType = "FunctionDeclaration";
                    },
                    "FunctionExpression:exit": function() {
                        lastNodeType = "FunctionExpression";
                    },
                    "ArrowFunctionExpression:exit": function() {
                        lastNodeType = "ArrowFunctionExpression";
                    }
                };
            });
            eslint.verify(
                "foo(); function foo() {} var foo = function() {}; var foo = () => {};",
                {rules: {test: 2}, env: {es6: true}}
            );

            assert(count === 4);
        });
    });

    describe("onCodePathSegmentStart", function() {
        it("should be fired at the head of programs/functions for the initial segment", function() {
            var count = 0;
            var lastCodePathNodeType = null;

            eslint.defineRule("test", function() {
                return {
                    "onCodePathSegmentStart": function(segment, node) {
                        count += 1;
                        lastCodePathNodeType = node.type;

                        assert(segment instanceof CodePathSegment);
                        if (count === 1) {
                            assert(node.type === "Program");
                        } else if (count === 2) {
                            assert(node.type === "FunctionDeclaration");
                        } else if (count === 3) {
                            assert(node.type === "FunctionExpression");
                        } else if (count === 4) {
                            assert(node.type === "ArrowFunctionExpression");
                        }
                    },
                    "Program": function() {
                        assert(lastCodePathNodeType === "Program");
                    },
                    "FunctionDeclaration": function() {
                        assert(lastCodePathNodeType === "FunctionDeclaration");
                    },
                    "FunctionExpression": function() {
                        assert(lastCodePathNodeType === "FunctionExpression");
                    },
                    "ArrowFunctionExpression": function() {
                        assert(lastCodePathNodeType === "ArrowFunctionExpression");
                    }
                };
            });
            eslint.verify(
                "foo(); function foo() {} var foo = function() {}; var foo = () => {};",
                {rules: {test: 2}, env: {es6: true}}
            );

            assert(count === 4);
        });
    });

    describe("onCodePathSegmentEnd", function() {
        it("should be fired at the end of programs/functions for the final segment", function() {
            var count = 0;
            var lastNodeType = null;

            eslint.defineRule("test", function() {
                return {
                    "onCodePathSegmentEnd": function(cp, node) {
                        count += 1;

                        assert(cp instanceof CodePathSegment);
                        if (count === 4) {
                            assert(node.type === "Program");
                        } else if (count === 1) {
                            assert(node.type === "FunctionDeclaration");
                        } else if (count === 2) {
                            assert(node.type === "FunctionExpression");
                        } else if (count === 3) {
                            assert(node.type === "ArrowFunctionExpression");
                        }
                        assert(node.type === lastNodeType);
                    },
                    "Program:exit": function() {
                        lastNodeType = "Program";
                    },
                    "FunctionDeclaration:exit": function() {
                        lastNodeType = "FunctionDeclaration";
                    },
                    "FunctionExpression:exit": function() {
                        lastNodeType = "FunctionExpression";
                    },
                    "ArrowFunctionExpression:exit": function() {
                        lastNodeType = "ArrowFunctionExpression";
                    }
                };
            });
            eslint.verify(
                "foo(); function foo() {} var foo = function() {}; var foo = () => {};",
                {rules: {test: 2}, env: {es6: true}}
            );

            assert(count === 4);
        });
    });

    describe("onCodePathSegmentLoop", function() {
        it("should be fired in `while` loops", function() {
            var count = 0;

            eslint.defineRule("test", function() {
                return {
                    "onCodePathSegmentLoop": function(fromSegment, toSegment, node) {
                        count += 1;
                        assert(fromSegment instanceof CodePathSegment);
                        assert(toSegment instanceof CodePathSegment);
                        assert(node.type === "WhileStatement");
                    }
                };
            });
            eslint.verify(
                "while (a) { foo(); }",
                {rules: {test: 2}}
            );

            assert(count === 1);
        });

        it("should be fired in `do-while` loops", function() {
            var count = 0;

            eslint.defineRule("test", function() {
                return {
                    "onCodePathSegmentLoop": function(fromSegment, toSegment, node) {
                        count += 1;
                        assert(fromSegment instanceof CodePathSegment);
                        assert(toSegment instanceof CodePathSegment);
                        assert(node.type === "DoWhileStatement");
                    }
                };
            });
            eslint.verify(
                "do { foo(); } while (a);",
                {rules: {test: 2}}
            );

            assert(count === 1);
        });

        it("should be fired in `for` loops", function() {
            var count = 0;

            eslint.defineRule("test", function() {
                return {
                    "onCodePathSegmentLoop": function(fromSegment, toSegment, node) {
                        count += 1;
                        assert(fromSegment instanceof CodePathSegment);
                        assert(toSegment instanceof CodePathSegment);
                        if (count === 1) {
                            // connect path: "update" -> "test"
                            assert(node.parent.type === "ForStatement");
                        } else if (count === 2) {
                            assert(node.type === "ForStatement");
                        }
                    }
                };
            });
            eslint.verify(
                "for (var i = 0; i < 10; ++i) { foo(); }",
                {rules: {test: 2}}
            );

            assert(count === 2);
        });

        it("should be fired in `for-in` loops", function() {
            var count = 0;

            eslint.defineRule("test", function() {
                return {
                    "onCodePathSegmentLoop": function(fromSegment, toSegment, node) {
                        count += 1;
                        assert(fromSegment instanceof CodePathSegment);
                        assert(toSegment instanceof CodePathSegment);
                        if (count === 1) {
                            // connect path: "right" -> "left"
                            assert(node.parent.type === "ForInStatement");
                        } else if (count === 2) {
                            assert(node.type === "ForInStatement");
                        }
                    }
                };
            });
            eslint.verify(
                "for (var k in obj) { foo(); }",
                {rules: {test: 2}}
            );

            assert(count === 2);
        });

        it("should be fired in `for-of` loops", function() {
            var count = 0;

            eslint.defineRule("test", function() {
                return {
                    "onCodePathSegmentLoop": function(fromSegment, toSegment, node) {
                        count += 1;
                        assert(fromSegment instanceof CodePathSegment);
                        assert(toSegment instanceof CodePathSegment);
                        if (count === 1) {
                            // connect path: "right" -> "left"
                            assert(node.parent.type === "ForOfStatement");
                        } else if (count === 2) {
                            assert(node.type === "ForOfStatement");
                        }
                    }
                };
            });
            eslint.verify(
                "for (var x of xs) { foo(); }",
                {rules: {test: 2}, env: {es6: true}}
            );

            assert(count === 2);
        });
    });

    describe("completed code paths are correct", function() {
        var testDataDir = path.join(__dirname, "../../fixtures/code-path-analysis/");
        var testDataFiles = fs.readdirSync(testDataDir);

        testDataFiles.forEach(function(file) {
            it(file, function() {
                var source = fs.readFileSync(path.join(testDataDir, file), {encoding: "utf8"});
                var expected = getExpectedDotArrows(source);
                var actual = [];

                assert(expected.length > 0, "/*expected */ comments not found.");

                eslint.defineRule("test", function() {
                    return {
                        "onCodePathEnd": function(codePath) {
                            actual.push(debug.makeDotArrows(codePath));
                        }
                    };
                });
                var messages = eslint.verify(source, {rules: {test: 2}, env: {es6: true}});
                assert.equal(messages.length, 0);
                assert.equal(actual.length, expected.length, "a count of code paths is wrong.");

                for (var i = 0; i < actual.length; ++i) {
                    assert.equal(actual[i], expected[i]);
                }
            });
        });
    });
});
