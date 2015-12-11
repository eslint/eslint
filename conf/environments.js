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
// Public Interface
//------------------------------------------------------------------------------

module.exports = {
    builtin: globals.es5,
    browser: {
        globals: globals.browser
    },
    node: {
        globals: globals.node,
        parserOptions: {
            ecmaFeatures: {
                globalReturn: true
            }
        }
    },
    commonjs: {
        globals: globals.commonjs,
        parserOptions: {
            ecmaFeatures: {
                globalReturn: true
            }
        }
    },
    worker: {
        globals: globals.worker
    },
    amd: {
        globals: globals.amd
    },
    mocha: {
        globals: globals.mocha
    },
    jasmine: {
        globals: globals.jasmine
    },
    jest: {
        globals: globals.jest
    },
    phantomjs: {
        globals: globals.phantomjs
    },
    jquery: {
        globals: globals.jquery
    },
    qunit: {
        globals: globals.qunit
    },
    prototypejs: {
        globals: globals.prototypejs
    },
    shelljs: {
        globals: globals.shelljs
    },
    meteor: {
        globals: globals.meteor
    },
    mongo: {
        globals: globals.mongo
    },
    protractor: {
        globals: globals.protractor
    },
    applescript: {
        globals: globals.applescript
    },
    nashorn: {
        globals: globals.nashorn
    },
    serviceworker: {
        globals: globals.serviceworker
    },
    embertest: {
        globals: globals.embertest
    },
    webextensions: {
        globals: globals.webextensions
    },
    es6: {
        globals: globals.es6,
        parserOptions: {
            ecmaVersion: 6
        }
    }
};
