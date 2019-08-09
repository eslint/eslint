import { Comment, Range, Token, LineColumn } from "./ast-common"
import { ScopeManager } from "./scope"

type Type<T extends string, AST> = Extract<AST, { type: T }>

export interface HasRange { readonly range: Range }

export type SkipOptions = number | ((token: Token) => boolean) | {
    includeComments?: boolean
    filter?: (token: Token) => boolean
    skip?: number
}
export type CountOptions = number | ((token: Token) => boolean) | {
    includeComments?: boolean
    filter?: (token: Token) => boolean
    count?: number
}

export interface SourceCode<AST> {
    readonly hasBOM: boolean
    readonly text: string
    readonly lines: readonly string[]
    readonly tokensAndComments: readonly Token[]

    readonly ast: Type<"Program", AST>
    readonly parserServices: Record<string, unknown>
    readonly scopeManager: ScopeManager<AST>
    readonly visitorKeys: Record<string, string[]>

    getText(nodeOrToken?: HasRange): string
    getLines(): readonly string[]
    getAllComments(): readonly Comment[]
    getNodeByRangeIndex(index: number): AST | null
    isSpaceBetweenTokens(first: HasRange, second: HasRange): boolean
    getLocFromIndex(index: number): LineColumn
    getIndexFromLoc(loc: LineColumn): number

    /**
     * Gets the token starting at the specified index.
     * @param offset - Index of the start of the token's range.
     * @param options - The option object.
     * @returns The token starting at index, or null if no such token.
     */
    getTokenByRangeStart(offset: number, options?: { includeComments: boolean }): Token | null

    /**
     * Gets the first token of the given node.
     * @param node - The AST node.
     * @param options - The option object.
     * @returns An object representing the token.
     */
    getFirstToken(node: HasRange, options: SkipOptions): Token | null
    getFirstToken(node: HasRange): Token

    /**
     * Gets the last token of the given node.
     * @param node - The AST node.
     * @param options - The option object.
     * @returns An object representing the token.
     */
    getLastToken(node: HasRange, options: SkipOptions): Token | null
    getLastToken(node: HasRange): Token

    /**
     * Gets the token that precedes a given node or token.
     * @param node - The AST node or token.
     * @param options - The option object.
     * @returns An object representing the token.
     */
    getTokenBefore(node: HasRange, options?: SkipOptions): Token | null

    /**
     * Gets the token that follows a given node or token.
     * @param node - The AST node or token.
     * @param options - The option object.
     * @returns An object representing the token.
     */
    getTokenAfter(node: HasRange, options?: SkipOptions): Token | null

    /**
     * Gets the first token between two non-overlapping nodes.
     * @param left - Node before the desired token range.
     * @param right - Node after the desired token range.
     * @param options - The option object.
     * @returns An object representing the token.
     */
    getFirstTokenBetween(left: HasRange, right: HasRange, options?: SkipOptions): Token | null

    /**
     * Gets the last token between two non-overlapping nodes.
     * @param left Node before the desired token range.
     * @param right Node after the desired token range.
     * @param options - The option object.
     * @returns An object representing the token.
     */
    getLastTokenBetween(left: HasRange, right: HasRange, options?: SkipOptions): Token | null

    /**
     * Gets the token that precedes a given node or token in the token stream.
     * This is defined for backward compatibility. Use `includeComments` option instead.
     * TODO: We have a plan to remove this in a future major version.
     * @param node The AST node or token.
     * @param skip A number of tokens to skip.
     * @returns An object representing the token.
     * @deprecated
     */
    getTokenOrCommentBefore(node: HasRange, skip?: number): Token | null

    /**
     * Gets the token that follows a given node or token in the token stream.
     * This is defined for backward compatibility. Use `includeComments` option instead.
     * TODO: We have a plan to remove this in a future major version.
     * @param node The AST node or token.
     * @param skip A number of tokens to skip.
     * @returns An object representing the token.
     * @deprecated
     */
    getTokenOrCommentAfter(node: HasRange, skip?: number): Token | null

    //--------------------------------------------------------------------------
    // Gets multiple tokens.
    //--------------------------------------------------------------------------

