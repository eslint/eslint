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

        "should return string for .rulesdir": function(topic) {
            var currentOptions = options.parse(topic);
            assert.iString(currentOptions.rulesdir);
            assert.equal(currentOptions.rulesdir, "/morerules");
        }

    }

});
