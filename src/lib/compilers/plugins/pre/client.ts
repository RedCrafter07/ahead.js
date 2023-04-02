import { Compiler } from 'webpack';
import getRoutes from '../../../routeGeneration/getRoutes';
import chalk from 'chalk';
import path from 'path';
import { aheadDir, root } from '../../../../paths';
import { transform } from '../../../routeGeneration/client';
import { copyFile, writeFile } from 'fs/promises';

const cwd = process.cwd();

class PreClientPlugin {
	apply(compiler: Compiler) {
		compiler.hooks.beforeCompile.tapAsync(
			'PreClientPlugin',
			async (compilation, callback) => {
				const mode = compiler.options.mode;
				const routes = await getRoutes(cwd);

				if (mode == 'production')
					console.log(
						chalk.hex('#0CCAE8').bold(`[client]`),
						chalk.hex('#4F58FF')('Generating client router...'),
					);

				await writeFile(
					path.join(
						path.join(aheadDir, 'build', 'pre', 'client'),
						'routes.tsx',
					),
					`import React from "react";\n${transform(routes)}`,
				);

				if (mode == 'production')
					console.log(
						chalk.hex('#0CCAE8').bold(`[client]`),
						chalk.hex('#4F58FF')('Writing Ahead.js files...'),
					);

				await copyFile(
					path.join(root, 'lib', 'client', 'router.tsx.txt'),
					path.join(aheadDir, 'build', 'pre', 'client', 'router.tsx'),
				);
				await copyFile(
					path.join(root, 'lib', 'client', 'index.tsx.txt'),
					path.join(aheadDir, 'build', 'pre', 'client', 'index.tsx'),
				);

				callback();
			},
		);
	}
}

export default PreClientPlugin;
