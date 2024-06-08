"use strict";

const fs = require("node:fs");
const path = require("node:path");

module.exports = {
    rules: Object.assign(
        {},
        ...fs.readdirSync(__dirname)
            .filter(filename => filename.endsWith(".js") && filename !== "index.js")
            .map(filename => ({ [filename.replace(/\.js$/u, "")]: require(path.resolve(__dirname, filename)) }))
    )
};
