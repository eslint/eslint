# Migrating from JSCS

In April 2016, we [announced](https://eslint.org/blog/2016/04/welcoming-jscs-to-eslint) that the JSCS project was shutting down and the JSCS team would be joining the ESLint team. This guide is intended to help those who are using JSCS to migrate their settings and projects to use ESLint. We've tried to automate as much of the conversion as possible, but there are some manual changes that are needed.

## Terminology

Before beginning the process of migrating to ESLint, it's helpful to understand some of the terminology that ESLint uses and how it relates to terminology that JSCS uses.

* **Configuration File** - In JSCS, the configuration file is `.jscsrc`, `.jscsrc.json`, `.jscsrc.yaml`, or `.jscsrs.js`. In ESLint, the configuration file can be `.eslintrc.json`, `.eslintrc.yml`, `.eslintrc.yaml`, or `.eslintrc.js` (there is also a deprecated `.eslintrc` file format).
* **Presets** - In JSCS, there were numerous predefined configurations shipped directly within JSCS. ESLint ships with just one predefined configuration (`eslint:recommended`) that has no style rules enabled. However, ESLint does support [shareable configs](https://eslint.org/docs/developer-guide/shareable-configs). Shareable configs are configurations that are published on their own to npm and there are shareable configs available for almost all of the JSCS presets (see the "Converting Presets" section below). Additionally, the "preset" option in a configuration file is the equivalent of the ESLint "extends" option.

## Convert Configuration Files Using Polyjuice

[Polyjuice](https://github.com/brenolf/polyjuice) is a utility for converting JSCS (and JSHint) configuration files into ESLint configuration files automatically. It understands the equivalent rules from each utility and will automatically output an ESLint configuration file that is a good approximation of your existing JSCS file.

To install Polyjuice:

```
$ npm install -g polyjuice
```

Polyjuice works with JSON configuration files, so if you're using a JavaScript or YAML JSCS configuration file, you should first convert it into a JSON configuration file.

To convert your configuration file, pass in the location of your `.jscs.json` file using the `--jscs` flag:

```
$ polyjuice --jscs .jscsrc.json > .eslintrc.json
```

This creates a `.eslintrc.json` with the equivalent rules from `.jscsrc.json`.

If you have multiple `.jscsrc.json` files, you can pass them all and Polyjuice will combine them into one `.eslintrc.json` file:

```
$ polyjuice --jscs .jscsrc.json ./foo/.jscsrc.json > .eslintrc.json
```

**Note:** Polyjuice does a good job of creating a reasonable ESLint configuration from your JSCS configuration, but it may not be 100%. You may still see different warnings than you saw with JSCS, and so you may need to further modify your configuration after using Polyjuice. This is especially true if you're using inline comments to enable/disable certain rules in JSCS (you'll need to manually convert those to use ESLint-style comments instead, see "Disabling Rules Inline" later in this page).

### Creating a New Configuration From Scratch

If you don't want to convert your JSCS configuration directly into an ESLint configuration, then you can use ESLint's built-in wizard to get you started. Just run:

```
$ eslint --init
```

You'll be guided through a series of questions that will help you setup a basic configuration file to get you started.

## Converting Presets

There are shareable configs available for most JSCS presets. The equivalent shareable configs for each JSCS preset are listed in the following table:

| **JSCS Preset** | **ESLint Shareable Config** |
|-----------------|-----------------------------|
| `airbnb`        | [`eslint-config-airbnb-base`](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb-base) |
| `crockford`        | (not available) |
| `google`        | [`eslint-config-google`](https://github.com/google/eslint-config-google) |
| `grunt`        | [`eslint-config-grunt`](https://github.com/markelog/eslint-config-grunt) |
| `idiomatic`        | [`eslint-config-idiomatic`](https://github.com/jamespamplin/eslint-config-idiomatic) |
| `jquery`        | [`eslint-config-jquery`](https://github.com/jquery/eslint-config-jquery) |
| `mdcs`        | [`eslint-config-mdcs`](https://github.com/zz85/mrdoobapproves) |
| `node-style-guide`        | [`eslint-config-node-style-guide`](https://github.com/pdehaan/eslint-config-node-style-guide) |
| `wikimedia`        | [`eslint-config-wikimedia`](https://github.com/wikimedia/eslint-config-wikimedia) |
| `wordpress`        | [`eslint-config-wordpress`](https://github.com/WordPress-Coding-Standards/eslint-config-wordpress) |

As an example, suppose that you are using the `airbnb` preset, so your `.jscsrc` file looks like this:

```json
{
    "preset": "airbnb"
}
```

In order to get the same functionality in ESLint, you would first need to install the `eslint-config-airbnb` shareable config package:

```
$ npm install eslint-config-airbnb-base --save-dev
```

And then you would modify your configuration file like this:

```json
{
    "extends": "airbnb-base"
}
```

ESLint sees `"airbnb-base"` and will look for `eslint-config-airbnb-base` (to save you some typing).

## Disabling Rules Inline

Both JSCS and ESLint use comments inside of files to disable rules around certain parts of your code. The following table lists out the JSCS inline configuration comments and their ESLint equivalents.

| **Description** | **JSCS Comment** | **ESLint Comment** |
|-----------------|------------------|--------------------|
| Disable all rules | `// jscs:disable` or `/* jscs:disable */` | `/* eslint-disable */` |
| Enable all rules | `// jscs:enable` or `/* jscs:enable */` | `/* eslint-enable */` |
| Disable one rule | `// jscs:disable ruleName` or `/* jscs:disable ruleName */` | `/* eslint-disable rule-name */` |
| Enable one rule | `// jscs:enable ruleName` or `/* jscs:enable ruleName */` | `/* eslint-enable rule-name */` |
| Disable multiple rules | `// jscs:disable ruleName1, ruleName2` or `/* jscs:disable ruleName1, ruleName2 */` | `/* eslint-disable rule-name1, rule-name2 */` |
| Enable multiple rules | `// jscs:enable ruleName1, ruleName2` or `/* jscs:enable ruleName1, ruleName2 */` | `/* eslint-enable rule-name1, rule-name2 */` |
| Disable one rule on single line | `// jscs:ignore ruleName` | `// eslint-disable-line rule-name` |

## Command Line Options

Both JSCS and ESLint have command line arguments corresponding to many of their configuration options. The following are the ESLint equivalents of JSCS command line options.

### `--fix`

JSCS uses the `--fix` option to apply automatic fixes to code:

```
$ jscs --fix file.js
```

ESLint has the same option:

```
$ eslint --fix file.js
```

### `--auto-configure`

The JSCS `--auto-configure` option created a configuration based on what it found in a given file:

```
$ jscs --auto-configure file.js
```

In ESLint, there's a similar option when you use `--init`. Just select "Inspect your JavaScript file(s)":

```
$ eslint --init
? How would you like to configure ESLint? (Use arrow keys)
> Answer questions about your style
  Use a popular style guide
  Inspect your JavaScript file(s)
```

## `--config`, `-c`

JSCS allows you to specify a configuration file to use on the command line using either `--config` or `-c`, such as:

```
$ jscs --config myconfig.json file.js
$ jscs -c myconfig.json file.js
```

Both flags are also supported by ESLint:

```
$ eslint --config myconfig.json file.js
$ eslint -c myconfig.json file.js
```



## Piping Code Into ESLint

In JSCS, you can pipe code in like this:

```
$ cat file.js | jscs
```

In ESLint, you can also pipe in code, but you need to use the `--stdin` flag:

```
$ cat file.js | eslint --stdin
```
