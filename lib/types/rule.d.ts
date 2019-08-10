import { ActualNodeType, ASTDefinition, ExtractNode } from "./ast-definition"
import { HasRange, LineColumn, Location, Range } from "./ast-es2019"
import { CodePath, CodePathSegment } from "./code-path"
import { ArraySchema, Schema, SchemaToType } from "./schema"
import { ScopeManager, Variable } from "./scope"
import { SourceCode } from "./source-code"
import { IsAny } from "./utils"

interface FixData { readonly range: Range; readonly text: string }
interface NodeLike { readonly type: string; readonly loc: Location }

export interface RuleMetaDocs {
    readonly category: string
    readonly description: string
    readonly recommended: boolean
    readonly url: string
}

export type SchemaSetting =
    | ArraySchema
    | (readonly Schema[] & { 0: Schema })
    | []

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

export interface RuleContext<
    TDefinition extends ASTDefinition,
    TMessageId extends string = any,
    TOptions extends readonly any[] = readonly unknown[]
> {
    readonly id: string
    readonly options: TOptions
    readonly settings: Readonly<Record<string, unknown>>
    readonly parserPath: string
    readonly parserOptions: Readonly<Record<string, unknown>>
    readonly parserServices: Readonly<Record<string, unknown>>

    getAncestors(): readonly ExtractNode<TDefinition, "Node">[]
    getDeclaredVariables(
        node: ExtractNode<TDefinition, "Node">
    ): readonly Variable<TDefinition>[]
    getFilename(): string
    getScope(): ScopeManager<TDefinition>
    getSourceCode(): SourceCode<TDefinition>

    markVariableAsUsed(name: string): void

    report(descriptor: ReportData<TMessageId>): void
}

type CodePathNodeType<TDefinition extends ASTDefinition> = Extract<
    ActualNodeType<TDefinition>,
    | "ArrowFunctionExpression"
    | "FunctionDeclaration"
    | "FunctionExpression"
    | "Program"
>

export type Visitor<TDefinition extends ASTDefinition> = {
    readonly [P in ActualNodeType<TDefinition>]?: 
        (node: ExtractNode<TDefinition, P>) => void
} & {
    readonly onCodePathStart?: (
        codePath: CodePath,
        node: ExtractNode<TDefinition, CodePathNodeType<TDefinition>>
    ) => void
    readonly onCodePathEnd?: (
        codePath: CodePath,
        node: ExtractNode<TDefinition, CodePathNodeType<TDefinition>>
    ) => void
    readonly onCodePathSegmentStart?: (
        segment: CodePathSegment,
        node: ExtractNode<TDefinition, "Node">
    ) => void
    readonly onCodePathSegmentEnd?: (
        segment: CodePathSegment,
        node: ExtractNode<TDefinition, "Node">
    ) => void
    readonly onCodePathSegmentLoop?: (
        fromSegment: CodePathSegment,
        toSegment: CodePathSegment,
        node: ExtractNode<TDefinition, "Node">
    ) => void
} & {
    readonly [selector: string]: any
}

type SchemaArrayToType<T extends readonly Schema[]> = {
    readonly [P in keyof T]: T[P] extends Schema ? SchemaToType<T[P]> : T[P]
}

export type OptionType<T extends SchemaSetting> = readonly unknown[] & (
    IsAny<T> extends true ? unknown :
    [T] extends [ArraySchema] ? SchemaToType<T> :
    [T] extends [readonly Schema[]] ? SchemaArrayToType<T> :
    unknown
)

export interface Rule<
    TDefinition extends ASTDefinition,
    TMeta extends RuleMeta = RuleMeta
> {
    readonly meta: TMeta
    create(
        context: RuleContext<
            TDefinition,
            Extract<keyof TMeta["messages"], string>,
            OptionType<TMeta["schema"]>
        >
    ): Visitor<TDefinition>
}
