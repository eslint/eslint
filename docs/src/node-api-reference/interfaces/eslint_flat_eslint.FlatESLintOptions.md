[ESLint Node.js API Reference](../index.md) / [eslint/flat-eslint](../modules/eslint_flat_eslint.md) / FlatESLintOptions

# Interface: FlatESLintOptions<\>

[eslint/flat-eslint](../modules/eslint_flat_eslint.md).FlatESLintOptions

## Table of contents

### Properties

* [allowInlineConfig](eslint_flat_eslint.FlatESLintOptions.md#allowinlineconfig)
* [baseConfig](eslint_flat_eslint.FlatESLintOptions.md#baseconfig)
* [cache](eslint_flat_eslint.FlatESLintOptions.md#cache)
* [cacheLocation](eslint_flat_eslint.FlatESLintOptions.md#cachelocation)
* [cacheStrategy](eslint_flat_eslint.FlatESLintOptions.md#cachestrategy)
* [cwd](eslint_flat_eslint.FlatESLintOptions.md#cwd)
* [errorOnUnmatchedPattern](eslint_flat_eslint.FlatESLintOptions.md#erroronunmatchedpattern)
* [fix](eslint_flat_eslint.FlatESLintOptions.md#fix)
* [fixTypes](eslint_flat_eslint.FlatESLintOptions.md#fixtypes)
* [globInputPaths](eslint_flat_eslint.FlatESLintOptions.md#globinputpaths)
* [ignore](eslint_flat_eslint.FlatESLintOptions.md#ignore)
* [ignorePatterns](eslint_flat_eslint.FlatESLintOptions.md#ignorepatterns)
* [overrideConfig](eslint_flat_eslint.FlatESLintOptions.md#overrideconfig)
* [overrideConfigFile](eslint_flat_eslint.FlatESLintOptions.md#overrideconfigfile)
* [plugins](eslint_flat_eslint.FlatESLintOptions.md#plugins)
* [reportUnusedDisableDirectives](eslint_flat_eslint.FlatESLintOptions.md#reportunuseddisabledirectives)

## Properties

### allowInlineConfig

• **allowInlineConfig**: `boolean`

Enable or disable inline configuration comments.

#### Defined in

[eslint/flat-eslint.js:68](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/eslint/flat-eslint.js#L68)

___

### baseConfig

• **baseConfig**: [`ConfigData`](eslint_eslint.ConfigData.md)

Base config object, extended by all configs used with this instance

#### Defined in

[eslint/flat-eslint.js:69](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/eslint/flat-eslint.js#L69)

___

### cache

• **cache**: `boolean`

Enable result caching.

#### Defined in

[eslint/flat-eslint.js:70](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/eslint/flat-eslint.js#L70)

___

### cacheLocation

• **cacheLocation**: `string`

The cache file to use instead of .eslintcache.

#### Defined in

[eslint/flat-eslint.js:71](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/eslint/flat-eslint.js#L71)

___

### cacheStrategy

• **cacheStrategy**: ``"metadata"`` \| ``"content"``

The strategy used to detect changed files.

#### Defined in

[eslint/flat-eslint.js:72](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/eslint/flat-eslint.js#L72)

___

### cwd

• **cwd**: `string`

The value to use for the current working directory.

#### Defined in

[eslint/flat-eslint.js:73](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/eslint/flat-eslint.js#L73)

___

### errorOnUnmatchedPattern

• **errorOnUnmatchedPattern**: `boolean`

If `false` then `ESLint#lintFiles()` doesn't throw even if no target files found. Defaults to `true`.

#### Defined in

[eslint/flat-eslint.js:74](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/eslint/flat-eslint.js#L74)

___

### fix

• **fix**: `boolean` \| `Function`

Execute in autofix mode. If a function, should return a boolean.

#### Defined in

[eslint/flat-eslint.js:75](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/eslint/flat-eslint.js#L75)

___

### fixTypes

• **fixTypes**: `string`[]

Array of rule types to apply fixes for.

#### Defined in

[eslint/flat-eslint.js:76](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/eslint/flat-eslint.js#L76)

___

### globInputPaths

• **globInputPaths**: `boolean`

Set to false to skip glob resolution of input file paths to lint (default: true). If false, each input file paths is assumed to be a non-glob path to an existing file.

#### Defined in

[eslint/flat-eslint.js:77](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/eslint/flat-eslint.js#L77)

___

### ignore

• **ignore**: `boolean`

False disables all ignore patterns except for the default ones.

#### Defined in

[eslint/flat-eslint.js:78](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/eslint/flat-eslint.js#L78)

___

### ignorePatterns

• **ignorePatterns**: `string`[]

Ignore file patterns to use in addition to config ignores.

#### Defined in

[eslint/flat-eslint.js:79](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/eslint/flat-eslint.js#L79)

___

### overrideConfig

• **overrideConfig**: [`ConfigData`](eslint_eslint.ConfigData.md)

Override config object, overrides all configs used with this instance

#### Defined in

[eslint/flat-eslint.js:80](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/eslint/flat-eslint.js#L80)

___

### overrideConfigFile

• **overrideConfigFile**: `string` \| `boolean`

Searches for default config file when falsy;
     doesn't do any config file lookup when `true`; considered to be a config filename
     when a string.

#### Defined in

[eslint/flat-eslint.js:81](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/eslint/flat-eslint.js#L81)

___

### plugins

• **plugins**: `Record`<`string`, [`Plugin`](eslint_eslint.Plugin.md)\>

An array of plugin implementations.

#### Defined in

[eslint/flat-eslint.js:84](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/eslint/flat-eslint.js#L84)

___

### reportUnusedDisableDirectives

• **reportUnusedDisableDirectives**: ``"off"`` \| ``"warn"`` \| ``"error"``

the severity to report unused eslint-disable directives.

#### Defined in

[eslint/flat-eslint.js:85](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/eslint/flat-eslint.js#L85)
