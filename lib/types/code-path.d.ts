export interface CodePath {
    readonly id: string
    readonly initialSegment: CodePathSegment
    readonly finalSegments: readonly CodePathSegment[]
    readonly returnedSegments: readonly CodePathSegment[]
    readonly thrownSegments: readonly CodePathSegment[]
    readonly currentSegments: readonly CodePathSegment[]
    readonly upper: CodePath | null
    readonly childCodePaths: readonly CodePath[]

    traverseSegments(callback: CodePath.TraverseCallback): void
    traverseSegments(options: CodePath.TraverseOptions, callback: CodePath.TraverseCallback): void
}
export namespace CodePath {
    export interface TraverseController {
        skip(): void
        break(): void
    }
    export type TraverseCallback = (
        this: CodePath,
        segment: CodePathSegment,
        controller: TraverseController
    ) => void
    export interface TraverseOptions {
        first?: CodePathSegment
        last?: CodePathSegment
    }
}

export interface CodePathSegment {
    readonly id: string
    readonly reachable: boolean
    readonly nextSegments: readonly CodePathSegment[]
    readonly prevSegments: readonly CodePathSegment[]
    readonly allNextSegments: readonly CodePathSegment[]
    readonly allPrevSegments: readonly CodePathSegment[]

    isLoopedPrevSegment(segment: CodePathSegment): boolean
}
