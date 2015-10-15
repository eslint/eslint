/**
 * @fileoverview Defines environment settings and globals.
 * @author Elan Shanker
 * @copyright 2014 Elan Shanker. All rights reserved.
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var globals = require("globals");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

var globalImports = [
    "browser",
    "node",
    "commonjs",
    "worker",
    "amd",
    "mocha",
    "jasmine",
    "jest",
    "phantomjs",
    "jquery",
    "qunit",
    "prototypejs",
    "shelljs",
    "meteor",
    "mongo",
    "protractor",
    "applescript",
    "nashorn",
    "serviceworker",
    "embertest",
    "webextensions",
    "wsh"
];

var globalReturns = [
    "node",
    "commonjs"
];

var environments = {
    builtin: globals.builtin,
    es6: {
        ecmaFeatures: {
            arrowFunctions: true,
            blockBindings: true,
            regexUFlag: true,
            regexYFlag: true,
            templateStrings: true,
            binaryLiterals: true,
            octalLiterals: true,
            unicodeCodePointEscapes: true,
            superInFunctions: true,
            defaultParams: true,
            restParams: true,
            forOf: true,
            objectLiteralComputedProperties: true,
            objectLiteralShorthandMethods: true,
            objectLiteralShorthandProperties: true,
            objectLiteralDuplicateProperties: true,
            generators: true,
            destructuring: true,
            classes: true,
            spread: true,
            newTarget: true
        }
    }
};

globalImports.forEach(function (environment) {

    var importedGlobals = globals[environment];
    if (importedGlobals) {
        var newEnvironment = environments[environment] = {
            globals: importedGlobals
        };
        if (-1 < globalReturns.indexOf(environment)) {
            newEnvironment.ecmaFeatures = {
                globalReturn: true
            };
        }
    }

});

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

module.exports = environments;
