/**
 * @fileoverview Tests for rule fixer.
 * @author Ian VanSchooten
 * @copyright 2016 Ian VanSchooten. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var assert = require("chai").assert,
    npmUtil = require("../../../lib/util/npm-util");


describe("npmUtil", function() {

    describe("checkDevDeps()", function() {
        var installStatus;

        before(function() {
            installStatus = npmUtil.checkDevDeps(["debug", "mocha", "notarealpackage", "jshint"]);
        });

        it("should not find a direct dependency of the project", function() {
            assert.isFalse(installStatus.debug);
        });

        it("should find a dev dependency of the project", function() {
            assert.isTrue(installStatus.mocha);
        });

        it("should not find non-dependencies", function() {
            assert.isFalse(installStatus.notarealpackage);
        });

        it("should not find nested dependencies", function() {
            assert.isFalse(installStatus.jshint);
        });

        it("should return false for a single, non-existent package", function() {
            installStatus = npmUtil.checkDevDeps(["notarealpackage"]);
            assert.isFalse(installStatus.notarealpackage);
        });
    });

    describe("checkDeps()", function() {
        var installStatus;

        before(function() {
            installStatus = npmUtil.checkDeps(["debug", "mocha", "notarealpackage", "jshint"]);
        });

        it("should find a direct dependency of the project", function() {
            assert.isTrue(installStatus.debug);
        });

        it("should not find a dev dependency of the project", function() {
            assert.isFalse(installStatus.mocha);
        });

        it("should not find non-dependencies", function() {
            assert.isFalse(installStatus.notarealpackage);
        });

        it("should not find nested dependencies", function() {
            assert.isFalse(installStatus.jshint);
        });

        it("should return false for a single, non-existent package", function() {
            installStatus = npmUtil.checkDeps(["notarealpackage"]);
            assert.isFalse(installStatus.notarealpackage);
        });
    });
});
