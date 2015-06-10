exports.expectedError = "Failed to parse: unexpected token";

exports.parse = function() {
    throw new Error(exports.expectedError);
}
