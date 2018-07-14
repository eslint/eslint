#!/usr/bin/env node

/**
 * @fileoverview check whether meet its requirements before running eslint cli.
 * @author Aladdin-ADD<hh_2013@foxmail.com>
 */
/* eslint-disable no-process-exit,no-console */
"use strict";

const semver = require("semver");
const pkg = require("../package.json");
const requiredVersion = pkg.engines.node;

if (!semver.satisfies(process.version, requiredVersion)) {
    console.error(`${pkg.name} requires at least version ${requiredVersion} of Node, please upgrade!`);
    process.exit(1);
}

require("./eslint.js");
