import * as es2018 from "./ast-es2018"
import * as Def from "./ast-definition"

export * from "./ast-common"

//------------------------------------------------------------------------------
// Definition
//------------------------------------------------------------------------------

export namespace ASTEnhancements {
    export interface CatchBindingOmission {
        nodes: {
            // Enhancements
            CatchClause: {
                param: null
            }
        }
    }
}

export interface ASTDefinition extends Def.Extends<es2018.ASTDefinition, [
    ASTEnhancements.CatchBindingOmission,
]> {}

export type AST<
    T extends Def.SpecialType | Def.ActualNodeType<ASTDefinition> = "Node",
    TFilter = any
> =
    Def.ExtractNode<ASTDefinition, T, TFilter>
