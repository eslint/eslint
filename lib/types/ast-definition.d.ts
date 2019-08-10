import { Location, Range } from "./ast-common"
import { IsAny, IsNever } from "./utils"

/**
 * The Type of AST definition.
 */
export interface ASTDefinition {
    /**
     * A map-like object type to define nodes.
     * 
     * Each key is the node type and its value is the node definition.
     * `Def.NodeRef<T>` in the node definitions will be replaced by the actual node types.
     */
    nodes: object

    /**
     * The union type of statement node types.
     * `Def.NodeRef<"Statement">` will be converted to the nodes of this type.
     */
    statementType: string
    
    /**
     * The union type of statement node types.
     * `Def.NodeRef<"Expression">` will be converted to the nodes of this type.
     */
    expressionType: string
}

/**
 * The difference to enhance AST definition.
 */
export type ASTEnhancement = Partial<ASTDefinition>

/**
 * The type to represent that a node has other nodes.
 */
export interface NodeRef<TType extends string> { $ref: TType }

//------------------------------------------------------------------------------
// Implement `Node<Type, ASTDefinition>`
//------------------------------------------------------------------------------

type NeverToNull<T> = IsNever<T> extends true ? null : T

/**
 * The types that `ResolveNode<TDef, TType>` type handles as special.
 */
export type SpecialType = "Node" | "Statement" | "Expression"

/**
 * Get the type of `type` property of a node definition.
 */
type Type<TDef extends ASTDefinition, TType extends keyof TDef["nodes"]> =
    TDef["nodes"][TType] extends { type: infer T }
        ? (T extends keyof any ? T : TType)
        : TType

/**
 * The union type of all node types.
 */
export type ActualNodeType<TDef extends ASTDefinition> =
    { [P in keyof TDef["nodes"]]: Type<TDef, P> }[keyof TDef["nodes"]]


/**
 * Normalize a given node type.
 * 
 * There are three special types:
 * - `"Node"` ... becomes the union of all node types.
 * - `"Statement"` ... becomes the union of all statement node types.
 * - `"Expression"` ... becomes the union of all expression node types.
 */
type NormalizeType<
    TDef extends ASTDefinition,
    TType extends SpecialType | keyof TDef["nodes"]
> = Extract<
    keyof TDef["nodes"],
    (
        IsAny<TType> extends true ? any :
        TType extends "Node" ? any :
        TType extends "Statement" ? TDef["statementType"] :
        TType extends "Expression" ? TDef["expressionType"] :
        /* otherwise */ TType
    )
>
/**
 * Resolve given node types to the corresponded nodes.
 */
type ResolveNode<
    TDef extends ASTDefinition,
    TType extends keyof TDef["nodes"]
> =
    // `TType extends any` is needed to distribute over union types.
    TType extends any ? Node<TDef, TType> : never

/**
 * Resolve given `Def.NodeRef<T>` to the corresponded nodes.
 * If a given type was not `Def.NodeRef<T>`, it's as-is.
 */
type ResolveNodeRef<TDef extends ASTDefinition, TMaybeNodeRef> =
    // If `TMaybeNodeRef` was `any`, `unknown`, or `never`, then
    // `TMaybeNodeRef extends { $ref: SpecialType | keyof TDef["nodes"] }` is
    // always true. So we have to take the `$ref` and validate it.
    TMaybeNodeRef extends { $ref: infer T }
        ? (T extends SpecialType | keyof TDef["nodes"]
            ? ResolveNode<TDef, NormalizeType<TDef, T>>
            : (T extends keyof any
                ? {
                    "!! UNKNOWN NODE TYPE !!": T
                    "Please check 'NodeRef<T>' in your AST definition": T
                }
                : TMaybeNodeRef))
        : TMaybeNodeRef

/**
 * Resolve given `Def.NodeRef<T>` or `Def.NodeRef<T>[]` to the corresponded nodes.
 * If a given type was not `Def.NodeRef<T>`, it's as-is.
 * 
 * If you modify this logic, modify `NodeRefType` type as same.
 */
