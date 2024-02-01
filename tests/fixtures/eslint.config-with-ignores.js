const eslintConfig = require("./eslint.config.js");

module.exports = [
    eslintConfig,
    {
        ignores: ["**/*.json", "**/*.js"]
    }
];
