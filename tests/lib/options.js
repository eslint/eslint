/**
 * @fileoverview Tests for options.
 * @author Nicholas C. Zakas
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var assert = require("chai").assert,
    options = require("../../lib/options");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

/*
 * This may look like it's simply testing optimist under the covers, but really
 * it's testing the interface of the options object. I want to make sure the
 * interface is solid and tested because I'm not sure I want to use optimist
 * long-term.
 */

describe("options", function() {
    describe("when passed --help", function() {
        var code = [ "--help" ];

        it("should return true for .h", function() {
            var currentOptions = options.parse(code);
            assert.isTrue(currentOptions.h);
        });
    });

    describe("when passed -h", function() {
        var code = [ "-h" ];

        it("should return true for .h", function() {
            var currentOptions = options.parse(code);
            assert.isTrue(currentOptions.h);
        });
    });

    describe("when passed --config", function() {
        var code = [ "--config" ];

        it("should return true for .c", function() {
            var currentOptions = options.parse(code);
            assert.isTrue(currentOptions.c);
        });
    });

    describe("when passed -c", function() {
        var code = [ "-c" ];

        it("should return true for .c", function() {
            var currentOptions = options.parse(code);
            assert.isTrue(currentOptions.c);
        });
    });

    describe("when passed --rulesdir", function() {
        var code = [ "--rulesdir", "/morerules" ];

        it("should return a string for .rulesdir", function() {
            var currentOptions = options.parse(code);
            assert.isString(currentOptions.rulesdir);
            assert.equal(currentOptions.rulesdir, "/morerules");
        });
    });

    describe("when passed --format", function() {
        var code = [ "--format", "compact" ];

        it("should return a string for .f", function() {
            var currentOptions = options.parse(code);
            assert.equal(currentOptions.f, "compact");
        });
    });

    describe("when passed -f", function() {
        var code = [ "-f", "compact" ];

        it("should return a string for .f", function() {
            var currentOptions = options.parse(code);
            assert.equal(currentOptions.f, "compact");
        });
    });

    describe("when passed -v", function() {
        var code = [ "-v" ];

        it("should return true for .v", function() {
            var currentOptions = options.parse(code);
            assert.isTrue(currentOptions.v);
        });
    });

    describe("when passed --version", function() {
        var code = [ "--version" ];

        it("should return true for .v", function() {
            var currentOptions = options.parse(code);
            assert.isTrue(currentOptions.v);
        });
    });

    describe("when asking for help", function() {
        it("should log the help content to the console", function() {
            var log = console.log;

            var loggedMessages = [];
            console.log = function(message) {
                loggedMessages.push(message);
            };

            options.help();
            assert.equal(loggedMessages.length, 1);

            console.log = log;
        });
    });
});
