/**
 * @fileoverview Define classes what use the in-memory file system.
 *
 * This provides utilities to test `ConfigArrayFactory`,
 * `CascadingConfigArrayFactory`, `FileEnumerator`, `CLIEngine`, and `ESLint`.
 *
 * - `defineConfigArrayFactoryWithInMemoryFileSystem({ cwd, files })`
 * - `defineCascadingConfigArrayFactoryWithInMemoryFileSystem({ cwd, files })`
 * - `defineFileEnumeratorWithInMemoryFileSystem({ cwd, files })`
 * - `defineCLIEngineWithInMemoryFileSystem({ cwd, files })`
 * - `defineESLintWithInMemoryFileSystem({ cwd, files })`
 *
 * Those functions define correspond classes with the in-memory file system.
 * Those search config files, parsers, and plugins in the `files` option via the
 * in-memory file system.
 *
 * For each test case, it makes more readable if we define minimal files the
 * test case requires.
 *
 * For example:
 *
 * ```js
 * const { ConfigArrayFactory } = defineConfigArrayFactoryWithInMemoryFileSystem({
 *     files: {
 *         "node_modules/eslint-config-foo/index.js": `
 *             module.exports = {
 *                 parser: "./parser",
 *                 rules: {
 *                     "no-undef": "error"
 *                 }
 *             }
 *         `,
 *         "node_modules/eslint-config-foo/parser.js": `
 *             module.exports = {
 *                 parse() {}
 *             }
 *         `,
 *         ".eslintrc.json": JSON.stringify({ root: true, extends: "foo" })
 *     }
 * });
 * const factory = new ConfigArrayFactory();
 * const config = factory.loadFile(".eslintrc.json");
 *
 * assert(config[0].name === ".eslintrc.json » eslint-config-foo");
 * assert(config[0].filePath === path.resolve("node_modules/eslint-config-foo/index.js"));
 * assert(config[0].parser.filePath === path.resolve("node_modules/eslint-config-foo/parser.js"));
 *
 * assert(config[1].name === ".eslintrc.json");
 * assert(config[1].filePath === path.resolve(".eslintrc.json"));
 * assert(config[1].root === true);
 * ```
 *
 * @author Toru Nagashima <https://github.com/mysticatea>
 */
"use strict";

const path = require("path");
const vm = require("vm");
const { Volume, createFsFromVolume } = require("memfs");
const Proxyquire = require("proxyquire/lib/proxyquire");

const CascadingConfigArrayFactoryPath =
    require.resolve("@eslint/eslintrc/lib/cascading-config-array-factory");
const CLIEnginePath =
    require.resolve("../../lib/cli-engine/cli-engine");
const ConfigArrayFactoryPath =
    require.resolve("@eslint/eslintrc/lib/config-array-factory");
const FileEnumeratorPath =
    require.resolve("../../lib/cli-engine/file-enumerator");
const LoadRulesPath =
    require.resolve("../../lib/cli-engine/load-rules");
const ESLintPath =
    require.resolve("../../lib/eslint/eslint");
const ESLintAllPath =
    require.resolve("../../conf/eslint-all");
const ESLintRecommendedPath =
    require.resolve("../../conf/eslint-recommended");

// Ensure the needed files has been loaded and cached.
require(CascadingConfigArrayFactoryPath);
require(CLIEnginePath);
require(ConfigArrayFactoryPath);
require(FileEnumeratorPath);
require(LoadRulesPath);
require(ESLintPath);
require("js-yaml");
require("espree");

// Override `_require` in order to throw runtime errors in stubs.
const ERRORED = Symbol("errored");
const proxyquire = new class extends Proxyquire {
    _require(...args) {
        const retv = super._require(...args); // eslint-disable-line no-underscore-dangle

        if (retv[ERRORED]) {
            throw retv[ERRORED];
        }
        return retv;
    }
}(module).noCallThru().noPreserveCache();

