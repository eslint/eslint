import type { Linter } from "eslint";

import * as eslintConfigESLint from "eslint-config-eslint";
import * as eslintConfigESLintBase from "eslint-config-eslint/base";
import * as eslintConfigESLintCJS from "eslint-config-eslint/cjs";
import * as eslintConfigESLintFormatting from "eslint-config-eslint/formatting";

eslintConfigESLintBase satisfies typeof eslintConfigESLint;
eslintConfigESLintBase satisfies Linter.Config[];
eslintConfigESLintCJS satisfies Linter.Config[];
eslintConfigESLintFormatting satisfies Linter.Config;
eslintConfigESLint satisfies Linter.Config[];
eslintConfigESLintBase satisfies typeof eslintConfigESLintCJS;
eslintConfigESLintBase satisfies (typeof eslintConfigESLintFormatting)[];
