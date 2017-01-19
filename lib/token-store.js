/**
 * @fileoverview Object to handle access and retrieval of tokens.
 * @author Brandon Mills
 */
"use strict";

//------------------------------------------------------------------------------
// Implementation
//------------------------------------------------------------------------------

const PUBLIC_METHODS = Object.freeze([
    "getTokenByRangeStart",

    "getFirstToken",
    "getLastToken",
    "getTokenBefore",
    "getTokenAfter",
    "getFirstTokenBetween",
    "getLastTokenBetween",

    "getFirstTokens",
    "getLastTokens",
    "getTokensBefore",
    "getTokensAfter",
    "getFirstTokensBetween",
    "getLastTokensBetween",

    "getTokens",
    "getTokensBetween",

    "getTokenOrCommentBefore",
    "getTokenOrCommentAfter"
]);

/**
 * Binary-searches the index of the first token which is after the given location.
 * If it was not found, this returns `tokens.length`.
 *
 * @param {(Token|Comment)[]} tokens - It searches the token in this list.
 * @param {number} location - The location to search.
 * @returns {number} The found index or `tokens.length`.
 * @private
 */
function search(tokens, location) {
    let left = 0;
    let right = tokens.length - 1 | 0;

    while (left <= right) {
        const middle = (left + right) / 2 | 0;
        const value = tokens[middle].range[0] | 0;

        if (value < location) {
            left = middle + 1 | 0;
        } else if (value > location) {
            right = middle - 1 | 0;
        } else {
            return middle;
        }
    }

    return (left > right) ? left : right;
}

/**
 * Gets the index of the `startLoc` in `tokens`.
 * `startLoc` can be the value of `node.range[1]`, so this checks about `startLoc - 1` as well.
 *
 * @param {(Token|Comment)[]} tokens - The tokens to find an index.
 * @param {Object} indexMap - The map from locations to indices.
 * @param {number} startLoc - The location to get an index.
 * @returns {number} The index.
 * @private
 */
function getFirstIndex(tokens, indexMap, startLoc) {
    if (startLoc in indexMap) {
        return indexMap[startLoc];
    }
    if ((startLoc - 1) in indexMap) {
        return indexMap[startLoc - 1] + 1;
    }
    return 0;
}

/**
 * Gets the index of the `endLoc` in `tokens`.
 * The information of end locations are recorded at `endLoc - 1` in `indexMap`, so this checks about `endLoc - 1` as well.
 *
 * @param {(Token|Comment)[]} tokens - The tokens to find an index.
 * @param {Object} indexMap - The map from locations to indices.
 * @param {number} endLoc - The location to get an index.
 * @returns {number} The index.
 * @private
 */
function getLastIndex(tokens, indexMap, endLoc) {
    if (endLoc in indexMap) {
        return indexMap[endLoc] - 1;
    }
    if ((endLoc - 1) in indexMap) {
        return indexMap[endLoc - 1];
    }
    return tokens.length - 1;
}

/**
 * The abstract class about cursors which iterate tokens.
 *
 * This class has 3 abstract methods.
 *
 * - `current: Token | Comment` ... The current token.
 * - `moveNext(): boolean` ... Moves this cursor to the next token. If the next token didn't exist, it returns `false`.
 * - `movePrev(): boolean` ... Moves this cursor to the previous token. If the previous token didn't exist, it returns `false`.
 *
 * There are the following known sub classes.
 *
 * - ForwardTokenCursor .......... The cursor which iterates tokens only.
 * - BackwardTokenCursor ......... The cursor which iterates tokens only in reverse.
 * - ForwardTokenCommentCursor ... The cursor which iterates tokens and comments.
 * - BackwardTokenCommentCursor .. The cursor which iterates tokens and comments in reverse.
 * - DecorativeCursor
 *     - FilterCursor ............ The cursor which ignores the specified tokens.
 *     - SkipCursor .............. The cursor which ignores the first few tokens.
 *     - LimitCursor ............. The cursor which limits the count of tokens.
 *
 * @private
 */
class Cursor {

    /**
     * Initializes this cursor.
     */
    constructor() {
        this.current = null;
    }

    /**
     * Gets the first token.
     * This consumes this cursor.
     * @returns {Token|Comment} The first token or null.
     */
    getOneToken() {
        return this.moveNext() ? this.current : null;
    }

    /**
     * Gets the first tokens.
     * This consumes this cursor.
     * @returns {(Token|Comment)[]} All tokens.
     */
    getAllTokens() {
        const tokens = [];

        while (this.moveNext()) {
            tokens.push(this.current);
        }

        return tokens;
    }

