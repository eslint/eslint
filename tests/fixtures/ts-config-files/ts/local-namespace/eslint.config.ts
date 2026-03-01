import type { FlatConfig } from "../../helper";
import { ESLintNameSpace } from "../../helper";

module.exports = {
    rules: {
        "no-undef": ESLintNameSpace.StringSeverity.Error,
    },
} as const satisfies FlatConfig;
