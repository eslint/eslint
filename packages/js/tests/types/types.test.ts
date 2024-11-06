/**
 * @fileoverview This file contains code intended to test our types.
 * It was initially extracted from the `@types/eslint__js` package.
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

import type { ESLint, Linter } from "eslint";
import js from "../../";

js satisfies ESLint.Plugin;
js.meta.name satisfies string;
js.meta.version satisfies string;

let config: Linter.Config[];

config = [js.configs.recommended];

config = [js.configs.all];

config = [js.configs.recommended, js.configs.all];

config = [
    {
        ...js.configs.recommended,
        files: ["blah"],
    },
    {
        ...js.configs.all,
        files: ["meh"],
    },
    {
        files: ["foo"],
    },
];

config = [
    {
        files: ["**/*.js"],
        rules: js.configs.recommended.rules,
    },
    {
        files: ["**/*.js"],
        rules: {
            ...js.configs.recommended.rules,
            "no-unused-vars": "warn",
        },
    },
    {
        files: ["**/*.js"],
        rules: {
            ...js.configs.all.rules,
            "no-unused-vars": "warn",
        },
    },
];
