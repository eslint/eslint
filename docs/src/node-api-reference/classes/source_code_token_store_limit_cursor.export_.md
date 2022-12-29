[ESLint Node.js API Reference](../index.md) / [source-code/token-store/limit-cursor](../modules/source_code_token_store_limit_cursor.md) / export=

# Class: export=

[source-code/token-store/limit-cursor](../modules/source_code_token_store_limit_cursor.md).export=

## Table of contents

### Properties

* [count](source_code_token_store_limit_cursor.export_.md#count)
* [current](source_code_token_store_limit_cursor.export_.md#current)
* [cursor](source_code_token_store_limit_cursor.export_.md#cursor)

### Methods

* [getAllTokens](source_code_token_store_limit_cursor.export_.md#getalltokens)
* [getOneToken](source_code_token_store_limit_cursor.export_.md#getonetoken)
* [moveNext](source_code_token_store_limit_cursor.export_.md#movenext)

## Properties

### count

• **count**: `number`

#### Defined in

[source-code/token-store/limit-cursor.js:29](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/source-code/token-store/limit-cursor.js#L29)

___

### current

• **current**: `any`

#### Defined in

[source-code/token-store/decorative-cursor.js:35](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/source-code/token-store/decorative-cursor.js#L35)

___

### cursor

• **cursor**: [`export=`](source_code_token_store_cursor.export_.md)

#### Defined in

[source-code/token-store/decorative-cursor.js:28](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/source-code/token-store/decorative-cursor.js#L28)

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

Gets the first token.
This consumes this cursor.

#### Returns

`any`

The first token or null.

#### Defined in

[source-code/token-store/cursor.js:48](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/source-code/token-store/cursor.js#L48)

___

### moveNext

▸ **moveNext**(): `boolean`

**`Inherit Doc`**

#### Returns

`boolean`

#### Defined in

[source-code/token-store/limit-cursor.js:33](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/source-code/token-store/limit-cursor.js#L33)
