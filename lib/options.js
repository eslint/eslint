/**
 * @fileoverview Options configuration for nopt.
 * @author Brandon Mills
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var path = require("path");
var nopt = require("nopt");
var noptDefaults = require("nopt-defaults");
var noptUsage = require("nopt-usage");
var extend = require("extend");

//------------------------------------------------------------------------------
// Initialization
//------------------------------------------------------------------------------

var knownOpts = {
  "help": Boolean,
  "config": String,
  "rulesdir": path,
  "format": String,
  "version": Boolean,
  "reset": Boolean,
  "eslintrc": Boolean,
  "env": [Array, "node", "browser", "amd", "mocha"]
};

var shortHands = {
  "h": "--help",
  "c": "--config",
  "f": "--format",
  "v": "--version"
};

var descriptions = {
  "help": "Show help.",
  "config": "Load configuration data from this file.",
  "rulesdir": "Load additional rules from this directory.",
  "format": "Use a specific output format.",
  "version": "Outputs the version number.",
  "reset": "Set all default rules to off.",
  "eslintrc": "Enable loading .eslintrc configuration.",
  "env": "Specify environments."
};

var defaults = {
  "format": "stylish",
  "eslintrc": true
};

exports.parse = function(args) {
  return noptDefaults(nopt(knownOpts, extend({}, shortHands), args, 0), defaults);
};

exports.help = function() {
  var output = [
    "eslint [options] file.js [file.js] [dir]",
    "",
    "Options:",
    noptUsage(knownOpts, shortHands, descriptions, defaults)
  ].join("\n");
  console.log(output);
};
