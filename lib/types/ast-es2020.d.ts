import * as ES2019 from "./ast-es2019"
import * as Def from "./ast-definition"

export * from "./ast-common"

//------------------------------------------------------------------------------
// Definition
//------------------------------------------------------------------------------

export namespace ASTEnhancements {
    export interface BigInt {
        nodes: {
            // Enhancements
            BooleanLiteral: {
                bigint: undefined
            }
            NullLiteral: {
                bigint: undefined
            }
            NumberLiteral: {
                bigint: undefined
            }
            RegExpLiteral: {
                bigint: undefined
            }
            StringLiteral: {
                bigint: undefined
            }

            // New expressions
            BigIntLiteral: {
                type: "Literal"
                value: bigint | null
                bigint: string
                regex: undefined
                raw: string
            }
        }
        expressionType: "BigIntLiteral"
    }

    export interface DynamicImport {
        nodes: {
            // New expressions
            ImportExpression: {
                source: Def.NodeRef<"Expression">
            }
        }
        expressionType: "ImportExpression"
    }
}

export interface ASTDefinition extends Def.Extends<ES2019.ASTDefinition, [
    ASTEnhancements.BigInt,
    ASTEnhancements.DynamicImport,
]> {}

export type AST<
    T extends Def.SpecialType | Def.ActualNodeType<ASTDefinition> = "Node",
    TFilter = any
> =
    Def.ExtractNode<ASTDefinition, T, TFilter>
