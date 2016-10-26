/**
 * @fileoverview Common utils for AST.
 * @author Gyandeep Singh
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const esutils = require("esutils");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

const anyFunctionPattern = /^(?:Function(?:Declaration|Expression)|ArrowFunctionExpression)$/;
const anyLoopPattern = /^(?:DoWhile|For|ForIn|ForOf|While)Statement$/;
const arrayOrTypedArrayPattern = /Array$/;
const arrayMethodPattern = /^(?:every|filter|find|findIndex|forEach|map|some)$/;
const bindOrCallOrApplyPattern = /^(?:bind|call|apply)$/;
const breakableTypePattern = /^(?:(?:Do)?While|For(?:In|Of)?|Switch)Statement$/;
const thisTagPattern = /^[\s*]*@this/m;

/**
 * Checks reference if is non initializer and writable.
 * @param {Reference} reference - A reference to check.
 * @param {int} index - The index of the reference in the references.
 * @param {Reference[]} references - The array that the reference belongs to.
 * @returns {boolean} Success/Failure
 * @private
 */
function isModifyingReference(reference, index, references) {
    const identifier = reference.identifier;

    /*
     * Destructuring assignments can have multiple default value, so
     * possibly there are multiple writeable references for the same
     * identifier.
     */
    const modifyingDifferentIdentifier = index === 0 ||
        references[index - 1].identifier !== identifier;

    return (identifier &&
        reference.init === false &&
        reference.isWrite() &&
        modifyingDifferentIdentifier
    );
}

/**
 * Checks whether the given string starts with uppercase or not.
 *
 * @param {string} s - The string to check.
 * @returns {boolean} `true` if the string starts with uppercase.
 */
function startsWithUpperCase(s) {
    return s[0] !== s[0].toLocaleLowerCase();
}

/**
 * Checks whether or not a node is a constructor.
 * @param {ASTNode} node - A function node to check.
 * @returns {boolean} Wehether or not a node is a constructor.
 */
function isES5Constructor(node) {
    return (node.id && startsWithUpperCase(node.id.name));
}

/**
 * Finds a function node from ancestors of a node.
 * @param {ASTNode} node - A start node to find.
 * @returns {Node|null} A found function node.
 */
function getUpperFunction(node) {
    while (node) {
        if (anyFunctionPattern.test(node.type)) {
            return node;
        }
        node = node.parent;
    }
    return null;
}

/**
 * Checks whether or not a node is `null` or `undefined`.
 * @param {ASTNode} node - A node to check.
 * @returns {boolean} Whether or not the node is a `null` or `undefined`.
 * @public
 */
function isNullOrUndefined(node) {
    return (
        (node.type === "Literal" && node.value === null) ||
        (node.type === "Identifier" && node.name === "undefined") ||
        (node.type === "UnaryExpression" && node.operator === "void")
    );
}

/**
 * Checks whether or not a node is callee.
 * @param {ASTNode} node - A node to check.
 * @returns {boolean} Whether or not the node is callee.
 */
function isCallee(node) {
    return node.parent.type === "CallExpression" && node.parent.callee === node;
}

/**
 * Checks whether or not a node is `Reclect.apply`.
 * @param {ASTNode} node - A node to check.
 * @returns {boolean} Whether or not the node is a `Reclect.apply`.
 */
function isReflectApply(node) {
    return (
        node.type === "MemberExpression" &&
        node.object.type === "Identifier" &&
        node.object.name === "Reflect" &&
        node.property.type === "Identifier" &&
        node.property.name === "apply" &&
        node.computed === false
    );
}

/**
 * Checks whether or not a node is `Array.from`.
 * @param {ASTNode} node - A node to check.
 * @returns {boolean} Whether or not the node is a `Array.from`.
 */
function isArrayFromMethod(node) {
    return (
        node.type === "MemberExpression" &&
        node.object.type === "Identifier" &&
        arrayOrTypedArrayPattern.test(node.object.name) &&
        node.property.type === "Identifier" &&
        node.property.name === "from" &&
        node.computed === false
    );
}

