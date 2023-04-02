import { copyFile, writeFile } from 'fs/promises';
import path from 'path';
import compileClient from './lib/compilers/client';
import { transform } from './lib/routeGeneration/client';
import getRoutes from './lib/routeGeneration/getRoutes';
import generateServerRoutes from './lib/routeGeneration/server';
import compileServer from './lib/compilers/server';
import chalk from 'chalk';
import { checkDirs } from './lib/init';

const cwd = process.cwd();
export const aheadDir = path.join(cwd, '.ahead');

export default async function build(mode: 'dev' | 'prod' = 'prod') {
	console.log(chalk.hex('#0099ff')('Checking directories...'));

	await checkDirs(cwd);

	console.log(chalk.hex('#0099ff')('Starting build...'));

	const routes = await getRoutes(cwd);
	const serverRoutes = await getRoutes(cwd);

	if (mode == 'prod')
		console.log(chalk.hex('#4F58FF')('Generating client router...'));

	await writeFile(
		path.join(path.join(aheadDir, 'build', 'pre', 'client'), 'routes.tsx'),
		`import React from "react";\n${transform(routes)}`,
	);
	if (mode == 'prod')
		console.log(chalk.hex('#4F58FF')('Generating server router...'));
	await writeFile(
		path.join(path.join(aheadDir, 'build', 'pre', 'server'), '.ssr.tsx'),
		`import React from "react";\n${transform(serverRoutes, false)}`,
	);
	if (mode == 'prod')
		console.log(chalk.hex('#4F58FF')('Writing Ahead.js files...'));
	await copyFile(
		path.join(__dirname, 'lib', 'server', 'ssrHandler.tsx.txt'),
		path.join(aheadDir, 'build', 'pre', 'server', 'ssrHandler.tsx'),
	);
	await copyFile(
		path.join(__dirname, 'lib', 'client', 'router.tsx.txt'),
		path.join(aheadDir, 'build', 'pre', 'client', 'router.tsx'),
	);
	await copyFile(
		path.join(__dirname, 'lib', 'client', 'index.tsx.txt'),
		path.join(aheadDir, 'build', 'pre', 'client', 'index.tsx'),
	);

	if (mode == 'prod')
		console.log(chalk.hex('#AF5CFE')('Generating routes for the server...'));

	await writeFile(
		path.join(aheadDir, 'build', 'pre', 'server', 'index.tsx'),
		generateServerRoutes(routes),
	);

	if (mode == 'prod') console.log(chalk.cyan('Compiling client & server...'));

	await compileClient(
		path.join(aheadDir, 'build'),
		path.join(__dirname, 'lib', 'client', 'template.html'),
	);

	await compileServer(path.join(aheadDir, 'build'));

	console.log(chalk.greenBright('Build finished! 🎆'));
}
