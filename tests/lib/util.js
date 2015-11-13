/**
 * @fileoverview Tests for util.
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var assert = require("chai").assert,
    util = require("../../lib/util");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("util", function() {

    describe("removePluginPrefix()", function() {
        it("should remove common prefix when passed a plugin name  with a prefix", function() {
            var pluginName = util.removePluginPrefix("eslint-plugin-test");
            assert.equal(pluginName, "test");
        });

        it("should not modify plugin name when passed a plugin name without a prefix", function() {
            var pluginName = util.removePluginPrefix("test");
            assert.equal(pluginName, "test");
        });
    });

    describe("getNamespace()", function() {
        it("should remove namepace when passed with namepace", function() {
            var namespace = util.getNamespace("@namepace/eslint-plugin-test");
            assert.equal(namespace, "@namepace/");
        });
    });

    describe("removeNameSpace()", function() {
        it("should remove namepace when passed with namepace", function() {
            var namespace = util.removeNameSpace("@namepace/eslint-plugin-test");
            assert.equal(namespace, "eslint-plugin-test");
        });
    });

});
