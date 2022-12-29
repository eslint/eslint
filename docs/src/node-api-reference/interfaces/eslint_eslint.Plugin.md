[ESLint Node.js API Reference](../index.md) / [eslint/eslint](../modules/eslint_eslint.md) / Plugin

# Interface: Plugin<\>

[eslint/eslint](../modules/eslint_eslint.md).Plugin

## Table of contents

### Properties

* [configs](eslint_eslint.Plugin.md#configs)
* [environments](eslint_eslint.Plugin.md#environments)
* [processors](eslint_eslint.Plugin.md#processors)
* [rules](eslint_eslint.Plugin.md#rules)

## Properties

### configs

• **configs**: `Record`<`string`, [`ConfigData`](eslint_eslint.ConfigData.md)\>

The definition of plugin configs.

#### Defined in

[shared/types.js:164](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/shared/types.js#L164)

___

### environments

• **environments**: `Record`<`string`, `Environment`\>

The definition of plugin environments.

#### Defined in

[shared/types.js:165](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/shared/types.js#L165)

___

### processors

• **processors**: `Record`<`string`, `Processor`\>

The definition of plugin processors.

#### Defined in

[shared/types.js:166](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/shared/types.js#L166)

___

### rules

• **rules**: `Record`<`string`, `Function` \| [`Rule`](eslint_eslint.Rule.md)\>

The definition of plugin rules.

#### Defined in

[shared/types.js:167](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/shared/types.js#L167)
