/**
 * @fileoverview Rule to flag when re-assigning native objects
 * @author Ilya Volodin
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    return {

        "AssignmentExpression": function(node) {
            var nativeObjects = ["Array", "Boolean", "Date", "decodeURI",
                                "decodeURIComponent", "encodeURI", "encodeURIComponent",
                                "Error", "eval", "EvalError", "Function", "isFinite",
                                "isNaN", "JSON", "Math", "Number", "Object", "parseInt",
                                "parseFloat", "RangeError", "ReferenceError", "RegExp",
                                "String", "SyntaxError", "TypeError", "URIError",
                                "hasOwnProperty", "Map", "NaN", "Set", "WeakMap"];
            if (nativeObjects.indexOf(node.left.name) >= 0) {
                context.report(node, node.left.name + " is a read-only native object.");
            }
        }
    };

};