    /**
     * Moves this cursor to the next token.
     * @returns {boolean} `true` if the next token exists.
     * @abstract
     */
    /* istanbul ignore next */
    moveNext() { // eslint-disable-line class-methods-use-this
        throw new Error("Not implemented.");
    }
}

/**
 * The cursor which iterates tokens only.
 * @private
 */
class ForwardTokenCursor extends Cursor {

    /**
     * Initializes this cursor.
     * @param {Token[]} tokens - The array of tokens.
     * @param {Comment[]} comments - The array of comments.
     * @param {Object} indexMap - The map from locations to indices in `tokens`.
     * @param {number} startLoc - The start location of the iteration range.
     * @param {number} endLoc - The end location of the iteration range.
     */
    constructor(tokens, comments, indexMap, startLoc, endLoc) {
        super();
        this.tokens = tokens;
        this.index = getFirstIndex(tokens, indexMap, startLoc);
        this.indexEnd = getLastIndex(tokens, indexMap, endLoc);
    }

    /** @inheritdoc */
    moveNext() {
        if (this.index <= this.indexEnd) {
            this.current = this.tokens[this.index];
            this.index += 1;
            return true;
        }
        return false;
    }

    //
    // Shorthand for performance.
    //

    /** @inheritdoc */
    getOneToken() {
        return (this.index <= this.indexEnd) ? this.tokens[this.index] : null;
    }

    /** @inheritdoc */
    getAllTokens() {
        return this.tokens.slice(this.index, this.indexEnd + 1);
    }
}

/**
 * The cursor which iterates tokens only.
 * @private
 */
class BackwardTokenCursor extends Cursor {

    /**
     * Initializes this cursor.
     * @param {Token[]} tokens - The array of tokens.
     * @param {Comment[]} comments - The array of comments.
     * @param {Object} indexMap - The map from locations to indices in `tokens`.
     * @param {number} startLoc - The start location of the iteration range.
     * @param {number} endLoc - The end location of the iteration range.
     */
    constructor(tokens, comments, indexMap, startLoc, endLoc) {
        super();
        this.tokens = tokens;
        this.index = getLastIndex(tokens, indexMap, endLoc);
        this.indexEnd = getFirstIndex(tokens, indexMap, startLoc);
    }

    /** @inheritdoc */
    moveNext() {
        if (this.index >= this.indexEnd) {
            this.current = this.tokens[this.index];
            this.index -= 1;
            return true;
        }
        return false;
    }

    //
    // Shorthand for performance.
    //

    /** @inheritdoc */
    getOneToken() {
        return (this.index >= this.indexEnd) ? this.tokens[this.index] : null;
    }
}

/**
 * The cursor which iterates tokens and comments.
 * @private
 */
class ForwardTokenCommentCursor extends Cursor {

    /**
     * Initializes this cursor.
     * @param {Token[]} tokens - The array of tokens.
     * @param {Comment[]} comments - The array of comments.
     * @param {Object} indexMap - The map from locations to indices in `tokens`.
     * @param {number} startLoc - The start location of the iteration range.
     * @param {number} endLoc - The end location of the iteration range.
     */
    constructor(tokens, comments, indexMap, startLoc, endLoc) {
        super();
        this.tokens = tokens;
        this.comments = comments;
        this.tokenIndex = getFirstIndex(tokens, indexMap, startLoc);
        this.commentIndex = search(comments, startLoc);
        this.border = endLoc;
    }

    /** @inheritdoc */
    moveNext() {
        const token = (this.tokenIndex < this.tokens.length) ? this.tokens[this.tokenIndex] : null;
        const comment = (this.commentIndex < this.comments.length) ? this.comments[this.commentIndex] : null;

        if (token && (!comment || token.range[0] < comment.range[0])) {
            this.current = token;
            this.tokenIndex += 1;
        } else if (comment) {
            this.current = comment;
            this.commentIndex += 1;
        } else {
            this.current = null;
        }

        return Boolean(this.current) && (this.border === -1 || this.current.range[1] <= this.border);
    }
}

/**
 * The cursor which iterates tokens and comments.
 * @private
 */
class BackwardTokenCommentCursor extends Cursor {

    /**
     * Initializes this cursor.
     * @param {Token[]} tokens - The array of tokens.
     * @param {Comment[]} comments - The array of comments.
     * @param {Object} indexMap - The map from locations to indices in `tokens`.
     * @param {number} startLoc - The start location of the iteration range.
     * @param {number} endLoc - The end location of the iteration range.
     */
    constructor(tokens, comments, indexMap, startLoc, endLoc) {
        super();
        this.tokens = tokens;
        this.comments = comments;
        this.tokenIndex = getLastIndex(tokens, indexMap, endLoc);
        this.commentIndex = search(comments, endLoc) - 1;
        this.border = startLoc;
    }

