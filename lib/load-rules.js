var fs = require("fs"),
    path = require("path"),
    rulesDir = path.join(__dirname, "rules");

fs.readdirSync(rulesDir).forEach(function(file) {
    if(path.extname(file) !== ".js") { return; }
    exports[file.slice(0, -3)] = require(path.join(rulesDir, file));
});
