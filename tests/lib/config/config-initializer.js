/**
 * @fileoverview Tests for configInitializer.
 * @author Ilya Volodin
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var assert = require("chai").assert,
    init = require("../../../lib/config/config-initializer");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var answers = {};

describe("configInitializer", function() {

    describe("processAnswers()", function() {
        beforeEach(function() {
            answers = {
                extendDefault: true,
                indent: 2,
                quotes: "single",
                linebreak: "unix",
                semi: true,
                es6: true,
                env: ["browser"],
                jsx: false,
                react: false,
                format: "JSON"
            };
        });

        it("should create default config", function() {
            var config = init.processAnswers(answers);
            assert.deepEqual(config.rules.indent, [2, 2]);
            assert.deepEqual(config.rules.quotes, [2, "single"]);
            assert.deepEqual(config.rules["linebreak-style"], [2, "unix"]);
            assert.deepEqual(config.rules.semi, [2, "always"]);
            assert.equal(config.env.es6, true);
            assert.equal(config.env.browser, true);
            assert.equal(config.extends, "eslint:recommended");
        });

        it("should disable semi", function() {
            answers.semi = false;
            var config = init.processAnswers(answers);
            assert.deepEqual(config.rules.semi, [2, "never"]);
        });

        it("should enable jsx flag", function() {
            answers.jsx = true;
            var config = init.processAnswers(answers);
            assert.equal(config.ecmaFeatures.jsx, true);
        });

        it("should enable react plugin", function() {
            answers.jsx = true;
            answers.react = true;
            var config = init.processAnswers(answers);
            assert.equal(config.ecmaFeatures.jsx, true);
            assert.equal(config.ecmaFeatures.experimentalObjectRestSpread, true);
            assert.deepEqual(config.plugins, ["react"]);
        });

        it("should not enable es6", function() {
            answers.es6 = false;
            var config = init.processAnswers(answers);
            assert.isUndefined(config.env.es6);
        });

        it("should extend eslint:recommended", function() {
            var config = init.processAnswers(answers);
            assert.equal(config.extends, "eslint:recommended");
        });

        it("should support the google style guide", function() {
            var config = init.getConfigForStyleGuide("google");
            assert.deepEqual(config, {extends: "google"});
        });

        it("should support the airbnb style guide", function() {
            var config = init.getConfigForStyleGuide("airbnb");
            assert.deepEqual(config, {extends: "airbnb", plugins: ["react"]});
        });

        it("should support the standard style guide", function() {
            var config = init.getConfigForStyleGuide("standard");
            assert.deepEqual(config, {extends: "standard", plugins: ["standard"]});
        });

        it("should throw when encountering an unsupported style guide", function() {
            assert.throws(function() {
                init.getConfigForStyleGuide("non-standard");
            }, "You referenced an unsupported guide.");
        });
    });

});
