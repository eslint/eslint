---
title: Configure Rules
eleventyNavigation:
    key: configure rules
    parent: configure
    title: Configure Rules
    order: 3
---

::: tip
This page explains how to configure rules using the flat config format.
:::

Rules are the core building block of ESLint. A rule validates if your code meets a certain expectation, and what to do if it does not meet that expectation. Rules can also contain additional configuration options specific to that rule.

ESLint comes with a large number of [built-in rules](../../rules/) and you can add more rules through plugins. You can modify which rules your project uses with either configuration comments or configuration files.

## Rule Severities

To change a rule's severity, set the rule ID equal to one of these values:

- `"off"` or `0` - turn the rule off.
- `"warn"` or `1` - turn the rule on as a warning (doesn't affect exit code).
- `"error"` or `2` - turn the rule on as an error (exit code is 1 when triggered).

Rules are typically set to `"error"` to enforce compliance with the rule during continuous integration testing, pre-commit checks, and pull request merging because doing so causes ESLint to exit with a non-zero exit code.

If you don't want to enforce compliance with a rule but would still like ESLint to report the rule's violations, set the severity to `"warn"`. This is typically used when introducing a new rule that will eventually be set to `"error"`, when a rule is flagging something other than a potential buildtime or runtime error (such as an unused variable), or when a rule cannot determine with certainty that a problem has been found (when a rule might have false positives and need manual review).

### Use configuration comments

To configure rules inside of a file using configuration comments, use a comment in the following format:

```js
/* eslint eqeqeq: "off", curly: "error" */
```

In this example, [`eqeqeq`](../../rules/eqeqeq) is turned off and [`curly`](../../rules/curly) is turned on as an error. You can also use the numeric equivalent for the rule severity:

```js
/* eslint eqeqeq: 0, curly: 2 */
```

This example is the same as the last example, only it uses the numeric codes instead of the string values. The [`eqeqeq`](../../rules/eqeqeq) rule is off and the [`curly`](../../rules/curly) rule is set to be an error.

If a rule has additional options, you can specify them using array literal syntax, such as:

```js
/* eslint quotes: ["error", "double"], curly: 2 */
```

This comment specifies the `"double"` option for the [`quotes`](../../rules/quotes) rule. The first item in the array is always the rule severity (number or string).

#### Configuration Comment Descriptions

Configuration comments can include descriptions to explain why the comment is necessary. The description must occur after the configuration and is separated from the configuration by two or more consecutive `-` characters. For example:

```js
/* eslint eqeqeq: "off", curly: "error" -- Here's a description about why this configuration is necessary. */
```

```js
/* eslint eqeqeq: "off", curly: "error"
    --------
    Here's a description about why this configuration is necessary. */
```

```js
/* eslint eqeqeq: "off", curly: "error"
 * --------
 * This will not work due to the line above starting with a '*' character.
 */
```

#### Report unused `eslint` inline config comments

To report unused `eslint` inline config comments (those that don't change anything from what was already configured), use the `reportUnusedInlineConfigs` setting. For example:

```js
// eslint.config.js
import { defineConfig } from "eslint/config";

export default defineConfig([
	{
		linterOptions: {
			reportUnusedInlineConfigs: "error",
		},
	},
]);
```

This setting defaults to `"off"`.

This setting is similar to the [`--report-unused-inline-configs`](../command-line-interface#--report-unused-inline-configs) CLI option.

### Use Configuration Files

To configure rules inside of a [configuration file](./configuration-files#configuration-file), use the `rules` key along with an error level and any options you want to use. For example:

```js
// eslint.config.js
import { defineConfig } from "eslint/config";

export default defineConfig([
	{
		rules: {
			eqeqeq: "off",
			"no-unused-vars": "error",
			"prefer-const": ["error", { ignoreReadBeforeAssign: true }],
		},
	},
]);
```

When more than one configuration object specifies the same rule, the rule configuration is merged with the later object taking precedence over any previous objects. For example:

```js
import { defineConfig } from "eslint/config";

export default defineConfig([
	{
		rules: {
			semi: ["error", "never"],
		},
	},
	{
		rules: {
			semi: ["warn", "always"],
		},
	},
]);
```

Using this configuration, the final rule configuration for `semi` is `["warn", "always"]` because it appears last in the array. The array indicates that the configuration is for the severity and any options. You can change just the severity by defining only a string or number, as in this example:

```js
import { defineConfig } from "eslint/config";

export default defineConfig([
	{
		rules: {
			semi: ["error", "never"],
		},
	},
	{
		rules: {
			semi: "warn",
		},
	},
]);
```

Here, the second configuration object only overrides the severity, so the final configuration for `semi` is `["warn", "never"]`.

::: important
Rules configured via configuration comments have the highest priority and are applied after all configuration files settings.
:::

## Rules from Plugins

To configure a rule that is defined within a plugin, prefix the rule ID with the plugin namespace and `/`.

In a [configuration file](./configuration-files#configuration-file), for example:

```js
// eslint.config.js
import example from "eslint-plugin-example";
import { defineConfig } from "eslint/config";

export default defineConfig([
	{
		plugins: {
			example,
		},
		rules: {
			"example/rule1": "warn",
		},
	},
]);
```

In this configuration file, the rule `example/rule1` comes from the plugin named `eslint-plugin-example`.

You can also use this format with configuration comments, such as:

```js
/* eslint "example/rule1": "error" */
```

:::important
In order to use plugin rules in configuration comments, your configuration file must load the plugin and specify it in the `plugins` object of your config. Configuration comments can not load plugins on their own.
:::

## Disable Rules

### Use configuration comments

- **Use with Caution.** Disabling ESLint rules inline should be restricted and used only in situations with a clear and
  valid reason for doing so. Disabling rules inline should not be the default solution to resolve linting errors.
- **Document the Reason.** Provide a comment explaining the reason for disabling a particular rule after the `--` section of the comment. This
  documentation should clarify why the rule is being disabled and why it is necessary in that specific situation.
- **Temporary Solutions.** If a disable comment is added as a temporary measure to address a pressing issue, create a follow-up task to address the underlying problem adequately. This ensures that the
  disable comment is revisited and resolved at a later stage.
- **Code Reviews and Pair Programming.** Encourage team members to review each other's code regularly. Code reviews can help
  identify the reasons behind disable comments and ensure that they are used appropriately.
- **Configurations.** Whenever possible, prefer using ESLint configuration files over disable comments. Configuration
  files allow for consistent and project-wide rule handling.

To disable rule warnings in a part of a file, use block comments in the following format:

```js
/* eslint-disable */

alert("foo");

/* eslint-enable */
```

You can also disable or enable warnings for specific rules:

```js
/* eslint-disable no-alert, no-console */

alert("foo");
console.log("bar");

/* eslint-enable no-alert, no-console */
```

::: warning
`/* eslint-enable */` without any specific rules listed causes all disabled rules to be re-enabled.
:::

To disable rule warnings in an entire file, put a `/* eslint-disable */` block comment at the top of the file:

```js
/* eslint-disable */

alert("foo");
```

You can also disable or enable specific rules for an entire file:

```js
/* eslint-disable no-alert */

alert("foo");
```

To ensure that a rule is never applied (regardless of any future enable/disable lines):

```js
/* eslint no-alert: "off" */

alert("foo");
```

To disable all rules on a specific line, use a line or block comment in one of the following formats:

```js
alert("foo"); // eslint-disable-line

// eslint-disable-next-line
alert("foo");

/* eslint-disable-next-line */
alert("foo");

alert("foo"); /* eslint-disable-line */
```

To disable a specific rule on a specific line:

```js
alert("foo"); // eslint-disable-line no-alert

// eslint-disable-next-line no-alert
alert("foo");

alert("foo"); /* eslint-disable-line no-alert */

/* eslint-disable-next-line no-alert */
alert("foo");
```

To disable multiple rules on a specific line:

```js
alert("foo"); // eslint-disable-line no-alert, quotes, semi

// eslint-disable-next-line no-alert, quotes, semi
alert("foo");

alert("foo"); /* eslint-disable-line no-alert, quotes, semi */

/* eslint-disable-next-line no-alert, quotes, semi */
alert("foo");

/* eslint-disable-next-line
  no-alert,
  quotes,
  semi
*/
alert("foo");
```

All of the above methods also work for plugin rules. For example, to disable `eslint-plugin-example`'s `rule-name` rule, combine the plugin's name (`example`) and the rule's name (`rule-name`) into `example/rule-name`:

```js
foo(); // eslint-disable-line example/rule-name
foo(); /* eslint-disable-line example/rule-name */
```

::: tip
Comments that disable warnings for a portion of a file tell ESLint not to report rule violations for the disabled code. ESLint still parses the entire file, however, so disabled code still needs to be syntactically valid JavaScript.
:::

#### Comment descriptions

Configuration comments can include descriptions to explain why disabling or re-enabling the rule is necessary. The description must come after the configuration and needs to be separated from the configuration by two or more consecutive `-` characters. For example:

```js
// eslint-disable-next-line no-console -- Here's a description about why this configuration is necessary.
console.log("hello");

/* eslint-disable-next-line no-console --
 * Here's a very long description about why this configuration is necessary
 * along with some additional information
 **/
console.log("hello");
```

### Use configuration files

To disable rules inside of a [configuration file](./configuration-files#configuration-file) for a group of files, use a subsequent config object with a `files` key. For example:

```js
// eslint.config.js
import { defineConfig } from "eslint/config";

export default defineConfig([
	{
		rules: {
			"no-unused-expressions": "error",
		},
	},
	{
		files: ["*-test.js", "*.spec.js"],
		rules: {
			"no-unused-expressions": "off",
		},
	},
]);
```

### Disable Inline Comments

To disable all inline config comments, use the `noInlineConfig` setting in your configuration file. For example:

```js
// eslint.config.js
import { defineConfig } from "eslint/config";

export default defineConfig([
	{
		linterOptions: {
			noInlineConfig: true,
		},
		rules: {
			"no-unused-expressions": "error",
		},
	},
]);
```

You can also use the [`--no-inline-config`](../command-line-interface#--no-inline-config) CLI option to disable rule comments, in addition to other in-line configuration.

#### Report unused `eslint-disable` comments

To report unused `eslint-disable` comments (those that disable rules which would not report on the disabled line), use the `reportUnusedDisableDirectives` setting. For example:

```js
// eslint.config.js
import { defineConfig } from "eslint/config";

export default defineConfig([
	{
		linterOptions: {
			reportUnusedDisableDirectives: "error",
		},
	},
]);
```

This setting defaults to `"warn"`.

This setting is similar to [`--report-unused-disable-directives`](../command-line-interface#--report-unused-disable-directives) and [`--report-unused-disable-directives-severity`](../command-line-interface#--report-unused-disable-directives-severity) CLI options.
