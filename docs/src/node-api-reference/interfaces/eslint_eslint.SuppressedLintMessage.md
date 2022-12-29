[ESLint Node.js API Reference](../index.md) / [eslint/eslint](../modules/eslint_eslint.md) / SuppressedLintMessage

# Interface: SuppressedLintMessage<\>

[eslint/eslint](../modules/eslint_eslint.md).SuppressedLintMessage

## Table of contents

### Properties

* [column](eslint_eslint.SuppressedLintMessage.md#column)
* [endColumn](eslint_eslint.SuppressedLintMessage.md#endcolumn)
* [endLine](eslint_eslint.SuppressedLintMessage.md#endline)
* [fatal](eslint_eslint.SuppressedLintMessage.md#fatal)
* [fix](eslint_eslint.SuppressedLintMessage.md#fix)
* [line](eslint_eslint.SuppressedLintMessage.md#line)
* [message](eslint_eslint.SuppressedLintMessage.md#message)
* [ruleId](eslint_eslint.SuppressedLintMessage.md#ruleid)
* [severity](eslint_eslint.SuppressedLintMessage.md#severity)
* [suggestions](eslint_eslint.SuppressedLintMessage.md#suggestions)
* [suppressions](eslint_eslint.SuppressedLintMessage.md#suppressions)

## Properties

### column

• **column**: `number`

The 1-based column number.

#### Defined in

[shared/types.js:110](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/shared/types.js#L110)

___

### endColumn

• **endColumn**: `number`

The 1-based column number of the end location.

#### Defined in

[shared/types.js:111](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/shared/types.js#L111)

___

### endLine

• **endLine**: `number`

The 1-based line number of the end location.

#### Defined in

[shared/types.js:112](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/shared/types.js#L112)

___

### fatal

• **fatal**: `boolean`

If `true` then this is a fatal error.

#### Defined in

[shared/types.js:113](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/shared/types.js#L113)

___

### fix

• **fix**: `Object`

Information for autofix.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `range` | [`number`, `number`] |
| `text` | `string` |

#### Defined in

[shared/types.js:114](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/shared/types.js#L114)

___

### line

• **line**: `number`

The 1-based line number.

#### Defined in

[shared/types.js:115](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/shared/types.js#L115)

___

### message

• **message**: `string`

The error message.

#### Defined in

[shared/types.js:116](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/shared/types.js#L116)

___

### ruleId

• **ruleId**: `string`

The ID of the rule which makes this message.

#### Defined in

[shared/types.js:117](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/shared/types.js#L117)

___

### severity

• **severity**: ``0`` \| ``1`` \| ``2``

The severity of this message.

#### Defined in

[shared/types.js:118](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/shared/types.js#L118)

___

### suggestions

• **suggestions**: { `desc?`: `string` ; `fix`: { `range`: [`number`, `number`] ; `text`: `string`  } ; `messageId?`: `string`  }[]

Information for suggestions.

#### Defined in

[shared/types.js:120](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/shared/types.js#L120)

___

### suppressions

• **suppressions**: { `justification`: `string` ; `kind`: `string`  }[]

The suppression info.

#### Defined in

[shared/types.js:119](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/shared/types.js#L119)
