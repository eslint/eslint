"use strict";

const { defineConfig } = require("cypress");
const path = require("node:path");
const webpack = require("webpack");
const webpackPreprocessor = require("@cypress/webpack-preprocessor");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

module.exports = defineConfig({
	e2e: {
		setupNodeEvents(on) {
			on(
				"file:preprocessor",
				webpackPreprocessor({
					webpackOptions: {
						mode: "none",
						resolve: {
							alias: {
								"../../../lib/linter$": "../../../build/eslint",
							},
						},
						plugins: [
							new webpack.NormalModuleReplacementPlugin(
								/^node:/u,
								resource => {
									resource.request = resource.request.replace(
										/^node:/u,
										"",
									);
								},
							),
							new NodePolyfillPlugin(),
						],
						stats: "errors-only",
					},
				}),
			);
		},
		specPattern: path.join(
			__dirname,
			"tests",
			"lib",
			"linter",
			"linter.js",
		),
		supportFile: false,
		reporter: "progress",
		screenshotOnRunFailure: false,
	},
});
