/*
 * This file ensures that TypeScript configuration files can handle
 * importing various TypeScript constructs such as types, enums,
 * and namespaces from other TypeScript files.
 */

import { Linter } from "eslint";

export const enum Severity {
    "Off" = 0,
    "Warn" = 1,
    "Error" = 2,
}

export type FlatConfig = Linter.Config;

export namespace ESLintNameSpace {
    export const enum StringSeverity {
        "Off" = "off",
        "Warn" = "warn",
        "Error" = "error",
    }
}
