/**
 * @fileoverview Tests for rule fixer.
 * @author Ian VanSchooten
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var assert = require("chai").assert,
    fs = require("fs"),
    shell = require("shelljs"),
    sinon = require("sinon"),
    npmUtil = require("../../../lib/util/npm-util"),
    log = require("../../../lib/logging");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("npmUtil", function() {

    var sandbox;

    beforeEach(function() {
        sandbox = sinon.sandbox.create();
    });

    afterEach(function() {
        sandbox.verifyAndRestore();
    });

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

        it("should handle missing devDependencies key", function() {
            sandbox.stub(fs, "existsSync", function() {
                return true;
            });
            sandbox.stub(fs, "readFileSync", function() {
                return JSON.stringify({
                    private: true,
                    dependencies: {}
                });
            });

            var fn = npmUtil.checkDevDeps.bind(null, ["some-package"]);

            assert.doesNotThrow(fn);
        });

        it("should throw with message when parsing invalid package.json", function() {
            var logInfo = sandbox.stub(log, "info");

            sandbox.stub(fs, "existsSync", function() {
                return true;
            });
            sandbox.stub(fs, "readFileSync", function() {
                return "{ \"not: \"valid json\" }";
            });

            var fn = npmUtil.checkDevDeps.bind(null, ["some-package"]);

            assert.throws(fn, "SyntaxError: Unexpected token v");
            assert(logInfo.calledOnce);
            assert.equal(logInfo.firstCall.args[0], "Could not read package.json file. Please check that the file contains valid JSON.");
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

        it("should throw if no package.json can be found", function() {
            assert.throws(function() {
                installStatus = npmUtil.checkDeps(["notarealpackage"], "/fakepath");
            }, "Could not find a package.json file");
        });

        it("should handle missing dependencies key", function() {
            sandbox.stub(fs, "existsSync", function() {
                return true;
            });
            sandbox.stub(fs, "readFileSync", function() {
                return JSON.stringify({
                    private: true,
                    devDependencies: {}
                });
            });

            var fn = npmUtil.checkDeps.bind(null, ["some-package"]);

            assert.doesNotThrow(fn);

            fs.existsSync.restore();
            fs.readFileSync.restore();
        });

        it("should throw with message when parsing invalid package.json", function() {
            var logInfo = sandbox.stub(log, "info");

            sandbox.stub(fs, "existsSync", function() {
                return true;
            });
            sandbox.stub(fs, "readFileSync", function() {
                return "{ \"not: \"valid json\" }";
            });

            var fn = npmUtil.checkDevDeps.bind(null, ["some-package"]);

            assert.throws(fn, "SyntaxError: Unexpected token v");
            assert(logInfo.calledOnce);
            assert.equal(logInfo.firstCall.args[0], "Could not read package.json file. Please check that the file contains valid JSON.");

            fs.existsSync.restore();
            fs.readFileSync.restore();
            logInfo.restore();
        });
    });

    describe("installSyncSaveDev()", function() {
        it("should invoke npm to install a single desired package", function() {
            var stub = sandbox.stub(shell, "exec");

            npmUtil.installSyncSaveDev("desired-package");
            assert(stub.calledOnce);
            assert.equal(stub.firstCall.args[0], "npm i --save-dev desired-package");
            stub.restore();
        });

        it("should accept an array of packages to install", function() {
            var stub = sandbox.stub(shell, "exec");

            npmUtil.installSyncSaveDev(["first-package", "second-package"]);
            assert(stub.calledOnce);
            assert.equal(stub.firstCall.args[0], "npm i --save-dev first-package second-package");
            stub.restore();
        });
    });
});
