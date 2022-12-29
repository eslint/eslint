[ESLint Node.js API Reference](../index.md) / [rule-tester/flat-rule-tester](../modules/rule_tester_flat_rule_tester.md) / Parser

# Interface: Parser<\>

[rule-tester/flat-rule-tester](../modules/rule_tester_flat_rule_tester.md).Parser

## Table of contents

### Properties

* [parse](rule_tester_flat_rule_tester.Parser.md#parse)
* [parseForESLint](rule_tester_flat_rule_tester.Parser.md#parseforeslint)

## Properties

### parse

• **parse**: (`text`: `string`, `options`: [`ParserOptions`](eslint_flat_eslint.ParserOptions.md)) => `any`

#### Type declaration

▸ (`text`, `options`): `any`

The definition of global variables.

##### Parameters

| Name | Type |
| :------ | :------ |
| `text` | `string` |
| `options` | [`ParserOptions`](eslint_flat_eslint.ParserOptions.md) |

##### Returns

`any`

#### Defined in

[shared/types.js:84](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/shared/types.js#L84)

___

### parseForESLint

• **parseForESLint**: (`text`: `string`, `options`: [`ParserOptions`](eslint_flat_eslint.ParserOptions.md)) => `ParseResult`

#### Type declaration

▸ (`text`, `options`): `ParseResult`

The parser options that will be enabled under this environment.

##### Parameters

| Name | Type |
| :------ | :------ |
| `text` | `string` |
| `options` | [`ParserOptions`](eslint_flat_eslint.ParserOptions.md) |

##### Returns

`ParseResult`

#### Defined in

[shared/types.js:85](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/shared/types.js#L85)
