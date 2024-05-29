interface FlatConfig {
    rules: Record<string, any>;
}

module.exports = {
    rules: {
        "no-undef": "error",
    },
} satisfies FlatConfig;
