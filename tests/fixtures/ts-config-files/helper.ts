/*
 * This file ensures that TypeScript configuration files can handle
 * importing various TypeScript constructs such as types, enums,
 * and namespaces from other TypeScript files.
 */

export type RuleLevelAndOptions<Options extends any[] = any[]> = Prepend<
    Partial<Options>,
    RuleLevel
>;

export type StringSeverity = "off" | "warn" | "error";

export const enum Severity {
    "Off" = 0,
    "Warn" = 1,
    "Error" = 2,
}

export type RuleLevel = Severity | StringSeverity;

export type RuleEntry<Options extends any[] = any[]> =
    | RuleLevel
    | RuleLevelAndOptions<Options>;

export interface RulesRecord {
    [rule: string]: RuleEntry;
}

export interface FlatConfig<Rules extends RulesRecord = RulesRecord> {
    name?: string;
    files?: Array<string | string[]>;
    ignores?: string[];
    linterOptions?: {
        noInlineConfig?: boolean;
        reportUnusedDisableDirectives?: Severity | StringSeverity | boolean;
    };
    processor?: string;
    plugins?: Record<string, any>;
    rules?: Partial<Rules>;
    settings?: Record<string, unknown>;
}

export namespace ESLintNameSpace {
    export const enum StringSeverity {
        "Off" = "off",
        "Warn" = "warn",
        "Error" = "error",
    }
}
