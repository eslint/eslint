"use strict";

/**
 * Exception thrown when schema validation fails because a rule is provided invalid options.
 */
class SchemaValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = "SchemaValidationError";
    }
}

module.exports = SchemaValidationError;
