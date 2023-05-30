# ESLint Documentation

## Install Dependencies

Install the necessary dependencies for the documentation site by running this
from the `docs` folder:

```shell
npm install
```

## Run Locally

Run this from the `docs` folder:

```shell
npm start
```

Once the script finishes building the documentation site, you can visit it at
<http://localhost:2023>.

## Scripts

To update the links data file, run this from the root folder (not the `docs` folder):

```shell
npm run docs:update-links
```

To lint JS files, run this from the root folder (not the `docs` folder):

```shell
npm run lint:docsjs
```

To autofix JS files, run this from the root folder (not the `docs` folder):

```shell
npm run fix:docsjs
```
