# OSS-Fuzz harnesses

Coverage-guided fuzz targets that drive ESLint's public API through
[Jazzer.js](https://github.com/CodeIntelligenceTesting/jazzer.js). Used by
[OSS-Fuzz](https://google.github.io/oss-fuzz/) to fuzz the `master` branch
continuously and complementary to the property-based fuzzer in
`tools/eslint-fuzzer.js`.

## Targets

| File                     | Surface                                                                                                                |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------- |
| `fuzz_linter.js`         | `Linter.verify` across varied ECMA versions, source types, parser feature flags, and a randomised subset of core rules |
| `fuzz_verify_and_fix.js` | `Linter.verifyAndFix`, restricted to fixable rules to exercise the autofix loop and overlapping-fix path               |
| `fuzz_source_code.js`    | Post-parse `SourceCode` helpers: tokens, comments, `getLocFromIndex`, `getScope`, `getAncestors`                       |

Each target consumes the fuzzer's byte stream via Jazzer.js's
`FuzzedDataProvider` to derive its config and source-code inputs, then calls
into the linter and lets uncaught exceptions surface as fuzzer findings.
Errors that come from the fuzzer-generated configuration (rather than the
source code under test) are filtered out so they don't drown out real bugs.

## Running locally

From the repository root:

```bash
# Install Jazzer.js (pinned for parity with the OSS-Fuzz base image).
npm install --no-save @jazzer.js/core@2.1.0

# Run any of the three targets. -runs limits the iteration count.
npx jazzer tools/oss-fuzz/fuzz_linter -- -runs=10000
npx jazzer tools/oss-fuzz/fuzz_verify_and_fix -- -runs=10000
npx jazzer tools/oss-fuzz/fuzz_source_code -- -runs=10000
```

Use `--sync` if you want synchronous mode (matches how OSS-Fuzz invokes the
targets), and pass a corpus directory after the target name to seed and
persist inputs:

```bash
mkdir -p corpus/fuzz_linter
npx jazzer tools/oss-fuzz/fuzz_linter corpus/fuzz_linter --sync -- -runs=100000
```

## Why Jazzer.js 2.1.0

The prebuilt native fuzzer binary in Jazzer.js 4.x requires GLIBC 2.32, which
is newer than what the OSS-Fuzz base-runner image (Ubuntu 20.04) provides.
Pinning to 2.1.0 keeps local runs and the OSS-Fuzz build using the same
version.

## Reporting

Crashes and uncaught exceptions found by the OSS-Fuzz infrastructure are
disclosed privately to the project's primary contact under a 90-day embargo
before going public. The OSS-Fuzz project configuration lives at
[`projects/eslint`](https://github.com/google/oss-fuzz/tree/master/projects/eslint)
in the OSS-Fuzz repository.
