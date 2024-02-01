// Similar to the default parser, but considers leading and trailing comments to be part of the root node.
// Some custom parsers like @typescript-eslint/parser behave in this way.

const espree = require("espree");
exports.parse = function(code, options) {
    const ast = espree.parse(code, options);

    if (ast.range && ast.comments && ast.comments.length > 0) {
        const firstComment = ast.comments[0];
        const lastComment = ast.comments[ast.comments.length - 1];

        if (ast.range[0] > firstComment.range[0]) {
            ast.range[0] = firstComment.range[0];
            ast.start = firstComment.start;
            if (ast.loc) {
                ast.loc.start = firstComment.loc.start;
            }
        }
        if (ast.range[1] < lastComment.range[1]) {
            ast.range[1] = lastComment.range[1];
            ast.end = lastComment.end;
            if (ast.loc) {
                ast.loc.end = lastComment.loc.end;
            }
        }
    }
    return ast;
};
