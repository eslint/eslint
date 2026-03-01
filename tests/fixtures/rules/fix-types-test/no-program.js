"use strict";

module.exports = {
    fixable: "code",

    create(context) {
        
        return {
            
            "Program": function(node) {
                context.report({
                    node,
                    message: "Program!",
                    fix(fixer) {
                        return fixer.insertTextAfter(node, ";");
                    }
                });
            }
        };
    }
    
}