interface FlatConfig {
    rules: Record<string, any>;
}

export default {
    rules: {
        "no-undef": "error",
    },
} satisfies FlatConfig;
