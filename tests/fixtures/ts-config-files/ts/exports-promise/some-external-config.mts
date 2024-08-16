import type { FlatConfig } from "../../helper";
import { ESLintNameSpace } from "../../helper";

export default [
    {
        rules: {
            "no-undef": ESLintNameSpace.StringSeverity.Error,
        },
    },
] satisfies FlatConfig[];
