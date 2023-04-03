import path from 'path';
import compileClient from './lib/compilers/client';
import compileServer from './lib/compilers/server';
import chalk from 'chalk';
import { checkDirs } from './lib/init';
import { Configuration } from 'webpack';
import { root } from './paths';

const cwd = process.cwd();
export const aheadDir = path.join(cwd, '.ahead');

export default async function build(mode: Configuration['mode']) {
	const startPoint = Date.now();
	console.log(chalk.hex('#0099ff')('Checking directories...'));

	await checkDirs(cwd);

	console.log(chalk.hex('#0099ff')('Starting build...'));

	if (mode == 'production')
		console.log(chalk.hex('#6D48E8')('Compiling client & server...'));

	await buildAll(mode);

	console.log(
		chalk.greenBright(`Build finished in ${Date.now() - startPoint}ms.`),
	);
}

export async function buildAll(mode: Configuration['mode']) {
	if (mode == 'production') {
		await compileServer(path.join(aheadDir, 'build'), mode);
		await compileClient(
			path.join(aheadDir, 'build'),
			path.join(root, 'lib', 'client', 'template.html'),
			mode,
		);
		return;
	}
	await Promise.all([
		compileServer(path.join(aheadDir, 'build'), mode),
		compileClient(
			path.join(aheadDir, 'build'),
			path.join(root, 'lib', 'client', 'template.html'),
			mode,
		),
	]);
}