// Separated (sandbox) context to compile fixture files.
const context = vm.createContext();

/**
 * Check if a given path is an existing file.
 * @param {import("fs")} fs The file system.
 * @param {string} filePath Tha path to a file to check.
 * @returns {boolean} `true` if the file existed.
 */
function isExistingFile(fs, filePath) {
    try {
        return fs.statSync(filePath).isFile();
    } catch {
        return false;
    }
}

/**
 * Get some paths to test.
 * @param {string} prefix The prefix to try.
 * @returns {string[]} The paths to test.
 */
function getTestPaths(prefix) {
    return [
        path.join(prefix),
        path.join(`${prefix}.js`),
        path.join(prefix, "index.js")
    ];
}

/**
 * Iterate the candidate paths of a given request to resolve.
 * @param {string} request Tha package name or file path to resolve.
 * @param {string} relativeTo Tha path to the file what called this resolving.
 * @returns {IterableIterator<string>} The candidate paths.
 */
function *iterateCandidatePaths(request, relativeTo) {
    if (path.isAbsolute(request)) {
        yield* getTestPaths(request);
        return;
    }
    if (/^\.{1,2}[/\\]/u.test(request)) {
        yield* getTestPaths(path.resolve(path.dirname(relativeTo), request));
        return;
    }

    let prevPath = path.resolve(relativeTo);
    let dirPath = path.dirname(prevPath);

    while (dirPath && dirPath !== prevPath) {
        yield* getTestPaths(path.join(dirPath, "node_modules", request));
        prevPath = dirPath;
        dirPath = path.dirname(dirPath);
    }
}

/**
 * Resolve a given module name or file path relatively in the given file system.
 * @param {import("fs")} fs The file system.
 * @param {string} request Tha package name or file path to resolve.
 * @param {string} relativeTo Tha path to the file what called this resolving.
 * @returns {void}
 */
function fsResolve(fs, request, relativeTo) {
    for (const filePath of iterateCandidatePaths(request, relativeTo)) {
        if (isExistingFile(fs, filePath)) {
            return filePath;
        }
    }

    throw Object.assign(
        new Error(`Cannot find module '${request}'`),
        { code: "MODULE_NOT_FOUND" }
    );
}

/**
 * Compile a JavaScript file.
 * This is used to compile only fixture files, so this is minimam.
 * @param {import("fs")} fs The file system.
 * @param {Object} stubs The stubs.
 * @param {string} filePath The path to a JavaScript file to compile.
 * @param {string} content The source code to compile.
 * @returns {any} The exported value.
 */
function compile(fs, stubs, filePath, content) {
    const code = `(function(exports, require, module, __filename, __dirname) { ${content} })`;
    const f = vm.runInContext(code, context);
    const exports = {};
    const module = { exports };

    f.call(
        exports,
        exports,
        request => {
            const modulePath = fsResolve(fs, request, filePath);
            const stub = stubs[modulePath];

            if (stub[ERRORED]) {
                throw stub[ERRORED];
            }
            return stub;
        },
        module,
        filePath,
        path.dirname(filePath)
    );

    return module.exports;
}

/**
 * Import a given file path in the given file system.
 * @param {import("fs")} fs The file system.
 * @param {Object} stubs The stubs.
 * @param {string} absolutePath Tha file path to import.
 * @returns {void}
 */
function fsImportFresh(fs, stubs, absolutePath) {
    if (absolutePath === ESLintAllPath) {
        return require(ESLintAllPath);
    }
    if (absolutePath === ESLintRecommendedPath) {
        return require(ESLintRecommendedPath);
    }

    if (fs.existsSync(absolutePath)) {
        return compile(
            fs,
            stubs,
            absolutePath,
            fs.readFileSync(absolutePath, "utf8")
        );
    }

    throw Object.assign(
        new Error(`Cannot find module '${absolutePath}'`),
        { code: "MODULE_NOT_FOUND" }
    );
}

