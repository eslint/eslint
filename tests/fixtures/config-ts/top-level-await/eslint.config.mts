
interface FakeFlatConfigItem {
    plugins?: Record<string, unknown>;
    name?: string;
    rules?: Record<string, unknown>;
}

const config: FakeFlatConfigItem[] = [
    // Top-level await
    await Promise.resolve({
        rules: {
            "no-undef": "error" as string
        }
    }),
]

export default config;
