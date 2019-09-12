/**
 * @fileoverview Log information for debugging purposes
 * @author Kai Cataldo
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const path = require("path");
const spawn = require("cross-spawn");
const { isEmpty } = require("lodash");
const log = require("../shared/logging");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Checks if a given path is in a given directory.
 * @param {string} parentPath - The parent path to check.
 * @param {string} childPath - The path to check.
 * @returns {boolean} Whether or not the given path is in the given directory.
 */
function isInDirectory(parentPath, childPath) {
    return !path.relative(parentPath, childPath).startsWith("..");
}

/**
 * Synchronously executes a shell command and formats the result.
 * @param {string} cmd - The command to execute.
 * @param {Array} args - The arguments to be executed with the command.
 * @returns {string} The version returned by the command.
 */
function execCommand(cmd, args) {
    const process = spawn.sync(cmd, args, { encoding: "utf8" });

    if (process.error) {
        throw process.error;
    }

    return process.stdout.trim();
}

/**
 * Normalizes a version number.
 * @param {string} versionStr - The string to normalize.
 * @returns {string} The normalized version number.
 */
function normalizeVersionStr(versionStr) {
    return versionStr.startsWith("v") ? versionStr : `v${versionStr}`;
}

/**
 * Gets bin version.
 * @param {string} bin - The bin to check.
 * @returns {string} The normalized version returned by the command.
 */
function getBinVersion(bin) {
    const binArgs = ["--version"];

    try {
        return execCommand(bin, binArgs);
    } catch (e) {
        log.error(`Error finding ${bin} version running the command ${bin} ${binArgs.join(" ")}`);
        throw e;
    }
}

/**
 * Gets installed npm package version.
 * @param {string} pkg - The package to check.
 * @param {boolean} global - Whether to check globally or not.
 * @returns {string} The normalized version returned by the command.
 */
function getNpmPackageVersion(pkg, { global = false } = {}) {
    const npmBinArgs = ["bin", "-g"];
    const npmLsArgs = ["ls", "--depth=0", "--json", "eslint"];

    if (global) {
        npmLsArgs.push("-g");
    }

    try {
        const parsedStdout = JSON.parse(execCommand("npm", npmLsArgs));

        if (isEmpty(parsedStdout)) {
            return "Not found";
        }

        const [, processBinPath] = process.argv;
        let npmBinPath;

        try {
            npmBinPath = execCommand("npm", npmBinArgs);
        } catch (e) {
            log.error(`Error finding npm binary path when running command npm ${npmBinArgs.join(" ")}`);
            throw e;
        }

        const isGlobal = isInDirectory(npmBinPath, processBinPath);
        let pkgVersion = parsedStdout.dependencies.eslint.version;

        if ((global && isGlobal) || (!global && !isGlobal)) {
            pkgVersion += " (Currently used)";
        }

        return pkgVersion;
    } catch (e) {
        log.error(`Error finding ${pkg} version running the command npm ${npmLsArgs.join(" ")}`);
        throw e;
    }
}

/**
 * Generates and returns execution environment information.
 * @returns {string} A string that contains execution environment information.
 */
function environment() {
    return [
        "Environment Info:",
        "",
        `Node version: ${normalizeVersionStr(getBinVersion("node"))}`,
        `npm version: ${normalizeVersionStr(getBinVersion("npm"))}`,
        `Local ESLint version: ${normalizeVersionStr(getNpmPackageVersion("eslint", { global: false }))}`,
        `Global ESLint version: ${normalizeVersionStr(getNpmPackageVersion("eslint", { global: true }))}`
    ].join("\n");
}

/**
 * Returns version of currently executing ESLint.
 * @returns {string} The version from the currently executing ESLint's package.json.
 */
function version() {
    return `v${require("../../package.json").version}`;
}

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

module.exports = {
    environment,
    version
};