/**
 * Define in-memory file system.
 * @param {Object} options The options.
 * @param {() => string} [options.cwd] The current working directory.
 * @param {Object} [options.files] The initial files definition in the in-memory file system.
 * @returns {import("fs")} The stubbed `ConfigArrayFactory` class.
 */
function defineInMemoryFs({
    cwd = process.cwd,
    files = {}
} = {}) {

    /**
     * The in-memory file system for this mock.
     * @type {import("fs")}
     */
    const fs = createFsFromVolume(new Volume());

    fs.mkdirSync(cwd(), { recursive: true });

    /*
     * Write all files to the in-memory file system and compile all JavaScript
     * files then set to `stubs`.
     */
    (function initFiles(directoryPath, definition) {
        for (const [filename, content] of Object.entries(definition)) {
            const filePath = path.resolve(directoryPath, filename);
            const parentPath = path.dirname(filePath);

            if (typeof content === "object") {
                initFiles(filePath, content);
            } else if (typeof content === "string") {
                if (!fs.existsSync(parentPath)) {
                    fs.mkdirSync(parentPath, { recursive: true });
                }
                fs.writeFileSync(filePath, content);
            } else {
                throw new Error(`Invalid content: ${typeof content}`);
            }
        }
    }(cwd(), files));

    return fs;
}

/**
 * Define stubbed `ConfigArrayFactory` class what uses the in-memory file system.
 * @param {Object} options The options.
 * @param {() => string} [options.cwd] The current working directory.
 * @param {Object} [options.files] The initial files definition in the in-memory file system.
 * @returns {{ fs: import("fs"), RelativeModuleResolver: import("../../lib/shared/relative-module-resolver"), ConfigArrayFactory: import("../../lib/cli-engine/config-array-factory")["ConfigArrayFactory"] }} The stubbed `ConfigArrayFactory` class.
 */
function defineConfigArrayFactoryWithInMemoryFileSystem({
    cwd = process.cwd,
    files = {}
} = {}) {
    const fs = defineInMemoryFs({ cwd, files });
    const RelativeModuleResolver = { resolve: fsResolve.bind(null, fs) };

    /*
     * Stubs for proxyquire.
     * This contains the JavaScript files in `options.files`.
     */
    const stubs = {};

    stubs.fs = fs;
    stubs["import-fresh"] = fsImportFresh.bind(null, fs, stubs);
    stubs["../shared/relative-module-resolver"] = RelativeModuleResolver;

    /*
     * Write all files to the in-memory file system and compile all JavaScript
     * files then set to `stubs`.
     */
    (function initFiles(directoryPath, definition) {
        for (const [filename, content] of Object.entries(definition)) {
            const filePath = path.resolve(directoryPath, filename);

            if (typeof content === "object") {
                initFiles(filePath, content);
                continue;
            }

            /*
             * Compile then stub if this file is a JavaScript file.
             * For parsers and plugins that `require()` will import.
             */
            if (path.extname(filePath) === ".js") {
                Object.defineProperty(stubs, filePath, {
                    configurable: true,
                    enumerable: true,
                    get() {
                        let stub;

                        try {
                            stub = compile(fs, stubs, filePath, content);
                        } catch (error) {
                            stub = { [ERRORED]: error };
                        }
                        Object.defineProperty(stubs, filePath, {
                            configurable: true,
                            enumerable: true,
                            value: stub
                        });

                        return stub;
                    }
                });
            }
        }
    }(cwd(), files));

    // Load the stubbed one.
    const { ConfigArrayFactory } = proxyquire(ConfigArrayFactoryPath, stubs);

    // Override the default cwd.
    return {
        fs,
        stubs,
        RelativeModuleResolver,
        ConfigArrayFactory: cwd === process.cwd
            ? ConfigArrayFactory
            : class extends ConfigArrayFactory {
                constructor(options) {
                    super({ cwd: cwd(), ...options });
                }
            }
    };
}

