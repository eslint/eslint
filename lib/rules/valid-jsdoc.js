/**
 * @fileoverview Validates JSDoc comments are syntactically correct
 * @author Nicholas C. Zakas
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var doctrine = require("doctrine");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    //--------------------------------------------------------------------------
    // Helpers
    //--------------------------------------------------------------------------

    function checkJSDoc(node) {
        var jsdocNode = context.getJSDocComment(node),
            hasReturns = false,
            hasConstructor = false,
            params = Object.create(null),
            jsdoc;

        // make sure only to validate JSDoc comments
        if (jsdocNode) {

            try {
                jsdoc = doctrine.parse(jsdocNode.value, {
                    strict: true,
                    unwrap: true,
                    sloppy: true
                });
            } catch (ex) {

                if (/braces/i.test(ex.message)) {
                    context.report(jsdocNode, "JSDoc type missing brace.");
                } else {
                    context.report(jsdocNode, "JSDoc syntax error.");
                }

                return;
            }

            jsdoc.tags.forEach(function(tag) {

                switch (tag.title) {

                    case "param":
                        if (!tag.type) {
                            context.report(jsdocNode, "Missing JSDoc parameter type for '{{name}}'.", { name: tag.name });
                        }

                        if (!tag.description) {
                            context.report(jsdocNode, "Missing JSDoc parameter description for '{{name}}'.", { name: tag.name });
                        }

                        if (params[tag.name]) {
                            context.report(jsdocNode, "Duplicate JSDoc parameter '{{name}}'.", { name: tag.name });
                        } else {
                            params[tag.name] = 1;
                        }
                        break;

                    case "return":
                        hasReturns = true;
                        context.report(jsdocNode, "Use @returns instead.");
                        break;

                    case "returns":
                        hasReturns = true;
                        if (!tag.type) {
                            context.report(jsdocNode, "Missing JSDoc return type.");
                        }

                        if (tag.type.name !== "void" && !tag.description) {
                            context.report(jsdocNode, "Missing JSDoc return description.");
                        }
                        break;

                    case "constructor":
                        hasConstructor = true;
                        break;

                }

            });

            // check for functions missing @returns
            if (!hasReturns && !hasConstructor) {
                context.report(jsdocNode, "Missing JSDoc @returns for function.");
            }

            // check the parameters
            var jsdocParams = Object.keys(params);

            node.params.forEach(function(param, i) {
                var name = param.name;

                if (jsdocParams[i] && (name !== jsdocParams[i])) {
                    context.report(jsdocNode, "Expected JSDoc for '{{name}}' but found '{{jsdocName}}'.", {
                        name: name,
                        jsdocName: jsdocParams[i]
                    });
                } else if (!params[name]) {
                    context.report(jsdocNode, "Missing JSDoc for parameter '{{name}}'.", {
                        name: name
                    });
                }
            });

        }

    }

    //--------------------------------------------------------------------------
    // Public
    //--------------------------------------------------------------------------

    return {
        "FunctionExpression": checkJSDoc,
        "FunctionDeclaration": checkJSDoc
    };

};
