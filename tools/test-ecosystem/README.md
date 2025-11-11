# Ecosystem Tests

These tests run notable community plugins against the local ESLint repository.
They're meant to validate that current changes to ESLint won't break downstream consumers.

To build and test all plugins:

```shell
npm run test:ecosystem
```

To run on just one plugin:

```shell
npm run test:ecosystem -- --plugin <plugin-name>
```

Plugins are stored in `plugins-data.json`.
Plugin names are keys from that file.
For example, to test against `@eslint/css`:

```shell
npm run test:ecosystem -- --plugin @eslint/css
```
