/**
 * @fileoverview Tests for selector parser.
 * @author Ilya Volodin
 * @copyright 2015 Ilya Volodin. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var assert = require("assert"),
    selectorParser = require("../../../lib/util/selector-parser");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("Simple tokenizer", function() {
    it("Should parse", function() {
        var selector = "FunctionDeclaration Identifier";
        var output = ["FunctionDeclaration", " ", "Identifier"];
        var result = selectorParser.tokenize(selector);
        assert.deepEqual(result, output);
    });
    it("Should parse", function() {
        var selector = "FunctionDeclaration[expression=\"false\"] Identifier[name=\"test\"]";
        var output = ["FunctionDeclaration", "[", "expression", "=", "false", "]", " ", "Identifier", "[", "name", "=", "test", "]"];
        var result = selectorParser.tokenize(selector);
        assert.deepEqual(result, output);
    });
    it("Should parse", function() {
        var selector = "FunctionDeclaration[ expression=\"false\" ]";
        var output = ["FunctionDeclaration", "[", "expression", "=", "false", "]"];
        var result = selectorParser.tokenize(selector);
        assert.deepEqual(result, output);
    });
    it("Should parse", function() {
        var selector = "Literal[raw=\"Hello\"]";
        var output = ["Literal", "[", "raw", "=", "Hello", "]"];
        var result = selectorParser.tokenize(selector);
        assert.deepEqual(result, output);
    });
    it("Should parse", function() {
        var selector = "FunctionDeclaration, FunctionExpression";
        var output = ["FunctionDeclaration", ",", "FunctionExpression"];
        var result = selectorParser.tokenize(selector);
        assert.deepEqual(result, output);
    });
    it("Should parse", function() {
        var selector = "FunctionDeclaration , FunctionExpression";
        var output = ["FunctionDeclaration", ",", "FunctionExpression"];
        var result = selectorParser.tokenize(selector);
        assert.deepEqual(result, output);
    });
    it("Should parse", function() {
        var selector = "FunctionDeclaration,FunctionExpression";
        var output = ["FunctionDeclaration", ",", "FunctionExpression"];
        var result = selectorParser.tokenize(selector);
        assert.deepEqual(result, output);
    });
    it("Should parse", function() {
        var selector = "FunctionDeclaration>Identifier";
        var output = ["FunctionDeclaration", ">", "Identifier"];
        var result = selectorParser.tokenize(selector);
        assert.deepEqual(result, output);
    });
    it("Should parse", function() {
        var selector = "FunctionDeclaration > Identifier";
        var output = ["FunctionDeclaration", ">", "Identifier"];
        var result = selectorParser.tokenize(selector);
        assert.deepEqual(result, output);
    });
    it("Should parse", function() {
        var selector = "FunctionDeclaration[ expression=\"false\" ][ generator = \"false\"]";
        var output = ["FunctionDeclaration", "[", "expression", "=", "false", "]", "[", "generator", "=", "false", "]"];
        var result = selectorParser.tokenize(selector);
        assert.deepEqual(result, output);
    });
    it("Should parse", function() {
        var selector = "FunctionDeclaration[ expression=\"false\" ] [ generator = \"false\"]";
        var output = ["FunctionDeclaration", "[", "expression", "=", "false", "]", " ", "[", "generator", "=", "false", "]"];
        var result = selectorParser.tokenize(selector);
        assert.deepEqual(result, output);
    });
});

describe("Parser", function() {
    it("Should return two nodes", function() {
        var selector = "FunctionDeclaration Identifier";
        var output = [{
            event: "FunctionDeclaration Identifier",
            selectors: [
                {
                    type: "FunctionDeclaration"
                }, {
                    type: "Identifier"
                }]
        }];
        var result = selectorParser.parse(selector);
        assert.deepEqual(result, output);
    });
    it("Should parse selector with attributes", function() {
        var selector = "FunctionDeclaration[expression=\"false\"] Identifier[name=\"test\"]";
        var output = [{
            event: "FunctionDeclaration[expression=\"false\"] Identifier[name=\"test\"]",
            selectors: [
                {
                    type: "FunctionDeclaration",
                    attributes: [{
                        query: ["expression"],
                        value: "false"
                    }]
                }, {
                    type: "Identifier",
                    attributes: [{
                        query: ["name"],
                        value: "test"
                    }]
                }]
        }];
        var result = selectorParser.parse(selector);
        assert.deepEqual(result, output);
    });
    it("Should parse selector with attributes and spaces", function() {
        var selector = "FunctionDeclaration[ expression=\"false\" ]";
        var output = [{
            event: "FunctionDeclaration[ expression=\"false\" ]",
            selectors: [
                {
                    type: "FunctionDeclaration",
                    attributes: [{
                        query: ["expression"],
                        value: "false"
                    }]
                }]
        }];
        var result = selectorParser.parse(selector);
        assert.deepEqual(result, output);
    });
    it("Should parse selector with attributes and spaces around equals", function() {
        var selector = "FunctionDeclaration[expression = \"false\"]";
        var output = [{
            event: "FunctionDeclaration[expression = \"false\"]",
            selectors: [
                {
                    type: "FunctionDeclaration",
                    attributes: [{
                        query: ["expression"],
                        value: "false"
                    }]
                }]
        }];
        var result = selectorParser.parse(selector);
        assert.deepEqual(result, output);
    });
    it("Should parse selector with child", function() {
        var selector = "FunctionDeclaration>Identifier";
        var output = [{
            event: "FunctionDeclaration>Identifier",
            selectors: [
                {
                    type: "FunctionDeclaration",
                    hasDirectChild: true
                }, {
                    type: "Identifier",
                    directChild: true
                }]
        }];
        var result = selectorParser.parse(selector);
        assert.deepEqual(result, output);
    });
    it("Should parse selector with child and spaces", function() {
        var selector = "FunctionDeclaration > Identifier";
        var output = [{
            event: "FunctionDeclaration > Identifier",
            selectors: [
                {
                    type: "FunctionDeclaration",
                    hasDirectChild: true
                }, {
                    type: "Identifier",
                    directChild: true
                }]
        }];
        var result = selectorParser.parse(selector);
        assert.deepEqual(result, output);
    });
    it("Should parse selector with multiple attributes", function() {
        var selector = "FunctionDeclaration[expression=\"false\"][generator=\"false\"]";
        var output = [{
            event: "FunctionDeclaration[expression=\"false\"][generator=\"false\"]",
            selectors: [
                {
                    type: "FunctionDeclaration",
                    attributes: [{
                        query: ["expression"],
                        value: "false"
                    }, {
                        query: ["generator"],
                        value: "false"
                    }]
                }]
        }];
        var result = selectorParser.parse(selector);
        assert.deepEqual(result, output);
    });
    it("Should parse selector with attributes and attribute only selector", function() {
        var selector = "FunctionDeclaration[expression=\"false\"] [generator=\"false\"]";
        var output = [{
            event: "FunctionDeclaration[expression=\"false\"] [generator=\"false\"]",
            selectors: [
                {
                    type: "FunctionDeclaration",
                    attributes: [{
                        query: ["expression"],
                        value: "false"
                    }]
                }, {
                    attributes: [{
                        query: ["generator"],
                        value: "false"
                    }]
                }]
        }];
        var result = selectorParser.parse(selector);
        assert.deepEqual(result, output);
    });
    it("Should parse selector with just attributes", function() {
        var selector = "[name=\"test\"]";
        var output = [{
            event: "[name=\"test\"]",
            selectors: [
                {
                    attributes: [{
                        query: ["name"],
                        value: "test"
                    }]
                }]
        }];
        var result = selectorParser.parse(selector);
        assert.deepEqual(result, output);
    });
    it("Should parse selector with nested attributes", function() {
        var selector = "FunctionDeclaration[body.type=\"BlockStatement\"]";
        var output = [{
            event: "FunctionDeclaration[body.type=\"BlockStatement\"]",
            selectors: [
                {
                    type: "FunctionDeclaration",
                    attributes: [{
                        query: ["body", "type"],
                        value: "BlockStatement"
                    }]
                }]
        }];
        var result = selectorParser.parse(selector);
        assert.deepEqual(result, output);
    });
    it("Should parse selector with three nodes", function() {
        var selector = "FunctionDeclaration BlockStatement ExpressionStatement";
        var output = [{
            event: "FunctionDeclaration BlockStatement ExpressionStatement",
            selectors: [
                {
                    type: "FunctionDeclaration"
                },
                {
                    type: "BlockStatement"
                },
                {
                    type: "ExpressionStatement"
                }]
        }];
        var result = selectorParser.parse(selector);
        assert.deepEqual(result, output);
    });
    it("Should parse complex selector", function() {
        var selector = "FunctionDeclaration[body.type=\"BlockStatement\"] ExpressionStatement>CallExpression[callee.object.name=\"test\"][callee.property.name=\"forEach\"]";
        var output = [{
            event: "FunctionDeclaration[body.type=\"BlockStatement\"] ExpressionStatement>CallExpression[callee.object.name=\"test\"][callee.property.name=\"forEach\"]",
            selectors: [
                {
                    type: "FunctionDeclaration",
                    attributes: [{
                        query: ["body", "type"],
                        value: "BlockStatement"
                    }]
                }, {
                    type: "ExpressionStatement",
                    hasDirectChild: true
                }, {
                    type: "CallExpression",
                    directChild: true,
                    attributes: [{
                        query: ["callee", "object", "name"],
                        value: "test"
                    }, {
                        query: ["callee", "property", "name"],
                        value: "forEach"
                    }]
                }]
        }];
        var result = selectorParser.parse(selector);
        assert.deepEqual(result, output);
    });
});
