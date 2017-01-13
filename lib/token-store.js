/**
 * @fileoverview Object to handle access and retrieval of tokens.
 * @author Brandon Mills
 */
"use strict";

//------------------------------------------------------------------------------
// Implementation
//------------------------------------------------------------------------------

const W_INIT = -3;
const W_TOKENS = 1;
const W_COMMENTS = 2;
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
 * - BaseCursor
 *     - TokenCursor ......... The cursor which iterates tokens only.
 *     - TokenCommentCursor .. The cursor which iterates tokens and comments.
 * - DecorativeCursor
 *     - FilterCursor ........ The cursor which ignores the specified tokens.
 *     - SkipCursor .......... The cursor which ignores the first few tokens.
 *     - LimitCursor ......... The cursor which limits the count of tokens.
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
     * @type {Token|Comment}
     */
    get firstToken() {
        return this.moveNext() ? this.current : null;
    }

    /**
     * Gets the last token.
     * This consumes this cursor.
     * @type {Token|Comment}
     */
    get lastToken() {
        return this.movePrev() ? this.current : null;
    }

    /**
     * Gets the first tokens.
     * This consumes this cursor.
     * @type {Token|Comment}
     */
    get firstTokens() {
        const tokens = [];

        while (this.moveNext()) {
            tokens.push(this.current);
        }

        return tokens;
    }

    /**
     * Gets the last tokens.
     * This consumes this cursor.
     * @type {Token|Comment}
     */
    get lastTokens() {
        const tokens = [];

        while (this.movePrev()) {
            tokens.push(this.current);
        }
        tokens.reverse();

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

    /**
     * Moves this cursor to the previous token.
     * @returns {boolean} `true` if the previous token exists.
     * @abstract
     */
    /* istanbul ignore next */
    movePrev() { // eslint-disable-line class-methods-use-this
        throw new Error("Not implemented.");
    }
}

/**
 * The abstract class about cursors which iterate tokens.
 * This is the specific class to directly iterate tokens from tokens' array.
 *
 * @private
 */
class BaseCursor extends Cursor {

    /**
     * Initializes this cursor.
     * @param {Token[]} tokens - The array of tokens.
     * @param {Comment[]} comments - The array of comments.
     * @param {Object} imap - The map from locations to indices in `this.tokens`.
     * @param {number} start - The start location of the iteration range.
     * @param {number} end - The end location of the iteration range.
     */
    constructor(tokens, comments, imap, start, end) {
        super();
        this.tokens = tokens;
        this.comments = comments;
        this.imap = imap;
        this.start = start | 0;
        this.end = end | 0;
    }

    /**
     * Gets the index of the location `this.start` in `this.tokens`.
     * `this.start` can be the value of `node.range[1]`, so this checks about `this.start - 1` as well.
     * @type {number}
     * @protected
     */
    get firstIndex() {
        if (typeof this.imap[this.start] !== "undefined") {
            return this.imap[this.start];
        }
        if (typeof this.imap[this.start - 1] !== "undefined") {
            return this.imap[this.start - 1] + 1;
        }
        return 0;
    }

    /**
     * Gets the index of the location `this.end` in `this.tokens`.
     * `this.end` can be the value of `node.range[0]`, so this checks about `this.end - 1` as well.
     * @type {number}
     * @protected
     */
    get lastIndex() {
        if (typeof this.imap[this.end] !== "undefined") {
            return this.imap[this.end] - 1;
        }
        if (typeof this.imap[this.end - 1] !== "undefined") {
            return this.imap[this.end - 1];
        }
        return this.tokens.length - 1;
    }
}

/**
 * The cursor which iterates tokens only.
 * @private
 */
class TokenCursor extends BaseCursor {

    /**
     * Initializes this cursor.
     * @param {Token[]} tokens - The array of tokens.
     * @param {Comment[]} comments - The array of comments.
     * @param {Object} imap - The map from locations to indices in `this.tokens`.
     * @param {number} start - The start location of the iteration range.
     * @param {number} end - The end location of the iteration range.
     */
    constructor(tokens, comments, imap, start, end) {
        super(tokens, comments, imap, start, end);
        this.index = W_INIT;
        this.indexEnd = 0;
    }

