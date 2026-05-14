exports.expectedError = "Failed to parse: unexpected token";

exports.parse = function() {
    throw new Error("Line 123: " + exports.expectedError);
}
