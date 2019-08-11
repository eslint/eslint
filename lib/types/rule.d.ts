import { ActualNodeType, ASTDefinition, ExtractNode } from "./ast-definition"
import { HasRange, LineColumn, Location, Range } from "./ast-es2019"
import { CodePath, CodePathSegment } from "./code-path"
import { ArraySchema, Schema, SchemaToType } from "./schema"
import { ScopeManager, Variable } from "./scope"
import { SourceCode } from "./source-code"
import { IsAny, IsNever } from "./utils"

interface FixData { readonly range: Range; readonly text: string }
interface NodeLike { readonly type: string; readonly loc: Location }

/**
 * Documentation of a rule.
 */
export interface RuleMetaDocs {
    /**
     * The category that this rule belongs.
     * A tool will use this information to generate the index page of documentation.
     */
    readonly category: string

    /**
     * The short description of this rule.
     * A tool will use this information to generate the index page of documentation.
     */
    readonly description: string

    /**
     * `true` if the `eslint:recommended` config enabled this rule.
     * A tool will use this information to generate documentation.
     */
    readonly recommended: boolean

    /**
     * The URL to the official documentation of this rule.
     * Some editors show this URL in error messages.
     */
    readonly url: string
}

/**
 * The type of `meta.schema`.
 */
export type RuleMetaSchema =
    | ArraySchema
    // `{ 0: Schema }` is needed to infer the type as a tuple.
    | (readonly Schema[] & { 0: Schema })
    | []

/**
 * The meta data of a rule.
 */
export interface RuleMeta {
    /**
     * `true` if this rule has been deprecated.
     */
    readonly deprecated?: boolean
    /**
     * The document information.
     */
    readonly docs: RuleMetaDocs
    /**
     * The type of autofix.
     */
    readonly fixable?: "code" | "whitespace"
    /**
     * The actual error message of each message ID.
     */
    readonly messages?: Readonly<Record<string, string>>
    /**
     * The rule IDs of the rules has replaced this rule.
     * This property is the pair of `deprecated` property.
     */
    readonly replacedBy?: readonly string[]
    /**
     * The JSON Schema for the options of this rule.
     */
    readonly schema: RuleMetaSchema
    /**
     * The type of rules.
     * - `layout` ... this rule focuses on writing code with a consistent style.
     * - `problem` ... this rule focuses on finding bugs.
     * - `suggestion` ... this rule focuses on suggesting better code.
     */
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
    // Requires either `message` or `messageId`.
    string extends TMessageId
        ? ReportData.Message | ReportData.MessageId<string>
        : (IsNever<TMessageId> extends true
            // If `TMessageId` was `never`, only `message`.
            ? ReportData.Message
            // If `TMessageId` was definite, only `messageId`.
            : ReportData.MessageId<TMessageId>)
) & (
    // Requires either `node` or `loc`. And both can be together.
    | ReportData.NodeOrLoc
    | ReportData.LocOrNode
) & ReportData.Options

export namespace ReportData {
    export type Message = {
        /**
         * The error message to report.
         * Consider to use `messageId` for internationalization.
         */
        readonly message: string
    }
    export type MessageId<T extends string> = {
        /**
         * The ID of the error message to report.
         * The error message is `meta.messages[messageId]`.
         */
        readonly messageId: T
    }
    export type NodeOrLoc = {
        /**
         * The AST node to report.
         * You can omit this property if you gave the `loc` property.
         */
        readonly node: NodeLike
        /**
         * The optional reported location.
         * If you omitted this property, the location will be `node.loc`.
         */
        readonly loc?: LineColumn | Location
    }
    export type LocOrNode = {
        /**
         * The reported location.
         */
        readonly loc: LineColumn | Location
        /**
         * The optional reported node.
         * If you omitted this property, the `nodeType` property in the lint message will be `null`.
         */
        readonly node?: NodeLike
    }
    export type Options = {
        /**
         * The dictionary that the error message refers.
         * If `{{foo}}`-like notation existed in the error message, it will be replaced by `data.foo`. 
         */
        readonly data?: Record<string, string>
        /**
         * The autofix process.
         */
        readonly fix?: (
            fixer: RuleFixser
        ) => FixData | IterableIterator<FixData> | null
    }
}

