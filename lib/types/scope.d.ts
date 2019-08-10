import { ActualNodeType, ASTDefinition, ExtractNode } from "./ast-definition"

type Node<TDefinition extends ASTDefinition, TType extends keyof any> =
    ExtractNode<TDefinition, Extract<ActualNodeType<TDefinition>, TType>>

interface _Definition<
    TDefinition extends ASTDefinition,
    TType extends string,
    TNode extends string,
    TParent extends string | null = null
> {
    readonly type: TType
    readonly name: Node<TDefinition, "Identifier">
    readonly node: Node<TDefinition, TNode>
    readonly parent:
        TParent extends string ? Node<TDefinition, TParent> : null
}

export interface CatchClauseDefinition<
    TDefinition extends ASTDefinition
> extends _Definition<TDefinition, "CatchClause", "CatchClause"> {}

export interface ClassNameDefinition<
    TDefinition extends ASTDefinition
> extends _Definition<
    TDefinition,
    "ClassName",
    "ClassDeclaration" | "ClassExpression"
> {}

export interface FunctionNameDefinition<
    TDefinition extends ASTDefinition
> extends _Definition<
    TDefinition,
    "FunctionName",
    "FunctionDeclaration" | "FunctionExpression"
> {}

export interface ImportBindingDefinition<
    TDefinition extends ASTDefinition
> extends _Definition<
    TDefinition,
    "ImportBinding",
    "ImportSpecifier"
        | "ImportDefaultSpecifier"
        | "ImportNamespaceSpecifier",
    "ImportDeclaration"
> {}

export interface ParameterDefinition<
    TDefinition extends ASTDefinition
> extends _Definition<
    TDefinition,
    "Parameter",
    "ArrowFunctionExpression" | "FunctionDeclaration" | "FunctionExpression"
> {}

export interface VariableDefinition<
    TDefinition extends ASTDefinition
> extends _Definition<
    TDefinition,
    "Variable",
    "VariableDeclarator",
    "VariableDeclaration"
> {}

export type Definition<TDefinition extends ASTDefinition> =
    | CatchClauseDefinition<TDefinition>
    | ClassNameDefinition<TDefinition>
    | FunctionNameDefinition<TDefinition>
    | ImportBindingDefinition<TDefinition>
    | ParameterDefinition<TDefinition>
    | VariableDefinition<TDefinition>

export interface Reference<TDefinition extends ASTDefinition> {
    readonly identifier: Node<TDefinition, "Identifier">
    readonly from: Scope<TDefinition>
    readonly resolved: Variable<TDefinition> | null
    readonly writeExpr: ExtractNode<TDefinition, "Node"> | null
    readonly init: boolean
    isWrite(): boolean
    isRead(): boolean
    isWriteOnly(): boolean
    isReadOnly(): boolean
    isReadWrite(): boolean
}

export interface Variable<TDefinition extends ASTDefinition> {
    readonly name: string
    readonly defs: readonly Definition<TDefinition>[]
    readonly references: readonly Reference<TDefinition>[]
}

interface _Scope<
    TDefinition extends ASTDefinition,
    TType extends string,
    TBlock extends string
> {
    readonly type: TType
    readonly isStrict: boolean
    readonly upper: Scope<TDefinition> | null
    readonly childScopes: readonly Scope<TDefinition>[]
    readonly variableScope: Scope<TDefinition>
    readonly block: Node<TDefinition, TBlock>
    readonly variables: readonly Variable<TDefinition>[]
    readonly set: ReadonlyMap<string, Variable<TDefinition>>
    readonly references: readonly Reference<TDefinition>[]
    readonly through: readonly Reference<TDefinition>[]
}

export interface BlockScope<
    TDefinition extends ASTDefinition
> extends _Scope<TDefinition, "block", "BlockStatement"> {}

export interface CatchScope<
    TDefinition extends ASTDefinition
> extends _Scope<TDefinition, "catch", "CatchClause"> {}

export interface ClassScope<
    TDefinition extends ASTDefinition
> extends _Scope<TDefinition, "class", "ClassDeclaration" | "ClassExpression"> {
}

export interface ForScope<
    TDefinition extends ASTDefinition
> extends _Scope<
    TDefinition,
    "for",
    "ForInStatement" | "ForOfStatement" | "ForStatement"
> {}

export interface FunctionScope<
    TDefinition extends ASTDefinition
> extends _Scope<
    TDefinition,
    "function",
    "ArrowFunctionExpression" | "FunctionDeclaration" | "FunctionExpression"
> {}

export interface FunctionExpressionNameScope<
    TDefinition extends ASTDefinition
> extends _Scope<
    TDefinition,
    "function-expression-name",
    "FunctionExpression"
> {}

export interface GlobalScope<
    TDefinition extends ASTDefinition
> extends _Scope<TDefinition, "global", "Program"> {}

export interface ModuleScope<
    TDefinition extends ASTDefinition
> extends _Scope<TDefinition, "module", "Program"> {}

export interface SwitchScope<
    TDefinition extends ASTDefinition
> extends _Scope<TDefinition, "switch", "SwitchStatement"> {}

export interface WithScope<
    TDefinition extends ASTDefinition
> extends _Scope<TDefinition, "with", "WithStatement"> {}

export type Scope<TDefinition extends ASTDefinition> =
    | BlockScope<TDefinition>
    | CatchScope<TDefinition>
    | ClassScope<TDefinition>
    | ForScope<TDefinition>
    | FunctionScope<TDefinition>
    | FunctionExpressionNameScope<TDefinition>
    | GlobalScope<TDefinition>
    | ModuleScope<TDefinition>
    | SwitchScope<TDefinition>
    | WithScope<TDefinition>

export interface ScopeManager<TDefinition extends ASTDefinition> {
    readonly scopes: readonly Scope<TDefinition>[]
    readonly globalScope: GlobalScope<TDefinition>
}
