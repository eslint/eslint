var newlineRegex = /\r\n|\r|\n|\u0028|\u0029/,
    offset;

/*
 * This fake plugin ignores the first line and returns the rest of the file as
 * JavaScript.
 * Auto-fix is "supported" by this version of the fake plugin by removing fix
 * info.
 */

module.exports = {
    preprocess: function(text) {
        var result = newlineRegex.exec(text);

        offset = result.index + result[0].length;

        return [text.slice(offset)];
    },
    postprocess: function(messages) {
        messages[0].forEach(function(message) {
            message.line += 1;
            message.fix = null;
        });

        return messages[0];
    },
    handlesFixes: true
};
