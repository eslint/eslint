/**
 * @fileoverview Tests for rule fixer.
 * @author Ian VanSchooten
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const
    path = require("path"),
    assert = require("chai").assert,
    spawn = require("cross-spawn"),
    MemoryFs = require("metro-memory-fs"),
    sinon = require("sinon"),
    npmUtils = require("../../../lib/util/npm-utils"),
    log = require("../../../lib/util/logging");

const proxyquire = require("proxyquire").noCallThru().noPreserveCache();

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Import `npm-utils` with the in-memory file system.
 * @param {Object} files The file definitions.
 * @returns {Object} `npm-utils`.
 */
function requireNpmUtilsWithInmemoryFileSystem(files) {
    const fs = new MemoryFs({
        cwd: process.cwd,
        platform: process.platform === "win32" ? "win32" : "posix"
    });

    // Make cwd.
    (function mkdir(dirPath) {
        const parentPath = path.dirname(dirPath);

        if (parentPath && parentPath !== dirPath && !fs.existsSync(parentPath)) {
            mkdir(parentPath);
        }
        fs.mkdirSync(dirPath);

    }(process.cwd()));

    // Write files.
    for (const [filename, content] of Object.entries(files)) {
        fs.writeFileSync(filename, content);
    }

    // Stub.
    return proxyquire("../../../lib/util/npm-utils", { fs });
}

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
            const npmUtils = requireNpmUtilsWithInmemoryFileSystem({ // eslint-disable-line no-shadow
                "package.json": JSON.stringify({ private: true, dependencies: {} })
            });

            // Should not throw.
            npmUtils.checkDevDeps(["some-package"]);
        });

        it("should throw with message when parsing invalid package.json", () => {
            const npmUtils = requireNpmUtilsWithInmemoryFileSystem({ // eslint-disable-line no-shadow
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
            const npmUtils = requireNpmUtilsWithInmemoryFileSystem({ // eslint-disable-line no-shadow
                "package.json": JSON.stringify({ private: true, devDependencies: {} })
            });

            // Should not throw.
            npmUtils.checkDeps(["some-package"]);
        });

        it("should throw with message when parsing invalid package.json", () => {
            const npmUtils = requireNpmUtilsWithInmemoryFileSystem({ // eslint-disable-line no-shadow
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
        it("should return true if package.json exists", () => {
            const npmUtils = requireNpmUtilsWithInmemoryFileSystem({ // eslint-disable-line no-shadow
                "package.json": "{ \"file\": \"contents\" }"
            });

            assert.strictEqual(npmUtils.checkPackageJson(), true);
        });

        it("should return false if package.json does not exist", () => {
            const npmUtils = requireNpmUtilsWithInmemoryFileSystem({}); // eslint-disable-line no-shadow

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
