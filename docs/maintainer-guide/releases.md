# Managing Releases

Releases are when a project formally publishes a new version so the community can use it. There are two types of releases:

* Regular releases that follow [semantic versioning](https://semver.org/) and are considered production-ready.
* Prereleases that are not considered production-ready and are intended to give the community a preview of upcoming changes.

## Release Team

A two-person release team is assigned to each scheduled release. This two-person team is responsible for:

1. The scheduled release on Friday
1. Monitoring issues over the weekend
1. Determining if a patch release is necessary on Monday
1. Publishing the patch release (if necessary)

The two-person team should seek input from the whole team on the Monday following a release to double-check if a patch release is necessary.

At least one member of the release team needs to have access to [eslint's two-factor authentication for npm](./npm-2fa) in order to do a release.

## Release Communication

Each scheduled release should be associated with a release issue ([example](https://github.com/eslint/eslint/issues/8138)). The release issue is the source of information for the team about the status of a release. Be sure the release issue has the "release" label so that it's easy to find.

## Process

On the day of a scheduled release, the release team should follow these steps:

1. Review open pull requests to see if any should be merged. In general, you can merge pull requests that:
    * Have been open at least two days and have been reviewed (these are just waiting for merge).
    * Important pull requests (as determined by the team). You should stop and have people review before merging if they haven't been already.
    * Documentation changes.
    * Small bugfixes written by a team member.
1. Log into Jenkins and schedule a build for the "ESLint Release" job.
1. Watch the console output of the build on Jenkins. At some point, the build will pause and a link will be produced with an input field for a six-digit 2FA code.
1. Enter the current six-digit 2FA code from your authenticator app. (Also see: [npm-2fa](./npm-2fa))
1. Continue the build and wait for it to finish.
1. Update the release blog post with a "Highlights" section, including new rules and anything else that's important.
1. Make a release announcement in the public chatroom.
1. Make a release announcement on Twitter.
1. Make a release announcement on the release issue. Document any problems that occurred during the release, and remind the team not to merge anything other than documentation changes and bugfixes. Leave the release issue open.
1. Add the `patch release pending` label to the release issue. (When this label is present, `eslint-github-bot` will create a pending status check on non-semver-patch pull requests, to ensure that they aren't accidentally merged while a patch release is pending.)

On the Monday following the scheduled release, the release team needs to determine if a patch release is necessary. A patch release is considered necessary if any of the following occurred since the scheduled release:

* A regression bug is causing people's lint builds to fail when it previously passed.
* Any bug that is causing a lot of problems for users (frequently happens due to new functionality).

The patch release decision should be made as early on Monday as possible. If a patch release is necessary, then follow the same steps as the scheduled release process.

In rare cases, a second patch release might be necessary if the release is known to have a severe regression that hasn't been fixed by Monday. If this occurs, the release team should announce the situation on the release issue, and leave the issue open until all patch releases are complete. However, it's usually better to fix bugs for the next release cycle rather than doing a second patch release.

After the patch release has been published (or no patch release is necessary), close the release issue and inform the team that they can start merging in semver-minor changes again.

## Emergency Releases

In general, we try not to do emergency releases (an emergency release is unplanned and isn't the regularly scheduled release or the anticipated patch release). Even if there is a regression, it's best to wait the weekend to see if any other problems arise so a patch release can fix as many issues as possible.

The only real exception is if ESLint is completely unusable by most of the current users. For instance, we once pushed a release that errored for everyone because it was missing some core files. In that case, an emergency release is appropriate.
