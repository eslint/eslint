import type { ESLint, SourceCode } from "eslint";
import { builtinRules } from "eslint/use-at-your-own-risk";

declare const eslintCtor: typeof ESLint;
declare const sourceCode: SourceCode;

void eslintCtor;
void sourceCode;
void builtinRules;
