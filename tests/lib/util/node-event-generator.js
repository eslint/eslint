/**
 * @fileoverview Tests for NodeEventGenerator.
 * @author Toru Nagashima
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("assert"),
    EventEmitter = require("events").EventEmitter,
    sinon = require("sinon"),
    espree = require("espree"),
    estraverse = require("estraverse"),
    EventGeneratorTester = require("../../../lib/testers/event-generator-tester"),
    NodeEventGenerator = require("../../../lib/util/node-event-generator");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ESPREE_CONFIG = {
    ecmaVersion: 6,
    comment: true,
    tokens: true,
    range: true,
    loc: true
};

describe("NodeEventGenerator", () => {
    EventGeneratorTester.testEventGeneratorInterface(
        new NodeEventGenerator(new EventEmitter(), new Set())
    );

    describe("entering a single AST node", () => {
        let emitter, generator;

        beforeEach(() => {
            emitter = new EventEmitter();
            emitter.emit = sinon.spy(emitter.emit);
            generator = new NodeEventGenerator(emitter, ["Foo", "Foo > Bar"]);
        });

        it("should generate events for entering AST node.", () => {
            const dummyNode = { type: "Foo", value: 1 };

            generator.enterNode(dummyNode);

            assert(emitter.emit.calledOnce);
            assert(emitter.emit.calledWith("Foo", dummyNode));
        });

        it("should generate events for exitting AST node.", () => {
            const dummyNode = { type: "Foo", value: 1 };

            generator.leaveNode(dummyNode);

            assert(emitter.emit.calledOnce);
            assert(emitter.emit.calledWith("Foo:exit", dummyNode));
        });

        it("should generate events for AST queries", () => {
            const dummyNode = { type: "Bar", parent: { type: "Foo" } };

            generator.enterNode(dummyNode);

            assert(emitter.emit.calledTwice);
            assert(emitter.emit.calledWith("Foo > Bar", dummyNode));
        });
    });

    describe("traversing the entire AST", () => {

        /**
         * Gets a list of emitted types/selectors from the generator, in emission order
         * @param {string} sourceText Source code to parse and traverse
         * @param {Array<string>|Set<string>} possibleQueries Selectors to detect
         * @returns {string[]} A list of strings that were emitted, in the order that they were emitted in
         */
        function getEmissions(sourceText, possibleQueries) {
            const emissions = [];
            const emitter = new EventEmitter();
            const generator = new NodeEventGenerator(emitter, possibleQueries);
            const ast = espree.parse(sourceText, ESPREE_CONFIG);

            emitter.emit = type => emissions.push(type);

            estraverse.traverse(ast, {
                enter(node, parent) {
                    node.parent = parent;
                    generator.enterNode(node);
                },
                leave(node) {
                    generator.leaveNode(node);
                }
            });

            return emissions;
        }

        /**
         * Creates a test case that asserts a particular sequence of generator emissions
         * @param {string} sourceText The source text that should be parsed and traversed
         * @param {Array<string>} possibleQueries A collection of selectors that rules are listening for
         * @param {Array<string>} expectedEmissions The emissions that the generator is expected to produce, in order
         * @param {Function} emissionFilter A filter for the emission list. Defaults to only containing selectors
         * that appear in possibleQueries.
         * @returns {void}
         */
        function assertEmissions(sourceText, possibleQueries, expectedEmissions, emissionFilter) {
            it(possibleQueries.join("; "), () => {
                const emissions = getEmissions(sourceText, possibleQueries)
                    .filter(emissionFilter || (emission => possibleQueries.indexOf(emission) !== -1));

                assert.deepEqual(emissions, expectedEmissions);
            });
        }

        assertEmissions(
            "foo + bar",
            [],
            ["Program", "ExpressionStatement", "BinaryExpression", "Identifier", "Identifier:exit", "Identifier", "Identifier:exit", "BinaryExpression:exit", "ExpressionStatement:exit", "Program:exit"],
            () => true
        );

        assertEmissions(
            "foo + 5",
            [
                "BinaryExpression > Identifier",
                "BinaryExpression",
                "BinaryExpression Literal:exit",
                "BinaryExpression > Identifier:exit",
                "BinaryExpression:exit"
            ],
            [
                "BinaryExpression", // foo + 5
                "BinaryExpression > Identifier", // foo
                "BinaryExpression > Identifier:exit", // exiting foo
                "BinaryExpression Literal:exit", // exiting 5
                "BinaryExpression:exit" // exiting foo + 5
            ]
        );

        assertEmissions(
            "foo + 5",
            ["BinaryExpression > *[name='foo']"],
            ["BinaryExpression > *[name='foo']"] // entering foo
        );

        assertEmissions(
            "foo",
            ["*"],
            ["*", "*", "*"] // Program, ExpressionStatement, Identifier
        );

        assertEmissions(
            "foo",
            ["*:not(ExpressionStatement)"],
            ["*:not(ExpressionStatement)", "*:not(ExpressionStatement)"] // Program, Identifier
        );

        assertEmissions(
            "foo()",
            ["CallExpression[callee.name='foo']"],
            ["CallExpression[callee.name='foo']"] // foo()
        );

        assertEmissions(
            "foo()",
            ["CallExpression[callee.name='bar']"],
            [] // (nothing emitted)
        );

        assertEmissions(
            "foo + bar + baz",
            [":not(*)"],
            [] // (nothing emitted)
        );

        assertEmissions(
            "foo + bar + baz",
            [":matches(Identifier[name='foo'], Identifier[name='bar'], Identifier[name='baz'])"],
            [
                ":matches(Identifier[name='foo'], Identifier[name='bar'], Identifier[name='baz'])", // foo
                ":matches(Identifier[name='foo'], Identifier[name='bar'], Identifier[name='baz'])", // bar
                ":matches(Identifier[name='foo'], Identifier[name='bar'], Identifier[name='baz'])" // baz
            ]
        );

        assertEmissions(
            "foo + 5 + 6",
            [":matches(Identifier, Literal[value=5])"],
            [
                ":matches(Identifier, Literal[value=5])", // foo
                ":matches(Identifier, Literal[value=5])" // 5
            ]
        );

        assertEmissions(
            "[foo, 5, foo]",
            ["Identifier + Literal"],
            ["Identifier + Literal"]  // 5
        );

        assertEmissions(
            "[foo, {}, 5]",
            ["Identifier + Literal", "Identifier ~ Literal"],
            ["Identifier ~ Literal"]  // 5
        );
    });
});
