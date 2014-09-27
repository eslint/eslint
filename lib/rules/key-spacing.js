/**
 * @fileoverview  a rule that enforces or disallows spaces after property names (and before property values) inside of objects.
 * @author Emory Merryman
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    // variables should be defined here

    //--------------------------------------------------------------------------
    // Helpers
    //--------------------------------------------------------------------------

    // any helper functions should go here or else delete this section

    //--------------------------------------------------------------------------
    // Public
    //--------------------------------------------------------------------------

    return {

        "ObjectPattern":function(node){
            var spacingOption=context.options[0];
            if(node.key.type==='Literal'){
                context.report(node.key.value);
            }else if(node.key.type==='Identifier'){
                context.report(node.key.name);
            }
        }

    };

};
