[ESLint Node.js API Reference](../index.md) / [source-code/source-code](../modules/source_code_source_code.md) / export=

# Class: export=

[source-code/source-code](../modules/source_code_source_code.md).export=

Represents parsed source code.

## Hierarchy

* [`export=`](source_code_token_store.export_.md)

  ↳ **`export=`**

## Table of contents

### Constructors

* [constructor](source_code_source_code.export_.md#constructor)

### Properties

* [[COMMENTS]](source_code_source_code.export_.md#[comments])
* [[INDEX\_MAP]](source_code_source_code.export_.md#[index_map])
* [[TOKENS]](source_code_source_code.export_.md#[tokens])
* [\_commentCache](source_code_source_code.export_.md#_commentcache)
* [ast](source_code_source_code.export_.md#ast)
* [hasBOM](source_code_source_code.export_.md#hasbom)
* [lineStartIndices](source_code_source_code.export_.md#linestartindices)
* [lines](source_code_source_code.export_.md#lines)
* [parserServices](source_code_source_code.export_.md#parserservices)
* [scopeManager](source_code_source_code.export_.md#scopemanager)
* [text](source_code_source_code.export_.md#text)
* [tokensAndComments](source_code_source_code.export_.md#tokensandcomments)
* [visitorKeys](source_code_source_code.export_.md#visitorkeys)

### Methods

* [commentsExistBetween](source_code_source_code.export_.md#commentsexistbetween)
* [getAllComments](source_code_source_code.export_.md#getallcomments)
* [getComments](source_code_source_code.export_.md#getcomments)
* [getCommentsAfter](source_code_source_code.export_.md#getcommentsafter)
* [getCommentsBefore](source_code_source_code.export_.md#getcommentsbefore)
* [getCommentsInside](source_code_source_code.export_.md#getcommentsinside)
* [getFirstToken](source_code_source_code.export_.md#getfirsttoken)
* [getFirstTokenBetween](source_code_source_code.export_.md#getfirsttokenbetween)
* [getFirstTokens](source_code_source_code.export_.md#getfirsttokens)
* [getFirstTokensBetween](source_code_source_code.export_.md#getfirsttokensbetween)
* [getIndexFromLoc](source_code_source_code.export_.md#getindexfromloc)
* [getJSDocComment](source_code_source_code.export_.md#getjsdoccomment)
* [getLastToken](source_code_source_code.export_.md#getlasttoken)
* [getLastTokenBetween](source_code_source_code.export_.md#getlasttokenbetween)
* [getLastTokens](source_code_source_code.export_.md#getlasttokens)
* [getLastTokensBetween](source_code_source_code.export_.md#getlasttokensbetween)
* [getLines](source_code_source_code.export_.md#getlines)
* [getLocFromIndex](source_code_source_code.export_.md#getlocfromindex)
* [getNodeByRangeIndex](source_code_source_code.export_.md#getnodebyrangeindex)
* [getText](source_code_source_code.export_.md#gettext)
* [getTokenAfter](source_code_source_code.export_.md#gettokenafter)
* [getTokenBefore](source_code_source_code.export_.md#gettokenbefore)
* [getTokenByRangeStart](source_code_source_code.export_.md#gettokenbyrangestart)
* [getTokenOrCommentAfter](source_code_source_code.export_.md#gettokenorcommentafter)
* [getTokenOrCommentBefore](source_code_source_code.export_.md#gettokenorcommentbefore)
* [getTokens](source_code_source_code.export_.md#gettokens)
* [getTokensAfter](source_code_source_code.export_.md#gettokensafter)
* [getTokensBefore](source_code_source_code.export_.md#gettokensbefore)
* [getTokensBetween](source_code_source_code.export_.md#gettokensbetween)
* [isSpaceBetween](source_code_source_code.export_.md#isspacebetween)
* [isSpaceBetweenTokens](source_code_source_code.export_.md#isspacebetweentokens)
* [splitLines](source_code_source_code.export_.md#splitlines)

## Constructors

### constructor

• **new export=**(`textOrConfig`, `astIfNoConfig?`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `textOrConfig` | `any` | The source code text or config object. |
| `astIfNoConfig?` | `ASTNode` | The Program node of the AST representing the code. This AST should be created from the text that BOM was stripped. |

#### Overrides

TokenStore.constructor

#### Defined in

[source-code/source-code.js:160](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/source-code/source-code.js#L160)

## Properties

### [COMMENTS]

• **[COMMENTS]**: `Comment`[]

#### Inherited from

[export=](source_code_token_store.export_.md).[[COMMENTS]](source_code_token_store.export_.md#[comments])

#### Defined in

[source-code/token-store/index.js:214](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/source-code/token-store/index.js#L214)

___

### [INDEX\_MAP]

• **[INDEX\_MAP]**: `any`

#### Inherited from

[export=](source_code_token_store.export_.md).[[INDEX_MAP]](source_code_token_store.export_.md#[index_map])

#### Defined in

[source-code/token-store/index.js:215](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/source-code/token-store/index.js#L215)

___

### [TOKENS]

• **[TOKENS]**: `Token`[]

#### Inherited from

[export=](source_code_token_store.export_.md).[[TOKENS]](source_code_token_store.export_.md#[tokens])

#### Defined in

[source-code/token-store/index.js:213](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/source-code/token-store/index.js#L213)

___

### \_commentCache

• **\_commentCache**: `WeakMap`<`object`, `any`\>

#### Defined in

[source-code/source-code.js:252](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/source-code/source-code.js#L252)

___

### ast

• **ast**: `ASTNode`

The parsed AST for the source code.

#### Defined in

[source-code/source-code.js:195](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/source-code/source-code.js#L195)

___

### hasBOM

• **hasBOM**: `boolean`

The flag to indicate that the source code has Unicode BOM.

#### Defined in

[source-code/source-code.js:182](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/source-code/source-code.js#L182)

___

### lineStartIndices

• **lineStartIndices**: `number`[]

#### Defined in

[source-code/source-code.js:231](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/source-code/source-code.js#L231)

___

### lines

• **lines**: `string`[]

The source code split into lines according to ECMA-262 specification.
This is done to avoid each rule needing to do so separately.

#### Defined in

[source-code/source-code.js:230](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/source-code/source-code.js#L230)

___

### parserServices

• **parserServices**: `any`

The parser services of this source code.

#### Defined in

[source-code/source-code.js:201](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/source-code/source-code.js#L201)

___

### scopeManager

• **scopeManager**: `any`

The scope of this source code.

#### Defined in

[source-code/source-code.js:207](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/source-code/source-code.js#L207)

___

### text

• **text**: `string`

The original text source code.
BOM was stripped from this text.

#### Defined in

[source-code/source-code.js:189](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/source-code/source-code.js#L189)

___

### tokensAndComments

• **tokensAndComments**: `Token`[]

#### Defined in

[source-code/source-code.js:223](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/source-code/source-code.js#L223)

___

### visitorKeys

• **visitorKeys**: `any`

The visitor keys to traverse AST.

#### Defined in

[source-code/source-code.js:213](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/source-code/source-code.js#L213)

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

#### Inherited from

[export=](source_code_token_store.export_.md).[commentsExistBetween](source_code_token_store.export_.md#commentsexistbetween)

#### Defined in

[source-code/token-store/index.js:569](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/source-code/token-store/index.js#L569)

___

### getAllComments

▸ **getAllComments**(): `ASTNode`[]

Retrieves an array containing all comments in the source code.

#### Returns

`ASTNode`[]

An array of comment nodes.

#### Defined in

[source-code/source-code.js:299](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/source-code/source-code.js#L299)

___

### getComments

▸ **getComments**(`node`): `any`

Gets all comments for the given node.

**`Deprecated`**

replaced by getCommentsBefore(), getCommentsAfter(), and getCommentsInside().

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `node` | `ASTNode` | The AST node to get the comments for. |

#### Returns

`any`

An object containing a leading and trailing array
     of comments indexed by their position.

#### Defined in

[source-code/source-code.js:311](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/source-code/source-code.js#L311)

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

#### Inherited from

[export=](source_code_token_store.export_.md).[getCommentsAfter](source_code_token_store.export_.md#getcommentsafter)

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

#### Inherited from

[export=](source_code_token_store.export_.md).[getCommentsBefore](source_code_token_store.export_.md#getcommentsbefore)

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

#### Inherited from

[export=](source_code_token_store.export_.md).[getCommentsInside](source_code_token_store.export_.md#getcommentsinside)

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

#### Inherited from

[export=](source_code_token_store.export_.md).[getFirstToken](source_code_token_store.export_.md#getfirsttoken)

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

#### Inherited from

[export=](source_code_token_store.export_.md).[getFirstTokenBetween](source_code_token_store.export_.md#getfirsttokenbetween)

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

#### Inherited from

[export=](source_code_token_store.export_.md).[getFirstTokens](source_code_token_store.export_.md#getfirsttokens)

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

#### Inherited from

[export=](source_code_token_store.export_.md).[getFirstTokensBetween](source_code_token_store.export_.md#getfirsttokensbetween)

#### Defined in

[source-code/token-store/index.js:471](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/source-code/token-store/index.js#L471)

___

### getIndexFromLoc

▸ **getIndexFromLoc**(`loc`): `number`

Converts a (line, column) pair into a range index.

**`Throws`**

If `loc` is not an object with a numeric
  `line` and `column`, if the `line` is less than or equal to zero or
  the line or column is out of the expected range.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `loc` | `Object` | A line/column location |
| `loc.column` | `number` | The column number of the location (0-indexed) |
| `loc.line` | `number` | The line number of the location (1-indexed) |

#### Returns

`number`

The range index of the location in the file.

#### Defined in

[source-code/source-code.js:557](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/source-code/source-code.js#L557)

___

### getJSDocComment

▸ **getJSDocComment**(`node`): `any`

Retrieves the JSDoc comment for a given node.

**`Deprecated`**

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `node` | `ASTNode` | The AST node to get the comment for. |

#### Returns

`any`

The Block comment token containing the JSDoc comment
     for the given node or null if not found.

#### Defined in

[source-code/source-code.js:386](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/source-code/source-code.js#L386)

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

#### Inherited from

[export=](source_code_token_store.export_.md).[getLastToken](source_code_token_store.export_.md#getlasttoken)

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

#### Inherited from

[export=](source_code_token_store.export_.md).[getLastTokenBetween](source_code_token_store.export_.md#getlasttokenbetween)

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

#### Inherited from

[export=](source_code_token_store.export_.md).[getLastTokens](source_code_token_store.export_.md#getlasttokens)

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

#### Inherited from

[export=](source_code_token_store.export_.md).[getLastTokensBetween](source_code_token_store.export_.md#getlasttokensbetween)

#### Defined in

[source-code/token-store/index.js:490](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/source-code/token-store/index.js#L490)

___

### getLines

▸ **getLines**(): `any`[]

Gets the entire source text split into an array of lines.

#### Returns

`any`[]

The source text as an array of lines.

#### Defined in

[source-code/source-code.js:290](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/source-code/source-code.js#L290)

___

### getLocFromIndex

▸ **getLocFromIndex**(`index`): `any`

Converts a source text index into a (line, column) pair.

**`Throws`**

If non-numeric index or index out of range.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `index` | `number` | The index of a character in a file |

#### Returns

`any`

A {line, column} location object with a 0-indexed column

#### Defined in

[source-code/source-code.js:515](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/source-code/source-code.js#L515)

___

### getNodeByRangeIndex

▸ **getNodeByRangeIndex**(`index`): `ASTNode`

Gets the deepest node containing a range index.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `index` | `int` | Range index of the desired node. |

#### Returns

`ASTNode`

The node if found or null if not found.

#### Defined in

[source-code/source-code.js:455](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/source-code/source-code.js#L455)

___

### getText

▸ **getText**(`node?`, `beforeCount?`, `afterCount?`): `string`

Gets the source code for the given node.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `node?` | `ASTNode` | The AST node to get the text for. |
| `beforeCount?` | `int` | The number of characters before the node to retrieve. |
| `afterCount?` | `int` | The number of characters after the node to retrieve. |

#### Returns

`string`

The text representing the AST node.

#### Defined in

[source-code/source-code.js:277](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/source-code/source-code.js#L277)

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

#### Inherited from

[export=](source_code_token_store.export_.md).[getTokenAfter](source_code_token_store.export_.md#gettokenafter)

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

#### Inherited from

[export=](source_code_token_store.export_.md).[getTokenBefore](source_code_token_store.export_.md#gettokenbefore)

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

#### Inherited from

[export=](source_code_token_store.export_.md).[getTokenByRangeStart](source_code_token_store.export_.md#gettokenbyrangestart)

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

#### Inherited from

[export=](source_code_token_store.export_.md).[getTokenOrCommentAfter](source_code_token_store.export_.md#gettokenorcommentafter)

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

#### Inherited from

[export=](source_code_token_store.export_.md).[getTokenOrCommentBefore](source_code_token_store.export_.md#gettokenorcommentbefore)

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

#### Inherited from

[export=](source_code_token_store.export_.md).[getTokens](source_code_token_store.export_.md#gettokens)

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

#### Inherited from

[export=](source_code_token_store.export_.md).[getTokensAfter](source_code_token_store.export_.md#gettokensafter)

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

#### Inherited from

[export=](source_code_token_store.export_.md).[getTokensBefore](source_code_token_store.export_.md#gettokensbefore)

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

#### Inherited from

[export=](source_code_token_store.export_.md).[getTokensBetween](source_code_token_store.export_.md#gettokensbetween)

#### Defined in

[source-code/token-store/index.js:547](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/source-code/token-store/index.js#L547)

___

### isSpaceBetween

▸ **isSpaceBetween**(`first`, `second`): `boolean`

Determines if two nodes or tokens have at least one whitespace character
between them. Order does not matter. Returns false if the given nodes or
tokens overlap.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `first` | `any` | The first node or token to check between. |
| `second` | `any` | The second node or token to check between. |

#### Returns

`boolean`

True if there is a whitespace character between
any of the tokens found between the two given nodes or tokens.

#### Defined in

[source-code/source-code.js:487](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/source-code/source-code.js#L487)

___

### isSpaceBetweenTokens

▸ **isSpaceBetweenTokens**(`first`, `second`): `boolean`

Determines if two nodes or tokens have at least one whitespace character
between them. Order does not matter. Returns false if the given nodes or
tokens overlap.
For backward compatibility, this method returns true if there are
`JSXText` tokens that contain whitespaces between the two.

**`Deprecated`**

in favor of isSpaceBetween().

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `first` | `any` | The first node or token to check between. |
| `second` | `any` | The second node or token to check between. |

#### Returns

`boolean`

True if there is a whitespace character between
any of the tokens found between the two given nodes or tokens.

#### Defined in

[source-code/source-code.js:504](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/source-code/source-code.js#L504)

___

### splitLines

▸ `Static` **splitLines**(`text`): `string`[]

Split the source code into multiple lines based on the line delimiters.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `text` | `string` | Source code as a string. |

#### Returns

`string`[]

Array of source code lines.

#### Defined in

[source-code/source-code.js:265](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/source-code/source-code.js#L265)
