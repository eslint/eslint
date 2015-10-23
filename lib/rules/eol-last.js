/**
 * @fileoverview Require file to end with single newline.
 * @author Nodeca Team <https://github.com/nodeca>
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    //--------------------------------------------------------------------------
    // Public
    //--------------------------------------------------------------------------

    var maxLines = -1,
        linebreakStyle = "unix";

    if (context.options.length) {
        var opts = context.options[0];
        maxLines = opts.max || -1;
        linebreakStyle = opts.type || "unix";
    }

    var linebreak = linebreakStyle === "windows" ? "\r\n" : "\n";

    return {

        "Program": function checkBadEOF(node) {
            // Get the whole source code, not for node only.
            var src = context.getSource(),
                location = {column: 1};

            if (src.length === 0) {
                return;
            }

            var lastChar = src.length - linebreak.length,
                numberOfNewLines = 0;
            while (lastChar >= 0 && src.substr(lastChar, linebreak.length) === linebreak) {
                numberOfNewLines++;
                lastChar -= linebreak.length;
            }

            if (numberOfNewLines === 0) {
                // file is not newline-terminated
                location.line = src.split(/\n/g).length;
                context.report({
                    node: node,
                    loc: location,
                    message: "Newline required at end of file but not found.",
                    fix: function(fixer) {
                        return fixer.insertTextAfterRange([0, src.length], linebreak);
                    }
                });
            } else if (maxLines !== -1 && numberOfNewLines > maxLines) {
                // file is terminated with too many newlines
                location.line = src.split(/\n/g).length;
                context.report({
                    node: node,
                    loc: location,
                    message: "Too many newlines at end of file.",
                    fix: function(fixer) {
                        return fixer.removeRange(
                            [src.length - 1 + linebreak.length * (maxLines - numberOfNewLines),
                             src.length - 1]);
                    }
                });
            }
        }

    };

};

module.exports.schema = [{
    "type": "object",
    "properties": {
        "type": {
            "enum": ["unix", "windows"]
        },
        "max": {
            "type": "integer"
        }
    },
    "additionalProperties": false
}];
