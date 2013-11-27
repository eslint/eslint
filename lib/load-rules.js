
"use strict";

var fs = require("fs"),
    path = require("path");

module.exports = function(rulesDir) {
    if (!rulesDir) {
        rulesDir = path.join(__dirname, "rules");
    } else {
        rulesDir = path.resolve(process.cwd(), rulesDir);
    }

    var rules = Object.create(null);
    fs.readdirSync(rulesDir).forEach(function(file) {
        if (path.extname(file) !== ".js") { return; }
        rules[file.slice(0, -3)] = require(path.join(rulesDir, file));
    });
    return rules;
};
