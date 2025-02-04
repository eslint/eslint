"use strict";

module.exports = function(it) {
    const { pluginName, ruleId } = it;

    return `
Common causes of this problem include:

1. The "${pluginName}" plugin is not defined in your configuration file.
2. The "${pluginName}" plugin is not defined within the same configuration object in which the "${ruleId}" rule is applied.
`.trimStart();
};
