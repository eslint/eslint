import type { FlatConfig } from "../../helper";

module.exports = (async () =>
    (await import("./some-external-config.mjs")).default)() satisfies Promise<
    FlatConfig[]
>;
