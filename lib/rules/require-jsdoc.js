/**
 * @fileoverview Rule to check for jsdoc presence.
 * @author Gyandeep Singh
 */
"use strict";

var lodash = require("lodash");

module.exports = function(context) {
    var source = context.getSourceCode();
    var DEFAULT_OPTIONS = {
        "FunctionDeclaration": true,
        "MethodDefinition": false,
        "ClassDeclaration": false
    };
    var options = context.options[0] || {};
    var includes = lodash.assign(DEFAULT_OPTIONS, options.require || {});

    var ignoreGetters = options.ignoreGetters || false;
    var ignoreSetters = options.ignoreSetters || false;

    /**
     * Report the error message
     * @param {ASTNode} node node to report
     * @returns {void}
     */
    function report(node) {
        context.report(node, "Missing JSDoc comment.");
    }

    /**
     * Check if the jsdoc comment is present for class methods
     * @param {ASTNode} node node to examine
     * @returns {void}
     */
    function checkClassMethodJsDoc(node) {
        if (node.parent.type === "MethodDefinition") {
            var kind = node.parent.kind;

            if (ignoreGetters && kind === "get") {
                return;
            }

            if (ignoreSetters && kind === "set") {
                return;
            }

            var jsdocComment = source.getJSDocComment(node);

            if (!jsdocComment) {
                report(node);
            }
        }
    }

    /**
     * Check if the jsdoc comment is present or not.
     * @param {ASTNode} node node to examine
     * @returns {void}
     */
    function checkJsDoc(node) {
        var jsdocComment = source.getJSDocComment(node);

        if (!jsdocComment) {
            report(node);
        }
    }

    return {
        "FunctionDeclaration": function(node) {
            if (includes.FunctionDeclaration) {
                checkJsDoc(node);
            }
        },
        "FunctionExpression": function(node) {
            if (includes.MethodDefinition) {
                checkClassMethodJsDoc(node);
            }
        },
        "ClassDeclaration": function(node) {
            if (includes.ClassDeclaration) {
                checkJsDoc(node);
            }
        }
    };
};

module.exports.schema = [
    {
        "type": "object",
        "properties": {
            "require": {
                "type": "object",
                "properties": {
                    "ClassDeclaration": {
                        "type": "boolean"
                    },
                    "MethodDefinition": {
                        "type": "boolean"
                    },
                    "FunctionDeclaration": {
                        "type": "boolean"
                    }
                },
                "additionalProperties": false
            },
            "ignoreGetters": {
                "type": "boolean"
            },
            "ignoreSetters": {
                "type": "boolean"
            }
        },
        "additionalProperties": false
    }
];
