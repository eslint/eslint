"use strict";

module.exports = {
    entryPoints: [
        "./lib/api.js",
        "./lib/eslint/**",

        // "./lib/linter",
        "./lib/rule-tester",
        "./lib/source-code"
    ],
    out: "docs/src/node-api-reference/",
    exclude: [

        // "**/node_modules/**",
        "/lib/linter/code-path-analysis/code-path-state.js",
        "/lib/linter/code-path-analysis/code-path.js",
        "/lib/linter/interpolate.js"
    ],
    entryPointStrategy: "expand",
    readme: "none",
    name: "ESLint Node.js API Reference",
    tsconfig: "./jsconfig.json",
    skipErrorChecking: true,
    entryDocument: "index.md",
    githubPages: false,
    replaceText: {
        replacements: [
            {
                // eslint-disable-next-line no-useless-escape -- is regex that requires the escape characters
                pattern: "(\[.*\])\((.*)(.md)\)",
                replace: "$1($2)",
                flags: "gm"
            }
        ]
    }
};
