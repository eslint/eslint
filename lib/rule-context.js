/**
 * @fileoverview RuleContext utility for rules
 * @author Nicholas C. Zakas
 */

//------------------------------------------------------------------------------
// Constants
//------------------------------------------------------------------------------

var PASSTHROUGHS = [
        "getSource",
        "getTokens",
        "isNodeJS",
        "getAncestors",
        "getScope"
    ];

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/**
 * Acts as an abstraction layer between rules and the main eslint object.
 * @constructor
 * @param {string} ruleId The ID of the rule using this object.
 * @param {eslint} eslint The eslint object.
 * @param {array} options the configuration information to be added to the rule
 */
function RuleContext(ruleId, eslint, options) {

    /**
     * The read-only ID of the rule.
     */
    Object.defineProperty(this, "id", {
        value: ruleId
    });

    /**
     * The read-only options of the rule
     */
    Object.defineProperty(this, "options", {
        value: options
    });

    // copy over passthrough methods
    PASSTHROUGHS.forEach(function(name) {
        this[name] = function() {
            return eslint[name].apply(eslint, arguments);
        };
    }, this);

    /**
     * Passthrough to eslint.report() that automatically assigns the rule ID.
     * @param {ASTNode} node The AST node related to the message.
     * @param {string} message The message to display to the user.
     * @param {Object} opts Optional template data which produces a formatted message
     *     with symbols being replaced by this object's values.
     * @returns {void}
     */
    this.report = function(node, message, opts) {
        eslint.report(ruleId, node, message, opts);
    };

}

RuleContext.prototype = {

    constructor: RuleContext,

    /**
     * Determines if an AST node matches a specific pattern. The pattern is simply
     * a space-separated list of node types indicating the ancestry of the given node.
     * @param {ASTNode} node The node to test.
     * @param {string} pattern The pattern to test against.
     * @returns {boolean} True if the pattern matches, false if not.
     */
    match: function(node, pattern) {

        var patternParts = pattern.split(/\s/g),
            current = node;

        /*
         * The pattern is evaluated from right to left, so popping off the last item
         * and comparing it to the current node repeats until there aren't any more
         * parts to test. If the node doesn't match at any point, the operation
         * is aborted.
         */
        while (patternParts && current) {
            if (current.type === patternParts.pop()) {
                current = current.parent;
            } else {
                return false;
            }
        }

        return true;
    }

};

module.exports = RuleContext;
