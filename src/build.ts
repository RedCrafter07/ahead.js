import { copyFile, writeFile } from 'fs/promises';
import path from 'path';
import compileClient from './lib/compilers/client';
import { transform } from './lib/routeGeneration/client';
import getRoutes from './lib/routeGeneration/getRoutes';
import generateServerRoutes from './lib/routeGeneration/server';
import compileServer from './lib/compilers/server';
import chalk from 'chalk';
import { checkDirs } from './lib/init';
import { Configuration } from 'webpack';
import { root } from './paths';

const cwd = process.cwd();
export const aheadDir = path.join(cwd, '.ahead');

export default async function build(mode: Configuration['mode']) {
	console.log(chalk.hex('#0099ff')('Checking directories...'));

	await checkDirs(cwd);

	console.log(chalk.hex('#0099ff')('Starting build...'));

	const routes = await getRoutes(cwd);
	const serverRoutes = await getRoutes(cwd);

	if (mode == 'production')
		console.log(chalk.hex('#6D48E8')('Compiling client & server...'));

	await compileClient(
		path.join(aheadDir, 'build'),
		path.join(root, 'lib', 'client', 'template.html'),
		mode,
	);

	await compileServer(path.join(aheadDir, 'build'), mode);

	console.log(chalk.greenBright('Build finished! 🎆'));
}
