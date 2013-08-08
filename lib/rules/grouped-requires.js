/**
 * @fileoverview Rule to enforce grouped and ordered require statements for
 * Node.JS.
 * @author Raphael Pigulla
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {
    "use strict";

    var PATH_SEP = "/";

    var BUILTIN_MODULES = getBuiltInModules();

    var REQUIRE_UNKNOWN = "require_unknown",
        REQUIRE_CORE = "require_core",
        REQUIRE_FILE = "require_file",
        REQUIRE_MODULE = "require_module",
        UNINITIALIZED = "uninitialized",
        OTHER = "other";

    var DEPTH_RELEVANT_NODES = [
        "Program", "FunctionExpression", "FunctionDeclaration",
        "LetStatement", "ArrowExpression" // future-proof the rule :)
    ];

    /**
     * Returns the list of built-in modules.
     *
     * @returns {string[]}
     */
    function getBuiltInModules() {
        if (process.version.match(/^v0\.[0-7]\./)) {
            // The _builtinLibs property we use below was added in 0.8 so we
            // can't use it here and fall back to a hardcoded list of modules.
            return [
                "assert", "buffer", "child_process", "cluster", "crypto",
                "dgram", "dns", "events", "fs", "http", "https", "net", "os",
                "path", "querystring", "readline", "repl", "stream", "tls",
                "tty", "url", "util", "vm", "zlib"
            ];
        } else {
            return require("repl")._builtinLibs;
        }
    }

    /**
     * Determines the type of module that is being loaded.
     * @param {string} str The string parameter to the "require" call.
     * @returns {string}
     */
    function getRequireDeclarationType(str) {
        if (BUILTIN_MODULES.indexOf(str) !== -1) {
            return REQUIRE_CORE;
        } else if (/^\.{0,2}\//.test(str)) {
            return REQUIRE_FILE;
        } else {
            return REQUIRE_MODULE;
        }
    }

    /**
     * Determines the type of a require statement.
     * @param {ASTNode} expression The init node of the VariableDeclarator.
     * @returns {Object}
     */
    function getRequireType(expression) {
        var result = {
                type: null,
                module: null
            };

        if (!expression) {
            // "var x;"
            result.type = UNINITIALIZED;
            return result;
        }

        var exprArgs = expression["arguments"];

        if (expression.type === "CallExpression" &&
            expression.callee.type === "Identifier" &&
            expression.callee.name === "require" &&
            exprArgs.length > 0
        ) {
            if (expression["arguments"][0].type !== "Literal") {
                // "var x = require('foo' + 'bar');"
                result.type = REQUIRE_UNKNOWN;
            } else {
                // "var x = require('foo');"
                result.type = getRequireDeclarationType(exprArgs[0].value);
                result.module = exprArgs[0].value;
            }
            return result;

        } else if (expression.type === "MemberExpression") {
            // "var x = require('glob').Glob;"
            return getRequireType(expression.object);
        }

        result.type = OTHER;
        return result;
    }

    /**
     * Returns an object indexed by declaration types where each type that
     * occurs has the property for its corresponding key set to true.
     * @param {Object[]} requireDeclarations
     * An array of require declarations as returned by getRequireType().
     * @returns {Object}
     */
    function getRequireComposition(requireDeclarations) {
        var result = {};

        result[REQUIRE_UNKNOWN] = false;
        result[REQUIRE_CORE] = false;
        result[REQUIRE_FILE] = false;
        result[REQUIRE_MODULE] = false;
        result[UNINITIALIZED] = false;
        result[OTHER] = false;

        requireDeclarations.forEach(function (declaration) {
            result[declaration.type] = true;
        });

        return result;
    }

    /**
     * Returns the name of the first wrongly sorted module or false if the
     * sorting is correct.
     * @param {Object[]} declarations
     * An array of require declarations as returned by getRequireType().
     * @returns {string|boolean}
     */
    function getFirstWronglySortedDeclaration(declarations) {
        function comparator(a, b) {
            return a.toLocaleLowerCase().localeCompare(b.toLocaleLowerCase());
        }

        function compare(a, b) {
            if (a.length && b.length) {
                return comparator(a[0], b[0]) ||
                    compare(a.slice(1), b.slice(1));
            } else {
                return a.length - b.length;
            }
        }

        var i, aParts, bParts;

        for (i = 1; i < declarations.length; i++) {
            aParts = declarations[i - 1].module.split(PATH_SEP);
            bParts = declarations[i].module.split(PATH_SEP);

            if (compare(aParts, bParts) > 0) {
                return declarations[i].module;
            }
        }

        return false;
    }

    return {

        "VariableDeclaration": function(node) {
            var opts = context.options[0] || {};

            if (!opts.hasOwnProperty("maxDepth")) {
                opts.maxDepth = 1;
            }

            var enforceSorted = !!opts.enforceSorted,
                allowUnknown = !!opts.allowUnknown,
                maxDepth = opts.maxDepth === 0 ? Infinity : opts.maxDepth;

            var depth = context.getAncestors().filter(function (ancestor) {
                    return DEPTH_RELEVANT_NODES.indexOf(ancestor.type) !== -1;
                }).length;

            if (depth > maxDepth) {
                return;
            }

            var declarations = node.declarations.map(function (declaration) {
                    return getRequireType(declaration.init);
                }),
                contains = getRequireComposition(declarations),
                containsRequire =
                    contains[REQUIRE_CORE] ||
                    contains[REQUIRE_MODULE] ||
                    contains[REQUIRE_FILE] ||
                    contains[REQUIRE_UNKNOWN],
                containsOther =
                    contains[UNINITIALIZED] ||
                    contains[OTHER],
                containsRequireOnly =
                    containsRequire && !containsOther &&
                    (allowUnknown || !contains[REQUIRE_UNKNOWN]),
                isRequiresMixed =
                    // Yes, we're adding booleans. But it works really nicely
                    // in this situation.
                    contains[REQUIRE_CORE] +
                    contains[REQUIRE_FILE] +
                    contains[REQUIRE_MODULE] > 1;

            if (containsRequire && containsOther) {
                context.report(
                    node,
                    "Do not mix 'require' and other declarations."
                );
            } else if (!allowUnknown && contains[REQUIRE_UNKNOWN]) {
                context.report(
                    node,
                    "Only use string literals as parameters for require()."
                );
            } else if (isRequiresMixed) {
                context.report(
                    node,
                    "Do not mix core, module and file requires."
                );
            } else if (enforceSorted && containsRequireOnly) {
                var knownDecls = declarations.filter(function (declaration) {
                        return declaration.type !== REQUIRE_UNKNOWN;
                    }),
                    unsorted = getFirstWronglySortedDeclaration(knownDecls);

                if (unsorted) {
                    context.report(
                        node,
                        "The require statement '{{module}}' is not " +
                            "sorted alphabetically.",
                        { module: unsorted }
                    );
                }
            }
        }
    };

};
