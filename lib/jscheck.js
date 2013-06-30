/**
 * @fileoverview Main JSCheck object.
 * @author Nicholas C. Zakas
 */

/*jshint node:true*/

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var astw = require("astw"),
    util = require("util"),
    esprima = require("esprima"),
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
     * Verifies the text against the rules specified by the second argument.
     * @param {string} text The JavaScript text to verify.
     * @param {Object} config An object whose keys specify the rules to use.
     * @returns {Object[]} The results as an array of messages or null if no messages.
     */
    api.verify = function(text, config) {

        // reset
        this.removeAllListeners();
        messages = [];

        // enable appropriate rules
        Object.keys(config.rules).forEach(function(key) {

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
        var ast = esprima.parse(text, { loc: true, range: true }),
            walk = astw(ast);

        walk(function(node) {
            api.emit(node.type, node);
        });

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
            message: message
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
     * Returns the text currently being processed.
     * @returns {string} The text currently being processed.
     */
    api.getCurrentText = function() {
        return currentText;
    };

    /**
     * Gets the source code for the given node.
     * @param {ASTNode} The AST node to get the text for.
     * @returns {string} The text representing the AST node.
     */
    api.getSource = function(node) {
        return currentText.slice(node.range[0], node.range[1]);
    };

    return api;

}());
