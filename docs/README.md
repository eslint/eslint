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
npm run build:docs:update-links
```

To lint JS files, run this from the root folder (not the `docs` folder):

```shell
npm run lint:docs:js
```

To autofix JS files, run this from the root folder (not the `docs` folder):

```shell
npm run lint:fix:docs:js
```

## License

© OpenJS Foundation and ESLint contributors, [www.openjsf.org](https://www.openjsf.org/). Content licensed under [MIT License](https://github.com/eslint/eslint/blob/main/LICENSE).
