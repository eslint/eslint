"use strict";

const fs = require("fs");
const path = require("path");

const INTERNAL_RULES_DIR = path.join(__dirname, "tools/internal-rules");

module.exports = {
    rules: fs.readdirSync(INTERNAL_RULES_DIR)
        .filter(filename => filename.endsWith(".js"))
        .reduce(
            (rules, filename) =>
                Object.assign(
                    rules,
                    { [filename.replace(/\.js$/, "")]: require(path.join(INTERNAL_RULES_DIR, filename)) }
                ),
            {}
        )
};
