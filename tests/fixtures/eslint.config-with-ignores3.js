const eslintConfig = require("./eslint.config.js");

module.exports = [
    eslintConfig,
    {
        name: "Global ignores",
        ignores: ["**/*.json", "**/*.js"]
    }
];
