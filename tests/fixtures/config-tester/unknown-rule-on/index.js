const { rules } = require("../core-rules");

module.exports = {
    rules: {
        ...rules,
        "unknown-rule": "warn"
    }
}
