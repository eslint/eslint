import * as es2015 from "./ast-es2015"
import * as Def from "./ast-definition"

export * from "./ast-common"

//------------------------------------------------------------------------------
// Definition
//------------------------------------------------------------------------------

export namespace ASTEnhancements {
    export interface ExponentialOperator {
        nodes: {
            AssignmentExpression: {
                operator: "**="
            }
            BinaryExpression: {
                operator: "**"
            }
        }
    }

    export interface BindingRestEnhancement {
        nodes: {
            BindingRestElement: {
                argument:
                    | Def.NodeRef<"BindingArrayPattern">
                    | Def.NodeRef<"BindingObjectPattern">
            }
        }
    }
}

export interface ASTDefinition extends Def.Extends<es2015.ASTDefinition, [
    ASTEnhancements.BindingRestEnhancement,
    ASTEnhancements.ExponentialOperator,
]> {}

export type AST<
    T extends Def.SpecialType | Def.ActualNodeType<ASTDefinition> = "Node",
    TFilter = any
> =
    Def.ExtractNode<ASTDefinition, T, TFilter>
