var espree = require("espree");

exports.parseForESLint = function(code, options) {
    return {
        ast: espree.parse(code, options),
        services: {
            test: {
                getMessage() {
                    return "Hi!";
                }
            }
        }
    };
};

exports.parse = function() {
    throw new Error("Use parseForESLint() instead.");
};
