import { Def, ES2019 } from "../../types/ast"
import { Rule, RuleContext as RuleContextBase, RuleMeta } from "../../types/rule"
import { Schema } from "../../types/schema"
import * as scope from "../../types/scope"
import * as source from "../../types/source-code"

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

export type ScopeManager = scope.ScopeManager<ASTDef>
export type Scope = scope.Scope<ASTDef>
export type Variable = scope.Variable<ASTDef>
export type Reference = scope.Reference<ASTDef>
export type VariableDefinition = scope.Definition<ASTDef>

export type SourceCode = source.SourceCode<ASTDef>

export type RuleContext<
    TMessageId extends string = any,
    TOptions extends readonly any[] = readonly unknown[]
> = RuleContextBase<ASTDef, TMessageId, TOptions>

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
    rule: Rule<ASTDef, TMeta>
): Rule<ASTDef, TMeta>
