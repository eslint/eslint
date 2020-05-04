# npm two-factor authentication

The `eslint` npm account has two-factor authentication (2FA) enabled. The 2FA secret is distributed using a team on [Keybase](https://keybase.io). Anyone doing a release of a package from the Jenkins server needs to have access to the 2FA secret.

If you're on ESLint's TSC, you should perform the following steps to obtain the 2FA secret:

1. Download the [Keybase app](https://keybase.io/download) on a smartphone.
1. Open the app and create an account.
1. From the app, link your Keybase username with your GitHub username. (At the time of writing, the UI for this is to tap the face icon in the bottom-left of the app, then the profile picture in the top-right, then tap "Prove your GitHub" and follow the instructions.)
1. Mention your Keybase username in the team chatroom, and wait for someone to add you to the Keybase team.
1. Download an authenticator app like [Google Authenticator](https://support.google.com/accounts/answer/1066447) or [Authy](https://authy.com/), if you don't have one installed already.
1. In the Keybase app, navigate to the Keybase filesystem (at the time of writing, the UI for this is to tap the hamburger icon in the bottom-right, then tap "Files") and then navigate to `/team/eslint/auth`.
    * If your authenticator app is downloaded on the same device as your Keybase app (this will usually be the case if you're using the Keybase mobile app), then open `npm_2fa_code.txt` and copy the contents to the clipboard. Open your authenticator app, and paste the contents as a new key (by selecting something like "Enter a provided key" or "Enter key manually").
    * If your authenticator app is downloaded on a *different* device from your Keybase app (e.g. if you're using a Keybase desktop app), then open `npm_2fa_code.png` and scan it as a QR code from your authenticator app.

You should now be able to generate 6-digit 2FA codes for the `eslint` npm account using your authenticator app.
