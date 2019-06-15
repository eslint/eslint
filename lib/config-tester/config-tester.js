/**
 * @fileoverview The tester for shareable configs.
 * @author Toru Nagashima <https://github.com/mysticatea>
 */
"use strict";

const assert = require("assert");
const path = require("path");
const packlist = require("npm-packlist");
const { ConfigArrayFactory } = require("../cli-engine/config-array-factory");
const { CLIEngine } = require("../cli-engine");
const BuiltInRules = require("../rules");
const { getRuleSeverity } = require("../shared/config-ops");
const { validateConfigArray, validateConfigSchema } = require("../shared/config-validator");
const { TesterBase } = require("../shared/tester-base");

/** @typedef {import("../shared/types").ConfigData} ConfigData */
/** @typedef {import("../shared/types").OverrideConfigData} OverrideConfigData */
/** @typedef {import("../shared/types").RuleConf} RuleConf */
/** @typedef {ReturnType<ConfigArrayFactory["create"]>} ConfigArray */

/**
 * @typedef {Object} ConfigTesterOptions
 * @property {boolean} [ignoreDeprecatedRules=false] If `true` then the tester ignores deprecated rules.
 * @property {boolean} [ignoreDisabledUnknownRules=false] If `true` then the tester ignores unknown rules if the rule's severity was `0` (`"off"`).
 * @property {boolean} [ignoreMissingDependencies=false] If `true` then the tester ignores wrong dependency definition (`dependencies`/`peerDependencies`).
 * @property {boolean} [ignoreMissingRules=false] If `true` then the tester ignores missing rules. The missing rules mean the rules that ESLint or a plugin defined but not configured.
 */

/**
 * @typedef {Object} ConfigTesterInternalSlots
 * @property {Object} packageInfo The content of `package.json` in the project root.
 * @property {string} projectRoot The path to the project root.
 */

/** @type {WeakMap<ConfigTester, ConfigTesterInternalSlots>} */
const internalSlots = new WeakMap();

/** RegExp to test if a given name is a plugin name or not. */
const PackageNamePattern = /^(?:eslint-plugin-([^/]+)|(@[^/]+)[/]eslint-plugin(?:-([^/]+))?)$/u;

/**
 * Count the number that a given `substr` appeared in a given string.
 * @param {string} str The string to count `substr`.
 * @param {string} substr The substring to count.
 * @returns {number} The number that the `substr` appeared.
 */
function countSubstr(str, substr) {
    return str.split(substr).length - 1;
}

/**
 * The config tester.
 */
class ConfigTester extends TesterBase {

    /**
     * @param {string} [projectRoot] The project root. Default is `process.cwd()`.
     */
    constructor(projectRoot = process.cwd()) {
        super();
        internalSlots.set(this, {
            packageInfo: require(path.join(projectRoot, "package.json")) || {},
            projectRoot
        });
    }

