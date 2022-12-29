[ESLint Node.js API Reference](../index.md) / [rule-tester/flat-rule-tester](../modules/rule_tester_flat_rule_tester.md) / export=

# Class: export=

[rule-tester/flat-rule-tester](../modules/rule_tester_flat_rule_tester.md).export=

Mocha test wrapper.

## Table of contents

### Constructors

* [constructor](rule_tester_flat_rule_tester.export_.md#constructor)

### Properties

* [[DESCRIBE]](rule_tester_flat_rule_tester.export_.md#[describe])
* [[IT]](rule_tester_flat_rule_tester.export_.md#[it])
* [[IT\_ONLY]](rule_tester_flat_rule_tester.export_.md#[it_only])
* [linter](rule_tester_flat_rule_tester.export_.md#linter)
* [testerConfig](rule_tester_flat_rule_tester.export_.md#testerconfig)

### Accessors

* [describe](rule_tester_flat_rule_tester.export_.md#describe)
* [it](rule_tester_flat_rule_tester.export_.md#it)
* [itOnly](rule_tester_flat_rule_tester.export_.md#itonly)

### Methods

* [run](rule_tester_flat_rule_tester.export_.md#run)
* [getDefaultConfig](rule_tester_flat_rule_tester.export_.md#getdefaultconfig)
* [only](rule_tester_flat_rule_tester.export_.md#only)
* [resetDefaultConfig](rule_tester_flat_rule_tester.export_.md#resetdefaultconfig)
* [setDefaultConfig](rule_tester_flat_rule_tester.export_.md#setdefaultconfig)

## Constructors

### constructor

• **new export=**(`testerConfig?`)

Creates a new instance of RuleTester.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `testerConfig?` | `any` | Optional, extra configuration for the tester |

#### Defined in

[rule-tester/flat-rule-tester.js:325](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/rule-tester/flat-rule-tester.js#L325)

## Properties

### [DESCRIBE]

• **[DESCRIBE]**: `any`

#### Defined in

[rule-tester/flat-rule-tester.js:392](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/rule-tester/flat-rule-tester.js#L392)

___

### [IT]

• **[IT]**: `any`

#### Defined in

[rule-tester/flat-rule-tester.js:403](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/rule-tester/flat-rule-tester.js#L403)

___

### [IT\_ONLY]

• **[IT\_ONLY]**: `any`

#### Defined in

[rule-tester/flat-rule-tester.js:443](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/rule-tester/flat-rule-tester.js#L443)

___

### linter

• **linter**: `Linter`

#### Defined in

[rule-tester/flat-rule-tester.js:338](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/rule-tester/flat-rule-tester.js#L338)

___

### testerConfig

• **testerConfig**: `any`

The configuration to use for this tester. Combination of the tester
configuration and the default configuration.

#### Defined in

[rule-tester/flat-rule-tester.js:332](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/rule-tester/flat-rule-tester.js#L332)

## Accessors

### describe

• `Static` `get` **describe**(): `any`

#### Returns

`any`

#### Defined in

[rule-tester/flat-rule-tester.js:384](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/rule-tester/flat-rule-tester.js#L384)

• `Static` `set` **describe**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `any` |

#### Returns

`void`

#### Defined in

[rule-tester/flat-rule-tester.js:391](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/rule-tester/flat-rule-tester.js#L391)

___

### it

• `Static` `get` **it**(): `any`

#### Returns

`any`

#### Defined in

[rule-tester/flat-rule-tester.js:395](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/rule-tester/flat-rule-tester.js#L395)

• `Static` `set` **it**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `any` |

#### Returns

`void`

#### Defined in

[rule-tester/flat-rule-tester.js:402](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/rule-tester/flat-rule-tester.js#L402)

___

### itOnly

• `Static` `get` **itOnly**(): `any`

#### Returns

`any`

#### Defined in

[rule-tester/flat-rule-tester.js:419](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/rule-tester/flat-rule-tester.js#L419)

• `Static` `set` **itOnly**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `any` |

#### Returns

`void`

#### Defined in

[rule-tester/flat-rule-tester.js:442](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/rule-tester/flat-rule-tester.js#L442)

## Methods

### run

▸ **run**(`ruleName`, `rule`, `test`): `void`

Adds a new rule test to execute.

**`Throws`**

If non-object `test`, or if a required
scenario of the given type is missing.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `ruleName` | `string` | The name of the rule to run. |
| `rule` | `Function` | The rule to test. |
| `test` | `Object` | The collection of tests to run. |
| `test.invalid` | [`InvalidTestCase`](../interfaces/rule_tester_flat_rule_tester.InvalidTestCase.md)[] | - |
| `test.valid` | (`string` \| [`ValidTestCase`](../interfaces/rule_tester_flat_rule_tester.ValidTestCase.md))[] | - |

#### Returns

`void`

#### Defined in

[rule-tester/flat-rule-tester.js:459](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/rule-tester/flat-rule-tester.js#L459)

___

### getDefaultConfig

▸ `Static` **getDefaultConfig**(): `any`

Get the current configuration used for all tests

#### Returns

`any`

the current configuration

#### Defined in

[rule-tester/flat-rule-tester.js:361](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/rule-tester/flat-rule-tester.js#L361)

___

### only

▸ `Static` **only**(`item`): [`ValidTestCase`](../interfaces/rule_tester_flat_rule_tester.ValidTestCase.md) \| [`InvalidTestCase`](../interfaces/rule_tester_flat_rule_tester.InvalidTestCase.md)

Adds the `only` property to a test to run it in isolation.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `item` | `string` \| [`ValidTestCase`](../interfaces/rule_tester_flat_rule_tester.ValidTestCase.md) \| [`InvalidTestCase`](../interfaces/rule_tester_flat_rule_tester.InvalidTestCase.md) | A single test to run by itself. |

#### Returns

[`ValidTestCase`](../interfaces/rule_tester_flat_rule_tester.ValidTestCase.md) \| [`InvalidTestCase`](../interfaces/rule_tester_flat_rule_tester.InvalidTestCase.md)

The test with `only` set.

#### Defined in

[rule-tester/flat-rule-tester.js:411](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/rule-tester/flat-rule-tester.js#L411)

___

### resetDefaultConfig

▸ `Static` **resetDefaultConfig**(): `void`

Reset the configuration to the initial configuration of the tester removing
any changes made until now.

#### Returns

`void`

#### Defined in

[rule-tester/flat-rule-tester.js:370](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/rule-tester/flat-rule-tester.js#L370)

___

### setDefaultConfig

▸ `Static` **setDefaultConfig**(`config`): `void`

Set the configuration to use for all future tests

**`Throws`**

If non-object config.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `config` | `any` | the configuration to use. |

#### Returns

`void`

#### Defined in

[rule-tester/flat-rule-tester.js:347](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/rule-tester/flat-rule-tester.js#L347)
