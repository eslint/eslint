[ESLint Node.js API Reference](../index.md) / source-code/token-store/utils

# Module: source-code/token-store/utils

## Table of contents

### Functions

* [getFirstIndex](source_code_token_store_utils.md#getfirstindex)
* [getLastIndex](source_code_token_store_utils.md#getlastindex)
* [search](source_code_token_store_utils.md#search)

## Functions

### getFirstIndex

▸ **getFirstIndex**(`tokens`, `indexMap`, `startLoc`): `number`

Gets the index of the `startLoc` in `tokens`.
`startLoc` can be the value of `node.range[1]`, so this checks about `startLoc - 1` as well.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `tokens` | `any`[] | The tokens to find an index. |
| `indexMap` | `any` | The map from locations to indices. |
| `startLoc` | `number` | The location to get an index. |

#### Returns

`number`

The index.

#### Defined in

[source-code/token-store/utils.js:46](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/source-code/token-store/utils.js#L46)

___

### getLastIndex

▸ **getLastIndex**(`tokens`, `indexMap`, `endLoc`): `number`

Gets the index of the `endLoc` in `tokens`.
The information of end locations are recorded at `endLoc - 1` in `indexMap`, so this checks about `endLoc - 1` as well.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `tokens` | `any`[] | The tokens to find an index. |
| `indexMap` | `any` | The map from locations to indices. |
| `endLoc` | `number` | The location to get an index. |

#### Returns

`number`

The index.

#### Defined in

[source-code/token-store/utils.js:74](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/source-code/token-store/utils.js#L74)

___

### search

▸ **search**(`tokens`, `location`): `number`

Finds the index of the first token which is after the given location.
If it was not found, this returns `tokens.length`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `tokens` | `any`[] | It searches the token in this list. |
| `location` | `number` | The location to search. |

#### Returns

`number`

The found index or `tokens.length`.

#### Defined in

[source-code/token-store/utils.js:32](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/source-code/token-store/utils.js#L32)
