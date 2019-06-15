const { rules } = require("../core-rules");

module.exports = {
    plugins: ["test"],
    rules: {
        ...rules,
        "test/unknown": "error"
    },
}
