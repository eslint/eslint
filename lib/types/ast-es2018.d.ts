import * as es2017 from "./ast-es2017"
import * as Def from "./ast-definition"

export * from "./ast-common"

//------------------------------------------------------------------------------
// Definition
//------------------------------------------------------------------------------

export namespace ASTEnhancements {
    export interface AsyncIteration {
        nodes: {
            // Enhancements
            ForOfStatement: {
                await: boolean
            }
        }
    }
    
    export interface ObjectRestSpread {
        nodes: {
            // Enhancements
            AssignmentObjectPattern: {
                properties: Def.NodeRef<"AssignmentRestElement">[]
            }
            BindingObjectPattern: {
                properties: Def.NodeRef<"BindingRestElement">[]
            }
            ObjectExpression: {
                properties: Def.NodeRef<"SpreadElement">[]
            }
        }
    }
    
    export interface MalformedTaggedTemplate {
        nodes: {
            // Enhancements
            TemplateElement: {
                value: { cooked: string | null; raw: string }
            }
        }
    }
}

export interface ASTDefinition extends Def.Extends<es2017.ASTDefinition, [
    ASTEnhancements.AsyncIteration,
    ASTEnhancements.ObjectRestSpread,
    ASTEnhancements.MalformedTaggedTemplate,
]> {}

export type AST<
    T extends Def.SpecialType | Def.ActualNodeType<ASTDefinition> = "Node",
    TFilter = any
> =
    Def.ExtractNode<ASTDefinition, T, TFilter>
