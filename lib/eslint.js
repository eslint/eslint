/**
 * @fileoverview Main ESLint object.
 * @author Nicholas C. Zakas
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var esprima = require("esprima"),
    estraverse = require("estraverse"),
    escope = require("escope"),
    rules = require("./rules"),
    RuleContext = require("./rule-context"),
    EventEmitter = require("events").EventEmitter;

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

function escapeRegExp(rx) {
    return rx.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

module.exports = (function() {

    var api = Object.create(new EventEmitter()),
        messages = [],
        currentText = null,
        currentConfig = null,
        currentTokens = null,
        scopes = null,
        controller = null;

    /**
     * Resets the internal state of the object.
     * @returns {void}
     */
    api.reset = function() {
        this.removeAllListeners();
        messages = [];
        currentConfig = null;
        currentText = null;
        currentTokens = null;
        scopes = null;
        controller = null;
    };

    /**
     * Verifies the text against the rules specified by the second argument.
     * @param {string} text The JavaScript text to verify.
     * @param {Object} config An object whose keys specify the rules to use.
     * @returns {Object[]} The results as an array of messages or null if no messages.
     */
    api.verify = function(text, config, saveState) {

        if (!saveState) {
            this.reset();
        }

        // enable appropriate rules
        Object.keys(config.rules).filter(function(key) {
            if (typeof config.rules[key] === "number") {
                return config.rules[key] > 0;
            } else if (Array.isArray(config.rules[key])) {
                // Here the rule looks like [1, ...] - the first value is the key we want
                return config.rules[key][0] > 0;
            }
        }).forEach(function(key) {
            var ruleCreator = rules.get(key),
                options = [],
                rule;

            if (Array.isArray(config.rules[key])) {
                // The additional config data is after the bool value
                options = config.rules[key].slice(1);
            }

            if (ruleCreator) {
                rule = ruleCreator(new RuleContext(key, api, options));

                // add all the node types as listeners
                Object.keys(rule).forEach(function(nodeType) {
                    api.on(nodeType, rule[nodeType]);
                });
            } else {
                throw new Error("Definition for rule '" + key + "' was not found.");
            }
        });

        // save config so rules can access as necessary
        currentConfig = config;
        currentText = text;
        controller = new estraverse.Controller();

        /*
         * Each node has a type property. Whenever a particular type of node is found,
         * an event is fired. This allows any listeners to automatically be informed
         * that this type of node has been found and react accordingly.
         */
        try {
            var ast = esprima.parse(text, { loc: true, range: true, raw: true, tokens: true });
            scopes = escope.analyze(ast).scopes;
            currentTokens = ast.tokens;
            controller.traverse(ast, {
                enter: function(node) {
                    api.emit(node.type, node);
                },
                leave: function(node) {
                    api.emit(node.type + ":after", node);
                }
            });

        } catch (ex) {
            messages.push({
                fatal: true,

                // messages come as "Line X: Unexpected token foo", so strip off leading part
                message: ex.message.substring(ex.message.indexOf(":") + 1).trim(),

                line: ex.lineNumber,
                column: ex.column
            });
        }

        return messages;
    };

    /**
     * Reports a message from one of the rules.
     * @param {string} ruleId The ID of the rule causing the message.
     * @param {ASTNode} node The AST node that the message relates to.
     * @param {string} message The actual message.
     * @param {Object} opts Optional template data which produces a formatted message
     *     with symbols being replaced by this object's values.
     * @returns {void}
     */
    api.report = function(ruleId, node, message, opts) {

        Object.keys(opts || {}).forEach(function (key) {
            var rx = new RegExp("{{" + escapeRegExp(key) + "}}", "g");
            message = message.replace(rx, opts[key]);
        });

        messages.push({
            ruleId: ruleId,
            node: node,
            message: message,
            line: node.loc.start.line,
            column: node.loc.start.column
        });
    };

    /**
     * Determines if the file should be interpreted as running in a Node.js
     * environment instead of a browser environment.
     * @returns {boolean} True if the file should be interpreted as running in
     *      a Node.js environment, false if not.
     */
    api.isNodeJS = function() {
        return currentConfig.env ? currentConfig.env.nodejs : false;
    };

    /**
     * Gets the source code for the given node.
     * @param {ASTNode} [node] The AST node to get the text for.
     * @param {int} [beforeCount] The number of characters before the node to retrieve.
     * @param {int} [afterCount] The number of characters after the node to retrieve.
     * @returns {string} The text representing the AST node.
     */
    api.getSource = function(node, beforeCount, afterCount) {
        if (node) {
            return currentText ? currentText.slice(node.range[0] - (beforeCount || 0),
                node.range[1] + (afterCount || 0)) : null;
        } else {
            return currentText || null;
        }

    };

    /**
     * Gets all tokens that are related to the given node.
     * @param {ASTNode} [node] The AST node to get the text for.
     * @param {int} [beforeCount] The number of characters before the node to retrieve.
     * @param {int} [afterCount] The number of characters after the node to retrieve.
     * @returns {Object[]} Array of objects representing tokens.
     */
    api.getTokens = function(node, beforeCount, afterCount) {
        if (node) {
            var startLocation = node.range[0] - (beforeCount || 0);
            var endLocation = node.range[1] + (afterCount || 0) ;
            return currentTokens.filter(function(token) {
                return (token.range[0] >= startLocation &&
                        token.range[0] <= endLocation &&
                        token.range[1] >= startLocation &&
                        token.range[1] <= endLocation);
            });
        } else {
            return currentTokens || null;
        }
    };

    /**
     * Gets nodes that are ancestors of current node.
     * @returns {ASTNode[]} Array of objects representing ancestors.
     */
    api.getAncestors = function() {
        return controller.parents();
    };


    /**
     * Gets the scope for the current node.
     * @returns {Object} An object representing the current node's scope.
     */
    api.getScope = function() {
        var parents = controller.parents().reverse(),
            innerScope = null;

        // Ascend the current node's parents
        for (var i = 0; i < parents.length; i++) {

            // The first node that requires a scope is the node that will be
            // our current node's innermost scope.
            if (escope.Scope.isScopeRequired(parents[i])) {
                innerScope = parents[i];
                break;
            }
        }

        // Loop through the scopes returned by escope to find the innermost 
        // scope and return that scope.
        for (var j = 0; j < scopes.length; j++) {
            if (innerScope.type === scopes[j].block.type &&
                innerScope.range[0] === scopes[j].block.range[0] &&
                innerScope.range[1] === scopes[j].block.range[1]) {

                return scopes[j];
            }
        }
    };

    return api;

}());
