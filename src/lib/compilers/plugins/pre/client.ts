import { Compiler } from 'webpack';
import getRoutes from '../../../routeGeneration/getRoutes';
import chalk from 'chalk';
import path from 'path';
import { aheadDir, root } from '../../../../paths';
import { transformClient as transform } from '../../../routeGeneration/client';
import { copyFile, readFile, writeFile } from 'fs/promises';
import { existsSync } from 'fs';

const cwd = process.cwd();

class PreClientPlugin {
	apply(compiler: Compiler) {
		compiler.hooks.beforeCompile.tapAsync(
			'PreClientPlugin',
			async (_compilation, callback) => {
				const routes = await getRoutes(cwd);
				const mode = compiler.options.mode;

				console.log(
					chalk.hex('#0CCAE8').bold(`[client]`),
					chalk.hex('#4F58FF')('Generating client router...'),
				);

				await writeFile(
					path.join(
						path.join(aheadDir, 'build', 'pre', 'client'),
						'routes.tsx',
					),
					`import React from "react";\nimport {Route} from "react-router-dom";\n\n${transform(
						routes,
					)}`,
				);

				console.log(
					chalk.hex('#0CCAE8').bold(`[client]`),
					chalk.hex('#4F58FF')('Writing Ahead.js files...'),
				);

				await copyFile(
					path.join(root, 'lib', 'client', 'router.tsx.txt'),
					path.join(aheadDir, 'build', 'pre', 'client', 'router.tsx'),
				);

				await writeFile(
					path.join(aheadDir, 'build', 'pre', 'client', 'index.tsx'),
					(
						await readFile(
							path.join(root, 'lib', 'client', 'index.tsx.txt'),
							'utf-8',
						)
					).replace('AHEAD_ENV', `"${mode!}"`),
				);

				console.log(
					chalk.hex('#0CCAE8').bold(`[client]`),
					chalk.gray('Pre-Compilation finished!'),
				);

				callback();
			},
		);
	}
}

export default PreClientPlugin;
