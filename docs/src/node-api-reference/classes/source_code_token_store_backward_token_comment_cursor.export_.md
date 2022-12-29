[ESLint Node.js API Reference](../index.md) / [source-code/token-store/backward-token-comment-cursor](../modules/source_code_token_store_backward_token_comment_cursor.md) / export=

# Class: export=

[source-code/token-store/backward-token-comment-cursor](../modules/source_code_token_store_backward_token_comment_cursor.md).export=

## Table of contents

### Properties

* [border](source_code_token_store_backward_token_comment_cursor.export_.md#border)
* [commentIndex](source_code_token_store_backward_token_comment_cursor.export_.md#commentindex)
* [comments](source_code_token_store_backward_token_comment_cursor.export_.md#comments)
* [current](source_code_token_store_backward_token_comment_cursor.export_.md#current)
* [tokenIndex](source_code_token_store_backward_token_comment_cursor.export_.md#tokenindex)
* [tokens](source_code_token_store_backward_token_comment_cursor.export_.md#tokens)

### Methods

* [getAllTokens](source_code_token_store_backward_token_comment_cursor.export_.md#getalltokens)
* [getOneToken](source_code_token_store_backward_token_comment_cursor.export_.md#getonetoken)
* [moveNext](source_code_token_store_backward_token_comment_cursor.export_.md#movenext)

## Properties

### border

• **border**: `number`

#### Defined in

[source-code/token-store/backward-token-comment-cursor.js:37](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/source-code/token-store/backward-token-comment-cursor.js#L37)

___

### commentIndex

• **commentIndex**: `number`

#### Defined in

[source-code/token-store/backward-token-comment-cursor.js:36](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/source-code/token-store/backward-token-comment-cursor.js#L36)

___

### comments

• **comments**: `Comment`[]

#### Defined in

[source-code/token-store/backward-token-comment-cursor.js:34](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/source-code/token-store/backward-token-comment-cursor.js#L34)

___

### current

• **current**: `any`

#### Defined in

[source-code/token-store/backward-token-comment-cursor.js:46](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/source-code/token-store/backward-token-comment-cursor.js#L46)

[source-code/token-store/backward-token-comment-cursor.js:49](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/source-code/token-store/backward-token-comment-cursor.js#L49)

[source-code/token-store/backward-token-comment-cursor.js:52](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/source-code/token-store/backward-token-comment-cursor.js#L52)

___

### tokenIndex

• **tokenIndex**: `number`

#### Defined in

[source-code/token-store/backward-token-comment-cursor.js:35](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/source-code/token-store/backward-token-comment-cursor.js#L35)

___

### tokens

• **tokens**: `Token`[]

#### Defined in

[source-code/token-store/backward-token-comment-cursor.js:33](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/source-code/token-store/backward-token-comment-cursor.js#L33)

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

[source-code/token-store/backward-token-comment-cursor.js:41](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/source-code/token-store/backward-token-comment-cursor.js#L41)
