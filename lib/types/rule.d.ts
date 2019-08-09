import { LineColumn, Location, Range } from "./ast-es2019"
import { CodePath, CodePathSegment } from "./code-path"
import { ArraySchema, Schema, SchemaToType } from "./schema"
import { ScopeManager, Variable } from "./scope"
import { SourceCode } from "./source-code"

type Type<T extends string, AST> = Extract<AST, { type: T }>
interface HasRange { readonly range: Range }
interface FixData { readonly range: Range; readonly text: string }
interface NodeLike { readonly type: string; readonly loc: Location }

export interface RuleMetaDocs {
    readonly category: string
    readonly description: string
    readonly recommended: boolean
    readonly url: string
}

export type SchemaSetting = ArraySchema | (readonly Schema[] & { 0: Schema }) | []

export interface RuleMeta {
    readonly deprecated?: boolean
    readonly docs: RuleMetaDocs
    readonly fixable?: "code" | "whitespace"
    readonly messages?: Readonly<Record<string, string>>
    readonly replacedBy?: readonly string[]
    readonly schema: SchemaSetting
    readonly type: "layout" | "problem" | "suggestion"
}

export interface RuleFixser {
    insertTextAfter(nodeOrToken: HasRange, text: string): FixData
    insertTextAfterRange(range: Range, text: string): FixData
    insertTextBefore(nodeOrToken: HasRange, text: string): FixData
    insertTextBeforeRange(range: Range, text: string): FixData
    remove(nodeOrToken: HasRange): FixData
    removeRange(range: Range): FixData
    replaceText(nodeOrToken: HasRange, text: string): FixData
    replaceTextRange(range: Range, text: string): FixData
}

export type ReportData<TMessageId extends string = string> = (
    // Requires `message` or `messageId`, but not both.
    string extends TMessageId
        // If `TMessageId` was wider than `string`, either.
        ? { readonly message: string } | { readonly messageId: string }
        : ([TMessageId] extends [never]
            // If `TMessageId` was `never`, only `message`.
            ? { readonly message: string }
            // If `TMessageId` was narrower than `string`, only `messageId`.
            : { readonly messageId: TMessageId })
) & (
    // Requires `node` or `loc`.
    | { readonly node: NodeLike }
    | { readonly node?: NodeLike; readonly loc: LineColumn | Location }
) & {
    // Options.
    readonly data?: Record<string, string>
    readonly fix?: (
        fixer: RuleFixser
    ) => FixData | IterableIterator<FixData> | null
}

type OptionType<T extends SchemaSetting> =
    T extends ArraySchema ? SchemaToType<T> :
    T extends readonly Schema[] ? {
        readonly [P in keyof T]: SchemaToType<T[P & number]> | undefined
    } :
    unknown[]

export interface RuleContext<
    AST,
    TMessageId extends string = string,
    TSchema extends SchemaSetting = SchemaSetting
> {
    readonly id: string
    readonly options: OptionType<TSchema>
    readonly settings: Readonly<Record<string, unknown>>
    readonly parserPath: string
    readonly parserOptions: Readonly<Record<string, unknown>>
    readonly parserServices: Readonly<Record<string, unknown>>

    getAncestors(): readonly AST[]
    getDeclaredVariables(node: AST): readonly Variable<AST>[]
    getFilename(): string
    getScope(): ScopeManager<AST>
    getSourceCode(): SourceCode<AST>

    markVariableAsUsed(name: string): void

    report(descriptor: ReportData<TMessageId>): void
}

type CodePathNodeType =
    | "ArrowFunctionExpression"
    | "FunctionDeclaration"
    | "FunctionExpression"
    | "Program"

export type Visitor<AST> = {
    readonly [P in (AST extends { type: string } ? AST["type"] : never)]?: 
        (node: Type<P, AST>) => void
} & {
    readonly onCodePathStart?: (
        codePath: CodePath,
        node: Extract<AST, { type: CodePathNodeType }>
    ) => void
    readonly onCodePathEnd?: (
        codePath: CodePath,
        node: Extract<AST, { type: CodePathNodeType }>
    ) => void
    readonly onCodePathSegmentStart?: (
        segment: CodePathSegment,
        node: AST
    ) => void
    readonly onCodePathSegmentEnd?: (
        segment: CodePathSegment,
        node: AST
    ) => void
    readonly onCodePathSegmentLoop?: (
        fromSegment: CodePathSegment,
        toSegment: CodePathSegment,
        node: AST
    ) => void
} & {
    readonly [selector: string]: any
}

export interface Rule<AST, TMeta extends RuleMeta = RuleMeta> {
    readonly meta: TMeta
    create(
        context: RuleContext<
            AST,
            Extract<keyof TMeta["messages"], string>,
            TMeta["schema"]
        >
    ): Visitor<AST>
}
