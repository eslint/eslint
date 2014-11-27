/**
 * @fileoverview Tests for Validator.
 * @author Nicholas C. Zakas
 * @copyright 2014 Nicholas C. Zakas. All rights reserved.
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var assert = require("chai").assert,
    leche = require("leche"),
    nodeTypes = require("../../../conf/nodetypes.json"),
    Validator = require("../../../lib/util/validator");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

var es5Types = Object.keys(nodeTypes).filter(function(nodeType) {
        return nodeTypes[nodeType].version === 5;
    }),
    es6Types = Object.keys(nodeTypes).filter(function(nodeType) {
        return nodeTypes[nodeType].version === 6;
    }),
    jsxTypes = Object.keys(nodeTypes).filter(function(nodeType) {
        return nodeTypes[nodeType].version === "jsx";
    });

var variableDeclaration = {
    "type": "VariableDeclaration",
    "declarations": [
        {
            "loc": {
                "start": {
                    "line": 1,
                    "column": 6
                },
                "end": {
                    "line": 1,
                    "column": 13
                }
            },
            "type": "VariableDeclarator",
            "id": {
                "loc": {
                    "start": {
                        "line": 1,
                        "column": 6
                    },
                    "end": {
                        "line": 1,
                        "column": 9
                    }
                },
                "type": "Identifier",
                "name": "foo"
            },
            "init": {
                "loc": {
                    "start": {
                        "line": 1,
                        "column": 12
                    },
                    "end": {
                        "line": 1,
                        "column": 13
                    }
                },
                "type": "Literal",
                "value": 0,
                "raw": "0"
            }
        }
    ],
    "kind": "const"
};

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("Validator", function() {

    describe("ES5 mode", function() {

        var validator;

        beforeEach(function() {
            validator = new Validator({
                ecmascript: 5
            });
        });

        describe("validate()", function() {

            var dataset = es6Types.concat(jsxTypes);

            leche.withData(dataset, function(type) {
                it("should return false when passed an invalid type", function() {
                    var result = validator.validate({ type: type });
                    assert.isFalse(result.valid);
                });
            });

            it("should return false when an unknown node type is passed", function() {
                var result = validator.validate({ type: "foo" });
                assert.isFalse(result.valid);
            });

            it("should return true when using var", function() {
                var node = Object.create(variableDeclaration);
                node.kind = "var";

                var result = validator.validate(node);
                assert.isTrue(result.valid);
            });

            leche.withData([
                "let",
                "const"
            ], function(kind) {
                it("should return false when using " + kind, function() {
                    var node = Object.create(variableDeclaration);
                    node.kind = kind;

                    var result = validator.validate(node);
                    assert.isFalse(result.valid);
                });
            });

        });

    });

    describe("ES6 mode", function() {

        var validator;

        beforeEach(function() {
            validator = new Validator({
                ecmascript: 6
            });
        });

        describe("validate", function() {

            var dataset = es5Types.concat(es6Types);

            leche.withData(jsxTypes, function(type) {
                it("should return false when passed an invalid type", function() {
                    var result = validator.validate({ type: type });
                    assert.isFalse(result.valid);
                });
            });

            leche.withData(dataset, function(type) {
                it("should return true when passed a valid type", function() {
                    var result = validator.validate({ type: type });
                    assert.isTrue(result.valid);
                });
            });

            leche.withData([
                "var",
                "let",
                "const"
            ], function(kind) {
                it("should return false when using " + kind, function() {
                    var node = Object.create(variableDeclaration);
                    node.kind = kind;

                    var result = validator.validate(node);
                    assert.isTrue(result.valid);
                });
            });

        });

    });

    describe("ES6 + JSX mode", function() {

        var validator;

        beforeEach(function() {
            validator = new Validator({
                ecmascript: 6,
                jsx: true
            });
        });

        describe("validate", function() {

            var dataset = es5Types.concat(es6Types).concat(jsxTypes);

            leche.withData(dataset, function(type) {
                it("should return true when passed a valid type", function() {
                    var result = validator.validate({ type: type });
                    assert.isTrue(result.valid);
                });
            });

        });

    });
});
