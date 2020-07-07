/**
 * @fileoverview Default CLIEngineOptions.
 * @author Ian VanSchooten
 */

"use strict";

module.exports = {
    configFile: null,
    baseConfig: false,
    rulePaths: [],
    useEslintrc: true,
    envs: [],
    globals: [],
    extensions: null,
    ignore: true,
    ignorePath: void 0,
    cache: false,

    /*
     * in order to honor the cacheFile option if specified
     * this option should not have a default value otherwise
     * it will always be used
     */
    cacheLocation: "",
    cacheFile: ".eslintcache",
    fix: false,
    allowInlineConfig: true,
    inlineConfigGroup: "default",
    reportUnusedDisableDirectives: void 0,
    globInputPaths: true
};
