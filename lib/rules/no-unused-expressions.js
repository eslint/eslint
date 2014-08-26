/**
 * @fileoverview Flag expressions in statement position that do not side effect
 * @author Michael Ficarra
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    function isPragma(expression, parent) {

    	var parentBody = parent.body.filter(function(body) {
    		return body.type === "ExpressionStatement" && body.expression.type === "Literal";
    	});

        var isStrict = expression.type === "Literal" && expression.value === "use strict",
            isGlobalStrict = isStrict && (parent.type === "Program" && parentBody.length > 0 && parentBody[0].expression === expression),
            isLocalStrict = isStrict && (parent.type === "BlockStatement" && parentBody.length > 0 && parentBody[0].expression === expression);

        return isGlobalStrict || isLocalStrict;
    }

    return {
        "ExpressionStatement": function(node) {

            var type = node.expression.type,
                parent = context.getAncestors().pop();


            if (
                !/^(?:Assignment|Call|New|Update)Expression$/.test(type) &&
                (type !== "UnaryExpression" || ["delete", "void"].indexOf(node.expression.operator) < 0) &&
                !isPragma(node.expression, parent)
            ) {
                context.report(node, "Expected an assignment or function call and instead saw an expression.");
            }
        }
    };

};
