/**
 * @fileoverview This file contains the rule types for ESLint. It was initially extracted
 * from the `@types/eslint` package.
 */

/*
 * MIT License
 * Copyright (c) Microsoft Corporation.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE
 */

import { Linter } from "../index";

import { BestPractices } from "./best-practices";
import { Deprecated } from "./deprecated";
import { ECMAScript6 } from "./ecmascript-6";
import { NodeJSAndCommonJS } from "./node-commonjs";
import { PossibleErrors } from "./possible-errors";
import { StrictMode } from "./strict-mode";
import { StylisticIssues } from "./stylistic-issues";
import { Variables } from "./variables";

export interface ESLintRules
    extends
    Linter.RulesRecord,
    PossibleErrors,
    BestPractices,
    StrictMode,
    Variables,
    NodeJSAndCommonJS,
    StylisticIssues,
    ECMAScript6,
    Deprecated { }

type NoStringIndex<T> = {
    [K in keyof T as string extends K ? never : K]: T[K];
};

export type ESLintRulesPossibleErrors = NoStringIndex<PossibleErrors>;
export type ESLintRulesBestPractices = NoStringIndex<BestPractices>;
export type ESLintRulesStrictMode = NoStringIndex<StrictMode>;
export type ESLintRulesVariables = NoStringIndex<Variables>;
export type ESLintRulesNodeJSAndCommonJS = NoStringIndex<NodeJSAndCommonJS>;
export type ESLintRulesStylisticIssues = NoStringIndex<StylisticIssues>;
export type ESLintRulesECMAScript6 = NoStringIndex<ECMAScript6>;
export type ESLintRulesDeprecated = NoStringIndex<Deprecated>;
