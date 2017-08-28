/**
 * @fileoverview Tests for rule fixer.
 * @author Ian VanSchooten
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("chai").assert,
    spawn = require("cross-spawn"),
    sinon = require("sinon"),
    npmUtil = require("../../../lib/util/npm-util"),
    log = require("../../../lib/logging"),
    mockFs = require("mock-fs");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("npmUtil", () => {

    let sandbox;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
    });

    afterEach(() => {
        sandbox.verifyAndRestore();
        mockFs.restore();
    });

    describe("checkDevDeps()", () => {
        let installStatus;

        before(() => {
            installStatus = npmUtil.checkDevDeps(["debug", "mocha", "notarealpackage", "jshint"]);
        });

        it("should not find a direct dependency of the project", () => {
            assert.isFalse(installStatus.debug);
        });

        it("should find a dev dependency of the project", () => {
            assert.isTrue(installStatus.mocha);
        });

        it("should not find non-dependencies", () => {
            assert.isFalse(installStatus.notarealpackage);
        });

        it("should not find nested dependencies", () => {
            assert.isFalse(installStatus.jshint);
        });

        it("should return false for a single, non-existent package", () => {
            installStatus = npmUtil.checkDevDeps(["notarealpackage"]);
            assert.isFalse(installStatus.notarealpackage);
        });

        it("should handle missing devDependencies key", () => {
            mockFs({
                "package.json": JSON.stringify({ private: true, dependencies: {} })
            });

            const fn = npmUtil.checkDevDeps.bind(null, ["some-package"]);

            assert.doesNotThrow(fn);
        });

        it("should throw with message when parsing invalid package.json", () => {
            const logInfo = sandbox.stub(log, "info");

            mockFs({
                "package.json": "{ \"not: \"valid json\" }"
            });

            const fn = npmUtil.checkDevDeps.bind(null, ["some-package"]);

            assert.throws(fn, "SyntaxError: Unexpected token v");
            assert(logInfo.calledOnce);
            assert.equal(logInfo.firstCall.args[0], "Could not read package.json file. Please check that the file contains valid JSON.");
        });
    });

    describe("checkDeps()", () => {
        let installStatus;

        before(() => {
            installStatus = npmUtil.checkDeps(["debug", "mocha", "notarealpackage", "jshint"]);
        });

        afterEach(() => {
            mockFs.restore();
        });

        it("should find a direct dependency of the project", () => {
            assert.isTrue(installStatus.debug);
        });

        it("should not find a dev dependency of the project", () => {
            assert.isFalse(installStatus.mocha);
        });

        it("should not find non-dependencies", () => {
            assert.isFalse(installStatus.notarealpackage);
        });

        it("should not find nested dependencies", () => {
            assert.isFalse(installStatus.jshint);
        });

        it("should return false for a single, non-existent package", () => {
            installStatus = npmUtil.checkDeps(["notarealpackage"]);
            assert.isFalse(installStatus.notarealpackage);
        });

        it("should throw if no package.json can be found", () => {
            assert.throws(() => {
                installStatus = npmUtil.checkDeps(["notarealpackage"], "/fakepath");
            }, "Could not find a package.json file");
        });

        it("should handle missing dependencies key", () => {
            mockFs({
                "package.json": JSON.stringify({ private: true, devDependencies: {} })
            });

            const fn = npmUtil.checkDeps.bind(null, ["some-package"]);

            assert.doesNotThrow(fn);
        });

        it("should throw with message when parsing invalid package.json", () => {
            const logInfo = sandbox.stub(log, "info");

            mockFs({
                "package.json": "{ \"not: \"valid json\" }"
            });

            const fn = npmUtil.checkDevDeps.bind(null, ["some-package"]);

            assert.throws(fn, "SyntaxError: Unexpected token v");
            assert(logInfo.calledOnce);
            assert.equal(logInfo.firstCall.args[0], "Could not read package.json file. Please check that the file contains valid JSON.");
            logInfo.restore();
        });
    });

    describe("checkPackageJson()", () => {
        after(() => {
            mockFs.restore();
        });

        it("should return true if package.json exists", () => {
            mockFs({
                "package.json": "{ \"file\": \"contents\" }"
            });

            assert.equal(npmUtil.checkPackageJson(), true);
        });

        it("should return false if package.json does not exist", () => {
            mockFs({});
            assert.equal(npmUtil.checkPackageJson(), false);
        });
    });

    describe("installSyncSaveDev()", () => {
        it("should invoke npm to install a single desired package", () => {
            const stub = sandbox.stub(spawn, "sync").returns({ stdout: "" });

            npmUtil.installSyncSaveDev("desired-package");
            assert(stub.calledOnce);
            assert.equal(stub.firstCall.args[0], "npm");
            assert.deepEqual(stub.firstCall.args[1], ["i", "--save-dev", "desired-package"]);
            stub.restore();
        });

        it("should accept an array of packages to install", () => {
            const stub = sandbox.stub(spawn, "sync").returns({ stdout: "" });

            npmUtil.installSyncSaveDev(["first-package", "second-package"]);
            assert(stub.calledOnce);
            assert.equal(stub.firstCall.args[0], "npm");
            assert.deepEqual(stub.firstCall.args[1], ["i", "--save-dev", "first-package", "second-package"]);
            stub.restore();
        });

        it("should log an error message if npm throws ENOENT error", () => {
            const logErrorStub = sandbox.stub(log, "error");
            const npmUtilStub = sandbox.stub(spawn, "sync").returns({ error: { code: "ENOENT" } });

            npmUtil.installSyncSaveDev("some-package");

            assert(logErrorStub.calledOnce);

            logErrorStub.restore();
            npmUtilStub.restore();
        });
    });

    describe("fetchPeerDependencies()", () => {
        it("should execute 'npm show --json <packageName> peerDependencies' command", () => {
            const stub = sandbox.stub(spawn, "sync").returns({ stdout: "" });

            npmUtil.fetchPeerDependencies("desired-package");
            assert(stub.calledOnce);
            assert.equal(stub.firstCall.args[0], "npm");
            assert.deepEqual(stub.firstCall.args[1], ["show", "--json", "desired-package", "peerDependencies"]);
            stub.restore();
        });

        it("should return null if npm throws ENOENT error", () => {
            const stub = sandbox.stub(spawn, "sync").returns({ error: { code: "ENOENT" } });

            const peerDependencies = npmUtil.fetchPeerDependencies("desired-package");

            assert.isNull(peerDependencies);

            stub.restore();
        });
    });
});
