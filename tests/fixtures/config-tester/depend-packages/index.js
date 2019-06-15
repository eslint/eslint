const { rules } = require("../core-rules")

module.exports = {
    extends: "base",
    parser: "parser",
    plugins: ["test"],
    rules
}
