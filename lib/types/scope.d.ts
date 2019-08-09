type Type<T extends string, AST> = Extract<AST, { type: T }>

type _Definition<AST, TType extends string, TNode extends string, TParent extends string | null = null> = {
    readonly type: TType
    readonly name: Type<"Identifier", AST>
    readonly node: Type<TNode, AST>
    readonly parent: TParent extends string ? Type<TParent, AST> : null
}

export interface CatchClauseDefinition<AST> extends _Definition<AST, "CatchClause", "CatchClause"> {}
export interface ClassNameDefinition<AST> extends _Definition<AST, "ClassName", "ClassDeclaration" | "ClassExpression"> {}
export interface FunctionNameDefinition<AST> extends _Definition<AST, "FunctionName", "FunctionDeclaration" | "FunctionExpression"> {}
export interface ImportBindingDefinition<AST> extends _Definition<AST, "ImportBinding", "ImportSpecifier" | "ImportDefaultSpecifier" | "ImportNamespaceSpecifier", "ImportDeclaration"> {}
export interface ParameterDefinition<AST> extends _Definition<AST, "Parameter", "ArrowFunctionExpression" | "FunctionDeclaration" | "FunctionExpression"> {}
export interface VariableDefinition<AST> extends _Definition<AST, "Variable", "VariableDeclarator", "VariableDeclaration"> {}

export type Definition<AST> =
    | CatchClauseDefinition<AST>
    | ClassNameDefinition<AST>
    | FunctionNameDefinition<AST>
    | ImportBindingDefinition<AST>
    | ParameterDefinition<AST>
    | VariableDefinition<AST>

export interface Reference<AST> {
    readonly identifier: Type<"Identifier", AST>
    readonly from: Scope<AST>
    readonly resolved: Variable<AST> | null
    readonly writeExpr: AST | null
    readonly init: boolean
    isWrite(): boolean
    isRead(): boolean
    isWriteOnly(): boolean
    isReadOnly(): boolean
    isReadWrite(): boolean
}

export interface Variable<AST> {
    readonly name: string
    readonly defs: readonly Definition<AST>[]
    readonly references: readonly Reference<AST>[]
}

type _Scope<AST, TType extends string, TBlock extends string> = {
    readonly type: TType
    readonly isStrict: boolean
    readonly upper: Scope<AST> | null
    readonly childScopes: readonly Scope<AST>[]
    readonly variableScope: Scope<AST>
    readonly block: Type<TBlock, AST>
    readonly variables: readonly Variable<AST>[]
    readonly set: ReadonlyMap<string, Variable<AST>>
    readonly references: readonly Reference<AST>[]
    readonly through: readonly Reference<AST>[]
}

export interface BlockScope<AST> extends _Scope<AST, "block", "BlockStatement"> {}
export interface CatchScope<AST> extends _Scope<AST, "catch", "CatchClause"> {}
export interface ClassScope<AST> extends _Scope<AST, "class", "ClassDeclaration" | "ClassExpression"> {}
export interface ForScope<AST> extends _Scope<AST, "for", "ForInStatement" | "ForOfStatement" | "ForStatement"> {}
export interface FunctionScope<AST> extends _Scope<AST, "function", "ArrowFunctionExpression" | "FunctionDeclaration" | "FunctionExpression"> {}
export interface FunctionExpressionNameScope<AST> extends _Scope<AST, "function-expression-name", "FunctionExpression"> {}
export interface GlobalScope<AST> extends _Scope<AST, "global", "Program"> {}
export interface ModuleScope<AST> extends _Scope<AST, "module", "Program"> {}
export interface SwitchScope<AST> extends _Scope<AST, "switch", "SwitchStatement"> {}
export interface WithScope<AST> extends _Scope<AST, "with", "WithStatement"> {}

export type Scope<AST> =
    | BlockScope<AST>
    | CatchScope<AST>
    | ClassScope<AST>
    | ForScope<AST>
    | FunctionScope<AST>
    | FunctionExpressionNameScope<AST>
    | GlobalScope<AST>
    | ModuleScope<AST>
    | SwitchScope<AST>
    | WithScope<AST>

export interface ScopeManager<AST> {
    readonly scopes: readonly Scope<AST>[]
    readonly globalScope: Type<"global", Scope<AST>>
}
