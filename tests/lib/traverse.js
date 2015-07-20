/**
 * @fileoverview Tests for traverse.
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var assert = require("chai").assert,
    path = require("path"),
    fs = require("fs"),
    sinon = require("sinon"),
    traverse = require("../../lib/util/traverse");


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("traverse", function() {

    var fixturesDir = path.resolve(__dirname, "..", "fixtures", "traverse"),
        extensionlessFile = path.resolve(__dirname, "../../LICENSE"),
        foundFile = path.join(fixturesDir, "found.js"),
        foundFile2 = path.join(fixturesDir, "found.js2"),
        sandbox;

    beforeEach(function() {
        sandbox = sinon.sandbox.create();
    });

    afterEach(function() {
        sandbox.verifyAndRestore();
    });

    it("should ignore dot files and dirs", function() {
        traverse({
            files: [ fixturesDir ],
            extensions: [".js"]
        }, function(file) {
            assert.notEqual(file.indexOf("."), -1);
        });
    });

    it("should find no files due to exclude option", function() {
        var files = [];

        traverse({
            files: [ fixturesDir ],
            extensions: [".js"],
            exclude: function() {
                return true;
            }
        }, function(file) {
            files.push(file);
        });

        assert.equal(files.length, 0);
    });

    it("should find one file in directory when using .js extension", function() {
        var callback = sandbox.spy();

        traverse({
            files: [ fixturesDir ],
            extensions: [".js"]
        }, callback);

        assert.ok(callback.calledOnce);
        assert.equal(callback.getCall(0).args[0], foundFile);
    });

    it("should find one file in directory when using .js2 extension", function() {
        var callback = sandbox.spy();

        traverse({
            files: [ fixturesDir ],
            extensions: [".js2"]
        }, callback);

        assert.ok(callback.calledOnce);
        assert.equal(callback.getCall(0).args[0], foundFile2);
    });

    it("should find one file in directory and use one directly passed", function() {
        var callback = sandbox.spy();

        traverse({
            files: [ fixturesDir, extensionlessFile ],
            extensions: [".js"]
        }, callback);

        assert.ok(callback.calledTwice);
        assert.equal(callback.getCall(0).args[0], foundFile);
        assert.equal(callback.getCall(1).args[0], extensionlessFile);
    });

    it("should find two files in directory when using .js2 extension", function() {
        var callback = sandbox.spy();

        traverse({
            files: [ fixturesDir ],
            extensions: [".js", ".js2"]
        }, callback);

        assert.ok(callback.calledTwice);
        assert.equal(callback.getCall(0).args[0], foundFile);
        assert.equal(callback.getCall(1).args[0], foundFile2);
    });

    it("should find normal files", function() {
        var files = [];

        traverse({
            files: [ fixturesDir ],
            extensions: [".js"]
        }, function(file) {
            files.push(file);
        });

        assert.notEqual(files.length, 0);
    });

    it("should throw if fs.statSync throws", sinon.test(/* @this sinon.sandbox */function() {
        var error = new Error("anyError"),
            options = {
                files: [ "/any/file.js" ],
                extensions: [".js"],
                exclude: false
            },
            callback = this.spy();

        this.stub(fs, "statSync").throws(error);

        assert.throws(traverse.bind(null, options, callback), "anyError");
        sinon.assert.notCalled(callback);
    }));

});
