interface FakeFlatConfigItem {
    plugins?: Record<string, any>;
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

export default config;
