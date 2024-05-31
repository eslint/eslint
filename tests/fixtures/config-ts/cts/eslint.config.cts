interface FakeFlatConfigItem {
    plugins?: Record<string, unknown>;
    name?: string;
    rules?: Record<string, any>;
}

const config: FakeFlatConfigItem[] = [
    {
        rules: {
            "no-undef": "error" as string
        }
    },
]

module.exports = config;
