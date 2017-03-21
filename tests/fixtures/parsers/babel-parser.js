var babel = require("babel-eslint");

exports.parseForESLint = function(code, options) {
    return babel.parseNoPatch(code, options);
};

exports.parse = function() {
    throw new Error("Use parseForESLint() instead.");
};
