export type IsAny<T> =
    boolean extends (T extends never ? true : false) ? true : false

export type IsNever<T> =
    false extends (T extends never ? true : false) ? false : true
