/**
 * @fileoverview Tests for TokenStore class.
 * @author Brandon Mills
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("chai").assert,
    espree = require("espree"),
    TokenStore = require("../../lib/token-store");

//------------------------------------------------------------------------------
// Constants
//------------------------------------------------------------------------------

const SOURCE_CODE = "/*A*/var answer/*B*/=/*C*/a/*D*/* b/*E*///F\n    call();\n/*Z*/",
    AST = espree.parse(SOURCE_CODE, { loc: true, range: true, tokens: true, comment: true }),
    TOKENS = AST.tokens,
    COMMENTS = AST.comments,
    Program = AST,
    VariableDeclaration = Program.body[0],
    VariableDeclarator = VariableDeclaration.declarations[0],
    BinaryExpression = VariableDeclarator.init,
    CallExpression = Program.body[1].expression;

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Checks the values of tokens against an array of expected values.
 * @param {Token[]} tokens Tokens returned from the API.
 * @param {string[]} expected Expected token values
 * @returns {void}
 */
function check(tokens, expected) {
    const length = tokens.length;

    assert.equal(length, expected.length);
    for (let i = 0; i < length; i++) {
        assert.equal(tokens[i].value, expected[i]);
    }
}

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("TokenStore", () => {
    const store = new TokenStore(TOKENS, COMMENTS);

    describe("when calling getTokens", () => {

        it("should retrieve all tokens for root node", () => {
            check(
                store.getTokens(Program),
                ["var", "answer", "=", "a", "*", "b", "call", "(", ")", ";"]
            );
        });

        it("should retrieve all tokens for binary expression", () => {
            check(
                store.getTokens(BinaryExpression),
                ["a", "*", "b"]
            );
        });

        it("should retrieve all tokens plus one before for binary expression", () => {
            check(
                store.getTokens(BinaryExpression, 1),
                ["=", "a", "*", "b"]
            );
        });

        it("should retrieve all tokens plus one after for binary expression", () => {
            check(
                store.getTokens(BinaryExpression, 0, 1),
                ["a", "*", "b", "call"]
            );
        });

        it("should retrieve all tokens plus two before and one after for binary expression", () => {
            check(
                store.getTokens(BinaryExpression, 2, 1),
                ["answer", "=", "a", "*", "b", "call"]
            );
        });

        it("should retrieve all matched tokens for root node with filter", () => {
            check(
                store.getTokens(Program, t => t.type === "Identifier"),
                ["answer", "a", "b", "call"]
            );
            check(
                store.getTokens(Program, { filter: t => t.type === "Identifier" }),
                ["answer", "a", "b", "call"]
            );
        });

        it("should retrieve all tokens and comments in the node for root node with includeComments option", () => {
            check(
                store.getTokens(Program, { includeComments: true }),
                ["var", "answer", "B", "=", "C", "a", "D", "*", "b", "E", "F", "call", "(", ")", ";"]
            );
        });

        it("should retrieve matched tokens and comments in the node for root node with includeComments and filter options", () => {
            check(
                store.getTokens(Program, { includeComments: true, filter: t => t.type.startsWith("Block") }),
                ["B", "C", "D", "E"]
            );
        });

        it("should retrieve all tokens and comments in the node for binary expression with includeComments option", () => {
            check(
                store.getTokens(BinaryExpression, { includeComments: true }),
                ["a", "D", "*", "b"]
            );
        });

    });

    describe("when calling getTokensBefore", () => {

        it("should retrieve zero tokens before a node", () => {
            check(
                store.getTokensBefore(BinaryExpression, 0),
                []
            );
        });

        it("should retrieve one token before a node", () => {
            check(
                store.getTokensBefore(BinaryExpression, 1),
                ["="]
            );
        });

        it("should retrieve more than one token before a node", () => {
            check(
                store.getTokensBefore(BinaryExpression, 2),
                ["answer", "="]
            );
        });

        it("should retrieve all tokens before a node", () => {
            check(
                store.getTokensBefore(BinaryExpression, 9e9),
                ["var", "answer", "="]
            );
        });

        it("should retrieve more than one token before a node with count option", () => {
            check(
                store.getTokensBefore(BinaryExpression, { count: 2 }),
                ["answer", "="]
            );
        });

        it("should retrieve matched tokens before a node with count and filter options", () => {
            check(
                store.getTokensBefore(BinaryExpression, { count: 1, filter: t => t.value !== "=" }),
                ["answer"]
            );
        });

        it("should retrieve all matched tokens before a node with filter option", () => {
            check(
                store.getTokensBefore(BinaryExpression, { filter: t => t.value !== "answer" }),
                ["var", "="]
            );
        });

        it("should retrieve no tokens before the root node", () => {
            check(
                store.getTokensBefore(Program, { count: 1 }),
                []
            );
        });

        it("should retrieve tokens and comments before a node with count and includeComments option", () => {
            check(
                store.getTokensBefore(BinaryExpression, { count: 3, includeComments: true }),
                ["B", "=", "C"]
            );
        });

        it("should retrieve all tokens and comments before a node with includeComments option only", () => {
            check(
                store.getTokensBefore(BinaryExpression, { includeComments: true }),
                ["A", "var", "answer", "B", "=", "C"]
            );
        });

        it("should retrieve all tokens and comments before a node with includeComments and filter options", () => {
            check(
                store.getTokensBefore(BinaryExpression, { includeComments: true, filter: t => t.type.startsWith("Block") }),
                ["A", "B", "C"]
            );
        });

    });

    describe("when calling getTokenBefore", () => {

        it("should retrieve one token before a node", () => {
            assert.equal(
                store.getTokenBefore(BinaryExpression).value,
                "="
            );
        });

        it("should skip a given number of tokens", () => {
            assert.equal(
                store.getTokenBefore(BinaryExpression, 1).value,
                "answer"
            );
            assert.equal(
                store.getTokenBefore(BinaryExpression, 2).value,
                "var"
            );
        });

        it("should skip a given number of tokens with skip option", () => {
            assert.equal(
                store.getTokenBefore(BinaryExpression, { skip: 1 }).value,
                "answer"
            );
            assert.equal(
                store.getTokenBefore(BinaryExpression, { skip: 2 }).value,
                "var"
            );
        });

        it("should retrieve matched token with filter option", () => {
            assert.equal(
                store.getTokenBefore(BinaryExpression, t => t.value !== "=").value,
                "answer"
            );
        });

        it("should retrieve matched token with skip and filter options", () => {
            assert.equal(
                store.getTokenBefore(BinaryExpression, { skip: 1, filter: t => t.value !== "=" }).value,
                "var"
            );
        });

        it("should retrieve one token or comment before a node with includeComments option", () => {
            assert.equal(
                store.getTokenBefore(BinaryExpression, { includeComments: true }).value,
                "C"
            );
        });

        it("should retrieve one token or comment before a node with includeComments and skip options", () => {
            assert.equal(
                store.getTokenBefore(BinaryExpression, { includeComments: true, skip: 1 }).value,
                "="
            );
        });

        it("should retrieve one token or comment before a node with includeComments and skip and filter options", () => {
            assert.equal(
                store.getTokenBefore(BinaryExpression, { includeComments: true, skip: 1, filter: t => t.type.startsWith("Block") }).value,
                "B"
            );
        });

    });

    describe("when calling getTokensAfter", () => {

        it("should retrieve zero tokens after a node", () => {
            check(
                store.getTokensAfter(VariableDeclarator.id, 0),
                []
            );
        });

        it("should retrieve one token after a node", () => {
            check(
                store.getTokensAfter(VariableDeclarator.id, 1),
                ["="]
            );
        });

        it("should retrieve more than one token after a node", () => {
            check(
                store.getTokensAfter(VariableDeclarator.id, 2),
                ["=", "a"]
            );
        });

        it("should retrieve all tokens after a node", () => {
            check(
                store.getTokensAfter(VariableDeclarator.id, 9e9),
                ["=", "a", "*", "b", "call", "(", ")", ";"]
            );
        });

        it("should retrieve more than one token after a node with count option", () => {
            check(
                store.getTokensAfter(VariableDeclarator.id, { count: 2 }),
                ["=", "a"]
            );
        });

        it("should retrieve all matched tokens after a node with filter option", () => {
            check(
                store.getTokensAfter(VariableDeclarator.id, { filter: t => t.type === "Identifier" }),
                ["a", "b", "call"]
            );
        });

        it("should retrieve matched tokens after a node with count and filter options", () => {
            check(
                store.getTokensAfter(VariableDeclarator.id, { count: 2, filter: t => t.type === "Identifier" }),
                ["a", "b"]
            );
        });

        it("should retrieve all tokens and comments after a node with includeComments option", () => {
            check(
                store.getTokensAfter(VariableDeclarator.id, { includeComments: true }),
                ["B", "=", "C", "a", "D", "*", "b", "E", "F", "call", "(", ")", ";", "Z"]
            );
        });

        it("should retrieve several tokens and comments after a node with includeComments and count options", () => {
            check(
                store.getTokensAfter(VariableDeclarator.id, { includeComments: true, count: 3 }),
                ["B", "=", "C"]
            );
        });

        it("should retrieve matched tokens and comments after a node with includeComments and count and filter options", () => {
            check(
                store.getTokensAfter(VariableDeclarator.id, { includeComments: true, count: 3, filter: t => t.type.startsWith("Block") }),
                ["B", "C", "D"]
            );
        });

    });

    describe("when calling getTokenAfter", () => {

        it("should retrieve one token after a node", () => {
            assert.equal(
                store.getTokenAfter(VariableDeclarator.id).value,
                "="
            );
        });

        it("should skip a given number of tokens", () => {
            assert.equal(
                store.getTokenAfter(VariableDeclarator.id, 1).value,
                "a"
            );
            assert.equal(
                store.getTokenAfter(VariableDeclarator.id, 2).value,
                "*"
            );
        });

        it("should skip a given number of tokens with skip option", () => {
            assert.equal(
                store.getTokenAfter(VariableDeclarator.id, { skip: 1 }).value,
                "a"
            );
            assert.equal(
                store.getTokenAfter(VariableDeclarator.id, { skip: 2 }).value,
                "*"
            );
        });

        it("should retrieve matched token with filter option", () => {
            assert.equal(
                store.getTokenAfter(VariableDeclarator.id, t => t.type === "Identifier").value,
                "a"
            );
            assert.equal(
                store.getTokenAfter(VariableDeclarator.id, { filter: t => t.type === "Identifier" }).value,
                "a"
            );
        });

        it("should retrieve matched token with filter and skip options", () => {
            assert.equal(
                store.getTokenAfter(VariableDeclarator.id, { skip: 1, filter: t => t.type === "Identifier" }).value,
                "b"
            );
        });

        it("should retrieve one token or comment after a node with includeComments option", () => {
            assert.equal(
                store.getTokenAfter(VariableDeclarator.id, { includeComments: true }).value,
                "B"
            );
        });

        it("should retrieve one token or comment after a node with includeComments and skip options", () => {
            assert.equal(
                store.getTokenAfter(VariableDeclarator.id, { includeComments: true, skip: 2 }).value,
                "C"
            );
        });

        it("should retrieve one token or comment after a node with includeComments and skip and filter options", () => {
            assert.equal(
                store.getTokenAfter(VariableDeclarator.id, { includeComments: true, skip: 2, filter: t => t.type.startsWith("Block") }).value,
                "D"
            );
        });

    });

    describe("when calling getFirstTokens", () => {

        it("should retrieve zero tokens from a node's token stream", () => {
            check(
                store.getFirstTokens(BinaryExpression, 0),
                []
            );
        });

        it("should retrieve one token from a node's token stream", () => {
            check(
                store.getFirstTokens(BinaryExpression, 1),
                ["a"]
            );
        });

        it("should retrieve more than one token from a node's token stream", () => {
            check(
                store.getFirstTokens(BinaryExpression, 2),
                ["a", "*"]
            );
        });

        it("should retrieve all tokens from a node's token stream", () => {
            check(
                store.getFirstTokens(BinaryExpression, 9e9),
                ["a", "*", "b"]
            );
        });

        it("should retrieve more than one token from a node's token stream with count option", () => {
            check(
                store.getFirstTokens(BinaryExpression, { count: 2 }),
                ["a", "*"]
            );
        });

        it("should retrieve matched tokens from a node's token stream with filter option", () => {
            check(
                store.getFirstTokens(BinaryExpression, t => t.type === "Identifier"),
                ["a", "b"]
            );
            check(
                store.getFirstTokens(BinaryExpression, { filter: t => t.type === "Identifier" }),
                ["a", "b"]
            );
        });

        it("should retrieve matched tokens from a node's token stream with filter and count options", () => {
            check(
                store.getFirstTokens(BinaryExpression, { count: 1, filter: t => t.type === "Identifier" }),
                ["a"]
            );
        });

        it("should retrieve all tokens and comments from a node's token stream with includeComments option", () => {
            check(
                store.getFirstTokens(BinaryExpression, { includeComments: true }),
                ["a", "D", "*", "b"]
            );
        });

        it("should retrieve several tokens and comments from a node's token stream with includeComments and count options", () => {
            check(
                store.getFirstTokens(BinaryExpression, { includeComments: true, count: 3 }),
                ["a", "D", "*"]
            );
        });

        it("should retrieve several tokens and comments from a node's token stream with includeComments and count and filter options", () => {
            check(
                store.getFirstTokens(BinaryExpression, { includeComments: true, count: 3, filter: t => t.value !== "a" }),
                ["D", "*", "b"]
            );
        });

    });

    describe("when calling getFirstToken", () => {

        it("should retrieve the first token of a node's token stream", () => {
            assert.equal(
                store.getFirstToken(BinaryExpression).value,
                "a"
            );
        });

        it("should skip a given number of tokens", () => {
            assert.equal(
                store.getFirstToken(BinaryExpression, 1).value,
                "*"
            );
            assert.equal(
                store.getFirstToken(BinaryExpression, 2).value,
                "b"
            );
        });

        it("should skip a given number of tokens with skip option", () => {
            assert.equal(
                store.getFirstToken(BinaryExpression, { skip: 1 }).value,
                "*"
            );
            assert.equal(
                store.getFirstToken(BinaryExpression, { skip: 2 }).value,
                "b"
            );
        });

        it("should retrieve matched token with filter option", () => {
            assert.equal(
                store.getFirstToken(BinaryExpression, t => t.type === "Identifier").value,
                "a"
            );
            assert.equal(
                store.getFirstToken(BinaryExpression, { filter: t => t.type === "Identifier" }).value,
                "a"
            );
        });

        it("should retrieve matched token with filter and skip options", () => {
            assert.equal(
                store.getFirstToken(BinaryExpression, { skip: 1, filter: t => t.type === "Identifier" }).value,
                "b"
            );
        });

        it("should retrieve the first token or comment of a node's token stream with includeComments option", () => {
            assert.equal(
                store.getFirstToken(BinaryExpression, { includeComments: true }).value,
                "a"
            );
        });

        it("should retrieve the first matched token or comment of a node's token stream with includeComments and skip options", () => {
            assert.equal(
                store.getFirstToken(BinaryExpression, { includeComments: true, skip: 1 }).value,
                "D"
            );
        });

        it("should retrieve the first matched token or comment of a node's token stream with includeComments and skip and filter options", () => {
            assert.equal(
                store.getFirstToken(BinaryExpression, { includeComments: true, skip: 1, filter: t => t.value !== "a" }).value,
                "*"
            );
        });

    });

    describe("when calling getLastTokens", () => {

        it("should retrieve zero tokens from the end of a node's token stream", () => {
            check(
                store.getLastTokens(BinaryExpression, 0),
                []
            );
        });

        it("should retrieve one token from the end of a node's token stream", () => {
            check(
                store.getLastTokens(BinaryExpression, 1),
                ["b"]
            );
        });

        it("should retrieve more than one token from the end of a node's token stream", () => {
            check(
                store.getLastTokens(BinaryExpression, 2),
                ["*", "b"]
            );
        });

        it("should retrieve all tokens from the end of a node's token stream", () => {
            check(
                store.getLastTokens(BinaryExpression, 9e9),
                ["a", "*", "b"]
            );
        });

        it("should retrieve more than one token from the end of a node's token stream with count option", () => {
            check(
                store.getLastTokens(BinaryExpression, { count: 2 }),
                ["*", "b"]
            );
        });

        it("should retrieve matched tokens from the end of a node's token stream with filter option", () => {
            check(
                store.getLastTokens(BinaryExpression, t => t.type === "Identifier"),
                ["a", "b"]
            );
            check(
                store.getLastTokens(BinaryExpression, { filter: t => t.type === "Identifier" }),
                ["a", "b"]
            );
        });

        it("should retrieve matched tokens from the end of a node's token stream with filter and count options", () => {
            check(
                store.getLastTokens(BinaryExpression, { count: 1, filter: t => t.type === "Identifier" }),
                ["b"]
            );
        });

        it("should retrieve all tokens from the end of a node's token stream with includeComments option", () => {
            check(
                store.getLastTokens(BinaryExpression, { includeComments: true }),
                ["a", "D", "*", "b"]
            );
        });

        it("should retrieve matched tokens from the end of a node's token stream with includeComments and count options", () => {
            check(
                store.getLastTokens(BinaryExpression, { includeComments: true, count: 3 }),
                ["D", "*", "b"]
            );
        });

        it("should retrieve matched tokens from the end of a node's token stream with includeComments and count and filter options", () => {
            check(
                store.getLastTokens(BinaryExpression, { includeComments: true, count: 3, filter: t => t.type !== "Punctuator" }),
                ["a", "D", "b"]
            );
        });

    });

    describe("when calling getLastToken", () => {

        it("should retrieve the last token of a node's token stream", () => {
            assert.equal(
                store.getLastToken(BinaryExpression).value,
                "b"
            );
            assert.equal(
                store.getLastToken(VariableDeclaration).value,
                "b"
            );
        });

        it("should skip a given number of tokens", () => {
            assert.equal(
                store.getLastToken(BinaryExpression, 1).value,
                "*"
            );
            assert.equal(
                store.getLastToken(BinaryExpression, 2).value,
                "a"
            );
        });

        it("should skip a given number of tokens with skip option", () => {
            assert.equal(
                store.getLastToken(BinaryExpression, { skip: 1 }).value,
                "*"
            );
            assert.equal(
                store.getLastToken(BinaryExpression, { skip: 2 }).value,
                "a"
            );
        });

        it("should retrieve the last matched token of a node's token stream with filter option", () => {
            assert.equal(
                store.getLastToken(BinaryExpression, t => t.value !== "b").value,
                "*"
            );
            assert.equal(
                store.getLastToken(BinaryExpression, { filter: t => t.value !== "b" }).value,
                "*"
            );
        });

        it("should retrieve the last matched token of a node's token stream with filter and skip options", () => {
            assert.equal(
                store.getLastToken(BinaryExpression, { skip: 1, filter: t => t.type === "Identifier" }).value,
                "a"
            );
        });

        it("should retrieve the last token of a node's token stream with includeComments option", () => {
            assert.equal(
                store.getLastToken(BinaryExpression, { includeComments: true }).value,
                "b"
            );
        });

        it("should retrieve the last token of a node's token stream with includeComments and skip options", () => {
            assert.equal(
                store.getLastToken(BinaryExpression, { includeComments: true, skip: 2 }).value,
                "D"
            );
        });

        it("should retrieve the last token of a node's token stream with includeComments and skip and filter options", () => {
            assert.equal(
                store.getLastToken(BinaryExpression, { includeComments: true, skip: 1, filter: t => t.type !== "Identifier" }).value,
                "D"
            );
        });

    });

    describe("when calling getFirstTokensBetween", () => {

        it("should retrieve zero tokens between adjacent nodes", () => {
            check(
                store.getFirstTokensBetween(BinaryExpression, CallExpression),
                []
            );
        });

        it("should retrieve multiple tokens between non-adjacent nodes with count option", () => {
            check(
                store.getFirstTokensBetween(VariableDeclarator.id, BinaryExpression.right, 2),
                ["=", "a"]
            );
            check(
                store.getFirstTokensBetween(VariableDeclarator.id, BinaryExpression.right, { count: 2 }),
                ["=", "a"]
            );
        });

        it("should retrieve matched tokens between non-adjacent nodes with filter option", () => {
            check(
                store.getFirstTokensBetween(VariableDeclarator.id, BinaryExpression.right, { filter: t => t.type !== "Punctuator" }),
                ["a"]
            );
        });

        it("should retrieve all tokens between non-adjacent nodes with empty object option", () => {
            check(
                store.getFirstTokensBetween(VariableDeclarator.id, BinaryExpression.right, {}),
                ["=", "a", "*"]
            );
        });

        it("should retrieve multiple tokens between non-adjacent nodes with includeComments option", () => {
            check(
                store.getFirstTokensBetween(VariableDeclarator.id, BinaryExpression.right, { includeComments: true }),
                ["B", "=", "C", "a", "D", "*"]
            );
        });

        it("should retrieve multiple tokens between non-adjacent nodes with includeComments and count options", () => {
            check(
                store.getFirstTokensBetween(VariableDeclarator.id, BinaryExpression.right, { includeComments: true, count: 3 }),
                ["B", "=", "C"]
            );
        });

        it("should retrieve multiple tokens and comments between non-adjacent nodes with includeComments and filter options", () => {
            check(
                store.getFirstTokensBetween(VariableDeclarator.id, BinaryExpression.right, { includeComments: true, filter: t => t.type !== "Punctuator" }),
                ["B", "C", "a", "D"]
            );
        });

    });

    describe("when calling getFirstTokenBetween", () => {

        it("should return null between adjacent nodes", () => {
            assert.equal(
                store.getFirstTokenBetween(BinaryExpression, CallExpression),
                null
            );
        });

        it("should retrieve one token between non-adjacent nodes with count option", () => {
            assert.equal(
                store.getFirstTokenBetween(VariableDeclarator.id, BinaryExpression.right).value,
                "="
            );
        });

        it("should retrieve one token between non-adjacent nodes with skip option", () => {
            assert.equal(
                store.getFirstTokenBetween(VariableDeclarator.id, BinaryExpression.right, 1).value,
                "a"
            );
            assert.equal(
                store.getFirstTokenBetween(VariableDeclarator.id, BinaryExpression.right, { skip: 2 }).value,
                "*"
            );
        });

        it("should return null if it's skipped beyond the right token", () => {
            assert.equal(
                store.getFirstTokenBetween(VariableDeclarator.id, BinaryExpression.right, { skip: 3 }),
                null
            );
            assert.equal(
                store.getFirstTokenBetween(VariableDeclarator.id, BinaryExpression.right, { skip: 4 }),
                null
            );
        });

        it("should retrieve the first matched token between non-adjacent nodes with filter option", () => {
            assert.equal(
                store.getFirstTokenBetween(VariableDeclarator.id, BinaryExpression.right, { filter: t => t.type !== "Identifier" }).value,
                "="
            );
        });

        it("should retrieve first token or comment between non-adjacent nodes with includeComments option", () => {
            assert.equal(
                store.getFirstTokenBetween(VariableDeclarator.id, BinaryExpression.right, { includeComments: true }).value,
                "B"
            );
        });

        it("should retrieve first token or comment between non-adjacent nodes with includeComments and skip options", () => {
            assert.equal(
                store.getFirstTokenBetween(VariableDeclarator.id, BinaryExpression.right, { includeComments: true, skip: 1 }).value,
                "="
            );
        });

        it("should retrieve first token or comment between non-adjacent nodes with includeComments and skip and filter options", () => {
            assert.equal(
                store.getFirstTokenBetween(VariableDeclarator.id, BinaryExpression.right, { includeComments: true, skip: 1, filter: t => t.type !== "Punctuator" }).value,
                "C"
            );
        });

    });

    describe("when calling getLastTokensBetween", () => {

        it("should retrieve zero tokens between adjacent nodes", () => {
            check(
                store.getLastTokensBetween(BinaryExpression, CallExpression),
                []
            );
        });

        it("should retrieve multiple tokens between non-adjacent nodes with count option", () => {
            check(
                store.getLastTokensBetween(VariableDeclarator.id, BinaryExpression.right, 2),
                ["a", "*"]
            );
            check(
                store.getLastTokensBetween(VariableDeclarator.id, BinaryExpression.right, { count: 2 }),
                ["a", "*"]
            );
        });

        it("should retrieve matched tokens between non-adjacent nodes with filter option", () => {
            check(
                store.getLastTokensBetween(VariableDeclarator.id, BinaryExpression.right, { filter: t => t.type !== "Punctuator" }),
                ["a"]
            );
        });

        it("should retrieve all tokens between non-adjacent nodes with empty object option", () => {
            check(
                store.getLastTokensBetween(VariableDeclarator.id, BinaryExpression.right, {}),
                ["=", "a", "*"]
            );
        });

        it("should retrieve all tokens and comments between non-adjacent nodes with includeComments option", () => {
            check(
                store.getLastTokensBetween(VariableDeclarator.id, BinaryExpression.right, { includeComments: true }),
                ["B", "=", "C", "a", "D", "*"]
            );
        });

        it("should retrieve multiple tokens between non-adjacent nodes with includeComments and count options", () => {
            check(
                store.getLastTokensBetween(VariableDeclarator.id, BinaryExpression.right, { includeComments: true, count: 3 }),
                ["a", "D", "*"]
            );
        });

        it("should retrieve multiple tokens and comments between non-adjacent nodes with includeComments and filter options", () => {
            check(
                store.getLastTokensBetween(VariableDeclarator.id, BinaryExpression.right, { includeComments: true, filter: t => t.type !== "Punctuator" }),
                ["B", "C", "a", "D"]
            );
        });

    });

    describe("when calling getLastTokenBetween", () => {

        it("should return null between adjacent nodes", () => {
            assert.equal(
                store.getLastTokenBetween(BinaryExpression, CallExpression),
                null
            );
        });

        it("should retrieve one token between non-adjacent nodes with count option", () => {
            assert.equal(
                store.getLastTokenBetween(VariableDeclarator.id, BinaryExpression.right).value,
                "*"
            );
        });

        it("should retrieve one token between non-adjacent nodes with skip option", () => {
            assert.equal(
                store.getLastTokenBetween(VariableDeclarator.id, BinaryExpression.right, 1).value,
                "a"
            );
            assert.equal(
                store.getLastTokenBetween(VariableDeclarator.id, BinaryExpression.right, { skip: 2 }).value,
                "="
            );
        });

        it("should return null if it's skipped beyond the right token", () => {
            assert.equal(
                store.getLastTokenBetween(VariableDeclarator.id, BinaryExpression.right, { skip: 3 }),
                null
            );
            assert.equal(
                store.getLastTokenBetween(VariableDeclarator.id, BinaryExpression.right, { skip: 4 }),
                null
            );
        });

        it("should retrieve the first matched token between non-adjacent nodes with filter option", () => {
            assert.equal(
                store.getLastTokenBetween(VariableDeclarator.id, BinaryExpression.right, { filter: t => t.type !== "Identifier" }).value,
                "*"
            );
        });

        it("should retrieve first token or comment between non-adjacent nodes with includeComments option", () => {
            assert.equal(
                store.getLastTokenBetween(VariableDeclarator.id, BinaryExpression.right, { includeComments: true }).value,
                "*"
            );
        });

        it("should retrieve first token or comment between non-adjacent nodes with includeComments and skip options", () => {
            assert.equal(
                store.getLastTokenBetween(VariableDeclarator.id, BinaryExpression.right, { includeComments: true, skip: 1 }).value,
                "D"
            );
        });

        it("should retrieve first token or comment between non-adjacent nodes with includeComments and skip and filter options", () => {
            assert.equal(
                store.getLastTokenBetween(VariableDeclarator.id, BinaryExpression.right, { includeComments: true, skip: 1, filter: t => t.type !== "Punctuator" }).value,
                "a"
            );
        });

    });

    describe("when calling getTokensBetween", () => {

        it("should retrieve zero tokens between adjacent nodes", () => {
            check(
                store.getTokensBetween(BinaryExpression, CallExpression),
                []
            );
        });

        it("should retrieve one token between nodes", () => {
            check(
                store.getTokensBetween(BinaryExpression.left, BinaryExpression.right),
                ["*"]
            );
        });

        it("should retrieve multiple tokens between non-adjacent nodes", () => {
            check(
                store.getTokensBetween(VariableDeclarator.id, BinaryExpression.right),
                ["=", "a", "*"]
            );
        });

        it("should retrieve surrounding tokens when asked for padding", () => {
            check(
                store.getTokensBetween(VariableDeclarator.id, BinaryExpression.left, 2),
                ["var", "answer", "=", "a", "*"]
            );
        });

    });

    describe("when calling getTokenByRangeStart", () => {

        it("should return identifier token", () => {
            const result = store.getTokenByRangeStart(9);

            assert.equal(result.type, "Identifier");
            assert.equal(result.value, "answer");
        });

        it("should return null when token doesn't exist", () => {
            const result = store.getTokenByRangeStart(10);

            assert.isNull(result);
        });

    });

    describe("when calling getTokenOrCommentBefore", () => {

        it("should retrieve one token or comment before a node", () => {
            assert.equal(
                store.getTokenOrCommentBefore(BinaryExpression).value,
                "C"
            );
        });

        it("should skip a given number of tokens", () => {
            assert.equal(
                store.getTokenOrCommentBefore(BinaryExpression, 1).value,
                "="
            );
            assert.equal(
                store.getTokenOrCommentBefore(BinaryExpression, 2).value,
                "B"
            );
        });

    });

    describe("when calling getTokenOrCommentAfter", () => {

        it("should retrieve one token or comment after a node", () => {
            assert.equal(
                store.getTokenOrCommentAfter(VariableDeclarator.id).value,
                "B"
            );
        });

        it("should skip a given number of tokens", () => {
            assert.equal(
                store.getTokenOrCommentAfter(VariableDeclarator.id, 1).value,
                "="
            );
            assert.equal(
                store.getTokenOrCommentAfter(VariableDeclarator.id, 2).value,
                "C"
            );
        });

    });

});
