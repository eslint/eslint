[ESLint Node.js API Reference](../index.md) / [source-code/token-store/cursor](../modules/source_code_token_store_cursor.md) / export=

# Class: export=

[source-code/token-store/cursor](../modules/source_code_token_store_cursor.md).export=

## Table of contents

### Properties

* [current](source_code_token_store_cursor.export_.md#current)

### Methods

* [getAllTokens](source_code_token_store_cursor.export_.md#getalltokens)
* [getOneToken](source_code_token_store_cursor.export_.md#getonetoken)
* [moveNext](source_code_token_store_cursor.export_.md#movenext)

## Properties

### current

• **current**: `any`

#### Defined in

[source-code/token-store/cursor.js:40](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/source-code/token-store/cursor.js#L40)

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

Moves this cursor to the next token.

**`Abstract`**

#### Returns

`boolean`

`true` if the next token exists.

#### Defined in

[source-code/token-store/cursor.js:73](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/source-code/token-store/cursor.js#L73)
