import { Def, ES2019 } from "../../types/ast"
import { Rule, RuleContext as RuleContextBase, RuleMeta } from "../../types/rule"
import { Schema } from "../../types/schema"
import * as scope from "../../types/scope"
import { SourceCode as SourceCodeBase } from "../../types/source-code"

export * from "../../types/ast-common"
export * from "../../types/code-path"

// This is interface because I want tsc to show the type name instead of the
// inside of the type in error messages.
interface ASTDef extends Def.Extends<
    ES2019.ASTDefinition,
    // Enhancement AST if needed.
    {
        nodes: {}
    }
> {}

export type AST<
    TType extends Def.SpecialType | Def.ActualNodeType<ASTDef> = "Node",
    TFilter = any
> =
    Def.ExtractNode<ASTDef, TType, TFilter>

export interface ScopeManager extends scope.ScopeManager<AST> {}
export type Scope = scope.Scope<AST>
export interface Variable extends scope.Variable<AST> {}
export interface Reference extends scope.Reference<AST> {}
export type VariableDefinition = scope.Definition<AST>

export interface RuleContext extends RuleContextBase<AST, any, any> {}
export interface SourceCode extends SourceCodeBase<AST> {}

/**
 * This is to infer the types of
 * - options; this parses JSON Schema then makes the proper type of options.
 * - message IDs.
 * - rule context.
 * - handlers; E.g. the `node` in `{ Identifier(node) {} }` is inferrence as `Identifier` type.
 *
 * @param rule The rule definition.
 */
export declare function rule<TMeta extends RuleMeta>(
    rule: Rule<AST, TMeta>
): Rule<AST, TMeta>
