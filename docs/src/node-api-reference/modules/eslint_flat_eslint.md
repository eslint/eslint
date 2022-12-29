[ESLint Node.js API Reference](../index.md) / eslint/flat-eslint

# Module: eslint/flat-eslint

## Table of contents

### References

* [ConfigData](eslint_flat_eslint.md#configdata)
* [DeprecatedRuleInfo](eslint_flat_eslint.md#deprecatedruleinfo)
* [LintMessage](eslint_flat_eslint.md#lintmessage)
* [Plugin](eslint_flat_eslint.md#plugin)
* [ResultsMeta](eslint_flat_eslint.md#resultsmeta)
* [Rule](eslint_flat_eslint.md#rule)

### Classes

* [FlatESLint](../classes/eslint_flat_eslint.FlatESLint.md)

### Interfaces

* [FlatESLintOptions](../interfaces/eslint_flat_eslint.FlatESLintOptions.md)
* [ParserOptions](../interfaces/eslint_flat_eslint.ParserOptions.md)

### Type Aliases

* [ExtractedConfig](eslint_flat_eslint.md#extractedconfig)
* [RuleConf](eslint_flat_eslint.md#ruleconf)

### Functions

* [findFlatConfigFile](eslint_flat_eslint.md#findflatconfigfile)

## References

### ConfigData

Re-exports [ConfigData](../interfaces/eslint_eslint.ConfigData.md)

___

### DeprecatedRuleInfo

Re-exports [DeprecatedRuleInfo](../interfaces/eslint_eslint.DeprecatedRuleInfo.md)

___

### LintMessage

Re-exports [LintMessage](../interfaces/eslint_eslint.LintMessage.md)

___

### Plugin

Re-exports [Plugin](../interfaces/eslint_eslint.Plugin.md)

___

### ResultsMeta

Re-exports [ResultsMeta](../interfaces/eslint_eslint.ResultsMeta.md)

___

### Rule

Re-exports [Rule](../interfaces/eslint_eslint.Rule.md)

## Type Aliases

### ExtractedConfig

Ƭ **ExtractedConfig**<\>: `ReturnType`<`ConfigArray.extractConfig`\>

#### Defined in

[eslint/flat-eslint.js:63](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/eslint/flat-eslint.js#L63)

___

### RuleConf

Ƭ **RuleConf**<\>: `SeverityConf` \| [`SeverityConf`, ...any[]]

#### Defined in

[shared/types.js:12](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/shared/types.js#L12)

## Functions

### findFlatConfigFile

▸ **findFlatConfigFile**(`cwd`): `Promise`<`string`\>

Searches from the current working directory up until finding the
given flat config filename.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cwd` | `string` | The current working directory to search from. |

#### Returns

`Promise`<`string`\>

The filename if found or `null` if not.

#### Defined in

[eslint/flat-eslint.js:265](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/eslint/flat-eslint.js#L265)
