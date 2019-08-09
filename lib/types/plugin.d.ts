import { ConfigData, GlobalVariableKind, ParserOptions } from "./config"
import { Rule } from "./rule"

export interface EnvironmentData {
    readonly globals?: Readonly<Record<string, GlobalVariableKind>>
    readonly parserOptions?: ParserOptions
}

export interface CodeBlock {
    readonly text: string
    readonly filename: string
}

export interface LintMessage {
    readonly column?: number
    readonly endColumn?: number
    readonly endLine?: number
    readonly fatal: boolean
    readonly fix?: {
        readonly range: readonly [number, number]
        readonly text: string
    }
    readonly line: number
    readonly message: string
    readonly ruleId: string | null
    readonly severity: 0 | 1 | 2
}

export interface Processor {
    readonly preprocess?: (text: string, filename: string) => (string | CodeBlock)[]
    readonly postprocess?: (messagesList: LintMessage[][], filename: string) => LintMessage[]
    readonly supportsAutofix?: boolean
}

export interface Plugin<AST> {
    configs?: Readonly<Record<string, ConfigData>>
    environments?: Readonly<Record<string, EnvironmentData>>
    processors?: Readonly<Record<string, Processor>>
    rules?: Readonly<Record<string, Rule<AST>>>
}
