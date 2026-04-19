import type { FlatConfig } from "../../helper";
import { Severity } from "../../helper";

module.exports = {
    rules: {
        "no-undef": Severity.Error,
    },
} as const satisfies FlatConfig;
