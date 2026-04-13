# Evaluation

This is the evaluation setup. It tells agents and reviewers how to set up, run experiments, and measure results. Both experimenters and reviewers follow the same instructions.

This file is the trust boundary. The evaluation code it references is outside the editable surface. Agents cannot change how they are judged.

The maintainer writes this file. It rarely changes.

## Setup

One-time setup from the repository root:

```bash
npm install
```

Verify the benchmark runs correctly:

```bash
node .polyresearch/bench.js
```

You should see output with a `METRIC:` line showing a number around 170-180.

## Running an experiment

From the worktree root (which contains your modified `lib/` files):

```bash
node .polyresearch/bench.js > run.log 2>&1
```

The benchmark:

1. Loads `tests/bench/large.js` (19 500 lines of JavaScript).
2. Creates a `Linter` instance and configures it with `@eslint/js` recommended rules.
3. Runs 3 warmup iterations (discarded).
4. Runs 10 timed iterations and reports the **median** time in milliseconds.
5. Computes a fingerprint of the lint messages to verify correctness.

## Output format

A successful run prints exactly this structure:

```
METRIC: 175.43
RUNS: 10
MIN: 165.77
MAX: 223.70
MESSAGES: 63
FINGERPRINT: 4944605e99e3
```

- `METRIC` is the median lint time in milliseconds. This is the primary metric.
- `MESSAGES` is the count of lint violations. Must remain 63.
- `FINGERPRINT` is a SHA-256 prefix of the serialized message array. Must remain `4944605e99e3`.

If `MESSAGES` or `FINGERPRINT` changes, the experiment broke correctness and must be rejected regardless of any speed improvement.

## Parsing the metric

```bash
grep '^METRIC:' run.log | awk '{print $2}'
```

This produces a single number on stdout: the median lint time in milliseconds.

## Ground truth

The metric is the median wall-clock time of `Linter.verify()` over 10 runs on a fixed 19 500-line JavaScript file with a fixed set of 57 recommended rules. The evaluation function lives in `.polyresearch/bench.js` and is outside the editable surface. It uses `process.hrtime.bigint()` for nanosecond-resolution timing.

Correctness is enforced by fingerprinting the lint output. The fingerprint is a truncated SHA-256 hash of the sorted `(ruleId, line, column, severity)` tuples from every reported message. Any change to which rules fire, where they fire, or at what severity will change the fingerprint.

The evaluation cannot be gamed by modifying the benchmark, the test file, or the recommended config -- all are outside the editable surface.

## Environment

- **Runtime:** Node.js (the version in the project's CI matrix; currently v22+).
- **Hardware:** Results are relative. The benchmark uses median of 10 runs to reduce noise. Improvements of less than 10 ms may be within measurement variance and will not be accepted.
- **Expected wall time:** A full benchmark run (3 warmup + 10 timed) takes approximately 2-3 minutes.
- **Kill threshold:** If a run exceeds 6 minutes, kill it and record as `crashed`.
