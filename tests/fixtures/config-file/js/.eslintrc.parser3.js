var defaultOptions = require("../../../../conf/eslint.json");

module.exports = {
    parser: defaultOptions.parser,
    rules: {
        semi: [2, "always"]
    }
}
