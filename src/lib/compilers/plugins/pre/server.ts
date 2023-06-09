import { Compiler } from 'webpack';
import getRoutes from '../../../routeGeneration/getRoutes';
import { copyFile, writeFile } from 'fs/promises';
import path from 'path';
import { transform } from '../../../routeGeneration/client';
import { aheadDir, root } from '../../../../paths';
import generateServerRoutes from '../../../routeGeneration/server';
import chalk from 'chalk';
import generatePreload from '../../../handlers/preload';

const cwd = process.cwd();

class PreServerPlugin {
	apply(compiler: Compiler) {
		compiler.hooks.beforeCompile.tapAsync(
			'PreServerPlugin',
			async (_compilation, callback) => {
				const mode = compiler.options.mode;
				const routes = await getRoutes(cwd);

				console.log(
					chalk.hex('#009BFF').bold(`[server]`),
					chalk.hex('#4F58FF')('Generating server router...'),
				);

				await writeFile(
					path.join(path.join(aheadDir, 'build', 'pre', 'server'), '.ssr.tsx'),
					`import React from "react";\n${transform(routes, false)}`,
				);

				console.log(
					chalk.hex('#009BFF').bold(`[server]`),
					chalk.hex('#4F58FF')('Writing SSR handler...'),
				);

				await copyFile(
					path.join(root, 'lib', 'server', 'ssrHandler.tsx.txt'),
					path.join(aheadDir, 'build', 'pre', 'server', 'ssrHandler.tsx'),
				);

				console.log(
					chalk.hex('#009BFF').bold(`[server]`),
					chalk.hex('#9050EB')('Generating preload...'),
				);

				await writeFile(
					path.join(aheadDir, 'build', 'pre', 'server', 'preload.ts'),
					await generatePreload(),
				);

				console.log(
					chalk.hex('#009BFF').bold(`[server]`),
					chalk.hex('#AF5CFE')('Generating routes for the server...'),
				);

				await writeFile(
					path.join(aheadDir, 'build', 'pre', 'server', 'index.tsx'),
					await generateServerRoutes(routes, mode),
				);

				console.log(
					chalk.hex('#009BFF').bold(`[server]`),
					chalk.gray('Pre-Compilation finished!'),
				);

				callback();
			},
		);
	}
}

export default PreServerPlugin;
