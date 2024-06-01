import { LocalNamespace } from "./namespace.mts";

export default [
    {
        rules: {
            "no-undef": LocalNamespace.Level.Error
        }
    },
] as const;