    /**
     * Define tests to validate a given config data.
     * @param {string} targetName The target name.
     * - If the package is a shareable config, it's the file name of a config.
     * - If the package is a plugin, it's a config name that the plugin has.
     * @param {ConfigTesterOptions} [options] The options.
     * @returns {void}
     */
    run(
        targetName,
        {
            ignoreDeprecatedRules = false,
            ignoreDisabledUnknownRules = false,
            ignoreMissingDependencies = false,
            ignoreMissingRules = false
        } = {}
    ) {
        const { describe, it } = ConfigTester;
        const { packageInfo: pkg, projectRoot } = internalSlots.get(this);
        const isPlugin = (
            typeof pkg.name === "string" &&
            PackageNamePattern.test(pkg.name)
        );
        const configArrayFactory = new ConfigArrayFactory({
            additionalPluginPool: new Map(
                isPlugin ? [[pkg.name, require(projectRoot)]] : []
            ),
            cwd: projectRoot
        });
        let cachedConfigData = null;
        let cachedConfigArray = null;

        /**
         * Load the target config data.
         * @returns {{config:ConfigData,filePath:string}} The config data.
         */
        function getConfigData() {
            if (!cachedConfigData) {
                let config, filePath;

                if (isPlugin) {
                    filePath = require.resolve(projectRoot);
                    const plugin = require(filePath);

                    config = plugin.configs && plugin.configs[targetName];

                    // Add `plugins: [pkg.name]` to use itself in the config.
                    if (config) {
                        config = { ...config };
                        config.plugins = [pkg.name, ...(config.plugins || [])];
                    }
                } else {
                    filePath = require.resolve(path.resolve(projectRoot, targetName));
                    config = require(filePath);
                }

                assert.strictEqual(typeof config, "object", `Config '${targetName}' was not found in ${pkg.name}.`);
                cachedConfigData = { config, filePath };
            }

            return cachedConfigData;
        }

        /**
         * Normalize config data.
         * @returns {{config:ConfigData, configArray:ConfigArray, entryPath:string}} The normalized config data.
         */
        function getConfigArray() {
            if (!cachedConfigArray) {
                const { config, filePath } = getConfigData();
                const plugins = new Map();

                // Register itself if the package was a plugin.
                if (isPlugin) {
                    plugins.set(pkg.name, require(projectRoot));
                }

                // Normalize.
                cachedConfigArray = {
                    config,
                    configArray: configArrayFactory.create(config, { filePath, name: targetName }),
                    entryPath: filePath
                };
            }

            return cachedConfigArray;
        }

        /**
         * Get depended files.
         * @returns {string[]} The files.
         */
        function getDependedFiles() {
            const { configArray, entryPath } = getConfigArray();
            const retv = new Set([entryPath]);

            for (const entry of configArray) {
                if (entry.filePath === entryPath) {

                    // Yield `parser`
                    if (entry.parser) {
                        if (entry.parser.error) {
                            throw entry.parser.error;
                        }
                        retv.add(entry.parser.filePath);
                    }

                    // Yield `plugins`
                    if (entry.plugins) {
                        for (const plugin of Object.values(entry.plugins)) {
                            if (plugin.error) {
                                throw plugin.error;
                            }
                            retv.add(plugin.filePath);
                        }
                    }

                // Yield `extends`
                } else if (countSubstr(entry.name, " » ") === 1) {
                    retv.add(entry.filePath);
                }
            }

            return Array.from(retv);
        }

        /**
         * Check if a given path is a path to a package.
         * @param {string[]} pathParts The string array that a path was split by `path.sep`.
         * @returns {boolean} `true` if the path was a path to a package.
         */
        function isPackagePath(pathParts) {
            return pathParts.length >= 2 && pathParts[0] === "node_modules";
        }

        /**
         * Get a package.
         * @param {string[]} pathParts The string array that a path was split by `path.sep`.
         * @returns {string} The package name of `pathParts`.
         */
        function getPackageName(pathParts) {
            const scoped = pathParts[1].startsWith("@");

            return pathParts
                .slice(1, scoped ? 3 : 2)
                .map(filename => path.basename(filename, path.extname(filename)))
                .join("/");
        }

        /**
         * Get depended plugin packages.
         * This list contains the plugins that the `extends` configs referred.
         * @returns {string[]} The plugin packages.
         */
        function getDependedPlugins() {
            const { configArray } = getConfigArray();
            const retv = new Set([]);

            for (const entry of configArray) {
                if (entry.plugins) {
                    for (const plugin of Object.values(entry.plugins)) {
                        if (plugin.filePath) {
                            const pathParts = path.relative(projectRoot, plugin.filePath).split(path.sep);

                            if (isPackagePath(pathParts)) {
                                retv.add(getPackageName(pathParts));
                            }
                        }
                    }
                }
            }

            return Array.from(retv);
        }

        describe(`${pkg.name}/${targetName}`, () => {
            it("should have valid schema.", () => {
                const { config, filePath } = getConfigData();

                validateConfigSchema(config, path.relative(projectRoot, filePath));
            });

            it("should have valid content.", () => {
                const { configArray, entryPath } = getConfigArray();

                validateConfigArray(configArray);

                // `validateConfigArray` didn't check `env` values.
                for (const element of configArray) {
                    if (element.filePath !== entryPath) {
                        continue;
                    }

                    for (const [envId, value] of Object.entries(element.env || {})) {
                        assert.strictEqual(typeof value, "boolean", `'env.${envId}' should be a boolean value, but got a ${typeof value} value.`);
                    }
                }
            });

            it("should not configure unknown rules.", () => {
                const { configArray, entryPath } = getConfigArray();
                const { pluginRules } = configArray;
                const pluginIds = new Set(function *() {
                    for (const element of configArray) {
                        if (element.plugins) {
                            yield* Object.keys(element.plugins);
                        }
                    }
                }());
                const configuredRules = [].concat(
                    ...configArray.map(element => (
                        element.filePath === entryPath
                            ? Object.entries(element.rules || {})
                            : []
                    ))
                );
                const notFoundRuleIds = configuredRules
                    .filter(([ruleId, ruleConf]) => (
                        !BuiltInRules.has(ruleId) &&
                        !pluginRules.has(ruleId) &&
                        !(ignoreDisabledUnknownRules && getRuleSeverity(ruleConf) === 0)
                    ))
                    .sort();

                assert.deepStrictEqual(
                    notFoundRuleIds,
                    [],
                    `${notFoundRuleIds.length} rule(s) were not found in ESLint v${CLIEngine.version}${
                        pluginIds.size > 0 ? ` with plugin(s) ${JSON.stringify(Array.from(pluginIds)).slice(1, -1)}` : ""
                    }.`
                );
            });

            if (ignoreDeprecatedRules !== true) {
                it("should not enable deprecated rules.", () => {
                    const { configArray, entryPath } = getConfigArray();
                    const { pluginRules } = configArray;
                    const deprecatedRuleIds = new Set(
                        [...BuiltInRules, ...pluginRules]
                            .filter(([, rule]) => rule.meta && rule.meta.deprecated)
                            .map(([ruleId]) => ruleId)
                    );
                    const configuredRules = [].concat(
                        ...configArray.map(element => (
                            element.filePath === entryPath
                                ? Object.entries(element.rules || {})
                                : []
                        ))
                    );
                    const foundDeprecatedRuleIds = Array.from(
                        new Set(
                            configuredRules
                                .filter(([ruleId, ruleConf]) => {
                                    const severity = getRuleSeverity(ruleConf);

                                    return (
                                        deprecatedRuleIds.has(ruleId) &&
                                        (severity === 1 || severity === 2)
                                    );
                                })
                                .map(([ruleId]) => ruleId)
                        )
                    ).sort();

                    assert.deepStrictEqual(
                        foundDeprecatedRuleIds,
                        [],
                        `${foundDeprecatedRuleIds.length} deprecated rule(s) were found.`
                    );
                });
            }

            if (ignoreMissingRules !== true) {
                it("should configure all rules.", () => {
                    const { configArray } = getConfigArray();
                    const { pluginRules } = configArray;
                    const configuredRuleIds = new Set(function *() {
                        for (const element of configArray) {
                            yield* Object.keys(element.rules || {});
                        }
                    }());
                    const missingRuleIds =
                        [...BuiltInRules, ...pluginRules]
                            .filter(([ruleId, rule]) => (
                                !(rule.meta && rule.meta.deprecated) &&
                                !configuredRuleIds.has(ruleId)
                            ))
                            .map(([ruleId]) => ruleId);

                    assert.deepStrictEqual(
                        missingRuleIds,
                        [],
                        `${missingRuleIds.length} rule(s) were not configured in your config.`
                    );
                });
            }

            if (ignoreMissingDependencies !== true) {
                describe("package.json", () => {
                    it("should contain all files that your config referred.", () => {
                        const validFiles = new Set(
                            packlist.sync({ path: projectRoot })
                                .map(relPath => path.relative(projectRoot, path.resolve(projectRoot, relPath)))
                        );
                        const invalidFiles = getDependedFiles()
                            .map(filePath => path.relative(projectRoot, filePath))
                            .filter(filePath => !filePath.startsWith(`node_modules${path.sep}`) && !validFiles.has(filePath))
                            .sort();

                        assert.deepStrictEqual(
                            invalidFiles,
                            [],
                            `${invalidFiles.length} file(s) were not contained in your package. Check your 'package.json' and '.npmignore'.`
                        );
                    });

                    it("should declare all packages that your config referred, as 'dependencies' or 'peerDependencies'.", () => {
                        const validPackages = new Set([
                            pkg.name,
                            ...Object.keys(pkg.dependencies || {}),
                            ...Object.keys(pkg.peerDependencies || {})
                        ]);
                        const invalidPackages = getDependedFiles()
                            .map(filePath => path.relative(projectRoot, filePath).split(path.sep))
                            .filter(isPackagePath)
                            .map(getPackageName)
                            .filter(pluginId => !validPackages.has(pluginId))
                            .sort();

                        assert.deepStrictEqual(
                            invalidPackages,
                            [],
                            `${invalidPackages.length} package(s) were not declared in your package. Check your 'package.json'.`
                        );
                    });

                    it("should declare all plugin packages that your config referred, as 'peerDependencies'.", () => {
                        const validPackages = new Set([
                            pkg.name,
                            ...Object.keys(pkg.peerDependencies || {})
                        ]);
                        const invalidPackages = getDependedPlugins()
                            .filter(pluginId => !validPackages.has(pluginId))
                            .sort();

                        assert.deepStrictEqual(
                            invalidPackages,
                            [],
                            `${invalidPackages.length} package(s) were not declared in your package. Check the 'peerDependencies' of your 'package.json'.`
                        );
                    });
                });
            }
        });
    }
}

module.exports = { ConfigTester };
