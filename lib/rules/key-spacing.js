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
        "ObjectExpression": function(node) {
            var spacingOption = context.options[0];
            if(spacingOption){
                spacingOption=spacingOption==='never'?'never':'always';
            }else{
                spacingOption='always';
            }
            node.properties.forEach(function(property) {
                var colon=context.getSource(property).substring(context.getSource(property.key).length,context.getSource(property).length-context.getSource(property.value).length);
                var mid=colon.indexOf(":");
                var before=colon.substring(0,mid);
                var after=colon.substring(mid+1);
                var name='';
                if(property.key.type==='Literal'){
                    name=property.key.value;
                }else if(property.key.type==='Identifier'){
                    name=property.key.name;
                }
                if((spacingOption==='always')&&(before!==' ')){
                    context.report(property,'A single space is required before \':\' in the '+name+' property.');
                }
                if((spacingOption==='always')&&(after!==' ')){
                    context.report(property,'A single space is required after \':\' in the '+name+' property.');
                }
                if((spacingOption==='never')&&(before!=='')){
                    context.report(property,'There must not be any spaces before \':\' in the '+name+' property.');
                }
                if((spacingOption==='never')&&(after!=='')){
                    context.report(property,'There must not be any spaces after \':\' in the '+name+' property.');
                }
            });
        }
    };

};
