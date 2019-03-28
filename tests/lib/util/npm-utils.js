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
    npmUtils = require("../../../lib/util/npm-utils"),
    log = require("../../../lib/util/logging"),
    mockFs = require("mock-fs");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("npmUtils", () => {

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
            installStatus = npmUtils.checkDevDeps(["debug", "mocha", "notarealpackage", "jshint"]);
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
            installStatus = npmUtils.checkDevDeps(["notarealpackage"]);
            assert.isFalse(installStatus.notarealpackage);
        });

        it("should handle missing devDependencies key", () => {
            mockFs({
                "package.json": JSON.stringify({ private: true, dependencies: {} })
            });

            // Should not throw.
            npmUtils.checkDevDeps(["some-package"]);
        });

        it("should throw with message when parsing invalid package.json", () => {
            mockFs({
                "package.json": "{ \"not: \"valid json\" }"
            });

            assert.throws(() => {
                try {
                    npmUtils.checkDevDeps(["some-package"]);
                } catch (error) {
                    assert.strictEqual(error.messageTemplate, "failed-to-read-json");
                    throw error;
                }
            }, "SyntaxError: Unexpected token v");
        });
    });

    describe("checkDeps()", () => {
        let installStatus;

        before(() => {
            installStatus = npmUtils.checkDeps(["debug", "mocha", "notarealpackage", "jshint"]);
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
            installStatus = npmUtils.checkDeps(["notarealpackage"]);
            assert.isFalse(installStatus.notarealpackage);
        });

        it("should throw if no package.json can be found", () => {
            assert.throws(() => {
                installStatus = npmUtils.checkDeps(["notarealpackage"], "/fakepath");
            }, "Could not find a package.json file");
        });

        it("should handle missing dependencies key", () => {
            mockFs({
                "package.json": JSON.stringify({ private: true, devDependencies: {} })
            });

            // Should not throw.
            npmUtils.checkDeps(["some-package"]);
        });

        it("should throw with message when parsing invalid package.json", () => {
            mockFs({
                "package.json": "{ \"not: \"valid json\" }"
            });

            assert.throws(() => {
                try {
                    npmUtils.checkDeps(["some-package"]);
                } catch (error) {
                    assert.strictEqual(error.messageTemplate, "failed-to-read-json");
                    throw error;
                }
            }, "SyntaxError: Unexpected token v");
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

            assert.strictEqual(npmUtils.checkPackageJson(), true);
        });

        it("should return false if package.json does not exist", () => {
            mockFs({});
            assert.strictEqual(npmUtils.checkPackageJson(), false);
        });
    });

    describe("installSyncSaveDev()", () => {
        it("should invoke npm to install a single desired package", () => {
            const stub = sandbox.stub(spawn, "sync").returns({ stdout: "" });

            npmUtils.installSyncSaveDev("desired-package");
            assert(stub.calledOnce);
            assert.strictEqual(stub.firstCall.args[0], "npm");
            assert.deepStrictEqual(stub.firstCall.args[1], ["i", "--save-dev", "desired-package"]);
            stub.restore();
        });

        it("should accept an array of packages to install", () => {
            const stub = sandbox.stub(spawn, "sync").returns({ stdout: "" });

            npmUtils.installSyncSaveDev(["first-package", "second-package"]);
            assert(stub.calledOnce);
            assert.strictEqual(stub.firstCall.args[0], "npm");
            assert.deepStrictEqual(stub.firstCall.args[1], ["i", "--save-dev", "first-package", "second-package"]);
            stub.restore();
        });

        it("should log an error message if npm throws ENOENT error", () => {
            const logErrorStub = sandbox.stub(log, "error");
            const npmUtilsStub = sandbox.stub(spawn, "sync").returns({ error: { code: "ENOENT" } });

            npmUtils.installSyncSaveDev("some-package");

            assert(logErrorStub.calledOnce);

            logErrorStub.restore();
            npmUtilsStub.restore();
        });
    });

    describe("fetchPeerDependencies()", () => {
        it("should execute 'npm show --json <packageName> peerDependencies' command", () => {
            const stub = sandbox.stub(spawn, "sync").returns({ stdout: "" });

            npmUtils.fetchPeerDependencies("desired-package");
            assert(stub.calledOnce);
            assert.strictEqual(stub.firstCall.args[0], "npm");
            assert.deepStrictEqual(stub.firstCall.args[1], ["show", "--json", "desired-package", "peerDependencies"]);
            stub.restore();
        });

        it("should return null if npm throws ENOENT error", () => {
            const stub = sandbox.stub(spawn, "sync").returns({ error: { code: "ENOENT" } });

            const peerDependencies = npmUtils.fetchPeerDependencies("desired-package");

            assert.isNull(peerDependencies);

            stub.restore();
        });
    });
});