    /** @inheritdoc */
    moveNext() {
        if (this.index === W_INIT) {
            this.index = this.firstIndex;
            this.indexEnd = this.lastIndex;
        } else {
            this.index += 1;
        }

        if (this.index <= this.indexEnd) {
            this.current = this.tokens[this.index];
            return true;
        }
        return false;
    }

    /** @inheritdoc */
    movePrev() {
        if (this.index === W_INIT) {
            this.index = this.lastIndex;
            this.indexEnd = this.firstIndex;
        } else {
            this.index -= 1;
        }

        if (this.index >= this.indexEnd) {
            this.current = this.tokens[this.index];
            return true;
        }
        return false;
    }

    //
    // Shorthand for performance.
    //

    /** @inheritdoc */
    get firstToken() {
        const i = this.firstIndex;
        const j = this.lastIndex;

        return (i <= j) ? this.tokens[i] : null;
    }

    /** @inheritdoc */
    get lastToken() {
        const i = this.firstIndex;
        const j = this.lastIndex;

        return (i <= j) ? this.tokens[j] : null;
    }

    /** @inheritdoc */
    get firstTokens() {
        return this.tokens.slice(this.firstIndex, this.lastIndex + 1);
    }

    /** @inheritdoc */
    get lastTokens() {
        return this.tokens.slice(this.firstIndex, this.lastIndex + 1);
    }
}

/**
 * The cursor which iterates tokens and comments.
 * @private
 */
class TokenCommentCursor extends BaseCursor {

    /**
     * Initializes this cursor.
     * @param {Token[]} tokens - The array of tokens.
     * @param {Comment[]} comments - The array of comments.
     * @param {Object} imap - The map from locations to indices in `this.tokens`.
     * @param {number} start - The start location of the iteration range.
     * @param {number} end - The end location of the iteration range.
     */
    constructor(tokens, comments, imap, start, end) {
        super(tokens, comments, imap, start, end);
        this.which = W_INIT;
        this.it = 0;
        this.ic = 0;
    }

    /** @inheritdoc */
    moveNext() {

        // Increment the index of tokens/comments.
        if (this.which === W_INIT) {
            this.it = this.firstIndex;
            this.ic = search(this.comments, this.start);
        } else if (this.which === W_TOKENS) {
            this.it += 1;
        } else {
            this.ic += 1;
        }

        // Choose the current token from the token or the comment.
        const t = (this.it < this.tokens.length) ? this.tokens[this.it] : null;
        const c = (this.ic < this.comments.length) ? this.comments[this.ic] : null;

        if (t && (!c || t.range[0] < c.range[0])) {
            this.which = W_TOKENS;
            this.current = t;
        } else if (c) {
            this.which = W_COMMENTS;
            this.current = c;
        } else {
            this.current = null;
        }

        // Check the current token is before end.
        return Boolean(this.current) && (this.end === -1 || this.current.range[1] <= this.end);
    }

    /** @inheritdoc */
    movePrev() {

        // Decrement the index of tokens/comments.
        if (this.which === W_INIT) {
            this.it = this.lastIndex;
            this.ic = search(this.comments, this.end) - 1;
        } else if (this.which === W_TOKENS) {
            this.it -= 1;
        } else {
            this.ic -= 1;
        }

        // Choose the current token from the token or the comment.
        const t = (this.it >= 0) ? this.tokens[this.it] : null;
        const c = (this.ic >= 0) ? this.comments[this.ic] : null;

        if (t && (!c || t.range[1] > c.range[1])) {
            this.which = W_TOKENS;
            this.current = t;
        } else if (c) {
            this.which = W_COMMENTS;
            this.current = c;
        } else {
            this.current = null;
        }

        // Check the current token is after start.
        return Boolean(this.current) && (this.start === -1 || this.current.range[0] >= this.start);
    }
}

