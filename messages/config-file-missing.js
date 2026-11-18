"use strict";

module.exports = function () {
	return `
ESLint couldn't find an eslint.config.* file.

From ESLint v9.0.0, the default configuration file is now eslint.config.*.
If you are using a .eslintrc.* file, please follow the migration guide
to update your configuration file to the new format:

https://eslint.org/docs/latest/use/configure/migration-guide

If you still have problems after following the migration guide, please stop by
https://eslint.org/chat/help to chat with the team.
`.trimStart();
};
