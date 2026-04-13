/* eslint-disable no-console -- benchmark output */
"use strict";

const { Linter } = require("../lib/linter");
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");

const repoRoot = path.resolve(__dirname, "..");
const code = fs.readFileSync(
	path.join(repoRoot, "tests/bench/large.js"),
	"utf8",
);

// Load recommended config
const recommended = require("../packages/js/src/configs/eslint-recommended.js");
const config = [recommended];

const linter = new Linter();

const WARMUP = 3;
const RUNS = 10;

// Warmup
for (let i = 0; i < WARMUP; i++) {
	linter.verify(code, config, { filename: "large.js" });
}

// Measure
const times = [];
let messages;

for (let i = 0; i < RUNS; i++) {
	const start = process.hrtime.bigint();

	messages = linter.verify(code, config, { filename: "large.js" });
	const end = process.hrtime.bigint();

	times.push(Number(end - start) / 1e6); // ms
}

// Sort for median
times.sort((a, b) => a - b);
const median = times[Math.floor(times.length / 2)];

// Correctness: hash the sorted messages
const msgFingerprint = crypto
	.createHash("sha256")
	.update(
		JSON.stringify(
			messages.map(m => ({
				ruleId: m.ruleId,
				line: m.line,
				column: m.column,
				severity: m.severity,
			})),
		),
	)
	.digest("hex")
	.slice(0, 12);

console.log(`METRIC: ${median.toFixed(2)}`);
console.log(`RUNS: ${RUNS}`);
console.log(`MIN: ${Math.min(...times).toFixed(2)}`);
console.log(`MAX: ${Math.max(...times).toFixed(2)}`);
console.log(`MESSAGES: ${messages.length}`);
console.log(`FINGERPRINT: ${msgFingerprint}`);
/* eslint-enable no-console -- re-enable after benchmark output */
