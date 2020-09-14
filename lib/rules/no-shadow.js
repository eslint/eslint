/**
 * @fileoverview Rule to flag on declaring variables already declared in the outer scope
 * @author Ilya Volodin
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const astUtils = require("./utils/ast-utils");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        type: "suggestion",

        docs: {
            description: "disallow variable declarations from shadowing variables declared in the outer scope",
            category: "Variables",
            recommended: false,
            url: "https://eslint.org/docs/rules/no-shadow"
        },

        schema: [
            {
                type: "object",
                properties: {
                    builtinGlobals: { type: "boolean", default: false },
                    hoist: { enum: ["all", "functions", "never"], default: "functions" },
                    allow: {
                        type: "array",
                        items: {
                            type: "string"
                        }
                    }
                },
                additionalProperties: false
            }
        ],

        messages: {
            noShadow: "'{{name}}' is already declared in the upper scope."
        }
    },

    create(context) {

        const options = {
            builtinGlobals: context.options[0] && context.options[0].builtinGlobals,
            hoist: (context.options[0] && context.options[0].hoist) || "functions",
            allow: (context.options[0] && context.options[0].allow) || []
        };

        /**
         * Check if variable name is allowed.
         * @param  {ASTNode} variable The variable to check.
         * @returns {boolean} Whether or not the variable name is allowed.
         */
        function isAllowed(variable) {
            return options.allow.indexOf(variable.name) !== -1;
        }

        /**
         * Checks if a variable of the class name in the class scope of ClassDeclaration.
         *
         * ClassDeclaration creates two variables of its name into its outer scope and its class scope.
         * So we should ignore the variable in the class scope.
         * @param {Object} variable The variable to check.
         * @returns {boolean} Whether or not the variable of the class name in the class scope of ClassDeclaration.
         */
        function isDuplicatedClassNameVariable(variable) {
            const block = variable.scope.block;

            return block.type === "ClassDeclaration" && block.id === variable.identifiers[0];
        }

        /**
         * Checks if a variable is inside the initializer of scopeVar.
         *
         * To avoid reporting at declarations such as `var a = function a() {};`.
         * But it should report `var a = function(a) {};` or `var a = function() { function a() {} };`.
         * @param {Object} variable The variable to check.
         * @param {Object} scopeVar The scope variable to look for.
         * @returns {boolean} Whether or not the variable is inside initializer of scopeVar.
         */
        function isOnInitializer(variable, scopeVar) {
            const outerScope = scopeVar.scope;
            const outerDef = scopeVar.defs[0];
            const outer = outerDef && outerDef.parent && outerDef.parent.range;
            const innerScope = variable.scope;
            const innerDef = variable.defs[0];
            const inner = innerDef && innerDef.name.range;

            return (
                outer &&
                inner &&
                outer[0] < inner[0] &&
                inner[1] < outer[1] &&
                ((innerDef.type === "FunctionName" && innerDef.node.type === "FunctionExpression") || innerDef.node.type === "ClassExpression") &&
                outerScope === innerScope.upper
            );
        }

        /**
         * Get a range of a variable's identifier node.
         * @param {Object} variable The variable to get.
         * @returns {Array|undefined} The range of the variable's identifier node.
         */
        function getNameRange(variable) {
            const def = variable.defs[0];

            return def && def.name.range;
        }

        /**
         * Checks if a variable is in TDZ of scopeVar.
         * @param {Object} variable The variable to check.
         * @param {Object} scopeVar The variable of TDZ.
         * @returns {boolean} Whether or not the variable is in TDZ of scopeVar.
         */
        function isInTdz(variable, scopeVar) {
            const outerDef = scopeVar.defs[0];
            const inner = getNameRange(variable);
            const outer = getNameRange(scopeVar);

            return (
                inner &&
                outer &&
                inner[1] < outer[0] &&

                // Excepts FunctionDeclaration if is {"hoist":"function"}.
                (options.hoist !== "functions" || !outerDef || outerDef.node.type !== "FunctionDeclaration")
            );
        }

        /**
         * Traverse `node`s heirarchy up to level and check if the range is the same
         * @param {Object} surroundingNode The node around `node`
         * @param {Object} node The node suspected of shadowing
         * @param {number} level At what level in the parent hierarchy to check
         * @returns {boolean} Whether or not they have the same range
         */
        function hasSameRange(surroundingNode, node, level) {
            let parent = node;

            for (let i = 0; i < level; i++) {
                parent = parent.parent;
                if (!parent) {
                    return false;
                }
            }

            if (
                surroundingNode.range[0] === parent.range[0] &&
                surroundingNode.range[1] === parent.range[1]
            ) {
                return true;
            }

            return false;
        }

        /**
         * Checks whether the shadowing variable practically shadows
         * @param {Object} shadowedVar The node being shadowed
         * @param {Object} shadowingVar The node shadowing `shadowedVar`
         * @returns {boolean} Whether or not the `shadowingVar` is practically inaccessible in the scope of shadowedVar
         */
        function isInaccessible(shadowedVar, shadowingVar) {
            if (!(shadowedVar.defs[0] && shadowingVar.defs[0])) {
                return false;
            }

            const shadowedNode = shadowedVar.defs[0].node;
            const shadowNode = shadowingVar.defs[0].node;

            // Skip variable declaration
            if (shadowedNode.type === "VariableDeclarator") {
                if (shadowNode.type === "ArrowFunctionExpression" || shadowNode.type === "FunctionDeclaration") {
                    if (

                        // a = (a) => ...
                        (shadowNode.parent.type !== "BlockStatement" &&
                            hasSameRange(shadowedNode, shadowNode, 2)) ||

                        // a = [].map(a => ...)
                        hasSameRange(shadowedNode, shadowNode, 4) ||
                        hasSameRange(shadowedNode, shadowNode, 5)
                    ) {
                        return true;
                    }
                } else if (shadowNode.type === "VariableDeclarator" && shadowNode.parent.kind !== "var") {

                    // Inaccesible declaration eg. const { a } = (() => { const a = ...; return a })()
                    if (hasSameRange(shadowedNode, shadowNode, 5)) {
                        return true;
                    }
                }
            }

            // Skip function param declaration eg. function func(a = [].find(a => true)) {}
            if (
                shadowedNode.type === "FunctionDeclaration" &&
                (shadowNode.type === "ArrowFunctionExpression" || shadowNode.type === "FunctionDeclaration")
            ) {
                if (hasSameRange(shadowedNode, shadowNode, 3)) {
                    return true;
                }
            }


            // Skip for loop context eg. for (const a of [].find(a => true)) {}
            if (
                shadowedNode.parent && shadowedNode.parent.parent &&
                (shadowedNode.parent.parent.type === "ForOfStatement" || shadowedNode.parent.parent.type === "ForInStatement") &&

                shadowNode.parent && shadowNode.parent.parent &&
                (shadowNode.parent.parent.type === "ForOfStatement" || shadowNode.parent.parent.type === "ForInStatement")
            ) {
                if (hasSameRange(shadowedNode.parent.parent, shadowNode, 2)) {
                    return true;
                }
            }

            return false;
        }

        /**
         * Checks the current context for shadowed variables.
         * @param {Scope} scope Fixme
         * @returns {void}
         */
        function checkForShadows(scope) {
            const variables = scope.variables;

            for (let i = 0; i < variables.length; ++i) {
                const variable = variables[i];

                // Skips "arguments" or variables of a class name in the class scope of ClassDeclaration.
                if (variable.identifiers.length === 0 ||
                    isDuplicatedClassNameVariable(variable) ||
                    isAllowed(variable)
                ) {
                    continue;
                }

                // Gets shadowed variable.
                const shadowed = astUtils.getVariableByName(scope.upper, variable.name);

                if (shadowed &&
                    (shadowed.identifiers.length > 0 || (options.builtinGlobals && "writeable" in shadowed)) &&
                    !isOnInitializer(variable, shadowed) &&
                    !(options.hoist !== "all" && isInTdz(variable, shadowed))
                ) {
                    if (isInaccessible(shadowed, variable)) {
                        continue;
                    }

                    context.report({
                        node: variable.identifiers[0],
                        messageId: "noShadow",
                        data: variable
                    });
                }
            }
        }

        return {
            "Program:exit"() {
                const globalScope = context.getScope();
                const stack = globalScope.childScopes.slice();

                while (stack.length) {
                    const scope = stack.pop();

                    stack.push(...scope.childScopes);
                    checkForShadows(scope);
                }
            }
        };

    }
};
