/**
 * @fileoverview A rule to ensure empty lines between class functions.
 * @author Linus Unnebäck <https://github.com/LinusU>
 */

"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {
    var config = context.options[0] || "always";

    var ALWAYS_MESSAGE = "Class methods must be separated by at least one blank line.",
        NEVER_MESSAGE = "Class methods must not be separated by blank lines.";

    var sourceCode = context.getSourceCode();

    return {
        "ClassBody:exit": function(node) {
            node.body.reduce(function(prev, next) {
                var firstEmptyLine = null;
                var nextLine = prev.loc.end.line + 1;
                var comments = sourceCode.getComments(prev).trailing;

                for (var i = 0; i < comments.length; i++) {
                    var comment = comments[i];

                    if (comment.loc.start.line > nextLine) {
                        firstEmptyLine = nextLine;
                        break;
                    }

                    nextLine = comment.loc.end.line + 1;
                }

                if (firstEmptyLine === null && next.loc.start.line > nextLine) {
                    firstEmptyLine = nextLine;
                }

                if (config === "always" && firstEmptyLine === null) {
                    context.report({
                        node: node,
                        loc: { line: next.loc.start.line, column: next.loc.start.column },
                        message: ALWAYS_MESSAGE
                    });
                }

                if (config === "never" && firstEmptyLine !== null) {
                    context.report({
                        node: node,
                        loc: { line: firstEmptyLine, column: 0 },
                        message: NEVER_MESSAGE
                    });
                }

                return next;
            });
        }
    };
};

module.exports.schema = [
    {
        enum: ["always", "never"]
    }
];
