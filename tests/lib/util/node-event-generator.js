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
    EventGeneratorTester = require("../../../lib/testers/event-generator-tester"),
    NodeEventGenerator = require("../../../lib/util/node-event-generator");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("NodeEventGenerator", function() {
    EventGeneratorTester.testEventGeneratorInterface(
        new NodeEventGenerator(new EventEmitter())
    );

    let emitter, generator;

    beforeEach(function() {
        emitter = new EventEmitter();
        emitter.emit = sinon.spy(emitter.emit);
        generator = new NodeEventGenerator(emitter);
    });

    it("should generate events for entering AST node.", function() {
        const dummyNode = {type: "Foo", value: 1};

        generator.enterNode(dummyNode);

        assert(emitter.emit.calledOnce);
        assert(emitter.emit.calledWith("Foo", dummyNode));
    });

    it("should generate events for exitting AST node.", function() {
        const dummyNode = {type: "Foo", value: 1};

        generator.leaveNode(dummyNode);

        assert(emitter.emit.calledOnce);
        assert(emitter.emit.calledWith("Foo:exit", dummyNode));
    });
});