type NodeProperty<TDef extends ASTDefinition, TValue> =
    TValue extends (infer TElement)[]
        ? readonly ResolveNodeRef<TDef, TElement>[]
        : ResolveNodeRef<TDef, TValue>

/**
 * Get the `T` of `NodeRef<T>` or `NodeRef<T>[]`.
 *
 * If you modify this logic, modify `NodeProperty` type as same.
 */
type NodeRefType<TDef extends ASTDefinition, TMaybeNodeRef> = Extract<
    | TMaybeNodeRef extends { $ref: infer TType } ? TType : never
    | TMaybeNodeRef extends { $ref: infer TType }[] ? TType : never,
    SpecialType | keyof TDef["nodes"]
>

/**
 * Collect all referenced node types (`Def.NodeRef<T>`) in a given node definition.
 */
type ChildNodeType<TDef extends ASTDefinition, TNodeDef> = NormalizeType<
    TDef,
    { [P in keyof TNodeDef]: NodeRefType<TDef, TNodeDef[P]> }[keyof TNodeDef]
>

/**
 * Collect all node types which references to the given node.
 * This is used to calculate `parent` property of each node.
 */
type ParentNodeType<
    TDef extends ASTDefinition,
    TType extends keyof TDef["nodes"]
> = {
    [P in keyof TDef["nodes"]]:
        TType extends ChildNodeType<TDef, TDef["nodes"][P]> ? P : never
}[keyof TDef["nodes"]]

/**
 * Calculate `parent` property type.
 */
type ParentNode<TDef extends ASTDefinition, TType extends keyof TDef["nodes"]> =
    NeverToNull<ResolveNode<TDef, ParentNodeType<TDef, TType>>>

/**
 * Define the actual node of the given node type.
 *
 * - `TDefinition["nodes"][TType]` is the node definition.
 * - Resolve all `Def.NodeRef<T>`s in the node definition.
 * - Calculate `parent` property automatically.
 * - Add the common properties (`type`, `range`, `loc`).
 * 
 * You cannot give union types to `TType`. This is not distributive.
 * If you want to use union type, use `ExtractNode<TDef, TType>` type.
 * 
 * `TType` is different from ESTree's node types because an ESTree node can be
 * represented by the union of multiple types. For example, ESTree `MemberExpression`
 * node is represented by two types: `BasicMemberExpression` and `ComputedMemberExpression`,
 * so we can distinguish the two by the control flow type narrowing.
 * I.e., `!node.computed && node.property.name === "foo"` is valid code because
 * TypeScript narrowed the type `node.property` to `Identifier` node by `!node.computed`.
 * 
 * If you want to get nodes by ESTree types, use `ExtractNode<TDef, TType>`.
 */
export type Node<
    TDef extends ASTDefinition,
    TType extends keyof TDef["nodes"]
> = {
    readonly [
        P in "loc" | "parent" | "range" | "type" | keyof TDef["nodes"][TType]
    ]:
        P extends "loc" ? Location :
        P extends "parent" ? ParentNode<TDef, TType> :
        P extends "range" ? Range :
        P extends "type" ? Type<TDef, TType> :
        P extends keyof TDef["nodes"][TType] ?
            NodeProperty<TDef, TDef["nodes"][TType][P]> :
        never
}

/**
 * Get the union type of all nodes which have the given type.
 * 
 * You can use the following types as `TType`:
 * - `"Node"` (all nodes)
 * - `"Statement"` (all statement nodes)
 * - `"Expression"` (all expression nodes)
 * - ESTree's node types
 * - Union types of above.
 * 
 * @example
 * // extract computed property.
 * type ComputedProperty =
 *     ExtractNode<ASTDefinition, "Property", { computed: true }>
 */
export type ExtractNode<
    TDefinition extends ASTDefinition,
    TType extends SpecialType | ActualNodeType<TDefinition>,
    TFilter = any
> = Extract<
    TType extends SpecialType
        ? ResolveNode<TDefinition, NormalizeType<TDefinition, TType>>
        : Extract<
            ResolveNode<TDefinition, keyof TDefinition["nodes"]>,
            { type: TType }
        >,
    TFilter