/**
 * Define stubbed `CascadingConfigArrayFactory` class what uses the in-memory file system.
 * @param {Object} options The options.
 * @param {() => string} [options.cwd] The current working directory.
 * @param {Object} [options.files] The initial files definition in the in-memory file system.
 * @returns {{ fs: import("fs"), RelativeModuleResolver: import("../../../lib/shared/relative-module-resolver"), ConfigArrayFactory: import("../../../lib/cli-engine/config-array-factory")["ConfigArrayFactory"], CascadingConfigArrayFactory: import("../../../lib/cli-engine/cascading-config-array-factory")["CascadingConfigArrayFactory"] }} The stubbed `CascadingConfigArrayFactory` class.
 */
function defineCascadingConfigArrayFactoryWithInMemoryFileSystem({
    cwd = process.cwd,
    files = {}
} = {}) {
    const { fs, stubs, RelativeModuleResolver, ConfigArrayFactory } =
           defineConfigArrayFactoryWithInMemoryFileSystem({ cwd, files });
    const loadRules = proxyquire(LoadRulesPath, stubs);
    const { CascadingConfigArrayFactory } =
        proxyquire(CascadingConfigArrayFactoryPath, {
            "./config-array-factory": { ConfigArrayFactory },
            "./load-rules": loadRules
        });

    // Override the default cwd.
    return {
        fs,
        RelativeModuleResolver,
        ConfigArrayFactory,
        CascadingConfigArrayFactory: cwd === process.cwd
            ? CascadingConfigArrayFactory
            : class extends CascadingConfigArrayFactory {
                constructor(options) {
                    super({ cwd: cwd(), ...options });
                }
            }
    };
}

/**
 * Define stubbed `FileEnumerator` class what uses the in-memory file system.
 * @param {Object} options The options.
 * @param {() => string} [options.cwd] The current working directory.
 * @param {Object} [options.files] The initial files definition in the in-memory file system.
 * @returns {{ fs: import("fs"), RelativeModuleResolver: import("../../../lib/shared/relative-module-resolver"), ConfigArrayFactory: import("../../../lib/cli-engine/config-array-factory")["ConfigArrayFactory"], CascadingConfigArrayFactory: import("../../../lib/cli-engine/cascading-config-array-factory")["CascadingConfigArrayFactory"], FileEnumerator: import("../../../lib/cli-engine/file-enumerator")["FileEnumerator"] }} The stubbed `FileEnumerator` class.
 */
function defineFileEnumeratorWithInMemoryFileSystem({
    cwd = process.cwd,
    files = {}
} = {}) {
    const {
        fs,
        RelativeModuleResolver,
        ConfigArrayFactory,
        CascadingConfigArrayFactory
    } =
        defineCascadingConfigArrayFactoryWithInMemoryFileSystem({ cwd, files });
    const { FileEnumerator } = proxyquire(FileEnumeratorPath, {
        fs,
        "./cascading-config-array-factory": { CascadingConfigArrayFactory }
    });

    // Override the default cwd.
    return {
        fs,
        RelativeModuleResolver,
        ConfigArrayFactory,
        CascadingConfigArrayFactory,
        FileEnumerator: cwd === process.cwd
            ? FileEnumerator
            : class extends FileEnumerator {
                constructor(options) {
                    super({ cwd: cwd(), ...options });
                }
            }
    };
}

/**
 * Define stubbed `CLIEngine` class what uses the in-memory file system.
 * @param {Object} options The options.
 * @param {() => string} [options.cwd] The current working directory.
 * @param {Object} [options.files] The initial files definition in the in-memory file system.
 * @returns {{ fs: import("fs"), RelativeModuleResolver: import("../../../lib/shared/relative-module-resolver"), ConfigArrayFactory: import("../../../lib/cli-engine/config-array-factory")["ConfigArrayFactory"], CascadingConfigArrayFactory: import("../../../lib/cli-engine/cascading-config-array-factory")["CascadingConfigArrayFactory"], FileEnumerator: import("../../../lib/cli-engine/file-enumerator")["FileEnumerator"], CLIEngine: import("../../../lib/cli-engine/cli-engine")["CLIEngine"], getCLIEngineInternalSlots: import("../../../lib/cli-engine/cli-engine")["getCLIEngineInternalSlots"] }} The stubbed `CLIEngine` class.
 */
