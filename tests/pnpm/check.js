import fs from "node:fs";

const nodeModulesURL = new URL("../../node_modules", import.meta.url);

if (fs.existsSync(nodeModulesURL)) {
	// eslint-disable-next-line no-console -- Used for interactive output.
	console.error("Delete node_modules to run the pnpm type support test.");
	process.exitCode = 1;
}
