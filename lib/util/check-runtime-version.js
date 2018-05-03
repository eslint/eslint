const assert = require("assert"),
    semver = require("semver"),
    packageJson = require("../../../package.json");

assert(semver.satisfies(process.versions.node, packageJson.engines.node));
