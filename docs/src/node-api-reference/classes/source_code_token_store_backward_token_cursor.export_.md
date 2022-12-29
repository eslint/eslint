[ESLint Node.js API Reference](../index.md) / [source-code/token-store/backward-token-cursor](../modules/source_code_token_store_backward_token_cursor.md) / export=

# Class: export=

[source-code/token-store/backward-token-cursor](../modules/source_code_token_store_backward_token_cursor.md).export=

## Table of contents

### Properties

* [current](source_code_token_store_backward_token_cursor.export_.md#current)
* [index](source_code_token_store_backward_token_cursor.export_.md#index)
* [indexEnd](source_code_token_store_backward_token_cursor.export_.md#indexend)
* [tokens](source_code_token_store_backward_token_cursor.export_.md#tokens)

### Methods

* [getAllTokens](source_code_token_store_backward_token_cursor.export_.md#getalltokens)
* [getOneToken](source_code_token_store_backward_token_cursor.export_.md#getonetoken)
* [moveNext](source_code_token_store_backward_token_cursor.export_.md#movenext)

## Properties

### current

• **current**: `any`

#### Defined in

[source-code/token-store/backward-token-cursor.js:41](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/source-code/token-store/backward-token-cursor.js#L41)

___

### index

• **index**: `number`

#### Defined in

[source-code/token-store/backward-token-cursor.js:34](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/source-code/token-store/backward-token-cursor.js#L34)

___

### indexEnd

• **indexEnd**: `number`

#### Defined in

[source-code/token-store/backward-token-cursor.js:35](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/source-code/token-store/backward-token-cursor.js#L35)

___

### tokens

• **tokens**: `Token`[]

#### Defined in

[source-code/token-store/backward-token-cursor.js:33](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/source-code/token-store/backward-token-cursor.js#L33)

## Methods

### getAllTokens

▸ **getAllTokens**(): `any`[]

Gets the first tokens.
This consumes this cursor.

#### Returns

`any`[]

All tokens.

#### Defined in

[source-code/token-store/cursor.js:57](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/source-code/token-store/cursor.js#L57)

___

### getOneToken

▸ **getOneToken**(): `any`

**`Inherit Doc`**

#### Returns

`any`

#### Defined in

[source-code/token-store/backward-token-cursor.js:55](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/source-code/token-store/backward-token-cursor.js#L55)

___

### moveNext

▸ **moveNext**(): `boolean`

**`Inherit Doc`**

#### Returns

`boolean`

#### Defined in

[source-code/token-store/backward-token-cursor.js:39](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/source-code/token-store/backward-token-cursor.js#L39)