    /** @inheritdoc */
    moveNext() {
        const token = (this.tokenIndex >= 0) ? this.tokens[this.tokenIndex] : null;
        const comment = (this.commentIndex >= 0) ? this.comments[this.commentIndex] : null;

        if (token && (!comment || token.range[1] > comment.range[1])) {
            this.current = token;
            this.tokenIndex -= 1;
        } else if (comment) {
            this.current = comment;
            this.commentIndex -= 1;
        } else {
            this.current = null;
        }

        return Boolean(this.current) && (this.border === -1 || this.current.range[0] >= this.border);
    }
}

/**
 * The cursor which iterates tokens only.
 * This is for the backward compatibility of padding options.
 * @private
 */
class PaddedTokenCursor extends ForwardTokenCursor {

    /**
     * Initializes this cursor.
     * @param {Token[]} tokens - The array of tokens.
     * @param {Comment[]} comments - The array of comments.
     * @param {Object} indexMap - The map from locations to indices in `tokens`.
     * @param {number} startLoc - The start location of the iteration range.
     * @param {number} endLoc - The end location of the iteration range.
     * @param {number} beforeCount - The number of tokens this cursor iterates before start.
     * @param {number} afterCount - The number of tokens this cursor iterates after end.
     */
    constructor(tokens, comments, indexMap, startLoc, endLoc, beforeCount, afterCount) {
        super(tokens, comments, indexMap, startLoc, endLoc);
        this.index = Math.max(0, this.index - beforeCount);
        this.indexEnd = Math.min(tokens.length - 1, this.indexEnd + afterCount);
    }
}

/**
 * The abstract class about cursors which manipulate another cursor.
 * @private
 */
class DecorativeCursor extends Cursor {

    /**
     * Initializes this cursor.
     * @param {Cursor} cursor - The cursor to be decorated.
     */
    constructor(cursor) {
        super();
        this.cursor = cursor;
    }

    /** @inheritdoc */
    moveNext() {
        const retv = this.cursor.moveNext();

        this.current = this.cursor.current;

        return retv;
    }
}

/**
 * The decorative cursor which ignores specified tokens.
 * @private
 */
class FilterCursor extends DecorativeCursor {

    /**
     * Initializes this cursor.
     * @param {Cursor} cursor - The cursor to be decorated.
     * @param {Function} predicate - The predicate function to decide tokens this cursor iterates.
     */
    constructor(cursor, predicate) {
        super(cursor);
        this.predicate = predicate;
    }

    /** @inheritdoc */
    moveNext() {
        const predicate = this.predicate;

        while (super.moveNext()) {
            if (predicate(this.current)) {
                return true;
            }
        }
        return false;
    }
}

/**
 * The decorative cursor which ignores the first few tokens.
 * @private
 */
class SkipCursor extends DecorativeCursor {

    /**
     * Initializes this cursor.
     * @param {Cursor} cursor - The cursor to be decorated.
     * @param {number} count - The count of tokens this cursor skips.
     */
    constructor(cursor, count) {
        super(cursor);
        this.count = count;
    }

    /** @inheritdoc */
    moveNext() {
        while (this.count > 0) {
            this.count -= 1;
            if (!super.moveNext()) {
                return false;
            }
        }
        return super.moveNext();
    }
}

/**
 * The decorative cursor which limits the number of tokens.
 * @private
 */
class LimitCursor extends DecorativeCursor {

    /**
     * Initializes this cursor.
     * @param {Cursor} cursor - The cursor to be decorated.
     * @param {number} count - The count of tokens this cursor iterates.
     */
    constructor(cursor, count) {
        super(cursor);
        this.count = count;
    }

    /** @inheritdoc */
    moveNext() {
        if (this.count > 0) {
            this.count -= 1;
            return super.moveNext();
        }
        return false;
    }
}

/**
 * The cursor pair of tokens-only and tokens/comments.
 * @private
 */
class CursorPair {

    /**
     * Initializes this cursor.
     * @param {Function} TokenCursor - The class of the cursor which iterates tokens only.
     * @param {Function} TokenCommentCursor - The class of the cursor which iterates the mix of tokens and comments.
     */
    constructor(TokenCursor, TokenCommentCursor) {
        this.TokenCursor = TokenCursor;
        this.TokenCommentCursor = TokenCommentCursor;
    }

