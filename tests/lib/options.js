/**
 * @fileoverview Tests for options.
 * @author Nicholas C. Zakas
 */

/*jshint node:true*/

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var vows = require("vows"),
    assert = require("assert"),
    sinon = require("sinon"),
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

vows.describe("options").addBatch({

    "when passed --help": {

        topic: [ "--help" ],

        "should return true for .h": function(topic) {
            var currentOptions = options.parse(topic);
            assert.isTrue(currentOptions.h);
        }

    },

    "when passed -h": {

        topic: [ "-h" ],

        "should return true for .h": function(topic) {
            var currentOptions = options.parse(topic);
            assert.isTrue(currentOptions.h);
        }

    },


    "when passed --config": {

        topic: [ "--config" ],

        "should return true for .c": function(topic) {
            var currentOptions = options.parse(topic);
            assert.isTrue(currentOptions.c);
        }

    },

    "when passed -c": {

        topic: [ "-c" ],

        "should return true for .c": function(topic) {
            var currentOptions = options.parse(topic);
            assert.isTrue(currentOptions.c);
        }

    },

    "when passed --rulesdir": {

        topic: [ "--rulesdir", "/morerules" ],

        "should return a string for .rulesdir": function(topic) {
            var currentOptions = options.parse(topic);
            assert.isString(currentOptions.rulesdir);
            assert.equal(currentOptions.rulesdir, "/morerules");
        }

    },

    "when passed --format": {

        topic: [ "--format", "compact" ],

        "should return a string for .f": function(topic) {
            var currentOptions = options.parse(topic);
            assert.equal(currentOptions.f, "compact");
        }

    },

    "when passed -f": {

        topic: [ "-f", "compact" ],

        "should return a string for .f": function(topic) {
            var currentOptions = options.parse(topic);
            assert.equal(currentOptions.f, "compact");
        }

    },

    "when passed -v": {

        topic: [ "-v" ],

        "should return true for .v": function(topic) {
            var currentOptions = options.parse(topic);
            assert.isTrue(currentOptions.v);
        }

    },

    "when passed --version": {

        topic: [ "--version" ],

        "should return true for .v": function(topic) {
            var currentOptions = options.parse(topic);
            assert.isTrue(currentOptions.v);
        }

    }




}).export(module);