function defineCLIEngineWithInMemoryFileSystem({
    cwd = process.cwd,
    files = {}
} = {}) {
    const {
        fs,
        RelativeModuleResolver,
        ConfigArrayFactory,
        CascadingConfigArrayFactory,
        FileEnumerator
    } =
        defineFileEnumeratorWithInMemoryFileSystem({ cwd, files });
    const { CLIEngine, getCLIEngineInternalSlots } = proxyquire(CLIEnginePath, {
        fs,
        "./cascading-config-array-factory": { CascadingConfigArrayFactory },
        "./file-enumerator": { FileEnumerator },
        "../shared/relative-module-resolver": RelativeModuleResolver
    });

    // Override the default cwd.
    return {
        fs,
        RelativeModuleResolver,
        ConfigArrayFactory,
        CascadingConfigArrayFactory,
        FileEnumerator,
        CLIEngine: cwd === process.cwd
            ? CLIEngine
            : class extends CLIEngine {
                constructor(options) {
                    super({ cwd: cwd(), ...options });
                }
            },
        getCLIEngineInternalSlots
    };
}

/**
 * Define stubbed `ESLint` class that uses the in-memory file system.
 * @param {Object} options The options.
 * @param {() => string} [options.cwd] The current working directory.
 * @param {Object} [options.files] The initial files definition in the in-memory file system.
 * @returns {{ fs: import("fs"), RelativeModuleResolver: import("../../lib/shared/relative-module-resolver"), ConfigArrayFactory: import("../../lib/cli-engine/config-array-factory")["ConfigArrayFactory"], CascadingConfigArrayFactory: import("../../lib/cli-engine/cascading-config-array-factory")["CascadingConfigArrayFactory"], FileEnumerator: import("../../lib/cli-engine/file-enumerator")["FileEnumerator"], ESLint: import("../../lib/eslint/eslint")["ESLint"], getCLIEngineInternalSlots: import("../../lib//eslint/eslint")["getESLintInternalSlots"] }} The stubbed `ESLint` class.
 */
function defineESLintWithInMemoryFileSystem({
    cwd = process.cwd,
    files = {}
} = {}) {
    const {
        fs,
        RelativeModuleResolver,
        ConfigArrayFactory,
        CascadingConfigArrayFactory,
        FileEnumerator,
        CLIEngine,
        getCLIEngineInternalSlots
    } = defineCLIEngineWithInMemoryFileSystem({ cwd, files });
    const { ESLint, getESLintPrivateMembers } = proxyquire(ESLintPath, {
        "../cli-engine/cli-engine": { CLIEngine, getCLIEngineInternalSlots }
    });

    // Override the default cwd.
    return {
        fs,
        RelativeModuleResolver,
        ConfigArrayFactory,
        CascadingConfigArrayFactory,
        FileEnumerator,
        CLIEngine,
        getCLIEngineInternalSlots,
        ESLint: cwd === process.cwd
            ? ESLint
            : class extends ESLint {
                constructor(options) {
                    super({ cwd: cwd(), ...options });
                }
            },
        getESLintPrivateMembers
    };
}

module.exports = {
    defineInMemoryFs,
    defineConfigArrayFactoryWithInMemoryFileSystem,
    defineCascadingConfigArrayFactoryWithInMemoryFileSystem,
    defineFileEnumeratorWithInMemoryFileSystem,
    defineCLIEngineWithInMemoryFileSystem,
    defineESLintWithInMemoryFileSystem
};