/**
 * Checks whether or not a node is a method which has `thisArg`.
 * @param {ASTNode} node - A node to check.
 * @returns {boolean} Whether or not the node is a method which has `thisArg`.
 */
function isMethodWhichHasThisArg(node) {
    while (node) {
        if (node.type === "Identifier") {
            return arrayMethodPattern.test(node.name);
        }
        if (node.type === "MemberExpression" && !node.computed) {
            node = node.property;
            continue;
        }

        break;
    }

    return false;
}

/**
 * Checks whether or not a node has a `@this` tag in its comments.
 * @param {ASTNode} node - A node to check.
 * @param {SourceCode} sourceCode - A SourceCode instance to get comments.
 * @returns {boolean} Whether or not the node has a `@this` tag in its comments.
 */
function hasJSDocThisTag(node, sourceCode) {
    const jsdocComment = sourceCode.getJSDocComment(node);

    if (jsdocComment && thisTagPattern.test(jsdocComment.value)) {
        return true;
    }

    // Checks `@this` in its leading comments for callbacks,
    // because callbacks don't have its JSDoc comment.
    // e.g.
    //     sinon.test(/* @this sinon.Sandbox */function() { this.spy(); });
    return sourceCode.getComments(node).leading.some(function(comment) {
        return thisTagPattern.test(comment.value);
    });
}

/**
 * Determines if a node is surrounded by parentheses.
 * @param {SourceCode} sourceCode The ESLint source code object
 * @param {ASTNode} node The node to be checked.
 * @returns {boolean} True if the node is parenthesised.
 * @private
 */
function isParenthesised(sourceCode, node) {
    const previousToken = sourceCode.getTokenBefore(node),
        nextToken = sourceCode.getTokenAfter(node);

    return Boolean(previousToken && nextToken) &&
        previousToken.value === "(" && previousToken.range[1] <= node.range[0] &&
        nextToken.value === ")" && nextToken.range[0] >= node.range[1];
}

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

