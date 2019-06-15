const { rules } = require("../core-rules");

module.exports = {
    env: {
        "test/environment": true
    },
    plugins: ["test"],
    processor: "test/processor",
    rules: {
        ...rules,
        "test/rule": "error"
    },
}
