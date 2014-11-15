/**
 * @fileoverview Tests for Validator.
 * @author Nicholas C. Zakas
 * @copyright 2014 Nicholas C. Zakas. All rights reserved.
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var assert = require("chai").assert,
    fs = require("fs"),
    leche = require("leche"),
    yaml = require("js-yaml"),
    Validator = require("../../../lib/util/validator");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

var nodeTypes = yaml.safeLoad(fs.readFileSync("./conf/nodetypes.yml", "utf8")),
    es5Types = Object.keys(nodeTypes).filter(function(nodeType) {
        return nodeTypes[nodeType].version === 5;
    }),
    es6Types = Object.keys(nodeTypes).filter(function(nodeType) {
        return nodeTypes[nodeType].version === 6;
    }),
    jsxTypes = Object.keys(nodeTypes).filter(function(nodeType) {
        return nodeTypes[nodeType].version === "jsx";
    });

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

        describe("isValid", function() {

            var dataset = es6Types.concat(jsxTypes);

            leche.withData(dataset, function(type) {
                it("should return false when passed an invalid type", function() {
                    var result = validator.isValid({ type: type });
                    assert.isFalse(result);
                });
            });

            leche.withData(es5Types, function(type) {
                it("should return true when passed a valid type", function() {
                    var result = validator.isValid({ type: type });
                    assert.isTrue(result);
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

        describe("isValid", function() {

            var dataset = es5Types.concat(es6Types);

            leche.withData(jsxTypes, function(type) {
                it("should return false when passed an invalid type", function() {
                    var result = validator.isValid({ type: type });
                    assert.isFalse(result);
                });
            });

            leche.withData(dataset, function(type) {
                it("should return true when passed a valid type", function() {
                    var result = validator.isValid({ type: type });
                    assert.isTrue(result);
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

        describe("isValid", function() {

            var dataset = es5Types.concat(es6Types).concat(jsxTypes);

            leche.withData(dataset, function(type) {
                it("should return true when passed a valid type", function() {
                    var result = validator.isValid({ type: type });
                    assert.isTrue(result);
                });
            });

        });

    });
});
