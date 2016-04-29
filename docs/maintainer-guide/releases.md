# Managing Releases

Releases are when a project formally publishes a new version so the community can use it. There are two types of releases:

* Regular releases that follow [semantic versioning](http://semver.org/) and are considered production-ready.
* Prereleases that are not considered production-ready and are intended to give the community a preview of upcoming changes.

## Setting up a Release Environment

In order to run a release, be sure that:

1. You have [eslint.github.io](https://github.com/eslint/eslint.github.io) checked out into the same directory as the project (such as ESLint itself). Some projects automatically update the website.
1. You are logged in to npm. If not, [log in](https://docs.npmjs.com/cli/adduser).

## Building a New Release

There are two types of releases: regular and prerelease.

### Regular Releases

You can run a regular release with the following command:

```
$ npm run release
```

The [release tool](https://github.com/eslint/eslint-release) will inspect the commit history and determine the correct next version. It will also handle publishing to both GitHub and npm with the correct names and tags.

### Prereleases

You can create a prerelease version, either an alpha or a beta, by running the appropriate command:

```
$ npm run alpharelease
$ npm run betarelease
```

As with regular releases, the release tool will handle the common parts of the release process. The biggest differences are that it will use the version you specify instead of calculating one and it will push to npm using the `next` tag instead of `latest`.

### After Running the Release Command

There are some steps to complete after running the release command:

1. Update the release details on GitHub (https://github.com/eslint/eslint/releases)
1. For releases that aren't patches, update the release blog post to highlight important changes in the release.
