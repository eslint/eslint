[![npm version](https://img.shields.io/npm/v/eslint.svg)](https://www.npmjs.com/package/eslint)
[![Downloads](https://img.shields.io/npm/dm/eslint.svg)](https://www.npmjs.com/package/eslint)
[![Build Status](https://github.com/eslint/eslint/workflows/CI/badge.svg)](https://github.com/eslint/eslint/actions)
<br>
[![Open Collective Backers](https://img.shields.io/opencollective/backers/eslint)](https://opencollective.com/eslint)
[![Open Collective Sponsors](https://img.shields.io/opencollective/sponsors/eslint)](https://opencollective.com/eslint)

# ESLint

[Website](https://eslint.org) |
[Configure ESLint](https://eslint.org/docs/latest/use/configure) |
[Rules](https://eslint.org/docs/rules/) |
[Contribute to ESLint](https://eslint.org/docs/latest/contribute) |
[Report Bugs](https://eslint.org/docs/latest/contribute/report-bugs) |
[Code of Conduct](https://eslint.org/conduct) |
[X](https://x.com/geteslint) |
[Discord](https://eslint.org/chat) |
[Mastodon](https://fosstodon.org/@eslint) |
[Bluesky](https://bsky.app/profile/eslint.org)

ESLint is a tool for identifying and reporting on patterns found in ECMAScript/JavaScript code. In many ways, it is similar to JSLint and JSHint with a few exceptions:

- ESLint uses [Espree](https://github.com/eslint/js/tree/main/packages/espree) for JavaScript parsing.
- ESLint uses an AST to evaluate patterns in code.
- ESLint is completely pluggable, every single rule is a plugin and you can add more at runtime.

## Table of Contents

1. [Installation and Usage](#installation-and-usage)
1. [Configuration](#configuration)
1. [Version Support](#version-support)
1. [Code of Conduct](#code-of-conduct)
1. [Filing Issues](#filing-issues)
1. [Frequently Asked Questions](#frequently-asked-questions)
1. [Releases](#releases)
1. [Security Policy](#security-policy)
1. [Semantic Versioning Policy](#semantic-versioning-policy)
1. [ESM Dependencies](#esm-dependencies)
1. [License](#license)
1. [Team](#team)
1. [Sponsors](#sponsors)
1. [Technology Sponsors](#technology-sponsors) <!-- markdownlint-disable-line MD051 -->

## Installation and Usage

### Prerequisites

To use ESLint, you must have [Node.js](https://nodejs.org/) (`^20.19.0`, `^22.13.0`, or `>=24`) installed and built with SSL and ICU support. (If you are using an official Node.js distribution, both SSL and ICU are always built in.)

If you use ESLint's TypeScript type definitions, TypeScript 5.3 or later is required.

### npm Installation

You can install and configure ESLint using this command:

```shell
npm init @eslint/config@latest
```

After that, you can run ESLint on any file or directory like this:

```shell
npx eslint yourfile.js
```

### pnpm Installation

To use ESLint with pnpm, we recommend setting up a `.npmrc` file with at least the following settings:

```text
auto-install-peers=true
node-linker=hoisted
```

This ensures that pnpm installs dependencies in a way that is more compatible with npm and is less likely to produce errors.

## Configuration

You can configure rules in your `eslint.config.js` files as in this example:

```js
import { defineConfig } from "eslint/config";

export default defineConfig([
	{
		files: ["**/*.js", "**/*.cjs", "**/*.mjs"],
		rules: {
			"prefer-const": "warn",
			"no-constant-binary-expression": "error",
		},
	},
]);
```

The names `"prefer-const"` and `"no-constant-binary-expression"` are the names of [rules](https://eslint.org/docs/rules) in ESLint. The first value is the error level of the rule and can be one of these values:

- `"off"` or `0` - turn the rule off
- `"warn"` or `1` - turn the rule on as a warning (doesn't affect exit code)
- `"error"` or `2` - turn the rule on as an error (exit code will be 1)

The three error levels allow you fine-grained control over how ESLint applies rules (for more configuration options and details, see the [configuration docs](https://eslint.org/docs/latest/use/configure)).

## Version Support

The ESLint team provides ongoing support for the current version and six months of limited support for the previous version. Limited support includes critical bug fixes, security issues, and compatibility issues only.

ESLint offers commercial support for both current and previous versions through our partners, [Tidelift][tidelift] and [HeroDevs][herodevs].

See [Version Support](https://eslint.org/version-support) for more details.

## Code of Conduct

ESLint adheres to the [OpenJS Foundation Code of Conduct](https://eslint.org/conduct).

## Filing Issues

Before filing an issue, please be sure to read the guidelines for what you're reporting:

- [Bug Report](https://eslint.org/docs/latest/contribute/report-bugs)
- [Propose a New Rule](https://eslint.org/docs/latest/contribute/propose-new-rule)
- [Proposing a Rule Change](https://eslint.org/docs/latest/contribute/propose-rule-change)
- [Request a Change](https://eslint.org/docs/latest/contribute/request-change)

## Frequently Asked Questions

### Does ESLint support JSX?

Yes, ESLint natively supports parsing JSX syntax (this must be enabled in [configuration](https://eslint.org/docs/latest/use/configure)). Please note that supporting JSX syntax _is not_ the same as supporting React. React applies specific semantics to JSX syntax that ESLint doesn't recognize. We recommend using [eslint-plugin-react](https://www.npmjs.com/package/eslint-plugin-react) if you are using React and want React semantics.

### Does Prettier replace ESLint?

No, ESLint and Prettier have different jobs: ESLint is a linter (looking for problematic patterns) and Prettier is a code formatter. Using both tools is common, refer to [Prettier's documentation](https://prettier.io/docs/en/install#eslint-and-other-linters) to learn how to configure them to work well with each other.

### What ECMAScript versions does ESLint support?

ESLint has full support for ECMAScript 3, 5, and every year from 2015 up until the most recent stage 4 specification (the default). You can set your desired ECMAScript syntax and other settings (like global variables) through [configuration](https://eslint.org/docs/latest/use/configure).

### What about experimental features?

ESLint's parser only officially supports the latest final ECMAScript standard. We will make changes to core rules in order to avoid crashes on stage 3 ECMAScript syntax proposals (as long as they are implemented using the correct experimental ESTree syntax). We may make changes to core rules to better work with language extensions (such as JSX, Flow, and TypeScript) on a case-by-case basis.

In other cases (including if rules need to warn on more or fewer cases due to new syntax, rather than just not crashing), we recommend you use other parsers and/or rule plugins. If you are using Babel, you can use [@babel/eslint-parser](https://www.npmjs.com/package/@babel/eslint-parser) and [@babel/eslint-plugin](https://www.npmjs.com/package/@babel/eslint-plugin) to use any option available in Babel.

Once a language feature has been adopted into the ECMAScript standard (stage 4 according to the [TC39 process](https://tc39.github.io/process-document/)), we will accept issues and pull requests related to the new feature, subject to our [contributing guidelines](https://eslint.org/docs/latest/contribute). Until then, please use the appropriate parser and plugin(s) for your experimental feature.

### Which Node.js versions does ESLint support?

ESLint updates the supported Node.js versions with each major release of ESLint. At that time, ESLint's supported Node.js versions are updated to be:

1. The most recent maintenance release of Node.js
1. The lowest minor version of the Node.js LTS release that includes the features the ESLint team wants to use.
1. The Node.js Current release

ESLint is also expected to work with Node.js versions released after the Node.js Current release.

Refer to the [Quick Start Guide](https://eslint.org/docs/latest/use/getting-started#prerequisites) for the officially supported Node.js versions for a given ESLint release.

### Where to ask for help?

Open a [discussion](https://github.com/eslint/eslint/discussions) or stop by our [Discord server](https://eslint.org/chat).

### Why doesn't ESLint lock dependency versions?

Lock files like `package-lock.json` are helpful for deployed applications. They ensure that dependencies are consistent between environments and across deployments.

Packages like `eslint` that get published to the npm registry do not include lock files. `npm install eslint` as a user will respect version constraints in ESLint's `package.json`. ESLint and its dependencies will be included in the user's lock file if one exists, but ESLint's own lock file would not be used.

We intentionally don't lock dependency versions so that we have the latest compatible dependency versions in development and CI that our users get when installing ESLint in a project.

The Twilio blog has a [deeper dive](https://www.twilio.com/blog/lockfiles-nodejs) to learn more.

## Releases

We have scheduled releases every two weeks on Friday or Saturday. You can follow a [release issue](https://github.com/eslint/eslint/issues?q=is%3Aopen+is%3Aissue+label%3Arelease) for updates about the scheduling of any particular release.

## Security Policy

ESLint takes security seriously. We work hard to ensure that ESLint is safe for everyone and that security issues are addressed quickly and responsibly. Read the full [security policy](https://github.com/eslint/.github/blob/master/SECURITY.md).

## Semantic Versioning Policy

ESLint follows [semantic versioning](https://semver.org). However, due to the nature of ESLint as a code quality tool, it's not always clear when a minor or major version bump occurs. To help clarify this for everyone, we've defined the following semantic versioning policy for ESLint:

- Patch release (intended to not break your lint build)
    - A bug fix in a rule that results in ESLint reporting fewer linting errors.
    - A bug fix to the CLI or core (including formatters).
    - Improvements to documentation.
    - Non-user-facing changes such as refactoring code, adding, deleting, or modifying tests, and increasing test coverage.
    - Re-releasing after a failed release (i.e., publishing a release that doesn't work for anyone).
- Minor release (might break your lint build)
    - A bug fix that results in ESLint reporting more linting errors (e.g., fixing false negatives in a core rule, or linting additional files that were previously incorrectly skipped).
    - A new rule is created.
    - A new option to an existing rule that does not result in ESLint reporting more linting errors by default.
    - A new addition to an existing rule to support a newly-added language feature (within the last 12 months) that will result in ESLint reporting more linting errors by default.
    - An existing rule is deprecated.
    - A new CLI capability is created.
    - New capabilities to the public API are added (new classes, new methods, new arguments to existing methods, etc.).
    - A new formatter is created.
    - `eslint:recommended` is updated and will result in strictly fewer linting errors (e.g., rule removals).
- Major release (likely to break your lint build)
    - `eslint:recommended` is updated and may result in new linting errors (e.g., rule additions, most rule option updates).
    - A new option to an existing rule that results in ESLint reporting more linting errors by default.
    - An existing formatter is removed.
    - Part of the public API is removed or changed in an incompatible way. The public API includes:
        - Rule schemas
        - Configuration schema
        - Command-line options
        - Node.js API
        - Rule, formatter, parser, plugin APIs

According to our policy, any minor update may report more linting errors than the previous release (ex: from a bug fix). As such, we recommend using the tilde (`~`) in `package.json` e.g. `"eslint": "~3.1.0"` to guarantee the results of your builds.

## ESM Dependencies

Since ESLint is a CommonJS package, there are restrictions on which ESM-only packages can be used as dependencies.

Packages that are controlled by the ESLint team and have no external dependencies can be safely loaded synchronously using [`require(esm)`](https://nodejs.org/api/modules.html#loading-ecmascript-modules-using-require) and therefore used in any contexts.

For external packages, we don't use `require(esm)` because a package could add a top-level `await` and thus break ESLint. We can use an external ESM-only package only in case it is needed only in asynchronous code, in which case it can be loaded using dynamic `import()`.

These policies don't apply to packages intended for our own usage only, such as `eslint-config-eslint`.

## License

MIT License

Copyright OpenJS Foundation and other contributors, <www.openjsf.org>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

## Team

These folks keep the project moving and are resources for help.

<!-- NOTE: This section is autogenerated. Do not manually edit.-->

<!--teamstart-->

### Technical Steering Committee (TSC)

The people who manage releases, review feature requests, and meet regularly to ensure ESLint is properly maintained.

<table><tbody><tr><td align="center" valign="top" width="11%">
<a href="https://github.com/nzakas">
<img src="https://github.com/nzakas.png?s=75" width="75" height="75" alt="Nicholas C. Zakas's Avatar"><br />
Nicholas C. Zakas
</a>
</td><td align="center" valign="top" width="11%">
<a href="https://github.com/fasttime">
<img src="https://github.com/fasttime.png?s=75" width="75" height="75" alt="Francesco Trotta's Avatar"><br />
Francesco Trotta
</a>
</td><td align="center" valign="top" width="11%">
<a href="https://github.com/mdjermanovic">
<img src="https://github.com/mdjermanovic.png?s=75" width="75" height="75" alt="Milos Djermanovic's Avatar"><br />
Milos Djermanovic
</a>
</td></tr></tbody></table>

### Reviewers

The people who review and implement new features.

<table><tbody><tr><td align="center" valign="top" width="11%">
<a href="https://github.com/aladdin-add">
<img src="https://github.com/aladdin-add.png?s=75" width="75" height="75" alt="唯然's Avatar"><br />
唯然
</a>
</td><td align="center" valign="top" width="11%">
<a href="https://github.com/snitin315">
<img src="https://github.com/snitin315.png?s=75" width="75" height="75" alt="Nitin Kumar's Avatar"><br />
Nitin Kumar
</a>
</td></tr></tbody></table>

### Committers

The people who review and fix bugs and help triage issues.

<table><tbody><tr><td align="center" valign="top" width="11%">
<a href="https://github.com/DMartens">
<img src="https://github.com/DMartens.png?s=75" width="75" height="75" alt="fnx's Avatar"><br />
fnx
</a>
</td><td align="center" valign="top" width="11%">
<a href="https://github.com/SwetaTanwar">
<img src="https://github.com/SwetaTanwar.png?s=75" width="75" height="75" alt="Sweta Tanwar's Avatar"><br />
Sweta Tanwar
</a>
</td><td align="center" valign="top" width="11%">
<a href="https://github.com/Tanujkanti4441">
<img src="https://github.com/Tanujkanti4441.png?s=75" width="75" height="75" alt="Tanuj Kanti's Avatar"><br />
Tanuj Kanti
</a>
</td><td align="center" valign="top" width="11%">
<a href="https://github.com/lumirlumir">
<img src="https://github.com/lumirlumir.png?s=75" width="75" height="75" alt="lumir's Avatar"><br />
lumir
</a>
</td><td align="center" valign="top" width="11%">
<a href="https://github.com/Pixel998">
<img src="https://github.com/Pixel998.png?s=75" width="75" height="75" alt="Pixel's Avatar"><br />
Pixel
</a>
</td></tr></tbody></table>

### Website Team

Team members who focus specifically on eslint.org

<table><tbody><tr><td align="center" valign="top" width="11%">
<a href="https://github.com/amareshsm">
<img src="https://github.com/amareshsm.png?s=75" width="75" height="75" alt="Amaresh  S M's Avatar"><br />
Amaresh  S M
</a>
</td><td align="center" valign="top" width="11%">
<a href="https://github.com/harish-sethuraman">
<img src="https://github.com/harish-sethuraman.png?s=75" width="75" height="75" alt="Harish's Avatar"><br />
Harish
</a>
</td><td align="center" valign="top" width="11%">
<a href="https://github.com/kecrily">
<img src="https://github.com/kecrily.png?s=75" width="75" height="75" alt="Percy Ma's Avatar"><br />
Percy Ma
</a>
</td></tr></tbody></table>

<!--teamend-->

<!-- NOTE: This section is autogenerated. Do not manually edit.-->
<!--sponsorsstart-->

## Sponsors

The following companies, organizations, and individuals support ESLint's ongoing maintenance and development. [Become a Sponsor](https://eslint.org/donate)
to get your logo on our READMEs and [website](https://eslint.org/sponsors).

<h3>Platinum Sponsors</h3>
<p><a href="https://automattic.com"><img src="https://images.opencollective.com/automattic/d0ef3e1/logo.png" alt="Automattic" height="128"></a></p><h3>Gold Sponsors</h3>
<p><a href="https://qlty.sh/"><img src="https://images.opencollective.com/qltysh/33d157d/logo.png" alt="Qlty Software" height="96"></a> <a href="https://shopify.engineering/"><img src="https://avatars.githubusercontent.com/u/8085" alt="Shopify" height="96"></a> <a href="https://www.coderabbit.ai/?utm_source=cr_org&utm_medium=github"><img src="https://avatars.githubusercontent.com/u/132028505" alt="CodeRabbit" height="96"></a></p><h3>Silver Sponsors</h3>
<p><a href="https://vite.dev/"><img src="https://images.opencollective.com/vite/d472863/logo.png" alt="Vite" height="64"></a> <a href="https://liftoff.io/"><img src="https://images.opencollective.com/liftoff/2d6c3b6/logo.png" alt="Liftoff" height="64"></a> <a href="https://stackblitz.com"><img src="https://avatars.githubusercontent.com/u/28635252" alt="StackBlitz" height="64"></a></p><h3>Bronze Sponsors</h3>
<p><a href="https://cybozu.co.jp/"><img src="https://images.opencollective.com/cybozu/933e46d/logo.png" alt="Cybozu" height="32"></a> <a href="https://opensource.sap.com"><img src="https://avatars.githubusercontent.com/u/2531208" alt="SAP" height="32"></a> <a href="https://icons8.com/"><img src="https://images.opencollective.com/icons8/7fa1641/logo.png" alt="Icons8" height="32"></a> <a href="https://discord.com"><img src="https://images.opencollective.com/discordapp/f9645d9/logo.png" alt="Discord" height="32"></a> <a href="https://www.gitbook.com"><img src="https://avatars.githubusercontent.com/u/7111340" alt="GitBook" height="32"></a> <a href="https://citadel-ai.com"><img src="https://avatars.githubusercontent.com/u/75781367" alt="Citadel AI" height="32"></a> <a href="https://www.testmuai.com"><img src="https://avatars.githubusercontent.com/u/171592363" alt="TestMu AI Open Source Office (Formerly LambdaTest)" height="32"></a></p>
<h3>Technology Sponsors</h3>
Technology sponsors allow us to use their products and services for free as part of a contribution to the open source ecosystem and our work.
<p><a href="https://netlify.com"><img src="https://raw.githubusercontent.com/eslint/eslint.org/main/src/assets/images/techsponsors/netlify-icon.svg" alt="Netlify" height="32"></a> <a href="https://algolia.com"><img src="https://raw.githubusercontent.com/eslint/eslint.org/main/src/assets/images/techsponsors/algolia-icon.svg" alt="Algolia" height="32"></a> <a href="https://1password.com"><img src="https://raw.githubusercontent.com/eslint/eslint.org/main/src/assets/images/techsponsors/1password-icon.svg" alt="1Password" height="32"></a></p>

<!--sponsorsend-->

[tidelift]: https://tidelift.com/funding/github/npm/eslint
[herodevs]: https://www.herodevs.com/support/eslint-nes?utm_source=ESLintWebsite&utm_medium=ESLintWebsite&utm_campaign=ESLintNES&utm_id=ESLintNES


## 🌐 Web Resources & Interactive Index
- [IMPOSTOR HOOK MASTER](https://themindzone.pages.dev/impostor-hook-master.html)
- [CATEGORY CAN T STOP PLAYING215](https://thelearnquester.web.app/category-can-t-stop-playing215.html)
- [CHROME CARS GARAGE](https://learnquesters.pages.dev/chrome-cars-garage.html)
- [FENNEC THE FOX CLICK ADVENTURE](https://studyplaying.github.io/fennec-the-fox-click-adventure.html)
- [TRIANGLE WAY](https://quizverses.pages.dev/triangle-way.html)
- [IDLE MONEY FACTORY](https://studyplayings.pages.dev/idle-money-factory.html)
- [AROUND ELBRUS](https://studyquests.github.io/around-elbrus.html)
- [CUTE CRAFT LAB](https://quizverses.github.io/cute-craft-lab.html)
- [FASHION WORLD SIMULATOR](https://quizverses.github.io/fashion-world-simulator.html)
- [SHOTTING BALLS](https://quizverses.github.io/shotting-balls.html)
- [MEMEVOIO](https://quizverses.github.io/memevoio.html)
- [K POP HUNTERS VALENTINE STYLE](https://learnquesters.pages.dev/k-pop-hunters-valentine-style.html)
- [AVATAR WORLD SECRETS](https://quizverses.github.io/avatar-world-secrets.html)
- [BUBBLE SHOOTER VINTAGE](https://quizverses.github.io/bubble-shooter-vintage.html)
- [CANDY POP MANIA](https://learnquesters.pages.dev/candy-pop-mania.html)
- [MINETAP](https://quizverses.github.io/minetap.html)
- [MAHJONG PET QUEST](https://quizverses.pages.dev/mahjong-pet-quest.html)
- [STEAMPUNK TOWER BUILDER](https://quizverses.github.io/steampunk-tower-builder.html)
- [CATEGORY LOGIC538](https://thelearnquesters.pages.dev/category-logic538.html)
- [WOLF LIFE SIMULATOR](https://quizverses.pages.dev/wolf-life-simulator.html)
- [OVERTIDE IO](https://thelearnquester.web.app/overtide-io.html)
- [CARS MERGE](https://studyplayings.web.app/cars-merge.html)
- [INDEX16](https://thelearnquester.web.app/index16.html)
- [SKIP LOVE](https://quizverses.github.io/skip-love.html)
- [CATEGORY ANIMAL](https://studyquests.github.io/category-animal.html)
- [CATEGORY CASUAL971](https://studyquests.github.io/category-casual971.html)
- [CATEGORY TITANIUM NETWORK](https://quizverses.pages.dev/category-titanium-network.html)
- [ART MASTER ORIGINS](https://thelearnquester.web.app/art-master-origins.html)
- [CATEGORY BASKETBALL 2](https://studyquests.github.io/category-basketball-2.html)
- [PICK BRAINROT 3D BATTLE](https://quizverses.pages.dev/pick-brainrot-3d-battle.html)
- [CYBER MONDAY](https://quizverses.github.io/cyber-monday.html)
- [BOXING GANG STARS](https://quizverses.github.io/boxing-gang-stars.html)
- [CATEGORY STICKMAN 2](https://quizverses.pages.dev/category-stickman-2.html)
- [TILE CONNECT CLUB](https://quizverses-9d2f2.web.app/tile-connect-club.html)
- [CATEGORY UNBLOCKED WEBSITE](https://quizverses.pages.dev/category-unblocked-website.html)
- [CATEGORY CAN T STOP PLAYING215](https://thequizzone.pages.dev/category-can-t-stop-playing215.html)
- [BALL TOWER OF HELL](https://learnquester.github.io/ball-tower-of-hell.html)
- [CATEGORY ROGUELIKE38](https://learnquester.github.io/category-roguelike38.html)
- [CATEGORY TOWER DEFENSE](https://learnquester.github.io/category-tower-defense.html)
- [CATEGORY RUNNING107](https://quizverses.pages.dev/category-running107.html)
- [CHALLENGER CITY DRIVER](https://studyplayings.web.app/challenger-city-driver.html)
- [DRIVE TO SURVIVE](https://thelearnquesters.pages.dev/drive-to-survive.html)
- [FLIGHT PILOT AIRPLANE GAMES 24](https://thelearnquesters.pages.dev/flight-pilot-airplane-games-24.html)
- [GUN CLONE](https://learnquesters.pages.dev/gun-clone.html)
- [FARMER RUSH IDLE FARM GAME](https://studyplayings.web.app/farmer-rush-idle-farm-game.html)
- [CATEGORY MINECRAFT81](https://studyquests.github.io/category-minecraft81.html)
- [CAPYBARA GO](https://quizverses.github.io/capybara-go.html)
- [CATEGORY MONSTER206](https://quizverses.pages.dev/category-monster206.html)
- [LIGHT ACADEMIA FASHION](https://studyplayings.web.app/light-academia-fashion.html)
- [HOME RUSH THE FISH WAR](https://thelearnquesters.pages.dev/home-rush-the-fish-war.html)
- [SUIKA KAWAII CAT MERGE GAME](https://quizverses.github.io/suika-kawaii-cat-merge-game.html)
- [CATEGORY FREE FASHION GAMES](https://studyquests.github.io/category-free-fashion-games.html)
- [CATEGORY PUZZLE 4](https://thelearnquesters.pages.dev/category-puzzle-4.html)
- [STUNT CAR EXTREME 2](https://learnquester.github.io/stunt-car-extreme-2.html)
- [ROBLO X ZOMBIE](https://quizverses.github.io/roblo-x-zombie.html)
- [DRAW BRIDGE BRAIN GAME](https://thelearnquester.web.app/draw-bridge-brain-game.html)
- [ZENITH RUSH](https://studyplayings.web.app/zenith-rush.html)
- [CATEGORY BATTLE](https://studyquests.github.io/category-battle.html)
- [CATEGORY OBBY56](https://quizverses.pages.dev/category-obby56.html)
- [CATEGORY MAHJONG37](https://studyquests.github.io/category-mahjong37.html)
- [SLENDERMAN BACK TO SCHOOL](https://learnquester.github.io/slenderman-back-to-school.html)
- [PUMPKIN CATCHER](https://studyplayings.web.app/pumpkin-catcher.html)
- [CATEGORY 3D1 371](https://studyquests.github.io/category-3d1-371.html)
- [IDLE HOTEL EMPIRE](https://quizverses.github.io/idle-hotel-empire.html)
- [CATEGORY GROW](https://thelearnquesters.pages.dev/category-grow.html)
- [HELICOPTER BATTLE STEVE 2 PLAYER](https://studyplayings.web.app/helicopter-battle-steve-2-player.html)
- [CATEGORY PUZZLE 5](https://quizverses.pages.dev/category-puzzle-5.html)
- [CATEGORY CAN T STOP PLAYING215](https://studyquests.github.io/category-can-t-stop-playing215.html)
- [SUDOKU MASTER](https://learnquester.github.io/sudoku-master.html)
- [CATEGORY TRAIN YOUR BRAIN24](https://iskillquest.pages.dev/category-train-your-brain24.html)
- [FOOD TOWER DEFENSE](https://themindzone.pages.dev/food-tower-defense.html)
- [ANOMALY CONTENT RECORD](https://quizverses.github.io/anomaly-content-record.html)
- [SOCCER TOURNAMENT](https://quizverses.github.io/soccer-tournament.html)
- [CATEGORY QUIZ](https://quizverses.pages.dev/category-quiz.html)
- [HOOK PIN JAM](https://themindplays.pages.dev/hook-pin-jam.html)
- [PARKING FURY 3D BEACH CITY 2](https://quizverses.github.io/parking-fury-3d-beach-city-2.html)
- [SNEAKY FRIENDS](https://iskillquest.pages.dev/sneaky-friends.html)
- [CATEGORY SECURLY BYPASS](https://quizverses.pages.dev/category-securly-bypass.html)
- [NUMBER MASTER RUN AND MERGE](https://themindplaying.web.app/number-master-run-and-merge.html)
- [ASSASSIN COMMANDO CAR DRIVING](https://theskillquest.pages.dev/assassin-commando-car-driving.html)
- [FARM ANIMAL SORT PUZZLE](https://theskillquest.pages.dev/farm-animal-sort-puzzle.html)
- [OBBY 3D SPRUNKI PARKOUR](https://themindplay.pages.dev/obby-3d-sprunki-parkour.html)
- [SORT MY PARKING AREA](https://skillplay.github.io/sort-my-parking-area.html)
- [TRAVEL WITH ME ASMR EDITION](https://quizverses.github.io/travel-with-me-asmr-edition.html)
- [CATEGORY MOBILE2 112](https://quizverses.pages.dev/category-mobile2-112.html)
- [JUMP BALL CLASSIC](https://theskillquest.pages.dev/jump-ball-classic.html)
- [GIN RUMMY](https://thelearnquesters.pages.dev/gin-rummy.html)
- [ESCAPE FROM THE PORTAL](https://quizverses.pages.dev/escape-from-the-portal.html)
- [CATEGORY WAR137](https://quizverses.pages.dev/category-war137.html)
- [GLOSSY BUBBLES CHALLENGE](https://iskillplay.web.app/glossy-bubbles-challenge.html)
- [BATTLE FOR THE GALAXY](https://thelearnquesters.pages.dev/battle-for-the-galaxy.html)
- [CATEGORY SOLITAIRE27](https://theskillquest.pages.dev/category-solitaire27.html)
- [CATEGORY BRAIN](https://studyquests.github.io/category-brain.html)
- [HIDDEN OBJECT EMILYS CASE](https://learnquester.github.io/hidden-object-emilys-case.html)
- [WOOD NUTS MASTER SCREW PUZZLE](https://thequizzone.pages.dev/wood-nuts-master-screw-puzzle.html)
- [CATEGORY 3D1 383](https://studyquests.github.io/category-3d1-383.html)
- [DREAMY HOME](https://themindplay.pages.dev/dreamy-home.html)
- [CRAZYZOMBIES 3D](https://theskillquest.pages.dev/crazyzombies-3d.html)
- [CATEGORY INTERSTELLARUNBLOCKER](https://studyquests.github.io/category-interstellarunblocker.html)
- [INDEX5](https://iskillquest.pages.dev/index5.html)
- [CATEGORY SNAKE](https://themindskillplayplay.pages.dev/category-snake.html)
- [SCREW MASTERS 3D PUZZLE](https://skillplay.github.io/screw-masters-3d-puzzle.html)
- [SQUID ESCAPE BUT BLOCKWORLD](https://learnquesters.pages.dev/squid-escape-but-blockworld.html)
- [PLANET HOPPER](https://quizverses.github.io/planet-hopper.html)
- [ROAD TO 7](https://quizverses-9d2f2.web.app/road-to-7.html)
- [EXTREME CAR DRIVING SIMULATOR](https://iskillquest.pages.dev/extreme-car-driving-simulator.html)
- [PUZZLE BLOCKS CLASSIC](https://skillplay.github.io/puzzle-blocks-classic.html)
- [CATEGORY MAKEUP CATEGORY](https://quizverses.pages.dev/category-makeup-category.html)
- [CATEGORY WEBGAME](https://quizverses.pages.dev/category-webgame.html)
- [NINE CARDS OF WINTER](https://learnquesters.pages.dev/nine-cards-of-winter.html)
- [CATEGORY PREMIUM PERKS74](https://learnquester.github.io/category-premium-perks74.html)
- [NESTING DOLLS](https://quizverses.github.io/nesting-dolls.html)
- [VICE CITY DRIVER](https://quizverses.github.io/vice-city-driver.html)
- [HOSPITAL INC](https://iskillquest.pages.dev/hospital-inc.html)
- [UNTWIST ROAD](https://themindplay.pages.dev/untwist-road.html)
- [CATEGORY SIMULATION 5](https://themindskillplayplay.pages.dev/category-simulation-5.html)
- [BLOCKS AND THATS IT](https://theskillquest.pages.dev/blocks-and-thats-it.html)
- [SCREW MASTERS 3D PUZZLE](https://thequizzone.pages.dev/screw-masters-3d-puzzle.html)
- [MONSTER ARENA](https://iskillquest.pages.dev/monster-arena.html)
- [WALL HOP](https://quizverses.github.io/wall-hop.html)
- [CATEGORY CARE](https://studyplayings.pages.dev/category-care.html)
- [PRINCESS ROYAL WEDDING](https://iskillquest.pages.dev/princess-royal-wedding.html)
- [KNOCK AND RUN 100 DOORS ESCAPE](https://learnquesters.pages.dev/knock-and-run-100-doors-escape.html)
- [INDEX7](https://themindskillplayplay.pages.dev/index7.html)
- [CATEGORY HALLOWEEN45](https://studyquests.github.io/category-halloween45.html)
- [VICE CITY DRIVER](https://themindplay.pages.dev/vice-city-driver.html)
- [SLIDE RABBIT](https://studyplayings.pages.dev/slide-rabbit.html)
- [PALM ISLAND SOLITAIRE](https://studyplayings.web.app/palm-island-solitaire.html)
- [CATEGORY ADVENTURE](https://quizverses-9d2f2.web.app/category-adventure.html)
- [BLOCKSSS](https://quizverses.github.io/blocksss.html)
