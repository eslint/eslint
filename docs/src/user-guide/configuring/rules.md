---
title: Rules
layout: doc
edit_link: https://github.com/eslint/eslint/edit/main/docs/src/user-guide/configuring/rules.md
eleventyNavigation:
    key: configuring rules
    parent: configuring
    title: Configuring Rules
    order: 3

---

* [Configuring Rules](#configuring-rules)
* [Disabling Rules](#disabling-rules)

## Configuring Rules

ESLint comes with a large number of built-in rules and you can add more rules through plugins. You can modify which rules your project uses either using configuration comments or configuration files. To change a rule setting, you must set the rule ID equal to one of these values:

* `"off"` or `0` - turn the rule off
* `"warn"` or `1` - turn the rule on as a warning (doesn't affect exit code)
* `"error"` or `2` - turn the rule on as an error (exit code is 1 when triggered)

### Using configuration comments

To configure rules inside of a file using configuration comments, use a comment in the following format:

```js
/* eslint eqeqeq: "off", curly: "error" */
```

In this example, [`eqeqeq`](https://eslint.org/docs/rules/eqeqeq) is turned off and [`curly`](https://eslint.org/docs/rules/curly) is turned on as an error. You can also use the numeric equivalent for the rule severity:

```js
/* eslint eqeqeq: 0, curly: 2 */
```

This example is the same as the last example, only it uses the numeric codes instead of the string values. The `eqeqeq` rule is off and the `curly` rule is set to be an error.

If a rule has additional options, you can specify them using array literal syntax, such as:

```js
/* eslint quotes: ["error", "double"], curly: 2 */
```

This comment specifies the "double" option for the [`quotes`](https://eslint.org/docs/rules/quotes) rule. The first item in the array is always the rule severity (number or string).

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

### Using configuration files

To configure rules inside of a configuration file, use the `rules` key along with an error level and any options you want to use. For example:

```json
{
    "rules": {
        "eqeqeq": "off",
        "curly": "error",
        "quotes": ["error", "double"]
    }
}
```

And in YAML:

```yaml
---
rules:
  eqeqeq: off
  curly: error
  quotes:
    - error
    - double
```

To configure a rule which is defined within a plugin you have to prefix the rule ID with the plugin name and a `/`. For example:

```json
{
    "plugins": [
        "plugin1"
    ],
    "rules": {
        "eqeqeq": "off",
        "curly": "error",
        "quotes": ["error", "double"],
        "plugin1/rule1": "error"
    }
}
```

And in YAML:

```yaml
---
plugins:
  - plugin1
rules:
  eqeqeq: 0
  curly: error
  quotes:
    - error
    - "double"
  plugin1/rule1: error
```

In these configuration files, the rule `plugin1/rule1` comes from the plugin named `plugin1`. You can also use this format with configuration comments, such as:

```js
/* eslint "plugin1/rule1": "error" */
```

**Note:** When specifying rules from plugins, make sure to omit `eslint-plugin-`. ESLint uses only the unprefixed name internally to locate rules.

## Disabling Rules

### Using configuration comments

To temporarily disable rule warnings in your file, use block comments in the following format:

```js
/* eslint-disable */

alert('foo');

/* eslint-enable */
```

You can also disable or enable warnings for specific rules:

```js
/* eslint-disable no-alert, no-console */

alert('foo');
console.log('bar');

/* eslint-enable no-alert, no-console */
```

**Note:** `/* eslint-enable */` without any specific rules listed will cause all disabled rules to be re-enabled.

To disable rule warnings in an entire file, put a `/* eslint-disable */` block comment at the top of the file:

```js
/* eslint-disable */

alert('foo');
```

You can also disable or enable specific rules for an entire file:

```js
/* eslint-disable no-alert */

alert('foo');
```

To ensure that a rule is never applied (regardless of any future enable/disable lines):

```js
/* eslint no-alert: "off" */

alert('foo');
```

To disable all rules on a specific line, use a line or block comment in one of the following formats:

```js
alert('foo'); // eslint-disable-line

// eslint-disable-next-line
alert('foo');

/* eslint-disable-next-line */
alert('foo');

alert('foo'); /* eslint-disable-line */
```

To disable a specific rule on a specific line:

```js
alert('foo'); // eslint-disable-line no-alert

// eslint-disable-next-line no-alert
alert('foo');

alert('foo'); /* eslint-disable-line no-alert */

/* eslint-disable-next-line no-alert */
alert('foo');
```

To disable multiple rules on a specific line:

```js
alert('foo'); // eslint-disable-line no-alert, quotes, semi

// eslint-disable-next-line no-alert, quotes, semi
alert('foo');

alert('foo'); /* eslint-disable-line no-alert, quotes, semi */

/* eslint-disable-next-line no-alert, quotes, semi */
alert('foo');

/* eslint-disable-next-line 
  no-alert, 
  quotes, 
  semi 
*/
alert('foo');
```

All of the above methods also work for plugin rules. For example, to disable `eslint-plugin-example`'s `rule-name` rule, combine the plugin's name (`example`) and the rule's name (`rule-name`) into `example/rule-name`:

```js
foo(); // eslint-disable-line example/rule-name
foo(); /* eslint-disable-line example/rule-name */
```

Configuration comments can include descriptions to explain why the comment is necessary. The description must come after the configuration and needs to be separated from the configuration by two or more consecutive `-` characters. For example:

```js
// eslint-disable-next-line no-console -- Here's a description about why this configuration is necessary.
console.log('hello');

/* eslint-disable-next-line no-console --
 * Here's a very long description about why this configuration is necessary
 * along with some additional information
**/
console.log('hello');
```

**Note:** Comments that disable warnings for a portion of a file tell ESLint not to report rule violations for the disabled code. ESLint still parses the entire file, however, so disabled code still needs to be syntactically valid JavaScript.

### Using configuration files

To disable rules inside of a configuration file for a group of files, use the `overrides` key along with a `files` key. For example:

```json
{
  "rules": {...},
  "overrides": [
    {
      "files": ["*-test.js","*.spec.js"],
      "rules": {
        "no-unused-expressions": "off"
      }
    }
  ]
}
```

### Disabling Inline Comments

To disable all inline config comments, use the `noInlineConfig` setting. For example:

```json
{
  "rules": {...},
  "noInlineConfig": true
}
```

This setting is similar to [--no-inline-config](https://eslint.org/docs/user-guide/command-line-interface#--no-inline-config) CLI option.

#### Report unused `eslint-disable` comments

To report unused `eslint-disable` comments, use the `reportUnusedDisableDirectives` setting. For example:

```json
{
  "rules": {...},
  "reportUnusedDisableDirectives": true
}
```

This setting is similar to [--report-unused-disable-directives](https://eslint.org/docs/user-guide/command-line-interface#--report-unused-disable-directives) CLI option, but doesn't fail linting (reports as `"warn"` severity).
