[ESLint Node.js API Reference](../index.md) / [source-code/token-store](../modules/source_code_token_store.md) / export=

# Class: export=

[source-code/token-store](../modules/source_code_token_store.md).export=

## Hierarchy

* **`export=`**

  ↳ [`export=`](source_code_source_code.export_.md)

## Table of contents

### Properties

* [[COMMENTS]](source_code_token_store.export_.md#[comments])
* [[INDEX\_MAP]](source_code_token_store.export_.md#[index_map])
* [[TOKENS]](source_code_token_store.export_.md#[tokens])

### Methods

* [commentsExistBetween](source_code_token_store.export_.md#commentsexistbetween)
* [getCommentsAfter](source_code_token_store.export_.md#getcommentsafter)
* [getCommentsBefore](source_code_token_store.export_.md#getcommentsbefore)
* [getCommentsInside](source_code_token_store.export_.md#getcommentsinside)
* [getFirstToken](source_code_token_store.export_.md#getfirsttoken)
* [getFirstTokenBetween](source_code_token_store.export_.md#getfirsttokenbetween)
* [getFirstTokens](source_code_token_store.export_.md#getfirsttokens)
* [getFirstTokensBetween](source_code_token_store.export_.md#getfirsttokensbetween)
* [getLastToken](source_code_token_store.export_.md#getlasttoken)
* [getLastTokenBetween](source_code_token_store.export_.md#getlasttokenbetween)
* [getLastTokens](source_code_token_store.export_.md#getlasttokens)
* [getLastTokensBetween](source_code_token_store.export_.md#getlasttokensbetween)
* [getTokenAfter](source_code_token_store.export_.md#gettokenafter)
* [getTokenBefore](source_code_token_store.export_.md#gettokenbefore)
* [getTokenByRangeStart](source_code_token_store.export_.md#gettokenbyrangestart)
* [getTokenOrCommentAfter](source_code_token_store.export_.md#gettokenorcommentafter)
* [getTokenOrCommentBefore](source_code_token_store.export_.md#gettokenorcommentbefore)
* [getTokens](source_code_token_store.export_.md#gettokens)
* [getTokensAfter](source_code_token_store.export_.md#gettokensafter)
* [getTokensBefore](source_code_token_store.export_.md#gettokensbefore)
* [getTokensBetween](source_code_token_store.export_.md#gettokensbetween)

## Properties

### [COMMENTS]

• **[COMMENTS]**: `Comment`[]

#### Defined in

[source-code/token-store/index.js:214](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/source-code/token-store/index.js#L214)

___

### [INDEX\_MAP]

• **[INDEX\_MAP]**: `any`

#### Defined in

[source-code/token-store/index.js:215](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/source-code/token-store/index.js#L215)

___

### [TOKENS]

• **[TOKENS]**: `Token`[]

#### Defined in

[source-code/token-store/index.js:213](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/source-code/token-store/index.js#L213)

## Methods

### commentsExistBetween

▸ **commentsExistBetween**(`left`, `right`): `boolean`

Checks whether any comments exist or not between the given 2 nodes.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `left` | `ASTNode` | The node to check. |
| `right` | `ASTNode` | The node to check. |

#### Returns

`boolean`

`true` if one or more comments exist.

#### Defined in

[source-code/token-store/index.js:569](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/source-code/token-store/index.js#L569)

___

### getCommentsAfter

▸ **getCommentsAfter**(`nodeOrToken`): `any`[]

Gets all comment tokens directly after the given node or token.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `nodeOrToken` | `any` | The AST node or token to check for adjacent comment tokens. |

#### Returns

`any`[]

An array of comments in occurrence order.

#### Defined in

[source-code/token-store/index.js:602](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/source-code/token-store/index.js#L602)

___

### getCommentsBefore

▸ **getCommentsBefore**(`nodeOrToken`): `any`[]

Gets all comment tokens directly before the given node or token.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `nodeOrToken` | `any` | The AST node or token to check for adjacent comment tokens. |

#### Returns

`any`[]

An array of comments in occurrence order.

#### Defined in

[source-code/token-store/index.js:583](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/source-code/token-store/index.js#L583)

___

### getCommentsInside

▸ **getCommentsInside**(`node`): `any`[]

Gets all comment tokens inside the given node.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `node` | `ASTNode` | The AST node to get the comments for. |

#### Returns

`any`[]

An array of comments in occurrence order.

#### Defined in

[source-code/token-store/index.js:621](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/source-code/token-store/index.js#L621)

___

### getFirstToken

▸ **getFirstToken**(`node`, `options?`): `any`

Gets the first token of the given node.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `node` | `ASTNode` | The AST node. |
| `options?` | `any` | The option object. If this is a number then it's `options.skip`. If this is a function then it's `options.filter`. |

#### Returns

`any`

An object representing the token.

#### Defined in

[source-code/token-store/index.js:255](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/source-code/token-store/index.js#L255)

___

### getFirstTokenBetween

▸ **getFirstTokenBetween**(`left`, `right`, `options?`): `any`

Gets the first token between two non-overlapping nodes.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `left` | `any` | Node before the desired token range. |
| `right` | `any` | Node after the desired token range. |
| `options?` | `any` | The option object. Same options as getFirstToken() |

#### Returns

`any`

An object representing the token.

#### Defined in

[source-code/token-store/index.js:328](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/source-code/token-store/index.js#L328)

___

### getFirstTokens

▸ **getFirstTokens**(`node`, `options?`): `Token`[]

Gets the first `count` tokens of the given node.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `node` | `ASTNode` | The AST node. |
| `options?` | `any` | The option object. If this is a number then it's `options.count`. If this is a function then it's `options.filter`. |

#### Returns

`Token`[]

Tokens.

#### Defined in

[source-code/token-store/index.js:398](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/source-code/token-store/index.js#L398)

___

### getFirstTokensBetween

▸ **getFirstTokensBetween**(`left`, `right`, `options?`): `Token`[]

Gets the first `count` tokens between two non-overlapping nodes.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `left` | `any` | Node before the desired token range. |
| `right` | `any` | Node after the desired token range. |
| `options?` | `any` | The option object. Same options as getFirstTokens() |

#### Returns

`Token`[]

Tokens between left and right.

#### Defined in

[source-code/token-store/index.js:471](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/source-code/token-store/index.js#L471)

___

### getLastToken

▸ **getLastToken**(`node`, `options?`): `any`

Gets the last token of the given node.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `node` | `ASTNode` | The AST node. |
| `options?` | `any` | The option object. Same options as getFirstToken() |

#### Returns

`any`

An object representing the token.

#### Defined in

[source-code/token-store/index.js:273](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/source-code/token-store/index.js#L273)

___

### getLastTokenBetween

▸ **getLastTokenBetween**(`left`, `right`, `options?`): `any`

Gets the last token between two non-overlapping nodes.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `left` | `any` | Node before the desired token range. |
| `right` | `any` | Node after the desired token range. |
| `options?` | `any` | The option object. Same options as getFirstToken() |

#### Returns

`any`

An object representing the token.

#### Defined in

[source-code/token-store/index.js:347](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/source-code/token-store/index.js#L347)

___

### getLastTokens

▸ **getLastTokens**(`node`, `options?`): `Token`[]

Gets the last `count` tokens of the given node.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `node` | `ASTNode` | The AST node. |
| `options?` | `any` | The option object. Same options as getFirstTokens() |

#### Returns

`Token`[]

Tokens.

#### Defined in

[source-code/token-store/index.js:416](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/source-code/token-store/index.js#L416)

___

### getLastTokensBetween

▸ **getLastTokensBetween**(`left`, `right`, `options?`): `Token`[]

Gets the last `count` tokens between two non-overlapping nodes.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `left` | `any` | Node before the desired token range. |
| `right` | `any` | Node after the desired token range. |
| `options?` | `any` | The option object. Same options as getFirstTokens() |

#### Returns

`Token`[]

Tokens between left and right.

#### Defined in

[source-code/token-store/index.js:490](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/source-code/token-store/index.js#L490)

___

### getTokenAfter

▸ **getTokenAfter**(`node`, `options?`): `any`

Gets the token that follows a given node or token.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `node` | `any` | The AST node or token. |
| `options?` | `any` | The option object. Same options as getFirstToken() |

#### Returns

`any`

An object representing the token.

#### Defined in

[source-code/token-store/index.js:309](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/source-code/token-store/index.js#L309)

___

### getTokenBefore

▸ **getTokenBefore**(`node`, `options?`): `any`

Gets the token that precedes a given node or token.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `node` | `any` | The AST node or token. |
| `options?` | `any` | The option object. Same options as getFirstToken() |

#### Returns

`any`

An object representing the token.

#### Defined in

[source-code/token-store/index.js:291](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/source-code/token-store/index.js#L291)

___

### getTokenByRangeStart

▸ **getTokenByRangeStart**(`offset`, `options?`): `any`

Gets the token starting at the specified index.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `offset` | `number` | Index of the start of the token's range. |
| `options?` | `Object` | The option object. |
| `options.includeComments` | `boolean` | The flag to iterate comments as well. |

#### Returns

`any`

The token starting at index, or null if no such token.

#### Defined in

[source-code/token-store/index.js:229](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/source-code/token-store/index.js#L229)

___

### getTokenOrCommentAfter

▸ **getTokenOrCommentAfter**(`node`, `skip?`): `any`

Gets the token that follows a given node or token in the token stream.
This is defined for backward compatibility. Use `includeComments` option instead.
TODO: We have a plan to remove this in a future major version.

**`Deprecated`**

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `node` | `any` | The AST node or token. |
| `skip?` | `number` | A number of tokens to skip. |

#### Returns

`any`

An object representing the token.

#### Defined in

[source-code/token-store/index.js:381](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/source-code/token-store/index.js#L381)

___

### getTokenOrCommentBefore

▸ **getTokenOrCommentBefore**(`node`, `skip?`): `any`

Gets the token that precedes a given node or token in the token stream.
This is defined for backward compatibility. Use `includeComments` option instead.
TODO: We have a plan to remove this in a future major version.

**`Deprecated`**

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `node` | `any` | The AST node or token. |
| `skip?` | `number` | A number of tokens to skip. |

#### Returns

`any`

An object representing the token.

#### Defined in

[source-code/token-store/index.js:368](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/source-code/token-store/index.js#L368)

___

### getTokens

▸ **getTokens**(`node`, `beforeCount?`, `afterCount?`): `Token`[]

Gets all tokens that are related to the given node.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `node` | `ASTNode` | The AST node. |
| `beforeCount?` | `int` | The number of tokens before the node to retrieve. |
| `afterCount?` | `int` | The number of tokens after the node to retrieve. |

#### Returns

`Token`[]

Array of objects representing tokens.

#### Defined in

[source-code/token-store/index.js:518](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/source-code/token-store/index.js#L518)

___

### getTokensAfter

▸ **getTokensAfter**(`node`, `options?`): `Token`[]

Gets the `count` tokens that follows a given node or token.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `node` | `any` | The AST node or token. |
| `options?` | `any` | The option object. Same options as getFirstTokens() |

#### Returns

`Token`[]

Tokens.

#### Defined in

[source-code/token-store/index.js:452](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/source-code/token-store/index.js#L452)

___

### getTokensBefore

▸ **getTokensBefore**(`node`, `options?`): `Token`[]

Gets the `count` tokens that precedes a given node or token.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `node` | `any` | The AST node or token. |
| `options?` | `any` | The option object. Same options as getFirstTokens() |

#### Returns

`Token`[]

Tokens.

#### Defined in

[source-code/token-store/index.js:434](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/source-code/token-store/index.js#L434)

___

### getTokensBetween

▸ **getTokensBetween**(`left`, `right`, `padding?`): `Token`[]

Gets all of the tokens between two non-overlapping nodes.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `left` | `any` | Node before the desired token range. |
| `right` | `any` | Node after the desired token range. |
| `padding?` | `int` | Number of extra tokens on either side of center. |

#### Returns

`Token`[]

Tokens between left and right.

#### Defined in

[source-code/token-store/index.js:547](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/source-code/token-store/index.js#L547)
