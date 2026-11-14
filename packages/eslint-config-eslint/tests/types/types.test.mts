import type { Linter } from "eslint";

import eslintConfigESLint from "eslint-config-eslint";
import eslintConfigESLintBase from "eslint-config-eslint/base";
import eslintConfigESLintCJS from "eslint-config-eslint/cjs";
import eslintConfigESLintFormatting from "eslint-config-eslint/formatting";
import eslintConfigESLintMarkdown from "eslint-config-eslint/markdown";

eslintConfigESLintBase satisfies typeof eslintConfigESLint;
eslintConfigESLintBase satisfies Linter.Config[];
eslintConfigESLintCJS satisfies Linter.Config[];
eslintConfigESLintFormatting satisfies Linter.Config;
eslintConfigESLintMarkdown satisfies Linter.Config;
eslintConfigESLint satisfies Linter.Config[];
eslintConfigESLintBase satisfies typeof eslintConfigESLintCJS;

const ESLintConfig = [...eslintConfigESLint, eslintConfigESLintFormatting];

ESLintConfig satisfies Linter.Config[];