    /**
     * Creates the cursor iterates tokens with normalized options.
     *
     * @param {Token[]} tokens - The array of tokens.
     * @param {Comment[]} comments - The array of comments.
     * @param {Object} indexMap - The map from locations to indices in `tokens`.
     * @param {number} startLoc - The start location of the iteration range.
     * @param {number} endLoc - The end location of the iteration range.
     * @param {boolean} includeComments - The flag to iterate comments as well.
     * @returns {Cursor} The created cursor.
     * @private
     */
    createCursor(tokens, comments, indexMap, startLoc, endLoc, includeComments) {
        return new (includeComments ? this.TokenCommentCursor : this.TokenCursor)(tokens, comments, indexMap, startLoc, endLoc);
    }
}

const forwardCursors = Object.freeze(new CursorPair(ForwardTokenCursor, ForwardTokenCommentCursor));
const backwardCursors = Object.freeze(new CursorPair(BackwardTokenCursor, BackwardTokenCommentCursor));

/**
 * Creates the map from locations to indices in `tokens`.
 *
 * The first/last location of tokens is mapped to the index of the token.
 * The first/last location of comments is mapped to the index of the previous token of each comment.
 *
 * @param {Token[]} tokens - The array of tokens.
 * @param {Comment[]} comments - The array of comments.
 * @returns {Object} The map from locations to indices in `tokens`.
 * @private
 */
function createIndexMap(tokens, comments) {
    const map = Object.create(null);
    let it = 0;
    let ic = 0;
    let nextStart = 0;
    let range = null;

    while (it < tokens.length || ic < comments.length) {
        nextStart = (ic < comments.length) ? comments[ic].range[0] : Number.MAX_SAFE_INTEGER;
        while (it < tokens.length && (range = tokens[it].range)[0] < nextStart) {
            map[range[0]] = it;
            map[range[1] - 1] = it;
            it += 1;
        }

        nextStart = (it < tokens.length) ? tokens[it].range[0] : Number.MAX_SAFE_INTEGER;
        while (ic < comments.length && (range = comments[ic].range)[0] < nextStart) {
            map[range[0]] = it;
            map[range[1] - 1] = it;
            ic += 1;
        }
    }

    return map;
}

/**
 * Creates the cursor iterates tokens with normalized options.
 *
 * @param {CursorPair} cursors - The cursor pair to initialize base cursor.
 * @param {Token[]} tokens - The array of tokens.
 * @param {Comment[]} comments - The array of comments.
 * @param {Object} indexMap - The map from locations to indices in `tokens`.
 * @param {number} startLoc - The start location of the iteration range.
 * @param {number} endLoc - The end location of the iteration range.
 * @param {boolean} includeComments - The flag to iterate comments as well.
 * @param {Function|null} filter - The predicate function to choose tokens.
 * @param {number} skip - The count of tokens the cursor skips.
 * @param {number} count - The maximum count of tokens the cursor iterates. Zero is no iteration for backward compatibility.
 * @returns {Cursor} The created cursor.
 * @private
 */
function createCursor(cursors, tokens, comments, indexMap, startLoc, endLoc, includeComments, filter, skip, count) {
    let cursor = cursors.createCursor(tokens, comments, indexMap, startLoc, endLoc, includeComments);

    if (filter) {
        cursor = new FilterCursor(cursor, filter);
    }
    if (skip >= 1) {
        cursor = new SkipCursor(cursor, skip);
    }
    if (count >= 0) {
        cursor = new LimitCursor(cursor, count);
    }

    return cursor;
}

/**
 * Creates the cursor iterates tokens with options.
 *
 * @param {CursorPair} cursors - The cursor pair to initialize base cursor.
 * @param {Token[]} tokens - The array of tokens.
 * @param {Comment[]} comments - The array of comments.
 * @param {Object} indexMap - The map from locations to indices in `tokens`.
 * @param {number} startLoc - The start location of the iteration range.
 * @param {number} endLoc - The end location of the iteration range.
 * @param {number|Function|Object} [opts=0] - The option object. If this is a number then it's `opts.skip`. If this is a function then it's `opts.filter`.
 * @param {boolean} [opts.includeComments=false] - The flag to iterate comments as well.
 * @param {Function|null} [opts.filter=null] - The predicate function to choose tokens.
 * @param {number} [opts.skip=0] - The count of tokens the cursor skips.
 * @returns {Cursor} The created cursor.
 * @private
 */
