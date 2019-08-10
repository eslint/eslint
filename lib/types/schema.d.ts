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

type UnionToIntersection<U> = 
    (U extends any ? (k: U) => void : never) extends ((k: infer I) => void)
        ? I
        : never

type ArraySchemaToType<S extends ArraySchema> =
    ArraySchema extends S
        ? unknown[]
        : (
            SchemaArrayToTypeR<
                S["items"] extends Schema ? readonly S["items"][] : S["items"]
            > & (
                S["additionalItems"] extends false ? {} :
                S["additionalItems"] extends Schema ? {
                    readonly [key: number]: SchemaToTypeR<S["additionalItems"]>
                } :
                { readonly [key: number]: unknown }
            )
        )

type IntersectionSchemaToType<S extends IntersectionSchema> =
    UnionToIntersection<SchemaArrayToTypeR<S["allOf"]>[number]>

type ObjectSchemaToType<S extends ObjectSchema> =
    S["required"][keyof S["required"]] extends infer R
        ? {
            readonly [P in Extract<keyof S["properties"], R>]:
                SchemaToTypeR<S["properties"][P]>
        } & {
            readonly [P in Exclude<keyof S["properties"], R>]?:
                SchemaToTypeR<S["properties"][P]>
        } & (
            S["additionalProperties"] extends false ? {} :
            S["additionalProperties"] extends Schema ? {
                readonly [key: string]: SchemaToTypeR<S["additionalProperties"]>
            } :
            { readonly [key: string]: unknown }
        )
        : never

type UnionSchemaToType<S extends UnionSchema> =
    SchemaArrayToTypeR<S["anyOf"]>[number]

type SchemaArrayToTypeR<T> = {
    readonly [P in keyof T]: SchemaToTypeR<T[P]>
}

type SchemaToTypeR<S> =
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

export type SchemaToType<S extends Schema> = SchemaToTypeR<S>
