"use strict";

module.exports = function ({ ruleIds, language }) {
	return `
The following rules do not support the language "${language}":
${ruleIds.map(id => `\t- "${id}"`).join("\n")}

To fix this error, either:
- Remove the rule from your configuration, or set its severity to "off".
- Use the "files" option to apply the rule only to files of the supported language, for example:
  {
    files: ["**/*.js"],
    rules: { "${ruleIds[0]}": "error" }
  }

See https://eslint.org/docs/latest/use/configure/rules for more information.
`.trimStart();
};