function createCursorWithSkip(cursors, tokens, comments, indexMap, startLoc, endLoc, opts) {
    let includeComments = false;
    let skip = 0;
    let filter = null;

    if (typeof opts === "number") {
        skip = opts | 0;
    } else if (typeof opts === "function") {
        filter = opts;
    } else if (opts) {
        includeComments = !!opts.includeComments;
        skip = opts.skip | 0;
        filter = opts.filter || null;
    }

    return createCursor(cursors, tokens, comments, indexMap, startLoc, endLoc, includeComments, filter, skip, -1);
}

/**
 * Creates the cursor iterates tokens with options.
 *
 * @param {CursorPair} cursors - The cursor pair to initialize base cursor.
 * @param {Token[]} tokens - The array of tokens.
 * @param {Comment[]} comments - The array of comments.
 * @param {Object} indexMap - The map from locations to indices in `tokens`.
 * @param {number} startLoc - The start location of the iteration range.
 * @param {number} endLoc - The end location of the iteration range.
 * @param {number|Function|Object} [opts=0] - The option object. If this is a number then it's `opts.count`. If this is a function then it's `opts.filter`.
 * @param {boolean} [opts.includeComments] - The flag to iterate comments as well.
 * @param {Function|null} [opts.filter=null] - The predicate function to choose tokens.
 * @param {number} [opts.count=0] - The maximum count of tokens the cursor iterates. Zero is no iteration for backward compatibility.
 * @returns {Cursor} The created cursor.
 * @private
 */
function createCursorWithCount(cursors, tokens, comments, indexMap, startLoc, endLoc, opts) {
    let includeComments = false;
    let count = 0;
    let filter = null;

    if (typeof opts === "number") {
        count = opts | 0;
    } else if (typeof opts === "function") {
        count = -1;
        filter = opts;
    } else if (opts) {
        includeComments = !!opts.includeComments;
        count = (opts.count | 0) || -1;
        filter = opts.filter || null;
    }

    return createCursor(cursors, tokens, comments, indexMap, startLoc, endLoc, includeComments, filter, 0, count);
}

/**
 * Creates the cursor iterates tokens with options.
 *
 * @param {Token[]} tokens - The array of tokens.
 * @param {Comment[]} comments - The array of comments.
 * @param {Object} indexMap - The map from locations to indices in `tokens`.
 * @param {number} startLoc - The start location of the iteration range.
 * @param {number} endLoc - The end location of the iteration range.
 * @param {Function|Object} opts - The option object. If this is a function then it's `opts.filter`.
 * @param {boolean} [opts.includeComments] - The flag to iterate comments as well.
 * @param {Function|null} [opts.filter=null] - The predicate function to choose tokens.
 * @param {number} [opts.count=0] - The maximum count of tokens the cursor iterates. Zero is no iteration for backward compatibility.
 * @returns {Cursor} The created cursor.
 * @private
 */
/**
 * Creates the cursor iterates tokens with options.
 *
 * @param {Token[]} tokens - The array of tokens.
 * @param {Comment[]} comments - The array of comments.
 * @param {Object} indexMap - The map from locations to indices in `tokens`.
 * @param {number} startLoc - The start location of the iteration range.
 * @param {number} endLoc - The end location of the iteration range.
 * @param {number} [beforeCount=0] - The number of tokens before the node to retrieve.
 * @param {boolean} [afterCount=0] - The number of tokens after the node to retrieve.
 * @returns {Cursor} The created cursor.
 * @private
 */
function createCursorWithPadding(tokens, comments, indexMap, startLoc, endLoc, beforeCount, afterCount) {
    if (typeof beforeCount === "undefined" && typeof afterCount === "undefined") {
        return new ForwardTokenCursor(tokens, comments, indexMap, startLoc, endLoc);
    }
    if (typeof beforeCount === "number" || typeof beforeCount === "undefined") {
        return new PaddedTokenCursor(tokens, comments, indexMap, startLoc, endLoc, beforeCount | 0, afterCount | 0);
    }
    return createCursorWithCount(forwardCursors, tokens, comments, indexMap, startLoc, endLoc, beforeCount);
}

class TokenStore {

    /**
     * Initializes this token store.
     *
     * ※ `comments` needs cloning for backward compatibility.
     * After this initialization, ESLint removes a shebang's comment from `comments`.
     * However, so far we had been concatenating 'tokens' and 'comments',
     * so the shebang's comment had remained in the concatenated array.
     * As the result, both `getTokenOrCommentAfter` and `getTokenOrCommentBefore`
     * methods had been returning the shebang's comment.
     * And some rules depends on this behavior.
     *
     * @param {Token[]} tokens - The array of tokens.
     * @param {Comment[]} comments - The array of comments.
     */
    constructor(tokens, comments) {
        this.tokens = tokens;
        this.comments = comments.slice(0); // Needs cloning for backward compatibility!
        this.indexMap = createIndexMap(tokens, comments);
    }

