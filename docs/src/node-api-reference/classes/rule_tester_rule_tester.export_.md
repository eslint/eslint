[ESLint Node.js API Reference](../index.md) / [rule-tester/rule-tester](../modules/rule_tester_rule_tester.md) / export=

# Class: export=

[rule-tester/rule-tester](../modules/rule_tester_rule_tester.md).export=

Mocha test wrapper.

## Table of contents

### Constructors

* [constructor](rule_tester_rule_tester.export_.md#constructor)

### Properties

* [[DESCRIBE]](rule_tester_rule_tester.export_.md#[describe])
* [[IT]](rule_tester_rule_tester.export_.md#[it])
* [[IT\_ONLY]](rule_tester_rule_tester.export_.md#[it_only])
* [linter](rule_tester_rule_tester.export_.md#linter)
* [rules](rule_tester_rule_tester.export_.md#rules)
* [testerConfig](rule_tester_rule_tester.export_.md#testerconfig)

### Accessors

* [describe](rule_tester_rule_tester.export_.md#describe)
* [it](rule_tester_rule_tester.export_.md#it)
* [itOnly](rule_tester_rule_tester.export_.md#itonly)

### Methods

* [defineRule](rule_tester_rule_tester.export_.md#definerule)
* [run](rule_tester_rule_tester.export_.md#run)
* [getDefaultConfig](rule_tester_rule_tester.export_.md#getdefaultconfig)
* [only](rule_tester_rule_tester.export_.md#only)
* [resetDefaultConfig](rule_tester_rule_tester.export_.md#resetdefaultconfig)
* [setDefaultConfig](rule_tester_rule_tester.export_.md#setdefaultconfig)

## Constructors

### constructor

• **new export=**(`testerConfig?`)

Creates a new instance of RuleTester.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `testerConfig?` | `any` | Optional, extra configuration for the tester |

#### Defined in

[rule-tester/rule-tester.js:386](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/rule-tester/rule-tester.js#L386)

## Properties

### [DESCRIBE]

• **[DESCRIBE]**: `any`

#### Defined in

[rule-tester/rule-tester.js:455](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/rule-tester/rule-tester.js#L455)

___

### [IT]

• **[IT]**: `any`

#### Defined in

[rule-tester/rule-tester.js:466](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/rule-tester/rule-tester.js#L466)

___

### [IT\_ONLY]

• **[IT\_ONLY]**: `any`

#### Defined in

[rule-tester/rule-tester.js:506](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/rule-tester/rule-tester.js#L506)

___

### linter

• **linter**: `Linter`

#### Defined in

[rule-tester/rule-tester.js:405](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/rule-tester/rule-tester.js#L405)

___

### rules

• **rules**: `any`

Rule definitions to define before tests.

#### Defined in

[rule-tester/rule-tester.js:404](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/rule-tester/rule-tester.js#L404)

___

### testerConfig

• **testerConfig**: `any`

The configuration to use for this tester. Combination of the tester
configuration and the default configuration.

#### Defined in

[rule-tester/rule-tester.js:393](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/rule-tester/rule-tester.js#L393)

## Accessors

### describe

• `Static` `get` **describe**(): `any`

#### Returns

`any`

#### Defined in

[rule-tester/rule-tester.js:447](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/rule-tester/rule-tester.js#L447)

• `Static` `set` **describe**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `any` |

#### Returns

`void`

#### Defined in

[rule-tester/rule-tester.js:454](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/rule-tester/rule-tester.js#L454)

___

### it

• `Static` `get` **it**(): `any`

#### Returns

`any`

#### Defined in

[rule-tester/rule-tester.js:458](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/rule-tester/rule-tester.js#L458)

• `Static` `set` **it**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `any` |

#### Returns

`void`

#### Defined in

[rule-tester/rule-tester.js:465](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/rule-tester/rule-tester.js#L465)

___

### itOnly

• `Static` `get` **itOnly**(): `any`

#### Returns

`any`

#### Defined in

[rule-tester/rule-tester.js:482](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/rule-tester/rule-tester.js#L482)

• `Static` `set` **itOnly**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `any` |

#### Returns

`void`

#### Defined in

[rule-tester/rule-tester.js:505](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/rule-tester/rule-tester.js#L505)

## Methods

### defineRule

▸ **defineRule**(`name`, `rule`): `void`

Define a rule for one particular run of tests.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | The name of the rule to define. |
| `rule` | `Function` | The rule definition. |

#### Returns

`void`

#### Defined in

[rule-tester/rule-tester.js:515](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/rule-tester/rule-tester.js#L515)

___

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
| `test.invalid` | [`InvalidTestCase`](../interfaces/rule_tester_rule_tester.InvalidTestCase.md)[] | - |
| `test.valid` | (`string` \| [`ValidTestCase`](../interfaces/rule_tester_rule_tester.ValidTestCase.md))[] | - |

#### Returns

`void`

#### Defined in

[rule-tester/rule-tester.js:531](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/rule-tester/rule-tester.js#L531)

___

### getDefaultConfig

▸ `Static` **getDefaultConfig**(): `any`

Get the current configuration used for all tests

#### Returns

`any`

the current configuration

#### Defined in

[rule-tester/rule-tester.js:428](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/rule-tester/rule-tester.js#L428)

___

### only

▸ `Static` **only**(`item`): [`ValidTestCase`](../interfaces/rule_tester_rule_tester.ValidTestCase.md) \| [`InvalidTestCase`](../interfaces/rule_tester_rule_tester.InvalidTestCase.md)

Adds the `only` property to a test to run it in isolation.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `item` | `string` \| [`ValidTestCase`](../interfaces/rule_tester_rule_tester.ValidTestCase.md) \| [`InvalidTestCase`](../interfaces/rule_tester_rule_tester.InvalidTestCase.md) | A single test to run by itself. |

#### Returns

[`ValidTestCase`](../interfaces/rule_tester_rule_tester.ValidTestCase.md) \| [`InvalidTestCase`](../interfaces/rule_tester_rule_tester.InvalidTestCase.md)

The test with `only` set.

#### Defined in

[rule-tester/rule-tester.js:474](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/rule-tester/rule-tester.js#L474)

___

### resetDefaultConfig

▸ `Static` **resetDefaultConfig**(): `void`

Reset the configuration to the initial configuration of the tester removing
any changes made until now.

#### Returns

`void`

#### Defined in

[rule-tester/rule-tester.js:437](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/rule-tester/rule-tester.js#L437)

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

[rule-tester/rule-tester.js:414](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/rule-tester/rule-tester.js#L414)
