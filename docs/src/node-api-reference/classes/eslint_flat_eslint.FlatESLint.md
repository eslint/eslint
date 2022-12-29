[ESLint Node.js API Reference](../index.md) / [eslint/flat-eslint](../modules/eslint_flat_eslint.md) / FlatESLint

# Class: FlatESLint

[eslint/flat-eslint](../modules/eslint_flat_eslint.md).FlatESLint

Primary Node.js API for ESLint.

## Table of contents

### Constructors

* [constructor](eslint_flat_eslint.FlatESLint.md#constructor)

### Accessors

* [version](eslint_flat_eslint.FlatESLint.md#version)

### Methods

* [calculateConfigForFile](eslint_flat_eslint.FlatESLint.md#calculateconfigforfile)
* [getRulesMetaForResults](eslint_flat_eslint.FlatESLint.md#getrulesmetaforresults)
* [isPathIgnored](eslint_flat_eslint.FlatESLint.md#ispathignored)
* [lintFiles](eslint_flat_eslint.FlatESLint.md#lintfiles)
* [lintText](eslint_flat_eslint.FlatESLint.md#linttext)
* [loadFormatter](eslint_flat_eslint.FlatESLint.md#loadformatter)
* [getErrorResults](eslint_flat_eslint.FlatESLint.md#geterrorresults)
* [outputFixes](eslint_flat_eslint.FlatESLint.md#outputfixes)

## Constructors

### constructor

• **new FlatESLint**(`options?`)

Creates a new instance of the main ESLint API.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | [`FlatESLintOptions`](../interfaces/eslint_flat_eslint.FlatESLintOptions.md) | The options for this instance. |

#### Defined in

[eslint/flat-eslint.js:553](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/eslint/flat-eslint.js#L553)

## Accessors

### version

• `Static` `get` **version**(): `string`

The version text.

#### Returns

`string`

#### Defined in

[eslint/flat-eslint.js:604](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/eslint/flat-eslint.js#L604)

## Methods

### calculateConfigForFile

▸ **calculateConfigForFile**(`filePath`): `Promise`<[`ConfigData`](../interfaces/eslint_eslint.ConfigData.md)\>

Returns a configuration object for the given file based on the CLI options.
This is the same logic used by the ESLint CLI executable to determine
configuration for each file it processes.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `filePath` | `string` | The path of the file to retrieve a config object for. |

#### Returns

`Promise`<[`ConfigData`](../interfaces/eslint_eslint.ConfigData.md)\>

A configuration object for the file
     or `undefined` if there is no configuration data for the object.

#### Defined in

[eslint/flat-eslint.js:1116](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/eslint/flat-eslint.js#L1116)

___

### getRulesMetaForResults

▸ **getRulesMetaForResults**(`results`): `any`

Returns meta objects for each rule represented in the lint results.

**`Throws`**

When the results object wasn't created from this ESLint instance.

**`Throws`**

When a plugin or rule is missing.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `results` | `LintResult`[] | The results to fetch rules meta for. |

#### Returns

`any`

A mapping of ruleIds to rule meta objects.

#### Defined in

[eslint/flat-eslint.js:668](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/eslint/flat-eslint.js#L668)

___

### isPathIgnored

▸ **isPathIgnored**(`filePath`): `Promise`<`boolean`\>

Checks if a given path is ignored by ESLint.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `filePath` | `string` | The path of the file to check. |

#### Returns

`Promise`<`boolean`\>

Whether or not the given path is ignored.

#### Defined in

[eslint/flat-eslint.js:1132](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/eslint/flat-eslint.js#L1132)

___

### lintFiles

▸ **lintFiles**(`patterns`): `Promise`<`LintResult`[]\>

Executes the current configuration on an array of file and directory names.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `patterns` | `string` \| `string`[] | An array of file and directory names. |

#### Returns

`Promise`<`LintResult`[]\>

The results of linting the file patterns given.

#### Defined in

[eslint/flat-eslint.js:733](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/eslint/flat-eslint.js#L733)

___

### lintText

▸ **lintText**(`code`, `options?`): `Promise`<`LintResult`[]\>

Executes the current configuration on text.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `code` | `string` | A string of JavaScript code to lint. |
| `options?` | `Object` | The options. |
| `options.filePath` | `string` | The path to the file of the source code. |
| `options.warnIgnored` | `boolean` | When set to true, warn if given filePath is an ignored path. |

#### Returns

`Promise`<`LintResult`[]\>

The results of linting the string of code given.

#### Defined in

[eslint/flat-eslint.js:918](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/eslint/flat-eslint.js#L918)

___

### loadFormatter

▸ **loadFormatter**(`name?`): `Promise`<`Formatter`\>

Returns the formatter representing the given formatter name.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `name?` | `string` | `"stylish"` | The name of the formatter to load. The following values are allowed: - `undefined` ... Load `stylish` builtin formatter. - A builtin formatter name ... Load the builtin formatter. - A third-party formatter name: - `foo` → `eslint-formatter-foo` - `@foo` → `@foo/eslint-formatter` - `@foo/bar` → `@foo/eslint-formatter-bar` - A file path ... Load the file. |

#### Returns

`Promise`<`Formatter`\>

A promise resolving to the formatter object.
This promise will be rejected if the given formatter was not found or not
a function.

#### Defined in

[eslint/flat-eslint.js:1028](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/eslint/flat-eslint.js#L1028)

___

### getErrorResults

▸ `Static` **getErrorResults**(`results`): `LintResult`[]

Returns results that only contains errors.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `results` | `LintResult`[] | The results to filter. |

#### Returns

`LintResult`[]

The filtered results.

#### Defined in

[eslint/flat-eslint.js:638](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/eslint/flat-eslint.js#L638)

___

### outputFixes

▸ `Static` **outputFixes**(`results`): `Promise`<`void`\>

Outputs fixes from the given results to files.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `results` | `LintResult`[] | The lint results. |

#### Returns

`Promise`<`void`\>

Returns a promise that is used to track side effects.

#### Defined in

[eslint/flat-eslint.js:613](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/eslint/flat-eslint.js#L613)
