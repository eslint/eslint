import { Comment, Token } from "./ast-common"
import * as es5 from "./ast-es5"
import * as Def from "./ast-definition"

export * from "./ast-common"

//------------------------------------------------------------------------------
// Definition
//------------------------------------------------------------------------------

export namespace ASTEnhancements {
    export interface ArrowFunction {
        nodes: {
            // New expressions
            ArrowFunctionExpression: {
                id: Def.NodeRef<"Identifier"> | null
                params: (
                    | Def.NodeRef<"BindingArrayPattern">
                    | Def.NodeRef<"BindingAssignmentPattern">
                    | Def.NodeRef<"BindingObjectPattern">
                    | Def.NodeRef<"BindingRestElement">
                    | Def.NodeRef<"Identifier">
                )[]
                body:
                    | Def.NodeRef<"BlockStatement">
                    | Def.NodeRef<"Expression">
            }
        },
        expressionType: "ArrowFunctionExpression"
    }

    export interface Class {
        nodes: {
            // Enhancements
            CallExpression: {
                callee: Def.NodeRef<"Super">
            }
            BasicMemberExpression: {
                object: Def.NodeRef<"Super">
            }
            ComputedMemberExpression: {
                object: Def.NodeRef<"Super">
            }

            // New statements
            ClassDeclaration: {
                id: Def.NodeRef<"Identifier">
                superClass: Def.NodeRef<"Expression"> | null
                body: Def.NodeRef<"ClassBody">
            }

            // New expressions
            ClassExpression: {
                id: Def.NodeRef<"Identifier"> | null
                superClass: Def.NodeRef<"Expression"> | null
                body: Def.NodeRef<"ClassBody">
            }
            MetaProperty: {
                meta: Def.NodeRef<"Identifier">
                property: Def.NodeRef<"Identifier">
            }

            // New others
            ClassBody: {
                body: (
                    | Def.NodeRef<"ComputedMethodDefinition">
                    | Def.NodeRef<"ConstructorDefinition">
                    | Def.NodeRef<"MethodDefinition">
                )[]
            }
            MethodDefinition: {
                computed: false
                kind: "method" | "get" | "set"
                static: boolean
                key:
                    | Def.NodeRef<"Identifier">
                    | Def.NodeRef<"NumberLiteral">
                    | Def.NodeRef<"StringLiteral">
                value: Def.NodeRef<"FunctionExpression">
            }
            ConstructorDefinition: {
                type: "MethodDefinition"
                computed: false
                kind: "constructor"
                static: false
                key: Def.NodeRef<"Identifier"> | Def.NodeRef<"StringLiteral">
                value: Def.NodeRef<"FunctionExpression">
            }
            ComputedMethodDefinition: {
                type: "MethodDefinition"
                computed: true
                kind: "method" | "get" | "set"
                static: boolean
                key: Def.NodeRef<"Expression">
                value: Def.NodeRef<"FunctionExpression">
            }
            Super: {}
        }
        statementType: "ClassDeclaration"
        expressionType: "ClassExpression" | "MetaProperty"
    }

