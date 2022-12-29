[ESLint Node.js API Reference](../index.md) / [eslint/eslint](../modules/eslint_eslint.md) / LoadedFormatter

# Interface: LoadedFormatter<\>

[eslint/eslint](../modules/eslint_eslint.md).LoadedFormatter

## Table of contents

### Properties

* [format](eslint_eslint.LoadedFormatter.md#format)

## Properties

### format

• **format**: (`results`: [`LintResult`](eslint_eslint.LintResult.md)[], `resultsMeta`: [`ResultsMeta`](eslint_eslint.ResultsMeta.md)) => `string` \| `Promise`<`string`\>

#### Type declaration

▸ (`results`, `resultsMeta`): `string` \| `Promise`<`string`\>

format function.

##### Parameters

| Name | Type |
| :------ | :------ |
| `results` | [`LintResult`](eslint_eslint.LintResult.md)[] |
| `resultsMeta` | [`ResultsMeta`](eslint_eslint.ResultsMeta.md) |

##### Returns

`string` \| `Promise`<`string`\>

#### Defined in

[eslint/eslint.js:44](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/eslint/eslint.js#L44)
