var defaultOptions = require("../../../../conf/eslint-recommended");

module.exports = {
    parser: defaultOptions.parser,
    rules: {
        semi: [2, "always"]
    }
}