    interface DestructuringAssignment {
        nodes: {
            // Enhancements
            ForInStatement: {
                left:
                    | Def.NodeRef<"AssignmentArrayPattern">
                    | Def.NodeRef<"AssignmentObjectPattern">
            }
            AssignmentExpression: {
                left:
                    | Def.NodeRef<"AssignmentArrayPattern">
                    | Def.NodeRef<"AssignmentObjectPattern">
            }

            // New others
            AssignmentArrayPattern: {
                type: "ArrayPattern"
                elements: (
                    | Def.NodeRef<"AssignmentArrayPattern">
                    | Def.NodeRef<"AssignmentAssignmentPattern">
                    | Def.NodeRef<"AssignmentObjectPattern">
                    | Def.NodeRef<"AssignmentRestElement">
                    | Def.NodeRef<"BasicMemberExpression">
                    | Def.NodeRef<"ComputedMemberExpression">
                    | Def.NodeRef<"Identifier">
                    | null
                )[]
            }
            AssignmentAssignmentPattern: {
                type: "AssignmentPattern"
                left:
                    | Def.NodeRef<"AssignmentArrayPattern">
                    | Def.NodeRef<"AssignmentObjectPattern">
                    | Def.NodeRef<"BasicMemberExpression">
                    | Def.NodeRef<"ComputedMemberExpression">
                    | Def.NodeRef<"Identifier">
                right: Def.NodeRef<"Expression">
            }
            AssignmentProperty: {
                type: "Property"
                kind: "init"
                computed: false
                method: false
                shorthand: false
                key:
                    | Def.NodeRef<"Identifier">
                    | Def.NodeRef<"NumberLiteral">
                    | Def.NodeRef<"StringLiteral">
                value:
                    | Def.NodeRef<"AssignmentArrayPattern">
                    | Def.NodeRef<"AssignmentAssignmentPattern">
                    | Def.NodeRef<"AssignmentObjectPattern">
                    | Def.NodeRef<"Identifier">
                    | Def.NodeRef<"BasicMemberExpression">
                    | Def.NodeRef<"ComputedMemberExpression">
            }
            AssignmentShorthandProperty: {
                type: "Property"
                kind: "init"
                computed: false
                method: false
                shorthand: true
                key: Def.NodeRef<"Identifier">
                value: Def.NodeRef<"Identifier">
            }
            AssignmentComputedProperty: {
                type: "Property"
                kind: "init"
                computed: true
                method: false
                shorthand: false
                key: Def.NodeRef<"Expression">
                value:
                    | Def.NodeRef<"AssignmentArrayPattern">
                    | Def.NodeRef<"AssignmentAssignmentPattern">
                    | Def.NodeRef<"AssignmentObjectPattern">
                    | Def.NodeRef<"Identifier">
                    | Def.NodeRef<"BasicMemberExpression">
                    | Def.NodeRef<"ComputedMemberExpression">
            }
            AssignmentObjectPattern: {
                type: "ObjectPattern"
                properties: (
                    | Def.NodeRef<"AssignmentComputedProperty">
                    | Def.NodeRef<"AssignmentProperty">
                    | Def.NodeRef<"AssignmentShorthandProperty">
                )[]
            }
            AssignmentRestElement: {
                type: "RestElement"
                argument:
                    | Def.NodeRef<"AssignmentArrayPattern">
                    | Def.NodeRef<"AssignmentObjectPattern">
                    | Def.NodeRef<"Identifier">
                    | Def.NodeRef<"BasicMemberExpression">
                    | Def.NodeRef<"ComputedMemberExpression">
            }
        }
    }
    
    interface DestructuringBinding {
        nodes: {
            // Enhancements
            CatchClause: {
                param:
                    | Def.NodeRef<"BindingArrayPattern">
                    | Def.NodeRef<"BindingObjectPattern">
            }
            FunctionDeclaration: {
                params: (
                    | Def.NodeRef<"BindingArrayPattern">
                    | Def.NodeRef<"BindingAssignmentPattern">
                    | Def.NodeRef<"BindingObjectPattern">
                    | Def.NodeRef<"BindingRestElement">
                )[]
            }
            FunctionExpression: {
                params: (
                    | Def.NodeRef<"BindingArrayPattern">
                    | Def.NodeRef<"BindingAssignmentPattern">
                    | Def.NodeRef<"BindingObjectPattern">
                    | Def.NodeRef<"BindingRestElement">
                )[]
            }
            VariableDeclarator: {
                id:
                    | Def.NodeRef<"BindingArrayPattern">
                    | Def.NodeRef<"BindingObjectPattern">
            }

            // Others
            BindingArrayPattern: {
                type: "ArrayPattern"
                elements: (
                    | Def.NodeRef<"BindingAssignmentPattern">
                    | Def.NodeRef<"BindingArrayPattern">
                    | Def.NodeRef<"BindingObjectPattern">
                    | Def.NodeRef<"BindingRestElement">
                    | Def.NodeRef<"Identifier">
                    | null
                )[]
            }
            BindingAssignmentPattern: {
                type: "AssignmentPattern"
                left:
                    | Def.NodeRef<"BindingArrayPattern">
                    | Def.NodeRef<"BindingObjectPattern">
                    | Def.NodeRef<"Identifier">
                right: Def.NodeRef<"Expression">
            }
            BindingProperty: {
                type: "Property"
                kind: "init"
                computed: false
                method: false
                shorthand: false
                key:
                    | Def.NodeRef<"Identifier">
                    | Def.NodeRef<"NumberLiteral">
                    | Def.NodeRef<"StringLiteral">
                value:
                    | Def.NodeRef<"BindingArrayPattern">
                    | Def.NodeRef<"BindingAssignmentPattern">
                    | Def.NodeRef<"BindingObjectPattern">
                    | Def.NodeRef<"Identifier">
            }
            BindingShorthandProperty: {
                type: "Property"
                kind: "init"
                computed: false
                method: false
                shorthand: true
                key: Def.NodeRef<"Identifier">
                value: Def.NodeRef<"Identifier">
            }
            BindingComputedProperty: {
                type: "Property"
                kind: "init"
                computed: true
                method: false
                shorthand: false
                key: Def.NodeRef<"Expression">
                value:
                    | Def.NodeRef<"BindingArrayPattern">
                    | Def.NodeRef<"BindingAssignmentPattern">
                    | Def.NodeRef<"BindingObjectPattern">
                    | Def.NodeRef<"Identifier">
            }
            BindingObjectPattern: {
                type: "ObjectPattern"
                properties: (
                    | Def.NodeRef<"BindingComputedProperty">
                    | Def.NodeRef<"BindingProperty">
                    | Def.NodeRef<"BindingShorthandProperty">
                )[]
            }
            BindingRestElement: {
                type: "RestElement"
                argument: Def.NodeRef<"Identifier">
            }
        }
    }

