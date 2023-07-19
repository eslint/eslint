"use strict";

/* eslint consistent-return: 0 -- no default case */

module.exports = function({ key }) {

    switch (key) {
        case "env":
            return `
A config object is using the "env" key, which is not supported in flat config system.

Flat config uses "languageOptions.globals" to define global variables for your files.

Please see the following page for information on how to convert your config object into the correct format:
https://eslint.org/docs/latest/use/configure/migration-guide#configuring-language-options
            `.trim();

        case "extends":
            return `
A config object is using the "extends" key, which is not supported in flat config system.

Instead of "extends", you can include config objects that you'd like to extend from directly in the flat config array.

Please see the following page for more information:
https://eslint.org/docs/latest/use/configure/migration-guide#predefined-configs
            `.trim();

        case "globals":

            return `
A config object is using the "globals" key, which is not supported in flat config system.

Flat config uses "languageOptions.globals" to define global variables for your files.

Please see the following page for information on how to convert your config object into the correct format:
https://eslint.org/docs/latest/use/configure/migration-guide#configuring-language-options
            `.trim();

        case "ignorePatterns":

            return `
A config object is using the "ignorePatterns" key, which is not supported in flat config system.

Flat config uses "ignores" to specify files to ignore.

Please see the following page for information on how to convert your config object into the correct format:
https://eslint.org/docs/latest/use/configure/migration-guide#ignoring-files
            `.trim();

        case "noInlineConfig":

            return `
A config object is using the "noInlineConfig" key, which is not supported in flat config system.

Flat config uses "linterOptions.noInlineConfig" to specify files to ignore.

Please see the following page for information on how to convert your config object into the correct format:
https://eslint.org/docs/latest/use/configure/migration-guide#linter-options
            `.trim();

        case "overrides":

            return `
A config object is using the "overrides" key, which is not supported in flat config system.

Flat config is an array that acts like the eslintrc "overrides" array.

Please see the following page for information on how to convert your config object into the correct format:
https://eslint.org/docs/latest/use/configure/migration-guide#glob-based-configs
            `.trim();

        case "parser":

            return `
A config object is using the "parser" key, which is not supported in flat config system.

Flat config uses "languageOptions.parser" to override the default parser.

Please see the following page for information on how to convert your config object into the correct format:
https://eslint.org/docs/latest/use/configure/migration-guide#configuring-language-options
            `.trim();

        case "parserOptions":

            return `
A config object is using the "parserOptions" key, which is not supported in flat config system.

Flat config uses "languageOptions.parserOptions" to specify parser options.

Please see the following page for information on how to convert your config object into the correct format:
https://eslint.org/docs/latest/use/configure/migration-guide#configuring-language-options
            `.trim();

        case "reportUnusedDisableDirectives":

            return `
A config object is using the "reportUnusedDisableDirectives" key, which is not supported in flat config system.

Flat config uses "linterOptions.reportUnusedDisableDirectives" to specify files to ignore.

Please see the following page for information on how to convert your config object into the correct format:
https://eslint.org/docs/latest/use/configure/migration-guide#linter-options
            `.trim();

        case "root":

            return `
A config object is using the "root" key, which is not supported in flat config system.

Flat configs always act as if they are the root config file, so this key can be safely removed.
            `.trim();

        // no default
    }

};