    //--------------------------------------------------------------------------
    // Gets single token.
    //--------------------------------------------------------------------------

    /**
     * Gets the token starting at the specified index.
     * @param {number} offset - Index of the start of the token's range.
     * @returns {Token|null} The token starting at index, or null if no such token.
     */
    getTokenByRangeStart(offset) {
        const token = this.tokens[this.indexMap[offset]] || null;

        if (token && token.range[0] === offset) {
            return token;
        }
        return null;
    }

    /**
     * Gets the first token of the given node.
     * @param {ASTNode} node - The AST node.
     * @param {number|Function|Object} [options=0] - The option object. If this is a number then it's `options.skip`. If this is a function then it's `options.filter`.
     * @param {boolean} [options.includeComments=false] - The flag to iterate comments as well.
     * @param {Function|null} [options.filter=null] - The predicate function to choose tokens.
     * @param {number} [options.skip=0] - The count of tokens the cursor skips.
     * @returns {Token|null} An object representing the token.
     */
    getFirstToken(node, options) {
        return createCursorWithSkip(
            forwardCursors,
            this.tokens,
            this.comments,
            this.indexMap,
            node.range[0],
            node.range[1],
            options
        ).getOneToken();
    }

    /**
     * Gets the last token of the given node.
     * @param {ASTNode} node - The AST node.
     * @param {number|Function|Object} [options=0] - The option object. If this is a number then it's `options.skip`. If this is a function then it's `options.filter`.
     * @param {boolean} [options.includeComments=false] - The flag to iterate comments as well.
     * @param {Function|null} [options.filter=null] - The predicate function to choose tokens.
     * @param {number} [options.skip=0] - The count of tokens the cursor skips.
     * @returns {Token|null} An object representing the token.
     */
    getLastToken(node, options) {
        return createCursorWithSkip(
            backwardCursors,
            this.tokens,
            this.comments,
            this.indexMap,
            node.range[0],
            node.range[1],
            options
        ).getOneToken();
    }

    /**
     * Gets the token that precedes a given node or token.
     * @param {ASTNode|Token|Comment} node - The AST node or token.
     * @param {number|Function|Object} [options=0] - The option object. If this is a number then it's `options.skip`. If this is a function then it's `options.filter`.
     * @param {boolean} [options.includeComments=false] - The flag to iterate comments as well.
     * @param {Function|null} [options.filter=null] - The predicate function to choose tokens.
     * @param {number} [options.skip=0] - The count of tokens the cursor skips.
     * @returns {Token|null} An object representing the token.
     */
    getTokenBefore(node, options) {
        return createCursorWithSkip(
            backwardCursors,
            this.tokens,
            this.comments,
            this.indexMap,
            -1,
            node.range[0],
            options
        ).getOneToken();
    }

    /**
     * Gets the token that follows a given node or token.
     * @param {ASTNode|Token|Comment} node - The AST node or token.
     * @param {number|Function|Object} [options=0] - The option object. If this is a number then it's `options.skip`. If this is a function then it's `options.filter`.
     * @param {boolean} [options.includeComments=false] - The flag to iterate comments as well.
     * @param {Function|null} [options.filter=null] - The predicate function to choose tokens.
     * @param {number} [options.skip=0] - The count of tokens the cursor skips.
     * @returns {Token|null} An object representing the token.
     */
    getTokenAfter(node, options) {
        return createCursorWithSkip(
            forwardCursors,
            this.tokens,
            this.comments,
            this.indexMap,
            node.range[1],
            -1,
            options
        ).getOneToken();
    }

    /**
     * Gets the first token between two non-overlapping nodes.
     * @param {ASTNode|Token|Comment} left - Node before the desired token range.
     * @param {ASTNode|Token|Comment} right - Node after the desired token range.
     * @param {number|Function|Object} [options=0] - The option object. If this is a number then it's `options.skip`. If this is a function then it's `options.filter`.
     * @param {boolean} [options.includeComments=false] - The flag to iterate comments as well.
     * @param {Function|null} [options.filter=null] - The predicate function to choose tokens.
     * @param {number} [options.skip=0] - The count of tokens the cursor skips.
     * @returns {Token|null} An object representing the token.
     */
    getFirstTokenBetween(left, right, options) {
        return createCursorWithSkip(
            forwardCursors,
            this.tokens,
            this.comments,
            this.indexMap,
            left.range[1],
            right.range[0],
            options
        ).getOneToken();
    }

