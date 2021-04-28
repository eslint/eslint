/**
 * @fileoverview Default configuration
 * @author Nicholas C. Zakas
 */

"use strict";

//-----------------------------------------------------------------------------
// Requirements
//-----------------------------------------------------------------------------

const Rules = require("../rules");

//-----------------------------------------------------------------------------
// Helpers
//-----------------------------------------------------------------------------

/*
 * Because we try to delay loading rules until absolutely necessary, a proxy
 * allows us to hook into the lazy-loading aspect of the rules map while still
 * keeping all of the relevant configuration inside of the config array.
 */
const defaultRulesConfig = new Proxy({}, {
    get(target, property) {
        return Rules.get(property);
    },

    has(target, property) {
        return Rules.has(property);
    }
});

exports.defaultConfig = [
    {
        plugins: {
            "@": {
                parsers: {
                    espree: require("espree")
                },
                rules: defaultRulesConfig
            }
        },
        ignores: [
            "**/node_modules/**",
            ".*"
        ],
        languageOptions: {
            parser: "@/espree"
        }
    }
];
