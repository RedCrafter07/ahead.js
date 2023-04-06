import { existsSync } from 'fs';
import { copyFile, symlink } from 'fs/promises';
import path from 'path';
import { initDir } from './util/initDirs';
import chalk from 'chalk';

const neededDirs = [
	['.ahead', 'build', 'dist'],
	['.ahead', 'config'],
	['.ahead', 'build', 'pre', 'client'],
	['.ahead', 'build', 'pre', 'server'],
	['src', 'pages'],
	['src', 'server'],
	['src', 'preload'],
];

export default async function init(cwd: string) {
	await Promise.all(
		neededDirs
			.map((p) => path.join(path.join(cwd, ...p)))
			.map(async (d) => {
				await initDir(d);
			}),
	);

	await createSafeSymlink(
		path.join(cwd, 'src', 'pages'),
		path.join(cwd, '.ahead', 'build', 'pre', 'client', 'routes'),
	);

	await createSafeSymlink(
		path.join(cwd, 'src', 'server'),
		path.join(cwd, '.ahead', 'build', 'pre', 'server', 'routes'),
	);

	await createSafeSymlink(
		path.join(cwd, 'src', 'preload'),
		path.join(cwd, '.ahead', 'build', 'pre', 'server', 'preload'),
	);

	if (!(await existsSync(path.join(cwd, 'tsconfig.json'))))
		await copyFile(
			path.join(__dirname, 'default', 'tsconfig.json.txt'),
			path.join(cwd, 'tsconfig.json'),
		);
}

async function createSafeSymlink(source: string, target: string) {
	if (!(await existsSync(target))) await createSymlink(source, target);
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