    export interface Iteration {
        nodes: {
            // Enhancements
            FunctionDeclaration: {
                generator: boolean
            }
            FunctionExpression: {
                generator: boolean
            }

            // New statements
            ForOfStatement: {
                left:
                    | Def.NodeRef<"AssignmentArrayPattern">
                    | Def.NodeRef<"AssignmentObjectPattern">
                    | Def.NodeRef<"BasicMemberExpression">
                    | Def.NodeRef<"ComputedMemberExpression">
                    | Def.NodeRef<"Identifier">
                    | Def.NodeRef<"VariableDeclaration">
                right: Def.NodeRef<"Expression">
                body: Def.NodeRef<"Statement">
            }

            // New expressions
            YieldExpression: {
                delegate: boolean
                argument: Def.NodeRef<"Expression"> | null
            }
        }
        statementType: "ForOfStatement"
        expressionType: "YieldExpression"
    }

    export interface LexicalBinding {
        nodes: {
            // Enhancements
            VariableDeclaration: {
                kind: "var" | "let" | "const"
            }
        }
    }

    export interface Module {
        nodes: {
            // Root
            Program: {
                sourceType: "script"
            }
            ModuleProgram: {
                type: "Program"
                sourceType: "module"
                body: (
                    | Def.NodeRef<"Statement">
                    | Def.NodeRef<"ExportAllDeclaration">
                    | Def.NodeRef<"ExportDefaultDeclaration">
                    | Def.NodeRef<"ExportNamedDeclaration">
                    | Def.NodeRef<"ExportNamedFromDeclaration">
                    | Def.NodeRef<"ImportDeclaration">
                )[]
                comments: Comment[]
                tokens: Token[]
            }

            // Modules
            ExportAllDeclaration: {
                source: Def.NodeRef<"StringLiteral">
            },
            ExportDefaultDeclaration: {
                declaration:
                    | Def.NodeRef<"AnonymousDefaultExportedClassDeclaration">
                    | Def.NodeRef<"AnonymousDefaultExportedFunctionDeclaration">
                    | Def.NodeRef<"ClassDeclaration">
                    | Def.NodeRef<"FunctionDeclaration">
                    | Def.NodeRef<"Expression">
            }
            ExportNamedDeclaration: {
                type: "ExportNamedDeclaration"
                declaration:
                    | Def.NodeRef<"ClassDeclaration">
                    | Def.NodeRef<"FunctionDeclaration">
                    | Def.NodeRef<"VariableDeclaration">
                specifiers: []
                source: null
            }
            ExportNamedFromDeclaration: {
                type: "ExportNamedDeclaration"
                declaration: null
                specifiers: Def.NodeRef<"ExportSpecifier">[]
                source: Def.NodeRef<"StringLiteral">
            }
            ImportDeclaration: {
                specifiers: (
                    | Def.NodeRef<"ImportSpecifier">
                    | Def.NodeRef<"ImportDefaultSpecifier">
                    | Def.NodeRef<"ImportNamespaceSpecifier">
                )[]
                source: Def.NodeRef<"StringLiteral">
            }

            // Others
            AnonymousDefaultExportedClassDeclaration: {
                type: "ClassDeclaration"
                id: null
                superClass: Def.NodeRef<"Expression"> | null
                body: Def.NodeRef<"ClassBody">
            }
            AnonymousDefaultExportedFunctionDeclaration: {
                type: "FunctionDeclaration"
                generator: boolean
                id: null
                params: (
                    | Def.NodeRef<"BindingArrayPattern">
                    | Def.NodeRef<"BindingAssignmentPattern">
                    | Def.NodeRef<"BindingObjectPattern">
                    | Def.NodeRef<"BindingRestElement">
                    | Def.NodeRef<"Identifier">
                )[]
                body: Def.NodeRef<"BlockStatement">
            }
            ExportSpecifier: {
                local: Def.NodeRef<"Identifier">
                exported: Def.NodeRef<"Identifier">
            }
            ImportDefaultSpecifier: {
                local: Def.NodeRef<"Identifier">
            }
            ImportNamespaceSpecifier: {
                local: Def.NodeRef<"Identifier">
            }
            ImportSpecifier: {
                imported: Def.NodeRef<"Identifier">
                local: Def.NodeRef<"Identifier">
            }
        }
    }

