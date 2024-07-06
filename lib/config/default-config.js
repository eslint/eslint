/**
 * @fileoverview Default configuration
 * @author Nicholas C. Zakas
 */

"use strict";

//-----------------------------------------------------------------------------
// Requirements
//-----------------------------------------------------------------------------

const Rules = require("../rules");
const { resolve } = require("node:path");
const fs = require("node:fs");

//-----------------------------------------------------------------------------
// Helpers
//-----------------------------------------------------------------------------

/**
 * Retrieves the "type" field value from the project's package.json file.
 * If the "type" field is not present, returns "module" as the default type.
 * @returns {string} The type specified in package.json, or "module" if not specified or on error.
 */
function getProjectType() {
    const cwd = process.cwd();
    const packageJsonPath = resolve(cwd, "package.json");

    try {
        const pkg = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

        return pkg.type || "module";
    } catch {
        return "module";
    }
}

exports.defaultConfig = [
    {
        plugins: {
            "@": {

                languages: {
                    js: require("../languages/js")
                },

                /*
                 * Because we try to delay loading rules until absolutely
                 * necessary, a proxy allows us to hook into the lazy-loading
                 * aspect of the rules map while still keeping all of the
                 * relevant configuration inside of the config array.
                 */
                rules: new Proxy({}, {
                    get(target, property) {
                        return Rules.get(property);
                    },

                    has(target, property) {
                        return Rules.has(property);
                    }
                })
            }
        },
        language: "@/js",
        languageOptions: {
            sourceType: getProjectType(),
            ecmaVersion: "latest",
            parser: require("espree"),
            parserOptions: {}
        },
        linterOptions: {
            reportUnusedDisableDirectives: 1
        }
    },

    // default ignores are listed here
    {
        ignores: [
            "**/node_modules/",
            ".git/"
        ]
    },

    // intentionally empty config to ensure these files are globbed by default
    {
        files: ["**/*.js"]
    },
    {
        files: ["**/*.mjs"],
        languageOptions: {
            sourceType: "module",
            ecmaVersion: "latest"
        }
    },
    {
        files: ["**/*.cjs"],
        languageOptions: {
            sourceType: "commonjs",
            ecmaVersion: "latest"
        }
    }
];
