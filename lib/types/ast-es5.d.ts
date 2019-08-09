import { Comment, Token } from "./ast-common"
import * as Def from "./ast-definition"

export * from "./ast-common"

//------------------------------------------------------------------------------
// Definition
//------------------------------------------------------------------------------

export interface ASTDefinition {
    nodes: {
        // Root
        Program: {
            body: Def.NodeRef<"Statement">[]
            comments: Comment[]
            tokens: Token[]
        }

        // Statements
        BlockStatement: {
            body: Def.NodeRef<"Statement">[]
        }
        BreakStatement: {
            label: Def.NodeRef<"Identifier"> | null
        }
        ContinueStatement: {
            label: Def.NodeRef<"Identifier"> | null
        }
        DebuggerStatement: {
        }
        DoWhileStatement: {
            body: Def.NodeRef<"Statement">
            test: Def.NodeRef<"Expression">
        }
        EmptyStatement: {
        }
        ExpressionStatement: {
            expression: Def.NodeRef<"Expression">
        }
        ForInStatement: {
            left:
                | Def.NodeRef<"Identifier">
                | Def.NodeRef<"BasicMemberExpression">
                | Def.NodeRef<"ComputedMemberExpression">
                | Def.NodeRef<"VariableDeclaration">
            right: Def.NodeRef<"Expression">
            body: Def.NodeRef<"Statement">
        }
        ForStatement: {
            init:
                | Def.NodeRef<"VariableDeclaration">
                | Def.NodeRef<"Expression">
                | null
            test: Def.NodeRef<"Expression"> | null
            update: Def.NodeRef<"Expression"> | null
            body: Def.NodeRef<"Statement">
        }
        FunctionDeclaration: {
            id: Def.NodeRef<"Identifier">
            params: Def.NodeRef<"Identifier">[]
            body: Def.NodeRef<"BlockStatement">
        }
        IfStatement: {
            test: Def.NodeRef<"Expression">
            consequent: Def.NodeRef<"Statement">
            alternate: Def.NodeRef<"Statement"> | null
        }
        LabeledStatement: {
            label: Def.NodeRef<"Identifier">
            body: Def.NodeRef<"Statement">
        }
        ReturnStatement: {
            argument: Def.NodeRef<"Expression"> | null
        }
        SwitchStatement: {
            discriminant: Def.NodeRef<"Expression">
            cases: Def.NodeRef<"SwitchCase">[]
        }
        ThrowStatement: {
            argument: Def.NodeRef<"Expression">
        }
        TryStatement: {
            block: Def.NodeRef<"BlockStatement">
            handler: Def.NodeRef<"CatchClause"> | null
            finalizer: Def.NodeRef<"BlockStatement"> | null
        }
        VariableDeclaration: {
            declarations: Def.NodeRef<"VariableDeclarator">[]
        }
        WhileStatement: {
            test: Def.NodeRef<"Expression">
            body: Def.NodeRef<"Statement">
        }
        WithStatement: {
            object: Def.NodeRef<"Expression">
            body: Def.NodeRef<"Statement">
        }

        // Expressions
        ArrayExpression: {
            elements: (Def.NodeRef<"Expression"> | null)[]
        }
        AssignmentExpression: {
            operator:
                | "=" | "+=" | "-=" | "*=" | "/=" | "%="
                | "<<=" | ">>=" | ">>>=" | "|=" | "^=" | "&="
            left:
                | Def.NodeRef<"Identifier">
                | Def.NodeRef<"BasicMemberExpression">
                | Def.NodeRef<"ComputedMemberExpression">
            right: Def.NodeRef<"Expression">
        }
        BinaryExpression: {
            operator: 
                | "==" | "!=" | "===" | "!==" | "<" | "<=" | ">" | ">="
                | "<<" | ">>" | ">>>" | "|" | "^" | "&"
                | "+" | "-" | "*" | "/" | "%"
                | "in" | "instanceof"
            left: Def.NodeRef<"Expression">
            right: Def.NodeRef<"Expression">
        }
        BooleanLiteral: {
            type: "Literal"
            value: boolean
            regex: undefined
            raw: string
        }
        CallExpression: {
            callee: Def.NodeRef<"Expression">
            arguments: Def.NodeRef<"Expression">[]
        }
        ConditionalExpression: {
            test: Def.NodeRef<"Expression">
            alternate: Def.NodeRef<"Expression">
            consequent: Def.NodeRef<"Expression">
        }
        FunctionExpression: {
            id: Def.NodeRef<"Identifier"> | null
            params: Def.NodeRef<"Identifier">[]
            body: Def.NodeRef<"BlockStatement">
        }
        Identifier: {
            name: string
        }
        LogicalExpression: {
            operator: "||" | "&&"
            left: Def.NodeRef<"Expression">
            right: Def.NodeRef<"Expression">
        }
        BasicMemberExpression: {
            type: "MemberExpression"
            computed: false
            object: Def.NodeRef<"Expression">
            property: Def.NodeRef<"Identifier">
        }
        ComputedMemberExpression: {
            type: "MemberExpression"
            computed: true
            object: Def.NodeRef<"Expression">
            property: Def.NodeRef<"Expression">
        }
        NewExpression: {
            callee: Def.NodeRef<"Expression">
            arguments: Def.NodeRef<"Expression">[]
        }
        NullLiteral: {
            type: "Literal"
            value: null
            regex: undefined
            raw: string
        }
        NumberLiteral: {
            type: "Literal"
            value: number
            regex: undefined
            raw: string
        }
        ObjectExpression: {
            properties: (
                | Def.NodeRef<"BasicProperty">
                | Def.NodeRef<"AccessorProperty">
            )[]
        }
        RegExpLiteral: {
            type: "Literal"
            value: RegExp
            regex: { pattern: string; flags: string }
            raw: string
        }
        SequenceExpression: {
            expressions: Def.NodeRef<"Expression">[]
        }
        StringLiteral: {
            type: "Literal"
            value: string
            regex: undefined
            raw: string
        }
        ThisExpression: {
        }
        UnaryExpression: {
            operator: "-" | "+" | "!" | "~" | "typeof" | "void" | "delete"
            prefix: boolean
            argument: Def.NodeRef<"Expression">
        }
        UpdateExpression: {
            operator: "++" | "--"
            argument:
                | Def.NodeRef<"Identifier">
                | Def.NodeRef<"BasicMemberExpression">
                | Def.NodeRef<"ComputedMemberExpression">
            prefix: boolean
        }

        // Others
        CatchClause: {
            param: Def.NodeRef<"Identifier">
            body: Def.NodeRef<"BlockStatement">
        }
        BasicProperty: {
            type: "Property"
            kind: "init"
            key:
                | Def.NodeRef<"Identifier">
                | Def.NodeRef<"NumberLiteral">
                | Def.NodeRef<"StringLiteral">
            value: Def.NodeRef<"Expression">
        }
        AccessorProperty: {
            type: "Property"
            kind: "get" | "set"
            key:
                | Def.NodeRef<"Identifier">
                | Def.NodeRef<"NumberLiteral">
                | Def.NodeRef<"StringLiteral">
            value: Def.NodeRef<"FunctionExpression">
        }
        SwitchCase: {
            test: Def.NodeRef<"Expression"> | null
            consequent: Def.NodeRef<"Statement">[]
        }
        VariableDeclarator: {
            id: Def.NodeRef<"Identifier">
            init: Def.NodeRef<"Expression"> | null
        }
    },

