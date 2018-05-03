/**
 * @fileoverview Require this file from an ESLint entry point in order to perform a Node.js version runtime check.
 * @author Kevin Partington
 */

"use strict";

const assert = require("assert"),
    semver = require("semver"),
    packageJson = require("../../package.json");

assert(
    semver.satisfies(process.versions.node, packageJson.engines.node),
    `ESLint requires a Node.js runtime in this version range: ${packageJson.engines.node}`);
