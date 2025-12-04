# ESLint Documentation

## Install Dependencies

Install all required dependencies for the documentation site by running the following command inside the `docs` folder:

```shell
npm install
```

## Run Locally

To start the documentation site locally, run the following command inside the docs folder:

```shell
npm start
```

After the build completes, the documentation will be available at
<http://localhost:2023>.

## Scripts

To update the links data file, run the following command from the project root (not the docs folder):

```shell
npm run build:docs:update-links
```

To lint the documentation’s JavaScript files, run the following command from the project root (not the docs folder):

```shell
npm run lint:docs:js
```

To auto-fix JavaScript files, run the following command from the project root (not the docs folder):

```shell
npm run lint:fix:docs:js
```

## License

© OpenJS Foundation and ESLint contributors, [www.openjsf.org](https://www.openjsf.org/). Content licensed under the [MIT License](https://github.com/eslint/eslint/blob/main/LICENSE).