    statementType:
        | "BlockStatement"
        | "BreakStatement"
        | "ContinueStatement"
        | "DebuggerStatement"
        | "DoWhileStatement"
        | "EmptyStatement"
        | "ExpressionStatement"
        | "ForInStatement"
        | "ForStatement"
        | "FunctionDeclaration"
        | "IfStatement"
        | "LabeledStatement"
        | "ReturnStatement"
        | "SwitchStatement"
        | "ThrowStatement"
        | "TryStatement"
        | "VariableDeclaration"
        | "WhileStatement"
        | "WithStatement"

    expressionType:
        | "ArrayExpression"
        | "AssignmentExpression"
        | "BinaryExpression"
        | "BooleanLiteral"
        | "CallExpression"
        | "ConditionalExpression"
        | "FunctionExpression"
        | "Identifier"
        | "LogicalExpression"
        | "BasicMemberExpression"
        | "ComputedMemberExpression"
        | "NewExpression"
        | "NullLiteral"
        | "NumberLiteral"
        | "ObjectExpression"
        | "RegExpLiteral"
        | "SequenceExpression"
        | "StringLiteral"
        | "ThisExpression"
        | "UnaryExpression"
        | "UpdateExpression"
}

export type AST<
    T extends Def.SpecialType | Def.ActualNodeType<ASTDefinition> = "Node",
    TFilter = any
> =
    Def.ExtractNode<ASTDefinition, T, TFilter>
