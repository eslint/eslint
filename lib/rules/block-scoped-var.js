/**
 * @fileoverview Rule to check for "block scoped" variables by binding context
 * @author Matt DuVall <http://www.mattduvall.com>
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    var scopeStack = [];

    //--------------------------------------------------------------------------
    // Helpers
    //--------------------------------------------------------------------------

    /**
     * Determines whether an identifier is in declaration position or is a non-declaration reference.
     * @param {ASTNode} id The identifier.
     * @param {ASTNode} parent The identifier's parent AST node.
     * @returns {Boolean} true when the identifier is in declaration position.
     */
    function isDeclaration(id, parent) {
        switch (parent.type) {
            case "FunctionDeclaration":
            case "FunctionExpression":
                return parent.params.indexOf(id) > -1 || id === parent.id;

            case "VariableDeclarator":
                return id === parent.id;

            case "CatchClause":
                return id === parent.param;

            default:
                return false;
        }
    }

    /**
     * Determines whether an identifier is in property position.
     * @param {ASTNode} id The identifier.
     * @param {ASTNode} parent The identifier's parent AST node.
     * @returns {Boolean} true when the identifier is in property position.
     */
    function isProperty(id, parent) {
        switch (parent.type) {
            case "MemberExpression":
                return id === parent.property && !parent.computed;

            case "Property":
                return id === parent.key;

            default:
                return false;
        }
    }

    /**
     * Pushes a new scope object on the scope stack.
     * @returns {void}
     */
    function pushScope() {
        scopeStack.push([]);
    }

    /**
     * Removes the topmost scope object from the scope stack.
     * @returns {void}
     */
    function popScope() {
        scopeStack.pop();
    }

    /**
     * Declares the given names in the topmost scope object.
     * @param {[String]} names A list of names to declare.
     * @returns {void}
     */
    function declare(names) {
        [].push.apply(scopeStack[scopeStack.length - 1], names);
    }

    //--------------------------------------------------------------------------
    // Public API
    //--------------------------------------------------------------------------

    /**
     * Declares all relevant identifiers for classes.
     * @param {ASTNode} node The AST node representing a class.
     * @returns {void}
     * @private
     */
    function declareClass(node) {
        pushScope();

        if (node.id) {
            declare([node.id.name]);
        }
    }

    /**
     * Declares all relevant identifiers for classes.
     * @param {ASTNode} node The AST node representing a class.
     * @returns {void}
     * @private
     */
    function declareClassMethod(node) {
        pushScope();

        declare([node.key.name]);
    }

    /**
     * Add declarations based on the type of node being passed.
     * @param {ASTNode} node The node containing declarations.
     * @returns {void}
     * @private
     */
    function declareByNodeType(node) {

        var declarations = [];

        switch (node.type) {
            case "Identifier":
                declarations.push(node.name);
                break;

            case "ObjectPattern":
                node.properties.forEach(function(property) {
                    declarations.push(property.key.name);
                    if (property.value) {
                        declarations.push(property.value.name);
                    }
                });
                break;

            case "ArrayPattern":
                node.elements.forEach(function(element) {
                    declarations.push(element.name);
                });
                break;

            // no default
        }

        declare(declarations);

    }

    function functionHandler(node) {
        pushScope();

        node.params.forEach(function(param) {
            declareByNodeType(param);
        });

        declare(node.id ? [node.id.name] : []);
        declare(node.rest ? [node.rest.name] : []);
        declare(["arguments"]);
    }

    function variableDeclarationHandler(node) {
        node.declarations.forEach(function(declaration) {
            declareByNodeType(declaration.id);
        });

    }

    return {
        "Program": function() {
            var scope = context.getScope();
            scopeStack = [scope.variables.map(function(v) {
                return v.name;
            })];

            // global return creates another scope
            if (context.ecmaFeatures.globalReturn) {
                scope = scope.childScopes[0];
                scopeStack.push(scope.variables.map(function(v) {
                    return v.name;
                }));
            }
        },

        "BlockStatement": function(node) {
            var statements = node.body;
            pushScope();
            statements.forEach(function(stmt) {
                if (stmt.type === "VariableDeclaration") {
                    variableDeclarationHandler(stmt);
                } else if (stmt.type === "FunctionDeclaration") {
                    declare([stmt.id.name]);
                }
            });
        },

        "VariableDeclaration": function (node) {
            variableDeclarationHandler(node);
        },

        "BlockStatement:exit": popScope,

        "CatchClause": function(node) {
            pushScope();
            declare([node.param.name]);
        },
        "CatchClause:exit": popScope,

        "FunctionDeclaration": functionHandler,
        "FunctionDeclaration:exit": popScope,

        "ClassDeclaration": declareClass,
        "ClassDeclaration:exit": popScope,

        "ClassExpression": declareClass,
        "ClassExpression:exit": popScope,

        "MethodDefinition": declareClassMethod,
        "MethodDefinition:exit": popScope,

        "FunctionExpression": functionHandler,
        "FunctionExpression:exit": popScope,

        "ArrowFunctionExpression": functionHandler,
        "ArrowFunctionExpression:exit": popScope,

        "ForStatement": function() {
            pushScope();
        },
        "ForStatement:exit": popScope,

        "ForInStatement": function() {
            pushScope();
        },
        "ForInStatement:exit": popScope,

        "ForOfStatement": function() {
            pushScope();
        },
        "ForOfStatement:exit": popScope,

        "Identifier": function(node) {
            var ancestor = context.getAncestors().pop();
            if (isDeclaration(node, ancestor) || isProperty(node, ancestor) || ancestor.type === "LabeledStatement") {
                return;
            }

            for (var i = 0, l = scopeStack.length; i < l; i++) {
                if (scopeStack[i].indexOf(node.name) > -1) {
                    return;
                }
            }

            context.report(node, "\"" + node.name + "\" used outside of binding context.");
        }
    };

};
