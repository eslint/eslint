/**
 * @fileoverview Rule to require sorting of variables within a single Variable Declaration block
 * @author Ilya Volodin
 * @copyright 2015 Harry Ho. All rights reserved.
 */

"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    var configuration = context.options[0] || {},
        ignoreCase = configuration.ignoreCase || false;



    return {
        "VariableDeclaration": function(node) {
            var nodeDeclarations;
            var PatternMapper = {};

             // Adds all leaves to single collection
            PatternMapper.flattenIntoArray = function flattenIntoArray(obj, collection) {
                if (Array.isArray(obj)) {
                    obj.forEach(function(item) {
                        flattenIntoArray(item, collection);
                    });
                } else {
                    collection.push(obj);
                }
            };

            // Maps VariableObject from ArrayPattern
            PatternMapper.mapArrayPattern = function mapArrayPattern(elements) {
                var self = this;
                return elements.map(function(element) {
                    if (element.type === "ArrayPattern") {
                        return self.mapArrayPattern(element.elements);
                    } else if (element.type === "ObjectPattern") {
                        return self.mapObjectPattern(element.properties);
                    }
                    return {
                        id: element,
                        loc: element.loc,
                        start: element.start,
                        end: element.end,
                        type: "VariableDeclarator"
                    };
                });
            };

            // Maps VariableObject from ObjectPattern
            PatternMapper.mapObjectPattern = function mapObjectPattern(obj) {
                var self = this;
                return obj.map(function(property) {
                    if (property.value.type === "ArrayPattern") {
                        return self.mapArrayPattern(property.value.elements);
                    } else if (property.value.type === "ObjectPattern") {
                        return self.mapObjectPattern(property.value.properties);
                    } else {
                        return {
                            id: property.value,
                            loc: property.loc,
                            start: property.value.start,
                            end: property.value.end,
                            type: "VariableDeclarator"
                        };
                    }
                });
            };

            nodeDeclarations = node.declarations.reduce(function(memo, decl) {
                var tmpDecls,
                    allDecls = [];
                // Checks ObjectPatterns
                if (decl.id.type === "ObjectPattern") {

                    // Creates a mappedOutPattern
                    tmpDecls = PatternMapper.mapObjectPattern(decl.id.properties);

                    // Flattens the tree into a single array
                    PatternMapper.flattenIntoArray(tmpDecls, allDecls);
                    return memo.concat(allDecls);
                } else if (decl.id.type === "ArrayPattern") {

                    // Creates a mappedOutPattern
                    tmpDecls = PatternMapper.mapArrayPattern(decl.id.elements);

                    // flattens the tree into single array
                    PatternMapper.flattenIntoArray(tmpDecls, allDecls);
                    return memo.concat(allDecls);
                } else {
                    memo.push(decl);
                    return memo;
                }
            }, []);

            nodeDeclarations.reduce(function(memo, decl) {
                var lastVariableName = memo.id.name,
                    currenVariableName = decl.id.name;

                if (ignoreCase) {
                    lastVariableName = lastVariableName.toLowerCase();
                    currenVariableName = currenVariableName.toLowerCase();
                }

                if (currenVariableName < lastVariableName) {
                    context.report(decl, "Variables within the same declaration block should be sorted alphabetically");
                    return memo;
                } else {
                    return decl;
                }
            }, nodeDeclarations[0]);
        }
    };
};

module.exports.schema = [
    {
        "type": "object",
        "properties": {
            "ignoreCase": {
                "type": "boolean"
            }
        },
        "additionalProperties": false
    }
];
