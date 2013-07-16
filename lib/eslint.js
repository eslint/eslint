/**
 * @fileoverview Main ESLint object.
 * @author Nicholas C. Zakas
 */

/*jshint node:true*/

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var esprima = require("esprima"),
    estraverse = require("estraverse"),
    rules = require("./rules"),
    RuleContext = require("./rule-context"),
    EventEmitter = require("events").EventEmitter;

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

module.exports = (function() {

    var api = Object.create(new EventEmitter()),
        messages = [],
        currentText = null,
        currentConfig = null;

    /**
     * Resets the internal state of the object.
     * @returns {void}
     */
    api.reset = function() {
        this.removeAllListeners();
        messages = [];
        currentConfig = null;
        currentText = null;
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
            return config.rules[key] > 0;   // ignore rules that are turned off
        }).forEach(function(key) {

            var ruleCreator = rules.get(key),
                rule;

            if (ruleCreator) {
                rule = ruleCreator(new RuleContext(key, api));

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

        /*
         * Each node has a type property. Whenever a particular type of node is found,
         * an event is fired. This allows any listeners to automatically be informed
         * that this type of node has been found and react accordingly.
         */
        try {
            var ast = esprima.parse(text, { loc: true, range: true, raw: true, tokens: true });
            estraverse.traverse(ast, {
                enter: function(node) {
                    api.emit(node.type, node, api.getMatchingTokens(node, ast.tokens));
                },
                leave: function(node) {
                    api.emit(node.type + ":after", node, api.getMatchingTokens(node, ast.tokens));
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
     * @returns {void}
     */
    api.report = function(ruleId, node, message) {

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
     * @param (ASTNode) [node] The AST node to get the tokens for.
     * @param (Object[]) [tokens] All tokens for the AST.
     */
    api.getMatchingTokens = function(node, tokens) {
        var startLocation = node.loc.start;
        var endLocation = node.loc.end;
        return tokens.filter(function(token) {
            return (token.loc.start.line === startLocation.line &&
                    token.loc.end.line === endLocation.line &&
                    token.loc.start.column >= startLocation.column &&
                    token.loc.start.column <= endLocation.column &&
                    token.loc.end.column >= startLocation.column &&
                    token.loc.end.column <= endLocation.column);
        });
    };

    return api;

}());
