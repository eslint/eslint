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
