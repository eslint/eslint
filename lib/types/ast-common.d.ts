export type Range = readonly [number, number]

export interface LineColumn {
    readonly line: number
    readonly column: number
}

export interface Location {
    readonly start: LineColumn
    readonly end: LineColumn
}

export interface Token {
    readonly type: string
    readonly value: string
    readonly range: Range
    readonly loc: Location
}

export interface Comment {
    readonly type: "Block" | "Line" | "Shebang"
    readonly value: string
    readonly range: Range
    readonly loc: Location
}

export interface HasRange {
    readonly range: Range
}

export interface HasLocation {
    readonly loc: Location
}