    export interface ObjectLiteralEnhancement {
        nodes: {
            // Enhancements
            ObjectExpression: {
                properties: (
                    | Def.NodeRef<"MethodProperty">
                    | Def.NodeRef<"ShorthandProperty">
                    | Def.NodeRef<"ComputedProperty">
                    | Def.NodeRef<"ComputedAccessorProperty">
                    | Def.NodeRef<"ComputedMethodProperty">
                )[]
            }
            BasicProperty: {
                computed: false
                method: false
                shorthand: false
            }
            AccessorProperty: {
                computed: false
                method: false
                shorthand: false
            }

            // New others
            MethodProperty: {
                type: "Property"
                kind: "init"
                computed: false
                method: true
                shorthand: false
                key:
                    | Def.NodeRef<"Identifier">
                    | Def.NodeRef<"NumberLiteral">
                    | Def.NodeRef<"StringLiteral">
                value: Def.NodeRef<"FunctionExpression">
            }
            ShorthandProperty: {
                type: "Property"
                kind: "init"
                computed: false
                method: false
                shorthand: true
                key: Def.NodeRef<"Identifier">
                value: Def.NodeRef<"Identifier">
            }

            ComputedProperty: {
                type: "Property"
                kind: "init"
                computed: true
                method: false
                shorthand: false
                key: Def.NodeRef<"Expression">
                value: Def.NodeRef<"Expression">
            }
            ComputedAccessorProperty: {
                type: "Property"
                kind: "get" | "set"
                computed: true
                method: false
                shorthand: false
                key: Def.NodeRef<"Expression">
                value: Def.NodeRef<"FunctionExpression">
            }
            ComputedMethodProperty: {
                type: "Property"
                kind: "init"
                computed: true
                method: true
                shorthand: false
                key: Def.NodeRef<"Expression">
                value: Def.NodeRef<"FunctionExpression">
            }
        }
    }

    export interface RegExpEnhancement {
        nodes: {
            // Enhancements
            RegExpLiteral: {
                value: null
            }
        }
    }

    export interface Spread {
        nodes: {
            // Enhancements
            ArrayExpression: {
                elements: Def.NodeRef<"SpreadElement">[]
            }
            CallExpression: {
                arguments: Def.NodeRef<"SpreadElement">[]
            }
            NewExpression: {
                arguments: Def.NodeRef<"SpreadElement">[]
            }

            // New others
            SpreadElement: {
                argument: Def.NodeRef<"Expression">
            }
        }
    }
    
    export interface TemplateLiteral {
        nodes: {
            // Expressions
            TaggedTemplateExpression: {
                tag: Def.NodeRef<"Expression">
                quasi: Def.NodeRef<"TemplateLiteral">
            }
            TemplateLiteral: {
                quasis: Def.NodeRef<"TemplateElement">[]
                expressions: Def.NodeRef<"Expression">[]
            }

            // Others
            TemplateElement: {
                tail: boolean
                value: { cooked: string; raw: string }
            }
        }
        expressionType: "TaggedTemplateExpression" | "TemplateLiteral"
    }
}

export interface ASTDefinition extends Def.Extends<es5.ASTDefinition, [
    ASTEnhancements.ArrowFunction,
    ASTEnhancements.Class,
    ASTEnhancements.DestructuringAssignment,
    ASTEnhancements.DestructuringBinding,
    ASTEnhancements.Iteration,
    ASTEnhancements.LexicalBinding,
    ASTEnhancements.Module,
    ASTEnhancements.ObjectLiteralEnhancement,
    ASTEnhancements.RegExpEnhancement,
    ASTEnhancements.Spread,
    ASTEnhancements.TemplateLiteral,
]> {}

export type AST<
    T extends Def.SpecialType | Def.ActualNodeType<ASTDefinition> = "Node",
    TFilter = any
> =
    Def.ExtractNode<ASTDefinition, T, TFilter>
