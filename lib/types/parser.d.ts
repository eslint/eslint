import { ActualNodeType, ASTDefinition, ExtractNode } from "./ast-definition"
import { ScopeManager } from "./scope"

type Program<TDefinition extends ASTDefinition> =
    ExtractNode<TDefinition, Extract<ActualNodeType<TDefinition>, "Program">>

export interface ParseResult<
    TDefinition extends ASTDefinition,
    TServices = Readonly<Record<string, unknown>>
> {
    ast: Program<TDefinition>
    scopeManager?: ScopeManager<TDefinition>
    services?: TServices
    visitorKeys?: Readonly<Record<string, readonly string[]>>
}

export interface Parser<
    TDefinition extends ASTDefinition,
    TServices = Readonly<Record<string, unknown>>
> {
    parse(options: unknown): Program<TDefinition>
    parseForESLint(options: unknown): ParseResult<TDefinition, TServices>
}
