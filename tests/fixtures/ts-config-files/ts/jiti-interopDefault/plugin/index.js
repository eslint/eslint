module.exports = {
    configs: {
        recommended: {
            rules: {
                "no-undef": "error",
            },
        },
    },
};

// The following string will confuse jiti when interopDefault is false:
// @foo export {}
