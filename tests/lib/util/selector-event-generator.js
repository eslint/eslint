/**
 * @fileoverview Tests for SelectorEventGenerator.
 * @author Ilya Volodin
 * @copyright 2015 Ilya Volodin. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var assert = require("assert"),
    EventEmitter = require("events").EventEmitter,
    sinon = require("sinon"),
    NodeEventGenerator = require("../../../lib/util/selector-event-generator");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("SelectorEventGenerator", function() {
    describe("Selector parser", function() {
        it("Should parse selector with two nested nodes", function() {
            var selector = "FunctionDeclaration Identifier";
            var output = {
                lastMatchedNode: 0,
                nodes: [{
                    type: "FunctionDeclaration"
                }, {
                    type: "Identifier"
                }
            ]};
        });
        it("Should parse selector with attributes", function() {
            var selector = "FunctionDeclaration[expression=\"false\"] Identifier[name=\"test\"]";
            var output = {
                lastMatchedNode: 0,
                nodes: [{
                    type: "FunctionDeclaration",
                    attributes: [{
                        expression: "false"
                    }]
                }, {
                    type: "Identifier",
                    attributes: [{
                        name: "test"
                    }]
                }]
            };
        });
        it("Should parse selector with attributes and spaces", function() {
            var selector = "FunctionDeclaration[ expression=\"false\" ]";
            var output = {
                lastMatchedNode: 0,
                nodes: [{
                    type: "FunctionDeclaration",
                    attributes: [{
                        expression: "false"
                    }]
                }]
            };
        });
        it("Should parse selector with attributes and spaces around equals", function() {
            var selector = "FunctionDeclaration[expression = \"false\"]";
            var output = {
                lastMatchedNode: 0,
                nodes: [{
                    type: "FunctionDeclaration",
                    attributes: [{
                        expression: "false"
                    }]
                }]
            };
        });
        it("Should parse selector with child", function() {
            var selector = "FunctionDeclaration>Identifier";
            var output = {
                lastMatchedNode: 0,
                nodes: [{
                    type: "FunctionDeclaration",
                    requiresDirectChild: true
                }, {
                    type: "Identifier",
                    directChild: true
                }]
            };
        });
        it("Should parse selector with child and spaces", function() {
            var selector = "FunctionDeclaration > Identifier";
            var output = {
                lastMatchedNode: 0,
                nodes: [{
                    type: "FunctionDeclaration",
                    requiresDirectChild: true
                }, {
                    type: "Identifier",
                    directChild: true
                }]
            };
        });
        it("Should parse selector with multiple attributes", function() {
            var selector = "FunctionDeclaration[expression=\"false\"][generator=\"false\"]";
            var output = {
                lastMatchedNode: 0,
                nodes: [{
                    type: "FunctionDeclaration",
                    attributes: [{
                        expression: false,
                    }, {
                        generator: false
                    }]
                }]
            };
        });
        it("Should parse selector with attributes and attribute only selector", function() {
            var selector = "FunctionDeclaration[expression=\"false\"] [generator=\"false\"]";
            var output = {
                lastMatchedNode: 0,
                nodes: [{
                    type: "FunctionDeclaration",
                    attributes: [{
                        expression: false
                    }]
                }, {
                    attributes: [{
                        generator: false
                    }]
                }]
            };
        });
        it("Should parse selector with just attributes", function() {
            var selector = "[name=\"test\"]";
            var output = {
                lastMatchedNode: 0,
                nodes: [{
                    attributes: [{
                        name: "test"
                    }]
                }]
            };
        });
        it("Should parse selector with nested attributes", function() {
            var selector = "FunctionDeclaration[body.type=\"BlockStatement\"]";
            var output = {
                lastMatchedNode: 0,
                nodes: [{
                    type: "FunctionDeclaration",
                    attributes: [{
                        body: {
                            type: "BlockStatement"
                        }
                    }]
                }]
            };
        });
        it("Should parse complex selector", function() {
            var selector = "FunctionDeclaration[body.type=\"BlockStatement\"] ExpressionStatement>CallExpression[callee.object.name=\"test\"][callee.property.name=\"forEach\"]";
            var output = {
                lastMatchedNode: 0,
                nodes: [{
                    type: "FunctionDeclaration",
                    attributes: [{
                        body: {
                            type: "BlockStatement"
                        }
                    }]
                }, {
                    type: "ExpressionStatement",
                    requiresDirectoChild: true
                }, {
                    type: "CallExpression",
                    directChild: true,
                    attributes: [{
                        callee: {
                            object: {
                                name: "test"
                            }
                        }
                    }, {
                        callee: {
                            property: {
                                name: "forEach"
                            }
                        }
                    }]
                }]
            };
        });
    });
});
