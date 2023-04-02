import { existsSync } from 'fs';
import { symlink } from 'fs/promises';
import path from 'path';
import initDirs, { initDir } from './util/initDirs';
import chalk from 'chalk';

const neededDirs = [
	['.ahead', 'build', 'dist'],
	['.ahead', 'config'],
	['.ahead', 'build', 'pre', 'client'],
	['.ahead', 'build', 'pre', 'server'],
	['pages'],
];

export default async function init(cwd: string) {
	await Promise.all(
		neededDirs
			.map((p) => path.join(path.join(cwd, ...p)))
			.map(async (d) => {
				await initDir(d);
			}),
	);

	if (
		!(await existsSync(
			path.join(cwd, '.ahead', 'build', 'pre', 'client', 'routes'),
		))
	)
		await createSymlink(
			path.join(cwd, 'pages'),
			path.join(cwd, '.ahead', 'build', 'pre', 'client', 'routes'),
		);
}

async function createSymlink(source: string, target: string) {
	await symlink(source, target, 'junction');
}

export async function checkDirs(cwd: string) {
	const dirsExist = await Promise.all(
		neededDirs.map(async (p) => ({
			exists: await existsSync(path.join(path.join(cwd, ...p))),
			path: path.join(path.join(cwd, ...p)),
		})),
	);

	// check if a directory doesn't exist
	if (dirsExist.filter((p) => p.exists == false).length > 0)
		throw new Error(
			chalk.red(
				"The needed directories for Ahead.js don't seem to exist. Please run 'ahead init' to create them or check if you're in the correct directory.",
			),
		);
}
