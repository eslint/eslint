import * as es2016 from "./ast-es2016"
import * as Def from "./ast-definition"

export * from "./ast-common"

//------------------------------------------------------------------------------
// Definition
//------------------------------------------------------------------------------

export namespace ASTEnhancements {
    export interface AsyncFunction {
        nodes: {
            // Enhancements
            AnonymousDefaultExportedFunctionDeclaration: {
                async: boolean
            }
            ArrowFunctionExpression: {
                async: boolean
            }
            FunctionDeclaration: {
                async: boolean
            }
            FunctionExpression: {
                async: boolean
            }

            // Expressions
            AwaitExpression: {
                argument: Def.NodeRef<"Expression">
            }
        }

        expressionType: "AwaitExpression"
    }
}

export interface ASTDefinition extends Def.Extends<
    es2016.ASTDefinition,
    ASTEnhancements.AsyncFunction
> {}

export type AST<
    T extends Def.SpecialType | Def.ActualNodeType<ASTDefinition> = "Node",
    TFilter = any
> =
    Def.ExtractNode<ASTDefinition, T, TFilter>
