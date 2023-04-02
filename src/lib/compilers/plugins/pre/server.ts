import { Compiler } from 'webpack';
import getRoutes from '../../../routeGeneration/getRoutes';
import { copyFile, writeFile } from 'fs/promises';
import path from 'path';
import { transform } from '../../../routeGeneration/client';
import { aheadDir, root } from '../../../../paths';
import generateServerRoutes from '../../../routeGeneration/server';
import chalk from 'chalk';

const cwd = process.cwd();

class PreServerPlugin {
	apply(compiler: Compiler) {
		compiler.hooks.beforeCompile.tapAsync(
			'PreServerPlugin',
			async (compilation, callback) => {
				const mode = compiler.options.mode;
				const routes = await getRoutes(cwd);

				if (mode == 'production')
					console.log(
						chalk.hex('#009BFF').bold(`[server]`),
						chalk.hex('#4F58FF')('Generating server router...'),
					);

				await writeFile(
					path.join(path.join(aheadDir, 'build', 'pre', 'server'), '.ssr.tsx'),
					`import React from "react";\n${transform(routes, false)}`,
				);

				if (mode == 'production')
					console.log(
						chalk.hex('#009BFF').bold(`[server]`),
						chalk.hex('#4F58FF')('Writing Ahead.js files...'),
					);

				await copyFile(
					path.join(root, 'lib', 'server', 'ssrHandler.tsx.txt'),
					path.join(aheadDir, 'build', 'pre', 'server', 'ssrHandler.tsx'),
				);

				await writeFile(
					path.join(aheadDir, 'build', 'pre', 'server', 'index.tsx'),
					generateServerRoutes(routes),
				);

				if (mode == 'production')
					console.log(
						chalk.hex('#009BFF').bold(`[server]`),
						chalk.hex('#AF5CFE')('Generating routes for the server...'),
					);

				await writeFile(
					path.join(aheadDir, 'build', 'pre', 'server', 'index.tsx'),
					generateServerRoutes(routes),
				);

				callback();
			},
		);
	}
}

export default PreServerPlugin;
