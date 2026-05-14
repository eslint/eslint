module.exports = {
    processors: {
        ".txt": {
            preprocess: function(text) {
                return [text.replace("a()", "b()")];
            },
            postprocess: function(messages) {
                messages[0][0].ruleId = "post-processed";
                return messages[0];
            }
        }
    }
};