    /**
     * Gets the last token between two non-overlapping nodes.
     * @param {ASTNode|Token|Comment} left Node before the desired token range.
     * @param {ASTNode|Token|Comment} right Node after the desired token range.
     * @param {number|Function|Object} [options=0] The option object. If this is a number then it's `options.skip`. If this is a function then it's `options.filter`.
     * @param {boolean} [options.includeComments=false] - The flag to iterate comments as well.
     * @param {Function|null} [options.filter=null] - The predicate function to choose tokens.
     * @param {number} [options.skip=0] - The count of tokens the cursor skips.
     * @returns {Token|null} Tokens between left and right.
     */
    getLastTokenBetween(left, right, options) {
        return createCursorWithSkip(
            backwardCursors,
            this.tokens,
            this.comments,
            this.indexMap,
            left.range[1],
            right.range[0],
            options
        ).getOneToken();
    }

    /**
     * Gets the token that precedes a given node or token in the token stream.
     * @param {ASTNode|Token|Comment} node The AST node or token.
     * @param {number} [skip=0] A number of tokens to skip.
     * @returns {Token|null} An object representing the token.
     * @deprecated
     */
    getTokenOrCommentBefore(node, skip) {
        return this.getTokenBefore(node, { includeComments: true, skip });
    }

    /**
     * Gets the token that follows a given node or token in the token stream.
     * @param {ASTNode|Token|Comment} node The AST node or token.
     * @param {number} [skip=0] A number of tokens to skip.
     * @returns {Token|null} An object representing the token.
     * @deprecated
     */
    getTokenOrCommentAfter(node, skip) {
        return this.getTokenAfter(node, { includeComments: true, skip });
    }

    //--------------------------------------------------------------------------
    // Gets multiple tokens.
    //--------------------------------------------------------------------------

    /**
     * Gets the first `count` tokens of the given node.
     * @param {ASTNode} node - The AST node.
     * @param {number|Function|Object} [options=0] - The option object. If this is a number then it's `options.count`. If this is a function then it's `options.filter`.
     * @param {boolean} [options.includeComments=false] - The flag to iterate comments as well.
     * @param {Function|null} [options.filter=null] - The predicate function to choose tokens.
     * @param {number} [options.count=0] - The maximum count of tokens the cursor iterates.
     * @returns {Token[]} Tokens.
     */
    getFirstTokens(node, options) {
        return createCursorWithCount(
            forwardCursors,
            this.tokens,
            this.comments,
            this.indexMap,
            node.range[0],
            node.range[1],
            options
        ).getAllTokens();
    }

    /**
     * Gets the last `count` tokens of the given node.
     * @param {ASTNode} node - The AST node.
     * @param {number|Function|Object} [options=0] - The option object. If this is a number then it's `options.count`. If this is a function then it's `options.filter`.
     * @param {boolean} [options.includeComments=false] - The flag to iterate comments as well.
     * @param {Function|null} [options.filter=null] - The predicate function to choose tokens.
     * @param {number} [options.count=0] - The maximum count of tokens the cursor iterates.
     * @returns {Token[]} Tokens.
     */
    getLastTokens(node, options) {
        return createCursorWithCount(
            backwardCursors,
            this.tokens,
            this.comments,
            this.indexMap,
            node.range[0],
            node.range[1],
            options
        ).getAllTokens().reverse();
    }

    /**
     * Gets the `count` tokens that precedes a given node or token.
     * @param {ASTNode|Token|Comment} node - The AST node or token.
     * @param {number|Function|Object} [options=0] - The option object. If this is a number then it's `options.count`. If this is a function then it's `options.filter`.
     * @param {boolean} [options.includeComments=false] - The flag to iterate comments as well.
     * @param {Function|null} [options.filter=null] - The predicate function to choose tokens.
     * @param {number} [options.count=0] - The maximum count of tokens the cursor iterates.
     * @returns {Token[]} Tokens.
     */
    getTokensBefore(node, options) {
        return createCursorWithCount(
            backwardCursors,
            this.tokens,
            this.comments,
            this.indexMap,
            -1,
            node.range[0],
            options
        ).getAllTokens().reverse();
    }

    /**
     * Gets the `count` tokens that follows a given node or token.
     * @param {ASTNode|Token|Comment} node - The AST node or token.
     * @param {number|Function|Object} [options=0] - The option object. If this is a number then it's `options.count`. If this is a function then it's `options.filter`.
     * @param {boolean} [options.includeComments=false] - The flag to iterate comments as well.
     * @param {Function|null} [options.filter=null] - The predicate function to choose tokens.
     * @param {number} [options.count=0] - The maximum count of tokens the cursor iterates.
     * @returns {Token[]} Tokens.
     */
    getTokensAfter(node, options) {
        return createCursorWithCount(
            forwardCursors,
            this.tokens,
            this.comments,
            this.indexMap,
            node.range[1],
            -1,
            options
        ).getAllTokens();
    }

