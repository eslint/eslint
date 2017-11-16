module.exports = transform;

var fs = require("fs"),
    path = require("path"),
    through = require("through");

var target = path.resolve(__dirname, "..", "..", "lib", "load-rules.js");


function transform(filename) {
    if(filename === target) {
        return through(noop, inject);
    }

    return through();
}

function noop() {

}

function inject() {
    var output = "module.exports = function() {\n";
    output += "    var rules = Object.create(null);\n";

    fs.readdirSync(path.resolve(__dirname, "..", "..", "lib", "rules"))
        .filter(function(filename) {
            return filename.endsWith(".js");
        })
        .forEach(function(filename) {
            var basename = path.basename(filename, ".js");
            output += "    rules[\"" + basename + "\"] = require(\"./rules/" + basename + "\");\n";
        });

    output += "\n    return rules;\n};";

    this.queue(output);
    this.queue(null);
}
