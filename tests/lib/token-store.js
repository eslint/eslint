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

const SOURCE_CODE = "var answer = a * b\n    call();\n",
    AST = espree.parse(SOURCE_CODE, { loc: true, range: true, tokens: true }),
    TOKENS = AST.tokens,
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

describe("TokenStore", function() {
    const store = new TokenStore(TOKENS);

    describe("when calling getTokens", function() {

        it("should retrieve all tokens for root node", function() {
            check(
                store.getTokens(Program),
                ["var", "answer", "=", "a", "*", "b", "call", "(", ")", ";"]
            );
        });

        it("should retrieve all tokens for binary expression", function() {
            check(
                store.getTokens(BinaryExpression),
                ["a", "*", "b"]
            );
        });

        it("should retrieve all tokens plus one before for binary expression", function() {
            check(
                store.getTokens(BinaryExpression, 1),
                ["=", "a", "*", "b"]
            );
        });

        it("should retrieve all tokens plus one after for binary expression", function() {
            check(
                store.getTokens(BinaryExpression, 0, 1),
                ["a", "*", "b", "call"]
            );
        });

        it("should retrieve all tokens plus two before and one after for binary expression", function() {
            check(
                store.getTokens(BinaryExpression, 2, 1),
                ["answer", "=", "a", "*", "b", "call"]
            );
        });

    });

    describe("when calling getTokensBefore", function() {

        it("should retrieve zero tokens before a node", function() {
            check(
                store.getTokensBefore(BinaryExpression, 0),
                []
            );
        });

        it("should retrieve one token before a node", function() {
            check(
                store.getTokensBefore(BinaryExpression, 1),
                ["="]
            );
        });

        it("should retrieve more than one token before a node", function() {
            check(
                store.getTokensBefore(BinaryExpression, 2),
                ["answer", "="]
            );
        });

        it("should retrieve all tokens before a node", function() {
            check(
                store.getTokensBefore(BinaryExpression, 9e9),
                ["var", "answer", "="]
            );
        });

    });

    describe("when calling getTokenBefore", function() {

        it("should retrieve one token before a node", function() {
            assert.equal(
                store.getTokenBefore(BinaryExpression).value,
                "="
            );
        });

        it("should skip a given number of tokens", function() {
            assert.equal(
                store.getTokenBefore(BinaryExpression, 1).value,
                "answer"
            );
            assert.equal(
                store.getTokenBefore(BinaryExpression, 2).value,
                "var"
            );
        });

    });

    describe("when calling getTokensAfter", function() {

        it("should retrieve zero tokens after a node", function() {
            check(
                store.getTokensAfter(VariableDeclarator.id, 0),
                []
            );
        });

        it("should retrieve one token after a node", function() {
            check(
                store.getTokensAfter(VariableDeclarator.id, 1),
                ["="]
            );
        });

        it("should retrieve more than one token after a node", function() {
            check(
                store.getTokensAfter(VariableDeclarator.id, 2),
                ["=", "a"]
            );
        });

        it("should retrieve all tokens after a node", function() {
            check(
                store.getTokensAfter(VariableDeclarator.id, 9e9),
                ["=", "a", "*", "b", "call", "(", ")", ";"]
            );
        });

    });

    describe("when calling getTokenAfter", function() {

        it("should retrieve one token after a node", function() {
            assert.equal(
                store.getTokenAfter(VariableDeclarator.id).value,
                "="
            );
        });

        it("should skip a given number of tokens", function() {
            assert.equal(
                store.getTokenAfter(VariableDeclarator.id, 1).value,
                "a"
            );
            assert.equal(
                store.getTokenAfter(VariableDeclarator.id, 2).value,
                "*"
            );
        });

    });

    describe("when calling getFirstTokens", function() {

        it("should retrieve zero tokens from a node's token stream", function() {
            check(
                store.getFirstTokens(BinaryExpression, 0),
                []
            );
        });

        it("should retrieve one token from a node's token stream", function() {
            check(
                store.getFirstTokens(BinaryExpression, 1),
                ["a"]
            );
        });

        it("should retrieve more than one token from a node's token stream", function() {
            check(
                store.getFirstTokens(BinaryExpression, 2),
                ["a", "*"]
            );
        });

        it("should retrieve all tokens from a node's token stream", function() {
            check(
                store.getFirstTokens(BinaryExpression, 9e9),
                ["a", "*", "b"]
            );
        });

    });

    describe("when calling getFirstToken", function() {

        it("should retrieve the first token of a node's token stream", function() {
            assert.equal(
                store.getFirstToken(BinaryExpression).value,
                "a"
            );
        });

        it("should skip a given number of tokens", function() {
            assert.equal(
                store.getFirstToken(BinaryExpression, 1).value,
                "*"
            );
            assert.equal(
                store.getFirstToken(BinaryExpression, 2).value,
                "b"
            );
        });

    });

    describe("when calling getLastTokens", function() {

        it("should retrieve zero tokens from the end of a node's token stream", function() {
            check(
                store.getLastTokens(BinaryExpression, 0),
                []
            );
        });

        it("should retrieve one token from the end of a node's token stream", function() {
            check(
                store.getLastTokens(BinaryExpression, 1),
                ["b"]
            );
        });

        it("should retrieve more than one token from the end of a node's token stream", function() {
            check(
                store.getLastTokens(BinaryExpression, 2),
                ["*", "b"]
            );
        });

        it("should retrieve all tokens from the end of a node's token stream", function() {
            check(
                store.getLastTokens(BinaryExpression, 9e9),
                ["a", "*", "b"]
            );
        });

    });

    describe("when calling getLastToken", function() {

        it("should retrieve the last token of a node's token stream", function() {
            assert.equal(
                store.getLastToken(BinaryExpression).value,
                "b"
            );
            assert.equal(
                store.getLastToken(VariableDeclaration).value,
                "b"
            );
        });

        it("should skip a given number of tokens", function() {
            assert.equal(
                store.getLastToken(BinaryExpression, 1).value,
                "*"
            );
            assert.equal(
                store.getLastToken(BinaryExpression, 2).value,
                "a"
            );
        });

    });

    describe("when calling getTokensBetween", function() {

        it("should retrieve zero tokens between adjacent nodes", function() {
            check(
                store.getTokensBetween(BinaryExpression, CallExpression),
                []
            );
        });

        it("should retrieve one token between nodes", function() {
            check(
                store.getTokensBetween(BinaryExpression.left, BinaryExpression.right),
                ["*"]
            );
        });

        it("should retrieve multiple tokens between non-adjacent nodes", function() {
            check(
                store.getTokensBetween(VariableDeclarator.id, BinaryExpression.right),
                ["=", "a", "*"]
            );
        });

        it("should retrieve surrounding tokens when asked for padding", function() {
            check(
                store.getTokensBetween(VariableDeclarator.id, BinaryExpression.left, 2),
                ["var", "answer", "=", "a", "*"]
            );
        });

    });

    describe("when calling getTokenByRangeStart", function() {

        it("should return identifier token", function() {
            const result = store.getTokenByRangeStart(4);

            assert.equal(result.type, "Identifier");
            assert.equal(result.value, "answer");
        });

        it("should return null when token doesn't exist", function() {
            const result = store.getTokenByRangeStart(5);

            assert.isNull(result);
        });

    });

});