>

//------------------------------------------------------------------------------
// Implement `Extends<ASTDefinition, ASTEnhancement>`
//------------------------------------------------------------------------------

type At0<T extends ASTEnhancement[]> =
    T extends [infer X, ...any[]] ? X : never
type At1<T extends ASTEnhancement[]> =
    T extends [any, infer X, ...any[]] ? X : never
type At2<T extends ASTEnhancement[]> =
    T extends [any, any, infer X, ...any[]] ? X : never
type At3<T extends ASTEnhancement[]> =
    T extends [any, any, any, infer X, ...any[]] ? X : never
type Shift4<T extends ASTEnhancement[]> =
    // We cannot infer the rest element of an array `[any, ...(infer T)]`.
    // Instead, we have to do it with function types.
    ((...x: T) => void) extends
        ((_0: any, _1: any, _2: any, _3: any, ...xs: infer XS) => void)
        ? XS
        : never

type Prop<TObject, TKey extends keyof any, TExpected = any, TDefault = never> =
    [TObject] extends [{ [P in TKey]: infer TResult }]
        ? (TResult extends TExpected ? TResult : TDefault)
        : TDefault

/**
 * Convert `A[] | B[]` to `(A | B)[]`.
 */
type UniteArray<T> = [T] extends [any[]] ? T[0][] : T

/**
 * Merge the properties of a node definition from a base definition and four enhancements.
 */
type MergeNodeProperties<T, U, V, W, X> = {
    [P in keyof T | keyof U | keyof V | keyof W | keyof X]: UniteArray<
        | (P extends keyof T ? T[P] : never)
        | (P extends keyof U ? U[P] : never)
        | (P extends keyof V ? V[P] : never)
        | (P extends keyof W ? W[P] : never)
        | (P extends keyof X ? X[P] : never)
    >
}

/**
 * Merge every node definition from a base definition and four enhancements.
 */
type MergeNodes<T, U, V, W, X> = {
    [P in keyof T | keyof U | keyof V | keyof W | keyof X]: MergeNodeProperties<
        Prop<T, P, {}, {}>, 
        Prop<U, P, {}, {}>,
        Prop<V, P, {}, {}>,
        Prop<W, P, {}, {}>,
        Prop<X, P, {}, {}>
    >
}

/**
 * Apply enhancements to the base definition.
 * This applies four enhancements at a time because TypeScript's threshold of recursive error is small.
 */
type ExtendsRec<
    TDefinition,
    TEnhancements extends any[]
> = {
    0: TDefinition
    1: ExtendsRec<
        {
            statementType: 
                | Prop<TDefinition, "statementType", string>
                | Prop<At0<TEnhancements>, "statementType", string>
                | Prop<At1<TEnhancements>, "statementType", string>
                | Prop<At2<TEnhancements>, "statementType", string>
                | Prop<At3<TEnhancements>, "statementType", string>
            expressionType:
                | Prop<TDefinition, "expressionType", string>
                | Prop<At0<TEnhancements>, "expressionType", string>
                | Prop<At1<TEnhancements>, "expressionType", string>
                | Prop<At2<TEnhancements>, "expressionType", string>
                | Prop<At3<TEnhancements>, "expressionType", string>
            nodes: MergeNodes<
                Prop<TDefinition, "nodes", {}, {}>,
                Prop<At0<TEnhancements>, "nodes", {}, {}>,
                Prop<At1<TEnhancements>, "nodes", {}, {}>,
                Prop<At2<TEnhancements>, "nodes", {}, {}>,
                Prop<At3<TEnhancements>, "nodes", {}, {}>
            >
        },
        Shift4<TEnhancements>
    >
}[TEnhancements extends [] ? 0 : 1]

/**
 * Apply one or more enhancements to the base definition.
 */
export type Extends<
    TDefinition extends ASTDefinition,
    TEnhancement extends ASTEnhancement | ASTEnhancement[]
> = ExtendsRec<
    TDefinition,
    TEnhancement extends ASTEnhancement[] ? TEnhancement : [TEnhancement]
>
