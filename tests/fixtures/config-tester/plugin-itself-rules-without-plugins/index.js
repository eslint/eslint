const { rules } = require("../core-rules");

module.exports = {
    configs: {
        recommended: {
            env: {
                "test/environment": true
            },
            processor: "test/processor",
            rules: {
                ...rules,
                "test/rule": "error"
            },
        }
    },
    environments: {
        environment: {}
    },
    processors: {
        processor: {}
    },
    rules: {
        rule: {
            meta: {},
            create() {}
        },
        "deprecated-rule": {
            meta: { deprecated: true },
            create() {}
        }
    }
}
