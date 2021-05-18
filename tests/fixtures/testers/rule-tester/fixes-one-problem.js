/**
 * @fileoverview A test rule that reports two problems and only provides a fix for one of them
 * @author Teddy Katz
 */

"use strict";

module.exports = context => {
    return {
        Program(node) {
            context.report({
                node,
                message: "No programs allowed."
            });

            context.report({
                node,
                message: "Seriously, no programs allowed.",
                fix: fixer => fixer.remove(node)
            });
        }
    }
};
