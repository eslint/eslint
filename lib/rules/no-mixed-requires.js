/**
 * @fileoverview Rule to enforce grouped require statements for Node.JS
 * @author Raphael Pigulla
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {
    "use strict";

    var BUILTIN_MODULES = getBuiltinModules();

    var DECL_REQUIRE = "require",
        DECL_UNINITIALIZED = "uninitialized",
        DECL_OTHER = "other";

    var REQ_CORE = "core",
        REQ_FILE = "file",
        REQ_MODULE = "module",
        REQ_COMPUTED = "computed";

    /**
     * Determines the type of a declaration statement.
     * @param {ASTNode} initExpression The init node of the VariableDeclarator.
     * @returns {string}
     */
    function getDeclarationType(initExpression) {
        if (!initExpression) {
            // "var x;"
            return DECL_UNINITIALIZED;
        }

        if (initExpression.type === "CallExpression" &&
            initExpression.callee.type === "Identifier" &&
            initExpression.callee.name === "require"
        ) {
            // "var x = require('util');"
            return DECL_REQUIRE;
        } else if (initExpression.type === "MemberExpression") {
            // "var x = require('glob').Glob;"
            return getDeclarationType(initExpression.object);
        }

        // "var x = 42;"
        return DECL_OTHER;
    }

    /**
     * Determines the type of module that is loaded via require.
     * @param {ASTNode} initExpression The init node of the VariableDeclarator.
     * @returns {string}
     */
    function inferModuleType(initExpression) {
        if (initExpression.type === "MemberExpression") {
            // "var x = require('glob').Glob;"
            return inferModuleType(initExpression.object);
        } else if (initExpression["arguments"].length === 0) {
            // "var x = require();"
            return REQ_COMPUTED;
        }

        var arg = initExpression["arguments"][0];

        if (arg.type !== "Literal" || typeof arg.value !== "string") {
            // "var x = require(42);"
            return REQ_COMPUTED;
        }

        if (BUILTIN_MODULES.indexOf(arg.value) !== -1) {
            // "var fs = require('fs');"
            return REQ_CORE;
        } else if (/^\.{0,2}\//.test(arg.value)) {
            // "var utils = require('./utils');"
            return REQ_FILE;
        } else {
            // "var async = require('async');"
            return REQ_MODULE;
        }
    }

    /**
     * Returns the list of built-in modules.
     *
     * @returns {string[]}
     */
    function getBuiltinModules() {
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
     * Check if the list of variable declarations is mixed, i.e. whether it
     * contains both require and other declarations.
     * @param {ASTNode} declarations The list of VariableDeclarators.
     * @returns {boolean}
     */
    function isMixed(declarations) {
        var contains = {};

        declarations.forEach(function (declaration) {
            var type = getDeclarationType(declaration.init);
            contains[type] = true;
        });

        return contains[DECL_REQUIRE] &&
            (contains[DECL_UNINITIALIZED] || contains[DECL_OTHER]);
    }

    /**
     * Check if all require declarations in the given list are of the same
     * type.
     * @param {ASTNode} declarations The list of VariableDeclarators.
     * @returns {boolean}
     */
    function isGrouped(declarations) {
        var found = {};

        declarations.forEach(function (declaration) {
            found[inferModuleType(declaration.init)] = true;
        });

        return Object.keys(found).length <= 1;
    }


    return {

        "VariableDeclaration": function(node) {
            var grouping = !!context.options[0];

            if (isMixed(node.declarations)) {
                context.report(
                    node,
                    "Do not mix 'require' and other declarations."
                );
            } else if (grouping && !isGrouped(node.declarations)) {
                context.report(
                    node,
                    "Do not mix core, module, file and computed requires."
                );
            }
        }
    };

};