    /**
     * Gets the first `count` tokens between two non-overlapping nodes.
     * @param {ASTNode|Token|Comment} left - Node before the desired token range.
     * @param {ASTNode|Token|Comment} right - Node after the desired token range.
     * @param {number|Function|Object} [options=0] - The option object. If this is a number then it's `options.count`. If this is a function then it's `options.filter`.
     * @param {boolean} [options.includeComments=false] - The flag to iterate comments as well.
     * @param {Function|null} [options.filter=null] - The predicate function to choose tokens.
     * @param {number} [options.count=0] - The maximum count of tokens the cursor iterates.
     * @returns {Token[]} Tokens between left and right.
     */
    getFirstTokensBetween(left, right, options) {
        return createCursorWithCount(
            forwardCursors,
            this.tokens,
            this.comments,
            this.indexMap,
            left.range[1],
            right.range[0],
            options
        ).getAllTokens();
    }

    /**
     * Gets the last `count` tokens between two non-overlapping nodes.
     * @param {ASTNode|Token|Comment} left Node before the desired token range.
     * @param {ASTNode|Token|Comment} right Node after the desired token range.
     * @param {number|Function|Object} [options=0] The option object. If this is a number then it's `options.count`. If this is a function then it's `options.filter`.
     * @param {boolean} [options.includeComments=false] - The flag to iterate comments as well.
     * @param {Function|null} [options.filter=null] - The predicate function to choose tokens.
     * @param {number} [options.count=0] - The maximum count of tokens the cursor iterates.
     * @returns {Token[]} Tokens between left and right.
     */
    getLastTokensBetween(left, right, options) {
        return createCursorWithCount(
            backwardCursors,
            this.tokens,
            this.comments,
            this.indexMap,
            left.range[1],
            right.range[0],
            options
        ).getAllTokens().reverse();
    }

    /**
     * Gets all tokens that are related to the given node.
     * @param {ASTNode} node - The AST node.
     * @param {Function|Object} options The option object. If this is a function then it's `options.filter`.
     * @param {boolean} [options.includeComments=false] - The flag to iterate comments as well.
     * @param {Function|null} [options.filter=null] - The predicate function to choose tokens.
     * @param {number} [options.count=0] - The maximum count of tokens the cursor iterates.
     * @returns {Token[]} Array of objects representing tokens.
     */
    /**
     * Gets all tokens that are related to the given node.
     * @param {ASTNode} node - The AST node.
     * @param {int} [beforeCount=0] - The number of tokens before the node to retrieve.
     * @param {int} [afterCount=0] - The number of tokens after the node to retrieve.
     * @returns {Token[]} Array of objects representing tokens.
     */
    getTokens(node, beforeCount, afterCount) {
        return createCursorWithPadding(
            this.tokens,
            this.comments,
            this.indexMap,
            node.range[0],
            node.range[1],
            beforeCount,
            afterCount
        ).getAllTokens();
    }

    /**
     * Gets all of the tokens between two non-overlapping nodes.
     * @param {ASTNode|Token|Comment} left Node before the desired token range.
     * @param {ASTNode|Token|Comment} right Node after the desired token range.
     * @param {Function|Object} options The option object. If this is a function then it's `options.filter`.
     * @param {boolean} [options.includeComments=false] - The flag to iterate comments as well.
     * @param {Function|null} [options.filter=null] - The predicate function to choose tokens.
     * @param {number} [options.count=0] - The maximum count of tokens the cursor iterates.
     * @returns {Token[]} Tokens between left and right.
     */
    /**
     * Gets all of the tokens between two non-overlapping nodes.
     * @param {ASTNode|Token|Comment} left Node before the desired token range.
     * @param {ASTNode|Token|Comment} right Node after the desired token range.
     * @param {int} [padding=0] Number of extra tokens on either side of center.
     * @returns {Token[]} Tokens between left and right.
     */
    getTokensBetween(left, right, padding) {
        return createCursorWithPadding(
            this.tokens,
            this.comments,
            this.indexMap,
            left.range[1],
            right.range[0],
            padding,
            padding
        ).getAllTokens();
    }
}

//------------------------------------------------------------------------------
// Exports
//------------------------------------------------------------------------------

module.exports = TokenStore;
module.exports.PUBLIC_METHODS = PUBLIC_METHODS;