/**
 * The context object to define rules.
 */
export interface RuleContext<
    TDefinition extends ASTDefinition,
    TMessageId extends string = any,
    TOptions extends readonly any[] = readonly unknown[]
> {
    /**
     * The rule ID.
     */
    readonly id: string

    /**
     * The configured options.
     */
    readonly options: TOptions

    /**
     * The configured shared settings.
     * This is the `settings` property value in config files.
     */
    readonly settings: Readonly<Record<string, unknown>>

    /**
     * The absolute path to the configured parser.
     */
    readonly parserPath: string

    /**
     * The configured parser options.
     * This is the `parserOptions` property value in config files.
     */
    readonly parserOptions: Readonly<Record<string, unknown>>

    /**
     * The services that the parser provided.
     */
    readonly parserServices: Readonly<Record<string, unknown>>

    /**
     * Get the ancestor nodes of the current node.
     * The first element is the root node (probably `Program` node).
     * The last element is the parent node.
     */
    getAncestors(): readonly ExtractNode<TDefinition, "Node">[]

    /**
     * Get the variables that a given node defined.
     * 
     * | `node`                                        | Result                       |
     * |:----------------------------------------------|:-----------------------------|
     * | `VariableDeclaration`                         | declared variables           |
     * | `VariableDeclarator`                          | declared variables           |
     * | `FunctionDeclaration` or `FunctionExpression` | parameters and function name |
     * | `ArrowFunctionExpression`                     | parameters                   |
     * | `ClassDeclaration` or `ClassExpression`       | class name                   |
     * | `CatchClause`                                 | catch binding                |
     * | `ImportDeclaration`                           | declared variables           |
     * | `ImportSpecifier`                             | declared variables           |
     * | otherwise                                     | an empty array               |
     */
    getDeclaredVariables(
        node: ExtractNode<TDefinition, "Node">
    ): readonly Variable<TDefinition>[]

    /**
     * Get the absolute path to the current file.
     * If the current code is not a file's, this returns `<text>` or `<input>`.
     */
    getFilename(): string

    /**
     * Get the scope that the current node belongs.
     */
    getScope(): ScopeManager<TDefinition>

    /**
     * Get the source code object.
     * You can get text, tokens, and comments from the object.
     */
    getSourceCode(): SourceCode<TDefinition>

    /**
     * Mark a variable as used.
     * This affects to `no-unused-vars` rule.
     * @param name the variable name.
     */
    markVariableAsUsed(name: string): void

    /**
     * Report an error.
     * @param descriptor The data to report.
     */
    report(descriptor: ReportData<TMessageId>): void
}

type CodePathNodeType<TDefinition extends ASTDefinition> = Extract<
    ActualNodeType<TDefinition>,
    | "ArrowFunctionExpression"
    | "FunctionDeclaration"
    | "FunctionExpression"
    | "Program"
>

/**
 * The AST visitor.
 */
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

/**
 * Convert JSON Schema to the corresponded types.
 */
export type OptionType<T extends RuleMetaSchema> = readonly unknown[] & (
    IsAny<T> extends true ? unknown :
    [T] extends [ArraySchema] ? SchemaToType<T> :
    [T] extends [readonly Schema[]] ? SchemaArrayToType<T> :
    unknown
)

/**
 * The rule.
 */
export interface Rule<
    TDefinition extends ASTDefinition,
    TMeta extends RuleMeta = RuleMeta
> {
    /**
     * The meta information.
     */
    readonly meta: TMeta

    /**
     * Create the rule handlers.
     * @param context The rule context.
     */
    create(
        context: RuleContext<
            TDefinition,
            Extract<keyof TMeta["messages"], string>,
            OptionType<TMeta["schema"]>
        >
    ): Visitor<TDefinition>
}