module.exports = {

    /**
     * Determines whether two adjacent tokens are on the same line.
     * @param {Object} left - The left token object.
     * @param {Object} right - The right token object.
     * @returns {boolean} Whether or not the tokens are on the same line.
     * @public
     */
    isTokenOnSameLine(left, right) {
        return left.loc.end.line === right.loc.start.line;
    },

    isNullOrUndefined,
    isCallee,
    isES5Constructor,
    getUpperFunction,
    isArrayFromMethod,
    isParenthesised,

    /**
     * Checks whether or not a given node is a string literal.
     * @param {ASTNode} node - A node to check.
     * @returns {boolean} `true` if the node is a string literal.
     */
    isStringLiteral(node) {
        return (
            (node.type === "Literal" && typeof node.value === "string") ||
            node.type === "TemplateLiteral"
        );
    },

    /**
     * Checks whether a given node is a breakable statement or not.
     * The node is breakable if the node is one of the following type:
     *
     * - DoWhileStatement
     * - ForInStatement
     * - ForOfStatement
     * - ForStatement
     * - SwitchStatement
     * - WhileStatement
     *
     * @param {ASTNode} node - A node to check.
     * @returns {boolean} `true` if the node is breakable.
     */
    isBreakableStatement(node) {
        return breakableTypePattern.test(node.type);
    },

    /**
     * Gets the label if the parent node of a given node is a LabeledStatement.
     *
     * @param {ASTNode} node - A node to get.
     * @returns {string|null} The label or `null`.
     */
    getLabel(node) {
        if (node.parent.type === "LabeledStatement") {
            return node.parent.label.name;
        }
        return null;
    },

    /**
     * Gets references which are non initializer and writable.
     * @param {Reference[]} references - An array of references.
     * @returns {Reference[]} An array of only references which are non initializer and writable.
     * @public
     */
    getModifyingReferences(references) {
        return references.filter(isModifyingReference);
    },

    /**
     * Validate that a string passed in is surrounded by the specified character
     * @param  {string} val The text to check.
     * @param  {string} character The character to see if it's surrounded by.
     * @returns {boolean} True if the text is surrounded by the character, false if not.
     * @private
     */
    isSurroundedBy(val, character) {
        return val[0] === character && val[val.length - 1] === character;
    },

    /**
     * Returns whether the provided node is an ESLint directive comment or not
     * @param {LineComment|BlockComment} node The node to be checked
     * @returns {boolean} `true` if the node is an ESLint directive comment
     */
    isDirectiveComment(node) {
        const comment = node.value.trim();

        return (
            node.type === "Line" && comment.indexOf("eslint-") === 0 ||
            node.type === "Block" && (
                comment.indexOf("global ") === 0 ||
                comment.indexOf("eslint ") === 0 ||
                comment.indexOf("eslint-") === 0
            )
        );
    },

    /**
     * Gets the trailing statement of a given node.
     *
     *     if (code)
     *         consequent;
     *
     * When taking this `IfStatement`, returns `consequent;` statement.
     *
     * @param {ASTNode} A node to get.
     * @returns {ASTNode|null} The trailing statement's node.
     */
    getTrailingStatement: esutils.ast.trailingStatement,

    /**
     * Finds the variable by a given name in a given scope and its upper scopes.
     *
     * @param {escope.Scope} initScope - A scope to start find.
     * @param {string} name - A variable name to find.
     * @returns {escope.Variable|null} A found variable or `null`.
     */
    getVariableByName(initScope, name) {
        let scope = initScope;

        while (scope) {
            const variable = scope.set.get(name);

            if (variable) {
                return variable;
            }

            scope = scope.upper;
        }

        return null;
    },

    /**
     * Checks whether or not a given function node is the default `this` binding.
     *
     * First, this checks the node:
     *
     * - The function name does not start with uppercase (it's a constructor).
     * - The function does not have a JSDoc comment that has a @this tag.
     *
     * Next, this checks the location of the node.
     * If the location is below, this judges `this` is valid.
     *
     * - The location is not on an object literal.
     * - The location is not assigned to a variable which starts with an uppercase letter.
     * - The location is not on an ES2015 class.
     * - Its `bind`/`call`/`apply` method is not called directly.
     * - The function is not a callback of array methods (such as `.forEach()`) if `thisArg` is given.
     *
     * @param {ASTNode} node - A function node to check.
     * @param {SourceCode} sourceCode - A SourceCode instance to get comments.
     * @returns {boolean} The function node is the default `this` binding.
     */
    isDefaultThisBinding(node, sourceCode) {
        if (isES5Constructor(node) || hasJSDocThisTag(node, sourceCode)) {
            return false;
        }
        const isAnonymous = node.id === null;

        while (node) {
            const parent = node.parent;

            switch (parent.type) {

                /*
                 * Looks up the destination.
                 * e.g., obj.foo = nativeFoo || function foo() { ... };
                 */
                case "LogicalExpression":
                case "ConditionalExpression":
                    node = parent;
                    break;

                // If the upper function is IIFE, checks the destination of the return value.
                // e.g.
                //   obj.foo = (function() {
                //     // setup...
                //     return function foo() { ... };
                //   })();
                case "ReturnStatement": {
                    const func = getUpperFunction(parent);

                    if (func === null || !isCallee(func)) {
                        return true;
                    }
                    node = func.parent;
                    break;
                }

                // e.g.
                //   var obj = { foo() { ... } };
                //   var obj = { foo: function() { ... } };
                //   class A { constructor() { ... } }
                //   class A { foo() { ... } }
                //   class A { get foo() { ... } }
                //   class A { set foo() { ... } }
                //   class A { static foo() { ... } }
                case "Property":
                case "MethodDefinition":
                    return parent.value !== node;

                // e.g.
                //   obj.foo = function foo() { ... };
                //   Foo = function() { ... };
                //   [obj.foo = function foo() { ... }] = a;
                //   [Foo = function() { ... }] = a;
                case "AssignmentExpression":
                case "AssignmentPattern":
                    if (parent.right === node) {
                        if (parent.left.type === "MemberExpression") {
                            return false;
                        }
                        if (isAnonymous &&
                            parent.left.type === "Identifier" &&
                            startsWithUpperCase(parent.left.name)
                        ) {
                            return false;
                        }
                    }
                    return true;

                // e.g.
                //   var Foo = function() { ... };
                case "VariableDeclarator":
                    return !(
                        isAnonymous &&
                        parent.init === node &&
                        parent.id.type === "Identifier" &&
                        startsWithUpperCase(parent.id.name)
                    );

                // e.g.
                //   var foo = function foo() { ... }.bind(obj);
                //   (function foo() { ... }).call(obj);
                //   (function foo() { ... }).apply(obj, []);
                case "MemberExpression":
                    return (
                        parent.object !== node ||
                        parent.property.type !== "Identifier" ||
                        !bindOrCallOrApplyPattern.test(parent.property.name) ||
                        !isCallee(parent) ||
                        parent.parent.arguments.length === 0 ||
                        isNullOrUndefined(parent.parent.arguments[0])
                    );

                // e.g.
                //   Reflect.apply(function() {}, obj, []);
                //   Array.from([], function() {}, obj);
                //   list.forEach(function() {}, obj);
                case "CallExpression":
                    if (isReflectApply(parent.callee)) {
                        return (
                            parent.arguments.length !== 3 ||
                            parent.arguments[0] !== node ||
                            isNullOrUndefined(parent.arguments[1])
                        );
                    }
                    if (isArrayFromMethod(parent.callee)) {
                        return (
                            parent.arguments.length !== 3 ||
                            parent.arguments[1] !== node ||
                            isNullOrUndefined(parent.arguments[2])
                        );
                    }
                    if (isMethodWhichHasThisArg(parent.callee)) {
                        return (
                            parent.arguments.length !== 2 ||
                            parent.arguments[0] !== node ||
                            isNullOrUndefined(parent.arguments[1])
                        );
                    }
                    return true;

                // Otherwise `this` is default.
                default:
                    return true;
            }
        }

        /* istanbul ignore next */
        return true;
    },

    /**
     * Get the precedence level based on the node type
     * @param {ASTNode} node node to evaluate
     * @returns {int} precedence level
     * @private
     */
    getPrecedence(node) {
        switch (node.type) {
            case "SequenceExpression":
                return 0;

            case "AssignmentExpression":
            case "ArrowFunctionExpression":
            case "YieldExpression":
                return 1;

            case "ConditionalExpression":
                return 3;

            case "LogicalExpression":
                switch (node.operator) {
                    case "||":
                        return 4;
                    case "&&":
                        return 5;

                    // no default
                }

                /* falls through */

            case "BinaryExpression":

                switch (node.operator) {
                    case "|":
                        return 6;
                    case "^":
                        return 7;
                    case "&":
                        return 8;
                    case "==":
                    case "!=":
                    case "===":
                    case "!==":
                        return 9;
                    case "<":
                    case "<=":
                    case ">":
                    case ">=":
                    case "in":
                    case "instanceof":
                        return 10;
                    case "<<":
                    case ">>":
                    case ">>>":
                        return 11;
                    case "+":
                    case "-":
                        return 12;
                    case "*":
                    case "/":
                    case "%":
                        return 13;

                    // no default
                }

                /* falls through */

            case "UnaryExpression":
            case "AwaitExpression":
                return 14;

            case "UpdateExpression":
                return 15;

            case "CallExpression":

                // IIFE is allowed to have parens in any position (#655)
                if (node.callee.type === "FunctionExpression") {
                    return -1;
                }
                return 16;

            case "NewExpression":
                return 17;

            // no default
        }
        return 18;
    },

    /**
     * Checks whether a given node is a loop node or not.
     * The following types are loop nodes:
     *
     * - DoWhileStatement
     * - ForInStatement
     * - ForOfStatement
     * - ForStatement
     * - WhileStatement
     *
     * @param {ASTNode|null} node - A node to check.
     * @returns {boolean} `true` if the node is a loop node.
     */
    isLoop(node) {
        return Boolean(node && anyLoopPattern.test(node.type));
    },

    /**
     * Checks whether a given node is a function node or not.
     * The following types are function nodes:
     *
     * - ArrowFunctionExpression
     * - FunctionDeclaration
     * - FunctionExpression
     *
     * @param {ASTNode|null} node - A node to check.
     * @returns {boolean} `true` if the node is a function node.
     */
    isFunction(node) {
        return Boolean(node && anyFunctionPattern.test(node.type));
    },

    /**
     * Gets the property name of a given node.
     * The node can be a MemberExpression, a Property, or a MethodDefinition.
     *
     * If the name is dynamic, this returns `null`.
     *
     * For examples:
     *
     *     a.b           // => "b"
     *     a["b"]        // => "b"
     *     a['b']        // => "b"
     *     a[`b`]        // => "b"
     *     a[100]        // => "100"
     *     a[b]          // => null
     *     a["a" + "b"]  // => null
     *     a[tag`b`]     // => null
     *     a[`${b}`]     // => null
     *
     *     let a = {b: 1}            // => "b"
     *     let a = {["b"]: 1}        // => "b"
     *     let a = {['b']: 1}        // => "b"
     *     let a = {[`b`]: 1}        // => "b"
     *     let a = {[100]: 1}        // => "100"
     *     let a = {[b]: 1}          // => null
     *     let a = {["a" + "b"]: 1}  // => null
     *     let a = {[tag`b`]: 1}     // => null
     *     let a = {[`${b}`]: 1}     // => null
     *
     * @param {ASTNode} node - The node to get.
     * @returns {string|null} The property name if static. Otherwise, null.
     */
    getStaticPropertyName(node) {
        let prop;

        switch (node && node.type) {
            case "Property":
            case "MethodDefinition":
                prop = node.key;
                break;

            case "MemberExpression":
                prop = node.property;
                break;

            // no default
        }

        switch (prop && prop.type) {
            case "Literal":
                return String(prop.value);

            case "TemplateLiteral":
                if (prop.expressions.length === 0 && prop.quasis.length === 1) {
                    return prop.quasis[0].value.cooked;
                }
                break;

            case "Identifier":
                if (!node.computed) {
                    return prop.name;
                }
                break;

            // no default
        }

        return null;
    },

    /**
     * Get directives from directive prologue of a Program or Function node.
     * @param {ASTNode} node - The node to check.
     * @returns {ASTNode[]} The directives found in the directive prologue.
     */
    getDirectivePrologue(node) {
        const directives = [];

        // Directive prologues only occur at the top of files or functions.
        if (
            node.type === "Program" ||
            node.type === "FunctionDeclaration" ||
            node.type === "FunctionExpression" ||

            // Do not check arrow functions with implicit return.
            // `() => "use strict";` returns the string `"use strict"`.
            (node.type === "ArrowFunctionExpression" && node.body.type === "BlockStatement")
        ) {
            const statements = node.type === "Program" ? node.body : node.body.body;

            for (const statement of statements) {
                if (
                    statement.type === "ExpressionStatement" &&
                    statement.expression.type === "Literal"
                ) {
                    directives.push(statement);
                } else {
                    break;
                }
            }
        }

        return directives;
    },


    /**
     * Determines whether this node is a decimal integer literal. If a node is a decimal integer literal, a dot added
     after the node will be parsed as a decimal point, rather than a property-access dot.
     * @param {ASTNode} node - The node to check.
     * @returns {boolean} `true` if this node is a decimal integer.
     * @example
     *
     * 5       // true
     * 5.      // false
     * 5.0     // false
     * 05      // false
     * 0x5     // false
     * 0b101   // false
     * 0o5     // false
     * 5e0     // false
     * '5'     // false
     */
    isDecimalInteger(node) {
        return node.type === "Literal" && typeof node.value === "number" && /^(0|[1-9]\d*)$/.test(node.raw);
    }
};
