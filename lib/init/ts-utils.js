/**
 * @fileoverview Utility for tsconfig.
 * @author Pouya MozaffarMagham
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const fs = require("fs"),
    path = require("path");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Find the closest tsconfig.json file, starting at process.cwd (by default),
 * and working up to root.
 * @param   {string} [startDir=process.cwd()] Starting directory
 * @returns {string}                          Relative path to closest tsconfig.json file
 */
function findTsConfig(startDir) {
    let dir = path.resolve(startDir || process.cwd());
    let levels = 0;

    do {
        const tsConfigFile = path.join(dir, "tsconfig.json");

        if (!fs.existsSync(tsConfigFile) || !fs.statSync(tsConfigFile).isFile()) {
            dir = path.join(dir, "..");
            levels++;
            continue;
        }
        return `${"../".repeat(levels)}tsconfig.json`;
    } while (dir !== path.resolve(dir, ".."));
    return null;
}

//------------------------------------------------------------------------------
// Private
//------------------------------------------------------------------------------

/**
 * Check whether tsconfig.json is found in current path.
 * @param   {string} [startDir] Starting directory
 * @returns {boolean} Whether a tsconfig.json is found in current path.
 */
function checkTsConfig(startDir) {
    return !!findTsConfig(startDir);
}

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

module.exports = {
    findTsConfig,
    checkTsConfig
};
