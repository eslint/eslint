/**
 * @fileoverview A rule to disallow duplicate name in class members.
 * @author Toru Nagashima
 */

"use strict";

const astUtils = require("./utils/ast-utils");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const initialState = Object.freeze({ method: false, get: false, set: false, field: false });

module.exports = {
    meta: {
        type: "problem",

        docs: {
            description: "disallow duplicate class members",
            recommended: true,
            url: "https://eslint.org/docs/rules/no-dupe-class-members"
        },

        schema: [],

        messages: {
            unexpected: "Duplicate name '{{name}}'."
        }
    },

    create(context) {
        let stack = [];

        /**
         * Gets state of a given member name.
         * @param {string} name A name of a member.
         * @param {boolean} isStatic A flag which specifies that is a static member.
         * @returns {Object} A state of a given member name.
         *   - retv.init {boolean} A flag which shows the name is declared as normal member.
         *   - retv.get {boolean} A flag which shows the name is declared as getter.
         *   - retv.set {boolean} A flag which shows the name is declared as setter.
         */
        function getState(name, isStatic) {
            const stateMap = stack[stack.length - 1];
            const key = `$${name}`; // to avoid "__proto__".

            if (!stateMap[key]) {
                stateMap[key] = {
                    nonStatic: Object.assign(Object.create(null), initialState),
                    static: Object.assign(Object.create(null), initialState)
                };
            }

            return stateMap[key][isStatic ? "static" : "nonStatic"];
        }

        return {

            // Initializes the stack of state of member declarations.
            Program() {
                stack = [];
            },

            // Initializes state of member declarations for the class.
            ClassBody() {
                stack.push(Object.create(null));
            },

            // Disposes the state for the class.
            "ClassBody:exit"() {
                stack.pop();
            },

            // Reports the node if its name has been declared already.
            "MethodDefinition, PropertyDefinition"(node) {
                const name = astUtils.getStaticPropertyName(node);
                let kind = null;

                if (node.type === "MethodDefinition") {
                    ({ kind } = node);
                } else if (node.type === "PropertyDefinition") {
                    kind = "field";
                }

                if (name === null || kind === null || kind === "constructor") {
                    return;
                }

                const isStatic = node.static;
                const state = getState(name, isStatic);
                let isDuplicate = false;

                switch (kind) {
                    case "method":
                        isDuplicate = (
                            state.method ||
                            state.get ||
                            state.set ||
                            (isStatic && state.field)
                        );
                        break;

                    case "get":
                        isDuplicate = (
                            state.method ||
                            state.get ||
                            (isStatic && state.field)
                        );
                        break;

                    case "set":
                        isDuplicate = (
                            state.method ||
                            state.set ||
                            (isStatic && state.field)
                        );
                        break;

                    case "field":
                        isDuplicate = (
                            (
                                isStatic &&
                                (
                                    state.method ||
                                    state.get ||
                                    state.set
                                )
                            ) ||
                            state.field
                        );
                        break;

                    // no default
                }

                if (isDuplicate) {
                    context.report({ node, messageId: "unexpected", data: { name } });
                }

                state[kind] = true;
            }
        };
    }
};
