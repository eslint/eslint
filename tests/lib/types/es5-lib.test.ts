import { builtinRules } from "eslint/use-at-your-own-risk";
import type { ESLint, SourceCode } from "eslint";

declare const eslintCtor: typeof ESLint;
declare const sourceCode: SourceCode;

void eslintCtor;
void sourceCode;
void builtinRules;
