const { rules } = require("../core-rules")

module.exports = {
    rules: { ...rules }
}

delete module.exports.rules.eqeqeq
