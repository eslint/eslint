// as in '= require("eslint-plugin-mine")'
const myPlugin = {
    configs: { recommended: {} }
}

module.exports = [
    {
        rules: {
            quotes: ["error", "single"]
        }
    },
    // 'whoops, this should really be "recommended"'
    myPlugin.configs.eslint_recommended
]
