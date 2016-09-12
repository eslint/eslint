# Managing Releases

Releases are when a project formally publishes a new version so the community can use it. There are two types of releases:

* Regular releases that follow [semantic versioning](http://semver.org/) and are considered production-ready.
* Prereleases that are not considered production-ready and are intended to give the community a preview of upcoming changes.

## Release Team

A two-person release team is assigned to each scheduled release. This two-person team is responsible for:

1. The scheduled release on Friday
1. Monitoring issues over the weekend
1. Determining if a patch release is necessary on Monday
1. Publishing the patch release (if necessary)

The two-person team should seek input from the whole team on the Monday following a release to double-check if a patch release is necessary.

## Process

On the day of a scheduled release, the release team should follow these steps:

1. Review open pull requests to see if any should be merged. In general, you can merge pull requests that:
    * Have been open at least two days and have been reviewed (these are just waiting for merge).
    * Important pull requests (as determined by the team). You should stop and have people review before merging if they haven't been already.
    * Documentation changes.
    * Small bug fixes written by a team member.
1. Log into Jenkins and schedule a build for the "ESLint Release" job.
1. Wait for the "ESLint Release" job to complete.
1. Update the release blog post with a "Highlights", including new rules and anything else that's important.
1. Make release announcement in the chatroom.
1. Make release announcement on Twitter.
1. Remind the team not to merge anything other than documentation changes and bug fixes.

On the Monday following the scheduled release, the release team needs to determine if a patch release is necessary. A patch release is considered necessary if any of the following occurred since the scheduled release:

* A regression bug is causing people's lint builds to fail when it previously passed.
* Any bug that is causing a lot of problems for users (frequently happens due to new functionality).

The patch release decision should be made as early on Monday as possible. If a patch release is necessary, then follow the same steps as the scheduled release process.

After the patch release has been published (or no patch release is necessary), inform the team that they can start merging in changes again.

## Emergency Releases

In general, we try not to do emergency releases (an emergency release is unplanned and isn't the regularly scheduled release or the anticipated patch release). Even if there is a regression, it's best to wait the weekend to see if any other problems arise so a patch release can fix as many issues as possible.

The only real exception is if ESLint is completely unusable by most of the current users. For instance, we once pushed a release that errored for everyone because it was missing some core files. In that case, an emergency release is appropriate.
