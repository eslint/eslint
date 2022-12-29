[ESLint Node.js API Reference](../index.md) / eslint/eslint-helpers

# Module: eslint/eslint-helpers

## Table of contents

### Interfaces

* [GlobSearch](../interfaces/eslint_eslint_helpers.GlobSearch.md)

### Functions

* [createIgnoreResult](eslint_eslint_helpers.md#createignoreresult)
* [directoryExists](eslint_eslint_helpers.md#directoryexists)
* [fileExists](eslint_eslint_helpers.md#fileexists)
* [findFiles](eslint_eslint_helpers.md#findfiles)
* [getCacheFile](eslint_eslint_helpers.md#getcachefile)
* [isArrayOfNonEmptyString](eslint_eslint_helpers.md#isarrayofnonemptystring)
* [isErrorMessage](eslint_eslint_helpers.md#iserrormessage)
* [isGlobPattern](eslint_eslint_helpers.md#isglobpattern)
* [isNonEmptyString](eslint_eslint_helpers.md#isnonemptystring)
* [processOptions](eslint_eslint_helpers.md#processoptions)

## Functions

### createIgnoreResult

▸ `Private` **createIgnoreResult**(`filePath`, `baseDir`): `LintResult`

Returns result with warning by ignore settings

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `filePath` | `string` | File path of checked code |
| `baseDir` | `string` | Absolute path of base directory |

#### Returns

`LintResult`

Result with single warning

#### Defined in

[eslint/eslint-helpers.js:627](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/eslint/eslint-helpers.js#L627)

___

### directoryExists

▸ **directoryExists**(`resolvedPath`): `boolean`

Checks whether a directory exists at the given location

**`Throws`**

As thrown by `fs.statSync` or `fs.isDirectory`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `resolvedPath` | `string` | A path from the CWD |

#### Returns

`boolean`

`true` if a directory exists

#### Defined in

[eslint/eslint-helpers.js:595](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/eslint/eslint-helpers.js#L595)

___

### fileExists

▸ **fileExists**(`resolvedPath`): `boolean`

Checks whether a file exists at the given location

**`Throws`**

As thrown by `fs.statSync` or `fs.isFile`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `resolvedPath` | `string` | A path from the CWD |

#### Returns

`boolean`

`true` if a file exists

#### Defined in

[eslint/eslint-helpers.js:578](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/eslint/eslint-helpers.js#L578)

___

### findFiles

▸ **findFiles**(`args`): `Promise`<`string`[]\>

Finds all files matching the options specified.

**`Throws`**

If there are no results due to an ignore pattern.

**`Throws`**

If no files matched the given patterns.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `args` | `Object` | The arguments objects. |
| `args.configs` | `FlatConfigArray` | The configs for the current run. |
| `args.cwd` | `string` | The current working directory to find from. |
| `args.errorOnUnmatchedPattern` | `boolean` | Determines if an unmatched pattern should throw an error. |
| `args.globInputPaths` | `boolean` | true to interpret glob patterns, false to not interpret glob patterns. |
| `args.patterns` | `string`[] | An array of glob patterns. |

#### Returns

`Promise`<`string`[]\>

The fully resolved file paths.

#### Defined in

[eslint/eslint-helpers.js:471](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/eslint/eslint-helpers.js#L471)

___

### getCacheFile

▸ **getCacheFile**(`cacheFile`, `cwd`): `string`

return the cacheFile to be used by eslint, based on whether the provided parameter is
a directory or looks like a directory (ends in `path.sep`), in which case the file
name will be the `cacheFile/.cache_hashOfCWD`

if cacheFile points to a file or looks like a file then in will just use that file

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cacheFile` | `string` | The name of file to be used to store the cache |
| `cwd` | `string` | Current working directory |

#### Returns

`string`

the resolved path to the cache file

#### Defined in

[eslint/eslint-helpers.js:858](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/eslint/eslint-helpers.js#L858)

___

### isArrayOfNonEmptyString

▸ **isArrayOfNonEmptyString**(`x`): `boolean`

Check if a given value is an array of non-empty strings or not.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `x` | `any` | The value to check. |

#### Returns

`boolean`

`true` if `x` is an array of non-empty strings.

#### Defined in

[eslint/eslint-helpers.js:120](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/eslint/eslint-helpers.js#L120)

___

### isErrorMessage

▸ `Private` **isErrorMessage**(`message`): `boolean`

Checks if the given message is an error message.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | `LintMessage` | The message to check. |

#### Returns

`boolean`

Whether or not the message is an error message.

#### Defined in

[eslint/eslint-helpers.js:616](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/eslint/eslint-helpers.js#L616)

___

### isGlobPattern

▸ **isGlobPattern**(`pattern`): `boolean`

Check if a string is a glob pattern or not.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `pattern` | `string` | A glob pattern. |

#### Returns

`boolean`

`true` if the string is a glob pattern.

#### Defined in

[eslint/eslint-helpers.js:142](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/eslint/eslint-helpers.js#L142)

___

### isNonEmptyString

▸ **isNonEmptyString**(`x`): `boolean`

Check if a given value is a non-empty string or not.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `x` | `any` | The value to check. |

#### Returns

`boolean`

`true` if `x` is a non-empty string.

#### Defined in

[eslint/eslint-helpers.js:111](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/eslint/eslint-helpers.js#L111)

___

### processOptions

▸ **processOptions**(`options`): `FlatESLintOptions`

Validates and normalizes options for the wrapped CLIEngine instance.

**`Throws`**

If of any of a variety of type errors.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | `FlatESLintOptions` | The options to process. |

#### Returns

`FlatESLintOptions`

The normalized options.

#### Defined in

[eslint/eslint-helpers.js:699](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/eslint/eslint-helpers.js#L699)
