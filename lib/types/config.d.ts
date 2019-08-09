/**
 * The value of `globals` setting.
 */
export type GlobalVariableKind =
    | "off"
    | "readonly"
    | "writable"
    | LegacyGlobalVariableKind

/**
 * The legacy value of `globals` setting.
 * - `false` was replaced by `"readonly"`.
 * - `"readable"` was replaced by `"readonly"`.
 * - `true` was replaced by `"writable"`.
 * - `"writeable"` was replaced by `"writable"`.
 */
export type LegacyGlobalVariableKind = boolean | "readable" | "writeable"

/**
 * The severity value.
 */
export type SeverityKind = "off" | "warn" | "error" | LegacySeverityKind

/**
 * The severity value.
 * - `0` was replaced by `"off"`.
 * - `1` was replaced by `"warn"`.
 * - `2` was replaced by `"error"`.
 */
export type LegacySeverityKind = 0 | 1 | 2

/**
 * The value of `rules` setting.
 */
export type RuleSetting = SeverityKind | [SeverityKind, ...unknown[]]

/**
 * The value of `parserOptions` setting.
 */
export interface ParserOptions {
    readonly sourceType?: "script" | "module"
    readonly ecmaVersion?:
        | 3 | 5 | 2015 | 2016 | 2017 | 2018 | 2019
        | 6 | 7 | 8 | 9 | 10
    readonly ecmaFeatures?: {
        readonly globalReturn?: boolean
        readonly jsx?: boolean
        readonly impliedStrict?: boolean
    }

    [key: string]: unknown
}

/**
 * The common properties of both top-level and `overrides` setting.
 */
interface CommonConfigData {
    env?: Record<string, boolean>
    extends?: string | string[]
    globals?: Record<string, GlobalVariableKind>
    overrides?: OverrideConfigData[]
    parser?: string
    parserOptions?: ParserOptions
    plugins?: string[]
    processor?: string
    rules?: Record<string, RuleSetting>
    settings?: Record<string, unknown>
}

/**
 * The config data.
 */
export interface ConfigData extends CommonConfigData {
    root?: boolean
}

/**
 * The config data of `overrides` setting.
 */
export interface OverrideConfigData extends CommonConfigData {
    excludedFiles?: string | string[]
    files: string | string[]
}
