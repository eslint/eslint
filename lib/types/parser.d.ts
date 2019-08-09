import { ScopeManager } from "./scope"

type Type<T extends string, AST> = Extract<AST, { type: T }>

export interface ParseResult<AST, TServices = Record<string, unknown>> {
    ast: Type<"Program", AST>
    scopeManager?: ScopeManager<AST>
    services?: TServices
    visitorKeys?: Record<string, string[]>
}

export interface Parser<AST, TServices = Record<string, unknown>> {
    parse(options: unknown): Type<"Program", AST>
    parseForESLint(options: unknown): ParseResult<AST, TServices>
}
