import type { Linter } from "eslint";

import eslintConfigESLint = require("eslint-config-eslint");
import eslintConfigESLintBase = require("eslint-config-eslint/base");
import eslintConfigESLintCJS = require("eslint-config-eslint/cjs");
import eslintConfigESLintFormatting = require("eslint-config-eslint/formatting");

eslintConfigESLintBase satisfies typeof eslintConfigESLint;
eslintConfigESLintBase satisfies Linter.Config[];
eslintConfigESLintCJS satisfies Linter.Config[];
eslintConfigESLintFormatting satisfies Linter.Config;
eslintConfigESLint satisfies Linter.Config[];
eslintConfigESLintBase satisfies typeof eslintConfigESLintCJS;

const ESLintConfig = [...eslintConfigESLint, eslintConfigESLintFormatting];

ESLintConfig satisfies Linter.Config[];
