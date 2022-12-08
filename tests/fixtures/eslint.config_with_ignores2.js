const eslintConfig = require("./eslint.config.js");

module.exports = [
    eslintConfig,
    {
        ignores: ["**/undef.js", "undef2.js", "**/undef3.js"]
    }
];
