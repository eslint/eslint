/**
 * @fileoverview Rule to flag when redefining native objects
 * @author Ilya Volodin
 */


//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------


module.exports = function(context) {

    return {

        "VariableDeclarator": function(node) {
            var nativeObjects = ["Array", "Boolean", "Date", "decodeURI",
                                "decodeURIComponent", "encodeURI", "encodeURIComponent",
                                "Error", "eval", "EvalError", "Function", "isFinite",
                                "isNaN", "JSON", "Math", "Number", "Object", "parseInt",
                                "parseFloat", "RangeError", "ReferenceError", "RegExp",
                                "String", "SyntaxError", "TypeError", "URIError",
                                "hasOwnProperty", "Map", "NaN", "Set", "WeakMap"];
            if (nativeObjects.indexOf(node.id.name) >= 0) {
                context.report(node, "Redefinition of '{{nativeObject}}'", { nativeObject: node.id.name });
            }
        }
    };

};