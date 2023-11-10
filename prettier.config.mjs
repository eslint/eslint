/**
 * This is the configuration file for Prettier, the auto-formatter:
 * https://prettier.io/docs/en/configuration.html
 * Currently, Prettier is used to auto-format Markdown files. The actual code
 * in the repository (i.e. the JavaScript files) are not auto-formatted with
 * Prettier, although this could change in the future.
 */

/** @type {import("prettier").Config} */
const config = {

    /**
     * By default, Prettier will format the JavaScript source code blocks
     * inside of the Markdown files, which is not desired, because:
     * - It would break the examples for all of the formatting rules.
     * - Adding parentheses makes invalid examples valid in `no-cond-assign`.
     * - Removing parentheses makes valid examples invalid in
     *   `no-unsafe-negation`.
     * - Removing \ makes invalid examples valid in
     *   `no-nonoctal-decimal-escape`.
     * - Removing newlines makes invalid examples valid in
     *   `no-unexpected-multiline`.
     */
    embeddedLanguageFormatting: "off"
};

export default config;
