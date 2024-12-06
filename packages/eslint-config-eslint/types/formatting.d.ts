import type { Linter } from "eslint";

declare const eslintConfigESLintFormatting: Required<
    Pick<Linter.Config, "rules">
>;

export = eslintConfigESLintFormatting;
