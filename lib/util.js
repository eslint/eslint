/**
 * @fileoverview Common utilities.
 */

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------
exports.mixin = function(target, source) {
    Object.keys(source).forEach(function(key) {
        target[key] = source[key];
    });
};
