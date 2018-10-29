/**
 * JSCodeShift script to update meta.type in rules.
 * Run over the rules directory only. Use this command:
 *
 *   jscodeshift -t tools/update-rule-types.js lib/rules/
 *
 * @author Nicholas C. Zakas
 */
"use strict";

const path = require("path");
const ruleTypes = require("./rule-types.json");

module.exports = (fileInfo, api) => {
    const j = api.jscodeshift;
    const source = fileInfo.source;
    const ruleName = path.basename(fileInfo.path, ".js");

    // get the object literal representing the rule
    const nodes = j(source).find(j.ObjectExpression).filter(p => p.node.properties.some(node => node.key.name === "meta"));

    // updating logic
    return nodes.replaceWith(p => {

        // gather important nodes from the rule
        const metaNode = p.node.properties.find(node => node.key.name === "meta");

        // if there's no properties, just exit
        if (!metaNode.value.properties) {
            return p.node;
        }

        const typeNode = metaNode.value.properties.find(node => node.key.name === "type");
        const docsNode = metaNode.value.properties.find(node => node.key.name === "docs");
        const categoryNode = docsNode.value.properties.find(node => node.key.name === "category").value;

        let ruleType;

        // the rule-types.json file takes highest priority
        if (ruleName in ruleTypes) {
            ruleType = ruleTypes[ruleName];
        } else {

            // otherwise fallback to category
            switch (categoryNode.value) {
                case "Stylistic Issues":
                    ruleType = "style";
                    break;

                case "Possible Errors":
                    ruleType = "problem";
                    break;

                default:
                    ruleType = "suggestion";
            }
        }

        if (typeNode) {

            // update existing type node
            typeNode.value = j.literal(ruleType);
        } else {

            // add new type node if one doesn't exist
            const newProp = j.property(
                "init",
                j.identifier("type"),
                j.literal(ruleType)
            );

            p.node.properties[0].value.properties.unshift(newProp);
        }

        return p.node;
    }).toSource();
};
