import { IsAny, IsNever } from "./utils"

export interface ArraySchema {
    readonly type: "array"
    readonly items: Schema | (readonly Schema[] & { 0: Schema }) | []
    readonly additionalItems?: false | Schema
    readonly uniqueItems?: boolean
    readonly minItems?: number
    readonly maxItems?: number
}

export interface BooleanSchema {
    readonly type: "boolean"
}

export interface EnumSchema {
    readonly enum: readonly (boolean | null | number | string)[]
}

export interface IntersectionSchema {
    readonly allOf: readonly Schema[]
}

export interface NullSchema {
    readonly type: "null"
}

export interface NumberSchema {
    readonly type: "number" | "integer"
    readonly minimum?: number
    readonly exclusiveMinimum?: number
    readonly maximum?: number
    readonly exclusiveMaximum?: number
    readonly multipleOf?: number
}

export interface ObjectSchema {
    readonly type: "object"
    readonly properties: Readonly<Record<string, Schema>>
    readonly additionalProperties?: false | Schema
    readonly required?: readonly string[]
}

export interface StringSchema {
    readonly type: "string"
    readonly minLength?: number
    readonly maxLength?: number
    readonly pattern?: string
}

export interface UnionSchema {
    readonly anyOf: readonly Schema[]
}

export type Schema =
    | ArraySchema
    | BooleanSchema
    | EnumSchema
    | IntersectionSchema
    | NullSchema
    | NumberSchema
    | ObjectSchema
    | StringSchema
    | UnionSchema

type ArrayToType<T extends readonly Schema[]> = {
    readonly [P in keyof T]: T[P] extends Schema ? SchemaToType<T[P]> : T[P]
}

type ArrayWithRestElementToType<S extends ArraySchema["items"], R> =
    S extends Schema ? readonly (SchemaToType<S> | R)[] :
    S extends [Schema] ? readonly [SchemaToType<S[0]>, ...R[]] :
    S extends [Schema, Schema] ? readonly [
        SchemaToType<S[0]>,
        SchemaToType<S[1]>,
        ...R[]
    ] :
    S extends [Schema, Schema, Schema] ? readonly [
        SchemaToType<S[0]>,
        SchemaToType<S[1]>,
        SchemaToType<S[2]>,
        ...R[]
    ] :
    S extends [Schema, Schema, Schema, Schema] ? readonly [
        SchemaToType<S[0]>,
        SchemaToType<S[1]>,
        SchemaToType<S[2]>,
        SchemaToType<S[3]>,
        ...R[]
    ] :
    S extends readonly Schema[] ? ArrayToType<S> & readonly R[] :
    /* otherwise */ readonly R[]

type ArraySchemaToType<S extends ArraySchema> = {
    0:
        S["additionalItems"] extends false ? (
            S["items"] extends Schema ? readonly SchemaToType<S["items"]>[] :
            S["items"] extends readonly Schema[] ? ArrayToType<S["items"]> :
            /* otherwise */ []
        ) :
        S["additionalItems"] extends Schema ? (
            ArrayWithRestElementToType<
                S["items"],
                SchemaToType<S["additionalItems"]>
            >
        ) :
        /* otherwise */ ArrayWithRestElementToType<S["items"], unknown>
}[S extends any ? 0 : never]

type UnionToIntersection<U> = 
    (U extends any ? (k: U) => void : never) extends ((k: infer I) => void)
        ? I
        : never

type IntersectionSchemaToType<S extends IntersectionSchema> =
    UnionToIntersection<ArrayToType<S["allOf"]>[number]>

type ObjectSchemaToType<S extends ObjectSchema> =
    S["required"][keyof S["required"]] extends infer R
        ? (
            & (IsNever<Extract<keyof S["properties"], R>> extends true
                ? unknown
                : {
                    [P in Extract<keyof S["properties"], R>]:
                        SchemaToType<S["properties"][P]>
                })
            & (IsNever<Exclude<keyof S["properties"], R>> extends true
                ? unknown
                : {
                    [P in Exclude<keyof S["properties"], R>]?:
                        SchemaToType<S["properties"][P]>
                })
            & (S["additionalProperties"] extends false
                ? unknown
                : {
                    readonly [key: string]:
                        S["additionalProperties"] extends Schema
                            ? SchemaToType<S["additionalProperties"]>
                            : unknown
                })
        )
        : never

type A = ObjectSchemaToType<{
    type: "object"
    properties: {
        a: { type: "string" }
        b: { type: "string" }
    }
    required: ["a"]
    additionalProperties: false
}>

type UnionSchemaToType<S extends UnionSchema> =
    ArrayToType<S["anyOf"]>[number]

export type SchemaToType<S extends Schema> =
    IsAny<S> extends true ? any :
    S extends EnumSchema ? S["enum"][number] :
    S extends BooleanSchema ? boolean :
    S extends NullSchema ? null :
    S extends NumberSchema ? number :
    S extends StringSchema ? string :
    S extends ArraySchema ? ArraySchemaToType<S> :
    S extends IntersectionSchema ? IntersectionSchemaToType<S> :
    S extends ObjectSchema ? ObjectSchemaToType<S> :
    S extends UnionSchema ? UnionSchemaToType<S> :
    never