    /**
     * Gets the first `count` tokens of the given node.
     * @param node - The AST node.
     * @param [options=0] - The option object. If this is a number then it's `options.count`. If this is a function then it's `options.filter`.
     * @param [options.includeComments=false] - The flag to iterate comments as well.
     * @param [options.filter=null] - The predicate function to choose tokens.
     * @param [options.count=0] - The maximum count of tokens the cursor iterates.
     * @returns Tokens.
     */
    getFirstTokens(node: HasRange, options?: CountOptions): Token[]

    /**
     * Gets the last `count` tokens of the given node.
     * @param node - The AST node.
     * @param [options=0] - The option object. Same options as getFirstTokens()
     * @returns Tokens.
     */
    getLastTokens(node: HasRange, options?: CountOptions): Token[]

    /**
     * Gets the `count` tokens that precedes a given node or token.
     * @param node - The AST node or token.
     * @param [options=0] - The option object. Same options as getFirstTokens()
     * @returns Tokens.
     */
    getTokensBefore(node: HasRange, options?: CountOptions): Token[]

    /**
     * Gets the `count` tokens that follows a given node or token.
     * @param node - The AST node or token.
     * @param [options=0] - The option object. Same options as getFirstTokens()
     * @returns Tokens.
     */
    getTokensAfter(node: HasRange, options?: CountOptions): Token[]

    /**
     * Gets the first `count` tokens between two non-overlapping nodes.
     * @param left - Node before the desired token range.
     * @param right - Node after the desired token range.
     * @param [options=0] - The option object. Same options as getFirstTokens()
     * @returns Tokens between left and right.
     */
    getFirstTokensBetween(left: HasRange, right: HasRange, options?: CountOptions): Token[]

    /**
     * Gets the last `count` tokens between two non-overlapping nodes.
     * @param left Node before the desired token range.
     * @param right Node after the desired token range.
     * @param [options=0] - The option object. Same options as getFirstTokens()
     * @returns Tokens between left and right.
     */
    getLastTokensBetween(left: HasRange, right: HasRange, options?: CountOptions): Token[]

    /**
     * Gets all tokens that are related to the given node.
     * @param node - The AST node.
     * @param beforeCount - The number of tokens before the node to retrieve.
     * @param afterCount - The number of tokens after the node to retrieve.
     * @returns Array of objects representing tokens.
     */
    getTokens(node: HasRange, beforeCount?: CountOptions, afterCount?: number): Token[]

    /**
     * Gets all of the tokens between two non-overlapping nodes.
     * @param left Node before the desired token range.
     * @param right Node after the desired token range.
     * @param padding Number of extra tokens on either side of center.
     * @returns Tokens between left and right.
     */
    getTokensBetween(left: HasRange, right: HasRange, padding?: CountOptions): Token[]

    //--------------------------------------------------------------------------
    // Others.
    //--------------------------------------------------------------------------

    /**
     * Checks whether any comments exist or not between the given 2 nodes.
     *
     * @param left - The node to check.
     * @param right - The node to check.
     * @returns `true` if one or more comments exist.
     */
    commentsExistBetween(left: HasRange, right: HasRange): boolean

    /**
     * Gets all comment tokens directly before the given node or token.
     * @param nodeOrToken The AST node or token to check for adjacent comment tokens.
     * @returns An array of comments in occurrence order.
     */
    getCommentsBefore(nodeOrToken: HasRange): Comment[]

    /**
     * Gets all comment tokens directly after the given node or token.
     * @param nodeOrToken The AST node or token to check for adjacent comment tokens.
     * @returns An array of comments in occurrence order.
     */
    getCommentsAfter(nodeOrToken: HasRange): Comment[]

    /**
     * Gets all comment tokens inside the given node.
     * @param node The AST node to get the comments for.
     * @returns An array of comments in occurrence order.
     */
    getCommentsInside(node: HasRange): Comment[]

    /**
     * @param node The AST node to get JSDoc comment.
     * @returns The found JSDoc comment token.
     * @deprecated
     */
    getJSDocComment(node: HasRange): Comment | null
}