/**
 * The cursor which iterates tokens only.
 * This is for the backward compatibility of padding options.
 * @private
 */
class PaddedTokenCursor extends TokenCursor {

    /**
     * Initializes this cursor.
     * @param {Token[]} tokens - The array of tokens.
     * @param {Comment[]} comments - The array of comments.
     * @param {Object} imap - The map from locations to indices in `this.tokens`.
     * @param {number} start - The start location of the iteration range.
     * @param {number} end - The end location of the iteration range.
     * @param {number} beforeCount - The number of tokens this cursor iterates before start.
     * @param {number} afterCount - The number of tokens this cursor iterates after end.
     */
    constructor(tokens, comments, imap, start, end, beforeCount, afterCount) {
        super(tokens, comments, imap, start, end);
        this.beforeCount = beforeCount | 0;
        this.afterCount = afterCount | 0;
    }

    /** @inheritdoc */
    get firstIndex() {
        return Math.max(0, super.firstIndex - this.beforeCount);
    }

    /** @inheritdoc */
    get lastIndex() {
        return Math.min(this.tokens.length - 1, super.lastIndex + this.afterCount);
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

    /** @inheritdoc */
    movePrev() {
        const retv = this.cursor.movePrev();

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
        while (super.moveNext()) {
            if (this.predicate(this.current)) {
                return true;
            }
        }
        return false;
    }

    /** @inheritdoc */
    movePrev() {
        while (super.movePrev()) {
            if (this.predicate(this.current)) {
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

    /** @inheritdoc */
    movePrev() {
        while (this.count > 0) {
            this.count -= 1;
            if (!super.movePrev()) {
                return false;
            }
        }
        return super.movePrev();
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

    /** @inheritdoc */
    movePrev() {
        if (this.count > 0) {
            this.count -= 1;
            return super.movePrev();
        }
        return false;
    }
}

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
 * @param {Token[]} tokens - The array of tokens.
 * @param {Comment[]} comments - The array of comments.
 * @param {Object} imap - The map from locations to indices in `this.tokens`.
 * @param {number} start - The start location of the iteration range.
 * @param {number} end - The end location of the iteration range.
 * @param {boolean} includeComments - The flag to iterate comments as well.
 * @param {Function|null} filter - The predicate function to choose tokens.
 * @param {number} skip - The count of tokens the cursor skips.
 * @param {number} count - The maximum count of tokens the cursor iterates. Zero is no iteration for backward compatibility.
 * @returns {Cursor} The created cursor.
 * @private
 */
function createCursor(tokens, comments, imap, start, end, includeComments, filter, skip, count) {
    let cursor = new (includeComments ? TokenCommentCursor : TokenCursor)(tokens, comments, imap, start, end);

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
 * @param {Token[]} tokens - The array of tokens.
 * @param {Comment[]} comments - The array of comments.
 * @param {Object} imap - The map from locations to indices in `this.tokens`.
 * @param {number} start - The start location of the iteration range.
 * @param {number} end - The end location of the iteration range.
 * @param {number|Function|Object} [opts=0] - The option object. If this is a number then it's `opts.skip`. If this is a function then it's `opts.filter`.
 * @param {boolean} [opts.includeComments=false] - The flag to iterate comments as well.
 * @param {Function|null} [opts.filter=null] - The predicate function to choose tokens.
 * @param {number} [opts.skip=0] - The count of tokens the cursor skips.
 * @returns {Cursor} The created cursor.
 * @private
 */
function createCursorWithSkip(tokens, comments, imap, start, end, opts) {
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

    return createCursor(tokens, comments, imap, start, end, includeComments, filter, skip, -1);
}

/**
 * Creates the cursor iterates tokens with options.
 *
 * @param {Token[]} tokens - The array of tokens.
 * @param {Comment[]} comments - The array of comments.
 * @param {Object} imap - The map from locations to indices in `this.tokens`.
 * @param {number} start - The start location of the iteration range.
 * @param {number} end - The end location of the iteration range.
 * @param {number|Function|Object} [opts=0] - The option object. If this is a number then it's `opts.count`. If this is a function then it's `opts.filter`.
 * @param {boolean} [opts.includeComments] - The flag to iterate comments as well.
 * @param {Function|null} [opts.filter=null] - The predicate function to choose tokens.
 * @param {number} [opts.count=0] - The maximum count of tokens the cursor iterates. Zero is no iteration for backward compatibility.
 * @returns {Cursor} The created cursor.
 * @private
 */
function createCursorWithCount(tokens, comments, imap, start, end, opts) {
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

    return createCursor(tokens, comments, imap, start, end, includeComments, filter, 0, count);
}

/**
 * Creates the cursor iterates tokens with options.
 *
 * @param {Token[]} tokens - The array of tokens.
 * @param {Comment[]} comments - The array of comments.
 * @param {Object} imap - The map from locations to indices in `this.tokens`.
 * @param {number} start - The start location of the iteration range.
 * @param {number} end - The end location of the iteration range.
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
 * @param {Object} imap - The map from locations to indices in `this.tokens`.
 * @param {number} start - The start location of the iteration range.
 * @param {number} end - The end location of the iteration range.
 * @param {number} [beforeCount=0] - The number of tokens before the node to retrieve.
 * @param {boolean} [afterCount=0] - The number of tokens after the node to retrieve.
 * @returns {Cursor} The created cursor.
 * @private
 */
function createCursorWithPadding(tokens, comments, imap, start, end, beforeCount, afterCount) {
    if (typeof beforeCount === "undefined" && typeof afterCount === "undefined") {
        return new TokenCursor(tokens, comments, imap, start, end);
    }
    if (typeof beforeCount === "number" || typeof beforeCount === "undefined") {
        return new PaddedTokenCursor(tokens, comments, imap, start, end, beforeCount, afterCount);
    }
    return createCursorWithCount(tokens, comments, imap, start, end, beforeCount);
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
        this.imap = createIndexMap(tokens, comments);
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
        const token = this.tokens[this.imap[offset]] || null;

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
            this.tokens,
            this.comments,
            this.imap,
            node.range[0],
            node.range[1],
            options
        ).firstToken;
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
            this.tokens,
            this.comments,
            this.imap,
            node.range[0],
            node.range[1],
            options
        ).lastToken;
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
            this.tokens,
            this.comments,
            this.imap,
            -1,
            node.range[0],
            options
        ).lastToken;
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
            this.tokens,
            this.comments,
            this.imap,
            node.range[1],
            -1,
            options
        ).firstToken;
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
            this.tokens,
            this.comments,
            this.imap,
            left.range[1],
            right.range[0],
            options
        ).firstToken;
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
            this.tokens,
            this.comments,
            this.imap,
            left.range[1],
            right.range[0],
            options
        ).lastToken;
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
            this.tokens,
            this.comments,
            this.imap,
            node.range[0],
            node.range[1],
            options
        ).firstTokens;
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
            this.tokens,
            this.comments,
            this.imap,
            node.range[0],
            node.range[1],
            options
        ).lastTokens;
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
            this.tokens,
            this.comments,
            this.imap,
            -1,
            node.range[0],
            options
        ).lastTokens;
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
            this.tokens,
            this.comments,
            this.imap,
            node.range[1],
            -1,
            options
        ).firstTokens;
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
            this.tokens,
            this.comments,
            this.imap,
            left.range[1],
            right.range[0],
            options
        ).firstTokens;
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
            this.tokens,
            this.comments,
            this.imap,
            left.range[1],
            right.range[0],
            options
        ).lastTokens;
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
            this.imap,
            node.range[0],
            node.range[1],
            beforeCount,
            afterCount
        ).firstTokens;
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
            this.imap,
            left.range[1],
            right.range[0],
            padding,
            padding
        ).firstTokens;
    }
}

//------------------------------------------------------------------------------
// Exports
//------------------------------------------------------------------------------

module.exports = TokenStore;
module.exports.PUBLIC_METHODS = PUBLIC_METHODS;
